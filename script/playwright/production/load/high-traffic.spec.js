// High-Traffic Area Load Testing for Production
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
  simulateScrolling 
} = require('../helpers/load-utils');

test.describe('High-Traffic Area Load Testing', () => {
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

  test('should stress test dashboard with high frequency access', async ({ page }) => {
    console.log('📊 Starting dashboard high-frequency stress test');
    
    const userEmail = await loginAsRandomUser(page);
    const userRole = getUserRole(userEmail);
    
    console.log(`👤 Dashboard stress user: ${userEmail} (${userRole})`);
    
    const dashboardAccessCount = 15;
    const accessTimes = [];
    
    for (let i = 0; i < dashboardAccessCount; i++) {
      try {
        console.log(`📊 Dashboard access ${i + 1}/${dashboardAccessCount}`);
        
        const startTime = Date.now();
        
        await navigateToPage(page, '/app/dashboard');
        await page.waitForSelector('.dashboard, .stats', { timeout: 15000 });
        
        const accessTime = Date.now() - startTime;
        accessTimes.push(accessTime);
        
        console.log(`⏱️ Dashboard access ${i + 1} took ${accessTime}ms`);
        
        // Quick dashboard interaction
        await interactWithDashboard(page);
        
        // Minimal think time for stress testing
        await thinkTime(page, 200, 800);
        
      } catch (error) {
        console.log(`❌ Dashboard access ${i + 1} failed: ${error.message}`);
        accessTimes.push(30000); // Timeout value
      }
    }
    
    // Calculate performance metrics
    const avgAccessTime = accessTimes.reduce((sum, time) => sum + time, 0) / accessTimes.length;
    const maxAccessTime = Math.max(...accessTimes);
    const minAccessTime = Math.min(...accessTimes);
    
    console.log(`📈 Dashboard Stress Results:`);
    console.log(`   Average Access Time: ${Math.round(avgAccessTime)}ms`);
    console.log(`   Max Access Time: ${maxAccessTime}ms`);
    console.log(`   Min Access Time: ${minAccessTime}ms`);
    
    // Performance assertions
    expect(avgAccessTime).toBeLessThan(10000); // Average should be under 10 seconds
    
    console.log('✅ Dashboard stress test completed');
  });

  test('should stress test time logs with rapid pagination', async ({ page }) => {
    console.log('⏰ Starting time logs rapid pagination stress test');
    
    const userEmail = await loginAsRandomUser(page);
    const userRole = getUserRole(userEmail);
    
    console.log(`👤 Time logs stress user: ${userEmail} (${userRole})`);
    
    await navigateToPage(page, '/app/time_logs');
    
    const paginationCycles = 10;
    
    for (let i = 0; i < paginationCycles; i++) {
      try {
        console.log(`📄 Pagination cycle ${i + 1}/${paginationCycles}`);
        
        // Look for pagination links
        const paginationLinks = page.locator('.pagination a, .page-link, .next, .prev');
        const linkCount = await paginationLinks.count();
        
        if (linkCount > 0) {
          const randomLink = paginationLinks.nth(Math.floor(Math.random() * linkCount));
          
          if (await randomLink.isVisible()) {
            const startTime = Date.now();
            
            await randomLink.click();
            await page.waitForSelector('.time-log, .time-logs-table', { timeout: 15000 });
            
            const loadTime = Date.now() - startTime;
            console.log(`⏱️ Pagination ${i + 1} loaded in ${loadTime}ms`);
            
            // Quick scan of results
            await simulateScrolling(page);
            await thinkTime(page, 300, 1000);
          }
        } else {
          console.log(`📄 No pagination links found on cycle ${i + 1}`);
          break;
        }
        
      } catch (error) {
        console.log(`⚠️ Pagination cycle ${i + 1} warning: ${error.message}`);
      }
    }
    
    console.log('✅ Time logs pagination stress test completed');
  });

  test('should stress test user management pages', async ({ page }) => {
    console.log('👥 Starting user management stress test');
    
    const userEmail = await loginAsRandomUser(page);
    const userRole = getUserRole(userEmail);
    
    console.log(`👤 User management stress user: ${userEmail} (${userRole})`);
    
    // Only test if user has access to user management
    if (userRole === 'system_admin' || userRole === 'org_admin') {
      const userAccessCount = 12;
      
      for (let i = 0; i < userAccessCount; i++) {
        try {
          console.log(`👥 User management access ${i + 1}/${userAccessCount}`);
          
          const startTime = Date.now();
          
          await navigateToPage(page, '/app/users');
          await page.waitForSelector('.user, .users-table', { timeout: 15000 });
          
          const loadTime = Date.now() - startTime;
          console.log(`⏱️ User management ${i + 1} loaded in ${loadTime}ms`);
          
          // Interact with user list
          await testUserListInteraction(page);
          
          await thinkTime(page, 300, 1000);
          
        } catch (error) {
          console.log(`⚠️ User management access ${i + 1} warning: ${error.message}`);
        }
      }
    } else {
      console.log('👥 User does not have access to user management, skipping test');
    }
    
    console.log('✅ User management stress test completed');
  });

  test('should stress test project pages with rapid navigation', async ({ page }) => {
    console.log('📋 Starting project pages rapid navigation stress test');
    
    const userEmail = await loginAsRandomUser(page);
    const userRole = getUserRole(userEmail);
    
    console.log(`👤 Project stress user: ${userEmail} (${userRole})`);
    
    await navigateToPage(page, '/app/projects');
    
    const navigationCycles = 8;
    
    for (let i = 0; i < navigationCycles; i++) {
      try {
        console.log(`📋 Project navigation cycle ${i + 1}/${navigationCycles}`);
        
        // Navigate to projects list
        const startTime = Date.now();
        
        await navigateToPage(page, '/app/projects');
        await page.waitForSelector('.project, .projects-list', { timeout: 15000 });
        
        const listLoadTime = Date.now() - startTime;
        console.log(`⏱️ Projects list ${i + 1} loaded in ${listLoadTime}ms`);
        
        // Click on random project if available
        const projectElements = page.locator('.project, .project-card');
        const projectCount = await projectElements.count();
        
        if (projectCount > 0) {
          const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
          
          if (await randomProject.isVisible()) {
            const projectStartTime = Date.now();
            
            await randomProject.click();
            await thinkTime(page, 1000, 2000);
            
            const projectLoadTime = Date.now() - projectStartTime;
            console.log(`⏱️ Project detail ${i + 1} loaded in ${projectLoadTime}ms`);
            
            // Navigate back
            await page.goBack();
            await thinkTime(page, 500, 1000);
          }
        }
        
      } catch (error) {
        console.log(`⚠️ Project navigation cycle ${i + 1} warning: ${error.message}`);
      }
    }
    
    console.log('✅ Project navigation stress test completed');
  });

  test('should stress test search and filter operations', async ({ page }) => {
    console.log('🔍 Starting search and filter operations stress test');
    
    const userEmail = await loginAsRandomUser(page);
    const userRole = getUserRole(userEmail);
    
    console.log(`👤 Search stress user: ${userEmail} (${userRole})`);
    
    const searchOperations = [
      {
        page: '/app/time_logs',
        name: 'Time Logs Search'
      },
      {
        page: '/app/projects',
        name: 'Projects Search'
      }
    ];
    
    // Add user search for admins
    if (userRole === 'system_admin' || userRole === 'org_admin') {
      searchOperations.push({
        page: '/app/users',
        name: 'Users Search'
      });
    }
    
    for (const operation of searchOperations) {
      try {
        console.log(`🔍 Testing ${operation.name}`);
        
        await navigateToPage(page, operation.page);
        
        // Look for search/filter elements
        const searchElements = page.locator('input[type="search"], .search, .filter, select');
        const searchCount = await searchElements.count();
        
        if (searchCount > 0) {
          console.log(`🔍 Found ${searchCount} search/filter elements`);
          
          // Test multiple search interactions
          const searchCycles = 5;
          
          for (let i = 0; i < searchCycles; i++) {
            try {
              const randomSearch = searchElements.nth(Math.floor(Math.random() * searchCount));
              
              if (await randomSearch.isVisible()) {
                const startTime = Date.now();
                
                await randomSearch.focus();
                await thinkTime(page, 500, 1000);
                
                // If it's a select, try to select an option
                const tagName = await randomSearch.evaluate(el => el.tagName.toLowerCase());
                if (tagName === 'select') {
                  const options = await randomSearch.locator('option').count();
                  if (options > 1) {
                    await randomSearch.selectOption({ index: Math.floor(Math.random() * options) });
                  }
                }
                
                const searchTime = Date.now() - startTime;
                console.log(`⏱️ Search operation ${i + 1} took ${searchTime}ms`);
                
                await thinkTime(page, 300, 800);
              }
            } catch (searchError) {
              console.log(`⚠️ Search cycle ${i + 1} warning: ${searchError.message}`);
            }
          }
        } else {
          console.log(`🔍 No search elements found for ${operation.name}`);
        }
        
      } catch (error) {
        console.log(`⚠️ Search operation "${operation.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Search and filter stress test completed');
  });

  test('should stress test form submissions and interactions', async ({ page }) => {
    console.log('📝 Starting form submissions stress test');
    
    const userEmail = await loginAsRandomUser(page);
    const userRole = getUserRole(userEmail);
    
    console.log(`👤 Form stress user: ${userEmail} (${userRole})`);
    
    const formPages = [
      '/app/time_logs',
      '/app/projects'
    ];
    
    for (const formPage of formPages) {
      try {
        console.log(`📝 Testing forms on ${formPage}`);
        
        await navigateToPage(page, formPage);
        
        // Look for "New" or "Add" buttons that might lead to forms
        const newButtons = page.locator('a:has-text("New"), a:has-text("Add"), .new, .add');
        const buttonCount = await newButtons.count();
        
        if (buttonCount > 0) {
          console.log(`📝 Found ${buttonCount} form entry buttons`);
          
          const formCycles = 3;
          
          for (let i = 0; i < formCycles; i++) {
            try {
              const randomButton = newButtons.nth(Math.floor(Math.random() * buttonCount));
              
              if (await randomButton.isVisible()) {
                console.log(`📝 Form interaction cycle ${i + 1}/${formCycles}`);
                
                const startTime = Date.now();
                
                await randomButton.click();
                await thinkTime(page, 1000, 2000);
                
                // Look for form elements
                const formElements = page.locator('form, input, textarea, select');
                const formElementCount = await formElements.count();
                
                if (formElementCount > 0) {
                  console.log(`📝 Found ${formElementCount} form elements`);
                  
                  // Interact with form (but don't submit)
                  const randomFormElement = formElements.nth(Math.floor(Math.random() * formElementCount));
                  
                  if (await randomFormElement.isVisible()) {
                    await randomFormElement.focus();
                    await thinkTime(page, 500, 1000);
                  }
                }
                
                const formTime = Date.now() - startTime;
                console.log(`⏱️ Form interaction ${i + 1} took ${formTime}ms`);
                
                // Navigate back
                await page.goBack();
                await thinkTime(page, 500, 1000);
              }
            } catch (formError) {
              console.log(`⚠️ Form cycle ${i + 1} warning: ${formError.message}`);
            }
          }
        } else {
          console.log(`📝 No form entry buttons found on ${formPage}`);
        }
        
      } catch (error) {
        console.log(`⚠️ Form testing on ${formPage} warning: ${error.message}`);
      }
    }
    
    console.log('✅ Form submissions stress test completed');
  });
});

/**
 * Test user list interaction
 */
async function testUserListInteraction(page) {
  try {
    const userElements = page.locator('.user, .user-row, tr');
    const userCount = await userElements.count();
    
    if (userCount > 0) {
      // Interact with random users
      const interactionsCount = Math.min(3, userCount);
      
      for (let i = 0; i < interactionsCount; i++) {
        const randomUser = userElements.nth(Math.floor(Math.random() * userCount));
        
        if (await randomUser.isVisible()) {
          await randomUser.hover();
          await thinkTime(page, 200, 500);
        }
      }
    }
  } catch (error) {
    console.log(`⚠️ User list interaction warning: ${error.message}`);
  }
}

/**
 * Monitor high-traffic performance
 */
async function monitorHighTrafficPerformance(page, testName) {
  try {
    console.log(`📊 Monitoring high-traffic performance for ${testName}`);
    
    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Check for failed requests
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText
      });
    });
    
    // Monitor response times
    const slowResponses = [];
    page.on('response', response => {
      const timing = response.timing();
      if (timing && timing.responseEnd - timing.requestStart > 5000) {
        slowResponses.push({
          url: response.url(),
          time: timing.responseEnd - timing.requestStart
        });
      }
    });
    
    return {
      consoleErrors,
      failedRequests,
      slowResponses
    };
    
  } catch (error) {
    console.log(`⚠️ Performance monitoring warning for ${testName}: ${error.message}`);
    return null;
  }
}

/**
 * Generate high-traffic test report
 */
function generateHighTrafficReport(testResults) {
  const report = {
    timestamp: new Date().toISOString(),
    testName: 'High-Traffic Load Testing',
    summary: {
      totalTests: testResults.length,
      successful: testResults.filter(r => r.success).length,
      failed: testResults.filter(r => !r.success).length,
      averageResponseTime: testResults.reduce((sum, r) => sum + (r.responseTime || 0), 0) / testResults.length
    },
    performanceMetrics: {
      slowestResponse: Math.max(...testResults.map(r => r.responseTime || 0)),
      fastestResponse: Math.min(...testResults.map(r => r.responseTime || Infinity)),
      timeouts: testResults.filter(r => r.timeout).length
    },
    recommendations: []
  };
  
  // Add recommendations
  if (report.summary.averageResponseTime > 5000) {
    report.recommendations.push('Average response time is high under load. Consider optimizing database queries and caching.');
  }
  
  if (report.performanceMetrics.timeouts > 0) {
    report.recommendations.push('Timeouts detected during high-traffic testing. Review server capacity and timeout configurations.');
  }
  
  const failureRate = report.summary.failed / report.summary.totalTests;
  if (failureRate > 0.05) {
    report.recommendations.push('High failure rate under traffic load. Investigate server stability and error handling.');
  }
  
  console.log('📊 High-Traffic Test Report:', report);
  return report;
}
