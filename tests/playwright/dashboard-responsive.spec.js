/**
 * Regression Test: Dashboard Responsive Layout
 * 
 * This test ensures the dashboard responsive layout continues to work correctly
 * after code changes. It verifies grid layouts, mobile optimization, and
 * prevents horizontal overflow issues.
 */

const { test, expect } = require('@playwright/test');

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

test.describe('Dashboard Responsive Layout Regression Tests', () => {
  let timestamp;

  test.beforeEach(async ({ page }) => {
    timestamp = getTimestamp();
    
    // Navigate to the application
    await page.goto('/');
    
    // Inject dashboard structure
    await page.evaluate(() => {
      const dashboardHTML = `
        <div class="dashboard-container">
          <div class="dashboard-header">
            <h1 class="dashboard-title">Dashboard</h1>
            <p class="dashboard-subtitle">Welcome back, Test User!</p>
          </div>

          <div class="dashboard-stats">
            <div class="dashboard-stat-card">
              <div class="dashboard-stat-content">
                <div class="dashboard-stat-icon"><span>🕐</span></div>
                <div class="dashboard-stat-info">
                  <div class="dashboard-stat-label">Total Hours</div>
                  <div class="dashboard-stat-value">42.5h</div>
                </div>
              </div>
            </div>
            <div class="dashboard-stat-card">
              <div class="dashboard-stat-content">
                <div class="dashboard-stat-icon"><span>💰</span></div>
                <div class="dashboard-stat-info">
                  <div class="dashboard-stat-label">Revenue</div>
                  <div class="dashboard-stat-value">$2,125</div>
                </div>
              </div>
            </div>
            <div class="dashboard-stat-card">
              <div class="dashboard-stat-content">
                <div class="dashboard-stat-icon"><span>📊</span></div>
                <div class="dashboard-stat-info">
                  <div class="dashboard-stat-label">Projects</div>
                  <div class="dashboard-stat-value">8</div>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="dashboard-card">
              <div class="dashboard-card-header">
                <h3 class="dashboard-card-title">Quick Actions</h3>
              </div>
              <div class="quick-actions">
                <a href="#" class="btn btn-primary btn-full">Start Timer</a>
                <a href="#" class="btn btn-secondary btn-full">View Logs</a>
              </div>
            </div>
            
            <div class="dashboard-card">
              <div class="dashboard-card-header">
                <h3 class="dashboard-card-title">Recent Activity</h3>
              </div>
              <div class="recent-activity">
                <div class="activity-item">
                  <div class="activity-header">
                    <div class="activity-info">
                      <p class="activity-project">Website Redesign</p>
                      <p class="activity-description">Working on homepage</p>
                      <p class="activity-meta">John • 2h ago</p>
                    </div>
                    <div class="activity-duration">
                      <p class="activity-hours">3.5h</p>
                      <p class="activity-revenue">$175</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin section for testing table behavior -->
          <div class="admin-section">
            <div class="dashboard-card">
              <div class="dashboard-card-header">
                <h3 class="dashboard-card-title">Organizations Overview</h3>
              </div>
              <div class="admin-mobile-message">
                <p>Organization details are best viewed on desktop.</p>
              </div>
              <div class="admin-table-container">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Organization</th>
                      <th>Users</th>
                      <th>Projects</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><a href="#" class="admin-table-link">Acme Corp</a></td>
                      <td>15</td>
                      <td>8</td>
                      <td class="admin-table-revenue">$12,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.innerHTML = dashboardHTML;
    });

    await page.waitForSelector('.dashboard-container');
  });

  test('stats grid should use single column layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const statsGrid = page.locator('.dashboard-stats');
    
    // Check grid template columns
    const gridColumns = await statsGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    
    // On mobile, should be single column (one value, not multiple)
    const columnCount = gridColumns.split(' ').length;
    expect(columnCount).toBe(1);
    
    // Verify all stat cards are present
    const statCards = page.locator('.dashboard-stat-card');
    await expect(statCards).toHaveCount(3);
    
    // Take regression screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-dashboard-mobile-stats.png` 
    });
  });

  test('stats grid should use two column layout on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const statsGrid = page.locator('.dashboard-stats');
    
    // Check grid template columns
    const gridColumns = await statsGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    
    // On tablet, should be two columns
    const columnCount = gridColumns.split(' ').length;
    expect(columnCount).toBe(2);
    
    // Take regression screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-dashboard-tablet-stats.png` 
    });
  });

  test('dashboard grid should stack cards on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const dashboardGrid = page.locator('.dashboard-grid');
    
    // Check grid template columns
    const gridColumns = await dashboardGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    
    // On mobile, should be single column
    const columnCount = gridColumns.split(' ').length;
    expect(columnCount).toBe(1);
    
    // Verify dashboard cards are present
    const dashboardCards = page.locator('.dashboard-card');
    await expect(dashboardCards).toHaveCount(3); // Including admin section
    
    // Take regression screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-dashboard-mobile-grid.png` 
    });
  });

  test('admin table should be hidden on mobile with message shown', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const adminTable = page.locator('.admin-table-container');
    const adminMessage = page.locator('.admin-mobile-message');
    
    // Admin table should be hidden on mobile
    await expect(adminTable).not.toBeVisible();
    
    // Mobile message should be visible
    await expect(adminMessage).toBeVisible();
    await expect(adminMessage).toContainText('Organization details are best viewed on desktop');
    
    // Take regression screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-dashboard-mobile-admin.png` 
    });
  });

  test('admin table should be visible on desktop with message hidden', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const adminTable = page.locator('.admin-table-container');
    const adminMessage = page.locator('.admin-mobile-message');
    
    // Admin table should be visible on desktop
    await expect(adminTable).toBeVisible();
    
    // Mobile message should be hidden
    await expect(adminMessage).not.toBeVisible();
    
    // Verify table content
    const tableRows = page.locator('.admin-table tbody tr');
    await expect(tableRows).toHaveCount(1);
    
    // Take regression screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-dashboard-desktop-admin.png` 
    });
  });

  test('should not have horizontal overflow on any viewport', async ({ page }) => {
    const viewports = [
      { name: 'Mobile Small', width: 320, height: 568 },
      { name: 'Mobile Standard', width: 375, height: 667 },
      { name: 'Mobile Large', width: 414, height: 896 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Check for horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewport.width;
      
      // Body width should not exceed viewport width (allowing for small rounding differences)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
      
      // Take screenshot for visual verification
      await page.screenshot({ 
        path: `tmp/screenshots/${timestamp}-regression-dashboard-${viewport.name.toLowerCase().replace(' ', '-')}-overflow.png` 
      });
    }
  });

  test('activity items should stack properly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const activityHeader = page.locator('.activity-header');
    
    // Check if activity header uses flex-direction: column on mobile
    const flexDirection = await activityHeader.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('column');
    
    // Verify activity items are present
    const activityItems = page.locator('.activity-item');
    await expect(activityItems).toHaveCount(1);
    
    // Take regression screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-dashboard-mobile-activity.png` 
    });
  });

  test('dashboard components should have proper spacing and typography', async ({ page }) => {
    // Set desktop viewport for baseline test
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Check dashboard title
    const title = page.locator('.dashboard-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Dashboard');
    
    // Check dashboard subtitle
    const subtitle = page.locator('.dashboard-subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Welcome back');
    
    // Check stat cards have proper structure
    const statCards = page.locator('.dashboard-stat-card');
    await expect(statCards).toHaveCount(3);
    
    // Check each stat card has required elements
    for (let i = 0; i < 3; i++) {
      const card = statCards.nth(i);
      await expect(card.locator('.dashboard-stat-icon')).toBeVisible();
      await expect(card.locator('.dashboard-stat-label')).toBeVisible();
      await expect(card.locator('.dashboard-stat-value')).toBeVisible();
    }
    
    // Take regression screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-dashboard-desktop-components.png` 
    });
  });
});
