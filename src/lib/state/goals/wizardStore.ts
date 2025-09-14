/**
 * Wizard Store - Zustand State Management for Goal Creation Wizard
 *
 * This store manages the multi-step goal creation/editing wizard state:
 * - Form data for each wizard step
 * - Current step tracking and navigation
 * - Validation state management
 * - Draft saving and loading
 * - Auto-save functionality
 * - Step completion tracking
 *
 * @fileoverview Zustand store for goal creation wizard management
 * @version 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  SmartGoalCreate,
  GoalStatus,
  GoalPriority,
  GoalCategory,
  MeasurableSpec,
  Achievability,
  Relevance,
  Timebound,
} from '@/types/smart-goals.types';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface WizardStep {
  id: string;
  name: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isValid: boolean;
  isOptional: boolean;
  hasErrors: boolean;
  errorCount: number;
  completionPercentage: number;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'invalid' | 'min' | 'max' | 'pattern' | 'custom';
}

export interface StepData {
  // Step 1: Basic Information (Specific)
  basic: {
    title: string;
    description: string;
    specificObjective: string;
    category: GoalCategory;
    tags: string[];
    successCriteria: string[];
  };

  // Step 2: Measurable Specifications
  measurable: Partial<MeasurableSpec> & {
    checkpointFrequency?: string;
    trackingMethod?: string;
  };

  // Step 3: Achievability Assessment
  achievable: Partial<Achievability> & {
    resourcesIdentified: boolean;
    skillsAssessed: boolean;
    constraintsIdentified: boolean;
  };

  // Step 4: Relevance and Alignment
  relevant: Partial<Relevance> & {
    businessAlignment: string;
    personalRelevance: string;
    stakeholderBuyIn: boolean;
  };

  // Step 5: Time-bound Planning
  timebound: Partial<Timebound> & {
    milestonesPlanned: boolean;
    bufferTimeIncluded: boolean;
  };

  // Step 6: Execution Planning
  execution: {
    priority: GoalPriority;
    ownerId: string;
    collaborators: string[];
    initialTasks: Array<{
      title: string;
      description: string;
      estimatedHours: number;
      assignedTo?: string;
    }>;
    initialMilestones: Array<{
      title: string;
      description: string;
      targetDate: Date;
      successCriteria: string[];
    }>;
  };

  // Step 7: Review and Finalize
  review: {
    isReviewed: boolean;
    reviewNotes: string;
    finalValidation: boolean;
    readyToCreate: boolean;
  };
}

export interface Draft {
  id: string;
  name: string;
  data: Partial<StepData>;
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  isAutoSaved: boolean;
}

export interface WizardState {
  // Wizard navigation
  currentStep: number;
  totalSteps: number;
  steps: WizardStep[];

  // Form data
  data: StepData;

  // Validation
  validation: {
    [stepId: string]: {
      isValid: boolean;
      errors: ValidationError[];
      touched: Set<string>;
    };
  };

  // Draft management
  drafts: Draft[];
  currentDraft: Draft | null;
  draftName: string;
  isDraftMode: boolean;

  // Auto-save
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // milliseconds
  autoSaveTimer: NodeJS.Timeout | null;
  lastAutoSave: Date | null;
  hasUnsavedChanges: boolean;

  // UI state
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  showStepNavigation: boolean;
  allowStepSkipping: boolean;
  showProgress: boolean;

  // Wizard mode (create vs edit)
  mode: 'create' | 'edit';
  editingGoalId?: string;

  // Completion tracking
  overallProgress: number;
  completedSteps: Set<number>;
  requiredSteps: Set<number>;
  canFinish: boolean;
}

export interface WizardActions {
  // Navigation
  nextStep: () => boolean;
  previousStep: () => boolean;
  goToStep: (step: number) => boolean;
  skipStep: (step: number) => boolean;
  jumpToStep: (step: number) => boolean;

  // Data management
  updateStepData: <K extends keyof StepData>(
    step: K,
    data: Partial<StepData[K]>
  ) => void;
  setFieldValue: (stepId: string, field: string, value: any) => void;
  getFieldValue: (stepId: string, field: string) => any;
  clearStepData: (step: keyof StepData) => void;
  resetAllData: () => void;

  // Validation
  validateStep: (step: number) => boolean;
  validateField: (stepId: string, field: string, value: any) => ValidationError | null;
  clearValidationErrors: (step?: number) => void;
  markFieldTouched: (stepId: string, field: string) => void;
  isFieldTouched: (stepId: string, field: string) => boolean;

  // Draft management
  saveDraft: (name?: string) => string;
  loadDraft: (draftId: string) => boolean;
  deleteDraft: (draftId: string) => void;
  renameDraft: (draftId: string, newName: string) => void;
  clearExpiredDrafts: () => void;
  setDraftName: (name: string) => void;
  enterDraftMode: () => void;
  exitDraftMode: () => void;

  // Auto-save
  enableAutoSave: () => void;
  disableAutoSave: () => void;
  triggerAutoSave: () => void;
  setAutoSaveInterval: (interval: number) => void;

  // Wizard lifecycle
  startWizard: (mode: 'create' | 'edit', goalId?: string) => void;
  finishWizard: () => Promise<string>;
  cancelWizard: () => void;
  restartWizard: () => void;

  // Utility functions
  getWizardData: () => Partial<SmartGoalCreate>;
  getStepProgress: (step: number) => number;
  getOverallProgress: () => number;
  isStepAccessible: (step: number) => boolean;
  isStepRequired: (step: number) => boolean;
  canNavigateToStep: (step: number) => boolean;
  getNextIncompleteStep: () => number | null;

  // UI state management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleStepNavigation: () => void;
  toggleProgress: () => void;
  setAllowStepSkipping: (allow: boolean) => void;
}

export type WizardStore = WizardState & WizardActions;

// =============================================================================
// Initial State and Constants
// =============================================================================

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'basic',
    name: 'basic',
    title: 'Basic Information',
    description: 'Define your goal with clear, specific details',
    isCompleted: false,
    isValid: false,
    isOptional: false,
    hasErrors: false,
    errorCount: 0,
    completionPercentage: 0,
  },
  {
    id: 'measurable',
    name: 'measurable',
    title: 'Make it Measurable',
    description: 'Set quantifiable metrics and tracking methods',
    isCompleted: false,
    isValid: false,
    isOptional: false,
    hasErrors: false,
    errorCount: 0,
    completionPercentage: 0,
  },
  {
    id: 'achievable',
    name: 'achievable',
    title: 'Ensure Achievability',
    description: 'Assess resources, skills, and constraints',
    isCompleted: false,
    isValid: false,
    isOptional: false,
    hasErrors: false,
    errorCount: 0,
    completionPercentage: 0,
  },
  {
    id: 'relevant',
    name: 'relevant',
    title: 'Confirm Relevance',
    description: 'Align with strategic objectives and stakeholders',
    isCompleted: false,
    isValid: false,
    isOptional: false,
    hasErrors: false,
    errorCount: 0,
    completionPercentage: 0,
  },
  {
    id: 'timebound',
    name: 'timebound',
    title: 'Set Timeline',
    description: 'Define deadlines, milestones, and schedule',
    isCompleted: false,
    isValid: false,
    isOptional: false,
    hasErrors: false,
    errorCount: 0,
    completionPercentage: 0,
  },
  {
    id: 'execution',
    name: 'execution',
    title: 'Plan Execution',
    description: 'Define tasks, milestones, and assignments',
    isCompleted: false,
    isValid: false,
    isOptional: true,
    hasErrors: false,
    errorCount: 0,
    completionPercentage: 0,
  },
  {
    id: 'review',
    name: 'review',
    title: 'Review & Finalize',
    description: 'Review all details and finalize your goal',
    isCompleted: false,
    isValid: false,
    isOptional: false,
    hasErrors: false,
    errorCount: 0,
    completionPercentage: 0,
  },
];

const initialStepData: StepData = {
  basic: {
    title: '',
    description: '',
    specificObjective: '',
    category: GoalCategory.PERSONAL,
    tags: [],
    successCriteria: [],
  },
  measurable: {},
  achievable: {
    resourcesIdentified: false,
    skillsAssessed: false,
    constraintsIdentified: false,
  },
  relevant: {
    businessAlignment: '',
    personalRelevance: '',
    stakeholderBuyIn: false,
  },
  timebound: {
    milestonesPlanned: false,
    bufferTimeIncluded: false,
  },
  execution: {
    priority: GoalPriority.MEDIUM,
    ownerId: '',
    collaborators: [],
    initialTasks: [],
    initialMilestones: [],
  },
  review: {
    isReviewed: false,
    reviewNotes: '',
    finalValidation: false,
    readyToCreate: false,
  },
};

const initialState: WizardState = {
  currentStep: 0,
  totalSteps: WIZARD_STEPS.length,
  steps: WIZARD_STEPS,

  data: initialStepData,

  validation: {},

  drafts: [],
  currentDraft: null,
  draftName: '',
  isDraftMode: false,

  autoSaveEnabled: true,
  autoSaveInterval: 30000, // 30 seconds
  autoSaveTimer: null,
  lastAutoSave: null,
  hasUnsavedChanges: false,

  isLoading: false,
  isSaving: false,
  error: null,
  showStepNavigation: true,
  allowStepSkipping: false,
  showProgress: true,

  mode: 'create',

  overallProgress: 0,
  completedSteps: new Set(),
  requiredSteps: new Set([0, 1, 2, 3, 4, 6]), // All except execution (index 5)
  canFinish: false,
};

// =============================================================================
// Validation Rules
// =============================================================================

const validateBasicStep = (data: StepData['basic']): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required', type: 'required' });
  } else if (data.title.length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters', type: 'min' });
  }

  if (!data.description?.trim()) {
    errors.push({ field: 'description', message: 'Description is required', type: 'required' });
  } else if (data.description.length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters', type: 'min' });
  }

  if (!data.specificObjective?.trim()) {
    errors.push({ field: 'specificObjective', message: 'Specific objective is required', type: 'required' });
  }

  if (!data.category) {
    errors.push({ field: 'category', message: 'Category is required', type: 'required' });
  }

  if (data.successCriteria.length === 0) {
    errors.push({ field: 'successCriteria', message: 'At least one success criterion is required', type: 'required' });
  }

  return errors;
};

const validateMeasurableStep = (data: StepData['measurable']): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.metricType) {
    errors.push({ field: 'metricType', message: 'Metric type is required', type: 'required' });
  }

  if (data.targetValue === undefined || data.targetValue === null) {
    errors.push({ field: 'targetValue', message: 'Target value is required', type: 'required' });
  }

  if (!data.unit?.trim()) {
    errors.push({ field: 'unit', message: 'Unit of measurement is required', type: 'required' });
  }

  if (!data.measurementFrequency) {
    errors.push({ field: 'measurementFrequency', message: 'Measurement frequency is required', type: 'required' });
  }

  return errors;
};

// Add more validation functions for other steps...

// =============================================================================
// Utility Functions
// =============================================================================

const generateDraftId = (): string => {
  return `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const calculateStepProgress = (stepId: string, data: any, validation: any): number => {
  // Calculate completion percentage based on filled fields and validation
  const stepValidation = validation[stepId];
  if (!stepValidation) return 0;

  const totalFields = Object.keys(data).length || 1;
  const filledFields = Object.values(data).filter(value =>
    value !== '' && value !== null && value !== undefined
  ).length;

  const baseProgress = (filledFields / totalFields) * 100;
  const errorPenalty = stepValidation.errors.length * 10;

  return Math.max(0, Math.min(100, baseProgress - errorPenalty));
};

// =============================================================================
// Store Implementation
// =============================================================================

export const useWizardStore = create<WizardStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,

          // =============================================================================
          // Navigation Actions
          // =============================================================================

          nextStep: () => {
            const { currentStep, totalSteps } = get();

            // Validate current step before proceeding
            if (!get().validateStep(currentStep)) {
              return false;
            }

            if (currentStep < totalSteps - 1) {
              set((state) => {
                state.currentStep++;
                state.hasUnsavedChanges = true;
              });
              return true;
            }
            return false;
          },

          previousStep: () => {
            const { currentStep } = get();

            if (currentStep > 0) {
              set((state) => {
                state.currentStep--;
              });
              return true;
            }
            return false;
          },

          goToStep: (step: number) => {
            if (get().canNavigateToStep(step)) {
              set((state) => {
                state.currentStep = step;
              });
              return true;
            }
            return false;
          },

          skipStep: (step: number) => {
            const { allowStepSkipping, steps } = get();

            if (allowStepSkipping && steps[step]?.isOptional) {
              set((state) => {
                state.steps[step].isCompleted = true;
                state.completedSteps.add(step);
                if (step === state.currentStep) {
                  state.currentStep = Math.min(step + 1, state.totalSteps - 1);
                }
              });
              return true;
            }
            return false;
          },

          jumpToStep: (step: number) => {
            // Allow jumping to any step (admin mode)
            if (step >= 0 && step < get().totalSteps) {
              set((state) => {
                state.currentStep = step;
              });
              return true;
            }
            return false;
          },

          // =============================================================================
          // Data Management Actions
          // =============================================================================

          updateStepData: (step, data) => {
            set((state) => {
              Object.assign(state.data[step], data);
              state.hasUnsavedChanges = true;

              // Update step progress
              const stepIndex = state.steps.findIndex(s => s.name === step);
              if (stepIndex !== -1) {
                state.steps[stepIndex].completionPercentage = calculateStepProgress(
                  step,
                  state.data[step],
                  state.validation
                );
              }
            });

            // Trigger validation for the updated step
            const stepIndex = get().steps.findIndex(s => s.name === step);
            if (stepIndex !== -1) {
              get().validateStep(stepIndex);
            }

            // Trigger auto-save if enabled
            if (get().autoSaveEnabled) {
              get().triggerAutoSave();
            }
          },

          setFieldValue: (stepId, field, value) => {
            set((state) => {
              if (state.data[stepId as keyof StepData]) {
                (state.data[stepId as keyof StepData] as any)[field] = value;
                state.hasUnsavedChanges = true;
              }
            });

            // Mark field as touched and validate
            get().markFieldTouched(stepId, field);
            get().validateField(stepId, field, value);
          },

          getFieldValue: (stepId, field) => {
            const stepData = get().data[stepId as keyof StepData];
            return stepData ? (stepData as any)[field] : undefined;
          },

          clearStepData: (step) => {
            set((state) => {
              (state.data as any)[step] = initialStepData[step];
              state.hasUnsavedChanges = true;

              // Clear validation for this step
              delete state.validation[step];

              // Update step state
              const stepIndex = state.steps.findIndex(s => s.name === step);
              if (stepIndex !== -1) {
                state.steps[stepIndex].isCompleted = false;
                state.steps[stepIndex].isValid = false;
                state.steps[stepIndex].hasErrors = false;
                state.steps[stepIndex].errorCount = 0;
                state.steps[stepIndex].completionPercentage = 0;
                state.completedSteps.delete(stepIndex);
              }
            });
          },

          resetAllData: () => {
            set((state) => {
              state.data = { ...initialStepData };
              state.validation = {};
              state.currentStep = 0;
              state.completedSteps.clear();
              state.hasUnsavedChanges = false;

              // Reset all steps
              state.steps.forEach((step, _index) => {
                step.isCompleted = false;
                step.isValid = false;
                step.hasErrors = false;
                step.errorCount = 0;
                step.completionPercentage = 0;
              });

              state.overallProgress = 0;
              state.canFinish = false;
            });
          },

          // =============================================================================
          // Validation Actions
          // =============================================================================

          validateStep: (step: number) => {
            const { steps, data } = get();
            const stepInfo = steps[step];
            if (!stepInfo) return false;

            let errors: ValidationError[] = [];

            // Apply validation based on step
            switch (stepInfo.name) {
              case 'basic':
                errors = validateBasicStep(data.basic);
                break;
              case 'measurable':
                errors = validateMeasurableStep(data.measurable);
                break;
              // Add other step validations...
            }

            set((state) => {
              // Update validation state
              state.validation[stepInfo.name] = {
                isValid: errors.length === 0,
                errors,
                touched: state.validation[stepInfo.name]?.touched || new Set(),
              };

              // Update step state
              state.steps[step].isValid = errors.length === 0;
              state.steps[step].hasErrors = errors.length > 0;
              state.steps[step].errorCount = errors.length;

              if (errors.length === 0) {
                state.steps[step].isCompleted = true;
                state.completedSteps.add(step);
              } else {
                state.steps[step].isCompleted = false;
                state.completedSteps.delete(step);
              }

              // Update overall progress
              state.overallProgress = get().getOverallProgress();
              state.canFinish = get().requiredSteps.size === 0 ||
                Array.from(get().requiredSteps).every(reqStep =>
                  state.completedSteps.has(reqStep)
                );
            });

            return errors.length === 0;
          },

          validateField: (stepId, field, value) => {
            // Basic field validation - can be extended
            if (typeof value === 'string' && value.trim() === '') {
              return { field, message: `${field} is required`, type: 'required' };
            }
            return null;
          },

          clearValidationErrors: (step) => {
            set((state) => {
              if (step !== undefined) {
                const stepInfo = state.steps[step];
                if (stepInfo && state.validation[stepInfo.name]) {
                  state.validation[stepInfo.name].errors = [];
                  state.validation[stepInfo.name].isValid = true;
                  state.steps[step].hasErrors = false;
                  state.steps[step].errorCount = 0;
                }
              } else {
                // Clear all validation errors
                Object.keys(state.validation).forEach(stepName => {
                  state.validation[stepName].errors = [];
                  state.validation[stepName].isValid = true;
                });

                state.steps.forEach(step => {
                  step.hasErrors = false;
                  step.errorCount = 0;
                });
              }
            });
          },

          markFieldTouched: (stepId, field) => {
            set((state) => {
              if (!state.validation[stepId]) {
                state.validation[stepId] = {
                  isValid: true,
                  errors: [],
                  touched: new Set(),
                };
              }
              state.validation[stepId].touched.add(field);
            });
          },

          isFieldTouched: (stepId, field) => {
            const stepValidation = get().validation[stepId];
            return stepValidation ? stepValidation.touched.has(field) : false;
          },

          // =============================================================================
          // Draft Management Actions
          // =============================================================================

          saveDraft: (name) => {
            const { data, currentStep, draftName } = get();
            const now = new Date();
            const draftId = generateDraftId();

            const draft: Draft = {
              id: draftId,
              name: name || draftName || `Draft ${now.toLocaleDateString()}`,
              data: { ...data },
              currentStep,
              createdAt: now,
              updatedAt: now,
              expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
              isAutoSaved: !name,
            };

            set((state) => {
              state.drafts.push(draft);
              state.currentDraft = draft;
              state.hasUnsavedChanges = false;
              state.lastAutoSave = now;

              // Limit number of drafts
              if (state.drafts.length > 10) {
                state.drafts.shift();
              }
            });

            return draftId;
          },

          loadDraft: (draftId) => {
            const draft = get().drafts.find(d => d.id === draftId);
            if (!draft) return false;

            set((state) => {
              state.data = { ...draft.data } as StepData;
              state.currentStep = draft.currentStep;
              state.currentDraft = draft;
              state.isDraftMode = true;
              state.hasUnsavedChanges = false;
            });

            // Revalidate all steps
            get().steps.forEach((_, index) => {
              get().validateStep(index);
            });

            return true;
          },

          deleteDraft: (draftId) => {
            set((state) => {
              state.drafts = state.drafts.filter(d => d.id !== draftId);
              if (state.currentDraft?.id === draftId) {
                state.currentDraft = null;
                state.isDraftMode = false;
              }
            });
          },

          renameDraft: (draftId, newName) => {
            set((state) => {
              const draft = state.drafts.find(d => d.id === draftId);
              if (draft) {
                draft.name = newName;
                draft.updatedAt = new Date();
              }
            });
          },

          clearExpiredDrafts: () => {
            const now = new Date();
            set((state) => {
              state.drafts = state.drafts.filter(d => d.expiresAt > now);
            });
          },

          setDraftName: (name) => {
            set((state) => {
              state.draftName = name;
            });
          },

          enterDraftMode: () => {
            set((state) => {
              state.isDraftMode = true;
            });
          },

          exitDraftMode: () => {
            set((state) => {
              state.isDraftMode = false;
              state.currentDraft = null;
            });
          },

          // =============================================================================
          // Auto-save Actions
          // =============================================================================

          enableAutoSave: () => {
            set((state) => {
              state.autoSaveEnabled = true;
            });
            get().triggerAutoSave();
          },

          disableAutoSave: () => {
            const { autoSaveTimer } = get();
            if (autoSaveTimer) {
              clearInterval(autoSaveTimer);
            }

            set((state) => {
              state.autoSaveEnabled = false;
              state.autoSaveTimer = null;
            });
          },

          triggerAutoSave: () => {
            const { autoSaveEnabled, autoSaveTimer, autoSaveInterval, hasUnsavedChanges } = get();

            if (!autoSaveEnabled || !hasUnsavedChanges) return;

            // Clear existing timer
            if (autoSaveTimer) {
              clearTimeout(autoSaveTimer);
            }

            // Set new timer
            const timer = setTimeout(() => {
              if (get().hasUnsavedChanges) {
                get().saveDraft();
              }
            }, autoSaveInterval);

            set((state) => {
              state.autoSaveTimer = timer;
            });
          },

          setAutoSaveInterval: (interval) => {
            set((state) => {
              state.autoSaveInterval = interval;
            });

            // Restart auto-save with new interval
            if (get().autoSaveEnabled) {
              get().disableAutoSave();
              get().enableAutoSave();
            }
          },

          // =============================================================================
          // Wizard Lifecycle Actions
          // =============================================================================

          startWizard: (mode, goalId) => {
            set((state) => {
              state.mode = mode;
              state.editingGoalId = goalId;
              state.currentStep = 0;
              state.isLoading = false;
              state.error = null;

              if (mode === 'create') {
                // Reset data for new goal
                state.data = { ...initialStepData };
                state.validation = {};
                state.completedSteps.clear();
                state.currentDraft = null;
                state.isDraftMode = false;
              }
            });

            // Enable auto-save
            if (get().autoSaveEnabled) {
              get().enableAutoSave();
            }

            // If editing, load existing goal data
            if (mode === 'edit' && goalId) {
              // This would load the goal data for editing
              // Implementation depends on goal store integration
            }
          },

          finishWizard: async () => {
            try {
              set((state) => {
                state.isSaving = true;
                state.error = null;
              });

              // Validate all required steps
              const allValid = Array.from(get().requiredSteps).every(step =>
                get().validateStep(step)
              );

              if (!allValid) {
                throw new Error('Please complete all required steps');
              }

              const goalData = get().getWizardData();

              // Create or update goal
              const { useGoalStore } = await import('./goalStore');
              const goalStore = useGoalStore.getState();

              let goalId: string;
              if (get().mode === 'create') {
                goalId = await goalStore.createGoal(goalData as SmartGoalCreate);
              } else if (get().editingGoalId) {
                await goalStore.updateGoal(get().editingGoalId!, goalData);
                goalId = get().editingGoalId!;
              } else {
                throw new Error('Invalid wizard state');
              }

              set((state) => {
                state.isSaving = false;
                state.hasUnsavedChanges = false;
              });

              // Clean up
              get().disableAutoSave();
              const currentDraft = get().currentDraft;
              if (currentDraft) {
                get().deleteDraft(currentDraft.id);
              }

              return goalId;

            } catch (error) {
              set((state) => {
                state.isSaving = false;
                state.error = error instanceof Error ? error.message : 'Failed to save goal';
              });
              throw error;
            }
          },

          cancelWizard: () => {
            // Clean up without saving
            get().disableAutoSave();

            set((state) => {
              state.data = { ...initialStepData };
              state.currentStep = 0;
              state.validation = {};
              state.completedSteps.clear();
              state.hasUnsavedChanges = false;
              state.error = null;
              state.isLoading = false;
              state.isSaving = false;
            });
          },

          restartWizard: () => {
            get().cancelWizard();
            get().startWizard(get().mode, get().editingGoalId);
          },

          // =============================================================================
          // Utility Functions
          // =============================================================================

          getWizardData: () => {
            const { data } = get();

            // Transform wizard data to SmartGoalCreate format
            const goalData: Partial<SmartGoalCreate> = {
              // Basic data
              title: data.basic.title,
              description: data.basic.description,
              specificObjective: data.basic.specificObjective,
              category: data.basic.category,
              tags: data.basic.tags,
              successCriteria: data.basic.successCriteria,

              // Set required fields with defaults
              progress: 0,
              status: GoalStatus.DRAFT,
              priority: data.execution.priority,
              ownerId: data.execution.ownerId,
              collaborators: data.execution.collaborators,
              visibility: 'private',
              isArchived: false,

              // SMART criteria
              measurable: data.measurable as MeasurableSpec,
              achievability: data.achievable as Achievability,
              relevance: data.relevant as Relevance,
              timebound: data.timebound as Timebound,
            };

            return goalData;
          },

          getStepProgress: (step) => {
            const { steps } = get();
            return steps[step]?.completionPercentage || 0;
          },

          getOverallProgress: () => {
            const { completedSteps, requiredSteps } = get();

            if (requiredSteps.size === 0) return 100;

            const totalRequired = requiredSteps.size;
            const completedRequired = Array.from(requiredSteps).filter(step =>
              completedSteps.has(step)
            ).length;

            return Math.round((completedRequired / totalRequired) * 100);
          },

          isStepAccessible: (step) => {
            const { allowStepSkipping, completedSteps } = get();

            if (allowStepSkipping) return true;

            // Can access if it's the first step, or all previous required steps are completed
            if (step === 0) return true;

            for (let i = 0; i < step; i++) {
              if (get().isStepRequired(i) && !completedSteps.has(i)) {
                return false;
              }
            }

            return true;
          },

          isStepRequired: (step) => {
            return get().requiredSteps.has(step);
          },

          canNavigateToStep: (step) => {
            return step >= 0 &&
                   step < get().totalSteps &&
                   get().isStepAccessible(step);
          },

          getNextIncompleteStep: () => {
            const { steps, completedSteps, requiredSteps } = get();

            // Find first incomplete required step
            for (const stepIndex of requiredSteps) {
              if (!completedSteps.has(stepIndex)) {
                return stepIndex;
              }
            }

            // Find first incomplete optional step
            for (let i = 0; i < steps.length; i++) {
              if (!requiredSteps.has(i) && !completedSteps.has(i)) {
                return i;
              }
            }

            return null;
          },

          // =============================================================================
          // UI State Management
          // =============================================================================

          setLoading: (loading) => {
            set((state) => {
              state.isLoading = loading;
            });
          },

          setError: (error) => {
            set((state) => {
              state.error = error;
            });
          },

          toggleStepNavigation: () => {
            set((state) => {
              state.showStepNavigation = !state.showStepNavigation;
            });
          },

          toggleProgress: () => {
            set((state) => {
              state.showProgress = !state.showProgress;
            });
          },

          setAllowStepSkipping: (allow) => {
            set((state) => {
              state.allowStepSkipping = allow;
            });
          },
        }))
      ),
      {
        name: 'wizard-store',
        partialize: (state) => ({
          // Only persist drafts and settings
          drafts: state.drafts,
          autoSaveEnabled: state.autoSaveEnabled,
          autoSaveInterval: state.autoSaveInterval,
          showStepNavigation: state.showStepNavigation,
          allowStepSkipping: state.allowStepSkipping,
          showProgress: state.showProgress,
        }),
      }
    ),
    { name: 'WizardStore' }
  )
);

// =============================================================================
// Selector Hooks for Performance Optimization
// =============================================================================

export const useCurrentStep = () => useWizardStore(state => state.currentStep);
export const useWizardSteps = () => useWizardStore(state => state.steps);
export const useWizardData = () => useWizardStore(state => state.data);
export const useWizardValidation = () => useWizardStore(state => state.validation);
export const useWizardProgress = () => useWizardStore(state => state.overallProgress);
export const useWizardLoading = () => useWizardStore(state => ({
  isLoading: state.isLoading,
  isSaving: state.isSaving
}));
export const useWizardError = () => useWizardStore(state => state.error);
export const useWizardDrafts = () => useWizardStore(state => state.drafts);
export const useCanFinish = () => useWizardStore(state => state.canFinish);

// Actions
export const useWizardActions = () => useWizardStore(state => ({
  nextStep: state.nextStep,
  previousStep: state.previousStep,
  goToStep: state.goToStep,
  updateStepData: state.updateStepData,
  validateStep: state.validateStep,
  startWizard: state.startWizard,
  finishWizard: state.finishWizard,
  cancelWizard: state.cancelWizard,
  saveDraft: state.saveDraft,
  loadDraft: state.loadDraft,
}));

// Combined selector
export const useWizardState = () => {
  const currentStep = useCurrentStep();
  const steps = useWizardSteps();
  const data = useWizardData();
  const progress = useWizardProgress();
  const canFinish = useCanFinish();
  const actions = useWizardActions();

  return {
    currentStep,
    steps,
    data,
    progress,
    canFinish,
    ...actions,
  };
};