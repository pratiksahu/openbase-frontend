/**
 * useGoals Hook - Goals Data Management
 *
 * This hook provides a comprehensive interface for managing goals:
 * - Data fetching with filters and pagination
 * - Loading and error states
 * - Cache management
 * - Automatic refetching
 * - Search and filtering
 *
 * @fileoverview React hook for goals data management
 * @version 1.0.0
 */

import { useEffect, useCallback, useRef } from 'react';
import {
  useGoalStore,
  useGoals as useGoalsSelector,
  useGoalsLoading,
  useGoalsError,
  useGoalsFilters,
  useGoalsSort,
  useGoalsPagination,
  useGoalActions,
} from '@/lib/state/goals/goalStore';
import {
  GoalFilters,
  GoalSort,
  SmartGoalSummary,
  GoalStatus,
  GoalPriority,
  GoalCategory,
} from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface UseGoalsOptions {
  // Fetching options
  autoFetch?: boolean;
  refetchInterval?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;

  // Initial state
  initialFilters?: Partial<GoalFilters>;
  initialSort?: Partial<GoalSort>;
  initialPage?: number;
  initialPageSize?: number;

  // Callbacks
  onSuccess?: (goals: SmartGoalSummary[]) => void;
  onError?: (error: string) => void;

  // Dependencies for auto-refetch
  dependencies?: any[];
}

export interface UseGoalsResult {
  // Data
  goals: SmartGoalSummary[];

  // State
  loading: boolean;
  error: string | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Filters and sorting
  filters: GoalFilters;
  sort: GoalSort;

  // Actions
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Partial<GoalFilters>) => void;
  setSort: (sort: Partial<GoalSort>) => void;
  clearFilters: () => void;

  // Utilities
  getGoalById: (id: string) => SmartGoalSummary | undefined;
  getGoalsByStatus: (status: GoalStatus) => SmartGoalSummary[];
  getGoalsByPriority: (priority: GoalPriority) => SmartGoalSummary[];
  hasGoals: boolean;
  isEmpty: boolean;
}

// =============================================================================
// Main Hook Implementation
// =============================================================================

export function useGoals(options: UseGoalsOptions = {}): UseGoalsResult {
  const {
    autoFetch = true,
    refetchInterval,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    initialFilters = {},
    initialSort = { field: 'updatedAt', direction: 'desc' },
    initialPage = 1,
    initialPageSize = 20,
    onSuccess,
    onError,
    dependencies = [],
  } = options;

  // Store selectors
  const goals = useGoalsSelector();
  const loading = useGoalsLoading();
  const error = useGoalsError();
  const filters = useGoalsFilters();
  const sort = useGoalsSort();
  const pagination = useGoalsPagination();
  const actions = useGoalActions();

  // Refs for tracking
  const refetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);
  const lastDependenciesRef = useRef(dependencies);

  // =============================================================================
  // Actions
  // =============================================================================

  const refetch = useCallback(async () => {
    try {
      await actions.fetchGoals({ forceRefresh: true });
      onSuccess?.(goals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goals';
      onError?.(errorMessage);
    }
  }, [actions, goals, onSuccess, onError]);

  const setPage = useCallback((page: number) => {
    actions.setPage(page);
  }, [actions]);

  const setPageSize = useCallback((size: number) => {
    actions.setPageSize(size);
  }, [actions]);

  const setFilters = useCallback((newFilters: Partial<GoalFilters>) => {
    actions.setFilters(newFilters);
  }, [actions]);

  const setSort = useCallback((newSort: Partial<GoalSort>) => {
    actions.setSort(newSort);
  }, [actions]);

  const clearFilters = useCallback(() => {
    actions.clearFilters();
  }, [actions]);

  // =============================================================================
  // Utility Functions
  // =============================================================================

  const getGoalById = useCallback((id: string): SmartGoalSummary | undefined => {
    return goals.find(goal => goal.id === id);
  }, [goals]);

  const getGoalsByStatus = useCallback((status: GoalStatus): SmartGoalSummary[] => {
    return goals.filter(goal => goal.status === status);
  }, [goals]);

  const getGoalsByPriority = useCallback((priority: GoalPriority): SmartGoalSummary[] => {
    return goals.filter(goal => goal.priority === priority);
  }, [goals]);

  const hasGoals = goals.length > 0;
  const isEmpty = !loading.goals && goals.length === 0;

  // =============================================================================
  // Effects
  // =============================================================================

  // Initialize store with initial values
  useEffect(() => {
    if (!initializedRef.current) {
      // Set initial filters and sort
      if (Object.keys(initialFilters).length > 0) {
        actions.setFilters(initialFilters);
      }

      if (initialSort.field && initialSort.direction) {
        actions.setSort(initialSort);
      }

      // Set initial pagination
      if (initialPage !== 1 || initialPageSize !== 20) {
        actions.setPageSize(initialPageSize);
        if (initialPage !== 1) {
          actions.setPage(initialPage);
        }
      }

      initializedRef.current = true;
    }
  }, []); // Only run once

  // Auto-fetch on mount
  useEffect(() => {
    if (refetchOnMount && autoFetch) {
      actions.fetchGoals();
    }
  }, [refetchOnMount, autoFetch, actions]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    const depsChanged = dependencies.some((dep, index) =>
      dep !== lastDependenciesRef.current[index]
    );

    if (depsChanged && autoFetch && initializedRef.current) {
      actions.fetchGoals({ forceRefresh: true });
      lastDependenciesRef.current = dependencies;
    }
  }, dependencies);

  // Setup refetch interval
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0 && autoFetch) {
      refetchIntervalRef.current = setInterval(() => {
        if (!loading.goals) { // Don't refetch if already loading
          actions.fetchGoals();
        }
      }, refetchInterval);

      return () => {
        if (refetchIntervalRef.current) {
          clearInterval(refetchIntervalRef.current);
          refetchIntervalRef.current = null;
        }
      };
    }
  }, [refetchInterval, autoFetch, loading.goals, actions]);

  // Setup window focus refetch
  useEffect(() => {
    if (refetchOnWindowFocus && autoFetch) {
      const handleFocus = () => {
        if (!loading.goals && document.visibilityState === 'visible') {
          actions.fetchGoals();
        }
      };

      document.addEventListener('visibilitychange', handleFocus);
      window.addEventListener('focus', handleFocus);

      return () => {
        document.removeEventListener('visibilitychange', handleFocus);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [refetchOnWindowFocus, autoFetch, loading.goals, actions]);

  // Handle success/error callbacks
  useEffect(() => {
    if (goals.length > 0 && !loading.goals && !error.goals) {
      onSuccess?.(goals);
    }
  }, [goals, loading.goals, error.goals, onSuccess]);

  useEffect(() => {
    if (error.goals) {
      onError?.(error.goals);
    }
  }, [error.goals, onError]);

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
    goals,

    // State
    loading: loading.goals,
    error: error.goals,

    // Pagination
    pagination,

    // Filters and sorting
    filters,
    sort,

    // Actions
    refetch,
    setPage,
    setPageSize,
    setFilters,
    setSort,
    clearFilters,

    // Utilities
    getGoalById,
    getGoalsByStatus,
    getGoalsByPriority,
    hasGoals,
    isEmpty,
  };
}

// =============================================================================
// Specialized Hook Variants
// =============================================================================

/**
 * Hook for fetching goals with a specific status
 */
export function useGoalsByStatus(status: GoalStatus, options: UseGoalsOptions = {}) {
  const result = useGoals({
    ...options,
    initialFilters: { status: [status], ...options.initialFilters },
  });

  return {
    ...result,
    goals: result.getGoalsByStatus(status),
  };
}

/**
 * Hook for fetching goals with a specific priority
 */
export function useGoalsByPriority(priority: GoalPriority, options: UseGoalsOptions = {}) {
  const result = useGoals({
    ...options,
    initialFilters: { priority: [priority], ...options.initialFilters },
  });

  return {
    ...result,
    goals: result.getGoalsByPriority(priority),
  };
}

/**
 * Hook for fetching goals by category
 */
export function useGoalsByCategory(category: GoalCategory, options: UseGoalsOptions = {}) {
  return useGoals({
    ...options,
    initialFilters: { category: [category], ...options.initialFilters },
  });
}

/**
 * Hook for fetching user's own goals
 */
export function useMyGoals(userId: string, options: UseGoalsOptions = {}) {
  return useGoals({
    ...options,
    initialFilters: { ownerId: [userId], ...options.initialFilters },
  });
}

/**
 * Hook for searching goals
 */
export function useGoalSearch(query: string, options: UseGoalsOptions = {}) {
  return useGoals({
    ...options,
    initialFilters: { searchQuery: query, ...options.initialFilters },
    dependencies: [query, ...(options.dependencies || [])],
  });
}

/**
 * Hook for dashboard goals (active, high priority, recent)
 */
export function useDashboardGoals(options: UseGoalsOptions = {}) {
  return useGoals({
    ...options,
    initialFilters: {
      status: [GoalStatus.ACTIVE, GoalStatus.ON_HOLD],
      ...options.initialFilters,
    },
    initialSort: { field: 'updatedAt', direction: 'desc' },
    initialPageSize: 10,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Hook for overdue goals
 */
export function useOverdueGoals(options: UseGoalsOptions = {}) {
  return useGoals({
    ...options,
    initialFilters: {
      status: [GoalStatus.OVERDUE],
      ...options.initialFilters,
    },
    initialSort: { field: 'timebound', direction: 'asc' }, // Oldest due date first
  });
}

export default useGoals;