/**
 * BreakdownTree Storybook Stories
 *
 * Comprehensive stories demonstrating all features and use cases
 * of the BreakdownTree component.
 *
 * @fileoverview Storybook stories for BreakdownTree component
 * @version 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  type SmartGoal,
  type Task,
  type Milestone,
  type Outcome,
  GoalCategory,
  GoalStatus,
  GoalPriority,
  TaskStatus,
  MetricType,
  Frequency,
} from '@/types/smart-goals.types';

import { BreakdownTree } from './BreakdownTree';
import { SelectionMode } from './BreakdownTree.types';

// =============================================================================
// Meta Configuration
// =============================================================================

const meta: Meta<typeof BreakdownTree> = {
  title: 'Components/BreakdownTree',
  component: BreakdownTree,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A hierarchical tree component for visualizing and managing SMART goals breakdown structure.

## Features

- **Hierarchical Visualization**: Display goals, milestones, tasks, and outcomes in a tree structure
- **Drag & Drop**: Reorder and restructure nodes with visual feedback
- **Search & Filter**: Find nodes by text, type, status, priority, or progress
- **Keyboard Navigation**: Full keyboard accessibility with arrow keys
- **Selection**: Single or multi-select with visual feedback
- **Actions**: Context menus with operations like edit, duplicate, delete
- **Animations**: Smooth expand/collapse and drag animations
- **Accessibility**: Full ARIA support and keyboard navigation

## Node Types

- **Goal**: Top-level SMART goals that can contain sub-goals
- **Outcome**: Expected results from goal achievement
- **Milestone**: Key checkpoints with deadlines
- **Task**: Actionable items that can have subtasks
- **Subtask**: Smaller units of work within tasks

## Usage

\`\`\`tsx
import { BreakdownTree } from '@/components/BreakdownTree';

<BreakdownTree
  initialData={goals}
  config={{
    enableDragDrop: true,
    enableSearch: true,
    selectionMode: SelectionMode.MULTIPLE,
  }}
  onNodeSelect={() => {}}
  onTreeChange={() => {}}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    initialData: {
      description: 'Initial tree data (goals, tasks, milestones, outcomes)',
      control: false,
    },
    config: {
      description: 'Tree configuration options',
      control: 'object',
    },
    onNodeSelect: {
      description: 'Callback when nodes are selected',
      action: 'nodeSelect',
    },
    onNodeUpdate: {
      description: 'Callback when a node is updated',
      action: 'nodeUpdate',
    },
    onNodeMove: {
      description: 'Callback when a node is moved',
      action: 'nodeMove',
    },
    onNodeCreate: {
      description: 'Callback when a node is created',
      action: 'nodeCreate',
    },
    onNodeDelete: {
      description: 'Callback when a node is deleted',
      action: 'nodeDelete',
    },
    onTreeChange: {
      description: 'Callback when tree structure changes',
      action: 'treeChange',
    },
    isLoading: {
      description: 'Show loading state',
      control: 'boolean',
    },
    error: {
      description: 'Error message to display',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BreakdownTree>;

// =============================================================================
// Mock Data
// =============================================================================

const mockGoals: SmartGoal[] = [
  {
    // Base entity fields
    id: 'goal-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'user-1',
    updatedBy: 'user-1',

    // Specific fields
    title: 'Launch Product Beta',
    description: 'Successfully launch the beta version of our new product',
    specificObjective:
      'Launch a fully functional beta version with core features',
    successCriteria: [
      'Beta version deployed to production',
      '50+ beta users registered',
      'Core features working without critical bugs',
    ],
    category: GoalCategory.PROFESSIONAL,
    tags: ['product', 'launch', 'beta'],

    // Measurable
    measurable: {
      metricType: MetricType.PERCENTAGE,
      targetValue: 100,
      currentValue: 75,
      unit: '%',
      higherIsBetter: true,
      measurementFrequency: Frequency.WEEKLY,
    },

    // Achievable
    achievability: {
      score: 0.8,
      requiredResources: [],
      requiredSkills: [],
      constraints: [],
      riskAssessment: 'Medium risk due to tight timeline',
      successProbability: 0.8,
      assessmentConfidence: 0.7,
      lastAssessedAt: new Date('2024-01-01'),
      assessedBy: 'user-1',
    },

    // Relevant
    relevance: {
      rationale: 'Critical for market validation and user feedback',
      strategyAlignments: [],
      stakeholders: [],
      expectedBenefits: ['User feedback', 'Market validation'],
      risksOfNotAchieving: ['Missed market opportunity'],
      relevanceScore: 0.9,
      valueScore: 0.8,
      lastReviewedAt: new Date('2024-01-01'),
      reviewedBy: 'user-1',
    },

    // Time-bound
    timebound: {
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-03-01'),
      estimatedDuration: 60,
      isRecurring: false,
    },

    // Management
    status: GoalStatus.ACTIVE,
    priority: GoalPriority.HIGH,
    progress: 75,
    ownerId: 'user-1',
    collaborators: ['user-2'],
    parentGoalId: undefined,
    childGoalIds: [],

    // Execution
    tasks: [],
    milestones: [],
    outcomes: [],
    checkpoints: [],

    // Metadata
    visibility: 'team',
    isArchived: false,
    isDeleted: false,
    comments: [],
  },
  {
    // Second goal
    id: 'goal-2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    title: 'Improve User Onboarding',
    description: 'Enhance the user onboarding experience to increase retention',
    specificObjective: 'Reduce onboarding drop-off rate by 50%',
    successCriteria: ['Drop-off rate below 25%', 'User feedback score > 4.0'],
    category: GoalCategory.PROFESSIONAL,
    tags: ['ux', 'onboarding', 'retention'],
    measurable: {
      metricType: MetricType.PERCENTAGE,
      targetValue: 50,
      currentValue: 30,
      unit: '% reduction',
      higherIsBetter: true,
      measurementFrequency: Frequency.WEEKLY,
    },
    achievability: {
      score: 0.7,
      requiredResources: [],
      requiredSkills: [],
      constraints: [],
      riskAssessment: 'Low risk',
      successProbability: 0.7,
      assessmentConfidence: 0.8,
      lastAssessedAt: new Date('2024-01-10'),
      assessedBy: 'user-1',
    },
    relevance: {
      rationale: 'Critical for user retention and growth',
      strategyAlignments: [],
      stakeholders: [],
      expectedBenefits: ['Higher retention', 'Better UX'],
      risksOfNotAchieving: ['User churn'],
      relevanceScore: 0.8,
      valueScore: 0.9,
      lastReviewedAt: new Date('2024-01-10'),
      reviewedBy: 'user-1',
    },
    timebound: {
      startDate: new Date('2024-01-15'),
      targetDate: new Date('2024-02-15'),
      estimatedDuration: 30,
      isRecurring: false,
    },
    status: GoalStatus.ACTIVE,
    priority: GoalPriority.MEDIUM,
    progress: 30,
    ownerId: 'user-1',
    collaborators: [],
    parentGoalId: undefined,
    childGoalIds: [],
    tasks: [],
    milestones: [],
    outcomes: [],
    checkpoints: [],
    visibility: 'team',
    isArchived: false,
    isDeleted: false,
    comments: [],
  },
];

const mockTasks: Task[] = [
  {
    id: 'task-1',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    title: 'Set up CI/CD Pipeline',
    description: 'Configure automated build and deployment pipeline',
    status: TaskStatus.IN_PROGRESS,
    priority: GoalPriority.HIGH,
    progress: 60,
    subtasks: [],
    checklist: [],
    goalId: 'goal-1',
    order: 0,
    isDeleted: false,
    comments: [],
  },
  {
    id: 'task-2',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-17'),
    createdBy: 'user-2',
    updatedBy: 'user-2',
    title: 'Create Landing Page',
    description: 'Design and implement beta signup landing page',
    status: TaskStatus.COMPLETED,
    priority: GoalPriority.HIGH,
    progress: 100,
    subtasks: [],
    checklist: [],
    goalId: 'goal-1',
    order: 1,
    isDeleted: false,
    comments: [],
  },
  {
    id: 'task-3',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-21'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    title: 'Redesign Onboarding Flow',
    description: 'Create new user-friendly onboarding wireframes',
    status: TaskStatus.TODO,
    priority: GoalPriority.MEDIUM,
    progress: 0,
    subtasks: [],
    checklist: [],
    goalId: 'goal-2',
    order: 0,
    isDeleted: false,
    comments: [],
  },
];

const mockMilestones: Milestone[] = [
  {
    id: 'milestone-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    title: 'MVP Ready for Testing',
    description: 'Core features implemented and ready for internal testing',
    targetDate: new Date('2024-02-01'),
    isCompleted: false,
    successCriteria: ['All core features working', 'No critical bugs'],
    progress: 80,
    priority: GoalPriority.HIGH,
    taskIds: ['task-1', 'task-2'],
    goalId: 'goal-1',
    order: 0,
    isCritical: true,
    isDeleted: false,
    comments: [],
  },
];

const mockOutcomes: Outcome[] = [
  {
    id: 'outcome-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    description: 'Increased user engagement by 25%',
    type: 'primary',
    impactLevel: 8,
    probability: 0.7,
    goalId: 'goal-1',
  },
  {
    id: 'outcome-2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    description: 'Reduced support tickets by 30%',
    type: 'secondary',
    impactLevel: 6,
    probability: 0.8,
    goalId: 'goal-2',
  },
];

const allMockData = [
  ...mockGoals,
  ...mockTasks,
  ...mockMilestones,
  ...mockOutcomes,
];

// Large dataset for performance testing
const generateLargeDataset = (nodeCount: number) => {
  const data: any[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const isGoal = i % 10 === 0;
    const isMilestone = i % 15 === 0;
    const isOutcome = i % 20 === 0;

    if (isGoal) {
      data.push({
        ...mockGoals[0],
        id: `goal-${i}`,
        title: `Goal ${i}`,
        progress: Math.floor(Math.random() * 100),
        status: ['draft', 'active', 'completed'][Math.floor(Math.random() * 3)],
        priority: ['low', 'medium', 'high', 'critical'][
          Math.floor(Math.random() * 4)
        ],
      });
    } else if (isMilestone && !isOutcome) {
      data.push({
        ...mockMilestones[0],
        id: `milestone-${i}`,
        title: `Milestone ${i}`,
        goalId: `goal-${Math.floor(i / 10) * 10}`,
        progress: Math.floor(Math.random() * 100),
      });
    } else if (isOutcome) {
      data.push({
        ...mockOutcomes[0],
        id: `outcome-${i}`,
        description: `Outcome ${i}`,
        goalId: `goal-${Math.floor(i / 10) * 10}`,
      });
    } else {
      data.push({
        ...mockTasks[0],
        id: `task-${i}`,
        title: `Task ${i}`,
        goalId: `goal-${Math.floor(i / 10) * 10}`,
        progress: Math.floor(Math.random() * 100),
        status: ['todo', 'in_progress', 'completed', 'blocked'][
          Math.floor(Math.random() * 4)
        ],
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      });
    }
  }

  return data;
};

// =============================================================================
// Stories
// =============================================================================

export const Default: Story = {
  args: {
    initialData: allMockData,
    config: {
      selectionMode: SelectionMode.SINGLE,
      enableDragDrop: true,
      enableSearch: true,
      enableFilters: true,
      enableKeyboardNavigation: true,
      showConnectionLines: true,
    },
    onNodeSelect: () => {},
    onNodeUpdate: () => {},
    onNodeMove: () => {},
    onNodeCreate: () => {},
    onNodeDelete: () => {},
    onTreeChange: () => {},
  },
};

export const EmptyState: Story = {
  args: {
    initialData: [],
    config: {
      enableSearch: true,
      enableFilters: true,
    },
    onTreeChange: () => {},
  },
};

export const LoadingState: Story = {
  args: {
    initialData: [],
    isLoading: true,
    config: {
      enableSearch: true,
      enableFilters: true,
    },
  },
};

export const ErrorState: Story = {
  args: {
    initialData: [],
    error: 'Failed to load tree data. Please try again.',
    config: {
      enableSearch: true,
      enableFilters: true,
    },
  },
};

export const MultipleSelection: Story = {
  args: {
    initialData: allMockData,
    config: {
      selectionMode: SelectionMode.MULTIPLE,
      enableDragDrop: true,
      enableSearch: true,
    },
    onNodeSelect: () => {},
    onTreeChange: () => {},
  },
};

export const DragDropDisabled: Story = {
  args: {
    initialData: allMockData,
    config: {
      enableDragDrop: false,
      enableSearch: true,
      enableFilters: true,
    },
    onTreeChange: () => {},
  },
};

export const SearchAndFiltersDisabled: Story = {
  args: {
    initialData: allMockData,
    config: {
      enableSearch: false,
      enableFilters: false,
      enableDragDrop: true,
    },
    onTreeChange: () => {},
  },
};

export const KeyboardNavigationDisabled: Story = {
  args: {
    initialData: allMockData,
    config: {
      enableKeyboardNavigation: false,
      enableDragDrop: true,
      enableSearch: true,
    },
    onTreeChange: () => {},
  },
};

export const LargeDataset: Story = {
  args: {
    initialData: generateLargeDataset(100),
    config: {
      selectionMode: SelectionMode.MULTIPLE,
      enableDragDrop: true,
      enableSearch: true,
      enableFilters: true,
      virtualScrollThreshold: 50,
    },
    onNodeSelect: () => {},
    onTreeChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'Performance test with 100 nodes to validate virtual scrolling and search performance.',
      },
    },
  },
};

export const GoalsOnly: Story = {
  args: {
    initialData: mockGoals,
    config: {
      enableSearch: true,
      enableFilters: true,
    },
    onTreeChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Display only goals without any tasks, milestones, or outcomes.',
      },
    },
  },
};

// =============================================================================
// Interaction Stories
// =============================================================================

export const WithInteractions: Story = {
  args: {
    initialData: allMockData,
    config: {
      selectionMode: SelectionMode.SINGLE,
      enableDragDrop: true,
      enableSearch: true,
      enableFilters: true,
    },
    onNodeSelect: () => {},
    onTreeChange: () => {},
  },
  // Interactive testing would require additional Storybook testing setup
};

export const FilteringExample: Story = {
  args: {
    initialData: allMockData,
    config: {
      enableFilters: true,
      enableSearch: true,
    },
    onTreeChange: () => {},
  },
  // Filter testing would require additional Storybook testing setup
};

// =============================================================================
// Accessibility Story
// =============================================================================

export const AccessibilityTest: Story = {
  args: {
    initialData: allMockData.slice(0, 5), // Smaller dataset for focused testing
    config: {
      enableKeyboardNavigation: true,
      selectionMode: SelectionMode.MULTIPLE,
    },
    onNodeSelect: () => {},
    onTreeChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: `
Test keyboard navigation and accessibility features:

- Use arrow keys to navigate between nodes
- Use Enter/Space to select nodes
- Use Ctrl+Click for multi-selection
- Use Right arrow to expand, Left arrow to collapse
- All nodes should have proper ARIA labels and roles
        `,
      },
    },
  },
  // Accessibility testing would require additional Storybook testing setup
};
