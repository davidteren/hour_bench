class AddNotesToClients < ActiveRecord::Migration[8.0]
  def change
    add_column :clients, :notes, :text
  end
end
