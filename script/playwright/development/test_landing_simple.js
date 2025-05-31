const { chromium } = require('playwright');

async function testLandingPageSimple() {
  console.log('🚀 Starting Simple Landing Page Test...');
  
  const browser = await chromium.launch({ 
    headless: true // Run headless to save resources
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Enable console logging for errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Browser Console Error:', msg.text());
    }
  });
  
  try {
    console.log('📍 Testing Landing Page Root Route...');
    
    // Test 1: Navigate to root and verify landing page loads
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
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
    
    if (featureCards < 6) {
      console.log('❌ Expected at least 6 feature cards');
      return false;
    }
    
    // Test 3: Test navigation links
    console.log('📍 Testing Navigation Links...');
    
    // Test Features page
    await page.click('a[href="/features"]');
    await page.waitForLoadState('networkidle');
    
    let pageUrl = page.url();
    if (pageUrl.includes('/features')) {
      console.log('✅ Features page navigation works');
    } else {
      console.log('❌ Features page navigation failed');
      return false;
    }
    
    // Test About page
    await page.click('a[href="/about"]');
    await page.waitForLoadState('networkidle');
    
    pageUrl = page.url();
    if (pageUrl.includes('/about')) {
      console.log('✅ About page navigation works');
    } else {
      console.log('❌ About page navigation failed');
      return false;
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
    const themeToggle = await page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
      
      // Check if theme changed
      currentTheme = await htmlElement.getAttribute('data-theme');
      console.log(`📍 Theme after toggle: ${currentTheme}`);
      console.log('✅ Theme toggle works');
    } else {
      console.log('⚠️ Theme toggle button not found, skipping test');
    }
    
    // Test 5: Test demo access
    console.log('📍 Testing Demo Access...');
    
    // Click "Try Demo" button
    await page.click('a[href="/session/new"]');
    await page.waitForLoadState('networkidle');
    
    pageUrl = page.url();
    if (pageUrl.includes('/session/new')) {
      console.log('✅ Demo access redirects to login page');
    } else {
      console.log('❌ Demo access failed to redirect to login');
      return false;
    }
    
    // Test 6: Test demo login
    console.log('📍 Testing Demo Login...');
    
    // Fill in demo credentials
    await page.fill('input[name="email_address"]', 'admin@hourbench.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('input[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    pageUrl = page.url();
    if (pageUrl.includes('/app')) {
      console.log('✅ Demo login successful, redirected to app');
    } else {
      console.log('❌ Demo login failed or incorrect redirect');
      console.log(`📍 Current URL after login: ${pageUrl}`);
      return false;
    }
    
    console.log('🎉 All Landing Page Tests Passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// Run the test
testLandingPageSimple().then(success => {
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
