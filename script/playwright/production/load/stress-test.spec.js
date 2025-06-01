// Stress Testing for Production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');
const { 
  loginAsRandomUser, 
  logoutUser,
  getUserRole,
  PRODUCTION_BASE_URL 
} = require('../helpers/auth');
const { 
  thinkTime, 
  navigateToPage, 
  simulateReading,
  interactWithDashboard 
} = require('../helpers/navigation');
const { 
  setupPerformanceMonitoring,
  respectRateLimit 
} = require('../helpers/load-utils');

test.describe('Stress Testing', () => {
  test.beforeEach(async ({ page }) => {
    await setupPerformanceMonitoring(page);
  });

  test.afterEach(async ({ page }) => {
    try {
      await logoutUser(page);
    } catch (error) {
      console.log(`⚠️ Logout warning: ${error.message}`);
    }
  });

  test('should perform maximum load stress test', async ({ page }) => {
    console.log('🔥 Starting maximum load stress test');
    
    const stressId = Math.floor(Math.random() * 1000);
    console.log(`🔢 Stress Test ID: ${stressId}`);
    
    try {
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 Stress User: ${userEmail} (${userRole})`);
      
      // Perform intensive stress operations
      await performMaximumLoadOperations(page, userRole, stressId);
      
      console.log(`✅ Maximum load stress test ${stressId} completed`);
      
    } catch (error) {
      console.log(`❌ Maximum load stress test ${stressId} failed: ${error.message}`);
      
      // Check if it's a rate limit issue
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        console.log('⚠️ Rate limit encountered - this is expected under stress testing');
      } else {
        throw error;
      }
    }
  });

  test('should test system breaking point', async ({ page }) => {
    console.log('💥 Testing system breaking point');
    
    const breakingPointId = Math.floor(Math.random() * 1000);
    console.log(`🔢 Breaking Point Test ID: ${breakingPointId}`);
    
    try {
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 Breaking Point User: ${userEmail} (${userRole})`);
      
      // Gradually increase load until breaking point
      await findSystemBreakingPoint(page, userRole, breakingPointId);
      
      console.log(`✅ Breaking point test ${breakingPointId} completed`);
      
    } catch (error) {
      console.log(`❌ Breaking point test ${breakingPointId} failed: ${error.message}`);
      
      // Breaking point tests are expected to fail at some point
      if (error.message.includes('timeout') || error.message.includes('network')) {
        console.log('💥 System breaking point reached - this is expected');
      } else {
        throw error;
      }
    }
  });

  test('should test rapid fire operations', async ({ page }) => {
    console.log('⚡ Testing rapid fire operations');
    
    const rapidFireId = Math.floor(Math.random() * 1000);
    console.log(`🔢 Rapid Fire Test ID: ${rapidFireId}`);
    
    try {
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 Rapid Fire User: ${userEmail} (${userRole})`);
      
      // Perform rapid fire operations
      await performRapidFireOperations(page, userRole, rapidFireId);
      
      console.log(`✅ Rapid fire test ${rapidFireId} completed`);
      
    } catch (error) {
      console.log(`❌ Rapid fire test ${rapidFireId} failed: ${error.message}`);
      
      // Check for rate limiting
      if (error.message.includes('429')) {
        console.log('⚠️ Rate limiting activated - system is protecting itself');
      } else {
        throw error;
      }
    }
  });

  test('should test memory and resource exhaustion', async ({ page }) => {
    console.log('🧠 Testing memory and resource exhaustion');
    
    const memoryTestId = Math.floor(Math.random() * 1000);
    console.log(`🔢 Memory Test ID: ${memoryTestId}`);
    
    try {
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 Memory Test User: ${userEmail} (${userRole})`);
      
      // Perform memory-intensive operations
      await performMemoryIntensiveOperations(page, userRole, memoryTestId);
      
      console.log(`✅ Memory exhaustion test ${memoryTestId} completed`);
      
    } catch (error) {
      console.log(`❌ Memory exhaustion test ${memoryTestId} failed: ${error.message}`);
      
      // Memory exhaustion is expected
      if (error.message.includes('out of memory') || error.message.includes('timeout')) {
        console.log('🧠 Memory limits reached - system behavior under stress documented');
      } else {
        throw error;
      }
    }
  });

  test('should test database connection exhaustion', async ({ page }) => {
    console.log('🗄️ Testing database connection exhaustion');
    
    const dbTestId = Math.floor(Math.random() * 1000);
    console.log(`🔢 DB Test ID: ${dbTestId}`);
    
    try {
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 DB Test User: ${userEmail} (${userRole})`);
      
      // Perform database-intensive operations
      await performDatabaseExhaustionTest(page, userRole, dbTestId);
      
      console.log(`✅ Database exhaustion test ${dbTestId} completed`);
      
    } catch (error) {
      console.log(`❌ Database exhaustion test ${dbTestId} failed: ${error.message}`);
      
      // Database exhaustion is expected
      if (error.message.includes('database') || error.message.includes('connection')) {
        console.log('🗄️ Database limits reached - connection pooling behavior documented');
      } else {
        throw error;
      }
    }
  });

  test('should test recovery after stress', async ({ page }) => {
    console.log('🔄 Testing system recovery after stress');
    
    const recoveryTestId = Math.floor(Math.random() * 1000);
    console.log(`🔢 Recovery Test ID: ${recoveryTestId}`);
    
    try {
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 Recovery Test User: ${userEmail} (${userRole})`);
      
      // Apply stress then test recovery
      await testStressRecovery(page, userRole, recoveryTestId);
      
      console.log(`✅ Recovery test ${recoveryTestId} completed`);
      
    } catch (error) {
      console.log(`❌ Recovery test ${recoveryTestId} failed: ${error.message}`);
      throw error;
    }
  });
});

/**
 * Perform maximum load operations
 */
async function performMaximumLoadOperations(page, userRole, stressId) {
  console.log(`🔥 Performing maximum load operations for ${userRole} (${stressId})`);
  
  const maxOperations = 25; // Very high number
  const operations = [
    () => navigateToPage(page, '/app/dashboard'),
    () => navigateToPage(page, '/app/time_logs'),
    () => navigateToPage(page, '/app/projects'),
    () => page.reload(),
    () => interactWithDashboard(page)
  ];
  
  // Add role-specific operations
  if (userRole === 'system_admin' || userRole === 'org_admin') {
    operations.push(() => navigateToPage(page, '/app/users'));
  }
  
  if (userRole === 'system_admin') {
    operations.push(() => navigateToPage(page, '/app/organizations'));
  }
  
  for (let i = 0; i < maxOperations; i++) {
    try {
      console.log(`🔥 Max load operation ${i + 1}/${maxOperations}`);
      
      const randomOperation = operations[Math.floor(Math.random() * operations.length)];
      const startTime = Date.now();
      
      await randomOperation();
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Operation ${i + 1} took ${duration}ms`);
      
      // Check for rate limiting
      const response = await page.waitForResponse(response => response.status() === 429, { timeout: 1000 }).catch(() => null);
      if (response) {
        console.log('⚠️ Rate limit hit, respecting limit');
        await respectRateLimit(page, response);
      }
      
      // Minimal delay for maximum stress
      await thinkTime(page, 100, 300);
      
    } catch (error) {
      console.log(`⚠️ Max load operation ${i + 1} warning: ${error.message}`);
      
      // Continue stress testing even if individual operations fail
      if (error.message.includes('timeout')) {
        console.log('⏱️ Timeout detected - system under stress');
      }
    }
  }
}

/**
 * Find system breaking point
 */
async function findSystemBreakingPoint(page, userRole, breakingPointId) {
  console.log(`💥 Finding system breaking point for ${userRole} (${breakingPointId})`);
  
  let operationDelay = 1000; // Start with 1 second delay
  let consecutiveFailures = 0;
  const maxFailures = 5;
  
  while (consecutiveFailures < maxFailures && operationDelay > 50) {
    try {
      console.log(`💥 Testing with ${operationDelay}ms delay`);
      
      // Perform rapid operations with decreasing delay
      for (let i = 0; i < 10; i++) {
        const startTime = Date.now();
        
        await navigateToPage(page, '/app/dashboard');
        await page.waitForSelector('.dashboard, .stats', { timeout: 10000 });
        
        const duration = Date.now() - startTime;
        
        if (duration > 15000) {
          consecutiveFailures++;
          console.log(`💥 Slow response detected: ${duration}ms (failure ${consecutiveFailures})`);
        } else {
          consecutiveFailures = 0; // Reset on success
          console.log(`✅ Response time: ${duration}ms`);
        }
        
        await thinkTime(page, operationDelay, operationDelay + 100);
      }
      
      // Decrease delay to increase stress
      operationDelay = Math.max(50, operationDelay - 200);
      
    } catch (error) {
      consecutiveFailures++;
      console.log(`💥 Breaking point operation failed: ${error.message} (failure ${consecutiveFailures})`);
      
      if (consecutiveFailures >= maxFailures) {
        console.log(`💥 Breaking point reached at ${operationDelay}ms delay`);
        break;
      }
    }
  }
}

/**
 * Perform rapid fire operations
 */
async function performRapidFireOperations(page, userRole, rapidFireId) {
  console.log(`⚡ Performing rapid fire operations for ${userRole} (${rapidFireId})`);
  
  const rapidOperations = 20;
  const operationTypes = [
    'dashboard',
    'time_logs',
    'projects',
    'reload'
  ];
  
  for (let i = 0; i < rapidOperations; i++) {
    try {
      console.log(`⚡ Rapid fire ${i + 1}/${rapidOperations}`);
      
      const operationType = operationTypes[Math.floor(Math.random() * operationTypes.length)];
      const startTime = Date.now();
      
      switch (operationType) {
        case 'dashboard':
          await navigateToPage(page, '/app/dashboard');
          break;
        case 'time_logs':
          await navigateToPage(page, '/app/time_logs');
          break;
        case 'projects':
          await navigateToPage(page, '/app/projects');
          break;
        case 'reload':
          await page.reload();
          break;
      }
      
      const duration = Date.now() - startTime;
      console.log(`⚡ Rapid ${i + 1} (${operationType}) took ${duration}ms`);
      
      // No delay - maximum rapid fire
      
    } catch (error) {
      console.log(`⚠️ Rapid fire ${i + 1} warning: ${error.message}`);
    }
  }
}

/**
 * Perform memory-intensive operations
 */
async function performMemoryIntensiveOperations(page, userRole, memoryTestId) {
  console.log(`🧠 Performing memory-intensive operations for ${userRole} (${memoryTestId})`);
  
  const memoryOperations = [
    {
      name: 'Large Data Set Loading',
      action: async () => {
        await navigateToPage(page, '/app/time_logs');
        
        // Try to load multiple pages rapidly to accumulate data
        for (let i = 0; i < 5; i++) {
          const paginationLinks = page.locator('.pagination a, .page-link');
          const linkCount = await paginationLinks.count();
          
          if (linkCount > 0) {
            const randomLink = paginationLinks.nth(Math.floor(Math.random() * linkCount));
            if (await randomLink.isVisible()) {
              await randomLink.click();
              await thinkTime(page, 200, 500);
            }
          }
        }
      }
    },
    {
      name: 'Multiple Tab Simulation',
      action: async () => {
        // Simulate multiple tabs by rapid navigation
        const pages = ['/app/dashboard', '/app/time_logs', '/app/projects'];
        
        for (let i = 0; i < 10; i++) {
          const randomPage = pages[Math.floor(Math.random() * pages.length)];
          await navigateToPage(page, randomPage);
          await thinkTime(page, 100, 300);
        }
      }
    },
    {
      name: 'Heavy DOM Manipulation',
      action: async () => {
        await navigateToPage(page, '/app/dashboard');
        
        // Simulate heavy DOM operations
        await page.evaluate(() => {
          // Create many DOM elements to stress memory
          for (let i = 0; i < 1000; i++) {
            const div = document.createElement('div');
            div.innerHTML = `<span>Memory test element ${i}</span>`;
            document.body.appendChild(div);
          }
        });
        
        await thinkTime(page, 1000, 2000);
        
        // Clean up
        await page.evaluate(() => {
          const testElements = document.querySelectorAll('div:has(span)');
          testElements.forEach(el => el.remove());
        });
      }
    }
  ];
  
  for (const operation of memoryOperations) {
    try {
      console.log(`🧠 Memory Operation: ${operation.name}`);
      
      const startTime = Date.now();
      await operation.action();
      const duration = Date.now() - startTime;
      
      console.log(`🧠 ${operation.name} completed in ${duration}ms`);
      
    } catch (error) {
      console.log(`⚠️ Memory operation "${operation.name}" warning: ${error.message}`);
    }
  }
}

/**
 * Perform database exhaustion test
 */
async function performDatabaseExhaustionTest(page, userRole, dbTestId) {
  console.log(`🗄️ Performing database exhaustion test for ${userRole} (${dbTestId})`);
  
  const dbOperations = [
    {
      name: 'Rapid Dashboard Stats',
      action: async () => {
        for (let i = 0; i < 10; i++) {
          await navigateToPage(page, '/app/dashboard');
          await page.waitForSelector('.stats, .dashboard-stats', { timeout: 10000 });
          await thinkTime(page, 100, 300);
        }
      }
    },
    {
      name: 'Time Logs Pagination Stress',
      action: async () => {
        await navigateToPage(page, '/app/time_logs');
        
        for (let i = 0; i < 8; i++) {
          const paginationLinks = page.locator('.pagination a, .page-link');
          const linkCount = await paginationLinks.count();
          
          if (linkCount > 0) {
            const randomLink = paginationLinks.nth(Math.floor(Math.random() * linkCount));
            if (await randomLink.isVisible()) {
              await randomLink.click();
              await page.waitForSelector('.time-log, .time-logs-table', { timeout: 10000 });
              await thinkTime(page, 200, 500);
            }
          }
        }
      }
    }
  ];
  
  // Add admin-specific database operations
  if (userRole === 'system_admin' || userRole === 'org_admin') {
    dbOperations.push({
      name: 'User List Rapid Loading',
      action: async () => {
        for (let i = 0; i < 5; i++) {
          await navigateToPage(page, '/app/users');
          await page.waitForSelector('.user, .users-table', { timeout: 10000 });
          await thinkTime(page, 200, 500);
        }
      }
    });
  }
  
  for (const operation of dbOperations) {
    try {
      console.log(`🗄️ DB Operation: ${operation.name}`);
      
      const startTime = Date.now();
      await operation.action();
      const duration = Date.now() - startTime;
      
      console.log(`🗄️ ${operation.name} completed in ${duration}ms`);
      
    } catch (error) {
      console.log(`⚠️ DB operation "${operation.name}" warning: ${error.message}`);
    }
  }
}

/**
 * Test stress recovery
 */
async function testStressRecovery(page, userRole, recoveryTestId) {
  console.log(`🔄 Testing stress recovery for ${userRole} (${recoveryTestId})`);
  
  // Phase 1: Apply stress
  console.log('🔄 Phase 1: Applying stress');
  
  try {
    for (let i = 0; i < 10; i++) {
      await navigateToPage(page, '/app/dashboard');
      await thinkTime(page, 100, 200); // Rapid operations
    }
  } catch (error) {
    console.log('🔄 Stress applied, some operations may have failed as expected');
  }
  
  // Phase 2: Recovery period
  console.log('🔄 Phase 2: Recovery period');
  await thinkTime(page, 5000, 8000); // Wait for recovery
  
  // Phase 3: Test normal operations
  console.log('🔄 Phase 3: Testing normal operations');
  
  const recoveryOperations = [
    () => navigateToPage(page, '/app/dashboard'),
    () => navigateToPage(page, '/app/time_logs'),
    () => navigateToPage(page, '/app/projects')
  ];
  
  let successfulOperations = 0;
  const totalRecoveryOps = 5;
  
  for (let i = 0; i < totalRecoveryOps; i++) {
    try {
      console.log(`🔄 Recovery operation ${i + 1}/${totalRecoveryOps}`);
      
      const randomOperation = recoveryOperations[Math.floor(Math.random() * recoveryOperations.length)];
      const startTime = Date.now();
      
      await randomOperation();
      
      const duration = Date.now() - startTime;
      console.log(`🔄 Recovery operation ${i + 1} took ${duration}ms`);
      
      if (duration < 10000) { // Consider successful if under 10 seconds
        successfulOperations++;
      }
      
      await thinkTime(page, 1000, 2000); // Normal think time
      
    } catch (error) {
      console.log(`⚠️ Recovery operation ${i + 1} warning: ${error.message}`);
    }
  }
  
  const recoveryRate = (successfulOperations / totalRecoveryOps) * 100;
  console.log(`🔄 Recovery rate: ${recoveryRate}% (${successfulOperations}/${totalRecoveryOps})`);
  
  if (recoveryRate >= 80) {
    console.log('✅ System recovered well from stress');
  } else {
    console.log('⚠️ System recovery may be impaired');
  }
}
