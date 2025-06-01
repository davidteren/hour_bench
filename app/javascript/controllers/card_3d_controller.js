import { Controller } from "@hotwired/stimulus"

// 3D card hover effect controller
export default class extends Controller {
  static targets = ["card"]
  
  connect() {
    this.maxRotation = 15 // Maximum rotation in degrees
    this.perspective = 1000
    this.scale = 1.05
    
    // Set initial styles
    this.element.style.perspective = `${this.perspective}px`
    this.cardTarget.style.transition = 'transform 0.1s ease-out'
    this.cardTarget.style.transformStyle = 'preserve-3d'
  }
  
  handleMouseMove(event) {
    const rect = this.element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Calculate mouse position relative to card center
    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY
    
    // Calculate rotation angles
    const rotateX = (mouseY / (rect.height / 2)) * -this.maxRotation
    const rotateY = (mouseX / (rect.width / 2)) * this.maxRotation
    
    // Apply 3D transform
    this.cardTarget.style.transform = `
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale(${this.scale})
    `
    
    // Add subtle glow effect
    this.addGlowEffect(mouseX, mouseY, rect)
  }
  
  handleMouseLeave() {
    // Reset transform
    this.cardTarget.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
    
    // Remove glow effect
    this.removeGlowEffect()
  }
  
  addGlowEffect(mouseX, mouseY, rect) {
    // Create or update glow overlay
    let glow = this.element.querySelector('.card-glow')
    if (!glow) {
      glow = document.createElement('div')
      glow.className = 'card-glow'
      glow.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: radial-gradient(
          circle at ${((mouseX + rect.width / 2) / rect.width) * 100}% ${((mouseY + rect.height / 2) / rect.height) * 100}%,
          rgba(99, 102, 241, 0.1) 0%,
          transparent 50%
        );
      `
      this.cardTarget.appendChild(glow)
    }
    
    // Update glow position
    glow.style.background = `radial-gradient(
      circle at ${((mouseX + rect.width / 2) / rect.width) * 100}% ${((mouseY + rect.height / 2) / rect.height) * 100}%,
      rgba(99, 102, 241, 0.15) 0%,
      transparent 50%
    )`
    glow.style.opacity = '1'
  }
  
  removeGlowEffect() {
    const glow = this.element.querySelector('.card-glow')
    if (glow) {
      glow.style.opacity = '0'
      setTimeout(() => {
        if (glow.parentNode) {
          glow.parentNode.removeChild(glow)
        }
      }, 300)
    }
  }
}
