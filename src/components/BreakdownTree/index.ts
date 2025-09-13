/**
 * BreakdownTree Component - Barrel Export
 *
 * This file exports all public components, types, and utilities from the BreakdownTree module.
 *
 * @fileoverview Barrel export for BreakdownTree component
 * @version 1.0.0
 */

// Main component
export { BreakdownTree as default, BreakdownTree } from './BreakdownTree';

// Sub-components
export { TreeNode } from './TreeNode';
export { TreeActions } from './TreeActions';
export { TreeSearch } from './TreeSearch';
export { DragDropTreeNode } from './DragDropTreeNode';

// Context
export { TreeProvider, useTreeContext, TreeContext } from './TreeContext';

// Types (re-export all types)
export type {
  // Core types
  TreeNode as TreeNodeData,
  TreeNodeBase,
  GoalTreeNode,
  OutcomeTreeNode,
  MilestoneTreeNode,
  TaskTreeNode,
  SubtaskTreeNode,
  FlatTree,
  TreePath,
  TreeNodePosition,

  // Operation types
  TreeOperationResult,
  TreeNodeUpdate,
  TreeNodeMove,
  TreeNodeCreate,

  // Selection types
  SelectionState,

  // Interaction types
  DragDropData,
  DropValidation,

  // Action types
  QuickAction,

  // Search and filter types
  SearchConfig,
  FilterConfig,
  SearchFilterState,

  // State types
  ExpansionState,
  TreeViewState,

  // Component props
  TreeNodeProps,
  TreeActionsProps,
  BreakdownTreeProps,

  // Utility types
  TreeNodeTypeGuards,
  TreeStatistics,
  PerformanceMetrics,
  TreeContextValue,
} from './BreakdownTree.types';

// Enums (re-export)
export {
  TreeNodeType,
  SelectionMode,
  KeyboardAction,
  QuickActionType,
} from './BreakdownTree.types';

// Utilities
export { treeUtils } from './utils/tree-utils';
export { treeOperations } from './utils/tree-operations';
export { keyboardNavigation } from './utils/keyboard-navigation';

// Type guards and utility functions
export {
  isSmartGoal,
  isTask,
  isMilestone,
} from '@/types/smart-goals.types';