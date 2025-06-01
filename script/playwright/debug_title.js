const { chromium } = require('playwright');

async function debugTitle() {
  console.log('🔍 Debugging title layout...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Get title element details
    const titleInfo = await page.evaluate(() => {
      const titleElement = document.querySelector('.hero-title');
      const staticElement = document.querySelector('.title-static');
      const dynamicElement = document.querySelector('.title-dynamic');
      
      return {
        titleHeight: titleElement?.offsetHeight,
        titleWidth: titleElement?.offsetWidth,
        staticText: staticElement?.textContent,
        staticHeight: staticElement?.offsetHeight,
        staticWidth: staticElement?.offsetWidth,
        dynamicText: dynamicElement?.textContent,
        dynamicHeight: dynamicElement?.offsetHeight,
        dynamicWidth: dynamicElement?.offsetWidth,
        titleComputedStyle: window.getComputedStyle(titleElement),
        dynamicComputedStyle: window.getComputedStyle(dynamicElement)
      };
    });
    
    console.log('📊 Title Debug Info:');
    console.log(`Title container: ${titleInfo.titleWidth}x${titleInfo.titleHeight}px`);
    console.log(`Static part: "${titleInfo.staticText}" (${titleInfo.staticWidth}x${titleInfo.staticHeight}px)`);
    console.log(`Dynamic part: "${titleInfo.dynamicText}" (${titleInfo.dynamicWidth}x${titleInfo.dynamicHeight}px)`);
    console.log(`Title min-height: ${titleInfo.titleComputedStyle.minHeight}`);
    console.log(`Dynamic height: ${titleInfo.dynamicComputedStyle.height}`);
    console.log(`Dynamic white-space: ${titleInfo.dynamicComputedStyle.whiteSpace}`);
    
    // Monitor changes over time
    console.log('\n🔄 Monitoring title changes...');
    
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(2000);
      
      const currentInfo = await page.evaluate(() => {
        const titleElement = document.querySelector('.hero-title');
        const dynamicElement = document.querySelector('.title-dynamic');
        
        return {
          titleHeight: titleElement?.offsetHeight,
          dynamicText: dynamicElement?.textContent,
          dynamicHeight: dynamicElement?.offsetHeight,
          dynamicWidth: dynamicElement?.offsetWidth
        };
      });
      
      console.log(`${i * 2}s: "${currentInfo.dynamicText}" (${currentInfo.dynamicWidth}x${currentInfo.dynamicHeight}px) - Title: ${currentInfo.titleHeight}px`);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugTitle().catch(console.error);
