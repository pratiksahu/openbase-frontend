/**
 * TaskEditor E2E Tests
 *
 * Comprehensive end-to-end tests for TaskEditor component workflows
 * including task creation, editing, subtask management, and acceptance criteria.
 */

import { test, expect } from '@playwright/test';

// Test data
const testTask = {
  title: 'E2E Test Task',
  description: 'This is a test task created by E2E tests',
  estimatedHours: '8',
  assignee: 'Alice Johnson',
};

const testSubtask = {
  title: 'E2E Test Subtask',
  description: 'This is a test subtask created by E2E tests',
  estimatedHours: '4',
};

const testChecklistItem = {
  title: 'E2E Test Checklist Item',
  description: 'This is a test checklist item created by E2E tests',
};

const testAcceptanceCriteria = {
  plainText: `• User can create and edit tasks
• All form validation works correctly
• Data is saved properly
• User interface is responsive`,
  gherkin: `Given I am a logged-in user
When I create a new task
Then the task should be saved successfully
And I should see the task in the task list`,
};

test.describe('TaskEditor Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page that contains the TaskEditor component
    // This assumes you have a test page or story that renders the TaskEditor
    await page.goto('/storybook');

    // Navigate to TaskEditor story
    await page.click('text=TaskEditor');
    await page.click('text=Create New Task');

    // Wait for the component to load
    await expect(page.locator('text=Create Task')).toBeVisible();
  });

  test.describe('Task Creation', () => {
    test('should create a new task with basic information', async ({ page }) => {
      // Fill in basic task information
      await page.fill('input[id="title"]', testTask.title);
      await page.fill('textarea[id="description"]', testTask.description);

      // Select priority
      await page.click('[id="priority"]');
      await page.click('text=High');

      // Fill estimated hours
      await page.fill('input[id="estimatedHours"]', testTask.estimatedHours);

      // Select assignee
      await page.click('[id="assignedTo"]');
      await page.click(`text=${testTask.assignee}`);

      // Save the task
      await page.click('button:has-text("Save Task")');

      // Verify success (assuming there's a success message or redirect)
      await expect(page.locator('text=Task saved successfully')).toBeVisible();
    });

    test('should show validation errors for invalid input', async ({ page }) => {
      // Try to save without required fields
      await page.click('button:has-text("Save Task")');

      // Check for validation errors
      await expect(page.locator('text=Title must be at least 3 characters long')).toBeVisible();

      // Fill in a title that's too short
      await page.fill('input[id="title"]', 'AB');
      await page.click('button:has-text("Save Task")');

      // Should still show validation error
      await expect(page.locator('text=Title must be at least 3 characters long')).toBeVisible();

      // Fill in valid title
      await page.fill('input[id="title"]', testTask.title);
      await page.click('button:has-text("Save Task")');

      // Error should disappear
      await expect(page.locator('text=Title must be at least 3 characters long')).not.toBeVisible();
    });

    test('should handle form cancellation correctly', async ({ page }) => {
      // Fill in some data
      await page.fill('input[id="title"]', testTask.title);
      await page.fill('textarea[id="description"]', testTask.description);

      // Click cancel
      await page.click('button:has-text("Cancel")');

      // Should show confirmation dialog for unsaved changes
      await expect(page.locator('text=You have unsaved changes')).toBeVisible();
    });
  });

  test.describe('Task Editing', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to edit existing task story
      await page.click('text=Edit Existing Task');
      await expect(page.locator('text=Edit Task')).toBeVisible();
    });

    test('should edit existing task information', async ({ page }) => {
      // Verify existing data is loaded
      await expect(page.locator('input[value*="Implement User Dashboard"]')).toBeVisible();

      // Update the title
      await page.fill('input[id="title"]', 'Updated Task Title');

      // Update description
      await page.fill('textarea[id="description"]', 'Updated task description');

      // Save changes
      await page.click('button:has-text("Save Task")');

      // Verify changes are saved
      await expect(page.locator('text=Task saved successfully')).toBeVisible();
    });

    test('should handle status changes', async ({ page }) => {
      // Change status
      await page.click('[id="status"]');
      await page.click('text=in_progress');

      // Should trigger status change
      await expect(page.locator('text=Task status updated')).toBeVisible();
    });

    test('should delete task with confirmation', async ({ page }) => {
      // Click delete button
      await page.click('button:has-text("Delete")');

      // Handle confirmation dialog
      await page.on('dialog', dialog => dialog.accept());

      // Should show success message
      await expect(page.locator('text=Task deleted successfully')).toBeVisible();
    });
  });

  test.describe('Tab Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Edit Existing Task');
      await expect(page.locator('text=Edit Task')).toBeVisible();
    });

    test('should navigate between tabs correctly', async ({ page }) => {
      // Should start on Details tab
      await expect(page.locator('[role="tabpanel"]')).toContainText('Title');

      // Click Subtasks tab
      await page.click('text=Subtasks');
      await expect(page.locator('text=Break down this task')).toBeVisible();

      // Click Checklist tab
      await page.click('text=Checklist');
      await expect(page.locator('text=Create a checklist')).toBeVisible();

      // Click Acceptance Criteria tab
      await page.click('text=Acceptance Criteria');
      await expect(page.locator('text=Define clear, testable requirements')).toBeVisible();
    });
  });

  test.describe('Subtask Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Edit Existing Task');
      await page.click('text=Subtasks');
    });

    test('should add a new subtask', async ({ page }) => {
      // Click Add Subtask button
      await page.click('button:has-text("Add Subtask")');

      // Fill in subtask information
      await page.fill('input[id="add-title"]', testSubtask.title);
      await page.fill('textarea[id="add-description"]', testSubtask.description);
      await page.fill('input[placeholder="0"]', testSubtask.estimatedHours);

      // Save subtask
      await page.click('button:has-text("Add Subtask")');

      // Verify subtask was added
      await expect(page.locator(`text=${testSubtask.title}`)).toBeVisible();
      await expect(page.locator('text=Subtask added')).toBeVisible();
    });

    test('should edit existing subtask', async ({ page }) => {
      // Find and click edit button for first subtask
      await page.click('[data-testid="edit-subtask"]').first();

      // Update title
      await page.fill('input[value*="Design user interface"]', 'Updated Subtask Title');

      // Save changes
      await page.click('button:has-text("Save")');

      // Verify changes
      await expect(page.locator('text=Updated Subtask Title')).toBeVisible();
      await expect(page.locator('text=Subtask updated')).toBeVisible();
    });

    test('should delete subtask with confirmation', async ({ page }) => {
      // Click delete button for first subtask
      await page.click('[data-testid="delete-subtask"]').first();

      // Handle confirmation dialog
      page.on('dialog', dialog => dialog.accept());

      // Verify deletion
      await expect(page.locator('text=Subtask deleted')).toBeVisible();
    });
  });

  test.describe('Checklist Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Edit Existing Task');
      await page.click('text=Checklist');
    });

    test('should add a new checklist item', async ({ page }) => {
      // Click Add Item button
      await page.click('button:has-text("Add Item")');

      // Fill in item information
      await page.fill('input[id="add-title"]', testChecklistItem.title);
      await page.fill('textarea[id="add-description"]', testChecklistItem.description);

      // Mark as required
      await page.click('input[id="add-required"]');

      // Save item
      await page.click('button:has-text("Add Item")');

      // Verify item was added
      await expect(page.locator(`text=${testChecklistItem.title}`)).toBeVisible();
      await expect(page.locator('text=Checklist item added')).toBeVisible();
    });

    test('should toggle checklist item completion', async ({ page }) => {
      // Find and click checkbox for an uncompleted item
      await page.click('[data-testid="checklist-checkbox"]').first();

      // Verify item is marked as completed
      await expect(page.locator('[data-testid="completed-item"]')).toBeVisible();
    });

    test('should perform bulk operations', async ({ page }) => {
      // Click bulk operations menu
      await page.click('[data-testid="bulk-operations"]');

      // Click "Check All"
      await page.click('text=Check All');

      // Verify all items are checked
      await expect(page.locator('text=All items checked')).toBeVisible();

      // Click bulk operations again
      await page.click('[data-testid="bulk-operations"]');

      // Remove completed items
      await page.click('text=Remove Completed');

      // Verify items were removed
      await expect(page.locator('text=completed items removed')).toBeVisible();
    });
  });

  test.describe('Acceptance Criteria', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('text=Edit Existing Task');
      await page.click('text=Acceptance Criteria');
    });

    test('should create plain text acceptance criteria', async ({ page }) => {
      // Fill in plain text criteria
      await page.fill('textarea[id="criteria-content"]', testAcceptanceCriteria.plainText);

      // Verify content is saved (auto-save)
      await page.waitForTimeout(1000); // Wait for auto-save
      await expect(page.locator(`text=User can create and edit tasks`)).toBeVisible();
    });

    test('should switch to Gherkin format', async ({ page }) => {
      // Change format to Gherkin
      await page.click('[id="format-select"]');
      await page.click('text=Gherkin (BDD)');

      // Fill in Gherkin criteria
      await page.fill('textarea[id="criteria-content"]', testAcceptanceCriteria.gherkin);

      // Verify Gherkin helpers are shown
      await expect(page.locator('text=Quick add:')).toBeVisible();
      await expect(page.locator('button:has-text("Given")')).toBeVisible();
      await expect(page.locator('button:has-text("When")')).toBeVisible();
      await expect(page.locator('button:has-text("Then")')).toBeVisible();
    });

    test('should use template snippets', async ({ page }) => {
      // Click Templates dropdown
      await page.click('button:has-text("Templates")');

      // Select a template
      await page.click('text=Basic Requirements');

      // Verify template content is loaded
      await expect(page.locator('text=User can view the main dashboard')).toBeVisible();
    });

    test('should validate Gherkin syntax', async ({ page }) => {
      // Change to Gherkin format
      await page.click('[id="format-select"]');
      await page.click('text=Gherkin (BDD)');

      // Enter invalid Gherkin
      await page.fill('textarea[id="criteria-content"]', 'This is not valid Gherkin syntax');

      // Should show validation errors
      await expect(page.locator('text=Validation Errors:')).toBeVisible();
      await expect(page.locator('text=Missing "Given" clause')).toBeVisible();
    });

    test('should toggle preview mode', async ({ page }) => {
      // Fill in some content
      await page.fill('textarea[id="criteria-content"]', testAcceptanceCriteria.plainText);

      // Toggle to preview mode
      await page.click('button:has-text("Preview")');

      // Should show formatted preview
      await expect(page.locator('.font-mono')).toBeVisible();

      // Toggle back to edit mode
      await page.click('button:has-text("Edit")');

      // Should show textarea again
      await expect(page.locator('textarea[id="criteria-content"]')).toBeVisible();
    });
  });

  test.describe('Auto-save Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to auto-save enabled story
      await page.click('text=Task With Auto Save');
    });

    test('should auto-save changes after delay', async ({ page }) => {
      // Make a change to trigger auto-save
      await page.fill('input[id="title"]', 'Auto-save Test Title');

      // Wait for auto-save delay (1 second in the story)
      await page.waitForTimeout(1500);

      // Should see last saved timestamp update
      await expect(page.locator('text=Last saved:')).toBeVisible();
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('should handle keyboard navigation', async ({ page }) => {
      // Tab navigation through form fields
      await page.keyboard.press('Tab'); // Should focus title
      await expect(page.locator('input[id="title"]')).toBeFocused();

      await page.keyboard.press('Tab'); // Should focus description
      await expect(page.locator('textarea[id="description"]')).toBeFocused();

      // Escape key should cancel editing if in a form
      await page.keyboard.press('Escape');
    });

    test('should handle save shortcut', async ({ page }) => {
      // Fill in minimum required data
      await page.fill('input[id="title"]', 'Shortcut Test Task');

      // Use Ctrl+S (or Cmd+S on Mac) to save
      const isMac = process.platform === 'darwin';
      await page.keyboard.press(isMac ? 'Meta+S' : 'Control+S');

      // Should trigger save
      await expect(page.locator('text=Task saved successfully')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Should still show main elements
      await expect(page.locator('text=Create Task')).toBeVisible();
      await expect(page.locator('input[id="title"]')).toBeVisible();

      // Tabs might be stacked or collapsed on mobile
      await expect(page.locator('[role="tablist"]')).toBeVisible();
    });

    test('should work correctly on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Should show all elements properly
      await expect(page.locator('text=Create Task')).toBeVisible();
      await expect(page.locator('[role="tablist"]')).toBeVisible();

      // Form should be properly laid out
      await expect(page.locator('input[id="title"]')).toBeVisible();
      await expect(page.locator('textarea[id="description"]')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('**/api/**', route => route.abort());

      // Try to save task
      await page.fill('input[id="title"]', 'Network Error Test');
      await page.click('button:has-text("Save Task")');

      // Should show error message
      await expect(page.locator('text=Failed to save task')).toBeVisible();
    });

    test('should recover from validation errors', async ({ page }) => {
      // Enter invalid data
      await page.fill('input[id="estimatedHours"]', '-5');
      await page.click('button:has-text("Save Task")');

      // Should show validation error
      await expect(page.locator('text=Estimated hours must be at least')).toBeVisible();

      // Fix the error
      await page.fill('input[id="estimatedHours"]', '5');
      await page.fill('input[id="title"]', 'Valid Task Title');
      await page.click('button:has-text("Save Task")');

      // Should succeed now
      await expect(page.locator('text=Task saved successfully')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper focus management', async ({ page }) => {
      // Check that form elements are focusable
      await page.keyboard.press('Tab');
      await expect(page.locator('input[id="title"]')).toBeFocused();

      // Error messages should be announced
      await page.click('button:has-text("Save Task")');
      const titleInput = page.locator('input[id="title"]');
      await expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check that form controls have proper labels
      const titleInput = page.locator('input[id="title"]');
      const titleLabel = page.locator('label[for="title"]');

      await expect(titleLabel).toBeVisible();
      await expect(titleInput).toHaveAttribute('id', 'title');

      // Progress bars should have proper ARIA attributes
      await page.click('text=Edit Existing Task');
      const progressBar = page.locator('[role="progressbar"]');
      await expect(progressBar).toHaveAttribute('aria-valuenow');
      await expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      await expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });
  });
});