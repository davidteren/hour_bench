class AddFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :name, :string
    add_column :users, :role, :integer
    add_reference :users, :organization, null: true, foreign_key: false
    add_reference :users, :team, null: true, foreign_key: false
  end
end
