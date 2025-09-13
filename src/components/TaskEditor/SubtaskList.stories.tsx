import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import { TaskStatus, GoalPriority } from '@/types/smart-goals.types';
import type { Subtask } from '@/types/smart-goals.types';

import { SubtaskList } from './SubtaskList';

const meta = {
  title: 'Components/TaskEditor/SubtaskList',
  component: SubtaskList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive subtask management component with drag-and-drop reordering, inline editing, and CRUD operations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSubtasksChange: {
      description: 'Callback fired when the subtasks array changes',
    },
    onSubtaskAdd: {
      description: 'Callback fired when a new subtask is added',
    },
    onSubtaskUpdate: {
      description: 'Callback fired when a subtask is updated',
    },
    onSubtaskDelete: {
      description: 'Callback fired when a subtask is deleted',
    },
    onSubtaskReorder: {
      description: 'Callback fired when subtasks are reordered',
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Whether the component is in read-only mode',
    },
  },
} satisfies Meta<typeof SubtaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockAssignees = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com' },
  { id: '4', name: 'David Wilson', email: 'david@example.com' },
];

const mockSubtasks: Subtask[] = [
  {
    id: 'subtask-1',
    title: 'Design user interface mockups',
    description: 'Create wireframes and mockups for the main dashboard using Figma',
    status: TaskStatus.COMPLETED,
    priority: GoalPriority.HIGH,
    assignedTo: '1',
    estimatedHours: 8,
    actualHours: 6,
    dueDate: new Date('2024-02-10T17:00:00Z'),
    progress: 100,
    order: 0,
    tags: ['design', 'ui', 'mockups'],
    checklist: [],
    taskId: 'task-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    isDeleted: false,
    completedAt: new Date('2024-01-16T14:30:00Z'),
    notes: 'Designs approved by stakeholders',
  },
  {
    id: 'subtask-2',
    title: 'Implement responsive layout',
    description: 'Make the dashboard work seamlessly on mobile, tablet, and desktop devices',
    status: TaskStatus.IN_PROGRESS,
    priority: GoalPriority.MEDIUM,
    assignedTo: '2',
    estimatedHours: 12,
    actualHours: 4,
    dueDate: new Date('2024-02-15T17:00:00Z'),
    progress: 35,
    order: 1,
    tags: ['frontend', 'responsive', 'css'],
    checklist: [],
    taskId: 'task-1',
    createdAt: new Date('2024-01-16T09:00:00Z'),
    updatedAt: new Date('2024-01-17T16:45:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-2',
    isDeleted: false,
  },
  {
    id: 'subtask-3',
    title: 'Add interactive components',
    description: 'Implement dropdowns, modals, tooltips, and other interactive elements',
    status: TaskStatus.TODO,
    priority: GoalPriority.LOW,
    estimatedHours: 6,
    dueDate: new Date('2024-02-18T17:00:00Z'),
    progress: 0,
    order: 2,
    tags: ['frontend', 'components', 'javascript'],
    checklist: [],
    taskId: 'task-1',
    createdAt: new Date('2024-01-17T11:00:00Z'),
    updatedAt: new Date('2024-01-17T11:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    isDeleted: false,
  },
  {
    id: 'subtask-4',
    title: 'Write comprehensive unit tests',
    description: 'Achieve 90%+ code coverage for all dashboard components and utilities',
    status: TaskStatus.BLOCKED,
    priority: GoalPriority.CRITICAL,
    assignedTo: '3',
    estimatedHours: 16,
    actualHours: 8,
    dueDate: new Date('2024-02-20T17:00:00Z'),
    progress: 25,
    order: 3,
    tags: ['testing', 'quality', 'unit-tests'],
    checklist: [],
    taskId: 'task-1',
    createdAt: new Date('2024-01-18T10:00:00Z'),
    updatedAt: new Date('2024-01-19T14:30:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-3',
    isDeleted: false,
    notes: 'Blocked waiting for API endpoints to be finalized',
  },
];

/**
 * Default subtask list with various statuses
 */
export const Default: Story = {
  args: {
    subtasks: mockSubtasks,
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default subtask list showing various subtasks in different states with assignees and due dates.',
      },
    },
  },
};

/**
 * Empty subtask list
 */
export const Empty: Story = {
  args: {
    subtasks: [],
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state showing when no subtasks have been created yet.',
      },
    },
  },
};

/**
 * Read-only subtask list
 */
export const ReadOnly: Story = {
  args: {
    subtasks: mockSubtasks,
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only mode where subtasks can be viewed but not edited or reordered.',
      },
    },
  },
};

/**
 * All completed subtasks
 */
export const AllCompleted: Story = {
  args: {
    subtasks: mockSubtasks.map(subtask => ({
      ...subtask,
      status: TaskStatus.COMPLETED,
      progress: 100,
      actualHours: subtask.estimatedHours || 0,
      completedAt: new Date('2024-01-20T12:00:00Z'),
    })),
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtask list where all subtasks are completed, showing progress completion.',
      },
    },
  },
};

/**
 * Mixed priority subtasks
 */
export const MixedPriorities: Story = {
  args: {
    subtasks: [
      {
        ...mockSubtasks[0],
        priority: GoalPriority.CRITICAL,
        title: 'Fix critical security vulnerability',
        status: TaskStatus.IN_PROGRESS,
        progress: 75,
      },
      {
        ...mockSubtasks[1],
        priority: GoalPriority.HIGH,
        title: 'Implement user authentication',
        status: TaskStatus.TODO,
        progress: 0,
      },
      {
        ...mockSubtasks[2],
        priority: GoalPriority.MEDIUM,
        title: 'Add data visualization charts',
        status: TaskStatus.IN_PROGRESS,
        progress: 40,
      },
      {
        ...mockSubtasks[3],
        priority: GoalPriority.LOW,
        title: 'Optimize image loading',
        status: TaskStatus.TODO,
        progress: 0,
      },
    ],
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtasks with different priority levels from critical to low, showing color-coded priority badges.',
      },
    },
  },
};

/**
 * Overdue subtasks
 */
export const OverdueSubtasks: Story = {
  args: {
    subtasks: mockSubtasks.map(subtask => ({
      ...subtask,
      dueDate: new Date('2024-01-10T17:00:00Z'), // Past date
      status: subtask.status === TaskStatus.COMPLETED ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS,
    })),
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtasks with past due dates, showing how overdue items are highlighted.',
      },
    },
  },
};

/**
 * Subtasks without assignees
 */
export const UnassignedSubtasks: Story = {
  args: {
    subtasks: mockSubtasks.map(subtask => ({
      ...subtask,
      assignedTo: undefined,
    })),
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtasks without assigned team members, showing unassigned state.',
      },
    },
  },
};

/**
 * Subtasks with long descriptions
 */
export const LongDescriptions: Story = {
  args: {
    subtasks: [
      {
        ...mockSubtasks[0],
        title: 'Implement comprehensive user onboarding flow',
        description: `Create a multi-step onboarding process that includes:

1. Welcome screen with product introduction
2. Account setup and profile creation
3. Feature walkthrough with interactive tutorials
4. Integration setup for third-party services
5. Sample data import and configuration
6. Goal setting and preference customization
7. Team invitation and collaboration setup

The onboarding should be progressive, allowing users to skip non-essential steps while ensuring they understand core functionality. Include tooltips, progress indicators, and contextual help throughout the process.

Technical requirements:
- Mobile-responsive design
- Accessibility compliance (WCAG 2.1 AA)
- Analytics tracking for each step
- A/B testing capabilities for different flows
- Localization support for multiple languages`,
      },
      {
        ...mockSubtasks[1],
        title: 'Optimize database queries and implement caching',
        description: `Performance optimization task focusing on backend improvements:

Database Query Optimization:
- Analyze slow queries using EXPLAIN ANALYZE
- Add appropriate indexes for frequently queried columns
- Optimize JOIN operations and subqueries
- Implement query result pagination
- Use database-specific features like materialized views

Caching Strategy Implementation:
- Redis integration for session and frequently accessed data
- Implement cache invalidation strategies
- Add cache warming for critical data
- Monitor cache hit ratios and performance metrics
- Document caching patterns for future development`,
      },
    ],
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtasks with extensive descriptions showing how long content is handled.',
      },
    },
  },
};

/**
 * Blocked subtasks with dependencies
 */
export const BlockedSubtasks: Story = {
  args: {
    subtasks: [
      {
        ...mockSubtasks[0],
        status: TaskStatus.BLOCKED,
        title: 'Frontend implementation',
        description: 'Cannot proceed until API endpoints are completed',
        progress: 10,
      },
      {
        ...mockSubtasks[1],
        status: TaskStatus.BLOCKED,
        title: 'Integration testing',
        description: 'Waiting for staging environment setup',
        progress: 0,
      },
      {
        ...mockSubtasks[2],
        status: TaskStatus.IN_PROGRESS,
        title: 'API development',
        description: 'Core API endpoints in development',
        progress: 60,
      },
      {
        ...mockSubtasks[3],
        status: TaskStatus.BLOCKED,
        title: 'Documentation writing',
        description: 'Cannot document until features are finalized',
        progress: 5,
      },
    ],
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtasks in blocked state showing dependencies and reasons for blocking.',
      },
    },
  },
};

/**
 * Subtasks with time tracking details
 */
export const TimeTrackingDetails: Story = {
  args: {
    subtasks: mockSubtasks.map(subtask => ({
      ...subtask,
      estimatedHours: Math.floor(Math.random() * 20) + 4,
      actualHours: Math.floor(Math.random() * 15) + 1,
    })),
    onSubtasksChange: fn(),
    onSubtaskAdd: fn(),
    onSubtaskUpdate: fn(),
    onSubtaskDelete: fn(),
    onSubtaskReorder: fn(),
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtasks showing estimated vs actual hours for time tracking analysis.',
      },
    },
  },
};

/**
 * Interactive subtask management
 */
export const Interactive: Story = {
  args: {
    subtasks: mockSubtasks.slice(0, 2), // Start with fewer items for demo
    onSubtasksChange: fn(),
    onSubtaskAdd: (subtask) => {
      console.log('Adding subtask:', subtask);
      fn()(subtask);
    },
    onSubtaskUpdate: (id, changes) => {
      console.log('Updating subtask:', id, changes);
      fn()(id, changes);
    },
    onSubtaskDelete: (id) => {
      console.log('Deleting subtask:', id);
      fn()(id);
    },
    onSubtaskReorder: (fromIndex, toIndex) => {
      console.log('Reordering from', fromIndex, 'to', toIndex);
      fn()(fromIndex, toIndex);
    },
    availableAssignees: mockAssignees,
    isReadOnly: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing add, edit, delete, and reorder operations with console logging.',
      },
    },
  },
};