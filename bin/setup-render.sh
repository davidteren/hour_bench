#!/usr/bin/env bash
# Script to prepare directories for SQLite in Render environment
set -o errexit

# Create necessary directories
mkdir -p db
mkdir -p tmp/pids
mkdir -p log

# Ensure correct permissions
chmod -R 755 db
chmod -R 755 tmp
chmod -R 755 log

echo "Setup completed successfully for Render deployment"
