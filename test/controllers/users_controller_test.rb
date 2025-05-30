require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = Organization.create!(
      name: "Test Organization",
      description: "A test organization"
    )
    @user = User.create!(
      name: "Test User",
      email_address: "testuser@example.com",
      password: "password123",
      organization: @organization,
      role: 3  # user
    )
    @admin = User.create!(
      name: "Admin User",
      email_address: "admin@example.com",
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

  test "system admin can access users index" do
    sign_in_as(@system_admin)
    get users_url
    assert_response :success
    assert_select "h1", text: /Users/
  end

  test "org admin can access users index" do
    sign_in_as(@admin)
    get users_url
    assert_response :success
    assert_select "h1", text: /Users/
  end

  test "regular user cannot access users index" do
    sign_in_as(@user)
    get users_url
    assert_response :redirect
  end

  test "system admin can view any user" do
    sign_in_as(@system_admin)
    get user_url(@user)
    assert_response :success
    assert_select "h1", text: @user.display_name
  end

  test "org admin can view users in their organization" do
    sign_in_as(@admin)
    get user_url(@user)
    assert_response :success
    assert_select "h1", text: @user.display_name
  end

  test "should require authentication" do
    get users_url
    assert_redirected_to new_session_url
  end

  test "should get new user form" do
    sign_in_as(@admin)
    get new_user_url
    assert_response :success
    assert_select "form"
  end

  test "should show user" do
    sign_in_as(@admin)
    get user_url(@user)
    assert_response :success
    assert_select "h1", text: @user.display_name
  end

  private

  def sign_in_as(user)
    post session_url, params: { email_address: user.email_address, password: "password123" }
  end
end
