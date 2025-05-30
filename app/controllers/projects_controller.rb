class ProjectsController < ApplicationController
  before_action :require_authentication
  before_action :set_organization_context
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  def index
    @projects = policy_scope(Project)
    
    # Intentional performance issue - missing includes
    @projects = @projects.order(:name)
    
    if params[:client_id].present?
      @projects = @projects.where(client_id: params[:client_id])
    end
    
    if params[:status].present?
      @projects = @projects.where(status: params[:status])
    end
  end

  def show
    authorize @project

    # Set organization for proper routing
    @organization = @project.client.organization

    # Intentional performance issues
    @recent_time_logs = @project.time_logs.order(created_at: :desc).limit(10)
    @total_hours = @project.total_hours / 60.0
    @total_revenue = @project.total_revenue
    @issues = @project.issues.order(:priority, :created_at)

    # More intentional N+1 queries
    @team_members = @project.time_logs.map(&:user).uniq
    @recent_activity = @project.recent_activity
  end

  def new
    @project = Project.new
    authorize @project
    @clients = available_clients
  end

  def create
    @project = Project.new(project_params)
    authorize @project
    
    if @project.save
      redirect_to (@organization && @project.client ? organization_client_project_path(@organization, @project.client, @project) : project_path(@project)), notice: 'Project was successfully created.'
    else
      @clients = available_clients
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize @project
    @clients = available_clients
  end

  def update
    authorize @project
    
    if @project.update(project_params)
      redirect_to (@organization && @project.client ? organization_client_project_path(@organization, @project.client, @project) : project_path(@project)), notice: 'Project was successfully updated.'
    else
      @clients = available_clients
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @project
    @project.destroy
    redirect_to (@organization && @project.client ? organization_client_projects_path(@organization, @project.client) : projects_path), notice: 'Project was successfully deleted.'
  end

  private

  def set_organization_context
    if params[:organization_id].present?
      @organization = Organization.find(params[:organization_id])
      unless Current.user.system_admin? || Current.user.organization == @organization
        raise Pundit::NotAuthorizedError
      end
    else
      @organization = Current.user.system_admin? ? nil : Current.user.organization
    end
  end

  def set_project
    if @organization && params[:client_id].present?
      # For organization-scoped routes: /organizations/:organization_id/clients/:client_id/projects/:id
      client = @organization.clients.find(params[:client_id])
      @project = client.projects.find(params[:id])
    else
      # For system admin accessing direct routes: /projects/:id
      @project = Project.find(params[:id])
    end
  end

  def project_params
    params.require(:project).permit(:name, :description, :status, :hourly_rate, :budget, :client_id)
  end

  def available_clients
    if Current.user.system_admin?
      Client.all
    elsif Current.user.organization
      Current.user.organization.clients
    else
      Client.none
    end
  end
end
