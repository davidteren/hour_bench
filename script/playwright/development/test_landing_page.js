const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testLandingPage() {
  console.log('🚀 Starting Landing Page Tests...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for better visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Browser Console Error:', msg.text());
    }
  });
  
  try {
    console.log('📍 Testing Landing Page Root Route...');
    
    // Test 1: Navigate to root and verify landing page loads
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}_landing_page_root.png`,
      fullPage: true 
    });
    
    // Verify we're on the landing page, not redirected to login
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/session/new')) {
      console.log('❌ FAILED: Root route redirects to login instead of landing page');
      return false;
    }
    
    // Test 2: Verify landing page content
    console.log('📍 Testing Landing Page Content...');
    
    // Check for hero section
    const heroTitle = await page.locator('.hero-title').first();
    await heroTitle.waitFor({ timeout: 5000 });
    const heroText = await heroTitle.textContent();
    console.log(`✅ Hero title found: "${heroText}"`);
    
    // Check for features section
    const featuresSection = await page.locator('.features-section').first();
    await featuresSection.waitFor({ timeout: 5000 });
    console.log('✅ Features section found');
    
    // Count feature cards
    const featureCards = await page.locator('.feature-card').count();
    console.log(`✅ Found ${featureCards} feature cards`);
    
    // Test 3: Test navigation links
    console.log('📍 Testing Navigation Links...');
    
    // Test Features page
    await page.click('a[href="/features"]');
    await page.waitForLoadState('networkidle');
    
    let pageUrl = page.url();
    if (pageUrl.includes('/features')) {
      console.log('✅ Features page navigation works');
      await page.screenshot({ 
        path: `tmp/screenshots/${timestamp}_features_page.png`,
        fullPage: true 
      });
    } else {
      console.log('❌ Features page navigation failed');
    }
    
    // Test About page
    await page.click('a[href="/about"]');
    await page.waitForLoadState('networkidle');
    
    pageUrl = page.url();
    if (pageUrl.includes('/about')) {
      console.log('✅ About page navigation works');
      await page.screenshot({ 
        path: `tmp/screenshots/${timestamp}_about_page.png`,
        fullPage: true 
      });
    } else {
      console.log('❌ About page navigation failed');
    }
    
    // Go back to home
    await page.click('a[href="/"]');
    await page.waitForLoadState('networkidle');
    
    // Test 4: Test theme toggle
    console.log('📍 Testing Theme Toggle...');
    
    // Check initial theme
    const htmlElement = await page.locator('html');
    let currentTheme = await htmlElement.getAttribute('data-theme');
    console.log(`📍 Initial theme: ${currentTheme}`);
    
    // Click theme toggle
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(500); // Wait for theme transition
    
    // Check if theme changed
    currentTheme = await htmlElement.getAttribute('data-theme');
    console.log(`📍 Theme after toggle: ${currentTheme}`);
    
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}_dark_theme.png`,
      fullPage: true 
    });
    
    // Test 5: Test responsive design (mobile)
    console.log('📍 Testing Mobile Responsive Design...');
    
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.waitForTimeout(500);
    
    // Check if mobile menu button is visible
    const mobileMenuButton = await page.locator('.mobile-menu-button');
    const isVisible = await mobileMenuButton.isVisible();
    
    if (isVisible) {
      console.log('✅ Mobile menu button is visible on mobile');
      
      // Test mobile menu functionality
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      const mobileMenu = await page.locator('.mobile-menu');
      const menuVisible = await mobileMenu.isVisible();
      
      if (menuVisible) {
        console.log('✅ Mobile menu opens correctly');
      } else {
        console.log('❌ Mobile menu failed to open');
      }
      
      await page.screenshot({ 
        path: `tmp/screenshots/${timestamp}_mobile_menu_open.png`,
        fullPage: true 
      });
      
    } else {
      console.log('❌ Mobile menu button not visible on mobile');
    }
    
    // Test 6: Test demo access
    console.log('📍 Testing Demo Access...');
    
    // Reset to desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    
    // Click "Try Demo" button
    await page.click('a[href="/session/new"]');
    await page.waitForLoadState('networkidle');
    
    pageUrl = page.url();
    if (pageUrl.includes('/session/new')) {
      console.log('✅ Demo access redirects to login page');
      await page.screenshot({ 
        path: `tmp/screenshots/${timestamp}_login_page.png`,
        fullPage: true 
      });
    } else {
      console.log('❌ Demo access failed to redirect to login');
    }
    
    // Test 7: Test demo login
    console.log('📍 Testing Demo Login...');
    
    // Fill in demo credentials
    await page.fill('input[name="email_address"]', 'admin@hourbench.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('input[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    pageUrl = page.url();
    if (pageUrl.includes('/app')) {
      console.log('✅ Demo login successful, redirected to app');
      await page.screenshot({ 
        path: `tmp/screenshots/${timestamp}_app_dashboard.png`,
        fullPage: true 
      });
    } else {
      console.log('❌ Demo login failed or incorrect redirect');
      console.log(`📍 Current URL after login: ${pageUrl}`);
    }
    
    // Test 8: Test logout and return to landing
    console.log('📍 Testing Logout and Return to Landing...');
    
    // Look for sign out button and click it
    try {
      await page.click('.sign-out-btn');
      await page.waitForLoadState('networkidle');
      
      pageUrl = page.url();
      if (pageUrl === 'http://localhost:3000/' || pageUrl === 'http://localhost:3000') {
        console.log('✅ Logout successful, returned to landing page');
      } else {
        console.log(`❌ Logout redirect incorrect. URL: ${pageUrl}`);
      }
    } catch (error) {
      console.log('❌ Could not find or click sign out button');
    }
    
    console.log('🎉 Landing Page Tests Completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    
    // Take error screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}_error.png`,
      fullPage: true 
    });
    
    return false;
  } finally {
    await browser.close();
  }
}

// Ensure screenshots directory exists
const screenshotsDir = path.join(process.cwd(), 'tmp', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Run the test
testLandingPage().then(success => {
  if (success) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed!');
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
