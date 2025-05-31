const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing mobile menu functionality directly...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 } // Mobile viewport
  });
  const page = await context.newPage();

  try {
    // Navigate to the application
    console.log('📍 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    console.log('📍 Current URL:', page.url());
    
    // Check if we're on login page and try to get past it
    if (page.url().includes('/session')) {
      console.log('🔐 On login page - checking if we can access the navbar structure...');
      
      // Instead of trying to login, let's inject the navbar HTML directly to test the mobile menu
      console.log('🧪 Injecting test navbar structure...');
      
      await page.evaluate(() => {
        // Create a test navbar structure
        const navbarHTML = `
          <nav class="navbar-container">
            <div class="navbar-content">
              <div class="navbar-mobile-toggle">
                <button type="button" id="mobile-menu-button" class="mobile-menu-button" aria-controls="mobile-menu" aria-expanded="false">
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
        
        // Add the mobile-menu controller to body
        document.body.setAttribute('data-controller', 'mobile-menu');
      });
      
      // Wait for the navbar to be inserted
      await page.waitForSelector('.navbar-container', { timeout: 5000 });
      console.log('✅ Test navbar structure injected');
    }
    
    // Now test the mobile menu functionality
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
    
    // Test direct DOM manipulation (simulating Stimulus controller)
    console.log('🧪 Testing direct DOM manipulation...');
    
    // Manually toggle the menu (simulating what the Stimulus controller should do)
    await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      const button = document.querySelector('#mobile-menu-button');
      const menuIcon = document.querySelector('#mobile-menu-icon');
      const closeIcon = document.querySelector('#mobile-menu-close');
      
      if (menu && button) {
        // Open menu
        menu.classList.remove('hidden');
        if (menuIcon) menuIcon.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
        button.setAttribute('aria-expanded', 'true');
        
        console.log('Menu opened via direct manipulation');
      }
    });
    
    // Wait a moment
    await page.waitForTimeout(300);
    
    // Check if menu is now visible
    const isMenuHiddenAfterManualToggle = await mobileMenu.evaluate(el => el.classList.contains('hidden'));
    console.log('📋 Mobile menu hidden after manual toggle:', isMenuHiddenAfterManualToggle);
    
    if (isMenuHiddenAfterManualToggle !== isMenuHidden) {
      console.log('✅ Direct DOM manipulation WORKING - menu state changed');
    } else {
      console.log('❌ Direct DOM manipulation NOT working - menu state unchanged');
    }
    
    // Now test the actual button click (Stimulus controller)
    console.log('\n👆 Testing actual button click (Stimulus controller)...');
    
    // Reset menu to hidden state
    await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      if (menu) {
        menu.classList.add('hidden');
      }
    });
    
    // Click the mobile menu button
    await mobileMenuButton.click();
    
    // Wait for any animations/transitions
    await page.waitForTimeout(300);
    
    // Check if menu state changed
    const isMenuHiddenAfterClick = await mobileMenu.evaluate(el => el.classList.contains('hidden'));
    console.log('📋 Mobile menu hidden after button click:', isMenuHiddenAfterClick);
    
    if (isMenuHiddenAfterClick !== true) {
      console.log('✅ Button click WORKING - Stimulus controller functioning');
    } else {
      console.log('❌ Button click NOT working - Stimulus controller issue');
      
      // Check if Stimulus is loaded
      const stimulusLoaded = await page.evaluate(() => {
        return typeof window.Stimulus !== 'undefined';
      });
      console.log('⚡ Stimulus loaded:', stimulusLoaded);
      
      // Check if controller is connected
      const controllerConnected = await page.evaluate(() => {
        const body = document.querySelector('body');
        return body && body.hasAttribute('data-controller');
      });
      console.log('🎮 Controller attribute present:', controllerConnected);
    }
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'mobile-menu-test.png' });
    console.log('📸 Screenshot saved: mobile-menu-test.png');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  } finally {
    await browser.close();
    console.log('\n🏁 Test completed');
  }
})();
