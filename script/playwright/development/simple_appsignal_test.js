const { chromium } = require('playwright');

async function simpleAppSignalTest() {
  console.log('🎭 Simple AppSignal test...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Track console messages
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    });
    console.log(`📝 [${msg.type()}] ${msg.text()}`);
  });
  
  try {
    console.log('🌐 Loading homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    console.log('⏱️ Waiting 10 seconds for everything to load...');
    await page.waitForTimeout(10000);
    
    // Check what's available in the window
    const windowObjects = await page.evaluate(() => {
      const objects = {};
      
      // Check for AppSignal related objects
      objects.appsignal = typeof window.appsignal !== 'undefined';
      objects.frontendMetrics = typeof window.frontendMetrics !== 'undefined';
      objects.appSignalInitialized = typeof window.appSignalInitialized !== 'undefined';
      
      // Check for configuration
      objects.APPSIGNAL_FRONTEND_KEY = typeof window.APPSIGNAL_FRONTEND_KEY !== 'undefined';
      objects.RAILS_ENV = window.RAILS_ENV || 'not set';
      objects.APP_REVISION = window.APP_REVISION || 'not set';
      
      // Try to access APPSIGNAL_CONFIG
      try {
        objects.APPSIGNAL_CONFIG_available = typeof APPSIGNAL_CONFIG !== 'undefined';
        if (typeof APPSIGNAL_CONFIG !== 'undefined') {
          objects.APPSIGNAL_CONFIG_content = APPSIGNAL_CONFIG;
        }
      } catch (e) {
        objects.APPSIGNAL_CONFIG_error = e.message;
      }
      
      return objects;
    });
    
    console.log('\n📊 Window Objects Check:');
    console.log(JSON.stringify(windowObjects, null, 2));
    
    // Check for errors
    const errors = consoleLogs.filter(log => log.type === 'error');
    console.log(`\n❌ Errors found: ${errors.length}`);
    errors.forEach(error => {
      console.log(`   - ${error.text}`);
    });
    
    // Check for AppSignal messages
    const appSignalMessages = consoleLogs.filter(log => 
      log.text.toLowerCase().includes('appsignal') ||
      log.text.includes('🎯') ||
      log.text.includes('📡') ||
      log.text.includes('🔍')
    );
    
    console.log(`\n📋 AppSignal messages: ${appSignalMessages.length}`);
    appSignalMessages.forEach(msg => {
      console.log(`   [${msg.type}] ${msg.text}`);
    });
    
    // Try to manually trigger AppSignal initialization
    console.log('\n🔧 Attempting manual AppSignal check...');
    const manualCheck = await page.evaluate(() => {
      try {
        // Check if we can access the modules
        const results = {
          timestamp: Date.now()
        };
        
        // Try to import and use AppSignal
        if (typeof window.appsignal !== 'undefined') {
          results.appsignal_available = true;
          results.appsignal_type = typeof window.appsignal;
        } else {
          results.appsignal_available = false;
        }
        
        if (typeof window.frontendMetrics !== 'undefined') {
          results.frontendMetrics_available = true;
          results.frontendMetrics_type = typeof window.frontendMetrics;
        } else {
          results.frontendMetrics_available = false;
        }
        
        return results;
      } catch (e) {
        return { error: e.message, stack: e.stack };
      }
    });
    
    console.log('🔧 Manual check results:', manualCheck);
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`- Total console messages: ${consoleLogs.length}`);
    console.log(`- Errors: ${errors.length}`);
    console.log(`- AppSignal messages: ${appSignalMessages.length}`);
    console.log(`- Config loaded: ${windowObjects.APPSIGNAL_FRONTEND_KEY}`);
    console.log(`- AppSignal object: ${windowObjects.appsignal}`);
    console.log(`- Frontend metrics: ${windowObjects.frontendMetrics}`);
    
    if (windowObjects.APPSIGNAL_CONFIG_available) {
      console.log('✅ APPSIGNAL_CONFIG is available');
    } else {
      console.log('❌ APPSIGNAL_CONFIG is not available');
      if (windowObjects.APPSIGNAL_CONFIG_error) {
        console.log(`   Error: ${windowObjects.APPSIGNAL_CONFIG_error}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('🎭 Browser closed');
  }
}

// Run the test
simpleAppSignalTest().catch(console.error);
