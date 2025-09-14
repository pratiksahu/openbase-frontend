/**
 * useTasks Hook - Goal Tasks Management
 *
 * This hook provides functionality for managing goal tasks:
 * - Fetching tasks and subtasks
 * - CRUD operations for tasks and subtasks
 * - Status and progress management
 * - Filtering and sorting
 * - Bulk operations
 *
 * @fileoverview React hook for goal tasks management
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  tasksApi,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateSubtaskRequest,
  UpdateSubtaskRequest,
  TaskFilters,
  TaskStats
} from '@/lib/api/tasks';
import { Task, Subtask, TaskStatus, GoalPriority } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface UseTasksOptions {
  // Fetching options
  autoFetch?: boolean;
  refetchInterval?: number;
  refetchOnMount?: boolean;

  // Filtering
  initialFilters?: TaskFilters;

  // Callbacks
  onSuccess?: (tasks: Task[]) => void;
  onError?: (error: string) => void;
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  onTaskDeleted?: (taskId: string) => void;

  // Dependencies for auto-refetch
  dependencies?: any[];
}

export interface UseTasksResult {
  // Data
  tasks: Task[];
  stats: TaskStats | null;

  // State
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Filters
  filters: TaskFilters;

  // Actions
  refetch: () => Promise<void>;
  createTask: (request: CreateTaskRequest) => Promise<Task>;
  updateTask: (id: string, updates: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (id: string, permanent?: boolean) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>;
  updateTaskProgress: (id: string, progress: number) => Promise<Task>;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;

  // Bulk operations
  bulkUpdateStatus: (ids: string[], status: TaskStatus) => Promise<Task[]>;
  bulkDelete: (ids: string[], permanent?: boolean) => Promise<void>;

  // Utilities
  hasTasks: boolean;
  isEmpty: boolean;
  getTaskById: (id: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getOverdueTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getTotalEstimatedHours: () => number;
  getTotalActualHours: () => number;
  getCompletionRate: () => number;
}

export interface UseSubtasksOptions {
  autoFetch?: boolean;
  onSubtaskCreated?: (subtask: Subtask) => void;
  onSubtaskUpdated?: (subtask: Subtask) => void;
  onSubtaskDeleted?: (subtaskId: string) => void;
}

export interface UseSubtasksResult {
  // Data
  subtasks: Subtask[];

  // State
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;

  // Actions
  refetch: () => Promise<void>;
  createSubtask: (request: CreateSubtaskRequest) => Promise<Subtask>;
  updateSubtask: (id: string, updates: UpdateSubtaskRequest) => Promise<Subtask>;
  deleteSubtask: (id: string, permanent?: boolean) => Promise<void>;

  // Utilities
  hasSubtasks: boolean;
  getSubtaskById: (id: string) => Subtask | undefined;
}

// =============================================================================
// Main Hook Implementation
// =============================================================================

export function useTasks(goalId: string | null, options: UseTasksOptions = {}): UseTasksResult {
  const {
    autoFetch = true,
    refetchInterval,
    refetchOnMount = true,
    initialFilters = {},
    onSuccess,
    onError,
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    dependencies = [],
  } = options;

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFiltersState] = useState<TaskFilters>(initialFilters);

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
      setLoading(true);
      setError(null);

      const [tasksData, statsData] = await Promise.all([
        tasksApi.getTasks(goalId, filters),
        tasksApi.getTaskStats(goalId).catch(() => null), // Stats might fail
      ]);

      setTasks(tasksData);
      setStats(statsData);

      onSuccess?.(tasksData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [goalId, filters, onSuccess, onError]);

  const createTask = useCallback(async (request: CreateTaskRequest): Promise<Task> => {
    try {
      setIsCreating(true);
      setError(null);

      const newTask = await tasksApi.createTask(request);

      // Update local state
      setTasks(prev => [newTask, ...prev]);

      // Refresh stats
      if (goalId) {
        try {
          const newStats = await tasksApi.getTaskStats(goalId);
          setStats(newStats);
        } catch {
          // Stats refresh failed
        }
      }

      onTaskCreated?.(newTask);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [goalId, onTaskCreated, onError]);

  const updateTask = useCallback(async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
    try {
      setIsUpdating(true);
      setError(null);

      const updatedTask = await tasksApi.updateTask(id, updates);

      // Update local state
      setTasks(prev =>
        prev.map(task => (task.id === id ? updatedTask : task))
      );

      // Refresh stats if status or progress changed
      if (goalId && (updates.status || updates.progress !== undefined)) {
        try {
          const newStats = await tasksApi.getTaskStats(goalId);
          setStats(newStats);
        } catch {
          // Stats refresh failed
        }
      }

      onTaskUpdated?.(updatedTask);
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [goalId, onTaskUpdated, onError]);

  const deleteTask = useCallback(async (id: string, permanent: boolean = false): Promise<void> => {
    try {
      setIsDeleting(true);
      setError(null);

      await tasksApi.deleteTask(id, permanent);

      // Update local state
      setTasks(prev => prev.filter(task => task.id !== id));

      // Refresh stats
      if (goalId) {
        try {
          const newStats = await tasksApi.getTaskStats(goalId);
          setStats(newStats);
        } catch {
          // Stats refresh failed
        }
      }

      onTaskDeleted?.(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [goalId, onTaskDeleted, onError]);

  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus): Promise<Task> => {
    return updateTask(id, { status });
  }, [updateTask]);

  const updateTaskProgress = useCallback(async (id: string, progress: number): Promise<Task> => {
    return updateTask(id, { progress });
  }, [updateTask]);

  const setFilters = useCallback((newFilters: TaskFilters) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  // Bulk operations
  const bulkUpdateStatus = useCallback(async (ids: string[], status: TaskStatus): Promise<Task[]> => {
    try {
      setIsUpdating(true);
      setError(null);

      const updatedTasks = await tasksApi.bulkUpdateTaskStatus(ids, status);

      // Update local state
      setTasks(prev =>
        prev.map(task => {
          const updated = updatedTasks.find(ut => ut.id === task.id);
          return updated || task;
        })
      );

      // Refresh stats
      if (goalId) {
        try {
          const newStats = await tasksApi.getTaskStats(goalId);
          setStats(newStats);
        } catch {
          // Stats refresh failed
        }
      }

      return updatedTasks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk update tasks';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [goalId, onError]);

  const bulkDelete = useCallback(async (ids: string[], permanent: boolean = false): Promise<void> => {
    try {
      setIsDeleting(true);
      setError(null);

      await tasksApi.bulkDeleteTasks(ids, permanent);

      // Update local state
      setTasks(prev => prev.filter(task => !ids.includes(task.id)));

      // Refresh stats
      if (goalId) {
        try {
          const newStats = await tasksApi.getTaskStats(goalId);
          setStats(newStats);
        } catch {
          // Stats refresh failed
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk delete tasks';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [goalId, onError]);

  // =============================================================================
  // Utility Functions
  // =============================================================================

  const hasTasks = tasks.length > 0;
  const isEmpty = !loading && tasks.length === 0;

  const getTaskById = useCallback((id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  }, [tasks]);

  const getTasksByStatus = useCallback((status: TaskStatus): Task[] => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getOverdueTasks = useCallback((): Task[] => {
    const now = new Date();
    return tasks.filter(task =>
      task.dueDate &&
      task.dueDate < now &&
      task.status !== TaskStatus.COMPLETED
    );
  }, [tasks]);

  const getCompletedTasks = useCallback((): Task[] => {
    return tasks.filter(task => task.status === TaskStatus.COMPLETED);
  }, [tasks]);

  const getTotalEstimatedHours = useCallback((): number => {
    return tasks.reduce((total, task) => total + (task.estimatedHours || 0), 0);
  }, [tasks]);

  const getTotalActualHours = useCallback((): number => {
    return tasks.reduce((total, task) => total + (task.actualHours || 0), 0);
  }, [tasks]);

  const getCompletionRate = useCallback((): number => {
    if (tasks.length === 0) return 0;
    const completedCount = getCompletedTasks().length;
    return (completedCount / tasks.length) * 100;
  }, [tasks, getCompletedTasks]);

  // =============================================================================
  // Effects
  // =============================================================================

  // Fetch tasks when goal ID or filters change
  useEffect(() => {
    if (goalId && (goalId !== lastGoalIdRef.current || refetchOnMount)) {
      if (autoFetch) {
        refetch();
      }
      lastGoalIdRef.current = goalId;
    }

    // Clear data when goal ID becomes null
    if (!goalId && lastGoalIdRef.current) {
      setTasks([]);
      setStats(null);
      lastGoalIdRef.current = null;
    }
  }, [goalId, refetchOnMount, autoFetch, refetch]);

  // Refetch when filters change
  useEffect(() => {
    if (goalId && autoFetch) {
      refetch();
    }
  }, [filters, goalId, autoFetch, refetch]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (!goalId) return;

    const depsChanged = dependencies.some((dep, index) =>
      dep !== lastDependenciesRef.current[index]
    );

    if (depsChanged && autoFetch) {
      refetch();
      lastDependenciesRef.current = dependencies;
    }
  }, [goalId, dependencies, autoFetch, refetch]);

  // Setup refetch interval
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0 && autoFetch && goalId) {
      refetchIntervalRef.current = setInterval(() => {
        if (!loading) {
          refetch();
        }
      }, refetchInterval);

      return () => {
        if (refetchIntervalRef.current) {
          clearInterval(refetchIntervalRef.current);
          refetchIntervalRef.current = null;
        }
      };
    }
  }, [refetchInterval, autoFetch, goalId, loading, refetch]);

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
    tasks,
    stats,

    // State
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,

    // Filters
    filters,

    // Actions
    refetch,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskProgress,
    setFilters,
    clearFilters,

    // Bulk operations
    bulkUpdateStatus,
    bulkDelete,

    // Utilities
    hasTasks,
    isEmpty,
    getTaskById,
    getTasksByStatus,
    getOverdueTasks,
    getCompletedTasks,
    getTotalEstimatedHours,
    getTotalActualHours,
    getCompletionRate,
  };
}

// =============================================================================
// Subtasks Hook
// =============================================================================

export function useSubtasks(taskId: string | null, options: UseSubtasksOptions = {}): UseSubtasksResult {
  const {
    autoFetch = true,
    onSubtaskCreated,
    onSubtaskUpdated,
    onSubtaskDeleted,
  } = options;

  // State
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // =============================================================================
  // Actions
  // =============================================================================

  const refetch = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);

      const subtasksData = await tasksApi.getSubtasks(taskId);
      setSubtasks(subtasksData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subtasks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  const createSubtask = useCallback(async (request: CreateSubtaskRequest): Promise<Subtask> => {
    try {
      setIsCreating(true);
      setError(null);

      const newSubtask = await tasksApi.createSubtask(request);

      // Update local state
      setSubtasks(prev => [newSubtask, ...prev]);

      onSubtaskCreated?.(newSubtask);
      return newSubtask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subtask';
      setError(errorMessage);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [onSubtaskCreated]);

  const updateSubtask = useCallback(async (id: string, updates: UpdateSubtaskRequest): Promise<Subtask> => {
    try {
      setIsUpdating(true);
      setError(null);

      const updatedSubtask = await tasksApi.updateSubtask(id, updates);

      // Update local state
      setSubtasks(prev =>
        prev.map(subtask => (subtask.id === id ? updatedSubtask : subtask))
      );

      onSubtaskUpdated?.(updatedSubtask);
      return updatedSubtask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subtask';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [onSubtaskUpdated]);

  const deleteSubtask = useCallback(async (id: string, permanent: boolean = false): Promise<void> => {
    try {
      setError(null);

      await tasksApi.deleteSubtask(id, permanent);

      // Update local state
      setSubtasks(prev => prev.filter(subtask => subtask.id !== id));

      onSubtaskDeleted?.(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete subtask';
      setError(errorMessage);
      throw err;
    }
  }, [onSubtaskDeleted]);

  // =============================================================================
  // Utility Functions
  // =============================================================================

  const hasSubtasks = subtasks.length > 0;

  const getSubtaskById = useCallback((id: string): Subtask | undefined => {
    return subtasks.find(subtask => subtask.id === id);
  }, [subtasks]);

  // =============================================================================
  // Effects
  // =============================================================================

  // Fetch subtasks when task ID changes
  useEffect(() => {
    if (taskId && autoFetch) {
      refetch();
    } else if (!taskId) {
      setSubtasks([]);
    }
  }, [taskId, autoFetch, refetch]);

  // =============================================================================
  // Return Hook Result
  // =============================================================================

  return {
    // Data
    subtasks,

    // State
    loading,
    error,
    isCreating,
    isUpdating,

    // Actions
    refetch,
    createSubtask,
    updateSubtask,
    deleteSubtask,

    // Utilities
    hasSubtasks,
    getSubtaskById,
  };
}

// =============================================================================
// Specialized Hook Variants
// =============================================================================

/**
 * Hook for overdue tasks only
 */
export function useOverdueTasks(goalId: string | null) {
  const result = useTasks(goalId, {
    initialFilters: { overdue: true },
  });

  return {
    ...result,
    tasks: result.getOverdueTasks(),
  };
}

/**
 * Hook for completed tasks
 */
export function useCompletedTasks(goalId: string | null) {
  const result = useTasks(goalId, {
    initialFilters: { completed: true },
  });

  return {
    ...result,
    tasks: result.getCompletedTasks(),
  };
}

/**
 * Hook for task statistics only
 */
export function useTaskStats(goalId: string | null) {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!goalId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await tasksApi.getTaskStats(goalId);
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch task stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export default useTasks;