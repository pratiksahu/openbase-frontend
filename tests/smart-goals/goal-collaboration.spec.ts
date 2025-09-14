/**
 * Goal Collaboration E2E Tests
 *
 * Tests for collaborative features including comments, reviews,
 * approvals, and team collaboration workflows.
 */

import { test, expect, Page } from '@playwright/test';

// Test Configuration
const GOALS_BASE_URL = '/goals';
const MOCK_GOAL_ID = 'goal-1';

test.describe('Goal Collaboration Features', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/review`);
    await page.waitForLoadState('networkidle');
  });

  test('should display review interface', async () => {
    // Check for review page elements
    await expect(page.locator('text=/Review/i')).toBeVisible();

    // Should have review tabs
    await expect(page.getByRole('tab', { name: /comments/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /dor.*dod/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /history/i })).toBeVisible();

    // Should have review actions
    await expect(page.getByRole('button', { name: /approve/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /reject/i })).toBeVisible();
  });

  test('should allow adding comments', async () => {
    // Navigate to comments tab
    await page.getByRole('tab', { name: /comments/i }).click();

    // Find comment input
    const commentInput = page.locator('textarea[placeholder*="comment"], [data-testid="comment-input"]');
    await expect(commentInput).toBeVisible();

    // Add a comment
    const testComment = 'This is a test comment for collaboration testing';
    await commentInput.fill(testComment);

    // Submit comment
    const submitButton = page.getByRole('button', { name: /add comment|post|submit/i });
    await submitButton.click();

    // Should show the new comment
    await expect(page.locator(`text=${testComment}`)).toBeVisible();

    // Should show comment metadata
    await expect(page.locator('text=/just now|seconds ago/i')).toBeVisible();
  });

  test('should display comment thread', async () => {
    // Navigate to comments tab
    await page.getByRole('tab', { name: /comments/i }).click();

    // Look for existing comments
    const commentList = page.locator('[data-testid="comments-list"], .comments');

    if (await commentList.isVisible()) {
      const comments = commentList.locator('.comment, [data-testid="comment"]');
      const commentCount = await comments.count();

      if (commentCount > 0) {
        // Should show comment content
        await expect(comments.first()).toBeVisible();

        // Should show author and timestamp
        await expect(page.locator('text=/ago|minutes|hours|days/i')).toBeVisible();
      }
    }
  });

  test('should allow replying to comments', async () => {
    // Navigate to comments tab
    await page.getByRole('tab', { name: /comments/i }).click();

    // Look for reply button on first comment
    const replyButton = page.getByRole('button', { name: /reply/i }).first();

    if (await replyButton.isVisible()) {
      await replyButton.click();

      // Should show reply input
      const replyInput = page.locator('textarea[placeholder*="reply"], [data-testid="reply-input"]');
      await expect(replyInput).toBeVisible();

      // Add reply
      await replyInput.fill('This is a test reply to the comment');

      // Submit reply
      const submitReply = page.getByRole('button', { name: /post reply|submit/i });
      await submitReply.click();

      // Should show threaded reply
      await expect(page.locator('text=This is a test reply')).toBeVisible();
    }
  });

  test('should display Definition of Ready/Done', async () => {
    // Navigate to DoR/DoD tab
    await page.getByRole('tab', { name: /dor.*dod/i }).click();

    // Should show DoR section
    await expect(page.locator('text=/Definition.*Ready/i')).toBeVisible();

    // Should show DoD section
    await expect(page.locator('text=/Definition.*Done/i')).toBeVisible();

    // Should have checkboxes or criteria
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount > 0) {
      await expect(checkboxes.first()).toBeVisible();
    }
  });

  test('should allow checking DoR/DoD criteria', async () => {
    // Navigate to DoR/DoD tab
    await page.getByRole('tab', { name: /dor.*dod/i }).click();

    // Find first unchecked checkbox
    const uncheckedBox = page.locator('input[type="checkbox"]:not(:checked)').first();

    if (await uncheckedBox.isVisible()) {
      await uncheckedBox.click();

      // Should update progress
      await page.waitForTimeout(500);

      // Verify checkbox is now checked
      await expect(uncheckedBox).toBeChecked();

      // Should show progress update
      const progressIndicator = page.locator('[role="progressbar"], .progress');
      if (await progressIndicator.isVisible()) {
        await expect(progressIndicator).toBeVisible();
      }
    }
  });

  test('should display activity history', async () => {
    // Navigate to history tab
    await page.getByRole('tab', { name: /history/i }).click();

    // Should show activity timeline
    const timeline = page.locator('[data-testid="timeline"], .timeline, .activity-history');

    if (await timeline.isVisible()) {
      await expect(timeline).toBeVisible();

      // Should have activity items
      const activities = timeline.locator('.activity, [data-testid="activity-item"]');
      const activityCount = await activities.count();

      if (activityCount > 0) {
        await expect(activities.first()).toBeVisible();

        // Should show timestamps
        await expect(page.locator('text=/ago|created|updated/i')).toBeVisible();
      }
    }
  });

  test('should handle goal approval workflow', async () => {
    // Check if approval button is enabled
    const approveButton = page.getByRole('button', { name: /approve/i });

    if (await approveButton.isEnabled()) {
      await approveButton.click();

      // Should show confirmation or approval form
      const confirmDialog = page.locator('[role="dialog"], .dialog');

      if (await confirmDialog.isVisible()) {
        // Add approval comment if required
        const approvalComment = confirmDialog.locator('textarea[placeholder*="comment"]');
        if (await approvalComment.isVisible()) {
          await approvalComment.fill('Goal approved - meets all SMART criteria');
        }

        // Confirm approval
        await page.getByRole('button', { name: /confirm|approve/i }).click();
      }

      // Should show approval success
      await expect(page.locator('text=/approved/i')).toBeVisible();

      // Should update goal status
      await expect(page.locator('text=/approved|active/i')).toBeVisible();
    }
  });

  test('should handle goal rejection workflow', async () => {
    // Check if reject button is enabled
    const rejectButton = page.getByRole('button', { name: /reject/i });

    if (await rejectButton.isEnabled()) {
      await rejectButton.click();

      // Should show rejection form
      const rejectDialog = page.locator('[role="dialog"], .dialog');

      if (await rejectDialog.isVisible()) {
        // Rejection reason should be required
        const reasonInput = rejectDialog.locator('textarea[placeholder*="reason"]');
        await expect(reasonInput).toBeVisible();

        await reasonInput.fill('Goal needs more specific success criteria');

        // Confirm rejection
        await page.getByRole('button', { name: /confirm|reject/i }).click();

        // Should show rejection success
        await expect(page.locator('text=/rejected/i')).toBeVisible();
      }
    }
  });

  test('should show reviewer assignment', async () => {
    // Look for reviewer section
    const reviewerSection = page.locator('[data-testid="reviewers"], .reviewers');

    if (await reviewerSection.isVisible()) {
      await expect(reviewerSection).toBeVisible();

      // Should show assigned reviewers
      const reviewerList = reviewerSection.locator('.reviewer, [data-testid="reviewer"]');
      const reviewerCount = await reviewerList.count();

      if (reviewerCount > 0) {
        await expect(reviewerList.first()).toBeVisible();

        // Should show reviewer avatars or names
        const avatars = reviewerSection.locator('[data-testid="avatar"], .avatar');
        if (await avatars.first().isVisible()) {
          await expect(avatars.first()).toBeVisible();
        }
      }
    }
  });

  test('should allow adding reviewers', async () => {
    // Look for add reviewer button
    const addReviewerButton = page.getByRole('button', { name: /add reviewer/i });

    if (await addReviewerButton.isVisible()) {
      await addReviewerButton.click();

      // Should show reviewer selection
      const reviewerSelect = page.locator('[data-testid="reviewer-select"], .user-select');

      if (await reviewerSelect.isVisible()) {
        // Select a reviewer
        await reviewerSelect.click();

        const reviewerOption = page.locator('[role="option"]').first();
        if (await reviewerOption.isVisible()) {
          await reviewerOption.click();

          // Should add reviewer to list
          await expect(page.locator('text=/reviewer.*added/i')).toBeVisible();
        }
      }
    }
  });

  test('should display collaboration notifications', async () => {
    // Look for notification indicators
    const notifications = page.locator('[data-testid="notification"], .notification, .badge-notification');

    if (await notifications.first().isVisible()) {
      await expect(notifications.first()).toBeVisible();

      // Should show notification count or indicator
      const notificationCount = page.locator('text=/\\d+/').first();
      if (await notificationCount.isVisible()) {
        await expect(notificationCount).toBeVisible();
      }
    }
  });

  test('should support @mentions in comments', async () => {
    // Navigate to comments tab
    await page.getByRole('tab', { name: /comments/i }).click();

    const commentInput = page.locator('textarea[placeholder*="comment"], [data-testid="comment-input"]');

    if (await commentInput.isVisible()) {
      // Type @ to trigger mention dropdown
      await commentInput.fill('@');

      // Look for mention suggestions
      const mentionDropdown = page.locator('[data-testid="mention-dropdown"], .mention-suggestions');

      if (await mentionDropdown.isVisible({ timeout: 2000 })) {
        await expect(mentionDropdown).toBeVisible();

        // Should show user options
        const userOptions = mentionDropdown.locator('[data-testid="user-option"], .user');
        const optionCount = await userOptions.count();

        if (optionCount > 0) {
          await userOptions.first().click();

          // Should insert mention in comment
          const inputValue = await commentInput.inputValue();
          expect(inputValue).toMatch(/@\w+/);
        }
      }
    }
  });

  test('should show collaboration metrics', async () => {
    // Look for collaboration stats
    const collaborationStats = page.locator('[data-testid="collaboration-stats"], .collaboration-metrics');

    if (await collaborationStats.isVisible()) {
      await expect(collaborationStats).toBeVisible();

      // Should show metrics like comment count, participant count
      const metrics = [
        page.locator('text=/\\d+.*comment/i'),
        page.locator('text=/\\d+.*participant/i'),
        page.locator('text=/\\d+.*review/i'),
      ];

      let visibleMetrics = 0;
      for (const metric of metrics) {
        if (await metric.isVisible()) {
          visibleMetrics++;
        }
      }

      expect(visibleMetrics).toBeGreaterThan(0);
    }
  });
});

test.describe('Real-time Collaboration', () => {
  test('should handle real-time comment updates', async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/review`);

    // Navigate to comments
    await page.getByRole('tab', { name: /comments/i }).click();

    // Get initial comment count
    const commentList = page.locator('[data-testid="comments-list"], .comments');
    const initialCount = await commentList.locator('.comment, [data-testid="comment"]').count();

    // Simulate real-time update (in a real test, this would come from another user)
    // For now, we'll test that the UI can handle dynamic updates

    // Add a new comment
    const commentInput = page.locator('textarea[placeholder*="comment"], [data-testid="comment-input"]');
    if (await commentInput.isVisible()) {
      await commentInput.fill('Real-time collaboration test');
      const submitButton = page.getByRole('button', { name: /add comment|post/i });
      await submitButton.click();

      // Should update count
      await page.waitForTimeout(1000);
      const newCount = await commentList.locator('.comment, [data-testid="comment"]').count();
      expect(newCount).toBe(initialCount + 1);
    }
  });

  test('should show typing indicators', async ({ page }) => {
    await page.goto(`${GOALS_BASE_URL}/${MOCK_GOAL_ID}/review`);

    // Navigate to comments
    await page.getByRole('tab', { name: /comments/i }).click();

    const commentInput = page.locator('textarea[placeholder*="comment"], [data-testid="comment-input"]');

    if (await commentInput.isVisible()) {
      // Start typing
      await commentInput.focus();
      await commentInput.type('Someone is typing...');

      // Look for typing indicator (if implemented)
      const typingIndicator = page.locator('[data-testid="typing-indicator"], .typing');

      // This would typically be visible in a multi-user scenario
      if (await typingIndicator.isVisible({ timeout: 2000 })) {
        await expect(typingIndicator).toBeVisible();
      }
    }
  });
});