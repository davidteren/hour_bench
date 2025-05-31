import { Controller } from "@hotwired/stimulus"

// Flash message controller for dismissible notifications
export default class extends Controller {
  static values = { 
    autoDismiss: { type: Boolean, default: true },
    dismissDelay: { type: Number, default: 5000 }
  }

  connect() {
    // Auto-dismiss flash messages after delay
    if (this.autoDismissValue) {
      this.timeoutId = setTimeout(() => {
        this.dismiss()
      }, this.dismissDelayValue)
    }
  }

  disconnect() {
    // Clean up timeout if component is removed
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  dismiss() {
    // Add fade out animation
    this.element.style.transition = "all 0.3s ease"
    this.element.style.transform = "translateX(100%)"
    this.element.style.opacity = "0"
    
    // Remove element after animation
    setTimeout(() => {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element)
      }
    }, 300)
  }

  // Pause auto-dismiss on hover
  pauseAutoDismiss() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  // Resume auto-dismiss when not hovering
  resumeAutoDismiss() {
    if (this.autoDismissValue) {
      this.timeoutId = setTimeout(() => {
        this.dismiss()
      }, this.dismissDelayValue)
    }
  }
}
