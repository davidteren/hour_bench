import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="theme"
export default class extends Controller {
  static targets = ["toggle"]

  connect() {
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light'
    this.setTheme(savedTheme)

    // Initialize icons on connect
    this.updateIcons(savedTheme)
  }

  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)

    // Update toggle state if target exists
    if (this.hasToggleTarget) {
      this.toggleTarget.setAttribute('aria-checked', theme === 'dark')
    }

    // Update icon visibility
    this.updateIcons(theme)

    // Dispatch custom event for other components that might need to react
    document.dispatchEvent(new CustomEvent('theme:changed', {
      detail: { theme }
    }))
  }

  updateIcons(theme) {
    // Find theme icons by class since they're not targets
    const lightIcon = document.querySelector('.theme-icon-light')
    const darkIcon = document.querySelector('.theme-icon-dark')
    
    if (lightIcon && darkIcon) {
      if (theme === 'dark') {
        lightIcon.style.display = 'none'
        darkIcon.style.display = 'flex'
      } else {
        lightIcon.style.display = 'flex'
        darkIcon.style.display = 'none'
      }
    }
  }

  // Method to get current theme
  get currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light'
  }
}
