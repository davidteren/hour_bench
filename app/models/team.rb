class Team < ApplicationRecord
  belongs_to :organization
  has_many :users, dependent: :nullify

  validates :name, presence: true
  validates :organization, presence: true
  validates :name, uniqueness: { scope: :organization_id }

  scope :active, -> { joins(:users).distinct }

  def team_hours
    # Intentional N+1 for demonstration
    users.sum { |user| user.time_logs.sum(:duration_minutes) }
  end

  def team_revenue
    users.sum do |user|
      user.time_logs.sum { |log| (log.duration_minutes / 60.0) * log.hourly_rate }
    end
  end
end
