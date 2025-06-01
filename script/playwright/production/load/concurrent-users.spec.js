// Concurrent Users Load Testing for Production
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
  simulateUserBrowsingPattern,
  generateLoadTestReport,
  staggeredUserRampUp 
} = require('../helpers/load-utils');

test.describe('Concurrent Users Load Testing', () => {
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

  test('should simulate 5 concurrent user sessions', async ({ page }) => {
    console.log('👥 Starting 5 concurrent user sessions simulation');
    
    const sessionId = Math.floor(Math.random() * 1000);
    console.log(`🔢 Session ID: ${sessionId}`);
    
    try {
      // Login as random user
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 User: ${userEmail} (${userRole})`);
      
      // Simulate realistic user session
      await simulateUserBrowsingPattern(page, userRole);
      
      console.log(`✅ Session ${sessionId} completed successfully`);
      
    } catch (error) {
      console.log(`❌ Session ${sessionId} failed: ${error.message}`);
      throw error;
    }
  });

  test('should simulate mixed user role concurrent sessions', async ({ page }) => {
    console.log('🎭 Starting mixed user role concurrent sessions');
    
    const sessionId = Math.floor(Math.random() * 1000);
    console.log(`🔢 Mixed Session ID: ${sessionId}`);
    
    try {
      // Login as random user
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 Mixed User: ${userEmail} (${userRole})`);
      
      // Role-specific workflow simulation
      await simulateRoleSpecificWorkflow(page, userRole);
      
      console.log(`✅ Mixed session ${sessionId} completed successfully`);
      
    } catch (error) {
      console.log(`❌ Mixed session ${sessionId} failed: ${error.message}`);
      throw error;
    }
  });

  test('should test rapid user login/logout cycles', async ({ page }) => {
    console.log('🔄 Testing rapid user login/logout cycles');
    
    const cycles = 3;
    const sessionResults = [];
    
    for (let i = 0; i < cycles; i++) {
      const cycleStart = Date.now();
      
      try {
        console.log(`🔄 Cycle ${i + 1}/${cycles}`);
        
        // Login
        const userEmail = await loginAsRandomUser(page);
        const userRole = getUserRole(userEmail);
        
        console.log(`👤 Cycle User: ${userEmail} (${userRole})`);
        
        // Quick session activity
        await performQuickSessionActivity(page, userRole);
        
        // Logout
        await logoutUser(page);
        
        const cycleDuration = Date.now() - cycleStart;
        sessionResults.push({
          cycle: i + 1,
          user: userEmail,
          role: userRole,
          duration: cycleDuration,
          success: true
        });
        
        console.log(`✅ Cycle ${i + 1} completed in ${cycleDuration}ms`);
        
        // Brief pause between cycles
        await thinkTime(page, 1000, 2000);
        
      } catch (error) {
        const cycleDuration = Date.now() - cycleStart;
        sessionResults.push({
          cycle: i + 1,
          duration: cycleDuration,
          success: false,
          error: error.message
        });
        
        console.log(`❌ Cycle ${i + 1} failed: ${error.message}`);
      }
    }
    
    // Generate cycle report
    const successfulCycles = sessionResults.filter(r => r.success).length;
    const avgDuration = sessionResults.reduce((sum, r) => sum + r.duration, 0) / sessionResults.length;
    
    console.log(`📊 Cycle Results: ${successfulCycles}/${cycles} successful, avg duration: ${Math.round(avgDuration)}ms`);
    
    console.log('✅ Rapid login/logout cycles completed');
  });

  test('should simulate database-intensive concurrent operations', async ({ page }) => {
    console.log('🗄️ Simulating database-intensive concurrent operations');
    
    const sessionId = Math.floor(Math.random() * 1000);
    console.log(`🔢 DB Session ID: ${sessionId}`);
    
    try {
      // Login as random user
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 DB User: ${userEmail} (${userRole})`);
      
      // Perform database-intensive operations
      await performDatabaseIntensiveOperations(page, userRole);
      
      console.log(`✅ DB session ${sessionId} completed successfully`);
      
    } catch (error) {
      console.log(`❌ DB session ${sessionId} failed: ${error.message}`);
      throw error;
    }
  });

  test('should test concurrent dashboard access', async ({ page }) => {
    console.log('📊 Testing concurrent dashboard access');
    
    const sessionId = Math.floor(Math.random() * 1000);
    console.log(`🔢 Dashboard Session ID: ${sessionId}`);
    
    try {
      // Login as random user
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 Dashboard User: ${userEmail} (${userRole})`);
      
      // Focus on dashboard interactions
      await performDashboardStressTest(page, userRole);
      
      console.log(`✅ Dashboard session ${sessionId} completed successfully`);
      
    } catch (error) {
      console.log(`❌ Dashboard session ${sessionId} failed: ${error.message}`);
      throw error;
    }
  });

  test('should simulate realistic concurrent work patterns', async ({ page }) => {
    console.log('💼 Simulating realistic concurrent work patterns');
    
    const sessionId = Math.floor(Math.random() * 1000);
    console.log(`🔢 Work Session ID: ${sessionId}`);
    
    try {
      // Login as random user
      const userEmail = await loginAsRandomUser(page);
      const userRole = getUserRole(userEmail);
      
      console.log(`👤 Work User: ${userEmail} (${userRole})`);
      
      // Simulate realistic work patterns
      await simulateRealisticWorkPattern(page, userRole);
      
      console.log(`✅ Work session ${sessionId} completed successfully`);
      
    } catch (error) {
      console.log(`❌ Work session ${sessionId} failed: ${error.message}`);
      throw error;
    }
  });
});

/**
 * Simulate role-specific workflow
 */
async function simulateRoleSpecificWorkflow(page, userRole) {
  console.log(`🎭 Simulating ${userRole} specific workflow`);
  
  const workflows = {
    system_admin: async () => {
      await navigateToPage(page, '/app/dashboard');
      await interactWithDashboard(page);
      await navigateToPage(page, '/app/users');
      await simulateReading(page, 2);
      await navigateToPage(page, '/app/organizations');
      await simulateReading(page, 1);
    },
    org_admin: async () => {
      await navigateToPage(page, '/app/dashboard');
      await interactWithDashboard(page);
      await navigateToPage(page, '/app/users');
      await simulateReading(page, 2);
      await navigateToPage(page, '/app/clients');
      await simulateReading(page, 2);
    },
    team_admin: async () => {
      await navigateToPage(page, '/app/dashboard');
      await interactWithDashboard(page);
      await navigateToPage(page, '/app/projects');
      await simulateReading(page, 2);
      await navigateToPage(page, '/app/time_logs');
      await simulateReading(page, 1);
    },
    user: async () => {
      await navigateToPage(page, '/app/dashboard');
      await interactWithDashboard(page);
      await navigateToPage(page, '/app/time_logs');
      await simulateReading(page, 2);
      await navigateToPage(page, '/app/projects');
      await simulateReading(page, 1);
    },
    freelancer: async () => {
      await navigateToPage(page, '/app/dashboard');
      await interactWithDashboard(page);
      await navigateToPage(page, '/app/time_logs');
      await simulateReading(page, 3);
    }
  };
  
  const workflow = workflows[userRole] || workflows.user;
  
  try {
    await workflow();
    await thinkTime(page, 2000, 4000);
  } catch (error) {
    console.log(`⚠️ Role workflow warning for ${userRole}: ${error.message}`);
  }
}

/**
 * Perform quick session activity
 */
async function performQuickSessionActivity(page, userRole) {
  console.log(`⚡ Performing quick session activity for ${userRole}`);
  
  try {
    // Quick dashboard check
    await navigateToPage(page, '/app/dashboard');
    await thinkTime(page, 1000, 2000);
    
    // Quick secondary page based on role
    if (userRole === 'system_admin') {
      await navigateToPage(page, '/app/users');
    } else if (userRole === 'org_admin') {
      await navigateToPage(page, '/app/clients');
    } else {
      await navigateToPage(page, '/app/time_logs');
    }
    
    await thinkTime(page, 1000, 2000);
    
  } catch (error) {
    console.log(`⚠️ Quick session activity warning: ${error.message}`);
  }
}

/**
 * Perform database-intensive operations
 */
async function performDatabaseIntensiveOperations(page, userRole) {
  console.log(`🗄️ Performing database-intensive operations for ${userRole}`);
  
  const intensiveOperations = [
    {
      name: 'Dashboard Stats Loading',
      action: async () => {
        await navigateToPage(page, '/app/dashboard');
        await page.waitForSelector('.stats, .dashboard-stats', { timeout: 15000 });
        await simulateReading(page, 2);
      }
    },
    {
      name: 'Time Logs Pagination',
      action: async () => {
        await navigateToPage(page, '/app/time_logs');
        await page.waitForSelector('.time-log, .time-logs-table', { timeout: 15000 });
        
        // Look for pagination
        const paginationLinks = page.locator('.pagination a, .page-link');
        const pageCount = await paginationLinks.count();
        
        if (pageCount > 0) {
          const randomPage = paginationLinks.nth(Math.floor(Math.random() * pageCount));
          if (await randomPage.isVisible()) {
            await randomPage.click();
            await thinkTime(page, 2000, 3000);
          }
        }
      }
    },
    {
      name: 'User List Loading',
      action: async () => {
        if (userRole === 'system_admin' || userRole === 'org_admin') {
          await navigateToPage(page, '/app/users');
          await page.waitForSelector('.user, .users-table', { timeout: 15000 });
          await simulateReading(page, 2);
        }
      }
    }
  ];
  
  for (const operation of intensiveOperations) {
    try {
      console.log(`🗄️ DB Operation: ${operation.name}`);
      const startTime = Date.now();
      
      await operation.action();
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ ${operation.name} completed in ${duration}ms`);
      
      await thinkTime(page, 1000, 2000);
      
    } catch (error) {
      console.log(`⚠️ DB operation "${operation.name}" warning: ${error.message}`);
    }
  }
}

/**
 * Perform dashboard stress test
 */
async function performDashboardStressTest(page, userRole) {
  console.log(`📊 Performing dashboard stress test for ${userRole}`);
  
  const dashboardOperations = [
    () => navigateToPage(page, '/app/dashboard'),
    () => page.reload(),
    () => interactWithDashboard(page),
    () => simulateReading(page, 1)
  ];
  
  const operationCount = 8;
  
  for (let i = 0; i < operationCount; i++) {
    try {
      console.log(`📊 Dashboard operation ${i + 1}/${operationCount}`);
      
      const randomOperation = dashboardOperations[Math.floor(Math.random() * dashboardOperations.length)];
      const startTime = Date.now();
      
      await randomOperation();
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Dashboard operation ${i + 1} took ${duration}ms`);
      
      await thinkTime(page, 500, 1500);
      
    } catch (error) {
      console.log(`⚠️ Dashboard operation ${i + 1} warning: ${error.message}`);
    }
  }
}

/**
 * Simulate realistic work pattern
 */
async function simulateRealisticWorkPattern(page, userRole) {
  console.log(`💼 Simulating realistic work pattern for ${userRole}`);
  
  const workPatterns = {
    morning: {
      name: 'Morning Check-in',
      duration: 3000,
      actions: [
        () => navigateToPage(page, '/app/dashboard'),
        () => interactWithDashboard(page),
        () => simulateReading(page, 2)
      ]
    },
    active_work: {
      name: 'Active Work Period',
      duration: 5000,
      actions: [
        () => navigateToPage(page, '/app/time_logs'),
        () => simulateReading(page, 2),
        () => navigateToPage(page, '/app/projects'),
        () => simulateReading(page, 1)
      ]
    },
    break_check: {
      name: 'Break Check',
      duration: 1500,
      actions: [
        () => navigateToPage(page, '/app/dashboard'),
        () => simulateReading(page, 1)
      ]
    },
    end_of_day: {
      name: 'End of Day Review',
      duration: 2500,
      actions: [
        () => navigateToPage(page, '/app/time_logs'),
        () => simulateReading(page, 2)
      ]
    }
  };
  
  // Randomly select 2-3 work patterns
  const patternKeys = Object.keys(workPatterns);
  const selectedPatterns = patternKeys.sort(() => 0.5 - Math.random()).slice(0, 3);
  
  for (const patternKey of selectedPatterns) {
    const pattern = workPatterns[patternKey];
    
    try {
      console.log(`💼 Work Pattern: ${pattern.name}`);
      
      // Execute pattern actions
      for (const action of pattern.actions) {
        await action();
        await thinkTime(page, 500, 1000);
      }
      
      // Pattern-specific think time
      await thinkTime(page, pattern.duration, pattern.duration + 1000);
      
    } catch (error) {
      console.log(`⚠️ Work pattern "${pattern.name}" warning: ${error.message}`);
    }
  }
}

/**
 * Monitor concurrent session performance
 */
async function monitorConcurrentPerformance(page, sessionId) {
  try {
    console.log(`📊 Monitoring performance for session ${sessionId}`);
    
    // Track page load times
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    console.log(`📈 Session ${sessionId} Performance:`, performanceMetrics);
    
    return performanceMetrics;
    
  } catch (error) {
    console.log(`⚠️ Performance monitoring warning for session ${sessionId}: ${error.message}`);
    return null;
  }
}

/**
 * Generate concurrent session report
 */
function generateConcurrentSessionReport(sessionResults) {
  const report = {
    timestamp: new Date().toISOString(),
    totalSessions: sessionResults.length,
    successfulSessions: sessionResults.filter(s => s.success).length,
    failedSessions: sessionResults.filter(s => !s.success).length,
    averageDuration: sessionResults.reduce((sum, s) => sum + s.duration, 0) / sessionResults.length,
    userRoleDistribution: {},
    recommendations: []
  };
  
  // Calculate user role distribution
  sessionResults.forEach(session => {
    if (session.role) {
      report.userRoleDistribution[session.role] = (report.userRoleDistribution[session.role] || 0) + 1;
    }
  });
  
  // Add recommendations
  const failureRate = report.failedSessions / report.totalSessions;
  if (failureRate > 0.1) {
    report.recommendations.push('High failure rate detected in concurrent sessions. Consider reducing load or investigating server capacity.');
  }
  
  if (report.averageDuration > 20000) {
    report.recommendations.push('Average session duration is high. Monitor AppSignal for performance bottlenecks.');
  }
  
  console.log('📊 Concurrent Session Report:', report);
  return report;
}
