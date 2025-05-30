class Organization < ApplicationRecord
  has_many :teams, dependent: :destroy
  has_many :users, dependent: :nullify
  has_many :clients, dependent: :destroy
  has_many :addresses, as: :addressable, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :description, length: { maximum: 1000 }

  scope :active, -> { joins(:users).distinct }

  def default_team
    teams.find_or_create_by(name: "Default Team", description: "Default team for #{name}")
  end

  def total_hours
    # Intentional N+1 for performance demonstration
    clients.sum { |client| client.projects.sum { |project| project.time_logs.sum(:duration_minutes) } }
  end

  def total_revenue
    # Another intentional performance issue
    clients.map(&:projects).flatten.map(&:time_logs).flatten.sum do |log|
      (log.duration_minutes / 60.0) * log.hourly_rate
    end
  end
end
