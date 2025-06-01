import { Controller } from "@hotwired/stimulus"

// Enhanced features showcase controller
export default class extends Controller {
  static targets = ["card", "modal", "modalTitle", "modalBody"]
  
  connect() {
    this.setupCardAnimations()
  }
  
  setupCardAnimations() {
    this.cardTargets.forEach((card, index) => {
      // Set initial state
      card.style.opacity = '0'
      card.style.transform = 'translateY(20px)'
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      
      // Stagger the initial animation
      setTimeout(() => {
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
      }, index * 100)
    })
  }
  
  highlight(event) {
    const card = event.currentTarget
    const index = parseInt(card.dataset.index)
    
    // Add highlight class for CSS animations
    card.classList.add('highlighted')
    
    // Create ripple effect
    this.createRippleEffect(event, card)
    
    // Animate other cards to fade slightly
    this.cardTargets.forEach((otherCard, otherIndex) => {
      if (otherIndex !== index) {
        otherCard.style.opacity = '0.7'
        otherCard.style.transform = 'scale(0.98)'
      }
    })
  }
  
  unhighlight(event) {
    const card = event.currentTarget
    
    // Remove highlight class
    card.classList.remove('highlighted')
    
    // Reset all cards
    this.cardTargets.forEach(otherCard => {
      otherCard.style.opacity = '1'
      otherCard.style.transform = 'scale(1)'
    })
  }
  
  createRippleEffect(event, card) {
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const ripple = document.createElement('div')
    ripple.className = 'card-ripple'
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.3);
      transform: translate(-50%, -50%);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `
    
    card.appendChild(ripple)
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
    }, 600)
  }
  
  showDetails(event) {
    event.preventDefault()
    event.stopPropagation()
    
    const card = event.currentTarget
    const index = parseInt(card.dataset.index)
    const title = card.querySelector('.feature-title').textContent
    const description = card.querySelector('.feature-description').textContent
    
    // Update modal content
    this.modalTitleTarget.textContent = title
    this.modalBodyTarget.innerHTML = this.generateModalContent(card, index)
    
    // Show modal
    this.modalTarget.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    
    // Animate modal in
    setTimeout(() => {
      this.modalTarget.classList.add('show')
    }, 10)
  }
  
  generateModalContent(card, index) {
    const benefits = Array.from(card.querySelectorAll('.benefit-text')).map(el => el.textContent)
    const description = card.querySelector('.feature-description').textContent
    
    return `
      <div class="modal-feature-content">
        <p class="modal-description">${description}</p>
        
        <div class="modal-benefits">
          <h4>Key Benefits:</h4>
          <ul class="benefits-list">
            ${benefits.map(benefit => `<li class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span class="benefit-text">${benefit}</span>
            </li>`).join('')}
          </ul>
        </div>
        
        <div class="modal-demo">
          <h4>Try It Now:</h4>
          <div class="demo-preview">
            <div class="demo-placeholder">
              <div class="demo-icon">🚀</div>
              <p>Interactive demo coming soon!</p>
              <button class="btn btn-primary">Launch Demo</button>
            </div>
          </div>
        </div>
        
        <div class="modal-stats">
          <div class="stat-grid">
            <div class="stat-item">
              <span class="stat-number">${Math.floor(Math.random() * 20) + 80}%</span>
              <span class="stat-label">User Satisfaction</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${Math.floor(Math.random() * 50) + 150}%</span>
              <span class="stat-label">Productivity Increase</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${Math.floor(Math.random() * 30) + 70}%</span>
              <span class="stat-label">Time Saved</span>
            </div>
          </div>
        </div>
      </div>
    `
  }
  
  showDemo(event) {
    event.stopPropagation()
    const feature = event.currentTarget.dataset.feature
    
    // Create demo notification
    this.showNotification(`🚀 Launching ${feature} demo...`, 'info')
    
    // Simulate demo launch
    setTimeout(() => {
      this.showNotification(`✨ ${feature} demo is ready!`, 'success')
    }, 1500)
  }
  
  closeModal() {
    // Close the modal
    this.modalTarget.classList.remove('show')
    
    // Hide after animation
    setTimeout(() => {
      this.modalTarget.classList.add('hidden')
      document.body.style.overflow = ''
    }, 300)
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `
    
    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)'
    } else {
      notification.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    }
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }
}
