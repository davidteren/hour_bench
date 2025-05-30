class ClientPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def show?
    user.system_admin? ||
    (user.organization && record.organization == user.organization)
  end

  def create?
    user.can_manage_organization?
  end

  def update?
    user.can_manage_organization? &&
    (user.system_admin? || record.organization == user.organization)
  end

  def destroy?
    user.can_manage_organization? &&
    (user.system_admin? || record.organization == user.organization)
  end

  class Scope < Scope
    def resolve
      if user.system_admin?
        scope.all
      elsif user.organization
        scope.where(organization: user.organization)
      else
        scope.none
      end
    end
  end
end
