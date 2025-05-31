# Snapshot Branches - Usage Guide

This guide explains how to use the HourBench snapshot branches for testing, comparison, and educational purposes.

## Quick Start

### Using the Baseline Snapshot

```bash
# Clone the repository (if not already done)
git clone https://github.com/davidteren/hour_bench.git
cd hour_bench

# Switch to the baseline snapshot
git checkout snapshot/2025-01-15/baseline-with-known-issues

# Set up the environment
bundle install
rails db:create db:migrate db:seed

# Run the application with test credentials
SHOW_TEST_CREDENTIALS=true bin/dev

# In another terminal, run tests
rails test
npx playwright test
```

## Use Cases

### 1. LLM Testing & Evaluation

Test agentic coding tools against a known baseline with documented issues:

```bash
# Start from the baseline
git checkout snapshot/2025-01-15/baseline-with-known-issues

# Create a new branch for your LLM test
git checkout -b test/llm-optimization-$(date +%Y%m%d)

# Apply your LLM's suggested changes
# ... make changes ...

# Test the results
rails test
bin/dev  # Check if app still works

# Compare performance
# Use AppSignal dashboard or custom benchmarks
```

### 2. Performance Optimization Benchmarking

Measure the impact of performance improvements:

```bash
# Baseline measurement
git checkout snapshot/2025-01-15/baseline-with-known-issues
# Record metrics: page load times, query counts, memory usage

# Apply optimizations
git checkout -b optimize/fix-n-plus-one-queries
# Make your optimizations

# Compare results
# Document improvements in performance metrics
```

### 3. Educational Demonstrations

Show students/developers common Rails anti-patterns:

```bash
# Start with the problematic baseline
git checkout snapshot/2025-01-15/baseline-with-known-issues

# Demonstrate issues:
# 1. Open app/models/client.rb - show N+1 in total_hours method
# 2. Open app/models/project.rb - show N+1 in recent_activity method
# 3. Check db/schema.rb - show missing indexes
# 4. Run the app and monitor AppSignal for performance issues
```

## Key Areas to Examine

### N+1 Query Examples

**Client Model** (`app/models/client.rb`, lines 18-27):
```ruby
def total_hours
  # Intentional N+1 query for performance demonstration
  projects.sum { |project| project.time_logs.sum(:duration_minutes) }
end
```

**Project Model** (`app/models/project.rb`, lines 41-50):
```ruby
def recent_activity
  time_logs.order(created_at: :desc).limit(10).map do |log|
    {
      user: log.user.name,  # N+1 here - no eager loading
      description: log.description,
      duration: log.duration_minutes,
      created_at: log.created_at
    }
  end
end
```

### Missing Database Indexes

Check `db/schema.rb` for foreign key columns without indexes:
- Look for `_id` columns that lack corresponding `add_index` statements
- Common missing indexes: `user_id`, `project_id`, `client_id`, `organization_id`

### Error-Prone Areas

**Potential Nil References**:
- Views that don't guard against nil objects
- Calculations that might divide by zero
- Missing validations that could cause constraint violations

## Performance Monitoring

The baseline includes AppSignal integration. When testing:

1. **Monitor the Dashboard**: Check for N+1 query alerts and slow queries
2. **Memory Usage**: Watch for memory spikes during large data operations
3. **Error Rates**: Track any errors that occur during testing

### AppSignal Setup

```bash
# AppSignal is already configured in the baseline
# Check config/appsignal.rb for settings
# Monitor at: https://appsignal.com (if you have access)
```

## Testing Workflows

### Before/After Comparison

```bash
# 1. Baseline measurement
git checkout snapshot/2025-01-15/baseline-with-known-issues
# Run your performance tests and record metrics

# 2. Apply changes
git checkout -b your-optimization-branch
# Make your improvements

# 3. Measure improvements
# Run the same tests and compare results
# Document the differences
```

### Regression Testing

```bash
# Ensure your changes don't break existing functionality
git checkout your-optimization-branch

# Run full test suite
rails test

# Run E2E tests
npx playwright test

# Manual testing with test users
SHOW_TEST_CREDENTIALS=true bin/dev
# Login with: admin@hourbench.com / password123
```

## Test Data

The baseline includes comprehensive seed data:

### Test Users (password: password123)
- **System Admin**: admin@hourbench.com
- **Org Admin**: alice.johnson@techsolutions.com  
- **Team Admin**: david.brown@techsolutions.com
- **User**: grace.lee@techsolutions.com
- **Freelancer**: blake.freeman@freelance.com

### Sample Data
- Multiple organizations with teams and users
- Clients with various project types
- Time logs with different patterns
- Issues and documents for testing

## Common Testing Scenarios

### 1. Dashboard Performance
```bash
# Login as admin@hourbench.com
# Navigate to dashboard
# Monitor query count and load time
# Check for N+1 queries in organization metrics
```

### 2. Project Listing Performance
```bash
# Navigate to Projects page
# Check for N+1 queries when loading client information
# Test search and filtering performance
```

### 3. Time Tracking Performance
```bash
# Navigate to Time Logs
# Start/stop timers
# Check for efficient queries when loading project/issue data
```

## Documentation

- **CHANGELOG.md**: Track major changes and snapshot creation
- **BRANCH_LOG.md**: Detailed information about each snapshot branch
- **PROJECT_SUMMARY.md**: Overall project status and branching strategy

## Contributing

When creating new snapshot branches:

1. **Follow Naming Convention**: `snapshot/{YYYY-MM-DD}/{milestone-type}-{description}`
2. **Document Purpose**: Update BRANCH_LOG.md with detailed information
3. **Test the Snapshot**: Ensure it works correctly before documenting
4. **Update Documentation**: Keep all docs current with new branches

## Troubleshooting

### Common Issues

**Database Issues**:
```bash
# Reset database if needed
rails db:drop db:create db:migrate db:seed
```

**Missing Dependencies**:
```bash
# Reinstall gems
bundle install
# Reinstall npm packages
npm install
```

**AppSignal Not Working**:
- Check if you have access to the AppSignal account
- Verify config/appsignal.rb settings
- Check logs for AppSignal connection issues

### Getting Help

- Check the main README.md for basic setup
- Review PROJECT_SUMMARY.md for project overview
- Examine DEVELOPMENT.md for detailed technical information
- Look at existing test files for examples
