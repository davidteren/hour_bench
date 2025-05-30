const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin } = require('./helpers/auth.js');

test.describe('User Show Page Final Validation', () => {
  test('should validate user show page with cache clearing', async ({ page }) => {
    // Clear browser cache and cookies
    await page.context().clearCookies();
    
    await loginAsSystemAdmin(page);
    
    // Navigate to user show page with cache busting
    await page.goto('/users/2?cache_bust=' + Date.now());
    await page.waitForLoadState('networkidle');
    
    // Force a hard refresh
    await page.reload({ waitUntil: 'networkidle' });
    
    // Take screenshot for comparison
    await page.screenshot({ 
      path: 'tmp/screenshots/user-show-final-validation.png',
      fullPage: true 
    });
    
    // Validate all the key elements are present and visible
    console.log('=== FINAL VALIDATION RESULTS ===');
    
    // Check main heading
    const userHeading = await page.locator('.max-w-6xl h1').first().textContent();
    console.log('✓ User heading:', userHeading);
    
    // Check action buttons
    const editVisible = await page.locator('#edit-user-btn').isVisible();
    const deleteVisible = await page.locator('#delete-user-btn').isVisible();
    const impersonateVisible = await page.locator('#impersonate-user-btn').isVisible();
    
    console.log('✓ Action buttons:');
    console.log('  - Edit button:', editVisible ? '✅ VISIBLE' : '❌ HIDDEN');
    console.log('  - Delete button:', deleteVisible ? '✅ VISIBLE' : '❌ HIDDEN');
    console.log('  - Impersonate button:', impersonateVisible ? '✅ VISIBLE' : '❌ HIDDEN');
    
    // Check responsive layout classes
    const pageContent = await page.content();
    const hasResponsiveHeader = pageContent.includes('flex flex-col lg:flex-row');
    const hasResponsiveGrid = pageContent.includes('xl:col-span-2');
    const hasNewPermissions = pageContent.includes('bg-green-50') && pageContent.includes('bg-gray-50');
    
    console.log('✓ Layout features:');
    console.log('  - Responsive header:', hasResponsiveHeader ? '✅ PRESENT' : '❌ MISSING');
    console.log('  - Responsive grid:', hasResponsiveGrid ? '✅ PRESENT' : '❌ MISSING');
    console.log('  - New permissions styling:', hasNewPermissions ? '✅ PRESENT' : '❌ MISSING');
    
    // Check sections
    const userInfoVisible = await page.locator('text=User Information').isVisible();
    const permissionsVisible = await page.locator('text=Permissions').isVisible();
    const timeLogsVisible = await page.locator('text=Recent Time Logs').isVisible();
    
    console.log('✓ Content sections:');
    console.log('  - User Information:', userInfoVisible ? '✅ VISIBLE' : '❌ HIDDEN');
    console.log('  - Permissions:', permissionsVisible ? '✅ VISIBLE' : '❌ HIDDEN');
    console.log('  - Recent Time Logs:', timeLogsVisible ? '✅ VISIBLE' : '❌ HIDDEN');
    
    // Take a screenshot of just the header area to compare with your screenshot
    const headerArea = page.locator('.max-w-6xl > div:first-child');
    await headerArea.screenshot({ 
      path: 'tmp/screenshots/user-show-header-area.png'
    });
    
    console.log('=== VALIDATION COMPLETE ===');
    console.log('Screenshots saved for comparison with your provided image');
  });

  test('should test the exact same user from your screenshot', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Try to find the exact user from your screenshot: "Fr. Ruthe Hill"
    await page.goto('/users');
    await page.waitForLoadState('networkidle');
    
    // Look for the user in the table/cards
    const userLink = page.locator('a:has-text("Fr. Ruthe Hill")').first();
    
    if (await userLink.count() > 0) {
      console.log('Found Fr. Ruthe Hill user, clicking...');
      await userLink.click();
      await page.waitForLoadState('networkidle');
      
      // Take screenshot of this specific user
      await page.screenshot({ 
        path: 'tmp/screenshots/user-show-fr-ruthe-hill.png',
        fullPage: true 
      });
      
      console.log('Screenshot taken of Fr. Ruthe Hill user page');
    } else {
      console.log('Fr. Ruthe Hill user not found, taking screenshot of users list');
      await page.screenshot({ 
        path: 'tmp/screenshots/users-list-search.png',
        fullPage: true 
      });
    }
  });
});
