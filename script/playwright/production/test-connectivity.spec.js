// Simple connectivity test for production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');

test.describe('Production Connectivity Test', () => {
  test('should connect to production site', async ({ page }) => {
    console.log('🔗 Testing basic connectivity to production site');
    
    try {
      // Navigate to production site
      await page.goto('https://hour-bench.onrender.com/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // Check if page loaded
      const title = await page.title();
      console.log(`📄 Page title: ${title}`);
      
      // Verify we're on the right site
      expect(title).toContain('HourBench');
      
      // Check for basic elements
      const bodyExists = await page.locator('body').isVisible();
      expect(bodyExists).toBe(true);
      
      console.log('✅ Basic connectivity test passed');
      
    } catch (error) {
      console.log(`❌ Connectivity test failed: ${error.message}`);
      throw error;
    }
  });

  test('should load login page', async ({ page }) => {
    console.log('🔐 Testing login page access');
    
    try {
      // Navigate to login page
      await page.goto('https://hour-bench.onrender.com/session/new', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // Check for login form
      const emailField = page.locator('input[name="email_address"]');
      const passwordField = page.locator('input[name="password"]');
      
      await expect(emailField).toBeVisible();
      await expect(passwordField).toBeVisible();
      
      console.log('✅ Login page test passed');
      
    } catch (error) {
      console.log(`❌ Login page test failed: ${error.message}`);
      throw error;
    }
  });

  test('should test basic authentication', async ({ page }) => {
    console.log('🔑 Testing basic authentication');
    
    try {
      // Navigate to login page
      await page.goto('https://hour-bench.onrender.com/session/new', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // Fill login form with a test user
      await page.fill('input[name="email_address"]', 'grace.lee@techsolutions.com');
      await page.fill('input[name="password"]', 'password123');
      
      // Submit form
      await page.click('input[type="submit"]');
      
      // Wait for navigation (login redirects to /app)
      await page.waitForURL('https://hour-bench.onrender.com/app', { timeout: 30000 });
      
      // Check if we're logged in (look for navbar or dashboard)
      const navbar = page.locator('.navbar-brand');
      await expect(navbar).toBeVisible({ timeout: 10000 });
      
      console.log('✅ Basic authentication test passed');
      
      // Logout
      try {
        await page.goto('https://hour-bench.onrender.com/session', {
          method: 'DELETE',
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });
        console.log('✅ Logout successful');
      } catch (logoutError) {
        console.log(`⚠️ Logout warning: ${logoutError.message}`);
      }
      
    } catch (error) {
      console.log(`❌ Authentication test failed: ${error.message}`);
      throw error;
    }
  });
});
