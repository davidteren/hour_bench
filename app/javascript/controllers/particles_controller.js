import { Controller } from "@hotwired/stimulus"

// Animated particles background controller
export default class extends Controller {
  static targets = ["canvas"]
  
  connect() {
    this.canvas = this.canvasTarget
    this.ctx = this.canvas.getContext('2d')
    this.particles = []
    this.animationId = null
    
    this.setupCanvas()
    this.createParticles()
    this.animate()
    
    // Handle window resize
    this.boundResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.boundResize)
  }
  
  disconnect() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    window.removeEventListener('resize', this.boundResize)
  }
  
  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect()
    this.canvas.width = rect.width
    this.canvas.height = rect.height
    
    // Set canvas style for crisp rendering
    this.canvas.style.width = rect.width + 'px'
    this.canvas.style.height = rect.height + 'px'
    
    // Scale for high DPI displays
    const dpr = window.devicePixelRatio || 1
    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr
    this.ctx.scale(dpr, dpr)
  }
  
  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000)
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomColor()
      })
    }
  }
  
  getRandomColor() {
    const colors = [
      'rgba(99, 102, 241, 0.4)',   // Indigo
      'rgba(168, 85, 247, 0.4)',   // Purple
      'rgba(236, 72, 153, 0.4)',   // Pink
      'rgba(59, 130, 246, 0.4)',   // Blue
      'rgba(16, 185, 129, 0.4)'    // Emerald
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Update and draw particles
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX
      particle.y += particle.speedY
      
      // Wrap around edges
      if (particle.x > this.canvas.width) particle.x = 0
      if (particle.x < 0) particle.x = this.canvas.width
      if (particle.y > this.canvas.height) particle.y = 0
      if (particle.y < 0) particle.y = this.canvas.height
      
      // Draw particle
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = particle.color
      this.ctx.fill()
    })
    
    // Draw connections between nearby particles
    this.drawConnections()
    
    this.animationId = requestAnimationFrame(() => this.animate())
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`
          this.ctx.lineWidth = 1
          this.ctx.stroke()
        }
      }
    }
  }
  
  handleResize() {
    this.setupCanvas()
    this.particles = []
    this.createParticles()
  }
}
