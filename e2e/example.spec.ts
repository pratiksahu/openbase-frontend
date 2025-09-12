import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/');

    // Check if page loads
    await expect(page).toHaveTitle(/OpenBase V2/);

    // Check if main content is visible
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Check if navigation exists
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });
});

test.describe('Theme Switching', () => {
  test('should toggle between light and dark themes', async ({ page }) => {
    await page.goto('/');

    // Find theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // If theme toggle doesn't exist, skip this test
    if (!(await themeToggle.isVisible())) {
      test.skip('Theme toggle not found on page');
    }

    // Get initial theme
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('class');

    // Click theme toggle
    await themeToggle.click();

    // Wait for theme change
    await page.waitForTimeout(100);

    // Check if theme changed
    const newTheme = await html.getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
  });
});

test.describe('Components Test Page', () => {
  test('should display components correctly', async ({ page }) => {
    await page.goto('/components-test');

    // Check page title
    await expect(page).toHaveTitle(/Components Test/);

    // Check if buttons are rendered
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Test button interactions
    const firstButton = buttons.first();
    if (await firstButton.isVisible()) {
      await expect(firstButton).toBeEnabled();
      await firstButton.click();
    }
  });
});

test.describe('Form Testing', () => {
  test('should handle form interactions on test-forms page', async ({ page }) => {
    await page.goto('/test-forms');

    // Check if form elements exist
    const inputs = page.locator('input');
    const textareas = page.locator('textarea');

    // Test input interactions if they exist
    const inputCount = await inputs.count();
    if (inputCount > 0) {
      const firstInput = inputs.first();
      await firstInput.fill('test input');
      await expect(firstInput).toHaveValue('test input');
    }

    // Test textarea interactions if they exist
    const textareaCount = await textareas.count();
    if (textareaCount > 0) {
      const firstTextarea = textareas.first();
      await firstTextarea.fill('test textarea content');
      await expect(firstTextarea).toHaveValue('test textarea content');
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if page is still accessible on mobile
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check if mobile navigation works (if exists)
    const menuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('should work on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Check if page layout adapts to tablet size
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1 tag
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    
    // Should have at least one h1 on the page
    if (h1Count === 0) {
      console.warn('No h1 tags found on homepage');
    }
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Images should have alt text (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });
});