require "playwright_helper"

class ApplicationExplorationTest < PlaywrightTestCase
  test "explore application pages and document current state" do
    puts "\n=== Starting Application Exploration ==="
    
    # Test root page
    puts "Testing root page..."
    visit "/"
    screenshot "01_root_page"
    puts "Root page title: #{page_title}"
    
    # Check if we're redirected to login
    if @page.url.include?("/session/new")
      puts "Redirected to login page - authentication required"
      screenshot "02_login_page"
      
      # Try to login with seed data
      puts "Attempting to login..."
      fill 'input[name="email_address"]', 'admin@example.com'
      fill 'input[name="password"]', 'password'
      click 'input[type="submit"]'
      
      # Wait for redirect
      sleep 2
      screenshot "03_after_login"
      puts "After login URL: #{@page.url}"
      puts "After login title: #{page_title}"
    end
    
    # Test dashboard
    puts "Testing dashboard..."
    visit "/dashboard"
    screenshot "04_dashboard"
    puts "Dashboard title: #{page_title}"
    
    # Test projects page
    puts "Testing projects page..."
    visit "/projects"
    screenshot "05_projects"
    puts "Projects title: #{page_title}"
    
    # Test time logs page
    puts "Testing time logs page..."
    visit "/time_logs"
    screenshot "06_time_logs"
    puts "Time logs title: #{page_title}"
    
    # Test organizations page (should be missing controller)
    puts "Testing organizations page..."
    begin
      visit "/organizations"
      screenshot "07_organizations"
      puts "Organizations title: #{page_title}"
    rescue => e
      puts "Organizations page error: #{e.message}"
      screenshot "07_organizations_error"
    end
    
    # Test clients page (should be missing controller)
    puts "Testing clients page..."
    begin
      visit "/clients"
      screenshot "08_clients"
      puts "Clients title: #{page_title}"
    rescue => e
      puts "Clients page error: #{e.message}"
      screenshot "08_clients_error"
    end
    
    # Test users page (should be missing controller)
    puts "Testing users page..."
    begin
      visit "/users"
      screenshot "09_users"
      puts "Users title: #{page_title}"
    rescue => e
      puts "Users page error: #{e.message}"
      screenshot "09_users_error"
    end
    
    # Test reports page (should be missing controller)
    puts "Testing reports page..."
    begin
      visit "/reports"
      screenshot "10_reports"
      puts "Reports title: #{page_title}"
    rescue => e
      puts "Reports page error: #{e.message}"
      screenshot "10_reports_error"
    end
    
    puts "\n=== Application Exploration Complete ==="
    puts "Screenshots saved to tmp/screenshots/"
  end
  
  test "check for console errors on main pages" do
    puts "\n=== Checking for Console Errors ==="
    
    # Collect console messages
    console_messages = []
    @page.on('console', ->(msg) { 
      console_messages << "#{msg.type}: #{msg.text}"
      puts "Console #{msg.type}: #{msg.text}"
    })
    
    # Visit main pages and check for errors
    pages_to_test = [
      "/",
      "/dashboard", 
      "/projects",
      "/time_logs"
    ]
    
    pages_to_test.each do |path|
      puts "Checking console errors for #{path}..."
      visit path
      sleep 1 # Wait for any async operations
    end
    
    # Report console errors
    error_messages = console_messages.select { |msg| msg.start_with?('error:') }
    if error_messages.any?
      puts "\nConsole Errors Found:"
      error_messages.each { |msg| puts "  - #{msg}" }
    else
      puts "\nNo console errors found on main pages"
    end
  end
end
