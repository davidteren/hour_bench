import { Controller } from "@hotwired/stimulus"

// Mobile navigation controller handles responsive hamburger menu
export default class extends Controller {
  static targets = ["menu"]

  connect() {
    // Set initial state
    this.isOpen = false
    
    // Bind event handlers
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    this.boundHandleResize = this.handleResize.bind(this)
    
    // Listen for window resize to close menu on desktop
    window.addEventListener('resize', this.boundHandleResize)
  }

  disconnect() {
    // Clean up event listeners
    window.removeEventListener('resize', this.boundHandleResize)
    document.removeEventListener('keydown', this.boundHandleKeydown)
    
    // Restore body scroll
    document.body.style.overflow = ''
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.isOpen = true
    this.updateMenuVisibility()
    this.setupEventListeners()
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden'
  }

  close() {
    this.isOpen = false
    this.updateMenuVisibility()
    this.cleanupEventListeners()
    
    // Restore body scroll
    document.body.style.overflow = ''
  }

  updateMenuVisibility() {
    const menu = document.querySelector('.mobile-menu')
    const menuIcon = document.querySelector('#mobile-menu-icon')
    const closeIcon = document.querySelector('#mobile-menu-close')

    if (menu) {
      if (this.isOpen) {
        menu.classList.remove('hidden')
      } else {
        menu.classList.add('hidden')
      }
    }

    if (menuIcon && closeIcon) {
      if (this.isOpen) {
        menuIcon.classList.add('hidden')
        closeIcon.classList.remove('hidden')
      } else {
        menuIcon.classList.remove('hidden')
        closeIcon.classList.add('hidden')
      }
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.boundHandleKeydown)
  }

  cleanupEventListeners() {
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }

  handleKeydown(event) {
    if (event.key === 'Escape' && this.isOpen) {
      this.close()
    }
  }

  handleResize() {
    // Close menu when switching to desktop view
    if (window.innerWidth >= 768 && this.isOpen) {
      this.close()
    }
  }
}
