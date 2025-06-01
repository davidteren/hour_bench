import { Controller } from "@hotwired/stimulus"

// Dynamic typing effect controller
export default class extends Controller {
  static targets = ["text"]
  static values = { 
    words: Array,
    typeSpeed: { type: Number, default: 100 },
    deleteSpeed: { type: Number, default: 50 },
    pauseTime: { type: Number, default: 2000 }
  }
  
  connect() {
    this.currentWordIndex = 0
    this.currentCharIndex = 0
    this.isDeleting = false
    this.isPaused = false
    
    if (this.wordsValue.length > 0) {
      this.startTyping()
    }
  }
  
  disconnect() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }
  
  startTyping() {
    this.typeText()
  }
  
  typeText() {
    const currentWord = this.wordsValue[this.currentWordIndex]
    
    if (this.isDeleting) {
      // Delete characters
      this.currentCharIndex--
      this.textTarget.textContent = currentWord.substring(0, this.currentCharIndex)
      
      if (this.currentCharIndex === 0) {
        this.isDeleting = false
        this.currentWordIndex = (this.currentWordIndex + 1) % this.wordsValue.length
        this.scheduleNext(500) // Pause before typing next word
        return
      }
      
      this.scheduleNext(this.deleteSpeedValue)
    } else {
      // Type characters
      this.currentCharIndex++
      this.textTarget.textContent = currentWord.substring(0, this.currentCharIndex)
      
      if (this.currentCharIndex === currentWord.length) {
        this.isPaused = true
        this.scheduleNext(this.pauseTimeValue, () => {
          this.isDeleting = true
          this.isPaused = false
        })
        return
      }
      
      this.scheduleNext(this.typeSpeedValue)
    }
  }
  
  scheduleNext(delay, callback = null) {
    this.timeoutId = setTimeout(() => {
      if (callback) {
        callback()
      }
      this.typeText()
    }, delay)
  }
}
