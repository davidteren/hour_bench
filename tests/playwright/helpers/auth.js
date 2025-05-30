// Authentication helper functions for Playwright tests

async function loginAsSystemAdmin(page) {
  await page.goto('/session/new');
  await page.fill('input[name="email_address"]', 'admin@hours.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('input[type="submit"]');
  await page.waitForURL('/'); // Root redirects to dashboard
}

async function loginAsOrgAdmin(page, organization = 'techsolutions') {
  const orgAdmins = {
    techsolutions: 'alice.johnson@techsolutions.com',
    creative: 'luna.rodriguez@creative.com',
    startup: 'victor.chang@startup.com'
  };

  await page.goto('/session/new');
  await page.fill('input[name="email_address"]', orgAdmins[organization]);
  await page.fill('input[name="password"]', 'password123');
  await page.click('input[type="submit"]');
  await page.waitForURL('/');
}

async function loginAsTeamAdmin(page, organization = 'techsolutions') {
  const teamAdmins = {
    techsolutions: 'david.brown@techsolutions.com',
    creative: 'oscar.kim@creative.com',
    startup: 'xavier.bell@startup.com'
  };

  await page.goto('/session/new');
  await page.fill('input[name="email_address"]', teamAdmins[organization]);
  await page.fill('input[name="password"]', 'password123');
  await page.click('input[type="submit"]');
  await page.waitForURL('/');
}

async function loginAsUser(page, organization = 'techsolutions') {
  const users = {
    techsolutions: 'grace.lee@techsolutions.com',
    creative: 'ruby.white@creative.com',
    startup: 'zoe.clark@startup.com'
  };

  await page.goto('/session/new');
  await page.fill('input[name="email_address"]', users[organization]);
  await page.fill('input[name="password"]', 'password123');
  await page.click('input[type="submit"]');
  await page.waitForURL('/');
}

async function loginAsFreelancer(page) {
  await page.goto('/session/new');
  await page.fill('input[name="email_address"]', 'blake.freeman@freelance.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('input[type="submit"]');
  await page.waitForURL('/');
}

module.exports = {
  loginAsSystemAdmin,
  loginAsOrgAdmin,
  loginAsTeamAdmin,
  loginAsUser,
  loginAsFreelancer
};
