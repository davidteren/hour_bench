# Augment-Optimized Task: Background Jobs & Dashboard Streaming

## Project Context
**Technology Stack**: Rails 8.3 + Solid Queue, Hotwire (Turbo Streams), Custom CSS  
**Current Issue**: Dashboard data loading blocks UI, no background processing for heavy operations  
**Rails 8 Features**: Solid Queue for background jobs, Solid Cable for real-time updates  
**Performance Goal**: Improve dashboard responsiveness with streaming data updates  

## Task Overview
Implement background job processing using Rails 8's Solid Queue and real-time dashboard updates using Turbo Streams to improve user experience and application performance.

## Augment Agent Optimization Framework

### Phase 1: Current Dashboard & Performance Analysis
**Use codebase-retrieval to understand existing patterns:**
- "dashboard, metrics, data loading, performance issues, N+1 queries"
- "Solid Queue, background jobs, job processing, Rails 8 features"
- "Turbo Streams, real-time updates, Hotwire, streaming"
- "organization dashboard, system dashboard, user dashboard"

**Analyze current dashboard implementation:**
- Dashboard controller and data loading patterns
- Existing performance bottlenecks and slow queries
- Current metrics calculation and aggregation
- User experience during data loading

**Use view tool to examine:**
- Dashboard views and data presentation
- Current JavaScript and Stimulus controllers
- Existing Turbo configuration
- Performance monitoring setup (AppSignal)

### Phase 2: Background Job Architecture Design
**Design job processing system using Solid Queue:**

**Job Categories:**
1. **Dashboard Data Jobs**: Calculate metrics and analytics
2. **Report Generation Jobs**: Generate complex reports
3. **Data Seeding Jobs**: Continuous data generation for testing
4. **Notification Jobs**: Email and system notifications
5. **Cleanup Jobs**: Data maintenance and optimization

**Job Scheduling Strategy:**
- **Immediate Jobs**: Critical user-facing operations
- **Scheduled Jobs**: Regular data updates (every 5 minutes)
- **Periodic Jobs**: Daily/weekly maintenance tasks
- **On-Demand Jobs**: User-triggered report generation

### Phase 3: Dashboard Streaming Implementation
**Implement real-time dashboard updates:**

**Dashboard Data Job:**
```ruby
class DashboardDataJob < ApplicationJob
  queue_as :dashboard
  
  def perform(user_id, dashboard_type)
    user = User.find(user_id)
    data = DashboardService.new(user).calculate_metrics
    
    # Stream updates to user's dashboard
    Turbo::StreamsChannel.broadcast_replace_to(
      "dashboard_#{user.id}",
      target: "dashboard-metrics",
      partial: "dashboard/metrics",
      locals: { metrics: data }
    )
  end
end
```

**Streaming Dashboard Controller:**
```ruby
class DashboardController < ApplicationController
  def show
    # Show loading state immediately
    @loading = true
    
    # Enqueue background job for data calculation
    DashboardDataJob.perform_later(current_user.id, dashboard_type)
  end
end
```

### Phase 4: Real-Time Data Streaming
**Implement Turbo Streams for live updates:**

**Dashboard view with streaming:**
```erb
<%= turbo_stream_from "dashboard_#{current_user.id}" %>

<div id="dashboard-metrics">
  <% if @loading %>
    <%= render 'dashboard/loading_state' %>
  <% else %>
    <%= render 'dashboard/metrics', metrics: @metrics %>
  <% end %>
</div>
```

**Stimulus controller for real-time updates:**
```javascript
// dashboard_controller.js
import { Controller } from "@hotwire/stimulus"

export default class extends Controller {
  connect() {
    this.startProgressIndicator()
  }
  
  metricsUpdated() {
    this.hideProgressIndicator()
    this.showSuccessAnimation()
  }
}
```

### Phase 5: Continuous Data Seeding Jobs
**Implement background seeding for performance testing:**

**Data Seeding Job:**
```ruby
class DataSeedingJob < ApplicationJob
  queue_as :seeding
  
  def perform
    # Create new organizations, teams, users
    OrganizationSeeder.new.create_random_organization
    
    # Create projects and time logs
    ProjectSeeder.new.create_projects_with_time_logs
    
    # Schedule next run
    DataSeedingJob.set(wait: 5.minutes).perform_later
  end
end
```

**Intelligent Seeding Service:**
```ruby
class OrganizationSeeder
  def create_random_organization
    org = Organization.create!(
      name: Faker::Company.name,
      organization_type: organization_types.sample,
      description: Faker::Company.catch_phrase
    )
    
    create_teams_and_users(org)
    create_projects_and_clients(org)
  end
end
```

## Technical Implementation Details

### Solid Queue Configuration
**Configure background job processing:**
```ruby
# config/application.rb
config.active_job.queue_adapter = :solid_queue

# config/queue.yml
production:
  dispatchers:
    - polling_interval: 1
      batch_size: 500
  workers:
    - queues: dashboard,default
      threads: 3
    - queues: seeding
      threads: 1
```

### Job Monitoring & Management
**Job status tracking and monitoring:**
```ruby
class JobStatus < ApplicationRecord
  belongs_to :user
  
  enum status: { pending: 0, processing: 1, completed: 2, failed: 3 }
  
  def self.track_job(job_class, user, &block)
    status = create!(
      job_class: job_class.name,
      user: user,
      status: :pending
    )
    
    begin
      status.update!(status: :processing)
      yield
      status.update!(status: :completed)
    rescue => e
      status.update!(status: :failed, error_message: e.message)
      raise
    end
  end
end
```

### Performance Optimization
**Optimize dashboard data calculation:**
```ruby
class DashboardService
  def initialize(user)
    @user = user
    @scope = policy_scope_for_user(user)
  end
  
  def calculate_metrics
    Rails.cache.fetch("dashboard_metrics_#{@user.id}", expires_in: 5.minutes) do
      {
        total_projects: @scope.projects.count,
        active_time_logs: @scope.time_logs.active.count,
        this_week_hours: calculate_week_hours,
        recent_activities: recent_activities_optimized
      }
    end
  end
  
  private
  
  def calculate_week_hours
    @scope.time_logs
          .where(start_time: 1.week.ago..Time.current)
          .sum(:duration_minutes) / 60.0
  end
end
```

### Real-Time Progress Indicators
**Show job progress to users:**
```erb
<!-- Loading state with progress -->
<div id="dashboard-loading" class="loading-container">
  <div class="progress-indicator">
    <div class="spinner"></div>
    <p>Loading dashboard data...</p>
    <div class="progress-bar">
      <div class="progress-fill" data-dashboard-target="progress"></div>
    </div>
  </div>
</div>
```

## Job Types & Scheduling

### Dashboard Jobs
- **User Dashboard**: Personal metrics and recent activity
- **Organization Dashboard**: Org-wide analytics and team performance
- **System Dashboard**: Platform-wide statistics and health metrics
- **Team Dashboard**: Team-specific metrics and project status

### Maintenance Jobs
- **Data Cleanup**: Remove old logs and temporary data
- **Cache Warming**: Pre-calculate frequently accessed data
- **Report Archival**: Archive old reports and analytics
- **Performance Monitoring**: Track and report system performance

### Seeding Jobs
- **Organization Creation**: New companies and teams every 5 minutes
- **User Generation**: New users with realistic profiles
- **Project Seeding**: Projects with time logs and activities
- **Client Creation**: New clients with project assignments

## User Experience Enhancements

### Loading States
- **Skeleton Screens**: Show content structure while loading
- **Progress Indicators**: Real-time job progress updates
- **Partial Loading**: Stream individual dashboard sections
- **Error Handling**: Graceful failure with retry options

### Real-Time Updates
- **Live Metrics**: Dashboard updates without page refresh
- **Activity Feeds**: Real-time activity notifications
- **Status Indicators**: Show when data is being updated
- **Background Sync**: Seamless data synchronization

## Validation & Testing Strategy

### Development Workflow Requirements
- **Branch Management**: Create feature branch `feature/background-jobs-dashboard-streaming` before starting
- **Commit Strategy**: Make frequent commits with descriptive messages like "Add dashboard data job" or "Implement Turbo Streams for real-time updates"
- **Application Startup**: Always use `bin/dev` to start the Rails application for testing
- **Branch Integration**: Merge completed feature branch into `develop` branch before starting next task

### Testing Strategy Requirements
**Comprehensive Background Job Testing:**
- **Unit Tests**: Write Minitest tests for job classes and dashboard service logic
- **Integration Tests**: Test job processing and Turbo Streams integration
- **Playwright UI Testing**: Validate real-time dashboard updates and streaming functionality
  ```javascript
  // Example Playwright test for dashboard streaming
  test('dashboard updates in real-time with background jobs', async ({ page }) => {
    await page.goto('/dashboard');
    await page.screenshot({ path: 'dashboard-loading-state.png' });

    // Wait for background job to complete and stream updates
    await page.waitForSelector('[data-testid="dashboard-metrics"]', { timeout: 10000 });
    await page.screenshot({ path: 'dashboard-updated.png' });

    // Test real-time updates
    await page.waitForFunction(() => {
      const element = document.querySelector('[data-testid="live-metrics"]');
      return element && element.textContent.includes('Updated');
    });
    await page.screenshot({ path: 'dashboard-live-updates.png' });
  });
  ```

**UI Development with Playwright:**
- Test dashboard loading states and progress indicators
- Validate real-time updates and Turbo Streams functionality
- Test job status indicators and error handling
- Verify responsive design for streaming dashboard
- Test background job monitoring interface

### Use browser automation for comprehensive testing:
- **Dashboard Loading**: Test streaming dashboard updates
- **Job Processing**: Verify background jobs execute correctly
- **Real-Time Updates**: Test Turbo Streams functionality
- **Performance**: Measure dashboard load time improvements
- **Error Handling**: Test job failure scenarios and recovery

### Use launch-process for testing:
- **Solid Queue**: Always use `bin/dev` to test job queue processing and management
- **Background Jobs**: Verify job execution and scheduling
- **Performance Monitoring**: Test with AppSignal integration
- **Data Seeding**: Verify continuous seeding functionality

## Expected Deliverables

### 1. Background Job System
- Solid Queue configuration and job classes
- Dashboard data calculation jobs
- Continuous data seeding jobs
- Job monitoring and status tracking

### 2. Real-Time Dashboard Streaming
- Turbo Streams integration for live updates
- Streaming dashboard views and partials
- Progress indicators and loading states
- Error handling and retry mechanisms

### 3. Performance Improvements
- Optimized dashboard data calculation
- Caching strategy for frequently accessed data
- Background processing for heavy operations
- Reduced page load times and improved responsiveness

### 4. Monitoring & Management
- Job status tracking and reporting
- Performance monitoring integration
- Error logging and alerting
- Job queue management interface

## Augment-Specific Implementation Strategy

### Tool Usage Optimization
- **codebase-retrieval**: Essential for understanding current dashboard and performance patterns
- **view tool**: Critical for examining existing dashboard views and Hotwire setup
- **str-replace-editor**: Primary tool for implementing jobs, controllers, and streaming views
- **browser automation**: For testing real-time updates and dashboard performance
- **launch-process**: For testing Solid Queue and background job processing

### Code Presentation Standards
- Use `<augment_code_snippet path="..." mode="EXCERPT">` for all Ruby and JavaScript code
- Show before/after comparisons for dashboard performance improvements
- Provide file paths for all job classes and streaming implementations
- Keep code examples focused on specific background processing features

### Safety & Permission Requirements
- **Request permission**: Before configuring background job processing
- **Conservative approach**: Implement with proper error handling and monitoring
- **Performance testing**: Validate job processing doesn't impact application performance
- **Incremental rollout**: Test background jobs with limited scope before full deployment
- **Branch workflow**: Never work directly on main or develop branches

This Augment-optimized approach ensures systematic implementation of background job processing and real-time dashboard streaming while maintaining application performance and providing excellent user experience through responsive, live-updating interfaces.
