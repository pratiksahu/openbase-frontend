/**
 * Tree Operations Test Suite
 *
 * Comprehensive tests for tree manipulation operations including
 * adding, removing, moving, and updating nodes.
 *
 * @fileoverview Unit tests for tree-operations
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

import {
  SmartGoal,
  Task,
  GoalCategory,
  GoalStatus,
  GoalPriority,
  MetricType,
  Frequency,
  TaskStatus,
} from '@/types/smart-goals.types';

import {
  type FlatTree,
  type TreeNodeCreate,
  type TreeNodeUpdate,
  type TreeNodeMove,
  TreeNodeType,
} from '../BreakdownTree.types';
import {
  addNode,
  removeNode,
  moveNode,
  updateNode,
  duplicateNode,
} from '../utils/tree-operations';
import { buildTree } from '../utils/tree-utils';

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
  description: 'A test goal',
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

const mockData = [mockGoal, mockTask];

// =============================================================================
// Test Suite
// =============================================================================

describe('Tree Operations', () => {
  let tree: FlatTree;

  beforeEach(() => {
    tree = buildTree(mockData);
  });

  // ===========================================================================
  // Add Node Tests
  // ===========================================================================

  describe('addNode', () => {
    it('should add a new root node', () => {
      const nodeCreate: TreeNodeCreate = {
        type: TreeNodeType.GOAL,
        title: 'New Root Goal',
        description: 'A new root goal',
        parentId: null,
        index: 0,
      };

      const result = addNode(tree, nodeCreate);

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
      expect(result.tree!.count).toBe(tree.count + 1);
      expect(result.tree!.rootIds).toHaveLength(tree.rootIds.length + 1);
    });

    it('should add a child node to existing parent', () => {
      const nodeCreate: TreeNodeCreate = {
        type: TreeNodeType.TASK,
        title: 'New Task',
        parentId: 'goal-1',
        index: 1,
      };

      const result = addNode(tree, nodeCreate);

      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();

      const parent = result.tree!.nodes.get('goal-1');
      expect(parent?.children).toHaveLength(2); // Original task + new task
    });

    it('should fail when parent does not exist', () => {
      const nodeCreate: TreeNodeCreate = {
        type: TreeNodeType.TASK,
        title: 'New Task',
        parentId: 'non-existent',
        index: 0,
      };

      const result = addNode(tree, nodeCreate);

      expect(result.success).toBe(false);
      expect(result.error).toContain(
        'Parent node with ID non-existent not found'
      );
    });

    it('should fail when parent cannot have children', () => {
      // First add an outcome node (which cannot have children)
      const outcomeCreate: TreeNodeCreate = {
        type: TreeNodeType.OUTCOME,
        title: 'Test Outcome',
        parentId: 'goal-1',
        index: 1,
      };

      const outcomeResult = addNode(tree, outcomeCreate);
      expect(outcomeResult.success).toBe(true);

      const outcomeNode = Array.from(outcomeResult.tree!.nodes.values()).find(
        n => n.type === TreeNodeType.OUTCOME
      );

      // Now try to add a child to the outcome (should fail)
      const childCreate: TreeNodeCreate = {
        type: TreeNodeType.TASK,
        title: 'Child Task',
        parentId: outcomeNode!.id,
        index: 0,
      };

      const childResult = addNode(outcomeResult.tree!, childCreate);

      expect(childResult.success).toBe(false);
      expect(childResult.error).toContain('cannot have children');
    });

    it('should fail for invalid parent-child relationship', () => {
      const nodeCreate: TreeNodeCreate = {
        type: TreeNodeType.GOAL,
        title: 'Child Goal',
        parentId: 'task-1', // Tasks cannot have goal children
        index: 0,
      };

      const result = addNode(tree, nodeCreate);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid parent-child relationship');
    });

    it('should insert node at correct index', () => {
      // Add first child
      const firstChild: TreeNodeCreate = {
        type: TreeNodeType.TASK,
        title: 'First Task',
        parentId: 'goal-1',
        index: 1, // Insert after existing task
      };

      const firstResult = addNode(tree, firstChild);
      expect(firstResult.success).toBe(true);

      // Add second child at index 0 (beginning)
      const secondChild: TreeNodeCreate = {
        type: TreeNodeType.TASK,
        title: 'Second Task',
        parentId: 'goal-1',
        index: 0,
      };

      const secondResult = addNode(firstResult.tree!, secondChild);
      expect(secondResult.success).toBe(true);

      const parent = secondResult.tree!.nodes.get('goal-1');
      const firstChildNode = Array.from(secondResult.tree!.nodes.values()).find(
        n => n.title === 'Second Task'
      );

      expect(parent?.children[0]).toBe(firstChildNode?.id);
    });
  });

  // ===========================================================================
  // Remove Node Tests
  // ===========================================================================

  describe('removeNode', () => {
    it('should remove a node and its descendants', () => {
      // First add a child to create descendants
      const childCreate: TreeNodeCreate = {
        type: TreeNodeType.TASK,
        title: 'Child Task',
        parentId: 'task-1',
        index: 0,
      };

      const addResult = addNode(tree, childCreate);
      expect(addResult.success).toBe(true);

      const childNode = Array.from(addResult.tree!.nodes.values()).find(
        n => n.title === 'Child Task'
      );

      // Now remove the parent task (should remove child too)
      const removeResult = removeNode(addResult.tree!, 'task-1');

      expect(removeResult.success).toBe(true);
      expect(removeResult.tree!.nodes.has('task-1')).toBe(false);
      expect(removeResult.tree!.nodes.has(childNode!.id)).toBe(false);
      expect(removeResult.tree!.count).toBe(1); // Only goal remains
    });

    it('should update parent children array', () => {
      const result = removeNode(tree, 'task-1');

      expect(result.success).toBe(true);
      const parent = result.tree!.nodes.get('goal-1');
      expect(parent?.children).not.toContain('task-1');
    });

    it('should remove from root level', () => {
      const result = removeNode(tree, 'goal-1');

      expect(result.success).toBe(true);
      expect(result.tree!.rootIds).not.toContain('goal-1');
      expect(result.tree!.count).toBe(0); // All nodes removed (goal had task as child)
    });

    it('should fail when node does not exist', () => {
      const result = removeNode(tree, 'non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Node with ID non-existent not found');
    });
  });

  // ===========================================================================
  // Move Node Tests
  // ===========================================================================

  describe('moveNode', () => {
    it('should move node to new parent', () => {
      // First create another goal to move the task to
      const newGoalCreate: TreeNodeCreate = {
        type: TreeNodeType.GOAL,
        title: 'New Goal',
        parentId: null,
        index: 1,
      };

      const addResult = addNode(tree, newGoalCreate);
      expect(addResult.success).toBe(true);

      const newGoalNode = Array.from(addResult.tree!.nodes.values()).find(
        n => n.title === 'New Goal'
      );

      // Move task from goal-1 to new goal
      const moveOperation: TreeNodeMove = {
        nodeId: 'task-1',
        newParentId: newGoalNode!.id,
        newIndex: 0,
      };

      const moveResult = moveNode(addResult.tree!, moveOperation);

      expect(moveResult.success).toBe(true);

      const movedTask = moveResult.tree!.nodes.get('task-1');
      const oldParent = moveResult.tree!.nodes.get('goal-1');
      const newParent = moveResult.tree!.nodes.get(newGoalNode!.id);

      expect(movedTask?.parentId).toBe(newGoalNode!.id);
      expect(oldParent?.children).not.toContain('task-1');
      expect(newParent?.children).toContain('task-1');
    });

    it('should move node to root level', () => {
      const moveOperation: TreeNodeMove = {
        nodeId: 'task-1',
        newParentId: null,
        newIndex: 1,
      };

      const result = moveNode(tree, moveOperation);

      expect(result.success).toBe(true);

      const movedTask = result.tree!.nodes.get('task-1');
      expect(movedTask?.parentId).toBeNull();
      expect(result.tree!.rootIds).toContain('task-1');
    });

    it('should update node depth after move', () => {
      const moveOperation: TreeNodeMove = {
        nodeId: 'task-1',
        newParentId: null, // Move to root
        newIndex: 0,
      };

      const result = moveNode(tree, moveOperation);

      expect(result.success).toBe(true);
      const movedTask = result.tree!.nodes.get('task-1');
      expect(movedTask?.depth).toBe(0);
    });

    it('should fail when creating circular dependency', () => {
      const moveOperation: TreeNodeMove = {
        nodeId: 'goal-1',
        newParentId: 'task-1', // Goal cannot be child of its own task
        newIndex: 0,
      };

      const result = moveNode(tree, moveOperation);

      expect(result.success).toBe(false);
      expect(result.error).toContain('circular dependency');
    });

    it('should fail when node does not exist', () => {
      const moveOperation: TreeNodeMove = {
        nodeId: 'non-existent',
        newParentId: 'goal-1',
        newIndex: 0,
      };

      const result = moveNode(tree, moveOperation);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Node with ID non-existent not found');
    });

    it('should fail when new parent does not exist', () => {
      const moveOperation: TreeNodeMove = {
        nodeId: 'task-1',
        newParentId: 'non-existent',
        newIndex: 0,
      };

      const result = moveNode(tree, moveOperation);

      expect(result.success).toBe(false);
      expect(result.error).toContain('New parent not found');
    });

    it('should fail for invalid parent-child relationship', () => {
      // First create an outcome node
      const outcomeCreate: TreeNodeCreate = {
        type: TreeNodeType.OUTCOME,
        title: 'Test Outcome',
        parentId: 'goal-1',
        index: 1,
      };

      const addResult = addNode(tree, outcomeCreate);
      expect(addResult.success).toBe(true);

      const outcomeNode = Array.from(addResult.tree!.nodes.values()).find(
        n => n.type === TreeNodeType.OUTCOME
      );

      // Try to move task under outcome (invalid relationship)
      const moveOperation: TreeNodeMove = {
        nodeId: 'task-1',
        newParentId: outcomeNode!.id,
        newIndex: 0,
      };

      const moveResult = moveNode(addResult.tree!, moveOperation);

      expect(moveResult.success).toBe(false);
      expect(moveResult.error).toContain('Invalid parent-child relationship');
    });
  });

  // ===========================================================================
  // Update Node Tests
  // ===========================================================================

  describe('updateNode', () => {
    it('should update node properties', () => {
      const updateOperation: TreeNodeUpdate = {
        nodeId: 'task-1',
        updates: {
          title: 'Updated Task Title',
          progress: 75,
          status: 'completed',
        },
      };

      const result = updateNode(tree, updateOperation);

      expect(result.success).toBe(true);
      const updatedNode = result.tree!.nodes.get('task-1');
      expect(updatedNode?.title).toBe('Updated Task Title');
      expect(updatedNode?.progress).toBe(75);
      expect(updatedNode?.status).toBe('completed');
    });

    it('should update timestamp', () => {
      const beforeUpdate = new Date();

      const updateOperation: TreeNodeUpdate = {
        nodeId: 'task-1',
        updates: {
          title: 'Updated Title',
        },
      };

      const result = updateNode(tree, updateOperation);

      expect(result.success).toBe(true);
      const updatedNode = result.tree!.nodes.get('task-1');
      expect(updatedNode?.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime()
      );
    });

    it('should fail when node does not exist', () => {
      const updateOperation: TreeNodeUpdate = {
        nodeId: 'non-existent',
        updates: {
          title: 'New Title',
        },
      };

      const result = updateNode(tree, updateOperation);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Node with ID non-existent not found');
    });

    it('should not modify original tree on failure', () => {
      const originalTitle = tree.nodes.get('task-1')?.title;

      const updateOperation: TreeNodeUpdate = {
        nodeId: 'non-existent',
        updates: {
          title: 'New Title',
        },
      };

      const result = updateNode(tree, updateOperation);

      expect(result.success).toBe(false);
      expect(tree.nodes.get('task-1')?.title).toBe(originalTitle);
    });
  });

  // ===========================================================================
  // Duplicate Node Tests
  // ===========================================================================

  describe('duplicateNode', () => {
    it('should duplicate a node', () => {
      const result = duplicateNode(tree, 'task-1');

      expect(result.success).toBe(true);
      expect(result.tree!.count).toBe(tree.count + 1);

      // Find the duplicated node
      const duplicatedNode = Array.from(result.tree!.nodes.values()).find(
        n => n.title === 'Test Task (Copy)'
      );

      expect(duplicatedNode).toBeDefined();
      expect(duplicatedNode?.parentId).toBe('goal-1'); // Same parent as original
      expect(duplicatedNode?.id).not.toBe('task-1'); // Different ID
    });

    it('should duplicate node with descendants', () => {
      // First add a subtask to create hierarchy
      const subtaskCreate: TreeNodeCreate = {
        type: TreeNodeType.SUBTASK,
        title: 'Subtask',
        parentId: 'task-1',
        index: 0,
      };

      const addResult = addNode(tree, subtaskCreate);
      expect(addResult.success).toBe(true);

      const duplicateResult = duplicateNode(addResult.tree!, 'task-1');

      expect(duplicateResult.success).toBe(true);
      expect(duplicateResult.tree!.count).toBe(addResult.tree!.count + 2); // Task + subtask duplicated
    });

    it('should place duplicate next to original', () => {
      const result = duplicateNode(tree, 'task-1');

      expect(result.success).toBe(true);
      const parent = result.tree!.nodes.get('goal-1');
      const originalIndex = parent?.children.indexOf('task-1');
      const duplicatedNode = Array.from(result.tree!.nodes.values()).find(
        n => n.title === 'Test Task (Copy)'
      );

      expect(parent?.children[originalIndex! + 1]).toBe(duplicatedNode?.id);
    });

    it('should fail when node does not exist', () => {
      const result = duplicateNode(tree, 'non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Node with ID non-existent not found');
    });

    it('should reset selection state on duplicated node', () => {
      // First select the original node
      const originalNode = tree.nodes.get('task-1')!;
      const selectedOriginal = { ...originalNode, isSelected: true };
      tree.nodes.set('task-1', selectedOriginal);

      const result = duplicateNode(tree, 'task-1');

      expect(result.success).toBe(true);
      const duplicatedNode = Array.from(result.tree!.nodes.values()).find(
        n => n.title === 'Test Task (Copy)'
      );

      expect(duplicatedNode?.isSelected).toBe(false);
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle invalid operations gracefully', () => {
      const invalidUpdate: TreeNodeUpdate = {
        nodeId: '', // Empty ID
        updates: {
          title: 'New Title',
        },
      };

      const result = updateNode(tree, invalidUpdate);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should not modify tree state on failed operations', () => {
      const originalCount = tree.count;
      const originalRootIds = [...tree.rootIds];

      // Attempt invalid add
      const invalidAdd: TreeNodeCreate = {
        type: TreeNodeType.TASK,
        title: 'Invalid Task',
        parentId: 'non-existent',
        index: 0,
      };

      const result = addNode(tree, invalidAdd);

      expect(result.success).toBe(false);
      expect(tree.count).toBe(originalCount);
      expect(tree.rootIds).toEqual(originalRootIds);
    });
  });
});
