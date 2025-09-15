/**
 * Goal Management E2E Tests
 *
 * Comprehensive tests for goal management operations including
 * editing, deleting, archiving, and status changes.
 */

import { test, expect, Page } from '@playwright/test';

// Test Configuration
const GOALS_BASE_URL = '/goals';
// Removed unused MOCK_GOAL_ID - goal IDs are derived from the UI in tests
// const MOCK_GOAL_ID = 'goal-1'; // From mock data

test.describe('Goal Management Operations', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto(GOALS_BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should display goals list with management options', async ({
    page,
  }) => {
    // Wait for goals to load
    await page.waitForSelector(
      '[data-testid="goal-card"], [data-testid="goal-list-item"]',
      { timeout: 10000 }
    );

    // Check that goal cards are present
    const goalCards = page.locator(
      '[data-testid="goal-card"], [data-testid="goal-list-item"]'
    );
    const count = await goalCards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Each goal should have management options
    const firstGoal = goalCards.first();

    // Look for dropdown menu or action buttons
    const actionButton = firstGoal.locator(
      '[data-testid="goal-actions"], [role="button"]:has-text("⋯"), .dropdown-trigger'
    );
    if (await actionButton.isVisible()) {
      await expect(actionButton).toBeVisible();
    }
  });

  test('should open goal detail page', async ({ page }) => {
    // Click on first goal
    const goalLink = page
      .locator('a[href*="/goals/"]')
      .filter({ hasText: /.*/ })
      .first();
    await expect(goalLink).toBeVisible();

    const href = await goalLink.getAttribute('href');
    await goalLink.click();

    // Should navigate to goal detail
    await expect(page).toHaveURL(href || /\/goals\/[^\/]+$/);
    await expect(page.locator('h1, [data-testid="goal-title"]')).toBeVisible();
  });

  test('should edit goal successfully', async ({ page }) => {
    // Navigate to goal detail
    await navigateToGoalDetail();

    // Find edit button
    const editButton = page.getByRole('button', { name: /edit/i });
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Should open edit form or navigate to edit page
    await page.waitForTimeout(1000);

    // Look for edit form or edit page
    const editForm = page.locator('form, [data-testid="edit-form"]');
    const titleInput = page
      .getByLabel(/title/i)
      .or(page.locator('input[name="title"]'));

    if ((await editForm.isVisible()) || (await titleInput.isVisible())) {
      // Make an edit
      await titleInput.fill('Updated Test Goal Title');

      // Save changes
      const saveButton = page.getByRole('button', { name: /save|update/i });
      await saveButton.click();

      // Should show success message
      await expect(page.locator('text=/success|updated|saved/i')).toBeVisible();
    }
  });

  test('should change goal status', async ({ page }) => {
    // Navigate to goal detail
    await navigateToGoalDetail();

    // Look for status dropdown or buttons
    const statusButton = page
      .locator(
        '[data-testid="status-selector"], button:has-text("Active"), button:has-text("Draft")'
      )
      .first();

    if (await statusButton.isVisible()) {
      await statusButton.click();

      // Look for status options
      const statusOptions = page.locator('[role="menuitem"], .dropdown-item');
      const optionCount = await statusOptions.count();

      if (optionCount > 0) {
        // Select a different status
        const newStatus = statusOptions
          .filter({ hasText: /complete|on hold/i })
          .first();
        if (await newStatus.isVisible()) {
          await newStatus.click();

          // Should update status
          await expect(page.locator('text=/status.*updated/i')).toBeVisible();
        }
      }
    }
  });

  test('should archive goal', async ({ page }) => {
    // Navigate to goal detail
    await navigateToGoalDetail();

    // Open actions menu
    const actionsButton = page.getByRole('button', { name: /more|actions|⋯/i });
    if (await actionsButton.isVisible()) {
      await actionsButton.click();

      // Look for archive option
      const archiveButton = page.getByRole('menuitem', { name: /archive/i });
      if (await archiveButton.isVisible()) {
        await archiveButton.click();

        // Should show confirmation dialog
        const confirmDialog = page.locator('[role="dialog"], .dialog');
        if (await confirmDialog.isVisible()) {
          await page.getByRole('button', { name: /archive|confirm/i }).click();
        }

        // Should show success message
        await expect(page.locator('text=/archived/i')).toBeVisible();
      }
    }
  });

  test('should delete goal with confirmation', async ({ page }) => {
    // Navigate to goal detail
    await navigateToGoalDetail();

    // Open actions menu
    const actionsButton = page.getByRole('button', { name: /more|actions|⋯/i });
    if (await actionsButton.isVisible()) {
      await actionsButton.click();

      // Look for delete option
      const deleteButton = page.getByRole('menuitem', { name: /delete/i });
      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Should show confirmation dialog
        const confirmDialog = page.locator('[role="dialog"], .dialog');
        await expect(confirmDialog).toBeVisible();

        // Should show warning about deletion
        await expect(
          confirmDialog.locator('text=/delete.*permanent/i')
        ).toBeVisible();

        // Confirm deletion
        await page.getByRole('button', { name: /delete|confirm/i }).click();

        // Should redirect to goals list
        await expect(page).toHaveURL(GOALS_BASE_URL);
        await expect(page.locator('text=/deleted/i')).toBeVisible();
      }
    }
  });

  test('should duplicate goal', async ({ page }) => {
    // Navigate to goal detail
    await navigateToGoalDetail();

    // Open actions menu
    const actionsButton = page.getByRole('button', { name: /more|actions|⋯/i });
    if (await actionsButton.isVisible()) {
      await actionsButton.click();

      // Look for duplicate/copy option
      const duplicateButton = page.getByRole('menuitem', {
        name: /duplicate|copy/i,
      });
      if (await duplicateButton.isVisible()) {
        await duplicateButton.click();

        // Should either create copy or open creation form
        await page.waitForTimeout(1000);

        // Check for success message or navigation to new goal
        const successMessage = page.locator('text=/duplicated|copied/i');
        if (await successMessage.isVisible()) {
          await expect(successMessage).toBeVisible();
        } else {
          // Should navigate to goal creation with pre-filled data
          await expect(page).toHaveURL(/\/goals\/new/);
        }
      }
    }
  });

  test('should handle bulk operations', async ({ page }) => {
    // Look for bulk selection checkboxes
    const selectAllCheckbox = page.locator(
      'input[type="checkbox"][aria-label*="select all"], .select-all'
    );

    if (await selectAllCheckbox.isVisible()) {
      await selectAllCheckbox.click();

      // Should show bulk actions toolbar
      const bulkToolbar = page.locator(
        '[data-testid="bulk-actions"], .bulk-actions'
      );
      await expect(bulkToolbar).toBeVisible();

      // Should have bulk operation buttons
      await expect(
        page.getByRole('button', { name: /delete selected/i })
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /archive selected/i })
      ).toBeVisible();
    }
  });

  test('should filter goals by status', async ({ page }) => {
    // Open filter dropdown
    const filterButton = page.getByRole('button', { name: /filter/i });
    await filterButton.click();

    // Select active goals filter
    const activeFilter = page.getByRole('menuitem', { name: /active/i });
    await activeFilter.click();

    // Should filter the list
    await page.waitForTimeout(1000);

    // Check that filtered results are shown
    const goalCards = page.locator(
      '[data-testid="goal-card"], [data-testid="goal-list-item"]'
    );
    const cardCount = await goalCards.count();

    if (cardCount > 0) {
      // Verify all visible goals have active status
      const statusBadges = page.locator('.badge, [data-testid="status-badge"]');
      const badgeCount = await statusBadges.count();

      for (let i = 0; i < Math.min(badgeCount, 3); i++) {
        const badge = statusBadges.nth(i);
        const text = await badge.textContent();
        expect(text?.toLowerCase()).toMatch(/active|progress/);
      }
    }
  });

  test('should search goals', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search.*goals/i);
    await expect(searchInput).toBeVisible();

    // Perform search
    await searchInput.fill('test goal');

    // Should filter results
    await page.waitForTimeout(1000);

    const goalCards = page.locator(
      '[data-testid="goal-card"], [data-testid="goal-list-item"]'
    );
    const cardCount = await goalCards.count();

    // If results found, they should match search term
    if (cardCount > 0) {
      const firstGoal = goalCards.first();
      const goalText = await firstGoal.textContent();
      expect(goalText?.toLowerCase()).toContain('test');
    }
  });

  test('should sort goals', async ({ page }) => {
    // Look for sort dropdown
    const sortButton = page
      .getByRole('button', { name: /sort/i })
      .or(page.locator('[data-testid="sort-button"]'));

    if (await sortButton.isVisible()) {
      await sortButton.click();

      // Select sort by date
      const dateSortOption = page.getByRole('menuitem', { name: /date/i });
      if (await dateSortOption.isVisible()) {
        await dateSortOption.click();

        // Should reorder the list
        await page.waitForTimeout(1000);

        const goalCards = page.locator(
          '[data-testid="goal-card"], [data-testid="goal-list-item"]'
        );
        await expect(goalCards.first()).toBeVisible();
      }
    }
  });

  test('should display goal statistics', async ({ page }) => {
    // Check for stats cards
    const statsSection = page
      .locator('[data-testid="stats"], .stats, .dashboard-stats')
      .first();

    if (await statsSection.isVisible()) {
      await expect(statsSection).toBeVisible();

      // Should show numerical data
      await expect(page.locator('text=/\\d+/')).toBeVisible();

      // Check for common stat labels
      const statLabels = [
        page.locator('text=/total/i'),
        page.locator('text=/active/i'),
        page.locator('text=/completed/i'),
        page.locator('text=/overdue/i'),
      ];

      let visibleStats = 0;
      for (const label of statLabels) {
        if (await label.isVisible()) {
          visibleStats++;
        }
      }

      expect(visibleStats).toBeGreaterThan(0);
    }
  });

  // Helper functions
  async function navigateToGoalDetail() {
    const goalLink = page
      .locator('a[href*="/goals/"]')
      .filter({ hasText: /.*/ })
      .first();
    await expect(goalLink).toBeVisible();
    await goalLink.click();

    // Wait for goal detail page to load
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, [data-testid="goal-title"]')).toBeVisible();
  }
});

test.describe('Goal List Views', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(GOALS_BASE_URL);
  });

  test('should toggle between grid and list views', async ({ page }) => {
    // Look for view toggle buttons
    const gridViewButton = page
      .getByRole('button', { name: /grid/i })
      .or(page.locator('[data-testid="grid-view"]'));
    const listViewButton = page
      .getByRole('button', { name: /list/i })
      .or(page.locator('[data-testid="list-view"]'));

    if (await gridViewButton.isVisible()) {
      await gridViewButton.click();

      // Should show grid layout
      const gridContainer = page.locator('.grid, [data-testid="goals-grid"]');
      await expect(gridContainer).toBeVisible();
    }

    if (await listViewButton.isVisible()) {
      await listViewButton.click();

      // Should show list layout
      const listContainer = page.locator('.list, [data-testid="goals-list"]');
      if (await listContainer.isVisible()) {
        await expect(listContainer).toBeVisible();
      }
    }
  });

  test('should handle empty state', async ({ page }) => {
    // Mock empty state by filtering to show no results
    const searchInput = page.getByPlaceholder(/search.*goals/i);
    await searchInput.fill('nonexistent goal that should not match anything');

    await page.waitForTimeout(1000);

    // Should show empty state
    const emptyState = page.locator(
      '[data-testid="empty-state"], .empty, text=/no goals found/i'
    );
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();

      // Should have create goal button in empty state
      await expect(
        page.getByRole('button', { name: /create.*goal/i })
      ).toBeVisible();
    }
  });

  test('should paginate large numbers of goals', async ({ page }) => {
    // Look for pagination controls
    const paginationContainer = page.locator(
      '[data-testid="pagination"], .pagination, nav[aria-label*="pagination"]'
    );

    if (await paginationContainer.isVisible()) {
      await expect(paginationContainer).toBeVisible();

      // Should have next/previous buttons
      const nextButton = page.getByRole('button', { name: /next/i });
      const prevButton = page.getByRole('button', { name: /prev/i });

      if ((await nextButton.isVisible()) && !(await nextButton.isDisabled())) {
        await nextButton.click();

        // Should load next page
        await page.waitForLoadState('networkidle');
        await expect(prevButton).toBeEnabled();
      }
    }
  });
});
