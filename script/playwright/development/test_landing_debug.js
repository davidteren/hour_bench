const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`🖥️  BROWSER: ${msg.text()}`);
  });
  
  // Enable error logging
  page.on('pageerror', error => {
    console.log(`❌ PAGE ERROR: ${error.message}`);
  });
  
  // Enable network request logging
  page.on('request', request => {
    if (request.url().includes('.js') || request.url().includes('importmap')) {
      console.log(`📥 REQUEST: ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('.js') || response.url().includes('importmap')) {
      console.log(`📤 RESPONSE: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    console.log('🚀 Navigating to landing page...');
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    console.log('\n🔍 Checking Stimulus setup...');
    
    // Check if Stimulus is loaded
    const stimulusLoaded = await page.evaluate(() => {
      return typeof window.Stimulus !== 'undefined';
    });
    console.log(`✅ Stimulus loaded: ${stimulusLoaded}`);
    
    // Check importmap
    const importmapExists = await page.locator('script[type="importmap"]').count();
    console.log(`✅ Importmap script tags: ${importmapExists}`);
    
    if (importmapExists > 0) {
      const importmapContent = await page.locator('script[type="importmap"]').first().textContent();
      console.log(`📋 Importmap content: ${importmapContent.substring(0, 200)}...`);
    }
    
    // Check if application.js is loaded
    const applicationJsLoaded = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).some(script => 
        script.src && script.src.includes('application')
      );
    });
    console.log(`✅ Application.js loaded: ${applicationJsLoaded}`);
    
    // Check controllers directory
    const controllersLoaded = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).filter(script => 
        script.src && script.src.includes('controllers')
      ).length;
    });
    console.log(`✅ Controller scripts loaded: ${controllersLoaded}`);
    
    // Check if debug controller is working
    const debugButtonExists = await page.locator('[data-controller="debug"]').count();
    console.log(`✅ Debug controller element exists: ${debugButtonExists > 0}`);
    
    if (debugButtonExists > 0) {
      console.log('\n🧪 Testing debug button...');
      await page.click('[data-action="click->debug#test"]');
      await page.waitForTimeout(1000);
    }
    
    // Check for JavaScript errors
    console.log('\n🔍 Checking for JavaScript errors...');
    const jsErrors = await page.evaluate(() => {
      return window.jsErrors || [];
    });
    console.log(`❌ JavaScript errors: ${jsErrors.length}`);
    
    // Test modal button
    console.log('\n🔍 Testing modal button...');
    const modalButton = await page.locator('[data-modal-target-value="#demo-video-modal"]');
    const modalButtonExists = await modalButton.count();
    console.log(`✅ Modal button exists: ${modalButtonExists > 0}`);
    
    if (modalButtonExists > 0) {
      console.log('🧪 Clicking modal button...');
      await modalButton.click();
      await page.waitForTimeout(1000);
      
      const modalVisible = await page.locator('#demo-video-modal:not(.hidden)').count();
      console.log(`✅ Modal opened: ${modalVisible > 0}`);
    }
    
    // Test navigation button
    console.log('\n🔍 Testing navigation button...');
    const navButton = await page.locator('a[href="/session/new"].btn-glow');
    const navButtonExists = await navButton.count();
    console.log(`✅ Navigation button exists: ${navButtonExists > 0}`);
    
    if (navButtonExists > 0) {
      console.log('🧪 Clicking navigation button...');
      // Don't actually navigate, just test the click
      await page.evaluate(() => {
        const btn = document.querySelector('a[href="/session/new"].btn-glow');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🎯 Navigation button clicked successfully!');
          });
        }
      });
      await navButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Check Stimulus controller registration
    console.log('\n🔍 Checking Stimulus controller registration...');
    const stimulusInfo = await page.evaluate(() => {
      if (window.Stimulus) {
        return {
          hasApplication: !!window.Stimulus.application,
          hasRouter: !!window.Stimulus.router,
          modulesByIdentifier: window.Stimulus.router ? Object.keys(window.Stimulus.router.modulesByIdentifier || {}) : [],
          controllersByIdentifier: window.Stimulus.application ? Object.keys(window.Stimulus.application.router.controllersByIdentifier || {}) : []
        };
      }
      return null;
    });
    
    console.log('📋 Stimulus info:', JSON.stringify(stimulusInfo, null, 2));
    
    // Wait for user to inspect
    console.log('\n⏸️  Pausing for manual inspection. Press Ctrl+C to exit.');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();