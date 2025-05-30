require "test_helper"

class ClientsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = Organization.create!(
      name: "Test Organization",
      description: "A test organization"
    )
    @client = Client.create!(
      name: "Test Client",
      email: "test@example.com",
      organization: @organization
    )
    @user = User.create!(
      name: "Test User",
      email_address: "test@example.com",
      password: "password123",
      organization: @organization,
      role: 1  # org_admin
    )
    @system_admin = User.create!(
      name: "System Admin",
      email_address: "sysadmin@example.com",
      password: "password123",
      organization: nil,
      role: 0  # system_admin
    )
    sign_in_as(@user)
  end

  test "should get index" do
    get organization_clients_url(@organization)
    assert_response :success
    assert_select "h1", text: /Clients/
  end

  test "system admin can access clients index via direct route" do
    sign_in_as(@system_admin)
    get clients_url
    assert_response :success
    assert_select "h1", text: /Clients/
  end

  test "system admin can access client show via direct route" do
    sign_in_as(@system_admin)
    get client_url(@client)
    assert_response :success
    assert_select "h1", text: @client.name
  end

  test "should get index with search" do
    get organization_clients_url(@organization), params: { search: @client.name }
    assert_response :success
  end

  test "should get index with status filter" do
    get organization_clients_url(@organization), params: { status: "active" }
    assert_response :success
  end

  test "should show client" do
    get organization_client_url(@organization, @client)
    assert_response :success
    assert_select "h1", text: @client.name
  end

  test "should get new" do
    get new_organization_client_url(@organization)
    assert_response :success
    assert_select "form"
  end

  test "should create client" do
    assert_difference("Client.count") do
      post organization_clients_url(@organization), params: {
        client: {
          name: "New Client",
          email: "new@example.com",
          phone: "555-9999",
          company: "New Company",
          status: "active"
        }
      }
    end

    assert_redirected_to organization_client_url(@organization, Client.last)
    assert_equal "Client was successfully created.", flash[:notice]
  end

  test "should not create client with invalid data" do
    assert_no_difference("Client.count") do
      post organization_clients_url(@organization), params: {
        client: {
          name: "", # Invalid - name is required
          email: "invalid-email"
        }
      }
    end

    assert_response :unprocessable_entity
  end

  test "should get edit" do
    get edit_organization_client_url(@organization, @client)
    assert_response :success
    assert_select "form"
  end

  test "should update client" do
    patch organization_client_url(@organization, @client), params: {
      client: {
        name: "Updated Client Name",
        email: "updated@example.com"
      }
    }

    assert_redirected_to organization_client_url(@organization, @client)
    assert_equal "Client was successfully updated.", flash[:notice]
    @client.reload
    assert_equal "Updated Client Name", @client.name
  end

  test "should not update client with invalid data" do
    patch organization_client_url(@organization, @client), params: {
      client: {
        name: "", # Invalid
        email: "invalid-email"
      }
    }

    assert_response :unprocessable_entity
  end

  test "should destroy client" do
    assert_difference("Client.count", -1) do
      delete organization_client_url(@organization, @client)
    end

    assert_redirected_to organization_clients_url(@organization)
    assert_equal "Client was successfully deleted.", flash[:notice]
  end

  test "should require authentication" do
    sign_out
    get organization_clients_url(@organization)
    assert_redirected_to new_session_url
  end

  test "should enforce authorization" do
    # Test with user from different organization
    other_org = Organization.create!(
      name: "Other Organization",
      description: "Another test organization"
    )
    other_user = User.create!(
      name: "Other User",
      email_address: "other@example.com",
      password: "password123",
      organization: other_org,
      role: 3  # user
    )
    sign_in_as(other_user)

    get organization_clients_url(@organization)
    assert_response :redirect # Should be redirected due to authorization failure
  end

  private

  def sign_in_as(user)
    post session_url, params: { email_address: user.email_address, password: "password123" }
  end

  def sign_out
    delete session_url
  end
end
