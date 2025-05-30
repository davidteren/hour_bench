class ClientsController < ApplicationController
  before_action :set_organization
  before_action :set_client, only: [:show, :edit, :update, :destroy]
  
  def index
    @clients = policy_scope(Client)

    # For organization-scoped routes, filter by organization
    if @organization
      @clients = @clients.where(organization: @organization)
    end

    @clients = @clients.includes(:projects)

    # Apply search filter
    if params[:search].present?
      @clients = @clients.where("name LIKE ? OR email LIKE ? OR company LIKE ?",
                               "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%")
    end

    # Apply status filter
    if params[:status].present?
      @clients = @clients.where(status: params[:status])
    end

    @clients = @clients.order(:name)
  end

  def show
    authorize @client
  end

  def new
    @client = @organization.clients.build
    authorize @client
  end

  def create
    @client = @organization.clients.build(client_params)
    authorize @client

    if @client.save
      redirect_to organization_client_path(@organization, @client),
                  notice: 'Client was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize @client
  end

  def update
    authorize @client

    if @client.update(client_params)
      redirect_to organization_client_path(@organization, @client),
                  notice: 'Client was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @client
    @client.destroy
    redirect_to organization_clients_path(@organization),
                notice: 'Client was successfully deleted.'
  end

  private

  def set_organization
    if params[:organization_id].present?
      @organization = Organization.find(params[:organization_id])
      # Check if user has access to this organization
      unless Current.user.system_admin? || Current.user.organization == @organization
        raise Pundit::NotAuthorizedError
      end
    else
      # For system admin accessing /clients (not organization-scoped)
      @organization = Current.user.system_admin? ? nil : Current.user.organization
    end
  end

  def set_client
    if @organization
      @client = @organization.clients.find(params[:id])
    else
      # System admin can access any client
      @client = Client.find(params[:id])
    end
  end

  def client_params
    params.require(:client).permit(:name, :email, :phone, :company, :status, :notes)
  end
end
