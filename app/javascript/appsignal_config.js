// AppSignal Frontend Monitoring Configuration
// Adjust these settings to control API call frequency

export const APPSIGNAL_CONFIG = {
  // Batching settings
  BATCH_SIZE: 5,           // Number of metrics to batch together
  BATCH_DELAY: 10000,      // Delay between batch sends (10 seconds)
  
  // Throttling settings
  THROTTLE_DELAY: 5000,    // Minimum time between similar metrics (5 seconds)
  
  // Feature toggles
  ENABLE_PERFORMANCE_METRICS: false,  // Disable automatic performance metrics
  ENABLE_RESOURCE_TRACKING: false,    // Disable resource timing tracking
  ENABLE_WEB_VITALS: true,            // Keep Core Web Vitals
  ENABLE_USER_INTERACTIONS: true,     // Track clicks, forms, etc.
  ENABLE_ERROR_TRACKING: true,        // Track JavaScript errors
  
  // Resource tracking filters (when enabled)
  CRITICAL_RESOURCE_TYPES: ['.css', '.js'],
  MAX_RESOURCES_TO_TRACK: 3,
  MIN_RESOURCE_DURATION: 100, // Only track resources slower than 100ms
  
  // Error filtering
  IGNORE_ERROR_PATTERNS: [
    /Script error/,
    /Non-Error promise rejection captured/,
    /ResizeObserver loop limit exceeded/,
    /ChunkLoadError/,
    /Loading chunk \d+ failed/,
    /blocked by client/,
    /Network request failed/
  ],
  
  // Development vs Production settings
  isDevelopment: () => window.RAILS_ENV === 'development',
  
  // Get environment-specific config
  getConfig() {
    if (this.isDevelopment()) {
      return {
        ...this,
        BATCH_SIZE: 3,
        BATCH_DELAY: 15000,     // Longer delays in development
        THROTTLE_DELAY: 10000,  // More aggressive throttling
        ENABLE_PERFORMANCE_METRICS: false,
        ENABLE_RESOURCE_TRACKING: false
      }
    }
    return this
  }
}
