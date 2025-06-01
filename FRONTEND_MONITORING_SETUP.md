# AppSignal Frontend Monitoring Setup

This document explains how to set up and use AppSignal frontend monitoring for the HourBench application.

## Overview

AppSignal's frontend monitoring provides:
- **Error Tracking**: JavaScript errors and exceptions
- **Performance Metrics**: Page load times, Core Web Vitals, resource loading
- **User Interaction Tracking**: Button clicks, form submissions, navigation
- **Custom Metrics**: Business-specific metrics and KPIs
- **Real User Monitoring (RUM)**: Actual user experience data

## Setup Instructions

### 1. Get Your Frontend API Key

1. Go to your AppSignal dashboard
2. Navigate to **App Settings > Push & Deploy**
3. Find the **"Front-end error monitoring"** section
4. Copy your Frontend API Key

### 2. Configure the API Key

Add your frontend API key to your Rails credentials or environment variables:

**Option A: Rails Credentials (Recommended)**
```bash
rails credentials:edit
```

Add:
```yaml
appsignal:
  frontend_key: your_frontend_api_key_here
```

**Option B: Environment Variable**
```bash
export APPSIGNAL_FRONTEND_KEY=your_frontend_api_key_here
```

### 3. Verify Installation

The frontend monitoring is already integrated into your application. Check that:

1. The AppSignal JavaScript library is loaded in your browser's developer tools
2. You see console messages like "🎯 AppSignal Frontend Monitoring initialized"
3. No JavaScript errors related to AppSignal

## What's Being Tracked

### Automatic Tracking

The system automatically tracks:

#### Performance Metrics
- **Page Load Time**: Complete page loading duration
- **Core Web Vitals**:
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)
  - Cumulative Layout Shift (CLS)
- **Navigation Timing**: DNS lookup, TCP connect, SSL handshake, TTFB
- **Resource Loading**: CSS, JavaScript, font, and image load times

#### User Interactions
- **Button Clicks**: All button interactions with context
- **Link Clicks**: Navigation tracking with internal/external detection
- **Form Submissions**: Success/failure tracking with validation errors
- **Page Views**: Route changes and referrer tracking

#### Error Monitoring
- **JavaScript Errors**: Unhandled exceptions with stack traces
- **Promise Rejections**: Async operation failures
- **AJAX Failures**: Failed API requests with timing data

#### Session Tracking
- **Session Duration**: Time spent on the application
- **User Agent**: Browser and device information
- **Viewport Size**: Screen resolution data

### Custom Metrics

You can track custom business metrics using the provided utilities:

```javascript
// Import the frontend metrics utility
import { frontendMetrics } from "./appsignal"

// Track custom events
frontendMetrics.trackCustomMetric('user_action', 1, 'counter', {
  action_type: 'export_report',
  report_type: 'time_summary'
})

// Track performance metrics
frontendMetrics.trackCustomMetric('api_response_time', 250, 'distribution', {
  endpoint: '/api/projects',
  status: '200'
})

// Track business metrics
frontendMetrics.trackCustomMetric('project_created', 1, 'counter', {
  user_role: 'admin',
  organization_size: 'medium'
})
```

## Metric Types

AppSignal supports three types of metrics:

### 1. Gauge
A value at a specific point in time (e.g., active users, memory usage)
```javascript
frontendMetrics.trackCustomMetric('active_users', 42, 'gauge')
```

### 2. Counter
Incremental values for tracking events (e.g., button clicks, form submissions)
```javascript
frontendMetrics.trackCustomMetric('form_submission', 1, 'counter')
```

### 3. Distribution
Collections of values for statistical analysis (e.g., response times, file sizes)
```javascript
frontendMetrics.trackCustomMetric('page_load_time', 1250, 'distribution')
```

## Integration with Stimulus Controllers

The monitoring integrates seamlessly with your existing Stimulus controllers:

### Automatic Integration
Add `data-appsignal-target="button"` to buttons for automatic tracking:
```erb
<%= button_to "Save Project", project_path, 
    data: { appsignal_target: "button" },
    class: "btn btn-primary" %>
```

### Manual Integration
Call tracking methods from your controllers:
```javascript
// In your Stimulus controller
import { Controller } from "@hotwired/stimulus"
import { frontendMetrics } from "../appsignal"

export default class extends Controller {
  saveProject() {
    const startTime = performance.now()
    
    // Your save logic here
    
    const duration = performance.now() - startTime
    frontendMetrics.trackCustomMetric('project_save_time', duration, 'distribution')
  }
}
```

## Dashboard and Alerting

### Creating Dashboards

1. Go to your AppSignal dashboard
2. Navigate to **Dashboards**
3. Click **"Add Dashboard"**
4. Use the Graph Builder to create charts with your metrics

### Setting Up Alerts

1. Go to **Alerts** in your AppSignal dashboard
2. Create alerts for:
   - High error rates
   - Slow page load times
   - Failed form submissions
   - Custom business metrics

### Recommended Alerts

- **Error Rate**: Alert when JavaScript errors exceed 5% of page views
- **Page Load Time**: Alert when average load time exceeds 3 seconds
- **Core Web Vitals**: Alert when LCP > 2.5s or CLS > 0.1
- **Form Failures**: Alert when form submission failure rate exceeds 10%

## Troubleshooting

### Common Issues

1. **No data appearing in AppSignal**
   - Check that your frontend API key is correct
   - Verify the key is properly loaded (check browser console)
   - Ensure you're not in development mode with a production key

2. **High noise from browser extensions**
   - The system automatically filters common extension errors
   - Add custom filters in `app/javascript/appsignal.js` if needed

3. **Performance impact**
   - The monitoring library is lightweight (~15KB gzipped)
   - Metrics are batched and sent asynchronously
   - Failed requests are queued and retried

### Debug Mode

Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('appsignal_debug', 'true')
```

## Best Practices

### 1. Metric Naming
- Use descriptive, consistent names
- Group related metrics with prefixes (e.g., `user_`, `api_`, `form_`)
- Avoid dynamic values in metric names

### 2. Tagging Strategy
- Use tags for filtering and grouping
- Keep tag values limited and predictable
- Include context like user role, feature flags, etc.

### 3. Performance Considerations
- Don't track every single user interaction
- Focus on business-critical metrics
- Use sampling for high-volume events

### 4. Error Handling
- Always wrap custom tracking in try-catch blocks
- Don't let monitoring failures break your application
- Log tracking errors for debugging

## Advanced Configuration

### Custom Error Filtering

Add custom error filters in `app/javascript/appsignal.js`:

```javascript
ignoreErrors: [
  /Script error/,
  /Non-Error promise rejection captured/,
  /ResizeObserver loop limit exceeded/,
  // Add your custom filters here
  /YourSpecificError/
]
```

### Custom Breadcrumbs

Track user actions leading up to errors:

```javascript
import { appsignal } from "./appsignal"

// Add breadcrumb
appsignal.addBreadcrumb({
  category: "user_action",
  message: "User clicked export button",
  level: "info",
  metadata: {
    button_id: "export-btn",
    report_type: "monthly"
  }
})
```

### Source Maps

For better error tracking, upload source maps to AppSignal:

1. Generate source maps in your build process
2. Upload them using the AppSignal CLI
3. Configure your deployment to include source map uploads

## Support

For issues with frontend monitoring:

1. Check the [AppSignal JavaScript documentation](https://docs.appsignal.com/front-end/)
2. Review browser console for error messages
3. Contact AppSignal support with specific error details
4. Check this application's GitHub issues for known problems

## Metrics Reference

### Automatically Tracked Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `page_load_time` | distribution | Complete page loading time |
| `lcp` | distribution | Largest Contentful Paint |
| `fid` | distribution | First Input Delay |
| `cls` | gauge | Cumulative Layout Shift |
| `navigation_*` | distribution | DNS, TCP, SSL, TTFB timings |
| `resource_load_*` | distribution | CSS, JS, font load times |
| `page_view` | counter | Page navigation events |
| `user_interaction` | counter | Button/link clicks |
| `form_submission` | counter | Form submit attempts |
| `form_error` | counter | Form validation failures |
| `ajax_request` | distribution | AJAX request timing |
| `session_duration` | distribution | User session length |

### Custom Metric Examples

```javascript
// Business metrics
frontendMetrics.trackCustomMetric('project_created', 1, 'counter', {
  user_role: Current.user.role,
  organization_id: Current.user.organization_id
})

// Performance metrics
frontendMetrics.trackCustomMetric('search_performance', searchTime, 'distribution', {
  query_length: query.length,
  result_count: results.length
})

// User engagement
frontendMetrics.trackCustomMetric('feature_usage', 1, 'counter', {
  feature_name: 'time_tracking',
  user_type: 'premium'
})
```

This comprehensive frontend monitoring setup provides deep insights into your application's performance and user experience, helping you identify and resolve issues before they impact your users.