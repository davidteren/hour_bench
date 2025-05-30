class AddForeignKeysAndCleanup < ActiveRecord::Migration[8.0]
  def change
    # Add foreign key constraints for users
    add_foreign_key :users, :organizations, column: :organization_id
    add_foreign_key :users, :teams, column: :team_id
    
    # Drop the duplicate time_entries table (we're using time_logs)
    drop_table :time_entries if table_exists?(:time_entries)
    
    # Add some missing indexes for performance
    add_index :users, :role
    add_index :clients, :status
    add_index :projects, :status
    add_index :issues, :status
    add_index :issues, :priority
    add_index :time_logs, :billable
    add_index :time_logs, :start_time
    add_index :addresses, [:addressable_type, :addressable_id]
  end
end
