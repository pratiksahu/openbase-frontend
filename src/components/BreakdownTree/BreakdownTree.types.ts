/**
 * BreakdownTree Component Type Definitions
 *
 * This file contains comprehensive type definitions for the BreakdownTree component,
 * which provides hierarchical visualization and management of SMART goals breakdown structure.
 *
 * @fileoverview Type definitions for BreakdownTree component
 * @version 1.0.0
 */

import { SmartGoal, Task, Milestone, Outcome } from '@/types/smart-goals.types';

// =============================================================================
// Core Tree Node Types
// =============================================================================

/** Tree node type enumeration */
export enum TreeNodeType {
  GOAL = 'goal',
  OUTCOME = 'outcome',
  MILESTONE = 'milestone',
  TASK = 'task',
  SUBTASK = 'subtask',
}

/** Tree node base interface */
export interface TreeNodeBase {
  /** Unique identifier for the tree node */
  id: string;
  /** Node type */
  type: TreeNodeType;
  /** Display title */
  title: string;
  /** Optional description */
  description?: string;
  /** Parent node ID (null for root nodes) */
  parentId: string | null;
  /** Child node IDs */
  children: string[];
  /** Depth level in the tree (0 for root) */
  depth: number;
  /** Whether the node is expanded */
  isExpanded: boolean;
  /** Whether the node is selected */
  isSelected: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'critical';
  /** Status */
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'overdue';
  /** Creation and update timestamps */
  createdAt: Date;
  updatedAt: Date;
  /** Order within parent (for sorting) */
  order: number;
  /** Whether this node can have children */
  canHaveChildren: boolean;
  /** Whether this node can be dragged */
  isDraggable: boolean;
  /** Whether this node can accept drops */
  canAcceptDrop: boolean;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/** Tree node with SMART goal data */
export interface GoalTreeNode extends TreeNodeBase {
  type: TreeNodeType.GOAL;
  data: SmartGoal;
  canHaveChildren: true;
}

/** Tree node with outcome data */
export interface OutcomeTreeNode extends TreeNodeBase {
  type: TreeNodeType.OUTCOME;
  data: Outcome;
  canHaveChildren: false;
}

/** Tree node with milestone data */
export interface MilestoneTreeNode extends TreeNodeBase {
  type: TreeNodeType.MILESTONE;
  data: Milestone;
  canHaveChildren: true;
}

/** Tree node with task data */
export interface TaskTreeNode extends TreeNodeBase {
  type: TreeNodeType.TASK;
  data: Task;
  canHaveChildren: true;
}

/** Tree node with subtask data */
export interface SubtaskTreeNode extends TreeNodeBase {
  type: TreeNodeType.SUBTASK;
  data: Task; // Subtasks use the same data structure as tasks
  canHaveChildren: false;
}

/** Union type for all tree node types */
export type TreeNode =
  | GoalTreeNode
  | OutcomeTreeNode
  | MilestoneTreeNode
  | TaskTreeNode
  | SubtaskTreeNode;

// =============================================================================
// Tree Structure Types
// =============================================================================

/** Flat tree structure for efficient operations */
export interface FlatTree {
  /** Map of node ID to tree node */
  nodes: Map<string, TreeNode>;
  /** Root node IDs */
  rootIds: string[];
  /** Total node count */
  count: number;
}

/** Tree path information */
export interface TreePath {
  /** Array of node IDs from root to target */
  path: string[];
  /** Depth of the target node */
  depth: number;
  /** Parent node ID */
  parentId: string | null;
}

/** Tree node position information */
export interface TreeNodePosition {
  /** Node ID */
  nodeId: string;
  /** Parent node ID */
  parentId: string | null;
  /** Index within parent's children */
  index: number;
  /** Path from root */
  path: string[];
}

// =============================================================================
// Tree Operations Types
// =============================================================================

/** Tree operation result */
export interface TreeOperationResult {
  /** Whether the operation was successful */
  success: boolean;
  /** Error message if operation failed */
  error?: string;
  /** Updated tree structure */
  tree?: FlatTree;
  /** Affected node IDs */
  affectedNodeIds?: string[];
}

/** Tree node update payload */
export interface TreeNodeUpdate {
  /** Node ID to update */
  nodeId: string;
  /** Fields to update */
  updates: Partial<Omit<TreeNodeBase, 'id' | 'createdAt' | 'children'>>;
}

/** Tree node move operation */
export interface TreeNodeMove {
  /** Node ID to move */
  nodeId: string;
  /** New parent node ID (null for root level) */
  newParentId: string | null;
  /** New index within parent's children */
  newIndex: number;
}

/** Tree node creation payload */
export interface TreeNodeCreate {
  /** Node type */
  type: TreeNodeType;
  /** Display title */
  title: string;
  /** Optional description */
  description?: string;
  /** Parent node ID (null for root level) */
  parentId: string | null;
  /** Index within parent's children */
  index: number;
  /** Associated data */
  data?: SmartGoal | Task | Milestone | Outcome;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// =============================================================================
// Selection and Interaction Types
// =============================================================================

/** Selection mode for tree nodes */
export enum SelectionMode {
  NONE = 'none',
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

/** Selection state */
export interface SelectionState {
  /** Currently selected node IDs */
  selectedIds: Set<string>;
  /** Last selected node ID (for range selection) */
  lastSelectedId: string | null;
  /** Selection mode */
  mode: SelectionMode;
}

/** Keyboard navigation action */
export enum KeyboardAction {
  MOVE_UP = 'move_up',
  MOVE_DOWN = 'move_down',
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  EXPAND = 'expand',
  COLLAPSE = 'collapse',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  RANGE_SELECT = 'range_select',
}

// =============================================================================
// Drag and Drop Types
// =============================================================================

/** Drag and drop operation data */
export interface DragDropData {
  /** Node being dragged */
  draggedNode: TreeNode;
  /** Drop target node */
  dropTarget: TreeNode | null;
  /** Drop position relative to target */
  dropPosition: 'before' | 'after' | 'inside';
  /** Whether the operation is valid */
  isValidDrop: boolean;
}

/** Drop zone validation result */
export interface DropValidation {
  /** Whether the drop is valid */
  isValid: boolean;
  /** Reason for invalid drop */
  reason?: string;
  /** Whether this would create a circular dependency */
  wouldCreateCircularDependency: boolean;
  /** Whether the node types are compatible */
  areTypesCompatible: boolean;
}

// =============================================================================
// Action Types
// =============================================================================

/** Quick action type enumeration */
export enum QuickActionType {
  ADD_CHILD = 'add_child',
  EDIT = 'edit',
  DELETE = 'delete',
  DUPLICATE = 'duplicate',
  MOVE_UP = 'move_up',
  MOVE_DOWN = 'move_down',
  PROMOTE = 'promote',
  DEMOTE = 'demote',
  SPLIT = 'split',
  CONVERT_TO_SUBGOAL = 'convert_to_subgoal',
  ADD_METRIC = 'add_metric',
  MARK_COMPLETE = 'mark_complete',
  ARCHIVE = 'archive',
}

export type QuickActionTypeString = 'add_child' | 'edit' | 'delete' | 'duplicate' | 'move_up' | 'move_down' | 'promote' | 'demote' | 'split' | 'convert_to_subgoal' | 'add_metric' | 'mark_complete' | 'archive';

/** Quick action definition */
export interface QuickAction {
  /** Action type */
  type: QuickActionType;
  /** Display label */
  label: string;
  /** Icon name from lucide-react */
  icon: string;
  /** Whether the action is enabled */
  enabled: boolean;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Action handler */
  handler: (nodeId: string) => void | Promise<void>;
}

// =============================================================================
// Search and Filter Types
// =============================================================================

/** Search configuration */
export interface SearchConfig {
  /** Search query */
  query: string;
  /** Whether to search in titles */
  searchTitles: boolean;
  /** Whether to search in descriptions */
  searchDescriptions: boolean;
  /** Whether search is case sensitive */
  caseSensitive: boolean;
  /** Whether to use regex search */
  useRegex: boolean;
}

/** Filter configuration */
export interface FilterConfig {
  /** Node types to include */
  nodeTypes: TreeNodeType[];
  /** Status filters */
  statuses: string[];
  /** Priority filters */
  priorities: string[];
  /** Progress range filter */
  progressRange: {
    min: number;
    max: number;
  };
  /** Date range filter */
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

/** Search and filter state */
export interface SearchFilterState {
  /** Search configuration */
  search: SearchConfig;
  /** Filter configuration */
  filters: FilterConfig;
  /** Matching node IDs */
  matchingIds: Set<string>;
  /** Whether search/filter is active */
  isActive: boolean;
}

// =============================================================================
// Tree State Types
// =============================================================================

/** Expansion state for all nodes */
export interface ExpansionState {
  /** Map of node ID to expansion state */
  expanded: Map<string, boolean>;
  /** Whether to expand all nodes */
  expandAll: boolean;
}

/** Tree view state */
export interface TreeViewState {
  /** Tree data structure */
  tree: FlatTree;
  /** Selection state */
  selection: SelectionState;
  /** Expansion state */
  expansion: ExpansionState;
  /** Search and filter state */
  searchFilter: SearchFilterState;
  /** Currently focused node ID */
  focusedNodeId: string | null;
  /** Loading states for async operations */
  loading: Map<string, boolean>;
  /** Error states */
  errors: Map<string, string>;
}

// =============================================================================
// Component Props Types
// =============================================================================

/** TreeNode component props */
export interface TreeNodeProps {
  /** Tree node data */
  node: TreeNode;
  /** Tree view state */
  viewState: TreeViewState;
  /** Node event handlers */
  onExpand: (nodeId: string) => void;
  onCollapse: (nodeId: string) => void;
  onSelect: (nodeId: string, multiSelect?: boolean) => void;
  onFocus: (nodeId: string) => void;
  onAction: (action: QuickActionType, nodeId: string) => void;
  /** Drag and drop handlers */
  onDragStart?: (nodeId: string) => void;
  onDragEnd?: () => void;
  onDrop?: (draggedNodeId: string, targetNodeId: string, position: 'before' | 'after' | 'inside') => void;
  /** Whether drag and drop is enabled */
  enableDragDrop?: boolean;
  /** Custom class names */
  className?: string;
}

/** TreeActions component props */
export interface TreeActionsProps {
  /** Target node */
  node: TreeNode;
  /** Available actions */
  actions: QuickAction[];
  /** Action handler */
  onAction: (action: QuickActionType, nodeId: string) => void;
  /** Trigger element */
  children: React.ReactNode;
  /** Custom class names */
  className?: string;
}

/** BreakdownTree component props */
export interface BreakdownTreeProps {
  /** Initial tree data */
  initialData?: (SmartGoal | Task | Milestone | Outcome)[];
  /** Tree view configuration */
  config?: {
    /** Selection mode */
    selectionMode?: SelectionMode;
    /** Whether drag and drop is enabled */
    enableDragDrop?: boolean;
    /** Whether search is enabled */
    enableSearch?: boolean;
    /** Whether filtering is enabled */
    enableFilters?: boolean;
    /** Whether keyboard navigation is enabled */
    enableKeyboardNavigation?: boolean;
    /** Whether to show connection lines */
    showConnectionLines?: boolean;
    /** Whether to auto-expand nodes */
    autoExpand?: boolean;
    /** Maximum depth to display */
    maxDepth?: number;
    /** Virtual scrolling threshold */
    virtualScrollThreshold?: number;
  };
  /** Event handlers */
  onNodeSelect?: (selectedIds: string[]) => void;
  onNodeUpdate?: (update: TreeNodeUpdate) => void;
  onNodeMove?: (move: TreeNodeMove) => void;
  onNodeCreate?: (create: TreeNodeCreate) => void;
  onNodeDelete?: (nodeId: string) => void;
  onTreeChange?: (tree: FlatTree) => void;
  /** Custom class names */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
}

// =============================================================================
// Utility Types
// =============================================================================

/** Type guard functions */
export interface TreeNodeTypeGuards {
  isGoalNode: (node: TreeNode) => node is GoalTreeNode;
  isOutcomeNode: (node: TreeNode) => node is OutcomeTreeNode;
  isMilestoneNode: (node: TreeNode) => node is MilestoneTreeNode;
  isTaskNode: (node: TreeNode) => node is TaskTreeNode;
  isSubtaskNode: (node: TreeNode) => node is SubtaskTreeNode;
}

/** Tree statistics */
export interface TreeStatistics {
  /** Total number of nodes */
  totalNodes: number;
  /** Nodes by type */
  nodesByType: Record<TreeNodeType, number>;
  /** Maximum depth */
  maxDepth: number;
  /** Average depth */
  averageDepth: number;
  /** Completion percentage */
  overallProgress: number;
  /** Status distribution */
  statusDistribution: Record<string, number>;
}

/** Performance metrics */
export interface PerformanceMetrics {
  /** Last render time in milliseconds */
  lastRenderTime: number;
  /** Total nodes rendered */
  nodesRendered: number;
  /** Nodes in viewport */
  nodesInViewport: number;
  /** Virtual scrolling enabled */
  isVirtualized: boolean;
}

// =============================================================================
// Context Types
// =============================================================================

/** Tree context value */
export interface TreeContextValue {
  /** Current tree state */
  state: TreeViewState;
  /** Tree operations */
  operations: {
    expandNode: (nodeId: string) => void;
    collapseNode: (nodeId: string) => void;
    selectNode: (nodeId: string, multiSelect?: boolean) => void;
    focusNode: (nodeId: string) => void;
    updateNode: (update: TreeNodeUpdate) => Promise<void>;
    moveNode: (move: TreeNodeMove) => Promise<void>;
    createNode: (create: TreeNodeCreate) => Promise<void>;
    deleteNode: (nodeId: string) => Promise<void>;
    duplicateNode: (nodeId: string) => Promise<void>;
    setSearch: (search: Partial<SearchConfig>) => void;
    setFilters: (filters: Partial<FilterConfig>) => void;
    expandAll: () => void;
    collapseAll: () => void;
  };
  /** Tree utilities */
  utils: {
    getNode: (nodeId: string) => TreeNode | undefined;
    getNodePath: (nodeId: string) => TreePath | null;
    getChildren: (nodeId: string) => TreeNode[];
    getParent: (nodeId: string) => TreeNode | null;
    getSiblings: (nodeId: string) => TreeNode[];
    isAncestor: (ancestorId: string, descendantId: string) => boolean;
    validateDrop: (draggedNodeId: string, targetNodeId: string) => DropValidation;
    getStatistics: () => TreeStatistics;
  };
}

// =============================================================================
// All types are exported above as they are defined
// =============================================================================