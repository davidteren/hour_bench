class CreateProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.string :name
      t.text :description
      t.integer :status
      t.decimal :hourly_rate
      t.decimal :budget
      t.references :client, null: false, foreign_key: true

      t.timestamps
    end
  end
end
