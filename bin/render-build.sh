#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies and prepare application
bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean

# Set up database
bundle exec rails db:prepare

# Seed the production database
bundle exec rails db:seed

echo "Build completed successfully with database seeding"
