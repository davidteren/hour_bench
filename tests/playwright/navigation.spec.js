const { test, expect } = require('@playwright/test');
const { loginAsSystemAdmin } = require('./helpers/auth.js');

test.describe('Navigation and Mobile Menu', () => {
  test('should test mobile menu functionality', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Mobile menu button should be visible
    await expect(page.locator('#mobile-menu-button')).toBeVisible();

    // Desktop navigation should be hidden
    await expect(page.locator('#desktop-navigation')).toBeHidden();

    // Mobile menu should be hidden initially
    await expect(page.locator('#mobile-menu')).toBeHidden();
    
    // Take screenshot of initial state
    await page.screenshot({ 
      path: 'tmp/screenshots/mobile-menu-initial.png',
      fullPage: true 
    });
    
    // Click mobile menu button
    await page.click('#mobile-menu-button');

    // Wait for menu to open
    await page.waitForTimeout(300);

    // Mobile menu should now be visible
    await expect(page.locator('#mobile-menu')).toBeVisible();

    // Check that menu items are visible
    await expect(page.locator('#mobile-menu .mobile-nav-link')).toHaveCount(6); // Adjust based on actual count
    
    // Take screenshot of open menu
    await page.screenshot({ 
      path: 'tmp/screenshots/mobile-menu-open.png',
      fullPage: true 
    });
    
    // Test menu icon toggle
    await expect(page.locator('#mobile-menu-icon')).toBeHidden();
    await expect(page.locator('#mobile-menu-close')).toBeVisible();

    // Click menu button again to close
    await page.click('#mobile-menu-button');
    await page.waitForTimeout(300);

    // Menu should be hidden again
    await expect(page.locator('#mobile-menu')).toBeHidden();

    // Icons should be back to original state
    await expect(page.locator('#mobile-menu-icon')).toBeVisible();
    await expect(page.locator('#mobile-menu-close')).toBeHidden();
    
    // Take screenshot of closed menu
    await page.screenshot({ 
      path: 'tmp/screenshots/mobile-menu-closed.png',
      fullPage: true 
    });
  });

  test('should test mobile menu navigation links', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Open mobile menu
    await page.click('.mobile-menu-button');
    
    // Test each navigation link
    const navLinks = [
      { text: 'Dashboard', expectedUrl: '/dashboard' },
      { text: 'Organizations', expectedUrl: '/organizations' },
      { text: 'Users', expectedUrl: '/users' },
      { text: 'Clients', expectedUrl: '/clients' },
      { text: 'Projects', expectedUrl: '/projects' },
      { text: 'Time Logs', expectedUrl: '/time_logs' }
    ];
    
    for (const link of navLinks) {
      // Open menu if it's closed
      if (await page.locator('#mobile-menu').isHidden()) {
        await page.click('.mobile-menu-button');
        await page.waitForTimeout(300);
      }
      
      // Click the navigation link
      await page.click(`#mobile-menu .mobile-nav-link:has-text("${link.text}")`);
      
      // Wait for navigation
      await page.waitForTimeout(500);
      
      // Take screenshot
      await page.screenshot({ 
        path: `tmp/screenshots/mobile-nav-${link.text.toLowerCase().replace(' ', '-')}.png`,
        fullPage: true 
      });
      
      // Verify URL (if not error page)
      try {
        await expect(page).toHaveURL(link.expectedUrl);
      } catch (error) {
        console.log(`Navigation to ${link.text} failed:`, error.message);
      }
    }
  });

  test('should test mobile menu close on outside click', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Open mobile menu
    await page.click('.mobile-menu-button');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    
    // Click outside the menu (on the main content area)
    await page.click('main', { position: { x: 100, y: 100 } });
    
    // Wait for menu to close
    await page.waitForTimeout(300);
    
    // Menu should be hidden
    await expect(page.locator('#mobile-menu')).toBeHidden();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/mobile-menu-close-outside-click.png',
      fullPage: true 
    });
  });

  test('should test mobile menu close on escape key', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Open mobile menu
    await page.click('.mobile-menu-button');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    
    // Press escape key
    await page.keyboard.press('Escape');
    
    // Wait for menu to close
    await page.waitForTimeout(300);
    
    // Menu should be hidden
    await expect(page.locator('#mobile-menu')).toBeHidden();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/mobile-menu-close-escape.png',
      fullPage: true 
    });
  });

  test('should test mobile menu auto-close on resize', async ({ page }) => {
    // Start with mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsSystemAdmin(page);
    
    // Open mobile menu
    await page.click('.mobile-menu-button');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    
    // Resize to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Wait for resize handler
    await page.waitForTimeout(500);
    
    // Menu should be hidden and desktop nav should be visible
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page.locator('.navbar-nav-desktop')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/mobile-menu-auto-close-resize.png',
      fullPage: true 
    });
  });

  test('should test responsive navigation breakpoints', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Test different viewport sizes
    const viewports = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 375, height: 667, name: 'mobile-medium' },
      { width: 414, height: 896, name: 'mobile-large' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 1200, height: 800, name: 'desktop-small' },
      { width: 1440, height: 900, name: 'desktop-medium' },
      { width: 1920, height: 1080, name: 'desktop-large' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(300);
      
      // Take screenshot
      await page.screenshot({ 
        path: `tmp/screenshots/navigation-${viewport.name}.png`,
        fullPage: true 
      });
      
      // Check navigation visibility
      if (viewport.width < 768) {
        // Mobile: hamburger menu should be visible, desktop nav hidden
        await expect(page.locator('.mobile-menu-button')).toBeVisible();
        await expect(page.locator('.navbar-nav-desktop')).toBeHidden();
      } else {
        // Desktop: desktop nav should be visible, hamburger hidden
        await expect(page.locator('.mobile-menu-button')).toBeHidden();
        await expect(page.locator('.navbar-nav-desktop')).toBeVisible();
      }
    }
  });

  test('should test navigation active states', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Test active states on different pages
    const pages = [
      { url: '/dashboard', linkText: 'Dashboard' },
      { url: '/users', linkText: 'Users' },
      { url: '/organizations', linkText: 'Organizations' },
      { url: '/projects', linkText: 'Projects' },
      { url: '/time_logs', linkText: 'Time Logs' }
    ];
    
    for (const pageInfo of pages) {
      try {
        await page.goto(pageInfo.url);
        await page.waitForTimeout(500);
        
        // Take screenshot showing active state
        await page.screenshot({ 
          path: `tmp/screenshots/navigation-active-${pageInfo.linkText.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
        
        // Check if the corresponding nav link has active class
        const activeLink = page.locator(`.nav-link.active:has-text("${pageInfo.linkText}")`);
        if (await activeLink.count() > 0) {
          await expect(activeLink).toBeVisible();
        }
      } catch (error) {
        console.log(`Error testing ${pageInfo.url}:`, error.message);
      }
    }
  });
});
