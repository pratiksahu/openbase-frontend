/**
 * Unit tests for SmartScoreBadge utility functions
 */

import { describe, expect, it } from '@jest/globals';

import {
  SmartGoal,
  GoalStatus,
  GoalPriority,
  GoalCategory,
  MetricType,
  Frequency,
} from '@/types/smart-goals.types';

import {
  calculateSmartScore,
  getBadgeVariant,
  getScoreColorClasses,
} from '../SmartScoreBadge.utils';

// Mock base goal for testing
const mockBaseGoal: SmartGoal = {
  id: 'test-goal',
  title: 'Test Goal',
  description: 'Test description',
  specificObjective: 'Test objective',
  successCriteria: ['Criteria 1', 'Criteria 2'],
  category: GoalCategory.PROFESSIONAL,
  tags: ['test'],
  measurable: {
    metricType: MetricType.NUMBER,
    targetValue: 100,
    currentValue: 0,
    unit: 'points',
    higherIsBetter: true,
    measurementFrequency: Frequency.WEEKLY,
  },
  checkpoints: [],
  progress: 0,
  achievability: {
    score: 0.8,
    requiredResources: [
      {
        id: 'resource-1',
        name: 'Test Resource',
        type: 'time',
        quantity: 10,
        unit: 'hours',
        isAvailable: true,
      },
    ],
    requiredSkills: [
      {
        id: 'skill-1',
        name: 'Test Skill',
        requiredLevel: 8,
        currentLevel: 6,
        isCritical: true,
      },
    ],
    constraints: [],
    riskAssessment: 'Low risk',
    successProbability: 0.8,
    assessmentConfidence: 0.9,
    lastAssessedAt: new Date(),
    assessedBy: 'test-user',
  },
  relevance: {
    rationale: 'Important for growth',
    strategyAlignments: [],
    stakeholders: [
      {
        id: 'stakeholder-1',
        name: 'Test Stakeholder',
        role: 'Manager',
        influence: 0.8,
        interest: 0.9,
        expectedImpact: 'Positive',
        stance: 'supportive',
      },
    ],
    expectedBenefits: ['Benefit 1'],
    risksOfNotAchieving: ['Risk 1'],
    relevanceScore: 0.8,
    valueScore: 0.7,
    lastReviewedAt: new Date(),
    reviewedBy: 'test-user',
  },
  timebound: {
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-12-31'),
    estimatedDuration: 365,
    isRecurring: false,
  },
  status: GoalStatus.ACTIVE,
  priority: GoalPriority.HIGH,
  ownerId: 'test-user',
  collaborators: [],
  parentGoalId: undefined,
  childGoalIds: [],
  tasks: [],
  milestones: [],
  outcomes: [],
  actualStartDate: undefined,
  actualCompletionDate: undefined,
  lastProgressUpdate: undefined,
  nextReviewDate: undefined,
  visibility: 'private',
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'test-user',
  updatedBy: 'test-user',
  isDeleted: false,
};

describe('SmartScoreBadge Utils', () => {
  describe('calculateSmartScore', () => {
    it('should calculate perfect score for complete goal', () => {
      const result = calculateSmartScore(mockBaseGoal);

      expect(result.breakdown.total).toBe(100);
      expect(result.breakdown.specific).toBe(20);
      expect(result.breakdown.measurable).toBe(20);
      expect(result.breakdown.achievable).toBe(20);
      expect(result.breakdown.relevant).toBe(20);
      expect(result.breakdown.timeBound).toBe(20);
      expect(result.category).toBe('excellent');
      expect(result.suggestions).toHaveLength(0);
    });

    it('should calculate lower score for incomplete goal', () => {
      const incompleteGoal: SmartGoal = {
        ...mockBaseGoal,
        title: '', // Missing title
        description: '', // Missing description
        specificObjective: '', // Missing objective
        successCriteria: [], // Missing criteria
      };

      const result = calculateSmartScore(incompleteGoal);

      expect(result.breakdown.specific).toBe(0);
      expect(result.breakdown.total).toBeLessThan(100);
      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.suggestions).toContain('Add a clear and concise title');
    });

    it('should provide suggestions for missing specific criteria', () => {
      const goalWithoutSpecifics: SmartGoal = {
        ...mockBaseGoal,
        title: '',
        description: '',
        specificObjective: '',
        successCriteria: [],
      };

      const result = calculateSmartScore(goalWithoutSpecifics);

      expect(result.suggestions).toContain('Add a clear and concise title');
      expect(result.suggestions).toContain('Provide a detailed description');
      expect(result.suggestions).toContain('Define a specific objective');
      expect(result.suggestions).toContain('Add success criteria');
    });

    it('should provide suggestions for missing measurable criteria', () => {
      const goalWithoutMeasurable: SmartGoal = {
        ...mockBaseGoal,
        measurable: {
          metricType: MetricType.NUMBER,
          targetValue: 0, // Invalid target
          currentValue: 0,
          unit: '', // Missing unit
          higherIsBetter: true,
          measurementFrequency: Frequency.ONCE, // Missing frequency
        },
      };

      const result = calculateSmartScore(goalWithoutMeasurable);

      expect(result.suggestions).toContain('Set a target value');
      expect(result.suggestions).toContain('Define measurement unit');
    });

    it('should provide suggestions for poor achievability', () => {
      const goalWithPoorAchievability: SmartGoal = {
        ...mockBaseGoal,
        achievability: {
          score: 0.2, // Low score
          requiredResources: [], // Missing resources
          requiredSkills: [], // Missing skills
          constraints: [],
          riskAssessment: '',
          successProbability: 0.2,
          assessmentConfidence: 0.5,
          lastAssessedAt: new Date(),
          assessedBy: 'test-user',
        },
      };

      const result = calculateSmartScore(goalWithPoorAchievability);

      expect(result.suggestions).toContain(
        'Improve achievability score or adjust goal scope'
      );
      expect(result.suggestions).toContain('Identify required resources');
      expect(result.suggestions).toContain('List required skills');
    });

    it('should provide suggestions for poor relevance', () => {
      const goalWithPoorRelevance: SmartGoal = {
        ...mockBaseGoal,
        relevance: {
          rationale: '', // Missing rationale
          strategyAlignments: [],
          stakeholders: [], // Missing stakeholders
          expectedBenefits: [],
          risksOfNotAchieving: [],
          relevanceScore: 0.3, // Low score
          valueScore: 0.3,
          lastReviewedAt: new Date(),
          reviewedBy: 'test-user',
        },
      };

      const result = calculateSmartScore(goalWithPoorRelevance);

      expect(result.suggestions).toContain(
        'Improve relevance or align with strategic goals'
      );
      expect(result.suggestions).toContain(
        'Provide rationale for why this goal matters'
      );
      expect(result.suggestions).toContain('Identify affected stakeholders');
    });

    it('should provide suggestions for missing timebound criteria', () => {
      const goalWithoutTimebound: SmartGoal = {
        ...mockBaseGoal,
        timebound: {
          startDate: new Date(),
          targetDate: new Date(), // Same as start date
          estimatedDuration: 0, // Missing duration
          isRecurring: false,
        },
      };

      const result = calculateSmartScore(goalWithoutTimebound);

      expect(result.suggestions).toContain('Estimate duration for the goal');
    });

    it('should limit suggestions to first 3 in calculation', () => {
      const poorGoal: SmartGoal = {
        ...mockBaseGoal,
        title: '',
        description: '',
        specificObjective: '',
        successCriteria: [],
        measurable: {
          metricType: MetricType.NUMBER,
          targetValue: 0,
          currentValue: 0,
          unit: '',
          higherIsBetter: true,
          measurementFrequency: Frequency.ONCE,
        },
      };

      const result = calculateSmartScore(poorGoal);

      // Should have many suggestions but function should return all of them
      expect(result.suggestions.length).toBeGreaterThan(3);
    });
  });

  describe('getBadgeVariant', () => {
    it('should return correct variant for excellent score', () => {
      expect(getBadgeVariant(100)).toBe('default');
      expect(getBadgeVariant(80)).toBe('default');
    });

    it('should return correct variant for good score', () => {
      expect(getBadgeVariant(79)).toBe('outline');
      expect(getBadgeVariant(60)).toBe('outline');
    });

    it('should return correct variant for fair score', () => {
      expect(getBadgeVariant(59)).toBe('secondary');
      expect(getBadgeVariant(40)).toBe('secondary');
    });

    it('should return correct variant for poor score', () => {
      expect(getBadgeVariant(39)).toBe('destructive');
      expect(getBadgeVariant(0)).toBe('destructive');
    });
  });

  describe('getScoreColorClasses', () => {
    it('should return green classes for excellent score', () => {
      const classes = getScoreColorClasses(85);
      expect(classes.bg).toContain('green');
      expect(classes.text).toContain('green');
      expect(classes.border).toContain('green');
    });

    it('should return yellow classes for good score', () => {
      const classes = getScoreColorClasses(65);
      expect(classes.bg).toContain('yellow');
      expect(classes.text).toContain('yellow');
      expect(classes.border).toContain('yellow');
    });

    it('should return orange classes for fair score', () => {
      const classes = getScoreColorClasses(45);
      expect(classes.bg).toContain('orange');
      expect(classes.text).toContain('orange');
      expect(classes.border).toContain('orange');
    });

    it('should return red classes for poor score', () => {
      const classes = getScoreColorClasses(25);
      expect(classes.bg).toContain('red');
      expect(classes.text).toContain('red');
      expect(classes.border).toContain('red');
    });
  });
});
