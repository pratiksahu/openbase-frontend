/**
 * BreakdownTree E2E Test Suite
 *
 * Comprehensive end-to-end tests for the BreakdownTree component
 * covering user interactions, accessibility, and real-world scenarios.
 *
 * @fileoverview Playwright E2E tests for BreakdownTree component
 * @version 1.0.0
 */

import { test, expect, type Page, type Locator } from '@playwright/test';

// =============================================================================
// Test Configuration
// =============================================================================

test.describe('BreakdownTree Component', () => {
  // URL where the BreakdownTree component is mounted for testing
  const COMPONENT_URL = '/storybook/?path=/story/components-breakdowntree--default';

  test.beforeEach(async ({ page }) => {
    // Navigate to the Storybook story
    await page.goto(COMPONENT_URL);

    // Wait for the component to load
    await page.waitForSelector('[role="tree"]', { timeout: 10000 });
  });

  // ===========================================================================
  // Basic Rendering Tests
  // ===========================================================================

  test.describe('Rendering', () => {
    test('should render tree structure', async ({ page }) => {
      // Check if tree container is present
      const tree = page.locator('[role="tree"]');
      await expect(tree).toBeVisible();

      // Check if tree items are present
      const treeItems = page.locator('[role="treeitem"]');
      await expect(treeItems).toHaveCount(3); // Goal, task, milestone

      // Check if expand/collapse buttons are present for parent nodes
      const expandButtons = page.locator('button[aria-label*="Expand"], button[aria-label*="Collapse"]');
      await expect(expandButtons.first()).toBeVisible();
    });

    test('should display node information correctly', async ({ page }) => {
      // Check if node titles are displayed
      await expect(page.getByText('Test Goal')).toBeVisible();
      await expect(page.getByText('Test Task')).toBeVisible();
      await expect(page.getByText('Test Milestone')).toBeVisible();

      // Check if progress indicators are shown
      await expect(page.getByText('50%')).toBeVisible(); // Goal progress
      await expect(page.getByText('25%')).toBeVisible(); // Task progress
      await expect(page.getByText('75%')).toBeVisible(); // Milestone progress

      // Check if status badges are displayed
      await expect(page.getByText('active')).toBeVisible();
      await expect(page.getByText('in progress')).toBeVisible();
    });

    test('should render search and filter controls', async ({ page }) => {
      // Check search input
      const searchInput = page.getByPlaceholder('Search nodes...');
      await expect(searchInput).toBeVisible();

      // Check filter button
      const filterButton = page.getByRole('button', { name: /filters/i });
      await expect(filterButton).toBeVisible();

      // Check tree controls
      await expect(page.getByRole('button', { name: /expand all/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /collapse all/i })).toBeVisible();
    });
  });

  // ===========================================================================
  // Node Interaction Tests
  // ===========================================================================

  test.describe('Node Interactions', () => {
    test('should expand and collapse nodes', async ({ page }) => {
      const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');
      const expandButton = goalNode.locator('button[aria-label*="Expand"], button[aria-label*="Collapse"]').first();

      // Initially expanded - collapse it
      await expandButton.click();
      await expect(goalNode).toHaveAttribute('aria-expanded', 'false');

      // Child nodes should be hidden
      const taskNode = page.getByText('Test Task').locator('..').locator('[role="treeitem"]');
      await expect(taskNode).not.toBeVisible();

      // Expand again
      await expandButton.click();
      await expect(goalNode).toHaveAttribute('aria-expanded', 'true');

      // Child nodes should be visible
      await expect(taskNode).toBeVisible();
    });

    test('should select nodes on click', async ({ page }) => {
      const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');

      // Click to select
      await goalNode.click();

      // Check if node is selected (visual feedback)
      await expect(goalNode).toHaveAttribute('aria-selected', 'true');

      // Should show selection count
      await expect(page.getByText('1 selected')).toBeVisible();
    });

    test('should support multi-selection with Ctrl+click', async ({ page }) => {
      // First switch to multi-selection mode (if needed)
      // This might require changing the story controls

      const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');
      const taskNode = page.getByText('Test Task').locator('..').locator('[role="treeitem"]');

      // Select first node
      await goalNode.click();
      await expect(goalNode).toHaveAttribute('aria-selected', 'true');

      // Select second node with Ctrl
      await taskNode.click({ modifiers: ['Control'] });
      await expect(taskNode).toHaveAttribute('aria-selected', 'true');

      // Both should remain selected
      await expect(goalNode).toHaveAttribute('aria-selected', 'true');
    });

    test('should show action menu on hover and click', async ({ page }) => {
      const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');

      // Hover to show action button
      await goalNode.hover();

      // Find and click the action menu button
      const actionButton = goalNode.locator('button[aria-label*="More actions"], button:has-text("⋯")');
      await expect(actionButton).toBeVisible();

      await actionButton.click();

      // Check if dropdown menu appears
      await expect(page.getByText('Edit')).toBeVisible();
      await expect(page.getByText('Delete')).toBeVisible();
    });
  });

  // ===========================================================================
  // Search and Filter Tests
  // ===========================================================================

  test.describe('Search and Filters', () => {
    test('should search and filter nodes', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search nodes...');

      // Type search query
      await searchInput.fill('Task');

      // Wait for search results
      await page.waitForTimeout(500);

      // Should show filtered results
      await expect(page.getByText('Test Task')).toBeVisible();

      // Other nodes should be filtered out or highlighted
      const resultText = page.getByText(/\d+ of \d+ nodes/);
      await expect(resultText).toBeVisible();
    });

    test('should open and use filter controls', async ({ page }) => {
      const filterButton = page.getByRole('button', { name: /filters/i });

      // Open filter popover
      await filterButton.click();

      // Wait for popover to appear
      await expect(page.getByText('Node Types')).toBeVisible();

      // Toggle a filter option
      const goalTypeFilter = page.getByLabel('goal');
      if (await goalTypeFilter.isChecked()) {
        await goalTypeFilter.uncheck();
      } else {
        await goalTypeFilter.check();
      }

      // Close filter and check results
      await page.keyboard.press('Escape');

      // Results should be filtered
      await expect(page.getByText(/\d+ of \d+ nodes/)).toBeVisible();
    });

    test('should clear search and filters', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search nodes...');

      // Add search term
      await searchInput.fill('Task');
      await page.waitForTimeout(500);

      // Clear search
      const clearButton = page.locator('button:near(:text("Task"))').first();
      if (await clearButton.isVisible()) {
        await clearButton.click();
      } else {
        await searchInput.clear();
      }

      // All nodes should be visible again
      await expect(page.getByText('Test Goal')).toBeVisible();
      await expect(page.getByText('Test Task')).toBeVisible();
      await expect(page.getByText('Test Milestone')).toBeVisible();
    });
  });

  // ===========================================================================
  // Tree Controls Tests
  // ===========================================================================

  test.describe('Tree Controls', () => {
    test('should expand all nodes', async ({ page }) => {
      const expandAllButton = page.getByRole('button', { name: /expand all/i });

      await expandAllButton.click();

      // All expandable nodes should be expanded
      const expandableNodes = page.locator('[role="treeitem"][aria-expanded]');
      const count = await expandableNodes.count();

      for (let i = 0; i < count; i++) {
        await expect(expandableNodes.nth(i)).toHaveAttribute('aria-expanded', 'true');
      }
    });

    test('should collapse all nodes', async ({ page }) => {
      // First expand all
      await page.getByRole('button', { name: /expand all/i }).click();

      // Then collapse all
      const collapseAllButton = page.getByRole('button', { name: /collapse all/i });
      await collapseAllButton.click();

      // All expandable nodes should be collapsed
      const expandableNodes = page.locator('[role="treeitem"][aria-expanded]');
      const count = await expandableNodes.count();

      for (let i = 0; i < count; i++) {
        await expect(expandableNodes.nth(i)).toHaveAttribute('aria-expanded', 'false');
      }
    });

    test('should display correct node counts', async ({ page }) => {
      // Check initial count
      await expect(page.getByText(/3.*nodes/)).toBeVisible();

      // Search to reduce visible nodes
      const searchInput = page.getByPlaceholder('Search nodes...');
      await searchInput.fill('Goal');
      await page.waitForTimeout(500);

      // Count should be updated
      await expect(page.getByText(/1 of 3 nodes/)).toBeVisible();
    });
  });

  // ===========================================================================
  // Keyboard Navigation Tests
  // ===========================================================================

  test.describe('Keyboard Navigation', () => {
    test('should navigate with arrow keys', async ({ page }) => {
      // Focus the first tree item
      const firstNode = page.locator('[role="treeitem"]').first();
      await firstNode.focus();

      // Press Arrow Down to move to next node
      await page.keyboard.press('ArrowDown');

      // Check if focus moved
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toHaveAttribute('role', 'treeitem');
    });

    test('should expand/collapse with arrow keys', async ({ page }) => {
      const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');

      // Focus the goal node
      await goalNode.focus();

      // Press Right Arrow to expand
      await page.keyboard.press('ArrowRight');
      await expect(goalNode).toHaveAttribute('aria-expanded', 'true');

      // Press Left Arrow to collapse
      await page.keyboard.press('ArrowLeft');
      await expect(goalNode).toHaveAttribute('aria-expanded', 'false');
    });

    test('should select with Enter and Space', async ({ page }) => {
      const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');

      // Focus and press Enter
      await goalNode.focus();
      await page.keyboard.press('Enter');

      // Should be selected
      await expect(goalNode).toHaveAttribute('aria-selected', 'true');

      // Press Space to toggle (if multi-select is enabled)
      await page.keyboard.press('Space');
    });

    test('should navigate to first/last nodes with Home/End', async ({ page }) => {
      const firstNode = page.locator('[role="treeitem"]').first();
      const lastNode = page.locator('[role="treeitem"]').last();

      // Focus any node and press Home
      await firstNode.focus();
      await page.keyboard.press('Home');

      // Should be on first node
      await expect(page.locator(':focus')).toBe(firstNode);

      // Press End
      await page.keyboard.press('End');

      // Should be on last node
      await expect(page.locator(':focus')).toBe(lastNode);
    });
  });

  // ===========================================================================
  // Drag and Drop Tests
  // ===========================================================================

  test.describe('Drag and Drop', () => {
    test('should support drag and drop reordering', async ({ page }) => {
      // Enable drag and drop if not already enabled
      const taskNode = page.getByText('Test Task').locator('..').locator('[role="treeitem"]');
      const milestoneNode = page.getByText('Test Milestone').locator('..').locator('[role="treeitem"]');

      // Get initial positions
      const taskBox = await taskNode.boundingBox();
      const milestoneBox = await milestoneNode.boundingBox();

      if (taskBox && milestoneBox) {
        // Drag task below milestone
        await taskNode.hover();
        await page.mouse.down();
        await page.mouse.move(milestoneBox.x, milestoneBox.y + milestoneBox.height);
        await page.mouse.up();

        // Wait for the operation to complete
        await page.waitForTimeout(500);

        // Verify the order changed (task should now be after milestone)
        const treeItems = page.locator('[role="treeitem"]');
        const taskIndex = await treeItems.locator(':has-text("Test Task")').first().boundingBox();
        const milestoneIndex = await treeItems.locator(':has-text("Test Milestone")').first().boundingBox();

        if (taskIndex && milestoneIndex) {
          expect(taskIndex.y).toBeGreaterThan(milestoneIndex.y);
        }
      }
    });

    test('should show drag feedback during operation', async ({ page }) => {
      const taskNode = page.getByText('Test Task').locator('..').locator('[role="treeitem"]');

      // Start drag operation
      await taskNode.hover();
      await page.mouse.down();

      // Should show drag overlay or visual feedback
      await expect(page.locator('[class*="drag"], [data-dragging="true"]')).toBeVisible();

      // End drag
      await page.mouse.up();
    });

    test('should validate drop targets', async ({ page }) => {
      // Try to drag a node to an invalid location
      // This test would depend on the specific validation rules
      const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');
      const taskNode = page.getByText('Test Task').locator('..').locator('[role="treeitem"]');

      await goalNode.hover();
      await page.mouse.down();

      // Try to drop goal onto its own child (should be invalid)
      await taskNode.hover();

      // Should show invalid drop indicator
      await expect(page.locator('[class*="invalid"], [data-valid="false"]')).toBeVisible();

      await page.mouse.up();
    });
  });

  // ===========================================================================
  // Accessibility Tests
  // ===========================================================================

  test.describe('Accessibility', () => {
    test('should have proper ARIA structure', async ({ page }) => {
      // Check tree role
      await expect(page.locator('[role="tree"]')).toBeVisible();

      // Check treeitem roles
      const treeItems = page.locator('[role="treeitem"]');
      await expect(treeItems).toHaveCount(3);

      // Check ARIA attributes
      const expandableItems = page.locator('[role="treeitem"][aria-expanded]');
      const count = await expandableItems.count();

      for (let i = 0; i < count; i++) {
        const item = expandableItems.nth(i);
        await expect(item).toHaveAttribute('aria-level');
        await expect(item).toHaveAttribute('aria-selected');
      }
    });

    test('should have proper focus management', async ({ page }) => {
      const treeItems = page.locator('[role="treeitem"]');

      // First item should be focusable
      await expect(treeItems.first()).toHaveAttribute('tabindex', '0');

      // Other items should not be in tab order initially
      const otherItems = treeItems.nth(1);
      await expect(otherItems).toHaveAttribute('tabindex', '-1');
    });

    test('should announce state changes to screen readers', async ({ page }) => {
      // This test checks for live regions and announcements
      const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');

      // Expand node
      const expandButton = goalNode.locator('button[aria-label*="Expand"]').first();
      await expandButton.click();

      // Should update aria-expanded
      await expect(goalNode).toHaveAttribute('aria-expanded', 'true');

      // Should have descriptive labels
      await expect(expandButton).toHaveAttribute('aria-label');
    });

    test('should provide keyboard shortcuts help', async ({ page }) => {
      // Check if keyboard shortcuts are documented or accessible
      // This might be in a help dialog or tooltip

      // Press F1 or look for help button
      await page.keyboard.press('F1');

      // Or check for accessible description
      const tree = page.locator('[role="tree"]');
      const describedBy = await tree.getAttribute('aria-describedby');

      if (describedBy) {
        const description = page.locator(`#${describedBy}`);
        await expect(description).toBeVisible();
      }
    });
  });

  // ===========================================================================
  // Performance Tests
  // ===========================================================================

  test.describe('Performance', () => {
    test('should handle large datasets efficiently', async ({ page }) => {
      // Navigate to large dataset story
      await page.goto('/storybook/?path=/story/components-breakdowntree--large-dataset');

      // Wait for component to load
      await page.waitForSelector('[role="tree"]', { timeout: 15000 });

      // Should render without hanging
      await expect(page.getByText(/100.*nodes/)).toBeVisible();

      // Search should be responsive
      const searchInput = page.getByPlaceholder('Search nodes...');
      await searchInput.fill('Goal 50');

      // Should find results quickly
      await page.waitForTimeout(1000);
      await expect(page.getByText(/of 100 nodes/)).toBeVisible();
    });

    test('should maintain smooth animations', async ({ page }) => {
      const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');
      const expandButton = goalNode.locator('button[aria-label*="Expand"], button[aria-label*="Collapse"]').first();

      // Measure animation performance
      const startTime = Date.now();

      await expandButton.click();
      await page.waitForSelector('[role="treeitem"]:has-text("Test Task")', { state: 'visible' });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Animation should complete within reasonable time
      expect(duration).toBeLessThan(1000);
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  test.describe('Error Handling', () => {
    test('should display error states gracefully', async ({ page }) => {
      // Navigate to error state story
      await page.goto('/storybook/?path=/story/components-breakdowntree--error-state');

      // Should show error message
      await expect(page.getByText(/failed to load tree data/i)).toBeVisible();

      // Should not show tree content
      await expect(page.locator('[role="tree"]')).not.toBeVisible();
    });

    test('should handle empty states', async ({ page }) => {
      // Navigate to empty state story
      await page.goto('/storybook/?path=/story/components-breakdowntree--empty-state');

      // Should show empty state message
      await expect(page.getByText(/no nodes to display/i)).toBeVisible();

      // Should show helpful message
      await expect(page.getByText(/get started by creating/i)).toBeVisible();
    });

    test('should recover from network errors', async ({ page }) => {
      // This test would simulate network failures and recovery
      // Implementation depends on how the component handles async operations

      // Simulate network failure during operation
      await page.route('**/api/**', (route) => {
        route.abort();
      });

      // Try to perform an operation that requires network
      const actionButton = page.locator('button[aria-label*="More actions"]').first();
      if (await actionButton.isVisible()) {
        await actionButton.click();
        await page.getByText('Delete').click();

        // Should show error feedback
        await expect(page.locator('[class*="error"], [role="alert"]')).toBeVisible();
      }
    });
  });

  // ===========================================================================
  // Cross-browser Compatibility Tests
  // ===========================================================================

  test.describe('Cross-browser Compatibility', () => {
    ['chromium', 'firefox', 'webkit'].forEach((browserName) => {
      test(`should work correctly in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
        // Skip if not the target browser
        test.skip(currentBrowser !== browserName, `Skipping ${browserName} test`);

        // Basic functionality test
        await expect(page.locator('[role="tree"]')).toBeVisible();
        await expect(page.getByText('Test Goal')).toBeVisible();

        // Interactive functionality
        const goalNode = page.getByText('Test Goal').locator('..').locator('[role="treeitem"]');
        await goalNode.click();
        await expect(goalNode).toHaveAttribute('aria-selected', 'true');
      });
    });
  });
});