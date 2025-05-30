const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin } = require('./helpers/auth.js');

test.describe('User Show Page Layout Validation', () => {
  test('should validate user show page layout on desktop', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to users page first
    await page.click('#nav-users');
    await expect(page).toHaveURL('/users');
    
    // Click on the first user to go to show page
    const firstUserLink = page.locator('table tbody tr:first-child td:first-child a').first();
    await firstUserLink.click();
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of current state
    await page.screenshot({ 
      path: 'tmp/screenshots/user-show-current-desktop.png',
      fullPage: true 
    });
    
    // Validate header elements
    await expect(page.locator('h1')).toBeVisible();
    console.log('User name:', await page.locator('h1').textContent());
    
    // Check for action buttons in header
    const editButton = page.locator('#edit-user-btn');
    const deleteButton = page.locator('#delete-user-btn');
    const impersonateButton = page.locator('#impersonate-user-btn');
    
    console.log('Edit button visible:', await editButton.isVisible());
    console.log('Delete button visible:', await deleteButton.isVisible());
    console.log('Impersonate button visible:', await impersonateButton.isVisible());
    
    // Check for main sections
    await expect(page.locator('text=User Information')).toBeVisible();
    await expect(page.locator('text=Permissions')).toBeVisible();
    await expect(page.locator('text=Recent Time Logs')).toBeVisible();
    
    // Validate permissions section layout
    const permissionsSection = page.locator('text=Permissions').locator('..');
    await expect(permissionsSection).toBeVisible();
    
    // Take a focused screenshot of permissions section
    await permissionsSection.screenshot({ 
      path: 'tmp/screenshots/user-show-permissions-section.png'
    });
  });

  test('should validate user show page layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Navigate to users page first
    await page.click('#mobile-menu-button');
    await page.click('#mobile-nav-users');
    await expect(page).toHaveURL('/users');
    
    // On mobile, click on a user card instead of table
    const firstUserCard = page.locator('.md\\:hidden .user-card, .md\\:hidden a').first();
    if (await firstUserCard.count() > 0) {
      await firstUserCard.click();
    } else {
      // Fallback to table if mobile cards aren't working
      const firstUserLink = page.locator('table tbody tr:first-child td:first-child a').first();
      await firstUserLink.click();
    }
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of mobile layout
    await page.screenshot({ 
      path: 'tmp/screenshots/user-show-current-mobile.png',
      fullPage: true 
    });
    
    // Check mobile responsiveness
    const header = page.locator('h1').first();
    await expect(header).toBeVisible();
    
    // Check if action buttons are stacked properly on mobile
    const buttonContainer = page.locator('.flex.flex-col.sm\\:flex-row');
    if (await buttonContainer.count() > 0) {
      console.log('Mobile button container found');
      await buttonContainer.screenshot({ 
        path: 'tmp/screenshots/user-show-mobile-buttons.png'
      });
    }
  });

  test('should validate specific layout elements', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to a specific user (let's try user ID 2)
    await page.goto('/users/2');
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/user-show-user-2.png',
      fullPage: true 
    });
    
    // Check specific elements that should be present
    const elements = [
      { selector: 'h1', name: 'Main heading' },
      { selector: '[class*="bg-blue-100"], [class*="bg-green-100"], [class*="bg-purple-100"]', name: 'Role badge' },
      { selector: 'text=User Information', name: 'User Information section' },
      { selector: 'text=Permissions', name: 'Permissions section' },
      { selector: 'text=Recent Time Logs', name: 'Recent Time Logs section' },
    ];
    
    for (const element of elements) {
      const isVisible = await page.locator(element.selector).first().isVisible();
      console.log(`${element.name}: ${isVisible ? 'VISIBLE' : 'NOT VISIBLE'}`);
    }
    
    // Check the actual HTML structure
    const pageContent = await page.content();
    console.log('Page title:', await page.title());
    console.log('Current URL:', page.url());
    
    // Look for specific classes that should be present after our changes
    const hasResponsiveClasses = pageContent.includes('xl:col-span-2') && pageContent.includes('flex-col lg:flex-row');
    console.log('Has responsive classes:', hasResponsiveClasses);
    
    // Check if permissions have the new styling
    const hasNewPermissionStyling = pageContent.includes('bg-green-50') || pageContent.includes('bg-gray-50');
    console.log('Has new permission styling:', hasNewPermissionStyling);
  });
});
