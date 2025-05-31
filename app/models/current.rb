class Current < ActiveSupport::CurrentAttributes
  attribute :session, :impersonator_id, :impersonated_user_id

  # Fetch the effective user for the current request. We **intentionally avoid
  # memoisation** here because `ActiveSupport::CurrentAttributes` objects live
  # for the lifetime of the thread. In the test-suite (and sometimes in
  # multi-threaded servers) a single thread can be reused for multiple, totally
  # independent requests. Memoising would therefore risk leaking the user from
  # a previous request into the next one.
  def user
    if impersonated_user_id.present?
      User.find(impersonated_user_id)
    else
      session&.user
    end
  end

  # Return the "real" signed-in user (i.e., the impersonator) if we are
  # currently impersonating, otherwise fall back to the regular `user` helper.
  # For the same reason as above we avoid memoisation.
  def real_user
    if impersonator_id.present?
      User.find(impersonator_id)
    else
      user
    end
  end

  def impersonating?
    impersonator_id.present? && impersonated_user_id.present?
  end
end
