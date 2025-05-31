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

  # Impersonation Tests
  test "system admin can impersonate another user" do
    sign_in_as(@system_admin)

    post impersonate_user_url(@user)

    assert_redirected_to root_path
    assert_equal "Now impersonating #{@user.display_name}", flash[:notice]
    assert_equal @system_admin.id, session[:impersonator_id]
    assert_equal @user.id, session[:user_id]
  end

  test "org admin cannot impersonate users" do
    sign_in_as(@admin)

    post impersonate_user_url(@user)

    # Should be redirected due to authorization failure (Pundit)
    assert_response :redirect
    assert_nil session[:impersonator_id]
    assert_equal @admin.id, session[:user_id]
  end

  test "regular user cannot impersonate users" do
    sign_in_as(@user)
    other_user = User.create!(
      name: "Other User",
      email_address: "other@example.com",
      password: "password123",
      organization: @organization,
      role: 3
    )

    post impersonate_user_url(other_user)

    assert_response :redirect
    assert_nil session[:impersonator_id]
  end

  test "stop impersonation returns to original user" do
    sign_in_as(@system_admin)

    # Start impersonation
    post impersonate_user_url(@user)
    assert_equal @system_admin.id, session[:impersonator_id]
    assert_equal @user.id, session[:user_id]

    # Stop impersonation
    delete stop_impersonation_users_url

    assert_redirected_to root_path
    assert_equal "Stopped impersonating. Welcome back, #{@system_admin.display_name}!", flash[:notice]
    assert_nil session[:impersonator_id]
    assert_equal @system_admin.id, session[:user_id]
  end

  test "stop impersonation when not impersonating shows error" do
    sign_in_as(@system_admin)

    delete stop_impersonation_users_url

    assert_redirected_to root_path
    assert_equal "You are not currently impersonating anyone.", flash[:alert]
  end

  test "impersonation context is set correctly in Current" do
    sign_in_as(@system_admin)

    # Start impersonation
    post impersonate_user_url(@user)
    follow_redirect!

    # Verify that the users index is accessible (using real user's permissions)
    # This tests that the UserPolicy is correctly using the real user's permissions
    get users_url
    assert_response :success

    # Verify that session data is set correctly
    assert_equal @system_admin.id, session[:impersonator_id]
    assert_equal @user.id, session[:user_id]

    # Verify that the impersonation banner appears (which relies on Current.impersonating?)
    get root_url
    assert_response :success
    assert_select "div[style*='background-color: var(--color-warning)']" do
      assert_select "span", text: "Impersonating: #{@user.display_name}"
      assert_select "a[href='#{stop_impersonation_users_path}']", text: "Stop"
    end
  end

  test "impersonation banner appears when impersonating" do
    sign_in_as(@system_admin)
    post impersonate_user_url(@user)

    get root_url
    assert_response :success
    assert_select "div[style*='background-color: var(--color-warning)']" do
      assert_select "span", text: "Impersonating: #{@user.display_name}"
      assert_select "a[href='#{stop_impersonation_users_path}']", text: "Stop"
    end
  end

  test "impersonation banner disappears after stopping impersonation" do
    sign_in_as(@system_admin)

    # Start impersonation
    post impersonate_user_url(@user)
    get root_url
    assert_select "div[style*='background-color: var(--color-warning)']"

    # Stop impersonation
    delete stop_impersonation_users_url
    follow_redirect!

    # Banner should be gone
    get root_url
    assert_response :success
    assert_select "div[style*='background-color: var(--color-warning)']", count: 0
  end

  test "cannot impersonate while already impersonating" do
    sign_in_as(@system_admin)
    other_user = User.create!(
      name: "Another User",
      email_address: "another@example.com",
      password: "password123",
      organization: @organization,
      role: 3
    )

    # Start impersonating first user
    post impersonate_user_url(@user)
    assert_equal @user.id, session[:user_id]

    # Try to impersonate another user while already impersonating
    post impersonate_user_url(other_user)

    # Should not allow double impersonation
    assert_redirected_to users_path
    assert_equal "You cannot impersonate while already impersonating another user.", flash[:alert]
    assert_equal @user.id, session[:user_id]  # Still impersonating first user
  end

  private

  def sign_in_as(user)
    post session_url, params: { email_address: user.email_address, password: "password123" }
    follow_redirect!
  end
end
