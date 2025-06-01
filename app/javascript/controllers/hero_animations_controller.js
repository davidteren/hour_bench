import { Controller } from "@hotwired/stimulus"

// Hero section animations controller
export default class extends Controller {
  static targets = ["badge", "title", "subtitle", "actions", "cards"]
  
  connect() {
    this.setupInitialState()
    this.startAnimationSequence()
  }
  
  setupInitialState() {
    // Set initial states for all elements
    this.badgeTarget.style.opacity = '0'
    this.badgeTarget.style.transform = 'translateY(-20px) scale(0.9)'
    
    this.titleTarget.style.opacity = '0'
    this.titleTarget.style.transform = 'translateY(30px)'
    
    this.subtitleTarget.style.opacity = '0'
    this.subtitleTarget.style.transform = 'translateY(20px)'
    
    this.actionsTarget.style.opacity = '0'
    this.actionsTarget.style.transform = 'translateY(20px)'
    
    this.cardsTarget.style.opacity = '0'
    this.cardsTarget.style.transform = 'translateY(40px)'
    
    // Set transitions
    const elements = [this.badgeTarget, this.titleTarget, this.subtitleTarget, this.actionsTarget, this.cardsTarget]
    elements.forEach(element => {
      element.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
    })
  }
  
  startAnimationSequence() {
    // Animate badge first
    setTimeout(() => {
      this.animateBadge()
    }, 300)
    
    // Animate title
    setTimeout(() => {
      this.animateTitle()
    }, 600)
    
    // Animate subtitle
    setTimeout(() => {
      this.animateSubtitle()
    }, 900)
    
    // Animate actions
    setTimeout(() => {
      this.animateActions()
    }, 1200)
    
    // Animate cards
    setTimeout(() => {
      this.animateCards()
    }, 1500)
  }
  
  animateBadge() {
    this.badgeTarget.style.opacity = '1'
    this.badgeTarget.style.transform = 'translateY(0) scale(1)'
    
    // Add pulse animation to badge
    setTimeout(() => {
      const pulse = this.badgeTarget.querySelector('.badge-pulse')
      if (pulse) {
        pulse.style.animation = 'pulse 2s infinite'
      }
    }, 500)
  }
  
  animateTitle() {
    this.titleTarget.style.opacity = '1'
    this.titleTarget.style.transform = 'translateY(0)'
    
    // Add gradient animation to title
    const titleStatic = this.titleTarget.querySelector('.title-static')
    if (titleStatic) {
      titleStatic.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      titleStatic.style.webkitBackgroundClip = 'text'
      titleStatic.style.webkitTextFillColor = 'transparent'
      titleStatic.style.backgroundClip = 'text'
    }
  }
  
  animateSubtitle() {
    this.subtitleTarget.style.opacity = '1'
    this.subtitleTarget.style.transform = 'translateY(0)'
    
    // Animate stats counters if they exist
    const statsContainer = this.subtitleTarget.querySelector('.hero-stats')
    if (statsContainer) {
      const statItems = statsContainer.querySelectorAll('.stat-item')
      statItems.forEach((item, index) => {
        item.style.opacity = '0'
        item.style.transform = 'translateY(10px)'
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
        
        setTimeout(() => {
          item.style.opacity = '1'
          item.style.transform = 'translateY(0)'
        }, index * 200)
      })
    }
  }
  
  animateActions() {
    this.actionsTarget.style.opacity = '1'
    this.actionsTarget.style.transform = 'translateY(0)'
    
    // Animate individual buttons
    const buttons = this.actionsTarget.querySelectorAll('.btn')
    buttons.forEach((button, index) => {
      button.style.opacity = '0'
      button.style.transform = 'translateX(-20px)'
      button.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
      
      setTimeout(() => {
        button.style.opacity = '1'
        button.style.transform = 'translateX(0)'
        
        // Add hover preparation
        this.setupButtonHoverEffects(button)
      }, index * 150)
    })
  }
  
  animateCards() {
    this.cardsTarget.style.opacity = '1'
    this.cardsTarget.style.transform = 'translateY(0)'

    // Simple fade-in animation for cards without layout shifts
    const cards = this.cardsTarget.querySelectorAll('.preview-card')
    cards.forEach((card, index) => {
      card.style.opacity = '0'
      card.style.transition = 'opacity 0.6s ease'

      setTimeout(() => {
        card.style.opacity = '1'
        // NO floating animation - keep cards static to prevent layout shifts
      }, index * 200)
    })
  }
  
  setupButtonHoverEffects(button) {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px) scale(1.05)'
      button.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0) scale(1)'
      button.style.boxShadow = 'none'
    })
  }
  
  addFloatingAnimation(card, index) {
    // DISABLED: Floating animation causes layout shifts
    // Instead, just ensure the card stays in its final position
    card.style.transform = 'translateY(0) rotateX(0deg)'

    // Optional: Add a subtle static glow effect instead
    card.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.1)'
  }
}
