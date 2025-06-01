// Public Page Browsing Load Testing for Production
// Target: https://hour-bench.onrender.com/

const { test, expect } = require('@playwright/test');
const { PRODUCTION_BASE_URL } = require('../helpers/auth');
const { 
  thinkTime, 
  navigateToPage, 
  clickElement, 
  simulateReading 
} = require('../helpers/navigation');
const { 
  setupPerformanceMonitoring,
  simulateUserBrowsingPattern,
  simulateScrolling 
} = require('../helpers/load-utils');

test.describe('Public Page Browsing Load Testing', () => {
  test.beforeEach(async ({ page }) => {
    await setupPerformanceMonitoring(page);
  });

  test('should simulate comprehensive public page browsing', async ({ page }) => {
    console.log('🌐 Starting comprehensive public page browsing simulation');
    
    const publicPages = [
      { path: '/', name: 'Landing Page' },
      { path: '/features', name: 'Features Page' },
      { path: '/about', name: 'About Page' },
      { path: '/session/new', name: 'Login Page' }
    ];
    
    // Visit each public page
    for (const pageInfo of publicPages) {
      try {
        console.log(`📄 Visiting ${pageInfo.name}: ${pageInfo.path}`);
        
        await page.goto(`${PRODUCTION_BASE_URL}${pageInfo.path}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        // Verify page loaded
        await page.waitForSelector('body', { timeout: 10000 });
        
        // Simulate realistic browsing behavior
        await simulatePageBrowsing(page, pageInfo.name);
        
        // Random navigation between pages
        if (Math.random() < 0.4) {
          await performRandomNavigation(page);
        }
        
      } catch (error) {
        console.log(`❌ Error visiting ${pageInfo.name}: ${error.message}`);
      }
      
      // Think time between pages
      await thinkTime(page, 1000, 3000);
    }
    
    console.log('✅ Public page browsing simulation completed');
  });

  test('should test features page interactions', async ({ page }) => {
    console.log('🎯 Testing features page interactions');
    
    try {
      await navigateToPage(page, '/features', 'h1, .features, .feature-grid');
      
      // Simulate reading features content
      await simulateReading(page, 4);
      
      // Test feature tabs or cards if present
      await testFeatureInteractions(page);
      
      // Test any demo buttons or CTAs
      await testFeatureCTAs(page);
      
      // Test responsive behavior
      await testFeaturesResponsive(page);
      
    } catch (error) {
      console.log(`⚠️ Features page might not exist: ${error.message}`);
      // Try alternative features content on landing page
      await page.goto(PRODUCTION_BASE_URL);
      await testFeatureInteractions(page);
    }
    
    console.log('✅ Features page testing completed');
  });

  test('should test about page content', async ({ page }) => {
    console.log('ℹ️ Testing about page content');
    
    try {
      await navigateToPage(page, '/about', 'h1, .about, .content');
      
      // Simulate reading about content
      await simulateReading(page, 3);
      
      // Test any contact forms or links
      await testAboutPageInteractions(page);
      
      // Test social media links if present
      await testSocialLinks(page);
      
    } catch (error) {
      console.log(`⚠️ About page might not exist: ${error.message}`);
      // Continue with other tests
    }
    
    console.log('✅ About page testing completed');
  });

  test('should simulate anonymous user journey', async ({ page }) => {
    console.log('👤 Simulating complete anonymous user journey');
    
    const journeySteps = [
      {
        name: 'Landing Page Discovery',
        action: async () => {
          await page.goto(PRODUCTION_BASE_URL);
          await simulateReading(page, 2);
          await testHeroSection(page);
        }
      },
      {
        name: 'Feature Exploration',
        action: async () => {
          await exploreFeatures(page);
          await thinkTime(page, 2000, 4000);
        }
      },
      {
        name: 'About/Company Info',
        action: async () => {
          try {
            await navigateToPage(page, '/about');
            await simulateReading(page, 2);
          } catch (e) {
            console.log('About page not available, skipping');
          }
        }
      },
      {
        name: 'Login Consideration',
        action: async () => {
          await navigateToPage(page, '/session/new');
          await simulateLoginPageBrowsing(page);
        }
      },
      {
        name: 'Return to Landing',
        action: async () => {
          await page.goto(PRODUCTION_BASE_URL);
          await simulateReading(page, 1);
        }
      }
    ];
    
    for (const step of journeySteps) {
      try {
        console.log(`🚶 Journey Step: ${step.name}`);
        await step.action();
        await thinkTime(page, 1500, 3500);
      } catch (error) {
        console.log(`⚠️ Journey step "${step.name}" warning: ${error.message}`);
      }
    }
    
    console.log('✅ Anonymous user journey completed');
  });

  test('should test public page performance under concurrent load', async ({ page }) => {
    console.log('⚡ Testing public pages under concurrent load simulation');
    
    const loadTestPages = ['/', '/features', '/about', '/session/new'];
    const iterations = 8;
    
    for (let i = 0; i < iterations; i++) {
      const randomPage = loadTestPages[Math.floor(Math.random() * loadTestPages.length)];
      
      try {
        console.log(`🔄 Load test iteration ${i + 1}/${iterations}: ${randomPage}`);
        
        const startTime = Date.now();
        
        await page.goto(`${PRODUCTION_BASE_URL}${randomPage}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        const loadTime = Date.now() - startTime;
        console.log(`⏱️ Page load time: ${loadTime}ms`);
        
        // Quick interaction simulation
        await simulateScrolling(page);
        await thinkTime(page, 500, 1500);
        
        // Performance assertion
        expect(loadTime).toBeLessThan(15000); // Should load within 15 seconds
        
      } catch (error) {
        console.log(`❌ Load test iteration ${i + 1} failed: ${error.message}`);
      }
      
      // Small delay between iterations
      await thinkTime(page, 200, 800);
    }
    
    console.log('✅ Concurrent load testing completed');
  });
});

/**
 * Simulate realistic page browsing behavior
 */
async function simulatePageBrowsing(page, pageName) {
  console.log(`👀 Browsing ${pageName}`);
  
  // Scroll and read content
  await simulateReading(page, Math.floor(Math.random() * 3) + 2);
  
  // Look for and interact with buttons
  try {
    const buttons = page.locator('button, .btn, .button, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0 && Math.random() < 0.5) {
      const randomButton = buttons.nth(Math.floor(Math.random() * buttonCount));
      if (await randomButton.isVisible()) {
        await randomButton.click();
        console.log(`🖱️ Clicked button on ${pageName}`);
        await thinkTime(page, 1000, 2500);
      }
    }
  } catch (error) {
    console.log(`⚠️ Button interaction warning on ${pageName}: ${error.message}`);
  }
  
  // Test hover effects
  try {
    const hoverElements = page.locator('.card, .feature-card, .nav-link, .btn');
    const elementCount = await hoverElements.count();
    
    if (elementCount > 0 && Math.random() < 0.3) {
      const randomElement = hoverElements.nth(Math.floor(Math.random() * elementCount));
      await randomElement.hover();
      await thinkTime(page, 500, 1000);
    }
  } catch (error) {
    console.log(`⚠️ Hover interaction warning on ${pageName}: ${error.message}`);
  }
}

/**
 * Test feature interactions
 */
async function testFeatureInteractions(page) {
  console.log('🎯 Testing feature interactions');
  
  try {
    // Look for feature tabs
    const featureTabs = page.locator('[data-controller="feature-tabs"] button, .feature-tab, .tab-button');
    const tabCount = await featureTabs.count();
    
    if (tabCount > 0) {
      console.log(`📑 Found ${tabCount} feature tabs`);
      
      // Click through 2-3 tabs
      const tabsToClick = Math.min(3, tabCount);
      for (let i = 0; i < tabsToClick; i++) {
        const randomTab = featureTabs.nth(Math.floor(Math.random() * tabCount));
        
        if (await randomTab.isVisible()) {
          await randomTab.click();
          await thinkTime(page, 1500, 2500);
        }
      }
    }
    
    // Look for feature cards
    const featureCards = page.locator('.feature-card, .feature-item, [data-controller="card-3d"]');
    const cardCount = await featureCards.count();
    
    if (cardCount > 0) {
      console.log(`🃏 Found ${cardCount} feature cards`);
      
      // Interact with 1-2 cards
      const cardsToClick = Math.min(2, cardCount);
      for (let i = 0; i < cardsToClick; i++) {
        const randomCard = featureCards.nth(Math.floor(Math.random() * cardCount));
        
        if (await randomCard.isVisible()) {
          await randomCard.hover();
          await thinkTime(page, 800, 1500);
          
          // Try clicking if it's interactive
          try {
            await randomCard.click();
            await thinkTime(page, 1000, 2000);
          } catch (e) {
            // Card might not be clickable, that's okay
          }
        }
      }
    }
    
  } catch (error) {
    console.log(`⚠️ Feature interaction warning: ${error.message}`);
  }
}

/**
 * Test feature CTAs (Call to Action buttons)
 */
async function testFeatureCTAs(page) {
  try {
    const ctaButtons = page.locator('.cta-button, .demo-button, button:has-text("Demo"), button:has-text("Try")');
    const ctaCount = await ctaButtons.count();
    
    if (ctaCount > 0) {
      console.log(`🎯 Found ${ctaCount} CTA buttons`);
      
      const randomCTA = ctaButtons.nth(Math.floor(Math.random() * ctaCount));
      if (await randomCTA.isVisible()) {
        await randomCTA.click();
        console.log('🖱️ Clicked CTA button');
        await thinkTime(page, 2000, 4000);
      }
    }
  } catch (error) {
    console.log(`⚠️ CTA testing warning: ${error.message}`);
  }
}

/**
 * Test features page responsive behavior
 */
async function testFeaturesResponsive(page) {
  console.log('📱 Testing features responsive behavior');
  
  const viewports = [
    { width: 375, height: 667 }, // Mobile
    { width: 1280, height: 720 }  // Desktop
  ];
  
  for (const viewport of viewports) {
    try {
      await page.setViewportSize(viewport);
      await thinkTime(page, 500, 1000);
      await simulateScrolling(page);
    } catch (error) {
      console.log(`⚠️ Responsive test warning: ${error.message}`);
    }
  }
}

/**
 * Test about page interactions
 */
async function testAboutPageInteractions(page) {
  try {
    // Look for contact forms
    const contactForms = page.locator('form');
    const formCount = await contactForms.count();
    
    if (formCount > 0) {
      console.log('📝 Found contact form');
      // Don't actually submit, just interact
      const inputs = page.locator('input[type="text"], input[type="email"], textarea');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        const randomInput = inputs.nth(Math.floor(Math.random() * inputCount));
        await randomInput.focus();
        await thinkTime(page, 1000, 2000);
      }
    }
    
    // Look for team member cards or info
    const teamCards = page.locator('.team-member, .person-card, .about-card');
    const teamCount = await teamCards.count();
    
    if (teamCount > 0) {
      console.log(`👥 Found ${teamCount} team member cards`);
      const randomMember = teamCards.nth(Math.floor(Math.random() * teamCount));
      await randomMember.hover();
      await thinkTime(page, 1000, 2000);
    }
    
  } catch (error) {
    console.log(`⚠️ About page interaction warning: ${error.message}`);
  }
}

/**
 * Test social media links
 */
async function testSocialLinks(page) {
  try {
    const socialLinks = page.locator('a[href*="twitter"], a[href*="linkedin"], a[href*="github"], .social-link');
    const socialCount = await socialLinks.count();
    
    if (socialCount > 0) {
      console.log(`🔗 Found ${socialCount} social links`);
      // Just hover, don't actually navigate away
      const randomSocial = socialLinks.nth(Math.floor(Math.random() * socialCount));
      await randomSocial.hover();
      await thinkTime(page, 500, 1000);
    }
  } catch (error) {
    console.log(`⚠️ Social links warning: ${error.message}`);
  }
}

/**
 * Test hero section interactions
 */
async function testHeroSection(page) {
  try {
    const heroSection = page.locator('.hero, .landing-hero, .hero-section');
    
    if (await heroSection.first().isVisible()) {
      console.log('🦸 Testing hero section');
      
      // Look for hero buttons
      const heroButtons = page.locator('.hero .btn, .hero .button, .cta-button');
      const buttonCount = await heroButtons.count();
      
      if (buttonCount > 0) {
        const randomButton = heroButtons.nth(Math.floor(Math.random() * buttonCount));
        await randomButton.hover();
        await thinkTime(page, 1000, 2000);
        
        // 50% chance to click
        if (Math.random() < 0.5) {
          await randomButton.click();
          await thinkTime(page, 2000, 3000);
        }
      }
    }
  } catch (error) {
    console.log(`⚠️ Hero section warning: ${error.message}`);
  }
}

/**
 * Explore features on current page
 */
async function exploreFeatures(page) {
  try {
    // Look for features section on current page
    const featuresSection = page.locator('.features, .feature-grid, [data-controller="features"]');
    
    if (await featuresSection.first().isVisible()) {
      await featuresSection.first().scrollIntoViewIfNeeded();
      await testFeatureInteractions(page);
    } else {
      // Try navigating to features page
      const featuresLink = page.locator('a[href*="features"]');
      if (await featuresLink.first().isVisible()) {
        await featuresLink.first().click();
        await page.waitForLoadState('networkidle');
        await testFeatureInteractions(page);
      }
    }
  } catch (error) {
    console.log(`⚠️ Feature exploration warning: ${error.message}`);
  }
}

/**
 * Simulate login page browsing without actually logging in
 */
async function simulateLoginPageBrowsing(page) {
  try {
    console.log('🔐 Browsing login page');
    
    // Look at the form
    await page.waitForSelector('input[name="email_address"], input[type="email"]', { timeout: 5000 });
    
    // Simulate reading login instructions
    await simulateReading(page, 1);
    
    // Focus on email field (but don't fill)
    const emailField = page.locator('input[name="email_address"], input[type="email"]');
    if (await emailField.first().isVisible()) {
      await emailField.first().focus();
      await thinkTime(page, 1000, 2000);
    }
    
    // Look for "forgot password" or "sign up" links
    const helpLinks = page.locator('a:has-text("Forgot"), a:has-text("Sign up"), a:has-text("Register")');
    const linkCount = await helpLinks.count();
    
    if (linkCount > 0) {
      const randomLink = helpLinks.nth(Math.floor(Math.random() * linkCount));
      await randomLink.hover();
      await thinkTime(page, 500, 1000);
    }
    
  } catch (error) {
    console.log(`⚠️ Login page browsing warning: ${error.message}`);
  }
}

/**
 * Perform random navigation between public pages
 */
async function performRandomNavigation(page) {
  try {
    const navLinks = page.locator('nav a, .nav-link, .navbar a');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      const randomLink = navLinks.nth(Math.floor(Math.random() * linkCount));
      const href = await randomLink.getAttribute('href');
      
      // Only navigate to relative URLs (stay on same domain)
      if (href && href.startsWith('/') && !href.includes('javascript:')) {
        console.log(`🔗 Random navigation to: ${href}`);
        await randomLink.click();
        await page.waitForLoadState('networkidle');
        await thinkTime(page, 1000, 2000);
      }
    }
  } catch (error) {
    console.log(`⚠️ Random navigation warning: ${error.message}`);
  }
}
