import { Controller } from "@hotwired/stimulus"
import { frontendMetrics } from "appsignal"

// Animated stats counter controller with AppSignal metrics
export default class extends Controller {
  static targets = ["counter"]
  static values = { 
    duration: { type: Number, default: 2000 },
    startDelay: { type: Number, default: 500 }
  }
  
  connect() {
    this.hasAnimated = false
    this.setupIntersectionObserver()
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
    this.cancelAnimations()
  }
  
  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true
          this.startCounters()
        }
      })
    }, {
      threshold: 0.5
    })
    
    this.observer.observe(this.element)
  }
  
  startCounters() {
    // Track stats counter engagement
    frontendMetrics.trackCustomMetric('stats_counter_viewed', 1, 'counter', {
      counter_count: this.counterTargets.length,
      page_url: window.location.pathname
    })
    
    setTimeout(() => {
      this.counterTargets.forEach((counter, index) => {
        this.animateCounter(counter, index * 200)
      })
    }, this.startDelayValue)
  }
  
  animateCounter(counter, delay) {
    const endValue = parseInt(counter.dataset.statsCounterEndValue) || 0
    const startValue = 0
    const duration = this.durationValue
    
    setTimeout(() => {
      const startTime = performance.now()
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
        
        // Format the number with commas for large numbers
        counter.textContent = this.formatNumber(currentValue)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Ensure we end with the exact target value
          counter.textContent = this.formatNumber(endValue)
          this.addCompletionEffect(counter)
          
          // Track animation completion performance
          frontendMetrics.trackCustomMetric('stats_counter_animation_time', elapsed, 'distribution', {
            target_value: endValue,
            animation_delay: delay
          })
        }
      }
      
      requestAnimationFrame(animate)
    }, delay)
  }
  
  formatNumber(num) {
    if (num >= 1000) {
      return num.toLocaleString()
    }
    return num.toString()
  }
  
  addCompletionEffect(counter) {
    // Add a subtle glow effect when animation completes
    counter.style.transition = 'text-shadow 0.3s ease'
    counter.style.textShadow = '0 0 10px rgba(99, 102, 241, 0.5)'
    
    setTimeout(() => {
      counter.style.textShadow = 'none'
    }, 1000)
  }
  
  cancelAnimations() {
    // Cancel any ongoing animations if component is disconnected
    this.counterTargets.forEach(counter => {
      counter.style.transition = 'none'
      counter.style.textShadow = 'none'
    })
  }
}
