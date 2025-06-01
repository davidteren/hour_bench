const { chromium } = require('playwright');

async function testTitleFix() {
  console.log('🚀 Testing dynamic title fix...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for better observation
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to landing page
    console.log('📍 Navigating to landing page...');
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/title-fix-initial.png',
      fullPage: true 
    });
    
    // Wait for typing animation to start
    console.log('⏳ Waiting for typing animation...');
    await page.waitForSelector('.title-dynamic[data-controller="typing-effect"]');
    
    // Monitor layout shifts by checking element positions
    const heroSection = page.locator('.hero-section');
    const subtitle = page.locator('.hero-subtitle-container');
    const actions = page.locator('.hero-actions');
    
    // Get initial positions
    const initialSubtitleBox = await subtitle.boundingBox();
    const initialActionsBox = await actions.boundingBox();
    
    console.log('📏 Initial positions:');
    console.log(`Subtitle Y: ${initialSubtitleBox?.y}`);
    console.log(`Actions Y: ${initialActionsBox?.y}`);
    
    // Wait and observe for 15 seconds to see multiple typing cycles
    console.log('👀 Observing typing animation for 15 seconds...');
    
    let positionChanges = 0;
    const checkInterval = setInterval(async () => {
      const currentSubtitleBox = await subtitle.boundingBox();
      const currentActionsBox = await actions.boundingBox();
      
      if (currentSubtitleBox?.y !== initialSubtitleBox?.y || 
          currentActionsBox?.y !== initialActionsBox?.y) {
        positionChanges++;
        console.log(`⚠️  Layout shift detected! Count: ${positionChanges}`);
        console.log(`Subtitle Y: ${currentSubtitleBox?.y} (was ${initialSubtitleBox?.y})`);
        console.log(`Actions Y: ${currentActionsBox?.y} (was ${initialActionsBox?.y})`);
      }
    }, 500);
    
    // Wait for 15 seconds
    await page.waitForTimeout(15000);
    clearInterval(checkInterval);
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/title-fix-final.png',
      fullPage: true 
    });
    
    // Check for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    console.log('\n📊 Test Results:');
    console.log(`Layout shifts detected: ${positionChanges}`);
    console.log(`Console errors: ${errors.length}`);
    
    if (positionChanges === 0) {
      console.log('✅ SUCCESS: No layout shifts detected! Title fix is working.');
    } else {
      console.log('❌ ISSUE: Layout shifts still occurring. Need further fixes.');
    }
    
    if (errors.length > 0) {
      console.log('Console errors:', errors);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testTitleFix().catch(console.error);
