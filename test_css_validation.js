const { chromium } = require('playwright');

async function testCSSValidation() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Listen for page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  // Listen for failed requests
  const failedRequests = [];
  page.on('response', response => {
    if (!response.ok()) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('Testing Dashboard page...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'dashboard-after-refactoring.png' });
    
    console.log('Testing Login page...');
    // Try to access login page (might redirect if already logged in)
    await page.goto('http://localhost:3000/session/new');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'login-after-refactoring.png' });
    
    console.log('Testing Projects page...');
    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'projects-after-refactoring.png' });

    // Test responsive design
    console.log('Testing mobile responsive design...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'dashboard-mobile.png' });

    // Test desktop design
    console.log('Testing desktop design...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'dashboard-desktop.png' });

    // Report results
    console.log('\n=== CSS Validation Results ===');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console Errors:', consoleErrors);
    }
    
    console.log(`Page Errors: ${pageErrors.length}`);
    if (pageErrors.length > 0) {
      console.log('Page Errors:', pageErrors);
    }
    
    console.log(`Failed Requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.log('Failed Requests:', failedRequests);
    }

    if (consoleErrors.length === 0 && pageErrors.length === 0 && failedRequests.length === 0) {
      console.log('✅ All tests passed! No errors detected.');
    } else {
      console.log('❌ Issues detected. See details above.');
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testCSSValidation();
