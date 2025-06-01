const { chromium } = require('playwright');

async function testFinalStability() {
  console.log('🚀 Testing final layout stability fixes...');
  
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
    await page.waitForTimeout(3000); // Wait for animations to settle
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/final-stability-initial.png',
      fullPage: true 
    });
    
    // Get initial positions of key elements
    const titleContainer = page.locator('.title-dynamic-container');
    const titleDynamic = page.locator('.title-dynamic');
    const subtitleElement = page.locator('.hero-subtitle-container');
    const actionsElement = page.locator('.hero-actions');
    const cardsElement = page.locator('.hero-preview-cards');
    
    const initialPositions = {
      titleContainer: await titleContainer.boundingBox(),
      titleDynamic: await titleDynamic.boundingBox(),
      subtitle: await subtitleElement.boundingBox(),
      actions: await actionsElement.boundingBox(),
      cards: await cardsElement.boundingBox()
    };
    
    console.log('📏 Initial positions recorded:');
    console.log(`Title Container: ${initialPositions.titleContainer?.y} (height: ${initialPositions.titleContainer?.height})`);
    console.log(`Title Dynamic: ${initialPositions.titleDynamic?.y} (height: ${initialPositions.titleDynamic?.height})`);
    console.log(`Subtitle: ${initialPositions.subtitle?.y}`);
    console.log(`Actions: ${initialPositions.actions?.y}`);
    console.log(`Cards: ${initialPositions.cards?.y} (height: ${initialPositions.cards?.height})`);
    
    // Monitor for layout shifts over 25 seconds
    console.log('\n👀 Monitoring for layout shifts over 25 seconds...');
    
    let layoutShifts = 0;
    const tolerance = 1; // 1px tolerance for minor browser differences
    
    for (let i = 0; i < 50; i++) { // Check every 500ms for 25 seconds
      await page.waitForTimeout(500);
      
      const currentPositions = {
        titleContainer: await titleContainer.boundingBox(),
        titleDynamic: await titleDynamic.boundingBox(),
        subtitle: await subtitleElement.boundingBox(),
        actions: await actionsElement.boundingBox(),
        cards: await cardsElement.boundingBox()
      };
      
      // Check for significant position changes
      const titleContainerShift = Math.abs((currentPositions.titleContainer?.y || 0) - (initialPositions.titleContainer?.y || 0));
      const titleDynamicShift = Math.abs((currentPositions.titleDynamic?.y || 0) - (initialPositions.titleDynamic?.y || 0));
      const subtitleShift = Math.abs((currentPositions.subtitle?.y || 0) - (initialPositions.subtitle?.y || 0));
      const actionsShift = Math.abs((currentPositions.actions?.y || 0) - (initialPositions.actions?.y || 0));
      const cardsShift = Math.abs((currentPositions.cards?.y || 0) - (initialPositions.cards?.y || 0));
      
      // Check for height changes
      const titleContainerHeightChange = Math.abs((currentPositions.titleContainer?.height || 0) - (initialPositions.titleContainer?.height || 0));
      const cardsHeightChange = Math.abs((currentPositions.cards?.height || 0) - (initialPositions.cards?.height || 0));
      
      if (titleContainerShift > tolerance || titleDynamicShift > tolerance || 
          subtitleShift > tolerance || actionsShift > tolerance || 
          cardsShift > tolerance || titleContainerHeightChange > tolerance || 
          cardsHeightChange > tolerance) {
        layoutShifts++;
        console.log(`⚠️  Layout shift ${layoutShifts} detected at ${i * 0.5}s:`);
        if (titleContainerShift > tolerance) console.log(`  Title Container shifted: ${titleContainerShift}px`);
        if (titleDynamicShift > tolerance) console.log(`  Title Dynamic shifted: ${titleDynamicShift}px`);
        if (subtitleShift > tolerance) console.log(`  Subtitle shifted: ${subtitleShift}px`);
        if (actionsShift > tolerance) console.log(`  Actions shifted: ${actionsShift}px`);
        if (cardsShift > tolerance) console.log(`  Cards shifted: ${cardsShift}px`);
        if (titleContainerHeightChange > tolerance) console.log(`  Title Container height changed: ${titleContainerHeightChange}px`);
        if (cardsHeightChange > tolerance) console.log(`  Cards height changed: ${cardsHeightChange}px`);
      }
      
      // Log current typing text every 5 seconds
      if (i % 10 === 0) {
        const currentText = await titleDynamic.textContent();
        console.log(`${i * 0.5}s: Current text: "${currentText}"`);
      }
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'tmp/screenshots/final-stability-final.png',
      fullPage: true 
    });
    
    console.log('\n📊 Final Test Results:');
    console.log(`Layout shifts detected: ${layoutShifts}`);
    
    if (layoutShifts === 0) {
      console.log('✅ SUCCESS: No layout shifts detected! All fixes are working perfectly.');
    } else if (layoutShifts < 3) {
      console.log('🎯 EXCELLENT: Minimal layout shifts detected. Much improved!');
    } else if (layoutShifts < 10) {
      console.log('⚠️  GOOD: Some layout shifts detected but significantly improved.');
    } else {
      console.log('❌ ISSUE: Significant layout shifts still occurring.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testFinalStability().catch(console.error);
