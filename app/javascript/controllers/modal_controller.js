import { Controller } from "@hotwired/stimulus"

// Modal controller for feature details and video demos
export default class extends Controller {
  static values = { target: String }
  static targets = ["modal"]
  
  connect() {
    this.boundEscapeHandler = this.handleEscape.bind(this)
  }
  
  disconnect() {
    // Clean up event listeners
    if (this.boundEscapeHandler) {
      document.removeEventListener('keydown', this.boundEscapeHandler)
    }
    // Restore body scroll
    document.body.style.overflow = ''
  }
  
  open(event) {
    if (event) {
      event.preventDefault()
    }
    
    let modal
    if (this.targetValue) {
      modal = document.querySelector(this.targetValue)
    } else {
      // Look for modal within this element or as a sibling
      modal = this.element.closest('.feature-modal') || 
              this.element.querySelector('.feature-modal') ||
              this.element.querySelector('.video-modal') ||
              document.querySelector('.feature-modal') ||
              document.querySelector('.video-modal')
    }
    
    if (modal) {
      this.showModal(modal)
    } else {
      console.warn('Modal not found. Target value:', this.targetValue)
    }
  }
  
  close(event) {
    if (event) {
      event.preventDefault()
    }
    
    // Find the modal to close
    let modal
    if (event && event.currentTarget) {
      modal = event.currentTarget.closest('.feature-modal') || 
              event.currentTarget.closest('.video-modal')
    }
    
    if (!modal) {
      modal = document.querySelector('.feature-modal:not(.hidden)') ||
              document.querySelector('.video-modal:not(.hidden)')
    }
    
    if (modal) {
      this.hideModal(modal)
    }
  }
  
  showModal(modal) {
    // Show modal
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    
    // Animate in
    setTimeout(() => {
      modal.classList.add('show')
    }, 10)
    
    // Setup escape key listener
    document.addEventListener('keydown', this.boundEscapeHandler)
  }
  
  hideModal(modal) {
    // Animate out
    modal.classList.remove('show')
    
    // Hide after animation
    setTimeout(() => {
      modal.classList.add('hidden')
      document.body.style.overflow = ''
    }, 300)
    
    // Remove escape key listener
    document.removeEventListener('keydown', this.boundEscapeHandler)
  }
  
  handleEscape(event) {
    if (event.key === 'Escape') {
      const openModal = document.querySelector('.feature-modal:not(.hidden)') ||
                        document.querySelector('.video-modal:not(.hidden)')
      if (openModal) {
        this.hideModal(openModal)
      }
    }
  }
}
