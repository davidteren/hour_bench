class TimeLogPolicy < ApplicationPolicy
  def index?
    true # All authenticated users can see time logs
  end

  def show?
    user == record.user || user.can_manage_organization? ||
    (user.can_manage_team? && user.team == record.user.team)
  end

  def create?
    true # All authenticated users can create time logs
  end

  def update?
    user == record.user || user.can_manage_organization? ||
    (user.can_manage_team? && user.team == record.user.team)
  end

  def destroy?
    user == record.user || user.can_manage_organization?
  end

  def stop_timer?
    user == record.user
  end

  def running?
    true
  end

  class Scope < Scope
    def resolve
      if user.system_admin?
        scope.all
      elsif user.org_admin?
        scope.joins(project: :client).where(clients: { organization: user.organization })
      elsif user.team_admin?
        scope.joins(:user).where(users: { team: user.team })
      else
        scope.where(user: user)
      end
    end
  end
end
