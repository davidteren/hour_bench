# AppSignal API Call Optimization

## 🚨 Problem Identified

Your AppSignal frontend monitoring was making excessive API calls due to:

1. **Continuous Performance Observers** - Multiple `PerformanceObserver` instances running continuously
2. **Resource Timing Tracking** - Every resource load (CSS, JS, images) triggered an API call
3. **No Batching** - Each metric was sent immediately as a separate API call
4. **No Throttling** - Similar metrics could be sent multiple times rapidly
5. **Turbo Navigation Issues** - Controllers re-initializing on every page navigation

## ✅ Solutions Implemented

### 1. **Batching System**
- Metrics are now queued and sent in batches of 5
- Batches are processed every 10 seconds
- Reduces API calls by ~80%

### 2. **Throttling**
- Similar metrics are throttled to once every 5 seconds
- Prevents duplicate/rapid-fire API calls
- Configurable per metric type

### 3. **Resource Tracking Optimization**
- Disabled continuous resource observer
- Only tracks top 3 slowest critical resources (CSS/JS)
- Only tracks resources slower than 100ms
- Runs once per page load instead of continuously

### 4. **Duplicate Prevention**
- Added initialization guards to prevent duplicate observers
- Turbo navigation no longer creates multiple instances

### 5. **Configuration System**
- Centralized config in `app/javascript/appsignal_config.js`
- Environment-specific settings (development vs production)
- Easy to adjust without code changes

## 📁 Files Modified

### Core Files
- `app/javascript/appsignal.js` - Main monitoring logic with batching/throttling
- `app/javascript/controllers/appsignal_controller.js` - Duplicate prevention
- `app/javascript/appsignal_config.js` - **NEW** Configuration settings

### Monitoring Tools
- `script/appsignal_monitor.js` - **NEW** Browser console monitoring tool

## 🔧 Configuration Options

Edit `app/javascript/appsignal_config.js` to adjust:

```javascript
export const APPSIGNAL_CONFIG = {
  BATCH_SIZE: 5,           // Metrics per batch
  BATCH_DELAY: 10000,      // Batch frequency (ms)
  THROTTLE_DELAY: 5000,    // Throttle similar metrics (ms)
  
  // Feature toggles
  ENABLE_PERFORMANCE_METRICS: false,  // Disabled to reduce calls
  ENABLE_RESOURCE_TRACKING: false,    // Disabled to reduce calls
  ENABLE_WEB_VITALS: true,            // Keep essential metrics
  ENABLE_USER_INTERACTIONS: true,     // Track user behavior
  ENABLE_ERROR_TRACKING: true,        // Track errors
}
```

## 📊 Expected Results

**Before Optimization:**
- ~50-100 API calls per minute
- Every resource load = 1 API call
- Every metric = 1 API call
- Duplicate observers on navigation

**After Optimization:**
- ~5-10 API calls per minute (80-90% reduction)
- Batched metrics = fewer calls
- Throttled duplicates = no spam
- Single initialization = no duplicates

## 🔍 Monitoring & Debugging

### Browser Console Monitoring
1. Open browser console
2. Paste contents of `script/appsignal_monitor.js`
3. Monitor API call frequency in real-time

### Console Commands
```javascript
// Check current stats
window.appSignalMonitor.printStats()

// Reset counters
window.appSignalMonitor.reset()

// Stop monitoring
window.appSignalMonitor.stop()
```

### Development Settings
In development, the system automatically uses more conservative settings:
- Smaller batch sizes (3 instead of 5)
- Longer delays (15s instead of 10s)
- More aggressive throttling (10s instead of 5s)

## 🚀 Deployment Steps

1. **Test Locally**
   ```bash
   rails server
   # Open browser console and run monitoring script
   # Verify API call reduction
   ```

2. **Deploy Changes**
   ```bash
   git add .
   git commit -m "Optimize AppSignal API calls with batching and throttling"
   git push
   ```

3. **Monitor Production**
   - Use browser console monitoring on production
   - Check AppSignal dashboard for reduced frontend data volume
   - Verify essential metrics still being captured

## 🎛️ Fine-Tuning

If you need to adjust further:

### Reduce API Calls More
```javascript
// In appsignal_config.js
BATCH_SIZE: 10,          // Larger batches
BATCH_DELAY: 30000,      // Less frequent sends
THROTTLE_DELAY: 15000,   // More aggressive throttling
```

### Increase Monitoring (if needed)
```javascript
// In appsignal_config.js
ENABLE_PERFORMANCE_METRICS: true,  // Re-enable if needed
ENABLE_RESOURCE_TRACKING: true,    // Re-enable if needed
BATCH_SIZE: 3,                     // Smaller batches for faster sends
```

## 🔧 Troubleshooting

### If API calls are still high:
1. Check browser console for errors
2. Verify configuration is loading correctly
3. Use monitoring script to identify call patterns
4. Consider disabling more features temporarily

### If missing important metrics:
1. Re-enable specific features in config
2. Adjust throttling delays
3. Check AppSignal dashboard for data gaps

The optimization should dramatically reduce your API call frequency while maintaining essential monitoring capabilities.
