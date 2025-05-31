const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 } // Mobile viewport
  });
  const page = await context.newPage();

  try {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Check if we need to login first
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    if (currentUrl.includes('/sessions/new') || currentUrl.includes('/login')) {
      console.log('Need to login first...');
      
      // Fill login form
      await page.fill('input[name="email"]', 'admin@example.com');
      await page.fill('input[name="password"]', 'password');
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await page.waitForNavigation();
      console.log('Logged in, new URL:', page.url());
    }
    
    // Take screenshot of mobile view
    await page.screenshot({ path: 'mobile-navbar-before.png' });
    console.log('Screenshot taken: mobile-navbar-before.png');
    
    // Check if mobile menu button is visible
    const mobileMenuButton = await page.locator('#mobile-menu-button');
    const isVisible = await mobileMenuButton.isVisible();
    console.log('Mobile menu button visible:', isVisible);
    
    if (isVisible) {
      // Check current state of mobile menu
      const mobileMenu = await page.locator('#mobile-menu');
      const isMenuHidden = await mobileMenu.evaluate(el => el.classList.contains('hidden'));
      console.log('Mobile menu initially hidden:', isMenuHidden);
      
      // Click the mobile menu button
      await mobileMenuButton.click();
      console.log('Clicked mobile menu button');
      
      // Wait a moment for animation
      await page.waitForTimeout(500);
      
      // Check if menu opened
      const isMenuHiddenAfterClick = await mobileMenu.evaluate(el => el.classList.contains('hidden'));
      console.log('Mobile menu hidden after click:', isMenuHiddenAfterClick);
      
      // Take screenshot after clicking
      await page.screenshot({ path: 'mobile-navbar-after-click.png' });
      console.log('Screenshot taken: mobile-navbar-after-click.png');
      
      // Check console errors
      const logs = [];
      page.on('console', msg => logs.push(msg.text()));
      
      // Reload page to capture any console errors
      await page.reload();
      await page.waitForTimeout(1000);
      
      console.log('Console messages:', logs);
    } else {
      console.log('Mobile menu button not visible - checking CSS media queries');
      
      // Check computed styles
      const navbarToggle = await page.locator('.navbar-mobile-toggle');
      const display = await navbarToggle.evaluate(el => getComputedStyle(el).display);
      console.log('navbar-mobile-toggle display:', display);
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
})();
