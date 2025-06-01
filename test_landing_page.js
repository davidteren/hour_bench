const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  // Listen for JavaScript errors
  page.on('pageerror', error => {
    console.log('❌ JavaScript Error:', error.message);
  });
  
  try {
    console.log('🚀 Testing landing page...');
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Page loaded successfully');
    
    // Check if Stimulus is loaded
    const stimulusLoaded = await page.evaluate(() => {
      return typeof window.Stimulus !== 'undefined';
    });
    console.log('Stimulus loaded:', stimulusLoaded ? '✅' : '❌');
    
    // Check if our controllers are registered
    const controllersRegistered = await page.evaluate(() => {
      if (!window.Stimulus) return false;
      const app = window.Stimulus;
      const registeredControllers = [];
      
      // Try to access the controllers
      try {
        const controllers = ['particles', 'typing-effect', 'stats-counter', 'hero-animations'];
        for (const controller of controllers) {
          if (app.router && app.router.modulesByIdentifier && app.router.modulesByIdentifier.has(controller)) {
            registeredControllers.push(controller);
          }
        }
      } catch (e) {
        console.log('Error checking controllers:', e);
      }
      
      return registeredControllers;
    });
    console.log('Registered controllers:', controllersRegistered);
    
    // Test button clicks
    console.log('🔘 Testing button clicks...');
    
    // Try clicking the Launch Demo button
    const launchDemoButton = page.locator('text="Launch Demo"').first();
    if (await launchDemoButton.isVisible()) {
      console.log('✅ Launch Demo button is visible');
      await launchDemoButton.click();
      await page.waitForTimeout(1000);
      
      // Check if we navigated
      const currentUrl = page.url();
      console.log('Current URL after click:', currentUrl);
      
      if (currentUrl.includes('/session/new')) {
        console.log('✅ Launch Demo button works - navigated to login');
        await page.goBack();
      } else {
        console.log('❌ Launch Demo button did not navigate');
      }
    } else {
      console.log('❌ Launch Demo button not visible');
    }
    
    // Test Explore Features button (smooth scroll)
    const exploreFeaturesButton = page.locator('text="Explore Features"').first();
    if (await exploreFeaturesButton.isVisible()) {
      console.log('✅ Explore Features button is visible');
      await exploreFeaturesButton.click();
      await page.waitForTimeout(1000);
      
      // Check if we scrolled to features section
      const featuresSection = page.locator('#features');
      const isInViewport = await featuresSection.isVisible();
      console.log('Features section visible after click:', isInViewport ? '✅' : '❌');
    }
    
    // Test Watch Demo button (modal)
    const watchDemoButton = page.locator('text="Watch Demo"').first();
    if (await watchDemoButton.isVisible()) {
      console.log('✅ Watch Demo button is visible');
      await watchDemoButton.click();
      await page.waitForTimeout(1000);
      
      // Check if modal opened
      const modal = page.locator('#demo-video-modal');
      const modalVisible = await modal.isVisible();
      console.log('Demo modal opened:', modalVisible ? '✅' : '❌');
      
      if (modalVisible) {
        // Try to close modal
        const closeButton = modal.locator('.modal-close');
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(500);
          const modalStillVisible = await modal.isVisible();
          console.log('Modal closes properly:', !modalStillVisible ? '✅' : '❌');
        }
      }
    }
    
    // Test feature cards
    console.log('🃏 Testing feature cards...');
    const featureCards = page.locator('.feature-card.enhanced');
    const cardCount = await featureCards.count();
    console.log(`Found ${cardCount} feature cards`);
    
    if (cardCount > 0) {
      // Test hover on first card
      await featureCards.first().hover();
      await page.waitForTimeout(500);
      console.log('✅ Hovered over first feature card');
      
      // Test click on first card
      await featureCards.first().click();
      await page.waitForTimeout(1000);
      
      // Check if feature modal opened
      const featureModal = page.locator('.feature-modal');
      const featureModalVisible = await featureModal.isVisible();
      console.log('Feature modal opened:', featureModalVisible ? '✅' : '❌');
    }
    
    // Test tab switching
    console.log('📑 Testing feature tabs...');
    const managementTab = page.locator('[data-category="management"]');
    if (await managementTab.isVisible()) {
      await managementTab.click();
      await page.waitForTimeout(500);
      console.log('✅ Clicked management tab');
    }
    
    // Check for any missing assets
    const missingAssets = await page.evaluate(() => {
      const images = Array.from(document.images);
      const broken = images.filter(img => !img.complete || img.naturalHeight === 0);
      return broken.map(img => img.src);
    });
    
    if (missingAssets.length > 0) {
      console.log('❌ Missing/broken images:', missingAssets);
    } else {
      console.log('✅ All images loaded successfully');
    }
    
    console.log('🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Keep browser open for manual inspection
  console.log('Browser will stay open for 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);
  
  await browser.close();
})();
