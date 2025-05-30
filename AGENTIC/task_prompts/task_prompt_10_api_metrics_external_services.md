# Augment-Optimized Task: API Metrics & External Service Integration

## Project Context
**Technology Stack**: Rails 8.3 + Solid Queue, AppSignal monitoring, Custom CSS  
**Learning Purpose**: Simulate real-world API consumption with performance challenges  
**Performance Goals**: Implement caching strategies, error handling, and monitoring for external API calls  
**Educational Value**: Demonstrate API integration patterns, caching strategies, and performance optimization  

## Task Overview
Create external API consumption system with intentionally variable performance characteristics, comprehensive metrics tracking, caching strategies, and monitoring integration to simulate real-world API challenges and optimization opportunities.

## Augment Agent Optimization Framework

### Phase 1: Current Architecture & Monitoring Analysis
**Use codebase-retrieval to understand existing patterns:**
- "API integration, HTTP clients, external services, monitoring"
- "AppSignal integration, performance monitoring, metrics tracking"
- "caching, Rails cache, Solid Cache, cache strategies"
- "background jobs, Solid Queue, job processing, error handling"

**Analyze current infrastructure:**
- Existing HTTP client usage and patterns
- AppSignal configuration and custom metrics
- Caching implementation and strategies
- Background job processing capabilities

**Use view tool to examine:**
- Current monitoring and metrics dashboard
- Existing API integration patterns (if any)
- Cache configuration and usage
- Background job implementations

### Phase 2: External Service Architecture Design
**Design comprehensive API integration system:**

**Mock External Services (Sinatra-based):**
1. **Analytics Service**: Slow response times, occasional timeouts
2. **Reporting Service**: Variable latency, rate limiting
3. **Notification Service**: Intermittent failures, retry scenarios
4. **Data Sync Service**: Large payloads, memory pressure
5. **Authentication Service**: Fast but with occasional downtime

**Performance Characteristics:**
- **Intentional Latency**: 500ms to 5s response times
- **Failure Scenarios**: 5-10% failure rate with different error types
- **Rate Limiting**: Simulate API quotas and throttling
- **Memory Pressure**: Large response payloads for optimization learning

### Phase 3: API Client Implementation with Monitoring
**Create comprehensive API client with metrics:**

**Base API client with monitoring:**
```ruby
class ApiClient
  include HTTParty
  
  def initialize(service_name)
    @service_name = service_name
    @base_uri = Rails.application.credentials.dig(:external_apis, service_name.to_sym, :base_uri)
  end
  
  def get(endpoint, options = {})
    track_api_call(endpoint, 'GET') do
      response = self.class.get("#{@base_uri}#{endpoint}", options.merge(timeout: 10))
      handle_response(response)
    end
  end
  
  private
  
  def track_api_call(endpoint, method)
    start_time = Time.current
    
    begin
      result = yield
      track_success_metrics(endpoint, method, start_time)
      result
    rescue => error
      track_error_metrics(endpoint, method, start_time, error)
      raise
    end
  end
  
  def track_success_metrics(endpoint, method, start_time)
    duration = (Time.current - start_time) * 1000
    
    AppSignal.increment_counter('api.requests.total', 1, {
      service: @service_name,
      endpoint: endpoint,
      method: method,
      status: 'success'
    })
    
    AppSignal.add_distribution_value('api.request.duration', duration, {
      service: @service_name,
      endpoint: endpoint
    })
  end
end
```

**Service-specific clients:**
```ruby
class AnalyticsApiClient < ApiClient
  def initialize
    super('analytics')
  end
  
  def get_project_metrics(project_id, date_range = 30.days)
    cache_key = "analytics:project:#{project_id}:#{date_range.to_i}"
    
    Rails.cache.fetch(cache_key, expires_in: 1.hour) do
      get("/projects/#{project_id}/metrics", {
        query: { days: date_range.to_i }
      })
    end
  rescue => error
    Rails.logger.error "Analytics API error: #{error.message}"
    AppSignal.send_error(error)
    fallback_project_metrics(project_id)
  end
end
```

### Phase 4: Caching Strategy Implementation
**Implement multi-layer caching system:**

**Cache hierarchy:**
1. **Memory Cache**: Fast access for frequently used data
2. **Redis Cache**: Shared cache across application instances
3. **Database Cache**: Fallback data storage for offline scenarios
4. **CDN Cache**: Static API responses and assets

**Intelligent cache management:**
```ruby
class ApiCacheManager
  CACHE_STRATEGIES = {
    analytics: { ttl: 1.hour, fallback: true },
    reporting: { ttl: 30.minutes, fallback: true },
    notifications: { ttl: 5.minutes, fallback: false },
    data_sync: { ttl: 4.hours, fallback: true }
  }
  
  def self.fetch_with_fallback(service, key, &block)
    strategy = CACHE_STRATEGIES[service.to_sym]
    
    begin
      Rails.cache.fetch(key, expires_in: strategy[:ttl]) do
        yield
      end
    rescue => error
      if strategy[:fallback]
        fetch_fallback_data(service, key)
      else
        raise error
      end
    end
  end
  
  def self.invalidate_cache(service, pattern = nil)
    if pattern
      Rails.cache.delete_matched("#{service}:#{pattern}*")
    else
      Rails.cache.delete_matched("#{service}:*")
    end
    
    AppSignal.increment_counter('cache.invalidation', 1, {
      service: service,
      pattern: pattern
    })
  end
end
```

### Phase 5: Background Job Integration
**Implement background API processing:**

**API data synchronization job:**
```ruby
class ApiDataSyncJob < ApplicationJob
  queue_as :api_sync
  retry_on StandardError, wait: :exponentially_longer, attempts: 3
  
  def perform(service_name, sync_type, options = {})
    client = api_client_for(service_name)
    
    case sync_type
    when 'project_metrics'
      sync_project_metrics(client, options)
    when 'user_analytics'
      sync_user_analytics(client, options)
    when 'system_health'
      sync_system_health(client, options)
    end
  rescue => error
    AppSignal.send_error(error, {
      service: service_name,
      sync_type: sync_type,
      options: options
    })
    raise
  end
  
  private
  
  def sync_project_metrics(client, options)
    projects = Project.where(id: options[:project_ids])
    
    projects.find_each do |project|
      metrics = client.get_project_metrics(project.id)
      update_project_cache(project, metrics)
      
      # Stream updates to dashboard if user is online
      broadcast_metrics_update(project, metrics)
    end
  end
end
```

### Phase 6: Mock External Services (Sinatra)
**Create realistic external services for testing:**

**Analytics service with variable performance:**
```ruby
# external_services/analytics_service.rb
require 'sinatra'
require 'json'

class AnalyticsService < Sinatra::Base
  before do
    content_type :json
    
    # Simulate variable latency
    sleep(rand(0.5..3.0))
    
    # Simulate occasional failures
    if rand < 0.1
      halt 500, { error: 'Internal server error' }.to_json
    end
    
    # Simulate rate limiting
    if rand < 0.05
      halt 429, { error: 'Rate limit exceeded' }.to_json
    end
  end
  
  get '/projects/:id/metrics' do
    project_id = params[:id]
    days = params[:days]&.to_i || 30
    
    # Generate realistic but random metrics
    {
      project_id: project_id,
      period_days: days,
      total_hours: rand(100..1000),
      billable_hours: rand(80..800),
      team_productivity: rand(0.7..0.95).round(2),
      completion_rate: rand(0.8..1.0).round(2),
      generated_at: Time.current.iso8601
    }.to_json
  end
end
```

## Monitoring & Metrics Dashboard

### Custom AppSignal Metrics
**Comprehensive API monitoring:**
- Request count and success rate by service
- Response time distribution and percentiles
- Error rate and error type breakdown
- Cache hit/miss ratios and performance impact
- Background job success/failure rates

### Dashboard Integration
**Real-time API health dashboard:**
```erb
<div class="api-health-dashboard" data-controller="api-metrics">
  <div class="metrics-grid">
    <div class="metric-card">
      <h3>API Response Times</h3>
      <canvas data-api-metrics-target="responseTimeChart"></canvas>
    </div>
    
    <div class="metric-card">
      <h3>Success Rate</h3>
      <div class="success-rate" data-api-metrics-target="successRate">
        <%= @api_metrics[:success_rate] %>%
      </div>
    </div>
    
    <div class="metric-card">
      <h3>Cache Performance</h3>
      <div class="cache-stats">
        Hit Rate: <span data-api-metrics-target="cacheHitRate"><%= @cache_metrics[:hit_rate] %>%</span>
      </div>
    </div>
  </div>
</div>
```

## Performance Optimization Strategies

### Caching Patterns
**Multi-level caching implementation:**
- **L1 Cache**: In-memory for current request
- **L2 Cache**: Redis for shared application cache
- **L3 Cache**: Database for persistent fallback
- **CDN Cache**: Static API responses

### Circuit Breaker Pattern
**Prevent cascade failures:**
```ruby
class ApiCircuitBreaker
  def self.call(service_name, &block)
    circuit = circuits[service_name]
    
    if circuit.open?
      raise CircuitBreakerOpenError, "Circuit breaker open for #{service_name}"
    end
    
    begin
      result = yield
      circuit.record_success
      result
    rescue => error
      circuit.record_failure
      raise
    end
  end
end
```

## Validation & Testing Strategy

### Development Workflow Requirements
- **Branch Management**: Create feature branch `feature/api-metrics-external-services` before starting
- **Commit Strategy**: Make frequent commits with descriptive messages like "Add API client with monitoring" or "Implement external service mocks"
- **Application Startup**: Always use `bin/dev` to start the Rails application for testing
- **Branch Integration**: Merge completed feature branch into `develop` branch before starting next task

### Testing Strategy Requirements
**Comprehensive API Integration Testing:**
- **Unit Tests**: Write Minitest tests for API clients and caching logic
- **Integration Tests**: Test API integration with background jobs and error handling
- **Playwright UI Testing**: Validate API health dashboard and monitoring interface
  ```javascript
  // Example Playwright test for API metrics
  test('API metrics dashboard displays correctly', async ({ page }) => {
    await page.goto('/api-health');
    await page.screenshot({ path: 'api-health-dashboard.png' });

    // Test API response time charts
    await page.waitForSelector('canvas[data-chart="response-times"]');
    await page.screenshot({ path: 'api-response-time-chart.png' });

    // Test cache performance metrics
    await page.click('[data-testid="cache-metrics-tab"]');
    await page.screenshot({ path: 'cache-performance-metrics.png' });

    // Test error handling display
    await page.click('[data-testid="error-logs-tab"]');
    await page.screenshot({ path: 'api-error-logs.png' });
  });
  ```

**UI Development with Playwright:**
- Test API health dashboard and monitoring interface
- Validate real-time metrics updates and charts
- Test error handling and circuit breaker status
- Verify cache performance indicators
- Test responsive design for monitoring dashboard

### Use browser automation for comprehensive testing:
- **Dashboard Loading**: Test API metrics dashboard updates
- **Job Processing**: Verify background API jobs execute correctly
- **Real-Time Updates**: Test API health monitoring functionality
- **Performance**: Measure API integration impact on application performance
- **Error Handling**: Test API failure scenarios and recovery mechanisms

### Use launch-process for testing:
- **External Services**: Always use `bin/dev` to test mock external service integration
- **Background Jobs**: Verify API synchronization job processing
- **Performance Monitoring**: Test with AppSignal integration for API metrics
- **Cache Testing**: Verify multi-layer caching functionality

## Expected Deliverables

### 1. Comprehensive API Integration System
- Multiple API clients with monitoring and error handling
- Caching strategies with fallback mechanisms
- Background job processing for API operations
- Circuit breaker pattern for resilience

### 2. Mock External Services
- Sinatra-based services with realistic performance characteristics
- Variable latency and failure scenarios
- Rate limiting and quota simulation
- Large payload handling for memory pressure testing

### 3. Monitoring & Metrics
- AppSignal integration with custom metrics
- Real-time API health dashboard
- Performance tracking and alerting
- Cache performance monitoring

### 4. Performance Optimization
- Multi-layer caching implementation
- Background processing for heavy operations
- Error handling and retry strategies
- Performance bottleneck identification tools

## Augment-Specific Implementation Strategy

### Tool Usage Optimization
- **codebase-retrieval**: Essential for understanding current monitoring and caching patterns
- **view tool**: Critical for examining AppSignal configuration and existing API patterns
- **str-replace-editor**: Primary tool for implementing API clients and monitoring
- **launch-process**: For testing external services and background job processing
- **browser automation**: For testing dashboard functionality and API integration

### Code Presentation Standards
- Use `<augment_code_snippet path="..." mode="EXCERPT">` for all Ruby and configuration examples
- Show monitoring and caching implementation patterns
- Provide file paths for all API integration components
- Keep code examples focused on specific API integration features

### Safety & Permission Requirements
- **Request permission**: Before setting up external services or modifying monitoring
- **Conservative approach**: Implement with proper error handling and fallback mechanisms
- **Performance testing**: Validate API integration doesn't impact application performance
- **Monitoring validation**: Ensure comprehensive tracking of API performance and errors
- **Branch workflow**: Never work directly on main or develop branches

This Augment-optimized approach ensures systematic implementation of API integration with realistic performance challenges while providing comprehensive monitoring, caching strategies, and optimization opportunities for learning and assessment purposes.
