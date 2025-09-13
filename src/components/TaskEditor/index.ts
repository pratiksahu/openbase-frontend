/**
 * TaskEditor Module Exports
 *
 * Barrel export file for the TaskEditor component system.
 * Provides clean imports for all TaskEditor components, types, and utilities.
 *
 * @fileoverview TaskEditor module exports
 * @version 1.0.0
 */

// =============================================================================
// Main Components
// =============================================================================

export { TaskEditor } from './TaskEditor';
export { SubtaskList } from './SubtaskList';
export { ChecklistEditor } from './ChecklistEditor';
export { AcceptanceCriteria } from './AcceptanceCriteria';

// =============================================================================
// Types and Interfaces
// =============================================================================

export type {
  // Form Data Types
  TaskFormData,
  SubtaskFormData,
  ChecklistFormData,

  // Acceptance Criteria Types
  AcceptanceCriteriaData,
  GherkinCriteria,
  TemplateSnippet,

  // Component State Types
  TaskEditorState,
  SectionVisibility,
  StatusHistoryEntry,
  StatusChangeConfirmation,

  // Drag and Drop Types
  DragItem,
  DropResult,

  // Time Tracking Types
  TimeEntry,
  TimeTrackingSummary,

  // Validation Types
  FieldValidation,
  FormValidation,

  // Template Types
  TaskTemplate,

  // Component Props Types
  TaskEditorProps,
  SubtaskListProps,
  ChecklistEditorProps,
  AcceptanceCriteriaProps,

  // Hook Types
  UseTaskEditorReturn,

  // Utility Types
  PartialFormData,
  FormFieldPath,
  CreateEntity,
} from './TaskEditor.types';

// Export enums
export {
  AcceptanceCriteriaFormat,
  TaskEditorMode,
  TaskEditorEvent,
  DragItemType,
} from './TaskEditor.types';

// Export constants
export { STATUS_TRANSITIONS } from './TaskEditor.types';

// =============================================================================
// Utilities and Helpers
// =============================================================================

export {
  // Validation Schemas
  taskFormSchema,
  subtaskFormSchema,
  checklistItemSchema,
  acceptanceCriteriaSchema,

  // Status Management Utilities
  isValidStatusTransition,
  getAllowedStatusTransitions,
  getStatusChangeConfirmation,
  getStatusColor,
  getPriorityColor,

  // Acceptance Criteria Utilities
  validateGherkinSyntax,
  parseGherkinContent,
  gherkinToContent,
  validateAcceptanceCriteria,

  // Time Tracking Utilities
  calculateTimeTrackingSummary,

  // Form Utilities
  taskToFormData,
  formDataToTask,
  validateTaskForm,
  validateField,

  // Progress Calculation Utilities
  calculateTaskProgress,

  // Utility Functions
  generateId,
  formatDuration,
  formatDate,
  isTaskOverdue,
  getTaskUrgency,
  deepClone,
  debounce,
  isEqual,
} from './TaskEditor.utils';

// =============================================================================
// Re-export relevant types from smart-goals.types
// =============================================================================

export type {
  Task,
  Subtask,
  ChecklistItem,
  TaskStatus,
  GoalPriority,
} from '@/types/smart-goals.types';

export {
  TaskStatus,
  GoalPriority,
} from '@/types/smart-goals.types';

// =============================================================================
// Default Exports for Easy Import
// =============================================================================

// Default export is the main TaskEditor component
export { TaskEditor as default } from './TaskEditor';