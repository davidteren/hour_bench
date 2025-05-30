const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin } = require('./helpers/auth.js');

test.describe('User Show Page Debug', () => {
  test('should debug user show page layout issues', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate directly to user show page
    await page.goto('/users/2');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to compare with your provided screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/user-show-debug-comparison.png',
      fullPage: true 
    });
    
    // Get all h1 elements to see which one we're getting
    const h1Elements = await page.locator('h1').all();
    console.log(`Found ${h1Elements.length} h1 elements:`);
    
    for (let i = 0; i < h1Elements.length; i++) {
      const text = await h1Elements[i].textContent();
      const isVisible = await h1Elements[i].isVisible();
      console.log(`H1 ${i + 1}: "${text}" (visible: ${isVisible})`);
    }
    
    // Check the page structure
    const pageHTML = await page.content();
    
    // Look for the user's name specifically
    const userNameInPage = pageHTML.includes('Fr. Ruthe Hill') || pageHTML.includes('Ruthe Hill');
    console.log('User name found in page:', userNameInPage);
    
    // Check if we have the navigation header vs content header
    const navHeader = await page.locator('nav h1, header h1').first().textContent().catch(() => 'Not found');
    const contentHeader = await page.locator('main h1, .max-w-6xl h1').first().textContent().catch(() => 'Not found');
    
    console.log('Navigation header:', navHeader);
    console.log('Content header:', contentHeader);
    
    // Check for action buttons specifically
    const editBtn = await page.locator('#edit-user-btn').isVisible();
    const deleteBtn = await page.locator('#delete-user-btn').isVisible();
    const impersonateBtn = await page.locator('#impersonate-user-btn').isVisible();
    
    console.log('Action buttons visible:');
    console.log('- Edit:', editBtn);
    console.log('- Delete:', deleteBtn);
    console.log('- Impersonate:', impersonateBtn);
    
    // Check the actual layout structure
    const hasFlexLayout = pageHTML.includes('flex flex-col lg:flex-row');
    const hasResponsiveGrid = pageHTML.includes('xl:col-span-2');
    const hasNewPermissions = pageHTML.includes('bg-green-50') || pageHTML.includes('bg-gray-50');
    
    console.log('Layout features:');
    console.log('- Responsive header layout:', hasFlexLayout);
    console.log('- Responsive grid:', hasResponsiveGrid);
    console.log('- New permission styling:', hasNewPermissions);
    
    // Take a screenshot of just the main content area
    const mainContent = page.locator('.max-w-6xl');
    await mainContent.screenshot({ 
      path: 'tmp/screenshots/user-show-main-content.png'
    });
    
    // Check if the issue is with the user data itself
    const userName = await page.locator('.max-w-6xl h1').first().textContent();
    const userEmail = await page.locator('p.text-lg').first().textContent();
    
    console.log('User details from page:');
    console.log('- Name:', userName);
    console.log('- Email:', userEmail);
  });

  test('should compare with your screenshot layout', async ({ page }) => {
    await loginAsSystemAdmin(page);
    await page.goto('/users/2');
    await page.waitForLoadState('networkidle');
    
    // Set viewport to match your screenshot size approximately
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Take screenshot with same viewport
    await page.screenshot({ 
      path: 'tmp/screenshots/user-show-viewport-match.png',
      fullPage: false  // Don't scroll, just show what's visible
    });
    
    // Check if the layout matches what you showed in your screenshot
    // Your screenshot shows the user name, but buttons might be cut off
    
    // Scroll to see if buttons are below the fold
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.screenshot({ 
      path: 'tmp/screenshots/user-show-scrolled.png',
      fullPage: false
    });
    
    console.log('Screenshots taken for comparison with your provided image');
  });
});
