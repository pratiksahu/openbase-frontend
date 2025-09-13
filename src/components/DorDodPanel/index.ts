// Main component exports
export { DorDodPanel } from './DorDodPanel';
export { CriteriaList } from './CriteriaList';
export { CriteriaEditor } from './CriteriaEditor';

// Type exports
export type {
  // Main types
  DorDodPanelProps,
  DorDodState,
  DorDodAction,

  // Criterion types
  Criterion,
  CriteriaCategory,
  ValidationRule,

  // Template types
  DorDodTemplate,
  TemplateCategory,
  TemplateApplyOptions,

  // Progress and validation types
  ProgressMetrics,
  ValidationResult,
  ValidationError,
  ValidationWarning,

  // Time tracking types
  TimeTracking,

  // Approval workflow types
  ApprovalWorkflow,
  ApprovalStatus,
  ApprovalComment,

  // Audit log types
  AuditLogEntry,
  AuditAction,

  // Component prop types
  CriteriaListProps,
  CriteriaEditorProps,

  // Export/import types
  ExportOptions,
  ImportOptions,
} from './DorDodPanel.types';

// Utility exports
export {
  // Progress calculations
  calculateProgressMetrics,
  getCategoryProgress,
  getProgressColor,
  getCategoryInfo,

  // Validation
  validateCriteria,

  // Criterion management
  createCriterion,
  generateCriterionId,
  sortCriteria,

  // Template operations
  applyTemplate,

  // Export functionality
  exportCriteria,

  // Time calculations
  calculateTimeMetrics,

  // Audit logging
  createAuditLogEntry,

  // General utilities
  debounce,
  deepClone,
} from './DorDodPanel.utils';

// Template exports
export {
  defaultTemplates,
  getTemplateById,
  getTemplatesByCategory,
  createCustomTemplate,
} from './defaultTemplates';