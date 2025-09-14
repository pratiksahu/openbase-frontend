/**
 * useGoal Hook - Single Goal Management
 *
 * This hook provides functionality for managing a single goal:
 * - Fetching single goal data
 * - CRUD operations with optimistic updates
 * - Real-time updates
 * - Cache management
 * - Error handling and recovery
 *
 * @fileoverview React hook for single goal management
 * @version 1.0.0
 */

import { useEffect, useCallback, useRef, useMemo } from 'react';

import {
  useGoalStore,
  useCurrentGoal,
  useGoalsLoading,
  useGoalsError,
  useGoalActions,
} from '@/lib/state/goals/goalStore';
import {
  SmartGoal,
  SmartGoalUpdate,
  GoalStatus,
  GoalPriority,
} from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface UseGoalOptions {
  // Fetching options
  autoFetch?: boolean;
  refetchOnMount?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;

  // Callbacks
  onSuccess?: (goal: SmartGoal) => void;
  onError?: (error: string) => void;
  onUpdate?: (goal: SmartGoal) => void;
  onDelete?: () => void;

  // Optimistic updates
  enableOptimisticUpdates?: boolean;

  // Dependencies for auto-refetch
  dependencies?: any[];
}

export interface UseGoalResult {
  // Data
  goal: SmartGoal | null;

  // State
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  isDeleting: boolean;

  // Actions
  refetch: () => Promise<void>;
  update: (updates: Partial<SmartGoalUpdate>) => Promise<void>;
  updateStatus: (status: GoalStatus) => Promise<void>;
  updatePriority: (priority: GoalPriority) => Promise<void>;
  updateProgress: (progress: number) => Promise<void>;
  archive: (reason?: string) => Promise<void>;
  delete: (permanent?: boolean) => Promise<void>;
  clearError: () => void;

  // Utilities
  isCompleted: boolean;
  isOverdue: boolean;
  progressPercentage: number;
  daysUntilDue: number | null;
  canEdit: boolean;
  canDelete: boolean;
}

export interface UseGoalMutationOptions {
  onSuccess?: (goal: SmartGoal) => void;
  onError?: (error: string) => void;
  optimistic?: boolean;
}

// =============================================================================
// Main Hook Implementation
// =============================================================================

export function useGoal(goalId: string | null, options: UseGoalOptions = {}): UseGoalResult {
  const {
    autoFetch = true,
    refetchOnMount = true,
    refetchInterval,
    refetchOnWindowFocus = false,
    onSuccess,
    onError,
    onUpdate,
    onDelete,
    enableOptimisticUpdates = true,
    dependencies = [],
  } = options;

  // Store selectors
  const goal = useCurrentGoal();
  const loading = useGoalsLoading();
  const error = useGoalsError();
  const actions = useGoalActions();

  // Refs for tracking
  const refetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastGoalIdRef = useRef(goalId);
  const lastDependenciesRef = useRef(dependencies);

  // =============================================================================
  // Actions
  // =============================================================================

  const refetch = useCallback(async () => {
    if (!goalId) return;

    try {
      await actions.fetchGoal(goalId, true);
      if (goal) {
        onSuccess?.(goal);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goal';
      onError?.(errorMessage);
    }
  }, [goalId, actions, goal, onSuccess, onError]);

  const update = useCallback(async (updates: Partial<SmartGoalUpdate>, mutationOptions?: UseGoalMutationOptions) => {
    if (!goalId) throw new Error('No goal ID provided');

    try {
      await actions.updateGoal(goalId, updates);

      // Get updated goal from store
      const updatedGoal = useGoalStore.getState().currentGoal;
      if (updatedGoal) {
        onUpdate?.(updatedGoal);
        mutationOptions?.onSuccess?.(updatedGoal);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal';
      onError?.(errorMessage);
      mutationOptions?.onError?.(errorMessage);
      throw err;
    }
  }, [goalId, actions, onUpdate, onError]);

  const updateStatus = useCallback(async (status: GoalStatus, mutationOptions?: UseGoalMutationOptions) => {
    const updates: Partial<SmartGoalUpdate> = { status };

    // Add completion date if completing
    if (status === GoalStatus.COMPLETED) {
      updates.actualCompletionDate = new Date();
      updates.progress = 100;
    }

    return update(updates, mutationOptions);
  }, [update]);

  const updatePriority = useCallback(async (priority: GoalPriority, mutationOptions?: UseGoalMutationOptions) => {
    return update({ priority }, mutationOptions);
  }, [update]);

  const updateProgress = useCallback(async (progress: number, mutationOptions?: UseGoalMutationOptions) => {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    const updates: Partial<SmartGoalUpdate> = { progress };

    // Auto-complete if progress reaches 100%
    if (progress === 100 && goal?.status !== GoalStatus.COMPLETED) {
      updates.status = GoalStatus.COMPLETED;
      updates.actualCompletionDate = new Date();
    }

    return update(updates, mutationOptions);
  }, [update, goal?.status]);

  const archive = useCallback(async (reason?: string, mutationOptions?: UseGoalMutationOptions) => {
    if (!goalId) throw new Error('No goal ID provided');

    try {
      await actions.archiveGoal(goalId, reason);

      const updatedGoal = useGoalStore.getState().currentGoal;
      if (updatedGoal) {
        onUpdate?.(updatedGoal);
        mutationOptions?.onSuccess?.(updatedGoal);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to archive goal';
      onError?.(errorMessage);
      mutationOptions?.onError?.(errorMessage);
      throw err;
    }
  }, [goalId, actions, onUpdate, onError]);

  const deleteGoal = useCallback(async (permanent: boolean = false, mutationOptions?: UseGoalMutationOptions) => {
    if (!goalId) throw new Error('No goal ID provided');

    try {
      await actions.deleteGoal(goalId, permanent);
      onDelete?.();
      mutationOptions?.onSuccess?.(goal!);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal';
      onError?.(errorMessage);
      mutationOptions?.onError?.(errorMessage);
      throw err;
    }
  }, [goalId, actions, goal, onDelete, onError]);

  const clearError = useCallback(() => {
    actions.clearError('currentGoal');
  }, [actions]);

  // =============================================================================
  // Computed Properties
  // =============================================================================

  const isCompleted = goal?.status === GoalStatus.COMPLETED;
  const progressPercentage = goal?.progress ?? 0;

  const isOverdue = useMemo(() => {
    if (!goal || isCompleted) return false;

    const targetDate = goal.timebound.targetDate;
    const deadline = goal.timebound.deadline || targetDate;

    return deadline < new Date();
  }, [goal, isCompleted]);

  const daysUntilDue = useMemo(() => {
    if (!goal || isCompleted) return null;

    const targetDate = goal.timebound.targetDate;
    const deadline = goal.timebound.deadline || targetDate;
    const now = new Date();

    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }, [goal, isCompleted]);

  // Basic permission checks (in real app, these would be more sophisticated)
  const canEdit = goal && !goal.isArchived && !goal.isDeleted;
  const canDelete = goal && !goal.isDeleted;

  // =============================================================================
  // Effects
  // =============================================================================

  // Fetch goal when ID changes
  useEffect(() => {
    if (goalId && goalId !== lastGoalIdRef.current) {
      if (refetchOnMount && autoFetch) {
        actions.fetchGoal(goalId);
      }
      lastGoalIdRef.current = goalId;
    }

    // Clear current goal when ID becomes null
    if (!goalId && lastGoalIdRef.current) {
      actions.clearCurrentGoal();
      lastGoalIdRef.current = null;
    }
  }, [goalId, refetchOnMount, autoFetch, actions]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (!goalId) return;

    const depsChanged = dependencies.some((dep, index) =>
      dep !== lastDependenciesRef.current[index]
    );

    if (depsChanged && autoFetch) {
      actions.fetchGoal(goalId, true);
      lastDependenciesRef.current = dependencies;
    }
  }, [goalId, dependencies, autoFetch, actions]);

  // Setup refetch interval
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0 && autoFetch && goalId) {
      refetchIntervalRef.current = setInterval(() => {
        if (!loading.currentGoal) {
          actions.fetchGoal(goalId);
        }
      }, refetchInterval);

      return () => {
        if (refetchIntervalRef.current) {
          clearInterval(refetchIntervalRef.current);
          refetchIntervalRef.current = null;
        }
      };
    }
  }, [refetchInterval, autoFetch, goalId, loading.currentGoal, actions]);

  // Setup window focus refetch
  useEffect(() => {
    if (refetchOnWindowFocus && autoFetch && goalId) {
      const handleFocus = () => {
        if (!loading.currentGoal && document.visibilityState === 'visible') {
          actions.fetchGoal(goalId);
        }
      };

      document.addEventListener('visibilitychange', handleFocus);
      window.addEventListener('focus', handleFocus);

      return () => {
        document.removeEventListener('visibilitychange', handleFocus);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [refetchOnWindowFocus, autoFetch, goalId, loading.currentGoal, actions]);

  // Handle success/error callbacks
  useEffect(() => {
    if (goal && !loading.currentGoal && !error.currentGoal) {
      onSuccess?.(goal);
    }
  }, [goal, loading.currentGoal, error.currentGoal, onSuccess]);

  useEffect(() => {
    if (error.currentGoal) {
      onError?.(error.currentGoal);
    }
  }, [error.currentGoal, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, []);

  // =============================================================================
  // Return Hook Result
  // =============================================================================

  return {
    // Data
    goal,

    // State
    loading: loading.currentGoal,
    error: error.currentGoal,
    isUpdating: loading.update,
    isDeleting: loading.delete,

    // Actions
    refetch,
    update,
    updateStatus,
    updatePriority,
    updateProgress,
    archive,
    delete: deleteGoal,
    clearError,

    // Utilities
    isCompleted,
    isOverdue,
    progressPercentage,
    daysUntilDue,
    canEdit,
    canDelete,
  };
}

// =============================================================================
// Specialized Hook Variants
// =============================================================================

/**
 * Hook for goal mutations only (without fetching)
 */
export function useGoalMutations(goalId: string | null) {
  const actions = useGoalActions();
  const loading = useGoalsLoading();
  const error = useGoalsError();

  const update = useCallback(async (updates: Partial<SmartGoalUpdate>) => {
    if (!goalId) throw new Error('No goal ID provided');
    return actions.updateGoal(goalId, updates);
  }, [goalId, actions]);

  const updateStatus = useCallback(async (status: GoalStatus) => {
    return update({ status });
  }, [update]);

  const updateProgress = useCallback(async (progress: number) => {
    return update({ progress });
  }, [update]);

  const archive = useCallback(async (reason?: string) => {
    if (!goalId) throw new Error('No goal ID provided');
    return actions.archiveGoal(goalId, reason);
  }, [goalId, actions]);

  const deleteGoal = useCallback(async (permanent: boolean = false) => {
    if (!goalId) throw new Error('No goal ID provided');
    return actions.deleteGoal(goalId, permanent);
  }, [goalId, actions]);

  return {
    update,
    updateStatus,
    updateProgress,
    archive,
    delete: deleteGoal,
    isUpdating: loading.update,
    isDeleting: loading.delete,
    error: error.update || error.delete || error.archive,
  };
}

/**
 * Hook for optimistic goal updates
 */
export function useOptimisticGoal(goalId: string | null) {
  const result = useGoal(goalId, { enableOptimisticUpdates: true });

  // Enhanced update with optimistic UI
  const optimisticUpdate = useCallback(async (updates: Partial<SmartGoalUpdate>) => {
    if (!result.goal) return;

    // Apply optimistic update immediately
    const optimisticGoal = { ...result.goal, ...updates, updatedAt: new Date() };

    try {
      // Show optimistic state first
      await result.update(updates);
    } catch (error) {
      // Revert on error (handled by store)
      throw error;
    }
  }, [result]);

  return {
    ...result,
    optimisticUpdate,
  };
}

export default useGoal;