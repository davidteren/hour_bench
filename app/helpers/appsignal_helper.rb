# AppSignal Frontend Helper
module AppsignalHelper
  def appsignal_frontend_config
    # You'll need to get your frontend API key from AppSignal dashboard
    # Go to: App Settings > Push & Deploy > Front-end error monitoring
    frontend_key = Rails.application.credentials.dig(:appsignal, :frontend_key) || 
                   ENV['APPSIGNAL_FRONTEND_KEY'] || 
                   'YOUR_FRONTEND_API_KEY_HERE'
    
    config = {
      APPSIGNAL_FRONTEND_KEY: frontend_key,
      APP_REVISION: Appsignal.config[:revision] || ENV['HEROKU_SLUG_COMMIT'] || 'unknown',
      RAILS_ENV: Rails.env,
      APP_NAME: Appsignal.config[:name] || 'HourBench'
    }
    
    javascript_tag do
      raw config.map { |key, value| "window.#{key} = #{value.to_json};" }.join("\n")
    end
  end

  def appsignal_frontend_meta_tags
    content_for :head do
      concat tag.meta(name: 'appsignal:frontend-key', content: appsignal_frontend_key)
      concat tag.meta(name: 'appsignal:revision', content: appsignal_revision)
      concat tag.meta(name: 'appsignal:environment', content: Rails.env)
    end
  end

  private

  def appsignal_frontend_key
    Rails.application.credentials.dig(:appsignal, :frontend_key) || 
    ENV['APPSIGNAL_FRONTEND_KEY'] || 
    'YOUR_FRONTEND_API_KEY_HERE'
  end

  def appsignal_revision
    Appsignal.config[:revision] || ENV['HEROKU_SLUG_COMMIT'] || 'unknown'
  end
end