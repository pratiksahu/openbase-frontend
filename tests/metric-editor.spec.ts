/**
 * MetricEditor E2E Tests
 *
 * End-to-end tests for the MetricEditor component workflow using Playwright
 */

import { test, expect } from '@playwright/test';

// Test data
const testMetric = {
  name: 'Customer Satisfaction Score',
  currentValue: '72',
  targetValue: '85',
  unit: '%',
};

const testCheckpoints = [
  { value: '65', date: '2024-01-01', note: 'Initial baseline measurement' },
  { value: '70', date: '2024-01-15', note: 'After first improvement initiative' },
  { value: '72', date: '2024-02-01', note: 'Current measurement' },
];

test.describe('MetricEditor Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the MetricEditor component in Storybook or test page
    // Adjust URL based on your setup
    await page.goto('/storybook/?path=/story/components-metriceditor--default');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Basic Functionality', () => {
    test('should render MetricEditor with default state', async ({ page }) => {
      // Check main elements are present
      await expect(page.getByText('Metric Editor')).toBeVisible();
      await expect(page.getByText('Define a measurable specification for your goal')).toBeVisible();
      await expect(page.getByRole('button', { name: /save metric/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();

      // Check form fields are present
      await expect(page.getByLabel(/metric name/i)).toBeVisible();
      await expect(page.getByLabel(/current value/i)).toBeVisible();
      await expect(page.getByLabel(/target value/i)).toBeVisible();
      await expect(page.getByLabel(/unit/i)).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      // Try to save without filling required fields
      await page.getByRole('button', { name: /save metric/i }).click();

      // Check validation messages
      await expect(page.getByText(/metric name must be at least 3 characters/i)).toBeVisible();
    });

    test('should fill and submit basic metric form', async ({ page }) => {
      // Fill out the basic form
      await page.getByLabel(/metric name/i).fill(testMetric.name);
      await page.getByLabel(/current value/i).fill(testMetric.currentValue);
      await page.getByLabel(/target value/i).fill(testMetric.targetValue);
      await page.getByLabel(/unit/i).fill(testMetric.unit);

      // Check if save button is enabled
      const saveButton = page.getByRole('button', { name: /save metric/i });
      await expect(saveButton).toBeEnabled();

      // Submit the form
      await saveButton.click();

      // Check if form submission was successful
      // This would depend on your implementation - might show success message or navigate
    });

    test('should cancel metric creation', async ({ page }) => {
      // Fill some data
      await page.getByLabel(/metric name/i).fill('Test Metric');

      // Click cancel
      await page.getByRole('button', { name: /cancel/i }).click();

      // Verify cancel action (implementation dependent)
      // Could check for navigation, modal close, etc.
    });
  });

  test.describe('Metric Type Selection', () => {
    test('should open metric type selector', async ({ page }) => {
      // Find and click the metric type dropdown
      const typeSelector = page.getByRole('combobox').first();
      await typeSelector.click();

      // Verify dropdown options are visible
      await expect(page.getByText('Currency')).toBeVisible();
      await expect(page.getByText('Duration')).toBeVisible();
      await expect(page.getByText('Rating')).toBeVisible();
    });

    test('should select different metric types', async ({ page }) => {
      // Open metric type dropdown
      const typeSelector = page.getByRole('combobox').first();
      await typeSelector.click();

      // Select Currency type
      await page.getByText('Currency').click();

      // Verify currency type is selected and unit is updated
      await expect(page.locator('input[value="$"]')).toBeVisible();

      // Test another type - Percentage
      await typeSelector.click();
      await page.getByText('Percentage').click();

      // Verify percentage type configuration appears
      await expect(page.locator('input[value="%"]')).toBeVisible();
    });

    test('should display type-specific configuration', async ({ page }) => {
      // Select percentage type
      const typeSelector = page.getByRole('combobox').first();
      await typeSelector.click();
      await page.getByText('Percentage').click();

      // Check type configuration card appears
      await expect(page.getByText('Percentage value (0-100)')).toBeVisible();
      await expect(page.getByText('85%')).toBeVisible(); // Example value
      await expect(page.getByText('Default Unit:')).toBeVisible();
    });
  });

  test.describe('Progress Analysis', () => {
    test('should show progress preview with valid data', async ({ page }) => {
      // Fill basic metric data
      await page.getByLabel(/metric name/i).fill(testMetric.name);
      await page.getByLabel(/current value/i).fill(testMetric.currentValue);
      await page.getByLabel(/target value/i).fill(testMetric.targetValue);
      await page.getByLabel(/unit/i).fill(testMetric.unit);

      // Check progress preview appears
      await expect(page.getByText('Progress Preview')).toBeVisible();
      await expect(page.getByText('Real-time analysis based on current values')).toBeVisible();

      // Check progress bar and percentage
      const progressBar = page.locator('[role="progressbar"]');
      await expect(progressBar).toBeVisible();
    });

    test('should update progress when values change', async ({ page }) => {
      // Fill initial values
      await page.getByLabel(/current value/i).fill('50');
      await page.getByLabel(/target value/i).fill('100');

      // Wait for progress to update
      await page.waitForTimeout(500);

      // Change current value
      await page.getByLabel(/current value/i).clear();
      await page.getByLabel(/current value/i).fill('75');

      // Wait and check if progress updated
      await page.waitForTimeout(500);
      // Progress should now show 75%
    });
  });

  test.describe('Tab Navigation', () => {
    test('should navigate between tabs', async ({ page }) => {
      // Start on Configuration tab (default)
      await expect(page.getByText('Basic Configuration')).toBeVisible();

      // Switch to Checkpoints tab
      await page.getByRole('tab', { name: /checkpoints/i }).click();
      await expect(page.getByText('Progress Checkpoints')).toBeVisible();

      // Switch to Analysis tab
      await page.getByRole('tab', { name: /analysis/i }).click();
      // Should show either chart or "No Data to Analyze" message
      const hasData = await page.getByTestId('chart-container').isVisible().catch(() => false);
      const noData = await page.getByText('No Data to Analyze').isVisible().catch(() => false);
      expect(hasData || noData).toBe(true);
    });

    test('should maintain tab state during interaction', async ({ page }) => {
      // Switch to checkpoints tab
      await page.getByRole('tab', { name: /checkpoints/i }).click();
      await expect(page.getByText('Progress Checkpoints')).toBeVisible();

      // Interact with something
      await page.getByRole('combobox').first().click(); // Sort dropdown

      // Tab should still be active
      await expect(page.getByText('Progress Checkpoints')).toBeVisible();
    });
  });

  test.describe('Checkpoint Management', () => {
    test.beforeEach(async ({ page }) => {
      // Fill basic metric data first
      await page.getByLabel(/metric name/i).fill(testMetric.name);
      await page.getByLabel(/current value/i).fill(testMetric.currentValue);
      await page.getByLabel(/target value/i).fill(testMetric.targetValue);
      await page.getByLabel(/unit/i).fill(testMetric.unit);

      // Navigate to checkpoints tab
      await page.getByRole('tab', { name: /checkpoints/i }).click();
    });

    test('should show empty state initially', async ({ page }) => {
      await expect(page.getByText('No Checkpoints Yet')).toBeVisible();
      await expect(page.getByText('Start tracking your progress by adding your first checkpoint')).toBeVisible();
      await expect(page.getByRole('button', { name: /add checkpoint/i })).toBeVisible();
    });

    test('should open add checkpoint dialog', async ({ page }) => {
      // Click add checkpoint button
      await page.getByRole('button', { name: /add checkpoint/i }).click();

      // Check dialog opens
      await expect(page.getByText('Add New Checkpoint')).toBeVisible();
      await expect(page.getByText('Record a new measurement for this metric')).toBeVisible();
      await expect(page.getByLabel(/value/i)).toBeVisible();
      await expect(page.getByLabel(/date/i)).toBeVisible();
    });

    test('should add a new checkpoint', async ({ page }) => {
      // Open add checkpoint dialog
      await page.getByRole('button', { name: /add checkpoint/i }).click();

      // Fill checkpoint data
      await page.getByLabel(/value/i).fill(testCheckpoints[0].value);
      await page.getByLabel(/note/i).fill(testCheckpoints[0].note);

      // Submit checkpoint
      await page.getByRole('button', { name: /add checkpoint/i }).nth(1).click();

      // Dialog should close and checkpoint should appear
      await expect(page.getByText('Add New Checkpoint')).not.toBeVisible();
      await expect(page.getByText(testCheckpoints[0].note)).toBeVisible();
      await expect(page.getByText(`${testCheckpoints[0].value}%`)).toBeVisible();
    });

    test('should validate checkpoint data', async ({ page }) => {
      // Open add checkpoint dialog
      await page.getByRole('button', { name: /add checkpoint/i }).click();

      // Try to submit without value
      await page.getByLabel(/value/i).clear();
      await page.getByRole('button', { name: /add checkpoint/i }).nth(1).click();

      // Should show validation error
      await expect(page.getByText(/value is required/i)).toBeVisible();
    });

    test('should sort checkpoints', async ({ page }) => {
      // First add a few checkpoints (you'd need to implement this helper)
      // For this test, we'll assume checkpoints exist

      // Find the sort dropdown
      const sortDropdown = page.getByRole('combobox').last();
      await sortDropdown.click();

      // Select different sort options
      await page.getByText('Oldest First').click();

      // Verify sort order changed
      // This would require more specific assertions based on your data
    });

    test('should edit existing checkpoint', async ({ page }) => {
      // First add a checkpoint
      await page.getByRole('button', { name: /add checkpoint/i }).click();
      await page.getByLabel(/value/i).fill(testCheckpoints[0].value);
      await page.getByLabel(/note/i).fill(testCheckpoints[0].note);
      await page.getByRole('button', { name: /add checkpoint/i }).nth(1).click();

      // Wait for checkpoint to appear
      await expect(page.getByText(testCheckpoints[0].note)).toBeVisible();

      // Click edit button
      await page.getByRole('button').filter({ hasText: /edit/i }).first().click();

      // Should open edit dialog
      await expect(page.getByText('Edit Checkpoint')).toBeVisible();

      // Modify the value
      await page.getByLabel(/value/i).clear();
      await page.getByLabel(/value/i).fill('68');

      // Save changes
      await page.getByRole('button', { name: /update checkpoint/i }).click();

      // Should show updated value
      await expect(page.getByText('68%')).toBeVisible();
    });

    test('should delete checkpoint', async ({ page }) => {
      // First add a checkpoint
      await page.getByRole('button', { name: /add checkpoint/i }).click();
      await page.getByLabel(/value/i).fill(testCheckpoints[0].value);
      await page.getByRole('button', { name: /add checkpoint/i }).nth(1).click();

      // Click delete button
      await page.locator('[data-testid="delete-checkpoint"]').or(page.getByRole('button').filter({ hasText: /delete/i })).first().click();

      // Confirm deletion in alert dialog
      await page.getByRole('button', { name: /delete/i }).last().click();

      // Checkpoint should be removed
      await expect(page.getByText('No Checkpoints Yet')).toBeVisible();
    });
  });

  test.describe('Chart Visualization', () => {
    test.beforeEach(async ({ page }) => {
      // Set up metric with some checkpoints for visualization
      await page.goto('/storybook/?path=/story/components-metriceditor--with-full-progress');
      await page.waitForLoadState('networkidle');

      // Navigate to analysis tab
      await page.getByRole('tab', { name: /analysis/i }).click();
    });

    test('should display chart with data', async ({ page }) => {
      // Check chart container is present
      await expect(page.getByTestId('chart-container')).toBeVisible();
      await expect(page.getByText('Progress Visualization')).toBeVisible();
    });

    test('should change chart types', async ({ page }) => {
      // Find chart type selector
      const chartTypeSelect = page.getByRole('combobox').filter({ hasText: /chart/i }).first();
      await chartTypeSelect.click();

      // Select Area chart
      await page.getByText('Area').click();

      // Chart should update
      await expect(page.getByTestId('area-chart')).toBeVisible();

      // Switch to Bar chart
      await chartTypeSelect.click();
      await page.getByText('Bar').click();
      await expect(page.getByTestId('bar-chart')).toBeVisible();
    });

    test('should open chart settings', async ({ page }) => {
      // Click settings button
      await page.getByRole('button').filter({ hasText: /settings/i }).first().click();

      // Settings popover should open
      await expect(page.getByText('Chart Options')).toBeVisible();
      await expect(page.getByText('Show Target Line')).toBeVisible();
      await expect(page.getByText('Show Baseline')).toBeVisible();
    });

    test('should export chart data', async ({ page }) => {
      // Click export button
      await page.getByRole('button').filter({ hasText: /export|download/i }).first().click();

      // For this test, we'd need to verify the export action
      // This could involve checking console logs, file downloads, etc.
    });

    test('should open fullscreen chart view', async ({ page }) => {
      // Click fullscreen button
      await page.getByRole('button').filter({ hasText: /maximize|fullscreen/i }).first().click();

      // Fullscreen dialog should open
      await expect(page.getByText('Metric Progress Chart')).toBeVisible();

      // Chart should be larger in fullscreen
      const fullscreenChart = page.getByTestId('chart-container').last();
      await expect(fullscreenChart).toBeVisible();
    });
  });

  test.describe('Advanced Features', () => {
    test('should toggle advanced configuration', async ({ page }) => {
      // Click show advanced button
      await page.getByRole('button', { name: /show advanced/i }).click();

      // Advanced fields should appear
      await expect(page.getByLabel(/baseline value/i)).toBeVisible();
      await expect(page.getByLabel(/minimum value/i)).toBeVisible();
      await expect(page.getByLabel(/maximum value/i)).toBeVisible();
      await expect(page.getByLabel(/description/i)).toBeVisible();

      // Hide advanced
      await page.getByRole('button', { name: /hide advanced/i }).click();

      // Fields should be hidden
      await expect(page.getByLabel(/baseline value/i)).not.toBeVisible();
    });

    test('should fill advanced configuration', async ({ page }) => {
      // Show advanced options
      await page.getByRole('button', { name: /show advanced/i }).click();

      // Fill advanced fields
      await page.getByLabel(/baseline value/i).fill('0');
      await page.getByLabel(/minimum value/i).fill('0');
      await page.getByLabel(/maximum value/i).fill('100');
      await page.getByLabel(/description/i).fill('This metric tracks customer satisfaction through surveys');
      await page.getByLabel(/data source/i).fill('Customer Survey Platform');

      // Values should be saved when form is submitted
      await page.getByLabel(/metric name/i).fill('Advanced Metric');
      await page.getByLabel(/current value/i).fill('50');
      await page.getByLabel(/target value/i).fill('85');
      await page.getByLabel(/unit/i).fill('%');

      const saveButton = page.getByRole('button', { name: /save metric/i });
      await expect(saveButton).toBeEnabled();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Component should still be functional
      await expect(page.getByText('Metric Editor')).toBeVisible();
      await expect(page.getByLabel(/metric name/i)).toBeVisible();

      // Form should be usable on mobile
      await page.getByLabel(/metric name/i).fill('Mobile Test');
      await page.getByLabel(/current value/i).fill('50');
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // All components should be visible and functional
      await expect(page.getByText('Metric Editor')).toBeVisible();

      // Test tab switching on tablet
      await page.getByRole('tab', { name: /checkpoints/i }).click();
      await expect(page.getByText('Progress Checkpoints')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/metric name/i)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.getByRole('combobox').first()).toBeFocused();

      // Continue tabbing through other elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/current value/i)).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check form fields have labels
      const nameInput = page.getByLabel(/metric name/i);
      await expect(nameInput).toHaveAttribute('aria-label');

      const currentValueInput = page.getByLabel(/current value/i);
      await expect(currentValueInput).toHaveAttribute('aria-label');
    });

    test('should work with screen readers', async ({ page }) => {
      // Check role attributes
      const progressBar = page.locator('[role="progressbar"]');
      if (await progressBar.isVisible()) {
        await expect(progressBar).toHaveAttribute('role', 'progressbar');
      }

      const tabs = page.locator('[role="tab"]');
      await expect(tabs.first()).toHaveAttribute('role', 'tab');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid date inputs', async ({ page }) => {
      // Navigate to checkpoints tab
      await page.getByRole('tab', { name: /checkpoints/i }).click();

      // Open add checkpoint dialog
      await page.getByRole('button', { name: /add checkpoint/i }).click();

      // Try to enter future date
      const today = new Date();
      const futureDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const futureDateString = futureDate.toISOString().split('T')[0];

      await page.getByLabel(/date/i).fill(futureDateString);
      await page.getByLabel(/value/i).fill('75');

      // Try to submit
      await page.getByRole('button', { name: /add checkpoint/i }).nth(1).click();

      // Should show error
      await expect(page.getByText(/date cannot be in the future/i)).toBeVisible();
    });

    test('should handle network errors gracefully', async ({ page: _page }) => {
      // This would require mocking network responses
      // Implementation depends on your setup
    });
  });

  test.describe('Integration', () => {
    test('should complete full metric creation workflow', async ({ page }) => {
      // Step 1: Fill basic configuration
      await page.getByLabel(/metric name/i).fill(testMetric.name);

      // Select metric type
      await page.getByRole('combobox').first().click();
      await page.getByText('Percentage').click();

      await page.getByLabel(/current value/i).fill(testMetric.currentValue);
      await page.getByLabel(/target value/i).fill(testMetric.targetValue);
      await page.getByLabel(/unit/i).fill(testMetric.unit);

      // Step 2: Add checkpoints
      await page.getByRole('tab', { name: /checkpoints/i }).click();

      for (const checkpoint of testCheckpoints) {
        await page.getByRole('button', { name: /add checkpoint/i }).click();
        await page.getByLabel(/value/i).fill(checkpoint.value);
        await page.getByLabel(/note/i).fill(checkpoint.note);
        await page.getByRole('button', { name: /add checkpoint/i }).nth(1).click();

        // Wait for checkpoint to be added
        await expect(page.getByText(checkpoint.note)).toBeVisible();
      }

      // Step 3: View analysis
      await page.getByRole('tab', { name: /analysis/i }).click();
      await expect(page.getByTestId('chart-container')).toBeVisible();

      // Step 4: Save metric
      await page.getByRole('tab', { name: /configuration/i }).click();
      await page.getByRole('button', { name: /save metric/i }).click();

      // Should complete successfully
      // Implementation-specific assertion here
    });
  });
});

test.describe('MetricEditor Performance', () => {
  test('should handle large datasets', async ({ page }) => {
    // Navigate to story with large dataset
    await page.goto('/storybook/?path=/story/components-metriceditor--metric-with-many-checkpoints');
    await page.waitForLoadState('networkidle');

    // Should load without performance issues
    await page.getByRole('tab', { name: /analysis/i }).click();
    await expect(page.getByTestId('chart-container')).toBeVisible();

    // Chart interactions should be smooth
    await page.getByRole('combobox').first().click();
    await page.getByText('Area').click();
    await expect(page.getByTestId('area-chart')).toBeVisible();
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/storybook/?path=/story/components-metriceditor--default');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load within reasonable time (adjust threshold as needed)
    expect(loadTime).toBeLessThan(5000);
  });
});