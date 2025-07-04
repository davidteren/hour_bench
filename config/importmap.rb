# Pin npm packages by running ./bin/importmap

pin "application"
pin "appsignal", to: "appsignal.js"
pin "appsignal_config", to: "appsignal_config.js"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"

# Explicitly pin individual controllers for debugging
pin "controllers/button_effects_controller"
pin "controllers/card_3d_controller"
pin "controllers/feature_tabs_controller"
pin "controllers/features_showcase_controller"
pin "controllers/flash_controller"
pin "controllers/hero_animations_controller"
pin "controllers/intersection_observer_controller"
pin "controllers/mobile_nav_controller"
pin "controllers/modal_controller"
pin "controllers/particles_controller"
pin "controllers/smooth_scroll_controller"
pin "controllers/stats_counter_controller"
pin "controllers/theme_controller"
pin "controllers/typing_effect_controller"
pin "@appsignal/javascript", to: "@appsignal--javascript.js" # @1.5.0
pin "@appsignal/core", to: "@appsignal--core.js" # @1.1.24
pin "https" # @2.1.0
pin "tslib" # @2.8.1
