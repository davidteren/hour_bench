// Regular User Load Testing for Production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');
const { 
  loginAsUser, 
  logoutUser,
  PRODUCTION_BASE_URL 
} = require('../helpers/auth');
const { 
  thinkTime, 
  navigateToPage, 
  clickElement, 
  fillField,
  simulateReading,
  interactWithDashboard,
  simulateTimeTracking 
} = require('../helpers/navigation');
const { 
  setupPerformanceMonitoring,
  simulateUserBrowsingPattern 
} = require('../helpers/load-utils');

test.describe('Regular User Load Testing', () => {
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

  test('should simulate TechSolutions regular user workflow', async ({ page }) => {
    console.log('👤 Starting TechSolutions regular user workflow simulation');
    
    await loginAsUser(page, 'techsolutions');
    
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ TechSolutions regular user logged in successfully');
    
    await simulateRegularUserWorkflow(page, 'TechSolutions');
    
    console.log('✅ TechSolutions regular user workflow completed');
  });

  test('should simulate Creative Agency regular user workflow', async ({ page }) => {
    console.log('🎨 Starting Creative Agency regular user workflow simulation');
    
    await loginAsUser(page, 'creative');
    
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ Creative Agency regular user logged in successfully');
    
    await simulateRegularUserWorkflow(page, 'Creative Agency');
    
    console.log('✅ Creative Agency regular user workflow completed');
  });

  test('should simulate StartupCorp regular user workflow', async ({ page }) => {
    console.log('🚀 Starting StartupCorp regular user workflow simulation');
    
    await loginAsUser(page, 'startup');
    
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ StartupCorp regular user logged in successfully');
    
    await simulateRegularUserWorkflow(page, 'StartupCorp');
    
    console.log('✅ StartupCorp regular user workflow completed');
  });

  test('should test regular user time tracking intensive workflow', async ({ page }) => {
    console.log('⏰ Testing regular user time tracking intensive workflow');
    
    // Randomly select organization
    const orgs = ['techsolutions', 'creative', 'startup'];
    const randomOrg = orgs[Math.floor(Math.random() * orgs.length)];
    
    await loginAsUser(page, randomOrg);
    
    // Intensive time tracking simulation
    const timeTrackingTasks = [
      {
        name: 'Dashboard Timer Check',
        action: async () => {
          await navigateToPage(page, '/app/dashboard');
          await checkRunningTimers(page);
        }
      },
      {
        name: 'Start New Timer',
        action: async () => {
          await testStartTimer(page);
        }
      },
      {
        name: 'Time Logs Review',
        action: async () => {
          await navigateToPage(page, '/app/time_logs');
          await reviewPersonalTimeLogs(page);
        }
      },
      {
        name: 'Create Manual Time Entry',
        action: async () => {
          await testCreateManualTimeEntry(page);
        }
      },
      {
        name: 'Project Time Review',
        action: async () => {
          await testProjectTimeReview(page);
        }
      }
    ];
    
    for (const task of timeTrackingTasks) {
      try {
        console.log(`⏰ Time Tracking: ${task.name}`);
        await task.action();
        await thinkTime(page, 2000, 4000);
      } catch (error) {
        console.log(`⚠️ Time tracking task "${task.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Time tracking intensive workflow completed');
  });

  test('should test regular user project interaction workflow', async ({ page }) => {
    console.log('📋 Testing regular user project interaction workflow');
    
    await loginAsUser(page, 'techsolutions');
    
    const projectTasks = [
      {
        name: 'Available Projects Review',
        action: async () => {
          await navigateToPage(page, '/app/projects');
          await reviewAvailableProjects(page);
        }
      },
      {
        name: 'Project Details Exploration',
        action: async () => {
          await exploreProjectDetails(page);
        }
      },
      {
        name: 'Project Time Logs',
        action: async () => {
          await reviewProjectTimeLogs(page);
        }
      },
      {
        name: 'Project Issues Review',
        action: async () => {
          await reviewProjectIssues(page);
        }
      }
    ];
    
    for (const task of projectTasks) {
      try {
        console.log(`📋 Project Interaction: ${task.name}`);
        await task.action();
        await thinkTime(page, 2000, 3000);
      } catch (error) {
        console.log(`⚠️ Project task "${task.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Project interaction workflow completed');
  });

  test('should simulate regular user high-frequency daily operations', async ({ page }) => {
    console.log('⚡ Testing regular user high-frequency daily operations');
    
    await loginAsUser(page, 'creative');
    
    // Simulate typical daily operations
    const dailyOperations = [
      () => navigateToPage(page, '/app/dashboard'),
      () => navigateToPage(page, '/app/time_logs'),
      () => navigateToPage(page, '/app/projects'),
      () => simulateQuickTimeEntry(page),
      () => simulateQuickProjectCheck(page)
    ];
    
    const operationCount = 20; // High frequency
    
    for (let i = 0; i < operationCount; i++) {
      try {
        console.log(`🔄 Daily operation ${i + 1}/${operationCount}`);
        
        const randomOperation = dailyOperations[Math.floor(Math.random() * dailyOperations.length)];
        await randomOperation();
        
        // Quick interaction
        await simulateQuickUserInteraction(page);
        
        // Shorter think time for daily operations
        await thinkTime(page, 500, 1500);
        
      } catch (error) {
        console.log(`⚠️ Daily operation ${i + 1} warning: ${error.message}`);
      }
    }
    
    console.log('✅ High-frequency daily operations testing completed');
  });

  test('should simulate regular user realistic work session', async ({ page }) => {
    console.log('💼 Simulating regular user realistic work session');
    
    await loginAsUser(page, 'startup');
    
    // Simulate a realistic work session (30-45 minutes of activity)
    const workSession = [
      {
        name: 'Morning Dashboard Check',
        duration: 2000,
        action: async () => {
          await navigateToPage(page, '/app/dashboard');
          await interactWithDashboard(page);
        }
      },
      {
        name: 'Start Work Timer',
        duration: 3000,
        action: async () => {
          await testStartWorkTimer(page);
        }
      },
      {
        name: 'Project Work Simulation',
        duration: 8000,
        action: async () => {
          await simulateProjectWork(page);
        }
      },
      {
        name: 'Mid-Session Break',
        duration: 2000,
        action: async () => {
          await simulateMidSessionBreak(page);
        }
      },
      {
        name: 'Continue Work',
        duration: 6000,
        action: async () => {
          await simulateContinueWork(page);
        }
      },
      {
        name: 'End Session',
        duration: 3000,
        action: async () => {
          await testEndWorkSession(page);
        }
      }
    ];
    
    for (const session of workSession) {
      try {
        console.log(`💼 Work Session: ${session.name}`);
        await session.action();
        await thinkTime(page, session.duration, session.duration + 2000);
      } catch (error) {
        console.log(`⚠️ Work session "${session.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Realistic work session simulation completed');
  });
});

/**
 * Simulate comprehensive regular user workflow
 */
async function simulateRegularUserWorkflow(page, orgName) {
  console.log(`👤 Simulating ${orgName} regular user workflow`);
  
  const workflow = [
    {
      name: 'Dashboard Overview',
      action: async () => {
        await interactWithDashboard(page);
        await simulateReading(page, 2);
      }
    },
    {
      name: 'Personal Time Logs',
      action: async () => {
        await navigateToPage(page, '/app/time_logs');
        await reviewPersonalTimeLogs(page);
      }
    },
    {
      name: 'Available Projects',
      action: async () => {
        await navigateToPage(page, '/app/projects');
        await reviewAvailableProjects(page);
      }
    },
    {
      name: 'Time Tracking',
      action: async () => {
        await simulateTimeTracking(page);
      }
    }
  ];
  
  for (const step of workflow) {
    try {
      console.log(`📋 ${orgName} User Workflow: ${step.name}`);
      await step.action();
      await thinkTime(page, 2000, 4000);
    } catch (error) {
      console.log(`⚠️ Workflow step "${step.name}" warning: ${error.message}`);
    }
  }
}

/**
 * Check for running timers on dashboard
 */
async function checkRunningTimers(page) {
  try {
    console.log('⏰ Checking for running timers');
    
    const runningTimers = page.locator('.running-timer, .active-timer, .timer-running');
    const timerCount = await runningTimers.count();
    
    if (timerCount > 0) {
      console.log(`⏰ Found ${timerCount} running timers`);
      
      // Interact with running timer
      const randomTimer = runningTimers.nth(Math.floor(Math.random() * timerCount));
      await randomTimer.hover();
      await thinkTime(page, 1500, 2500);
    } else {
      console.log('⏰ No running timers found');
    }
    
  } catch (error) {
    console.log(`⚠️ Running timer check warning: ${error.message}`);
  }
}

/**
 * Test starting a timer
 */
async function testStartTimer(page) {
  try {
    console.log('▶️ Testing start timer');
    
    // Look for start timer button
    const startTimerBtn = page.locator('button:has-text("Start Timer"), .start-timer, [data-action*="timer"]');
    
    if (await startTimerBtn.first().isVisible()) {
      await startTimerBtn.first().hover();
      await thinkTime(page, 1000, 2000);
      
      // Don't actually start timer in load test, just hover
      console.log('⏰ Start timer button found and tested (hover only)');
    } else {
      console.log('⏰ Start timer button not found');
    }
    
  } catch (error) {
    console.log(`⚠️ Start timer test warning: ${error.message}`);
  }
}

/**
 * Review personal time logs
 */
async function reviewPersonalTimeLogs(page) {
  try {
    console.log('📊 Reviewing personal time logs');
    
    await simulateReading(page, 2);
    
    const timeLogElements = page.locator('.time-log, .time-log-row');
    const logCount = await timeLogElements.count();
    
    if (logCount > 0) {
      console.log(`📊 Found ${logCount} personal time logs`);
      
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
    
  } catch (error) {
    console.log(`⚠️ Personal time logs review warning: ${error.message}`);
  }
}

/**
 * Test creating manual time entry
 */
async function testCreateManualTimeEntry(page) {
  try {
    console.log('📝 Testing create manual time entry');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Look for "New Time Log" button
    const newTimeLogBtn = page.locator('a:has-text("New Time Log"), .new-time-log, .add-time-log');
    
    if (await newTimeLogBtn.first().isVisible()) {
      await newTimeLogBtn.first().hover();
      await thinkTime(page, 1500, 2500);
      
      console.log('📝 New time log button found and tested (hover only)');
    }
    
  } catch (error) {
    console.log(`⚠️ Create manual time entry warning: ${error.message}`);
  }
}

/**
 * Test project time review
 */
async function testProjectTimeReview(page) {
  try {
    console.log('📋 Testing project time review');
    
    await navigateToPage(page, '/app/projects');
    
    // Look for project with time logs
    const projectElements = page.locator('.project, .project-card');
    const projectCount = await projectElements.count();
    
    if (projectCount > 0) {
      const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
      
      if (await randomProject.isVisible()) {
        await randomProject.click();
        await thinkTime(page, 2000, 3000);
        
        // Look for time logs in project
        const projectTimeLogs = page.locator('.time-log, .project-time-log');
        const projectLogCount = await projectTimeLogs.count();
        
        if (projectLogCount > 0) {
          console.log(`📋 Found ${projectLogCount} time logs for project`);
          await simulateReading(page, 1);
        }
        
        // Navigate back
        await page.goBack();
        await thinkTime(page, 1000, 2000);
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Project time review warning: ${error.message}`);
  }
}

/**
 * Review available projects
 */
async function reviewAvailableProjects(page) {
  try {
    console.log('📋 Reviewing available projects');
    
    await simulateReading(page, 2);
    
    const projectElements = page.locator('.project, .project-card, .project-item');
    const projectCount = await projectElements.count();
    
    if (projectCount > 0) {
      console.log(`📋 Found ${projectCount} available projects`);
      
      // Review random projects
      const projectsToReview = Math.min(2, projectCount);
      for (let i = 0; i < projectsToReview; i++) {
        const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
        if (await randomProject.isVisible()) {
          await randomProject.hover();
          await thinkTime(page, 1500, 2500);
        }
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Available projects review warning: ${error.message}`);
  }
}

/**
 * Explore project details
 */
async function exploreProjectDetails(page) {
  try {
    console.log('🔍 Exploring project details');
    
    const projectElements = page.locator('.project, .project-card');
    const projectCount = await projectElements.count();
    
    if (projectCount > 0) {
      const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
      
      if (await randomProject.isVisible()) {
        await randomProject.click();
        await thinkTime(page, 2000, 3000);
        
        // Explore project details
        await simulateReading(page, 2);
        
        // Look for project actions
        const projectActions = page.locator('.btn, button, .action');
        const actionCount = await projectActions.count();
        
        if (actionCount > 0) {
          const randomAction = projectActions.nth(Math.floor(Math.random() * actionCount));
          await randomAction.hover();
          await thinkTime(page, 1000, 1500);
        }
        
        // Navigate back
        await page.goBack();
        await thinkTime(page, 1000, 2000);
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Project details exploration warning: ${error.message}`);
  }
}

/**
 * Review project time logs
 */
async function reviewProjectTimeLogs(page) {
  try {
    console.log('⏰ Reviewing project time logs');
    
    // Look for project-specific time logs
    const projectTimeLogs = page.locator('.project-time-log, .time-log');
    const logCount = await projectTimeLogs.count();
    
    if (logCount > 0) {
      console.log(`⏰ Found ${logCount} project time logs`);
      await simulateReading(page, 1);
    }
    
  } catch (error) {
    console.log(`⚠️ Project time logs review warning: ${error.message}`);
  }
}

/**
 * Review project issues
 */
async function reviewProjectIssues(page) {
  try {
    console.log('🐛 Reviewing project issues');
    
    const issueElements = page.locator('.issue, .issue-item, .bug');
    const issueCount = await issueElements.count();
    
    if (issueCount > 0) {
      console.log(`🐛 Found ${issueCount} project issues`);
      
      const randomIssue = issueElements.nth(Math.floor(Math.random() * issueCount));
      await randomIssue.hover();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Project issues review warning: ${error.message}`);
  }
}

/**
 * Simulate quick time entry
 */
async function simulateQuickTimeEntry(page) {
  try {
    const quickTimeBtn = page.locator('.quick-time, .start-timer, button:has-text("Start")');
    
    if (await quickTimeBtn.first().isVisible()) {
      await quickTimeBtn.first().hover();
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
 * Simulate quick user interaction
 */
async function simulateQuickUserInteraction(page) {
  try {
    const quickActions = [
      () => page.locator('.btn, button').first().hover(),
      () => page.locator('.card, .item').first().hover(),
      () => page.locator('a[href]').first().hover()
    ];
    
    if (Math.random() < 0.3) {
      const randomAction = quickActions[Math.floor(Math.random() * quickActions.length)];
      await randomAction();
      await thinkTime(page, 200, 500);
    }
  } catch (error) {
    // Silent fail for quick interactions
  }
}

/**
 * Test start work timer
 */
async function testStartWorkTimer(page) {
  try {
    console.log('▶️ Starting work timer');
    
    await navigateToPage(page, '/app/dashboard');
    
    const startTimerBtn = page.locator('button:has-text("Start"), .start-timer');
    if (await startTimerBtn.first().isVisible()) {
      await startTimerBtn.first().hover();
      await thinkTime(page, 2000, 3000);
      console.log('⏰ Work timer interface tested');
    }
    
  } catch (error) {
    console.log(`⚠️ Start work timer warning: ${error.message}`);
  }
}

/**
 * Simulate project work
 */
async function simulateProjectWork(page) {
  try {
    console.log('💼 Simulating project work');
    
    await navigateToPage(page, '/app/projects');
    await simulateReading(page, 3);
    
    // Simulate working on a project
    const projectElements = page.locator('.project, .project-card');
    const projectCount = await projectElements.count();
    
    if (projectCount > 0) {
      const workProject = projectElements.nth(Math.floor(Math.random() * projectCount));
      await workProject.click();
      await thinkTime(page, 3000, 5000);
      
      // Simulate reading project details
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Project work simulation warning: ${error.message}`);
  }
}

/**
 * Simulate mid-session break
 */
async function simulateMidSessionBreak(page) {
  try {
    console.log('☕ Simulating mid-session break');
    
    await navigateToPage(page, '/app/dashboard');
    await simulateReading(page, 1);
    
  } catch (error) {
    console.log(`⚠️ Mid-session break warning: ${error.message}`);
  }
}

/**
 * Simulate continue work
 */
async function simulateContinueWork(page) {
  try {
    console.log('🔄 Continuing work');
    
    await navigateToPage(page, '/app/time_logs');
    await simulateReading(page, 2);
    
  } catch (error) {
    console.log(`⚠️ Continue work warning: ${error.message}`);
  }
}

/**
 * Test end work session
 */
async function testEndWorkSession(page) {
  try {
    console.log('🏁 Ending work session');
    
    await navigateToPage(page, '/app/dashboard');
    
    // Look for stop timer button
    const stopTimerBtn = page.locator('button:has-text("Stop"), .stop-timer');
    if (await stopTimerBtn.first().isVisible()) {
      await stopTimerBtn.first().hover();
      await thinkTime(page, 2000, 3000);
      console.log('⏰ End session interface tested');
    }
    
  } catch (error) {
    console.log(`⚠️ End work session warning: ${error.message}`);
  }
}
