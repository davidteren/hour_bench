class UsersController < ApplicationController
  before_action :require_authentication
  before_action :set_user, only: [ :show, :edit, :update, :destroy, :impersonate ]

  def index
    authorize User
    @users = policy_scope(User)

    # Apply search filter
    if params[:search].present?
      @users = @users.where("name LIKE ? OR email_address LIKE ?",
                           "%#{params[:search]}%", "%#{params[:search]}%")
    end

    # Apply role filter
    if params[:role].present?
      @users = @users.where(role: params[:role])
    end

    # Apply organization filter for system admin
    if params[:organization_id].present? && Current.user.system_admin?
      @users = @users.where(organization_id: params[:organization_id])
    end

    @users = @users.includes(:organization, :team).order(:name)
  end

  def show
    authorize @user
  end

  def new
    @user = User.new
    authorize @user
    @organizations = available_organizations
    @teams = []
  end

  def create
    @user = User.new(user_params)
    authorize @user

    if @user.save
      redirect_to @user, notice: "User was successfully created."
    else
      @organizations = available_organizations
      @teams = available_teams(@user.organization_id)
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize @user
    @organizations = available_organizations
    @teams = available_teams(@user.organization_id)
  end

  def update
    authorize @user

    if @user.update(user_params)
      redirect_to @user, notice: "User was successfully updated."
    else
      @organizations = available_organizations
      @teams = available_teams(@user.organization_id)
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @user
    @user.destroy
    redirect_to users_path, notice: "User was successfully deleted."
  end

  def impersonate
    authorize @user

    unless Current.real_user.can_impersonate?
      redirect_to users_path, alert: "You are not authorized to impersonate users."
      return
    end

    session[:impersonator_id] = Current.real_user.id
    session[:user_id] = @user.id
    redirect_to root_path, notice: "Now impersonating #{@user.display_name}"
  end

  def stop_impersonation
    unless Current.impersonating?
      redirect_to root_path, alert: "You are not currently impersonating anyone."
      return
    end

    real_user_name = Current.real_user.display_name
    stop_impersonation
    redirect_to root_path, notice: "Stopped impersonating. Welcome back, #{real_user_name}!"
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    permitted_params = [ :name, :email_address, :role ]

    # Only system admin can assign users to any organization
    if Current.user.system_admin?
      permitted_params += [ :organization_id, :team_id ]
    elsif Current.user.org_admin?
      # Org admin can only assign users to their organization
      permitted_params += [ :team_id ]
    end

    # Only include password if it's being set
    if params[:user][:password].present?
      permitted_params += [ :password, :password_confirmation ]
    end

    params.require(:user).permit(permitted_params)
  end

  def available_organizations
    if Current.user.system_admin?
      Organization.all
    elsif Current.user.org_admin?
      [ Current.user.organization ]
    else
      []
    end
  end

  def available_teams(organization_id = nil)
    return [] unless organization_id

    organization = Organization.find(organization_id)
    if Current.user.system_admin? || Current.user.organization == organization
      organization.teams
    else
      []
    end
  end
end
