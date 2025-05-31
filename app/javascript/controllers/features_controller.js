import { Controller } from "@hotwired/stimulus"

// Features showcase controller for interactive elements
export default class extends Controller {
  static targets = ["card"]

  connect() {
    // Initialize any setup needed for features showcase
  }

  highlight(event) {
    // Add subtle highlight effect when hovering over feature cards
    const card = event.currentTarget
    
    // Add a subtle scale effect
    card.style.transform = "translateY(-4px) scale(1.02)"
    
    // Reset after a short delay
    setTimeout(() => {
      card.style.transform = "translateY(-4px)"
    }, 200)
  }

  // Method to handle feature card clicks for future expansion
  selectFeature(event) {
    const card = event.currentTarget
    const featureTitle = card.querySelector('.feature-title')?.textContent
    
    // Could be used for analytics or feature tracking
    console.log(`Feature selected: ${featureTitle}`)
  }
}
