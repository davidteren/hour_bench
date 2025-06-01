// Organization Admin Load Testing for Production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');
const { 
  loginAsOrgAdmin, 
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

test.describe('Organization Admin Load Testing', () => {
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

  test('should simulate TechSolutions org admin workflow', async ({ page }) => {
    console.log('🏢 Starting TechSolutions org admin workflow simulation');
    
    await loginAsOrgAdmin(page, 'techsolutions');
    
    // Verify org admin dashboard access
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ TechSolutions org admin logged in successfully');
    
    await simulateOrgAdminWorkflow(page, 'TechSolutions');
    
    console.log('✅ TechSolutions org admin workflow completed');
  });

  test('should simulate Creative Agency org admin workflow', async ({ page }) => {
    console.log('🎨 Starting Creative Agency org admin workflow simulation');
    
    await loginAsOrgAdmin(page, 'creative');
    
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ Creative Agency org admin logged in successfully');
    
    await simulateOrgAdminWorkflow(page, 'Creative Agency');
    
    console.log('✅ Creative Agency org admin workflow completed');
  });

  test('should simulate StartupCorp org admin workflow', async ({ page }) => {
    console.log('🚀 Starting StartupCorp org admin workflow simulation');
    
    await loginAsOrgAdmin(page, 'startup');
    
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ StartupCorp org admin logged in successfully');
    
    await simulateOrgAdminWorkflow(page, 'StartupCorp');
    
    console.log('✅ StartupCorp org admin workflow completed');
  });

  test('should test org admin high-frequency operations', async ({ page }) => {
    console.log('⚡ Testing org admin high-frequency operations');
    
    // Randomly select organization
    const orgs = ['techsolutions', 'creative', 'startup'];
    const randomOrg = orgs[Math.floor(Math.random() * orgs.length)];
    
    await loginAsOrgAdmin(page, randomOrg);
    
    // High-frequency operations typical for org admins
    const operations = [
      () => navigateToPage(page, '/app/dashboard'),
      () => navigateToPage(page, '/app/users'),
      () => navigateToPage(page, '/app/clients'),
      () => navigateToPage(page, '/app/projects'),
      () => navigateToPage(page, '/app/time_logs')
    ];
    
    const operationCount = 12;
    
    for (let i = 0; i < operationCount; i++) {
      try {
        console.log(`🔄 Operation ${i + 1}/${operationCount}`);
        
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];
        await randomOperation();
        
        // Quick org-specific interaction
        await simulateQuickOrgInteraction(page);
        
        await thinkTime(page, 800, 2000);
        
      } catch (error) {
        console.log(`⚠️ High-frequency operation ${i + 1} warning: ${error.message}`);
      }
    }
    
    console.log('✅ High-frequency operations testing completed');
  });

  test('should test org admin team management workflow', async ({ page }) => {
    console.log('👥 Testing org admin team management workflow');
    
    await loginAsOrgAdmin(page, 'techsolutions');
    
    const teamManagementTasks = [
      {
        name: 'Team Overview',
        action: async () => {
          await testTeamOverview(page);
        }
      },
      {
        name: 'User Management',
        action: async () => {
          await testOrgUserManagement(page);
        }
      },
      {
        name: 'Team Performance Review',
        action: async () => {
          await testTeamPerformanceReview(page);
        }
      },
      {
        name: 'Project Assignment Review',
        action: async () => {
          await testProjectAssignmentReview(page);
        }
      }
    ];
    
    for (const task of teamManagementTasks) {
      try {
        console.log(`👥 Team Management: ${task.name}`);
        await task.action();
        await thinkTime(page, 2000, 4000);
      } catch (error) {
        console.log(`⚠️ Team management task "${task.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Team management workflow completed');
  });

  test('should test org admin client and project management', async ({ page }) => {
    console.log('🏢 Testing org admin client and project management');
    
    await loginAsOrgAdmin(page, 'creative');
    
    const clientProjectTasks = [
      {
        name: 'Client Portfolio Review',
        action: async () => {
          await testClientPortfolioReview(page);
        }
      },
      {
        name: 'Project Status Monitoring',
        action: async () => {
          await testProjectStatusMonitoring(page);
        }
      },
      {
        name: 'Revenue Analysis',
        action: async () => {
          await testRevenueAnalysis(page);
        }
      },
      {
        name: 'Time Tracking Oversight',
        action: async () => {
          await testTimeTrackingOversight(page);
        }
      }
    ];
    
    for (const task of clientProjectTasks) {
      try {
        console.log(`💼 Client/Project Management: ${task.name}`);
        await task.action();
        await thinkTime(page, 2000, 4000);
      } catch (error) {
        console.log(`⚠️ Client/project task "${task.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Client and project management testing completed');
  });

  test('should simulate concurrent org admin sessions', async ({ page }) => {
    console.log('👥 Simulating concurrent org admin sessions');
    
    await loginAsOrgAdmin(page, 'startup');
    
    // Simulate multiple org admin tasks
    const concurrentTasks = [
      async () => {
        console.log('📊 Task 1: Dashboard monitoring');
        await navigateToPage(page, '/app/dashboard');
        await interactWithDashboard(page);
      },
      async () => {
        console.log('👥 Task 2: Team oversight');
        await navigateToPage(page, '/app/users');
        await testOrgUserInteraction(page);
      },
      async () => {
        console.log('💼 Task 3: Client management');
        await navigateToPage(page, '/app/clients');
        await testClientInteraction(page);
      },
      async () => {
        console.log('📋 Task 4: Project review');
        await navigateToPage(page, '/app/projects');
        await testProjectInteraction(page);
      }
    ];
    
    // Execute tasks in rapid succession
    for (let cycle = 0; cycle < 2; cycle++) {
      console.log(`🔄 Org admin task cycle ${cycle + 1}`);
      
      for (const task of concurrentTasks) {
        try {
          await task();
          await thinkTime(page, 1000, 2000);
        } catch (error) {
          console.log(`⚠️ Concurrent task warning: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Concurrent org admin sessions simulation completed');
  });
});

/**
 * Simulate comprehensive org admin workflow
 */
async function simulateOrgAdminWorkflow(page, orgName) {
  console.log(`🏢 Simulating ${orgName} admin workflow`);
  
  const workflow = [
    {
      name: 'Dashboard Review',
      action: async () => {
        await interactWithDashboard(page);
        await simulateReading(page, 2);
      }
    },
    {
      name: 'Organization Users',
      action: async () => {
        await navigateToPage(page, '/app/users');
        await testOrgUserManagement(page);
      }
    },
    {
      name: 'Client Management',
      action: async () => {
        await navigateToPage(page, '/app/clients');
        await testClientManagement(page);
      }
    },
    {
      name: 'Project Oversight',
      action: async () => {
        await navigateToPage(page, '/app/projects');
        await testProjectOversight(page);
      }
    },
    {
      name: 'Time Logs Review',
      action: async () => {
        await navigateToPage(page, '/app/time_logs');
        await testOrgTimeLogsReview(page);
      }
    }
  ];
  
  for (const step of workflow) {
    try {
      console.log(`📋 ${orgName} Workflow: ${step.name}`);
      await step.action();
      await thinkTime(page, 2000, 4000);
    } catch (error) {
      console.log(`⚠️ Workflow step "${step.name}" warning: ${error.message}`);
    }
  }
}

/**
 * Test organization user management
 */
async function testOrgUserManagement(page) {
  try {
    console.log('👥 Testing organization user management');
    
    await simulateReading(page, 2);
    
    // Look for user management actions
    const userElements = page.locator('.user, .user-row, .user-card');
    const userCount = await userElements.count();
    
    if (userCount > 0) {
      console.log(`👥 Found ${userCount} organization users`);
      
      // Interact with random user
      const randomUser = userElements.nth(Math.floor(Math.random() * userCount));
      if (await randomUser.isVisible()) {
        await randomUser.hover();
        await thinkTime(page, 1500, 2500);
        
        // Look for user actions
        const userActions = page.locator('a:has-text("Edit"), a:has-text("View"), .user-actions');
        if (await userActions.first().isVisible()) {
          await userActions.first().hover();
          await thinkTime(page, 1000, 1500);
        }
      }
    }
    
    // Look for "Add User" or "Invite User" button
    const addUserBtn = page.locator('a:has-text("Add User"), a:has-text("Invite"), .add-user');
    if (await addUserBtn.first().isVisible()) {
      await addUserBtn.first().hover();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Org user management warning: ${error.message}`);
  }
}

/**
 * Test client management
 */
async function testClientManagement(page) {
  try {
    console.log('🏢 Testing client management');
    
    await simulateReading(page, 2);
    
    const clientElements = page.locator('.client, .client-row, .client-card');
    const clientCount = await clientElements.count();
    
    if (clientCount > 0) {
      console.log(`🏢 Found ${clientCount} clients`);
      
      // Click on random client
      const randomClient = clientElements.nth(Math.floor(Math.random() * clientCount));
      if (await randomClient.isVisible()) {
        await randomClient.click();
        await thinkTime(page, 2000, 3000);
        
        // Navigate back
        await page.goBack();
        await thinkTime(page, 1000, 2000);
      }
    }
    
    // Look for "New Client" button
    const newClientBtn = page.locator('a:has-text("New Client"), .new-client, .add-client');
    if (await newClientBtn.first().isVisible()) {
      await newClientBtn.first().hover();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Client management warning: ${error.message}`);
  }
}

/**
 * Test project oversight
 */
async function testProjectOversight(page) {
  try {
    console.log('📋 Testing project oversight');
    
    await simulateReading(page, 2);
    
    const projectElements = page.locator('.project, .project-row, .project-card');
    const projectCount = await projectElements.count();
    
    if (projectCount > 0) {
      console.log(`📋 Found ${projectCount} projects`);
      
      // Interact with random project
      const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
      if (await randomProject.isVisible()) {
        await randomProject.click();
        await thinkTime(page, 2000, 3000);
        
        // Look for project details
        await simulateReading(page, 1);
        
        // Navigate back
        await page.goBack();
        await thinkTime(page, 1000, 2000);
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Project oversight warning: ${error.message}`);
  }
}

/**
 * Test organization time logs review
 */
async function testOrgTimeLogsReview(page) {
  try {
    console.log('⏰ Testing organization time logs review');
    
    await simulateReading(page, 3);
    
    const timeLogElements = page.locator('.time-log, .time-log-row');
    const logCount = await timeLogElements.count();
    
    if (logCount > 0) {
      console.log(`⏰ Found ${logCount} time logs`);
      
      // Review random time logs
      const logsToReview = Math.min(3, logCount);
      for (let i = 0; i < logsToReview; i++) {
        const randomLog = timeLogElements.nth(Math.floor(Math.random() * logCount));
        if (await randomLog.isVisible()) {
          await randomLog.hover();
          await thinkTime(page, 1000, 1500);
        }
      }
    }
    
    // Look for filters or search
    const filterElements = page.locator('select, .filter, .search, input[type="search"]');
    if (await filterElements.first().isVisible()) {
      await filterElements.first().focus();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Org time logs review warning: ${error.message}`);
  }
}

/**
 * Simulate quick org interaction
 */
async function simulateQuickOrgInteraction(page) {
  try {
    const quickActions = [
      () => page.locator('.btn, button').first().hover(),
      () => page.locator('.card, .item').first().hover(),
      () => page.locator('a[href]').first().hover()
    ];
    
    if (Math.random() < 0.4) {
      const randomAction = quickActions[Math.floor(Math.random() * quickActions.length)];
      await randomAction();
      await thinkTime(page, 300, 800);
    }
  } catch (error) {
    // Silent fail for quick interactions
  }
}

/**
 * Test team overview
 */
async function testTeamOverview(page) {
  try {
    console.log('👥 Testing team overview');
    
    await navigateToPage(page, '/app/dashboard');
    
    // Look for team-related information
    const teamElements = page.locator('.team, .team-info, .team-stats');
    const teamCount = await teamElements.count();
    
    if (teamCount > 0) {
      console.log(`👥 Found ${teamCount} team elements`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Team overview warning: ${error.message}`);
  }
}

/**
 * Test team performance review
 */
async function testTeamPerformanceReview(page) {
  try {
    console.log('📊 Testing team performance review');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Look for performance metrics
    const performanceElements = page.locator('.stats, .metrics, .performance, .total');
    const metricsCount = await performanceElements.count();
    
    if (metricsCount > 0) {
      console.log(`📊 Found ${metricsCount} performance metrics`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Team performance review warning: ${error.message}`);
  }
}

/**
 * Test project assignment review
 */
async function testProjectAssignmentReview(page) {
  try {
    console.log('📋 Testing project assignment review');
    
    await navigateToPage(page, '/app/projects');
    
    // Look for assignment information
    const assignmentElements = page.locator('.assigned, .team-member, .user');
    const assignmentCount = await assignmentElements.count();
    
    if (assignmentCount > 0) {
      console.log(`📋 Found ${assignmentCount} assignment elements`);
      await simulateReading(page, 1);
    }
    
  } catch (error) {
    console.log(`⚠️ Project assignment review warning: ${error.message}`);
  }
}

/**
 * Test client portfolio review
 */
async function testClientPortfolioReview(page) {
  try {
    console.log('💼 Testing client portfolio review');
    
    await navigateToPage(page, '/app/clients');
    
    const clientElements = page.locator('.client, .client-card');
    const clientCount = await clientElements.count();
    
    if (clientCount > 0) {
      console.log(`💼 Reviewing ${clientCount} clients in portfolio`);
      
      // Review multiple clients
      const clientsToReview = Math.min(3, clientCount);
      for (let i = 0; i < clientsToReview; i++) {
        const randomClient = clientElements.nth(Math.floor(Math.random() * clientCount));
        if (await randomClient.isVisible()) {
          await randomClient.hover();
          await thinkTime(page, 1000, 2000);
        }
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Client portfolio review warning: ${error.message}`);
  }
}

/**
 * Test project status monitoring
 */
async function testProjectStatusMonitoring(page) {
  try {
    console.log('📊 Testing project status monitoring');
    
    await navigateToPage(page, '/app/projects');
    
    // Look for status indicators
    const statusElements = page.locator('.status, .progress, .state');
    const statusCount = await statusElements.count();
    
    if (statusCount > 0) {
      console.log(`📊 Found ${statusCount} status indicators`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Project status monitoring warning: ${error.message}`);
  }
}

/**
 * Test revenue analysis
 */
async function testRevenueAnalysis(page) {
  try {
    console.log('💰 Testing revenue analysis');
    
    await navigateToPage(page, '/app/dashboard');
    
    // Look for revenue/financial information
    const revenueElements = page.locator('.revenue, .earnings, .total, .amount, .financial');
    const revenueCount = await revenueElements.count();
    
    if (revenueCount > 0) {
      console.log(`💰 Found ${revenueCount} revenue elements`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Revenue analysis warning: ${error.message}`);
  }
}

/**
 * Test time tracking oversight
 */
async function testTimeTrackingOversight(page) {
  try {
    console.log('⏰ Testing time tracking oversight');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Look for oversight tools
    const oversightElements = page.locator('.filter, .search, .sort, .export');
    const toolCount = await oversightElements.count();
    
    if (toolCount > 0) {
      console.log(`⏰ Found ${toolCount} oversight tools`);
      
      // Test random oversight tool
      const randomTool = oversightElements.nth(Math.floor(Math.random() * toolCount));
      if (await randomTool.isVisible()) {
        await randomTool.hover();
        await thinkTime(page, 1000, 1500);
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Time tracking oversight warning: ${error.message}`);
  }
}

/**
 * Test org user interaction
 */
async function testOrgUserInteraction(page) {
  try {
    const userElements = page.locator('.user, .user-row');
    const userCount = await userElements.count();
    
    if (userCount > 0) {
      const randomUser = userElements.nth(Math.floor(Math.random() * userCount));
      await randomUser.hover();
      await thinkTime(page, 1000, 1500);
    }
  } catch (error) {
    console.log(`⚠️ Org user interaction warning: ${error.message}`);
  }
}

/**
 * Test client interaction
 */
async function testClientInteraction(page) {
  try {
    const clientElements = page.locator('.client, .client-row');
    const clientCount = await clientElements.count();
    
    if (clientCount > 0) {
      const randomClient = clientElements.nth(Math.floor(Math.random() * clientCount));
      await randomClient.hover();
      await thinkTime(page, 1000, 1500);
    }
  } catch (error) {
    console.log(`⚠️ Client interaction warning: ${error.message}`);
  }
}

/**
 * Test project interaction
 */
async function testProjectInteraction(page) {
  try {
    const projectElements = page.locator('.project, .project-row');
    const projectCount = await projectElements.count();
    
    if (projectCount > 0) {
      const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
      await randomProject.hover();
      await thinkTime(page, 1000, 1500);
    }
  } catch (error) {
    console.log(`⚠️ Project interaction warning: ${error.message}`);
  }
}
