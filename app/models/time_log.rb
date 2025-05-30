class TimeLog < ApplicationRecord
  belongs_to :user
  belongs_to :project
  belongs_to :issue, optional: true

  validates :user, presence: true
  validates :project, presence: true
  validates :description, presence: true
  validates :duration_minutes, presence: true, numericality: { greater_than: 0 }
  validates :hourly_rate, presence: true, numericality: { greater_than: 0 }

  scope :billable, -> { where(billable: true) }
  scope :non_billable, -> { where(billable: false) }
  scope :by_user, ->(user) { where(user: user) }
  scope :by_project, ->(project) { where(project: project) }
  scope :by_date_range, ->(start_date, end_date) { where(start_time: start_date..end_date) }

  before_save :calculate_duration
  before_save :set_default_hourly_rate

  def duration_hours
    duration_minutes / 60.0
  end

  def total_cost
    duration_hours * hourly_rate
  end

  def running?
    start_time.present? && end_time.blank?
  end

  def stop_timer!
    return false unless running?

    self.end_time = Time.current
    calculate_duration
    save!
  end

  private

  def calculate_duration
    return unless start_time && end_time

    self.duration_minutes = ((end_time - start_time) / 60).round
  end

  def set_default_hourly_rate
    return if hourly_rate.present?

    self.hourly_rate = project&.hourly_rate || 0
  end
end
