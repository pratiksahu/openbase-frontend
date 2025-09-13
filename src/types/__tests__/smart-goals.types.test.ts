/**
 * Unit Tests for SMART Goals Type Definitions and Mock Data
 *
 * This test suite validates the type guards, mock data factories,
 * and data structure integrity for the SMART Goals system.
 *
 * @fileoverview Unit tests for SMART Goals types and mock data
 */

import {
  createMockSmartGoal,
  createMockTask,
  createMockMilestone,
  createMockMetricCheckpoint,
  createMockMeasurableSpec,
  createMockAchievability,
  createMockRelevance,
  createMockTimebound,
  createSampleGoalsDataset,
  createTestDataset,
  generateId,
  randomDate,
  randomNumber,
  randomFloat,
  randomElement,
  randomElements,
} from '../../lib/mock-data/smart-goals';
import {
  GoalStatus,
  GoalPriority,
  GoalCategory,
  TaskStatus,
  MetricType,
  Frequency,
  isSmartGoal,
  isTask,
  isMilestone,
} from '../smart-goals.types';

describe('SMART Goals Type Definitions', () => {
  describe('Enums', () => {
    test('GoalStatus enum should contain all expected values', () => {
      expect(Object.values(GoalStatus)).toEqual([
        'draft',
        'active',
        'on_hold',
        'completed',
        'cancelled',
        'overdue',
      ]);
    });

    test('GoalPriority enum should contain all expected values', () => {
      expect(Object.values(GoalPriority)).toEqual([
        'low',
        'medium',
        'high',
        'critical',
      ]);
    });

    test('GoalCategory enum should contain all expected values', () => {
      expect(Object.values(GoalCategory)).toEqual([
        'personal',
        'professional',
        'health',
        'education',
        'financial',
        'relationship',
        'creative',
        'other',
      ]);
    });

    test('TaskStatus enum should contain all expected values', () => {
      expect(Object.values(TaskStatus)).toEqual([
        'todo',
        'in_progress',
        'completed',
        'blocked',
        'cancelled',
      ]);
    });

    test('MetricType enum should contain all expected values', () => {
      expect(Object.values(MetricType)).toEqual([
        'number',
        'percentage',
        'currency',
        'duration',
        'boolean',
        'rating',
      ]);
    });

    test('Frequency enum should contain all expected values', () => {
      expect(Object.values(Frequency)).toEqual([
        'once',
        'daily',
        'weekly',
        'monthly',
        'quarterly',
        'annually',
      ]);
    });
  });

  describe('Type Guards', () => {
    describe('isSmartGoal', () => {
      test('should return true for valid SmartGoal object', () => {
        const mockGoal = createMockSmartGoal();
        expect(isSmartGoal(mockGoal)).toBe(true);
      });

      test('should return false for invalid objects', () => {
        expect(isSmartGoal(null)).toBe(false);
        expect(isSmartGoal(undefined)).toBe(false);
        expect(isSmartGoal({})).toBe(false);
        expect(isSmartGoal('string')).toBe(false);
        expect(isSmartGoal(123)).toBe(false);
      });

      test('should return false for objects missing required properties', () => {
        const incompleteGoal = {
          id: 'test-id',
          title: 'Test Goal',
          // missing other required properties
        };
        expect(isSmartGoal(incompleteGoal)).toBe(false);
      });

      test('should validate enum values correctly', () => {
        const invalidGoal = {
          ...createMockSmartGoal(),
          status: 'invalid_status',
        };
        expect(isSmartGoal(invalidGoal)).toBe(false);

        const invalidCategory = {
          ...createMockSmartGoal(),
          category: 'invalid_category',
        };
        expect(isSmartGoal(invalidCategory)).toBe(false);

        const invalidPriority = {
          ...createMockSmartGoal(),
          priority: 'invalid_priority',
        };
        expect(isSmartGoal(invalidPriority)).toBe(false);
      });
    });

    describe('isTask', () => {
      test('should return true for valid Task object', () => {
        const mockTask = createMockTask('test-goal-id');
        expect(isTask(mockTask)).toBe(true);
      });

      test('should return false for invalid objects', () => {
        expect(isTask(null)).toBe(false);
        expect(isTask({})).toBe(false);
        expect(isTask({ id: 'test' })).toBe(false);
      });

      test('should validate required properties', () => {
        const validTask = createMockTask('test-goal-id');
        expect(isTask(validTask)).toBe(true);

        const invalidTask = { ...validTask, goalId: undefined };
        expect(isTask(invalidTask)).toBe(false);
      });
    });

    describe('isMilestone', () => {
      test('should return true for valid Milestone object', () => {
        const mockMilestone = createMockMilestone('test-goal-id');
        expect(isMilestone(mockMilestone)).toBe(true);
      });

      test('should return false for invalid objects', () => {
        expect(isMilestone(null)).toBe(false);
        expect(isMilestone({})).toBe(false);
      });

      test('should validate Date objects', () => {
        const validMilestone = createMockMilestone('test-goal-id');
        expect(isMilestone(validMilestone)).toBe(true);

        const invalidMilestone = {
          ...validMilestone,
          targetDate: 'not-a-date',
        };
        expect(isMilestone(invalidMilestone)).toBe(false);
      });
    });
  });
});

describe('Mock Data Factory Functions', () => {
  describe('Utility Functions', () => {
    test('generateId should create unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });

    test('randomDate should generate dates within range', () => {
      const start = new Date('2023-01-01');
      const end = new Date('2023-12-31');
      const randomDateResult = randomDate(start, end);

      expect(randomDateResult).toBeInstanceOf(Date);
      expect(randomDateResult.getTime()).toBeGreaterThanOrEqual(
        start.getTime()
      );
      expect(randomDateResult.getTime()).toBeLessThanOrEqual(end.getTime());
    });

    test('randomNumber should generate numbers within range', () => {
      const min = 10;
      const max = 20;
      const result = randomNumber(min, max);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
      expect(Number.isInteger(result)).toBe(true);
    });

    test('randomFloat should generate floats within range', () => {
      const min = 0.5;
      const max = 1.5;
      const result = randomFloat(min, max);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    test('randomElement should return element from array', () => {
      const testArray = ['a', 'b', 'c', 'd'];
      const result = randomElement(testArray);

      expect(testArray).toContain(result);
    });

    test('randomElements should return multiple elements', () => {
      const testArray = ['a', 'b', 'c', 'd', 'e'];
      const count = 3;
      const result = randomElements(testArray, count);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(count);
      result.forEach(element => {
        expect(testArray).toContain(element);
      });
    });
  });

  describe('createMockSmartGoal', () => {
    test('should create a valid SmartGoal object', () => {
      const mockGoal = createMockSmartGoal();
      expect(isSmartGoal(mockGoal)).toBe(true);
    });

    test('should have all required SMART properties', () => {
      const mockGoal = createMockSmartGoal();

      // Specific (S)
      expect(typeof mockGoal.title).toBe('string');
      expect(typeof mockGoal.description).toBe('string');
      expect(typeof mockGoal.specificObjective).toBe('string');
      expect(Array.isArray(mockGoal.successCriteria)).toBe(true);
      expect(Object.values(GoalCategory)).toContain(mockGoal.category);

      // Measurable (M)
      expect(typeof mockGoal.measurable).toBe('object');
      expect(Array.isArray(mockGoal.checkpoints)).toBe(true);
      expect(typeof mockGoal.progress).toBe('number');
      expect(mockGoal.progress).toBeGreaterThanOrEqual(0);
      expect(mockGoal.progress).toBeLessThanOrEqual(100);

      // Achievable (A)
      expect(typeof mockGoal.achievability).toBe('object');
      expect(Array.isArray(mockGoal.achievability.requiredResources)).toBe(
        true
      );
      expect(Array.isArray(mockGoal.achievability.requiredSkills)).toBe(true);
      expect(Array.isArray(mockGoal.achievability.constraints)).toBe(true);

      // Relevant (R)
      expect(typeof mockGoal.relevance).toBe('object');
      expect(Array.isArray(mockGoal.relevance.stakeholders)).toBe(true);
      expect(Array.isArray(mockGoal.relevance.expectedBenefits)).toBe(true);

      // Time-bound (T)
      expect(typeof mockGoal.timebound).toBe('object');
      expect(mockGoal.timebound.startDate).toBeInstanceOf(Date);
      expect(mockGoal.timebound.targetDate).toBeInstanceOf(Date);
    });

    test('should have proper execution structure', () => {
      const mockGoal = createMockSmartGoal();

      expect(Array.isArray(mockGoal.tasks)).toBe(true);
      expect(Array.isArray(mockGoal.milestones)).toBe(true);
      expect(Array.isArray(mockGoal.outcomes)).toBe(true);
      expect(Array.isArray(mockGoal.collaborators)).toBe(true);
      expect(Array.isArray(mockGoal.childGoalIds)).toBe(true);

      // Each task should belong to this goal
      mockGoal.tasks.forEach(task => {
        expect(task.goalId).toBe(mockGoal.id);
      });

      // Each milestone should belong to this goal
      mockGoal.milestones.forEach(milestone => {
        expect(milestone.goalId).toBe(mockGoal.id);
      });

      // Each outcome should belong to this goal
      mockGoal.outcomes.forEach(outcome => {
        expect(outcome.goalId).toBe(mockGoal.id);
      });
    });

    test('should accept overrides', () => {
      const customTitle = 'Custom Goal Title';
      const customStatus = GoalStatus.COMPLETED;
      const mockGoal = createMockSmartGoal({
        title: customTitle,
        status: customStatus,
      });

      expect(mockGoal.title).toBe(customTitle);
      expect(mockGoal.status).toBe(customStatus);
    });
  });

  describe('createMockTask', () => {
    test('should create a valid Task object', () => {
      const goalId = 'test-goal-id';
      const mockTask = createMockTask(goalId);

      expect(isTask(mockTask)).toBe(true);
      expect(mockTask.goalId).toBe(goalId);
      expect(Array.isArray(mockTask.subtasks)).toBe(true);
      expect(Array.isArray(mockTask.checklist)).toBe(true);
    });

    test('should create subtasks that reference the task', () => {
      const goalId = 'test-goal-id';
      const mockTask = createMockTask(goalId);

      mockTask.subtasks.forEach(subtask => {
        expect(subtask.taskId).toBe(mockTask.id);
      });
    });

    test('should have valid status and priority', () => {
      const goalId = 'test-goal-id';
      const mockTask = createMockTask(goalId);

      expect(Object.values(TaskStatus)).toContain(mockTask.status);
      expect(Object.values(GoalPriority)).toContain(mockTask.priority);
    });
  });

  describe('createMockMilestone', () => {
    test('should create a valid Milestone object', () => {
      const goalId = 'test-goal-id';
      const mockMilestone = createMockMilestone(goalId);

      expect(isMilestone(mockMilestone)).toBe(true);
      expect(mockMilestone.goalId).toBe(goalId);
      expect(mockMilestone.targetDate).toBeInstanceOf(Date);
      expect(Array.isArray(mockMilestone.successCriteria)).toBe(true);
      expect(Array.isArray(mockMilestone.taskIds)).toBe(true);
    });

    test('should have consistent completion state', () => {
      const goalId = 'test-goal-id';
      const mockMilestone = createMockMilestone(goalId);

      if (mockMilestone.isCompleted) {
        expect(mockMilestone.completedAt).toBeInstanceOf(Date);
        expect(mockMilestone.progress).toBe(100);
      } else {
        expect(mockMilestone.completedAt).toBeUndefined();
        expect(mockMilestone.progress).toBeLessThan(100);
      }
    });
  });

  describe('createMockMetricCheckpoint', () => {
    test('should create a valid MetricCheckpoint object', () => {
      const goalId = 'test-goal-id';
      const checkpoint = createMockMetricCheckpoint(goalId);

      expect(checkpoint.goalId).toBe(goalId);
      expect(typeof checkpoint.value).toBe('number');
      expect(checkpoint.recordedDate).toBeInstanceOf(Date);
      expect(typeof checkpoint.isAutomatic).toBe('boolean');
    });
  });

  describe('createMockMeasurableSpec', () => {
    test('should create a valid MeasurableSpec object', () => {
      const spec = createMockMeasurableSpec();

      expect(Object.values(MetricType)).toContain(spec.metricType);
      expect(Object.values(Frequency)).toContain(spec.measurementFrequency);
      expect(typeof spec.targetValue).toBe('number');
      expect(typeof spec.currentValue).toBe('number');
      expect(typeof spec.unit).toBe('string');
      expect(typeof spec.higherIsBetter).toBe('boolean');
    });
  });

  describe('createMockAchievability', () => {
    test('should create a valid Achievability assessment', () => {
      const achievability = createMockAchievability();

      expect(typeof achievability.score).toBe('number');
      expect(achievability.score).toBeGreaterThanOrEqual(0);
      expect(achievability.score).toBeLessThanOrEqual(1);

      expect(Array.isArray(achievability.requiredResources)).toBe(true);
      expect(Array.isArray(achievability.requiredSkills)).toBe(true);
      expect(Array.isArray(achievability.constraints)).toBe(true);

      expect(typeof achievability.successProbability).toBe('number');
      expect(achievability.successProbability).toBeGreaterThanOrEqual(0);
      expect(achievability.successProbability).toBeLessThanOrEqual(1);

      expect(achievability.lastAssessedAt).toBeInstanceOf(Date);
    });
  });

  describe('createMockRelevance', () => {
    test('should create a valid Relevance assessment', () => {
      const relevance = createMockRelevance();

      expect(typeof relevance.rationale).toBe('string');
      expect(Array.isArray(relevance.stakeholders)).toBe(true);
      expect(Array.isArray(relevance.expectedBenefits)).toBe(true);
      expect(Array.isArray(relevance.risksOfNotAchieving)).toBe(true);
      expect(Array.isArray(relevance.strategyAlignments)).toBe(true);

      expect(typeof relevance.relevanceScore).toBe('number');
      expect(relevance.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(relevance.relevanceScore).toBeLessThanOrEqual(1);

      expect(typeof relevance.valueScore).toBe('number');
      expect(relevance.valueScore).toBeGreaterThanOrEqual(0);
      expect(relevance.valueScore).toBeLessThanOrEqual(1);

      expect(relevance.lastReviewedAt).toBeInstanceOf(Date);
    });
  });

  describe('createMockTimebound', () => {
    test('should create a valid Timebound specification', () => {
      const timebound = createMockTimebound();

      expect(timebound.startDate).toBeInstanceOf(Date);
      expect(timebound.targetDate).toBeInstanceOf(Date);
      expect(timebound.targetDate.getTime()).toBeGreaterThan(
        timebound.startDate.getTime()
      );

      expect(typeof timebound.estimatedDuration).toBe('number');
      expect(timebound.estimatedDuration).toBeGreaterThan(0);

      expect(typeof timebound.isRecurring).toBe('boolean');
      if (timebound.recurrencePattern) {
        expect(Object.values(Frequency)).toContain(timebound.recurrencePattern);
      }
    });
  });
});

describe('Sample Datasets', () => {
  describe('createSampleGoalsDataset', () => {
    test('should create the requested number of goals', () => {
      const count = 3;
      const dataset = createSampleGoalsDataset(count);

      expect(Array.isArray(dataset)).toBe(true);
      expect(dataset.length).toBe(count);

      dataset.forEach(goal => {
        expect(isSmartGoal(goal)).toBe(true);
      });
    });

    test('should create goals with different characteristics', () => {
      const dataset = createSampleGoalsDataset(5);

      // Check that we have variety in categories
      const categories = dataset.map(goal => goal.category);
      const uniqueCategories = new Set(categories);
      expect(uniqueCategories.size).toBeGreaterThan(1);

      // Check that we have variety in priorities
      const priorities = dataset.map(goal => goal.priority);
      const uniquePriorities = new Set(priorities);
      expect(uniquePriorities.size).toBeGreaterThan(1);
    });
  });

  describe('createTestDataset', () => {
    test('should create a comprehensive test dataset', () => {
      const dataset = createTestDataset();

      expect(Array.isArray(dataset.goals)).toBe(true);
      expect(Array.isArray(dataset.completedGoals)).toBe(true);
      expect(Array.isArray(dataset.draftGoals)).toBe(true);
      expect(Array.isArray(dataset.overdueGoals)).toBe(true);

      expect(dataset.goals.length).toBeGreaterThan(0);
      expect(dataset.completedGoals.length).toBeGreaterThan(0);
      expect(dataset.draftGoals.length).toBeGreaterThan(0);
      expect(dataset.overdueGoals.length).toBeGreaterThan(0);
    });

    test('should have correct statuses for each dataset category', () => {
      const dataset = createTestDataset();

      dataset.completedGoals.forEach(goal => {
        expect(goal.status).toBe(GoalStatus.COMPLETED);
        expect(goal.progress).toBe(100);
        expect(goal.actualCompletionDate).toBeInstanceOf(Date);
      });

      dataset.draftGoals.forEach(goal => {
        expect(goal.status).toBe(GoalStatus.DRAFT);
        expect(goal.progress).toBe(0);
        expect(goal.actualStartDate).toBeUndefined();
      });

      dataset.overdueGoals.forEach(goal => {
        expect(goal.status).toBe(GoalStatus.OVERDUE);
        const now = new Date();
        expect(goal.timebound.targetDate.getTime()).toBeLessThan(now.getTime());
      });
    });
  });
});

describe('Data Structure Integrity', () => {
  test('should maintain referential integrity in complex goal structure', () => {
    const mockGoal = createMockSmartGoal();

    // Check that all tasks reference the correct goal
    mockGoal.tasks.forEach(task => {
      expect(task.goalId).toBe(mockGoal.id);

      // Check that all subtasks reference the correct task
      task.subtasks.forEach(subtask => {
        expect(subtask.taskId).toBe(task.id);
      });
    });

    // Check that all milestones reference the correct goal
    mockGoal.milestones.forEach(milestone => {
      expect(milestone.goalId).toBe(mockGoal.id);
    });

    // Check that all outcomes reference the correct goal
    mockGoal.outcomes.forEach(outcome => {
      expect(outcome.goalId).toBe(mockGoal.id);
    });

    // Check that all checkpoints reference the correct goal
    mockGoal.checkpoints.forEach(checkpoint => {
      expect(checkpoint.goalId).toBe(mockGoal.id);
    });
  });

  test('should have consistent timestamps', () => {
    const mockGoal = createMockSmartGoal();

    // createdAt should be before or equal to updatedAt
    expect(mockGoal.createdAt.getTime()).toBeLessThanOrEqual(
      mockGoal.updatedAt.getTime()
    );

    // If completed, actualCompletionDate should be after createdAt
    if (mockGoal.actualCompletionDate) {
      expect(mockGoal.actualCompletionDate.getTime()).toBeGreaterThanOrEqual(
        mockGoal.createdAt.getTime()
      );
    }

    // Target date should be after start date
    expect(mockGoal.timebound.targetDate.getTime()).toBeGreaterThan(
      mockGoal.timebound.startDate.getTime()
    );
  });

  test('should have logical completion states', () => {
    const completedGoal = createMockSmartGoal({
      status: GoalStatus.COMPLETED,
      progress: 100,
    });

    expect(completedGoal.status).toBe(GoalStatus.COMPLETED);
    expect(completedGoal.progress).toBe(100);

    // If completed, should have completion date
    if (completedGoal.actualCompletionDate) {
      expect(completedGoal.actualCompletionDate).toBeInstanceOf(Date);
    }
  });

  test('should have valid metric specifications', () => {
    const mockGoal = createMockSmartGoal();
    const measurable = mockGoal.measurable;

    expect(Object.values(MetricType)).toContain(measurable.metricType);
    expect(typeof measurable.targetValue).toBe('number');
    expect(typeof measurable.currentValue).toBe('number');
    expect(typeof measurable.unit).toBe('string');
    expect(measurable.unit.length).toBeGreaterThan(0);

    // If minimum/maximum values exist, they should be logical
    if (measurable.minimumValue !== undefined) {
      expect(measurable.minimumValue).toBeLessThanOrEqual(
        measurable.targetValue
      );
    }
    if (measurable.maximumValue !== undefined) {
      expect(measurable.maximumValue).toBeGreaterThanOrEqual(
        measurable.targetValue
      );
    }
  });

  test('should have valid assessment scores', () => {
    const mockGoal = createMockSmartGoal();

    // Achievability scores should be between 0 and 1
    expect(mockGoal.achievability.score).toBeGreaterThanOrEqual(0);
    expect(mockGoal.achievability.score).toBeLessThanOrEqual(1);
    expect(mockGoal.achievability.successProbability).toBeGreaterThanOrEqual(0);
    expect(mockGoal.achievability.successProbability).toBeLessThanOrEqual(1);
    expect(mockGoal.achievability.assessmentConfidence).toBeGreaterThanOrEqual(
      0
    );
    expect(mockGoal.achievability.assessmentConfidence).toBeLessThanOrEqual(1);

    // Relevance scores should be between 0 and 1
    expect(mockGoal.relevance.relevanceScore).toBeGreaterThanOrEqual(0);
    expect(mockGoal.relevance.relevanceScore).toBeLessThanOrEqual(1);
    expect(mockGoal.relevance.valueScore).toBeGreaterThanOrEqual(0);
    expect(mockGoal.relevance.valueScore).toBeLessThanOrEqual(1);
  });
});
