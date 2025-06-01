// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
console.log("🚀 Loading application.js...")

import "@hotwired/turbo-rails"
console.log("✅ Turbo loaded")

import "controllers"
console.log("✅ Controllers imported")

// Initialize AppSignal frontend monitoring
import "appsignal"
console.log("✅ AppSignal frontend monitoring loaded")

console.log("🎯 Application.js loaded successfully")
