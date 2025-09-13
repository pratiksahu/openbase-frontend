/**
 * Tree Data Structure Utilities
 *
 * This file contains utilities for working with hierarchical tree data structures
 * including traversal, path finding, and structural operations.
 *
 * @fileoverview Tree data structure utilities for BreakdownTree component
 * @version 1.0.0
 */

import {
  type TreeNode,
  type FlatTree,
  type TreePath,
  type TreeNodePosition,
  TreeNodeType,
  type GoalTreeNode,
  type TaskTreeNode,
  type MilestoneTreeNode,
  type OutcomeTreeNode,
  type SubtaskTreeNode,
} from '../BreakdownTree.types';
import {
  SmartGoal,
  Task,
  Milestone,
  Outcome,
} from '@/types/smart-goals.types';

// =============================================================================
// Tree Construction Utilities
// =============================================================================

/**
 * Creates a tree node from raw data
 */
export function createTreeNode(
  data: SmartGoal | Task | Milestone | Outcome,
  parentId: string | null = null,
  depth: number = 0,
  order: number = 0
): TreeNode {
  const baseNode = {
    id: data.id,
    parentId,
    children: [],
    depth,
    isExpanded: depth < 2, // Auto-expand first two levels
    isSelected: false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    order,
    isDraggable: true,
    canAcceptDrop: true,
  };

  // Determine node type and create appropriate node
  if ('specificObjective' in data) {
    // SmartGoal
    return {
      ...baseNode,
      type: TreeNodeType.GOAL,
      title: data.title,
      description: data.description,
      progress: data.progress,
      priority: data.priority,
      status: data.status,
      canHaveChildren: true,
      data: data as SmartGoal,
    } as GoalTreeNode;
  } else if ('targetDate' in data && 'successCriteria' in data) {
    // Milestone
    return {
      ...baseNode,
      type: TreeNodeType.MILESTONE,
      title: data.title,
      description: data.description,
      progress: data.progress,
      priority: data.priority,
      status: data.isCompleted ? 'completed' : 'active',
      canHaveChildren: true,
      data: data as Milestone,
    } as MilestoneTreeNode;
  } else if ('goalId' in data && 'subtasks' in data) {
    // Task
    const isSubtask = 'taskId' in data;
    return {
      ...baseNode,
      type: isSubtask ? TreeNodeType.SUBTASK : TreeNodeType.TASK,
      title: data.title,
      description: data.description,
      progress: data.progress,
      priority: data.priority,
      status: data.status,
      canHaveChildren: !isSubtask,
      data: data as Task,
    } as TaskTreeNode | SubtaskTreeNode;
  } else if ('goalId' in data && 'type' in data) {
    // Outcome
    return {
      ...baseNode,
      type: TreeNodeType.OUTCOME,
      title: data.description,
      description: data.measurementCriteria,
      progress: data.isAchieved ? 100 : 0,
      priority: 'medium',
      status: data.isAchieved ? 'completed' : 'active',
      canHaveChildren: false,
      data: data as Outcome,
    } as OutcomeTreeNode;
  }

  throw new Error(`Unknown data type: ${JSON.stringify(data)}`);
}

/**
 * Builds a flat tree structure from raw data
 */
export function buildTree(
  data: (SmartGoal | Task | Milestone | Outcome)[]
): FlatTree {
  const nodes = new Map<string, TreeNode>();
  const rootIds: string[] = [];

  // First pass: create all nodes
  data.forEach((item, index) => {
    const node = createTreeNode(item, null, 0, index);
    nodes.set(node.id, node);

    // Determine if this is a root node
    if (node.type === TreeNodeType.GOAL) {
      const goalData = item as SmartGoal;
      if (!goalData.parentGoalId) {
        rootIds.push(node.id);
      }
    } else {
      // For non-goals, determine parent based on relationships
      const parentId = getParentIdFromData(item);
      if (!parentId) {
        rootIds.push(node.id);
      }
    }
  });

  // Second pass: establish parent-child relationships
  nodes.forEach((node) => {
    const parentId = getParentIdFromNode(node);
    if (parentId && nodes.has(parentId)) {
      const parent = nodes.get(parentId)!;
      parent.children.push(node.id);
      node.parentId = parentId;
      node.depth = parent.depth + 1;
    }
  });

  // Sort children by order
  nodes.forEach((node) => {
    node.children.sort((a, b) => {
      const nodeA = nodes.get(a)!;
      const nodeB = nodes.get(b)!;
      return nodeA.order - nodeB.order;
    });
  });

  return {
    nodes,
    rootIds: rootIds.sort((a, b) => {
      const nodeA = nodes.get(a)!;
      const nodeB = nodes.get(b)!;
      return nodeA.order - nodeB.order;
    }),
    count: nodes.size,
  };
}

/**
 * Gets parent ID from raw data
 */
function getParentIdFromData(data: SmartGoal | Task | Milestone | Outcome): string | null {
  if ('parentGoalId' in data) {
    return data.parentGoalId || null;
  }
  if ('goalId' in data) {
    return data.goalId;
  }
  if ('taskId' in data) {
    return (data as any).taskId;
  }
  return null;
}

/**
 * Gets parent ID from tree node
 */
function getParentIdFromNode(node: TreeNode): string | null {
  switch (node.type) {
    case TreeNodeType.GOAL:
      return (node.data as SmartGoal).parentGoalId || null;
    case TreeNodeType.OUTCOME:
    case TreeNodeType.MILESTONE:
    case TreeNodeType.TASK:
      return (node.data as any).goalId;
    case TreeNodeType.SUBTASK:
      return (node.data as any).taskId;
    default:
      return null;
  }
}

// =============================================================================
// Tree Traversal Utilities
// =============================================================================

/**
 * Flattens a tree structure into an ordered array
 */
export function flattenTree(tree: FlatTree, expandedOnly: boolean = false): TreeNode[] {
  const result: TreeNode[] = [];

  function traverse(nodeIds: string[], currentDepth: number = 0) {
    nodeIds.forEach((nodeId) => {
      const node = tree.nodes.get(nodeId);
      if (!node) return;

      result.push(node);

      // Only traverse children if node is expanded (or we're including all)
      if ((!expandedOnly || node.isExpanded) && node.children.length > 0) {
        traverse(node.children, currentDepth + 1);
      }
    });
  }

  traverse(tree.rootIds);
  return result;
}

/**
 * Finds a node by ID
 */
export function findNode(tree: FlatTree, nodeId: string): TreeNode | null {
  return tree.nodes.get(nodeId) || null;
}

/**
 * Finds nodes matching a predicate
 */
export function findNodes(
  tree: FlatTree,
  predicate: (node: TreeNode) => boolean
): TreeNode[] {
  const result: TreeNode[] = [];
  tree.nodes.forEach((node) => {
    if (predicate(node)) {
      result.push(node);
    }
  });
  return result;
}

/**
 * Gets the path from root to a specific node
 */
export function getNodePath(tree: FlatTree, nodeId: string): TreePath | null {
  const node = tree.nodes.get(nodeId);
  if (!node) return null;

  const path: string[] = [];
  let current: TreeNode | null = node;

  while (current) {
    path.unshift(current.id);
    current = current.parentId ? tree.nodes.get(current.parentId) || null : null;
  }

  return {
    path,
    depth: path.length - 1,
    parentId: node.parentId,
  };
}

/**
 * Gets all ancestors of a node
 */
export function getAncestors(tree: FlatTree, nodeId: string): TreeNode[] {
  const path = getNodePath(tree, nodeId);
  if (!path) return [];

  // Exclude the node itself, only return ancestors
  return path.path
    .slice(0, -1)
    .map((id) => tree.nodes.get(id))
    .filter((node): node is TreeNode => node !== undefined);
}

/**
 * Gets all descendants of a node
 */
export function getDescendants(tree: FlatTree, nodeId: string): TreeNode[] {
  const node = tree.nodes.get(nodeId);
  if (!node) return [];

  const result: TreeNode[] = [];

  function traverse(children: string[]) {
    children.forEach((childId) => {
      const child = tree.nodes.get(childId);
      if (child) {
        result.push(child);
        traverse(child.children);
      }
    });
  }

  traverse(node.children);
  return result;
}

/**
 * Gets direct children of a node
 */
export function getChildren(tree: FlatTree, nodeId: string): TreeNode[] {
  const node = tree.nodes.get(nodeId);
  if (!node) return [];

  return node.children
    .map((childId) => tree.nodes.get(childId))
    .filter((child): child is TreeNode => child !== undefined);
}

/**
 * Gets the parent of a node
 */
export function getParent(tree: FlatTree, nodeId: string): TreeNode | null {
  const node = tree.nodes.get(nodeId);
  if (!node || !node.parentId) return null;

  return tree.nodes.get(node.parentId) || null;
}

/**
 * Gets siblings of a node
 */
export function getSiblings(tree: FlatTree, nodeId: string): TreeNode[] {
  const node = tree.nodes.get(nodeId);
  if (!node) return [];

  if (!node.parentId) {
    // Root level siblings
    return tree.rootIds
      .filter((id) => id !== nodeId)
      .map((id) => tree.nodes.get(id))
      .filter((sibling): sibling is TreeNode => sibling !== undefined);
  }

  const parent = tree.nodes.get(node.parentId);
  if (!parent) return [];

  return parent.children
    .filter((id) => id !== nodeId)
    .map((id) => tree.nodes.get(id))
    .filter((sibling): sibling is TreeNode => sibling !== undefined);
}

// =============================================================================
// Tree Position Utilities
// =============================================================================

/**
 * Gets the position of a node within its parent
 */
export function getNodePosition(tree: FlatTree, nodeId: string): TreeNodePosition | null {
  const node = tree.nodes.get(nodeId);
  if (!node) return null;

  const path = getNodePath(tree, nodeId);
  if (!path) return null;

  let index = 0;
  if (node.parentId) {
    const parent = tree.nodes.get(node.parentId);
    if (parent) {
      index = parent.children.indexOf(nodeId);
    }
  } else {
    index = tree.rootIds.indexOf(nodeId);
  }

  return {
    nodeId,
    parentId: node.parentId,
    index,
    path: path.path,
  };
}

/**
 * Gets the next node in tree order (depth-first)
 */
export function getNextNode(tree: FlatTree, nodeId: string): TreeNode | null {
  const flatNodes = flattenTree(tree, true); // Only expanded nodes
  const currentIndex = flatNodes.findIndex((node) => node.id === nodeId);

  if (currentIndex === -1 || currentIndex >= flatNodes.length - 1) {
    return null;
  }

  return flatNodes[currentIndex + 1];
}

/**
 * Gets the previous node in tree order (depth-first)
 */
export function getPreviousNode(tree: FlatTree, nodeId: string): TreeNode | null {
  const flatNodes = flattenTree(tree, true); // Only expanded nodes
  const currentIndex = flatNodes.findIndex((node) => node.id === nodeId);

  if (currentIndex <= 0) {
    return null;
  }

  return flatNodes[currentIndex - 1];
}

// =============================================================================
// Tree Validation Utilities
// =============================================================================

/**
 * Checks if one node is an ancestor of another
 */
export function isAncestor(tree: FlatTree, ancestorId: string, descendantId: string): boolean {
  if (ancestorId === descendantId) return false;

  const path = getNodePath(tree, descendantId);
  return path ? path.path.includes(ancestorId) : false;
}

/**
 * Checks if a node can be moved to a new parent without creating circular dependencies
 */
export function canMoveNode(
  tree: FlatTree,
  nodeId: string,
  newParentId: string | null
): boolean {
  if (newParentId === null) return true; // Moving to root is always valid
  if (nodeId === newParentId) return false; // Can't be parent of itself

  // Check if new parent would be a descendant of the node being moved
  return !isAncestor(tree, nodeId, newParentId);
}

/**
 * Validates if a node type can be a child of another node type
 */
export function isValidParentChildRelation(
  parentType: TreeNodeType,
  childType: TreeNodeType
): boolean {
  const validRelations: Record<TreeNodeType, TreeNodeType[]> = {
    [TreeNodeType.GOAL]: [
      TreeNodeType.GOAL,
      TreeNodeType.OUTCOME,
      TreeNodeType.MILESTONE,
      TreeNodeType.TASK,
    ],
    [TreeNodeType.MILESTONE]: [TreeNodeType.TASK],
    [TreeNodeType.TASK]: [TreeNodeType.SUBTASK],
    [TreeNodeType.OUTCOME]: [], // Outcomes cannot have children
    [TreeNodeType.SUBTASK]: [], // Subtasks cannot have children
  };

  return validRelations[parentType]?.includes(childType) ?? false;
}

/**
 * Calculates tree statistics
 */
export function calculateTreeStatistics(tree: FlatTree) {
  const stats = {
    totalNodes: tree.count,
    nodesByType: {
      [TreeNodeType.GOAL]: 0,
      [TreeNodeType.OUTCOME]: 0,
      [TreeNodeType.MILESTONE]: 0,
      [TreeNodeType.TASK]: 0,
      [TreeNodeType.SUBTASK]: 0,
    },
    maxDepth: 0,
    averageDepth: 0,
    overallProgress: 0,
    statusDistribution: {} as Record<string, number>,
  };

  let totalDepth = 0;
  let totalProgress = 0;

  tree.nodes.forEach((node) => {
    // Count by type
    stats.nodesByType[node.type]++;

    // Track depth
    stats.maxDepth = Math.max(stats.maxDepth, node.depth);
    totalDepth += node.depth;

    // Track progress
    totalProgress += node.progress;

    // Track status
    stats.statusDistribution[node.status] =
      (stats.statusDistribution[node.status] || 0) + 1;
  });

  stats.averageDepth = tree.count > 0 ? totalDepth / tree.count : 0;
  stats.overallProgress = tree.count > 0 ? totalProgress / tree.count : 0;

  return stats;
}

// =============================================================================
// Tree Search Utilities
// =============================================================================

/**
 * Searches for nodes matching a query
 */
export function searchNodes(
  tree: FlatTree,
  query: string,
  options: {
    searchTitles?: boolean;
    searchDescriptions?: boolean;
    caseSensitive?: boolean;
    useRegex?: boolean;
  } = {}
): string[] {
  const {
    searchTitles = true,
    searchDescriptions = true,
    caseSensitive = false,
    useRegex = false,
  } = options;

  if (!query.trim()) return [];

  const searchPattern = useRegex
    ? new RegExp(query, caseSensitive ? 'g' : 'gi')
    : caseSensitive
    ? query
    : query.toLowerCase();

  const matchingIds: string[] = [];

  tree.nodes.forEach((node) => {
    const titleText = caseSensitive ? node.title : node.title.toLowerCase();
    const descText = caseSensitive
      ? (node.description || '')
      : (node.description || '').toLowerCase();

    let matches = false;

    if (useRegex && searchPattern instanceof RegExp) {
      if (searchTitles && searchPattern.test(titleText)) matches = true;
      if (searchDescriptions && searchPattern.test(descText)) matches = true;
    } else if (typeof searchPattern === 'string') {
      if (searchTitles && titleText.includes(searchPattern)) matches = true;
      if (searchDescriptions && descText.includes(searchPattern)) matches = true;
    }

    if (matches) {
      matchingIds.push(node.id);
    }
  });

  return matchingIds;
}

/**
 * Filters nodes based on criteria
 */
export function filterNodes(
  tree: FlatTree,
  filters: {
    nodeTypes?: TreeNodeType[];
    statuses?: string[];
    priorities?: string[];
    progressRange?: { min: number; max: number };
    dateRange?: { start: Date | null; end: Date | null };
  }
): string[] {
  const matchingIds: string[] = [];

  tree.nodes.forEach((node) => {
    let matches = true;

    // Filter by node type
    if (filters.nodeTypes && filters.nodeTypes.length > 0) {
      if (!filters.nodeTypes.includes(node.type)) {
        matches = false;
      }
    }

    // Filter by status
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(node.status)) {
        matches = false;
      }
    }

    // Filter by priority
    if (filters.priorities && filters.priorities.length > 0) {
      if (!filters.priorities.includes(node.priority)) {
        matches = false;
      }
    }

    // Filter by progress range
    if (filters.progressRange) {
      const { min, max } = filters.progressRange;
      if (node.progress < min || node.progress > max) {
        matches = false;
      }
    }

    // Filter by date range
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      if (start && node.createdAt < start) matches = false;
      if (end && node.createdAt > end) matches = false;
    }

    if (matches) {
      matchingIds.push(node.id);
    }
  });

  return matchingIds;
}

// =============================================================================
// Export utilities
// =============================================================================

export const treeUtils = {
  // Construction
  createTreeNode,
  buildTree,

  // Traversal
  flattenTree,
  findNode,
  findNodes,
  getNodePath,
  getAncestors,
  getDescendants,
  getChildren,
  getParent,
  getSiblings,

  // Position
  getNodePosition,
  getNextNode,
  getPreviousNode,

  // Validation
  isAncestor,
  canMoveNode,
  isValidParentChildRelation,
  calculateTreeStatistics,

  // Search and filter
  searchNodes,
  filterNodes,
};