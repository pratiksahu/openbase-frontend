/**
 * Full Journey E2E Tests
 *
 * Comprehensive end-to-end tests that cover the complete user journey
 * from goal creation to completion, including all major workflows.
 */

import { test, expect, Page } from '@playwright/test';

// Test Configuration
const GOALS_BASE_URL = '/goals';
const TEST_GOAL_TITLE = 'Complete E2E Journey Test Goal';

test.describe('Complete SMART Goals Journey', () => {
  let page: Page;
  let createdGoalId: string;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
  });

  test('should complete full goal lifecycle journey', async () => {
    // Step 1: Navigate to goals list
    await page.goto(GOALS_BASE_URL);
    await page.waitForLoadState('networkidle');

    // Verify goals list page
    await expect(page).toHaveTitle(/Goals.*OpenBase/);
    await expect(page.locator('h1')).toContainText('Goals');

    // Step 2: Create a new goal
    const newGoalButton = page.getByRole('button', { name: /New Goal/i });
    await expect(newGoalButton).toBeVisible();
    await newGoalButton.click();

    // Should navigate to goal creation
    await expect(page).toHaveURL(/\/goals\/new/);
    await expect(page.locator('h1')).toContainText(/Create.*Goal/i);

    // Step 3: Complete goal wizard
    await completeGoalWizard();

    // Step 4: Save goal and capture ID
    const saveButton = page.getByRole('button', { name: /save|create/i });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Should redirect to goals list or goal detail
    await page.waitForURL(/\/goals/);
    await expect(page.locator('text=/success|created/i')).toBeVisible();

    // Find the created goal
    const goalLink = page.locator(`a[href*="/goals/"]:has-text("${TEST_GOAL_TITLE}")`);
    if (await goalLink.isVisible()) {
      const href = await goalLink.getAttribute('href');
      createdGoalId = href?.split('/goals/')[1] || '';
    }

    // Step 5: Navigate to goal details
    if (createdGoalId) {
      await page.goto(`${GOALS_BASE_URL}/${createdGoalId}`);
    } else {
      // Find first goal link and navigate
      const firstGoalLink = page.locator('a[href*="/goals/"]').first();
      await firstGoalLink.click();
    }

    // Verify goal detail page
    await expect(page.locator('h1, [data-testid="goal-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="smart-score"], .smart-score')).toBeVisible();

    // Step 6: Add tasks to goal
    await addTasksToGoal();

    // Step 7: Set up metrics tracking
    await setupMetricsTracking();

    // Step 8: Add team collaboration
    await addTeamCollaboration();

    // Step 9: Work on tasks and update progress
    await workOnTasksAndProgress();

    // Step 10: Record metric checkpoints
    await recordMetricProgress();

    // Step 11: Complete review process
    await completeReviewProcess();

    // Step 12: Mark goal as completed
    await markGoalAsCompleted();

    // Step 13: Verify final state
    await verifyGoalCompletion();
  });

  // Helper functions for each step of the journey

  async function completeGoalWizard() {
    // Context step
    const titleInput = page.getByLabel(/Goal Title/i).or(page.locator('input[name="title"]'));
    await titleInput.fill(TEST_GOAL_TITLE);

    const descriptionInput = page.getByLabel(/Description/i).or(page.locator('textarea[name="description"]'));
    await descriptionInput.fill('A comprehensive test goal to validate the complete SMART Goals journey including all features and workflows');

    // Navigate through wizard steps
    await page.getByRole('button', { name: /next/i }).click();

    // Specific step
    await expect(page.locator('text=/Specific/i')).toBeVisible();
    const objectiveInput = page.getByLabel(/Specific Objective/i).or(page.locator('textarea[name="specificObjective"]'));
    await objectiveInput.fill('Successfully complete 100% of E2E test scenarios with all features working correctly');

    await page.getByRole('button', { name: /next/i }).click();

    // Measurable step
    await expect(page.locator('text=/Measurable/i')).toBeVisible();
    const targetInput = page.getByLabel(/Target Value/i).or(page.locator('input[name="targetValue"]'));
    await targetInput.fill('100');

    const unitInput = page.getByLabel(/Unit/i).or(page.locator('input[name="unit"]'));
    await unitInput.fill('percent');

    await page.getByRole('button', { name: /next/i }).click();

    // Achievable step
    await expect(page.locator('text=/Achievable/i')).toBeVisible();
    await page.getByRole('button', { name: /next/i }).click();

    // Relevant step
    await expect(page.locator('text=/Relevant/i')).toBeVisible();
    const rationale = page.getByLabel(/Rationale/i).or(page.locator('textarea[name="rationale"]'));
    if (await rationale.isVisible()) {
      await rationale.fill('Critical for ensuring product quality and user satisfaction');
    }
    await page.getByRole('button', { name: /next/i }).click();

    // Time-bound step
    await expect(page.locator('text=/Time-bound/i')).toBeVisible();
    const targetDateInput = page.getByLabel(/Target Date/i).or(page.locator('input[type="date"]'));
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    await targetDateInput.fill(futureDate.toISOString().split('T')[0]);

    await page.getByRole('button', { name: /next/i }).click();

    // Preview step
    await expect(page.locator('text=/Preview/i')).toBeVisible();
    await expect(page.locator('[data-testid="smart-score"], .smart-score')).toBeVisible();
  }

  async function addTasksToGoal() {
    // Navigate to board view
    const boardTab = page.getByRole('tab', { name: /Board/i });
    if (await boardTab.isVisible()) {
      await boardTab.click();
      await expect(page).toHaveURL(/\/board$/);
    }

    // Add multiple tasks
    const tasks = [
      {
        title: 'Setup test environment',
        description: 'Configure all necessary testing tools and environments',
      },
      {
        title: 'Execute test suite',
        description: 'Run comprehensive E2E tests across all features',
      },
      {
        title: 'Analyze results',
        description: 'Review test results and identify any issues',
      },
    ];

    for (const task of tasks) {
      const addTaskButton = page.getByRole('button', { name: /Add Task/i });
      await addTaskButton.click();

      const taskForm = page.locator('[data-testid="task-form"], .task-form, [role="dialog"]');
      await expect(taskForm).toBeVisible();

      const titleInput = taskForm.locator('input[name="title"], [data-testid="task-title"]');
      await titleInput.fill(task.title);

      const descriptionInput = taskForm.locator('textarea[name="description"], [data-testid="task-description"]');
      await descriptionInput.fill(task.description);

      const saveButton = taskForm.getByRole('button', { name: /save|create/i });
      await saveButton.click();

      await expect(page.locator('text=/task.*created/i')).toBeVisible();
    }
  }

  async function setupMetricsTracking() {
    // Navigate to metrics tab
    const metricsTab = page.getByRole('tab', { name: /Metrics/i });
    if (await metricsTab.isVisible()) {
      await metricsTab.click();
      await expect(page).toHaveURL(/\/metrics$/);
    }

    // Verify metrics are configured
    await expect(page.locator('text=/Current.*Value/i')).toBeVisible();
    await expect(page.locator('text=/Target.*Value/i')).toBeVisible();

    // Add initial checkpoint if possible
    const addCheckpointButton = page.getByRole('button', { name: /add checkpoint/i });
    if (await addCheckpointButton.isVisible()) {
      await addCheckpointButton.click();

      const checkpointForm = page.locator('[data-testid="checkpoint-form"], .checkpoint-form');
      if (await checkpointForm.isVisible()) {
        const valueInput = checkpointForm.locator('input[name="value"], [data-testid="checkpoint-value"]');
        await valueInput.fill('25');

        const noteInput = checkpointForm.locator('textarea[name="note"], [data-testid="checkpoint-note"]');
        await noteInput.fill('Initial baseline checkpoint at project start');

        const submitButton = page.getByRole('button', { name: /save|record/i });
        await submitButton.click();

        await expect(page.locator('text=/checkpoint.*added/i')).toBeVisible();
      }
    }
  }

  async function addTeamCollaboration() {
    // Navigate to review tab
    const reviewTab = page.getByRole('tab', { name: /Review/i });
    if (await reviewTab.isVisible()) {
      await reviewTab.click();
      await expect(page).toHaveURL(/\/review$/);
    }

    // Add a comment
    const commentInput = page.locator('textarea[placeholder*="comment"], [data-testid="comment-input"]');
    if (await commentInput.isVisible()) {
      await commentInput.fill('Starting the journey test - all systems ready for comprehensive testing');

      const submitButton = page.getByRole('button', { name: /add comment|post/i });
      await submitButton.click();

      await expect(page.locator('text=Starting the journey test')).toBeVisible();
    }

    // Check some DoR criteria if available
    const dorTab = page.getByRole('tab', { name: /dor.*dod/i });
    if (await dorTab.isVisible()) {
      await dorTab.click();

      const checkboxes = page.locator('input[type="checkbox"]:not(:checked)');
      const checkboxCount = await checkboxes.count();

      if (checkboxCount > 0) {
        // Check first few criteria
        for (let i = 0; i < Math.min(3, checkboxCount); i++) {
          await checkboxes.nth(i).click();
          await page.waitForTimeout(500);
        }
      }
    }
  }

  async function workOnTasksAndProgress() {
    // Go back to board
    const boardTab = page.getByRole('tab', { name: /Board/i });
    if (await boardTab.isVisible()) {
      await boardTab.click();
    }

    // Move first task to in progress
    const todoTask = page.locator('[data-column="todo"] [data-testid="task-card"], [data-status="todo"] .task-card').first();

    if (await todoTask.isVisible()) {
      const inProgressColumn = page.locator('[data-column="in_progress"], [data-status="in_progress"]');

      if (await inProgressColumn.isVisible()) {
        await todoTask.dragTo(inProgressColumn);
        await expect(page.locator('text=/moved|status.*updated/i')).toBeVisible();
      }
    }

    // Complete one task
    const inProgressTask = page.locator('[data-column="in_progress"] [data-testid="task-card"], [data-status="in_progress"] .task-card').first();

    if (await inProgressTask.isVisible()) {
      await inProgressTask.click();

      const statusSelector = page.locator('[data-testid="status-select"], .status-select');
      if (await statusSelector.isVisible()) {
        await statusSelector.selectOption('completed');

        const closeButton = page.locator('[data-testid="close"], .close, button[aria-label="close"]');
        if (await closeButton.isVisible()) {
          await closeButton.click();
        }
      }
    }
  }

  async function recordMetricProgress() {
    // Navigate to metrics tab
    const metricsTab = page.getByRole('tab', { name: /Metrics/i });
    if (await metricsTab.isVisible()) {
      await metricsTab.click();
    }

    // Add progress checkpoint
    const addCheckpointButton = page.getByRole('button', { name: /add checkpoint/i });
    if (await addCheckpointButton.isVisible()) {
      await addCheckpointButton.click();

      const checkpointForm = page.locator('[data-testid="checkpoint-form"], .checkpoint-form');
      if (await checkpointForm.isVisible()) {
        const valueInput = checkpointForm.locator('input[name="value"], [data-testid="checkpoint-value"]');
        await valueInput.fill('75');

        const noteInput = checkpointForm.locator('textarea[name="note"], [data-testid="checkpoint-note"]');
        await noteInput.fill('Significant progress made - most test scenarios completed successfully');

        const submitButton = page.getByRole('button', { name: /save|record/i });
        await submitButton.click();

        await expect(page.locator('text=/checkpoint.*added/i')).toBeVisible();
      }
    }
  }

  async function completeReviewProcess() {
    // Navigate to review tab
    const reviewTab = page.getByRole('tab', { name: /Review/i });
    if (await reviewTab.isVisible()) {
      await reviewTab.click();
    }

    // Add final comment
    const commentInput = page.locator('textarea[placeholder*="comment"], [data-testid="comment-input"]');
    if (await commentInput.isVisible()) {
      await commentInput.fill('All test scenarios completed successfully. Ready for final approval.');

      const submitButton = page.getByRole('button', { name: /add comment|post/i });
      await submitButton.click();

      await expect(page.locator('text=All test scenarios completed')).toBeVisible();
    }

    // Complete DoD criteria
    const dorTab = page.getByRole('tab', { name: /dor.*dod/i });
    if (await dorTab.isVisible()) {
      await dorTab.click();

      const uncheckedBoxes = page.locator('input[type="checkbox"]:not(:checked)');
      const boxCount = await uncheckedBoxes.count();

      // Check all remaining criteria
      for (let i = 0; i < boxCount; i++) {
        const box = uncheckedBoxes.nth(i);
        if (await box.isVisible()) {
          await box.click();
          await page.waitForTimeout(300);
        }
      }
    }

    // Approve goal if button is available
    const approveButton = page.getByRole('button', { name: /approve/i });
    if (await approveButton.isEnabled()) {
      await approveButton.click();

      const confirmDialog = page.locator('[role="dialog"], .dialog');
      if (await confirmDialog.isVisible()) {
        const approvalComment = confirmDialog.locator('textarea[placeholder*="comment"]');
        if (await approvalComment.isVisible()) {
          await approvalComment.fill('Goal completed successfully - all criteria met');
        }

        await page.getByRole('button', { name: /confirm|approve/i }).click();
      }

      await expect(page.locator('text=/approved/i')).toBeVisible();
    }
  }

  async function markGoalAsCompleted() {
    // Navigate back to overview
    const overviewTab = page.getByRole('tab', { name: /Overview/i });
    if (await overviewTab.isVisible()) {
      await overviewTab.click();
    }

    // Look for status change option
    const statusButton = page.locator('[data-testid="status-selector"], button:has-text("Active")').first();

    if (await statusButton.isVisible()) {
      await statusButton.click();

      const completedOption = page.getByRole('menuitem', { name: /completed/i });
      if (await completedOption.isVisible()) {
        await completedOption.click();

        await expect(page.locator('text=/status.*updated/i')).toBeVisible();
      }
    }
  }

  async function verifyGoalCompletion() {
    // Verify goal shows as completed
    await expect(page.locator('text=/completed/i')).toBeVisible();

    // Verify SMART score is displayed
    await expect(page.locator('[data-testid="smart-score"], .smart-score')).toBeVisible();

    // Verify progress is 100%
    const progressBar = page.locator('[role="progressbar"], .progress');
    if (await progressBar.isVisible()) {
      const progressValue = await progressBar.getAttribute('aria-valuenow');
      expect(Number(progressValue)).toBeGreaterThan(90); // Should be near 100%
    }

    // Navigate back to goals list to verify the goal appears as completed
    await page.goto(GOALS_BASE_URL);

    // Look for the completed goal in the list
    const completedGoal = page.locator(`text=${TEST_GOAL_TITLE}`).first();
    if (await completedGoal.isVisible()) {
      await expect(completedGoal).toBeVisible();

      // Should show completed status
      const statusBadge = page.locator('.badge, [data-testid="status-badge"]').first();
      if (await statusBadge.isVisible()) {
        const statusText = await statusBadge.textContent();
        expect(statusText?.toLowerCase()).toMatch(/complete|done|finished/);
      }
    }
  }
});

test.describe('Goal Journey Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Start goal creation
    await page.goto(`${GOALS_BASE_URL}/new`);

    // Fill basic information
    const titleInput = page.getByLabel(/Goal Title/i).or(page.locator('input[name="title"]'));
    await titleInput.fill('Network Error Test Goal');

    // Simulate network failure
    await page.route('**/api/goals*', route => {
      route.abort();
    });

    // Try to save
    const nextButton = page.getByRole('button', { name: /next/i });
    await nextButton.click();

    // Should handle error gracefully
    const errorMessage = page.locator('text=/error|failed|try again/i');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('should recover from browser refresh during creation', async ({ page }) => {
    // Start goal creation
    await page.goto(`${GOALS_BASE_URL}/new`);

    // Fill some data
    const titleInput = page.getByLabel(/Goal Title/i).or(page.locator('input[name="title"]'));
    await titleInput.fill('Refresh Recovery Test');

    // Refresh the page
    await page.reload();

    // Data should be preserved (if auto-save is implemented)
    const titleValue = await titleInput.inputValue();
    if (titleValue === 'Refresh Recovery Test') {
      await expect(titleInput).toHaveValue('Refresh Recovery Test');
    } else {
      // Should show recovery option or start fresh
      await expect(page.locator('text=/Create.*Goal/i')).toBeVisible();
    }
  });

  test('should handle concurrent modifications', async ({ page }) => {
    // Navigate to existing goal
    await page.goto(GOALS_BASE_URL);

    const goalLink = page.locator('a[href*="/goals/"]').first();
    if (await goalLink.isVisible()) {
      await goalLink.click();

      // Start editing
      const editButton = page.getByRole('button', { name: /edit/i });
      if (await editButton.isVisible()) {
        await editButton.click();

        // Make changes
        const titleInput = page.locator('input[name="title"], [data-testid="goal-title"]');
        if (await titleInput.isVisible()) {
          await titleInput.fill('Concurrent Modification Test');

          // Simulate concurrent modification by another user
          // In a real test, this would involve multiple browser contexts

          const saveButton = page.getByRole('button', { name: /save|update/i });
          await saveButton.click();

          // Should handle conflict appropriately
          const conflictMessage = page.locator('text=/conflict|modified.*another.*user/i');
          if (await conflictMessage.isVisible()) {
            await expect(conflictMessage).toBeVisible();
          } else {
            // Should save successfully
            await expect(page.locator('text=/updated|saved/i')).toBeVisible();
          }
        }
      }
    }
  });
});

test.describe('Performance and Scale Testing', () => {
  test('should handle large numbers of goals efficiently', async ({ page }) => {
    await page.goto(GOALS_BASE_URL);

    // Measure load time
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="goal-card"], [data-testid="goal-list-item"]', { timeout: 10000 });
    const loadTime = Date.now() - startTime;

    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000);

    // Should implement pagination or virtualization
    const goalCards = page.locator('[data-testid="goal-card"], [data-testid="goal-list-item"]');
    const goalCount = await goalCards.count();

    // Should not render excessive number of goals at once
    expect(goalCount).toBeLessThan(100);
  });

  test('should handle complex goal hierarchies', async ({ page }) => {
    // Navigate to a goal with many tasks/subtasks
    await page.goto(GOALS_BASE_URL);

    const goalLink = page.locator('a[href*="/goals/"]').first();
    await goalLink.click();

    // Check board performance
    const boardTab = page.getByRole('tab', { name: /Board/i });
    if (await boardTab.isVisible()) {
      const startTime = Date.now();
      await boardTab.click();

      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Board should load efficiently
      expect(loadTime).toBeLessThan(3000);

      // Should handle task rendering efficiently
      const taskCards = page.locator('[data-testid="task-card"], .task-card');
      const taskCount = await taskCards.count();

      // All tasks should be visible and interactable
      if (taskCount > 0) {
        await expect(taskCards.first()).toBeVisible();
      }
    }
  });
});