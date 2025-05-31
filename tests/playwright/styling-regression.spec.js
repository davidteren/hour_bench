/**
 * Regression Test: General Styling and CSS Architecture
 * 
 * This test ensures the overall styling system continues to work correctly
 * after code changes. It verifies CSS custom properties, component classes,
 * and design system consistency.
 */

const { test, expect } = require('@playwright/test');

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

test.describe('Styling System Regression Tests', () => {
  let timestamp;

  test.beforeEach(async ({ page }) => {
    timestamp = getTimestamp();
    await page.goto('/');
  });

  test('CSS custom properties should be defined and accessible', async ({ page }) => {
    // Test that CSS custom properties are properly defined
    const cssVariables = await page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      
      return {
        // Color variables
        colorAccentPrimary: computedStyle.getPropertyValue('--color-accent-primary').trim(),
        colorSuccess: computedStyle.getPropertyValue('--color-success').trim(),
        colorError: computedStyle.getPropertyValue('--color-error').trim(),
        colorTextPrimary: computedStyle.getPropertyValue('--color-text-primary').trim(),
        colorSurface: computedStyle.getPropertyValue('--color-surface').trim(),
        
        // Spacing variables
        spacingMd: computedStyle.getPropertyValue('--spacing-md').trim(),
        spacingLg: computedStyle.getPropertyValue('--spacing-lg').trim(),
        
        // Typography variables
        fontSizeMd: computedStyle.getPropertyValue('--font-size-md').trim(),
        fontSizeLg: computedStyle.getPropertyValue('--font-size-lg').trim(),
        
        // Border radius
        radiusLg: computedStyle.getPropertyValue('--radius-lg').trim(),
        radiusXl: computedStyle.getPropertyValue('--radius-xl').trim()
      };
    });

    // Verify color variables are defined
    expect(cssVariables.colorAccentPrimary).toBeTruthy();
    expect(cssVariables.colorSuccess).toBeTruthy();
    expect(cssVariables.colorError).toBeTruthy();
    expect(cssVariables.colorTextPrimary).toBeTruthy();
    expect(cssVariables.colorSurface).toBeTruthy();

    // Verify spacing variables are defined
    expect(cssVariables.spacingMd).toBeTruthy();
    expect(cssVariables.spacingLg).toBeTruthy();

    // Verify typography variables are defined
    expect(cssVariables.fontSizeMd).toBeTruthy();
    expect(cssVariables.fontSizeLg).toBeTruthy();

    // Verify border radius variables are defined
    expect(cssVariables.radiusLg).toBeTruthy();
    expect(cssVariables.radiusXl).toBeTruthy();

    console.log('CSS Variables verified:', cssVariables);
  });

  test('button components should have consistent styling', async ({ page }) => {
    // Inject test buttons
    await page.evaluate(() => {
      const buttonHTML = `
        <div style="padding: 2rem;">
          <button class="btn btn-primary">Primary Button</button>
          <button class="btn btn-secondary">Secondary Button</button>
          <button class="btn btn-danger">Danger Button</button>
          <button class="btn btn-primary btn-full">Full Width Button</button>
        </div>
      `;
      document.body.innerHTML = buttonHTML;
    });

    // Test primary button
    const primaryBtn = page.locator('.btn-primary').first();
    await expect(primaryBtn).toBeVisible();
    
    const primaryStyles = await primaryBtn.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        padding: style.padding,
        fontSize: style.fontSize
      };
    });

    // Verify button has proper styling
    expect(primaryStyles.backgroundColor).toBeTruthy();
    expect(primaryStyles.borderRadius).toBeTruthy();
    expect(primaryStyles.padding).toBeTruthy();

    // Test full-width button
    const fullBtn = page.locator('.btn-full');
    const fullBtnWidth = await fullBtn.evaluate(el => getComputedStyle(el).width);
    
    // Should use full width of container
    expect(fullBtnWidth).not.toBe('auto');

    // Take screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-buttons.png` 
    });
  });

  test('card components should have consistent styling', async ({ page }) => {
    // Inject test cards
    await page.evaluate(() => {
      const cardHTML = `
        <div style="padding: 2rem; max-width: 800px;">
          <div class="card">
            <div class="card-header">Card Header</div>
            <p>This is a standard card component.</p>
          </div>
          
          <div class="card-compact" style="margin-top: 1rem;">
            <p>This is a compact card component.</p>
          </div>
          
          <div class="surface" style="margin-top: 1rem; padding: 1rem;">
            <p>This is a surface component.</p>
          </div>
        </div>
      `;
      document.body.innerHTML = cardHTML;
    });

    // Test card styling
    const card = page.locator('.card').first();
    await expect(card).toBeVisible();
    
    const cardStyles = await card.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        border: style.border,
        boxShadow: style.boxShadow
      };
    });

    // Verify card has proper styling
    expect(cardStyles.backgroundColor).toBeTruthy();
    expect(cardStyles.borderRadius).toBeTruthy();
    expect(cardStyles.border).toBeTruthy();

    // Test card header
    const cardHeader = page.locator('.card-header');
    await expect(cardHeader).toBeVisible();

    // Take screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-cards.png` 
    });
  });

  test('utility classes should work correctly', async ({ page }) => {
    // Inject test elements with utility classes
    await page.evaluate(() => {
      const utilityHTML = `
        <div style="padding: 2rem;">
          <div class="flex-center gap-md" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem;">
            <span>Item 1</span>
            <span>Item 2</span>
            <span>Item 3</span>
          </div>
          
          <div class="flex-between" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem;">
            <span>Left</span>
            <span>Right</span>
          </div>
          
          <div class="flex-col gap-sm" style="border: 1px solid #ccc; padding: 1rem;">
            <span>Top</span>
            <span>Middle</span>
            <span>Bottom</span>
          </div>
        </div>
      `;
      document.body.innerHTML = utilityHTML;
    });

    // Test flex-center utility
    const flexCenter = page.locator('.flex-center');
    const flexCenterStyles = await flexCenter.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        display: style.display,
        alignItems: style.alignItems,
        gap: style.gap
      };
    });

    expect(flexCenterStyles.display).toBe('flex');
    expect(flexCenterStyles.alignItems).toBe('center');
    expect(flexCenterStyles.gap).toBeTruthy();

    // Test flex-between utility
    const flexBetween = page.locator('.flex-between');
    const flexBetweenStyles = await flexBetween.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        display: style.display,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems
      };
    });

    expect(flexBetweenStyles.display).toBe('flex');
    expect(flexBetweenStyles.justifyContent).toBe('space-between');
    expect(flexBetweenStyles.alignItems).toBe('center');

    // Test flex-col utility
    const flexCol = page.locator('.flex-col');
    const flexColStyles = await flexCol.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        display: style.display,
        flexDirection: style.flexDirection,
        gap: style.gap
      };
    });

    expect(flexColStyles.display).toBe('flex');
    expect(flexColStyles.flexDirection).toBe('column');
    expect(flexColStyles.gap).toBeTruthy();

    // Take screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-utilities.png` 
    });
  });

  test('responsive breakpoints should work correctly', async ({ page }) => {
    // Inject test element with responsive behavior
    await page.evaluate(() => {
      const responsiveHTML = `
        <div class="stats-grid" style="padding: 2rem;">
          <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px;">Item 1</div>
          <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px;">Item 2</div>
          <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px;">Item 3</div>
        </div>
      `;
      document.body.innerHTML = responsiveHTML;
    });

    const statsGrid = page.locator('.stats-grid');

    // Test mobile viewport (should be 1 column)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100);
    
    const mobileColumns = await statsGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const mobileColumnCount = mobileColumns.split(' ').length;
    expect(mobileColumnCount).toBe(1);

    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-responsive-mobile.png` 
    });

    // Test tablet viewport (should be 2 columns)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100);
    
    const tabletColumns = await statsGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    const tabletColumnCount = tabletColumns.split(' ').length;
    expect(tabletColumnCount).toBe(2);

    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-responsive-tablet.png` 
    });

    // Test desktop viewport (should be auto-fit)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(100);
    
    const desktopColumns = await statsGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    // Desktop should have specific column widths (auto-fit behavior)
    expect(desktopColumns).toContain('px');

    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-responsive-desktop.png` 
    });
  });

  test('status indicators should have proper styling and animations', async ({ page }) => {
    // Inject status indicators
    await page.evaluate(() => {
      const statusHTML = `
        <div style="padding: 2rem;">
          <div style="margin-bottom: 1rem;">
            <span class="status-running"></span>
            <span style="margin-left: 1rem;">Running Status</span>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <span class="status-completed"></span>
            <span style="margin-left: 1rem;">Completed Status</span>
          </div>
          
          <div>
            <span class="status-indicator status-success">Success</span>
            <span class="status-indicator status-warning" style="margin-left: 1rem;">Warning</span>
            <span class="status-indicator status-error" style="margin-left: 1rem;">Error</span>
          </div>
        </div>
      `;
      document.body.innerHTML = statusHTML;
    });

    // Test running status (should have animation)
    const runningStatus = page.locator('.status-running');
    await expect(runningStatus).toBeVisible();
    
    const runningStyles = await runningStatus.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        width: style.width,
        height: style.height,
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        animation: style.animation
      };
    });

    expect(runningStyles.width).toBeTruthy();
    expect(runningStyles.height).toBeTruthy();
    expect(runningStyles.backgroundColor).toBeTruthy();
    expect(runningStyles.borderRadius).toBe('50%');
    // Should have pulse animation
    expect(runningStyles.animation).toContain('pulse');

    // Test completed status
    const completedStatus = page.locator('.status-completed');
    await expect(completedStatus).toBeVisible();

    // Take screenshot
    await page.screenshot({ 
      path: `tmp/screenshots/${timestamp}-regression-status-indicators.png` 
    });
  });
});
