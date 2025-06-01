// Import and register all your controllers from the importmap via controllers/**/*_controller
import { application } from "controllers/application"

// Enable debug mode to see what's happening
application.debug = true
console.log("🎯 Stimulus application starting...")

// Try manual imports first to test
import ButtonEffectsController from "controllers/button_effects_controller"
import Card3dController from "controllers/card_3d_controller"
import FeatureTabsController from "controllers/feature_tabs_controller"
import FeaturesShowcaseController from "controllers/features_showcase_controller"
import FlashController from "controllers/flash_controller"
import HeroAnimationsController from "controllers/hero_animations_controller"
import IntersectionObserverController from "controllers/intersection_observer_controller"
import MobileNavController from "controllers/mobile_nav_controller"
import ModalController from "controllers/modal_controller"
import ParticlesController from "controllers/particles_controller"
import SmoothScrollController from "controllers/smooth_scroll_controller"
import StatsCounterController from "controllers/stats_counter_controller"
import ThemeController from "controllers/theme_controller"
import TypingEffectController from "controllers/typing_effect_controller"

// Register controllers manually
application.register("button-effects", ButtonEffectsController)
application.register("card-3d", Card3dController)
application.register("feature-tabs", FeatureTabsController)
application.register("features-showcase", FeaturesShowcaseController)
application.register("flash", FlashController)
application.register("hero-animations", HeroAnimationsController)
application.register("intersection-observer", IntersectionObserverController)
application.register("mobile-nav", MobileNavController)
application.register("modal", ModalController)
application.register("particles", ParticlesController)
application.register("smooth-scroll", SmoothScrollController)
application.register("stats-counter", StatsCounterController)
application.register("theme", ThemeController)
application.register("typing-effect", TypingEffectController)

console.log("✅ Controllers registered manually")

// Log registered controllers after loading
setTimeout(() => {
  console.log("📋 Controllers after loading:", Object.keys(application.router.modulesByIdentifier || {}))
  console.log("📋 Application router:", application.router)
}, 1000)
