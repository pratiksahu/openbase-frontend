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
  // Import stores dynamically to avoid circular imports - commented out for now
  // Implementation would go here when needed
  console.warn('resetAllStores: Implementation placeholder');
};

/**
 * Get combined store state for debugging
 */
export const getAllStoreState = () => {
  // Implementation placeholder to avoid circular imports
  console.warn('getAllStoreState: Implementation placeholder');
  return {
    goals: null,
    selection: null,
    wizard: null,
  };
};

/**
 * Subscribe to multiple stores
 */
export const subscribeToAllStores = (callback: (state: ReturnType<typeof getAllStoreState>) => void) => {
  // Implementation placeholder to avoid circular imports
  console.warn('subscribeToAllStores: Implementation placeholder');
  // Silence unused parameter warning
  void callback;
  return () => {};
};

// =============================================================================
// Store Statistics
// =============================================================================

export const getStoreStats = () => {
  // Implementation placeholder to avoid circular imports
  console.warn('getStoreStats: Implementation placeholder');

  return {
    goals: {
      totalGoals: 0,
      cacheSize: 0,
      hasCurrentGoal: false,
      lastFetch: null,
    },
    selection: {
      selectedCount: 0,
      selectionMode: false,
      hasUndoOperations: false,
      bulkOperationsCount: 0,
    },
    wizard: {
      currentStep: 0,
      overallProgress: 0,
      hasUnsavedChanges: false,
      draftsCount: 0,
      autoSaveEnabled: false,
    },
  };
};

// =============================================================================
// Development Helpers
// =============================================================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add global helpers for debugging - import stores dynamically to avoid circular refs
  const stores = {
    async goals() {
      return (await import('./goals/goalStore')).useGoalStore;
    },
    async selection() {
      return (await import('./goals/selectionStore')).useSelectionStore;
    },
    async wizard() {
      return (await import('./goals/wizardStore')).useWizardStore;
    },
  };

  (window as typeof window & { __GOALS_DEBUG: unknown }).__GOALS_DEBUG = {
    getAllStoreState,
    resetAllStores,
    getStoreStats,
    stores,
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