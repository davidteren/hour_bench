const { chromium } = require('playwright');

async function checkAppSignalConsole() {
  console.log('🎭 Checking AppSignal console logs and behavior...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Track all console messages
  const consoleLogs = [];
  const errors = [];
  
  page.on('console', msg => {
    const logEntry = {
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    };
    consoleLogs.push(logEntry);
    
    // Log AppSignal related messages
    if (msg.text().toLowerCase().includes('appsignal') || 
        msg.text().includes('🎯') || 
        msg.text().includes('📡') ||
        msg.text().includes('🔍')) {
      console.log(`📝 [${msg.type()}] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  try {
    console.log('🌐 Loading homepage...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('⏱️ Waiting 5 seconds for AppSignal initialization...');
    await page.waitForTimeout(5000);
    
    // Check if AppSignal objects are available
    const appSignalStatus = await page.evaluate(() => {
      return {
        appSignalExists: typeof window.appsignal !== 'undefined',
        frontendMetricsExists: typeof window.frontendMetrics !== 'undefined',
        appSignalInitialized: typeof window.appSignalInitialized !== 'undefined',
        configLoaded: typeof window.APPSIGNAL_FRONTEND_KEY !== 'undefined',
        railsEnv: window.RAILS_ENV || 'unknown'
      };
    });
    
    console.log('📊 AppSignal Status:', appSignalStatus);
    
    // Try to access the configuration
    const configStatus = await page.evaluate(() => {
      try {
        // Check if we can access the config
        if (typeof APPSIGNAL_CONFIG !== 'undefined') {
          return { configAvailable: true, config: APPSIGNAL_CONFIG };
        }
        return { configAvailable: false };
      } catch (e) {
        return { configAvailable: false, error: e.message };
      }
    });
    
    console.log('⚙️ Config Status:', configStatus);
    
    // Check for any JavaScript errors in console
    const jsErrors = consoleLogs.filter(log => log.type === 'error');
    if (jsErrors.length > 0) {
      console.log('❌ JavaScript Errors found:');
      jsErrors.forEach(error => {
        console.log(`   - ${error.text}`);
      });
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
    // Check AppSignal related logs
    const appSignalLogs = consoleLogs.filter(log => 
      log.text.toLowerCase().includes('appsignal') ||
      log.text.includes('🎯') ||
      log.text.includes('📡') ||
      log.text.includes('🔍')
    );
    
    console.log(`📋 Found ${appSignalLogs.length} AppSignal-related console messages:`);
    appSignalLogs.forEach(log => {
      console.log(`   [${log.type}] ${log.text}`);
    });
    
    // Test navigation to see if it triggers events
    console.log('🧭 Testing navigation...');
    try {
      // Try to click login link
      await page.click('a[href="/session/new"]', { timeout: 5000 });
      await page.waitForTimeout(3000);
      console.log('✅ Navigated to login page');
      
      // Check for new console messages after navigation
      await page.waitForTimeout(2000);
      
    } catch (e) {
      console.log('ℹ️ Could not navigate to login page');
    }
    
    // Final summary
    const finalLogs = consoleLogs.filter(log => 
      log.text.toLowerCase().includes('appsignal') ||
      log.text.includes('🎯') ||
      log.text.includes('📡') ||
      log.text.includes('🔍')
    );
    
    console.log('\n📊 Final Summary:');
    console.log(`Total console messages: ${consoleLogs.length}`);
    console.log(`AppSignal messages: ${finalLogs.length}`);
    console.log(`JavaScript errors: ${jsErrors.length}`);
    console.log(`Page errors: ${errors.length}`);
    
    if (appSignalStatus.configLoaded) {
      console.log('✅ AppSignal configuration loaded');
    } else {
      console.log('❌ AppSignal configuration not loaded');
    }
    
    if (finalLogs.length > 0) {
      console.log('✅ AppSignal appears to be initializing');
    } else {
      console.log('⚠️ No AppSignal initialization messages found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('🎭 Browser closed');
  }
}

// Run the test
checkAppSignalConsole().catch(console.error);
