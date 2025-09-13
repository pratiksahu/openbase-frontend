/**
 * TreeContext - React Context for Tree State Management
 *
 * This file provides a centralized state management solution for the BreakdownTree component
 * using React Context. It manages tree state, selection, expansion, search/filter, and operations.
 *
 * @fileoverview Tree state management context
 * @version 1.0.0
 */

'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';

import {
  type TreeContextValue,
  type TreeViewState,
  type FlatTree,
  type TreeNodeUpdate,
  type TreeNodeMove,
  type TreeNodeCreate,
  type SearchConfig,
  type FilterConfig,
  SelectionMode,
  TreeNodeType,
} from './BreakdownTree.types';
import { treeOperations } from './utils/tree-operations';
import { treeUtils } from './utils/tree-utils';

// =============================================================================
// Action Types
// =============================================================================

type TreeAction =
  | { type: 'SET_TREE'; payload: FlatTree }
  | { type: 'EXPAND_NODE'; payload: string }
  | { type: 'COLLAPSE_NODE'; payload: string }
  | { type: 'EXPAND_ALL' }
  | { type: 'COLLAPSE_ALL' }
  | { type: 'SELECT_NODE'; payload: { nodeId: string; multiSelect?: boolean } }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'FOCUS_NODE'; payload: string }
  | { type: 'SET_SEARCH'; payload: Partial<SearchConfig> }
  | { type: 'SET_FILTERS'; payload: Partial<FilterConfig> }
  | { type: 'CLEAR_SEARCH_FILTER' }
  | { type: 'SET_LOADING'; payload: { nodeId: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { nodeId: string; error: string | null } }
  | { type: 'UPDATE_TREE_SUCCESS'; payload: FlatTree }
  | { type: 'OPERATION_START'; payload: string }
  | { type: 'OPERATION_COMPLETE'; payload: string }
  | { type: 'OPERATION_ERROR'; payload: { nodeId: string; error: string } };

// =============================================================================
// Initial State
// =============================================================================

const initialTreeState: TreeViewState = {
  tree: {
    nodes: new Map(),
    rootIds: [],
    count: 0,
  },
  selection: {
    selectedIds: new Set(),
    lastSelectedId: null,
    mode: SelectionMode.SINGLE,
  },
  expansion: {
    expanded: new Map(),
    expandAll: false,
  },
  searchFilter: {
    search: {
      query: '',
      searchTitles: true,
      searchDescriptions: true,
      caseSensitive: false,
      useRegex: false,
    },
    filters: {
      nodeTypes: Object.values(TreeNodeType),
      statuses: [],
      priorities: [],
      progressRange: { min: 0, max: 100 },
      dateRange: { start: null, end: null },
    },
    matchingIds: new Set(),
    isActive: false,
  },
  focusedNodeId: null,
  loading: new Map(),
  errors: new Map(),
};

// =============================================================================
// Reducer
// =============================================================================

function treeReducer(state: TreeViewState, action: TreeAction): TreeViewState {
  switch (action.type) {
    case 'SET_TREE': {
      const tree = action.payload;

      // Update expansion state based on node expansion
      const expanded = new Map<string, boolean>();
      tree.nodes.forEach((node, nodeId) => {
        expanded.set(nodeId, node.isExpanded);
      });

      return {
        ...state,
        tree,
        expansion: {
          ...state.expansion,
          expanded,
        },
      };
    }

    case 'EXPAND_NODE': {
      const nodeId = action.payload;
      const node = state.tree.nodes.get(nodeId);
      if (!node) return state;

      const updatedNode = { ...node, isExpanded: true };
      const updatedTree = {
        ...state.tree,
        nodes: new Map(state.tree.nodes),
      };
      updatedTree.nodes.set(nodeId, updatedNode);

      return {
        ...state,
        tree: updatedTree,
        expansion: {
          ...state.expansion,
          expanded: new Map(state.expansion.expanded).set(nodeId, true),
        },
      };
    }

    case 'COLLAPSE_NODE': {
      const nodeId = action.payload;
      const node = state.tree.nodes.get(nodeId);
      if (!node) return state;

      const updatedNode = { ...node, isExpanded: false };
      const updatedTree = {
        ...state.tree,
        nodes: new Map(state.tree.nodes),
      };
      updatedTree.nodes.set(nodeId, updatedNode);

      return {
        ...state,
        tree: updatedTree,
        expansion: {
          ...state.expansion,
          expanded: new Map(state.expansion.expanded).set(nodeId, false),
        },
      };
    }

    case 'EXPAND_ALL': {
      const updatedTree = {
        ...state.tree,
        nodes: new Map(state.tree.nodes),
      };
      const expanded = new Map<string, boolean>();

      state.tree.nodes.forEach((node, nodeId) => {
        if (node.canHaveChildren) {
          const updatedNode = { ...node, isExpanded: true };
          updatedTree.nodes.set(nodeId, updatedNode);
          expanded.set(nodeId, true);
        }
      });

      return {
        ...state,
        tree: updatedTree,
        expansion: {
          expanded,
          expandAll: true,
        },
      };
    }

    case 'COLLAPSE_ALL': {
      const updatedTree = {
        ...state.tree,
        nodes: new Map(state.tree.nodes),
      };
      const expanded = new Map<string, boolean>();

      state.tree.nodes.forEach((node, nodeId) => {
        const updatedNode = { ...node, isExpanded: false };
        updatedTree.nodes.set(nodeId, updatedNode);
        expanded.set(nodeId, false);
      });

      return {
        ...state,
        tree: updatedTree,
        expansion: {
          expanded,
          expandAll: false,
        },
      };
    }

    case 'SELECT_NODE': {
      const { nodeId, multiSelect = false } = action.payload;
      const { selection } = state;

      let selectedIds: Set<string>;
      let lastSelectedId: string | null;

      if (multiSelect && selection.mode === SelectionMode.MULTIPLE) {
        selectedIds = new Set(selection.selectedIds);
        if (selectedIds.has(nodeId)) {
          selectedIds.delete(nodeId);
          lastSelectedId =
            selectedIds.size > 0
              ? Array.from(selectedIds)[selectedIds.size - 1]
              : null;
        } else {
          selectedIds.add(nodeId);
          lastSelectedId = nodeId;
        }
      } else {
        selectedIds = new Set([nodeId]);
        lastSelectedId = nodeId;
      }

      // Update selection state in tree nodes
      const updatedTree = {
        ...state.tree,
        nodes: new Map(state.tree.nodes),
      };

      state.tree.nodes.forEach((node, id) => {
        const isSelected = selectedIds.has(id);
        if (node.isSelected !== isSelected) {
          updatedTree.nodes.set(id, { ...node, isSelected });
        }
      });

      return {
        ...state,
        tree: updatedTree,
        selection: {
          ...selection,
          selectedIds,
          lastSelectedId,
        },
      };
    }

    case 'CLEAR_SELECTION': {
      const updatedTree = {
        ...state.tree,
        nodes: new Map(state.tree.nodes),
      };

      state.tree.nodes.forEach((node, id) => {
        if (node.isSelected) {
          updatedTree.nodes.set(id, { ...node, isSelected: false });
        }
      });

      return {
        ...state,
        tree: updatedTree,
        selection: {
          ...state.selection,
          selectedIds: new Set(),
          lastSelectedId: null,
        },
      };
    }

    case 'FOCUS_NODE': {
      return {
        ...state,
        focusedNodeId: action.payload,
      };
    }

    case 'SET_SEARCH': {
      const searchUpdate = action.payload;
      const updatedSearch = { ...state.searchFilter.search, ...searchUpdate };

      // Update matching IDs if query changed
      const matchingIds = updatedSearch.query
        ? new Set(
            treeUtils.searchNodes(state.tree, updatedSearch.query, {
              searchTitles: updatedSearch.searchTitles,
              searchDescriptions: updatedSearch.searchDescriptions,
              caseSensitive: updatedSearch.caseSensitive,
              useRegex: updatedSearch.useRegex,
            })
          )
        : new Set<string>();

      return {
        ...state,
        searchFilter: {
          ...state.searchFilter,
          search: updatedSearch,
          matchingIds,
          isActive:
            updatedSearch.query.length > 0 ||
            state.searchFilter.filters.nodeTypes.length <
              Object.values(TreeNodeType).length,
        },
      };
    }

    case 'SET_FILTERS': {
      const filtersUpdate = action.payload;
      const updatedFilters = {
        ...state.searchFilter.filters,
        ...filtersUpdate,
      };

      // Update matching IDs based on filters
      const matchingIds = new Set(
        treeUtils.filterNodes(state.tree, {
          nodeTypes: updatedFilters.nodeTypes,
          statuses: updatedFilters.statuses,
          priorities: updatedFilters.priorities,
          progressRange: updatedFilters.progressRange,
          dateRange: updatedFilters.dateRange,
        })
      );

      return {
        ...state,
        searchFilter: {
          ...state.searchFilter,
          filters: updatedFilters,
          matchingIds,
          isActive:
            state.searchFilter.search.query.length > 0 ||
            updatedFilters.nodeTypes.length <
              Object.values(TreeNodeType).length,
        },
      };
    }

    case 'CLEAR_SEARCH_FILTER': {
      return {
        ...state,
        searchFilter: {
          ...initialTreeState.searchFilter,
        },
      };
    }

    case 'SET_LOADING': {
      const { nodeId, loading } = action.payload;
      const newLoading = new Map(state.loading);
      if (loading) {
        newLoading.set(nodeId, true);
      } else {
        newLoading.delete(nodeId);
      }

      return {
        ...state,
        loading: newLoading,
      };
    }

    case 'SET_ERROR': {
      const { nodeId, error } = action.payload;
      const newErrors = new Map(state.errors);
      if (error) {
        newErrors.set(nodeId, error);
      } else {
        newErrors.delete(nodeId);
      }

      return {
        ...state,
        errors: newErrors,
      };
    }

    case 'UPDATE_TREE_SUCCESS': {
      return {
        ...state,
        tree: action.payload,
      };
    }

    case 'OPERATION_START': {
      const nodeId = action.payload;
      const newLoading = new Map(state.loading);
      const newErrors = new Map(state.errors);
      newLoading.set(nodeId, true);
      newErrors.delete(nodeId);

      return {
        ...state,
        loading: newLoading,
        errors: newErrors,
      };
    }

    case 'OPERATION_COMPLETE': {
      const nodeId = action.payload;
      const newLoading = new Map(state.loading);
      newLoading.delete(nodeId);

      return {
        ...state,
        loading: newLoading,
      };
    }

    case 'OPERATION_ERROR': {
      const { nodeId, error } = action.payload;
      const newLoading = new Map(state.loading);
      const newErrors = new Map(state.errors);
      newLoading.delete(nodeId);
      newErrors.set(nodeId, error);

      return {
        ...state,
        loading: newLoading,
        errors: newErrors,
      };
    }

    default:
      return state;
  }
}

// =============================================================================
// Context
// =============================================================================

const TreeContext = createContext<TreeContextValue | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

interface TreeProviderProps {
  children: React.ReactNode;
  initialData?: any[];
  selectionMode?: SelectionMode;
  onTreeChange?: (tree: FlatTree) => void;
  onNodeSelect?: (selectedIds: string[]) => void;
}

export function TreeProvider({
  children,
  initialData = [],
  selectionMode = SelectionMode.SINGLE,
  onTreeChange,
  onNodeSelect,
}: TreeProviderProps) {
  const [state, dispatch] = useReducer(treeReducer, {
    ...initialTreeState,
    selection: {
      ...initialTreeState.selection,
      mode: selectionMode,
    },
  });

  // Initialize tree from data
  React.useEffect(() => {
    if (initialData.length > 0) {
      const tree = treeUtils.buildTree(initialData);
      dispatch({ type: 'SET_TREE', payload: tree });
      onTreeChange?.(tree);
    }
  }, [initialData, onTreeChange]);

  // Notify selection changes
  React.useEffect(() => {
    const selectedIds = Array.from(state.selection.selectedIds);
    onNodeSelect?.(selectedIds);
  }, [state.selection.selectedIds, onNodeSelect]);

  // =============================================================================
  // Operations
  // =============================================================================

  const expandNode = useCallback((nodeId: string) => {
    dispatch({ type: 'EXPAND_NODE', payload: nodeId });
  }, []);

  const collapseNode = useCallback((nodeId: string) => {
    dispatch({ type: 'COLLAPSE_NODE', payload: nodeId });
  }, []);

  const selectNode = useCallback((nodeId: string, multiSelect?: boolean) => {
    dispatch({ type: 'SELECT_NODE', payload: { nodeId, multiSelect } });
  }, []);

  const focusNode = useCallback((nodeId: string) => {
    dispatch({ type: 'FOCUS_NODE', payload: nodeId });
  }, []);

  const updateNode = useCallback(
    async (update: TreeNodeUpdate) => {
      dispatch({ type: 'OPERATION_START', payload: update.nodeId });

      try {
        const result = treeOperations.updateNode(state.tree, update);
        if (result.success && result.tree) {
          dispatch({ type: 'UPDATE_TREE_SUCCESS', payload: result.tree });
          onTreeChange?.(result.tree);
        } else {
          throw new Error(result.error || 'Update failed');
        }
      } catch (error) {
        dispatch({
          type: 'OPERATION_ERROR',
          payload: {
            nodeId: update.nodeId,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      } finally {
        dispatch({ type: 'OPERATION_COMPLETE', payload: update.nodeId });
      }
    },
    [state.tree, onTreeChange]
  );

  const moveNode = useCallback(
    async (move: TreeNodeMove) => {
      dispatch({ type: 'OPERATION_START', payload: move.nodeId });

      try {
        const result = treeOperations.moveNode(state.tree, move);
        if (result.success && result.tree) {
          dispatch({ type: 'UPDATE_TREE_SUCCESS', payload: result.tree });
          onTreeChange?.(result.tree);
        } else {
          throw new Error(result.error || 'Move failed');
        }
      } catch (error) {
        dispatch({
          type: 'OPERATION_ERROR',
          payload: {
            nodeId: move.nodeId,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      } finally {
        dispatch({ type: 'OPERATION_COMPLETE', payload: move.nodeId });
      }
    },
    [state.tree, onTreeChange]
  );

  const createNode = useCallback(
    async (create: TreeNodeCreate) => {
      const tempNodeId = 'temp_' + Date.now();
      dispatch({ type: 'OPERATION_START', payload: tempNodeId });

      try {
        const result = treeOperations.addNode(state.tree, create);
        if (result.success && result.tree) {
          dispatch({ type: 'UPDATE_TREE_SUCCESS', payload: result.tree });
          onTreeChange?.(result.tree);
        } else {
          throw new Error(result.error || 'Creation failed');
        }
      } catch (error) {
        dispatch({
          type: 'OPERATION_ERROR',
          payload: {
            nodeId: tempNodeId,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      } finally {
        dispatch({ type: 'OPERATION_COMPLETE', payload: tempNodeId });
      }
    },
    [state.tree, onTreeChange]
  );

  const deleteNode = useCallback(
    async (nodeId: string) => {
      dispatch({ type: 'OPERATION_START', payload: nodeId });

      try {
        const result = treeOperations.removeNode(state.tree, nodeId);
        if (result.success && result.tree) {
          dispatch({ type: 'UPDATE_TREE_SUCCESS', payload: result.tree });
          onTreeChange?.(result.tree);
        } else {
          throw new Error(result.error || 'Deletion failed');
        }
      } catch (error) {
        dispatch({
          type: 'OPERATION_ERROR',
          payload: {
            nodeId,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      } finally {
        dispatch({ type: 'OPERATION_COMPLETE', payload: nodeId });
      }
    },
    [state.tree, onTreeChange]
  );

  const duplicateNode = useCallback(
    async (nodeId: string) => {
      dispatch({ type: 'OPERATION_START', payload: nodeId });

      try {
        const result = treeOperations.duplicateNode(state.tree, nodeId);
        if (result.success && result.tree) {
          dispatch({ type: 'UPDATE_TREE_SUCCESS', payload: result.tree });
          onTreeChange?.(result.tree);
        } else {
          throw new Error(result.error || 'Duplication failed');
        }
      } catch (error) {
        dispatch({
          type: 'OPERATION_ERROR',
          payload: {
            nodeId,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      } finally {
        dispatch({ type: 'OPERATION_COMPLETE', payload: nodeId });
      }
    },
    [state.tree, onTreeChange]
  );

  const setSearch = useCallback((search: Partial<SearchConfig>) => {
    dispatch({ type: 'SET_SEARCH', payload: search });
  }, []);

  const setFilters = useCallback((filters: Partial<FilterConfig>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const expandAll = useCallback(() => {
    dispatch({ type: 'EXPAND_ALL' });
  }, []);

  const collapseAll = useCallback(() => {
    dispatch({ type: 'COLLAPSE_ALL' });
  }, []);

  // =============================================================================
  // Utilities
  // =============================================================================

  const getNode = useCallback(
    (nodeId: string) => {
      return treeUtils.findNode(state.tree, nodeId) || undefined;
    },
    [state.tree]
  );

  const getNodePath = useCallback(
    (nodeId: string) => {
      return treeUtils.getNodePath(state.tree, nodeId);
    },
    [state.tree]
  );

  const getChildren = useCallback(
    (nodeId: string) => {
      return treeUtils.getChildren(state.tree, nodeId);
    },
    [state.tree]
  );

  const getParent = useCallback(
    (nodeId: string) => {
      return treeUtils.getParent(state.tree, nodeId);
    },
    [state.tree]
  );

  const getSiblings = useCallback(
    (nodeId: string) => {
      return treeUtils.getSiblings(state.tree, nodeId);
    },
    [state.tree]
  );

  const isAncestor = useCallback(
    (ancestorId: string, descendantId: string) => {
      return treeUtils.isAncestor(state.tree, ancestorId, descendantId);
    },
    [state.tree]
  );

  const validateDrop = useCallback(
    (draggedNodeId: string, targetNodeId: string) => {
      return treeOperations.validateNodeMove(state.tree, {
        nodeId: draggedNodeId,
        newParentId: targetNodeId,
        newIndex: 0, // Placeholder index
      });
    },
    [state.tree]
  );

  const getStatistics = useCallback(() => {
    return treeUtils.calculateTreeStatistics(state.tree);
  }, [state.tree]);

  // =============================================================================
  // Context Value
  // =============================================================================

  const contextValue = useMemo<TreeContextValue>(
    () => ({
      state,
      operations: {
        expandNode,
        collapseNode,
        selectNode,
        focusNode,
        updateNode,
        moveNode,
        createNode,
        deleteNode,
        duplicateNode,
        setSearch,
        setFilters,
        expandAll,
        collapseAll,
      },
      utils: {
        getNode,
        getNodePath,
        getChildren,
        getParent,
        getSiblings,
        isAncestor,
        validateDrop,
        getStatistics,
      },
    }),
    [
      state,
      expandNode,
      collapseNode,
      selectNode,
      focusNode,
      updateNode,
      moveNode,
      createNode,
      deleteNode,
      duplicateNode,
      setSearch,
      setFilters,
      expandAll,
      collapseAll,
      getNode,
      getNodePath,
      getChildren,
      getParent,
      getSiblings,
      isAncestor,
      validateDrop,
      getStatistics,
    ]
  );

  return (
    <TreeContext.Provider value={contextValue}>{children}</TreeContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useTreeContext(): TreeContextValue {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTreeContext must be used within a TreeProvider');
  }
  return context;
}

export { TreeContext };
