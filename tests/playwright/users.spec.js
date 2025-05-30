const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin } = require('./helpers/auth.js');

test.describe('User Management', () => {
  test('should display users index page correctly', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to users page
    await page.click('#nav-users');
    await expect(page).toHaveURL('/users');

    // Check page elements
    await expect(page.locator('h1:has-text("Users")')).toBeVisible();
    await expect(page.locator('#new-user-btn')).toBeVisible();
    
    // Check if users table is visible
    await expect(page.locator('table')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/users-index-desktop.png',
      fullPage: true 
    });
  });

  test('should display users index page on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Open mobile menu and navigate to users
    await page.click('#mobile-menu-button');
    await page.click('#mobile-nav-users');
    await expect(page).toHaveURL('/users');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/users-index-mobile.png',
      fullPage: true 
    });
  });

  test('should show user details page', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to users page
    await page.goto('/users');
    
    // Click on the first user's "View" link
    const firstViewLink = page.locator('a:has-text("View")').first();
    await firstViewLink.click();
    
    // Should be on a user show page
    await expect(page.url()).toMatch(/\/users\/\d+$/);
    
    // Check page elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#edit-user-btn')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/users-show-desktop.png',
      fullPage: true 
    });
  });

  test('should show user details page on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Navigate to users page
    await page.goto('/users');
    
    // Click on the first user's "View" link
    const firstViewLink = page.locator('a:has-text("View")').first();
    await firstViewLink.click();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/users-show-mobile.png',
      fullPage: true 
    });
  });

  test('should display user edit page', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to users page and click edit on first user
    await page.goto('/users');
    const firstEditLink = page.locator('a:has-text("Edit")').first();
    await firstEditLink.click();
    
    // Should be on user edit page
    await expect(page.url()).toMatch(/\/users\/\d+\/edit$/);
    
    // Check form elements
    await expect(page.locator('h1:has-text("Edit User")')).toBeVisible();
    await expect(page.locator('input[name="user[name]"]')).toBeVisible();
    await expect(page.locator('input[name="user[email_address]"]')).toBeVisible();
    await expect(page.locator('select[name="user[role]"]')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/users-edit-desktop.png',
      fullPage: true 
    });
  });

  test('should display user edit page on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Navigate to users page and click edit on first user
    await page.goto('/users');
    const firstEditLink = page.locator('a:has-text("Edit")').first();
    await firstEditLink.click();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/users-edit-mobile.png',
      fullPage: true 
    });
  });

  test('should test user impersonation functionality', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to a specific user (not the system admin)
    await page.goto('/users/98'); // Based on the issue description
    
    // Check if impersonate button exists
    const impersonateButton = page.locator('#impersonate-user-btn');

    if (await impersonateButton.count() > 0) {
      // Take screenshot before impersonation
      await page.screenshot({ 
        path: 'tmp/screenshots/users-before-impersonation.png',
        fullPage: true 
      });
      
      // Click impersonate (but handle the confirmation dialog)
      page.on('dialog', dialog => dialog.accept());
      await impersonateButton.click();
      
      // Should be redirected to dashboard (root path)
      await expect(page).toHaveURL('/');
      
      // Take screenshot after impersonation
      await page.screenshot({ 
        path: 'tmp/screenshots/users-after-impersonation.png',
        fullPage: true 
      });
    } else {
      // Take screenshot showing missing impersonate button
      await page.screenshot({ 
        path: 'tmp/screenshots/users-missing-impersonate.png',
        fullPage: true 
      });
    }
  });

  test('should test user deletion functionality', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to users page
    await page.goto('/users');
    
    // Find a user that can be deleted (not the current user)
    const deleteLinks = page.locator('a[href*="/users/"][data-turbo-method="delete"]');
    const deleteCount = await deleteLinks.count();
    
    if (deleteCount > 0) {
      // Take screenshot before deletion attempt
      await page.screenshot({ 
        path: 'tmp/screenshots/users-before-deletion.png',
        fullPage: true 
      });
      
      // Try to click delete on the last user (to avoid deleting the current user)
      const lastDeleteLink = deleteLinks.last();
      
      // Handle confirmation dialog
      page.on('dialog', dialog => dialog.accept());
      await lastDeleteLink.click();
      
      // Take screenshot after deletion attempt
      await page.screenshot({ 
        path: 'tmp/screenshots/users-after-deletion.png',
        fullPage: true 
      });
    } else {
      // Take screenshot showing no delete options
      await page.screenshot({ 
        path: 'tmp/screenshots/users-no-delete-options.png',
        fullPage: true 
      });
    }
  });

  test('should create new user', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to users page and click new user
    await page.goto('/users');
    await page.click('#new-user-btn');
    
    // Should be on new user page
    await expect(page).toHaveURL('/users/new');
    
    // Check form elements
    await expect(page.locator('h1:has-text("New User")')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/users-new-desktop.png',
      fullPage: true 
    });
  });
});
