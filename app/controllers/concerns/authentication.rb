module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :require_authentication
    before_action :set_impersonation_context
    helper_method :authenticated?
  end

  class_methods do
    def allow_unauthenticated_access(**options)
      skip_before_action :require_authentication, **options
    end
  end

  private
    def authenticated?
      resume_session
    end

    def require_authentication
      resume_session || request_authentication
    end

    def resume_session
      Current.session ||= find_session_by_cookie
    end

    def find_session_by_cookie
      Session.find_by(id: cookies.signed[:session_id]) if cookies.signed[:session_id]
    end

    def request_authentication
      session[:return_to_after_authenticating] = request.url
      redirect_to new_session_path
    end

    def after_authentication_url
      session.delete(:return_to_after_authenticating) || root_url
    end

    def start_new_session_for(user)
      user.sessions.create!(user_agent: request.user_agent, ip_address: request.remote_ip).tap do |session|
        Current.session = session
        cookies.signed.permanent[:session_id] = { value: session.id, httponly: true, same_site: :lax }
      end
    end

    def terminate_session
      Current.session.destroy
      cookies.delete(:session_id)
      
      # Clear impersonation state on logout
      if Current.impersonating?
        # Store the real user ID before clearing
        real_user_id = Current.real_user&.id
        
        # Clear impersonation state
        session.delete(:impersonator_id)
        session[:user_id] = real_user_id if real_user_id.present?
        
        # Reset Current attributes
        Current.impersonator_id = nil
        Current.impersonated_user_id = nil
      else
        # Just clear the session user ID
        session.delete(:user_id)
      end
    end

    def set_impersonation_context
      if session[:impersonator_id].present? && session[:user_id].present?
        Current.impersonator_id = session[:impersonator_id]
        Current.impersonated_user_id = session[:user_id]
      end
    end

    def stop_impersonation
      # Store the real user ID before clearing
      real_user_id = Current.real_user&.id
      
      # Clear impersonation state
      session.delete(:impersonator_id)
      session[:user_id] = real_user_id if real_user_id.present?
      
      # Reset Current attributes
      Current.impersonator_id = nil
      Current.impersonated_user_id = nil
    end
end
