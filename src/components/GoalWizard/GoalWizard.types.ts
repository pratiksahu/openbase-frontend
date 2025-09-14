/**
 * GoalWizard Component Type Definitions
 *
 * This file contains comprehensive type definitions for the GoalWizard multi-step
 * component for creating SMART goals with validation, draft saving, and navigation.
 */

import { SmartScoreResult } from '@/components/SmartScoreBadge/SmartScoreBadge.types';
import {
  SmartGoal,
  SmartGoalCreate,
  GoalCategory,
  GoalPriority,
  MeasurableSpec,
  Resource,
  RequiredSkill,
  Constraint,
  StrategyAlignment,
  Stakeholder,
} from '@/types/smart-goals.types';

// =============================================================================
// Wizard Configuration and Steps
// =============================================================================

/** Wizard step identifiers */
export enum WizardStep {
  CONTEXT = 'context',
  SPECIFIC = 'specific',
  MEASURABLE = 'measurable',
  ACHIEVABLE = 'achievable',
  RELEVANT = 'relevant',
  TIMEBOUND = 'timebound',
  PREVIEW = 'preview',
}

/** Step completion status */
export enum StepStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ERROR = 'error',
}

/** Navigation direction */
export enum NavigationDirection {
  PREVIOUS = 'previous',
  NEXT = 'next',
  JUMP = 'jump',
}

/** Goal templates available for quick start */
export enum GoalTemplate {
  BUSINESS = 'business',
  PERSONAL_DEVELOPMENT = 'personal_development',
  PROJECT_MILESTONE = 'project_milestone',
  TEAM_OBJECTIVE = 'team_objective',
  HEALTH_FITNESS = 'health_fitness',
  FINANCIAL = 'financial',
  CUSTOM = 'custom',
}

// =============================================================================
// Form Data Interfaces
// =============================================================================

/** Context step form data */
export interface ContextStepData {
  /** Current situation description */
  currentSituation: string;
  /** Problem statement being addressed */
  problemStatement: string;
  /** Initial goal description */
  initialGoalDescription: string;
  /** Stakeholders involved */
  stakeholdersInvolved: string[];
  /** Selected template */
  selectedTemplate?: GoalTemplate;
  /** Goal category */
  category: GoalCategory;
  /** Background context */
  background?: string;
}

/** Specific step form data */
export interface SpecificStepData {
  /** Goal title */
  title: string;
  /** Detailed goal description */
  description: string;
  /** Clear objective statement */
  specificObjective: string;
  /** Success criteria list */
  successCriteria: string[];
  /** Scope boundaries */
  scopeBoundaries?: string;
  /** Non-goals (what is excluded) */
  nonGoals?: string[];
  /** Tags for organization */
  tags: string[];
}

/** Measurable step form data */
export interface MeasurableStepData {
  /** Primary metric specification */
  measurable: MeasurableSpec;
  /** Additional metrics if any */
  additionalMetrics?: MeasurableSpec[];
  /** Success criteria definitions */
  successDefinitions: string[];
  /** Measurement templates used */
  measurementTemplate?: 'kpi' | 'okr' | 'balanced_scorecard';
}

/** Achievable step form data */
export interface AchievableStepData {
  /** Required resources */
  requiredResources: Resource[];
  /** Required skills */
  requiredSkills: RequiredSkill[];
  /** Identified constraints */
  constraints: Constraint[];
  /** Risk assessment */
  riskAssessment: string;
  /** Mitigation strategies */
  mitigationStrategies: string[];
  /** Budget estimate */
  budgetEstimate?: number;
  /** Time allocation */
  timeAllocation?: number;
}

/** Relevant step form data */
export interface RelevantStepData {
  /** Rationale for this goal */
  rationale: string;
  /** Strategic alignments */
  strategyAlignments: StrategyAlignment[];
  /** Stakeholder mapping */
  stakeholders: Stakeholder[];
  /** Expected benefits */
  expectedBenefits: string[];
  /** Risks of not achieving */
  risksOfNotAchieving: string[];
  /** Business impact estimate */
  businessImpact?: string;
  /** ROI estimation */
  roiEstimation?: number;
}

/** Timebound step form data */
export interface TimeboundStepData {
  /** Goal start date */
  startDate: Date;
  /** Target completion date */
  targetDate: Date;
  /** Hard deadline if different */
  deadline?: Date;
  /** Buffer time in days */
  bufferDays?: number;
  /** Is this goal recurring */
  isRecurring: boolean;
  /** Recurrence pattern */
  recurrencePattern?: string;
  /** Key milestones */
  milestones: Array<{
    title: string;
    date: Date;
    description?: string;
  }>;
  /** Dependencies on other goals */
  dependencies?: string[];
}

/** Complete wizard form data */
export interface WizardFormData {
  /** Context step data */
  context: ContextStepData;
  /** Specific step data */
  specific: SpecificStepData;
  /** Measurable step data */
  measurable: MeasurableStepData;
  /** Achievable step data */
  achievable: AchievableStepData;
  /** Relevant step data */
  relevant: RelevantStepData;
  /** Timebound step data */
  timebound: TimeboundStepData;
  /** Goal priority */
  priority: GoalPriority;
  /** Goal visibility */
  visibility: 'private' | 'team' | 'organization' | 'public';
}

// =============================================================================
// Step Configuration
// =============================================================================

/** Configuration for each wizard step */
export interface StepConfig {
  /** Step identifier */
  step: WizardStep;
  /** Display title */
  title: string;
  /** Short description */
  description: string;
  /** Detailed help content */
  helpContent?: string;
  /** Icon name (Lucide React) */
  icon: string;
  /** Whether this step is required */
  required: boolean;
  /** Estimated completion time in minutes */
  estimatedTime?: number;
  /** Fields that must be filled to complete */
  requiredFields: string[];
  /** Validation function */
  validate?: (data: Partial<WizardFormData>) => ValidationResult;
}

/** Step validation result */
export interface ValidationResult {
  /** Whether step is valid */
  isValid: boolean;
  /** Validation errors by field */
  errors: Record<string, string[]>;
  /** Warning messages */
  warnings?: string[];
  /** Improvement suggestions */
  suggestions?: string[];
}

// =============================================================================
// Wizard State Management
// =============================================================================

/** Current wizard state */
export interface WizardState {
  /** Current step index */
  currentStep: WizardStep;
  /** Form data for all steps */
  formData: Partial<WizardFormData>;
  /** Step completion status */
  stepStatus: Record<WizardStep, StepStatus>;
  /** Step validation results */
  validationResults: Record<WizardStep, ValidationResult>;
  /** Navigation history */
  navigationHistory: WizardStep[];
  /** Whether wizard is in draft mode */
  isDraft: boolean;
  /** Last saved timestamp */
  lastSaved?: Date;
  /** Auto-save enabled */
  autoSaveEnabled: boolean;
  /** Has unsaved changes */
  hasUnsavedChanges: boolean;
  /** SMART score calculation result */
  smartScore?: SmartScoreResult;
  /** Template data if used */
  templateData?: Partial<WizardFormData>;
}

/** Wizard action types */
export enum WizardActionType {
  SET_CURRENT_STEP = 'SET_CURRENT_STEP',
  UPDATE_FORM_DATA = 'UPDATE_FORM_DATA',
  SET_STEP_STATUS = 'SET_STEP_STATUS',
  SET_VALIDATION_RESULT = 'SET_VALIDATION_RESULT',
  ADD_TO_HISTORY = 'ADD_TO_HISTORY',
  SAVE_DRAFT = 'SAVE_DRAFT',
  LOAD_DRAFT = 'LOAD_DRAFT',
  RESET_WIZARD = 'RESET_WIZARD',
  APPLY_TEMPLATE = 'APPLY_TEMPLATE',
  UPDATE_SMART_SCORE = 'UPDATE_SMART_SCORE',
  TOGGLE_AUTO_SAVE = 'TOGGLE_AUTO_SAVE',
  MARK_UNSAVED_CHANGES = 'MARK_UNSAVED_CHANGES',
}

/** Wizard actions */
export interface WizardAction {
  type: WizardActionType;
  payload?: any;
}

// =============================================================================
// Component Props
// =============================================================================

/** Main GoalWizard component props */
export interface GoalWizardProps {
  /** Initial goal data for editing */
  initialGoal?: Partial<SmartGoal>;
  /** Callback when goal is saved */
  onSave: (goal: SmartGoalCreate) => void;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Callback for draft saving */
  onSaveDraft?: (formData: Partial<WizardFormData>) => void;
  /** Callback when step changes */
  onStepChange?: (step: WizardStep) => void;
  /** Whether auto-save is enabled */
  autoSaveEnabled?: boolean;
  /** Auto-save interval in seconds */
  autoSaveInterval?: number;
  /** Custom CSS classes */
  className?: string;
  /** Whether to show progress indicator */
  showProgress?: boolean;
  /** Available templates */
  templates?: GoalTemplate[];
}

/** WizardStepper component props */
export interface WizardStepperProps {
  /** Current active step */
  currentStep: WizardStep;
  /** Step status mapping */
  stepStatus: Record<WizardStep, StepStatus>;
  /** Callback when step is clicked */
  onStepClick: (step: WizardStep) => void;
  /** Step configurations */
  steps: StepConfig[];
  /** Whether navigation is disabled */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Show step descriptions */
  showDescriptions?: boolean;
  /** Show estimated time */
  showEstimatedTime?: boolean;
}

/** Step component base props */
export interface BaseStepProps<TData = any> {
  /** Step-specific form data */
  data: TData;
  /** Callback when data changes */
  onChange: (data: Partial<TData>) => void;
  /** Validation errors */
  errors: Record<string, string[]>;
  /** Whether in read-only mode */
  readOnly?: boolean;
  /** Step configuration */
  config: StepConfig;
  /** Custom CSS classes */
  className?: string;
  /** Validation warnings */
  warnings?: string[];
  /** Improvement suggestions */
  suggestions?: string[];
}

/** Context step component props */
export interface ContextStepProps extends BaseStepProps<ContextStepData> {
  /** Available templates */
  templates?: GoalTemplate[];
  /** Callback when template is selected */
  onTemplateSelect?: (template: GoalTemplate) => void;
}

/** Specific step component props */
export interface SpecificStepProps extends BaseStepProps<SpecificStepData> {
  /** AI suggestion callback */
  onRequestSuggestion?: (field: string, context: string) => Promise<string[]>;
}

/** Measurable step component props */
export interface MeasurableStepProps extends BaseStepProps<MeasurableStepData> {
  /** Goal ID for metric editor */
  goalId?: string;
}

/** Achievable step component props */
export interface AchievableStepProps extends BaseStepProps<AchievableStepData> {
  /** Resource suggestion callback */
  onRequestResources?: (context: string) => Promise<Resource[]>;
}

/** Relevant step component props */
export interface RelevantStepProps extends BaseStepProps<RelevantStepData> {
  /** Strategy alignment callback */
  onValidateAlignment?: (alignment: StrategyAlignment[]) => Promise<boolean>;
}

/** Timebound step component props */
export interface TimeboundStepProps extends BaseStepProps<TimeboundStepData> {
  /** Timeline validation callback */
  onValidateTimeline?: (timeline: Date[]) => Promise<boolean>;
}

/** Preview step component props */
export interface PreviewStepProps extends BaseStepProps {
  /** Complete form data for preview */
  formData: WizardFormData;
  /** SMART score result */
  smartScore?: SmartScoreResult;
  /** Export callback */
  onExport?: (format: 'pdf' | 'json' | 'markdown') => void;
}

// =============================================================================
// Navigation and Control
// =============================================================================

/** Navigation control configuration */
export interface NavigationConfig {
  /** Show previous button */
  showPrevious: boolean;
  /** Show next button */
  showNext: boolean;
  /** Show save draft button */
  showSaveDraft: boolean;
  /** Show cancel button */
  showCancel: boolean;
  /** Previous button text */
  previousText?: string;
  /** Next button text */
  nextText?: string;
  /** Save draft button text */
  saveDraftText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Whether next is disabled */
  nextDisabled: boolean;
  /** Whether previous is disabled */
  previousDisabled: boolean;
}

/** Keyboard shortcut configuration */
export interface KeyboardShortcuts {
  /** Next step shortcut */
  next: string;
  /** Previous step shortcut */
  previous: string;
  /** Save draft shortcut */
  saveDraft: string;
  /** Cancel shortcut */
  cancel: string;
}

// =============================================================================
// Local Storage and Persistence
// =============================================================================

/** Draft metadata for storage */
export interface DraftMetadata {
  /** Draft ID */
  id: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last updated timestamp */
  updatedAt: Date;
  /** Goal title for identification */
  title?: string;
  /** Current step when saved */
  currentStep: WizardStep;
  /** Completion percentage */
  completionPercentage: number;
  /** Version for migration */
  version: number;
}

/** Stored draft data */
export interface StoredDraft {
  /** Draft metadata */
  metadata: DraftMetadata;
  /** Form data */
  formData: Partial<WizardFormData>;
  /** Wizard state */
  wizardState: Partial<WizardState>;
}

// =============================================================================
// Template System
// =============================================================================

/** Template definition */
export interface TemplateDefinition {
  /** Template ID */
  id: GoalTemplate;
  /** Display name */
  name: string;
  /** Template description */
  description: string;
  /** Template category */
  category: string;
  /** Icon name */
  icon: string;
  /** Pre-filled form data */
  formData: Partial<WizardFormData>;
  /** Suggested values */
  suggestions?: Record<string, string[]>;
  /** Usage examples */
  examples?: string[];
  /** Tags for filtering */
  tags: string[];
}

// =============================================================================
// Analytics and Tracking
// =============================================================================

/** Wizard analytics data */
export interface WizardAnalytics {
  /** Session start time */
  sessionStart: Date;
  /** Total time spent */
  totalTimeSpent: number;
  /** Time spent per step */
  timePerStep: Record<WizardStep, number>;
  /** Number of back/forward navigations */
  navigationCount: number;
  /** Number of validation errors */
  errorCount: number;
  /** Fields modified */
  fieldsModified: string[];
  /** Templates used */
  templatesUsed: GoalTemplate[];
  /** Draft saves count */
  draftSaves: number;
  /** Completion status */
  completed: boolean;
}

// =============================================================================
// Export Options
// =============================================================================

/** Export configuration */
export interface ExportOptions {
  /** Export format */
  format: 'pdf' | 'json' | 'markdown' | 'csv';
  /** Include SMART score */
  includeScore?: boolean;
  /** Include suggestions */
  includeSuggestions?: boolean;
  /** Include timeline */
  includeTimeline?: boolean;
  /** Include resources */
  includeResources?: boolean;
  /** Template to use for formatting */
  template?: string;
}

/** Export result */
export interface ExportResult {
  /** Export was successful */
  success: boolean;
  /** Generated content */
  content?: string;
  /** Download URL if applicable */
  downloadUrl?: string;
  /** Error message if failed */
  error?: string;
  /** File size in bytes */
  fileSize?: number;
}

// =============================================================================
// Context Provider Interface
// =============================================================================

/** Context value for wizard state */
export interface WizardContextValue {
  /** Current wizard state */
  state: WizardState;
  /** Dispatch function for state updates */
  dispatch: (action: WizardAction) => void;
  /** Navigation functions */
  navigation: {
    goToStep: (step: WizardStep) => void;
    goNext: () => void;
    goPrevious: () => void;
    canGoNext: () => boolean;
    canGoPrevious: () => boolean;
  };
  /** Data management functions */
  dataManagement: {
    updateStepData: <T>(step: WizardStep, data: Partial<T>) => void;
    validateStep: (step: WizardStep) => ValidationResult;
    getStepData: <T>(step: WizardStep) => T | undefined;
    resetStep: (step: WizardStep) => void;
  };
  /** Draft management functions */
  draftManagement: {
    saveDraft: () => void;
    loadDraft: (draftId: string) => void;
    deleteDraft: (draftId: string) => void;
    listDrafts: () => DraftMetadata[];
    autoSave: () => void;
  };
  /** Template functions */
  templates: {
    applyTemplate: (template: GoalTemplate) => void;
    getTemplate: (id: GoalTemplate) => TemplateDefinition | undefined;
    listTemplates: () => TemplateDefinition[];
  };
  /** Export functions */
  export: {
    exportGoal: (options: ExportOptions) => Promise<ExportResult>;
    generatePreview: () => SmartGoalCreate;
  };
}