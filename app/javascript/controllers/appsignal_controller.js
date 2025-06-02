import { Controller } from "@hotwired/stimulus"
import { appsignal, frontendMetrics } from "appsignal"

// AppSignal monitoring controller for automatic tracking
export default class extends Controller {
  static targets = ["form", "button", "link"]
  static values = { 
    trackClicks: { type: Boolean, default: true },
    trackForms: { type: Boolean, default: true },
    trackPageViews: { type: Boolean, default: true }
  }

  connect() {
    console.log("🔍 AppSignal monitoring controller connected")

    // Prevent duplicate initialization on Turbo navigation
    if (window.appSignalInitialized) {
      return
    }
    window.appSignalInitialized = true

    if (this.trackPageViewsValue) {
      this.trackPageView()
    }

    this.setupGlobalErrorHandling()
    this.setupAjaxTracking()
    this.setupUnloadTracking()
  }

  // Track page views
  trackPageView() {
    frontendMetrics.trackCustomMetric('page_view', 1, 'counter', {
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer || 'direct'
    })
  }

  // Setup global error handling
  setupGlobalErrorHandling() {
    // Track unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      frontendMetrics.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error_type: 'javascript_error'
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(event.reason)
      frontendMetrics.trackError(error, {
        error_type: 'unhandled_promise_rejection'
      })
    })
  }

  // Setup AJAX request tracking
  setupAjaxTracking() {
    // Track Turbo requests
    document.addEventListener('turbo:before-fetch-request', (event) => {
      event.detail.fetchOptions.startTime = performance.now()
    })

    document.addEventListener('turbo:before-fetch-response', (event) => {
      const startTime = event.detail.fetchOptions.startTime
      if (startTime) {
        const duration = performance.now() - startTime
        const url = event.detail.fetchResponse.url
        const status = event.detail.fetchResponse.status
        
        frontendMetrics.trackAjaxRequest(url, 'GET', duration, status)
      }
    })

    // Track regular fetch requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      const url = args[0]
      const options = args[1] || {}
      
      try {
        const response = await originalFetch(...args)
        const duration = performance.now() - startTime
        
        frontendMetrics.trackAjaxRequest(
          url, 
          options.method || 'GET', 
          duration, 
          response.status
        )
        
        return response
      } catch (error) {
        const duration = performance.now() - startTime
        frontendMetrics.trackAjaxRequest(url, options.method || 'GET', duration, 0)
        frontendMetrics.trackError(error, { request_url: url })
        throw error
      }
    }
  }

  // Setup page unload tracking for session duration
  setupUnloadTracking() {
    const sessionStart = performance.now()
    
    window.addEventListener('beforeunload', () => {
      const sessionDuration = performance.now() - sessionStart
      frontendMetrics.trackCustomMetric('session_duration', sessionDuration, 'distribution')
    })
  }

  // Track button clicks
  buttonTargetConnected(element) {
    if (this.trackClicksValue) {
      element.addEventListener('click', (event) => {
        frontendMetrics.trackUserInteraction('button_click', element, {
          button_text: element.textContent.trim().substring(0, 50),
          button_type: element.type || 'button'
        })
      })
    }
  }

  // Track link clicks
  linkTargetConnected(element) {
    if (this.trackClicksValue) {
      element.addEventListener('click', (event) => {
        frontendMetrics.trackUserInteraction('link_click', element, {
          link_text: element.textContent.trim().substring(0, 50),
          link_href: element.href || '',
          is_external: element.hostname !== window.location.hostname
        })
      })
    }
  }

  // Track form submissions
  formTargetConnected(element) {
    if (this.trackFormsValue) {
      element.addEventListener('submit', (event) => {
        const formData = new FormData(element)
        const fieldCount = Array.from(formData.keys()).length
        
        frontendMetrics.trackCustomMetric('form_attempt', 1, 'counter', {
          form_action: element.action || window.location.pathname,
          form_method: element.method || 'GET',
          field_count: fieldCount.toString()
        })
      })

      // Track form validation errors
      element.addEventListener('invalid', (event) => {
        frontendMetrics.trackCustomMetric('form_validation_error', 1, 'counter', {
          field_name: event.target.name || 'unknown',
          field_type: event.target.type || 'unknown',
          validation_message: event.target.validationMessage || 'unknown'
        })
      }, true)
    }
  }

  // Manual tracking methods that can be called from other controllers
  trackCustomEvent(eventName, data = {}) {
    frontendMetrics.trackCustomMetric(eventName, 1, 'counter', data)
  }

  trackPerformanceMetric(metricName, value, tags = {}) {
    frontendMetrics.trackCustomMetric(metricName, value, 'distribution', tags)
  }

  trackError(error, context = {}) {
    frontendMetrics.trackError(error, context)
  }
}