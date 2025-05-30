Rails.application.routes.draw do
  resource :session
  resources :passwords, param: :token
  
  # Dashboard and main routes
  root "dashboard#index"
  get "dashboard", to: "dashboard#index"
  
  # Core resources
  resources :organizations do
    resources :teams
    resources :clients do
      resources :projects do
        resources :issues do
          resources :documents
        end
        resources :time_logs
      end
    end
  end
  
  resources :users do
    member do
      post :impersonate
    end
    collection do
      delete :stop_impersonation
    end
  end
  
  resources :time_logs do
    member do
      patch :stop_timer
    end
    collection do
      get :running
    end
  end
  
  resources :projects, only: [:index, :show] do
    resources :time_logs, only: [:index, :new, :create]
  end

  # System admin routes (not organization-scoped)
  resources :clients, only: [:index, :show, :new, :create, :edit, :update, :destroy]
  
  # Reports
  get "reports", to: "reports#index"
  get "reports/time", to: "reports#time"
  get "reports/revenue", to: "reports#revenue"
  get "reports/performance", to: "reports#performance"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
