import { Controller } from "@hotwired/stimulus"

// Smooth scroll controller for navigation
export default class extends Controller {
  
  scroll(event) {
    event.preventDefault()
    
    const href = event.currentTarget.getAttribute('href')
    if (!href || !href.startsWith('#')) return
    
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      this.smoothScrollTo(targetElement)
    }
  }
  
  smoothScrollTo(element) {
    const headerOffset = 80 // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
    
    // Add highlight effect to target section
    this.highlightSection(element)
  }
  
  highlightSection(element) {
    // Add temporary highlight class
    element.classList.add('section-highlighted')
    
    // Remove highlight after animation
    setTimeout(() => {
      element.classList.remove('section-highlighted')
    }, 2000)
  }
}
