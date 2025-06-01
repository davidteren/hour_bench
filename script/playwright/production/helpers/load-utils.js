// Load Testing Utilities for Production Playwright Tests
// Target: https://hour-bench.onrender.com/

const { thinkTime } = require('./navigation');

/**
 * Generate realistic user session duration (5-30 minutes)
 */
function generateSessionDuration() {
  const minMinutes = 5;
  const maxMinutes = 30;
  const minutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  return minutes * 60 * 1000; // Convert to milliseconds
}

/**
 * Generate realistic page view duration (10 seconds to 5 minutes)
 */
function generatePageViewDuration() {
  const minSeconds = 10;
  const maxSeconds = 300; // 5 minutes
  const seconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
  return seconds * 1000; // Convert to milliseconds
}

/**
 * Simulate realistic user browsing patterns
 */
async function simulateUserBrowsingPattern(page, userRole = 'user') {
  console.log(`🎭 Simulating ${userRole} browsing pattern`);
  
  const sessionDuration = generateSessionDuration();
  const sessionStart = Date.now();
  
  console.log(`⏱️ Session duration: ${Math.round(sessionDuration / 1000 / 60)} minutes`);
  
  const browsingPatterns = {
    system_admin: [
      '/app/dashboard',
      '/app/organizations',
      '/app/users',
      '/app/time_logs',
      '/app/projects'
    ],
    org_admin: [
      '/app/dashboard',
      '/app/users',
      '/app/clients',
      '/app/projects',
      '/app/time_logs'
    ],
    team_admin: [
      '/app/dashboard',
      '/app/projects',
      '/app/time_logs',
      '/app/clients'
    ],
    user: [
      '/app/dashboard',
      '/app/time_logs',
      '/app/projects'
    ],
    freelancer: [
      '/app/dashboard',
      '/app/time_logs'
    ]
  };
  
  const pages = browsingPatterns[userRole] || browsingPatterns.user;
  let pagesVisited = 0;
  
  while (Date.now() - sessionStart < sessionDuration && pagesVisited < 20) {
    try {
      // Select random page from user's available pages
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      
      console.log(`📄 Visiting page ${pagesVisited + 1}: ${randomPage}`);
      
      await page.goto(`https://hour-bench.onrender.com${randomPage}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // Simulate page interaction time
      const pageViewDuration = generatePageViewDuration();
      console.log(`👀 Viewing page for ${Math.round(pageViewDuration / 1000)} seconds`);
      
      // Simulate realistic page interactions
      await simulatePageInteractions(page, Math.min(pageViewDuration, 60000)); // Max 1 minute per page
      
      pagesVisited++;
      
      // Random chance to end session early (realistic user behavior)
      if (Math.random() < 0.1 && pagesVisited >= 3) {
        console.log('🚪 User decided to end session early');
        break;
      }
      
    } catch (error) {
      console.log(`⚠️ Page visit error: ${error.message}`);
      // Continue with next page
    }
  }
  
  console.log(`✅ Session completed. Pages visited: ${pagesVisited}, Duration: ${Math.round((Date.now() - sessionStart) / 1000 / 60)} minutes`);
}

/**
 * Simulate interactions on a page for a given duration
 */
async function simulatePageInteractions(page, duration) {
  const startTime = Date.now();
  const interactions = [];
  
  // Collect available interactive elements
  try {
    const buttons = await page.locator('button, .btn, input[type="submit"]').all();
    const links = await page.locator('a[href]:not([href="#"]):not([href="javascript:void(0)"])').all();
    const forms = await page.locator('form').all();
    
    interactions.push(...buttons.map(el => ({ type: 'click', element: el, weight: 3 })));
    interactions.push(...links.map(el => ({ type: 'click', element: el, weight: 2 })));
    interactions.push(...forms.map(el => ({ type: 'form', element: el, weight: 1 })));
  } catch (error) {
    console.log(`⚠️ Error collecting interactions: ${error.message}`);
  }
  
  // Perform random interactions within the time limit
  while (Date.now() - startTime < duration) {
    try {
      // Scroll and read content
      await simulateScrolling(page);
      await thinkTime(page, 2000, 5000);
      
      // Random chance to interact with elements
      if (interactions.length > 0 && Math.random() < 0.3) {
        const randomInteraction = interactions[Math.floor(Math.random() * interactions.length)];
        
        try {
          const isVisible = await randomInteraction.element.isVisible();
          if (isVisible) {
            if (randomInteraction.type === 'click') {
              await randomInteraction.element.click();
              console.log('🖱️ Clicked interactive element');
              await thinkTime(page, 1000, 3000);
            }
          }
        } catch (interactionError) {
          // Continue if interaction fails
          console.log(`⚠️ Interaction failed: ${interactionError.message}`);
        }
      }
      
      // Break if we've spent enough time
      if (Date.now() - startTime >= duration * 0.8) {
        break;
      }
      
    } catch (error) {
      console.log(`⚠️ Page interaction error: ${error.message}`);
      break;
    }
  }
}

/**
 * Simulate realistic scrolling behavior
 */
async function simulateScrolling(page) {
  try {
    const scrollActions = Math.floor(Math.random() * 5) + 1; // 1-5 scroll actions
    
    for (let i = 0; i < scrollActions; i++) {
      const scrollDirection = Math.random() > 0.8 ? -1 : 1; // Mostly scroll down
      const scrollAmount = (Math.random() * 300 + 100) * scrollDirection;
      
      await page.evaluate((amount) => {
        window.scrollBy(0, amount);
      }, scrollAmount);
      
      await thinkTime(page, 500, 1500);
    }
  } catch (error) {
    console.log(`⚠️ Scrolling error: ${error.message}`);
  }
}

/**
 * Monitor page performance and errors
 */
async function setupPerformanceMonitoring(page) {
  // Monitor console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`🔴 Console Error: ${msg.text()}`);
    }
  });
  
  // Monitor page errors
  page.on('pageerror', error => {
    console.log(`🔴 Page Error: ${error.message}`);
  });
  
  // Monitor failed requests
  page.on('requestfailed', request => {
    console.log(`🔴 Request Failed: ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  // Monitor slow responses
  const responseStartTimes = new Map();

  page.on('request', request => {
    responseStartTimes.set(request.url(), Date.now());
  });

  page.on('response', response => {
    const url = response.url();
    const status = response.status();

    if (status >= 400) {
      console.log(`⚠️ HTTP ${status}: ${url}`);
    }

    // Log slow responses (>5 seconds)
    const startTime = responseStartTimes.get(url);
    if (startTime) {
      const responseTime = Date.now() - startTime;
      if (responseTime > 5000) {
        console.log(`🐌 Slow Response (${responseTime}ms): ${url}`);
      }
      responseStartTimes.delete(url);
    }
  });
}

/**
 * Generate load testing report data
 */
function generateLoadTestReport(testResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: testResults.length,
      successful: testResults.filter(r => r.success).length,
      failed: testResults.filter(r => !r.success).length,
      averageDuration: testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length
    },
    details: testResults,
    recommendations: []
  };
  
  // Add recommendations based on results
  const failureRate = report.summary.failed / report.summary.totalTests;
  if (failureRate > 0.1) {
    report.recommendations.push('High failure rate detected. Consider reducing concurrent users or investigating server capacity.');
  }
  
  if (report.summary.averageDuration > 30000) {
    report.recommendations.push('Average response time is high. Monitor AppSignal for performance bottlenecks.');
  }
  
  return report;
}

/**
 * Staggered user ramp-up for load testing
 */
async function staggeredUserRampUp(userCount, rampUpDurationMs = 60000) {
  const delayBetweenUsers = rampUpDurationMs / userCount;
  console.log(`🚀 Ramping up ${userCount} users over ${rampUpDurationMs / 1000} seconds`);
  console.log(`⏱️ Delay between users: ${Math.round(delayBetweenUsers)}ms`);
  
  const userPromises = [];
  
  for (let i = 0; i < userCount; i++) {
    // Delay before starting each user
    await new Promise(resolve => setTimeout(resolve, delayBetweenUsers));
    
    console.log(`👤 Starting user ${i + 1}/${userCount}`);
    
    // Return timing info for this user start
    userPromises.push({
      userIndex: i,
      startTime: Date.now(),
      delay: delayBetweenUsers * i
    });
  }
  
  return userPromises;
}

/**
 * Rate limiting helper
 */
async function respectRateLimit(page, response) {
  if (response && response.status() === 429) {
    console.log('⚠️ Rate limit hit, waiting before retry...');
    const retryAfter = response.headers()['retry-after'];
    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000; // Default 5 seconds
    await page.waitForTimeout(waitTime);
    return true;
  }
  return false;
}

module.exports = {
  generateSessionDuration,
  generatePageViewDuration,
  simulateUserBrowsingPattern,
  simulatePageInteractions,
  simulateScrolling,
  setupPerformanceMonitoring,
  generateLoadTestReport,
  staggeredUserRampUp,
  respectRateLimit
};
