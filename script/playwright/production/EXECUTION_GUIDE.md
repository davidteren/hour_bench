# Production Load Testing Execution Guide

This guide provides step-by-step instructions for safely executing load tests against the Hour Bench production environment.

## Prerequisites

1. **Playwright Installation**
   ```bash
   npm install @playwright/test
   npx playwright install
   ```

2. **Production Access**
   - Verify access to https://hour-bench.onrender.com/
   - Confirm test user accounts exist (from seeds.rb)
   - Ensure AppSignal monitoring is active

3. **Team Coordination**
   - Notify team before running load tests
   - Confirm no critical business operations are scheduled
   - Establish communication channel for monitoring

## Execution Phases

### Phase 1: Validation Tests (Safe to run anytime)

Start with these tests to validate the test suite and ensure basic functionality:

```bash
# 1. Test public pages (no authentication required)
npx playwright test script/playwright/production/public/landing-page.spec.js

# 2. Test responsive behavior
npx playwright test script/playwright/production/public/responsive.spec.js

# 3. Test single authenticated user
npx playwright test script/playwright/production/authenticated/regular-user.spec.js --workers=1
```

**Expected Results:**
- All tests should pass
- Response times under 5 seconds
- No console errors or failed requests

### Phase 2: Multi-User Testing (Monitor AppSignal)

Once validation tests pass, proceed with multi-user scenarios:

```bash
# 1. Test different user roles (1 worker each)
npx playwright test script/playwright/production/authenticated/system-admin.spec.js --workers=1
npx playwright test script/playwright/production/authenticated/org-admin.spec.js --workers=1
npx playwright test script/playwright/production/authenticated/team-admin.spec.js --workers=1
npx playwright test script/playwright/production/authenticated/freelancer.spec.js --workers=1

# 2. Light concurrent load (3-5 workers)
npx playwright test script/playwright/production/load/concurrent-users.spec.js --workers=3
```

**Monitoring Points:**
- AppSignal response times
- Database connection count
- Server CPU and memory usage
- Error rates

### Phase 3: Load Testing (Coordinate with team)

⚠️ **High Impact Tests - Coordinate with team before running**

```bash
# 1. High-traffic simulation (start with 2 workers)
npx playwright test script/playwright/production/load/high-traffic.spec.js --workers=2

# 2. Increase workers gradually if system handles load well
npx playwright test script/playwright/production/load/high-traffic.spec.js --workers=5

# 3. Stress testing (maximum 3 workers)
npx playwright test script/playwright/production/load/stress-test.spec.js --workers=3
```

**Critical Monitoring:**
- Response times > 10 seconds indicate stress
- Error rates > 5% require immediate attention
- Database connection pool exhaustion
- Rate limiting activation (429 responses)

## Monitoring Dashboard Setup

### AppSignal Metrics to Watch

1. **Response Times**
   - Dashboard loading times
   - Time logs query performance
   - User management operations

2. **Error Rates**
   - 5xx server errors
   - Database timeouts
   - Memory allocation failures

3. **Throughput**
   - Requests per minute
   - Database queries per second
   - Active user sessions

4. **Resource Usage**
   - CPU utilization
   - Memory consumption
   - Database connections

### Warning Thresholds

- **Response Time:** > 5 seconds average
- **Error Rate:** > 2% of requests
- **CPU Usage:** > 80% sustained
- **Memory Usage:** > 85% of available
- **DB Connections:** > 80% of pool

## Test Execution Commands

### Safe Daily Testing
```bash
# Run these tests daily without coordination
npx playwright test script/playwright/production/public/ --workers=2
npx playwright test script/playwright/production/authenticated/regular-user.spec.js --workers=1
```

### Weekly Load Testing
```bash
# Coordinate with team for weekly load testing
npx playwright test script/playwright/production/load/concurrent-users.spec.js --workers=5
npx playwright test script/playwright/production/load/high-traffic.spec.js --workers=3
```

### Monthly Stress Testing
```bash
# Full stress testing - requires team coordination and monitoring
npx playwright test script/playwright/production/load/stress-test.spec.js --workers=2
```

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   ```
   Error: Failed to login as user@example.com
   ```
   - Verify user accounts exist in production
   - Check password matches seeds.rb
   - Confirm production database is seeded

2. **Rate Limiting**
   ```
   Error: 429 Too Many Requests
   ```
   - This is expected under stress testing
   - Tests automatically respect rate limits
   - Reduce worker count if persistent

3. **Timeouts**
   ```
   Error: Timeout 30000ms exceeded
   ```
   - Indicates system under stress
   - Reduce concurrent workers
   - Check AppSignal for bottlenecks

4. **Database Errors**
   ```
   Error: Database connection failed
   ```
   - Check database connection pool
   - Monitor active connections
   - May indicate connection exhaustion

### Emergency Procedures

1. **Stop All Tests Immediately**
   ```bash
   # Kill all Playwright processes
   pkill -f playwright
   
   # Or use Ctrl+C in terminal
   ```

2. **Check System Recovery**
   - Monitor AppSignal for 5-10 minutes
   - Verify response times return to normal
   - Check error rates decrease

3. **Report Issues**
   - Document error messages
   - Share AppSignal screenshots
   - Note worker count and test duration

## Results Interpretation

### Success Criteria

- **Response Times:** < 5 seconds average
- **Error Rate:** < 1% of requests
- **System Recovery:** < 2 minutes after test completion
- **No Data Corruption:** All user data intact

### Performance Baselines

- **Dashboard:** 1-3 seconds typical
- **Time Logs:** 2-5 seconds (N+1 queries intentional)
- **User Management:** 1-4 seconds
- **Project Pages:** 1-3 seconds

### Load Testing Goals

1. **Identify Bottlenecks:** Find performance limitations
2. **Validate Monitoring:** Ensure AppSignal captures issues
3. **Test Recovery:** Verify system resilience
4. **Document Capacity:** Establish user limits

## Reporting

### Test Report Template

```
# Load Test Report - [Date]

## Test Configuration
- Test Suite: [concurrent-users/high-traffic/stress-test]
- Workers: [number]
- Duration: [minutes]
- User Roles: [list]

## Results
- Total Requests: [number]
- Success Rate: [percentage]
- Average Response Time: [seconds]
- Peak Response Time: [seconds]

## AppSignal Metrics
- Error Rate: [percentage]
- CPU Usage: [peak percentage]
- Memory Usage: [peak percentage]
- Database Connections: [peak count]

## Issues Identified
- [List any problems]
- [Performance bottlenecks]
- [System limitations]

## Recommendations
- [Suggested improvements]
- [Capacity planning notes]
- [Monitoring adjustments]
```

## Next Steps

After successful load testing:

1. **Document Baselines:** Record performance metrics
2. **Set Alerts:** Configure AppSignal thresholds
3. **Schedule Regular Testing:** Establish testing cadence
4. **Capacity Planning:** Plan for user growth
5. **Performance Optimization:** Address identified bottlenecks

## Support

For questions or issues:
- Check AppSignal dashboard first
- Review test logs for error details
- Coordinate with development team
- Document findings for future reference
