class CreateIssues < ActiveRecord::Migration[8.0]
  def change
    create_table :issues do |t|
      t.string :title
      t.text :description
      t.integer :status
      t.integer :priority
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
