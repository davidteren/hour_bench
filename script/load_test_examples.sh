#!/bin/bash

# Load Testing Examples Script
# This script provides examples of how to use the load testing rake tasks

echo "🧪 Hour Bench Load Testing Examples"
echo "=================================="
echo ""

# Function to show available commands
show_commands() {
    echo "📋 Available Load Testing Commands:"
    echo ""
    echo "1. Light Load Testing (45 minutes):"
    echo "   rake load_test:light"
    echo ""
    echo "2. Heavy Load Testing (90 minutes):"
    echo "   rake load_test:heavy"
    echo ""
    echo "3. Check Status:"
    echo "   rake load_test:status"
    echo ""
    echo "4. Stop All Tests:"
    echo "   rake load_test:stop"
    echo ""
}

# Function to run light load test
run_light_test() {
    echo "🚀 Starting Light Load Test..."
    echo "⚠️  This will run for 45 minutes. Press Ctrl+C to stop early."
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rake load_test:light
    else
        echo "❌ Cancelled"
    fi
}

# Function to run heavy load test
run_heavy_test() {
    echo "🔥 Starting Heavy Load Test..."
    echo "⚠️  This will run for 90 minutes with aggressive load."
    echo "⚠️  Coordinate with team before running!"
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rake load_test:heavy
    else
        echo "❌ Cancelled"
    fi
}

# Function to show status
show_status() {
    echo "📊 Checking Load Test Status..."
    echo ""
    rake load_test:status
}

# Function to stop tests
stop_tests() {
    echo "🛑 Stopping All Load Tests..."
    echo ""
    rake load_test:stop
}

# Main menu
while true; do
    echo ""
    echo "🎯 What would you like to do?"
    echo ""
    echo "1) Show available commands"
    echo "2) Run light load test (45 min)"
    echo "3) Run heavy load test (90 min)"
    echo "4) Check status"
    echo "5) Stop all tests"
    echo "6) Exit"
    echo ""
    read -p "Choose an option (1-6): " choice
    
    case $choice in
        1)
            show_commands
            ;;
        2)
            run_light_test
            ;;
        3)
            run_heavy_test
            ;;
        4)
            show_status
            ;;
        5)
            stop_tests
            ;;
        6)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please choose 1-6."
            ;;
    esac
done
