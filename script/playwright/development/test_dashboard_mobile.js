/**
 * Development Test: Dashboard Mobile Styling
 * 
 * This script tests the dashboard responsive layout across different viewports.
 * Use this during development to verify dashboard mobile styling is working correctly.
 * 
 * Usage: node script/playwright/development/test_dashboard_mobile.js
 */

const { chromium } = require('playwright');

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

(async () => {
  console.log('🎯 Testing dashboard mobile styling...');
  
  const browser = await chromium.launch({ headless: false });
  const timestamp = getTimestamp();
  
  const testViewports = [
    { name: 'Mobile Small', width: 320, height: 568 },
    { name: 'Mobile Standard', width: 375, height: 667 },
    { name: 'Mobile Large', width: 414, height: 896 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  for (const viewport of testViewports) {
    console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);
    
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();

    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      
      // Inject dashboard structure
      await page.evaluate(() => {
        const dashboardHTML = `
          <div class="dashboard-container">
            <div class="dashboard-header">
              <h1 class="dashboard-title">Dashboard</h1>
              <p class="dashboard-subtitle">Welcome back, John Doe!</p>
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

            <!-- Admin table for desktop testing -->
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

      await page.waitForSelector('.dashboard-container', { timeout: 5000 });

      // Test stats grid layout
      const statsGridColumns = await page.locator('.dashboard-stats').evaluate(el => getComputedStyle(el).gridTemplateColumns);
      console.log(`📊 Stats grid columns: ${statsGridColumns}`);

      // Test dashboard grid layout
      const dashboardGridColumns = await page.locator('.dashboard-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns);
      console.log(`📋 Dashboard grid columns: ${dashboardGridColumns}`);

      // Check admin table visibility
      const adminTableVisible = await page.locator('.admin-table-container').isVisible();
      const adminMessageVisible = await page.locator('.admin-mobile-message').isVisible();
      console.log(`📋 Admin table visible: ${adminTableVisible}, Mobile message visible: ${adminMessageVisible}`);

      // Check if elements are properly sized
      const statsCards = await page.locator('.dashboard-stat-card').count();
      const dashboardCards = await page.locator('.dashboard-card').count();
      console.log(`📊 Stats cards: ${statsCards}, Dashboard cards: ${dashboardCards}`);

      // Take screenshot
      const screenshotName = `${timestamp}-dashboard-${viewport.name.toLowerCase().replace(' ', '-')}.png`;
      await page.screenshot({ path: `tmp/screenshots/${screenshotName}` });
      console.log(`📸 Screenshot saved: tmp/screenshots/${screenshotName}`);

      // Verify responsive behavior
      let expectedStatsColumns, expectedDashboardColumns;
      
      if (viewport.width < 640) {
        expectedStatsColumns = '1 column';
      } else if (viewport.width < 1024) {
        expectedStatsColumns = '2 columns';
      } else {
        expectedStatsColumns = 'auto-fit';
      }

      if (viewport.width < 1024) {
        expectedDashboardColumns = '1 column';
      } else {
        expectedDashboardColumns = 'auto-fit';
      }

      console.log(`✅ Expected - Stats: ${expectedStatsColumns}, Dashboard: ${expectedDashboardColumns}`);

      // Check for horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewport.width;
      const hasOverflow = bodyWidth > viewportWidth;
      
      if (hasOverflow) {
        console.log(`❌ Horizontal overflow detected: body width ${bodyWidth}px > viewport ${viewportWidth}px`);
      } else {
        console.log(`✅ No horizontal overflow: body width ${bodyWidth}px <= viewport ${viewportWidth}px`);
      }

    } catch (error) {
      console.error(`❌ Error testing ${viewport.name}:`, error.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  
  console.log('\n🎉 Dashboard mobile styling test completed!');
  console.log(`📸 Screenshots saved in tmp/screenshots/ with timestamp ${timestamp}`);
})();
