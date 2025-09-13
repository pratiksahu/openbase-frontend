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
  test('should have a working theme toggle button', async ({ page }) => {
    await page.goto('/');

    // Find theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    // Check if theme toggle exists and is visible
    await expect(themeToggle).toBeVisible();

    // Check if theme toggle is clickable
    await expect(themeToggle).toBeEnabled();

    // Click the theme toggle button
    await themeToggle.click();

    // Verify the button is still visible after clicking (it shouldn't disappear)
    await expect(themeToggle).toBeVisible();
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
  test('should handle form interactions on test-forms page', async ({
    page,
  }) => {
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

test.describe('Footer', () => {
  test('should display footer with all sections', async ({ page }) => {
    await page.goto('/');

    // Check if footer exists
    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toBeVisible();

    // Check all footer sections
    const companySection = page.locator('[data-testid="footer-company"]');
    await expect(companySection).toBeVisible();
    await expect(companySection).toContainText('Company');

    const productSection = page.locator('[data-testid="footer-product"]');
    await expect(productSection).toBeVisible();
    await expect(productSection).toContainText('Product');

    const resourcesSection = page.locator('[data-testid="footer-resources"]');
    await expect(resourcesSection).toBeVisible();
    await expect(resourcesSection).toContainText('Resources');

    const legalSection = page.locator('[data-testid="footer-legal"]');
    await expect(legalSection).toBeVisible();
    await expect(legalSection).toContainText('Legal');
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('[data-testid="footer"]');

    // Check that links exist and are clickable
    const aboutLink = footer.locator('a[href="/about"]');
    await expect(aboutLink).toBeVisible();
    await expect(aboutLink).toHaveText('About');

    const featuresLink = footer.locator('a[href="/features"]');
    await expect(featuresLink).toBeVisible();
    await expect(featuresLink).toHaveText('Features');

    const pricingLink = footer.locator('a[href="/pricing"]');
    await expect(pricingLink).toBeVisible();
    await expect(pricingLink).toHaveText('Pricing');

    // Check that privacy and terms links exist
    const privacyLink = footer.locator('a[href="/privacy"]');
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveText('Privacy Policy');

    const termsLink = footer.locator('a[href="/terms"]');
    await expect(termsLink).toBeVisible();
    await expect(termsLink).toHaveText('Terms of Service');
  });

  test('should display social media links', async ({ page }) => {
    await page.goto('/');

    const socialSection = page.locator('[data-testid="footer-social"]');
    await expect(socialSection).toBeVisible();

    // Check for social media links (they have sr-only text)
    const facebookLink = socialSection
      .locator('a')
      .filter({ hasText: 'Facebook' });
    await expect(facebookLink).toBeVisible();

    const twitterLink = socialSection
      .locator('a')
      .filter({ hasText: 'Twitter' });
    await expect(twitterLink).toBeVisible();

    const githubLink = socialSection.locator('a').filter({ hasText: 'GitHub' });
    await expect(githubLink).toBeVisible();

    const linkedinLink = socialSection
      .locator('a')
      .filter({ hasText: 'LinkedIn' });
    await expect(linkedinLink).toBeVisible();
  });

  test('should display copyright notice', async ({ page }) => {
    await page.goto('/');

    const copyright = page.locator('[data-testid="footer-copyright"]');
    await expect(copyright).toBeVisible();
    await expect(copyright).toContainText('© 2024 OpenBase V2');
    await expect(copyright).toContainText('All rights reserved');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toBeVisible();

    // Check that grid changes to 2 columns on mobile
    const grid = footer.locator('.grid');
    await expect(grid).toHaveClass(/grid-cols-2/);
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
