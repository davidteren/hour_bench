import { Controller } from "@hotwired/stimulus"

// Intersection observer controller for scroll animations
export default class extends Controller {
  static targets = ["element"]
  static values = { 
    threshold: { type: Number, default: 0.1 },
    rootMargin: { type: String, default: "0px 0px -50px 0px" }
  }
  
  connect() {
    this.setupObserver()
    this.animatedElements = new Set()
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
  
  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.animateElement(entry.target)
          this.animatedElements.add(entry.target)
        }
      })
    }, {
      threshold: this.thresholdValue,
      rootMargin: this.rootMarginValue
    })
    
    // Observe all target elements
    this.elementTargets.forEach(element => {
      this.observer.observe(element)
      // Set initial state
      this.setInitialState(element)
    })
  }
  
  setInitialState(element) {
    // Set initial animation state based on element type
    if (element.classList.contains('section-header')) {
      element.style.opacity = '0'
      element.style.transform = 'translateY(30px)'
    } else if (element.classList.contains('feature-tabs')) {
      element.style.opacity = '0'
      element.style.transform = 'translateY(20px)'
    } else if (element.classList.contains('features-grid')) {
      element.style.opacity = '0'
      // Set initial state for individual cards
      const cards = element.querySelectorAll('.feature-card')
      cards.forEach((card, index) => {
        card.style.opacity = '0'
        card.style.transform = 'translateY(40px)'
      })
    } else {
      // Default animation
      element.style.opacity = '0'
      element.style.transform = 'translateY(20px)'
    }
    
    // Set transition
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
  }
  
  animateElement(element) {
    if (element.classList.contains('section-header')) {
      this.animateSectionHeader(element)
    } else if (element.classList.contains('feature-tabs')) {
      this.animateFeatureTabs(element)
    } else if (element.classList.contains('features-grid')) {
      this.animateFeaturesGrid(element)
    } else {
      // Default animation
      element.style.opacity = '1'
      element.style.transform = 'translateY(0)'
    }
  }
  
  animateSectionHeader(element) {
    element.style.opacity = '1'
    element.style.transform = 'translateY(0)'
    
    // Animate child elements with stagger
    const children = element.querySelectorAll('.section-badge, .section-title, .section-subtitle')
    children.forEach((child, index) => {
      child.style.opacity = '0'
      child.style.transform = 'translateY(20px)'
      child.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
      
      setTimeout(() => {
        child.style.opacity = '1'
        child.style.transform = 'translateY(0)'
      }, index * 200)
    })
  }
  
  animateFeatureTabs(element) {
    element.style.opacity = '1'
    element.style.transform = 'translateY(0)'
    
    // Animate individual tabs
    const tabs = element.querySelectorAll('.tab-button')
    tabs.forEach((tab, index) => {
      tab.style.opacity = '0'
      tab.style.transform = 'translateX(-20px)'
      tab.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
      
      setTimeout(() => {
        tab.style.opacity = '1'
        tab.style.transform = 'translateX(0)'
      }, index * 100)
    })
  }
  
  animateFeaturesGrid(element) {
    element.style.opacity = '1'
    
    // Animate individual feature cards
    const cards = element.querySelectorAll('.feature-card')
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
        
        // Add a subtle bounce effect
        setTimeout(() => {
          card.style.transform = 'translateY(-5px)'
          setTimeout(() => {
            card.style.transform = 'translateY(0)'
          }, 150)
        }, 300)
      }, index * 150)
    })
  }
}
