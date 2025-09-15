/**
 * TaskEditor Component Utilities
 *
 * This file contains utility functions, validation schemas, and helper methods
 * for the TaskEditor component system.
 *
 * @fileoverview Utilities for TaskEditor components
 * @version 1.0.0
 */

import { format, isAfter, isBefore } from 'date-fns';
import { z } from 'zod';

import type { Task } from '@/types/smart-goals.types';
import { TaskStatus, GoalPriority } from '@/types/smart-goals.types';

import {
  TaskFormData,
  AcceptanceCriteriaFormat,
  AcceptanceCriteriaData,
  GherkinCriteria,
  STATUS_TRANSITIONS,
  StatusChangeConfirmation,
  TimeTrackingSummary,
  FormValidation,
  FieldValidation,
} from './TaskEditor.types';

// =============================================================================
// Validation Schemas
// =============================================================================

/** Task form validation schema */
export const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must be less than 100 characters'),

  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),

  status: z.nativeEnum(TaskStatus, {
    message: 'Please select a valid status',
  }),

  priority: z.nativeEnum(GoalPriority, {
    message: 'Please select a valid priority',
  }),

  assignedTo: z.string().optional(),

  estimatedHours: z
    .number()
    .min(0.1, 'Estimated hours must be at least 0.1')
    .max(1000, 'Estimated hours must be less than 1000')
    .optional(),

  actualHours: z
    .number()
    .min(0, 'Actual hours cannot be negative')
    .max(2000, 'Actual hours must be less than 2000')
    .optional(),

  dueDate: z
    .date()
    .refine(
      date => !date || isAfter(date, new Date()),
      'Due date must be in the future'
    )
    .optional(),

  startDate: z.date().optional(),

  tags: z
    .array(z.string().min(1, 'Tag cannot be empty'))
    .max(10, 'Maximum 10 tags allowed'),

  dependencies: z.array(z.string()).max(20, 'Maximum 20 dependencies allowed'),

  order: z
    .number()
    .int('Order must be an integer')
    .min(0, 'Order cannot be negative'),
});

/** Subtask form validation schema */
export const subtaskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Subtask title must be at least 3 characters long')
    .max(100, 'Subtask title must be less than 100 characters'),

  description: z
    .string()
    .max(300, 'Subtask description must be less than 300 characters')
    .optional(),

  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(GoalPriority),

  assignedTo: z.string().optional(),

  estimatedHours: z
    .number()
    .min(0.1, 'Estimated hours must be at least 0.1')
    .max(100, 'Estimated hours must be less than 100')
    .optional(),

  dueDate: z
    .date()
    .refine(
      date => !date || isAfter(date, new Date()),
      'Due date must be in the future'
    )
    .optional(),

  order: z.number().int().min(0),
  tags: z.array(z.string().min(1)).max(5, 'Maximum 5 tags per subtask'),
});

/** Checklist item validation schema */
export const checklistItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Checklist item title is required')
    .max(200, 'Checklist item title must be less than 200 characters'),

  description: z
    .string()
    .max(300, 'Description must be less than 300 characters')
    .optional(),

  isCompleted: z.boolean(),
  isRequired: z.boolean(),
  order: z.number().int().min(0),
});

/** Acceptance criteria validation schema */
export const acceptanceCriteriaSchema = z.object({
  format: z.nativeEnum(AcceptanceCriteriaFormat),
  content: z.string().min(1, 'Acceptance criteria content is required'),
  isValid: z.boolean(),
  validationErrors: z.array(z.string()).optional(),
});

// =============================================================================
// Status Management Utilities
// =============================================================================

/**
 * Check if a status transition is valid
 */
export function isValidStatusTransition(
  from: TaskStatus,
  to: TaskStatus
): boolean {
  const allowedTransitions = STATUS_TRANSITIONS[from];
  return allowedTransitions.includes(to);
}

/**
 * Get allowed status transitions for a given status
 */
export function getAllowedStatusTransitions(status: TaskStatus): TaskStatus[] {
  return STATUS_TRANSITIONS[status] || [];
}

/**
 * Get status change confirmation data
 */
export function getStatusChangeConfirmation(
  from: TaskStatus,
  to: TaskStatus
): StatusChangeConfirmation {
  const requiresConfirmation = [
    TaskStatus.COMPLETED,
    TaskStatus.CANCELLED,
  ].includes(to);

  let confirmationMessage: string | undefined;
  let warningMessage: string | undefined;

  if (to === TaskStatus.COMPLETED) {
    confirmationMessage =
      'Are you sure you want to mark this task as completed?';
  } else if (to === TaskStatus.CANCELLED) {
    confirmationMessage = 'Are you sure you want to cancel this task?';
    warningMessage = 'This action can be undone, but progress will be lost.';
  } else if (to === TaskStatus.BLOCKED && from === TaskStatus.IN_PROGRESS) {
    warningMessage = 'Task will be blocked. Consider adding a reason.';
  }

  return {
    fromStatus: from,
    toStatus: to,
    requiresConfirmation,
    confirmationMessage,
    warningMessage,
  };
}

/**
 * Get status color class for UI display
 */
export function getStatusColor(status: TaskStatus): string {
  const statusColors: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'bg-gray-100 text-gray-800 border-gray-200',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
    [TaskStatus.BLOCKED]: 'bg-red-100 text-red-800 border-red-200',
    [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
    [TaskStatus.CANCELLED]: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return statusColors[status] || statusColors[TaskStatus.TODO];
}

/**
 * Get priority color class for UI display
 */
export function getPriorityColor(priority: GoalPriority): string {
  const priorityColors: Record<GoalPriority, string> = {
    [GoalPriority.LOW]: 'bg-gray-100 text-gray-700',
    [GoalPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [GoalPriority.HIGH]: 'bg-orange-100 text-orange-800',
    [GoalPriority.CRITICAL]: 'bg-red-100 text-red-800',
  };
  return priorityColors[priority] || priorityColors[GoalPriority.MEDIUM];
}

// =============================================================================
// Acceptance Criteria Utilities
// =============================================================================

/**
 * Validate Gherkin syntax
 */
export function validateGherkinSyntax(content: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const lines = content.split('\n').map(line => line.trim());

  let hasGiven = false;
  let hasWhen = false;
  let hasThen = false;

  for (const line of lines) {
    if (!line) continue;

    const keywords = ['Given', 'When', 'Then', 'And', 'But'];
    const startsWithKeyword = keywords.some(keyword =>
      line.startsWith(keyword + ' ')
    );

    if (!startsWithKeyword && line.length > 0) {
      errors.push(`Line "${line}" doesn't start with a valid Gherkin keyword`);
    }

    if (line.startsWith('Given ')) hasGiven = true;
    if (line.startsWith('When ')) hasWhen = true;
    if (line.startsWith('Then ')) hasThen = true;
  }

  if (!hasGiven) errors.push('Missing "Given" clause');
  if (!hasWhen) errors.push('Missing "When" clause');
  if (!hasThen) errors.push('Missing "Then" clause');

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Parse Gherkin content into structured data
 */
export function parseGherkinContent(content: string): GherkinCriteria {
  const lines = content
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const criteria: GherkinCriteria = {
    given: [],
    when: [],
    then: [],
    and: [],
    but: [],
  };

  for (const line of lines) {
    if (line.startsWith('Given ')) {
      criteria.given.push(line.substring(6));
    } else if (line.startsWith('When ')) {
      criteria.when.push(line.substring(5));
    } else if (line.startsWith('Then ')) {
      criteria.then.push(line.substring(5));
    } else if (line.startsWith('And ')) {
      criteria.and!.push(line.substring(4));
    } else if (line.startsWith('But ')) {
      criteria.but!.push(line.substring(4));
    }
  }

  return criteria;
}

/**
 * Convert structured Gherkin data to content string
 */
export function gherkinToContent(criteria: GherkinCriteria): string {
  const lines: string[] = [];

  criteria.given.forEach(item => lines.push(`Given ${item}`));
  criteria.when.forEach(item => lines.push(`When ${item}`));
  criteria.then.forEach(item => lines.push(`Then ${item}`));

  if (criteria.and?.length) {
    criteria.and.forEach(item => lines.push(`And ${item}`));
  }

  if (criteria.but?.length) {
    criteria.but.forEach(item => lines.push(`But ${item}`));
  }

  return lines.join('\n');
}

/**
 * Validate acceptance criteria content based on format
 */
export function validateAcceptanceCriteria(
  criteria: AcceptanceCriteriaData
): AcceptanceCriteriaData {
  const errors: string[] = [];
  let isValid = true;

  if (!criteria.content.trim()) {
    errors.push('Acceptance criteria content cannot be empty');
    isValid = false;
  }

  if (criteria.format === AcceptanceCriteriaFormat.GHERKIN) {
    const gherkinValidation = validateGherkinSyntax(criteria.content);
    if (!gherkinValidation.isValid) {
      errors.push(...gherkinValidation.errors);
      isValid = false;
    }
  }

  return {
    ...criteria,
    isValid,
    validationErrors: errors.length > 0 ? errors : undefined,
  };
}

// =============================================================================
// Time Tracking Utilities
// =============================================================================

/**
 * Calculate time tracking summary
 */
export function calculateTimeTrackingSummary(
  task: Task,
  timeEntries: any[] = []
): TimeTrackingSummary {
  const totalEstimated =
    (task.estimatedHours || 0) +
    task.subtasks.reduce(
      (sum, subtask) => sum + (subtask.estimatedHours || 0),
      0
    );

  const totalActual =
    (task.actualHours || 0) +
    task.subtasks.reduce((sum, subtask) => sum + (subtask.actualHours || 0), 0);

  const totalRemaining = Math.max(0, totalEstimated - totalActual);
  const isOverEstimate = totalActual > totalEstimated;
  const overageAmount = Math.max(0, totalActual - totalEstimated);
  const overagePercentage =
    totalEstimated > 0 ? (overageAmount / totalEstimated) * 100 : 0;

  // Calculate daily and category breakdowns
  const dailyBreakdown: Record<string, number> = {};
  const categoryBreakdown: Record<string, number> = {};

  for (const entry of timeEntries) {
    const day = format(new Date(entry.startTime), 'yyyy-MM-dd');
    dailyBreakdown[day] = (dailyBreakdown[day] || 0) + entry.duration;
    categoryBreakdown[entry.category] =
      (categoryBreakdown[entry.category] || 0) + entry.duration;
  }

  return {
    totalEstimated,
    totalActual,
    totalRemaining,
    isOverEstimate,
    overageAmount,
    overagePercentage,
    entries: timeEntries,
    dailyBreakdown,
    categoryBreakdown,
  };
}

// =============================================================================
// Form Utilities
// =============================================================================

/**
 * Convert Task to TaskFormData
 */
export function taskToFormData(task: Task): TaskFormData {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo || 'unassigned',
    estimatedHours: task.estimatedHours,
    actualHours: task.actualHours,
    dueDate: task.dueDate,
    startDate: task.startDate,
    tags: task.tags || [],
    dependencies: task.dependencies || [],
    order: task.order,
  };
}

/**
 * Convert TaskFormData to partial Task
 */
export function formDataToTask(
  formData: TaskFormData,
  existingTask?: Partial<Task>
): Partial<Task> {
  return {
    ...existingTask,
    title: formData.title,
    description: formData.description,
    status: formData.status,
    priority: formData.priority,
    assignedTo:
      formData.assignedTo === 'unassigned' ? undefined : formData.assignedTo,
    estimatedHours: formData.estimatedHours,
    actualHours: formData.actualHours,
    dueDate: formData.dueDate,
    startDate: formData.startDate,
    tags: formData.tags,
    dependencies: formData.dependencies,
    order: formData.order,
    updatedAt: new Date(),
  };
}

/**
 * Validate entire form
 */
export function validateTaskForm(formData: TaskFormData): FormValidation {
  try {
    taskFormSchema.parse(formData);

    const errors: Record<string, string[]> = {};
    const warnings: string[] = [];

    // Additional business logic validations
    if (
      formData.dueDate &&
      formData.startDate &&
      isBefore(formData.dueDate, formData.startDate)
    ) {
      errors.dueDate = ['Due date cannot be before start date'];
    }

    if (
      formData.estimatedHours &&
      formData.actualHours &&
      formData.actualHours > formData.estimatedHours * 2
    ) {
      warnings.push(
        'Actual hours significantly exceed estimate. Consider updating estimate.'
      );
    }

    if (formData.status === TaskStatus.COMPLETED && !formData.actualHours) {
      warnings.push('Consider logging actual hours for completed tasks.');
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
      hasBlockingErrors: Object.keys(errors).length > 0,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      for (const issue of error.issues) {
        const field = issue.path.join('.');
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      }

      return {
        isValid: false,
        errors,
        warnings: [],
        hasBlockingErrors: true,
      };
    }

    throw error;
  }
}

/**
 * Validate a specific field
 */
export function validateField(
  field: keyof TaskFormData,
  value: unknown,
  context?: Partial<TaskFormData>
): FieldValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const fieldSchema = taskFormSchema.shape[field];
    fieldSchema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.issues.map(issue => issue.message));
    }
  }

  // Field-specific validations with context
  if (field === 'dueDate' && value && context?.startDate) {
    if (isBefore(value as Date, context.startDate)) {
      errors.push('Due date cannot be before start date');
    }
  }

  if (field === 'actualHours' && value && context?.estimatedHours) {
    const actual = value as number;
    const estimated = context.estimatedHours;
    if (actual > estimated * 1.5) {
      warnings.push('Actual hours exceed estimate significantly');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// Progress Calculation Utilities
// =============================================================================

/**
 * Calculate task progress percentage
 */
export function calculateTaskProgress(task: Task): number {
  if (task.status === TaskStatus.COMPLETED) return 100;
  if (task.status === TaskStatus.TODO) return 0;

  // Calculate based on subtasks and checklist completion
  const subtaskProgress =
    task.subtasks.length > 0
      ? task.subtasks.reduce((sum, subtask) => {
          return (
            sum +
            (subtask.status === TaskStatus.COMPLETED ? 100 : subtask.progress)
          );
        }, 0) / task.subtasks.length
      : 0;

  const checklistProgress =
    task.checklist.length > 0
      ? (task.checklist.filter(item => item.isCompleted).length /
          task.checklist.length) *
        100
      : 0;

  // Weight subtasks more heavily than checklist
  const subtaskWeight = 0.7;
  const checklistWeight = 0.3;

  if (task.subtasks.length > 0 && task.checklist.length > 0) {
    return Math.round(
      subtaskProgress * subtaskWeight + checklistProgress * checklistWeight
    );
  } else if (task.subtasks.length > 0) {
    return Math.round(subtaskProgress);
  } else if (task.checklist.length > 0) {
    return Math.round(checklistProgress);
  }

  // Fallback to manual progress if available
  return task.progress || (task.status === TaskStatus.IN_PROGRESS ? 25 : 0);
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Generate a unique ID for new items
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format duration in hours and minutes
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  } else if (hours % 1 === 0) {
    return `${hours}h`;
  } else {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  }
}

/**
 * Format date for display
 */
export function formatDate(date: Date, formatStr = 'MMM dd, yyyy'): string {
  return format(date, formatStr);
}

/**
 * Check if task is overdue
 */
export function isTaskOverdue(task: Task): boolean {
  if (
    !task.dueDate ||
    task.status === TaskStatus.COMPLETED ||
    task.status === TaskStatus.CANCELLED
  ) {
    return false;
  }
  return isBefore(task.dueDate, new Date());
}

/**
 * Get task urgency level
 */
export function getTaskUrgency(
  task: Task
): 'low' | 'medium' | 'high' | 'critical' {
  if (!task.dueDate) return 'low';

  const now = new Date();
  const daysUntilDue = Math.ceil(
    (task.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue < 0) return 'critical'; // Overdue
  if (daysUntilDue <= 1) return 'high';
  if (daysUntilDue <= 3) return 'medium';
  return 'low';
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce function for auto-save
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Check if two objects are deeply equal
 */
export function isEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
