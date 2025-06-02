# Load Testing Rake Tasks for Production Environment
# Usage:
#   rake load_test:light    # Light load testing (30-60 minutes)
#   rake load_test:heavy    # Heavy load testing (1-2 hours)
#   rake load_test:stop     # Stop all running load tests

namespace :load_test do
  desc "Run light load testing for 30-60 minutes"
  task :light do
    puts "🚀 Starting LIGHT load testing campaign..."
    puts "⏱️  Duration: 30-60 minutes"
    puts "🎯 Target: https://hour-bench.onrender.com"
    puts "📊 Mode: Continuous execution with process respawning"
    puts ""

    duration_minutes = 45 # 45 minutes for light mode
    LoadTestRunner.new(mode: :light, duration_minutes: duration_minutes).start
  end

  desc "Run heavy load testing for 1-2 hours"
  task :heavy do
    puts "🔥 Starting HEAVY load testing campaign..."
    puts "⏱️  Duration: 1-2 hours"
    puts "🎯 Target: https://hour-bench.onrender.com"
    puts "📊 Mode: Aggressive concurrent execution with high worker counts"
    puts ""

    duration_minutes = 90 # 90 minutes for heavy mode
    LoadTestRunner.new(mode: :heavy, duration_minutes: duration_minutes).start
  end

  desc "Stop all running load tests"
  task :stop do
    puts "🛑 Stopping all load testing processes..."
    LoadTestRunner.stop_all_tests
  end

  desc "Show status of running load tests"
  task :status do
    puts "📊 Load Testing Status:"
    LoadTestRunner.show_status
  end
end

class LoadTestRunner
  LIGHT_TEST_CONFIGS = [
    { test: "public/landing-page.spec.js", workers: 2, priority: :high },
    { test: "public/responsive.spec.js", workers: 2, priority: :medium },
    { test: "public/public-browsing.spec.js", workers: 1, priority: :medium },
    { test: "authenticated/regular-user.spec.js", workers: 2, priority: :high },
    { test: "authenticated/system-admin.spec.js", workers: 1, priority: :low },
    { test: "authenticated/org-admin.spec.js", workers: 1, priority: :medium },
    { test: "authenticated/team-admin.spec.js", workers: 1, priority: :medium },
    { test: "authenticated/freelancer.spec.js", workers: 1, priority: :low },
    { test: "load/concurrent-users.spec.js", workers: 3, priority: :high }
  ].freeze

  HEAVY_TEST_CONFIGS = [
    { test: "public/landing-page.spec.js", workers: 4, priority: :high },
    { test: "public/responsive.spec.js", workers: 3, priority: :medium },
    { test: "public/public-browsing.spec.js", workers: 2, priority: :medium },
    { test: "authenticated/regular-user.spec.js", workers: 3, priority: :high },
    { test: "authenticated/system-admin.spec.js", workers: 2, priority: :medium },
    { test: "authenticated/org-admin.spec.js", workers: 2, priority: :medium },
    { test: "authenticated/team-admin.spec.js", workers: 2, priority: :medium },
    { test: "authenticated/freelancer.spec.js", workers: 2, priority: :low },
    { test: "load/concurrent-users.spec.js", workers: 5, priority: :high },
    { test: "load/high-traffic.spec.js", workers: 3, priority: :high },
    { test: "load/stress-test.spec.js", workers: 2, priority: :high }
  ].freeze

  def initialize(mode:, duration_minutes:)
    @mode = mode
    @duration_minutes = duration_minutes
    @start_time = Time.current
    @end_time = @start_time + duration_minutes.minutes
    @running_processes = {}
    @process_counter = 0
    @stats = {
      total_processes_spawned: 0,
      total_test_runs: 0,
      current_active_processes: 0,
      errors: []
    }

    setup_signal_handlers
    ensure_playwright_config
  end

  def start
    puts "🎬 Load testing started at #{@start_time.strftime('%Y-%m-%d %H:%M:%S')}"
    puts "🏁 Will run until #{@end_time.strftime('%Y-%m-%d %H:%M:%S')}"
    puts "⏱️  Total duration: #{@duration_minutes} minutes"
    puts ""

    # Start initial batch of tests
    spawn_initial_tests

    # Main monitoring loop
    monitor_and_respawn_tests

    puts ""
    puts "✅ Load testing campaign completed!"
    print_final_stats
  end

  def self.stop_all_tests
    puts "🔍 Finding Playwright processes..."

    # Find all playwright processes
    playwright_pids = `pgrep -f "playwright.*production"`.split("\n").map(&:strip).reject(&:empty?)

    if playwright_pids.empty?
      puts "✅ No Playwright load testing processes found"
      return
    end

    puts "🛑 Found #{playwright_pids.length} Playwright processes to stop"

    playwright_pids.each do |pid|
      begin
        Process.kill("TERM", pid.to_i)
        puts "   Stopped process #{pid}"
      rescue Errno::ESRCH
        puts "   Process #{pid} already stopped"
      rescue => e
        puts "   Error stopping process #{pid}: #{e.message}"
      end
    end

    # Wait a moment then force kill any remaining
    sleep 2
    remaining_pids = `pgrep -f "playwright.*production"`.split("\n").map(&:strip).reject(&:empty?)

    if remaining_pids.any?
      puts "🔨 Force killing #{remaining_pids.length} remaining processes"
      remaining_pids.each do |pid|
        begin
          Process.kill("KILL", pid.to_i)
          puts "   Force killed process #{pid}"
        rescue => e
          puts "   Error force killing process #{pid}: #{e.message}"
        end
      end
    end

    puts "✅ All load testing processes stopped"
  end

  def self.show_status
    playwright_pids = `pgrep -f "playwright.*production"`.split("\n").map(&:strip).reject(&:empty?)

    if playwright_pids.empty?
      puts "📊 No active load testing processes"
      return
    end

    puts "📊 Active Playwright processes: #{playwright_pids.length}"

    playwright_pids.each do |pid|
      begin
        cmd = `ps -p #{pid} -o command=`.strip
        puts "   PID #{pid}: #{cmd}"
      rescue => e
        puts "   PID #{pid}: Unable to get command (#{e.message})"
      end
    end
  end

  private

  def test_configs
    @mode == :light ? LIGHT_TEST_CONFIGS : HEAVY_TEST_CONFIGS
  end

  def setup_signal_handlers
    # Handle Ctrl+C gracefully
    Signal.trap("INT") do
      puts "\n🛑 Received interrupt signal. Stopping all tests..."
      stop_all_running_processes
      exit(0)
    end

    Signal.trap("TERM") do
      puts "\n🛑 Received termination signal. Stopping all tests..."
      stop_all_running_processes
      exit(0)
    end
  end

  def ensure_playwright_config
    config_path = Rails.root.join("playwright.config.js")
    unless File.exist?(config_path)
      puts "❌ playwright.config.js not found. Please ensure Playwright is configured for production testing."
      exit(1)
    end

    # Verify the config points to production
    config_content = File.read(config_path)
    unless config_content.include?("hour-bench.onrender.com") || config_content.include?("script/playwright/production")
      puts "⚠️  Warning: playwright.config.js may not be configured for production testing"
    end
  end

  def spawn_initial_tests
    puts "🚀 Spawning initial test processes..."

    test_configs.each do |config|
      spawn_test_process(config)
      sleep(0.5) # Small delay to avoid overwhelming the system
    end

    puts "✅ Initial #{test_configs.length} test processes spawned"
    puts ""
  end

  def spawn_test_process(config)
    @process_counter += 1
    process_id = "test_#{@process_counter}"

    command = build_playwright_command(config)

    puts "🎯 Spawning: #{config[:test]} (#{config[:workers]} workers) [#{process_id}]"

    # Spawn process in background with output suppressed
    pid = spawn(command,
                out: "/dev/null",
                err: "/dev/null",
                pgroup: true)

    @running_processes[process_id] = {
      pid: pid,
      config: config,
      started_at: Time.current,
      respawn_count: 0
    }

    @stats[:total_processes_spawned] += 1
    @stats[:current_active_processes] += 1

    # Detach the process so we don't wait for it
    Process.detach(pid)
  end

  def build_playwright_command(config)
    base_cmd = "npx playwright test #{config[:test]} --workers=#{config[:workers]}"

    # Add additional flags for production testing
    flags = [
      "--reporter=dot",  # Minimal output
      "--quiet",         # Suppress verbose output
      "--timeout=60000"  # 60 second timeout
    ]

    "#{base_cmd} #{flags.join(' ')}"
  end

  def monitor_and_respawn_tests
    puts "👀 Starting monitoring loop..."
    puts "🔄 Tests will be respawned automatically when they complete"
    puts ""

    last_status_update = Time.current

    while Time.current < @end_time
      # Check for completed processes and respawn
      check_and_respawn_processes

      # Print status update every 5 minutes
      if Time.current - last_status_update > 5.minutes
        print_status_update
        last_status_update = Time.current
      end

      # Sleep for a bit before next check
      sleep(10)
    end

    puts "⏰ Time limit reached. Stopping all processes..."
    stop_all_running_processes
  end

  def check_and_respawn_processes
    completed_processes = []

    @running_processes.each do |process_id, process_info|
      pid = process_info[:pid]

      # Check if process is still running
      begin
        Process.getpgid(pid)
        # Process is still running
      rescue Errno::ESRCH
        # Process has completed
        completed_processes << process_id
      end
    end

    # Respawn completed processes
    completed_processes.each do |process_id|
      respawn_process(process_id)
    end
  end

  def respawn_process(process_id)
    process_info = @running_processes[process_id]
    config = process_info[:config]

    # Update stats
    @stats[:total_test_runs] += 1
    @stats[:current_active_processes] -= 1

    # Determine if we should respawn based on priority and mode
    should_respawn = should_respawn_process?(config, process_info)

    if should_respawn
      # Wait a bit before respawning to avoid overwhelming
      sleep_time = calculate_respawn_delay(config[:priority])
      sleep(sleep_time)

      # Respawn the process
      new_process_info = process_info.dup
      new_process_info[:respawn_count] += 1

      @running_processes.delete(process_id)
      spawn_test_process(config)

      puts "🔄 Respawned: #{config[:test]} (respawn ##{new_process_info[:respawn_count]})"
    else
      @running_processes.delete(process_id)
      puts "⏹️  Not respawning: #{config[:test]} (priority: #{config[:priority]})"
    end
  end

  def should_respawn_process?(config, process_info)
    # Always respawn high priority tests
    return true if config[:priority] == :high

    # For medium priority, respawn less frequently in light mode
    if config[:priority] == :medium
      return @mode == :heavy || process_info[:respawn_count] < 3
    end

    # For low priority, only respawn in heavy mode and limit respawns
    if config[:priority] == :low
      return @mode == :heavy && process_info[:respawn_count] < 2
    end

    true
  end

  def calculate_respawn_delay(priority)
    case priority
    when :high
      rand(5..15)    # 5-15 seconds
    when :medium
      rand(15..30)   # 15-30 seconds
    when :low
      rand(30..60)   # 30-60 seconds
    else
      10
    end
  end

  def print_status_update
    elapsed_minutes = ((Time.current - @start_time) / 1.minute).round
    remaining_minutes = ((@end_time - Time.current) / 1.minute).round

    puts ""
    puts "📊 === STATUS UPDATE (#{elapsed_minutes}m elapsed, #{remaining_minutes}m remaining) ==="
    puts "🏃 Active processes: #{@stats[:current_active_processes]}"
    puts "🔢 Total processes spawned: #{@stats[:total_processes_spawned]}"
    puts "✅ Total test runs completed: #{@stats[:total_test_runs]}"

    if @stats[:errors].any?
      puts "❌ Recent errors: #{@stats[:errors].last(3).join(', ')}"
    end

    puts "🎯 Mode: #{@mode.upcase}"
    puts ""
  end

  def print_final_stats
    total_duration = ((Time.current - @start_time) / 1.minute).round

    puts ""
    puts "📈 === FINAL LOAD TESTING STATISTICS ==="
    puts "⏱️  Total duration: #{total_duration} minutes"
    puts "🔢 Total processes spawned: #{@stats[:total_processes_spawned]}"
    puts "✅ Total test runs completed: #{@stats[:total_test_runs]}"
    puts "🎯 Mode: #{@mode.upcase}"
    puts "📊 Average test runs per minute: #{(@stats[:total_test_runs].to_f / total_duration).round(2)}"

    if @stats[:errors].any?
      puts "❌ Total errors encountered: #{@stats[:errors].length}"
      puts "   Recent errors: #{@stats[:errors].last(5).join(', ')}"
    end

    puts ""
    puts "🎉 Load testing campaign completed successfully!"
    puts "📊 Check AppSignal dashboard for performance metrics and insights"
    puts ""
  end

  def stop_all_running_processes
    return if @running_processes.empty?

    puts "🛑 Stopping #{@running_processes.length} running processes..."

    @running_processes.each do |process_id, process_info|
      begin
        # Kill the process group to ensure all child processes are terminated
        Process.kill("TERM", -process_info[:pid])
        puts "   Stopped #{process_id} (PID: #{process_info[:pid]})"
      rescue Errno::ESRCH
        puts "   Process #{process_id} already stopped"
      rescue => e
        puts "   Error stopping #{process_id}: #{e.message}"
        @stats[:errors] << "Stop error: #{e.message}"
      end
    end

    # Wait a moment for graceful shutdown
    sleep(2)

    # Force kill any remaining processes
    @running_processes.each do |process_id, process_info|
      begin
        Process.kill("KILL", -process_info[:pid])
      rescue Errno::ESRCH
        # Already stopped
      rescue => e
        puts "   Error force killing #{process_id}: #{e.message}"
      end
    end

    @running_processes.clear
    @stats[:current_active_processes] = 0

    puts "✅ All processes stopped"
  end
end
