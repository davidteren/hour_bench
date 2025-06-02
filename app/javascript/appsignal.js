// AppSignal Frontend Configuration
import Appsignal from "@appsignal/javascript"

// Default configuration (will be overridden by imported config if available)
const DEFAULT_CONFIG = {
  BATCH_SIZE: 5,
  BATCH_DELAY: 10000,
  THROTTLE_DELAY: 5000,
  ENABLE_PERFORMANCE_METRICS: false,
  ENABLE_RESOURCE_TRACKING: false,
  ENABLE_WEB_VITALS: true,
  ENABLE_USER_INTERACTIONS: true,
  ENABLE_ERROR_TRACKING: true,
  isDevelopment: () => window.RAILS_ENV === 'development',
  getConfig() {
    if (this.isDevelopment()) {
      return {
        ...this,
        BATCH_SIZE: 3,
        BATCH_DELAY: 15000,
        THROTTLE_DELAY: 10000
      }
    }
    return this
  }
}

// Initialize AppSignal with configuration
export const appsignal = new Appsignal({
  key: window.APPSIGNAL_FRONTEND_KEY || "YOUR_FRONTEND_API_KEY", // Will be set via Rails
  namespace: "frontend",
  revision: window.APP_REVISION || undefined,
  // Reduce data collection frequency
  enablePerformanceMetrics: false, // Disable automatic performance metrics
  enableErrorReporting: true,
  ignoreErrors: [
    // Common browser extension errors to ignore
    /Script error/,
    /Non-Error promise rejection captured/,
    /ResizeObserver loop limit exceeded/,
    /ChunkLoadError/,
    /Loading chunk \d+ failed/,
    // Ad blocker related errors
    /blocked by client/,
    /Network request failed/
  ]
})

// Performance monitoring utilities
export class FrontendMetrics {
  constructor(appsignalInstance) {
    this.appsignal = appsignalInstance
    this.pageLoadStart = performance.now()
    this.initialized = false
    this.metricQueue = []
    this.batchTimeout = null

    // Use configuration settings (try imported config first, fallback to default)
    let configSource = DEFAULT_CONFIG
    try {
      if (typeof window.APPSIGNAL_CONFIG !== 'undefined') {
        configSource = window.APPSIGNAL_CONFIG
      }
    } catch (e) {
      console.log('Using default AppSignal config')
    }

    const config = configSource.getConfig()
    this.BATCH_SIZE = config.BATCH_SIZE
    this.BATCH_DELAY = config.BATCH_DELAY
    this.THROTTLE_DELAY = config.THROTTLE_DELAY
    this.config = config

    // Throttle tracking to reduce API calls
    this.lastTrackTime = {}

    this.setupBatchedMetrics()
  }

  // Initialize only once to prevent duplicate observers
  initialize() {
    if (this.initialized) return
    this.initialized = true
    this.setupPerformanceObserver()
  }

  // Setup batched metrics to reduce API calls
  setupBatchedMetrics() {
    // Process batched metrics every BATCH_DELAY milliseconds
    setInterval(() => {
      this.processBatch()
    }, this.BATCH_DELAY)
  }

  // Process and send batched metrics
  processBatch() {
    if (this.metricQueue.length === 0) return

    // Take up to BATCH_SIZE metrics from queue
    const batch = this.metricQueue.splice(0, this.BATCH_SIZE)

    // Send each metric in the batch
    batch.forEach(metric => {
      this.sendMetric(metric)
    })
  }

  // Track page load performance
  trackPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.pageLoadStart
      this.trackCustomMetric('page_load_time', loadTime, 'distribution')

      // Initialize performance observers only after page load
      this.initialize()
    })
  }

  // Track Core Web Vitals
  trackWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.trackCustomMetric('lcp', lastEntry.startTime, 'distribution')
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.trackCustomMetric('fid', entry.processingStart - entry.startTime, 'distribution')
      }
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      this.trackCustomMetric('cls', clsValue, 'gauge')
    }).observe({ entryTypes: ['layout-shift'] })
  }

  // Setup performance observer for navigation timing (reduced frequency)
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Track navigation timing (only once per page)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.trackNavigationMetrics(entry)
          }
        }
      }).observe({ entryTypes: ['navigation'] })

      // Disable resource timing observer to reduce API calls
      // Only track critical resources on page load instead
      this.trackCriticalResourcesOnce()
    }
  }

  // Track critical resources only once per page load
  trackCriticalResourcesOnce() {
    setTimeout(() => {
      const resources = performance.getEntriesByType('resource')
      const criticalResources = resources.filter(entry => {
        const criticalTypes = ['.css', '.js']
        return criticalTypes.some(ext => entry.name.includes(ext)) && entry.duration > 100
      })

      // Only track the slowest critical resources
      criticalResources
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 3) // Only top 3 slowest
        .forEach(entry => this.trackResourceMetrics(entry))
    }, 2000) // Wait 2 seconds after page load
  }

  // Track navigation-specific metrics
  trackNavigationMetrics(entry) {
    const metrics = {
      dns_lookup: entry.domainLookupEnd - entry.domainLookupStart,
      tcp_connect: entry.connectEnd - entry.connectStart,
      ssl_handshake: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
      ttfb: entry.responseStart - entry.requestStart,
      dom_content_loaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      dom_complete: entry.domComplete - entry.navigationStart,
      load_complete: entry.loadEventEnd - entry.loadEventStart
    }

    Object.entries(metrics).forEach(([name, value]) => {
      if (value > 0) {
        this.trackCustomMetric(`navigation_${name}`, value, 'distribution')
      }
    })
  }

  // Track resource loading metrics
  trackResourceMetrics(entry) {
    // Only track critical resources to avoid noise
    const criticalResources = ['.css', '.js', '.woff', '.woff2']
    const isCritical = criticalResources.some(ext => entry.name.includes(ext))
    
    if (isCritical && entry.duration > 0) {
      const resourceType = this.getResourceType(entry.name)
      this.trackCustomMetric(`resource_load_${resourceType}`, entry.duration, 'distribution')
    }
  }

  // Get resource type from URL
  getResourceType(url) {
    if (url.includes('.css')) return 'css'
    if (url.includes('.js')) return 'js'
    if (url.includes('.woff') || url.includes('.woff2')) return 'font'
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) return 'image'
    return 'other'
  }

  // Track custom metrics with throttling and batching
  trackCustomMetric(name, value, type = 'gauge', tags = {}) {
    // Throttle similar metrics to reduce API calls
    const metricKey = `${name}_${type}`
    const now = Date.now()

    if (this.lastTrackTime[metricKey] &&
        (now - this.lastTrackTime[metricKey]) < this.THROTTLE_DELAY) {
      return // Skip if too soon since last similar metric
    }

    this.lastTrackTime[metricKey] = now

    // Add to batch queue instead of sending immediately
    const metric = {
      name,
      value,
      type,
      tags: {
        metric_type: type,
        metric_name: name,
        page_url: window.location.pathname,
        user_agent: navigator.userAgent.substring(0, 100),
        ...tags
      },
      timestamp: now
    }

    this.metricQueue.push(metric)

    // If queue is full, process immediately
    if (this.metricQueue.length >= this.BATCH_SIZE) {
      this.processBatch()
    }
  }

  // Send individual metric (used by batch processor)
  sendMetric(metric) {
    try {
      const span = this.appsignal.createSpan()
      span.setAction(`frontend_metric_${metric.name}`)
      span.setNamespace('frontend_metrics')
      span.setTags(metric.tags)
      span.setParams({
        metric_value: metric.value,
        timestamp: metric.timestamp
      })

      this.appsignal.send(span)
    } catch (error) {
      console.warn('Failed to send metric:', error)
    }
  }

  // Track user interactions
  trackUserInteraction(action, element, additionalData = {}) {
    this.trackCustomMetric('user_interaction', 1, 'counter', {
      action,
      element_type: element?.tagName?.toLowerCase() || 'unknown',
      element_id: element?.id || '',
      element_class: element?.className || '',
      ...additionalData
    })
  }

  // Track AJAX requests
  trackAjaxRequest(url, method, duration, status) {
    this.trackCustomMetric('ajax_request', duration, 'distribution', {
      url: url.replace(/\/\d+/g, '/:id'), // Normalize URLs with IDs
      method: method.toUpperCase(),
      status_code: status.toString(),
      status_class: Math.floor(status / 100) + 'xx'
    })
  }

  // Track JavaScript errors with context
  trackError(error, context = {}) {
    this.appsignal.sendError(error, (span) => {
      span.setTags({
        page_url: window.location.pathname,
        user_agent: navigator.userAgent.substring(0, 100),
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        ...context
      })
      span.setParams({
        timestamp: Date.now(),
        stack_trace: error.stack
      })
      return span
    })
  }

  // Track form submissions
  trackFormSubmission(formElement, success = true, errors = []) {
    const formId = formElement.id || formElement.className || 'unknown'
    this.trackCustomMetric('form_submission', 1, 'counter', {
      form_id: formId,
      success: success.toString(),
      error_count: errors.length.toString()
    })

    if (!success && errors.length > 0) {
      errors.forEach(error => {
        this.trackCustomMetric('form_error', 1, 'counter', {
          form_id: formId,
          error_type: error.type || 'unknown',
          field_name: error.field || 'unknown'
        })
      })
    }
  }
}

// Initialize metrics tracking
export const frontendMetrics = new FrontendMetrics(appsignal)

// Expose to window for debugging
window.appsignal = appsignal
window.frontendMetrics = frontendMetrics

// Auto-track page loads
frontendMetrics.trackPageLoad()

console.log("🎯 AppSignal Frontend Monitoring initialized")