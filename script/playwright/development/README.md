# Development Playwright Scripts

This directory contains Playwright scripts for testing UI components and styling during development. These scripts are designed to help developers verify that styling changes are working correctly across different viewports and components.

## Prerequisites

- Rails server running on `http://localhost:3000`
- Playwright installed (`npm install playwright`)

## Available Scripts

### 1. Mobile Menu Test
**File:** `test_mobile_menu.js`
**Purpose:** Tests mobile navigation menu functionality and responsive behavior

```bash
node script/playwright/development/test_mobile_menu.js
```

**What it tests:**
- Mobile menu button visibility across viewports
- Menu toggle functionality (open/close)
- Stimulus controller connection
- CSS media query behavior
- Cross-viewport compatibility (iPhone SE, iPhone 12, iPad, Desktop)

**Screenshots generated:**
- `tmp/screenshots/{timestamp}-mobile-menu-before.png`
- `tmp/screenshots/{timestamp}-mobile-menu-after.png`
- `tmp/screenshots/{timestamp}-mobile-menu-{device}.png`

### 2. Dashboard Mobile Styling Test
**File:** `test_dashboard_mobile.js`
**Purpose:** Tests dashboard responsive layout and mobile optimization

```bash
node script/playwright/development/test_dashboard_mobile.js
```

**What it tests:**
- Stats grid responsive behavior (1 column → 2 columns → auto-fit)
- Dashboard card layout stacking
- Admin table mobile handling (hidden with message)
- Horizontal overflow detection
- Cross-viewport layout verification

**Screenshots generated:**
- `tmp/screenshots/{timestamp}-dashboard-{viewport}.png`

### 3. Time Logs Styling Test
**File:** `test_time_logs_styling.js`
**Purpose:** Tests time logs page styling and component behavior

```bash
node script/playwright/development/test_time_logs_styling.js
```

**What it tests:**
- Stats grid layout and responsiveness
- Time log entry components
- Status indicators (running/completed)
- CSS animations (pulse effect)
- Responsive breakpoint behavior

**Screenshots generated:**
- `tmp/screenshots/{timestamp}-time-logs-{viewport}.png`

## Screenshot Organization

All screenshots are automatically saved to `tmp/screenshots/` with timestamps:
- Format: `{timestamp}-{test-name}-{details}.png`
- Timestamp format: `YYYY-MM-DDTHH-MM-SS`
- Example: `2024-01-15T14-30-25-mobile-menu-before.png`

## Usage During Development

### When to Run These Tests

1. **After CSS changes** - Verify styling still works across viewports
2. **Before committing** - Ensure no regressions in responsive design
3. **When debugging** - Visual verification of layout issues
4. **Cross-browser testing** - Verify consistency across different browsers

### Interpreting Results

#### Mobile Menu Test
- ✅ **Success indicators:**
  - Button visible on mobile viewports (≤768px)
  - Button hidden on desktop viewports (>768px)
  - Menu state changes when clicked
  - Stimulus controller connected

- ❌ **Failure indicators:**
  - Button not visible on mobile
  - Menu doesn't toggle
  - Stimulus controller not connected
  - CSS media queries not working

#### Dashboard Test
- ✅ **Success indicators:**
  - Stats grid: 1 column (mobile) → 2 columns (tablet) → auto-fit (desktop)
  - No horizontal overflow on any viewport
  - Admin table hidden on mobile with message shown
  - Cards stack properly on mobile

- ❌ **Failure indicators:**
  - Horizontal overflow detected
  - Grid not responsive
  - Admin table visible on mobile
  - Cards not stacking

#### Time Logs Test
- ✅ **Success indicators:**
  - All components render correctly
  - Stats grid responsive
  - Status indicators working
  - Animations functioning

- ❌ **Failure indicators:**
  - Components missing or broken
  - Grid not responsive
  - Status indicators not showing
  - Animations not working

## Customization

### Adding New Viewports
To test additional viewport sizes, modify the `testViewports` array:

```javascript
const testViewports = [
  { name: 'Custom Mobile', width: 360, height: 640 },
  // ... existing viewports
];
```

### Adding New Tests
To test additional components:

1. Create a new script file in this directory
2. Follow the existing pattern:
   - Use timestamp for screenshots
   - Save to `tmp/screenshots/`
   - Include comprehensive logging
   - Test multiple viewports

### Modifying Screenshot Paths
All scripts use the `getTimestamp()` function and save to `tmp/screenshots/`. To change the path, modify the screenshot calls:

```javascript
await page.screenshot({ path: `your/custom/path/${timestamp}-test-name.png` });
```

## Troubleshooting

### Common Issues

1. **Server not running**
   - Ensure Rails server is running on port 3000
   - Check `http://localhost:3000` is accessible

2. **Playwright not installed**
   ```bash
   npm install playwright
   npx playwright install
   ```

3. **Screenshots not saving**
   - Ensure `tmp/screenshots/` directory exists
   - Check file permissions

4. **Tests timing out**
   - Increase timeout values in scripts
   - Check server response time

### Debug Mode
To run tests with browser visible (for debugging):
- Tests already run with `headless: false`
- Browser window will open and show test execution
- Useful for visual debugging of layout issues

## Integration with CI/CD

These development scripts are designed for local development. For CI/CD integration, see the regression tests in `tests/playwright/` directory.
