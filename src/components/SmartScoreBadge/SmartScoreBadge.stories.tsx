/**
 * Storybook stories for SmartScoreBadge component
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  SmartGoal,
  GoalStatus,
  GoalPriority,
  GoalCategory,
  MetricType,
  Frequency,
} from '@/types/smart-goals.types';

import { SmartScoreBadge } from './SmartScoreBadge';

// Mock base properties for all goals
const baseGoal: Partial<SmartGoal> = {
  id: 'test-goal-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  createdBy: 'user-1',
  updatedBy: 'user-1',
  status: GoalStatus.ACTIVE,
  priority: GoalPriority.HIGH,
  category: GoalCategory.PROFESSIONAL,
  tags: ['development', 'skills'],
  ownerId: 'user-1',
  collaborators: [],
  childGoalIds: [],
  tasks: [],
  milestones: [],
  outcomes: [],
  progress: 25,
  visibility: 'private' as const,
  isDeleted: false,
  isArchived: false,
};

// Perfect SMART goal (score: 100)
const perfectGoal: SmartGoal = {
  ...baseGoal,
  title: 'Complete Advanced React Certification',
  description:
    'Successfully complete the Advanced React Developer Certification course from Meta to enhance my frontend development skills and advance my career.',
  specificObjective:
    'Pass the Meta Advanced React Developer Certification exam with a score of 85% or higher within 3 months.',
  successCriteria: [
    'Complete all course modules with 90% or higher scores',
    'Pass the final certification exam with 85% minimum score',
    'Build and deploy a portfolio project using advanced React concepts',
    'Update LinkedIn profile with the new certification',
  ],
  measurable: {
    metricType: MetricType.PERCENTAGE,
    targetValue: 85,
    currentValue: 0,
    unit: '%',
    minimumValue: 85,
    maximumValue: 100,
    higherIsBetter: true,
    calculationMethod: 'Certification exam score',
    dataSource: 'Meta Learning Platform',
    measurementFrequency: Frequency.WEEKLY,
  },
  checkpoints: [],
  achievability: {
    score: 0.8,
    requiredResources: [
      {
        id: 'time-resource',
        name: 'Study Time',
        type: 'time',
        quantity: 120,
        unit: 'hours',
        isAvailable: true,
        description: 'Dedicated study time over 3 months',
      },
      {
        id: 'course-resource',
        name: 'Course Access',
        type: 'subscription',
        quantity: 1,
        unit: 'course',
        isAvailable: true,
        acquisitionCost: 299,
        description: 'Meta Advanced React Course subscription',
      },
    ],
    requiredSkills: [
      {
        id: 'react-basics',
        name: 'React Fundamentals',
        requiredLevel: 8,
        currentLevel: 7,
        isCritical: true,
        developmentPlan:
          'Review React documentation and complete practice projects',
        timeToAcquire: 20,
      },
      {
        id: 'javascript-advanced',
        name: 'Advanced JavaScript',
        requiredLevel: 8,
        currentLevel: 8,
        isCritical: true,
      },
    ],
    constraints: [],
    riskAssessment:
      'Low risk with adequate time allocation and current skill level',
    successProbability: 0.85,
    assessmentConfidence: 0.9,
    lastAssessedAt: new Date('2024-01-01'),
    assessedBy: 'user-1',
  },
  relevance: {
    rationale:
      'This certification will significantly enhance my React skills, making me more valuable in my current role and opening up senior developer opportunities.',
    strategyAlignments: [
      {
        strategicGoalId: 'career-advancement-2024',
        alignmentDescription:
          'Directly supports career advancement goals for 2024',
        alignmentStrength: 0.9,
        expectedContribution:
          'Increase in technical expertise and market value',
      },
    ],
    stakeholders: [
      {
        id: 'manager',
        name: 'John Smith',
        role: 'Engineering Manager',
        influence: 0.8,
        interest: 0.9,
        expectedImpact: 'Increased team capability and project delivery',
        stance: 'supportive',
        contact: 'john.smith@company.com',
      },
      {
        id: 'team',
        name: 'Development Team',
        role: 'Colleagues',
        influence: 0.6,
        interest: 0.7,
        expectedImpact: 'Knowledge sharing and improved code quality',
        stance: 'supportive',
      },
    ],
    expectedBenefits: [
      'Enhanced React expertise',
      'Career advancement opportunities',
      'Salary increase potential',
      'Improved project delivery capability',
    ],
    risksOfNotAchieving: [
      'Missed promotion opportunity',
      'Falling behind in technical skills',
      'Reduced market competitiveness',
    ],
    relevanceScore: 0.9,
    valueScore: 0.85,
    lastReviewedAt: new Date('2024-01-01'),
    reviewedBy: 'user-1',
  },
  timebound: {
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-04-01'),
    estimatedDuration: 90,
    bufferDays: 15,
    isRecurring: false,
    dependencies: [],
    timeZone: 'America/New_York',
  },
} as SmartGoal;

// Good SMART goal (score: 75-85)
const goodGoal: SmartGoal = {
  ...perfectGoal,
  title: 'Learn TypeScript',
  description: 'Learn TypeScript to improve code quality',
  specificObjective: 'Complete TypeScript course',
  successCriteria: ['Finish course', 'Build a project'],
  achievability: {
    ...perfectGoal.achievability,
    score: 0.7,
    requiredResources: [perfectGoal.achievability.requiredResources[0]], // Missing course resource
    requiredSkills: [], // Missing skills assessment
  },
  relevance: {
    ...perfectGoal.relevance,
    relevanceScore: 0.6,
    stakeholders: [], // Missing stakeholders
  },
};

// Fair SMART goal (score: 50-65)
const fairGoal: SmartGoal = {
  ...perfectGoal,
  title: 'Get better at coding',
  description: 'Improve my programming skills',
  specificObjective: '', // Missing specific objective
  successCriteria: [], // Missing success criteria
  measurable: {
    ...perfectGoal.measurable,
    targetValue: 0, // Missing target
    unit: '', // Missing unit
  },
  achievability: {
    ...perfectGoal.achievability,
    score: 0.4,
    requiredResources: [], // Missing resources
    requiredSkills: [], // Missing skills
  },
  relevance: {
    ...perfectGoal.relevance,
    rationale: '', // Missing rationale
    relevanceScore: 0.4,
    stakeholders: [], // Missing stakeholders
  },
};

// Poor SMART goal (score: 0-40)
const poorGoal: SmartGoal = {
  ...perfectGoal,
  title: '', // Missing title
  description: '', // Missing description
  specificObjective: '', // Missing specific objective
  successCriteria: [], // Missing success criteria
  measurable: {
    metricType: MetricType.NUMBER,
    targetValue: 0, // Missing target
    currentValue: 0,
    unit: '', // Missing unit
    higherIsBetter: true,
    measurementFrequency: Frequency.ONCE,
  },
  achievability: {
    score: 0.2,
    requiredResources: [], // Missing resources
    requiredSkills: [], // Missing skills
    constraints: [],
    riskAssessment: '',
    successProbability: 0.3,
    assessmentConfidence: 0.5,
    lastAssessedAt: new Date('2024-01-01'),
    assessedBy: 'user-1',
  },
  relevance: {
    rationale: '', // Missing rationale
    strategyAlignments: [],
    stakeholders: [], // Missing stakeholders
    expectedBenefits: [],
    risksOfNotAchieving: [],
    relevanceScore: 0.2,
    valueScore: 0.2,
    lastReviewedAt: new Date('2024-01-01'),
    reviewedBy: 'user-1',
  },
  timebound: {
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-01-01'), // Same start and end date
    estimatedDuration: 0, // Missing duration
    isRecurring: false,
  },
};

const meta: Meta<typeof SmartScoreBadge> = {
  title: 'Components/SmartScoreBadge',
  component: SmartScoreBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A badge component that displays SMART goal scores with visual feedback and detailed tooltips.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    goal: {
      description: 'The SMART goal to calculate and display the score for',
      control: false,
    },
    size: {
      description: 'Size variant of the badge',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showTooltip: {
      description: 'Whether to show the tooltip with score breakdown',
      control: 'boolean',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    onScoreCalculated: {
      description: 'Callback when score is calculated',
      action: 'scoreCalculated',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with perfect goal
export const Default: Story = {
  args: {
    goal: perfectGoal,
    size: 'md',
    showTooltip: true,
  },
};

// Score range examples
export const ExcellentScore: Story = {
  args: {
    goal: perfectGoal,
    size: 'md',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Badge showing an excellent SMART score (80-100). Displays green color with a star icon.',
      },
    },
  },
};

export const GoodScore: Story = {
  args: {
    goal: goodGoal,
    size: 'md',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Badge showing a good SMART score (60-79). Displays yellow color with a diamond icon.',
      },
    },
  },
};

export const FairScore: Story = {
  args: {
    goal: fairGoal,
    size: 'md',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Badge showing a fair SMART score (40-59). Displays orange color with a triangle icon.',
      },
    },
  },
};

export const PoorScore: Story = {
  args: {
    goal: poorGoal,
    size: 'md',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Badge showing a poor SMART score (0-39). Displays red color with a circle icon.',
      },
    },
  },
};

// Size variants
export const SmallSize: Story = {
  args: {
    goal: perfectGoal,
    size: 'sm',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Small size variant of the badge. Compact design for space-constrained layouts.',
      },
    },
  },
};

export const MediumSize: Story = {
  args: {
    goal: perfectGoal,
    size: 'md',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Medium size variant (default). Balanced size for most use cases.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    goal: perfectGoal,
    size: 'lg',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Large size variant. Includes category text and larger icons for prominent display.',
      },
    },
  },
};

// Tooltip functionality
export const WithTooltip: Story = {
  args: {
    goal: goodGoal,
    size: 'md',
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Badge with detailed tooltip showing score breakdown and improvement suggestions. Hover to see the tooltip.',
      },
    },
  },
};

export const WithoutTooltip: Story = {
  args: {
    goal: perfectGoal,
    size: 'md',
    showTooltip: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Badge without tooltip. Simple display mode for when detailed breakdown is not needed.',
      },
    },
  },
};

// Interactive example with all sizes and scores
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Score Ranges</h3>
        <div className="flex flex-wrap items-center gap-4">
          <SmartScoreBadge goal={perfectGoal} size="md" />
          <SmartScoreBadge goal={goodGoal} size="md" />
          <SmartScoreBadge goal={fairGoal} size="md" />
          <SmartScoreBadge goal={poorGoal} size="md" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Size Variants</h3>
        <div className="flex flex-wrap items-center gap-4">
          <SmartScoreBadge goal={perfectGoal} size="sm" />
          <SmartScoreBadge goal={perfectGoal} size="md" />
          <SmartScoreBadge goal={perfectGoal} size="lg" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">With and Without Tooltip</h3>
        <div className="flex flex-wrap items-center gap-4">
          <SmartScoreBadge goal={goodGoal} size="md" showTooltip={true} />
          <SmartScoreBadge goal={goodGoal} size="md" showTooltip={false} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive overview of all badge variants including different scores, sizes, and tooltip states.',
      },
    },
  },
};

// Real-world usage examples
export const InGoalList: Story = {
  render: () => (
    <div className="max-w-md space-y-3">
      {[perfectGoal, goodGoal, fairGoal, poorGoal].map((goal, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-medium">
              {goal.title || 'Untitled Goal'}
            </h4>
            <p className="text-muted-foreground truncate text-sm">
              {goal.description || 'No description'}
            </p>
          </div>
          <SmartScoreBadge goal={goal} size="sm" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example of how the badge might appear in a goal list or dashboard.',
      },
    },
  },
};

export const InGoalCard: Story = {
  render: () => (
    <div className="max-w-sm space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{perfectGoal.title}</h3>
        <SmartScoreBadge goal={perfectGoal} size="md" />
      </div>
      <p className="text-muted-foreground text-sm">{perfectGoal.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Due: April 1, 2024</span>
        <span className="text-muted-foreground">Progress: 25%</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of the badge integrated into a goal card component.',
      },
    },
  },
};
