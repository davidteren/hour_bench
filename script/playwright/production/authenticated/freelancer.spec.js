// Freelancer Load Testing for Production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');
const { 
  loginAsFreelancer, 
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

test.describe('Freelancer Load Testing', () => {
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

  test('should simulate freelancer comprehensive workflow', async ({ page }) => {
    console.log('🆓 Starting freelancer comprehensive workflow simulation');
    
    await loginAsFreelancer(page);
    
    await expect(page).toHaveURL(`${PRODUCTION_BASE_URL}/`);
    await page.waitForSelector('.navbar-brand', { timeout: 10000 });
    
    console.log('✅ Freelancer logged in successfully');
    
    await simulateFreelancerWorkflow(page);
    
    console.log('✅ Freelancer workflow completed');
  });

  test('should test freelancer time tracking intensive workflow', async ({ page }) => {
    console.log('⏰ Testing freelancer time tracking intensive workflow');
    
    await loginAsFreelancer(page);
    
    // Freelancers primarily focus on time tracking
    const timeTrackingTasks = [
      {
        name: 'Dashboard Timer Check',
        action: async () => {
          await navigateToPage(page, '/app/dashboard');
          await checkFreelancerTimers(page);
        }
      },
      {
        name: 'Personal Time Logs Review',
        action: async () => {
          await navigateToPage(page, '/app/time_logs');
          await reviewFreelancerTimeLogs(page);
        }
      },
      {
        name: 'Time Entry Creation',
        action: async () => {
          await testFreelancerTimeEntry(page);
        }
      },
      {
        name: 'Work Session Simulation',
        action: async () => {
          await simulateFreelancerWorkSession(page);
        }
      },
      {
        name: 'Time Log Analysis',
        action: async () => {
          await analyzeFreelancerTimeLogs(page);
        }
      }
    ];
    
    for (const task of timeTrackingTasks) {
      try {
        console.log(`⏰ Freelancer Time Tracking: ${task.name}`);
        await task.action();
        await thinkTime(page, 2000, 4000);
      } catch (error) {
        console.log(`⚠️ Time tracking task "${task.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Freelancer time tracking intensive workflow completed');
  });

  test('should test freelancer limited access scenarios', async ({ page }) => {
    console.log('🔒 Testing freelancer limited access scenarios');
    
    await loginAsFreelancer(page);
    
    // Test what freelancers can and cannot access
    const accessTests = [
      {
        name: 'Dashboard Access',
        path: '/app/dashboard',
        expectAccess: true
      },
      {
        name: 'Time Logs Access',
        path: '/app/time_logs',
        expectAccess: true
      },
      {
        name: 'Projects Access',
        path: '/app/projects',
        expectAccess: false // Freelancers might have limited project access
      },
      {
        name: 'Users Access',
        path: '/app/users',
        expectAccess: false // Freelancers shouldn't see other users
      },
      {
        name: 'Organizations Access',
        path: '/app/organizations',
        expectAccess: false // Freelancers shouldn't access organizations
      }
    ];
    
    for (const accessTest of accessTests) {
      try {
        console.log(`🔒 Testing ${accessTest.name}`);
        await testFreelancerAccess(page, accessTest.path, accessTest.expectAccess);
        await thinkTime(page, 1000, 2000);
      } catch (error) {
        console.log(`⚠️ Access test "${accessTest.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Freelancer access scenarios testing completed');
  });

  test('should simulate freelancer daily work routine', async ({ page }) => {
    console.log('📅 Simulating freelancer daily work routine');
    
    await loginAsFreelancer(page);
    
    const dailyRoutine = [
      {
        name: 'Morning Check-in',
        duration: 2000,
        action: async () => {
          await navigateToPage(page, '/app/dashboard');
          await performMorningCheckin(page);
        }
      },
      {
        name: 'Review Previous Day',
        duration: 3000,
        action: async () => {
          await navigateToPage(page, '/app/time_logs');
          await reviewPreviousDay(page);
        }
      },
      {
        name: 'Start Work Session',
        duration: 2000,
        action: async () => {
          await startFreelancerWorkSession(page);
        }
      },
      {
        name: 'Mid-day Progress Check',
        duration: 1500,
        action: async () => {
          await performMidDayCheck(page);
        }
      },
      {
        name: 'Afternoon Work',
        duration: 4000,
        action: async () => {
          await simulateAfternoonWork(page);
        }
      },
      {
        name: 'End of Day Summary',
        duration: 2000,
        action: async () => {
          await performEndOfDaySummary(page);
        }
      }
    ];
    
    for (const routine of dailyRoutine) {
      try {
        console.log(`📅 Daily Routine: ${routine.name}`);
        await routine.action();
        await thinkTime(page, routine.duration, routine.duration + 1000);
      } catch (error) {
        console.log(`⚠️ Daily routine "${routine.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Freelancer daily work routine simulation completed');
  });

  test('should test freelancer high-frequency operations', async ({ page }) => {
    console.log('⚡ Testing freelancer high-frequency operations');
    
    await loginAsFreelancer(page);
    
    // Freelancers typically have simpler, more focused operations
    const operations = [
      () => navigateToPage(page, '/app/dashboard'),
      () => navigateToPage(page, '/app/time_logs'),
      () => simulateQuickTimeCheck(page),
      () => simulateQuickDashboardCheck(page)
    ];
    
    const operationCount = 12;
    
    for (let i = 0; i < operationCount; i++) {
      try {
        console.log(`🔄 Freelancer operation ${i + 1}/${operationCount}`);
        
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];
        await randomOperation();
        
        // Quick freelancer interaction
        await simulateQuickFreelancerInteraction(page);
        
        await thinkTime(page, 800, 2000);
        
      } catch (error) {
        console.log(`⚠️ High-frequency operation ${i + 1} warning: ${error.message}`);
      }
    }
    
    console.log('✅ High-frequency operations testing completed');
  });

  test('should simulate freelancer project-focused work session', async ({ page }) => {
    console.log('💼 Simulating freelancer project-focused work session');
    
    await loginAsFreelancer(page);
    
    const projectWorkSession = [
      {
        name: 'Project Selection',
        action: async () => {
          await selectFreelancerProject(page);
        }
      },
      {
        name: 'Work Planning',
        action: async () => {
          await planFreelancerWork(page);
        }
      },
      {
        name: 'Focused Work Time',
        action: async () => {
          await simulateFocusedWork(page);
        }
      },
      {
        name: 'Progress Documentation',
        action: async () => {
          await documentProgress(page);
        }
      },
      {
        name: 'Session Wrap-up',
        action: async () => {
          await wrapUpWorkSession(page);
        }
      }
    ];
    
    for (const session of projectWorkSession) {
      try {
        console.log(`💼 Project Work: ${session.name}`);
        await session.action();
        await thinkTime(page, 3000, 5000);
      } catch (error) {
        console.log(`⚠️ Project work session "${session.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Project-focused work session simulation completed');
  });
});

/**
 * Simulate comprehensive freelancer workflow
 */
async function simulateFreelancerWorkflow(page) {
  console.log('🆓 Simulating freelancer workflow');
  
  const workflow = [
    {
      name: 'Dashboard Overview',
      action: async () => {
        await interactWithDashboard(page);
        await simulateReading(page, 2);
      }
    },
    {
      name: 'Personal Time Management',
      action: async () => {
        await navigateToPage(page, '/app/time_logs');
        await reviewFreelancerTimeLogs(page);
      }
    },
    {
      name: 'Work Session Tracking',
      action: async () => {
        await simulateTimeTracking(page);
      }
    }
  ];
  
  for (const step of workflow) {
    try {
      console.log(`📋 Freelancer Workflow: ${step.name}`);
      await step.action();
      await thinkTime(page, 2000, 4000);
    } catch (error) {
      console.log(`⚠️ Workflow step "${step.name}" warning: ${error.message}`);
    }
  }
}

/**
 * Check freelancer timers
 */
async function checkFreelancerTimers(page) {
  try {
    console.log('⏰ Checking freelancer timers');
    
    const timerElements = page.locator('.timer, .running-timer, .active-timer');
    const timerCount = await timerElements.count();
    
    if (timerCount > 0) {
      console.log(`⏰ Found ${timerCount} timer elements`);
      
      // Interact with timers
      const randomTimer = timerElements.nth(Math.floor(Math.random() * timerCount));
      await randomTimer.hover();
      await thinkTime(page, 1500, 2500);
    } else {
      console.log('⏰ No active timers found');
    }
    
    // Look for start timer options
    const startTimerBtn = page.locator('button:has-text("Start"), .start-timer');
    if (await startTimerBtn.first().isVisible()) {
      await startTimerBtn.first().hover();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Freelancer timer check warning: ${error.message}`);
  }
}

/**
 * Review freelancer time logs
 */
async function reviewFreelancerTimeLogs(page) {
  try {
    console.log('📊 Reviewing freelancer time logs');
    
    await simulateReading(page, 3);
    
    const timeLogElements = page.locator('.time-log, .time-log-row');
    const logCount = await timeLogElements.count();
    
    if (logCount > 0) {
      console.log(`📊 Found ${logCount} freelancer time logs`);
      
      // Review multiple time logs
      const logsToReview = Math.min(5, logCount);
      for (let i = 0; i < logsToReview; i++) {
        const randomLog = timeLogElements.nth(Math.floor(Math.random() * logCount));
        if (await randomLog.isVisible()) {
          await randomLog.hover();
          await thinkTime(page, 1000, 1500);
        }
      }
    }
    
    // Look for time log totals or summaries
    const summaryElements = page.locator('.total, .summary, .hours-total');
    if (await summaryElements.first().isVisible()) {
      await summaryElements.first().hover();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Freelancer time logs review warning: ${error.message}`);
  }
}

/**
 * Test freelancer time entry
 */
async function testFreelancerTimeEntry(page) {
  try {
    console.log('📝 Testing freelancer time entry');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Look for new time log button
    const newTimeLogBtn = page.locator('a:has-text("New Time Log"), .new-time-log');
    
    if (await newTimeLogBtn.first().isVisible()) {
      await newTimeLogBtn.first().hover();
      await thinkTime(page, 1500, 2500);
      
      console.log('📝 New time log interface tested (hover only)');
    }
    
  } catch (error) {
    console.log(`⚠️ Freelancer time entry test warning: ${error.message}`);
  }
}

/**
 * Simulate freelancer work session
 */
async function simulateFreelancerWorkSession(page) {
  try {
    console.log('💼 Simulating freelancer work session');
    
    await navigateToPage(page, '/app/dashboard');
    
    // Simulate starting work
    const workElements = page.locator('.start-work, .begin-session, button:has-text("Start")');
    if (await workElements.first().isVisible()) {
      await workElements.first().hover();
      await thinkTime(page, 2000, 3000);
    }
    
    // Simulate work progress check
    await navigateToPage(page, '/app/time_logs');
    await simulateReading(page, 2);
    
  } catch (error) {
    console.log(`⚠️ Freelancer work session warning: ${error.message}`);
  }
}

/**
 * Analyze freelancer time logs
 */
async function analyzeFreelancerTimeLogs(page) {
  try {
    console.log('📈 Analyzing freelancer time logs');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Look for analysis or reporting features
    const analysisElements = page.locator('.analysis, .report, .summary, .stats');
    const analysisCount = await analysisElements.count();
    
    if (analysisCount > 0) {
      console.log(`📈 Found ${analysisCount} analysis elements`);
      
      const randomAnalysis = analysisElements.nth(Math.floor(Math.random() * analysisCount));
      await randomAnalysis.hover();
      await thinkTime(page, 1500, 2500);
    }
    
    // Look for filters or date ranges
    const filterElements = page.locator('.filter, .date-range, select');
    if (await filterElements.first().isVisible()) {
      await filterElements.first().focus();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Freelancer time log analysis warning: ${error.message}`);
  }
}

/**
 * Test freelancer access to different areas
 */
async function testFreelancerAccess(page, path, expectAccess) {
  try {
    console.log(`🔒 Testing freelancer access to: ${path}`);
    
    await page.goto(`${PRODUCTION_BASE_URL}${path}`, {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    // Check if access was granted or denied
    const currentUrl = page.url();
    const hasAccess = currentUrl.includes(path);
    
    if (expectAccess && hasAccess) {
      console.log(`✅ Freelancer has expected access to ${path}`);
      await simulateReading(page, 1);
    } else if (!expectAccess && !hasAccess) {
      console.log(`✅ Freelancer correctly denied access to ${path}`);
    } else if (expectAccess && !hasAccess) {
      console.log(`⚠️ Freelancer unexpectedly denied access to ${path}`);
    } else {
      console.log(`⚠️ Freelancer unexpectedly granted access to ${path}`);
    }
    
  } catch (error) {
    console.log(`⚠️ Freelancer access test warning for ${path}: ${error.message}`);
  }
}

/**
 * Perform morning check-in
 */
async function performMorningCheckin(page) {
  try {
    console.log('🌅 Performing morning check-in');
    
    await simulateReading(page, 2);
    
    // Check dashboard for any updates
    const dashboardElements = page.locator('.dashboard, .summary, .overview');
    const elementCount = await dashboardElements.count();
    
    if (elementCount > 0) {
      console.log(`🌅 Found ${elementCount} dashboard elements`);
      await simulateReading(page, 1);
    }
    
  } catch (error) {
    console.log(`⚠️ Morning check-in warning: ${error.message}`);
  }
}

/**
 * Review previous day
 */
async function reviewPreviousDay(page) {
  try {
    console.log('📅 Reviewing previous day');
    
    // Look for recent time logs
    const recentLogs = page.locator('.recent, .yesterday, .time-log');
    const logCount = await recentLogs.count();
    
    if (logCount > 0) {
      console.log(`📅 Found ${logCount} recent logs`);
      await simulateReading(page, 2);
    }
    
  } catch (error) {
    console.log(`⚠️ Previous day review warning: ${error.message}`);
  }
}

/**
 * Start freelancer work session
 */
async function startFreelancerWorkSession(page) {
  try {
    console.log('▶️ Starting freelancer work session');
    
    await navigateToPage(page, '/app/dashboard');
    
    // Look for session start options
    const startOptions = page.locator('.start-session, .begin-work, button:has-text("Start")');
    if (await startOptions.first().isVisible()) {
      await startOptions.first().hover();
      await thinkTime(page, 2000, 3000);
    }
    
  } catch (error) {
    console.log(`⚠️ Start work session warning: ${error.message}`);
  }
}

/**
 * Perform mid-day check
 */
async function performMidDayCheck(page) {
  try {
    console.log('🕐 Performing mid-day check');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Check current progress
    const progressElements = page.locator('.progress, .current, .today');
    if (await progressElements.first().isVisible()) {
      await progressElements.first().hover();
      await thinkTime(page, 1000, 1500);
    }
    
  } catch (error) {
    console.log(`⚠️ Mid-day check warning: ${error.message}`);
  }
}

/**
 * Simulate afternoon work
 */
async function simulateAfternoonWork(page) {
  try {
    console.log('🌇 Simulating afternoon work');
    
    // Continue work session
    await navigateToPage(page, '/app/dashboard');
    await simulateReading(page, 1);
    
    // Check time logs
    await navigateToPage(page, '/app/time_logs');
    await simulateReading(page, 2);
    
  } catch (error) {
    console.log(`⚠️ Afternoon work warning: ${error.message}`);
  }
}

/**
 * Perform end of day summary
 */
async function performEndOfDaySummary(page) {
  try {
    console.log('🌙 Performing end of day summary');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Review day's work
    const summaryElements = page.locator('.summary, .total, .day-total');
    if (await summaryElements.first().isVisible()) {
      await summaryElements.first().hover();
      await thinkTime(page, 2000, 3000);
    }
    
  } catch (error) {
    console.log(`⚠️ End of day summary warning: ${error.message}`);
  }
}

/**
 * Select freelancer project
 */
async function selectFreelancerProject(page) {
  try {
    console.log('📋 Selecting freelancer project');
    
    // Freelancers might have limited project access
    try {
      await navigateToPage(page, '/app/projects');
      
      const projectElements = page.locator('.project, .project-card');
      const projectCount = await projectElements.count();
      
      if (projectCount > 0) {
        const randomProject = projectElements.nth(Math.floor(Math.random() * projectCount));
        await randomProject.hover();
        await thinkTime(page, 1500, 2500);
      }
    } catch (error) {
      console.log('📋 Projects not accessible, using dashboard');
      await navigateToPage(page, '/app/dashboard');
    }
    
  } catch (error) {
    console.log(`⚠️ Project selection warning: ${error.message}`);
  }
}

/**
 * Plan freelancer work
 */
async function planFreelancerWork(page) {
  try {
    console.log('📝 Planning freelancer work');
    
    await navigateToPage(page, '/app/dashboard');
    await simulateReading(page, 2);
    
  } catch (error) {
    console.log(`⚠️ Work planning warning: ${error.message}`);
  }
}

/**
 * Simulate focused work
 */
async function simulateFocusedWork(page) {
  try {
    console.log('🎯 Simulating focused work');
    
    // Simulate extended work period
    await navigateToPage(page, '/app/time_logs');
    await simulateReading(page, 3);
    
    // Check timer status
    const timerElements = page.locator('.timer, .running');
    if (await timerElements.first().isVisible()) {
      await timerElements.first().hover();
      await thinkTime(page, 2000, 3000);
    }
    
  } catch (error) {
    console.log(`⚠️ Focused work warning: ${error.message}`);
  }
}

/**
 * Document progress
 */
async function documentProgress(page) {
  try {
    console.log('📄 Documenting progress');
    
    await navigateToPage(page, '/app/time_logs');
    
    // Look for documentation options
    const docElements = page.locator('.notes, .description, .comments');
    if (await docElements.first().isVisible()) {
      await docElements.first().hover();
      await thinkTime(page, 1500, 2500);
    }
    
  } catch (error) {
    console.log(`⚠️ Progress documentation warning: ${error.message}`);
  }
}

/**
 * Wrap up work session
 */
async function wrapUpWorkSession(page) {
  try {
    console.log('🏁 Wrapping up work session');
    
    await navigateToPage(page, '/app/dashboard');
    
    // Look for session end options
    const endOptions = page.locator('.end-session, .stop, button:has-text("Stop")');
    if (await endOptions.first().isVisible()) {
      await endOptions.first().hover();
      await thinkTime(page, 2000, 3000);
    }
    
  } catch (error) {
    console.log(`⚠️ Work session wrap-up warning: ${error.message}`);
  }
}

/**
 * Simulate quick time check
 */
async function simulateQuickTimeCheck(page) {
  try {
    const timeElements = page.locator('.time, .timer, .duration');
    const timeCount = await timeElements.count();
    
    if (timeCount > 0) {
      const randomTime = timeElements.nth(Math.floor(Math.random() * timeCount));
      await randomTime.hover();
      await thinkTime(page, 500, 1000);
    }
  } catch (error) {
    // Silent fail for quick operations
  }
}

/**
 * Simulate quick dashboard check
 */
async function simulateQuickDashboardCheck(page) {
  try {
    const dashboardElements = page.locator('.dashboard, .summary, .stat');
    const elementCount = await dashboardElements.count();
    
    if (elementCount > 0) {
      const randomElement = dashboardElements.nth(Math.floor(Math.random() * elementCount));
      await randomElement.hover();
      await thinkTime(page, 500, 1000);
    }
  } catch (error) {
    // Silent fail for quick operations
  }
}

/**
 * Simulate quick freelancer interaction
 */
async function simulateQuickFreelancerInteraction(page) {
  try {
    const quickActions = [
      () => page.locator('.btn, button').first().hover(),
      () => page.locator('.time-log, .timer').first().hover(),
      () => page.locator('.stat, .summary').first().hover()
    ];
    
    if (Math.random() < 0.3) {
      const randomAction = quickActions[Math.floor(Math.random() * quickActions.length)];
      await randomAction();
      await thinkTime(page, 300, 800);
    }
  } catch (error) {
    // Silent fail for quick interactions
  }
}
