const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing dashboard mobile styling...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 } // Mobile viewport
  });
  const page = await context.newPage();

  try {
    // Navigate to the application
    console.log('📍 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Inject test dashboard structure to simulate logged-in state
    console.log('🧪 Injecting test dashboard structure...');
    
    await page.evaluate(() => {
      // Create a test dashboard structure
      const dashboardHTML = `
        <div class="dashboard-container">
          <!-- Header -->
          <div class="dashboard-header">
            <h1 class="dashboard-title">Dashboard</h1>
            <p class="dashboard-subtitle">
              Welcome back, John Doe!
              <span class="status-indicator status-active">
                System Admin
              </span>
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="dashboard-stats">
            <div class="dashboard-stat-card">
              <div class="dashboard-stat-content">
                <div class="dashboard-stat-icon">
                  <span>🕐</span>
                </div>
                <div class="dashboard-stat-info">
                  <div class="dashboard-stat-label">Total Hours</div>
                  <div class="dashboard-stat-value">42.5h</div>
                </div>
              </div>
            </div>
            
            <div class="dashboard-stat-card">
              <div class="dashboard-stat-content">
                <div class="dashboard-stat-icon">
                  <span>💰</span>
                </div>
                <div class="dashboard-stat-info">
                  <div class="dashboard-stat-label">Revenue</div>
                  <div class="dashboard-stat-value">$2,125</div>
                </div>
              </div>
            </div>
            
            <div class="dashboard-stat-card">
              <div class="dashboard-stat-content">
                <div class="dashboard-stat-icon">
                  <span>📊</span>
                </div>
                <div class="dashboard-stat-info">
                  <div class="dashboard-stat-label">Projects</div>
                  <div class="dashboard-stat-value">8</div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-xl">
            <div class="grid-auto-fit-lg">
              <!-- Quick Actions -->
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Quick Actions</h3>
                </div>
                <div class="flex flex-col gap-md">
                  <a href="#" class="btn btn-primary btn-full">
                    <span>▶</span>
                    Start New Timer
                  </a>
                  <a href="#" class="btn btn-secondary btn-full">
                    <span>🕐</span>
                    View All Time Logs
                  </a>
                  <a href="#" class="btn btn-secondary btn-full">
                    <span>📋</span>
                    Browse Projects
                  </a>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="card">
                <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                  <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-text-primary); margin: 0;">Recent Time Logs</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  <div class="surface-secondary" style="border: 1px solid var(--color-border-light); padding: 1rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <div style="flex: 1; min-width: 0;">
                        <p style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary);">
                          Website Redesign
                        </p>
                        <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.25rem;">
                          Working on homepage layout
                        </p>
                        <p style="font-size: 0.75rem; color: var(--color-text-tertiary); margin-top: 0.25rem;">
                          John Doe • 2 hours ago
                        </p>
                      </div>
                      <div style="flex-shrink: 0; text-align: right;">
                        <p style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary);">
                          3.5h
                        </p>
                        <p style="font-size: 0.75rem; color: var(--color-success);">
                          $175.00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Clear body and insert dashboard
      document.body.innerHTML = dashboardHTML;
    });
    
    // Wait for the content to be inserted
    await page.waitForSelector('.dashboard-container', { timeout: 5000 });
    console.log('✅ Test dashboard structure injected');
    
    // Test the mobile styling issues
    console.log('\n📱 Testing dashboard mobile styling issues...');
    
    // Check dashboard container
    const dashboardContainer = await page.locator('.dashboard-container').count() > 0;
    console.log('📋 Dashboard container exists:', dashboardContainer);
    
    // Check stats grid layout
    const statsGrid = await page.locator('.dashboard-stats').count() > 0;
    console.log('📊 Stats grid exists:', statsGrid);
    
    if (statsGrid) {
      const statsDisplay = await page.locator('.dashboard-stats').evaluate(el => getComputedStyle(el).display);
      console.log('📊 Stats grid display:', statsDisplay);
      
      const statsGridColumns = await page.locator('.dashboard-stats').evaluate(el => getComputedStyle(el).gridTemplateColumns);
      console.log('📊 Stats grid columns:', statsGridColumns);
    }
    
    // Check card layout
    const cards = await page.locator('.card').count();
    console.log('📋 Cards count:', cards);
    
    // Check grid layout
    const gridContainer = await page.locator('.grid-auto-fit-lg').count() > 0;
    console.log('📋 Grid container exists:', gridContainer);
    
    if (gridContainer) {
      const gridDisplay = await page.locator('.grid-auto-fit-lg').evaluate(el => getComputedStyle(el).display);
      console.log('📋 Grid display:', gridDisplay);
      
      const gridColumns = await page.locator('.grid-auto-fit-lg').evaluate(el => getComputedStyle(el).gridTemplateColumns);
      console.log('📋 Grid columns:', gridColumns);
    }
    
    // Check button layout
    const buttons = await page.locator('.btn').count();
    console.log('🔘 Buttons count:', buttons);
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'dashboard-mobile-before.png' });
    console.log('📸 Mobile screenshot saved: dashboard-mobile-before.png');
    
    // Test different mobile sizes
    console.log('\n📱 Testing different mobile sizes...');
    
    // iPhone SE
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'dashboard-mobile-320.png' });
    console.log('📸 320px screenshot saved');
    
    // Standard mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'dashboard-mobile-375.png' });
    console.log('📸 375px screenshot saved');
    
    // Large mobile
    await page.setViewportSize({ width: 414, height: 896 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'dashboard-mobile-414.png' });
    console.log('📸 414px screenshot saved');
    
    // Summary
    console.log('\n📊 Dashboard Mobile Issues Identified:');
    console.log('❌ Stats grid likely not responsive');
    console.log('❌ Card layout may not stack properly');
    console.log('❌ Inline styles preventing proper mobile optimization');
    console.log('❌ Table in admin section not mobile-friendly');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  } finally {
    await browser.close();
    console.log('\n🏁 Dashboard mobile test completed');
  }
})();
