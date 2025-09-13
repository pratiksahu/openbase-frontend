/**
 * Tree Manipulation Utilities
 *
 * This file contains utilities for manipulating tree structures including
 * adding, removing, moving, and updating nodes while maintaining tree integrity.
 *
 * @fileoverview Tree manipulation utilities for BreakdownTree component
 * @version 1.0.0
 */

import {
  type FlatTree,
  type TreeNode,
  type TreeNodeUpdate,
  type TreeNodeMove,
  type TreeNodeCreate,
  type TreeOperationResult,
  type DropValidation,
  TreeNodeType,
} from '../BreakdownTree.types';

import {
  findNode,
  canMoveNode,
  isValidParentChildRelation,
} from './tree-utils';

// =============================================================================
// Tree Node Creation
// =============================================================================

/**
 * Adds a new node to the tree
 */
export function addNode(
  tree: FlatTree,
  nodeCreate: TreeNodeCreate
): TreeOperationResult {
  try {
    // Validate parent exists (if specified)
    if (nodeCreate.parentId) {
      const parent = findNode(tree, nodeCreate.parentId);
      if (!parent) {
        return {
          success: false,
          error: `Parent node with ID ${nodeCreate.parentId} not found`,
        };
      }

      // Validate parent can have children
      if (!parent.canHaveChildren) {
        return {
          success: false,
          error: `Parent node cannot have children`,
        };
      }

      // Validate parent-child relationship
      if (!isValidParentChildRelation(parent.type, nodeCreate.type)) {
        return {
          success: false,
          error: `Invalid parent-child relationship: ${parent.type} -> ${nodeCreate.type}`,
        };
      }
    }

    // Create new node
    const newNode = createNewNode(nodeCreate);

    // Create new tree with added node
    const newTree: FlatTree = {
      nodes: new Map(tree.nodes),
      rootIds: [...tree.rootIds],
      count: tree.count + 1,
    };

    // Add node to tree
    newTree.nodes.set(newNode.id, newNode);

    // Update parent's children array
    if (nodeCreate.parentId) {
      const parent = newTree.nodes.get(nodeCreate.parentId)!;
      const updatedParent = {
        ...parent,
        children: [...parent.children],
      };

      // Insert at specified index
      updatedParent.children.splice(nodeCreate.index, 0, newNode.id);
      newTree.nodes.set(parent.id, updatedParent);
    } else {
      // Add to root level
      newTree.rootIds.splice(nodeCreate.index, 0, newNode.id);
    }

    // Update order of sibling nodes
    updateSiblingOrders(newTree, newNode.parentId, nodeCreate.index);

    return {
      success: true,
      tree: newTree,
      affectedNodeIds: [newNode.id, ...(nodeCreate.parentId ? [nodeCreate.parentId] : [])],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Creates a new tree node from creation data
 */
function createNewNode(nodeCreate: TreeNodeCreate): TreeNode {
  // Generate unique ID
  const id = generateNodeId();

  // Create mock data based on node type
  const mockData = createMockData(nodeCreate);

  const baseNode = {
    id,
    parentId: nodeCreate.parentId,
    children: [],
    depth: 0, // Will be calculated based on parent
    isExpanded: true,
    isSelected: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: nodeCreate.index,
    isDraggable: true,
    canAcceptDrop: nodeCreate.type !== TreeNodeType.OUTCOME && nodeCreate.type !== TreeNodeType.SUBTASK,
  };

  const node = {
    ...baseNode,
    type: nodeCreate.type,
    title: nodeCreate.title,
    description: nodeCreate.description,
    progress: 0,
    priority: 'medium' as const,
    status: 'draft' as const,
    canHaveChildren: nodeCreate.type !== TreeNodeType.OUTCOME && nodeCreate.type !== TreeNodeType.SUBTASK,
    data: mockData,
    metadata: nodeCreate.metadata,
  };

  return node as TreeNode;
}

/**
 * Creates mock data for different node types
 */
function createMockData(nodeCreate: TreeNodeCreate) {
  const baseData = {
    id: generateNodeId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user',
    updatedBy: 'user',
  };

  switch (nodeCreate.type) {
    case TreeNodeType.GOAL:
      return {
        ...baseData,
        title: nodeCreate.title,
        description: nodeCreate.description || '',
        specificObjective: nodeCreate.title,
        successCriteria: [],
        category: 'other',
        tags: [],
        measurable: {
          metricType: 'number',
          targetValue: 100,
          currentValue: 0,
          unit: '%',
          higherIsBetter: true,
          measurementFrequency: 'monthly',
        },
        achievability: {
          score: 0.8,
          requiredResources: [],
          requiredSkills: [],
          constraints: [],
          riskAssessment: '',
          successProbability: 0.8,
          assessmentConfidence: 0.7,
          lastAssessedAt: new Date(),
          assessedBy: 'user',
        },
        relevance: {
          rationale: '',
          strategyAlignments: [],
          stakeholders: [],
          expectedBenefits: [],
          risksOfNotAchieving: [],
          relevanceScore: 0.8,
          valueScore: 0.8,
          lastReviewedAt: new Date(),
          reviewedBy: 'user',
        },
        timebound: {
          startDate: new Date(),
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          estimatedDuration: 30,
          isRecurring: false,
        },
        status: 'draft',
        priority: 'medium',
        progress: 0,
        ownerId: 'user',
        collaborators: [],
        parentGoalId: nodeCreate.parentId,
        childGoalIds: [],
        tasks: [],
        milestones: [],
        outcomes: [],
        visibility: 'private',
        isArchived: false,
        checkpoints: [],
        isDeleted: false,
        comments: [],
      };

    case TreeNodeType.TASK:
      return {
        ...baseData,
        title: nodeCreate.title,
        description: nodeCreate.description,
        status: 'todo',
        priority: 'medium',
        progress: 0,
        subtasks: [],
        checklist: [],
        goalId: nodeCreate.parentId || '',
        order: nodeCreate.index,
        isDeleted: false,
        comments: [],
      };

    case TreeNodeType.MILESTONE:
      return {
        ...baseData,
        title: nodeCreate.title,
        description: nodeCreate.description,
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        isCompleted: false,
        successCriteria: [],
        progress: 0,
        priority: 'medium',
        taskIds: [],
        goalId: nodeCreate.parentId || '',
        order: nodeCreate.index,
        isCritical: false,
        isDeleted: false,
        comments: [],
      };

    case TreeNodeType.OUTCOME:
      return {
        ...baseData,
        description: nodeCreate.title,
        type: 'primary',
        impactLevel: 5,
        probability: 0.8,
        goalId: nodeCreate.parentId || '',
      };

    default:
      throw new Error(`Unknown node type: ${nodeCreate.type}`);
  }
}

/**
 * Generates a unique node ID
 */
function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// Tree Node Removal
// =============================================================================

/**
 * Removes a node from the tree
 */
export function removeNode(tree: FlatTree, nodeId: string): TreeOperationResult {
  try {
    const node = findNode(tree, nodeId);
    if (!node) {
      return {
        success: false,
        error: `Node with ID ${nodeId} not found`,
      };
    }

    // Create new tree without the removed node and its descendants
    const newTree: FlatTree = {
      nodes: new Map(tree.nodes),
      rootIds: [...tree.rootIds],
      count: tree.count,
    };

    // Get all nodes to remove (node + descendants)
    const nodesToRemove = [nodeId, ...getDescendantIds(tree, nodeId)];

    // Remove nodes from map
    nodesToRemove.forEach((id) => {
      newTree.nodes.delete(id);
      newTree.count--;
    });

    // Update parent's children array
    if (node.parentId) {
      const parent = newTree.nodes.get(node.parentId);
      if (parent) {
        const updatedParent = {
          ...parent,
          children: parent.children.filter((childId) => childId !== nodeId),
        };
        newTree.nodes.set(parent.id, updatedParent);
      }
    } else {
      // Remove from root level
      newTree.rootIds = newTree.rootIds.filter((id) => id !== nodeId);
    }

    // Update order of remaining sibling nodes
    updateSiblingOrders(newTree, node.parentId, -1);

    return {
      success: true,
      tree: newTree,
      affectedNodeIds: [nodeId, ...(node.parentId ? [node.parentId] : [])],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Gets all descendant IDs of a node
 */
function getDescendantIds(tree: FlatTree, nodeId: string): string[] {
  const node = findNode(tree, nodeId);
  if (!node) return [];

  const descendants: string[] = [];

  function traverse(children: string[]) {
    children.forEach((childId) => {
      descendants.push(childId);
      const child = tree.nodes.get(childId);
      if (child && child.children.length > 0) {
        traverse(child.children);
      }
    });
  }

  traverse(node.children);
  return descendants;
}

// =============================================================================
// Tree Node Movement
// =============================================================================

/**
 * Moves a node to a new position in the tree
 */
export function moveNode(tree: FlatTree, nodeMove: TreeNodeMove): TreeOperationResult {
  try {
    const node = findNode(tree, nodeMove.nodeId);
    if (!node) {
      return {
        success: false,
        error: `Node with ID ${nodeMove.nodeId} not found`,
      };
    }

    // Validate the move
    const validation = validateNodeMove(tree, nodeMove);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.reason || 'Invalid move operation',
      };
    }

    // Create new tree with moved node
    const newTree: FlatTree = {
      nodes: new Map(tree.nodes),
      rootIds: [...tree.rootIds],
      count: tree.count,
    };

    // Remove node from old position
    if (node.parentId) {
      const oldParent = newTree.nodes.get(node.parentId);
      if (oldParent) {
        const updatedOldParent = {
          ...oldParent,
          children: oldParent.children.filter((childId) => childId !== nodeMove.nodeId),
        };
        newTree.nodes.set(oldParent.id, updatedOldParent);
      }
    } else {
      newTree.rootIds = newTree.rootIds.filter((id) => id !== nodeMove.nodeId);
    }

    // Update node with new parent and position
    const updatedNode = {
      ...node,
      parentId: nodeMove.newParentId,
      depth: nodeMove.newParentId ? (newTree.nodes.get(nodeMove.newParentId)?.depth || 0) + 1 : 0,
    };
    newTree.nodes.set(nodeMove.nodeId, updatedNode);

    // Add node to new position
    if (nodeMove.newParentId) {
      const newParent = newTree.nodes.get(nodeMove.newParentId);
      if (newParent) {
        const updatedNewParent = {
          ...newParent,
          children: [...newParent.children],
        };
        updatedNewParent.children.splice(nodeMove.newIndex, 0, nodeMove.nodeId);
        newTree.nodes.set(newParent.id, updatedNewParent);
      }
    } else {
      newTree.rootIds.splice(nodeMove.newIndex, 0, nodeMove.nodeId);
    }

    // Update depths of all descendants
    updateDescendantDepths(newTree, nodeMove.nodeId);

    // Update order of siblings in both old and new positions
    updateSiblingOrders(newTree, node.parentId, -1);
    updateSiblingOrders(newTree, nodeMove.newParentId, nodeMove.newIndex);

    const affectedNodeIds = [nodeMove.nodeId];
    if (node.parentId) affectedNodeIds.push(node.parentId);
    if (nodeMove.newParentId) affectedNodeIds.push(nodeMove.newParentId);

    return {
      success: true,
      tree: newTree,
      affectedNodeIds,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Validates a node move operation
 */
function validateNodeMove(tree: FlatTree, nodeMove: TreeNodeMove): DropValidation {
  const node = findNode(tree, nodeMove.nodeId);
  if (!node) {
    return {
      isValid: false,
      reason: 'Node not found',
      wouldCreateCircularDependency: false,
      areTypesCompatible: false,
    };
  }

  // Check for circular dependency
  if (nodeMove.newParentId && !canMoveNode(tree, nodeMove.nodeId, nodeMove.newParentId)) {
    return {
      isValid: false,
      reason: 'Move would create circular dependency',
      wouldCreateCircularDependency: true,
      areTypesCompatible: false,
    };
  }

  // Check parent-child type compatibility
  if (nodeMove.newParentId) {
    const newParent = findNode(tree, nodeMove.newParentId);
    if (!newParent) {
      return {
        isValid: false,
        reason: 'New parent not found',
        wouldCreateCircularDependency: false,
        areTypesCompatible: false,
      };
    }

    if (!newParent.canHaveChildren) {
      return {
        isValid: false,
        reason: 'Target parent cannot have children',
        wouldCreateCircularDependency: false,
        areTypesCompatible: false,
      };
    }

    if (!isValidParentChildRelation(newParent.type, node.type)) {
      return {
        isValid: false,
        reason: `Invalid parent-child relationship: ${newParent.type} -> ${node.type}`,
        wouldCreateCircularDependency: false,
        areTypesCompatible: false,
      };
    }
  }

  return {
    isValid: true,
    wouldCreateCircularDependency: false,
    areTypesCompatible: true,
  };
}

/**
 * Updates the depth of all descendants after a move
 */
function updateDescendantDepths(tree: FlatTree, nodeId: string) {
  const node = tree.nodes.get(nodeId);
  if (!node) return;

  function updateDepth(children: string[], parentDepth: number) {
    children.forEach((childId) => {
      const child = tree.nodes.get(childId);
      if (child) {
        const updatedChild = {
          ...child,
          depth: parentDepth + 1,
        };
        tree.nodes.set(childId, updatedChild);
        updateDepth(child.children, updatedChild.depth);
      }
    });
  }

  updateDepth(node.children, node.depth);
}

// =============================================================================
// Tree Node Updates
// =============================================================================

/**
 * Updates a node's properties
 */
export function updateNode(tree: FlatTree, nodeUpdate: TreeNodeUpdate): TreeOperationResult {
  try {
    const node = findNode(tree, nodeUpdate.nodeId);
    if (!node) {
      return {
        success: false,
        error: `Node with ID ${nodeUpdate.nodeId} not found`,
      };
    }

    // Create new tree with updated node
    const newTree: FlatTree = {
      nodes: new Map(tree.nodes),
      rootIds: tree.rootIds,
      count: tree.count,
    };

    const updatedNode = {
      ...node,
      ...nodeUpdate.updates,
      updatedAt: new Date(),
    };

    newTree.nodes.set(nodeUpdate.nodeId, updatedNode as TreeNode);

    return {
      success: true,
      tree: newTree,
      affectedNodeIds: [nodeUpdate.nodeId],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Duplicates a node and all its descendants
 */
export function duplicateNode(tree: FlatTree, nodeId: string): TreeOperationResult {
  try {
    const node = findNode(tree, nodeId);
    if (!node) {
      return {
        success: false,
        error: `Node with ID ${nodeId} not found`,
      };
    }

    // Create new tree
    const newTree: FlatTree = {
      nodes: new Map(tree.nodes),
      rootIds: [...tree.rootIds],
      count: tree.count,
    };

    const idMapping = new Map<string, string>();
    const affectedNodeIds: string[] = [];

    // Duplicate node and all descendants
    function duplicateNodeRecursively(originalId: string, newParentId: string | null): string {
      const original = tree.nodes.get(originalId);
      if (!original) return '';

      const newId = generateNodeId();
      idMapping.set(originalId, newId);

      const duplicatedNode: TreeNode = {
        ...original,
        id: newId,
        parentId: newParentId,
        title: `${original.title} (Copy)`,
        children: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isSelected: false,
      };

      newTree.nodes.set(newId, duplicatedNode);
      newTree.count++;
      affectedNodeIds.push(newId);

      // Duplicate children
      original.children.forEach((childId) => {
        const newChildId = duplicateNodeRecursively(childId, newId);
        if (newChildId) {
          duplicatedNode.children.push(newChildId);
        }
      });

      return newId;
    }

    const duplicatedNodeId = duplicateNodeRecursively(nodeId, node.parentId);

    // Add duplicated node to parent's children or root
    if (node.parentId) {
      const parent = newTree.nodes.get(node.parentId);
      if (parent) {
        const nodeIndex = parent.children.indexOf(nodeId);
        const updatedParent = {
          ...parent,
          children: [...parent.children],
        };
        updatedParent.children.splice(nodeIndex + 1, 0, duplicatedNodeId);
        newTree.nodes.set(parent.id, updatedParent);
        affectedNodeIds.push(parent.id);
      }
    } else {
      const nodeIndex = newTree.rootIds.indexOf(nodeId);
      newTree.rootIds.splice(nodeIndex + 1, 0, duplicatedNodeId);
    }

    return {
      success: true,
      tree: newTree,
      affectedNodeIds,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Updates the order property of sibling nodes
 */
function updateSiblingOrders(tree: FlatTree, parentId: string | null, startIndex: number) {
  const siblings = parentId
    ? tree.nodes.get(parentId)?.children || []
    : tree.rootIds;

  siblings.forEach((siblingId, index) => {
    if (startIndex === -1 || index >= startIndex) {
      const sibling = tree.nodes.get(siblingId);
      if (sibling) {
        const updatedSibling = {
          ...sibling,
          order: index,
        };
        tree.nodes.set(siblingId, updatedSibling);
      }
    }
  });
}

// =============================================================================
// Export operations
// =============================================================================

export const treeOperations = {
  addNode,
  removeNode,
  moveNode,
  updateNode,
  duplicateNode,
  validateNodeMove,
};