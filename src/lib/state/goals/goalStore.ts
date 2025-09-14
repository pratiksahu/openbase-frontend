/**
 * Goal Store - Zustand State Management for SMART Goals
 *
 * This store manages the global state for SMART Goals including:
 * - Goals list with filtering and pagination
 * - Current selected goal
 * - CRUD operations with optimistic updates
 * - Error handling and loading states
 * - Caching strategy
 *
 * @fileoverview Zustand store for SMART Goals management
 * @version 1.0.0
 */

import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Enable MapSet plugin for Immer
enableMapSet();
import {
  SmartGoal,
  SmartGoalSummary,
  SmartGoalUpdate,
  SmartGoalCreate,
  GoalFilters,
  GoalSort,
  GoalStatus,
  GoalPriority,
} from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface GoalPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GoalsCache {
  data: SmartGoalSummary[];
  filters: GoalFilters;
  sort: GoalSort;
  timestamp: number;
  ttl: number; // Time to live in ms
}

export interface GoalState {
  // Goals data
  goals: SmartGoalSummary[];
  currentGoal: SmartGoal | null;

  // UI State
  loading: {
    goals: boolean;
    currentGoal: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    archive: boolean;
  };

  // Error handling
  error: {
    goals: string | null;
    currentGoal: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
    archive: string | null;
  };

  // Filtering and sorting
  filters: GoalFilters;
  sort: GoalSort;

  // Pagination
  pagination: GoalPagination;

  // Cache management
  cache: Map<string, GoalsCache>;

  // Optimistic updates tracking
  optimisticUpdates: Map<string, SmartGoal>;

  // Last fetch timestamp for cache invalidation
  lastFetch: number;
}

export interface GoalActions {
  // Data fetching
  fetchGoals: (options?: {
    filters?: Partial<GoalFilters>;
    sort?: Partial<GoalSort>;
    page?: number;
    limit?: number;
    forceRefresh?: boolean;
  }) => Promise<void>;

  fetchGoal: (id: string, forceRefresh?: boolean) => Promise<void>;

  // CRUD operations
  createGoal: (goal: SmartGoalCreate) => Promise<string>;
  updateGoal: (id: string, updates: Partial<SmartGoalUpdate>) => Promise<void>;
  deleteGoal: (id: string, permanent?: boolean) => Promise<void>;
  archiveGoal: (id: string, reason?: string) => Promise<void>;

  // Bulk operations
  bulkUpdateStatus: (ids: string[], status: GoalStatus) => Promise<void>;
  bulkDelete: (ids: string[], permanent?: boolean) => Promise<void>;
  bulkArchive: (ids: string[], reason?: string) => Promise<void>;

  // State management
  setFilters: (filters: Partial<GoalFilters>) => void;
  setSort: (sort: Partial<GoalSort>) => void;
  setPage: (page: number) => void;
  setPageSize: (limit: number) => void;
  clearCurrentGoal: () => void;
  clearFilters: () => void;

  // Error handling
  clearError: (errorType?: keyof GoalState['error']) => void;
  clearAllErrors: () => void;

  // Cache management
  invalidateCache: (cacheKey?: string) => void;
  clearCache: () => void;

  // Utility functions
  refreshGoals: () => Promise<void>;
  searchGoals: (query: string) => Promise<void>;
  getGoalById: (id: string) => SmartGoalSummary | null;
  getGoalsByStatus: (status: GoalStatus) => SmartGoalSummary[];
  getGoalsByPriority: (priority: GoalPriority) => SmartGoalSummary[];
}

export type GoalStore = GoalState & GoalActions;

// =============================================================================
// Initial State
// =============================================================================

const initialState: GoalState = {
  goals: [],
  currentGoal: null,

  loading: {
    goals: false,
    currentGoal: false,
    create: false,
    update: false,
    delete: false,
    archive: false,
  },

  error: {
    goals: null,
    currentGoal: null,
    create: null,
    update: null,
    delete: null,
    archive: null,
  },

  filters: {},

  sort: {
    field: 'updatedAt',
    direction: 'desc',
  },

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  cache: new Map(),
  optimisticUpdates: new Map(),
  lastFetch: 0,
};

// =============================================================================
// Utility Functions
// =============================================================================

const generateCacheKey = (filters: GoalFilters, sort: GoalSort, page: number, limit: number): string => {
  return JSON.stringify({ filters, sort, page, limit });
};

const isValidCache = (cache: GoalsCache): boolean => {
  const now = Date.now();
  return now - cache.timestamp < cache.ttl;
};

const createOptimisticGoal = (create: SmartGoalCreate): SmartGoal => {
  const now = new Date();
  const tempId = `temp-${Date.now()}`;

  return {
    ...create,
    id: tempId,
    createdAt: now,
    updatedAt: now,
    createdBy: 'current-user', // Should be from auth context
    updatedBy: 'current-user',
    isDeleted: false,
    checkpoints: [],
    tasks: [],
    milestones: [],
    outcomes: [],
    childGoalIds: [],
    isArchived: false,
    comments: [],
  };
};

// =============================================================================
// Store Implementation
// =============================================================================

export const useGoalStore = create<GoalStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,

          // =============================================================================
          // Data Fetching Actions
          // =============================================================================

          fetchGoals: async (options = {}) => {
            const {
              filters = {},
              sort = {},
              page = 1,
              limit = 20,
              forceRefresh = false,
            } = options;

            try {
              set((state) => {
                state.loading.goals = true;
                state.error.goals = null;

                // Update filters, sort, and pagination
                Object.assign(state.filters, filters);
                Object.assign(state.sort, sort);
                state.pagination.page = page;
                state.pagination.limit = limit;
              });

              // Generate cache key
              const cacheKey = generateCacheKey(
                { ...get().filters, ...filters },
                { ...get().sort, ...sort },
                page,
                limit
              );

              // Check cache if not forcing refresh
              if (!forceRefresh) {
                const cached = get().cache.get(cacheKey);
                if (cached && isValidCache(cached)) {
                  set((state) => {
                    state.goals = cached.data;
                    state.loading.goals = false;
                  });
                  return;
                }
              }

              // Import API dynamically to avoid circular dependencies
              const { goalsApi } = await import('@/lib/api/goals');

              const response = await goalsApi.getGoals({
                filters: { ...get().filters, ...filters },
                sort: { ...get().sort, ...sort },
                page,
                limit,
              });

              set((state) => {
                state.goals = response.data;
                state.pagination = {
                  page: response.page,
                  limit: response.limit,
                  total: response.total,
                  totalPages: response.totalPages,
                  hasNext: response.hasNext,
                  hasPrev: response.hasPrev,
                };
                state.loading.goals = false;
                state.lastFetch = Date.now();

                // Cache the results
                state.cache.set(cacheKey, {
                  data: response.data,
                  filters: { ...state.filters, ...filters },
                  sort: { ...state.sort, ...sort },
                  timestamp: Date.now(),
                  ttl: 5 * 60 * 1000, // 5 minutes
                });
              });

            } catch (error) {
              set((state) => {
                state.loading.goals = false;
                state.error.goals = error instanceof Error ? error.message : 'Failed to fetch goals';
              });
            }
          },

          fetchGoal: async (id: string, _forceRefresh = false) => {
            try {
              set((state) => {
                state.loading.currentGoal = true;
                state.error.currentGoal = null;
              });

              const { goalsApi } = await import('@/lib/api/goals');
              const goal = await goalsApi.getGoal(id);

              set((state) => {
                state.currentGoal = goal;
                state.loading.currentGoal = false;
              });

            } catch (error) {
              set((state) => {
                state.loading.currentGoal = false;
                state.error.currentGoal = error instanceof Error ? error.message : 'Failed to fetch goal';
              });
            }
          },

          // =============================================================================
          // CRUD Operations
          // =============================================================================

          createGoal: async (goalData: SmartGoalCreate) => {
            const tempId = `temp-${Date.now()}`;

            try {
              set((state) => {
                state.loading.create = true;
                state.error.create = null;
              });

              // Optimistic update
              const optimisticGoal = createOptimisticGoal(goalData);
              set((state) => {
                state.optimisticUpdates.set(tempId, optimisticGoal);
                // Add to goals list for immediate UI feedback
                state.goals.unshift({
                  id: tempId,
                  title: goalData.title,
                  description: goalData.description,
                  status: goalData.status,
                  priority: goalData.priority,
                  progress: goalData.progress || 0,
                  category: goalData.category,
                  ownerId: goalData.ownerId,
                  timebound: goalData.timebound,
                  createdAt: optimisticGoal.createdAt,
                  updatedAt: optimisticGoal.updatedAt,
                });
              });

              const { goalsApi } = await import('@/lib/api/goals');
              const newGoal = await goalsApi.createGoal(goalData);

              set((state) => {
                state.loading.create = false;
                state.optimisticUpdates.delete(tempId);

                // Replace optimistic goal with real goal
                const index = state.goals.findIndex(g => g.id === tempId);
                if (index !== -1) {
                  state.goals[index] = {
                    id: newGoal.id,
                    title: newGoal.title,
                    description: newGoal.description,
                    status: newGoal.status,
                    priority: newGoal.priority,
                    progress: newGoal.progress,
                    category: newGoal.category,
                    ownerId: newGoal.ownerId,
                    timebound: newGoal.timebound,
                    createdAt: newGoal.createdAt,
                    updatedAt: newGoal.updatedAt,
                  };
                }

                // Invalidate cache
                state.cache.clear();
              });

              return newGoal.id;

            } catch (error) {
              // Revert optimistic update on error
              set((state) => {
                state.loading.create = false;
                state.error.create = error instanceof Error ? error.message : 'Failed to create goal';
                state.optimisticUpdates.delete(tempId);

                // Remove optimistic goal from list
                state.goals = state.goals.filter(g => g.id !== tempId);
              });
              throw error;
            }
          },

          updateGoal: async (id: string, updates: Partial<SmartGoalUpdate>) => {
            // Store original goal for rollback
            const originalGoal = get().goals.find(g => g.id === id);

            try {
              set((state) => {
                state.loading.update = true;
                state.error.update = null;
              });

              // Optimistic update
              if (originalGoal) {
                set((state) => {
                  const index = state.goals.findIndex(g => g.id === id);
                  if (index !== -1) {
                    Object.assign(state.goals[index], updates);
                  }

                  // Update current goal if it's the same
                  if (state.currentGoal?.id === id) {
                    Object.assign(state.currentGoal, updates);
                  }
                });
              }

              const { goalsApi } = await import('@/lib/api/goals');
              const updatedGoal = await goalsApi.updateGoal(id, updates);

              set((state) => {
                state.loading.update = false;

                // Update goals list
                const index = state.goals.findIndex(g => g.id === id);
                if (index !== -1) {
                  state.goals[index] = {
                    id: updatedGoal.id,
                    title: updatedGoal.title,
                    description: updatedGoal.description,
                    status: updatedGoal.status,
                    priority: updatedGoal.priority,
                    progress: updatedGoal.progress,
                    category: updatedGoal.category,
                    ownerId: updatedGoal.ownerId,
                    timebound: updatedGoal.timebound,
                    createdAt: updatedGoal.createdAt,
                    updatedAt: updatedGoal.updatedAt,
                  };
                }

                // Update current goal
                if (state.currentGoal?.id === id) {
                  state.currentGoal = updatedGoal;
                }

                // Invalidate cache
                state.cache.clear();
              });

            } catch (error) {
              // Revert optimistic update on error
              if (originalGoal) {
                set((state) => {
                  const index = state.goals.findIndex(g => g.id === id);
                  if (index !== -1) {
                    state.goals[index] = originalGoal;
                  }
                });
              }

              set((state) => {
                state.loading.update = false;
                state.error.update = error instanceof Error ? error.message : 'Failed to update goal';
              });
              throw error;
            }
          },

          deleteGoal: async (id: string, permanent = false) => {
            // Store original goals for rollback
            const originalGoals = [...get().goals];

            try {
              set((state) => {
                state.loading.delete = true;
                state.error.delete = null;
              });

              // Optimistic update
              set((state) => {
                state.goals = state.goals.filter(g => g.id !== id);
                if (state.currentGoal?.id === id) {
                  state.currentGoal = null;
                }
              });

              const { goalsApi } = await import('@/lib/api/goals');
              await goalsApi.deleteGoal(id, permanent);

              set((state) => {
                state.loading.delete = false;
                // Invalidate cache
                state.cache.clear();
              });

            } catch (error) {
              // Revert optimistic update on error
              set((state) => {
                state.loading.delete = false;
                state.error.delete = error instanceof Error ? error.message : 'Failed to delete goal';
                state.goals = originalGoals;
              });
              throw error;
            }
          },

          archiveGoal: async (id: string, reason?: string) => {
            try {
              set((state) => {
                state.loading.archive = true;
                state.error.archive = null;
              });

              // Optimistic update
              set((state) => {
                const index = state.goals.findIndex(g => g.id === id);
                if (index !== -1) {
                  // Remove from main list (archived goals are typically hidden)
                  state.goals.splice(index, 1);
                }

                if (state.currentGoal?.id === id) {
                  state.currentGoal.isArchived = true;
                  state.currentGoal.archivedAt = new Date();
                  state.currentGoal.archiveReason = reason;
                }
              });

              const { goalsApi } = await import('@/lib/api/goals');
              await goalsApi.archiveGoal(id, reason);

              set((state) => {
                state.loading.archive = false;
                // Invalidate cache
                state.cache.clear();
              });

            } catch (error) {
              set((state) => {
                state.loading.archive = false;
                state.error.archive = error instanceof Error ? error.message : 'Failed to archive goal';
              });
              throw error;
            }
          },

          // =============================================================================
          // Bulk Operations
          // =============================================================================

          bulkUpdateStatus: async (ids: string[], status: GoalStatus) => {
            try {
              // Optimistic update
              set((state) => {
                ids.forEach(id => {
                  const index = state.goals.findIndex(g => g.id === id);
                  if (index !== -1) {
                    state.goals[index].status = status;
                  }
                });
              });

              const { goalsApi } = await import('@/lib/api/goals');
              await goalsApi.bulkUpdateStatus(ids, status);

              // Invalidate cache
              get().invalidateCache();

            } catch (error) {
              // Could revert optimistic updates here
              throw error;
            }
          },

          bulkDelete: async (ids: string[], permanent = false) => {
            // Store original goals for rollback
            const originalGoals = [...get().goals];

            try {
              // Optimistic update
              set((state) => {
                state.goals = state.goals.filter(g => !ids.includes(g.id));
              });

              const { goalsApi } = await import('@/lib/api/goals');
              await goalsApi.bulkDelete(ids, permanent);

              // Invalidate cache
              get().invalidateCache();

            } catch (error) {
              // Revert optimistic update
              set((state) => {
                state.goals = originalGoals;
              });
              throw error;
            }
          },

          bulkArchive: async (ids: string[], reason?: string) => {
            // Store original goals for rollback
            const originalGoals = [...get().goals];

            try {
              // Optimistic update
              set((state) => {
                state.goals = state.goals.filter(g => !ids.includes(g.id));
              });

              const { goalsApi } = await import('@/lib/api/goals');
              await goalsApi.bulkArchive(ids, reason);

              // Invalidate cache
              get().invalidateCache();

            } catch (error) {
              // Revert optimistic update
              set((state) => {
                state.goals = originalGoals;
              });
              throw error;
            }
          },

          // =============================================================================
          // State Management Actions
          // =============================================================================

          setFilters: (filters: Partial<GoalFilters>) => {
            set((state) => {
              Object.assign(state.filters, filters);
              state.pagination.page = 1; // Reset to first page
            });

            // Refetch with new filters
            get().fetchGoals();
          },

          setSort: (sort: Partial<GoalSort>) => {
            set((state) => {
              Object.assign(state.sort, sort);
              state.pagination.page = 1; // Reset to first page
            });

            // Refetch with new sort
            get().fetchGoals();
          },

          setPage: (page: number) => {
            get().fetchGoals({ page });
          },

          setPageSize: (limit: number) => {
            get().fetchGoals({ limit, page: 1 });
          },

          clearCurrentGoal: () => {
            set((state) => {
              state.currentGoal = null;
              state.error.currentGoal = null;
            });
          },

          clearFilters: () => {
            set((state) => {
              state.filters = {};
              state.pagination.page = 1;
            });

            get().fetchGoals();
          },

          // =============================================================================
          // Error Handling
          // =============================================================================

          clearError: (errorType) => {
            set((state) => {
              if (errorType) {
                state.error[errorType] = null;
              } else {
                // Clear all errors if no specific type provided
                Object.keys(state.error).forEach(key => {
                  state.error[key as keyof typeof state.error] = null;
                });
              }
            });
          },

          clearAllErrors: () => {
            set((state) => {
              Object.keys(state.error).forEach(key => {
                state.error[key as keyof typeof state.error] = null;
              });
            });
          },

          // =============================================================================
          // Cache Management
          // =============================================================================

          invalidateCache: (cacheKey) => {
            set((state) => {
              if (cacheKey) {
                state.cache.delete(cacheKey);
              } else {
                state.cache.clear();
              }
            });
          },

          clearCache: () => {
            set((state) => {
              state.cache.clear();
            });
          },

          // =============================================================================
          // Utility Functions
          // =============================================================================

          refreshGoals: () => {
            return get().fetchGoals({ forceRefresh: true });
          },

          searchGoals: async (query: string) => {
            return get().fetchGoals({
              filters: { searchQuery: query },
              forceRefresh: true,
            });
          },

          getGoalById: (id: string) => {
            return get().goals.find(goal => goal.id === id) || null;
          },

          getGoalsByStatus: (status: GoalStatus) => {
            return get().goals.filter(goal => goal.status === status);
          },

          getGoalsByPriority: (priority: GoalPriority) => {
            return get().goals.filter(goal => goal.priority === priority);
          },
        }))
      ),
      {
        name: 'goal-store',
        partialize: (state) => ({
          // Only persist certain parts of the state
          filters: state.filters,
          sort: state.sort,
          pagination: { ...state.pagination, page: 1 }, // Reset page on reload
        }),
      }
    ),
    { name: 'GoalStore' }
  )
);

// =============================================================================
// Selector Hooks for Performance Optimization
// =============================================================================

export const useGoals = () => useGoalStore(state => state.goals);
export const useCurrentGoal = () => useGoalStore(state => state.currentGoal);
export const useGoalsLoading = () => useGoalStore(state => state.loading);
export const useGoalsError = () => useGoalStore(state => state.error);
export const useGoalsFilters = () => useGoalStore(state => state.filters);
export const useGoalsSort = () => useGoalStore(state => state.sort);
export const useGoalsPagination = () => useGoalStore(state => state.pagination);

// Actions
export const useGoalActions = () => useGoalStore(state => ({
  fetchGoals: state.fetchGoals,
  fetchGoal: state.fetchGoal,
  createGoal: state.createGoal,
  updateGoal: state.updateGoal,
  deleteGoal: state.deleteGoal,
  archiveGoal: state.archiveGoal,
  setFilters: state.setFilters,
  setSort: state.setSort,
  setPage: state.setPage,
  setPageSize: state.setPageSize,
  clearCurrentGoal: state.clearCurrentGoal,
  clearFilters: state.clearFilters,
  clearError: state.clearError,
  refreshGoals: state.refreshGoals,
  searchGoals: state.searchGoals,
}));

// Combined selector for common use cases
export const useGoalsWithActions = () => {
  const goals = useGoals();
  const loading = useGoalsLoading();
  const error = useGoalsError();
  const pagination = useGoalsPagination();
  const actions = useGoalActions();

  return {
    goals,
    loading,
    error,
    pagination,
    ...actions,
  };
};