// Landing Page Load Testing for Production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');
const { PRODUCTION_BASE_URL } = require('../helpers/auth');
const { 
  thinkTime, 
  navigateToPage, 
  clickElement, 
  simulateReading,
  browseNavigation 
} = require('../helpers/navigation');
const { 
  setupPerformanceMonitoring,
  simulateScrolling 
} = require('../helpers/load-utils');

test.describe('Landing Page Load Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Setup performance monitoring
    await setupPerformanceMonitoring(page);
  });

  test('should handle landing page traffic simulation', async ({ page }) => {
    console.log('🏠 Starting landing page traffic simulation');
    
    // Navigate to landing page
    await page.goto(PRODUCTION_BASE_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Verify page loaded
    await expect(page).toHaveTitle(/HourBench|Hour Bench/);
    await page.waitForSelector('.hero, .landing-hero, h1', { timeout: 10000 });
    
    console.log('✅ Landing page loaded successfully');
    
    // Simulate realistic user behavior
    await simulateReading(page, 3);
    
    // Interact with hero section
    try {
      const heroButtons = page.locator('.hero .btn, .hero .button, .cta-button');
      const buttonCount = await heroButtons.count();
      
      if (buttonCount > 0) {
        console.log(`🎯 Found ${buttonCount} hero buttons`);
        
        // Click random hero button
        const randomIndex = Math.floor(Math.random() * buttonCount);
        await heroButtons.nth(randomIndex).click();
        await thinkTime(page, 2000, 4000);
        
        // Navigate back to landing page
        await page.goto(PRODUCTION_BASE_URL);
        await thinkTime(page, 1000, 2000);
      }
    } catch (error) {
      console.log(`⚠️ Hero interaction warning: ${error.message}`);
    }
    
    // Test responsive behavior
    await testResponsiveBehavior(page);
    
    // Simulate feature exploration
    await exploreFeatures(page);
    
    // Test navigation menu
    await browseNavigation(page);
    
    console.log('✅ Landing page simulation completed');
  });

  test('should simulate multiple landing page visitors', async ({ page }) => {
    console.log('👥 Simulating multiple landing page visitors');
    
    const visitCount = 5;
    
    for (let i = 0; i < visitCount; i++) {
      console.log(`👤 Visitor ${i + 1}/${visitCount}`);
      
      try {
        // Fresh page load
        await page.goto(PRODUCTION_BASE_URL, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        // Random browsing pattern
        const browsingActions = Math.floor(Math.random() * 4) + 2; // 2-5 actions
        
        for (let action = 0; action < browsingActions; action++) {
          await performRandomLandingAction(page);
          await thinkTime(page, 1000, 3000);
        }
        
        // Random chance to navigate to login
        if (Math.random() < 0.3) {
          await navigateToLogin(page);
        }
        
      } catch (error) {
        console.log(`⚠️ Visitor ${i + 1} simulation error: ${error.message}`);
      }
      
      // Delay between visitors
      await thinkTime(page, 2000, 5000);
    }
    
    console.log('✅ Multiple visitor simulation completed');
  });

  test('should test landing page performance under load', async ({ page }) => {
    console.log('⚡ Testing landing page performance under load');
    
    const startTime = Date.now();
    
    // Rapid page loads to simulate traffic spikes
    const loadCount = 10;
    const loadTimes = [];
    
    for (let i = 0; i < loadCount; i++) {
      const loadStart = Date.now();
      
      try {
        await page.goto(PRODUCTION_BASE_URL, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        const loadTime = Date.now() - loadStart;
        loadTimes.push(loadTime);
        
        console.log(`📊 Load ${i + 1}: ${loadTime}ms`);
        
        // Quick interaction
        await simulateScrolling(page);
        await thinkTime(page, 500, 1500);
        
      } catch (error) {
        console.log(`❌ Load ${i + 1} failed: ${error.message}`);
        loadTimes.push(30000); // Timeout value
      }
    }
    
    // Calculate performance metrics
    const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
    const maxLoadTime = Math.max(...loadTimes);
    const minLoadTime = Math.min(...loadTimes);
    
    console.log(`📈 Performance Results:`);
    console.log(`   Average Load Time: ${Math.round(avgLoadTime)}ms`);
    console.log(`   Max Load Time: ${maxLoadTime}ms`);
    console.log(`   Min Load Time: ${minLoadTime}ms`);
    console.log(`   Total Test Duration: ${Date.now() - startTime}ms`);
    
    // Performance assertions
    expect(avgLoadTime).toBeLessThan(10000); // Average should be under 10 seconds
    expect(maxLoadTime).toBeLessThan(30000); // Max should be under 30 seconds
    
    console.log('✅ Performance test completed');
  });
});

/**
 * Test responsive behavior at different viewport sizes
 */
async function testResponsiveBehavior(page) {
  console.log('📱 Testing responsive behavior');
  
  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1920, height: 1080, name: 'Desktop' }
  ];
  
  for (const viewport of viewports) {
    try {
      console.log(`📐 Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await thinkTime(page, 500, 1000);
      
      // Check if mobile menu is visible on small screens
      if (viewport.width < 768) {
        const mobileMenu = page.locator('[data-controller="mobile-nav"], .mobile-menu-button');
        if (await mobileMenu.first().isVisible()) {
          await clickElement(page, mobileMenu.first(), 'Mobile menu');
          await thinkTime(page, 1000, 2000);
          
          // Close mobile menu
          await clickElement(page, mobileMenu.first(), 'Close mobile menu');
        }
      }
      
      // Scroll to test layout stability
      await simulateScrolling(page);
      
    } catch (error) {
      console.log(`⚠️ Responsive test warning for ${viewport.name}: ${error.message}`);
    }
  }
  
  // Reset to default viewport
  await page.setViewportSize({ width: 1280, height: 720 });
}

/**
 * Explore features section
 */
async function exploreFeatures(page) {
  console.log('🔍 Exploring features section');
  
  try {
    // Look for features section
    const featuresSection = page.locator('.features, .feature-grid, [data-controller="features"]');
    
    if (await featuresSection.first().isVisible()) {
      // Scroll to features
      await featuresSection.first().scrollIntoViewIfNeeded();
      await thinkTime(page, 1000, 2000);
      
      // Find feature cards or tabs
      const featureElements = page.locator('.feature-card, .feature-tab, .feature-item');
      const elementCount = await featureElements.count();
      
      if (elementCount > 0) {
        console.log(`🎯 Found ${elementCount} feature elements`);
        
        // Interact with 1-3 random features
        const interactionsCount = Math.min(3, Math.floor(Math.random() * elementCount) + 1);
        
        for (let i = 0; i < interactionsCount; i++) {
          const randomIndex = Math.floor(Math.random() * elementCount);
          
          try {
            await featureElements.nth(randomIndex).click();
            await thinkTime(page, 1500, 3000);
          } catch (error) {
            console.log(`⚠️ Feature interaction warning: ${error.message}`);
          }
        }
      }
    }
    
    // Check for "Features" navigation link
    const featuresLink = page.locator('a[href*="features"], .nav-link:has-text("Features")');
    if (await featuresLink.first().isVisible()) {
      await clickElement(page, featuresLink.first(), 'Features page link');
      await thinkTime(page, 2000, 4000);
      
      // Navigate back
      await page.goBack();
      await thinkTime(page, 1000, 2000);
    }
    
  } catch (error) {
    console.log(`⚠️ Features exploration warning: ${error.message}`);
  }
}

/**
 * Perform random landing page action
 */
async function performRandomLandingAction(page) {
  const actions = [
    () => simulateScrolling(page),
    () => simulateReading(page, 1),
    () => clickRandomButton(page),
    () => hoverOverElements(page)
  ];
  
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  
  try {
    await randomAction();
  } catch (error) {
    console.log(`⚠️ Random action warning: ${error.message}`);
  }
}

/**
 * Click random button on the page
 */
async function clickRandomButton(page) {
  try {
    const buttons = page.locator('button, .btn, .button, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const randomIndex = Math.floor(Math.random() * buttonCount);
      const button = buttons.nth(randomIndex);
      
      if (await button.isVisible()) {
        await button.click();
        console.log('🖱️ Clicked random button');
        await thinkTime(page, 1000, 2000);
      }
    }
  } catch (error) {
    console.log(`⚠️ Random button click warning: ${error.message}`);
  }
}

/**
 * Hover over elements to test interactions
 */
async function hoverOverElements(page) {
  try {
    const hoverElements = page.locator('.card, .feature-card, .btn, .nav-link');
    const elementCount = await hoverElements.count();
    
    if (elementCount > 0) {
      const randomIndex = Math.floor(Math.random() * elementCount);
      await hoverElements.nth(randomIndex).hover();
      console.log('🖱️ Hovered over element');
      await thinkTime(page, 500, 1500);
    }
  } catch (error) {
    console.log(`⚠️ Hover warning: ${error.message}`);
  }
}

/**
 * Navigate to login page
 */
async function navigateToLogin(page) {
  try {
    console.log('🔐 Navigating to login page');
    
    const loginLink = page.locator('a[href*="session"], a:has-text("Login"), a:has-text("Sign In")');
    
    if (await loginLink.first().isVisible()) {
      await clickElement(page, loginLink.first(), 'Login link');
      
      // Verify login page loaded
      await page.waitForSelector('input[name="email_address"], input[type="email"]', { timeout: 10000 });
      
      // Simulate looking at login form
      await thinkTime(page, 2000, 4000);
      
      console.log('✅ Login page loaded');
    }
  } catch (error) {
    console.log(`⚠️ Login navigation warning: ${error.message}`);
  }
}
