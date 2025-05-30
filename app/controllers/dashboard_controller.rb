class DashboardController < ApplicationController
  before_action :require_authentication

  def index
    @current_user = Current.user
    
    if @current_user.system_admin?
      # System admin sees everything - with intentional N+1 issues
      @organizations = Organization.all
      @total_users = User.count
      @total_time_logs = TimeLog.count
      @total_revenue = calculate_total_revenue
    elsif @current_user.org_admin?
      # Org admin sees their organization data
      @organization = @current_user.organization
      @teams = @organization.teams
      @clients = @organization.clients
      @projects = Project.joins(:client).where(clients: { organization: @organization })
      @recent_time_logs = recent_time_logs_for_organization(@organization)
    else
      # Regular users see their own data
      @recent_time_logs = @current_user.time_logs.includes(:project, :issue).order(created_at: :desc).limit(10)
      @running_timer = @current_user.time_logs.find_by(end_time: nil)
      @projects = available_projects_for_user(@current_user)
    end
    
    # Intentional performance issue - calculate stats without proper aggregation
    @stats = calculate_dashboard_stats
  end

  private

  def calculate_total_revenue
    # Intentional N+1 query for performance demonstration
    TimeLog.all.sum { |log| (log.duration_minutes / 60.0) * log.hourly_rate }
  end

  def recent_time_logs_for_organization(organization)
    # Another intentional performance issue
    TimeLog.joins(project: :client)
           .where(clients: { organization: organization })
           .order(created_at: :desc)
           .limit(20)
  end

  def available_projects_for_user(user)
    if user.organization
      Project.joins(:client).where(clients: { organization: user.organization }).active
    else
      Project.none
    end
  end

  def calculate_dashboard_stats
    user = Current.user
    
    if user.system_admin?
      {
        total_hours: TimeLog.sum(:duration_minutes) / 60.0,
        total_revenue: calculate_total_revenue,
        active_projects: Project.active.count,
        active_users: User.joins(:time_logs).distinct.count
      }
    elsif user.org_admin?
      org = user.organization
      {
        total_hours: TimeLog.joins(project: :client)
                           .where(clients: { organization: org })
                           .sum(:duration_minutes) / 60.0,
        total_revenue: org.total_revenue, # Uses the intentionally slow method
        active_projects: Project.joins(:client).where(clients: { organization: org }).active.count,
        active_users: User.where(organization: org).count
      }
    else
      {
        total_hours: user.time_logs.sum(:duration_minutes) / 60.0,
        total_revenue: user.time_logs.sum { |log| (log.duration_minutes / 60.0) * log.hourly_rate },
        active_projects: available_projects_for_user(user).count,
        recent_logs: user.time_logs.count
      }
    end
  end
end
