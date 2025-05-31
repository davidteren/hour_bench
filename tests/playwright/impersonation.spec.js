const { test, expect } = require('@playwright/test');

// Helper function to login as system admin
async function loginAsSystemAdmin(page) {
  await page.goto('/session/new');
  await page.fill('input[name="email_address"]', 'admin@hourbench.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

test.describe('User Impersonation', () => {
  test.beforeEach(async ({ page }) => {
    // Always start from a clean state
    await page.goto('/');
  });

  test('complete impersonation workflow', async ({ page }) => {
    // Step 1: Login as system admin
    await loginAsSystemAdmin(page);
    
    // Verify we're logged in as system admin
    await expect(page.locator('.user-name')).toContainText('System Admin');
    await expect(page.locator('.user-role')).toContainText('System Admin');
    
    // Step 2: Navigate to users page
    await page.click('#nav-users');
    await page.waitForURL('/users');
    
    // Step 3: Find a user to impersonate (not the system admin)
    const userRow = page.locator('tr').filter({ hasText: 'grace.lee@techsolutions.com' }).first();
    await expect(userRow).toBeVisible();
    
    // Step 4: Click impersonate button
    await userRow.locator('a:has-text("Impersonate")').click();
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Step 5: Verify impersonation started
    await page.waitForURL('/dashboard');
    
    // Check for impersonation banner
    const impersonationBanner = page.locator('div[style*="background-color: var(--color-warning)"]');
    await expect(impersonationBanner).toBeVisible();
    await expect(impersonationBanner).toContainText('Impersonating: Grace Lee');
    
    // Check user info shows impersonated user
    await expect(page.locator('.user-name')).toContainText('Grace Lee');
    await expect(page.locator('.user-name')).toContainText('(Impersonated)');
    
    // Step 6: Navigate around to ensure impersonation persists
    await page.click('#nav-projects');
    await page.waitForURL('/projects');
    
    // Banner should still be visible
    await expect(impersonationBanner).toBeVisible();
    
    // Step 7: Stop impersonation
    await impersonationBanner.locator('a:has-text("Stop")').click();
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Step 8: Verify impersonation stopped
    await page.waitForURL('/dashboard');
    
    // Check success message
    await expect(page.locator('div[style*="background-color: var(--color-success)"]'))
      .toContainText('Stopped impersonating. Welcome back, System Admin!');
    
    // Banner should be gone
    await expect(page.locator('div[style*="background-color: var(--color-warning)"]')).not.toBeVisible();
    
    // User info should show system admin again
    await expect(page.locator('.user-name')).toContainText('System Admin');
    await expect(page.locator('.user-name')).not.toContainText('(Impersonated)');
    await expect(page.locator('.user-role')).toContainText('System Admin');
    
    // Step 9: Verify app state is normal
    // Navigate to different pages to ensure no erratic behavior
    await page.click('#nav-users');
    await page.waitForURL('/users');
    await expect(page.locator('h1')).toContainText('Users');
    
    await page.click('#nav-dashboard');
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // No console errors should have occurred
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    expect(consoleErrors).toHaveLength(0);
  });

  test('cannot impersonate as non-system admin', async ({ page }) => {
    // Login as org admin
    await page.goto('/session/new');
    await page.fill('input[name="email_address"]', 'alice.johnson@techsolutions.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Navigate to users page
    await page.click('#nav-users');
    await page.waitForURL('/users');
    
    // Impersonate buttons should not be visible
    await expect(page.locator('a:has-text("Impersonate")')).not.toBeVisible();
  });

  test('impersonation banner persists across page navigation', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Start impersonation
    await page.goto('/users');
    const userRow = page.locator('tr').filter({ hasText: 'grace.lee@techsolutions.com' }).first();
    await userRow.locator('a:has-text("Impersonate")').click();
    page.on('dialog', dialog => dialog.accept());
    await page.waitForURL('/dashboard');
    
    const impersonationBanner = page.locator('div[style*="background-color: var(--color-warning)"]');
    
    // Navigate through multiple pages
    const pages = ['/projects', '/time_logs', '/dashboard', '/users'];
    
    for (const url of pages) {
      await page.goto(url);
      await expect(impersonationBanner).toBeVisible();
      await expect(impersonationBanner).toContainText('Impersonating: Grace Lee');
    }
  });

  test('cannot impersonate while already impersonating', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Start impersonating first user
    await page.goto('/users');
    const firstUserRow = page.locator('tr').filter({ hasText: 'grace.lee@techsolutions.com' }).first();
    await firstUserRow.locator('a:has-text("Impersonate")').click();
    page.on('dialog', dialog => dialog.accept());
    await page.waitForURL('/dashboard');
    
    // Try to navigate to users page while impersonating
    await page.goto('/users');
    
    // Impersonate buttons should not be visible when already impersonating
    await expect(page.locator('a:has-text("Impersonate")')).not.toBeVisible();
  });

  test('stop impersonation from user show page', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Navigate to a specific user page
    await page.goto('/users');
    const userRow = page.locator('tr').filter({ hasText: 'grace.lee@techsolutions.com' }).first();
    await userRow.locator('a').first().click(); // Click on user name to go to show page
    
    // Click impersonate button on user show page
    await page.locator('#impersonate-user-btn').click();
    page.on('dialog', dialog => dialog.accept());
    await page.waitForURL('/dashboard');
    
    // Verify impersonation started
    const impersonationBanner = page.locator('div[style*="background-color: var(--color-warning)"]');
    await expect(impersonationBanner).toBeVisible();
    
    // Stop impersonation
    await impersonationBanner.locator('a:has-text("Stop")').click();
    page.on('dialog', dialog => dialog.accept());
    
    // Verify stopped
    await expect(impersonationBanner).not.toBeVisible();
    await expect(page.locator('.user-name')).toContainText('System Admin');
  });

  test('impersonation state cleared on logout', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Start impersonation
    await page.goto('/users');
    const userRow = page.locator('tr').filter({ hasText: 'grace.lee@techsolutions.com' }).first();
    await userRow.locator('a:has-text("Impersonate")').click();
    page.on('dialog', dialog => dialog.accept());
    await page.waitForURL('/dashboard');
    
    // Logout while impersonating
    await page.locator('#sign-out-btn').click();
    page.on('dialog', dialog => dialog.accept());
    await page.waitForURL('/session/new');
    
    // Login again as system admin
    await loginAsSystemAdmin(page);
    
    // Should not be impersonating anymore
    await expect(page.locator('div[style*="background-color: var(--color-warning)"]')).not.toBeVisible();
    await expect(page.locator('.user-name')).toContainText('System Admin');
    await expect(page.locator('.user-name')).not.toContainText('(Impersonated)');
  });

  test('impersonation permissions respected', async ({ page }) => {
    await loginAsSystemAdmin(page);
    
    // Go to user show page
    await page.goto('/users');
    const userRow = page.locator('tr').filter({ hasText: 'grace.lee@techsolutions.com' }).first();
    await userRow.locator('a').first().click();
    
    // System admin should see impersonate button
    await expect(page.locator('#impersonate-user-btn')).toBeVisible();
    
    // Logout and login as org admin
    await page.locator('#sign-out-btn').click();
    page.on('dialog', dialog => dialog.accept());
    await page.waitForURL('/session/new');
    
    await page.fill('input[name="email_address"]', 'alice.johnson@techsolutions.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Navigate to same user page
    await page.goto('/users');
    const userRow2 = page.locator('tr').filter({ hasText: 'grace.lee@techsolutions.com' }).first();
    await userRow2.locator('a').first().click();
    
    // Org admin should not see impersonate button
    await expect(page.locator('#impersonate-user-btn')).not.toBeVisible();
  });
});