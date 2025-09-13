/**
 * Unit tests for SmartScoreBadge component
 */

import React from 'react';

import { render, screen } from '@/test-utils';
import {
  SmartGoal,
  GoalStatus,
  GoalPriority,
  GoalCategory,
  MetricType,
  Frequency,
} from '@/types/smart-goals.types';

import { SmartScoreBadge } from '../SmartScoreBadge';

// Mock the tooltip components since they might have complex dependencies
jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TooltipTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (asChild ? children : <div>{children}</div>),
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));

// Mock base goal for testing
const mockPerfectGoal: SmartGoal = {
  id: 'test-goal',
  title: 'Complete React Certification',
  description: 'Complete the Advanced React Developer Certification course',
  specificObjective: 'Pass the certification exam with 85% or higher score',
  successCriteria: [
    'Complete all modules',
    'Pass final exam',
    'Build portfolio project',
  ],
  category: GoalCategory.PROFESSIONAL,
  tags: ['development'],
  measurable: {
    metricType: MetricType.PERCENTAGE,
    targetValue: 85,
    currentValue: 0,
    unit: '%',
    higherIsBetter: true,
    measurementFrequency: Frequency.WEEKLY,
  },
  checkpoints: [],
  progress: 25,
  achievability: {
    score: 0.8,
    requiredResources: [
      {
        id: 'resource-1',
        name: 'Study Time',
        type: 'time',
        quantity: 120,
        unit: 'hours',
        isAvailable: true,
      },
    ],
    requiredSkills: [
      {
        id: 'skill-1',
        name: 'React Fundamentals',
        requiredLevel: 8,
        currentLevel: 7,
        isCritical: true,
      },
    ],
    constraints: [],
    riskAssessment: 'Low risk',
    successProbability: 0.85,
    assessmentConfidence: 0.9,
    lastAssessedAt: new Date(),
    assessedBy: 'test-user',
  },
  relevance: {
    rationale: 'Essential for career advancement',
    strategyAlignments: [],
    stakeholders: [
      {
        id: 'stakeholder-1',
        name: 'Manager',
        role: 'Engineering Manager',
        influence: 0.8,
        interest: 0.9,
        expectedImpact: 'Increased team capability',
        stance: 'supportive',
      },
    ],
    expectedBenefits: ['Enhanced skills', 'Career advancement'],
    risksOfNotAchieving: ['Missed promotion'],
    relevanceScore: 0.9,
    valueScore: 0.85,
    lastReviewedAt: new Date(),
    reviewedBy: 'test-user',
  },
  timebound: {
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-04-01'),
    estimatedDuration: 90,
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
  visibility: 'private',
  isArchived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'test-user',
  updatedBy: 'test-user',
  isDeleted: false,
};

const mockPoorGoal: SmartGoal = {
  ...mockPerfectGoal,
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
  achievability: {
    score: 0.2,
    requiredResources: [],
    requiredSkills: [],
    constraints: [],
    riskAssessment: '',
    successProbability: 0.3,
    assessmentConfidence: 0.5,
    lastAssessedAt: new Date(),
    assessedBy: 'test-user',
  },
  relevance: {
    rationale: '',
    strategyAlignments: [],
    stakeholders: [],
    expectedBenefits: [],
    risksOfNotAchieving: [],
    relevanceScore: 0.2,
    valueScore: 0.2,
    lastReviewedAt: new Date(),
    reviewedBy: 'test-user',
  },
  timebound: {
    startDate: new Date(),
    targetDate: new Date(),
    estimatedDuration: 0,
    isRecurring: false,
  },
};

describe('SmartScoreBadge', () => {
  it('renders with perfect score', () => {
    render(<SmartScoreBadge goal={mockPerfectGoal} />);

    // Should display 100/100 for perfect goal
    const scoreElement = screen.getByText('100/100');
    expect(scoreElement).toBeTruthy();

    // Should show star icon for excellent score
    const starIcon = screen.getByText('★');
    expect(starIcon).toBeTruthy();
  });

  it('renders with poor score', () => {
    render(<SmartScoreBadge goal={mockPoorGoal} />);

    // Should show circle icon for poor score
    const circleIcon = screen.getByText('●');
    expect(circleIcon).toBeTruthy();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(
      <SmartScoreBadge goal={mockPerfectGoal} size="sm" />
    );

    // Small size should not show /100
    const smallScore = screen.getByText('100');
    expect(smallScore).toBeTruthy();

    const fullScore = screen.queryByText('100/100');
    expect(fullScore).toBeFalsy();

    rerender(<SmartScoreBadge goal={mockPerfectGoal} size="lg" />);

    // Large size should show category text in the badge (look for the exact class)
    const badge = document.querySelector('.uppercase.tracking-wider');
    expect(badge).toBeTruthy();
    expect(badge?.textContent?.toLowerCase()).toBe('excellent');
  });

  it('calls onScoreCalculated callback', () => {
    const mockCallback = jest.fn();

    render(
      <SmartScoreBadge
        goal={mockPerfectGoal}
        onScoreCalculated={mockCallback}
      />
    );

    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        breakdown: expect.objectContaining({
          total: 100,
          specific: 20,
          measurable: 20,
          achievable: 20,
          relevant: 20,
          timeBound: 20,
        }),
        category: 'excellent',
        suggestions: [],
      })
    );
  });

  it('renders with tooltip content when showTooltip is true', () => {
    render(<SmartScoreBadge goal={mockPoorGoal} showTooltip={true} />);

    // Should have tooltip content rendered
    const tooltipContent = screen.getByTestId('tooltip-content');
    expect(tooltipContent).toBeTruthy();
  });

  it('displays correct score breakdown in tooltip', () => {
    render(<SmartScoreBadge goal={mockPerfectGoal} showTooltip={true} />);

    const tooltipContent = screen.getByTestId('tooltip-content');

    // Should show SMART breakdown
    expect(tooltipContent.textContent).toContain('SMART Score: 100/100');
    expect(tooltipContent.textContent).toContain('Excellent goal definition!');
    expect(tooltipContent.textContent).toContain('Specific');
    expect(tooltipContent.textContent).toContain('Measurable');
    expect(tooltipContent.textContent).toContain('Achievable');
    expect(tooltipContent.textContent).toContain('Relevant');
    expect(tooltipContent.textContent).toContain('Time-bound');
  });

  it('displays suggestions in tooltip for poor goals', () => {
    render(<SmartScoreBadge goal={mockPoorGoal} showTooltip={true} />);

    const tooltipContent = screen.getByTestId('tooltip-content');

    // Should show suggestions section
    expect(tooltipContent.textContent).toContain('Suggestions:');
    expect(tooltipContent.textContent).toContain(
      'Add a clear and concise title'
    );
  });

  it('applies custom className', () => {
    const { container } = render(
      <SmartScoreBadge goal={mockPerfectGoal} className="custom-class" />
    );

    const badge = container.querySelector('.custom-class');
    expect(badge).toBeTruthy();
  });

  it('handles edge cases with missing goal data gracefully', () => {
    const incompleteGoal = {
      ...mockPerfectGoal,
      achievability: undefined as unknown as SmartGoal['achievability'],
      relevance: undefined as unknown as SmartGoal['relevance'],
      timebound: undefined as unknown as SmartGoal['timebound'],
    } as SmartGoal;

    // Should not crash with incomplete data
    expect(() => {
      render(<SmartScoreBadge goal={incompleteGoal} />);
    }).not.toThrow();
  });

  it('updates when goal prop changes', () => {
    const { rerender } = render(<SmartScoreBadge goal={mockPerfectGoal} />);

    const perfectScore = screen.getByText('100/100');
    expect(perfectScore).toBeTruthy();

    rerender(<SmartScoreBadge goal={mockPoorGoal} />);

    // Should update to show poor score
    const poorScore = screen.queryByText('100/100');
    expect(poorScore).toBeFalsy();
  });
});
