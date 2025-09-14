export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeScreen,
  usePrefersReducedMotion,
  usePrefersDarkMode,
} from './useMediaQuery';
export {
  useDebounce,
  useDebouncedCallback,
  useDebouncedSearch,
} from './useDebounce';
export { useLocalStorage, useSyncedLocalStorage } from './useLocalStorage';
export { useTheme, ThemeProvider, useSimpleTheme } from './useTheme';
export { useClickOutside } from './useClickOutside';
export { useToggle } from './useToggle';
export { useCopyToClipboard } from './useCopyToClipboard';

// SMART Goals hooks
export { default as useGoals, useGoalsByStatus, useGoalsByPriority, useGoalsByCategory, useMyGoals, useGoalSearch, useDashboardGoals, useOverdueGoals } from './useGoals';
export { default as useGoal, useGoalMutations, useOptimisticGoal } from './useGoal';
export { default as useMetrics, useMetricsAnalytics, useMetricsTrend, useCreateCheckpoint } from './useMetrics';
export { default as useTasks, useSubtasks, useOverdueTasks, useCompletedTasks, useTaskStats } from './useTasks';

// Re-export types
export type {
  UseGoalsOptions,
  UseGoalsResult,
} from './useGoals';
export type { UseGoalOptions, UseGoalResult } from './useGoal';
export type { UseMetricsOptions, UseMetricsResult } from './useMetrics';
export type { UseTasksOptions, UseTasksResult, UseSubtasksOptions, UseSubtasksResult } from './useTasks';
