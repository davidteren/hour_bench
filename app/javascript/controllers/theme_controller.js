import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="theme"
export default class extends Controller {
  static targets = ["toggle", "lightIcon", "darkIcon"]

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
    if (this.hasLightIconTarget && this.hasDarkIconTarget) {
      if (theme === 'dark') {
        this.lightIconTarget.classList.add('hidden')
        this.lightIconTarget.classList.remove('block')
        this.darkIconTarget.classList.remove('hidden')
        this.darkIconTarget.classList.add('block')
      } else {
        this.lightIconTarget.classList.remove('hidden')
        this.lightIconTarget.classList.add('block')
        this.darkIconTarget.classList.add('hidden')
        this.darkIconTarget.classList.remove('block')
      }
    }
  }

  // Method to get current theme
  get currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light'
  }
}
