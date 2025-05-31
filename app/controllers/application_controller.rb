class ApplicationController < ActionController::Base
  include Authentication
  include Pundit::Authorization

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # Temporarily commented out due to Rails 8.0.2 bug with :modern symbol
  # allow_browser versions: :modern

  # Less restrictive, supports more browsers
  # allow_browser versions: :standard

  # Most permissive, supports older browsers
  # allow_browser versions: :permissive

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def pundit_user
    Current.user
  end

  # Helper method to check if we should use real user permissions
  def use_real_user_for_admin_actions?
    Current.impersonating?
  end

  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_back(fallback_location: root_path)
  end
end
