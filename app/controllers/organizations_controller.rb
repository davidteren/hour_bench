class OrganizationsController < ApplicationController
  before_action :require_authentication
  before_action :set_organization, only: [ :show, :edit, :update, :destroy ]

  def index
    @organizations = policy_scope(Organization).includes(:users, :teams)

    # If impersonating, redirect to the user's organization
    if Current.impersonating? && Current.user.organization
      redirect_to organization_path(Current.user.organization)
      nil
    end
  end

  def show
    authorize @organization
  end

  def new
    @organization = Organization.new
    authorize @organization
  end

  def create
    @organization = Organization.new(organization_params)
    authorize @organization

    if @organization.save
      # Add the current user to the organization
      @organization.users << Current.user unless @organization.users.include?(Current.user)
      redirect_to @organization, notice: "Organization was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize @organization
  end

  def update
    authorize @organization

    if @organization.update(organization_params)
      redirect_to @organization, notice: "Organization was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @organization
    @organization.destroy
    redirect_to organizations_url, notice: "Organization was successfully deleted."
  end

  private

  def set_organization
    @organization = Organization.find(params[:id])
  end

  def organization_params
    params.require(:organization).permit(:name, :description)
  end
end
