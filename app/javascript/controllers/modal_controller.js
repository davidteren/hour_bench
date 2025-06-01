import { Controller } from "@hotwired/stimulus"

// Modal controller for feature details and video demos
export default class extends Controller {
  static values = { target: String }
  
  open(event) {
    event.preventDefault()
    
    let modal
    if (this.targetValue) {
      modal = document.querySelector(this.targetValue)
    } else {
      modal = this.element.closest('.feature-modal') || this.element.querySelector('.feature-modal')
    }
    
    if (modal) {
      this.showModal(modal)
    }
  }
  
  close(event) {
    if (event) {
      event.preventDefault()
    }
    
    const modal = event.currentTarget.closest('.feature-modal') || 
                  document.querySelector('.feature-modal:not(.hidden)')
    
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
    this.boundEscapeHandler = this.handleEscape.bind(this)
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
    if (this.boundEscapeHandler) {
      document.removeEventListener('keydown', this.boundEscapeHandler)
    }
  }
  
  handleEscape(event) {
    if (event.key === 'Escape') {
      const openModal = document.querySelector('.feature-modal:not(.hidden)')
      if (openModal) {
        this.hideModal(openModal)
      }
    }
  }
}
