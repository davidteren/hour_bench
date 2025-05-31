class UserPolicy < ApplicationPolicy
  def index?
    # If impersonating, use the real user's permissions for admin actions
    effective_user = Current.impersonating? ? Current.real_user : user
    effective_user.can_manage_organization? || effective_user.can_manage_team?
  end

  def show?
    user == record || user.can_manage_organization? ||
    (user.can_manage_team? && user.team == record.team)
  end

  def create?
    user.can_manage_organization? || user.can_manage_team?
  end

  def update?
    user == record || user.can_manage_organization? ||
    (user.can_manage_team? && user.team == record.team)
  end

  def destroy?
    user.can_manage_organization? && user != record
  end

  def impersonate?
    # Only the real user (not impersonated) can impersonate others
    if Current.impersonating?
      Current.real_user.can_impersonate?
    else
      user.can_impersonate?
    end
  end

  class Scope < Scope
    def resolve
      # If impersonating, use the real user's permissions for admin actions
      effective_user = Current.impersonating? ? Current.real_user : user

      if effective_user.system_admin?
        scope.all
      elsif effective_user.org_admin?
        scope.where(organization: effective_user.organization)
      elsif effective_user.team_admin?
        scope.where(team: effective_user.team)
      else
        scope.where(id: user.id)
      end
    end
  end
end
