require "test_helper"

class ImpersonationFlowTest < ActionDispatch::IntegrationTest
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
    @system_admin = User.create!(
      name: "System Admin",
      email_address: "sysadmin@example.com",
      password: "password123",
      organization: nil,
      role: 0  # system_admin
    )
  end

  test "complete impersonation flow with state management" do
    # Login as system admin
    post session_url, params: { email_address: @system_admin.email_address, password: "password123" }
    assert_redirected_to root_path
    follow_redirect!

    # Verify initial state
    assert_nil session[:impersonator_id]
    assert_equal @system_admin.id, session[:user_id]

    # Start impersonation
    post impersonate_user_url(@user)
    assert_redirected_to root_path
    follow_redirect!

    # Verify impersonation state
    assert_equal @system_admin.id, session[:impersonator_id]
    assert_equal @user.id, session[:user_id]

    # Navigate to different pages and verify state persists
    get users_url
    assert_response :success
    assert_equal @system_admin.id, session[:impersonator_id]
    assert_equal @user.id, session[:user_id]

    get projects_url
    assert_response :success
    assert_equal @system_admin.id, session[:impersonator_id]
    assert_equal @user.id, session[:user_id]

    # Stop impersonation
    delete stop_impersonation_users_url
    assert_redirected_to root_path
    follow_redirect!

    # Verify state is properly cleaned up
    assert_nil session[:impersonator_id]
    assert_equal @system_admin.id, session[:user_id]

    # Verify Current attributes are cleared by making another request
    get users_url
    assert_response :success
  end

  test "impersonation context set correctly on each request" do
    # Login as system admin
    post session_url, params: { email_address: @system_admin.email_address, password: "password123" }

    # Start impersonation
    post impersonate_user_url(@user)
    follow_redirect!

    # Make multiple requests and verify Current is set correctly
    5.times do
      get dashboard_url
      assert_response :success

      # The view should show impersonation banner
      assert_select "div[style*='background-color: var(--color-warning)']" do
        assert_select "span", text: "Impersonating: #{@user.display_name}"
      end
    end
  end

  test "session cleanup on stop impersonation" do
    # Login and start impersonation
    post session_url, params: { email_address: @system_admin.email_address, password: "password123" }
    post impersonate_user_url(@user)

    # Verify impersonation is active
    assert session[:impersonator_id].present?
    assert session[:user_id] == @user.id

    # Stop impersonation
    delete stop_impersonation_users_url

    # Verify session is cleaned up
    assert_nil session[:impersonator_id]
    assert_equal @system_admin.id, session[:user_id]

    # Make another request to ensure state persists
    get dashboard_url
    assert_response :success
    assert_nil session[:impersonator_id]
    assert_equal @system_admin.id, session[:user_id]
  end

  test "cannot start new impersonation while already impersonating" do
    other_user = User.create!(
      name: "Another User",
      email_address: "another@example.com",
      password: "password123",
      organization: @organization,
      role: 3
    )

    # Login as system admin
    post session_url, params: { email_address: @system_admin.email_address, password: "password123" }

    # Start impersonating first user
    post impersonate_user_url(@user)
    assert_equal @user.id, session[:user_id]

    # Try to impersonate another user
    post impersonate_user_url(other_user)

    # Should still be impersonating the first user
    assert_equal @user.id, session[:user_id]
    assert_equal @system_admin.id, session[:impersonator_id]
  end

  test "logout while impersonating clears impersonation state" do
    # Login and start impersonation
    post session_url, params: { email_address: @system_admin.email_address, password: "password123" }
    post impersonate_user_url(@user)

    # Verify impersonation is active
    assert session[:impersonator_id].present?

    # Logout
    delete session_url
    assert_redirected_to new_session_url

    # Login again
    post session_url, params: { email_address: @system_admin.email_address, password: "password123" }

    # Should not be impersonating
    assert_nil session[:impersonator_id]
    assert_equal @system_admin.id, session[:user_id]
  end
end
