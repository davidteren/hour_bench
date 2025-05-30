class Current < ActiveSupport::CurrentAttributes
  attribute :session, :impersonator_id, :impersonated_user_id

  def user
    if impersonated_user_id.present?
      @impersonated_user ||= User.find(impersonated_user_id)
    else
      session&.user
    end
  end

  def real_user
    if impersonator_id.present?
      @real_user ||= User.find(impersonator_id)
    else
      user
    end
  end

  def impersonating?
    impersonator_id.present? && impersonated_user_id.present?
  end
end
