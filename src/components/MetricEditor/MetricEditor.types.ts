/**
 * MetricEditor Component Type Definitions
 *
 * This file contains type definitions specific to the MetricEditor component,
 * extending the base types from smart-goals.types.ts for UI-specific needs.
 */

import {
  MeasurableSpec,
  MetricCheckpoint,
  Frequency
} from '@/types/smart-goals.types';

// =============================================================================
// Extended Metric Types for Editor
// =============================================================================

/** Extended metric types supported by the editor */
export enum ExtendedMetricType {
  // Base types from smart-goals.types.ts
  NUMBER = 'number',
  PERCENTAGE = 'percentage',
  CURRENCY = 'currency',
  DURATION = 'duration',
  BOOLEAN = 'boolean',
  RATING = 'rating',

  // Additional types for the editor
  ABSOLUTE = 'absolute',     // Raw numbers without percentage
  RATIO = 'ratio',          // x:y format
  COUNT = 'count',          // Integer only
  RATE = 'rate',            // Value per unit time
}

/** Direction for metric improvement */
export enum MetricDirection {
  INCREASE = 'increase',    // Higher values are better (≥)
  DECREASE = 'decrease',    // Lower values are better (≤)
  MAINTAIN = 'maintain',    // Target specific value (=)
}

/** Progress status indicators */
export enum ProgressStatus {
  ON_TRACK = 'on_track',       // Green - meeting targets
  AT_RISK = 'at_risk',         // Yellow - slightly behind
  OFF_TRACK = 'off_track',     // Red - significantly behind
  COMPLETED = 'completed',     // Blue - target achieved
  NOT_STARTED = 'not_started', // Gray - no progress yet
}

/** Chart display types */
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  AREA = 'area',
}

/** Confidence levels for measurements */
export enum ConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERIFIED = 'verified',
}

// =============================================================================
// Metric Type Configuration
// =============================================================================

/** Configuration for each metric type */
export interface MetricTypeConfig {
  /** Display label */
  label: string;
  /** Icon name (Lucide React) */
  icon: string;
  /** Description for users */
  description: string;
  /** Default unit */
  defaultUnit: string;
  /** Whether decimals are allowed */
  allowDecimals: boolean;
  /** Input validation pattern */
  validationPattern?: RegExp;
  /** Format function for display */
  formatValue: (value: number, unit?: string) => string;
  /** Parse function for input */
  parseValue: (input: string) => number | null;
  /** Sample values for examples */
  examples: string[];
  /** Default direction for this type */
  defaultDirection: MetricDirection;
}

// =============================================================================
// Form Data Interfaces
// =============================================================================

/** Form data for metric configuration */
export interface MetricFormData {
  /** Metric name/title */
  name: string;
  /** Type of metric */
  metricType: ExtendedMetricType;
  /** Baseline/starting value */
  baselineValue?: number;
  /** Target value to achieve */
  targetValue: number;
  /** Current value */
  currentValue: number;
  /** Unit of measurement */
  unit: string;
  /** Direction for improvement */
  direction: MetricDirection;
  /** Minimum acceptable value */
  minimumValue?: number;
  /** Maximum possible value */
  maximumValue?: number;
  /** How often to measure */
  measurementFrequency: Frequency;
  /** Description or notes */
  description?: string;
  /** Data source information */
  dataSource?: string;
  /** Calculation method */
  calculationMethod?: string;
}

/** Form data for adding/editing checkpoints */
export interface CheckpointFormData {
  /** Recorded value */
  value: number;
  /** Date of measurement */
  recordedDate: Date;
  /** Optional note */
  note?: string;
  /** Evidence/source */
  evidence?: string;
  /** Confidence level */
  confidence: ConfidenceLevel;
  /** Whether automatically recorded */
  isAutomatic: boolean;
  /** Data source */
  source?: string;
}

// =============================================================================
// Component Props Interfaces
// =============================================================================

/** Props for MetricEditor main component */
export interface MetricEditorProps {
  /** Optional initial metric data */
  initialMetric?: Partial<MeasurableSpec>;
  /** Optional initial checkpoints */
  initialCheckpoints?: MetricCheckpoint[];
  /** Callback when metric is saved */
  onSave: (metric: MeasurableSpec, checkpoints: MetricCheckpoint[]) => void;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Whether in read-only mode */
  readOnly?: boolean;
  /** Goal ID this metric belongs to */
  goalId?: string;
  /** Custom CSS classes */
  className?: string;
}

/** Props for MetricTypeSelector component */
export interface MetricTypeSelectorProps {
  /** Selected metric type */
  value: ExtendedMetricType;
  /** Callback when type changes */
  onChange: (type: ExtendedMetricType) => void;
  /** Whether disabled */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/** Props for CheckpointTracker component */
export interface CheckpointTrackerProps {
  /** Current checkpoints */
  checkpoints: MetricCheckpoint[];
  /** Metric configuration for validation */
  metric: MeasurableSpec;
  /** Callback when checkpoints change */
  onChange: (checkpoints: MetricCheckpoint[]) => void;
  /** Whether in read-only mode */
  readOnly?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/** Props for MetricChart component */
export interface MetricChartProps {
  /** Checkpoints to display */
  checkpoints: MetricCheckpoint[];
  /** Metric configuration */
  metric: MeasurableSpec;
  /** Chart type to display */
  chartType: ChartType;
  /** Callback when chart type changes */
  onChartTypeChange: (type: ChartType) => void;
  /** Height of the chart */
  height?: number;
  /** Whether to show target line */
  showTarget?: boolean;
  /** Whether to show baseline */
  showBaseline?: boolean;
  /** Custom CSS classes */
  className?: string;
}

// =============================================================================
// Calculation and Analysis Interfaces
// =============================================================================

/** Progress analysis result */
export interface ProgressAnalysis {
  /** Current progress percentage (0-100) */
  progressPercentage: number;
  /** Progress status */
  status: ProgressStatus;
  /** Trend direction */
  trend: 'increasing' | 'decreasing' | 'stable' | 'unknown';
  /** Current velocity (change per time unit) */
  velocity: number;
  /** Estimated completion date */
  estimatedCompletion?: Date;
  /** Time to target in days */
  daysToTarget?: number;
  /** Whether on track to meet target */
  onTrackToTarget: boolean;
  /** Confidence in projection (0-1) */
  projectionConfidence: number;
}

/** Statistical analysis of checkpoint data */
export interface CheckpointStatistics {
  /** Total number of checkpoints */
  count: number;
  /** Average value */
  average: number;
  /** Minimum value */
  minimum: number;
  /** Maximum value */
  maximum: number;
  /** Standard deviation */
  standardDeviation: number;
  /** Linear regression slope */
  trendSlope: number;
  /** R-squared correlation */
  correlation: number;
  /** Moving average values */
  movingAverage: number[];
  /** Outlier detection */
  outliers: MetricCheckpoint[];
}

/** Evidence attachment types */
export interface Evidence {
  /** Evidence ID */
  id: string;
  /** Type of evidence */
  type: 'url' | 'note' | 'file' | 'screenshot';
  /** Evidence content */
  content: string;
  /** Display title */
  title?: string;
  /** When evidence was added */
  addedAt: Date;
  /** Who added it */
  addedBy: string;
}

/** Extended checkpoint with evidence */
export interface ExtendedCheckpoint extends MetricCheckpoint {
  /** Attached evidence */
  evidence?: Evidence[];
}

// =============================================================================
// Template and Preset Interfaces
// =============================================================================

/** Common metric template */
export interface MetricTemplate {
  /** Template ID */
  id: string;
  /** Template name */
  name: string;
  /** Template category */
  category: string;
  /** Template description */
  description: string;
  /** Metric configuration */
  config: Partial<MetricFormData>;
  /** Industry benchmarks */
  benchmarks?: {
    industry: string;
    average: number;
    excellent: number;
    poor: number;
  };
  /** Usage examples */
  examples: string[];
  /** Tags for filtering */
  tags: string[];
}

// =============================================================================
// Validation and Error Types
// =============================================================================

/** Form validation errors */
export interface ValidationErrors {
  /** Field-specific errors */
  [fieldName: string]: string[];
}

/** Custom error types */
export class MetricValidationError extends Error {
  constructor(
    public field: string,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'MetricValidationError';
  }
}

// =============================================================================
// Export everything
// =============================================================================

export type {
  MeasurableSpec,
  MetricCheckpoint,
  MetricType,
  Frequency,
} from '@/types/smart-goals.types';