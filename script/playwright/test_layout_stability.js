const { chromium } = require('playwright');

async function testLayoutStability() {
  console.log('🚀 Testing layout stability fixes...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to landing page
    console.log('📍 Navigating to landing page...');
    await page.goto('http://localhost:3000');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for animations to settle
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/layout-stability-initial.png',
      fullPage: true 
    });
    
    // Get initial positions of key elements
    const titleElement = page.locator('.title-dynamic');
    const subtitleElement = page.locator('.hero-subtitle-container');
    const actionsElement = page.locator('.hero-actions');
    const cardsElement = page.locator('.hero-preview-cards');
    
    const initialPositions = {
      title: await titleElement.boundingBox(),
      subtitle: await subtitleElement.boundingBox(),
      actions: await actionsElement.boundingBox(),
      cards: await cardsElement.boundingBox()
    };
    
    console.log('📏 Initial positions recorded');
    console.log(`Title: ${initialPositions.title?.y}`);
    console.log(`Subtitle: ${initialPositions.subtitle?.y}`);
    console.log(`Actions: ${initialPositions.actions?.y}`);
    console.log(`Cards: ${initialPositions.cards?.y}`);
    
    // Monitor for layout shifts over 20 seconds
    console.log('👀 Monitoring for layout shifts over 20 seconds...');
    
    let layoutShifts = 0;
    const tolerance = 1; // 1px tolerance for minor browser differences
    
    for (let i = 0; i < 40; i++) { // Check every 500ms for 20 seconds
      await page.waitForTimeout(500);
      
      const currentPositions = {
        title: await titleElement.boundingBox(),
        subtitle: await subtitleElement.boundingBox(),
        actions: await actionsElement.boundingBox(),
        cards: await cardsElement.boundingBox()
      };
      
      // Check for significant position changes
      const titleShift = Math.abs((currentPositions.title?.y || 0) - (initialPositions.title?.y || 0));
      const subtitleShift = Math.abs((currentPositions.subtitle?.y || 0) - (initialPositions.subtitle?.y || 0));
      const actionsShift = Math.abs((currentPositions.actions?.y || 0) - (initialPositions.actions?.y || 0));
      const cardsShift = Math.abs((currentPositions.cards?.y || 0) - (initialPositions.cards?.y || 0));
      
      if (titleShift > tolerance || subtitleShift > tolerance || 
          actionsShift > tolerance || cardsShift > tolerance) {
        layoutShifts++;
        console.log(`⚠️  Layout shift ${layoutShifts} detected at ${i * 0.5}s:`);
        if (titleShift > tolerance) console.log(`  Title shifted: ${titleShift}px`);
        if (subtitleShift > tolerance) console.log(`  Subtitle shifted: ${subtitleShift}px`);
        if (actionsShift > tolerance) console.log(`  Actions shifted: ${actionsShift}px`);
        if (cardsShift > tolerance) console.log(`  Cards shifted: ${cardsShift}px`);
      }
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/layout-stability-final.png',
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
    console.log(`Layout shifts detected: ${layoutShifts}`);
    console.log(`Console errors: ${errors.length}`);
    
    if (layoutShifts === 0) {
      console.log('✅ SUCCESS: No layout shifts detected! Fixes are working.');
    } else if (layoutShifts < 5) {
      console.log('⚠️  MINOR ISSUES: Some layout shifts detected but much improved.');
    } else {
      console.log('❌ ISSUE: Significant layout shifts still occurring.');
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

testLayoutStability().catch(console.error);
