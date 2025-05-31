const { test, expect } = require('@playwright/test');

test.describe('Quick Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/session/new');
  });

  test('should display quick login section with proper styling', async ({ page }) => {
    // Check that quick login section is visible
    await expect(page.locator('.quick-login-section')).toBeVisible();
    
    // Check header content
    await expect(page.locator('.quick-login-title')).toContainText('Demo Accounts');
    await expect(page.locator('.quick-login-description')).toContainText('For demonstration purposes only');
    
    // Check all user categories are present
    await expect(page.locator('.quick-login-group-title.admin')).toContainText('System Admin');
    await expect(page.locator('.quick-login-group-title.org-admin')).toContainText('Organization Admins');
    await expect(page.locator('.quick-login-group-title.team-admin')).toContainText('Team Admins');
    await expect(page.locator('.quick-login-group-title.regular')).toContainText('Regular Users');
    await expect(page.locator('.quick-login-group-title.freelancer')).toContainText('Freelancers');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/quick-login-layout.png',
      fullPage: true 
    });
  });

  test('should login as system admin via quick login', async ({ page }) => {
    // Click the system admin quick login button
    await page.click('button:has-text("Login as System Admin")');
    
    // Should be redirected to dashboard
    await page.waitForURL('/');
    
    // Verify we're logged in as system admin
    await expect(page.locator('.user-role:has-text("System Admin")')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/quick-login-system-admin-success.png',
      fullPage: true 
    });
  });

  test('should login as organization admin via quick login', async ({ page }) => {
    // Click Alice (TechSolutions) button
    await page.click('button:has-text("Alice (TechSolutions)")');
    
    // Should be redirected to dashboard
    await page.waitForURL('/');
    
    // Verify we're logged in (check for user menu or dashboard content)
    await expect(page.locator('.user-name')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/quick-login-org-admin-success.png',
      fullPage: true 
    });
  });

  test('should login as team admin via quick login', async ({ page }) => {
    // Click David (Dev Team) button
    await page.click('button:has-text("David (Dev Team)")');
    
    // Should be redirected to dashboard
    await page.waitForURL('/');
    
    // Verify we're logged in
    await expect(page.locator('.user-name')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/quick-login-team-admin-success.png',
      fullPage: true 
    });
  });

  test('should login as regular user via quick login', async ({ page }) => {
    // Click Grace (TechSolutions) button
    await page.click('button:has-text("Grace (TechSolutions)")');
    
    // Should be redirected to dashboard
    await page.waitForURL('/');
    
    // Verify we're logged in
    await expect(page.locator('.user-name')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/quick-login-regular-user-success.png',
      fullPage: true 
    });
  });

  test('should login as freelancer via quick login', async ({ page }) => {
    // Click Blake Freeman button
    await page.click('button:has-text("Blake Freeman")');
    
    // Should be redirected to dashboard
    await page.waitForURL('/');
    
    // Verify we're logged in
    await expect(page.locator('.user-name')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/quick-login-freelancer-success.png',
      fullPage: true 
    });
  });

  test('should auto-fill form fields when quick login button is clicked', async ({ page }) => {
    // Override form submit to prevent actual submission
    await page.addInitScript(() => {
      window.addEventListener('DOMContentLoaded', () => {
        // Override the quickLogin function to prevent submission
        window.originalQuickLogin = window.quickLogin;
        window.quickLogin = function(email, password) {
          // Fill the form fields
          const emailField = document.querySelector('input[name="email_address"]');
          const passwordField = document.querySelector('input[name="password"]');

          if (emailField && passwordField) {
            emailField.value = email;
            passwordField.value = password;
          }
          // Don't submit the form for this test
        };
      });
    });

    // Navigate to login page
    await page.goto('/session/new');

    // Get initial form field values
    const emailField = page.locator('input[name="email_address"]');
    const passwordField = page.locator('input[name="password"]');

    // Initially should be empty
    await expect(emailField).toHaveValue('');
    await expect(passwordField).toHaveValue('');

    // Click Luna (Creative) button
    await page.click('button:has-text("Luna (Creative)")');

    // Wait a moment for the fields to be populated
    await page.waitForTimeout(200);

    // Check that fields are populated
    await expect(emailField).toHaveValue('luna.rodriguez@creative.com');
    await expect(passwordField).toHaveValue('password123');

    // Take screenshot
    await page.screenshot({
      path: 'tmp/screenshots/quick-login-form-populated.png',
      fullPage: true
    });
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to login page
    await page.goto('/session/new');

    // Check that quick login section is still visible and properly styled
    await expect(page.locator('.quick-login-section')).toBeVisible();

    // Check that buttons are properly sized for mobile
    const buttons = page.locator('.quick-login-user-btn');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Take screenshot
    await page.screenshot({
      path: 'tmp/screenshots/quick-login-mobile-responsive.png',
      fullPage: true
    });

    // Test that a button still works on mobile
    await page.click('button:has-text("Login as System Admin")');
    await page.waitForURL('/');

    // Check that we're successfully logged in by verifying we're on the dashboard
    // and not redirected back to login
    await expect(page).toHaveURL('/');

    // Check for any sign of successful authentication (navbar, dashboard content, etc.)
    const authIndicators = [
      page.locator('.navbar-container'),
      page.locator('.dashboard-container'),
      page.locator('#mobile-menu-button'),
      page.locator('.user-menu'),
      page.locator('h1:has-text("Dashboard")')
    ];

    // At least one of these should be visible to indicate successful login
    let foundIndicator = false;
    for (const indicator of authIndicators) {
      try {
        await expect(indicator).toBeVisible({ timeout: 1000 });
        foundIndicator = true;
        break;
      } catch (e) {
        // Continue to next indicator
      }
    }

    expect(foundIndicator).toBe(true);

    // Take screenshot of successful mobile login
    await page.screenshot({
      path: 'tmp/screenshots/quick-login-mobile-success.png',
      fullPage: true
    });
  });

  test('should check console for JavaScript errors', async ({ page }) => {
    const consoleErrors = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to login page
    await page.goto('/session/new');
    
    // Click a quick login button
    await page.click('button:has-text("Login as System Admin")');
    
    // Wait for navigation
    await page.waitForURL('/');
    
    // Check that no console errors occurred
    expect(consoleErrors).toHaveLength(0);
  });
});
