import type { Criterion, DorDodTemplate, TemplateApplyOptions } from '../DorDodPanel.types';
import {
  calculateProgressMetrics,
  validateCriteria,
  createCriterion,
  generateCriterionId,
  sortCriteria,
  applyTemplate,
  exportCriteria,
  getCategoryProgress,
  getProgressColor,
  getCategoryInfo,
  calculateTimeMetrics,
  debounce,
  deepClone,
} from '../DorDodPanel.utils';

describe('DorDodPanel.utils', () => {
  const mockCriteria: Criterion[] = [
    {
      id: 'test-1',
      description: 'Required criterion 1',
      category: 'required',
      isCompleted: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      order: 1,
    },
    {
      id: 'test-2',
      description: 'Required criterion 2',
      category: 'required',
      isCompleted: false,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      order: 2,
      validationRule: {
        type: 'required',
        message: 'This is required',
      },
    },
    {
      id: 'test-3',
      description: 'Recommended criterion',
      category: 'recommended',
      isCompleted: true,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      order: 3,
    },
    {
      id: 'test-4',
      description: 'Optional criterion',
      category: 'optional',
      isCompleted: false,
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04'),
      order: 4,
    },
  ];

  describe('calculateProgressMetrics', () => {
    it('calculates correct progress metrics', () => {
      const metrics = calculateProgressMetrics(mockCriteria);

      expect(metrics.totalRequiredItems).toBe(2);
      expect(metrics.requiredItemsCompleted).toBe(1);
      expect(metrics.totalRecommendedItems).toBe(1);
      expect(metrics.recommendedItemsCompleted).toBe(1);
      expect(metrics.totalOptionalItems).toBe(1);
      expect(metrics.optionalItemsCompleted).toBe(0);

      // Weighted scoring: required = 60%, recommended = 30%, optional = 10%
      // Required: 1/2 = 50% * 60% = 30%
      // Recommended: 1/1 = 100% * 30% = 30%
      // Optional: 0/1 = 0% * 10% = 0%
      // Total: 60%
      expect(metrics.readinessScore).toBe(60);

      // Overall completion: 2/4 = 50%
      expect(metrics.completionScore).toBe(50);

      expect(metrics.isReadyToStart).toBe(false); // Not all required completed
      expect(metrics.isReadyToComplete).toBe(false); // Not all items completed
    });

    it('handles empty criteria array', () => {
      const metrics = calculateProgressMetrics([]);

      expect(metrics.readinessScore).toBe(100);
      expect(metrics.completionScore).toBe(100);
      expect(metrics.isReadyToStart).toBe(true);
      expect(metrics.isReadyToComplete).toBe(true);
    });

    it('calculates ready states correctly', () => {
      const allRequiredComplete = mockCriteria.map(c => ({
        ...c,
        isCompleted: c.category === 'required',
      }));

      const metrics = calculateProgressMetrics(allRequiredComplete);
      expect(metrics.isReadyToStart).toBe(true);
      expect(metrics.isReadyToComplete).toBe(false);

      const allComplete = mockCriteria.map(c => ({ ...c, isCompleted: true }));
      const allCompleteMetrics = calculateProgressMetrics(allComplete);
      expect(allCompleteMetrics.isReadyToStart).toBe(true);
      expect(allCompleteMetrics.isReadyToComplete).toBe(true);
    });
  });

  describe('validateCriteria', () => {
    it('validates required criteria correctly', () => {
      const result = validateCriteria(mockCriteria);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].criterionId).toBe('test-2');
      expect(result.errors[0].type).toBe('required');
      expect(result.blockingCriteria).toContain('test-2');
    });

    it('generates warnings for incomplete recommended items', () => {
      const criteriaWithIncompleteRecommended = mockCriteria.map(c =>
        c.id === 'test-3' ? { ...c, isCompleted: false } : c
      );

      const result = validateCriteria(criteriaWithIncompleteRecommended);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].criterionId).toBe('test-3');
      expect(result.warnings[0].type).toBe('recommendation');
    });

    it('validates dependencies', () => {
      const criteriaWithDependencies: Criterion[] = [
        {
          id: 'dep-1',
          description: 'Independent criterion',
          category: 'required',
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 1,
        },
        {
          id: 'dep-2',
          description: 'Dependent criterion',
          category: 'required',
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 2,
          validationRule: {
            type: 'dependency',
            message: 'Depends on dep-1',
            dependsOn: ['dep-1'],
          },
        },
      ];

      const result = validateCriteria(criteriaWithDependencies);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe('dependency');
    });

    it('returns valid result when all criteria pass', () => {
      const allValidCriteria = mockCriteria.map(c => ({ ...c, isCompleted: true }));
      const result = validateCriteria(allValidCriteria);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.blockingCriteria).toHaveLength(0);
    });
  });

  describe('createCriterion', () => {
    it('creates criterion with default values', () => {
      const criterion = createCriterion('Test description', 'required', 1);

      expect(criterion.description).toBe('Test description');
      expect(criterion.category).toBe('required');
      expect(criterion.order).toBe(1);
      expect(criterion.isCompleted).toBe(false);
    });

    it('uses default category when not specified', () => {
      const criterion = createCriterion('Test', undefined, 1);
      expect(criterion.category).toBe('required');
    });
  });

  describe('generateCriterionId', () => {
    it('generates unique IDs', () => {
      const id1 = generateCriterionId();
      const id2 = generateCriterionId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^criterion-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^criterion-\d+-[a-z0-9]+$/);
    });
  });

  describe('sortCriteria', () => {
    it('sorts criteria by order, then category, then creation date', () => {
      const unsorted: Criterion[] = [
        {
          id: '4',
          description: 'Fourth',
          category: 'optional',
          isCompleted: false,
          createdAt: new Date('2024-01-04'),
          updatedAt: new Date(),
          order: 2,
        },
        {
          id: '1',
          description: 'First',
          category: 'required',
          isCompleted: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          order: 1,
        },
        {
          id: '3',
          description: 'Third',
          category: 'recommended',
          isCompleted: false,
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date(),
          order: 2,
        },
        {
          id: '2',
          description: 'Second',
          category: 'required',
          isCompleted: false,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date(),
          order: 2,
        },
      ];

      const sorted = sortCriteria(unsorted);

      expect(sorted[0].id).toBe('1'); // Order 1
      expect(sorted[1].id).toBe('2'); // Order 2, required (higher priority)
      expect(sorted[2].id).toBe('3'); // Order 2, recommended
      expect(sorted[3].id).toBe('4'); // Order 2, optional
    });
  });

  describe('getCategoryProgress', () => {
    it('calculates category-specific progress', () => {
      const requiredProgress = getCategoryProgress(mockCriteria, 'required');
      expect(requiredProgress).toBe(50); // 1 of 2 required completed

      const recommendedProgress = getCategoryProgress(mockCriteria, 'recommended');
      expect(recommendedProgress).toBe(100); // 1 of 1 recommended completed

      const optionalProgress = getCategoryProgress(mockCriteria, 'optional');
      expect(optionalProgress).toBe(0); // 0 of 1 optional completed
    });

    it('returns 100% for empty category', () => {
      const progress = getCategoryProgress([], 'required');
      expect(progress).toBe(100);
    });
  });

  describe('getProgressColor', () => {
    it('returns correct color classes for different percentages', () => {
      expect(getProgressColor(100)).toContain('green');
      expect(getProgressColor(80)).toContain('blue');
      expect(getProgressColor(60)).toContain('yellow');
      expect(getProgressColor(40)).toContain('orange');
      expect(getProgressColor(20)).toContain('red');
    });
  });

  describe('getCategoryInfo', () => {
    it('returns correct info for each category', () => {
      const requiredInfo = getCategoryInfo('required');
      expect(requiredInfo.label).toBe('Required');
      expect(requiredInfo.color).toContain('red');

      const recommendedInfo = getCategoryInfo('recommended');
      expect(recommendedInfo.label).toBe('Recommended');
      expect(recommendedInfo.color).toContain('yellow');

      const optionalInfo = getCategoryInfo('optional');
      expect(optionalInfo.label).toBe('Optional');
      expect(optionalInfo.color).toContain('gray');
    });
  });

  describe('applyTemplate', () => {
    const mockTemplate: DorDodTemplate = {
      id: 'test-template',
      name: 'Test Template',
      description: 'Test template description',
      category: 'software-development',
      isCustom: false,
      dorCriteria: [
        {
          description: 'Template DOR 1',
          category: 'required',
          order: 1,
        },
        {
          description: 'Template DOR 2',
          category: 'recommended',
          order: 2,
        },
      ],
      dodCriteria: [
        {
          description: 'Template DOD 1',
          category: 'required',
          order: 1,
        },
      ],
    };

    it('applies template by replacing existing criteria', () => {
      const options: TemplateApplyOptions = {
        replaceExisting: true,
        mergeWithExisting: false,
      };

      const result = applyTemplate(mockTemplate, mockCriteria, [], options);

      expect(result.dorCriteria).toHaveLength(2);
      expect(result.dodCriteria).toHaveLength(1);
      expect(result.dorCriteria[0].description).toBe('Template DOR 1');
    });

    it('applies template by merging with existing criteria', () => {
      const options: TemplateApplyOptions = {
        replaceExisting: false,
        mergeWithExisting: true,
      };

      const result = applyTemplate(mockTemplate, [mockCriteria[0]], [], options);

      expect(result.dorCriteria).toHaveLength(3); // 1 existing + 2 template
      expect(result.dodCriteria).toHaveLength(1); // 0 existing + 1 template
    });

    it('filters by category when specified', () => {
      const options: TemplateApplyOptions = {
        replaceExisting: true,
        mergeWithExisting: false,
        categoryFilter: ['required'],
      };

      const result = applyTemplate(mockTemplate, [], [], options);

      expect(result.dorCriteria).toHaveLength(1); // Only required items
      expect(result.dorCriteria[0].category).toBe('required');
    });
  });

  describe('exportCriteria', () => {
    it('exports to JSON format', () => {
      const json = exportCriteria(mockCriteria.slice(0, 2), 'json');
      const parsed = JSON.parse(json);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].description).toBe('Required criterion 1');
    });

    it('exports to CSV format', () => {
      const csv = exportCriteria(mockCriteria.slice(0, 2), 'csv');
      const lines = csv.split('\n');

      expect(lines[0]).toBe('Description,Category,Completed,Help Text,Order');
      expect(lines[1]).toContain('Required criterion 1');
      expect(lines[1]).toContain('required');
    });

    it('exports to Markdown format', () => {
      const markdown = exportCriteria(mockCriteria.slice(0, 2), 'markdown');

      expect(markdown).toContain('## Required');
      expect(markdown).toContain('[x] Required criterion 1');
      expect(markdown).toContain('[ ] Required criterion 2');
    });
  });

  describe('calculateTimeMetrics', () => {
    it('calculates time in progress', () => {
      const markedReady = new Date('2024-01-01T10:00:00Z');
      const markedDone = new Date('2024-01-01T12:00:00Z');

      const metrics = calculateTimeMetrics(markedReady, markedDone);

      expect(metrics.timeInProgress).toBe(2 * 60 * 60 * 1000); // 2 hours in milliseconds
    });

    it('calculates overdue status', () => {
      const markedReady = new Date('2024-01-01T10:00:00Z');
      const markedDone = new Date('2024-01-01T14:00:00Z');
      const estimatedDuration = 2 * 60 * 60 * 1000; // 2 hours

      const metrics = calculateTimeMetrics(markedReady, markedDone, estimatedDuration);

      expect(metrics.isOverdue).toBe(true);
      expect(metrics.efficiency).toBeLessThan(100);
    });

    it('calculates remaining time for in-progress items', () => {
      const markedReady = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      const estimatedDuration = 2 * 60 * 60 * 1000; // 2 hours total

      const metrics = calculateTimeMetrics(markedReady, undefined, estimatedDuration);

      expect(metrics.remainingTime).toBeGreaterThan(0);
      expect(metrics.remainingTime).toBeLessThanOrEqual(60 * 60 * 1000); // <= 1 hour remaining
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('debounces function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith('arg3');
    });
  });

  describe('deepClone', () => {
    it('creates deep clone of objects', () => {
      const original = {
        id: 'test',
        nested: { value: 42 },
        array: [1, 2, { nested: true }],
        date: new Date('2024-01-01'),
      };

      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.array).not.toBe(original.array);
      expect(cloned.date).not.toBe(original.date);
    });

    it('handles primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('handles arrays', () => {
      const original = [1, { nested: true }, [2, 3]];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[1]).not.toBe(original[1]);
      expect(cloned[2]).not.toBe(original[2]);
    });
  });
});