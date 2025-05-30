class Address < ApplicationRecord
  belongs_to :addressable, polymorphic: true

  validates :street, presence: true
  validates :city, presence: true
  validates :state, presence: true
  validates :zip_code, presence: true
  validates :country, presence: true

  scope :by_country, ->(country) { where(country: country) }
  scope :by_state, ->(state) { where(state: state) }

  def full_address
    "#{street}, #{city}, #{state} #{zip_code}, #{country}"
  end

  def us_address?
    country.downcase.in?(['us', 'usa', 'united states'])
  end
end
