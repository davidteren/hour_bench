class ProjectPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    user.system_admin? || 
    (user.organization && record.client.organization == user.organization)
  end

  def create?
    user.can_manage_organization?
  end

  def update?
    user.can_manage_organization? && 
    (user.system_admin? || record.client.organization == user.organization)
  end

  def destroy?
    user.can_manage_organization? && 
    (user.system_admin? || record.client.organization == user.organization)
  end

  class Scope < Scope
    def resolve
      if user.system_admin?
        scope.all
      elsif user.organization
        scope.joins(:client).where(clients: { organization: user.organization })
      else
        scope.none
      end
    end
  end
end
