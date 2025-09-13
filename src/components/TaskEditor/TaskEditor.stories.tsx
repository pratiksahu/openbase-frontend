import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';

import { TaskStatus, GoalPriority } from '@/types/smart-goals.types';
import type { Task, Subtask, ChecklistItem } from '@/types/smart-goals.types';

import { TaskEditor } from './TaskEditor';
import { TaskEditorMode, AcceptanceCriteriaFormat } from './TaskEditor.types';

const meta = {
  title: 'Components/TaskEditor/TaskEditor',
  component: TaskEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive task editing component with support for subtasks, checklists, acceptance criteria, and status management following SMART goals methodology.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: Object.values(TaskEditorMode),
      description: 'The editing mode of the component',
    },
    onSave: {
      description: 'Callback fired when task is saved',
    },
    onCancel: {
      description: 'Callback fired when editing is cancelled',
    },
    onDelete: {
      description: 'Callback fired when task is deleted',
    },
    autoSave: {
      control: 'boolean',
      description: 'Enable auto-save functionality',
    },
    autoSaveDelay: {
      control: 'number',
      description: 'Auto-save delay in milliseconds',
    },
  },
} satisfies Meta<typeof TaskEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockAssignees = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com' },
];

const mockAvailableTasks = [
  { id: 'task-1', title: 'Setup Database Schema' },
  { id: 'task-2', title: 'Implement Authentication' },
  { id: 'task-3', title: 'Create User Interface' },
];

const mockSubtasks: Subtask[] = [
  {
    id: 'subtask-1',
    title: 'Design user interface mockups',
    description: 'Create wireframes and mockups for the main dashboard',
    status: TaskStatus.COMPLETED,
    priority: GoalPriority.HIGH,
    estimatedHours: 8,
    actualHours: 6,
    progress: 100,
    order: 0,
    tags: ['design', 'ui'],
    checklist: [],
    taskId: 'task-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    isDeleted: false,
    completedAt: new Date('2024-01-16T14:30:00Z'),
  },
  {
    id: 'subtask-2',
    title: 'Implement responsive layout',
    description: 'Make the dashboard work on mobile and tablet devices',
    status: TaskStatus.IN_PROGRESS,
    priority: GoalPriority.MEDIUM,
    assignedTo: '2',
    estimatedHours: 12,
    actualHours: 4,
    progress: 35,
    order: 1,
    tags: ['frontend', 'responsive'],
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
    status: TaskStatus.TODO,
    priority: GoalPriority.LOW,
    estimatedHours: 6,
    progress: 0,
    order: 2,
    tags: ['frontend', 'components'],
    checklist: [],
    taskId: 'task-1',
    createdAt: new Date('2024-01-17T11:00:00Z'),
    updatedAt: new Date('2024-01-17T11:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    isDeleted: false,
  },
];

const mockChecklist: ChecklistItem[] = [
  {
    id: 'check-1',
    title: 'All forms have proper validation',
    description: 'Client-side and server-side validation implemented',
    isCompleted: true,
    isRequired: true,
    order: 0,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    completedAt: new Date('2024-01-16T14:30:00Z'),
    completedBy: 'user-1',
  },
  {
    id: 'check-2',
    title: 'Error messages are user-friendly',
    description: 'No technical jargon in error messages',
    isCompleted: true,
    isRequired: false,
    order: 1,
    createdAt: new Date('2024-01-16T09:00:00Z'),
    updatedAt: new Date('2024-01-16T15:20:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    completedAt: new Date('2024-01-16T15:20:00Z'),
    completedBy: 'user-1',
  },
  {
    id: 'check-3',
    title: 'Loading states are implemented',
    description: 'Show spinners or skeletons during data loading',
    isCompleted: false,
    isRequired: true,
    order: 2,
    createdAt: new Date('2024-01-17T11:00:00Z'),
    updatedAt: new Date('2024-01-17T11:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: 'check-4',
    title: 'Accessibility standards are met',
    description: 'WCAG 2.1 AA compliance verified',
    isCompleted: false,
    isRequired: false,
    order: 3,
    createdAt: new Date('2024-01-17T13:00:00Z'),
    updatedAt: new Date('2024-01-17T13:00:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
];

const mockExistingTask: Task = {
  id: 'task-123',
  title: 'Implement User Dashboard',
  description: 'Create a comprehensive dashboard for users to view their data, manage settings, and track progress.',
  status: TaskStatus.IN_PROGRESS,
  priority: GoalPriority.HIGH,
  assignedTo: '1',
  estimatedHours: 32,
  actualHours: 18,
  dueDate: new Date('2024-02-15T17:00:00Z'),
  startDate: new Date('2024-01-15T09:00:00Z'),
  progress: 65,
  tags: ['frontend', 'dashboard', 'user-experience'],
  subtasks: mockSubtasks,
  checklist: mockChecklist,
  dependencies: ['task-2'],
  goalId: 'goal-1',
  order: 1,
  createdAt: new Date('2024-01-15T09:00:00Z'),
  updatedAt: new Date('2024-01-17T16:45:00Z'),
  createdBy: 'user-1',
  updatedBy: 'user-1',
  isDeleted: false,
  notes: 'This task is critical for the upcoming release.',
  comments: [],
};

/**
 * Create new task mode - empty form ready for input
 */
export const CreateNewTask: Story = {
  args: {
    goalId: 'goal-1',
    mode: TaskEditorMode.CREATE,
    onSave: fn(),
    onCancel: fn(),
    availableAssignees: mockAssignees,
    availableTasks: mockAvailableTasks,
    autoSave: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor in create mode with an empty form ready for new task creation.',
      },
    },
  },
};

/**
 * Edit existing task with full data
 */
export const EditExistingTask: Story = {
  args: {
    task: mockExistingTask,
    goalId: 'goal-1',
    mode: TaskEditorMode.EDIT,
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
    onStatusChange: fn(),
    availableAssignees: mockAssignees,
    availableTasks: mockAvailableTasks,
    autoSave: true,
    autoSaveDelay: 2000,
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor in edit mode with a fully populated task including subtasks and checklist items.',
      },
    },
  },
};

/**
 * Task with complex subtasks structure
 */
export const TaskWithSubtasks: Story = {
  args: {
    task: {
      ...mockExistingTask,
      subtasks: [
        ...mockSubtasks,
        {
          id: 'subtask-4',
          title: 'Write comprehensive unit tests',
          description: 'Achieve 90%+ code coverage for all dashboard components',
          status: TaskStatus.BLOCKED,
          priority: GoalPriority.CRITICAL,
          assignedTo: '3',
          estimatedHours: 16,
          actualHours: 8,
          progress: 25,
          order: 3,
          tags: ['testing', 'quality'],
          checklist: [],
          taskId: 'task-1',
          createdAt: new Date('2024-01-18T10:00:00Z'),
          updatedAt: new Date('2024-01-19T14:30:00Z'),
          createdBy: 'user-1',
          updatedBy: 'user-3',
          isDeleted: false,
        },
      ],
    },
    goalId: 'goal-1',
    mode: TaskEditorMode.EDIT,
    onSave: fn(),
    onCancel: fn(),
    availableAssignees: mockAssignees,
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor showing a task with multiple subtasks in various states including blocked status.',
      },
    },
  },
};

/**
 * Task with comprehensive checklist
 */
export const TaskWithChecklist: Story = {
  args: {
    task: {
      ...mockExistingTask,
      checklist: [
        ...mockChecklist,
        {
          id: 'check-5',
          title: 'Performance benchmarks met',
          description: '**Core Web Vitals** scores:\n- LCP < 2.5s\n- FID < 100ms\n- CLS < 0.1',
          isCompleted: false,
          isRequired: true,
          order: 4,
          createdAt: new Date('2024-01-18T10:00:00Z'),
          updatedAt: new Date('2024-01-18T10:00:00Z'),
          createdBy: 'user-1',
          updatedBy: 'user-1',
        },
        {
          id: 'check-6',
          title: 'Cross-browser compatibility verified',
          description: 'Tested on Chrome, Firefox, Safari, and Edge',
          isCompleted: true,
          isRequired: false,
          order: 5,
          createdAt: new Date('2024-01-18T11:00:00Z'),
          updatedAt: new Date('2024-01-19T09:15:00Z'),
          createdBy: 'user-1',
          updatedBy: 'user-2',
          completedAt: new Date('2024-01-19T09:15:00Z'),
          completedBy: 'user-2',
        },
      ],
    },
    goalId: 'goal-1',
    mode: TaskEditorMode.EDIT,
    onSave: fn(),
    onCancel: fn(),
    availableAssignees: mockAssignees,
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor showing a task with a comprehensive checklist including required and optional items.',
      },
    },
  },
};

/**
 * Task with Gherkin acceptance criteria
 */
export const TaskWithGherkinCriteria: Story = {
  args: {
    task: mockExistingTask,
    goalId: 'goal-1',
    mode: TaskEditorMode.EDIT,
    onSave: fn(),
    onCancel: fn(),
    availableAssignees: mockAssignees,
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor with Gherkin-formatted acceptance criteria for BDD testing.',
      },
    },
    // Pre-configure with Gherkin format
    initialState: {
      acceptanceCriteria: {
        format: AcceptanceCriteriaFormat.GHERKIN,
        content: `Given I am a logged-in user
When I navigate to the dashboard
Then I should see my personal data summary
And I should see navigation menu
And the page should load within 3 seconds

Given I am on the dashboard
When I click on the settings button
Then I should be redirected to user settings
And my current settings should be displayed

Given I have incomplete tasks
When I view the dashboard
Then I should see a progress indicator
And I should see my pending tasks list`,
        isValid: true,
      },
    },
  },
};

/**
 * Task with validation errors
 */
export const TaskWithValidationErrors: Story = {
  args: {
    task: {
      ...mockExistingTask,
      title: 'A', // Too short
      estimatedHours: -5, // Invalid
      dueDate: new Date('2023-01-01'), // Past date
    },
    goalId: 'goal-1',
    mode: TaskEditorMode.EDIT,
    onSave: fn(),
    onCancel: fn(),
    availableAssignees: mockAssignees,
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor showing validation errors for invalid form data.',
      },
    },
  },
};

/**
 * Completed task in view mode
 */
export const CompletedTask: Story = {
  args: {
    task: {
      ...mockExistingTask,
      status: TaskStatus.COMPLETED,
      progress: 100,
      actualHours: 28,
      completedAt: new Date('2024-01-20T16:00:00Z'),
      subtasks: mockSubtasks.map(subtask => ({
        ...subtask,
        status: TaskStatus.COMPLETED,
        progress: 100,
        completedAt: new Date('2024-01-19T12:00:00Z'),
      })),
      checklist: mockChecklist.map(item => ({
        ...item,
        isCompleted: true,
        completedAt: new Date('2024-01-19T15:30:00Z'),
      })),
    },
    goalId: 'goal-1',
    mode: TaskEditorMode.VIEW,
    onSave: fn(),
    onCancel: fn(),
    availableAssignees: mockAssignees,
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor in view mode showing a completed task with all subtasks and checklist items done.',
      },
    },
  },
};

/**
 * High-priority urgent task
 */
export const UrgentTask: Story = {
  args: {
    task: {
      ...mockExistingTask,
      title: 'Fix Critical Security Vulnerability',
      priority: GoalPriority.CRITICAL,
      status: TaskStatus.BLOCKED,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      estimatedHours: 4,
      actualHours: 0,
      progress: 0,
      tags: ['security', 'critical', 'hotfix'],
      subtasks: [
        {
          id: 'urgent-1',
          title: 'Identify vulnerability scope',
          status: TaskStatus.COMPLETED,
          priority: GoalPriority.CRITICAL,
          estimatedHours: 1,
          actualHours: 1.5,
          progress: 100,
          order: 0,
          tags: ['analysis'],
          checklist: [],
          taskId: 'task-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-1',
          updatedBy: 'user-1',
          isDeleted: false,
          completedAt: new Date(),
        },
        {
          id: 'urgent-2',
          title: 'Develop and test fix',
          status: TaskStatus.BLOCKED,
          priority: GoalPriority.CRITICAL,
          estimatedHours: 2,
          actualHours: 0,
          progress: 0,
          order: 1,
          tags: ['development'],
          checklist: [],
          taskId: 'task-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-1',
          updatedBy: 'user-1',
          isDeleted: false,
        },
      ],
    },
    goalId: 'goal-1',
    mode: TaskEditorMode.EDIT,
    onSave: fn(),
    onCancel: fn(),
    availableAssignees: mockAssignees,
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor showing a critical, high-priority task with urgent deadline.',
      },
    },
  },
};

/**
 * Task with auto-save enabled
 */
export const TaskWithAutoSave: Story = {
  args: {
    task: mockExistingTask,
    goalId: 'goal-1',
    mode: TaskEditorMode.EDIT,
    onSave: fn(),
    onCancel: fn(),
    availableAssignees: mockAssignees,
    autoSave: true,
    autoSaveDelay: 1000, // 1 second for demo
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor with auto-save enabled, automatically saving changes after 1 second of inactivity.',
      },
    },
  },
};

/**
 * Minimal task configuration
 */
export const MinimalTask: Story = {
  args: {
    task: {
      id: 'minimal-task',
      title: 'Simple Task',
      status: TaskStatus.TODO,
      priority: GoalPriority.MEDIUM,
      progress: 0,
      tags: [],
      subtasks: [],
      checklist: [],
      goalId: 'goal-1',
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user-1',
      updatedBy: 'user-1',
      isDeleted: false,
    },
    goalId: 'goal-1',
    mode: TaskEditorMode.EDIT,
    onSave: fn(),
    onCancel: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'TaskEditor with minimal task configuration showing only required fields.',
      },
    },
  },
};

/**
 * Loading state demonstration
 */
export const LoadingState: Story = {
  render: () => {
    // This would typically come from a loading hook or state
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state shown while task data is being fetched.',
      },
    },
  },
};