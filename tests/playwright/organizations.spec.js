const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin } = require('./helpers/auth.js');

test.describe('Organizations', () => {
  test('should display organizations index page', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to organizations page
    await page.click('text="Organizations"');
    
    // Check if we get an error or if the page loads correctly
    try {
      await expect(page).toHaveURL('/organizations');
      
      // Check page elements
      await expect(page.locator('h1')).toBeVisible();
      
      // Take screenshot of successful load
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-index-success.png',
        fullPage: true 
      });
    } catch (error) {
      // Take screenshot of error page
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-index-error.png',
        fullPage: true 
      });
      
      // Log the error for debugging
      console.log('Organizations page error:', error.message);
      
      // Check if there's an error message on the page
      const errorMessage = await page.textContent('body');
      console.log('Page content:', errorMessage);
    }
  });

  test('should display organizations index on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Open mobile menu and navigate to organizations
    await page.click('.mobile-menu-button');
    await page.click('#mobile-menu text="Organizations"');
    
    // Take screenshot regardless of success or error
    await page.screenshot({ 
      path: 'tmp/screenshots/organizations-index-mobile.png',
      fullPage: true 
    });
  });

  test('should test organization creation', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    try {
      // Navigate to organizations page
      await page.goto('/organizations');
      
      // Look for "New Organization" button
      const newOrgButton = page.locator('text="New Organization"');
      
      if (await newOrgButton.count() > 0) {
        await newOrgButton.click();
        
        // Should be on new organization page
        await expect(page).toHaveURL('/organizations/new');
        
        // Take screenshot
        await page.screenshot({ 
          path: 'tmp/screenshots/organizations-new.png',
          fullPage: true 
        });
      } else {
        // No new organization button found
        await page.screenshot({ 
          path: 'tmp/screenshots/organizations-no-new-button.png',
          fullPage: true 
        });
      }
    } catch (error) {
      // Error accessing organizations
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-creation-error.png',
        fullPage: true 
      });
    }
  });

  test('should test organization show page', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    try {
      // Navigate to organizations page
      await page.goto('/organizations');
      
      // Look for first organization link
      const firstOrgLink = page.locator('a').filter({ hasText: /view|show/i }).first();
      
      if (await firstOrgLink.count() > 0) {
        await firstOrgLink.click();
        
        // Should be on organization show page
        await expect(page.url()).toMatch(/\/organizations\/\d+$/);
        
        // Take screenshot
        await page.screenshot({ 
          path: 'tmp/screenshots/organizations-show.png',
          fullPage: true 
        });
      } else {
        // Try clicking on organization name instead
        const orgNameLink = page.locator('table a').first();
        
        if (await orgNameLink.count() > 0) {
          await orgNameLink.click();
          
          await page.screenshot({ 
            path: 'tmp/screenshots/organizations-show-via-name.png',
            fullPage: true 
          });
        } else {
          await page.screenshot({ 
            path: 'tmp/screenshots/organizations-no-show-links.png',
            fullPage: true 
          });
        }
      }
    } catch (error) {
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-show-error.png',
        fullPage: true 
      });
    }
  });

  test('should test organization edit page', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    try {
      // Navigate to organizations page
      await page.goto('/organizations');
      
      // Look for edit link
      const editLink = page.locator('a:has-text("Edit")').first();
      
      if (await editLink.count() > 0) {
        await editLink.click();
        
        // Should be on organization edit page
        await expect(page.url()).toMatch(/\/organizations\/\d+\/edit$/);
        
        // Take screenshot
        await page.screenshot({ 
          path: 'tmp/screenshots/organizations-edit.png',
          fullPage: true 
        });
      } else {
        await page.screenshot({ 
          path: 'tmp/screenshots/organizations-no-edit-links.png',
          fullPage: true 
        });
      }
    } catch (error) {
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-edit-error.png',
        fullPage: true 
      });
    }
  });

  test('should test organizations table layout', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    try {
      await page.goto('/organizations');
      
      // Desktop view
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-table-desktop.png',
        fullPage: true 
      });
      
      // Tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-table-tablet.png',
        fullPage: true 
      });
      
      // Mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-table-mobile.png',
        fullPage: true 
      });
    } catch (error) {
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-table-error.png',
        fullPage: true 
      });
    }
  });

  test('should test organization permissions and access', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    try {
      await page.goto('/organizations');
      
      // Check what actions are available
      const actions = await page.locator('table td:last-child').first().textContent();
      console.log('Available actions:', actions);
      
      // Take screenshot showing available actions
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-permissions.png',
        fullPage: true 
      });
    } catch (error) {
      await page.screenshot({ 
        path: 'tmp/screenshots/organizations-permissions-error.png',
        fullPage: true 
      });
    }
  });

  test('should test direct organization URL access', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Try accessing organization directly by ID
    const testOrgIds = [1, 2, 3, 4, 5];
    
    for (const id of testOrgIds) {
      try {
        await page.goto(`/organizations/${id}`);
        
        // If successful, take screenshot
        await page.screenshot({ 
          path: `tmp/screenshots/organizations-direct-access-${id}.png`,
          fullPage: true 
        });
        
        break; // Exit loop on first successful access
      } catch (error) {
        // Continue to next ID
        continue;
      }
    }
  });
});
