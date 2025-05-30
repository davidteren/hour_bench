# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_29_205627) do
  create_table "addresses", force: :cascade do |t|
    t.string "street"
    t.string "city"
    t.string "state"
    t.string "zip_code"
    t.string "country"
    t.string "addressable_type", null: false
    t.integer "addressable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["addressable_type", "addressable_id"], name: "index_addresses_on_addressable"
    t.index ["addressable_type", "addressable_id"], name: "index_addresses_on_addressable_type_and_addressable_id"
  end

  create_table "clients", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "phone"
    t.string "company"
    t.integer "status"
    t.integer "organization_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "notes"
    t.index ["organization_id"], name: "index_clients_on_organization_id"
    t.index ["status"], name: "index_clients_on_status"
  end

  create_table "documents", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "document_type"
    t.string "version"
    t.integer "issue_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["issue_id"], name: "index_documents_on_issue_id"
  end

  create_table "issues", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.integer "status"
    t.integer "priority"
    t.integer "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["priority"], name: "index_issues_on_priority"
    t.index ["project_id"], name: "index_issues_on_project_id"
    t.index ["status"], name: "index_issues_on_status"
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "status"
    t.decimal "hourly_rate"
    t.decimal "budget"
    t.integer "client_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_projects_on_client_id"
    t.index ["status"], name: "index_projects_on_status"
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "organization_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_teams_on_organization_id"
  end

  create_table "time_logs", force: :cascade do |t|
    t.datetime "start_time"
    t.datetime "end_time"
    t.integer "duration_minutes"
    t.text "description"
    t.boolean "billable"
    t.decimal "hourly_rate"
    t.integer "user_id", null: false
    t.integer "project_id", null: false
    t.integer "issue_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["billable"], name: "index_time_logs_on_billable"
    t.index ["issue_id"], name: "index_time_logs_on_issue_id"
    t.index ["project_id"], name: "index_time_logs_on_project_id"
    t.index ["start_time"], name: "index_time_logs_on_start_time"
    t.index ["user_id"], name: "index_time_logs_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email_address", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.integer "role"
    t.integer "organization_id"
    t.integer "team_id"
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
    t.index ["organization_id"], name: "index_users_on_organization_id"
    t.index ["role"], name: "index_users_on_role"
    t.index ["team_id"], name: "index_users_on_team_id"
  end

  add_foreign_key "clients", "organizations"
  add_foreign_key "documents", "issues"
  add_foreign_key "issues", "projects"
  add_foreign_key "projects", "clients"
  add_foreign_key "sessions", "users"
  add_foreign_key "teams", "organizations"
  add_foreign_key "time_logs", "issues"
  add_foreign_key "time_logs", "projects"
  add_foreign_key "time_logs", "users"
  add_foreign_key "users", "organizations"
  add_foreign_key "users", "teams"
end
