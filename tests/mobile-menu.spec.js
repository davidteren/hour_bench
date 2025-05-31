const { test, expect } = require('@playwright/test');

test.describe('Mobile Menu Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
  });

  test('should show mobile menu button on mobile viewport and toggle menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Handle login if needed
    const currentUrl = page.url();
    if (currentUrl.includes('/session')) {
      console.log('🔐 Logging in...');
      
      // Try clicking the quick login button for system admin
      const quickLoginButton = page.locator('button:has-text("Login as System Admin")');
      if (await quickLoginButton.isVisible()) {
        await quickLoginButton.click();
        await page.waitForNavigation();
      } else {
        // Fallback to manual login
        await page.fill('input[name="email_address"]', 'admin@hours.com');
        await page.fill('input[name="password"]', 'password123');
        await page.click('input[type="submit"]');
        await page.waitForNavigation();
      }
    }

    // Verify we're logged in by checking for navbar
    await expect(page.locator('.navbar-container')).toBeVisible();

    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('#mobile-menu-button');
    await expect(mobileMenuButton).toBeVisible();

    // Check if mobile menu is initially hidden
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toHaveClass(/hidden/);

    // Click the mobile menu button
    await mobileMenuButton.click();

    // Check if mobile menu is now visible (hidden class removed)
    await expect(mobileMenu).not.toHaveClass(/hidden/);

    // Verify menu items are visible
    await expect(page.locator('#mobile-nav-dashboard')).toBeVisible();
    await expect(page.locator('#mobile-nav-projects')).toBeVisible();

    // Click the button again to close the menu
    await mobileMenuButton.click();

    // Check if mobile menu is hidden again
    await expect(mobileMenu).toHaveClass(/hidden/);
  });

  test('should hide mobile menu button on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Handle login if needed
    const currentUrl = page.url();
    if (currentUrl.includes('/session')) {
      const quickLoginButton = page.locator('button:has-text("Login as System Admin")');
      if (await quickLoginButton.isVisible()) {
        await quickLoginButton.click();
        await page.waitForNavigation();
      }
    }

    // Verify we're logged in
    await expect(page.locator('.navbar-container')).toBeVisible();

    // Check if mobile menu button is hidden on desktop
    const mobileMenuToggle = page.locator('.navbar-mobile-toggle');
    await expect(mobileMenuToggle).not.toBeVisible();

    // Check if desktop navigation is visible
    const desktopNav = page.locator('.navbar-nav-desktop');
    await expect(desktopNav).toBeVisible();
  });

  test('should check CSS media queries are working', async ({ page }) => {
    // Handle login first
    const currentUrl = page.url();
    if (currentUrl.includes('/session')) {
      const quickLoginButton = page.locator('button:has-text("Login as System Admin")');
      if (await quickLoginButton.isVisible()) {
        await quickLoginButton.click();
        await page.waitForNavigation();
      }
    }

    // Test mobile breakpoint
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileToggle = page.locator('.navbar-mobile-toggle');
    const display = await mobileToggle.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('block');

    // Test desktop breakpoint
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const displayDesktop = await mobileToggle.evaluate(el => getComputedStyle(el).display);
    expect(displayDesktop).toBe('none');
  });
});
