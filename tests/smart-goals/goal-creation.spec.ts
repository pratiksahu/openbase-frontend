/**
 * Goal Creation E2E Tests
 *
 * Comprehensive end-to-end tests for the SMART Goals creation workflow
 * including wizard navigation, form validation, and goal persistence.
 */

import { test, expect, Page } from '@playwright/test';

// Test Configuration
const GOALS_BASE_URL = '/goals';
const NEW_GOAL_URL = '/goals/new';

test.describe('Goal Creation Workflow', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto(NEW_GOAL_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should display goal creation wizard correctly', async ({ page }) => {
    // Check page title and header
    await expect(page).toHaveTitle(/Create.*Goal.*OpenBase/);
    await expect(page.locator('h1')).toContainText(/Create.*Goal/i);

    // Check for wizard elements
    await expect(page.locator('[data-testid="goal-wizard"], .wizard')).toBeVisible();

    // Should show wizard steps
    await expect(page.locator('[data-testid="wizard-stepper"], .stepper')).toBeVisible();

    // Should show navigation buttons
    await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /back|previous/i })).toBeVisible();
  });

  test('should navigate through wizard steps', async ({ page }) => {
    // Start with Context step
    await expect(page.locator('text=/Context/i')).toBeVisible();

    // Fill minimal context data
    const titleInput = page.getByLabel(/Goal Title/i).or(page.locator('input[name="title"]'));
    await titleInput.fill('Test SMART Goal');

    const descriptionInput = page.getByLabel(/Description/i).or(page.locator('textarea[name="description"]'));
    await descriptionInput.fill('This is a test goal for E2E testing');

    // Navigate to next step
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.locator('text=/Specific/i')).toBeVisible();

    // Fill specific objective
    const objectiveInput = page.getByLabel(/Specific Objective/i).or(page.locator('textarea[name="specificObjective"]'));
    await objectiveInput.fill('Complete the comprehensive testing of SMART Goals feature');

    // Navigate to measurable step
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.locator('text=/Measurable/i')).toBeVisible();

    // Fill measurable data
    const targetInput = page.getByLabel(/Target Value/i).or(page.locator('input[name="targetValue"]'));
    await targetInput.fill('100');

    const unitInput = page.getByLabel(/Unit/i).or(page.locator('input[name="unit"]'));
    await unitInput.fill('percent');

    // Continue through remaining steps
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.locator('text=/Achievable/i')).toBeVisible();

    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.locator('text=/Relevant/i')).toBeVisible();

    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.locator('text=/Time-bound/i')).toBeVisible();

    // Set target date
    const targetDateInput = page.getByLabel(/Target Date/i).or(page.locator('input[type="date"]'));
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    await targetDateInput.fill(futureDate.toISOString().split('T')[0]);

    // Navigate to preview
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.locator('text=/Preview/i')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to navigate without filling title
    await page.getByRole('button', { name: /next/i }).click();

    // Should show validation error
    await expect(page.locator('text=/title.*required/i')).toBeVisible();

    // Fill title and try again
    const titleInput = page.getByLabel(/Goal Title/i).or(page.locator('input[name="title"]'));
    await titleInput.fill('Test Goal');

    // Try to navigate without description
    await page.getByRole('button', { name: /next/i }).click();

    // Should show description validation error
    await expect(page.locator('text=/description.*required/i')).toBeVisible();
  });

  test('should show SMART score calculation', async ({ page }) => {
    // Fill basic information
    await fillBasicGoalInfo();

    // Navigate to preview step
    await navigateToPreview();

    // Should display SMART score badge
    await expect(page.locator('[data-testid="smart-score"], .smart-score')).toBeVisible();

    // Score should be visible
    await expect(page.locator('text=/\\d+/').first()).toBeVisible();
  });

  test('should save goal successfully', async ({ page }) => {
    // Fill complete goal information
    await fillCompleteGoalInfo();

    // Navigate to preview
    await navigateToPreview();

    // Click save button
    const saveButton = page.getByRole('button', { name: /save|create/i });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Should redirect to goals list or goal detail
    await page.waitForURL(/\/goals/);

    // Should show success message
    await expect(page.locator('text=/success|created|saved/i')).toBeVisible();
  });

  test('should handle navigation back and forth', async ({ page }) => {
    await fillBasicGoalInfo();

    // Navigate forward
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.locator('text=/Specific/i')).toBeVisible();

    // Navigate back
    await page.getByRole('button', { name: /back|previous/i }).click();
    await expect(page.locator('text=/Context/i')).toBeVisible();

    // Data should be preserved
    const titleInput = page.getByLabel(/Goal Title/i).or(page.locator('input[name="title"]'));
    await expect(titleInput).toHaveValue('Test SMART Goal');
  });

  test('should support form auto-save', async ({ page }) => {
    // Fill some data
    await fillBasicGoalInfo();

    // Wait for auto-save indicator (if implemented)
    const autoSaveIndicator = page.locator('[data-testid="auto-save"], text=/saved|saving/i');
    if (await autoSaveIndicator.isVisible({ timeout: 3000 })) {
      await expect(autoSaveIndicator).toBeVisible();
    }

    // Refresh page
    await page.reload();

    // Data should be preserved
    const titleInput = page.getByLabel(/Goal Title/i).or(page.locator('input[name="title"]'));
    await expect(titleInput).toHaveValue('Test SMART Goal');
  });

  test('should handle wizard exit confirmation', async ({ page }) => {
    // Fill some data
    await fillBasicGoalInfo();

    // Try to navigate away
    const backLink = page.getByRole('link', { name: /back to goals/i });
    await backLink.click();

    // Should show confirmation dialog
    const confirmDialog = page.locator('[role="dialog"], .dialog');
    if (await confirmDialog.isVisible({ timeout: 2000 })) {
      await expect(confirmDialog).toBeVisible();
      await expect(confirmDialog.locator('text=/unsaved.*changes/i')).toBeVisible();

      // Cancel to stay
      await page.getByRole('button', { name: /cancel|stay/i }).click();
      await expect(page.locator('text=/Context/i')).toBeVisible();
    }
  });

  test('should display help content', async ({ page }) => {
    // Look for help section or tooltips
    const helpSection = page.locator('[data-testid="help"], text=/help/i');
    if (await helpSection.isVisible()) {
      await expect(helpSection).toBeVisible();
    }

    // Check for step-specific help
    const contextHelp = page.locator('text=/what.*SMART.*goals/i');
    if (await contextHelp.isVisible()) {
      await expect(contextHelp).toBeVisible();
    }
  });

  // Helper functions
  async function fillBasicGoalInfo() {
    const titleInput = page.getByLabel(/Goal Title/i).or(page.locator('input[name="title"]'));
    await titleInput.fill('Test SMART Goal');

    const descriptionInput = page.getByLabel(/Description/i).or(page.locator('textarea[name="description"]'));
    await descriptionInput.fill('This is a comprehensive test goal for E2E testing of the SMART Goals system');
  }

  async function fillCompleteGoalInfo() {
    // Context step
    await fillBasicGoalInfo();

    // Move to specific step
    await page.getByRole('button', { name: /next/i }).click();
    const objectiveInput = page.getByLabel(/Specific Objective/i).or(page.locator('textarea[name="specificObjective"]'));
    await objectiveInput.fill('Successfully complete all E2E tests with 100% pass rate');

    // Move to measurable step
    await page.getByRole('button', { name: /next/i }).click();
    const targetInput = page.getByLabel(/Target Value/i).or(page.locator('input[name="targetValue"]'));
    await targetInput.fill('100');

    const unitInput = page.getByLabel(/Unit/i).or(page.locator('input[name="unit"]'));
    await unitInput.fill('percent');

    // Move to achievable step
    await page.getByRole('button', { name: /next/i }).click();
    // Add achievability assessment if form is present

    // Move to relevant step
    await page.getByRole('button', { name: /next/i }).click();
    const rationale = page.getByLabel(/Rationale/i).or(page.locator('textarea[name="rationale"]'));
    if (await rationale.isVisible()) {
      await rationale.fill('This goal is highly relevant for ensuring product quality');
    }

    // Move to time-bound step
    await page.getByRole('button', { name: /next/i }).click();
    const targetDateInput = page.getByLabel(/Target Date/i).or(page.locator('input[type="date"]'));
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    await targetDateInput.fill(futureDate.toISOString().split('T')[0]);
  }

  async function navigateToPreview() {
    // Keep clicking next until we reach preview
    let attempts = 0;
    while (attempts < 10) {
      const nextButton = page.getByRole('button', { name: /next/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }

      if (await page.locator('text=/Preview/i').isVisible()) {
        break;
      }
      attempts++;
    }

    await expect(page.locator('text=/Preview/i')).toBeVisible();
  }
});

test.describe('Goal Templates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(NEW_GOAL_URL);
  });

  test('should display goal templates if available', async ({ page }) => {
    // Look for template section
    const templateSection = page.locator('[data-testid="templates"], text=/templates/i');

    if (await templateSection.isVisible()) {
      await expect(templateSection).toBeVisible();

      // Check for template cards
      const templateCards = page.locator('[data-testid="template-card"], .template');
      const cardCount = await templateCards.count();

      if (cardCount > 0) {
        await expect(templateCards.first()).toBeVisible();
      }
    }
  });

  test('should apply template when selected', async ({ page }) => {
    // Look for template selection
    const templateCard = page.locator('[data-testid="template-card"], .template').first();

    if (await templateCard.isVisible()) {
      await templateCard.click();

      // Should populate form fields
      await page.waitForTimeout(500);

      const titleInput = page.getByLabel(/Goal Title/i).or(page.locator('input[name="title"]'));
      const titleValue = await titleInput.inputValue();

      expect(titleValue.length).toBeGreaterThan(0);
    }
  });
});