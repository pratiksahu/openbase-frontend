/**
 * TaskEditor Component Type Definitions
 *
 * This file contains comprehensive type definitions for the TaskEditor component system,
 * including form schemas, UI state, and component interfaces.
 *
 * @fileoverview Type definitions for TaskEditor components
 * @version 1.0.0
 */

import {
  Task,
  Subtask,
  ChecklistItem,
  TaskStatus,
  GoalPriority
} from '@/types/smart-goals.types';

// =============================================================================
// Form Data Types
// =============================================================================

/** Task form data for editing */
export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: GoalPriority;
  assignedTo?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  startDate?: Date;
  tags: string[];
  dependencies: string[];
  order: number;
}

/** Subtask form data */
export interface SubtaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: GoalPriority;
  assignedTo?: string;
  estimatedHours?: number;
  dueDate?: Date;
  order: number;
  tags: string[];
}

/** Checklist item form data */
export interface ChecklistFormData {
  title: string;
  description?: string;
  isCompleted: boolean;
  isRequired: boolean;
  order: number;
}

// =============================================================================
// Acceptance Criteria Types
// =============================================================================

/** Acceptance criteria format types */
export enum AcceptanceCriteriaFormat {
  PLAIN_TEXT = 'plain_text',
  GHERKIN = 'gherkin',
  MARKDOWN = 'markdown',
}

/** Gherkin syntax structure */
export interface GherkinCriteria {
  given: string[];
  when: string[];
  then: string[];
  and?: string[];
  but?: string[];
}

/** Acceptance criteria data */
export interface AcceptanceCriteriaData {
  format: AcceptanceCriteriaFormat;
  content: string;
  gherkinData?: GherkinCriteria;
  isValid: boolean;
  validationErrors?: string[];
}

// =============================================================================
// Status Management Types
// =============================================================================

/** Valid status transitions */
export const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.BLOCKED, TaskStatus.COMPLETED, TaskStatus.TODO],
  [TaskStatus.BLOCKED]: [TaskStatus.IN_PROGRESS, TaskStatus.TODO],
  [TaskStatus.COMPLETED]: [], // Terminal state
  [TaskStatus.CANCELLED]: [TaskStatus.TODO], // Can resurrect cancelled tasks
};

/** Status history entry */
export interface StatusHistoryEntry {
  id: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  changedAt: Date;
  changedBy: string;
  reason?: string;
  comment?: string;
}

/** Status change confirmation data */
export interface StatusChangeConfirmation {
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  requiresConfirmation: boolean;
  confirmationMessage?: string;
  warningMessage?: string;
}

// =============================================================================
// Component State Types
// =============================================================================

/** Task editor mode */
export enum TaskEditorMode {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

/** Task editor section visibility */
export interface SectionVisibility {
  subtasks: boolean;
  checklist: boolean;
  acceptanceCriteria: boolean;
  dependencies: boolean;
  timeTracking: boolean;
  statusHistory: boolean;
}

/** Task editor UI state */
export interface TaskEditorState {
  mode: TaskEditorMode;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  hasUnsavedChanges: boolean;
  activeSection: string | null;
  sectionVisibility: SectionVisibility;
  errors: Record<string, string[]>;
  warnings: string[];
  lastSaved?: Date;
  autoSaveEnabled: boolean;
}

// =============================================================================
// Drag and Drop Types
// =============================================================================

/** Draggable item types */
export enum DragItemType {
  SUBTASK = 'subtask',
  CHECKLIST_ITEM = 'checklist_item',
  DEPENDENCY = 'dependency',
}

/** Drag and drop item */
export interface DragItem {
  id: string;
  type: DragItemType;
  index: number;
  data: Subtask | ChecklistItem | string;
}

/** Drop result */
export interface DropResult {
  dragIndex: number;
  hoverIndex: number;
  item: DragItem;
}

// =============================================================================
// Time Tracking Types
// =============================================================================

/** Time tracking entry */
export interface TimeEntry {
  id: string;
  taskId: string;
  subtaskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  description?: string;
  category: 'development' | 'testing' | 'review' | 'meeting' | 'research' | 'other';
  userId: string;
  isActive: boolean;
  createdAt: Date;
}

/** Time tracking summary */
export interface TimeTrackingSummary {
  totalEstimated: number;
  totalActual: number;
  totalRemaining: number;
  isOverEstimate: boolean;
  overageAmount: number;
  overagePercentage: number;
  entries: TimeEntry[];
  dailyBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

// =============================================================================
// Validation Types
// =============================================================================

/** Field validation result */
export interface FieldValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/** Form validation result */
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: string[];
  hasBlockingErrors: boolean;
}

// =============================================================================
// Template Types
// =============================================================================

/** Task template for common task types */
export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  taskData: Partial<TaskFormData>;
  subtaskTemplates: Partial<SubtaskFormData>[];
  checklistTemplates: Partial<ChecklistFormData>[];
  acceptanceCriteriaTemplate?: AcceptanceCriteriaData;
  estimatedHours?: number;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
}

/** Template snippet for acceptance criteria */
export interface TemplateSnippet {
  id: string;
  name: string;
  description: string;
  format: AcceptanceCriteriaFormat;
  content: string;
  category: string;
  keywords: string[];
}

// =============================================================================
// Event Types
// =============================================================================

/** Task editor event types */
export enum TaskEditorEvent {
  TASK_SAVED = 'task_saved',
  TASK_CANCELLED = 'task_cancelled',
  SUBTASK_ADDED = 'subtask_added',
  SUBTASK_REMOVED = 'subtask_removed',
  SUBTASK_UPDATED = 'subtask_updated',
  CHECKLIST_ITEM_ADDED = 'checklist_item_added',
  CHECKLIST_ITEM_REMOVED = 'checklist_item_removed',
  CHECKLIST_ITEM_TOGGLED = 'checklist_item_toggled',
  STATUS_CHANGED = 'status_changed',
  DEPENDENCY_ADDED = 'dependency_added',
  DEPENDENCY_REMOVED = 'dependency_removed',
  TIME_TRACKED = 'time_tracked',
  VALIDATION_ERROR = 'validation_error',
  AUTO_SAVE = 'auto_save',
}

/** Event payload base */
interface BaseEventPayload {
  taskId: string;
  timestamp: Date;
  userId: string;
}

/** Task saved event payload */
export interface TaskSavedPayload extends BaseEventPayload {
  task: Task;
  changes: Partial<TaskFormData>;
  isNewTask: boolean;
}

/** Subtask event payload */
export interface SubtaskEventPayload extends BaseEventPayload {
  subtaskId: string;
  subtask?: Subtask;
  changes?: Partial<SubtaskFormData>;
}

/** Status change event payload */
export interface StatusChangePayload extends BaseEventPayload {
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  reason?: string;
  comment?: string;
}

// =============================================================================
// Component Props Types
// =============================================================================

/** TaskEditor main component props */
export interface TaskEditorProps {
  task?: Task;
  goalId: string;
  mode?: TaskEditorMode;
  onSave: (task: Task) => Promise<void>;
  onCancel: () => void;
  onDelete?: (taskId: string) => Promise<void>;
  onStatusChange?: (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) => Promise<void>;
  availableAssignees?: Array<{ id: string; name: string; email: string }>;
  availableTasks?: Array<{ id: string; title: string }>; // For dependencies
  templates?: TaskTemplate[];
  className?: string;
  autoSave?: boolean;
  autoSaveDelay?: number; // in milliseconds
}

/** SubtaskList component props */
export interface SubtaskListProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
  onSubtaskAdd: (subtask: Omit<Subtask, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
  onSubtaskUpdate: (subtaskId: string, changes: Partial<Subtask>) => void;
  onSubtaskDelete: (subtaskId: string) => void;
  onSubtaskReorder: (fromIndex: number, toIndex: number) => void;
  availableAssignees?: Array<{ id: string; name: string; email: string }>;
  isReadOnly?: boolean;
  className?: string;
}

/** ChecklistEditor component props */
export interface ChecklistEditorProps {
  checklist: ChecklistItem[];
  onChecklistChange: (checklist: ChecklistItem[]) => void;
  onItemAdd: (item: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
  onItemUpdate: (itemId: string, changes: Partial<ChecklistItem>) => void;
  onItemDelete: (itemId: string) => void;
  onItemToggle: (itemId: string) => void;
  onItemReorder: (fromIndex: number, toIndex: number) => void;
  supportMarkdown?: boolean;
  isReadOnly?: boolean;
  className?: string;
}

/** AcceptanceCriteria component props */
export interface AcceptanceCriteriaProps {
  criteria: AcceptanceCriteriaData;
  onCriteriaChange: (criteria: AcceptanceCriteriaData) => void;
  templates?: TemplateSnippet[];
  supportedFormats?: AcceptanceCriteriaFormat[];
  showPreview?: boolean;
  isReadOnly?: boolean;
  className?: string;
}

// =============================================================================
// Hook Types
// =============================================================================

/** Hook for managing task editor state */
export interface UseTaskEditorReturn {
  state: TaskEditorState;
  formData: TaskFormData;
  subtasks: Subtask[];
  checklist: ChecklistItem[];
  acceptanceCriteria: AcceptanceCriteriaData;
  statusHistory: StatusHistoryEntry[];
  timeTracking: TimeTrackingSummary;

  // Actions
  updateFormData: (data: Partial<TaskFormData>) => void;
  updateSubtasks: (subtasks: Subtask[]) => void;
  updateChecklist: (checklist: ChecklistItem[]) => void;
  updateAcceptanceCriteria: (criteria: AcceptanceCriteriaData) => void;
  changeStatus: (newStatus: TaskStatus, reason?: string, comment?: string) => Promise<void>;
  saveTask: () => Promise<void>;
  cancelEditing: () => void;
  resetForm: () => void;

  // Validation
  validateForm: () => FormValidation;
  validateField: (field: keyof TaskFormData, value: unknown) => FieldValidation;

  // State management
  setMode: (mode: TaskEditorMode) => void;
  toggleSection: (section: keyof SectionVisibility) => void;
  setActiveSection: (section: string | null) => void;

  // Auto-save
  enableAutoSave: () => void;
  disableAutoSave: () => void;
  triggerAutoSave: () => void;
}

// =============================================================================
// Utility Types
// =============================================================================

/** Utility type for partial form updates */
export type PartialFormData<T> = {
  [K in keyof T]?: T[K] extends Date ? Date | string : T[K];
};

/** Utility type for form field paths */
export type FormFieldPath =
  | keyof TaskFormData
  | `subtasks.${number}.${keyof SubtaskFormData}`
  | `checklist.${number}.${keyof ChecklistFormData}`
  | `acceptanceCriteria.${keyof AcceptanceCriteriaData}`;

/** Utility type for creating new entities */
export type CreateEntity<T extends { id: string; createdAt: Date; updatedAt: Date; createdBy: string; updatedBy: string }> =
  Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

// =============================================================================
// Export all types
// =============================================================================

export type {
  Task,
  Subtask,
  ChecklistItem,
  TaskStatus,
  GoalPriority,
} from '@/types/smart-goals.types';