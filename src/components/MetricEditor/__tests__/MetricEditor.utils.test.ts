/**
 * MetricEditor Utilities Tests
 *
 * Test suite for utility functions used by MetricEditor components
 */

import { MeasurableSpec, MetricCheckpoint, MetricType, Frequency } from '@/types/smart-goals.types';

import {
  ExtendedMetricType,
  MetricDirection,
  ProgressStatus,
  MetricFormData,
} from '../MetricEditor.types';
import {
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
  getStatusColor,
  METRIC_TYPE_CONFIGS,
} from '../MetricEditor.utils';



// Sample test data
const sampleMetric: MeasurableSpec = {
  metricType: MetricType.PERCENTAGE,
  targetValue: 100,
  currentValue: 75,
  unit: '%',
  minimumValue: 0,
  maximumValue: 100,
  higherIsBetter: true,
  measurementFrequency: Frequency.WEEKLY,
};

const createCheckpoint = (id: string, value: number, daysAgo: number): MetricCheckpoint => ({
  id,
  goalId: 'test-goal',
  value,
  recordedDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
  isAutomatic: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'test-user',
  updatedBy: 'test-user',
});

describe('Progress Calculation Functions', () => {
  describe('calculateProgressPercentage', () => {
    test('calculates increase direction correctly', () => {
      const result = calculateProgressPercentage(0, 50, 100, MetricDirection.INCREASE);
      expect(result).toBe(50);
    });

    test('calculates decrease direction correctly', () => {
      const result = calculateProgressPercentage(100, 50, 0, MetricDirection.DECREASE);
      expect(result).toBe(50);
    });

    test('calculates maintain direction correctly', () => {
      const result = calculateProgressPercentage(50, 75, 80, MetricDirection.MAINTAIN);
      expect(result).toBeCloseTo(83.33, 1); // Should be close to target
    });

    test('handles edge cases', () => {
      // Current value exceeds target (increase)
      const exceed = calculateProgressPercentage(0, 120, 100, MetricDirection.INCREASE);
      expect(exceed).toBe(100);

      // Current value below baseline (decrease)
      const below = calculateProgressPercentage(100, 120, 50, MetricDirection.DECREASE);
      expect(below).toBe(0);

      // Zero range
      const zero = calculateProgressPercentage(50, 40, 50, MetricDirection.INCREASE);
      expect(zero).toBe(0);
    });
  });

  describe('determineProgressStatus', () => {
    test('returns COMPLETED for 100% progress', () => {
      const status = determineProgressStatus(100, 5, 10);
      expect(status).toBe(ProgressStatus.COMPLETED);
    });

    test('returns NOT_STARTED for 0% progress', () => {
      const status = determineProgressStatus(0, 0, 10);
      expect(status).toBe(ProgressStatus.NOT_STARTED);
    });

    test('returns ON_TRACK for good progress and velocity', () => {
      const status = determineProgressStatus(60, 8, 10); // 6% per day required, 8% actual
      expect(status).toBe(ProgressStatus.ON_TRACK);
    });

    test('returns AT_RISK for medium progress and velocity', () => {
      const status = determineProgressStatus(50, 3, 10); // 5% per day required, 3% actual
      expect(status).toBe(ProgressStatus.AT_RISK);
    });

    test('returns OFF_TRACK for poor progress and velocity', () => {
      const status = determineProgressStatus(30, 1, 10); // 7% per day required, 1% actual
      expect(status).toBe(ProgressStatus.OFF_TRACK);
    });

    test('handles no target date', () => {
      const status = determineProgressStatus(85, 5);
      expect(status).toBe(ProgressStatus.ON_TRACK);
    });
  });

  describe('calculateVelocity', () => {
    test('calculates velocity with multiple checkpoints', () => {
      const checkpoints = [
        createCheckpoint('1', 20, 14), // 14 days ago
        createCheckpoint('2', 40, 7),  // 7 days ago
        createCheckpoint('3', 50, 0),  // today
      ];

      const velocity = calculateVelocity(checkpoints);
      expect(velocity).toBeCloseTo(2.14, 1); // ~30 points over 14 days
    });

    test('returns 0 for insufficient data', () => {
      const singleCheckpoint = [createCheckpoint('1', 50, 0)];
      expect(calculateVelocity(singleCheckpoint)).toBe(0);
      expect(calculateVelocity([])).toBe(0);
    });

    test('handles same-day checkpoints', () => {
      const checkpoints = [
        createCheckpoint('1', 20, 0),
        createCheckpoint('2', 40, 0),
      ];

      const velocity = calculateVelocity(checkpoints);
      expect(velocity).toBe(0); // No time difference
    });
  });

  describe('analyzeProgress', () => {
    test('provides comprehensive analysis', () => {
      const checkpoints = [
        createCheckpoint('1', 50, 21),
        createCheckpoint('2', 60, 14),
        createCheckpoint('3', 70, 7),
        createCheckpoint('4', 75, 0),
      ];

      const analysis = analyzeProgress(sampleMetric, checkpoints, new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));

      expect(analysis.progressPercentage).toBe(75);
      expect(analysis.status).toBe(ProgressStatus.ON_TRACK);
      expect(analysis.trend).toBe('increasing');
      expect(analysis.velocity).toBeGreaterThan(0);
      expect(analysis.daysToTarget).toBe(14);
      expect(analysis.projectionConfidence).toBeGreaterThan(0);
    });

    test('handles edge cases', () => {
      const analysis = analyzeProgress(sampleMetric, []);

      expect(analysis.progressPercentage).toBe(75); // Based on current value
      expect(analysis.velocity).toBe(0);
      expect(analysis.trend).toBe('unknown');
    });
  });
});

describe('Validation Functions', () => {
  describe('validateMetricForm', () => {
    const validFormData: Partial<MetricFormData> = {
      name: 'Test Metric',
      metricType: ExtendedMetricType.PERCENTAGE,
      targetValue: 100,
      currentValue: 50,
      unit: '%',
      direction: MetricDirection.INCREASE,
      measurementFrequency: Frequency.WEEKLY,
    };

    test('passes validation for valid data', () => {
      const errors = validateMetricForm(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    test('validates required name field', () => {
      const errors = validateMetricForm({ ...validFormData, name: '' });
      expect(errors.name).toContain('Metric name is required');
    });

    test('validates name length', () => {
      const errors = validateMetricForm({ ...validFormData, name: 'ab' });
      expect(errors.name).toContain('Metric name must be at least 3 characters');

      const longName = 'a'.repeat(101);
      const longErrors = validateMetricForm({ ...validFormData, name: longName });
      expect(longErrors.name).toContain('Metric name must be less than 100 characters');
    });

    test('validates required target value', () => {
      const errors = validateMetricForm({ ...validFormData, targetValue: undefined });
      expect(errors.targetValue).toContain('Target value is required');
    });

    test('validates numeric values', () => {
      const errors = validateMetricForm({ ...validFormData, targetValue: NaN });
      expect(errors.targetValue).toContain('Target value must be a valid number');
    });

    test('validates unit field', () => {
      const errors = validateMetricForm({ ...validFormData, unit: '' });
      expect(errors.unit).toContain('Unit is required');
    });
  });

  describe('validateCheckpoint', () => {
    const validCheckpoint: Partial<MetricCheckpoint> = {
      value: 75,
      recordedDate: new Date(),
    };

    test('passes validation for valid checkpoint', () => {
      const errors = validateCheckpoint(validCheckpoint, sampleMetric);
      expect(errors).toHaveLength(0);
    });

    test('validates required value', () => {
      const errors = validateCheckpoint({ ...validCheckpoint, value: undefined }, sampleMetric);
      expect(errors).toContain('Value is required');
    });

    test('validates numeric value', () => {
      const errors = validateCheckpoint({ ...validCheckpoint, value: NaN }, sampleMetric);
      expect(errors).toContain('Value must be a valid number');
    });

    test('validates date is not in future', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const errors = validateCheckpoint({ ...validCheckpoint, recordedDate: futureDate }, sampleMetric);
      expect(errors).toContain('Date cannot be in the future');
    });
  });
});

describe('Statistical Functions', () => {
  describe('calculateCheckpointStatistics', () => {
    test('calculates statistics for multiple checkpoints', () => {
      const checkpoints = [
        createCheckpoint('1', 50, 21),
        createCheckpoint('2', 60, 14),
        createCheckpoint('3', 70, 7),
        createCheckpoint('4', 80, 0),
      ];

      const stats = calculateCheckpointStatistics(checkpoints);

      expect(stats.count).toBe(4);
      expect(stats.average).toBe(65);
      expect(stats.minimum).toBe(50);
      expect(stats.maximum).toBe(80);
      expect(stats.trendSlope).toBeGreaterThan(0); // Positive trend
      expect(stats.standardDeviation).toBeCloseTo(12.91, 1);
    });

    test('handles empty checkpoint array', () => {
      const stats = calculateCheckpointStatistics([]);

      expect(stats.count).toBe(0);
      expect(stats.average).toBe(0);
      expect(stats.minimum).toBe(0);
      expect(stats.maximum).toBe(0);
      expect(stats.trendSlope).toBe(0);
    });

    test('identifies outliers', () => {
      const checkpoints = [
        createCheckpoint('1', 50, 21),
        createCheckpoint('2', 55, 14),
        createCheckpoint('3', 200, 7), // Outlier
        createCheckpoint('4', 60, 0),
      ];

      const stats = calculateCheckpointStatistics(checkpoints);
      expect(stats.outliers).toHaveLength(1);
      expect(stats.outliers[0].value).toBe(200);
    });
  });
});

describe('Formatting Functions', () => {
  describe('formatMetricValue', () => {
    test('formats percentage values', () => {
      const result = formatMetricValue(85.5, ExtendedMetricType.PERCENTAGE, '%');
      expect(result).toBe('85.5%');
    });

    test('formats currency values', () => {
      const result = formatMetricValue(1234.56, ExtendedMetricType.CURRENCY, '$');
      expect(result).toBe('$1,234.56');
    });

    test('formats duration values', () => {
      const result = formatMetricValue(2.5, ExtendedMetricType.DURATION, 'hours');
      expect(result).toBe('2.5 hours');

      const minutes = formatMetricValue(120, ExtendedMetricType.DURATION, 'minutes');
      expect(minutes).toBe('2h 0m');
    });

    test('formats boolean values', () => {
      const trueResult = formatMetricValue(1, ExtendedMetricType.BOOLEAN);
      expect(trueResult).toBe('Yes');

      const falseResult = formatMetricValue(0, ExtendedMetricType.BOOLEAN);
      expect(falseResult).toBe('No');
    });

    test('formats ratio values', () => {
      const result = formatMetricValue(2.5, ExtendedMetricType.RATIO);
      expect(result).toBe('2.5:1');
    });

    test('formats count values (integers)', () => {
      const result = formatMetricValue(42.7, ExtendedMetricType.COUNT, 'items');
      expect(result).toBe('43 items'); // Rounded to integer
    });
  });

  describe('parseMetricValue', () => {
    test('parses percentage values', () => {
      expect(parseMetricValue('85.5%', ExtendedMetricType.PERCENTAGE)).toBe(85.5);
      expect(parseMetricValue('100%', ExtendedMetricType.PERCENTAGE)).toBe(100);
      expect(parseMetricValue('101%', ExtendedMetricType.PERCENTAGE)).toBeNull(); // Invalid
    });

    test('parses currency values', () => {
      expect(parseMetricValue('$1,234.56', ExtendedMetricType.CURRENCY)).toBe(1234.56);
      expect(parseMetricValue('1234.56', ExtendedMetricType.CURRENCY)).toBe(1234.56);
    });

    test('parses boolean values', () => {
      expect(parseMetricValue('yes', ExtendedMetricType.BOOLEAN)).toBe(1);
      expect(parseMetricValue('true', ExtendedMetricType.BOOLEAN)).toBe(1);
      expect(parseMetricValue('no', ExtendedMetricType.BOOLEAN)).toBe(0);
      expect(parseMetricValue('false', ExtendedMetricType.BOOLEAN)).toBe(0);
    });

    test('parses ratio values', () => {
      expect(parseMetricValue('3:1', ExtendedMetricType.RATIO)).toBe(3);
      expect(parseMetricValue('1.5:2', ExtendedMetricType.RATIO)).toBe(0.75);
    });

    test('parses rating values', () => {
      expect(parseMetricValue('8.5/10', ExtendedMetricType.RATING)).toBe(8.5);
      expect(parseMetricValue('11/10', ExtendedMetricType.RATING)).toBeNull(); // Invalid
    });

    test('returns null for invalid inputs', () => {
      expect(parseMetricValue('invalid', ExtendedMetricType.NUMBER)).toBeNull();
      expect(parseMetricValue('', ExtendedMetricType.PERCENTAGE)).toBeNull();
    });
  });

  describe('formatCheckpointDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatCheckpointDate(date);
      expect(result).toBe('Jan 15, 2024');
    });
  });

  describe('getStatusColor', () => {
    test('returns correct colors for each status', () => {
      expect(getStatusColor(ProgressStatus.ON_TRACK)).toContain('green');
      expect(getStatusColor(ProgressStatus.AT_RISK)).toContain('yellow');
      expect(getStatusColor(ProgressStatus.OFF_TRACK)).toContain('red');
      expect(getStatusColor(ProgressStatus.COMPLETED)).toContain('blue');
      expect(getStatusColor(ProgressStatus.NOT_STARTED)).toContain('gray');
    });
  });
});

describe('Metric Type Configurations', () => {
  test('all metric types have valid configurations', () => {
    Object.values(ExtendedMetricType).forEach(type => {
      const config = METRIC_TYPE_CONFIGS[type];

      expect(config).toBeDefined();
      expect(config.label).toBeTruthy();
      expect(config.icon).toBeTruthy();
      expect(config.description).toBeTruthy();
      expect(typeof config.allowDecimals).toBe('boolean');
      expect(typeof config.formatValue).toBe('function');
      expect(typeof config.parseValue).toBe('function');
      expect(Array.isArray(config.examples)).toBe(true);
      expect(config.examples.length).toBeGreaterThan(0);
      expect(Object.values(MetricDirection)).toContain(config.defaultDirection);
    });
  });

  test('format and parse functions are consistent', () => {
    Object.entries(METRIC_TYPE_CONFIGS).forEach(([type, config]) => {
      // Test that parsing a formatted value returns the original (approximately)
      const testValue = 42.5;
      const formatted = config.formatValue(testValue, config.defaultUnit);
      const parsed = config.parseValue(formatted);

      if (type === ExtendedMetricType.BOOLEAN) {
        // Boolean values are special case
        expect([0, 1]).toContain(parsed);
      } else if (config.allowDecimals) {
        expect(parsed).toBeCloseTo(testValue, 1);
      } else {
        // For integer types, expect rounded value
        expect(parsed).toBe(Math.round(testValue));
      }
    });
  });

  test('validation patterns work correctly', () => {
    const percentageConfig = METRIC_TYPE_CONFIGS[ExtendedMetricType.PERCENTAGE];
    expect(percentageConfig.validationPattern?.test('85.5')).toBe(true);
    expect(percentageConfig.validationPattern?.test('100')).toBe(true);
    expect(percentageConfig.validationPattern?.test('101')).toBe(false);
    expect(percentageConfig.validationPattern?.test('-5')).toBe(false);

    const ratingConfig = METRIC_TYPE_CONFIGS[ExtendedMetricType.RATING];
    expect(ratingConfig.validationPattern?.test('8.5')).toBe(true);
    expect(ratingConfig.validationPattern?.test('10')).toBe(true);
    expect(ratingConfig.validationPattern?.test('10.5')).toBe(false);
    expect(ratingConfig.validationPattern?.test('0')).toBe(false);

    const countConfig = METRIC_TYPE_CONFIGS[ExtendedMetricType.COUNT];
    expect(countConfig.validationPattern?.test('42')).toBe(true);
    expect(countConfig.validationPattern?.test('42.5')).toBe(false);
    expect(countConfig.validationPattern?.test('-5')).toBe(false);
  });
});