class Project < ApplicationRecord
  belongs_to :client
  has_many :issues, dependent: :destroy
  has_many :time_logs, dependent: :destroy

  enum :status, {
    active: 0,
    completed: 1,
    on_hold: 2
  }

  validates :name, presence: true
  validates :client, presence: true
  validates :status, presence: true
  validates :hourly_rate, presence: true, numericality: { greater_than: 0 }
  validates :budget, numericality: { greater_than: 0 }, allow_nil: true

  scope :active, -> { where(status: :active) }
  scope :by_client, ->(client) { where(client: client) }
  scope :by_organization, ->(org) { joins(:client).where(clients: { organization: org }) }

  def total_hours
    time_logs.sum(:duration_minutes)
  end

  def total_revenue
    time_logs.sum { |log| (log.duration_minutes / 60.0) * log.hourly_rate }
  end

  def budget_remaining
    return nil unless budget
    budget - total_revenue
  end

  def over_budget?
    return false unless budget
    total_revenue > budget
  end

  # Intentional performance issue - missing eager loading
  def recent_activity
    time_logs.order(created_at: :desc).limit(10).map do |log|
      {
        user: log.user.name,
        description: log.description,
        duration: log.duration_minutes,
        created_at: log.created_at
      }
    end
  end
end
