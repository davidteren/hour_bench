# Production Load Testing Scripts

This directory contains Playwright scripts designed for load testing and user interaction simulation on the production Hour Bench application at https://hour-bench.onrender.com/.

## Purpose

Generate realistic user traffic to evaluate AppSignal monitoring metrics and application performance under simulated load conditions.

## Directory Structure

```
script/playwright/production/
├── README.md                    # This file
├── helpers/
│   ├── auth.js                 # Authentication utilities for production
│   ├── navigation.js           # Navigation and interaction helpers
│   └── load-utils.js           # Load testing utilities
├── public/
│   ├── landing-page.spec.js    # Anonymous user landing page interactions
│   ├── public-browsing.spec.js # Public page browsing patterns
│   └── responsive.spec.js      # Responsive behavior testing
├── authenticated/
│   ├── system-admin.spec.js    # System admin workflows
│   ├── org-admin.spec.js       # Organization admin scenarios
│   ├── team-admin.spec.js      # Team admin workflows
│   ├── regular-user.spec.js    # Regular user interactions
│   └── freelancer.spec.js      # Freelancer scenarios
└── load/
    ├── concurrent-users.spec.js # Multiple concurrent user sessions
    ├── high-traffic.spec.js     # High-traffic area simulation
    └── stress-test.spec.js      # Stress testing scenarios
```

## Test User Accounts

Based on the production seed data, the following test accounts are available:

### System Admin
- **Email:** admin@hourbench.com
- **Password:** password123
- **Access:** Full system access, all organizations

### Organization Admins

#### TechSolutions Inc
- alice.johnson@techsolutions.com (Alice Johnson)
- bob.wilson@techsolutions.com (Bob Wilson)
- carol.davis@techsolutions.com (Carol Davis)

#### Creative Agency
- luna.rodriguez@creative.com (Luna Rodriguez)
- max.thompson@creative.com (Max Thompson)
- nina.patel@creative.com (Nina Patel)

#### StartupCorp
- victor.chang@startup.com (Victor Chang)
- wendy.foster@startup.com (Wendy Foster)

### Team Admins

#### TechSolutions Inc
- david.brown@techsolutions.com (David Brown - Development Team)
- eva.martinez@techsolutions.com (Eva Martinez - QA Team)
- frank.miller@techsolutions.com (Frank Miller - Development Team)

#### Creative Agency
- oscar.kim@creative.com (Oscar Kim - Design Team)
- paula.garcia@creative.com (Paula Garcia - Marketing Team)
- quinn.adams@creative.com (Quinn Adams - Design Team)

#### StartupCorp
- xavier.bell@startup.com (Xavier Bell - Product Team)
- yuki.tanaka@startup.com (Yuki Tanaka - Product Team)

### Regular Users

#### TechSolutions Inc
- grace.lee@techsolutions.com (Grace Lee - Development Team)
- henry.taylor@techsolutions.com (Henry Taylor - Development Team)
- ivy.chen@techsolutions.com (Ivy Chen - QA Team)
- jack.smith@techsolutions.com (Jack Smith - QA Team)

#### Creative Agency
- ruby.white@creative.com (Ruby White - Design Team)
- sam.johnson@creative.com (Sam Johnson - Marketing Team)
- tina.lopez@creative.com (Tina Lopez - Design Team)
- uma.singh@creative.com (Uma Singh - Marketing Team)

#### StartupCorp
- zoe.clark@startup.com (Zoe Clark - Product Team)
- alex.rivera@startup.com (Alex Rivera - Product Team)

### Freelancers
- blake.freeman@freelance.com (Blake Freeman)
- casey.jordan@freelance.com (Casey Jordan)
- drew.morgan@freelance.com (Drew Morgan)

## Running the Tests

### Individual Test Files
```bash
# Run specific test category
npx playwright test script/playwright/production/public/landing-page.spec.js

# Run all authenticated user tests
npx playwright test script/playwright/production/authenticated/

# Run load testing scenarios
npx playwright test script/playwright/production/load/
```

### Concurrent Load Testing
```bash
# Run multiple workers for load simulation
npx playwright test script/playwright/production/load/concurrent-users.spec.js --workers=5

# Stress testing with maximum workers
npx playwright test script/playwright/production/load/stress-test.spec.js --workers=10
```

### Configuration Options
```bash
# Run with specific browser
npx playwright test --project=chromium

# Run in headed mode for debugging
npx playwright test --headed

# Generate reports
npx playwright test --reporter=html
```

## Load Testing Considerations

### Realistic User Behavior
- **Think Time:** 1-3 second delays between user actions
- **Browsing Patterns:** Realistic navigation flows
- **Session Duration:** Varied session lengths (5-30 minutes)
- **Action Variety:** Mix of reading, clicking, form submissions

### Performance Monitoring
- Tests designed to trigger AppSignal metrics
- Focus on high-traffic areas (dashboard, time tracking)
- Database-intensive operations (reports, user management)
- Intentional performance bottlenecks for monitoring

### Rate Limiting Respect
- Gradual ramp-up of concurrent users
- Reasonable request intervals
- Monitoring for 429 (Too Many Requests) responses
- Graceful handling of rate limits

## Best Practices

1. **Start Small:** Begin with single user tests before scaling
2. **Monitor Production:** Watch AppSignal metrics during testing
3. **Gradual Scaling:** Increase load incrementally
4. **Error Handling:** Implement proper timeout and retry logic
5. **Clean Sessions:** Ensure proper login/logout cycles
6. **Resource Cleanup:** Avoid creating excessive test data

## Troubleshooting

### Common Issues
- **Authentication Failures:** Check production user accounts exist
- **Rate Limiting:** Reduce concurrent workers or add delays
- **Timeouts:** Increase timeout values for slow responses
- **Network Issues:** Verify production site accessibility

### Debugging
```bash
# Run with debug output
DEBUG=pw:api npx playwright test

# Generate trace files
npx playwright test --trace=on

# Screenshot on failure
npx playwright test --screenshot=only-on-failure
```

## Safety Notes

⚠️ **Production Environment Warning:**
- These tests run against the live production environment
- Monitor system resources and user impact
- Stop tests immediately if issues are detected
- Coordinate with team before running large-scale tests
- Respect production data and user privacy
