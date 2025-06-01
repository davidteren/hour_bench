import { Controller } from "@hotwired/stimulus"

// Feature tabs controller for filtering features
export default class extends Controller {
  static targets = ["tab", "grid"]
  
  connect() {
    this.activeCategory = 'all'
    this.setupInitialState()
  }
  
  setupInitialState() {
    // Ensure the first tab is active
    this.tabTargets.forEach(tab => {
      if (tab.dataset.category === 'all') {
        tab.classList.add('active')
      } else {
        tab.classList.remove('active')
      }
    })
  }
  
  switchTab(event) {
    const clickedTab = event.currentTarget
    const category = clickedTab.dataset.category
    
    // Don't do anything if clicking the already active tab
    if (category === this.activeCategory) return
    
    // Update active tab
    this.tabTargets.forEach(tab => {
      tab.classList.remove('active')
    })
    clickedTab.classList.add('active')
    
    // Filter features
    this.filterFeatures(category)
    this.activeCategory = category
  }
  
  filterFeatures(category) {
    const cards = this.gridTarget.querySelectorAll('.feature-card')
    
    // First, fade out all cards
    cards.forEach(card => {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
      card.style.opacity = '0'
      card.style.transform = 'translateY(20px)'
    })
    
    // After fade out, show/hide cards and animate in
    setTimeout(() => {
      cards.forEach((card, index) => {
        const cardCategory = card.dataset.category
        const shouldShow = category === 'all' || cardCategory === category
        
        if (shouldShow) {
          card.style.display = 'block'
          // Stagger the animation
          setTimeout(() => {
            card.style.opacity = '1'
            card.style.transform = 'translateY(0)'
          }, index * 100)
        } else {
          card.style.display = 'none'
        }
      })
      
      // Update grid layout
      this.updateGridLayout()
    }, 300)
  }
  
  updateGridLayout() {
    // Force a reflow to ensure proper grid layout
    this.gridTarget.style.display = 'none'
    this.gridTarget.offsetHeight // Trigger reflow
    this.gridTarget.style.display = 'grid'
  }
}
