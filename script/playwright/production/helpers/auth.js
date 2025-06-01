// Production Authentication Helper Functions for Playwright Load Testing
// Target: https://hour-bench.onrender.com/

const PRODUCTION_BASE_URL = 'https://hour-bench.onrender.com';

/**
 * Base login function with error handling and retries
 */
async function loginUser(page, email, password, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔐 Attempting login for ${email} (attempt ${attempt}/${retries})`);
      
      await page.goto(`${PRODUCTION_BASE_URL}/session/new`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for form to be ready
      await page.waitForSelector('input[name="email_address"]', { timeout: 10000 });
      
      // Fill login form
      await page.fill('input[name="email_address"]', email);
      await page.fill('input[name="password"]', password);
      
      // Submit form and wait for navigation
      await Promise.all([
        page.waitForURL(`${PRODUCTION_BASE_URL}/`, { timeout: 30000 }),
        page.click('input[type="submit"]')
      ]);
      
      // Verify successful login by checking for dashboard elements
      await page.waitForSelector('.navbar-brand', { timeout: 10000 });
      
      console.log(`✅ Successfully logged in as ${email}`);
      return true;
      
    } catch (error) {
      console.log(`❌ Login attempt ${attempt} failed for ${email}: ${error.message}`);
      
      if (attempt === retries) {
        throw new Error(`Failed to login as ${email} after ${retries} attempts: ${error.message}`);
      }
      
      // Wait before retry
      await page.waitForTimeout(2000);
    }
  }
}

/**
 * Logout function with error handling
 */
async function logoutUser(page) {
  try {
    console.log('🚪 Logging out user');
    
    // Navigate to logout (destroy session)
    await page.goto(`${PRODUCTION_BASE_URL}/session`, {
      method: 'DELETE',
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    // Alternative: Click logout link if available
    try {
      await page.click('a[href="/session"][data-method="delete"]', { timeout: 5000 });
    } catch (e) {
      // Logout link might not be visible, that's okay
    }
    
    // Verify logout by checking for login form
    await page.waitForSelector('input[name="email_address"]', { timeout: 10000 });
    
    console.log('✅ Successfully logged out');
    
  } catch (error) {
    console.log(`⚠️ Logout warning: ${error.message}`);
    // Don't throw error for logout failures, just log
  }
}

/**
 * System Admin Login
 */
async function loginAsSystemAdmin(page) {
  await loginUser(page, 'admin@hourbench.com', 'password123');
}

/**
 * Organization Admin Logins
 */
async function loginAsOrgAdmin(page, organization = 'techsolutions') {
  const orgAdmins = {
    techsolutions: 'alice.johnson@techsolutions.com',
    creative: 'luna.rodriguez@creative.com',
    startup: 'victor.chang@startup.com'
  };
  
  const email = orgAdmins[organization];
  if (!email) {
    throw new Error(`Unknown organization: ${organization}. Available: ${Object.keys(orgAdmins).join(', ')}`);
  }
  
  await loginUser(page, email, 'password123');
}

/**
 * Team Admin Logins
 */
async function loginAsTeamAdmin(page, organization = 'techsolutions') {
  const teamAdmins = {
    techsolutions: 'david.brown@techsolutions.com',
    creative: 'oscar.kim@creative.com',
    startup: 'xavier.bell@startup.com'
  };
  
  const email = teamAdmins[organization];
  if (!email) {
    throw new Error(`Unknown organization: ${organization}. Available: ${Object.keys(teamAdmins).join(', ')}`);
  }
  
  await loginUser(page, email, 'password123');
}

/**
 * Regular User Logins
 */
async function loginAsUser(page, organization = 'techsolutions') {
  const users = {
    techsolutions: 'grace.lee@techsolutions.com',
    creative: 'ruby.white@creative.com',
    startup: 'zoe.clark@startup.com'
  };
  
  const email = users[organization];
  if (!email) {
    throw new Error(`Unknown organization: ${organization}. Available: ${Object.keys(users).join(', ')}`);
  }
  
  await loginUser(page, email, 'password123');
}

/**
 * Freelancer Login
 */
async function loginAsFreelancer(page) {
  await loginUser(page, 'blake.freeman@freelance.com', 'password123');
}

/**
 * Random user login for load testing
 */
async function loginAsRandomUser(page) {
  const allUsers = [
    // System Admin
    'admin@hourbench.com',
    
    // Org Admins
    'alice.johnson@techsolutions.com',
    'bob.wilson@techsolutions.com',
    'carol.davis@techsolutions.com',
    'luna.rodriguez@creative.com',
    'max.thompson@creative.com',
    'nina.patel@creative.com',
    'victor.chang@startup.com',
    'wendy.foster@startup.com',
    
    // Team Admins
    'david.brown@techsolutions.com',
    'eva.martinez@techsolutions.com',
    'frank.miller@techsolutions.com',
    'oscar.kim@creative.com',
    'paula.garcia@creative.com',
    'quinn.adams@creative.com',
    'xavier.bell@startup.com',
    'yuki.tanaka@startup.com',
    
    // Regular Users
    'grace.lee@techsolutions.com',
    'henry.taylor@techsolutions.com',
    'ivy.chen@techsolutions.com',
    'jack.smith@techsolutions.com',
    'ruby.white@creative.com',
    'sam.johnson@creative.com',
    'tina.lopez@creative.com',
    'uma.singh@creative.com',
    'zoe.clark@startup.com',
    'alex.rivera@startup.com',
    
    // Freelancers
    'blake.freeman@freelance.com',
    'casey.jordan@freelance.com',
    'drew.morgan@freelance.com'
  ];
  
  const randomEmail = allUsers[Math.floor(Math.random() * allUsers.length)];
  console.log(`🎲 Randomly selected user: ${randomEmail}`);
  
  await loginUser(page, randomEmail, 'password123');
  return randomEmail;
}

/**
 * Get user role information for testing
 */
function getUserRole(email) {
  if (email === 'admin@hourbench.com') return 'system_admin';
  
  const orgAdmins = [
    'alice.johnson@techsolutions.com', 'bob.wilson@techsolutions.com', 'carol.davis@techsolutions.com',
    'luna.rodriguez@creative.com', 'max.thompson@creative.com', 'nina.patel@creative.com',
    'victor.chang@startup.com', 'wendy.foster@startup.com'
  ];
  
  const teamAdmins = [
    'david.brown@techsolutions.com', 'eva.martinez@techsolutions.com', 'frank.miller@techsolutions.com',
    'oscar.kim@creative.com', 'paula.garcia@creative.com', 'quinn.adams@creative.com',
    'xavier.bell@startup.com', 'yuki.tanaka@startup.com'
  ];
  
  const freelancers = [
    'blake.freeman@freelance.com', 'casey.jordan@freelance.com', 'drew.morgan@freelance.com'
  ];
  
  if (orgAdmins.includes(email)) return 'org_admin';
  if (teamAdmins.includes(email)) return 'team_admin';
  if (freelancers.includes(email)) return 'freelancer';
  return 'user';
}

module.exports = {
  PRODUCTION_BASE_URL,
  loginUser,
  logoutUser,
  loginAsSystemAdmin,
  loginAsOrgAdmin,
  loginAsTeamAdmin,
  loginAsUser,
  loginAsFreelancer,
  loginAsRandomUser,
  getUserRole
};
