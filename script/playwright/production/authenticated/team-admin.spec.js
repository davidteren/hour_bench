// Team Admin Load Testing for Production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');
const { 
  loginAsTeamAdmin, 
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

test.describe('Team Admin Load Testing', () => {
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

  test('should simulate TechSolutions team admin workflow', async ({ page }) => {
    console.log('👥 Starting TechSolutions team admin workflow simulation');
    
    await loginAsTeamAdmin(page, 'techsolutions');
    
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ TechSolutions team admin logged in successfully');
    
    await simulateTeamAdminWorkflow(page, 'TechSolutions Development Team');
    
    console.log('✅ TechSolutions team admin workflow completed');
  });

  test('should simulate Creative Agency team admin workflow', async ({ page }) => {
    console.log('🎨 Starting Creative Agency team admin workflow simulation');
    
    await loginAsTeamAdmin(page, 'creative');
    
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ Creative Agency team admin logged in successfully');
    
    await simulateTeamAdminWorkflow(page, 'Creative Design Team');
    
    console.log('✅ Creative Agency team admin workflow completed');
  });

  test('should simulate StartupCorp team admin workflow', async ({ page }) => {
    console.log('🚀 Starting StartupCorp team admin workflow simulation');
    
    await loginAsTeamAdmin(page, 'startup');
    
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ StartupCorp team admin logged in successfully');
    
    await simulateTeamAdminWorkflow(page, 'StartupCorp Product Team');
    
    console.log('✅ StartupCorp team admin workflow completed');
  });

  test('should test team admin project management workflow', async ({ page }) => {
    console.log('📋 Testing team admin project management workflow');
    
    // Randomly select organization
    const orgs = ['techsolutions', 'creative', 'startup'];
    const randomOrg = orgs[Math.floor(Math.random() * orgs.length)];
    
    await loginAsTeamAdmin(page, randomOrg);
    
    const projectManagementTasks = [
      {
        name: 'Team Projects Overview',
        action: async () => {
          await testTeamProjectsOverview(page);
        }
      },
      {
        name: 'Project Assignment Review',
        action: async () => {
          await testProjectAssignmentReview(page);
        }
      },
      {
        name: 'Team Performance Monitoring',
        action: async () => {
          await testTeamPerformanceMonitoring(page);
        }
      },
      {
        name: 'Project Timeline Review',
        action: async () => {
          await testProjectTimelineReview(page);
        }
      },
      {
        name: 'Resource Allocation Check',
        action: async () => {
          await testResourceAllocationCheck(page);
        }
      }
    ];
    
    for (const task of projectManagementTasks) {
      try {
        console.log(`📋 Project Management: ${task.name}`);
        await task.action();
        await thinkTime(page, 2000, 4000);
      } catch (error) {
        console.log(`⚠️ Project management task "${task.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Project management workflow completed');
  });

  test('should test team admin time tracking oversight', async ({ page }) => {
    console.log('⏰ Testing team admin time tracking oversight');
    
    await loginAsTeamAdmin(page, 'techsolutions');
    
    const timeTrackingTasks = [
      {
        name: 'Team Time Logs Review',
        action: async () => {
          await testTeamTimeLogsReview(page);
        }
      },
      {
        name: 'Individual Performance Analysis',
        action: async () => {
          await testIndividualPerformanceAnalysis(page);
        }
      },
      {
        name: 'Project Time Allocation',
        action: async () => {
          await testProjectTimeAllocation(page);
        }
      },
      {
        name: 'Productivity Metrics Review',
        action: async () => {
          await testProductivityMetricsReview(page);
        }
      },
      {
        name: 'Time Tracking Compliance',
        action: async () => {
          await testTimeTrackingCompliance(page);
        }
      }
    ];
    
    for (const task of timeTrackingTasks) {
      try {
        console.log(`⏰ Time Tracking Oversight: ${task.name}`);
        await task.action();
        await thinkTime(page, 2000, 3000);
      } catch (error) {
        console.log(`⚠️ Time tracking task "${task.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Time tracking oversight completed');
  });

  test('should test team admin high-frequency monitoring', async ({ page }) => {
    console.log('⚡ Testing team admin high-frequency monitoring');
    
    await loginAsTeamAdmin(page, 'creative');
    
    // High-frequency monitoring operations
    const monitoringOperations = [
      () => navigateToPage(page, '/app/dashboard'),
      () => navigateToPage(page, '/app/projects'),
      () => navigateToPage(page, '/app/time_logs'),
      () => navigateToPage(page, '/app/users'),
      () => simulateQuickTeamCheck(page),
      () => simulateQuickProjectCheck(page)
    ];
    
    const operationCount = 15;
    
    for (let i = 0; i < operationCount; i++) {
      try {
        console.log(`🔄 Monitoring operation ${i + 1}/${operationCount}`);
        
        const randomOperation = monitoringOperations[Math.floor(Math.random() * monitoringOperations.length)];
        await randomOperation();
        
        // Quick team admin interaction
        await simulateQuickTeamAdminInteraction(page);
        
        await thinkTime(page, 800, 2000);
        
      } catch (error) {
        console.log(`⚠️ Monitoring operation ${i + 1} warning: ${error.message}`);
      }
    }
    
    console.log('✅ High-frequency monitoring completed');
  });

  test('should simulate team admin daily standup workflow', async ({ page }) => {
    console.log('🗣️ Simulating team admin daily standup workflow');
    
    await loginAsTeamAdmin(page, 'startup');
    
    const standupWorkflow = [
      {
        name: 'Team Status Overview',
        action: async () => {
          await navigateToPage(page, '/app/dashboard');
          await reviewTeamStatus(page);
        }
      },
      {
        name: 'Yesterday\'s Progress Review',
        action: async () => {
          await navigateToPage(page, '/app/time_logs');
          await reviewYesterdayProgress(page);
        }
      },
      {
        name: 'Today\'s Project Priorities',
        action: async () => {
          await navigateToPage(page, '/app/projects');
          await reviewTodayPriorities(page);
        }
      },
      {
        name: 'Team Member Check-in',
        action: async () => {
          await navigateToPage(page, '/app/users');
          await performTeamMemberCheckin(page);
        }
      },
      {
        name: 'Blockers and Issues Review',
        action: async () => {
          await reviewBlockersAndIssues(page);
        }
      }
    ];
    
    for (const step of standupWorkflow) {
      try {
        console.log(`🗣️ Standup: ${step.name}`);
        await step.action();
        await thinkTime(page, 2000, 4000);
      } catch (error) {
        console.log(`⚠️ Standup step "${step.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Daily standup workflow simulation completed');
  });
});

/**
 * Simulate comprehensive team admin workflow
 */
async function simulateTeamAdminWorkflow(page, teamName) {
  console.log(`👥 Simulating ${teamName} admin workflow`);
  
  const workflow = [
    {
      name: 'Team Dashboard Review',
      action: async () => {
        await interactWithDashboard(page);
        await simulateReading(page, 2);
      }
    },
    {
      name: 'Team Projects Management',
      action: async () => {
        await navigateToPage(page, '/app/projects');
        await testTeamProjectsManagement(page);
      }
    },
    {
      name: 'Team Time Tracking',
      action: async () => {
        await navigateToPage(page, '/app/time_logs');
        await testTeamTimeTracking(page);
      }
    },
    {
      name: 'Team Member Oversight',
      action: async () => {
        await navigateToPage(page, '/app/users');
        await testTeamMemberOversight(page);
      }
    }
  ];
  
  for (const step of workflow) {
    try {
      console.log(`📋 ${teamName} Workflow: ${step.name}`);
      await step.action();
      await thinkTime(page, 2000, 4000);
    } catch (error) {
      console.log(`⚠️ Workflow step "${step.name}" warning: ${error.message}`);
    }
  }
}

/**
 * Test team projects management
 */
async function testTeamProjectsManagement(page) {
  try {
    console.log('📋 Testing team projects management');
    
    await simulateReading(page, 2);
    
    const projectElements = page.locator('.project, .project-card, .project-item');
    const projectCount = await projectElements.count();
    
    if (projectCount > 0) {
      console.log(`📋 Found ${projectCount} team projects`);
      
      // Review multiple projects
      const projectsToReview = Math.min(3, projectCount);
      for (let i = 0; i < projectsToReview; i++) {
        const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
        if (await randomProject.isVisible()) {
          await randomProject.hover();
          await thinkTime(page, 1500, 2500);
          
          // Look for project management actions
          const projectActions = page.locator('.project-actions, .manage, .edit');
          if (await projectActions.first().isVisible()) {
            await projectActions.first().hover();
            await thinkTime(page, 1000, 1500);
          }
        }
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Team projects management warning: ${error.message}`);
  }
}

/**
 * Test team time tracking
 */
async function testTeamTimeTracking(page) {
  try {
    console.log('⏰ Testing team time tracking');
    
    await simulateReading(page, 2);
    
    // Look for team member time logs
    const timeLogElements = page.locator('.time-log, .time-log-row');
    const logCount = await timeLogElements.count();
    
    if (logCount > 0) {
      console.log(`⏰ Found ${logCount} team time logs`);
      
      // Review time logs for patterns
      const logsToReview = Math.min(5, logCount);
      for (let i = 0; i < logsToReview; i++) {
        const randomLog = timeLogElements.nth(Math.floor(Math.random() * logCount));
        if (await randomLog.isVisible()) {
          await randomLog.hover();
          await thinkTime(page, 1000, 1500);
        }
      }
    }
    
    // Look for time tracking filters
    const filterElements = page.locator('.filter, .search, select');
    if (await filterElements.first().isVisible()) {
      await filterElements.first().focus();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Team time tracking warning: ${error.message}`);
  }
}

/**
 * Test team member oversight
 */
async function testTeamMemberOversight(page) {
  try {
    console.log('👥 Testing team member oversight');
    
    await simulateReading(page, 2);
    
    const userElements = page.locator('.user, .user-row, .team-member');
    const userCount = await userElements.count();
    
    if (userCount > 0) {
      console.log(`👥 Found ${userCount} team members`);
      
      // Review team members
      const membersToReview = Math.min(3, userCount);
      for (let i = 0; i < membersToReview; i++) {
        const randomMember = userElements.nth(Math.floor(Math.random() * userCount));
        if (await randomMember.isVisible()) {
          await randomMember.hover();
          await thinkTime(page, 1500, 2500);
          
          // Look for member actions
          const memberActions = page.locator('.user-actions, .member-actions');
          if (await memberActions.first().isVisible()) {
            await memberActions.first().hover();
            await thinkTime(page, 1000, 1500);
          }
        }
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Team member oversight warning: ${error.message}`);
  }
}

/**
 * Test team projects overview
 */
async function testTeamProjectsOverview(page) {
  try {
    console.log('📊 Testing team projects overview');
    
    await navigateToPage(page, '/app/projects');
    
    // Look for project status indicators
    const statusElements = page.locator('.status, .progress, .state');
    const statusCount = await statusElements.count();
    
    if (statusCount > 0) {
      console.log(`📊 Found ${statusCount} project status indicators`);
      await simulateReading(page, 2);
    }
    
    // Look for project metrics
    const metricElements = page.locator('.metric, .stats, .progress-bar');
    const metricCount = await metricElements.count();
    
    if (metricCount > 0) {
      console.log(`📈 Found ${metricCount} project metrics`);
      await simulateReading(page, 1);
    }
    
  } catch (error) {
    console.log(`⚠️ Team projects overview warning: ${error.message}`);
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
    const assignmentElements = page.locator('.assigned, .assignee, .team-member');
    const assignmentCount = await assignmentElements.count();
    
    if (assignmentCount > 0) {
      console.log(`📋 Found ${assignmentCount} assignment indicators`);
      
      // Review assignments
      const assignmentsToReview = Math.min(3, assignmentCount);
      for (let i = 0; i < assignmentsToReview; i++) {
        const randomAssignment = assignmentElements.nth(Math.floor(Math.random() * assignmentCount));
        if (await randomAssignment.isVisible()) {
          await randomAssignment.hover();
          await thinkTime(page, 1000, 1500);
        }
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Project assignment review warning: ${error.message}`);
  }
}

/**
 * Test team performance monitoring
 */
async function testTeamPerformanceMonitoring(page) {
  try {
    console.log('📊 Testing team performance monitoring');
    
    await navigateToPage(page, '/app/dashboard');
    
    // Look for performance metrics
    const performanceElements = page.locator('.performance, .metrics, .stats, .kpi');
    const performanceCount = await performanceElements.count();
    
    if (performanceCount > 0) {
      console.log(`📊 Found ${performanceCount} performance metrics`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Team performance monitoring warning: ${error.message}`);
  }
}

/**
 * Test project timeline review
 */
async function testProjectTimelineReview(page) {
  try {
    console.log('📅 Testing project timeline review');
    
    await navigateToPage(page, '/app/projects');
    
    // Look for timeline elements
    const timelineElements = page.locator('.timeline, .schedule, .deadline, .due-date');
    const timelineCount = await timelineElements.count();
    
    if (timelineCount > 0) {
      console.log(`📅 Found ${timelineCount} timeline elements`);
      await simulateReading(page, 1);
    }
    
  } catch (error) {
    console.log(`⚠️ Project timeline review warning: ${error.message}`);
  }
}

/**
 * Test resource allocation check
 */
async function testResourceAllocationCheck(page) {
  try {
    console.log('🔧 Testing resource allocation check');
    
    await navigateToPage(page, '/app/users');
    
    // Look for resource allocation indicators
    const resourceElements = page.locator('.allocation, .workload, .capacity, .utilization');
    const resourceCount = await resourceElements.count();
    
    if (resourceCount > 0) {
      console.log(`🔧 Found ${resourceCount} resource allocation indicators`);
      await simulateReading(page, 1);
    }
    
  } catch (error) {
    console.log(`⚠️ Resource allocation check warning: ${error.message}`);
  }
}

/**
 * Test team time logs review
 */
async function testTeamTimeLogsReview(page) {
  try {
    console.log('⏰ Testing team time logs review');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Look for team-specific time logs
    const teamTimeLogElements = page.locator('.time-log, .team-time-log');
    const logCount = await teamTimeLogElements.count();
    
    if (logCount > 0) {
      console.log(`⏰ Found ${logCount} team time logs`);
      await simulateReading(page, 3);
      
      // Look for time log analysis tools
      const analysisTools = page.locator('.analysis, .report, .summary');
      if (await analysisTools.first().isVisible()) {
        await analysisTools.first().hover();
        await thinkTime(page, 1000, 1500);
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Team time logs review warning: ${error.message}`);
  }
}

/**
 * Test individual performance analysis
 */
async function testIndividualPerformanceAnalysis(page) {
  try {
    console.log('👤 Testing individual performance analysis');
    
    await navigateToPage(page, '/app/users');
    
    // Look for individual performance metrics
    const performanceElements = page.locator('.performance, .productivity, .efficiency');
    const performanceCount = await performanceElements.count();
    
    if (performanceCount > 0) {
      console.log(`👤 Found ${performanceCount} individual performance indicators`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Individual performance analysis warning: ${error.message}`);
  }
}

/**
 * Test project time allocation
 */
async function testProjectTimeAllocation(page) {
  try {
    console.log('📊 Testing project time allocation');
    
    await navigateToPage(page, '/app/projects');
    
    // Look for time allocation data
    const allocationElements = page.locator('.allocation, .time-spent, .hours');
    const allocationCount = await allocationElements.count();
    
    if (allocationCount > 0) {
      console.log(`📊 Found ${allocationCount} time allocation indicators`);
      await simulateReading(page, 1);
    }
    
  } catch (error) {
    console.log(`⚠️ Project time allocation warning: ${error.message}`);
  }
}

/**
 * Test productivity metrics review
 */
async function testProductivityMetricsReview(page) {
  try {
    console.log('📈 Testing productivity metrics review');
    
    await navigateToPage(page, '/app/dashboard');
    
    // Look for productivity metrics
    const productivityElements = page.locator('.productivity, .efficiency, .output');
    const productivityCount = await productivityElements.count();
    
    if (productivityCount > 0) {
      console.log(`📈 Found ${productivityCount} productivity metrics`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Productivity metrics review warning: ${error.message}`);
  }
}

/**
 * Test time tracking compliance
 */
async function testTimeTrackingCompliance(page) {
  try {
    console.log('✅ Testing time tracking compliance');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Look for compliance indicators
    const complianceElements = page.locator('.compliance, .complete, .missing');
    const complianceCount = await complianceElements.count();
    
    if (complianceCount > 0) {
      console.log(`✅ Found ${complianceCount} compliance indicators`);
      await simulateReading(page, 1);
    }
    
  } catch (error) {
    console.log(`⚠️ Time tracking compliance warning: ${error.message}`);
  }
}

/**
 * Simulate quick team check
 */
async function simulateQuickTeamCheck(page) {
  try {
    const teamElements = page.locator('.team, .team-member, .user');
    const teamCount = await teamElements.count();
    
    if (teamCount > 0) {
      const randomTeamElement = teamElements.nth(Math.floor(Math.random() * teamCount));
      await randomTeamElement.hover();
      await thinkTime(page, 500, 1000);
    }
  } catch (error) {
    // Silent fail for quick operations
  }
}

/**
 * Simulate quick project check
 */
async function simulateQuickProjectCheck(page) {
  try {
    const projectElements = page.locator('.project, .project-card');
    const projectCount = await projectElements.count();
    
    if (projectCount > 0) {
      const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
      await randomProject.hover();
      await thinkTime(page, 500, 1000);
    }
  } catch (error) {
    // Silent fail for quick operations
  }
}

/**
 * Simulate quick team admin interaction
 */
async function simulateQuickTeamAdminInteraction(page) {
  try {
    const quickActions = [
      () => page.locator('.btn, button').first().hover(),
      () => page.locator('.status, .metric').first().hover(),
      () => page.locator('.project, .user').first().hover()
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
 * Review team status
 */
async function reviewTeamStatus(page) {
  try {
    console.log('📊 Reviewing team status');
    
    const statusElements = page.locator('.team-status, .status, .health');
    const statusCount = await statusElements.count();
    
    if (statusCount > 0) {
      console.log(`📊 Found ${statusCount} team status indicators`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Team status review warning: ${error.message}`);
  }
}

/**
 * Review yesterday's progress
 */
async function reviewYesterdayProgress(page) {
  try {
    console.log('📅 Reviewing yesterday\'s progress');
    
    // Look for recent time logs
    const recentLogs = page.locator('.recent, .yesterday, .time-log');
    const logCount = await recentLogs.count();
    
    if (logCount > 0) {
      console.log(`📅 Found ${logCount} recent activity logs`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Yesterday's progress review warning: ${error.message}`);
  }
}

/**
 * Review today's priorities
 */
async function reviewTodayPriorities(page) {
  try {
    console.log('🎯 Reviewing today\'s priorities');
    
    const priorityElements = page.locator('.priority, .urgent, .today');
    const priorityCount = await priorityElements.count();
    
    if (priorityCount > 0) {
      console.log(`🎯 Found ${priorityCount} priority indicators`);
      await simulateReading(page, 1);
    }
    
  } catch (error) {
    console.log(`⚠️ Today's priorities review warning: ${error.message}`);
  }
}

/**
 * Perform team member check-in
 */
async function performTeamMemberCheckin(page) {
  try {
    console.log('👥 Performing team member check-in');
    
    const memberElements = page.locator('.team-member, .user');
    const memberCount = await memberElements.count();
    
    if (memberCount > 0) {
      console.log(`👥 Checking in with ${memberCount} team members`);
      
      // Check in with 2-3 team members
      const checkinsToPerform = Math.min(3, memberCount);
      for (let i = 0; i < checkinsToPerform; i++) {
        const randomMember = memberElements.nth(Math.floor(Math.random() * memberCount));
        if (await randomMember.isVisible()) {
          await randomMember.hover();
          await thinkTime(page, 1000, 2000);
        }
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Team member check-in warning: ${error.message}`);
  }
}

/**
 * Review blockers and issues
 */
async function reviewBlockersAndIssues(page) {
  try {
    console.log('🚫 Reviewing blockers and issues');
    
    await navigateToPage(page, '/app/projects');
    
    // Look for issues or blockers
    const issueElements = page.locator('.issue, .blocker, .problem, .alert');
    const issueCount = await issueElements.count();
    
    if (issueCount > 0) {
      console.log(`🚫 Found ${issueCount} issues or blockers`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Blockers and issues review warning: ${error.message}`);
  }
}
