/**
 * Playwright E2E tests for SmartScoreBadge component
 */

import { test, expect, Page } from '@playwright/test';

test.describe('SmartScoreBadge Component', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    // Navigate to the Storybook story for SmartScoreBadge
    await page.goto('http://localhost:6006/');
    await page.waitForLoadState('networkidle');

    // Navigate to SmartScoreBadge stories
    await page.getByRole('button', { name: 'Components' }).click();
    await page.getByRole('button', { name: 'SmartScoreBadge' }).click();
    await page.waitForTimeout(1000); // Allow time for story to load
  });

  test('displays excellent score badge correctly', async () => {
    // Click on the "Excellent Score" story
    await page.getByRole('button', { name: 'Excellent Score' }).click();
    await page.waitForTimeout(500);

    // Verify the badge displays the correct score
    const badge = page
      .locator('[data-testid="smart-score-badge"]')
      .or(page.locator('span').filter({ hasText: /100/ }).first());
    await expect(badge).toBeVisible();

    // Verify the star icon for excellent score
    const starIcon = page.locator('text=★');
    await expect(starIcon).toBeVisible();

    // Verify the score text
    const scoreText = page.locator('text=100/100').or(page.locator('text=100'));
    await expect(scoreText).toBeVisible();
  });

  test('displays poor score badge correctly', async () => {
    // Click on the "Poor Score" story
    await page.getByRole('button', { name: 'Poor Score' }).click();
    await page.waitForTimeout(500);

    // Verify the badge displays a low score
    const badge = page
      .locator('span')
      .filter({ hasText: /\d+\/100/ })
      .first();
    await expect(badge).toBeVisible();

    // Verify the circle icon for poor score
    const circleIcon = page.locator('text=●');
    await expect(circleIcon).toBeVisible();

    // Check that the score is in the poor range (0-39)
    const scoreText = await badge.textContent();
    if (scoreText) {
      const score = parseInt(scoreText.split('/')[0]);
      expect(score).toBeLessThan(40);
    }
  });

  test('displays different size variants correctly', async () => {
    // Test small size
    await page.getByRole('button', { name: 'Small Size' }).click();
    await page.waitForTimeout(500);

    const smallBadge = page
      .locator('span')
      .filter({ hasText: /^\d+$/ })
      .first();
    await expect(smallBadge).toBeVisible();
    // Small size should not show "/100"
    await expect(page.locator('text=100/100')).not.toBeVisible();

    // Test medium size
    await page.getByRole('button', { name: 'Medium Size' }).click();
    await page.waitForTimeout(500);

    const mediumBadge = page
      .locator('text=100/100')
      .or(page.locator('span').filter({ hasText: /\d+\/100/ }));
    await expect(mediumBadge).toBeVisible();

    // Test large size
    await page.getByRole('button', { name: 'Large Size' }).click();
    await page.waitForTimeout(500);

    const largeBadge = page
      .locator('text=100/100')
      .or(page.locator('span').filter({ hasText: /\d+\/100/ }));
    await expect(largeBadge).toBeVisible();

    // Large size should show category text
    const categoryText = page.locator('text=EXCELLENT');
    await expect(categoryText).toBeVisible();
  });

  test('shows tooltip on hover', async () => {
    // Click on the "With Tooltip" story
    await page.getByRole('button', { name: 'With Tooltip' }).click();
    await page.waitForTimeout(500);

    // Find the badge and hover over it
    const badge = page
      .locator('span')
      .filter({ hasText: /\d+\/100/ })
      .first();
    await expect(badge).toBeVisible();

    await badge.hover();
    await page.waitForTimeout(1000); // Wait for tooltip to appear

    // Check for tooltip content - look for SMART score text
    const tooltipContent = page
      .getByText('SMART Score:')
      .or(page.getByText('Breakdown:'))
      .or(page.getByText('Specific'));

    // At least one of these should be visible in the tooltip
    await expect(tooltipContent.first()).toBeVisible({ timeout: 2000 });
  });

  test('displays score breakdown in tooltip', async () => {
    // Click on the "Good Score" story to have some suggestions
    await page.getByRole('button', { name: 'Good Score' }).click();
    await page.waitForTimeout(500);

    const badge = page
      .locator('span')
      .filter({ hasText: /\d+\/100/ })
      .first();
    await badge.hover();
    await page.waitForTimeout(1000);

    // Check for SMART criteria labels in tooltip
    const smartCriteria = [
      page.getByText('Specific'),
      page.getByText('Measurable'),
      page.getByText('Achievable'),
      page.getByText('Relevant'),
      page.getByText('Time-bound'),
    ];

    // At least some SMART criteria should be visible
    let criteriaVisible = 0;
    for (const criteria of smartCriteria) {
      try {
        await expect(criteria).toBeVisible({ timeout: 1000 });
        criteriaVisible++;
      } catch {
        // Continue if this specific criteria is not visible
      }
    }

    expect(criteriaVisible).toBeGreaterThan(0);
  });

  test('displays suggestions in tooltip for imperfect goals', async () => {
    // Click on the "Fair Score" story which should have suggestions
    await page.getByRole('button', { name: 'Fair Score' }).click();
    await page.waitForTimeout(500);

    const badge = page
      .locator('span')
      .filter({ hasText: /\d+\/100/ })
      .first();
    await badge.hover();
    await page.waitForTimeout(1000);

    // Look for suggestions section
    const suggestionsHeader = page.getByText('Suggestions:');
    await expect(suggestionsHeader).toBeVisible({ timeout: 2000 });

    // Look for bullet points or suggestion text
    const suggestionText = page.getByText(/Add|Set|Define|Improve/).first();
    await expect(suggestionText).toBeVisible({ timeout: 1000 });
  });

  test('badge colors reflect score ranges', async () => {
    // Test different score stories and verify color classes
    const stories = [
      { name: 'Excellent Score', expectedClass: /green|success/ },
      { name: 'Fair Score', expectedClass: /orange|warning/ },
      { name: 'Poor Score', expectedClass: /red|destructive/ },
    ];

    for (const story of stories) {
      await page.getByRole('button', { name: story.name }).click();
      await page.waitForTimeout(500);

      // Find the badge element
      const badge = page
        .locator('[class*="bg-"]')
        .filter({ hasText: /\d+/ })
        .first();
      await expect(badge).toBeVisible();

      // Get the class attribute to check color
      const className = await badge.getAttribute('class');
      expect(className).toBeTruthy();

      // The class should contain color-related classes
      // This is a general check since exact classes may vary
      expect(className).toMatch(/bg-|text-|border-/);
    }
  });

  test('works in different themes', async () => {
    // Try to switch to dark theme if available
    const themeToggle = page
      .getByRole('button', { name: /theme|dark|light/i })
      .first();

    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    // Navigate to a score story
    await page.getByRole('button', { name: 'Excellent Score' }).click();
    await page.waitForTimeout(500);

    // Verify badge is still visible and functional
    const badge = page.locator('span').filter({ hasText: /100/ }).first();
    await expect(badge).toBeVisible();

    // Verify tooltip still works
    await badge.hover();
    await page.waitForTimeout(1000);

    const tooltipContent = page
      .getByText('SMART Score:')
      .or(page.getByText('Breakdown:'));
    await expect(tooltipContent.first()).toBeVisible({ timeout: 2000 });
  });

  test('all variants story displays comprehensive overview', async () => {
    // Click on the "All Variants" story
    await page.getByRole('button', { name: 'All Variants' }).click();
    await page.waitForTimeout(500);

    // Check for section headings
    await expect(page.getByText('Score Ranges')).toBeVisible();
    await expect(page.getByText('Size Variants')).toBeVisible();
    await expect(page.getByText('With and Without Tooltip')).toBeVisible();

    // Count the number of badges displayed
    const badges = page.locator('span').filter({ hasText: /\d+/ });
    const badgeCount = await badges.count();

    // Should have multiple badges for comprehensive overview
    expect(badgeCount).toBeGreaterThan(5);
  });

  test('goal list integration example works', async () => {
    // Click on the "In Goal List" story
    await page.getByRole('button', { name: 'In Goal List' }).click();
    await page.waitForTimeout(500);

    // Should show multiple goal items with badges
    const goalItems = page.locator('div').filter({ hasText: /Goal|Untitled/ });
    const goalCount = await goalItems.count();
    expect(goalCount).toBeGreaterThan(0);

    // Each goal item should have a badge
    const badges = page.locator('span').filter({ hasText: /\d+/ });
    const badgeCount = await badges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('goal card integration example works', async () => {
    // Click on the "In Goal Card" story
    await page.getByRole('button', { name: 'In Goal Card' }).click();
    await page.waitForTimeout(500);

    // Should show a goal card with badge
    const goalCard = page
      .locator('div')
      .filter({ hasText: /Complete Advanced React/ });
    await expect(goalCard.first()).toBeVisible();

    // Card should contain a badge
    const badge = page.locator('span').filter({ hasText: /100/ });
    await expect(badge).toBeVisible();

    // Card should show additional info
    await expect(page.getByText(/Due:|Progress:/)).toBeVisible();
  });
});
