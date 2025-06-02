// AppSignal API Call Monitor
// Run this in browser console to monitor API call frequency

class AppSignalMonitor {
  constructor() {
    this.apiCalls = []
    this.startTime = Date.now()
    this.originalFetch = window.fetch
    this.setupMonitoring()
  }

  setupMonitoring() {
    // Intercept fetch calls to AppSignal
    window.fetch = (...args) => {
      const url = args[0]
      
      if (typeof url === 'string' && url.includes('appsignal')) {
        this.logApiCall(url)
      }
      
      return this.originalFetch.apply(window, args)
    }
    
    console.log('🔍 AppSignal API monitoring started')
  }

  logApiCall(url) {
    const call = {
      url,
      timestamp: Date.now(),
      timeFromStart: Date.now() - this.startTime
    }
    
    this.apiCalls.push(call)
    console.log(`📡 AppSignal API call #${this.apiCalls.length}:`, call)
  }

  getStats() {
    const now = Date.now()
    const totalTime = now - this.startTime
    const callsPerMinute = (this.apiCalls.length / totalTime) * 60000
    
    return {
      totalCalls: this.apiCalls.length,
      totalTimeMs: totalTime,
      callsPerMinute: Math.round(callsPerMinute * 100) / 100,
      averageInterval: totalTime / this.apiCalls.length,
      recentCalls: this.apiCalls.slice(-10)
    }
  }

  printStats() {
    const stats = this.getStats()
    console.log('📊 AppSignal API Call Statistics:')
    console.log(`Total calls: ${stats.totalCalls}`)
    console.log(`Calls per minute: ${stats.callsPerMinute}`)
    console.log(`Average interval: ${Math.round(stats.averageInterval)}ms`)
    console.log('Recent calls:', stats.recentCalls)
  }

  reset() {
    this.apiCalls = []
    this.startTime = Date.now()
    console.log('🔄 AppSignal monitor reset')
  }

  stop() {
    window.fetch = this.originalFetch
    console.log('⏹️ AppSignal monitoring stopped')
  }
}

// Auto-start monitoring
const monitor = new AppSignalMonitor()

// Add to window for easy access
window.appSignalMonitor = monitor

// Print stats every 30 seconds
setInterval(() => {
  monitor.printStats()
}, 30000)

console.log('Use window.appSignalMonitor.printStats() to see current statistics')
console.log('Use window.appSignalMonitor.reset() to reset counters')
console.log('Use window.appSignalMonitor.stop() to stop monitoring')
