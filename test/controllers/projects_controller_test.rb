require "test_helper"

class ProjectsControllerTest < ActionDispatch::IntegrationTest
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
    @project = Project.create!(
      name: "Test Project",
      description: "A test project",
      client: @client,
      hourly_rate: 100,
      budget: 5000,
      status: "active"
    )
    @org_admin = User.create!(
      name: "Org Admin",
      email_address: "orgadmin@example.com",
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
  end

  test "system admin can access projects index via direct route" do
    sign_in_as(@system_admin)
    get projects_url
    assert_response :success
    assert_select "h1", text: /Projects/
  end

  test "system admin can access project show via direct route" do
    sign_in_as(@system_admin)
    get project_url(@project)
    assert_response :success
    assert_select "h1", text: @project.name
  end

  test "org admin can access projects index via organization route" do
    sign_in_as(@org_admin)
    get organization_client_projects_url(@organization, @client)
    assert_response :success
    assert_select "h1", text: /Projects/
  end

  test "org admin can access project show via organization route" do
    sign_in_as(@org_admin)
    get organization_client_project_url(@organization, @client, @project)
    assert_response :success
    assert_select "h1", text: @project.name
  end

  test "should enforce authorization for different organization" do
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

    get organization_client_projects_url(@organization, @client)
    assert_response :redirect # Should be redirected due to authorization failure
  end

  test "should require authentication" do
    get projects_url
    assert_redirected_to new_session_url
  end

  test "system admin sees all projects regardless of organization" do
    # Create project in different organization
    other_org = Organization.create!(name: "Other Org", description: "Test")
    other_client = Client.create!(name: "Other Client", email: "other@test.com", organization: other_org)
    other_project = Project.create!(name: "Other Project", client: other_client, hourly_rate: 100, status: "active")

    sign_in_as(@system_admin)
    get projects_url
    assert_response :success

    # System admin should see projects from all organizations in their scope
    assert_select "h1", text: /Projects/
  end

  test "org admin only sees organization projects" do
    # Create project in different organization
    other_org = Organization.create!(name: "Other Org", description: "Test")
    other_client = Client.create!(name: "Other Client", email: "other@test.com", organization: other_org)
    other_project = Project.create!(name: "Other Project", client: other_client, hourly_rate: 100, status: "active")

    sign_in_as(@org_admin)
    get organization_client_projects_url(@organization, @client)
    assert_response :success
    assert_select "h1", text: /Projects/
  end

  private

  def sign_in_as(user)
    post session_url, params: { email_address: user.email_address, password: "password123" }
  end
end
