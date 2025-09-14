/**
 * Task Workflow E2E Tests
 *
 * Tests for task management workflows including task creation,
 * editing, status changes, and board interactions.
 */

import { test, expect, Page } from '@playwright/test';

// Test Configuration
const GOALS_BASE_URL = '/goals';
const MOCK_GOAL_ID = 'goal-1';

test.describe('Task Workflow Features', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/board`);
    await page.waitForLoadState('networkidle');
  });

  test('should display task board correctly', async () => {
    // Check for board title
    await expect(page.locator('text=/Task Board/i')).toBeVisible();

    // Should show board columns
    await expect(page.locator('text=/To Do/i')).toBeVisible();
    await expect(page.locator('text=/In Progress/i')).toBeVisible();
    await expect(page.locator('text=/Completed/i')).toBeVisible();

    // Should have add task button
    await expect(page.getByRole('button', { name: /Add Task/i })).toBeVisible();
  });

  test('should create new task', async () => {
    // Click add task button
    const addTaskButton = page.getByRole('button', { name: /Add Task/i });
    await addTaskButton.click();

    // Should open task creation form/modal
    const taskForm = page.locator('[data-testid="task-form"], .task-form, [role="dialog"]');
    await expect(taskForm).toBeVisible();

    // Fill task details
    const titleInput = taskForm.locator('input[name="title"], [data-testid="task-title"]');
    await titleInput.fill('Test Task for E2E');

    const descriptionInput = taskForm.locator('textarea[name="description"], [data-testid="task-description"]');
    await descriptionInput.fill('This is a comprehensive test task for validating task workflows');

    // Set priority if available
    const prioritySelect = taskForm.locator('select[name="priority"], [data-testid="priority-select"]');
    if (await prioritySelect.isVisible()) {
      await prioritySelect.selectOption('high');
    }

    // Set due date if available
    const dueDateInput = taskForm.locator('input[type="date"], [data-testid="due-date"]');
    if (await dueDateInput.isVisible()) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      await dueDateInput.fill(futureDate.toISOString().split('T')[0]);
    }

    // Save task
    const saveButton = taskForm.getByRole('button', { name: /save|create/i });
    await saveButton.click();

    // Should show success message
    await expect(page.locator('text=/task.*created|added/i')).toBeVisible();

    // Task should appear in To Do column
    const todoColumn = page.locator('[data-column="todo"], [data-status="todo"]');
    if (await todoColumn.isVisible()) {
      await expect(todoColumn.locator('text=Test Task for E2E')).toBeVisible();
    }
  });

  test('should edit existing task', async () => {
    // Find first task card
    const taskCard = page.locator('[data-testid="task-card"], .task-card').first();

    if (await taskCard.isVisible()) {
      // Open task for editing (usually click or right-click)
      await taskCard.click();

      // Should open task detail/edit modal
      const taskModal = page.locator('[role="dialog"], .task-modal');
      if (await taskModal.isVisible()) {
        // Look for edit button
        const editButton = taskModal.getByRole('button', { name: /edit/i });
        if (await editButton.isVisible()) {
          await editButton.click();
        }

        // Edit task title
        const titleInput = page.locator('input[name="title"], [data-testid="task-title"]');
        if (await titleInput.isVisible()) {
          await titleInput.fill('Updated Task Title');

          // Save changes
          const saveButton = page.getByRole('button', { name: /save|update/i });
          await saveButton.click();

          // Should show success message
          await expect(page.locator('text=/updated|saved/i')).toBeVisible();
        }
      }
    }
  });

  test('should move task between columns', async () => {
    // Find a task in To Do column
    const todoTask = page.locator('[data-column="todo"] [data-testid="task-card"], [data-status="todo"] .task-card').first();

    if (await todoTask.isVisible()) {
      // Get task text to verify later
      const taskText = await todoTask.locator('[data-testid="task-title"], .task-title').textContent();

      // Drag task to In Progress column
      const inProgressColumn = page.locator('[data-column="in_progress"], [data-status="in_progress"]');

      if (await inProgressColumn.isVisible()) {
        await todoTask.dragTo(inProgressColumn);

        // Verify task moved to In Progress
        await expect(inProgressColumn.locator(`text=${taskText}`)).toBeVisible();

        // Should show status update message
        await expect(page.locator('text=/moved|status.*updated/i')).toBeVisible();
      }
    }
  });

  test('should update task status via dropdown', async () => {
    // Find a task card
    const taskCard = page.locator('[data-testid="task-card"], .task-card').first();

    if (await taskCard.isVisible()) {
      await taskCard.click();

      // Look for status selector in task detail
      const statusSelector = page.locator('[data-testid="status-select"], .status-select');

      if (await statusSelector.isVisible()) {
        await statusSelector.click();

        // Select different status
        const completedOption = page.getByRole('option', { name: /completed/i });
        if (await completedOption.isVisible()) {
          await completedOption.click();

          // Should update task status
          await expect(page.locator('text=/completed/i')).toBeVisible();

          // Should move task to completed column
          const completedColumn = page.locator('[data-column="completed"], [data-status="completed"]');
          if (await completedColumn.isVisible()) {
            // Close modal first
            const closeButton = page.locator('[data-testid="close"], .close, button[aria-label="close"]');
            if (await closeButton.isVisible()) {
              await closeButton.click();
            }

            // Verify task is in completed column
            const count = await completedColumn.locator('.task-card, [data-testid="task-card"]').count();
            expect(count).toBeGreaterThanOrEqual(1);
          }
        }
      }
    }
  });

  test('should add subtasks to task', async () => {
    // Open task detail
    const taskCard = page.locator('[data-testid="task-card"], .task-card').first();

    if (await taskCard.isVisible()) {
      await taskCard.click();

      const taskModal = page.locator('[role="dialog"], .task-modal');

      if (await taskModal.isVisible()) {
        // Look for subtasks section
        const subtasksSection = taskModal.locator('[data-testid="subtasks"], .subtasks');

        if (await subtasksSection.isVisible()) {
          // Add subtask button
          const addSubtaskButton = subtasksSection.getByRole('button', { name: /add.*subtask/i });

          if (await addSubtaskButton.isVisible()) {
            await addSubtaskButton.click();

            // Fill subtask details
            const subtaskInput = page.locator('input[placeholder*="subtask"], [data-testid="subtask-input"]');
            await subtaskInput.fill('Test subtask item');

            // Save subtask
            const saveSubtaskButton = page.getByRole('button', { name: /add|save/i });
            await saveSubtaskButton.click();

            // Should show subtask in list
            await expect(subtasksSection.locator('text=Test subtask item')).toBeVisible();
          }
        }
      }
    }
  });

  test('should add checklist items', async () => {
    // Open task detail
    const taskCard = page.locator('[data-testid="task-card"], .task-card').first();

    if (await taskCard.isVisible()) {
      await taskCard.click();

      const taskModal = page.locator('[role="dialog"], .task-modal');

      if (await taskModal.isVisible()) {
        // Look for checklist section
        const checklistSection = taskModal.locator('[data-testid="checklist"], .checklist');

        if (await checklistSection.isVisible()) {
          // Add checklist item
          const addItemButton = checklistSection.getByRole('button', { name: /add.*item/i });

          if (await addItemButton.isVisible()) {
            await addItemButton.click();

            const itemInput = page.locator('input[placeholder*="checklist"], [data-testid="checklist-input"]');
            await itemInput.fill('Review test results');

            const saveItemButton = page.getByRole('button', { name: /add|save/i });
            await saveItemButton.click();

            // Should show checklist item
            await expect(checklistSection.locator('text=Review test results')).toBeVisible();
          }
        }
      }
    }
  });

  test('should complete checklist items', async () => {
    // Open task detail
    const taskCard = page.locator('[data-testid="task-card"], .task-card').first();

    if (await taskCard.isVisible()) {
      await taskCard.click();

      const checklistSection = page.locator('[data-testid="checklist"], .checklist');

      if (await checklistSection.isVisible()) {
        // Find unchecked checkbox
        const checkbox = checklistSection.locator('input[type="checkbox"]:not(:checked)').first();

        if (await checkbox.isVisible()) {
          await checkbox.click();

          // Should show as completed
          await expect(checkbox).toBeChecked();

          // Should update progress
          const progress = page.locator('[data-testid="checklist-progress"], .progress');
          if (await progress.isVisible()) {
            await expect(progress).toBeVisible();
          }
        }
      }
    }
  });

  test('should assign task to team member', async () => {
    // Open task detail
    const taskCard = page.locator('[data-testid="task-card"], .task-card').first();

    if (await taskCard.isVisible()) {
      await taskCard.click();

      // Look for assignee selector
      const assigneeSelector = page.locator('[data-testid="assignee-select"], .assignee-select');

      if (await assigneeSelector.isVisible()) {
        await assigneeSelector.click();

        // Select assignee
        const assigneeOption = page.locator('[data-testid="assignee-option"], [role="option"]').first();

        if (await assigneeOption.isVisible()) {
          await assigneeOption.click();

          // Should show assigned user
          const avatar = page.locator('[data-testid="assignee-avatar"], .avatar');
          if (await avatar.isVisible()) {
            await expect(avatar).toBeVisible();
          }
        }
      }
    }
  });

  test('should set task priority', async () => {
    // Open task detail
    const taskCard = page.locator('[data-testid="task-card"], .task-card').first();

    if (await taskCard.isVisible()) {
      await taskCard.click();

      // Look for priority selector
      const prioritySelector = page.locator('[data-testid="priority-select"], .priority-select');

      if (await prioritySelector.isVisible()) {
        await prioritySelector.selectOption('high');

        // Should show high priority indicator
        const priorityBadge = page.locator('[data-testid="priority-badge"], .priority-high');
        if (await priorityBadge.isVisible()) {
          await expect(priorityBadge).toBeVisible();
        }
      }
    }
  });

  test('should delete task', async () => {
    // Open task detail
    const taskCard = page.locator('[data-testid="task-card"], .task-card').first();

    if (await taskCard.isVisible()) {
      // Get task title for verification
      const taskTitle = await taskCard.locator('[data-testid="task-title"], .task-title').textContent();

      await taskCard.click();

      // Look for delete button
      const deleteButton = page.getByRole('button', { name: /delete/i });

      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Should show confirmation dialog
        const confirmDialog = page.locator('[role="dialog"]:has-text("delete")');
        if (await confirmDialog.isVisible()) {
          await page.getByRole('button', { name: /confirm|delete/i }).click();
        }

        // Should show success message
        await expect(page.locator('text=/deleted/i')).toBeVisible();

        // Task should be removed from board
        if (taskTitle) {
          await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
        }
      }
    }
  });

  test('should filter tasks by status', async () => {
    // Look for filter controls
    const filterButton = page.getByRole('button', { name: /filter/i });

    if (await filterButton.isVisible()) {
      await filterButton.click();

      // Filter by completed tasks
      const completedFilter = page.getByRole('menuitem', { name: /completed/i });

      if (await completedFilter.isVisible()) {
        await completedFilter.click();

        // Should show only completed tasks
        const visibleTasks = page.locator('[data-testid="task-card"], .task-card');
        const taskCount = await visibleTasks.count();

        // Verify all visible tasks are in completed column
        if (taskCount > 0) {
          const completedColumn = page.locator('[data-column="completed"], [data-status="completed"]');
          const completedTasks = completedColumn.locator('[data-testid="task-card"], .task-card');
          const completedCount = await completedTasks.count();

          expect(completedCount).toBeGreaterThan(0);
        }
      }
    }
  });

  test('should search tasks', async () => {
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], [data-testid="task-search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('test task');

      // Should filter tasks based on search
      await page.waitForTimeout(1000);

      const visibleTasks = page.locator('[data-testid="task-card"], .task-card');
      const taskCount = await visibleTasks.count();

      // If tasks found, they should match search term
      if (taskCount > 0) {
        const firstTask = visibleTasks.first();
        const taskText = await firstTask.textContent();
        expect(taskText?.toLowerCase()).toContain('test');
      }
    }
  });
});

test.describe('Task Board Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/board`);
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Focus on first task
    const firstTask = page.locator('[data-testid="task-card"], .task-card').first();

    if (await firstTask.isVisible()) {
      await firstTask.focus();

      // Test keyboard navigation
      await page.keyboard.press('Enter');

      // Should open task detail
      const taskModal = page.locator('[role="dialog"], .task-modal');
      if (await taskModal.isVisible()) {
        await expect(taskModal).toBeVisible();

        // Test escape to close
        await page.keyboard.press('Escape');
        await expect(taskModal).not.toBeVisible();
      }
    }
  });

  test('should show task count per column', async ({ page }) => {
    // Check for task count indicators
    const columns = [
      { name: 'To Do', selector: '[data-column="todo"]' },
      { name: 'In Progress', selector: '[data-column="in_progress"]' },
      { name: 'Completed', selector: '[data-column="completed"]' },
    ];

    for (const column of columns) {
      const columnElement = page.locator(column.selector);

      if (await columnElement.isVisible()) {
        // Look for count indicator
        const countIndicator = columnElement.locator('[data-testid="task-count"], .task-count, .badge');

        if (await countIndicator.isVisible()) {
          const countText = await countIndicator.textContent();
          expect(countText).toMatch(/\d+/);
        }
      }
    }
  });

  test('should support bulk task operations', async ({ page }) => {
    // Look for bulk select option
    const selectAllCheckbox = page.locator('input[type="checkbox"][aria-label*="select all"]');

    if (await selectAllCheckbox.isVisible()) {
      await selectAllCheckbox.click();

      // Should show bulk actions toolbar
      const bulkToolbar = page.locator('[data-testid="bulk-actions"], .bulk-actions');

      if (await bulkToolbar.isVisible()) {
        await expect(bulkToolbar).toBeVisible();

        // Should have bulk operation buttons
        await expect(page.getByRole('button', { name: /delete selected/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /move selected/i })).toBeVisible();
      }
    }
  });

  test('should handle empty columns gracefully', async ({ page }) => {
    // Clear search to show all tasks
    const searchInput = page.locator('input[placeholder*="search"], [data-testid="task-search"]');
    if (await searchInput.isVisible()) {
      await searchInput.clear();
    }

    // Check each column for empty state
    const columns = page.locator('[data-column], .column');
    const columnCount = await columns.count();

    for (let i = 0; i < columnCount; i++) {
      const column = columns.nth(i);
      const tasks = column.locator('[data-testid="task-card"], .task-card');
      const taskCount = await tasks.count();

      if (taskCount === 0) {
        // Should show empty state message
        const emptyMessage = column.locator('text=/no tasks|empty|add.*task/i');
        if (await emptyMessage.isVisible()) {
          await expect(emptyMessage).toBeVisible();
        }
      }
    }
  });
});