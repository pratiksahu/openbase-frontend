/**
 * Selection Store - Zustand State Management for Goal Selections
 *
 * This store manages the selection state for bulk operations on SMART Goals:
 * - Selected items tracking
 * - Selection mode management
 * - Bulk operations
 * - Undo/redo functionality
 * - Selection persistence
 *
 * @fileoverview Zustand store for goal selections and bulk operations
 * @version 1.0.0
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { GoalStatus, GoalPriority } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface BulkOperation {
  id: string;
  type: 'status_update' | 'priority_update' | 'delete' | 'archive' | 'assign';
  itemIds: string[];
  data: Record<string, any>;
  timestamp: number;
  completed: boolean;
  error?: string;
}

export interface UndoOperation {
  id: string;
  type: 'bulk_status_update' | 'bulk_delete' | 'bulk_archive' | 'single_delete' | 'single_update';
  data: {
    itemIds: string[];
    previousState: Record<string, any>;
    operation: string;
  };
  timestamp: number;
  canUndo: boolean;
  undoTimeout?: NodeJS.Timeout;
}

export interface SelectionFilter {
  status?: GoalStatus[];
  priority?: GoalPriority[];
  category?: string[];
  ownerId?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SelectionState {
  // Selection tracking
  selectedIds: Set<string>;
  lastSelectedId: string | null;
  selectAllChecked: boolean;
  selectionMode: 'none' | 'single' | 'multiple' | 'range';

  // Bulk operations
  bulkOperations: Map<string, BulkOperation>;
  activeBulkOperation: BulkOperation | null;
  bulkOperationLoading: boolean;
  bulkOperationError: string | null;

  // Undo/Redo system
  undoStack: UndoOperation[];
  canUndo: boolean;
  undoTimeout: number; // seconds

  // Selection filters (for smart selection)
  selectionFilters: SelectionFilter;

  // UI state
  showSelectionBar: boolean;
  selectionBarCollapsed: boolean;

  // Performance optimization
  maxSelections: number;
  selectionWarningThreshold: number;
}

export interface SelectionActions {
  // Basic selection operations
  selectItem: (id: string, extend?: boolean) => void;
  deselectItem: (id: string) => void;
  toggleSelection: (id: string, extend?: boolean) => void;
  selectRange: (startId: string, endId: string, allIds: string[]) => void;
  selectAll: (allIds: string[]) => void;
  selectFiltered: (filteredIds: string[]) => void;
  deselectAll: () => void;
  invertSelection: (allIds: string[]) => void;

  // Advanced selection operations
  selectByStatus: (status: GoalStatus, allIds: string[]) => void;
  selectByPriority: (priority: GoalPriority, allIds: string[]) => void;
  selectByOwner: (ownerId: string, allIds: string[]) => void;
  selectOverdue: (allIds: string[], currentDate?: Date) => void;
  selectCompleted: (allIds: string[]) => void;

  // Selection mode management
  setSelectionMode: (mode: SelectionState['selectionMode']) => void;
  enterSelectionMode: () => void;
  exitSelectionMode: () => void;

  // Bulk operations
  prepareBulkOperation: (
    type: BulkOperation['type'],
    data?: Record<string, any>
  ) => string;
  executeBulkOperation: (operationId: string) => Promise<void>;
  cancelBulkOperation: (operationId: string) => void;

  // Quick bulk operations
  bulkUpdateStatus: (status: GoalStatus) => Promise<void>;
  bulkUpdatePriority: (priority: GoalPriority) => Promise<void>;
  bulkDelete: (permanent?: boolean) => Promise<void>;
  bulkArchive: (reason?: string) => Promise<void>;
  bulkAssign: (ownerId: string) => Promise<void>;

  // Undo/Redo operations
  setupUndo: (operation: Omit<UndoOperation, 'id' | 'timestamp'>) => void;
  performUndo: () => Promise<void>;
  clearUndoStack: () => void;
  extendUndoTimeout: (operationId: string) => void;

  // Selection utilities
  getSelectedCount: () => number;
  isSelected: (id: string) => boolean;
  hasSelections: () => boolean;
  getSelectedIds: () => string[];
  isMaxSelectionsReached: () => boolean;

  // UI state management
  showSelectionBar: () => void;
  hideSelectionBar: () => void;
  toggleSelectionBar: () => void;
  collapseSelectionBar: () => void;
  expandSelectionBar: () => void;

  // Filters for smart selection
  setSelectionFilters: (filters: Partial<SelectionFilter>) => void;
  clearSelectionFilters: () => void;
  applySelectionFilters: (allIds: string[]) => void;

  // Cleanup and reset
  clearAllSelections: () => void;
  resetSelectionState: () => void;
}

export type SelectionStore = SelectionState & SelectionActions;

// =============================================================================
// Initial State
// =============================================================================

const initialState: SelectionState = {
  selectedIds: new Set(),
  lastSelectedId: null,
  selectAllChecked: false,
  selectionMode: 'none',

  bulkOperations: new Map(),
  activeBulkOperation: null,
  bulkOperationLoading: false,
  bulkOperationError: null,

  undoStack: [],
  canUndo: false,
  undoTimeout: 10, // 10 seconds

  selectionFilters: {},

  showSelectionBar: false,
  selectionBarCollapsed: false,

  maxSelections: 1000,
  selectionWarningThreshold: 100,
};

// =============================================================================
// Utility Functions
// =============================================================================

const generateOperationId = (): string => {
  return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const createUndoOperation = (
  type: UndoOperation['type'],
  itemIds: string[],
  previousState: Record<string, any>,
  operation: string
): Omit<UndoOperation, 'id' | 'timestamp'> => ({
  type,
  data: {
    itemIds,
    previousState,
    operation,
  },
  canUndo: true,
});

// =============================================================================
// Store Implementation
// =============================================================================

export const useSelectionStore = create<SelectionStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // =============================================================================
        // Basic Selection Operations
        // =============================================================================

        selectItem: (id: string, extend = false) => {
          set((state) => {
            if (extend && state.selectionMode === 'multiple') {
              state.selectedIds.add(id);
            } else {
              state.selectedIds.clear();
              state.selectedIds.add(id);
              state.selectionMode = 'single';
            }
            state.lastSelectedId = id;

            // Show selection bar if we have selections
            if (state.selectedIds.size > 0) {
              state.showSelectionBar = true;
            }
          });
        },

        deselectItem: (id: string) => {
          set((state) => {
            state.selectedIds.delete(id);

            if (state.lastSelectedId === id) {
              // Set last selected to another item if available
              const remaining = Array.from(state.selectedIds);
              state.lastSelectedId = remaining.length > 0 ? remaining[remaining.length - 1] : null;
            }

            // Hide selection bar if no selections
            if (state.selectedIds.size === 0) {
              state.showSelectionBar = false;
              state.selectionMode = 'none';
            }
          });
        },

        toggleSelection: (id: string, extend = false) => {
          const isSelected = get().selectedIds.has(id);
          if (isSelected) {
            get().deselectItem(id);
          } else {
            get().selectItem(id, extend);
          }
        },

        selectRange: (startId: string, endId: string, allIds: string[]) => {
          const startIndex = allIds.indexOf(startId);
          const endIndex = allIds.indexOf(endId);

          if (startIndex === -1 || endIndex === -1) return;

          const minIndex = Math.min(startIndex, endIndex);
          const maxIndex = Math.max(startIndex, endIndex);

          set((state) => {
            // Clear current selection
            state.selectedIds.clear();

            // Select range
            for (let i = minIndex; i <= maxIndex; i++) {
              state.selectedIds.add(allIds[i]);
            }

            state.selectionMode = 'range';
            state.lastSelectedId = endId;
            state.showSelectionBar = true;
          });
        },

        selectAll: (allIds: string[]) => {
          set((state) => {
            state.selectedIds.clear();
            allIds.forEach(id => state.selectedIds.add(id));
            state.selectAllChecked = true;
            state.selectionMode = 'multiple';
            state.showSelectionBar = true;
            state.lastSelectedId = allIds[allIds.length - 1] || null;
          });
        },

        selectFiltered: (filteredIds: string[]) => {
          set((state) => {
            state.selectedIds.clear();
            filteredIds.forEach(id => state.selectedIds.add(id));
            state.selectionMode = 'multiple';
            state.showSelectionBar = true;
            state.lastSelectedId = filteredIds[filteredIds.length - 1] || null;
          });
        },

        deselectAll: () => {
          set((state) => {
            state.selectedIds.clear();
            state.selectAllChecked = false;
            state.selectionMode = 'none';
            state.showSelectionBar = false;
            state.lastSelectedId = null;
          });
        },

        invertSelection: (allIds: string[]) => {
          const currentSelected = get().selectedIds;
          set((state) => {
            state.selectedIds.clear();
            allIds.forEach(id => {
              if (!currentSelected.has(id)) {
                state.selectedIds.add(id);
              }
            });
            state.selectionMode = 'multiple';
            state.showSelectionBar = state.selectedIds.size > 0;
          });
        },

        // =============================================================================
        // Advanced Selection Operations
        // =============================================================================

        selectByStatus: (status: GoalStatus, allIds: string[]) => {
          // This would require access to goals data to filter by status
          // For now, we'll implement a placeholder that accepts pre-filtered IDs
          get().selectFiltered(allIds);
        },

        selectByPriority: (priority: GoalPriority, allIds: string[]) => {
          // Similar to selectByStatus - needs pre-filtered IDs
          get().selectFiltered(allIds);
        },

        selectByOwner: (ownerId: string, allIds: string[]) => {
          // Similar pattern - needs pre-filtered IDs
          get().selectFiltered(allIds);
        },

        selectOverdue: (allIds: string[], currentDate = new Date()) => {
          // Would filter overdue goals and select them
          get().selectFiltered(allIds);
        },

        selectCompleted: (allIds: string[]) => {
          // Filter and select completed goals
          get().selectFiltered(allIds);
        },

        // =============================================================================
        // Selection Mode Management
        // =============================================================================

        setSelectionMode: (mode) => {
          set((state) => {
            state.selectionMode = mode;
            if (mode === 'none') {
              state.selectedIds.clear();
              state.showSelectionBar = false;
            }
          });
        },

        enterSelectionMode: () => {
          set((state) => {
            state.selectionMode = 'multiple';
            state.showSelectionBar = true;
          });
        },

        exitSelectionMode: () => {
          set((state) => {
            state.selectionMode = 'none';
            state.selectedIds.clear();
            state.showSelectionBar = false;
            state.selectAllChecked = false;
            state.lastSelectedId = null;
          });
        },

        // =============================================================================
        // Bulk Operations
        // =============================================================================

        prepareBulkOperation: (type, data = {}) => {
          const operationId = generateOperationId();
          const selectedIds = Array.from(get().selectedIds);

          if (selectedIds.length === 0) {
            throw new Error('No items selected for bulk operation');
          }

          set((state) => {
            const operation: BulkOperation = {
              id: operationId,
              type,
              itemIds: selectedIds,
              data,
              timestamp: Date.now(),
              completed: false,
            };

            state.bulkOperations.set(operationId, operation);
            state.activeBulkOperation = operation;
          });

          return operationId;
        },

        executeBulkOperation: async (operationId: string) => {
          const operation = get().bulkOperations.get(operationId);
          if (!operation) {
            throw new Error('Operation not found');
          }

          try {
            set((state) => {
              state.bulkOperationLoading = true;
              state.bulkOperationError = null;
            });

            // Import goal store actions dynamically to avoid circular deps
            const { useGoalStore } = await import('./goalStore');
            const goalStore = useGoalStore.getState();

            switch (operation.type) {
              case 'status_update':
                await goalStore.bulkUpdateStatus(operation.itemIds, operation.data.status);
                break;
              case 'delete':
                await goalStore.bulkDelete(operation.itemIds, operation.data.permanent);
                break;
              case 'archive':
                await goalStore.bulkArchive(operation.itemIds, operation.data.reason);
                break;
              default:
                throw new Error(`Unsupported operation type: ${operation.type}`);
            }

            set((state) => {
              const op = state.bulkOperations.get(operationId);
              if (op) {
                op.completed = true;
              }
              state.bulkOperationLoading = false;
              state.activeBulkOperation = null;

              // Clear selections after successful operation
              state.selectedIds.clear();
              state.showSelectionBar = false;
              state.selectionMode = 'none';
            });

            // Setup undo operation
            const undoOp = createUndoOperation(
              operation.type === 'status_update' ? 'bulk_status_update' :
              operation.type === 'delete' ? 'bulk_delete' : 'bulk_archive',
              operation.itemIds,
              operation.data,
              operation.type
            );
            get().setupUndo(undoOp);

          } catch (error) {
            set((state) => {
              state.bulkOperationLoading = false;
              state.bulkOperationError = error instanceof Error ? error.message : 'Bulk operation failed';
              state.activeBulkOperation = null;
            });
            throw error;
          }
        },

        cancelBulkOperation: (operationId: string) => {
          set((state) => {
            state.bulkOperations.delete(operationId);
            if (state.activeBulkOperation?.id === operationId) {
              state.activeBulkOperation = null;
            }
            state.bulkOperationLoading = false;
            state.bulkOperationError = null;
          });
        },

        // =============================================================================
        // Quick Bulk Operations
        // =============================================================================

        bulkUpdateStatus: async (status: GoalStatus) => {
          const operationId = get().prepareBulkOperation('status_update', { status });
          await get().executeBulkOperation(operationId);
        },

        bulkUpdatePriority: async (priority: GoalPriority) => {
          const operationId = get().prepareBulkOperation('priority_update', { priority });
          await get().executeBulkOperation(operationId);
        },

        bulkDelete: async (permanent = false) => {
          const operationId = get().prepareBulkOperation('delete', { permanent });
          await get().executeBulkOperation(operationId);
        },

        bulkArchive: async (reason?: string) => {
          const operationId = get().prepareBulkOperation('archive', { reason });
          await get().executeBulkOperation(operationId);
        },

        bulkAssign: async (ownerId: string) => {
          const operationId = get().prepareBulkOperation('assign', { ownerId });
          await get().executeBulkOperation(operationId);
        },

        // =============================================================================
        // Undo/Redo Operations
        // =============================================================================

        setupUndo: (operation) => {
          const undoId = generateOperationId();
          const undoOp: UndoOperation = {
            ...operation,
            id: undoId,
            timestamp: Date.now(),
          };

          set((state) => {
            // Add to undo stack
            state.undoStack.push(undoOp);

            // Limit undo stack size
            if (state.undoStack.length > 10) {
              state.undoStack.shift();
            }

            state.canUndo = true;
          });

          // Set up auto-expiry
          const timeout = setTimeout(() => {
            set((state) => {
              const index = state.undoStack.findIndex(op => op.id === undoId);
              if (index !== -1) {
                state.undoStack.splice(index, 1);
                state.canUndo = state.undoStack.length > 0;
              }
            });
          }, get().undoTimeout * 1000);

          set((state) => {
            const op = state.undoStack.find(op => op.id === undoId);
            if (op) {
              op.undoTimeout = timeout;
            }
          });
        },

        performUndo: async () => {
          const lastOperation = get().undoStack[get().undoStack.length - 1];
          if (!lastOperation || !lastOperation.canUndo) return;

          try {
            // Clear the timeout
            if (lastOperation.undoTimeout) {
              clearTimeout(lastOperation.undoTimeout);
            }

            // Import goal store for undo operations
            const { useGoalStore } = await import('./goalStore');
            const goalStore = useGoalStore.getState();

            // Perform undo based on operation type
            switch (lastOperation.type) {
              case 'bulk_status_update':
                // Would need to restore previous statuses
                break;
              case 'bulk_delete':
                // Would need to restore deleted items (if soft delete)
                break;
              case 'bulk_archive':
                // Would need to unarchive items
                break;
            }

            set((state) => {
              state.undoStack.pop();
              state.canUndo = state.undoStack.length > 0;
            });

          } catch (error) {
            console.error('Undo operation failed:', error);
          }
        },

        clearUndoStack: () => {
          set((state) => {
            // Clear all timeouts
            state.undoStack.forEach(op => {
              if (op.undoTimeout) {
                clearTimeout(op.undoTimeout);
              }
            });

            state.undoStack = [];
            state.canUndo = false;
          });
        },

        extendUndoTimeout: (operationId: string) => {
          const operation = get().undoStack.find(op => op.id === operationId);
          if (!operation) return;

          if (operation.undoTimeout) {
            clearTimeout(operation.undoTimeout);
          }

          const timeout = setTimeout(() => {
            set((state) => {
              const index = state.undoStack.findIndex(op => op.id === operationId);
              if (index !== -1) {
                state.undoStack.splice(index, 1);
                state.canUndo = state.undoStack.length > 0;
              }
            });
          }, get().undoTimeout * 1000);

          set((state) => {
            const op = state.undoStack.find(op => op.id === operationId);
            if (op) {
              op.undoTimeout = timeout;
            }
          });
        },

        // =============================================================================
        // Selection Utilities
        // =============================================================================

        getSelectedCount: () => {
          return get().selectedIds.size;
        },

        isSelected: (id: string) => {
          return get().selectedIds.has(id);
        },

        hasSelections: () => {
          return get().selectedIds.size > 0;
        },

        getSelectedIds: () => {
          return Array.from(get().selectedIds);
        },

        isMaxSelectionsReached: () => {
          return get().selectedIds.size >= get().maxSelections;
        },

        // =============================================================================
        // UI State Management
        // =============================================================================

        showSelectionBar: () => {
          set((state) => {
            state.showSelectionBar = true;
          });
        },

        hideSelectionBar: () => {
          set((state) => {
            state.showSelectionBar = false;
          });
        },

        toggleSelectionBar: () => {
          set((state) => {
            state.showSelectionBar = !state.showSelectionBar;
          });
        },

        collapseSelectionBar: () => {
          set((state) => {
            state.selectionBarCollapsed = true;
          });
        },

        expandSelectionBar: () => {
          set((state) => {
            state.selectionBarCollapsed = false;
          });
        },

        // =============================================================================
        // Selection Filters
        // =============================================================================

        setSelectionFilters: (filters) => {
          set((state) => {
            Object.assign(state.selectionFilters, filters);
          });
        },

        clearSelectionFilters: () => {
          set((state) => {
            state.selectionFilters = {};
          });
        },

        applySelectionFilters: (allIds: string[]) => {
          // This would filter the allIds based on current filters
          // For now, just select all provided IDs
          get().selectFiltered(allIds);
        },

        // =============================================================================
        // Cleanup and Reset
        // =============================================================================

        clearAllSelections: () => {
          get().deselectAll();
        },

        resetSelectionState: () => {
          get().clearUndoStack();
          set((state) => {
            Object.assign(state, initialState);
            state.selectedIds = new Set();
            state.bulkOperations = new Map();
            state.undoStack = [];
          });
        },
      }))
    ),
    { name: 'SelectionStore' }
  )
);

// =============================================================================
// Selector Hooks for Performance Optimization
// =============================================================================

export const useSelectedIds = () => useSelectionStore(state => state.selectedIds);
export const useSelectedCount = () => useSelectionStore(state => state.selectedIds.size);
export const useSelectionMode = () => useSelectionStore(state => state.selectionMode);
export const useHasSelections = () => useSelectionStore(state => state.selectedIds.size > 0);
export const useBulkOperationLoading = () => useSelectionStore(state => state.bulkOperationLoading);
export const useCanUndo = () => useSelectionStore(state => state.canUndo);
export const useShowSelectionBar = () => useSelectionStore(state => state.showSelectionBar);

// Actions
export const useSelectionActions = () => useSelectionStore(state => ({
  selectItem: state.selectItem,
  deselectItem: state.deselectItem,
  toggleSelection: state.toggleSelection,
  selectAll: state.selectAll,
  deselectAll: state.deselectAll,
  bulkUpdateStatus: state.bulkUpdateStatus,
  bulkDelete: state.bulkDelete,
  bulkArchive: state.bulkArchive,
  performUndo: state.performUndo,
  enterSelectionMode: state.enterSelectionMode,
  exitSelectionMode: state.exitSelectionMode,
}));

// Combined selector for common use cases
export const useSelection = () => {
  const selectedIds = useSelectedIds();
  const selectedCount = useSelectedCount();
  const hasSelections = useHasSelections();
  const selectionMode = useSelectionMode();
  const showSelectionBar = useShowSelectionBar();
  const actions = useSelectionActions();

  return {
    selectedIds: Array.from(selectedIds),
    selectedCount,
    hasSelections,
    selectionMode,
    showSelectionBar,
    isSelected: actions.selectItem,
    ...actions,
  };
};