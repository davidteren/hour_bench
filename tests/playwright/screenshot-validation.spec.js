const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin } = require('./helpers/auth.js');

test.describe('UI Screenshot Validation', () => {
  test('should take screenshots of all user pages', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Users Index Page
    await page.goto('/users');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tmp/screenshots/current-users-index.png',
      fullPage: true 
    });
    
    // New User Page
    await page.goto('/users/new');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tmp/screenshots/current-users-new.png',
      fullPage: true 
    });
    
    // User Show Page
    await page.goto('/users/2');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tmp/screenshots/current-users-show.png',
      fullPage: true 
    });
    
    // Edit User Page
    await page.goto('/users/2/edit');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tmp/screenshots/current-users-edit.png',
      fullPage: true 
    });
    
    console.log('✅ All user page screenshots taken');
  });

  test('should take mobile screenshots', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Mobile Users Index
    await page.goto('/users');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tmp/screenshots/current-users-index-mobile.png',
      fullPage: true 
    });
    
    // Mobile User Show
    await page.goto('/users/2');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tmp/screenshots/current-users-show-mobile.png',
      fullPage: true 
    });
    
    // Mobile New User
    await page.goto('/users/new');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tmp/screenshots/current-users-new-mobile.png',
      fullPage: true 
    });
    
    console.log('✅ All mobile screenshots taken');
  });
});
