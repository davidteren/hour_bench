#!/usr/bin/env bash
# exit on error
set -o errexit

# Run setup script
./bin/setup-render.sh

# Install dependencies and prepare application
bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean

# Set up database
bundle exec rails db:prepare

# Seed the production database
bundle exec rails db:seed

echo "Build completed successfully with database seeding"
