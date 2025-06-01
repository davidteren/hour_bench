// AppSignal Frontend Configuration
import Appsignal from "@appsignal/javascript"

// Initialize AppSignal with configuration
export const appsignal = new Appsignal({
  key: window.APPSIGNAL_FRONTEND_KEY || "YOUR_FRONTEND_API_KEY", // Will be set via Rails
  namespace: "frontend",
  revision: window.APP_REVISION || undefined,
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
    this.setupPerformanceObserver()
  }

  // Track page load performance
  trackPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.pageLoadStart
      this.trackCustomMetric('page_load_time', loadTime, 'distribution')
      
      // Track Core Web Vitals if available
      this.trackWebVitals()
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

  // Setup performance observer for navigation timing
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Track navigation timing
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.trackNavigationMetrics(entry)
          }
        }
      }).observe({ entryTypes: ['navigation'] })

      // Track resource timing for critical resources
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.trackResourceMetrics(entry)
        }
      }).observe({ entryTypes: ['resource'] })
    }
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

  // Track custom metrics with different types
  trackCustomMetric(name, value, type = 'gauge', tags = {}) {
    try {
      const span = this.appsignal.createSpan()
      span.setAction(`frontend_metric_${name}`)
      span.setNamespace('frontend_metrics')
      span.setTags({
        metric_type: type,
        metric_name: name,
        page_url: window.location.pathname,
        user_agent: navigator.userAgent.substring(0, 100),
        ...tags
      })
      span.setParams({
        metric_value: value,
        timestamp: Date.now()
      })
      
      this.appsignal.send(span)
    } catch (error) {
      console.warn('Failed to track custom metric:', error)
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

// Auto-track page loads
frontendMetrics.trackPageLoad()

console.log("🎯 AppSignal Frontend Monitoring initialized")