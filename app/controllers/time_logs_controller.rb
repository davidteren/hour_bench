class TimeLogsController < ApplicationController
  before_action :require_authentication
  before_action :set_time_log, only: [ :show, :edit, :update, :destroy, :stop_timer ]

  def index
    @time_logs = policy_scope(TimeLog)

    # Intentional performance issue - no eager loading
    @time_logs = @time_logs.order(created_at: :desc)
                           .page(params[:page])
                           .per(25)

    # Add filters if provided
    if params[:project_id].present?
      @time_logs = @time_logs.where(project_id: params[:project_id])
    end

    if params[:user_id].present? && Current.user.can_manage_organization?
      @time_logs = @time_logs.where(user_id: params[:user_id])
    end

    # Calculate totals with intentional N+1
    @total_hours = @time_logs.sum(&:duration_minutes) / 60.0
    @total_revenue = @time_logs.sum { |log| (log.duration_minutes / 60.0) * log.hourly_rate }
  end

  def show
    authorize @time_log
  end

  def new
    @time_log = TimeLog.new
    authorize @time_log

    @projects = available_projects
    @project = Project.find(params[:project_id]) if params[:project_id].present?
  end

  def create
    @time_log = Current.user.time_logs.build(time_log_params)
    authorize @time_log

    if @time_log.save
      redirect_to @time_log, notice: "Time log was successfully created."
    else
      @projects = available_projects
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize @time_log
    @projects = available_projects
  end

  def update
    authorize @time_log

    if @time_log.update(time_log_params)
      redirect_to @time_log, notice: "Time log was successfully updated."
    else
      @projects = available_projects
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @time_log
    @time_log.destroy
    redirect_to time_logs_path, notice: "Time log was successfully deleted."
  end

  def stop_timer
    authorize @time_log

    if @time_log.stop_timer!
      redirect_to dashboard_path, notice: "Timer stopped successfully."
    else
      redirect_to dashboard_path, alert: "Failed to stop timer."
    end
  end

  def running
    @running_logs = Current.user.time_logs.where(end_time: nil)
    authorize @running_logs
  end

  private

  def set_time_log
    @time_log = TimeLog.find(params[:id])
  end

  def time_log_params
    params.require(:time_log).permit(:start_time, :end_time, :duration_minutes, :description,
                                     :billable, :hourly_rate, :project_id, :issue_id)
  end

  def available_projects
    if Current.user.organization
      Project.joins(:client).where(clients: { organization: Current.user.organization }).active
    else
      Project.none
    end
  end
end
