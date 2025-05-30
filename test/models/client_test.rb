require "test_helper"

class ClientTest < ActiveSupport::TestCase
  # Disable fixtures to avoid the time_entries table issue
  self.use_transactional_tests = false

  def self.fixture_path
    nil
  end
  def setup
    @organization = Organization.create!(
      name: "Test Organization",
      description: "A test organization"
    )
  end

  def teardown
    # Disable foreign key checks temporarily for cleanup
    ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = OFF")
    Client.delete_all
    Organization.delete_all
    ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = ON")
  end

  test "should be valid with valid attributes" do
    client = Client.new(
      name: "Test Client",
      email: "test@example.com",
      phone: "555-1234",
      company: "Test Company",
      status: :active,
      organization: @organization
    )
    assert client.valid?
  end

  test "should require name" do
    client = Client.new(organization: @organization)
    assert_not client.valid?
    assert_includes client.errors[:name], "can't be blank"
  end

  test "should require organization" do
    client = Client.new(name: "Test Client")
    assert_not client.valid?
    assert_includes client.errors[:organization], "can't be blank"
  end

  test "should validate email format when email is present" do
    client = Client.new(
      name: "Test Client",
      email: "invalid-email",
      organization: @organization
    )
    assert_not client.valid?
    assert_includes client.errors[:email], "is invalid"
  end

  test "should allow blank email" do
    client = Client.new(
      name: "Test Client",
      email: "",
      organization: @organization
    )
    assert client.valid?
  end

  test "should allow nil email" do
    client = Client.new(
      name: "Test Client",
      email: nil,
      organization: @organization
    )
    assert client.valid?
  end

  test "should have active and inactive statuses" do
    assert_equal 0, Client.statuses[:active]
    assert_equal 1, Client.statuses[:inactive]
  end

  test "should default to active status" do
    client = Client.create!(
      name: "Test Client",
      organization: @organization
    )
    assert client.active?
  end

  test "should scope active clients" do
    active_client = Client.create!(
      name: "Active Client",
      status: :active,
      organization: @organization
    )

    inactive_client = Client.create!(
      name: "Inactive Client",
      status: :inactive,
      organization: @organization
    )

    assert_includes Client.active, active_client
    assert_not_includes Client.active, inactive_client
  end

  test "should scope by organization" do
    other_org = Organization.create!(
      name: "Other Organization",
      description: "Another test organization"
    )

    client1 = Client.create!(
      name: "Client 1",
      organization: @organization
    )

    client2 = Client.create!(
      name: "Client 2",
      organization: other_org
    )

    org1_clients = Client.by_organization(@organization)
    org2_clients = Client.by_organization(other_org)

    assert_includes org1_clients, client1
    assert_not_includes org1_clients, client2
    assert_includes org2_clients, client2
    assert_not_includes org2_clients, client1
  end
end
