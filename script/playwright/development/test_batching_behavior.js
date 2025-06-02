const { chromium } = require('playwright');

async function testBatchingBehavior() {
  console.log('🎭 Testing AppSignal batching behavior...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Track network requests to AppSignal
  const appSignalRequests = [];
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('appsignal.com') || url.includes('collect')) {
      appSignalRequests.push({
        url,
        method: request.method(),
        timestamp: Date.now()
      });
      console.log(`📡 AppSignal API request: ${request.method()} ${url}`);
    }
  });
  
  try {
    console.log('🌐 Loading homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    console.log('⏱️ Waiting for AppSignal to initialize...');
    await page.waitForTimeout(3000);
    
    // Test the batching system
    console.log('🧪 Testing batching behavior...');
    
    const batchingTest = await page.evaluate(() => {
      const results = {
        timestamp: Date.now(),
        tests: []
      };
      
      if (typeof window.frontendMetrics === 'undefined') {
        results.error = 'frontendMetrics not available';
        return results;
      }
      
      const metrics = window.frontendMetrics;
      
      // Test 1: Check configuration
      results.tests.push({
        name: 'Configuration Check',
        batchSize: metrics.BATCH_SIZE,
        batchDelay: metrics.BATCH_DELAY,
        throttleDelay: metrics.THROTTLE_DELAY,
        queueLength: metrics.metricQueue.length
      });
      
      // Test 2: Add multiple metrics quickly (should be batched)
      console.log('🔬 Adding 10 test metrics...');
      for (let i = 0; i < 10; i++) {
        metrics.trackCustomMetric(`test_metric_${i}`, i, 'counter', { test: true });
      }
      
      results.tests.push({
        name: 'After Adding 10 Metrics',
        queueLength: metrics.metricQueue.length,
        lastTrackTimeKeys: Object.keys(metrics.lastTrackTime).length
      });
      
      // Test 3: Try to add duplicate metrics (should be throttled)
      console.log('🔬 Testing throttling with duplicate metrics...');
      for (let i = 0; i < 5; i++) {
        metrics.trackCustomMetric('duplicate_test', 1, 'counter', { test: true });
      }
      
      results.tests.push({
        name: 'After Adding Duplicate Metrics',
        queueLength: metrics.metricQueue.length,
        lastTrackTimeKeys: Object.keys(metrics.lastTrackTime).length
      });
      
      // Test 4: Check if batch processing works
      console.log('🔬 Manually triggering batch processing...');
      const beforeBatch = metrics.metricQueue.length;
      metrics.processBatch();
      const afterBatch = metrics.metricQueue.length;
      
      results.tests.push({
        name: 'Manual Batch Processing',
        beforeBatch,
        afterBatch,
        processed: beforeBatch - afterBatch
      });
      
      return results;
    });
    
    console.log('\n📊 Batching Test Results:');
    console.log(JSON.stringify(batchingTest, null, 2));
    
    // Wait and observe for automatic batch processing
    console.log('\n⏱️ Waiting 20 seconds to observe automatic batching...');
    
    let requestCountBefore = appSignalRequests.length;
    await page.waitForTimeout(20000);
    let requestCountAfter = appSignalRequests.length;
    
    console.log(`\n📡 Network Request Analysis:`);
    console.log(`Requests before wait: ${requestCountBefore}`);
    console.log(`Requests after wait: ${requestCountAfter}`);
    console.log(`New requests: ${requestCountAfter - requestCountBefore}`);
    
    // Final queue check
    const finalCheck = await page.evaluate(() => {
      if (typeof window.frontendMetrics !== 'undefined') {
        return {
          finalQueueLength: window.frontendMetrics.metricQueue.length,
          totalThrottledMetrics: Object.keys(window.frontendMetrics.lastTrackTime).length
        };
      }
      return { error: 'frontendMetrics not available' };
    });
    
    console.log('\n📊 Final State:');
    console.log(JSON.stringify(finalCheck, null, 2));
    
    // Assessment
    console.log('\n🎯 Assessment:');
    
    if (batchingTest.error) {
      console.log('❌ FAILED: frontendMetrics not available');
    } else {
      const config = batchingTest.tests[0];
      console.log(`✅ Configuration loaded: Batch size ${config.batchSize}, Delay ${config.batchDelay}ms`);
      
      const afterMetrics = batchingTest.tests[1];
      if (afterMetrics.queueLength > 0) {
        console.log(`✅ Batching working: ${afterMetrics.queueLength} metrics queued`);
      } else {
        console.log('⚠️ No metrics in queue (may have been processed immediately)');
      }
      
      const throttling = batchingTest.tests[2];
      if (throttling.lastTrackTimeKeys > 0) {
        console.log(`✅ Throttling working: ${throttling.lastTrackTimeKeys} metric types tracked`);
      }
      
      const batchProcessing = batchingTest.tests[3];
      if (batchProcessing.processed > 0) {
        console.log(`✅ Batch processing working: ${batchProcessing.processed} metrics processed`);
      }
    }
    
    if (requestCountAfter - requestCountBefore < 5) {
      console.log('✅ GOOD: Low number of API requests (batching/throttling effective)');
    } else {
      console.log('⚠️ MODERATE: Some API requests made (may need further optimization)');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('🎭 Browser closed');
  }
}

// Run the test
testBatchingBehavior().catch(console.error);
