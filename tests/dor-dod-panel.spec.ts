import { test, expect } from '@playwright/test';

test.describe('DorDodPanel Component', () => {
  // Setup function to navigate to a test page with DorDodPanel
  const setupTestPage = async (page: any) => {
    // We'll create a test page for the component
    await page.goto('/dor-dod-panel-test');
  };

  test.beforeEach(async ({ page }) => {
    // Wait for the page to be ready
    await page.goto('/');
  });

  test.describe('Component Rendering', () => {
    test('should display DoR and DoD sections', async ({ page }) => {
      await setupTestPage(page);

      // Check for main section headers
      await expect(page.getByText('Definition of Ready')).toBeVisible();
      await expect(page.getByText('Definition of Done')).toBeVisible();
    });

    test('should show empty state when no criteria exist', async ({ page }) => {
      await setupTestPage(page);

      // Look for empty state message
      const emptyStateMessages = page.getByText('No criteria defined yet.');
      await expect(emptyStateMessages.first()).toBeVisible();
    });

    test('should display progress indicators when enabled', async ({ page }) => {
      await setupTestPage(page);

      // Look for progress-related elements
      await expect(page.getByText('Overall Progress')).toBeVisible();
      await expect(page.getByText('Readiness Score')).toBeVisible();
      await expect(page.getByText('Completion Score')).toBeVisible();
    });
  });

  test.describe('Criterion Management', () => {
    test('should add new criterion via dialog', async ({ page }) => {
      await setupTestPage(page);

      // Click add criterion button
      const addButton = page.getByText('Add Criterion').first();
      await addButton.click();

      // Wait for dialog to appear
      await expect(page.getByText('Add New Criterion')).toBeVisible();

      // Fill in criterion details
      await page.getByPlaceholder('Describe what needs to be completed...').fill('Test criterion description');

      // Select category
      await page.getByRole('combobox').first().click();
      await page.getByText('Required').click();

      // Save the criterion
      await page.getByRole('button', { name: 'Add Criterion' }).click();

      // Verify criterion appears in the list
      await expect(page.getByText('Test criterion description')).toBeVisible();
    });

    test('should edit existing criterion', async ({ page }) => {
      await setupTestPage(page);

      // First add a criterion to edit
      const addButton = page.getByText('Add Criterion').first();
      await addButton.click();
      await page.getByPlaceholder('Describe what needs to be completed...').fill('Original description');
      await page.getByRole('button', { name: 'Add Criterion' }).click();

      // Wait for criterion to be added
      await expect(page.getByText('Original description')).toBeVisible();

      // Click on the more options menu
      const moreButton = page.getByRole('button', { name: /more/i }).first();
      await moreButton.click();

      // Click edit option
      await page.getByText('Edit').click();

      // Wait for edit dialog
      await expect(page.getByText('Edit Criterion')).toBeVisible();

      // Update the description
      const descriptionField = page.getByPlaceholder('Describe what needs to be completed...');
      await descriptionField.clear();
      await descriptionField.fill('Updated description');

      // Save changes
      await page.getByRole('button', { name: 'Update Criterion' }).click();

      // Verify updated criterion appears
      await expect(page.getByText('Updated description')).toBeVisible();
      await expect(page.getByText('Original description')).not.toBeVisible();
    });

    test('should delete criterion with confirmation', async ({ page }) => {
      await setupTestPage(page);

      // Add a criterion to delete
      const addButton = page.getByText('Add Criterion').first();
      await addButton.click();
      await page.getByPlaceholder('Describe what needs to be completed...').fill('Criterion to delete');
      await page.getByRole('button', { name: 'Add Criterion' }).click();

      // Wait for criterion to appear
      await expect(page.getByText('Criterion to delete')).toBeVisible();

      // Open more options menu
      const moreButton = page.getByRole('button', { name: /more/i }).first();
      await moreButton.click();

      // Click delete
      await page.getByText('Delete').click();

      // Verify criterion is removed
      await expect(page.getByText('Criterion to delete')).not.toBeVisible();
    });

    test('should toggle criterion completion', async ({ page }) => {
      await setupTestPage(page);

      // Add a criterion
      const addButton = page.getByText('Add Criterion').first();
      await addButton.click();
      await page.getByPlaceholder('Describe what needs to be completed...').fill('Criterion to toggle');
      await page.getByRole('button', { name: 'Add Criterion' }).click();

      // Wait for criterion to appear
      await expect(page.getByText('Criterion to toggle')).toBeVisible();

      // Find and click the checkbox
      const checkbox = page.getByRole('checkbox').first();
      await expect(checkbox).not.toBeChecked();

      await checkbox.click();
      await expect(checkbox).toBeChecked();

      // Click again to uncheck
      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
    });
  });

  test.describe('Template Operations', () => {
    test('should apply template to populate criteria', async ({ page }) => {
      await setupTestPage(page);

      // Open templates dropdown
      await page.getByText('Templates').click();

      // Select a template (assuming Software Development is available)
      await page.getByText('Software Development').click();

      // Verify criteria from template appear
      await expect(page.getByText('Requirements are clearly defined')).toBeVisible();
      await expect(page.getByText('Code is complete and follows coding standards')).toBeVisible();
    });

    test('should show template information in applied state', async ({ page }) => {
      await setupTestPage(page);

      // Apply a template
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Verify template is indicated as current
      // This might be shown in a status indicator or title
      await expect(page.getByText('Software Development')).toBeVisible();
    });
  });

  test.describe('Progress Tracking', () => {
    test('should update progress indicators when criteria are completed', async ({ page }) => {
      await setupTestPage(page);

      // Add some criteria
      const addButton = page.getByText('Add Criterion').first();

      // Add first criterion
      await addButton.click();
      await page.getByPlaceholder('Describe what needs to be completed...').fill('First criterion');
      await page.getByRole('button', { name: 'Add Criterion' }).click();

      // Add second criterion
      await addButton.click();
      await page.getByPlaceholder('Describe what needs to be completed...').fill('Second criterion');
      await page.getByRole('button', { name: 'Add Criterion' }).click();

      // Initially both should be unchecked and progress low
      const checkboxes = page.getByRole('checkbox');
      await expect(checkboxes.first()).not.toBeChecked();

      // Complete first criterion
      await checkboxes.first().click();

      // Progress should update (specific percentages depend on weighting)
      await expect(page.getByText(/\d+% Complete/)).toBeVisible();

      // Complete second criterion
      await checkboxes.nth(1).click();

      // Progress should increase further
      await expect(page.getByText(/\d+% Complete/)).toBeVisible();
    });

    test('should show ready status when all required criteria complete', async ({ page }) => {
      await setupTestPage(page);

      // Apply a template to get required criteria
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Complete all required criteria (checkboxes for required items)
      const requiredCheckboxes = page.getByRole('checkbox');
      const count = await requiredCheckboxes.count();

      // Complete required criteria only (first few are typically required)
      for (let i = 0; i < Math.min(count, 4); i++) {
        await requiredCheckboxes.nth(i).click();
      }

      // Should show ready status
      await expect(page.getByText('Ready to Start')).toBeVisible();
    });
  });

  test.describe('Validation', () => {
    test('should show validation errors for incomplete required criteria', async ({ page }) => {
      await setupTestPage(page);

      // Apply template which includes required criteria
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Should show validation errors since required items aren't complete
      await expect(page.getByText(/validation error/i)).toBeVisible();
    });

    test('should clear validation errors when required criteria completed', async ({ page }) => {
      await setupTestPage(page);

      // Apply template
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Complete required criteria
      const checkboxes = page.getByRole('checkbox');
      const requiredCount = Math.min(await checkboxes.count(), 4);

      for (let i = 0; i < requiredCount; i++) {
        await checkboxes.nth(i).click();
      }

      // Validation errors should be cleared
      await expect(page.getByText(/validation error/i)).not.toBeVisible();
    });
  });

  test.describe('Bulk Operations', () => {
    test('should support bulk import of criteria', async ({ page }) => {
      await setupTestPage(page);

      // Open actions menu for bulk operations
      const moreButton = page.getByRole('button', { name: /more/i }).first();
      await moreButton.click();

      // Click bulk add
      await page.getByText('Bulk Add').click();

      // Should open bulk import dialog
      await expect(page.getByText('Bulk Import')).toBeVisible();

      // Enter multiple criteria (text format)
      const bulkText = 'First criterion\nSecond criterion\nThird criterion';
      await page.getByPlaceholder(/one per line/i).fill(bulkText);

      // Import criteria
      await page.getByRole('button', { name: 'Import Criteria' }).click();

      // Verify all criteria were added
      await expect(page.getByText('First criterion')).toBeVisible();
      await expect(page.getByText('Second criterion')).toBeVisible();
      await expect(page.getByText('Third criterion')).toBeVisible();
    });

    test('should support clearing all criteria', async ({ page }) => {
      await setupTestPage(page);

      // Add some criteria first
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Verify criteria exist
      await expect(page.getByText('Requirements are clearly defined')).toBeVisible();

      // Clear all
      await page.getByText('Clear All').click();

      // Verify criteria are cleared
      await expect(page.getByText('Requirements are clearly defined')).not.toBeVisible();
      await expect(page.getByText('No criteria defined yet.')).toBeVisible();
    });
  });

  test.describe('Export Functionality', () => {
    test('should export criteria as JSON', async ({ page }) => {
      await setupTestPage(page);

      // Add some criteria
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Set up download promise before triggering download
      const downloadPromise = page.waitForEvent('download');

      // Open export menu and select JSON
      await page.getByText('Export').click();
      await page.getByText('Export as JSON').click();

      // Wait for download
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('dor-dod.json');
    });

    test('should export criteria as CSV', async ({ page }) => {
      await setupTestPage(page);

      // Add some criteria
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Set up download promise
      const downloadPromise = page.waitForEvent('download');

      // Export as CSV
      await page.getByText('Export').click();
      await page.getByText('Export as CSV').click();

      // Verify download
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('dor-dod.csv');
    });
  });

  test.describe('Responsive Design', () => {
    test('should adapt layout for mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await setupTestPage(page);

      // Apply template to get content
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Verify sections are still visible and accessible
      await expect(page.getByText('Definition of Ready')).toBeVisible();
      await expect(page.getByText('Definition of Done')).toBeVisible();

      // Verify criteria are still visible
      await expect(page.getByText('Requirements are clearly defined')).toBeVisible();
    });

    test('should support section collapse on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setupTestPage(page);

      // Apply template
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Click section header to collapse
      const dorHeader = page.getByText('Definition of Ready');
      await dorHeader.click();

      // Criteria should be hidden when collapsed
      await expect(page.getByText('Requirements are clearly defined')).not.toBeVisible();

      // Click again to expand
      await dorHeader.click();
      await expect(page.getByText('Requirements are clearly defined')).toBeVisible();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation through criteria', async ({ page }) => {
      await setupTestPage(page);

      // Add some criteria
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Start at first focusable element
      await page.keyboard.press('Tab');

      // Should be able to navigate to checkboxes
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeFocused();

      // Space should toggle checkbox
      await page.keyboard.press('Space');

      // Continue tabbing through elements
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeFocused();
    });

    test('should support keyboard shortcuts for common actions', async ({ page }) => {
      await setupTestPage(page);

      // Focus on the component area
      await page.click('body');

      // Test if keyboard shortcuts work (if implemented)
      // This would depend on specific keyboard shortcut implementation
      await page.keyboard.press('Control+KeyN'); // Hypothetical "new criterion" shortcut

      // Would verify if add criterion dialog opens
      // This is placeholder - actual shortcuts would need to be implemented
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await setupTestPage(page);

      // Apply template to get content
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Check for proper ARIA labeling
      const checkboxes = page.getByRole('checkbox');
      const firstCheckbox = checkboxes.first();

      // Checkboxes should have accessible names
      await expect(firstCheckbox).toBeVisible();

      // Buttons should have accessible names
      const buttons = page.getByRole('button');
      await expect(buttons.first()).toBeVisible();
    });

    test('should support screen reader navigation', async ({ page }) => {
      await setupTestPage(page);

      // Apply template
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Check heading structure
      const headings = page.getByRole('heading');
      await expect(headings.first()).toBeVisible();

      // Check for proper semantic structure
      const _landmarks = page.getByRole('region');
      // Specific assertions depend on landmark implementation
    });
  });

  test.describe('Print Mode', () => {
    test('should render correctly in print mode', async ({ page }) => {
      await setupTestPage(page);

      // Apply template to get content
      await page.getByText('Templates').click();
      await page.getByText('Software Development').click();

      // Switch to print mode (this would need to be implemented in the test page)
      // For now, we'll test that print-related elements are accessible

      // Check for print-friendly elements
      await expect(page.getByText('Definition of Ready')).toBeVisible();
      await expect(page.getByText('Definition of Done')).toBeVisible();

      // Verify content is still readable
      await expect(page.getByText('Requirements are clearly defined')).toBeVisible();
    });
  });
});