/**
 * useMetrics Hook - Goal Metrics Management
 *
 * This hook provides functionality for managing goal metrics:
 * - Fetching metric checkpoints
 * - Creating and updating checkpoints
 * - Analytics and trend data
 * - Progress tracking
 * - Data visualization support
 *
 * @fileoverview React hook for goal metrics management
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';

import { metricsApi, MetricAnalytics, MetricTrendData, CreateCheckpointRequest } from '@/lib/api/metrics';
import { MetricCheckpoint } from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface UseMetricsOptions {
  // Fetching options
  autoFetch?: boolean;
  refetchInterval?: number;
  refetchOnMount?: boolean;

  // Callbacks
  onSuccess?: (checkpoints: MetricCheckpoint[]) => void;
  onError?: (error: string) => void;
  onCheckpointAdded?: (checkpoint: MetricCheckpoint) => void;

  // Dependencies for auto-refetch
  dependencies?: any[];
}

export interface UseMetricsResult {
  // Data
  checkpoints: MetricCheckpoint[];
  analytics: MetricAnalytics | null;
  trendData: MetricTrendData[];
  latestValue: number | null;

  // State
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;

  // Actions
  refetch: () => Promise<void>;
  addCheckpoint: (request: CreateCheckpointRequest) => Promise<MetricCheckpoint>;
  updateCheckpoint: (id: string, updates: Partial<CreateCheckpointRequest>) => Promise<MetricCheckpoint>;
  deleteCheckpoint: (id: string) => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  refreshTrendData: (days?: number) => Promise<void>;

  // Utilities
  hasCheckpoints: boolean;
  isEmpty: boolean;
  getCheckpointById: (id: string) => MetricCheckpoint | undefined;
  getLatestCheckpoint: () => MetricCheckpoint | null;
  getCheckpointsByDateRange: (start: Date, end: Date) => MetricCheckpoint[];
}

// =============================================================================
// Main Hook Implementation
// =============================================================================

export function useMetrics(goalId: string | null, options: UseMetricsOptions = {}): UseMetricsResult {
  const {
    autoFetch = true,
    refetchInterval,
    refetchOnMount = true,
    onSuccess,
    onError,
    onCheckpointAdded,
    dependencies = [],
  } = options;

  // State
  const [checkpoints, setCheckpoints] = useState<MetricCheckpoint[]>([]);
  const [analytics, setAnalytics] = useState<MetricAnalytics | null>(null);
  const [trendData, setTrendData] = useState<MetricTrendData[]>([]);
  const [latestValue, setLatestValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

      const [checkpointsData, analyticsData, trendDataResult, latestValueData] = await Promise.all([
        metricsApi.getCheckpoints(goalId),
        metricsApi.getMetricAnalytics(goalId).catch(() => null), // Analytics might fail if no checkpoints
        metricsApi.getTrendData(goalId).catch(() => []),
        metricsApi.getLatestValue(goalId).catch(() => null),
      ]);

      setCheckpoints(checkpointsData);
      setAnalytics(analyticsData);
      setTrendData(trendDataResult);
      setLatestValue(latestValueData);

      onSuccess?.(checkpointsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [goalId, onSuccess, onError]);

  const addCheckpoint = useCallback(async (request: CreateCheckpointRequest): Promise<MetricCheckpoint> => {
    try {
      setIsCreating(true);
      setError(null);

      const newCheckpoint = await metricsApi.createCheckpoint(request);

      // Update local state
      setCheckpoints(prev => [newCheckpoint, ...prev]);
      setLatestValue(newCheckpoint.value);

      // Refresh analytics after adding checkpoint
      if (goalId) {
        try {
          const newAnalytics = await metricsApi.getMetricAnalytics(goalId);
          setAnalytics(newAnalytics);

          const newTrendData = await metricsApi.getTrendData(goalId);
          setTrendData(newTrendData);
        } catch {
          // Analytics refresh failed, but checkpoint was created successfully
        }
      }

      onCheckpointAdded?.(newCheckpoint);
      return newCheckpoint;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkpoint';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [goalId, onCheckpointAdded, onError]);

  const updateCheckpoint = useCallback(async (id: string, updates: Partial<CreateCheckpointRequest>): Promise<MetricCheckpoint> => {
    try {
      setIsUpdating(true);
      setError(null);

      const updatedCheckpoint = await metricsApi.updateCheckpoint(id, updates);

      // Update local state
      setCheckpoints(prev =>
        prev.map(checkpoint =>
          checkpoint.id === id ? updatedCheckpoint : checkpoint
        )
      );

      // Update latest value if this was the latest checkpoint
      const latestCheckpoint = checkpoints.find(c => c.id === id);
      if (latestCheckpoint && latestCheckpoint.recordedDate >= new Date(Date.now() - 1000 * 60 * 60 * 24)) {
        setLatestValue(updatedCheckpoint.value);
      }

      // Refresh analytics
      if (goalId) {
        try {
          const newAnalytics = await metricsApi.getMetricAnalytics(goalId);
          setAnalytics(newAnalytics);
        } catch {
          // Analytics refresh failed
        }
      }

      return updatedCheckpoint;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update checkpoint';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [goalId, checkpoints, onError]);

  const deleteCheckpoint = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);

      await metricsApi.deleteCheckpoint(id);

      // Update local state
      setCheckpoints(prev => prev.filter(checkpoint => checkpoint.id !== id));

      // Refresh analytics and latest value
      if (goalId) {
        try {
          const [newAnalytics, newLatestValue] = await Promise.all([
            metricsApi.getMetricAnalytics(goalId).catch(() => null),
            metricsApi.getLatestValue(goalId).catch(() => null),
          ]);

          setAnalytics(newAnalytics);
          setLatestValue(newLatestValue);
        } catch {
          // Refresh failed
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete checkpoint';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    }
  }, [goalId, onError]);

  const refreshAnalytics = useCallback(async () => {
    if (!goalId) return;

    try {
      const newAnalytics = await metricsApi.getMetricAnalytics(goalId);
      setAnalytics(newAnalytics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh analytics';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [goalId, onError]);

  const refreshTrendData = useCallback(async (days?: number) => {
    if (!goalId) return;

    try {
      const newTrendData = await metricsApi.getTrendData(goalId, days);
      setTrendData(newTrendData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh trend data';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [goalId, onError]);

  // =============================================================================
  // Utility Functions
  // =============================================================================

  const hasCheckpoints = checkpoints.length > 0;
  const isEmpty = !loading && checkpoints.length === 0;

  const getCheckpointById = useCallback((id: string): MetricCheckpoint | undefined => {
    return checkpoints.find(checkpoint => checkpoint.id === id);
  }, [checkpoints]);

  const getLatestCheckpoint = useCallback((): MetricCheckpoint | null => {
    if (checkpoints.length === 0) return null;

    return checkpoints.reduce((latest, current) =>
      current.recordedDate > latest.recordedDate ? current : latest
    );
  }, [checkpoints]);

  const getCheckpointsByDateRange = useCallback((start: Date, end: Date): MetricCheckpoint[] => {
    return checkpoints.filter(checkpoint =>
      checkpoint.recordedDate >= start && checkpoint.recordedDate <= end
    );
  }, [checkpoints]);

  // =============================================================================
  // Effects
  // =============================================================================

  // Fetch metrics when goal ID changes
  useEffect(() => {
    if (goalId && goalId !== lastGoalIdRef.current) {
      if (refetchOnMount && autoFetch) {
        refetch();
      }
      lastGoalIdRef.current = goalId;
    }

    // Clear data when goal ID becomes null
    if (!goalId && lastGoalIdRef.current) {
      setCheckpoints([]);
      setAnalytics(null);
      setTrendData([]);
      setLatestValue(null);
      lastGoalIdRef.current = null;
    }
  }, [goalId, refetchOnMount, autoFetch, refetch]);

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
    checkpoints,
    analytics,
    trendData,
    latestValue,

    // State
    loading,
    error,
    isCreating,
    isUpdating,

    // Actions
    refetch,
    addCheckpoint,
    updateCheckpoint,
    deleteCheckpoint,
    refreshAnalytics,
    refreshTrendData,

    // Utilities
    hasCheckpoints,
    isEmpty,
    getCheckpointById,
    getLatestCheckpoint,
    getCheckpointsByDateRange,
  };
}

// =============================================================================
// Specialized Hook Variants
// =============================================================================

/**
 * Hook for metrics analytics only
 */
export function useMetricsAnalytics(goalId: string | null) {
  const [analytics, setAnalytics] = useState<MetricAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!goalId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await metricsApi.getMetricAnalytics(goalId);
      setAnalytics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}

/**
 * Hook for trend data visualization
 */
export function useMetricsTrend(goalId: string | null, days?: number) {
  const [trendData, setTrendData] = useState<MetricTrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendData = useCallback(async () => {
    if (!goalId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await metricsApi.getTrendData(goalId, days);
      setTrendData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trend data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [goalId, days]);

  useEffect(() => {
    fetchTrendData();
  }, [fetchTrendData]);

  return {
    trendData,
    loading,
    error,
    refetch: fetchTrendData,
  };
}

/**
 * Hook for simple checkpoint creation
 */
export function useCreateCheckpoint(goalId: string | null) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckpoint = useCallback(async (value: number, note?: string): Promise<MetricCheckpoint> => {
    if (!goalId) throw new Error('No goal ID provided');

    try {
      setIsCreating(true);
      setError(null);

      const checkpoint = await metricsApi.createCheckpoint({
        goalId,
        value,
        note,
        recordedDate: new Date(),
        isAutomatic: false,
      });

      return checkpoint;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkpoint';
      setError(errorMessage);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [goalId]);

  return {
    createCheckpoint,
    isCreating,
    error,
  };
}

export default useMetrics;