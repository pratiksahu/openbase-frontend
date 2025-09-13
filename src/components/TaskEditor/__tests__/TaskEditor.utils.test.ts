/**
 * TaskEditor Utilities Tests
 *
 * Test suite for TaskEditor utility functions including validation,
 * status management, time calculation, and form processing.
 */

import { TaskStatus, GoalPriority } from '@/types/smart-goals.types';
import type { Task } from '@/types/smart-goals.types';

import {
  TaskFormData,
  AcceptanceCriteriaData,
  AcceptanceCriteriaFormat,
} from '../TaskEditor.types';
import {
  // Validation functions
  validateGherkinSyntax,
  parseGherkinContent,
  gherkinToContent,
  validateAcceptanceCriteria,
  validateTaskForm,
  validateField,
  // Status management
  isValidStatusTransition,
  getAllowedStatusTransitions,
  getStatusChangeConfirmation,
  getStatusColor,
  getPriorityColor,
  // Form utilities
  taskToFormData,
  formDataToTask,
  // Progress calculation
  calculateTaskProgress,
  // Utility functions
  generateId,
  formatDuration,
  formatDate,
  isTaskOverdue,
  getTaskUrgency,
  debounce,
  isEqual,
} from '../TaskEditor.utils';

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((_date, _formatStr) => '2024-01-15 10:00'),
  isAfter: jest.fn(() => true),
  isBefore: jest.fn(() => false),
  addDays: jest.fn((date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)),
}));

// Mock task data for tests
const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test description',
  status: TaskStatus.TODO,
  priority: GoalPriority.MEDIUM,
  estimatedHours: 5,
  actualHours: 3,
  dueDate: new Date('2024-02-15T17:00:00Z'),
  startDate: new Date('2024-01-15T09:00:00Z'),
  tags: ['test', 'example'],
  dependencies: ['task-2'],
  goalId: 'goal-1',
  order: 1,
  progress: 60,
  subtasks: [],
  checklist: [],
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
  createdBy: 'user-1',
  updatedBy: 'user-1',
  isDeleted: false,
};

describe('TaskEditor Utilities', () => {
  describe('Gherkin Validation and Parsing', () => {
    describe('validateGherkinSyntax', () => {
      it('validates correct Gherkin syntax', () => {
        const validGherkin = `Given I am a user
When I perform an action
Then I should see a result`;

        const result = validateGherkinSyntax(validGherkin);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('detects missing Given clause', () => {
        const invalidGherkin = `When I perform an action
Then I should see a result`;

        const result = validateGherkinSyntax(invalidGherkin);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Missing "Given" clause');
      });

      it('detects missing When clause', () => {
        const invalidGherkin = `Given I am a user
Then I should see a result`;

        const result = validateGherkinSyntax(invalidGherkin);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Missing "When" clause');
      });

      it('detects missing Then clause', () => {
        const invalidGherkin = `Given I am a user
When I perform an action`;

        const result = validateGherkinSyntax(invalidGherkin);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Missing "Then" clause');
      });

      it('detects invalid keyword usage', () => {
        const invalidGherkin = `Given I am a user
Invalid line here
Then I should see a result`;

        const result = validateGherkinSyntax(invalidGherkin);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Line "Invalid line here" doesn\'t start with a valid Gherkin keyword');
      });

      it('handles And and But keywords correctly', () => {
        const validGherkin = `Given I am a user
And I am logged in
When I perform an action
Then I should see a result
But I should not see errors`;

        const result = validateGherkinSyntax(validGherkin);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('parseGherkinContent', () => {
      it('parses Gherkin content correctly', () => {
        const gherkinContent = `Given I am a user
And I am logged in
When I perform an action
Then I should see a result
But I should not see errors`;

        const result = parseGherkinContent(gherkinContent);

        expect(result.given).toEqual(['I am a user']);
        expect(result.when).toEqual(['I perform an action']);
        expect(result.then).toEqual(['I should see a result']);
        expect(result.and).toEqual(['I am logged in']);
        expect(result.but).toEqual(['I should not see errors']);
      });

      it('handles empty content', () => {
        const result = parseGherkinContent('');

        expect(result.given).toEqual([]);
        expect(result.when).toEqual([]);
        expect(result.then).toEqual([]);
        expect(result.and).toEqual([]);
        expect(result.but).toEqual([]);
      });
    });

    describe('gherkinToContent', () => {
      it('converts Gherkin data to content string', () => {
        const gherkinData = {
          given: ['I am a user'],
          when: ['I perform an action'],
          then: ['I should see a result'],
          and: ['I am logged in'],
          but: ['I should not see errors'],
        };

        const result = gherkinToContent(gherkinData);

        expect(result).toBe(`Given I am a user
When I perform an action
Then I should see a result
And I am logged in
But I should not see errors`);
      });
    });

    describe('validateAcceptanceCriteria', () => {
      it('validates plain text acceptance criteria', () => {
        const criteria: AcceptanceCriteriaData = {
          format: AcceptanceCriteriaFormat.PLAIN_TEXT,
          content: 'User can perform action',
          isValid: true,
        };

        const result = validateAcceptanceCriteria(criteria);

        expect(result.isValid).toBe(true);
        expect(result.validationErrors).toBeUndefined();
      });

      it('validates Gherkin acceptance criteria', () => {
        const criteria: AcceptanceCriteriaData = {
          format: AcceptanceCriteriaFormat.GHERKIN,
          content: `Given I am a user
When I perform an action
Then I should see a result`,
          isValid: true,
        };

        const result = validateAcceptanceCriteria(criteria);

        expect(result.isValid).toBe(true);
        expect(result.validationErrors).toBeUndefined();
      });

      it('invalidates empty content', () => {
        const criteria: AcceptanceCriteriaData = {
          format: AcceptanceCriteriaFormat.PLAIN_TEXT,
          content: '',
          isValid: true,
        };

        const result = validateAcceptanceCriteria(criteria);

        expect(result.isValid).toBe(false);
        expect(result.validationErrors).toContain('Acceptance criteria content cannot be empty');
      });
    });
  });

  describe('Status Management', () => {
    describe('isValidStatusTransition', () => {
      it('allows valid transitions', () => {
        expect(isValidStatusTransition(TaskStatus.TODO, TaskStatus.IN_PROGRESS)).toBe(true);
        expect(isValidStatusTransition(TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED)).toBe(true);
        expect(isValidStatusTransition(TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED)).toBe(true);
        expect(isValidStatusTransition(TaskStatus.BLOCKED, TaskStatus.IN_PROGRESS)).toBe(true);
      });

      it('disallows invalid transitions', () => {
        expect(isValidStatusTransition(TaskStatus.TODO, TaskStatus.COMPLETED)).toBe(false);
        expect(isValidStatusTransition(TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS)).toBe(false);
        expect(isValidStatusTransition(TaskStatus.TODO, TaskStatus.BLOCKED)).toBe(false);
      });
    });

    describe('getAllowedStatusTransitions', () => {
      it('returns correct allowed transitions', () => {
        expect(getAllowedStatusTransitions(TaskStatus.TODO)).toEqual([TaskStatus.IN_PROGRESS]);
        expect(getAllowedStatusTransitions(TaskStatus.IN_PROGRESS)).toEqual([
          TaskStatus.BLOCKED,
          TaskStatus.COMPLETED,
          TaskStatus.TODO,
        ]);
        expect(getAllowedStatusTransitions(TaskStatus.COMPLETED)).toEqual([]);
      });
    });

    describe('getStatusChangeConfirmation', () => {
      it('requires confirmation for terminal states', () => {
        const completion = getStatusChangeConfirmation(TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED);
        const cancellation = getStatusChangeConfirmation(TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED);

        expect(completion.requiresConfirmation).toBe(true);
        expect(completion.confirmationMessage).toContain('completed');

        expect(cancellation.requiresConfirmation).toBe(true);
        expect(cancellation.confirmationMessage).toContain('cancel');
      });

      it('does not require confirmation for normal transitions', () => {
        const result = getStatusChangeConfirmation(TaskStatus.TODO, TaskStatus.IN_PROGRESS);

        expect(result.requiresConfirmation).toBe(false);
        expect(result.confirmationMessage).toBeUndefined();
      });
    });

    describe('getStatusColor', () => {
      it('returns correct CSS classes for status colors', () => {
        expect(getStatusColor(TaskStatus.TODO)).toContain('gray');
        expect(getStatusColor(TaskStatus.IN_PROGRESS)).toContain('blue');
        expect(getStatusColor(TaskStatus.BLOCKED)).toContain('red');
        expect(getStatusColor(TaskStatus.COMPLETED)).toContain('green');
      });
    });

    describe('getPriorityColor', () => {
      it('returns correct CSS classes for priority colors', () => {
        expect(getPriorityColor(GoalPriority.LOW)).toContain('gray');
        expect(getPriorityColor(GoalPriority.MEDIUM)).toContain('yellow');
        expect(getPriorityColor(GoalPriority.HIGH)).toContain('orange');
        expect(getPriorityColor(GoalPriority.CRITICAL)).toContain('red');
      });
    });
  });

  describe('Form Utilities', () => {

    describe('taskToFormData', () => {
      it('converts task to form data correctly', () => {
        const formData = taskToFormData(mockTask);

        expect(formData.title).toBe('Test Task');
        expect(formData.description).toBe('Test description');
        expect(formData.status).toBe(TaskStatus.TODO);
        expect(formData.priority).toBe(GoalPriority.MEDIUM);
        expect(formData.estimatedHours).toBe(5);
        expect(formData.actualHours).toBe(3);
        expect(formData.tags).toEqual(['test', 'example']);
        expect(formData.dependencies).toEqual(['task-2']);
        expect(formData.order).toBe(1);
      });
    });

    describe('formDataToTask', () => {
      it('converts form data to task correctly', () => {
        const formData: TaskFormData = {
          title: 'Updated Task',
          description: 'Updated description',
          status: TaskStatus.IN_PROGRESS,
          priority: GoalPriority.HIGH,
          estimatedHours: 8,
          actualHours: 4,
          tags: ['updated'],
          dependencies: [],
          order: 2,
        };

        const result = formDataToTask(formData, mockTask);

        expect(result.title).toBe('Updated Task');
        expect(result.description).toBe('Updated description');
        expect(result.status).toBe(TaskStatus.IN_PROGRESS);
        expect(result.priority).toBe(GoalPriority.HIGH);
        expect(result.estimatedHours).toBe(8);
        expect(result.actualHours).toBe(4);
        expect(result.updatedAt).toBeInstanceOf(Date);
      });
    });

    describe('validateTaskForm', () => {
      it('validates valid form data', () => {
        const validFormData: TaskFormData = {
          title: 'Valid Task Title',
          description: 'Valid description',
          status: TaskStatus.TODO,
          priority: GoalPriority.MEDIUM,
          estimatedHours: 5,
          tags: ['test'],
          dependencies: [],
          order: 0,
        };

        const result = validateTaskForm(validFormData);

        expect(result.isValid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
      });

      it('validates title requirements', () => {
        const invalidFormData: TaskFormData = {
          title: 'AB', // Too short
          status: TaskStatus.TODO,
          priority: GoalPriority.MEDIUM,
          tags: [],
          dependencies: [],
          order: 0,
        };

        const result = validateTaskForm(invalidFormData);

        expect(result.isValid).toBe(false);
        expect(result.errors.title).toBeDefined();
      });

      it('validates estimated hours', () => {
        const invalidFormData: TaskFormData = {
          title: 'Valid Title',
          status: TaskStatus.TODO,
          priority: GoalPriority.MEDIUM,
          estimatedHours: -5, // Invalid negative
          tags: [],
          dependencies: [],
          order: 0,
        };

        const result = validateTaskForm(invalidFormData);

        expect(result.isValid).toBe(false);
        expect(result.errors.estimatedHours).toBeDefined();
      });
    });

    describe('validateField', () => {
      it('validates individual field correctly', () => {
        const result = validateField('title', 'Valid Title');

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('validates field with context', () => {
        const { isBefore } = jest.requireMock('date-fns');
        // Mock isBefore to return true when due date is before start date
        isBefore.mockReturnValueOnce(true);

        const context: Partial<TaskFormData> = {
          startDate: new Date('2024-02-01'),
        };

        const result = validateField('dueDate', new Date('2024-01-01'), context);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Due date cannot be before start date');
      });
    });
  });

  describe('Progress Calculation', () => {
    describe('calculateTaskProgress', () => {
      it('returns 100 for completed tasks', () => {
        const completedTask: Task = {
          ...mockTask,
          status: TaskStatus.COMPLETED,
        };

        const progress = calculateTaskProgress(completedTask);

        expect(progress).toBe(100);
      });

      it('returns 0 for todo tasks', () => {
        const todoTask: Task = {
          ...mockTask,
          status: TaskStatus.TODO,
          subtasks: [],
          checklist: [],
        };

        const progress = calculateTaskProgress(todoTask);

        expect(progress).toBe(0);
      });

      it('calculates progress based on subtasks', () => {
        const taskWithSubtasks: Task = {
          ...mockTask,
          status: TaskStatus.IN_PROGRESS,
          subtasks: [
            {
              ...mockTask,
              id: 'subtask-1',
              status: TaskStatus.COMPLETED,
              progress: 100,
              taskId: 'task-1',
            },
            {
              ...mockTask,
              id: 'subtask-2',
              status: TaskStatus.IN_PROGRESS,
              progress: 50,
              taskId: 'task-1',
            },
          ],
          checklist: [],
        };

        const progress = calculateTaskProgress(taskWithSubtasks);

        expect(progress).toBe(75); // (100 + 50) / 2
      });

      it('calculates progress based on checklist', () => {
        const taskWithChecklist: Task = {
          ...mockTask,
          status: TaskStatus.IN_PROGRESS,
          subtasks: [],
          checklist: [
            {
              id: 'check-1',
              title: 'Item 1',
              isCompleted: true,
              isRequired: true,
              order: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: 'user-1',
              updatedBy: 'user-1',
            },
            {
              id: 'check-2',
              title: 'Item 2',
              isCompleted: false,
              isRequired: false,
              order: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: 'user-1',
              updatedBy: 'user-1',
            },
          ],
        };

        const progress = calculateTaskProgress(taskWithChecklist);

        expect(progress).toBe(50); // 1 completed out of 2 total
      });
    });
  });

  describe('Utility Functions', () => {
    describe('generateId', () => {
      it('generates unique IDs', () => {
        const id1 = generateId();
        const id2 = generateId();

        expect(id1).not.toBe(id2);
        expect(typeof id1).toBe('string');
        expect(id1.length).toBeGreaterThan(0);
      });
    });

    describe('formatDuration', () => {
      it('formats duration correctly', () => {
        expect(formatDuration(0.5)).toBe('30m');
        expect(formatDuration(1)).toBe('1h');
        expect(formatDuration(1.5)).toBe('1h 30m');
        expect(formatDuration(2.25)).toBe('2h 15m');
      });
    });

    describe('formatDate', () => {
      it('formats date correctly', () => {
        const date = new Date('2024-01-15T10:00:00Z');
        const result = formatDate(date);

        expect(result).toBe('2024-01-15 10:00');
      });
    });

    describe('isTaskOverdue', () => {
      it('returns false for tasks without due date', () => {
        const taskWithoutDueDate: Task = {
          ...mockTask,
          dueDate: undefined,
        };

        expect(isTaskOverdue(taskWithoutDueDate)).toBe(false);
      });

      it('returns false for completed tasks', () => {
        const completedTask: Task = {
          ...mockTask,
          status: TaskStatus.COMPLETED,
          dueDate: new Date('2023-01-01'), // Past date
        };

        expect(isTaskOverdue(completedTask)).toBe(false);
      });
    });

    describe('getTaskUrgency', () => {
      it('returns low urgency for tasks without due date', () => {
        const taskWithoutDueDate: Task = {
          ...mockTask,
          dueDate: undefined,
        };

        expect(getTaskUrgency(taskWithoutDueDate)).toBe('low');
      });

      it('returns correct urgency based on days until due', () => {
        // Overdue task (past date)
        const overdueTask: Task = {
          ...mockTask,
          dueDate: new Date('2023-01-01'), // Past date
        };
        expect(getTaskUrgency(overdueTask)).toBe('critical');

        // Task due in 1 day
        const urgentTask: Task = {
          ...mockTask,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        };
        expect(getTaskUrgency(urgentTask)).toBe('high');

        // Task due in 3 days
        const mediumTask: Task = {
          ...mockTask,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        };
        expect(getTaskUrgency(mediumTask)).toBe('medium');

        // Task due in 7 days
        const lowTask: Task = {
          ...mockTask,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        expect(getTaskUrgency(lowTask)).toBe('low');
      });
    });

    describe('debounce', () => {
      it('debounces function calls correctly', (done) => {
        let callCount = 0;
        const debouncedFn = debounce(() => {
          callCount++;
        }, 50);

        // Call multiple times quickly
        debouncedFn();
        debouncedFn();
        debouncedFn();

        // Should only execute once after delay
        setTimeout(() => {
          expect(callCount).toBe(1);
          done();
        }, 100);
      });
    });

    describe('isEqual', () => {
      it('compares objects correctly', () => {
        const obj1 = { a: 1, b: 'test' };
        const obj2 = { a: 1, b: 'test' };
        const obj3 = { a: 2, b: 'test' };

        expect(isEqual(obj1, obj2)).toBe(true);
        expect(isEqual(obj1, obj3)).toBe(false);
      });

      it('handles nested objects', () => {
        const obj1 = { a: { nested: 'value' } };
        const obj2 = { a: { nested: 'value' } };
        const obj3 = { a: { nested: 'different' } };

        expect(isEqual(obj1, obj2)).toBe(true);
        expect(isEqual(obj1, obj3)).toBe(false);
      });
    });
  });
});