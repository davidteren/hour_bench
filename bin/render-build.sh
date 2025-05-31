#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies and prepare application
bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean

# Set up database
bundle exec rails db:prepare

# Seed the production database (reset and seed if needed)
if [ "$RESET_DATABASE" = "true" ]; then
  echo "Resetting database and seeding fresh data..."
  bundle exec rails db:reset db:seed
else
  echo "Running normal seed operation, set RESET_DATABASE=true if you need a fresh database"
  # Use db:seed with a rescue to ignore duplicate records
  bundle exec rails runner 'Rails.logger.level = :error; begin; Rails.application.load_seed; rescue ActiveRecord::RecordInvalid => e; puts "Skipping duplicate records: #{e.message}"; end'

echo "Build completed successfully with database seeding"
