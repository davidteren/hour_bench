// Responsive Behavior Load Testing for Production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');
const { PRODUCTION_BASE_URL } = require('../helpers/auth');
const { 
  thinkTime, 
  clickElement, 
  simulateReading 
} = require('../helpers/navigation');
const { 
  setupPerformanceMonitoring,
  simulateScrolling 
} = require('../helpers/load-utils');

test.describe('Responsive Behavior Load Testing', () => {
  test.beforeEach(async ({ page }) => {
    await setupPerformanceMonitoring(page);
  });

  test('should test responsive behavior across all device sizes', async ({ page }) => {
    console.log('📱 Testing responsive behavior across device sizes');
    
    const devices = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 768, name: 'iPad Landscape' },
      { width: 1280, height: 720, name: 'Laptop' },
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 2560, height: 1440, name: 'Large Desktop' }
    ];
    
    const testPages = ['/', '/features', '/about', '/session/new'];
    
    for (const device of devices) {
      console.log(`📐 Testing ${device.name} (${device.width}x${device.height})`);
      
      try {
        await page.setViewportSize({ width: device.width, height: device.height });
        await thinkTime(page, 500, 1000);
        
        for (const testPage of testPages) {
          try {
            console.log(`  📄 Testing page: ${testPage}`);
            
            await page.goto(`${PRODUCTION_BASE_URL}${testPage}`, {
              waitUntil: 'networkidle',
              timeout: 30000
            });
            
            // Test responsive layout
            await testResponsiveLayout(page, device);
            
            // Test mobile navigation if applicable
            if (device.width < 768) {
              await testMobileNavigation(page);
            }
            
            // Test scrolling behavior
            await simulateScrolling(page);
            await thinkTime(page, 1000, 2000);
            
          } catch (error) {
            console.log(`⚠️ Error testing ${testPage} on ${device.name}: ${error.message}`);
          }
        }
        
      } catch (error) {
        console.log(`❌ Error testing device ${device.name}: ${error.message}`);
      }
    }
    
    console.log('✅ Responsive behavior testing completed');
  });

  test('should test mobile navigation interactions', async ({ page }) => {
    console.log('📱 Testing mobile navigation interactions');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const testPages = ['/', '/features', '/about'];
    
    for (const testPage of testPages) {
      try {
        console.log(`📄 Testing mobile navigation on: ${testPage}`);
        
        await page.goto(`${PRODUCTION_BASE_URL}${testPage}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        // Test mobile menu functionality
        await testMobileMenuFunctionality(page);
        
        // Test touch interactions
        await testTouchInteractions(page);
        
        await thinkTime(page, 1500, 2500);
        
      } catch (error) {
        console.log(`⚠️ Mobile navigation error on ${testPage}: ${error.message}`);
      }
    }
    
    console.log('✅ Mobile navigation testing completed');
  });

  test('should test tablet landscape and portrait modes', async ({ page }) => {
    console.log('📱 Testing tablet orientations');
    
    const tabletSizes = [
      { width: 768, height: 1024, name: 'Tablet Portrait' },
      { width: 1024, height: 768, name: 'Tablet Landscape' }
    ];
    
    for (const size of tabletSizes) {
      console.log(`📐 Testing ${size.name}`);
      
      try {
        await page.setViewportSize({ width: size.width, height: size.height });
        await thinkTime(page, 500, 1000);
        
        // Test landing page
        await page.goto(PRODUCTION_BASE_URL, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        // Test layout stability
        await testLayoutStability(page, size);
        
        // Test navigation behavior
        await testTabletNavigation(page);
        
        // Test interactive elements
        await testInteractiveElements(page);
        
      } catch (error) {
        console.log(`❌ Error testing ${size.name}: ${error.message}`);
      }
    }
    
    console.log('✅ Tablet orientation testing completed');
  });

  test('should test responsive performance under load', async ({ page }) => {
    console.log('⚡ Testing responsive performance under load');
    
    const devices = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    const loadIterations = 5;
    
    for (const device of devices) {
      console.log(`📊 Performance testing on ${device.name}`);
      
      await page.setViewportSize({ width: device.width, height: device.height });
      
      const loadTimes = [];
      
      for (let i = 0; i < loadIterations; i++) {
        try {
          const startTime = Date.now();
          
          await page.goto(PRODUCTION_BASE_URL, {
            waitUntil: 'networkidle',
            timeout: 30000
          });
          
          const loadTime = Date.now() - startTime;
          loadTimes.push(loadTime);
          
          console.log(`  📈 Load ${i + 1}: ${loadTime}ms`);
          
          // Quick interaction test
          await simulateScrolling(page);
          await thinkTime(page, 500, 1000);
          
        } catch (error) {
          console.log(`❌ Load test ${i + 1} failed on ${device.name}: ${error.message}`);
          loadTimes.push(30000); // Timeout value
        }
      }
      
      // Calculate performance metrics
      const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
      console.log(`📊 ${device.name} average load time: ${Math.round(avgLoadTime)}ms`);
      
      // Performance assertion (more lenient for mobile)
      const maxExpectedTime = device.width < 768 ? 15000 : 10000;
      expect(avgLoadTime).toBeLessThan(maxExpectedTime);
    }
    
    console.log('✅ Responsive performance testing completed');
  });

  test('should test cross-device user journey simulation', async ({ page }) => {
    console.log('🔄 Testing cross-device user journey simulation');
    
    const deviceJourney = [
      { width: 375, height: 667, name: 'Mobile Start', actions: ['landing', 'features'] },
      { width: 768, height: 1024, name: 'Tablet Continue', actions: ['about', 'login_view'] },
      { width: 1920, height: 1080, name: 'Desktop Finish', actions: ['landing', 'full_browse'] }
    ];
    
    for (const step of deviceJourney) {
      console.log(`📱 ${step.name}: ${step.actions.join(', ')}`);
      
      try {
        await page.setViewportSize({ width: step.width, height: step.height });
        await thinkTime(page, 500, 1000);
        
        for (const action of step.actions) {
          await performDeviceAction(page, action, step);
          await thinkTime(page, 1000, 2000);
        }
        
      } catch (error) {
        console.log(`❌ Error in ${step.name}: ${error.message}`);
      }
    }
    
    console.log('✅ Cross-device journey simulation completed');
  });
});

/**
 * Test responsive layout elements
 */
async function testResponsiveLayout(page, device) {
  try {
    // Check if essential elements are visible
    const essentialElements = [
      'body',
      'nav, .navbar, .navigation',
      'main, .main-content, .content',
      'h1, .title, .hero-title'
    ];
    
    for (const selector of essentialElements) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
      } catch (error) {
        console.log(`⚠️ Element not found on ${device.name}: ${selector}`);
      }
    }
    
    // Test layout doesn't overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = device.width;
    
    if (bodyWidth > viewportWidth + 20) { // Allow small tolerance
      console.log(`⚠️ Horizontal overflow detected on ${device.name}: ${bodyWidth}px > ${viewportWidth}px`);
    }
    
  } catch (error) {
    console.log(`⚠️ Layout test warning for ${device.name}: ${error.message}`);
  }
}

/**
 * Test mobile navigation functionality
 */
async function testMobileNavigation(page) {
  try {
    // Look for mobile menu button
    const mobileMenuSelectors = [
      '[data-controller="mobile-nav"]',
      '.mobile-menu-button',
      '.hamburger',
      '.menu-toggle',
      'button[aria-label*="menu"]'
    ];
    
    let mobileMenuButton = null;
    
    for (const selector of mobileMenuSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          mobileMenuButton = element;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (mobileMenuButton) {
      console.log('📱 Testing mobile menu');
      
      // Open mobile menu
      await mobileMenuButton.click();
      await thinkTime(page, 500, 1000);
      
      // Look for menu items
      const menuItems = page.locator('.mobile-nav-link, .mobile-menu a, nav a');
      const itemCount = await menuItems.count();
      
      if (itemCount > 0) {
        console.log(`📋 Found ${itemCount} mobile menu items`);
        
        // Test 1-2 menu items
        const itemsToTest = Math.min(2, itemCount);
        for (let i = 0; i < itemsToTest; i++) {
          try {
            const randomItem = menuItems.nth(Math.floor(Math.random() * itemCount));
            if (await randomItem.isVisible()) {
              await randomItem.hover();
              await thinkTime(page, 500, 1000);
            }
          } catch (e) {
            console.log(`⚠️ Menu item interaction warning: ${e.message}`);
          }
        }
      }
      
      // Close mobile menu
      try {
        await mobileMenuButton.click();
        await thinkTime(page, 500, 1000);
      } catch (e) {
        console.log('⚠️ Could not close mobile menu');
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Mobile navigation test warning: ${error.message}`);
  }
}

/**
 * Test mobile menu functionality in detail
 */
async function testMobileMenuFunctionality(page) {
  try {
    console.log('🍔 Testing mobile menu functionality');
    
    const mobileMenuButton = page.locator('[data-controller="mobile-nav"]').first();
    
    if (await mobileMenuButton.isVisible()) {
      // Test menu open/close cycle
      for (let cycle = 0; cycle < 2; cycle++) {
        console.log(`🔄 Menu cycle ${cycle + 1}`);
        
        // Open menu
        await mobileMenuButton.click();
        await thinkTime(page, 800, 1200);
        
        // Test menu is accessible
        const menuContainer = page.locator('.mobile-nav, .mobile-menu, [data-mobile-nav-target]');
        if (await menuContainer.first().isVisible()) {
          console.log('✅ Mobile menu opened successfully');
          
          // Test menu items
          const menuLinks = page.locator('.mobile-nav-link, .mobile-menu a');
          const linkCount = await menuLinks.count();
          
          if (linkCount > 0) {
            // Hover over random menu item
            const randomLink = menuLinks.nth(Math.floor(Math.random() * linkCount));
            await randomLink.hover();
            await thinkTime(page, 500, 1000);
          }
        }
        
        // Close menu
        await mobileMenuButton.click();
        await thinkTime(page, 500, 1000);
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Mobile menu functionality warning: ${error.message}`);
  }
}

/**
 * Test touch interactions
 */
async function testTouchInteractions(page) {
  try {
    console.log('👆 Testing touch interactions');
    
    // Test tap interactions on buttons
    const touchElements = page.locator('button, .btn, .card, .feature-card');
    const elementCount = await touchElements.count();
    
    if (elementCount > 0) {
      const randomElement = touchElements.nth(Math.floor(Math.random() * elementCount));
      
      if (await randomElement.isVisible()) {
        // Simulate touch tap
        await randomElement.tap();
        await thinkTime(page, 1000, 2000);
      }
    }
    
    // Test swipe-like scrolling
    await page.evaluate(() => {
      window.scrollBy(0, 200);
    });
    await thinkTime(page, 500, 1000);
    
  } catch (error) {
    console.log(`⚠️ Touch interaction warning: ${error.message}`);
  }
}

/**
 * Test layout stability
 */
async function testLayoutStability(page, size) {
  try {
    console.log(`📐 Testing layout stability for ${size.name}`);
    
    // Measure initial layout
    const initialHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // Simulate content loading/interaction
    await simulateScrolling(page);
    await thinkTime(page, 1000, 2000);
    
    // Measure layout after interaction
    const finalHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // Check for significant layout shifts
    const heightDifference = Math.abs(finalHeight - initialHeight);
    if (heightDifference > 100) {
      console.log(`⚠️ Potential layout shift detected: ${heightDifference}px difference`);
    }
    
  } catch (error) {
    console.log(`⚠️ Layout stability test warning: ${error.message}`);
  }
}

/**
 * Test tablet navigation behavior
 */
async function testTabletNavigation(page) {
  try {
    console.log('📱 Testing tablet navigation');
    
    // Test navigation menu
    const navLinks = page.locator('nav a, .nav-link, .navbar a');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      // Test hover states on tablet
      const randomLink = navLinks.nth(Math.floor(Math.random() * linkCount));
      await randomLink.hover();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Tablet navigation warning: ${error.message}`);
  }
}

/**
 * Test interactive elements
 */
async function testInteractiveElements(page) {
  try {
    console.log('🖱️ Testing interactive elements');
    
    const interactiveElements = page.locator('button, .btn, .card, [role="button"], a[href]');
    const elementCount = await interactiveElements.count();
    
    if (elementCount > 0) {
      // Test 2-3 random elements
      const elementsToTest = Math.min(3, elementCount);
      
      for (let i = 0; i < elementsToTest; i++) {
        const randomElement = interactiveElements.nth(Math.floor(Math.random() * elementCount));
        
        if (await randomElement.isVisible()) {
          await randomElement.hover();
          await thinkTime(page, 500, 1000);
          
          // 50% chance to click
          if (Math.random() < 0.5) {
            try {
              await randomElement.click();
              await thinkTime(page, 1000, 2000);
            } catch (e) {
              console.log(`⚠️ Click interaction warning: ${e.message}`);
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Interactive elements test warning: ${error.message}`);
  }
}

/**
 * Perform device-specific actions
 */
async function performDeviceAction(page, action, deviceStep) {
  try {
    switch (action) {
      case 'landing':
        await page.goto(PRODUCTION_BASE_URL);
        await simulateReading(page, 2);
        break;
        
      case 'features':
        try {
          await page.goto(`${PRODUCTION_BASE_URL}/features`);
          await simulateReading(page, 2);
        } catch (e) {
          // Features page might not exist, test features on landing page
          await page.goto(PRODUCTION_BASE_URL);
          await testFeatureSection(page);
        }
        break;
        
      case 'about':
        try {
          await page.goto(`${PRODUCTION_BASE_URL}/about`);
          await simulateReading(page, 1);
        } catch (e) {
          console.log('About page not available');
        }
        break;
        
      case 'login_view':
        await page.goto(`${PRODUCTION_BASE_URL}/session/new`);
        await thinkTime(page, 2000, 3000);
        break;
        
      case 'full_browse':
        await testInteractiveElements(page);
        await simulateScrolling(page);
        break;
        
      default:
        console.log(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.log(`⚠️ Device action "${action}" warning: ${error.message}`);
  }
}

/**
 * Test feature section on current page
 */
async function testFeatureSection(page) {
  try {
    const featuresSection = page.locator('.features, .feature-grid, [data-controller="features"]');
    
    if (await featuresSection.first().isVisible()) {
      await featuresSection.first().scrollIntoViewIfNeeded();
      await thinkTime(page, 1000, 2000);
      
      // Test feature interactions
      const featureElements = page.locator('.feature-card, .feature-tab, .feature-item');
      const elementCount = await featureElements.count();
      
      if (elementCount > 0) {
        const randomFeature = featureElements.nth(Math.floor(Math.random() * elementCount));
        await randomFeature.hover();
        await thinkTime(page, 1000, 1500);
      }
    }
  } catch (error) {
    console.log(`⚠️ Feature section test warning: ${error.message}`);
  }
}
