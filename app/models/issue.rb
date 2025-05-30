class Issue < ApplicationRecord
  belongs_to :project
  has_many :documents, dependent: :destroy
  has_many :time_logs, dependent: :destroy

  enum :status, {
    open: 0,
    in_progress: 1,
    closed: 2
  }

  enum :priority, {
    low: 0,
    medium: 1,
    high: 2,
    urgent: 3
  }

  validates :title, presence: true
  validates :project, presence: true
  validates :status, presence: true
  validates :priority, presence: true

  scope :open, -> { where(status: :open) }
  scope :in_progress, -> { where(status: :in_progress) }
  scope :by_priority, ->(priority) { where(priority: priority) }
  scope :by_project, ->(project) { where(project: project) }

  def total_hours
    time_logs.sum(:duration_minutes)
  end

  def total_cost
    time_logs.sum { |log| (log.duration_minutes / 60.0) * log.hourly_rate }
  end

  def latest_activity
    time_logs.order(created_at: :desc).first
  end
end
