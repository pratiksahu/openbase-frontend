/**
 * MetricEditor Component Barrel Export
 *
 * This file provides a centralized export point for all MetricEditor components,
 * types, and utilities, making it easy to import them throughout the application.
 */

// Main Components
export { MetricEditor } from './MetricEditor';
export { MetricTypeSelector, MetricTypeGrid, MetricTypeCompact } from './MetricTypeSelector';
export { CheckpointTracker } from './CheckpointTracker';
export { MetricChart } from './MetricChart';

// Types
export type {
  // Core interfaces
  MetricEditorProps,
  MetricTypeSelectorProps,
  CheckpointTrackerProps,
  MetricChartProps,

  // Form data interfaces
  MetricFormData,
  CheckpointFormData,

  // Analysis interfaces
  ProgressAnalysis,
  CheckpointStatistics,
  Evidence,
  ExtendedCheckpoint,

  // Template and configuration interfaces
  MetricTemplate,
  MetricTypeConfig,

  // Validation interfaces
  ValidationErrors,
} from './MetricEditor.types';

export {
  // Enums
  ExtendedMetricType,
  MetricDirection,
  ProgressStatus,
  ChartType,
  ConfidenceLevel,

  // Error classes
  MetricValidationError,
} from './MetricEditor.types';

// Utilities
export {
  // Metric type configurations
  METRIC_TYPE_CONFIGS,

  // Validation functions
  validateMetricForm,
  validateCheckpoint,

  // Progress calculation functions
  calculateProgressPercentage,
  determineProgressStatus,
  calculateVelocity,
  analyzeProgress,

  // Statistical analysis functions
  calculateCheckpointStatistics,

  // Formatting functions
  formatMetricValue,
  parseMetricValue,
  formatCheckpointDate,
  formatConfidenceLevel,
  getStatusColor,

  // Common templates
  COMMON_METRIC_TEMPLATES,
} from './MetricEditor.utils';

// Default export for convenience
export { MetricEditor as default } from './MetricEditor';