class Client < ApplicationRecord
  belongs_to :organization
  has_many :projects, dependent: :destroy
  has_many :addresses, as: :addressable, dependent: :destroy

  enum :status, {
    active: 0,
    inactive: 1
  }, default: :active

  validates :name, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :organization, presence: true

  scope :active, -> { where(status: :active) }
  scope :by_organization, ->(org) { where(organization: org) }

  def total_hours
    # Intentional N+1 query for performance demonstration
    projects.sum { |project| project.time_logs.sum(:duration_minutes) }
  end

  def total_revenue
    projects.sum do |project|
      project.time_logs.sum { |log| (log.duration_minutes / 60.0) * log.hourly_rate }
    end
  end

  def primary_address
    addresses.first
  end
end
