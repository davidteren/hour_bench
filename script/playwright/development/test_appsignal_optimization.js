const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testAppSignalOptimization() {
  console.log('🎭 Starting AppSignal optimization test...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for observation
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Track console logs
  const consoleLogs = [];
  const networkRequests = [];
  const appSignalCalls = [];
  
  // Monitor console logs
  page.on('console', msg => {
    const logEntry = {
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    };
    consoleLogs.push(logEntry);
    console.log(`📝 Console [${msg.type()}]: ${msg.text()}`);
  });
  
  // Monitor network requests
  page.on('request', request => {
    const url = request.url();
    networkRequests.push({
      url,
      method: request.method(),
      timestamp: new Date().toISOString()
    });
    
    // Track AppSignal API calls specifically
    if (url.includes('appsignal') || url.includes('collect')) {
      appSignalCalls.push({
        url,
        method: request.method(),
        timestamp: new Date().toISOString()
      });
      console.log(`📡 AppSignal API call: ${request.method()} ${url}`);
    }
  });
  
  try {
    console.log('🌐 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Wait for initial page load and AppSignal initialization
    await page.waitForTimeout(3000);
    
    console.log('🔍 Injecting AppSignal monitor script...');
    
    // Inject the monitoring script
    await page.evaluate(() => {
      // AppSignal API Call Monitor (inline version)
      class AppSignalMonitor {
        constructor() {
          this.apiCalls = [];
          this.startTime = Date.now();
          this.originalFetch = window.fetch;
          this.setupMonitoring();
        }

        setupMonitoring() {
          window.fetch = (...args) => {
            const url = args[0];
            
            if (typeof url === 'string' && (url.includes('appsignal') || url.includes('collect'))) {
              this.logApiCall(url);
            }
            
            return this.originalFetch.apply(window, args);
          };
          
          console.log('🔍 AppSignal API monitoring started');
        }

        logApiCall(url) {
          const call = {
            url,
            timestamp: Date.now(),
            timeFromStart: Date.now() - this.startTime
          };
          
          this.apiCalls.push(call);
          console.log(`📡 AppSignal API call #${this.apiCalls.length}:`, call);
        }

        getStats() {
          const now = Date.now();
          const totalTime = now - this.startTime;
          const callsPerMinute = (this.apiCalls.length / totalTime) * 60000;
          
          return {
            totalCalls: this.apiCalls.length,
            totalTimeMs: totalTime,
            callsPerMinute: Math.round(callsPerMinute * 100) / 100,
            averageInterval: this.apiCalls.length > 0 ? totalTime / this.apiCalls.length : 0,
            recentCalls: this.apiCalls.slice(-10)
          };
        }
      }

      // Initialize monitor
      window.appSignalMonitor = new AppSignalMonitor();
      console.log('✅ AppSignal monitor initialized');
    });
    
    // Wait and observe for 30 seconds
    console.log('⏱️ Monitoring for 30 seconds...');
    await page.waitForTimeout(30000);
    
    // Get monitoring stats
    const stats = await page.evaluate(() => {
      if (window.appSignalMonitor) {
        return window.appSignalMonitor.getStats();
      }
      return null;
    });
    
    console.log('\n📊 AppSignal Monitoring Results:');
    if (stats) {
      console.log(`Total API calls: ${stats.totalCalls}`);
      console.log(`Calls per minute: ${stats.callsPerMinute}`);
      console.log(`Average interval: ${Math.round(stats.averageInterval)}ms`);
      console.log('Recent calls:', stats.recentCalls);
    }
    
    // Test navigation to trigger more events
    console.log('\n🧭 Testing navigation...');
    
    // Try to navigate to dashboard if user is logged in
    try {
      await page.click('a[href="/dashboard"]', { timeout: 5000 });
      await page.waitForTimeout(5000);
      console.log('✅ Navigated to dashboard');
    } catch (e) {
      console.log('ℹ️ Dashboard link not found (user not logged in)');
    }
    
    // Test some user interactions
    console.log('🖱️ Testing user interactions...');
    
    // Try clicking some elements
    try {
      await page.click('button', { timeout: 2000 });
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log('ℹ️ No buttons found to click');
    }
    
    // Final stats after interactions
    const finalStats = await page.evaluate(() => {
      if (window.appSignalMonitor) {
        return window.appSignalMonitor.getStats();
      }
      return null;
    });
    
    console.log('\n📊 Final AppSignal Stats:');
    if (finalStats) {
      console.log(`Total API calls: ${finalStats.totalCalls}`);
      console.log(`Calls per minute: ${finalStats.callsPerMinute}`);
      console.log(`Average interval: ${Math.round(finalStats.averageInterval)}ms`);
    }
    
    // Save results to file
    const results = {
      timestamp: new Date().toISOString(),
      consoleLogs: consoleLogs.filter(log => 
        log.text.includes('AppSignal') || 
        log.text.includes('appsignal') ||
        log.text.includes('🎯') ||
        log.text.includes('📡')
      ),
      appSignalApiCalls: appSignalCalls,
      monitoringStats: finalStats,
      summary: {
        totalConsoleMessages: consoleLogs.length,
        appSignalMessages: consoleLogs.filter(log => 
          log.text.toLowerCase().includes('appsignal')
        ).length,
        apiCallsDetected: appSignalCalls.length,
        callsPerMinute: finalStats ? finalStats.callsPerMinute : 0
      }
    };
    
    const resultsPath = path.join(__dirname, '../../../tmp/appsignal_test_results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${resultsPath}`);
    
    // Assessment
    console.log('\n🎯 Assessment:');
    if (finalStats && finalStats.callsPerMinute < 10) {
      console.log('✅ GOOD: API call frequency is optimized (< 10 calls/minute)');
    } else if (finalStats && finalStats.callsPerMinute < 30) {
      console.log('⚠️ MODERATE: API calls reduced but could be better (10-30 calls/minute)');
    } else {
      console.log('❌ HIGH: API calls still too frequent (> 30 calls/minute)');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('🎭 Browser closed');
  }
}

// Run the test
testAppSignalOptimization().catch(console.error);
