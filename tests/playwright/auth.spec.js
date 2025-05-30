const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin, loginAsOrgAdmin } = require('./helpers/auth.js');

test.describe('Authentication and User Access', () => {
  test('should login as system admin successfully', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Verify we're on the dashboard (root path)
    await expect(page).toHaveURL('/');
    
    // Verify system admin elements are visible
    await expect(page.locator('.user-role:has-text("System Admin")')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/auth-system-admin-dashboard.png',
      fullPage: true 
    });
  });

  test('should have access to all navigation items as system admin', async ({ page }) => {
    await loginAsSystemAdmin(page);

    // Check desktop navigation
    await expect(page.locator('#nav-dashboard')).toBeVisible();
    await expect(page.locator('#nav-organizations')).toBeVisible();
    await expect(page.locator('#nav-users')).toBeVisible();
    await expect(page.locator('#nav-clients')).toBeVisible();
    await expect(page.locator('#nav-projects')).toBeVisible();
    await expect(page.locator('#nav-time-logs')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/auth-system-admin-navigation.png',
      fullPage: true 
    });
  });

  test('should test mobile navigation menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Mobile menu button should be visible
    await expect(page.locator('#mobile-menu-button')).toBeVisible();

    // Desktop navigation should be hidden
    await expect(page.locator('#desktop-navigation')).toBeHidden();

    // Click mobile menu button
    await page.click('#mobile-menu-button');

    // Mobile menu should be visible
    await expect(page.locator('#mobile-menu')).toBeVisible();

    // Check mobile navigation links
    await expect(page.locator('#mobile-nav-dashboard')).toBeVisible();
    await expect(page.locator('#mobile-nav-organizations')).toBeVisible();
    await expect(page.locator('#mobile-nav-users')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/auth-mobile-menu-open.png',
      fullPage: true 
    });
    
    // Click outside to close menu
    await page.click('body', { position: { x: 10, y: 10 } });
    
    // Mobile menu should be hidden
    await expect(page.locator('#mobile-menu')).toBeHidden();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/auth-mobile-menu-closed.png',
      fullPage: true 
    });
  });

  test('should logout successfully', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Click sign out
    await page.click('#sign-out-btn');
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/session/new');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/auth-logout.png',
      fullPage: true 
    });
  });
});
