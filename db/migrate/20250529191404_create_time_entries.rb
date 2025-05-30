class CreateTimeEntries < ActiveRecord::Migration[8.0]
  def change
    create_table :time_entries do |t|
      t.datetime :start_time
      t.datetime :end_time
      t.integer :duration_minutes
      t.text :description
      t.boolean :billable
      t.decimal :hourly_rate
      t.references :user, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.references :issue, null: false, foreign_key: true

      t.timestamps
    end
  end
end
