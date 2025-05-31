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
      session.delete(:return_to_after_authenticating) || app_root_url
    end

    def start_new_session_for(user)
      user.sessions.create!(user_agent: request.user_agent, ip_address: request.remote_ip).tap do |session_record|
        Current.session = session_record
        cookies.signed.permanent[:session_id] = { value: session_record.id, httponly: true, same_site: :lax }

        # Store the signed-in user's id in the Rails session (NOT to be confused
        # with the Session ActiveRecord model instance above). We need to use
        # `self.session` (the controller helper) so we don't accidentally write
        # to the local variable that shadows it.
        self.session[:user_id] = user.id
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
      # Always reset the thread-local impersonation context at the beginning of
      # each request because `ActiveSupport::CurrentAttributes` values persist
      # for the lifetime of the thread (which, in tests, can span multiple
      # requests). If the controller session does **not** include impersonation
      # keys we must explicitly clear any lingering values from previous
      # requests so they don't leak into the current request.
      Current.impersonator_id = session[:impersonator_id]

      # Only treat the `:user_id` as an impersonated user when there actually
      # is an impersonator present. Otherwise make sure we clear the attribute.
      if session[:impersonator_id].present? && session[:user_id].present?
        Current.impersonated_user_id = session[:user_id]
      else
        Current.impersonated_user_id = nil
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
