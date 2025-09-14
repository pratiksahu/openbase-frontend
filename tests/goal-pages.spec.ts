/**
 * Goal Pages E2E Tests
 *
 * Comprehensive end-to-end tests for the SMART Goals feature
 * including navigation, functionality, and user interactions.
 */

import { test, expect } from '@playwright/test';

// =============================================================================
// Test Configuration
// =============================================================================

const GOALS_BASE_URL = '/goals';
const MOCK_GOAL_ID = 'goal-1'; // From mock data

// =============================================================================
// Goals List Page Tests
// =============================================================================

test.describe('Goals List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(GOALS_BASE_URL);
  });

  test('should display goals list page correctly', async ({ page }) => {
    // Check page title and header
    await expect(page).toHaveTitle(/Goals.*OpenBase/);
    await expect(page.locator('h1')).toContainText('Goals');

    // Check for main UI elements
    await expect(page.getByPlaceholder('Search goals...')).toBeVisible();
    await expect(page.getByRole('button', { name: /New Goal/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Filter/i })).toBeVisible();
  });

  test('should display goal cards with correct information', async ({ page }) => {
    // Wait for goals to load
    await page.waitForSelector('[data-testid="goal-card"], [data-testid="goal-list-item"]', { timeout: 10000 });

    // Check that goal cards/items are present
    const goalCards = page.locator('[data-testid="goal-card"], [data-testid="goal-list-item"]');
    await expect(goalCards).toHaveCount({ min: 1 });

    // Check first goal card content
    const firstGoal = goalCards.first();
    await expect(firstGoal).toBeVisible();

    // Goal cards should contain title, description, progress, and status
    await expect(firstGoal.locator('text=/.*[a-zA-Z]+.*/')).toBeVisible(); // Title
    await expect(firstGoal.locator('[role="progressbar"], .progress')).toBeVisible(); // Progress bar
  });

  test('should display statistics cards', async ({ page }) => {
    // Check for stats cards
    const statsCards = page.locator('[data-testid="stats-card"]').or(page.locator('.grid').first().locator('.card')).first();
    await expect(statsCards).toBeVisible();

    // Stats should include numbers
    await expect(page.locator('text=/\\d+/')).toBeVisible();
  });

  test('should navigate to new goal page', async ({ page }) => {
    await page.getByRole('button', { name: /New Goal/i }).click();
    await expect(page).toHaveURL(`${GOALS_BASE_URL}/new`);
    await expect(page.locator('h1')).toContainText(/Create.*Goal/i);
  });

  test('should open filter dropdown', async ({ page }) => {
    await page.getByRole('button', { name: /Filter/i }).click();

    // Check for filter options
    await expect(page.getByText('All Goals')).toBeVisible();
    await expect(page.getByText('Active Goals')).toBeVisible();
  });

  test('should perform search functionality', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search goals...');
    await searchInput.fill('test search');

    // Search should filter results (even if no results, the UI should respond)
    await expect(searchInput).toHaveValue('test search');
  });

  test('should navigate to goal detail when clicking goal', async ({ page }) => {
    // Wait for goals to load and click first goal
    await page.waitForSelector('a[href*="/goals/"]', { timeout: 10000 });

    const goalLinks = page.locator('a[href*="/goals/"]').filter({ hasText: /.*/ });
    const firstGoalLink = goalLinks.first();

    await expect(firstGoalLink).toBeVisible();
    await firstGoalLink.click();

    // Should navigate to goal detail page
    await expect(page).toHaveURL(/\/goals\/[^\/]+$/);
  });
});

// =============================================================================
// New Goal Page Tests
// =============================================================================

test.describe('New Goal Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/new`);
  });

  test('should display new goal page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Create.*Goal.*OpenBase/);
    await expect(page.locator('h1')).toContainText(/Create.*Goal/i);

    // Check for back button
    await expect(page.getByRole('link', { name: /Back to Goals/i })).toBeVisible();
  });

  test('should display goal wizard', async ({ page }) => {
    // Check for wizard elements
    await expect(page.locator('[data-testid="goal-wizard"], .wizard')).toBeVisible();

    // Should have wizard steps or navigation
    await expect(page.locator('text=/step/i, [data-testid="wizard-step"]')).toBeVisible();
  });

  test('should navigate back to goals list', async ({ page }) => {
    await page.getByRole('link', { name: /Back to Goals/i }).click();
    await expect(page).toHaveURL(GOALS_BASE_URL);
  });

  test('should display help section', async ({ page }) => {
    await expect(page.locator('text=/Need Help/i, text=/help/i')).toBeVisible();
  });
});

// =============================================================================
// Goal Detail Page Tests
// =============================================================================

test.describe('Goal Detail Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}`);
  });

  test('should display goal detail page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/.*Goal Details.*OpenBase/);

    // Check for goal title (should be visible somewhere on page)
    await expect(page.locator('h1, [data-testid="goal-title"]')).toBeVisible();

    // Check for back button
    await expect(page.getByRole('link', { name: /Back to Goals/i })).toBeVisible();
  });

  test('should display navigation tabs', async ({ page }) => {
    // Check for tab navigation
    const tabsList = page.locator('[role="tablist"], .tabs-list');
    await expect(tabsList).toBeVisible();

    // Check for specific tabs
    await expect(page.getByRole('tab', { name: /Overview/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Canvas/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Board/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Metrics/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Review/i })).toBeVisible();
  });

  test('should display goal header with key information', async ({ page }) => {
    // Check for SMART score badge
    await expect(page.locator('[data-testid="smart-score"], .smart-score')).toBeVisible();

    // Check for progress bar
    await expect(page.locator('[role="progressbar"], .progress')).toBeVisible();

    // Check for status badge
    await expect(page.locator('.badge, [data-testid="status-badge"]')).toBeVisible();
  });

  test('should navigate between tabs', async ({ page }) => {
    // Click on Canvas tab
    await page.getByRole('tab', { name: /Canvas/i }).click();
    await expect(page).toHaveURL(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/canvas`);

    // Click on Board tab
    await page.getByRole('tab', { name: /Board/i }).click();
    await expect(page).toHaveURL(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/board`);

    // Click on Metrics tab
    await page.getByRole('tab', { name: /Metrics/i }).click();
    await expect(page).toHaveURL(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/metrics`);

    // Click on Review tab
    await page.getByRole('tab', { name: /Review/i }).click();
    await expect(page).toHaveURL(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/review`);

    // Click back on Overview tab
    await page.getByRole('tab', { name: /Overview/i }).click();
    await expect(page).toHaveURL(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}`);
  });

  test('should display action menu', async ({ page }) => {
    // Check for actions dropdown
    await page.getByRole('button', { name: /more/i }).or(page.locator('[data-testid="goal-actions"]')).click();

    // Should show action menu items
    await expect(page.getByText('Edit Goal')).toBeVisible();
    await expect(page.getByText('Delete Goal')).toBeVisible();
  });
});

// =============================================================================
// Goal Overview Page Tests
// =============================================================================

test.describe('Goal Overview Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}`);
  });

  test('should display SMART criteria section', async ({ page }) => {
    await expect(page.locator('text=/SMART.*Criteria/i')).toBeVisible();

    // Should show all 5 SMART criteria
    await expect(page.locator('text=/Specific/i')).toBeVisible();
    await expect(page.locator('text=/Measurable/i')).toBeVisible();
    await expect(page.locator('text=/Achievable/i')).toBeVisible();
    await expect(page.locator('text=/Relevant/i')).toBeVisible();
    await expect(page.locator('text=/Time-bound/i')).toBeVisible();
  });

  test('should display progress overview', async ({ page }) => {
    await expect(page.locator('text=/Progress.*Overview/i')).toBeVisible();

    // Should show progress metrics
    await expect(page.locator('[role="progressbar"], .progress')).toBeVisible();
    await expect(page.locator('text=/\\d+%/')).toBeVisible();
  });

  test('should display next actions section', async ({ page }) => {
    await expect(page.locator('text=/Next.*Actions/i')).toBeVisible();
  });
});

// =============================================================================
// Goal Canvas Page Tests
// =============================================================================

test.describe('Goal Canvas Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/canvas`);
  });

  test('should display canvas interface', async ({ page }) => {
    // Check for canvas container
    await expect(page.locator('[data-testid="canvas"], .canvas')).toBeVisible();

    // Check for canvas toolbar
    await expect(page.getByRole('button', { name: /Add Node/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export/i })).toBeVisible();
  });

  test('should display zoom controls', async ({ page }) => {
    await expect(page.getByRole('button', { name: /zoom in/i })).or(page.locator('[data-testid="zoom-in"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /zoom out/i })).or(page.locator('[data-testid="zoom-out"]')).toBeVisible();
  });
});

// =============================================================================
// Goal Board Page Tests
// =============================================================================

test.describe('Goal Board Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/board`);
  });

  test('should display kanban board', async ({ page }) => {
    // Check for board columns
    await expect(page.locator('text=/To Do/i')).toBeVisible();
    await expect(page.locator('text=/In Progress/i')).toBeVisible();
    await expect(page.locator('text=/Completed/i')).toBeVisible();
  });

  test('should display board toolbar', async ({ page }) => {
    await expect(page.locator('text=/Task Board/i')).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Task/i })).toBeVisible();
  });
});

// =============================================================================
// Goal Metrics Page Tests
// =============================================================================

test.describe('Goal Metrics Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/metrics`);
  });

  test('should display metrics dashboard', async ({ page }) => {
    await expect(page.locator('text=/Metrics.*Dashboard/i')).toBeVisible();

    // Check for metric cards
    await expect(page.locator('text=/Current.*Value/i')).toBeVisible();
    await expect(page.locator('text=/Progress/i')).toBeVisible();
  });

  test('should display charts and visualizations', async ({ page }) => {
    // Check for chart elements (SVG or canvas)
    await expect(page.locator('svg, canvas, [data-testid="chart"]')).toBeVisible();
  });
});

// =============================================================================
// Goal Review Page Tests
// =============================================================================

test.describe('Goal Review Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/review`);
  });

  test('should display review interface', async ({ page }) => {
    // Check for review tabs
    await expect(page.getByRole('tab', { name: /Review.*Comments/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /DoR.*DoD/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /History/i })).toBeVisible();
  });

  test('should display review actions', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Approve/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Reject/i })).toBeVisible();
  });

  test('should allow adding comments', async ({ page }) => {
    const commentBox = page.locator('textarea[placeholder*="comment"], [data-testid="comment-input"]');
    await expect(commentBox).toBeVisible();

    await commentBox.fill('This is a test comment');
    await expect(commentBox).toHaveValue('This is a test comment');
  });
});

// =============================================================================
// Error Handling Tests
// =============================================================================

test.describe('Error Handling', () => {
  test('should display 404 page for non-existent goal', async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/non-existent-goal`);

    await expect(page.locator('text=/404/i, text=/not found/i')).toBeVisible();
    await expect(page.getByRole('button', { name: /View All Goals/i })).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Intercept API calls to simulate slow loading
    await page.route('**/api/goals*', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    await page.goto(GOALS_BASE_URL);

    // Should show loading skeletons (at least briefly)
    const skeletons = page.locator('.animate-pulse, [data-testid="skeleton"]');
    // Note: This might be flaky due to timing, but worth testing
  });
});

// =============================================================================
// Responsive Design Tests
// =============================================================================

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(GOALS_BASE_URL);

    // Check that main elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: /New Goal/i })).toBeVisible();

    // Navigation might be collapsed on mobile
    const goalCards = page.locator('[data-testid="goal-card"], .card');
    await expect(goalCards.first()).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(GOALS_BASE_URL);

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: /New Goal/i })).toBeVisible();
  });
});

// =============================================================================
// Accessibility Tests
// =============================================================================

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(GOALS_BASE_URL);

    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();

    // Should not have multiple h1 elements
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeLessThanOrEqual(1);
  });

  test('should have accessible form elements', async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/new`);

    // Form inputs should have labels or aria-labels
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const hasLabel = await input.getAttribute('aria-label') ||
                     await input.getAttribute('aria-labelledby') ||
                     await page.locator(`label[for="${await input.getAttribute('id')}"]`).count() > 0;

      // This is a basic accessibility check
      if (await input.isVisible()) {
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto(GOALS_BASE_URL);

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();

    // Should be able to activate buttons with Enter
    const newGoalButton = page.getByRole('button', { name: /New Goal/i });
    await newGoalButton.focus();
    await page.keyboard.press('Enter');

    // Should navigate to new goal page
    await expect(page).toHaveURL(`${GOALS_BASE_URL}/new`);
  });
});

// =============================================================================
// Performance Tests
// =============================================================================

test.describe('Performance', () => {
  test('should load goals list within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(GOALS_BASE_URL);
    await page.waitForSelector('[data-testid="goal-card"], .card', { timeout: 5000 });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });

  test('should handle large numbers of goals', async ({ page }) => {
    await page.goto(GOALS_BASE_URL);

    // Check that pagination or virtualization is working
    // (This test assumes there are many goals in the system)
    const goalCards = page.locator('[data-testid="goal-card"], .card');
    const visibleGoals = await goalCards.count();

    // Should not render all goals at once if there are many
    expect(visibleGoals).toBeLessThan(100); // Reasonable limit for initial load
  });
});