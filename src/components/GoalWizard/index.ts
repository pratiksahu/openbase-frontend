/**
 * GoalWizard Component Barrel Export
 *
 * This file provides a clean interface for importing GoalWizard components
 * and their related types and utilities.
 */

// Main component
export { GoalWizard, default } from './GoalWizard';

// Context and hooks
export { WizardContextProvider, useWizardContext } from './WizardContext';

// Sub-components
export { default as WizardStepper } from './WizardStepper';

// Step components
export { default as ContextStep } from './steps/ContextStep';
export { default as SpecificStep } from './steps/SpecificStep';
export { default as MeasurableStep } from './steps/MeasurableStep';
export { default as AchievableStep } from './steps/AchievableStep';

// Types
export type {
  // Main component props
  GoalWizardProps,
  WizardStepperProps,

  // Step props
  ContextStepProps,
  SpecificStepProps,
  MeasurableStepProps,
  AchievableStepProps,
  RelevantStepProps,
  TimeboundStepProps,
  PreviewStepProps,
  BaseStepProps,

  // Data types
  WizardFormData,
  ContextStepData,
  SpecificStepData,
  MeasurableStepData,
  AchievableStepData,
  RelevantStepData,
  TimeboundStepData,

  // State management
  WizardState,
  WizardAction,
  WizardContextValue,

  // Configuration
  StepConfig,
  ValidationResult,
  NavigationConfig,
  TemplateDefinition,

  // Enums
  WizardStep,
  StepStatus,
  GoalTemplate,
  NavigationDirection,
  WizardActionType,

  // Storage
  DraftMetadata,
  StoredDraft,

  // Export
  ExportOptions,
  ExportResult,
} from './GoalWizard.types';

// Utilities
export {
  // Step configuration
  DEFAULT_STEPS,
  STEP_ORDER,

  // Navigation
  getStepIndex,
  getNextStep,
  getPreviousStep,
  canNavigateToStep,
  calculateProgress,

  // Validation
  validateContextStep,
  validateSpecificStep,
  validateMeasurableStep,
  validateAchievableStep,
  validateRelevantStep,
  validateTimeboundStep,
  validateCompleteForm,

  // Data transformation
  transformToSmartGoal,

  // Templates
  getDefaultTemplates,

  // Storage
  saveDraftToStorage,
  getDraftsFromStorage,
  loadDraftFromStorage,
  deleteDraftFromStorage,
  getDraftMetadataList,

  // Initial state
  createInitialWizardState,
  createEmptyFormData,
} from './GoalWizard.utils';