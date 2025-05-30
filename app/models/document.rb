class Document < ApplicationRecord
  belongs_to :issue
  has_one_attached :file

  validates :title, presence: true
  validates :issue, presence: true
  validates :document_type, presence: true
  validates :version, presence: true

  scope :by_type, ->(type) { where(document_type: type) }
  scope :by_issue, ->(issue) { where(issue: issue) }
  scope :latest_version, -> { order(version: :desc) }

  def file_size
    return 0 unless file.attached?
    file.byte_size
  end

  def file_name
    return nil unless file.attached?
    file.filename.to_s
  end

  def downloadable?
    file.attached?
  end
end
