const { test, expect } = require('@playwright/test');

test.describe('README Installation Validation', () => {
  test('should validate application startup and basic functionality', async ({ page }) => {
    // Test that the application starts and loads correctly
    await page.goto('/');
    
    // Take screenshot of the initial state
    await page.screenshot({ path: 'test-results/readme-validation-startup.png', fullPage: true });
    
    // Verify the application loads without errors
    await expect(page).toHaveTitle(/HourBench/);
    
    // Check that the login page is accessible
    const loginLink = page.locator('a[href="/session/new"]');
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.screenshot({ path: 'test-results/readme-validation-login.png', fullPage: true });
    }
    
    // Verify basic navigation elements are present
    await expect(page.locator('body')).toBeVisible();
  });

  test('should validate test user login functionality', async ({ page }) => {
    // Navigate to login page
    await page.goto('/session/new');
    
    // Check if test credentials are visible (when SHOW_TEST_CREDENTIALS=true)
    const testCredentialsSection = page.locator('text=Development Only - Quick Login');
    
    if (await testCredentialsSection.isVisible()) {
      // Take screenshot showing test credentials
      await page.screenshot({ path: 'test-results/readme-validation-test-credentials.png', fullPage: true });
      
      // Test login with system admin
      const adminButton = page.locator('button:has-text("admin@hourbench.com")');
      if (await adminButton.isVisible()) {
        await adminButton.click();
        
        // Verify successful login
        await expect(page).toHaveURL(/dashboard/);
        await page.screenshot({ path: 'test-results/readme-validation-admin-dashboard.png', fullPage: true });
      }
    } else {
      // Manual login test
      await page.fill('input[name="email"]', 'admin@hourbench.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Verify successful login
      await expect(page).toHaveURL(/dashboard/);
      await page.screenshot({ path: 'test-results/readme-validation-manual-login.png', fullPage: true });
    }
  });

  test('should validate core features mentioned in README', async ({ page }) => {
    // Login as admin first
    await page.goto('/session/new');
    
    const testCredentialsSection = page.locator('text=Development Only - Quick Login');
    if (await testCredentialsSection.isVisible()) {
      const adminButton = page.locator('button:has-text("admin@hourbench.com")');
      await adminButton.click();
    } else {
      await page.fill('input[name="email"]', 'admin@hourbench.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
    }
    
    // Wait for dashboard to load
    await expect(page).toHaveURL(/dashboard/);
    
    // Test navigation to core features mentioned in README
    const features = [
      { name: 'Organizations', selector: 'a[href*="/organizations"]' },
      { name: 'Users', selector: 'a[href*="/users"]' },
      { name: 'Time Logs', selector: 'a[href*="/time_logs"]' }
    ];
    
    for (const feature of features) {
      const link = page.locator(feature.selector);
      if (await link.isVisible()) {
        await link.click();
        await page.screenshot({ 
          path: `test-results/readme-validation-${feature.name.toLowerCase()}.png`, 
          fullPage: true 
        });
        
        // Verify the page loads without errors
        await expect(page.locator('body')).toBeVisible();
        
        // Go back to dashboard for next test
        await page.goto('/dashboard');
      }
    }
  });

  test('should validate responsive design mentioned in README', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.screenshot({ path: 'test-results/readme-validation-desktop.png', fullPage: true });
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.screenshot({ path: 'test-results/readme-validation-tablet.png', fullPage: true });
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.screenshot({ path: 'test-results/readme-validation-mobile.png', fullPage: true });
  });
});
