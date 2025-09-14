/**
 * State Management Index - Centralized State Exports
 *
 * This file provides centralized exports for all state management:
 * - Zustand stores
 * - Store hooks and selectors
 * - Type definitions
 * - Utility functions
 *
 * @fileoverview Centralized exports for state management
 * @version 1.0.0
 */

// =============================================================================
// Store Exports
// =============================================================================

// Goal Store
export {
  useGoalStore,
  useGoals,
  useCurrentGoal,
  useGoalsLoading,
  useGoalsError,
  useGoalsFilters,
  useGoalsSort,
  useGoalsPagination,
  useGoalActions,
  useGoalsWithActions,
} from './goals/goalStore';

export type {
  GoalState,
  GoalActions,
  GoalStore,
  GoalPagination,
  GoalsCache,
} from './goals/goalStore';

// Selection Store
export {
  useSelectionStore,
  useSelectedIds,
  useSelectedCount,
  useSelectionMode,
  useHasSelections,
  useBulkOperationLoading,
  useCanUndo,
  useShowSelectionBar,
  useSelectionActions,
  useSelection,
} from './goals/selectionStore';

export type {
  SelectionState,
  SelectionActions,
  SelectionStore,
  BulkOperation,
  UndoOperation,
  SelectionFilter,
} from './goals/selectionStore';

// Wizard Store
export {
  useWizardStore,
  useCurrentStep,
  useWizardSteps,
  useWizardData,
  useWizardValidation,
  useWizardProgress,
  useWizardLoading,
  useWizardError,
  useWizardDrafts,
  useCanFinish,
  useWizardActions,
  useWizardState,
} from './goals/wizardStore';

export type {
  WizardState,
  WizardActions,
  WizardStore,
  WizardStep,
  StepData,
  ValidationError,
  Draft,
} from './goals/wizardStore';

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Reset all stores to initial state
 */
export const resetAllStores = () => {
  const { resetSelectionState } = useSelectionStore.getState();
  const { cancelWizard } = useWizardStore.getState();
  const { clearCache, clearAllErrors } = useGoalStore.getState();

  resetSelectionState();
  cancelWizard();
  clearCache();
  clearAllErrors();
};

/**
 * Get combined store state for debugging
 */
export const getAllStoreState = () => {
  return {
    goals: useGoalStore.getState(),
    selection: useSelectionStore.getState(),
    wizard: useWizardStore.getState(),
  };
};

/**
 * Subscribe to multiple stores
 */
export const subscribeToAllStores = (callback: (state: ReturnType<typeof getAllStoreState>) => void) => {
  const unsubscribeGoals = useGoalStore.subscribe(callback);
  const unsubscribeSelection = useSelectionStore.subscribe(callback);
  const unsubscribeWizard = useWizardStore.subscribe(callback);

  return () => {
    unsubscribeGoals();
    unsubscribeSelection();
    unsubscribeWizard();
  };
};

// =============================================================================
// Store Statistics
// =============================================================================

export const getStoreStats = () => {
  const goalState = useGoalStore.getState();
  const selectionState = useSelectionStore.getState();
  const wizardState = useWizardStore.getState();

  return {
    goals: {
      totalGoals: goalState.goals.length,
      cacheSize: goalState.cache.size,
      hasCurrentGoal: !!goalState.currentGoal,
      lastFetch: goalState.lastFetch,
    },
    selection: {
      selectedCount: selectionState.selectedIds.size,
      selectionMode: selectionState.selectionMode,
      hasUndoOperations: selectionState.undoStack.length > 0,
      bulkOperationsCount: selectionState.bulkOperations.size,
    },
    wizard: {
      currentStep: wizardState.currentStep,
      overallProgress: wizardState.overallProgress,
      hasUnsavedChanges: wizardState.hasUnsavedChanges,
      draftsCount: wizardState.drafts.length,
      autoSaveEnabled: wizardState.autoSaveEnabled,
    },
  };
};

// =============================================================================
// Development Helpers
// =============================================================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add global helpers for debugging
  (window as any).__GOALS_DEBUG = {
    getAllStoreState,
    resetAllStores,
    getStoreStats,
    stores: {
      goals: useGoalStore,
      selection: useSelectionStore,
      wizard: useWizardStore,
    },
  };
}

// =============================================================================
// Type Re-exports
// =============================================================================

export type {
  SmartGoal,
  SmartGoalSummary,
  SmartGoalCreate,
  SmartGoalUpdate,
  GoalFilters,
  GoalSort,
  GoalStatus,
  GoalPriority,
  GoalCategory,
  Task,
  Subtask,
  TaskStatus,
  Milestone,
  MetricCheckpoint,
  MeasurableSpec,
  Achievability,
  Relevance,
  Timebound,
} from '@/types/smart-goals.types';