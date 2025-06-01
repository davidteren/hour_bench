// Navigation and Interaction Helper Functions for Production Load Testing
// Target: https://hour-bench.onrender.com/

const { PRODUCTION_BASE_URL } = require('./auth');

/**
 * Realistic think time between user actions
 */
async function thinkTime(page, minMs = 1000, maxMs = 3000) {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  console.log(`💭 Think time: ${delay}ms`);
  await page.waitForTimeout(delay);
}

/**
 * Navigate to a page with error handling and realistic delays
 */
async function navigateToPage(page, path, waitForSelector = null) {
  try {
    console.log(`🧭 Navigating to: ${path}`);
    
    await page.goto(`${PRODUCTION_BASE_URL}${path}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for specific element if provided
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, { timeout: 10000 });
    }
    
    // Realistic page load time
    await thinkTime(page, 500, 1500);
    
    console.log(`✅ Successfully navigated to: ${path}`);
    return true;
    
  } catch (error) {
    console.log(`❌ Navigation failed for ${path}: ${error.message}`);
    throw error;
  }
}

/**
 * Click element with realistic user behavior
 */
async function clickElement(page, selector, description = '') {
  try {
    console.log(`👆 Clicking: ${description || selector}`);
    
    // Wait for element to be visible and clickable
    const selectorString = typeof selector === 'string' ? selector : selector.toString();
    await page.waitForSelector(selectorString, { state: 'visible', timeout: 10000 });
    
    // Scroll element into view if needed
    await page.locator(selector).scrollIntoViewIfNeeded();
    
    // Small delay before clicking (realistic user behavior)
    await thinkTime(page, 200, 800);
    
    await page.click(selector);
    
    // Wait for any navigation or updates
    await page.waitForTimeout(500);
    
    console.log(`✅ Successfully clicked: ${description || selector}`);
    return true;
    
  } catch (error) {
    console.log(`❌ Click failed for ${selector}: ${error.message}`);
    throw error;
  }
}

/**
 * Fill form field with realistic typing behavior
 */
async function fillField(page, selector, value, description = '') {
  try {
    console.log(`⌨️ Filling field: ${description || selector} with "${value}"`);
    
    await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
    
    // Clear field first
    await page.fill(selector, '');
    
    // Type with realistic delay between characters
    await page.type(selector, value, { delay: Math.random() * 100 + 50 });
    
    // Small pause after typing
    await thinkTime(page, 300, 800);
    
    console.log(`✅ Successfully filled: ${description || selector}`);
    return true;
    
  } catch (error) {
    console.log(`❌ Fill failed for ${selector}: ${error.message}`);
    throw error;
  }
}

/**
 * Scroll page to simulate reading behavior
 */
async function simulateReading(page, scrolls = 3) {
  console.log(`📖 Simulating reading behavior with ${scrolls} scrolls`);
  
  for (let i = 0; i < scrolls; i++) {
    // Random scroll amount
    const scrollAmount = Math.floor(Math.random() * 500) + 200;
    
    await page.evaluate((amount) => {
      window.scrollBy(0, amount);
    }, scrollAmount);
    
    // Reading time
    await thinkTime(page, 1000, 3000);
  }
  
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await thinkTime(page, 500, 1000);
}

/**
 * Browse navigation menu items
 */
async function browseNavigation(page) {
  console.log('🧭 Browsing navigation menu');
  
  try {
    // Check if mobile menu button exists (responsive design)
    const mobileMenuButton = await page.locator('[data-controller="mobile-nav"]').first();
    const isMobileView = await mobileMenuButton.isVisible();
    
    if (isMobileView) {
      console.log('📱 Mobile view detected, using mobile navigation');
      await clickElement(page, '[data-controller="mobile-nav"]', 'Mobile menu button');
      await thinkTime(page, 500, 1000);
    }
    
    // Get available navigation links
    const navLinks = await page.locator('.nav-link, .mobile-nav-link').all();
    
    if (navLinks.length > 0) {
      // Randomly select 1-3 navigation items to browse
      const itemsToVisit = Math.floor(Math.random() * 3) + 1;
      const shuffledLinks = navLinks.sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < Math.min(itemsToVisit, shuffledLinks.length); i++) {
        try {
          const link = shuffledLinks[i];
          const href = await link.getAttribute('href');
          const text = await link.textContent();
          
          if (href && !href.includes('javascript:') && !href.includes('#')) {
            console.log(`🔗 Visiting navigation item: ${text}`);
            await link.click();
            await page.waitForLoadState('networkidle');
            await thinkTime(page, 2000, 4000);
          }
        } catch (error) {
          console.log(`⚠️ Skipping navigation item: ${error.message}`);
        }
      }
    }
    
    // Close mobile menu if it was opened
    if (isMobileView) {
      try {
        await clickElement(page, '[data-controller="mobile-nav"]', 'Close mobile menu');
      } catch (e) {
        // Menu might auto-close, that's okay
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Navigation browsing warning: ${error.message}`);
  }
}

/**
 * Interact with dashboard elements
 */
async function interactWithDashboard(page) {
  console.log('📊 Interacting with dashboard');
  
  try {
    // Wait for dashboard to load
    await page.waitForSelector('.dashboard, .stats, .recent-activity', { timeout: 10000 });
    
    // Simulate reading dashboard content
    await simulateReading(page, 2);
    
    // Look for interactive elements
    const interactiveElements = [
      '.btn', '.button', '.card', '.stat-card', 
      '[data-controller]', '.time-log-entry', '.project-link'
    ];
    
    for (const selector of interactiveElements) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          // Randomly interact with 1-2 elements
          const elementsToClick = Math.min(2, elements.length);
          for (let i = 0; i < elementsToClick; i++) {
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            const isVisible = await randomElement.isVisible();
            
            if (isVisible) {
              await randomElement.click();
              await thinkTime(page, 1000, 2000);
              break; // Only click one element per selector type
            }
          }
        }
      } catch (error) {
        // Continue if element interaction fails
        console.log(`⚠️ Dashboard interaction warning for ${selector}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Dashboard interaction warning: ${error.message}`);
  }
}

/**
 * Simulate time tracking workflow
 */
async function simulateTimeTracking(page) {
  console.log('⏰ Simulating time tracking workflow');
  
  try {
    // Navigate to time logs
    await navigateToPage(page, '/app/time_logs', '.time-log, .timer');
    
    // Look for start timer button or create new time log
    const startTimerBtn = page.locator('button:has-text("Start Timer"), .start-timer, [data-action*="timer"]');
    const newTimeLogBtn = page.locator('a:has-text("New Time Log"), .new-time-log');
    
    if (await startTimerBtn.first().isVisible()) {
      await clickElement(page, startTimerBtn.first(), 'Start Timer');
      await thinkTime(page, 2000, 5000); // Simulate working time
      
      // Stop timer if stop button exists
      const stopTimerBtn = page.locator('button:has-text("Stop"), .stop-timer');
      if (await stopTimerBtn.first().isVisible()) {
        await clickElement(page, stopTimerBtn.first(), 'Stop Timer');
      }
    } else if (await newTimeLogBtn.first().isVisible()) {
      await clickElement(page, newTimeLogBtn.first(), 'New Time Log');
      await thinkTime(page, 1000, 2000);
      
      // Fill time log form if present
      await fillTimeLogForm(page);
    }
    
    // Browse existing time logs
    await simulateReading(page, 2);
    
  } catch (error) {
    console.log(`⚠️ Time tracking simulation warning: ${error.message}`);
  }
}

/**
 * Fill time log form with realistic data
 */
async function fillTimeLogForm(page) {
  try {
    console.log('📝 Filling time log form');
    
    // Description field
    const descriptionField = page.locator('textarea[name*="description"], input[name*="description"]');
    if (await descriptionField.first().isVisible()) {
      const descriptions = [
        'Working on feature implementation',
        'Bug fixes and testing',
        'Client meeting and planning',
        'Code review and documentation',
        'Research and development'
      ];
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      await fillField(page, descriptionField.first(), randomDescription, 'Description');
    }
    
    // Duration or time fields
    const durationField = page.locator('input[name*="duration"], input[name*="minutes"]');
    if (await durationField.first().isVisible()) {
      const randomDuration = Math.floor(Math.random() * 480) + 15; // 15 minutes to 8 hours
      await fillField(page, durationField.first(), randomDuration.toString(), 'Duration');
    }
    
    // Project selection
    const projectSelect = page.locator('select[name*="project"], .project-select');
    if (await projectSelect.first().isVisible()) {
      const options = await projectSelect.first().locator('option').all();
      if (options.length > 1) {
        const randomOption = options[Math.floor(Math.random() * (options.length - 1)) + 1];
        const value = await randomOption.getAttribute('value');
        if (value) {
          await projectSelect.first().selectOption(value);
          await thinkTime(page, 500, 1000);
        }
      }
    }
    
    // Submit form
    const submitBtn = page.locator('input[type="submit"], button[type="submit"], .submit-btn');
    if (await submitBtn.first().isVisible()) {
      await clickElement(page, submitBtn.first(), 'Submit Time Log');
    }
    
  } catch (error) {
    console.log(`⚠️ Time log form filling warning: ${error.message}`);
  }
}

module.exports = {
  thinkTime,
  navigateToPage,
  clickElement,
  fillField,
  simulateReading,
  browseNavigation,
  interactWithDashboard,
  simulateTimeTracking,
  fillTimeLogForm
};
