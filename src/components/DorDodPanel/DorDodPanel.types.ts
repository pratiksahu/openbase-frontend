export interface Criterion {
  id: string;
  description: string;
  category: CriteriaCategory;
  helpText?: string;
  isCompleted: boolean;
  validationRule?: ValidationRule;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export type CriteriaCategory = 'required' | 'recommended' | 'optional';

export interface ValidationRule {
  type: 'required' | 'conditional' | 'dependency';
  message: string;
  condition?: string; // For conditional validation
  dependsOn?: string[]; // IDs of other criteria this depends on
}

export interface DorDodTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  dorCriteria: Omit<Criterion, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>[];
  dodCriteria: Omit<Criterion, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>[];
  isCustom: boolean;
}

export type TemplateCategory =
  | 'software-development'
  | 'design'
  | 'content'
  | 'marketing'
  | 'research'
  | 'custom';

export interface ProgressMetrics {
  readinessScore: number; // 0-100
  completionScore: number; // 0-100
  requiredItemsCompleted: number;
  totalRequiredItems: number;
  recommendedItemsCompleted: number;
  totalRecommendedItems: number;
  optionalItemsCompleted: number;
  totalOptionalItems: number;
  isReadyToStart: boolean;
  isReadyToComplete: boolean;
}

export interface TimeTracking {
  markedReadyAt?: Date;
  markedDoneAt?: Date;
  timeInProgress?: number; // milliseconds
  estimatedDuration?: number; // milliseconds
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  blockingCriteria: string[]; // IDs of criteria blocking progress
}

export interface ValidationError {
  criterionId: string;
  message: string;
  type: 'required' | 'dependency' | 'conditional';
}

export interface ValidationWarning {
  criterionId: string;
  message: string;
  type: 'recommendation' | 'best-practice';
}

export interface ApprovalWorkflow {
  requestedAt?: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  comments: ApprovalComment[];
  status: ApprovalStatus;
}

export type ApprovalStatus = 'none' | 'requested' | 'approved' | 'rejected';

export interface ApprovalComment {
  id: string;
  author: string;
  message: string;
  createdAt: Date;
  type: 'comment' | 'approval' | 'rejection';
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: AuditAction;
  userId?: string;
  criterionId?: string;
  oldValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
}

export type AuditAction =
  | 'criterion-added'
  | 'criterion-updated'
  | 'criterion-deleted'
  | 'criterion-completed'
  | 'criterion-uncompleted'
  | 'template-applied'
  | 'validation-failed'
  | 'approval-requested'
  | 'approval-granted'
  | 'approval-rejected';

export interface DorDodState {
  dorCriteria: Criterion[];
  dodCriteria: Criterion[];
  currentTemplate?: DorDodTemplate;
  progressMetrics: ProgressMetrics;
  timeTracking: TimeTracking;
  validationResult: ValidationResult;
  approvalWorkflow: ApprovalWorkflow;
  auditLog: AuditLogEntry[];
  lastUpdated: Date;
}

export interface DorDodPanelProps {
  initialState?: Partial<DorDodState>;
  templates?: DorDodTemplate[];
  onStateChange?: (state: DorDodState) => void;
  onValidationChange?: (result: ValidationResult) => void;
  onApprovalRequest?: (criteria: Criterion[]) => void;
  readOnly?: boolean;
  showProgressIndicators?: boolean;
  showTimeTracking?: boolean;
  showApprovalWorkflow?: boolean;
  showAuditLog?: boolean;
  className?: string;
  collapsed?: boolean;
  printMode?: boolean;
}

export interface CriteriaListProps {
  criteria: Criterion[];
  onCriterionToggle: (id: string, completed: boolean) => void;
  onCriterionEdit?: (criterion: Criterion) => void;
  onCriterionDelete?: (id: string) => void;
  onReorder?: (criteriaIds: string[]) => void;
  readOnly?: boolean;
  showCategories?: boolean;
  showProgress?: boolean;
  validationResult?: ValidationResult;
}

export interface CriteriaEditorProps {
  criterion?: Criterion;
  onSave: (criterion: Omit<Criterion, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  availableTemplates?: DorDodTemplate[];
  mode: 'add' | 'edit' | 'bulk';
}

export interface TemplateApplyOptions {
  mergeWithExisting: boolean;
  replaceExisting: boolean;
  categoryFilter?: CriteriaCategory[];
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'markdown' | 'pdf';
  includeCriteria: boolean;
  includeProgress: boolean;
  includeAuditLog: boolean;
  includeTimeTracking: boolean;
}

export interface ImportOptions {
  format: 'json' | 'csv';
  mergeStrategy: 'replace' | 'merge' | 'append';
  validateOnImport: boolean;
}

// Utility types for component state management
export type DorDodAction =
  | { type: 'ADD_CRITERION'; payload: { section: 'dor' | 'dod'; criterion: Omit<Criterion, 'id' | 'createdAt' | 'updatedAt'> } }
  | { type: 'UPDATE_CRITERION'; payload: { id: string; updates: Partial<Criterion> } }
  | { type: 'DELETE_CRITERION'; payload: { id: string } }
  | { type: 'TOGGLE_CRITERION'; payload: { id: string; completed: boolean } }
  | { type: 'REORDER_CRITERIA'; payload: { section: 'dor' | 'dod'; criteriaIds: string[] } }
  | { type: 'APPLY_TEMPLATE'; payload: { template: DorDodTemplate; options: TemplateApplyOptions } }
  | { type: 'CLEAR_ALL'; payload: { section?: 'dor' | 'dod' } }
  | { type: 'REQUEST_APPROVAL'; payload: { section: 'dor' | 'dod' } }
  | { type: 'APPROVE'; payload: { approver: string; comments?: string } }
  | { type: 'REJECT'; payload: { rejector: string; reason: string } };