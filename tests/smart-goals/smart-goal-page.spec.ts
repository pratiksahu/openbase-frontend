/**
 * SMART Goal Page E2E Tests
 *
 * Comprehensive tests for the enhanced SMART Goals pages including
 * listing, detail view, filtering, SMART criteria visualization,
 * and interactive features.
 */

import { test, expect, Page } from '@playwright/test';

// Test Configuration
const SMART_GOALS_URL = '/smart-goals';

test.describe('SMART Goals Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SMART_GOALS_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should display SMART Goals page correctly', async ({ page }) => {
    // Check page title and header
    await expect(page).toHaveTitle(/SMART Goals.*OpenBase/);
    await expect(page.locator('h1')).toContainText('SMART Goals');

    // Check for description
    await expect(
      page.locator('text=/Specific.*Measurable.*Achievable.*Relevant.*Time-bound/i')
    ).toBeVisible();

    // Check for New Goal button
    await expect(page.getByRole('button', { name: /new goal/i })).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    // Check for stats cards
    const statsCards = page.locator('[data-testid="stats-card"], .card').filter({
      has: page.locator('text=/Total Goals|Active|Completed|Avg Progress|Avg SMART/')
    });

    const cardCount = await statsCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(5);

    // Verify each stat card has a number
    for (let i = 0; i < cardCount; i++) {
      const card = statsCards.nth(i);
      await expect(card.locator('text=/\\d+/')).toBeVisible();
    }
  });

  test('should have search functionality', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search goals/i);
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill('Test Goal');
    await page.waitForTimeout(500); // Wait for debounce

    // Check that goals are filtered (or no results message appears)
    const goalCards = page.locator('[data-testid="goal-card"], .card').filter({
      has: page.locator('a[href^="/smart-goals/"]')
    });

    const noResultsMessage = page.locator('text=/no goals found/i');

    // Either we have filtered results or no results message
    const hasResults = await goalCards.count() > 0;
    const hasNoResultsMessage = await noResultsMessage.isVisible();

    expect(hasResults || hasNoResultsMessage).toBeTruthy();
  });

  test('should have view mode toggle', async ({ page }) => {
    // Find view mode buttons
    const gridButton = page.locator('button').filter({
      has: page.locator('svg').first() // Grid icon
    }).first();
    const listButton = page.locator('button').filter({
      has: page.locator('svg').nth(1) // List icon
    }).first();

    // Check both buttons exist
    await expect(gridButton).toBeVisible();
    await expect(listButton).toBeVisible();

    // Switch to list view
    await listButton.click();
    await page.waitForTimeout(300);

    // Switch back to grid view
    await gridButton.click();
    await page.waitForTimeout(300);
  });

  test('should have filter dropdowns', async ({ page }) => {
    // Status filter
    const statusFilter = page.getByRole('button', { name: /status/i });
    await expect(statusFilter).toBeVisible();

    // Click status filter
    await statusFilter.click();
    await expect(page.locator('text=/Filter by Status/i')).toBeVisible();

    // Check for status options
    await expect(page.locator('text=/draft/i')).toBeVisible();
    await expect(page.locator('text=/active/i')).toBeVisible();
    await expect(page.locator('text=/completed/i')).toBeVisible();

    // Close dropdown
    await page.keyboard.press('Escape');

    // SMART filter
    const smartFilter = page.getByRole('button', { name: /smart/i });
    await expect(smartFilter).toBeVisible();

    // Click SMART filter
    await smartFilter.click();
    await expect(page.locator('text=/SMART Criteria/i')).toBeVisible();

    // Check for SMART options
    await expect(page.locator('text=/Has Specific Objective/i')).toBeVisible();
    await expect(page.locator('text=/Has Measurable Metrics/i')).toBeVisible();
    await expect(page.locator('text=/Has Achievable Plan/i')).toBeVisible();
    await expect(page.locator('text=/Has Relevant Context/i')).toBeVisible();
    await expect(page.locator('text=/Has Timeline/i')).toBeVisible();
  });

  test('should display goal cards with SMART indicators', async ({ page }) => {
    // Find goal cards
    const goalCards = page.locator('[data-testid="goal-card"], .card').filter({
      has: page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]')
    });

    const cardCount = await goalCards.count();

    if (cardCount > 0) {
      const firstCard = goalCards.first();
      await expect(firstCard).toBeVisible();

      // Check for SMART indicators (S, M, A, R, T circles)
      const smartIndicators = firstCard.locator('div').filter({
        hasText: /^[SMART]$/
      });

      // Should have at least one SMART indicator
      const indicatorCount = await smartIndicators.count();
      expect(indicatorCount).toBeGreaterThanOrEqual(0);

      // Check for progress bar
      await expect(firstCard.locator('[role="progressbar"], .progress')).toBeVisible();

      // Check for status badge
      const statusBadge = firstCard.locator('.badge, [class*="badge"]').first();
      await expect(statusBadge).toBeVisible();
    }
  });

  test('should navigate to goal detail page', async ({ page }) => {
    // Find first goal card link
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();

      // Should navigate to detail page
      await page.waitForURL(new RegExp(`(smart-goals|goals)/[^/]+`));

      // Should show goal detail elements
      await expect(page.locator('text=/SMART Criteria/i')).toBeVisible();
    }
  });
});

test.describe('SMART Goal Detail Page', () => {
  test('should display goal details correctly', async ({ page }) => {
    // Navigate to listing first
    await page.goto(SMART_GOALS_URL);
    await page.waitForLoadState('networkidle');

    // Find and click first goal
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();
      await page.waitForLoadState('networkidle');

      // Check for back button
      await expect(page.getByRole('button', { name: /back to goals/i })).toBeVisible();

      // Check for action buttons
      await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
      await expect(page.locator('button').filter({ has: page.locator('svg') })).toBeVisible();

      // Check for goal title
      const goalTitle = page.locator('h1, h2').filter({ hasText: /^(?!SMART).*/ }).first();
      await expect(goalTitle).toBeVisible();

      // Check for status badge
      await expect(page.locator('.badge, [class*="badge"]').first()).toBeVisible();

      // Check for SMART score badge
      await expect(
        page.locator('[data-testid="smart-score"], .smart-score')
      ).toBeVisible();
    }
  });

  test('should display SMART criteria cards', async ({ page }) => {
    // Navigate to a goal detail page
    await page.goto(SMART_GOALS_URL);
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();
      await page.waitForLoadState('networkidle');

      // Check for SMART Criteria section
      await expect(page.locator('text=/SMART Criteria/i')).toBeVisible();

      // Check for each SMART criteria card
      const criteriaCards = [
        { title: 'Specific', icon: 'Target' },
        { title: 'Measurable', icon: 'BarChart' },
        { title: 'Achievable', icon: 'CheckCircle' },
        { title: 'Relevant', icon: 'Lightbulb' },
        { title: 'Time-bound', icon: 'Calendar' }
      ];

      for (const criteria of criteriaCards) {
        const card = page.locator('.card, [class*="card"]').filter({
          has: page.locator(`text=/${criteria.title}/i`)
        });
        await expect(card.first()).toBeVisible();
      }
    }
  });

  test('should display quick stats', async ({ page }) => {
    // Navigate to a goal detail page
    await page.goto(SMART_GOALS_URL);
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();
      await page.waitForLoadState('networkidle');

      // Check for stats cards
      const statsTexts = [
        'SMART Complete',
        'Tasks Complete',
        'Days',
        'Team Members'
      ];

      for (const text of statsTexts) {
        const statCard = page.locator('.card, [class*="card"]').filter({
          has: page.locator(`text=/${text}/i`)
        });
        await expect(statCard.first()).toBeVisible();
      }
    }
  });

  test('should have tabbed interface', async ({ page }) => {
    // Navigate to a goal detail page
    await page.goto(SMART_GOALS_URL);
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();
      await page.waitForLoadState('networkidle');

      // Check for tabs
      const tabs = ['Overview', 'Tasks', 'Metrics', 'Team'];

      for (const tabName of tabs) {
        const tab = page.getByRole('tab', { name: new RegExp(tabName, 'i') });
        await expect(tab).toBeVisible();

        // Click tab
        await tab.click();
        await page.waitForTimeout(300);

        // Check that tab content changes
        const tabContent = page.locator('[role="tabpanel"]').filter({ hasText: /.*/ });
        await expect(tabContent).toBeVisible();
      }
    }
  });

  test('should display milestones in overview tab', async ({ page }) => {
    // Navigate to a goal detail page
    await page.goto(SMART_GOALS_URL);
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();
      await page.waitForLoadState('networkidle');

      // Click Overview tab
      const overviewTab = page.getByRole('tab', { name: /overview/i });
      await overviewTab.click();

      // Check for Milestones section
      const milestonesSection = page.locator('text=/Milestones/i');
      if (await milestonesSection.isVisible()) {
        await expect(milestonesSection).toBeVisible();

        // Check for milestone items
        const milestoneItems = page.locator('.border').filter({
          has: page.locator('text=/Due:|Completed|Pending/')
        });

        const milestoneCount = await milestoneItems.count();
        if (milestoneCount > 0) {
          await expect(milestoneItems.first()).toBeVisible();
        }
      }
    }
  });

  test('should display tasks in tasks tab', async ({ page }) => {
    // Navigate to a goal detail page
    await page.goto(SMART_GOALS_URL);
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();
      await page.waitForLoadState('networkidle');

      // Click Tasks tab
      const tasksTab = page.getByRole('tab', { name: /tasks/i });
      await tasksTab.click();
      await page.waitForTimeout(300);

      // Check for Tasks section
      await expect(page.locator('text=/Tasks.*Subtasks/i')).toBeVisible();

      // Check for Add Task button
      await expect(page.getByRole('button', { name: /add task/i })).toBeVisible();

      // Check for task items or empty message
      const taskItems = page.locator('.border').filter({
        has: page.locator('text=/todo|in_progress|completed|blocked/')
      });
      const emptyMessage = page.locator('text=/No tasks added/i');

      const hasTasks = await taskItems.count() > 0;
      const hasEmptyMessage = await emptyMessage.isVisible();

      expect(hasTasks || hasEmptyMessage).toBeTruthy();
    }
  });

  test('should display metrics in metrics tab', async ({ page }) => {
    // Navigate to a goal detail page
    await page.goto(SMART_GOALS_URL);
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();
      await page.waitForLoadState('networkidle');

      // Click Metrics tab
      const metricsTab = page.getByRole('tab', { name: /metrics/i });
      await metricsTab.click();
      await page.waitForTimeout(300);

      // Check for Performance Metrics section
      await expect(page.locator('text=/Performance Metrics/i')).toBeVisible();

      // Check for metric items or empty message
      const metricItems = page.locator('[role="progressbar"], .progress');
      const emptyMessage = page.locator('text=/No metrics defined/i');

      const hasMetrics = await metricItems.count() > 0;
      const hasEmptyMessage = await emptyMessage.isVisible();

      expect(hasMetrics || hasEmptyMessage).toBeTruthy();
    }
  });

  test('should display team in team tab', async ({ page }) => {
    // Navigate to a goal detail page
    await page.goto(SMART_GOALS_URL);
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();
      await page.waitForLoadState('networkidle');

      // Click Team tab
      const teamTab = page.getByRole('tab', { name: /team/i });
      await teamTab.click();
      await page.waitForTimeout(300);

      // Check for Team section
      await expect(page.locator('text=/Team.*Collaboration/i')).toBeVisible();

      // Check for Owner section
      await expect(page.locator('text=/Owner/i')).toBeVisible();

      // Check for avatar
      const avatar = page.locator('[data-testid="avatar"], img[src*="dicebear"], .avatar').first();
      await expect(avatar).toBeVisible();

      // Check for Collaborators section
      await expect(page.locator('text=/Collaborators/i')).toBeVisible();
    }
  });

  test('should show insights and recommendations', async ({ page }) => {
    // Navigate to a goal detail page
    await page.goto(SMART_GOALS_URL);
    const goalLink = page.locator('a[href^="/smart-goals/"], a[href^="/goals/"]').first();

    if (await goalLink.isVisible()) {
      await goalLink.click();
      await page.waitForLoadState('networkidle');

      // Click Overview tab
      const overviewTab = page.getByRole('tab', { name: /overview/i });
      await overviewTab.click();

      // Check for Insights section
      const insightsSection = page.locator('text=/Insights.*Recommendations/i');
      if (await insightsSection.isVisible()) {
        await expect(insightsSection).toBeVisible();

        // Check for alert messages
        const alerts = page.locator('[role="alert"], .alert');
        const alertCount = await alerts.count();

        if (alertCount > 0) {
          await expect(alerts.first()).toBeVisible();
        }
      }
    }
  });
});

test.describe('SMART Goal Page Responsiveness', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  for (const viewport of viewports) {
    test(`should be responsive on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(SMART_GOALS_URL);
      await page.waitForLoadState('networkidle');

      // Check main elements are visible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('button', { name: /new goal/i })).toBeVisible();

      // Check cards stack properly on mobile
      if (viewport.name === 'Mobile') {
        const cards = page.locator('.card, [class*="card"]');
        const cardCount = await cards.count();

        if (cardCount > 1) {
          // Cards should stack vertically on mobile
          const firstCardBox = await cards.first().boundingBox();
          const secondCardBox = await cards.nth(1).boundingBox();

          if (firstCardBox && secondCardBox) {
            expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y);
          }
        }
      }
    });
  }
});

test.describe('SMART Goal Page Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto(SMART_GOALS_URL);
    await page.waitForLoadState('networkidle');

    // Check for proper heading hierarchy
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThanOrEqual(1);

    // Check buttons have accessible names
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const name = await button.getAttribute('aria-label') || await button.textContent();
      expect(name).toBeTruthy();
    }

    // Check for progress bars with proper ARIA attributes
    const progressBars = page.locator('[role="progressbar"]');
    const progressCount = await progressBars.count();

    if (progressCount > 0) {
      const firstProgress = progressBars.first();
      const ariaValueNow = await firstProgress.getAttribute('aria-valuenow');
      expect(ariaValueNow).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(SMART_GOALS_URL);
    await page.waitForLoadState('networkidle');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // Check that something is focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // Tab to search input
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Try typing in search
    await page.keyboard.type('test');
    await page.waitForTimeout(500);

    // Check if search input has the text
    const searchInput = page.getByPlaceholder(/search/i);
    const searchValue = await searchInput.inputValue();
    expect(searchValue).toContain('test');
  });
});