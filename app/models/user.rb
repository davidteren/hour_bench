class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :time_logs, dependent: :destroy
  belongs_to :organization, optional: true
  belongs_to :team, optional: true

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  validates :name, presence: true
  validates :email_address, presence: true, uniqueness: true
  validates :role, presence: true

  # System admins and freelancers don't need organization/team
  validates :organization, presence: true, unless: -> { role == 0 || role == 4 } # system_admin or freelancer

  scope :by_role, ->(role) { where(role: role) }

  def display_name
    name.presence || email_address
  end

  def system_admin?
    role == 0
  end

  def org_admin?
    role == 1
  end

  def team_admin?
    role == 2
  end

  def user?
    role == 3
  end

  def freelancer?
    role == 4
  end

  def can_impersonate?
    system_admin?
  end

  def can_manage_organization?
    system_admin? || org_admin?
  end

  def can_manage_team?
    system_admin? || org_admin? || team_admin?
  end

  def role_name
    case role
    when 0 then "System Admin"
    when 1 then "Organization Admin"
    when 2 then "Team Admin"
    when 3 then "User"
    when 4 then "Freelancer"
    else "Unknown"
    end
  end
end
