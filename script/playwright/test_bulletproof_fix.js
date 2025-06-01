const { chromium } = require('playwright');

async function testBulletproofFix() {
  console.log('🎯 Testing bulletproof single-line fix...');
  
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
      path: 'tmp/screenshots/bulletproof-fix-initial.png',
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
    
    console.log('📏 Initial positions recorded:');
    console.log(`Title: ${initialPositions.title?.y} (height: ${initialPositions.title?.height})`);
    console.log(`Subtitle: ${initialPositions.subtitle?.y}`);
    console.log(`Actions: ${initialPositions.actions?.y}`);
    console.log(`Cards: ${initialPositions.cards?.y} (height: ${initialPositions.cards?.height})`);
    
    // Monitor for layout shifts over 20 seconds
    console.log('\n👀 Monitoring for layout shifts over 20 seconds...');
    
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
      const titleHeightChange = Math.abs((currentPositions.title?.height || 0) - (initialPositions.title?.height || 0));
      const subtitleShift = Math.abs((currentPositions.subtitle?.y || 0) - (initialPositions.subtitle?.y || 0));
      const actionsShift = Math.abs((currentPositions.actions?.y || 0) - (initialPositions.actions?.y || 0));
      const cardsShift = Math.abs((currentPositions.cards?.y || 0) - (initialPositions.cards?.y || 0));
      const cardsHeightChange = Math.abs((currentPositions.cards?.height || 0) - (initialPositions.cards?.height || 0));
      
      if (titleShift > tolerance || titleHeightChange > tolerance || 
          subtitleShift > tolerance || actionsShift > tolerance || 
          cardsShift > tolerance || cardsHeightChange > tolerance) {
        layoutShifts++;
        console.log(`⚠️  Layout shift ${layoutShifts} detected at ${i * 0.5}s:`);
        if (titleShift > tolerance) console.log(`  Title shifted: ${titleShift}px`);
        if (titleHeightChange > tolerance) console.log(`  Title height changed: ${titleHeightChange}px`);
        if (subtitleShift > tolerance) console.log(`  Subtitle shifted: ${subtitleShift}px`);
        if (actionsShift > tolerance) console.log(`  Actions shifted: ${actionsShift}px`);
        if (cardsShift > tolerance) console.log(`  Cards shifted: ${cardsShift}px`);
        if (cardsHeightChange > tolerance) console.log(`  Cards height changed: ${cardsHeightChange}px`);
      }
      
      // Log current typing text every 5 seconds
      if (i % 10 === 0) {
        const currentText = await titleElement.textContent();
        console.log(`${i * 0.5}s: Current text: "${currentText}"`);
      }
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/bulletproof-fix-final.png',
      fullPage: true 
    });
    
    console.log('\n📊 Final Test Results:');
    console.log(`Layout shifts detected: ${layoutShifts}`);
    
    if (layoutShifts === 0) {
      console.log('🎉 PERFECT: No layout shifts detected! Bulletproof fix is working!');
    } else if (layoutShifts < 3) {
      console.log('✅ EXCELLENT: Minimal layout shifts detected. Great improvement!');
    } else if (layoutShifts < 10) {
      console.log('⚠️  GOOD: Some layout shifts detected but much improved.');
    } else {
      console.log('❌ ISSUE: Significant layout shifts still occurring.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testBulletproofFix().catch(console.error);
