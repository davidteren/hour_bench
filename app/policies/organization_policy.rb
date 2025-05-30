class OrganizationPolicy < ApplicationPolicy
  def index?
    user.system_admin?
  end

  def show?
    user.system_admin? || user.organization == record
  end

  def create?
    user.system_admin?
  end

  def update?
    user.system_admin? || (user.org_admin? && user.organization == record)
  end

  def destroy?
    user.system_admin?
  end

  class Scope < Scope
    def resolve
      if user.system_admin?
        scope.all
      else
        scope.where(id: user.organization_id)
      end
    end
  end
end
