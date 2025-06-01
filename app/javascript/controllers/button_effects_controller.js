import { Controller } from "@hotwired/stimulus"

// Button effects controller for enhanced interactions
export default class extends Controller {
  
  glow(event) {
    const button = event.currentTarget
    
    // Add glow effect
    button.style.transition = 'all 0.3s ease'
    button.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.6), 0 0 40px rgba(99, 102, 241, 0.4)'
    button.style.transform = 'translateY(-2px) scale(1.05)'
    
    // Create ripple effect
    this.createRipple(event, button)
  }
  
  unglow(event) {
    const button = event.currentTarget
    
    // Remove glow effect
    button.style.boxShadow = 'none'
    button.style.transform = 'translateY(0) scale(1)'
  }
  
  createRipple(event, button) {
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const ripple = document.createElement('div')
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: translate(-50%, -50%);
      animation: buttonRipple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `
    
    button.style.position = 'relative'
    button.style.overflow = 'hidden'
    button.appendChild(ripple)
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
    }, 600)
  }
}
