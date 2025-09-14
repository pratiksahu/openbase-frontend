/**
 * MetricEditor Utility Functions
 *
 * This file contains utility functions for calculations, validations,
 * and data transformations used throughout the MetricEditor component.
 */

import { format, differenceInDays, addDays } from 'date-fns';

import { MeasurableSpec, MetricCheckpoint } from '@/types/smart-goals.types';

import {
  ExtendedMetricType,
  MetricDirection,
  ProgressStatus,
  MetricTypeConfig,
  ProgressAnalysis,
  CheckpointStatistics,
  ConfidenceLevel,
  MetricFormData,
  ValidationErrors,
  MetricTemplate,
} from './MetricEditor.types';

// Export MetricDirection for other components
export { MetricDirection } from './MetricEditor.types';

// =============================================================================
// Metric Type Configurations
// =============================================================================

/** Configuration for all metric types */
export const METRIC_TYPE_CONFIGS: Record<ExtendedMetricType, MetricTypeConfig> = {
  [ExtendedMetricType.NUMBER]: {
    label: 'Number',
    icon: 'Hash',
    description: 'Raw numeric value',
    defaultUnit: '',
    allowDecimals: true,
    formatValue: (value, unit = '') => `${value.toLocaleString()}${unit ? ' ' + unit : ''}`,
    parseValue: (input) => {
      const parsed = parseFloat(input);
      return isNaN(parsed) ? null : parsed;
    },
    examples: ['1000', '42.5', '250000'],
    defaultDirection: MetricDirection.INCREASE,
  },
  [ExtendedMetricType.PERCENTAGE]: {
    label: 'Percentage',
    icon: 'Percent',
    description: 'Percentage value (0-100)',
    defaultUnit: '%',
    allowDecimals: true,
    validationPattern: /^(\d{1,2}(\.\d+)?|100(\.0+)?)$/,
    formatValue: (value, unit = '%') => `${value.toFixed(1)}${unit}`,
    parseValue: (input) => {
      const parsed = parseFloat(input.replace('%', ''));
      return isNaN(parsed) || parsed < 0 || parsed > 100 ? null : parsed;
    },
    examples: ['85%', '92.5%', '100%'],
    defaultDirection: MetricDirection.INCREASE,
  },
  [ExtendedMetricType.CURRENCY]: {
    label: 'Currency',
    icon: 'DollarSign',
    description: 'Monetary value',
    defaultUnit: '$',
    allowDecimals: true,
    formatValue: (value, unit = '$') => `${unit}${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    parseValue: (input) => {
      const cleaned = input.replace(/[$,]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? null : parsed;
    },
    examples: ['$10,000', '$1,500.50', '$250,000'],
    defaultDirection: MetricDirection.INCREASE,
  },
  [ExtendedMetricType.DURATION]: {
    label: 'Duration',
    icon: 'Clock',
    description: 'Time-based measurement',
    defaultUnit: 'hours',
    allowDecimals: true,
    formatValue: (value, unit = 'hours') => {
      if (unit === 'seconds' && value >= 60) {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        return `${minutes}m ${seconds}s`;
      }
      if (unit === 'minutes' && value >= 60) {
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        return `${hours}h ${minutes}m`;
      }
      return `${value} ${unit}`;
    },
    parseValue: (input) => {
      const parsed = parseFloat(input);
      return isNaN(parsed) ? null : parsed;
    },
    examples: ['2.5 hours', '45 minutes', '120 seconds'],
    defaultDirection: MetricDirection.DECREASE,
  },
  [ExtendedMetricType.BOOLEAN]: {
    label: 'Yes/No',
    icon: 'CheckSquare',
    description: 'Binary true/false value',
    defaultUnit: '',
    allowDecimals: false,
    formatValue: (value) => value ? 'Yes' : 'No',
    parseValue: (input) => {
      const lower = input.toLowerCase();
      if (['yes', 'true', '1', 'on'].includes(lower)) return 1;
      if (['no', 'false', '0', 'off'].includes(lower)) return 0;
      return null;
    },
    examples: ['Yes', 'No', 'True', 'False'],
    defaultDirection: MetricDirection.MAINTAIN,
  },
  [ExtendedMetricType.RATING]: {
    label: 'Rating',
    icon: 'Star',
    description: 'Rating scale (1-10)',
    defaultUnit: '/10',
    allowDecimals: true,
    validationPattern: /^([1-9](\.\d+)?|10(\.0+)?)$/,
    formatValue: (value, unit = '/10') => `${value.toFixed(1)}${unit}`,
    parseValue: (input) => {
      const parsed = parseFloat(input.replace('/10', ''));
      return isNaN(parsed) || parsed < 1 || parsed > 10 ? null : parsed;
    },
    examples: ['8.5/10', '7/10', '9.2/10'],
    defaultDirection: MetricDirection.INCREASE,
  },
  [ExtendedMetricType.ABSOLUTE]: {
    label: 'Absolute',
    icon: 'Target',
    description: 'Raw number without scaling',
    defaultUnit: 'units',
    allowDecimals: true,
    formatValue: (value, unit = 'units') => `${value.toLocaleString()} ${unit}`,
    parseValue: (input) => {
      const parsed = parseFloat(input);
      return isNaN(parsed) ? null : parsed;
    },
    examples: ['1500 units', '42.7 items', '999 records'],
    defaultDirection: MetricDirection.INCREASE,
  },
  [ExtendedMetricType.RATIO]: {
    label: 'Ratio',
    icon: 'Divide',
    description: 'Ratio format (x:y)',
    defaultUnit: ':1',
    allowDecimals: true,
    validationPattern: /^\d+(\.\d+)?:\d+(\.\d+)?$/,
    formatValue: (value, unit) => {
      if (unit && unit.includes(':')) {
        return `${value}${unit}`;
      }
      return `${value}:1`;
    },
    parseValue: (input) => {
      if (input.includes(':')) {
        const [numerator, denominator] = input.split(':');
        const num = parseFloat(numerator);
        const den = parseFloat(denominator);
        return isNaN(num) || isNaN(den) || den === 0 ? null : num / den;
      }
      const parsed = parseFloat(input);
      return isNaN(parsed) ? null : parsed;
    },
    examples: ['3:1', '1.5:1', '10:3'],
    defaultDirection: MetricDirection.INCREASE,
  },
  [ExtendedMetricType.COUNT]: {
    label: 'Count',
    icon: 'Plus',
    description: 'Integer count only',
    defaultUnit: 'items',
    allowDecimals: false,
    validationPattern: /^\d+$/,
    formatValue: (value, unit = 'items') => `${Math.round(value)} ${unit}`,
    parseValue: (input) => {
      const parsed = parseInt(input, 10);
      return isNaN(parsed) ? null : parsed;
    },
    examples: ['25 users', '150 orders', '7 tasks'],
    defaultDirection: MetricDirection.INCREASE,
  },
  [ExtendedMetricType.RATE]: {
    label: 'Rate',
    icon: 'TrendingUp',
    description: 'Value per unit of time',
    defaultUnit: 'per day',
    allowDecimals: true,
    formatValue: (value, unit = 'per day') => `${value.toFixed(2)} ${unit}`,
    parseValue: (input) => {
      const parsed = parseFloat(input.replace(/per\s+\w+/, '').trim());
      return isNaN(parsed) ? null : parsed;
    },
    examples: ['5.2 per day', '150 per hour', '1000 per month'],
    defaultDirection: MetricDirection.INCREASE,
  },
};

// =============================================================================
// Validation Functions
// =============================================================================

/**
 * Validate metric form data
 */
function validateMetricForm(data: Partial<MetricFormData>): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name?.trim()) {
    errors.name = ['Metric name is required'];
  } else if (data.name.length < 3) {
    errors.name = ['Metric name must be at least 3 characters'];
  } else if (data.name.length > 100) {
    errors.name = ['Metric name must be less than 100 characters'];
  }

  // Type validation
  if (!data.metricType) {
    errors.metricType = ['Metric type is required'];
  }

  // Target value validation
  if (data.targetValue === undefined || data.targetValue === null) {
    errors.targetValue = ['Target value is required'];
  } else if (isNaN(data.targetValue)) {
    errors.targetValue = ['Target value must be a valid number'];
  }

  // Type-specific validation
  if (data.metricType && data.targetValue !== undefined) {
    const config = METRIC_TYPE_CONFIGS[data.metricType];
    if (config.validationPattern && data.targetValue !== undefined) {
      const stringValue = data.targetValue.toString();
      if (!config.validationPattern.test(stringValue)) {
        errors.targetValue = [`Invalid ${config.label.toLowerCase()} format`];
      }
    }
  }

  // Current value validation
  if (data.currentValue !== undefined && isNaN(data.currentValue)) {
    errors.currentValue = ['Current value must be a valid number'];
  }

  // Baseline value validation
  if (data.baselineValue !== undefined && isNaN(data.baselineValue)) {
    errors.baselineValue = ['Baseline value must be a valid number'];
  }

  // Unit validation
  if (!data.unit?.trim()) {
    errors.unit = ['Unit is required'];
  }

  return errors;
}

/**
 * Validate checkpoint data
 */
function validateCheckpoint(
  checkpoint: Partial<MetricCheckpoint>,
  metric: MeasurableSpec
): string[] {
  const errors: string[] = [];

  if (checkpoint.value === undefined || checkpoint.value === null) {
    errors.push('Value is required');
  } else if (isNaN(checkpoint.value)) {
    errors.push('Value must be a valid number');
  }

  if (!checkpoint.recordedDate) {
    errors.push('Date is required');
  } else if (checkpoint.recordedDate > new Date()) {
    errors.push('Date cannot be in the future');
  }

  return errors;
}

// =============================================================================
// Progress Calculation Functions
// =============================================================================

/**
 * Calculate progress percentage based on baseline, current, and target values
 */
function calculateProgressPercentage(
  baseline: number,
  current: number,
  target: number,
  direction: MetricDirection
): number {
  if (direction === MetricDirection.MAINTAIN) {
    // For maintain targets, calculate how close we are (inverted)
    const distance = Math.abs(current - target);
    const maxDistance = Math.abs(target - baseline) || 1;
    return Math.max(0, Math.min(100, (1 - distance / maxDistance) * 100));
  }

  if (direction === MetricDirection.INCREASE) {
    if (target <= baseline) return current >= target ? 100 : 0;
    const progress = ((current - baseline) / (target - baseline)) * 100;
    return Math.max(0, Math.min(100, progress));
  }

  if (direction === MetricDirection.DECREASE) {
    if (target >= baseline) return current <= target ? 100 : 0;
    const progress = ((baseline - current) / (baseline - target)) * 100;
    return Math.max(0, Math.min(100, progress));
  }

  return 0;
}

/**
 * Determine progress status based on percentage and velocity
 */
function determineProgressStatus(
  progressPercentage: number,
  velocity: number,
  daysToTarget?: number
): ProgressStatus {
  if (progressPercentage >= 100) {
    return ProgressStatus.COMPLETED;
  }

  if (progressPercentage === 0) {
    return ProgressStatus.NOT_STARTED;
  }

  if (!daysToTarget || daysToTarget <= 0) {
    return progressPercentage >= 80 ? ProgressStatus.ON_TRACK : ProgressStatus.OFF_TRACK;
  }

  // Calculate required daily progress
  const remainingProgress = 100 - progressPercentage;
  const requiredDailyProgress = remainingProgress / daysToTarget;
  const currentDailyProgress = velocity;

  if (currentDailyProgress >= requiredDailyProgress * 0.8) {
    return ProgressStatus.ON_TRACK;
  } else if (currentDailyProgress >= requiredDailyProgress * 0.5) {
    return ProgressStatus.AT_RISK;
  } else {
    return ProgressStatus.OFF_TRACK;
  }
}

/**
 * Calculate velocity (progress per day) from checkpoints
 */
function calculateVelocity(checkpoints: MetricCheckpoint[]): number {
  if (checkpoints.length < 2) return 0;

  const sortedCheckpoints = [...checkpoints].sort(
    (a, b) => a.recordedDate.getTime() - b.recordedDate.getTime()
  );

  const recent = sortedCheckpoints.slice(-5); // Use last 5 points for velocity
  if (recent.length < 2) return 0;

  const firstPoint = recent[0];
  const lastPoint = recent[recent.length - 1];
  const daysDifference = differenceInDays(lastPoint.recordedDate, firstPoint.recordedDate);

  if (daysDifference === 0) return 0;

  const valueDifference = lastPoint.value - firstPoint.value;
  return valueDifference / daysDifference;
}

/**
 * Perform comprehensive progress analysis
 */
function analyzeProgress(
  metric: MeasurableSpec,
  checkpoints: MetricCheckpoint[],
  targetDate?: Date
): ProgressAnalysis {
  const baseline = metric.minimumValue || 0;
  const current = metric.currentValue;
  const target = metric.targetValue;
  const direction = metric.higherIsBetter ? MetricDirection.INCREASE : MetricDirection.DECREASE;

  const progressPercentage = calculateProgressPercentage(baseline, current, target, direction);
  const velocity = calculateVelocity(checkpoints);
  const daysToTarget = targetDate ? differenceInDays(targetDate, new Date()) : undefined;
  const status = determineProgressStatus(progressPercentage, velocity, daysToTarget);

  // Estimate completion date
  let estimatedCompletion: Date | undefined;
  if (velocity > 0 && progressPercentage < 100) {
    const remainingProgress = target - current;
    const daysNeeded = Math.ceil(remainingProgress / velocity);
    estimatedCompletion = addDays(new Date(), daysNeeded);
  }

  // Calculate trend
  const recentCheckpoints = checkpoints.slice(-3);
  let trend: 'increasing' | 'decreasing' | 'stable' | 'unknown' = 'unknown';
  if (recentCheckpoints.length >= 2) {
    const first = recentCheckpoints[0].value;
    const last = recentCheckpoints[recentCheckpoints.length - 1].value;
    const change = last - first;
    if (Math.abs(change) < target * 0.01) { // Less than 1% change
      trend = 'stable';
    } else if (change > 0) {
      trend = 'increasing';
    } else {
      trend = 'decreasing';
    }
  }

  // Calculate projection confidence based on data consistency
  const projectionConfidence = calculateProjectionConfidence(checkpoints);

  return {
    progressPercentage,
    status,
    trend,
    velocity,
    estimatedCompletion,
    daysToTarget,
    onTrackToTarget: status === ProgressStatus.ON_TRACK || status === ProgressStatus.COMPLETED,
    projectionConfidence,
  };
}

/**
 * Calculate confidence in projections based on data consistency
 */
function calculateProjectionConfidence(checkpoints: MetricCheckpoint[]): number {
  if (checkpoints.length < 3) return 0.3; // Low confidence with limited data

  const values = checkpoints.map(cp => cp.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = standardDeviation / mean;

  // Lower variation = higher confidence
  return Math.max(0.1, Math.min(1.0, 1 - coefficientOfVariation));
}

// =============================================================================
// Statistical Analysis Functions
// =============================================================================

/**
 * Calculate comprehensive statistics for checkpoints
 */
function calculateCheckpointStatistics(checkpoints: MetricCheckpoint[]): CheckpointStatistics {
  if (checkpoints.length === 0) {
    return {
      count: 0,
      average: 0,
      minimum: 0,
      maximum: 0,
      standardDeviation: 0,
      trendSlope: 0,
      correlation: 0,
      movingAverage: [],
      outliers: [],
    };
  }

  const values = checkpoints.map(cp => cp.value);
  const count = values.length;
  const average = values.reduce((a, b) => a + b, 0) / count;
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  // Calculate standard deviation
  const variance = values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / count;
  const standardDeviation = Math.sqrt(variance);

  // Calculate linear regression slope
  const trendSlope = calculateLinearRegressionSlope(checkpoints);

  // Calculate correlation coefficient
  const correlation = calculateCorrelation(checkpoints);

  // Calculate moving average
  const movingAverage = calculateMovingAverage(values, Math.min(5, Math.floor(count / 2)));

  // Identify outliers (values more than 2 standard deviations from mean)
  const outliers = checkpoints.filter(cp =>
    Math.abs(cp.value - average) > 2 * standardDeviation
  );

  return {
    count,
    average,
    minimum,
    maximum,
    standardDeviation,
    trendSlope,
    correlation,
    movingAverage,
    outliers,
  };
}

/**
 * Calculate linear regression slope for trend analysis
 */
function calculateLinearRegressionSlope(checkpoints: MetricCheckpoint[]): number {
  if (checkpoints.length < 2) return 0;

  const sortedCheckpoints = [...checkpoints].sort(
    (a, b) => a.recordedDate.getTime() - b.recordedDate.getTime()
  );

  const n = sortedCheckpoints.length;
  const xValues = sortedCheckpoints.map((_, index) => index); // Use index as x-value
  const yValues = sortedCheckpoints.map(cp => cp.value);

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  return isNaN(slope) ? 0 : slope;
}

/**
 * Calculate correlation coefficient
 */
function calculateCorrelation(checkpoints: MetricCheckpoint[]): number {
  if (checkpoints.length < 2) return 0;

  const sortedCheckpoints = [...checkpoints].sort(
    (a, b) => a.recordedDate.getTime() - b.recordedDate.getTime()
  );

  const xValues = sortedCheckpoints.map((_, index) => index);
  const yValues = sortedCheckpoints.map(cp => cp.value);

  const n = sortedCheckpoints.length;
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);
  const sumYY = yValues.reduce((acc, y) => acc + y * y, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calculate moving average
 */
function calculateMovingAverage(values: number[], windowSize: number): number[] {
  if (values.length < windowSize) return values;

  const movingAverage: number[] = [];
  for (let i = windowSize - 1; i < values.length; i++) {
    const window = values.slice(i - windowSize + 1, i + 1);
    const average = window.reduce((a, b) => a + b, 0) / windowSize;
    movingAverage.push(average);
  }
  return movingAverage;
}

// =============================================================================
// Formatting and Display Functions
// =============================================================================

/**
 * Format value according to metric type
 */
function formatMetricValue(
  value: number,
  metricType: ExtendedMetricType,
  unit?: string
): string {
  const config = METRIC_TYPE_CONFIGS[metricType];
  return config.formatValue(value, unit);
}

/**
 * Parse input value according to metric type
 */
function parseMetricValue(
  input: string,
  metricType: ExtendedMetricType
): number | null {
  const config = METRIC_TYPE_CONFIGS[metricType];
  return config.parseValue(input);
}

/**
 * Format date for display
 */
function formatCheckpointDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

/**
 * Format confidence level for display
 */
function formatConfidenceLevel(level: ConfidenceLevel): string {
  switch (level) {
    case ConfidenceLevel.LOW:
      return 'Low confidence';
    case ConfidenceLevel.MEDIUM:
      return 'Medium confidence';
    case ConfidenceLevel.HIGH:
      return 'High confidence';
    case ConfidenceLevel.VERIFIED:
      return 'Verified data';
    default:
      return 'Unknown';
  }
}

/**
 * Get status color for UI display
 */
function getStatusColor(status: ProgressStatus): string {
  switch (status) {
    case ProgressStatus.ON_TRACK:
      return 'text-green-600 bg-green-100';
    case ProgressStatus.AT_RISK:
      return 'text-yellow-600 bg-yellow-100';
    case ProgressStatus.OFF_TRACK:
      return 'text-red-600 bg-red-100';
    case ProgressStatus.COMPLETED:
      return 'text-blue-600 bg-blue-100';
    case ProgressStatus.NOT_STARTED:
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// =============================================================================
// Common Metric Templates
// =============================================================================

export const COMMON_METRIC_TEMPLATES: MetricTemplate[] = [
  {
    id: 'conversion-rate',
    name: 'Conversion Rate',
    category: 'Business',
    description: 'Track conversion from visitors to customers',
    config: {
      name: 'Conversion Rate',
      metricType: ExtendedMetricType.PERCENTAGE,
      unit: '%',
      direction: MetricDirection.INCREASE,
      measurementFrequency: 'weekly' as any,
    },
    benchmarks: {
      industry: 'E-commerce',
      average: 2.3,
      excellent: 5.0,
      poor: 1.0,
    },
    examples: ['E-commerce conversion rate', 'Lead conversion rate', 'Sign-up conversion rate'],
    tags: ['business', 'marketing', 'performance'],
  },
  {
    id: 'response-time',
    name: 'Response Time',
    category: 'Technical',
    description: 'API or service response time',
    config: {
      name: 'Response Time',
      metricType: ExtendedMetricType.DURATION,
      unit: 'ms',
      direction: MetricDirection.DECREASE,
      measurementFrequency: 'daily' as any,
    },
    benchmarks: {
      industry: 'Web Services',
      average: 200,
      excellent: 100,
      poor: 500,
    },
    examples: ['API response time', 'Page load time', 'Database query time'],
    tags: ['technical', 'performance', 'infrastructure'],
  },
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction',
    category: 'Customer',
    description: 'Customer satisfaction score',
    config: {
      name: 'Customer Satisfaction',
      metricType: ExtendedMetricType.RATING,
      unit: '/10',
      direction: MetricDirection.INCREASE,
      measurementFrequency: 'monthly' as any,
    },
    benchmarks: {
      industry: 'General',
      average: 7.5,
      excellent: 9.0,
      poor: 6.0,
    },
    examples: ['NPS score', 'CSAT score', 'Support rating'],
    tags: ['customer', 'satisfaction', 'feedback'],
  },
  {
    id: 'revenue-growth',
    name: 'Revenue Growth',
    category: 'Financial',
    description: 'Monthly or quarterly revenue growth',
    config: {
      name: 'Revenue Growth',
      metricType: ExtendedMetricType.PERCENTAGE,
      unit: '%',
      direction: MetricDirection.INCREASE,
      measurementFrequency: 'monthly' as any,
    },
    benchmarks: {
      industry: 'SaaS',
      average: 10,
      excellent: 20,
      poor: 5,
    },
    examples: ['Monthly recurring revenue growth', 'Quarterly revenue growth', 'Year-over-year growth'],
    tags: ['financial', 'revenue', 'growth'],
  },
];

// =============================================================================
// Export all utility functions
// =============================================================================

export {
  calculateProgressPercentage,
  determineProgressStatus,
  calculateVelocity,
  analyzeProgress,
  validateMetricForm,
  validateCheckpoint,
  calculateCheckpointStatistics,
  formatMetricValue,
  parseMetricValue,
  formatCheckpointDate,
  formatConfidenceLevel,
  getStatusColor,
};