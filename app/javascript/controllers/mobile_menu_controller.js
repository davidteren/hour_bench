import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="mobile-menu"
export default class extends Controller {
  connect() {
    // Setup event listeners for outside click and escape key
    this.outsideClickHandler = this.handleOutsideClick.bind(this)
    this.escapeKeyHandler = this.handleEscapeKey.bind(this)
    this.resizeHandler = this.handleResize.bind(this)

    document.addEventListener('click', this.outsideClickHandler)
    document.addEventListener('keydown', this.escapeKeyHandler)
    window.addEventListener('resize', this.resizeHandler)
  }

  disconnect() {
    document.removeEventListener('click', this.outsideClickHandler)
    document.removeEventListener('keydown', this.escapeKeyHandler)
    window.removeEventListener('resize', this.resizeHandler)
  }

  toggle() {
    const mobileMenu = document.querySelector('#mobile-menu')
    const menuIcon = document.querySelector('#mobile-menu-icon')
    const closeIcon = document.querySelector('#mobile-menu-close')
    const button = document.querySelector('#mobile-menu-button')

    if (!mobileMenu) return

    const isOpen = !mobileMenu.classList.contains('hidden')

    if (isOpen) {
      this.closeMenu()
    } else {
      this.openMenu()
    }
  }

  openMenu() {
    const mobileMenu = document.querySelector('#mobile-menu')
    const menuIcon = document.querySelector('#mobile-menu-icon')
    const closeIcon = document.querySelector('#mobile-menu-close')
    const button = document.querySelector('#mobile-menu-button')

    if (mobileMenu) mobileMenu.classList.remove('hidden')
    if (menuIcon) menuIcon.classList.add('hidden')
    if (closeIcon) closeIcon.classList.remove('hidden')
    if (button) button.setAttribute('aria-expanded', 'true')
  }

  closeMenu() {
    const mobileMenu = document.querySelector('#mobile-menu')
    const menuIcon = document.querySelector('#mobile-menu-icon')
    const closeIcon = document.querySelector('#mobile-menu-close')
    const button = document.querySelector('#mobile-menu-button')

    if (mobileMenu) mobileMenu.classList.add('hidden')
    if (menuIcon) menuIcon.classList.remove('hidden')
    if (closeIcon) closeIcon.classList.add('hidden')
    if (button) button.setAttribute('aria-expanded', 'false')
  }

  handleOutsideClick(event) {
    const mobileMenu = document.querySelector('#mobile-menu')
    const mobileMenuButton = document.querySelector('#mobile-menu-button')

    if (mobileMenu && mobileMenuButton &&
        !mobileMenu.contains(event.target) &&
        !mobileMenuButton.contains(event.target) &&
        !mobileMenu.classList.contains('hidden')) {
      this.closeMenu()
    }
  }

  handleEscapeKey(event) {
    if (event.key === 'Escape') {
      this.closeMenu()
    }
  }

  handleResize() {
    if (window.innerWidth >= 768) {
      this.closeMenu()
    }
  }
}
