# Load Testing Rake Tasks

This document describes the automated load testing rake tasks that can run continuous load tests against the production Hour Bench application.

## Overview

The rake tasks provide two modes of load testing:

- **Light Mode**: Moderate load testing for 30-60 minutes
- **Heavy Mode**: Aggressive load testing for 1-2 hours

Both modes automatically spawn, monitor, and respawn test processes to maintain continuous load on the production system.

## Prerequisites

1. **Playwright Configuration**: Ensure `playwright.config.js` is configured for production testing
2. **Production Access**: Verify access to https://hour-bench.onrender.com/
3. **AppSignal Monitoring**: Confirm AppSignal is active to capture metrics

## Available Commands

### Start Light Load Testing
```bash
rake load_test:light
```

**Duration**: 45 minutes  
**Worker Count**: 2-3 workers per test  
**Test Coverage**: 
- Public pages (landing, responsive, browsing)
- Authenticated users (regular users, admins)
- Light concurrent user simulation

**Characteristics**:
- Moderate system load
- Automatic process respawning
- Priority-based test execution
- Safe for regular use

### Start Heavy Load Testing
```bash
rake load_test:heavy
```

**Duration**: 90 minutes  
**Worker Count**: 2-6 workers per test  
**Test Coverage**:
- All light mode tests with higher worker counts
- High-traffic simulation
- Stress testing scenarios
- Database-intensive operations

**Characteristics**:
- Aggressive system load
- More frequent respawning
- All priority levels active
- Coordinate with team before use

### Stop All Load Tests
```bash
rake load_test:stop
```

Immediately stops all running Playwright load testing processes.

### Check Load Test Status
```bash
rake load_test:status
```

Shows currently running Playwright processes and their details.

## Test Configuration

### Light Mode Tests
| Test | Workers | Priority | Description |
|------|---------|----------|-------------|
| `public/landing-page.spec.js` | 2 | High | Landing page traffic simulation |
| `public/responsive.spec.js` | 2 | Medium | Responsive behavior testing |
| `public/public-browsing.spec.js` | 1 | Medium | Public page browsing patterns |
| `authenticated/regular-user.spec.js` | 2 | High | Regular user workflows |
| `authenticated/system-admin.spec.js` | 1 | Low | System admin operations |
| `authenticated/org-admin.spec.js` | 1 | Medium | Organization admin workflows |
| `authenticated/team-admin.spec.js` | 1 | Medium | Team admin operations |
| `authenticated/freelancer.spec.js` | 1 | Low | Freelancer scenarios |
| `load/concurrent-users.spec.js` | 3 | High | Concurrent user simulation |

### Heavy Mode Tests
All light mode tests plus:
| Test | Workers | Priority | Description |
|------|---------|----------|-------------|
| `load/high-traffic.spec.js` | 3 | High | High-traffic area simulation |
| `load/stress-test.spec.js` | 2 | High | System stress testing |

*Note: Heavy mode uses higher worker counts for all tests*

## Features

### Automatic Process Management
- **Spawning**: Tests are spawned automatically with staggered delays
- **Monitoring**: Continuous monitoring of process health
- **Respawning**: Automatic respawning when tests complete
- **Priority-based**: High priority tests respawn more frequently

### Output Suppression
- Test output is suppressed to avoid console spam
- Only rake task status updates are shown
- Process management messages are displayed

### Signal Handling
- Graceful shutdown on Ctrl+C (SIGINT)
- Proper cleanup on termination (SIGTERM)
- All child processes are properly terminated

### Statistics Tracking
- Total processes spawned
- Total test runs completed
- Active process count
- Error tracking and reporting

## Usage Examples

### Start a Light Load Testing Session
```bash
# Start light load testing
rake load_test:light

# Output:
🚀 Starting LIGHT load testing campaign...
⏱️  Duration: 30-60 minutes
🎯 Target: https://hour-bench.onrender.com
📊 Mode: Continuous execution with process respawning

🎬 Load testing started at 2024-01-15 14:30:00
🏁 Will run until 2024-01-15 15:15:00
⏱️  Total duration: 45 minutes

🚀 Spawning initial test processes...
🎯 Spawning: public/landing-page.spec.js (2 workers) [test_1]
🎯 Spawning: public/responsive.spec.js (2 workers) [test_2]
...
```

### Monitor Running Tests
```bash
rake load_test:status

# Output:
📊 Active Playwright processes: 12
   PID 12345: npx playwright test public/landing-page.spec.js --workers=2
   PID 12346: npx playwright test authenticated/regular-user.spec.js --workers=2
   ...
```

### Stop All Tests
```bash
rake load_test:stop

# Output:
🛑 Stopping all load testing processes...
🔍 Finding Playwright processes...
🛑 Found 12 Playwright processes to stop
   Stopped process 12345
   Stopped process 12346
   ...
✅ All load testing processes stopped
```

## Monitoring and Metrics

### AppSignal Integration
The load tests are designed to trigger AppSignal monitoring:
- Response time metrics
- Error rate tracking
- Database performance
- Resource utilization

### Status Updates
Status updates are printed every 5 minutes during execution:
```
📊 === STATUS UPDATE (15m elapsed, 30m remaining) ===
🏃 Active processes: 9
🔢 Total processes spawned: 23
✅ Total test runs completed: 14
🎯 Mode: LIGHT
```

### Final Statistics
Comprehensive statistics are shown at completion:
```
📈 === FINAL LOAD TESTING STATISTICS ===
⏱️  Total duration: 45 minutes
🔢 Total processes spawned: 67
✅ Total test runs completed: 45
🎯 Mode: LIGHT
📊 Average test runs per minute: 1.0
🎉 Load testing campaign completed successfully!
```

## Best Practices

1. **Coordinate Heavy Testing**: Always coordinate with the team before running heavy load tests
2. **Monitor AppSignal**: Keep AppSignal dashboard open during testing
3. **Check System Resources**: Monitor server CPU, memory, and database connections
4. **Start with Light Mode**: Begin with light mode to establish baseline performance
5. **Use During Off-Hours**: Run heavy tests during low-traffic periods

## Troubleshooting

### Common Issues

**Playwright Not Found**
```bash
# Install Playwright if needed
npm install @playwright/test
npx playwright install
```

**Configuration Errors**
- Verify `playwright.config.js` points to production
- Check that test files exist in `script/playwright/production/`

**Permission Errors**
- Ensure proper file permissions for spawning processes
- Check that the user can create background processes

### Emergency Stop
If tests need to be stopped immediately:
```bash
# Use the rake task
rake load_test:stop

# Or manually kill processes
pkill -f "playwright.*production"
```

## Integration with CI/CD

The rake tasks can be integrated into CI/CD pipelines for automated load testing:

```yaml
# Example GitHub Actions workflow
- name: Run Load Tests
  run: |
    timeout 3600 rake load_test:heavy || true
    rake load_test:stop
```

## Support

For questions or issues:
- Check AppSignal dashboard for system metrics
- Review rake task output for error messages
- Coordinate with development team for heavy load testing
- Document findings for future reference
