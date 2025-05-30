const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin } = require('./helpers/auth.js');

test.describe('User Show Page Direct Test', () => {
  test('should directly navigate to user show page and take screenshots', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate directly to user show page (user ID 2)
    await page.goto('/users/2');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/user-show-direct-full.png',
      fullPage: true 
    });
    
    // Check what's actually on the page
    const pageTitle = await page.title();
    const currentURL = page.url();
    const mainHeading = await page.locator('h1').first().textContent();
    
    console.log('Page Title:', pageTitle);
    console.log('Current URL:', currentURL);
    console.log('Main Heading:', mainHeading);
    
    // Check if we're actually on the user show page or redirected
    if (currentURL.includes('/users/2')) {
      console.log('✅ Successfully on user show page');
      
      // Check for specific elements
      const elements = [
        { selector: 'h1', name: 'Main heading' },
        { selector: '#edit-user-btn', name: 'Edit button' },
        { selector: '#delete-user-btn', name: 'Delete button' },
        { selector: '#impersonate-user-btn', name: 'Impersonate button' },
        { selector: 'text=User Information', name: 'User Information section' },
        { selector: 'text=Permissions', name: 'Permissions section' },
        { selector: 'text=Recent Time Logs', name: 'Recent Time Logs section' },
      ];
      
      for (const element of elements) {
        try {
          const isVisible = await page.locator(element.selector).first().isVisible();
          console.log(`${element.name}: ${isVisible ? '✅ VISIBLE' : '❌ NOT VISIBLE'}`);
        } catch (error) {
          console.log(`${element.name}: ❌ ERROR - ${error.message}`);
        }
      }
      
      // Take screenshot of just the header area
      const header = page.locator('div').first();
      await header.screenshot({ 
        path: 'tmp/screenshots/user-show-header.png'
      });
      
    } else {
      console.log('❌ Redirected to:', currentURL);
      await page.screenshot({ 
        path: 'tmp/screenshots/user-show-redirect.png',
        fullPage: true 
      });
    }
  });

  test('should test mobile layout for user show page', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Navigate directly to user show page
    await page.goto('/users/2');
    await page.waitForLoadState('networkidle');
    
    // Take mobile screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/user-show-mobile-direct.png',
      fullPage: true 
    });
    
    console.log('Mobile layout screenshot taken');
  });
});
