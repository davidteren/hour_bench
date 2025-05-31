# Playwright Regression Tests

This directory contains Playwright regression tests to ensure UI components and styling continue to work correctly after code changes.

## Test Organization

### Regression Tests (`tests/playwright/`)
- **Purpose**: Automated tests that run in CI/CD to catch regressions
- **When to run**: Before merging PRs, during CI/CD pipeline
- **Headless**: Runs headless by default for CI/CD
- **Screenshots**: Saved to `tmp/screenshots/` with timestamps

### Development Tests (`script/playwright/development/`)
- **Purpose**: Interactive tests for development and debugging
- **When to run**: During development, when debugging styling issues
- **Headless**: Runs with browser visible for debugging
- **Screenshots**: Saved to `tmp/screenshots/` with timestamps

## Available Regression Tests

### 1. Mobile Navigation (`mobile-navigation.spec.js`)
Tests the mobile menu functionality and responsive behavior.

**What it tests:**
- Mobile menu button visibility across viewports
- Menu toggle functionality (open/close)
- Stimulus controller connection
- CSS media query behavior
- Accessibility attributes

**Run individually:**
```bash
npx playwright test mobile-navigation.spec.js
```

### 2. Dashboard Responsive Layout (`dashboard-responsive.spec.js`)
Tests the dashboard responsive layout and mobile optimization.

**What it tests:**
- Stats grid responsive behavior (1 column → 2 columns → auto-fit)
- Dashboard card layout stacking
- Admin table mobile handling (hidden with message)
- Horizontal overflow detection
- Activity item stacking on mobile

**Run individually:**
```bash
npx playwright test dashboard-responsive.spec.js
```

### 3. General Styling System (`styling-regression.spec.js`)
Tests the overall CSS architecture and design system.

**What it tests:**
- CSS custom properties (variables) availability
- Button component consistency
- Card component styling
- Utility class functionality
- Responsive breakpoint behavior
- Status indicator styling and animations

**Run individually:**
```bash
npx playwright test styling-regression.spec.js
```

## Running Tests

### Run All Regression Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test mobile-navigation.spec.js
```

### Run with UI Mode (for debugging)
```bash
npx playwright test --ui
```

### Run in Headed Mode (show browser)
```bash
npx playwright test --headed
```

### Generate HTML Report
```bash
npx playwright test
npx playwright show-report
```

## Screenshot Management

### Automatic Screenshots
- All tests automatically generate screenshots with timestamps
- Format: `{timestamp}-regression-{test-name}-{details}.png`
- Location: `tmp/screenshots/`
- Timestamp format: `YYYY-MM-DDTHH-MM-SS`

### Screenshot Examples
```
tmp/screenshots/2024-01-15T14-30-25-regression-mobile-menu-visible.png
tmp/screenshots/2024-01-15T14-30-25-regression-dashboard-mobile-stats.png
tmp/screenshots/2024-01-15T14-30-25-regression-buttons.png
```

### Cleaning Screenshots
Screenshots are automatically ignored by git (see `.gitignore`). To clean old screenshots:

```bash
rm -rf tmp/screenshots/*
```

## Test Structure

### Test Naming Convention
- File names: `{component}-{type}.spec.js`
- Test descriptions: Clear, descriptive names
- Screenshot names: `{timestamp}-regression-{component}-{detail}.png`

### Test Organization
Each test file follows this structure:

1. **File header**: Description and purpose
2. **Imports and utilities**: Required modules and helper functions
3. **Test suite**: `test.describe()` with descriptive name
4. **Setup**: `test.beforeEach()` for common setup
5. **Individual tests**: Focused, single-responsibility tests
6. **Screenshots**: Automatic capture for visual verification

### Example Test Structure
```javascript
/**
 * Regression Test: Component Name
 * Description of what this test file covers
 */

const { test, expect } = require('@playwright/test');

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

test.describe('Component Regression Tests', () => {
  let timestamp;

  test.beforeEach(async ({ page }) => {
    timestamp = getTimestamp();
    // Common setup
  });

  test('should do something specific', async ({ page }) => {
    // Test implementation
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-test-name.png` 
    });
  });
});
```

## Adding New Tests

### When to Add Regression Tests
- New UI components are added
- Existing components are significantly modified
- Responsive behavior is changed
- CSS architecture is updated
- Critical styling bugs are fixed

### How to Add New Tests

1. **Create test file** in `tests/playwright/`
2. **Follow naming convention**: `{component}-{type}.spec.js`
3. **Include comprehensive coverage**:
   - Component functionality
   - Responsive behavior
   - Cross-viewport testing
   - Error states
4. **Add screenshots** for visual verification
5. **Update this README** with test description

### Test Template
```javascript
/**
 * Regression Test: [Component Name]
 * 
 * [Description of what this test covers]
 */

const { test, expect } = require('@playwright/test');

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

test.describe('[Component] Regression Tests', () => {
  let timestamp;

  test.beforeEach(async ({ page }) => {
    timestamp = getTimestamp();
    await page.goto('/');
    
    // Setup component structure
    await page.evaluate(() => {
      // Inject test HTML
    });
    
    await page.waitForSelector('.component-selector');
  });

  test('should [specific behavior]', async ({ page }) => {
    // Test implementation
    
    // Take screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-component-behavior.png` 
    });
  });
});
```

## CI/CD Integration

### GitHub Actions
These tests are designed to run in GitHub Actions CI/CD pipeline:

```yaml
- name: Run Playwright tests
  run: npx playwright test
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

### Test Failure Handling
- Tests fail if UI components don't work as expected
- Screenshots are captured on failure for debugging
- HTML reports provide detailed failure information

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout values
   - Check server response time
   - Verify selectors are correct

2. **Screenshots not saving**
   - Ensure `tmp/screenshots/` directory exists
   - Check file permissions
   - Verify path format

3. **CSS not loading**
   - Ensure Rails server is running
   - Check asset compilation
   - Verify CSS file paths

4. **Responsive tests failing**
   - Check viewport sizes
   - Verify CSS media queries
   - Test manually in browser

### Debug Mode
Run tests in debug mode to step through execution:

```bash
npx playwright test --debug
```

### Verbose Output
Get detailed test output:

```bash
npx playwright test --reporter=verbose
```

## Best Practices

### Test Writing
- Keep tests focused and single-responsibility
- Use descriptive test names
- Include visual verification via screenshots
- Test multiple viewports for responsive components
- Verify both positive and negative cases

### Maintenance
- Run tests regularly during development
- Update tests when components change
- Clean up old screenshots periodically
- Keep test documentation current

### Performance
- Use efficient selectors
- Minimize wait times
- Reuse setup code in beforeEach
- Group related tests in describe blocks
