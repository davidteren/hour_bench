require "test_helper"

class CurrentTest < ActiveSupport::TestCase
  setup do
    @organization = Organization.create!(
      name: "Test Organization",
      description: "A test organization"
    )
    @admin = User.create!(
      name: "Admin User",
      email_address: "admin@example.com",
      password: "password123",
      organization: @organization,
      role: 0  # system_admin
    )
    @user = User.create!(
      name: "Regular User",
      email_address: "user@example.com",
      password: "password123",
      organization: @organization,
      role: 3  # user
    )
  end

  test "user returns impersonated user when impersonating" do
    Current.impersonator_id = @admin.id
    Current.impersonated_user_id = @user.id
    
    assert_equal @user.id, Current.user.id
  end

  test "user returns session user when not impersonating" do
    session = @admin.sessions.create!(user_agent: "Test", ip_address: "127.0.0.1")
    Current.session = session
    Current.impersonator_id = nil
    Current.impersonated_user_id = nil
    
    assert_equal @admin, Current.user
  end

  test "real_user returns impersonator when impersonating" do
    Current.impersonator_id = @admin.id
    Current.impersonated_user_id = @user.id
    
    assert_equal @admin.id, Current.real_user.id
  end

  test "real_user returns session user when not impersonating" do
    session = @user.sessions.create!(user_agent: "Test", ip_address: "127.0.0.1")
    Current.session = session
    Current.impersonator_id = nil
    Current.impersonated_user_id = nil
    
    assert_equal @user, Current.real_user
  end

  test "impersonating? returns true when both ids are present" do
    Current.impersonator_id = @admin.id
    Current.impersonated_user_id = @user.id
    
    assert Current.impersonating?
  end

  test "impersonating? returns false when ids are not present" do
    Current.impersonator_id = nil
    Current.impersonated_user_id = nil
    
    assert_not Current.impersonating?
  end

  test "impersonating? returns false when only one id is present" do
    Current.impersonator_id = @admin.id
    Current.impersonated_user_id = nil
    
    assert_not Current.impersonating?
    
    Current.impersonator_id = nil
    Current.impersonated_user_id = @user.id
    
    assert_not Current.impersonating?
  end

  test "clearing impersonation state" do
    Current.impersonator_id = @admin.id
    Current.impersonated_user_id = @user.id
    
    assert Current.impersonating?
    
    Current.impersonator_id = nil
    Current.impersonated_user_id = nil
    
    assert_not Current.impersonating?
  end
end