// System Admin Load Testing for Production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');
const { 
  loginAsSystemAdmin, 
  logoutUser,
  PRODUCTION_BASE_URL 
} = require('../helpers/auth');
const { 
  thinkTime, 
  navigateToPage, 
  clickElement, 
  simulateReading,
  interactWithDashboard,
  simulateTimeTracking 
} = require('../helpers/navigation');
const { 
  setupPerformanceMonitoring,
  simulateUserBrowsingPattern 
} = require('../helpers/load-utils');

test.describe('System Admin Load Testing', () => {
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

  test('should simulate system admin comprehensive workflow', async ({ page }) => {
    console.log('👑 Starting system admin comprehensive workflow simulation');
    
    // Login as system admin
    await loginAsSystemAdmin(page);
    
    // Verify admin dashboard access
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ System admin logged in successfully');
    
    // Comprehensive admin workflow
    const adminWorkflow = [
      {
        name: 'Dashboard Overview',
        action: async () => {
          await interactWithDashboard(page);
          await simulateReading(page, 3);
        }
      },
      {
        name: 'Organizations Management',
        action: async () => {
          await testOrganizationsManagement(page);
        }
      },
      {
        name: 'Users Management',
        action: async () => {
          await testUsersManagement(page);
        }
      },
      {
        name: 'System-wide Time Logs',
        action: async () => {
          await testSystemTimeLogsReview(page);
        }
      },
      {
        name: 'Projects Overview',
        action: async () => {
          await testProjectsOverview(page);
        }
      },
      {
        name: 'User Impersonation Test',
        action: async () => {
          await testUserImpersonation(page);
        }
      }
    ];
    
    for (const workflow of adminWorkflow) {
      try {
        console.log(`🔧 Admin Workflow: ${workflow.name}`);
        await workflow.action();
        await thinkTime(page, 2000, 4000);
      } catch (error) {
        console.log(`⚠️ Admin workflow "${workflow.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ System admin workflow simulation completed');
  });

  test('should test system admin high-frequency operations', async ({ page }) => {
    console.log('⚡ Testing system admin high-frequency operations');
    
    await loginAsSystemAdmin(page);
    
    // Simulate rapid admin operations
    const operations = [
      () => navigateToPage(page, '/app/dashboard'),
      () => navigateToPage(page, '/app/organizations'),
      () => navigateToPage(page, '/app/users'),
      () => navigateToPage(page, '/app/time_logs'),
      () => navigateToPage(page, '/app/projects')
    ];
    
    const operationCount = 15; // High frequency
    
    for (let i = 0; i < operationCount; i++) {
      try {
        console.log(`🔄 Operation ${i + 1}/${operationCount}`);
        
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];
        await randomOperation();
        
        // Quick interaction
        await simulateQuickAdminInteraction(page);
        
        // Shorter think time for high frequency
        await thinkTime(page, 500, 1500);
        
      } catch (error) {
        console.log(`⚠️ High-frequency operation ${i + 1} warning: ${error.message}`);
      }
    }
    
    console.log('✅ High-frequency operations testing completed');
  });

  test('should test system admin data-intensive operations', async ({ page }) => {
    console.log('📊 Testing system admin data-intensive operations');
    
    await loginAsSystemAdmin(page);
    
    // Test operations that trigger intentional performance issues
    const dataIntensiveOperations = [
      {
        name: 'Dashboard Stats Calculation',
        action: async () => {
          await navigateToPage(page, '/app/dashboard');
          await page.waitForSelector('.stats, .dashboard-stats', { timeout: 15000 });
          await simulateReading(page, 2);
        }
      },
      {
        name: 'All Time Logs View',
        action: async () => {
          await navigateToPage(page, '/app/time_logs');
          await page.waitForSelector('.time-log, .time-logs-table', { timeout: 15000 });
          await simulateReading(page, 3);
        }
      },
      {
        name: 'All Users List',
        action: async () => {
          await navigateToPage(page, '/app/users');
          await page.waitForSelector('.user, .users-table', { timeout: 15000 });
          await simulateReading(page, 2);
        }
      },
      {
        name: 'Organizations with Stats',
        action: async () => {
          await navigateToPage(page, '/app/organizations');
          await page.waitForSelector('.organization, .organizations-list', { timeout: 15000 });
          await simulateReading(page, 2);
        }
      }
    ];
    
    for (const operation of dataIntensiveOperations) {
      try {
        console.log(`📈 Data Operation: ${operation.name}`);
        
        const startTime = Date.now();
        await operation.action();
        const duration = Date.now() - startTime;
        
        console.log(`⏱️ ${operation.name} completed in ${duration}ms`);
        
        // Longer think time for data-intensive operations
        await thinkTime(page, 3000, 6000);
        
      } catch (error) {
        console.log(`⚠️ Data operation "${operation.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Data-intensive operations testing completed');
  });

  test('should simulate concurrent system admin sessions', async ({ page }) => {
    console.log('👥 Simulating concurrent system admin sessions');
    
    await loginAsSystemAdmin(page);
    
    // Simulate multiple admin tasks running concurrently
    const concurrentTasks = [
      async () => {
        console.log('📊 Task 1: Dashboard monitoring');
        await navigateToPage(page, '/app/dashboard');
        await interactWithDashboard(page);
      },
      async () => {
        console.log('👥 Task 2: User management');
        await navigateToPage(page, '/app/users');
        await testUsersListInteraction(page);
      },
      async () => {
        console.log('⏰ Task 3: Time logs review');
        await navigateToPage(page, '/app/time_logs');
        await testTimeLogsInteraction(page);
      }
    ];
    
    // Execute tasks in sequence (simulating rapid switching)
    for (let cycle = 0; cycle < 3; cycle++) {
      console.log(`🔄 Admin task cycle ${cycle + 1}`);
      
      for (const task of concurrentTasks) {
        try {
          await task();
          await thinkTime(page, 1000, 2000);
        } catch (error) {
          console.log(`⚠️ Concurrent task warning: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Concurrent admin sessions simulation completed');
  });

  test('should test system admin performance monitoring workflow', async ({ page }) => {
    console.log('📈 Testing system admin performance monitoring workflow');
    
    await loginAsSystemAdmin(page);
    
    // Simulate admin monitoring system performance
    const monitoringWorkflow = [
      {
        name: 'System Overview Check',
        action: async () => {
          await navigateToPage(page, '/app/dashboard');
          await checkSystemStats(page);
        }
      },
      {
        name: 'User Activity Review',
        action: async () => {
          await navigateToPage(page, '/app/users');
          await reviewUserActivity(page);
        }
      },
      {
        name: 'Performance Bottleneck Simulation',
        action: async () => {
          // Trigger intentional N+1 queries
          await navigateToPage(page, '/app/time_logs');
          await simulatePerformanceBottleneck(page);
        }
      },
      {
        name: 'Organization Health Check',
        action: async () => {
          await navigateToPage(page, '/app/organizations');
          await checkOrganizationHealth(page);
        }
      }
    ];
    
    for (const step of monitoringWorkflow) {
      try {
        console.log(`📊 Monitoring: ${step.name}`);
        
        const startTime = Date.now();
        await step.action();
        const duration = Date.now() - startTime;
        
        console.log(`⏱️ ${step.name} took ${duration}ms`);
        
        // Monitor for slow responses
        if (duration > 10000) {
          console.log(`🐌 Slow response detected for ${step.name}`);
        }
        
        await thinkTime(page, 2000, 4000);
        
      } catch (error) {
        console.log(`⚠️ Monitoring step "${step.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Performance monitoring workflow completed');
  });
});

/**
 * Test organizations management functionality
 */
async function testOrganizationsManagement(page) {
  try {
    console.log('🏢 Testing organizations management');
    
    await navigateToPage(page, '/app/organizations', '.organization, .organizations-list');
    
    // Simulate browsing organizations
    await simulateReading(page, 2);
    
    // Look for organization cards or list items
    const orgElements = page.locator('.organization, .org-card, .organization-item');
    const orgCount = await orgElements.count();
    
    if (orgCount > 0) {
      console.log(`🏢 Found ${orgCount} organizations`);
      
      // Click on random organization
      const randomOrg = orgElements.nth(Math.floor(Math.random() * orgCount));
      if (await randomOrg.isVisible()) {
        await randomOrg.click();
        await thinkTime(page, 2000, 3000);
        
        // Navigate back to organizations list
        await page.goBack();
        await thinkTime(page, 1000, 2000);
      }
    }
    
    // Look for "New Organization" button
    const newOrgBtn = page.locator('a:has-text("New Organization"), .new-organization, button:has-text("Add")');
    if (await newOrgBtn.first().isVisible()) {
      await newOrgBtn.first().hover();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Organizations management warning: ${error.message}`);
  }
}

/**
 * Test users management functionality
 */
async function testUsersManagement(page) {
  try {
    console.log('👥 Testing users management');
    
    await navigateToPage(page, '/app/users', '.user, .users-table');
    
    await simulateReading(page, 2);
    
    // Test user list interactions
    await testUsersListInteraction(page);
    
    // Look for user management actions
    const userActions = page.locator('a:has-text("Impersonate"), button:has-text("Edit"), .user-actions');
    const actionCount = await userActions.count();
    
    if (actionCount > 0) {
      console.log(`🔧 Found ${actionCount} user actions`);
      
      // Hover over random action (don't click impersonate in load test)
      const randomAction = userActions.nth(Math.floor(Math.random() * actionCount));
      await randomAction.hover();
      await thinkTime(page, 1000, 2000);
    }
    
  } catch (error) {
    console.log(`⚠️ Users management warning: ${error.message}`);
  }
}

/**
 * Test system-wide time logs review
 */
async function testSystemTimeLogsReview(page) {
  try {
    console.log('⏰ Testing system-wide time logs review');
    
    await navigateToPage(page, '/app/time_logs', '.time-log, .time-logs-table');
    
    // This should trigger intentional N+1 queries
    await simulateReading(page, 3);
    
    await testTimeLogsInteraction(page);
    
    // Test pagination if available
    const paginationLinks = page.locator('.pagination a, .page-link');
    const pageCount = await paginationLinks.count();
    
    if (pageCount > 0) {
      console.log(`📄 Found pagination with ${pageCount} links`);
      
      // Click on random page
      const randomPage = paginationLinks.nth(Math.floor(Math.random() * pageCount));
      if (await randomPage.isVisible()) {
        await randomPage.click();
        await thinkTime(page, 2000, 3000);
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Time logs review warning: ${error.message}`);
  }
}

/**
 * Test projects overview
 */
async function testProjectsOverview(page) {
  try {
    console.log('📋 Testing projects overview');
    
    await navigateToPage(page, '/app/projects', '.project, .projects-list');
    
    await simulateReading(page, 2);
    
    // Look for project cards or list items
    const projectElements = page.locator('.project, .project-card, .project-item');
    const projectCount = await projectElements.count();
    
    if (projectCount > 0) {
      console.log(`📋 Found ${projectCount} projects`);
      
      // Click on random project
      const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
      if (await randomProject.isVisible()) {
        await randomProject.click();
        await thinkTime(page, 2000, 3000);
        
        // Navigate back
        await page.goBack();
        await thinkTime(page, 1000, 2000);
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Projects overview warning: ${error.message}`);
  }
}

/**
 * Test user impersonation (hover only, don't actually impersonate)
 */
async function testUserImpersonation(page) {
  try {
    console.log('🎭 Testing user impersonation interface');
    
    await navigateToPage(page, '/app/users');
    
    // Look for impersonate buttons
    const impersonateButtons = page.locator('a:has-text("Impersonate"), button:has-text("Impersonate")');
    const buttonCount = await impersonateButtons.count();
    
    if (buttonCount > 0) {
      console.log(`🎭 Found ${buttonCount} impersonate buttons`);
      
      // Just hover over impersonate button (don't click)
      const randomButton = impersonateButtons.nth(Math.floor(Math.random() * buttonCount));
      await randomButton.hover();
      await thinkTime(page, 1500, 2500);
      
      console.log('✅ Impersonation interface tested (hover only)');
    }
    
  } catch (error) {
    console.log(`⚠️ User impersonation test warning: ${error.message}`);
  }
}

/**
 * Simulate quick admin interaction
 */
async function simulateQuickAdminInteraction(page) {
  try {
    // Quick scan of page elements
    const interactiveElements = page.locator('button, .btn, a[href], .card');
    const elementCount = await interactiveElements.count();
    
    if (elementCount > 0 && Math.random() < 0.3) {
      const randomElement = interactiveElements.nth(Math.floor(Math.random() * elementCount));
      if (await randomElement.isVisible()) {
        await randomElement.hover();
        await thinkTime(page, 200, 500);
      }
    }
  } catch (error) {
    // Silent fail for quick interactions
  }
}

/**
 * Test users list interaction
 */
async function testUsersListInteraction(page) {
  try {
    const userElements = page.locator('.user, .user-row, tr');
    const userCount = await userElements.count();
    
    if (userCount > 0) {
      console.log(`👥 Interacting with ${userCount} users`);
      
      // Hover over random user
      const randomUser = userElements.nth(Math.floor(Math.random() * userCount));
      await randomUser.hover();
      await thinkTime(page, 1000, 1500);
    }
  } catch (error) {
    console.log(`⚠️ Users list interaction warning: ${error.message}`);
  }
}

/**
 * Test time logs interaction
 */
async function testTimeLogsInteraction(page) {
  try {
    const timeLogElements = page.locator('.time-log, .time-log-row, tr');
    const logCount = await timeLogElements.count();
    
    if (logCount > 0) {
      console.log(`⏰ Interacting with ${logCount} time logs`);
      
      // Hover over random time log
      const randomLog = timeLogElements.nth(Math.floor(Math.random() * logCount));
      await randomLog.hover();
      await thinkTime(page, 1000, 1500);
    }
  } catch (error) {
    console.log(`⚠️ Time logs interaction warning: ${error.message}`);
  }
}

/**
 * Check system stats on dashboard
 */
async function checkSystemStats(page) {
  try {
    console.log('📊 Checking system stats');
    
    const statsElements = page.locator('.stat, .stats, .dashboard-stat, .metric');
    const statsCount = await statsElements.count();
    
    if (statsCount > 0) {
      console.log(`📈 Found ${statsCount} system stats`);
      await simulateReading(page, 2);
    }
  } catch (error) {
    console.log(`⚠️ System stats check warning: ${error.message}`);
  }
}

/**
 * Review user activity
 */
async function reviewUserActivity(page) {
  try {
    console.log('👀 Reviewing user activity');
    
    // Look for activity indicators
    const activityElements = page.locator('.activity, .last-login, .status, .active');
    const activityCount = await activityElements.count();
    
    if (activityCount > 0) {
      console.log(`📊 Found ${activityCount} activity indicators`);
      await simulateReading(page, 1);
    }
  } catch (error) {
    console.log(`⚠️ User activity review warning: ${error.message}`);
  }
}

/**
 * Simulate performance bottleneck
 */
async function simulatePerformanceBottleneck(page) {
  try {
    console.log('🐌 Simulating performance bottleneck');
    
    // This should trigger the intentional N+1 queries in time logs
    await page.reload();
    await page.waitForSelector('.time-log, .time-logs-table', { timeout: 20000 });
    
    console.log('⚠️ Performance bottleneck triggered (intentional for monitoring)');
  } catch (error) {
    console.log(`⚠️ Performance bottleneck simulation warning: ${error.message}`);
  }
}

/**
 * Check organization health
 */
async function checkOrganizationHealth(page) {
  try {
    console.log('🏥 Checking organization health');
    
    const healthIndicators = page.locator('.health, .status, .active-users, .projects-count');
    const indicatorCount = await healthIndicators.count();
    
    if (indicatorCount > 0) {
      console.log(`💚 Found ${indicatorCount} health indicators`);
      await simulateReading(page, 1);
    }
  } catch (error) {
    console.log(`⚠️ Organization health check warning: ${error.message}`);
  }
}
