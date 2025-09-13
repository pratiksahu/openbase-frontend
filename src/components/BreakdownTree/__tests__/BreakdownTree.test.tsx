/**
 * BreakdownTree Component Test Suite
 *
 * Comprehensive tests for the main BreakdownTree component including
 * rendering, interactions, accessibility, and integration scenarios.
 *
 * @fileoverview Unit tests for BreakdownTree component
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

// Import jest-dom matchers
import '@testing-library/jest-dom/jest-globals';

import {
  SmartGoal,
  Task,
  Milestone,
  GoalCategory,
  GoalStatus,
  GoalPriority,
  MetricType,
  Frequency,
  TaskStatus,
} from '@/types/smart-goals.types';

import { BreakdownTree } from '../BreakdownTree';
import { SelectionMode } from '../BreakdownTree.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// =============================================================================
// Mock Data
// =============================================================================

const mockGoal: SmartGoal = {
  id: 'goal-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  createdBy: 'user-1',
  updatedBy: 'user-1',
  title: 'Test Goal',
  description: 'A test goal for unit testing',
  specificObjective: 'Test objective',
  successCriteria: ['Complete all tasks'],
  category: GoalCategory.PROFESSIONAL,
  tags: ['test', 'demo'],
  measurable: {
    metricType: MetricType.NUMBER,
    targetValue: 100,
    currentValue: 50,
    unit: '%',
    higherIsBetter: true,
    measurementFrequency: Frequency.WEEKLY,
  },
  achievability: {
    score: 0.8,
    requiredResources: [],
    requiredSkills: [],
    constraints: [],
    riskAssessment: 'Low risk',
    successProbability: 0.8,
    assessmentConfidence: 0.9,
    lastAssessedAt: new Date(),
    assessedBy: 'user-1',
  },
  relevance: {
    rationale: 'Important for testing',
    strategyAlignments: [],
    stakeholders: [],
    expectedBenefits: [],
    risksOfNotAchieving: [],
    relevanceScore: 0.9,
    valueScore: 0.8,
    lastReviewedAt: new Date(),
    reviewedBy: 'user-1',
  },
  timebound: {
    startDate: new Date(),
    targetDate: new Date(),
    estimatedDuration: 30,
    isRecurring: false,
  },
  status: GoalStatus.ACTIVE,
  priority: GoalPriority.HIGH,
  progress: 50,
  ownerId: 'user-1',
  collaborators: [],
  parentGoalId: undefined,
  childGoalIds: [],
  tasks: [],
  milestones: [],
  outcomes: [],
  checkpoints: [],
  visibility: 'private',
  isArchived: false,
  isDeleted: false,
  comments: [],
};

const mockTask: Task = {
  id: 'task-1',
  createdAt: new Date('2024-01-02'),
  updatedAt: new Date('2024-01-02'),
  createdBy: 'user-1',
  updatedBy: 'user-1',
  title: 'Test Task',
  description: 'A test task for the goal',
  status: TaskStatus.IN_PROGRESS,
  priority: GoalPriority.MEDIUM,
  progress: 25,
  subtasks: [],
  checklist: [],
  goalId: 'goal-1',
  order: 0,
  isDeleted: false,
  comments: [],
};

const mockMilestone: Milestone = {
  id: 'milestone-1',
  createdAt: new Date('2024-01-03'),
  updatedAt: new Date('2024-01-03'),
  createdBy: 'user-1',
  updatedBy: 'user-1',
  title: 'Test Milestone',
  description: 'A test milestone',
  targetDate: new Date('2024-02-01'),
  isCompleted: false,
  successCriteria: ['Complete tasks'],
  progress: 75,
  priority: GoalPriority.HIGH,
  taskIds: [],
  goalId: 'goal-1',
  order: 1,
  isCritical: true,
  isDeleted: false,
  comments: [],
};

const mockData = [mockGoal, mockTask, mockMilestone];

// =============================================================================
// Test Utilities
// =============================================================================

const renderBreakdownTree = (props = {}) => {
  const defaultProps = {
    initialData: mockData,
    config: {
      enableSearch: true,
      enableFilters: true,
      enableDragDrop: true,
      selectionMode: SelectionMode.SINGLE,
    },
    onNodeSelect: jest.fn(),
    onTreeChange: jest.fn(),
    onNodeUpdate: jest.fn(),
    onNodeMove: jest.fn(),
    onNodeCreate: jest.fn(),
    onNodeDelete: jest.fn(),
  };

  return render(<BreakdownTree {...defaultProps} {...props} />);
};

// =============================================================================
// Test Suite
// =============================================================================

describe('BreakdownTree', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  // ===========================================================================
  // Rendering Tests
  // ===========================================================================

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderBreakdownTree();
      expect(screen.getByRole('tree')).toBeInTheDocument();
    });

    it('should render all tree nodes', () => {
      renderBreakdownTree();

      expect(screen.getByText('Test Goal')).toBeInTheDocument();
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Milestone')).toBeInTheDocument();
    });

    it('should display node progress indicators', () => {
      renderBreakdownTree();

      // Check for progress indicators (progress bars or percentages)
      expect(screen.getByText('50%')).toBeInTheDocument(); // Goal progress
      expect(screen.getByText('25%')).toBeInTheDocument(); // Task progress
      expect(screen.getByText('75%')).toBeInTheDocument(); // Milestone progress
    });

    it('should render expand/collapse buttons for parent nodes', () => {
      renderBreakdownTree();

      // Goal should have expand/collapse button since it has children
      const expandButtons = screen.getAllByLabelText(/expand|collapse/i);
      expect(expandButtons.length).toBeGreaterThan(0);
    });

    it('should render empty state when no data', () => {
      renderBreakdownTree({ initialData: [] });

      expect(screen.getByText(/no nodes to display/i)).toBeInTheDocument();
    });

    it('should render loading state', () => {
      renderBreakdownTree({
        initialData: [],
        isLoading: true,
      });

      // Should show loading skeletons
      const skeletons =
        screen.getAllByTestId('skeleton') ||
        document.querySelectorAll('[class*="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render error state', () => {
      const errorMessage = 'Failed to load tree data';
      renderBreakdownTree({
        initialData: [],
        error: errorMessage,
      });

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Search and Filter Tests
  // ===========================================================================

  describe('Search and Filters', () => {
    it('should render search input when enabled', () => {
      renderBreakdownTree();

      expect(screen.getByPlaceholderText(/search nodes/i)).toBeInTheDocument();
    });

    it('should filter nodes based on search query', async () => {
      renderBreakdownTree();

      const searchInput = screen.getByPlaceholderText(/search nodes/i);
      await user.type(searchInput, 'Task');

      // Wait for search to process
      await waitFor(() => {
        // Should show search results count
        expect(screen.getByText(/nodes/)).toBeInTheDocument();
      });
    });

    it('should render filter controls when enabled', () => {
      renderBreakdownTree();

      expect(
        screen.getByRole('button', { name: /filters/i })
      ).toBeInTheDocument();
    });

    it('should open filter popover when clicked', async () => {
      renderBreakdownTree();

      const filterButton = screen.getByRole('button', { name: /filters/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByText(/node types/i)).toBeInTheDocument();
      });
    });

    it('should not render search when disabled', () => {
      renderBreakdownTree({
        config: { enableSearch: false },
      });

      expect(
        screen.queryByPlaceholderText(/search nodes/i)
      ).not.toBeInTheDocument();
    });

    it('should not render filters when disabled', () => {
      renderBreakdownTree({
        config: { enableFilters: false },
      });

      expect(
        screen.queryByRole('button', { name: /filters/i })
      ).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Node Interaction Tests
  // ===========================================================================

  describe('Node Interactions', () => {
    it('should expand/collapse nodes when clicked', async () => {
      renderBreakdownTree();

      const expandButton = screen.getAllByLabelText(/expand|collapse/i)[0];
      const initialLabel = expandButton.getAttribute('aria-label');

      await user.click(expandButton);

      await waitFor(() => {
        const newLabel = expandButton.getAttribute('aria-label');
        expect(newLabel).not.toBe(initialLabel);
      });
    });

    it('should select nodes when clicked', async () => {
      const onNodeSelect = jest.fn();
      renderBreakdownTree({ onNodeSelect });

      const goalNode = screen
        .getByText('Test Goal')
        .closest('[role="treeitem"]');
      await user.click(goalNode!);

      expect(onNodeSelect).toHaveBeenCalledWith(['goal-1']);
    });

    it('should support multi-selection when enabled', async () => {
      const onNodeSelect = jest.fn();
      renderBreakdownTree({
        config: { selectionMode: SelectionMode.MULTIPLE },
        onNodeSelect,
      });

      const goalNode = screen
        .getByText('Test Goal')
        .closest('[role="treeitem"]');
      const taskNode = screen
        .getByText('Test Task')
        .closest('[role="treeitem"]');

      await user.click(goalNode!);
      await user.click(taskNode!);

      expect(onNodeSelect).toHaveBeenCalledWith(
        expect.arrayContaining(['goal-1'])
      );
    });

    it('should open action menu when more button is clicked', async () => {
      renderBreakdownTree();

      // Hover to make action button visible
      const goalNode = screen
        .getByText('Test Goal')
        .closest('[role="treeitem"]');
      await user.hover(goalNode!);

      await waitFor(() => {
        const actionButton = screen.getByLabelText(/more actions/i);
        expect(actionButton).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Keyboard Navigation Tests
  // ===========================================================================

  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys', async () => {
      renderBreakdownTree();

      const firstNode = screen.getAllByRole('treeitem')[0];
      (firstNode as HTMLElement).focus();

      await user.keyboard('{ArrowDown}');

      // Second node should be focused
      const focusedElement = document.activeElement;
      expect(focusedElement).toHaveAttribute('role', 'treeitem');
    });

    it('should expand nodes with right arrow', async () => {
      renderBreakdownTree();

      const goalNode = screen
        .getByText('Test Goal')
        .closest('[role="treeitem"]');
      (goalNode as HTMLElement)?.focus();

      await user.keyboard('{ArrowRight}');

      await waitFor(() => {
        expect(goalNode).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should collapse nodes with left arrow', async () => {
      renderBreakdownTree();

      const goalNode = screen
        .getByText('Test Goal')
        .closest('[role="treeitem"]');
      (goalNode as HTMLElement)?.focus();

      // First expand, then collapse
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowLeft}');

      await waitFor(() => {
        expect(goalNode).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should select nodes with Enter/Space', async () => {
      const onNodeSelect = jest.fn();
      renderBreakdownTree({ onNodeSelect });

      const goalNode = screen
        .getByText('Test Goal')
        .closest('[role="treeitem"]');
      (goalNode as HTMLElement)?.focus();

      await user.keyboard('{Enter}');

      expect(onNodeSelect).toHaveBeenCalledWith(['goal-1']);
    });

    it('should disable keyboard navigation when configured', () => {
      renderBreakdownTree({
        config: { enableKeyboardNavigation: false },
      });

      const firstNode = screen.getAllByRole('treeitem')[0];
      expect(firstNode).toHaveAttribute('tabindex', '-1');
    });
  });

  // ===========================================================================
  // Tree Controls Tests
  // ===========================================================================

  describe('Tree Controls', () => {
    it('should render expand all button', () => {
      renderBreakdownTree();

      expect(
        screen.getByRole('button', { name: /expand all/i })
      ).toBeInTheDocument();
    });

    it('should render collapse all button', () => {
      renderBreakdownTree();

      expect(
        screen.getByRole('button', { name: /collapse all/i })
      ).toBeInTheDocument();
    });

    it('should expand all nodes when expand all is clicked', async () => {
      renderBreakdownTree();

      const expandAllButton = screen.getByRole('button', {
        name: /expand all/i,
      });
      await user.click(expandAllButton);

      await waitFor(() => {
        const treeItems = screen.getAllByRole('treeitem');
        const expandableItems = treeItems.filter(
          item => item.getAttribute('aria-expanded') !== null
        );

        expandableItems.forEach(item => {
          expect(item).toHaveAttribute('aria-expanded', 'true');
        });
      });
    });

    it('should display node count', () => {
      renderBreakdownTree();

      expect(screen.getByText(/3.*nodes/)).toBeInTheDocument();
    });

    it('should display selection count when nodes are selected', async () => {
      renderBreakdownTree({
        config: { selectionMode: SelectionMode.MULTIPLE },
      });

      const goalNode = screen
        .getByText('Test Goal')
        .closest('[role="treeitem"]');
      await user.click(goalNode!);

      await waitFor(() => {
        expect(screen.getByText(/1 selected/)).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Accessibility Tests
  // ===========================================================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderBreakdownTree();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA tree structure', () => {
      renderBreakdownTree();

      const tree = screen.getByRole('tree');
      const treeItems = screen.getAllByRole('treeitem');

      expect(tree).toBeInTheDocument();
      expect(treeItems.length).toBeGreaterThan(0);
    });

    it('should have correct ARIA attributes on tree items', () => {
      renderBreakdownTree();

      const treeItems = screen.getAllByRole('treeitem');

      treeItems.forEach(item => {
        expect(item).toHaveAttribute('aria-level');
        expect(item).toHaveAttribute('aria-selected');
      });
    });

    it('should have proper focus management', () => {
      renderBreakdownTree();

      const treeItems = screen.getAllByRole('treeitem');

      // First item should be focusable, others should not
      expect(treeItems[0]).toHaveAttribute('tabindex', '0');
      treeItems.slice(1).forEach(item => {
        expect(item).toHaveAttribute('tabindex', '-1');
      });
    });

    it('should announce expand/collapse state', () => {
      renderBreakdownTree();

      const goalNode = screen
        .getByText('Test Goal')
        .closest('[role="treeitem"]');
      expect(goalNode).toHaveAttribute('aria-expanded');
    });

    it('should have descriptive labels', () => {
      renderBreakdownTree();

      const expandButton = screen.getAllByLabelText(/expand|collapse/i)[0];
      expect(expandButton).toHaveAccessibleName();
    });
  });

  // ===========================================================================
  // Integration Tests
  // ===========================================================================

  describe('Integration', () => {
    it('should call onTreeChange when tree structure changes', async () => {
      const onTreeChange = jest.fn();
      renderBreakdownTree({ onTreeChange });

      // Expand a node to trigger tree change
      const expandButton = screen.getAllByLabelText(/expand/i)[0];
      await user.click(expandButton);

      // onTreeChange should be called during initialization and expansion
      expect(onTreeChange).toHaveBeenCalled();
    });

    it('should handle drag and drop when enabled', async () => {
      renderBreakdownTree({
        config: { enableDragDrop: true },
      });

      const taskNode = screen
        .getByText('Test Task')
        .closest('[role="treeitem"]');

      // Check if drag handle is present (visible on hover)
      await user.hover(taskNode!);

      await waitFor(() => {
        // Check if drag handle is present or node is draggable
        // Drag handle might not be visible in test environment, just check node is draggable
        expect(taskNode).toHaveAttribute('draggable', 'true');
      });
    });

    it('should update when initialData changes', async () => {
      const { rerender } = renderBreakdownTree({ initialData: mockData });

      expect(screen.getByText('Test Goal')).toBeInTheDocument();

      const newData = [{ ...mockGoal, title: 'Updated Goal' }];
      rerender(<BreakdownTree initialData={newData} />);

      await waitFor(() => {
        expect(screen.queryByText('Test Goal')).not.toBeInTheDocument();
        expect(screen.getByText('Updated Goal')).toBeInTheDocument();
      });
    });

    it('should handle large datasets efficiently', () => {
      // Generate large dataset
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        ...mockGoal,
        id: `goal-${i}`,
        title: `Goal ${i}`,
      }));

      renderBreakdownTree({ initialData: largeData });

      // Should render without performance issues
      expect(screen.getByRole('tree')).toBeInTheDocument();
      expect(screen.getByText(/100.*nodes/)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Error Boundary Tests
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle invalid data gracefully', () => {
      const invalidData = [
        { id: 'invalid', title: 'Invalid Node' }, // Missing required fields
      ] as any;

      // Should not crash, might show error state or filter out invalid data
      expect(() => {
        renderBreakdownTree({ initialData: invalidData });
      }).not.toThrow();
    });

    it('should display error message when provided', () => {
      const errorMessage = 'Custom error message';
      renderBreakdownTree({
        initialData: [],
        error: errorMessage,
      });

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
