class HealthController < ApplicationController
  # Skip authentication for health check
  skip_before_action :authenticate, only: [:check]
  
  # Simple health check endpoint for Render
  def check
    render json: { status: 'ok' }, status: :ok
  end
end
