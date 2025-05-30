const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin } = require('./helpers/auth.js');

test.describe('Dashboard', () => {
  test('should display dashboard correctly on desktop', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Should be on dashboard after login
    await expect(page).toHaveURL('/dashboard');
    
    // Check main dashboard elements
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for stats cards
    const statsCards = page.locator('.card-compact');
    await expect(statsCards.first()).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/dashboard-desktop.png',
      fullPage: true 
    });
  });

  test('should display dashboard correctly on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await loginAsSystemAdmin(page);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/dashboard-tablet.png',
      fullPage: true 
    });
  });

  test('should display dashboard correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Check that mobile menu button is visible
    await expect(page.locator('.mobile-menu-button')).toBeVisible();
    
    // Check that desktop navigation is hidden
    await expect(page.locator('.navbar-nav-desktop')).toBeHidden();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/dashboard-mobile.png',
      fullPage: true 
    });
  });

  test('should test responsive stats cards', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.screenshot({ 
      path: 'tmp/screenshots/dashboard-stats-desktop.png',
      fullPage: true 
    });
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ 
      path: 'tmp/screenshots/dashboard-stats-tablet.png',
      fullPage: true 
    });
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'tmp/screenshots/dashboard-stats-mobile.png',
      fullPage: true 
    });
  });

  test('should test theme toggle functionality', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Take screenshot in light theme
    await page.screenshot({ 
      path: 'tmp/screenshots/dashboard-light-theme.png',
      fullPage: true 
    });
    
    // Click theme toggle
    await page.click('[data-action="click->theme#toggle"]');
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Take screenshot in dark theme
    await page.screenshot({ 
      path: 'tmp/screenshots/dashboard-dark-theme.png',
      fullPage: true 
    });
    
    // Toggle back to light
    await page.click('[data-action="click->theme#toggle"]');
    await page.waitForTimeout(500);
  });

  test('should test navigation breadcrumbs and layout', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to different sections to test layout consistency
    
    // Users page
    await page.click('text="Users"');
    await page.screenshot({ 
      path: 'tmp/screenshots/layout-users-page.png',
      fullPage: true 
    });
    
    // Organizations page
    await page.click('text="Organizations"');
    await page.screenshot({ 
      path: 'tmp/screenshots/layout-organizations-page.png',
      fullPage: true 
    });
    
    // Projects page
    await page.click('text="Projects"');
    await page.screenshot({ 
      path: 'tmp/screenshots/layout-projects-page.png',
      fullPage: true 
    });
    
    // Time Logs page
    await page.click('text="Time Logs"');
    await page.screenshot({ 
      path: 'tmp/screenshots/layout-time-logs-page.png',
      fullPage: true 
    });
  });

  test('should test footer layout', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Scroll to bottom to see footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer elements
    await expect(page.locator('.app-footer')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/footer-desktop.png',
      fullPage: true 
    });
    
    // Test footer on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    await page.screenshot({ 
      path: 'tmp/screenshots/footer-mobile.png',
      fullPage: true 
    });
  });

  test('should test running timer indicator', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Check if timer indicator exists
    const timerIndicator = page.locator('.status-indicator.status-running');
    
    if (await timerIndicator.count() > 0) {
      await expect(timerIndicator).toBeVisible();
      await page.screenshot({ 
        path: 'tmp/screenshots/timer-running-indicator.png',
        fullPage: true 
      });
    } else {
      // No running timer
      await page.screenshot({ 
        path: 'tmp/screenshots/no-running-timer.png',
        fullPage: true 
      });
    }
  });

  test('should test responsive table layout', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Go to a page with tables (users)
    await page.goto('/users');
    
    // Desktop table
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.screenshot({ 
      path: 'tmp/screenshots/table-desktop.png',
      fullPage: true 
    });
    
    // Tablet table
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ 
      path: 'tmp/screenshots/table-tablet.png',
      fullPage: true 
    });
    
    // Mobile table
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'tmp/screenshots/table-mobile.png',
      fullPage: true 
    });
  });
});
