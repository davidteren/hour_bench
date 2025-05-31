/**
 * Development Test: Mobile Menu Functionality
 * 
 * This script tests the mobile menu toggle functionality across different viewports.
 * Use this during development to verify mobile navigation is working correctly.
 * 
 * Usage: node script/playwright/development/test_mobile_menu.js
 */

const { chromium } = require('playwright');

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

(async () => {
  console.log('🔍 Testing mobile menu functionality...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 } // Mobile viewport
  });
  const page = await context.newPage();

  const timestamp = getTimestamp();

  try {
    console.log('📍 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    console.log('📍 Current URL:', page.url());
    
    // Inject test navbar structure to simulate logged-in state
    console.log('🧪 Injecting test navbar structure...');
    
    await page.evaluate(() => {
      // Create a test navbar structure
      const navbarHTML = `
        <nav class="navbar-container" data-controller="mobile-menu">
          <div class="navbar-content">
            <div class="navbar-mobile-toggle">
              <button type="button" id="mobile-menu-button" class="mobile-menu-button" aria-controls="mobile-menu" aria-expanded="false" data-action="click->mobile-menu#toggle">
                <span class="sr-only">Open main menu</span>
                <span id="mobile-menu-icon" class="mobile-menu-icon">☰</span>
                <span id="mobile-menu-close" class="mobile-menu-close hidden">✕</span>
              </button>
            </div>
            
            <div class="navbar-brand">
              <span class="brand-text">HourBench</span>
            </div>
            
            <div class="navbar-nav-desktop">
              <a href="#" class="nav-link">Dashboard</a>
              <a href="#" class="nav-link">Projects</a>
            </div>
            
            <div class="navbar-controls">
              <button class="theme-toggle-premium">🌙</button>
            </div>
          </div>
          
          <div class="mobile-menu hidden" id="mobile-menu">
            <div class="mobile-nav-links">
              <a href="#" class="mobile-nav-link" id="mobile-nav-dashboard">Dashboard</a>
              <a href="#" class="mobile-nav-link" id="mobile-nav-projects">Projects</a>
              <a href="#" class="mobile-nav-link" id="mobile-nav-time-logs">Time Logs</a>
            </div>
          </div>
        </nav>
      `;
      
      // Insert navbar at the beginning of body
      document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    });
    
    // Wait for the navbar to be inserted
    await page.waitForSelector('.navbar-container', { timeout: 5000 });
    console.log('✅ Test navbar structure injected');
    
    // Test mobile menu functionality
    console.log('\n📱 Testing mobile menu components...');
    
    // Check if mobile menu button exists and is visible
    const mobileMenuButton = page.locator('#mobile-menu-button');
    const buttonExists = await mobileMenuButton.count() > 0;
    console.log('🔘 Mobile menu button exists:', buttonExists);
    
    if (!buttonExists) {
      console.log('❌ Mobile menu button not found');
      return;
    }
    
    // Check visibility
    const isVisible = await mobileMenuButton.isVisible();
    console.log('👁️  Mobile menu button visible:', isVisible);
    
    // Check computed styles
    const navbarToggle = page.locator('.navbar-mobile-toggle');
    const display = await navbarToggle.evaluate(el => getComputedStyle(el).display);
    console.log('🎨 navbar-mobile-toggle display style:', display);
    
    // Check mobile menu element
    const mobileMenu = page.locator('#mobile-menu');
    const menuExists = await mobileMenu.count() > 0;
    console.log('📋 Mobile menu element exists:', menuExists);
    
    if (!menuExists) {
      console.log('❌ Mobile menu element not found');
      return;
    }
    
    // Test menu toggle functionality
    console.log('\n🔄 Testing menu toggle functionality...');
    
    const isMenuHidden = await mobileMenu.evaluate(el => el.classList.contains('hidden'));
    console.log('📋 Mobile menu initially hidden:', isMenuHidden);
    
    // Take screenshot before click
    await page.screenshot({ path: `tmp/screenshots/${timestamp}-mobile-menu-before.png` });
    console.log(`📸 Screenshot saved: tmp/screenshots/${timestamp}-mobile-menu-before.png`);
    
    // Click the mobile menu button
    console.log('👆 Clicking mobile menu button...');
    await mobileMenuButton.click();
    
    // Wait for any animations/transitions
    await page.waitForTimeout(300);
    
    // Check if menu state changed
    const isMenuHiddenAfterClick = await mobileMenu.evaluate(el => el.classList.contains('hidden'));
    console.log('📋 Mobile menu hidden after click:', isMenuHiddenAfterClick);
    
    // Take screenshot after click
    await page.screenshot({ path: `tmp/screenshots/${timestamp}-mobile-menu-after.png` });
    console.log(`📸 Screenshot saved: tmp/screenshots/${timestamp}-mobile-menu-after.png`);
    
    if (isMenuHiddenAfterClick !== isMenuHidden) {
      console.log('✅ Mobile menu toggle WORKING - menu state changed successfully');
    } else {
      console.log('❌ Mobile menu toggle NOT working - menu state unchanged');
      
      // Check if Stimulus is loaded
      const stimulusLoaded = await page.evaluate(() => {
        return typeof window.Stimulus !== 'undefined';
      });
      console.log('⚡ Stimulus loaded:', stimulusLoaded);
      
      // Check if controller is connected
      const controllerConnected = await page.evaluate(() => {
        const nav = document.querySelector('nav[data-controller="mobile-menu"]');
        return nav && nav.hasAttribute('data-controller');
      });
      console.log('🎮 Controller attribute present:', controllerConnected);
    }
    
    // Test different viewport sizes
    console.log('\n📱 Testing different viewport sizes...');
    
    const viewports = [
      { name: 'iPhone SE', width: 320, height: 568 },
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(300);
      
      const toggleDisplay = await navbarToggle.evaluate(el => getComputedStyle(el).display);
      const shouldBeVisible = viewport.width <= 768;
      
      console.log(`📱 ${viewport.name} (${viewport.width}px): toggle display = ${toggleDisplay}, should be visible = ${shouldBeVisible}`);
      
      await page.screenshot({ path: `tmp/screenshots/${timestamp}-mobile-menu-${viewport.name.toLowerCase().replace(' ', '-')}.png` });
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  } finally {
    await browser.close();
    console.log('\n🏁 Mobile menu test completed');
  }
})();
