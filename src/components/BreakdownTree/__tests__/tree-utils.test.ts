/**
 * Tree Utilities Test Suite
 *
 * Comprehensive tests for tree data structure utilities including
 * traversal, search, filtering, and validation functions.
 *
 * @fileoverview Unit tests for tree-utils
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

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

import { type FlatTree, TreeNodeType } from '../BreakdownTree.types';
import {
  buildTree,
  flattenTree,
  findNode,
  findNodes,
  getNodePath,
  getAncestors,
  getDescendants,
  getChildren,
  getParent,
  getSiblings,
  getNodePosition,
  getNextNode,
  getPreviousNode,
  isAncestor,
  canMoveNode,
  isValidParentChildRelation,
  calculateTreeStatistics,
  searchNodes,
  filterNodes,
} from '../utils/tree-utils';

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
  successCriteria: ['Criterion 1'],
  category: GoalCategory.PROFESSIONAL,
  tags: ['test'],
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
  description: 'A test task',
  status: TaskStatus.TODO,
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
  order: 0,
  isCritical: true,
  isDeleted: false,
  comments: [],
};

const mockData = [mockGoal, mockTask, mockMilestone];

// =============================================================================
// Test Suite
// =============================================================================

describe('Tree Utils', () => {
  let tree: FlatTree;

  beforeEach(() => {
    tree = buildTree(mockData);
  });

  // ===========================================================================
  // Tree Construction Tests
  // ===========================================================================

  describe('buildTree', () => {
    it('should create a valid tree structure', () => {
      expect(tree.nodes.size).toBe(3);
      expect(tree.rootIds).toHaveLength(1);
      expect(tree.count).toBe(3);
    });

    it('should establish correct parent-child relationships', () => {
      const goalNode = tree.nodes.get('goal-1');
      const taskNode = tree.nodes.get('task-1');
      const milestoneNode = tree.nodes.get('milestone-1');

      expect(goalNode?.parentId).toBeNull();
      expect(taskNode?.parentId).toBe('goal-1');
      expect(milestoneNode?.parentId).toBe('goal-1');

      expect(goalNode?.children).toContain('task-1');
      expect(goalNode?.children).toContain('milestone-1');
    });

    it('should set correct depth levels', () => {
      const goalNode = tree.nodes.get('goal-1');
      const taskNode = tree.nodes.get('task-1');

      expect(goalNode?.depth).toBe(0);
      expect(taskNode?.depth).toBe(1);
    });

    it('should handle empty data', () => {
      const emptyTree = buildTree([]);
      expect(emptyTree.nodes.size).toBe(0);
      expect(emptyTree.rootIds).toHaveLength(0);
      expect(emptyTree.count).toBe(0);
    });
  });

  // ===========================================================================
  // Tree Traversal Tests
  // ===========================================================================

  describe('flattenTree', () => {
    it('should flatten tree in correct order', () => {
      const flattened = flattenTree(tree);

      expect(flattened).toHaveLength(3);
      expect(flattened[0].id).toBe('goal-1');
      expect(flattened[0].depth).toBe(0);
    });

    it('should respect expansion state when specified', () => {
      // Collapse the goal node
      const goalNode = tree.nodes.get('goal-1')!;
      const collapsedGoal = { ...goalNode, isExpanded: false };
      tree.nodes.set('goal-1', collapsedGoal);

      const flattenedExpanded = flattenTree(tree, true);
      expect(flattenedExpanded).toHaveLength(1); // Only the goal, children hidden
    });
  });

  describe('findNode', () => {
    it('should find existing nodes', () => {
      const node = findNode(tree, 'task-1');
      expect(node).toBeDefined();
      expect(node?.id).toBe('task-1');
    });

    it('should return null for non-existent nodes', () => {
      const node = findNode(tree, 'non-existent');
      expect(node).toBeNull();
    });
  });

  describe('findNodes', () => {
    it('should find nodes matching predicate', () => {
      const highPriorityNodes = findNodes(
        tree,
        node => node.priority === 'high'
      );
      expect(highPriorityNodes).toHaveLength(2); // goal-1 and milestone-1
    });

    it('should return empty array when no matches', () => {
      const criticalNodes = findNodes(
        tree,
        node => node.priority === 'critical'
      );
      expect(criticalNodes).toHaveLength(0);
    });
  });

  // ===========================================================================
  // Path and Navigation Tests
  // ===========================================================================

  describe('getNodePath', () => {
    it('should return correct path for root node', () => {
      const path = getNodePath(tree, 'goal-1');
      expect(path?.path).toEqual(['goal-1']);
      expect(path?.depth).toBe(0);
      expect(path?.parentId).toBeNull();
    });

    it('should return correct path for child node', () => {
      const path = getNodePath(tree, 'task-1');
      expect(path?.path).toEqual(['goal-1', 'task-1']);
      expect(path?.depth).toBe(1);
      expect(path?.parentId).toBe('goal-1');
    });

    it('should return null for non-existent node', () => {
      const path = getNodePath(tree, 'non-existent');
      expect(path).toBeNull();
    });
  });

  describe('getAncestors', () => {
    it('should return ancestors in correct order', () => {
      const ancestors = getAncestors(tree, 'task-1');
      expect(ancestors).toHaveLength(1);
      expect(ancestors[0].id).toBe('goal-1');
    });

    it('should return empty array for root nodes', () => {
      const ancestors = getAncestors(tree, 'goal-1');
      expect(ancestors).toHaveLength(0);
    });
  });

  describe('getDescendants', () => {
    it('should return all descendants', () => {
      const descendants = getDescendants(tree, 'goal-1');
      expect(descendants).toHaveLength(2);
      expect(descendants.map(d => d.id)).toContain('task-1');
      expect(descendants.map(d => d.id)).toContain('milestone-1');
    });

    it('should return empty array for leaf nodes', () => {
      const descendants = getDescendants(tree, 'task-1');
      expect(descendants).toHaveLength(0);
    });
  });

  describe('getChildren', () => {
    it('should return direct children only', () => {
      const children = getChildren(tree, 'goal-1');
      expect(children).toHaveLength(2);
      expect(children.map(c => c.id)).toContain('task-1');
      expect(children.map(c => c.id)).toContain('milestone-1');
    });
  });

  describe('getParent', () => {
    it('should return parent node', () => {
      const parent = getParent(tree, 'task-1');
      expect(parent?.id).toBe('goal-1');
    });

    it('should return null for root nodes', () => {
      const parent = getParent(tree, 'goal-1');
      expect(parent).toBeNull();
    });
  });

  describe('getSiblings', () => {
    it('should return sibling nodes', () => {
      const siblings = getSiblings(tree, 'task-1');
      expect(siblings).toHaveLength(1);
      expect(siblings[0].id).toBe('milestone-1');
    });

    it('should exclude the node itself', () => {
      const siblings = getSiblings(tree, 'task-1');
      expect(siblings.map(s => s.id)).not.toContain('task-1');
    });
  });

  // ===========================================================================
  // Position and Navigation Tests
  // ===========================================================================

  describe('getNodePosition', () => {
    it('should return correct position information', () => {
      const position = getNodePosition(tree, 'task-1');
      expect(position?.nodeId).toBe('task-1');
      expect(position?.parentId).toBe('goal-1');
      expect(position?.path).toEqual(['goal-1', 'task-1']);
    });
  });

  describe('getNextNode and getPreviousNode', () => {
    it('should navigate to next node', () => {
      const nextNode = getNextNode(tree, 'goal-1');
      expect(nextNode).toBeDefined();
      expect(['task-1', 'milestone-1']).toContain(nextNode?.id);
    });

    it('should navigate to previous node', () => {
      const children = getChildren(tree, 'goal-1');
      if (children.length > 1) {
        const previousNode = getPreviousNode(tree, children[1].id);
        expect(previousNode?.id).toBe(children[0].id);
      }
    });
  });

  // ===========================================================================
  // Validation Tests
  // ===========================================================================

  describe('isAncestor', () => {
    it('should correctly identify ancestor relationships', () => {
      expect(isAncestor(tree, 'goal-1', 'task-1')).toBe(true);
      expect(isAncestor(tree, 'task-1', 'goal-1')).toBe(false);
      expect(isAncestor(tree, 'goal-1', 'goal-1')).toBe(false); // Self
    });
  });

  describe('canMoveNode', () => {
    it('should allow valid moves', () => {
      expect(canMoveNode(tree, 'task-1', null)).toBe(true); // Move to root
      expect(canMoveNode(tree, 'milestone-1', 'goal-1')).toBe(true); // Keep in same parent
    });

    it('should prevent circular dependencies', () => {
      expect(canMoveNode(tree, 'goal-1', 'task-1')).toBe(false); // Parent to child
    });

    it('should prevent self-parenting', () => {
      expect(canMoveNode(tree, 'task-1', 'task-1')).toBe(false);
    });
  });

  describe('isValidParentChildRelation', () => {
    it('should validate correct relationships', () => {
      expect(
        isValidParentChildRelation(TreeNodeType.GOAL, TreeNodeType.TASK)
      ).toBe(true);
      expect(
        isValidParentChildRelation(TreeNodeType.GOAL, TreeNodeType.MILESTONE)
      ).toBe(true);
      expect(
        isValidParentChildRelation(TreeNodeType.TASK, TreeNodeType.SUBTASK)
      ).toBe(true);
    });

    it('should reject invalid relationships', () => {
      expect(
        isValidParentChildRelation(TreeNodeType.OUTCOME, TreeNodeType.TASK)
      ).toBe(false);
      expect(
        isValidParentChildRelation(TreeNodeType.SUBTASK, TreeNodeType.GOAL)
      ).toBe(false);
    });
  });

  // ===========================================================================
  // Statistics Tests
  // ===========================================================================

  describe('calculateTreeStatistics', () => {
    it('should calculate correct statistics', () => {
      const stats = calculateTreeStatistics(tree);

      expect(stats.totalNodes).toBe(3);
      expect(stats.nodesByType[TreeNodeType.GOAL]).toBe(1);
      expect(stats.nodesByType[TreeNodeType.TASK]).toBe(1);
      expect(stats.nodesByType[TreeNodeType.MILESTONE]).toBe(1);
      expect(stats.maxDepth).toBe(1);
      expect(stats.overallProgress).toBeGreaterThan(0);
    });

    it('should handle empty tree', () => {
      const emptyTree = buildTree([]);
      const stats = calculateTreeStatistics(emptyTree);

      expect(stats.totalNodes).toBe(0);
      expect(stats.averageDepth).toBe(0);
      expect(stats.overallProgress).toBe(0);
    });
  });

  // ===========================================================================
  // Search and Filter Tests
  // ===========================================================================

  describe('searchNodes', () => {
    it('should find nodes by title', () => {
      const results = searchNodes(tree, 'Test');
      expect(results).toHaveLength(3); // All nodes have 'Test' in title
    });

    it('should find nodes by description', () => {
      const results = searchNodes(tree, 'test goal', {
        searchTitles: false,
        searchDescriptions: true,
      });
      expect(results).toContain('goal-1');
    });

    it('should respect case sensitivity', () => {
      const caseSensitive = searchNodes(tree, 'test', { caseSensitive: true });
      const caseInsensitive = searchNodes(tree, 'test', {
        caseSensitive: false,
      });

      expect(caseSensitive.length).toBeLessThanOrEqual(caseInsensitive.length);
    });

    it('should support regex search', () => {
      const results = searchNodes(tree, '^Test', { useRegex: true });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const results = searchNodes(tree, 'nonexistent');
      expect(results).toHaveLength(0);
    });
  });

  describe('filterNodes', () => {
    it('should filter by node types', () => {
      const results = filterNodes(tree, {
        nodeTypes: [TreeNodeType.GOAL],
      });
      expect(results).toHaveLength(1);
      expect(results).toContain('goal-1');
    });

    it('should filter by status', () => {
      const results = filterNodes(tree, {
        statuses: ['active'],
      });
      expect(results).toContain('goal-1');
    });

    it('should filter by priority', () => {
      const results = filterNodes(tree, {
        priorities: ['high'],
      });
      expect(results).toContain('goal-1');
      expect(results).toContain('milestone-1');
    });

    it('should filter by progress range', () => {
      const results = filterNodes(tree, {
        progressRange: { min: 70, max: 100 },
      });
      expect(results).toContain('milestone-1'); // 75% progress
    });

    it('should combine multiple filters', () => {
      const results = filterNodes(tree, {
        nodeTypes: [TreeNodeType.GOAL],
        priorities: ['high'],
      });
      expect(results).toHaveLength(1);
      expect(results).toContain('goal-1');
    });

    it('should return empty array when no matches', () => {
      const results = filterNodes(tree, {
        priorities: ['nonexistent'],
      });
      expect(results).toHaveLength(0);
    });
  });
});
