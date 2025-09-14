/**
 * Wizard Context Provider
 *
 * This file provides a React context for managing the state of the GoalWizard component,
 * including form data, navigation, validation, and draft management.
 */

'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from 'react';

import { calculateSmartScore } from '@/components/SmartScoreBadge/SmartScoreBadge.utils';
import { SmartGoalCreate } from '@/types/smart-goals.types';

import {
  WizardContextValue,
  WizardState,
  WizardAction,
  WizardActionType,
  WizardStep,
  StepStatus,
  ValidationResult,
  GoalTemplate,
  TemplateDefinition,
  WizardFormData,
  ExportOptions,
  ExportResult,
} from './GoalWizard.types';
import {
  getNextStep,
  getPreviousStep,
  canNavigateToStep,
  validateContextStep,
  validateSpecificStep,
  validateMeasurableStep,
  validateAchievableStep,
  validateRelevantStep,
  validateTimeboundStep,
  createInitialWizardState,
  createEmptyFormData,
  getDefaultTemplates,
  saveDraftToStorage,
  loadDraftFromStorage,
  deleteDraftFromStorage,
  getDraftMetadataList,
  transformToSmartGoal,
} from './GoalWizard.utils';

// =============================================================================
// Wizard Reducer
// =============================================================================

/**
 * Reducer for managing wizard state
 */
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case WizardActionType.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
        navigationHistory: [...state.navigationHistory, action.payload],
      };

    case WizardActionType.UPDATE_FORM_DATA:
      const { step, data } = action.payload;
      return {
        ...state,
        formData: {
          ...state.formData,
          [step]: {
            ...state.formData[step as keyof WizardFormData],
            ...data,
          },
        },
        hasUnsavedChanges: true,
      };

    case WizardActionType.SET_STEP_STATUS:
      return {
        ...state,
        stepStatus: {
          ...state.stepStatus,
          [action.payload.step]: action.payload.status,
        },
      };

    case WizardActionType.SET_VALIDATION_RESULT:
      return {
        ...state,
        validationResults: {
          ...state.validationResults,
          [action.payload.step]: action.payload.result,
        },
      };

    case WizardActionType.ADD_TO_HISTORY:
      return {
        ...state,
        navigationHistory: [...state.navigationHistory, action.payload],
      };

    case WizardActionType.SAVE_DRAFT:
      return {
        ...state,
        isDraft: true,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      };

    case WizardActionType.LOAD_DRAFT:
      return {
        ...state,
        ...action.payload.wizardState,
        formData: action.payload.formData,
        isDraft: true,
        hasUnsavedChanges: false,
      };

    case WizardActionType.RESET_WIZARD:
      return {
        ...createInitialWizardState(),
        formData: createEmptyFormData(),
      };

    case WizardActionType.APPLY_TEMPLATE:
      const template = action.payload;
      return {
        ...state,
        formData: {
          ...state.formData,
          ...template.formData,
        },
        templateData: template.formData,
        hasUnsavedChanges: true,
      };

    case WizardActionType.UPDATE_SMART_SCORE:
      return {
        ...state,
        smartScore: action.payload,
      };

    case WizardActionType.TOGGLE_AUTO_SAVE:
      return {
        ...state,
        autoSaveEnabled: action.payload,
      };

    case WizardActionType.MARK_UNSAVED_CHANGES:
      return {
        ...state,
        hasUnsavedChanges: action.payload,
      };

    default:
      return state;
  }
}

// =============================================================================
// Context Setup
// =============================================================================

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

/**
 * Props for WizardContextProvider
 */
interface WizardContextProviderProps {
  children: React.ReactNode;
  autoSaveInterval?: number; // in milliseconds
  onAutoSave?: (formData: Partial<WizardFormData>) => void;
}

/**
 * Wizard Context Provider Component
 */
export const WizardContextProvider: React.FC<WizardContextProviderProps> = ({
  children,
  autoSaveInterval = 30000, // 30 seconds
  onAutoSave,
}) => {
  const [state, dispatch] = useReducer(wizardReducer, createInitialWizardState());

  // =============================================================================
  // Auto-save Effect
  // =============================================================================

  useEffect(() => {
    if (!state.autoSaveEnabled || !state.hasUnsavedChanges) {
      return;
    }

    const autoSaveTimer = setTimeout(() => {
      const draftId = saveDraftToStorage(state.formData, state);
      onAutoSave?.(state.formData);
      dispatch({ type: WizardActionType.SAVE_DRAFT });
      console.log('Auto-saved draft:', draftId);
    }, autoSaveInterval);

    return () => clearTimeout(autoSaveTimer);
  }, [
    state.autoSaveEnabled,
    state.hasUnsavedChanges,
    state.formData,
    autoSaveInterval,
    onAutoSave,
  ]);

  // =============================================================================
  // SMART Score Calculation Effect
  // =============================================================================

  useEffect(() => {
    // Calculate SMART score when form data changes
    if (Object.keys(state.formData).length > 0) {
      try {
        const smartGoal = transformToSmartGoal(state.formData as WizardFormData);
        const scoreResult = calculateSmartScore(smartGoal);
        dispatch({
          type: WizardActionType.UPDATE_SMART_SCORE,
          payload: scoreResult,
        });
      } catch (error) {
        // Ignore errors during transformation - score will be undefined
      }
    }
  }, [state.formData]);

  // =============================================================================
  // Navigation Functions
  // =============================================================================

  const navigation = useMemo(
    () => ({
      goToStep: (step: WizardStep) => {
        if (canNavigateToStep(step, state.stepStatus)) {
          dispatch({ type: WizardActionType.SET_CURRENT_STEP, payload: step });
        }
      },

      goNext: () => {
        const nextStep = getNextStep(state.currentStep);
        if (nextStep && canNavigateToStep(nextStep, state.stepStatus)) {
          dispatch({ type: WizardActionType.SET_CURRENT_STEP, payload: nextStep });
        }
      },

      goPrevious: () => {
        const previousStep = getPreviousStep(state.currentStep);
        if (previousStep) {
          dispatch({ type: WizardActionType.SET_CURRENT_STEP, payload: previousStep });
        }
      },

      canGoNext: () => {
        const nextStep = getNextStep(state.currentStep);
        return nextStep !== null && canNavigateToStep(nextStep, state.stepStatus);
      },

      canGoPrevious: () => {
        return getPreviousStep(state.currentStep) !== null;
      },
    }),
    [state.currentStep, state.stepStatus]
  );

  // =============================================================================
  // Data Management Functions
  // =============================================================================

  const dataManagement = useMemo(
    () => ({
      updateStepData: (step: WizardStep, data: any) => {
        dispatch({
          type: WizardActionType.UPDATE_FORM_DATA,
          payload: { step, data },
        });

        // Update step status to in progress if not already completed
        if (state.stepStatus[step] === StepStatus.NOT_STARTED) {
          dispatch({
            type: WizardActionType.SET_STEP_STATUS,
            payload: { step, status: StepStatus.IN_PROGRESS },
          });
        }

        // Validate the step after updating
        const validationResult = dataManagement.validateStep(step);
        dispatch({
          type: WizardActionType.SET_VALIDATION_RESULT,
          payload: { step, result: validationResult },
        });

        // Update step status based on validation
        const newStatus = validationResult.isValid
          ? StepStatus.COMPLETED
          : Object.keys(validationResult.errors).length > 0
            ? StepStatus.ERROR
            : StepStatus.IN_PROGRESS;

        dispatch({
          type: WizardActionType.SET_STEP_STATUS,
          payload: { step, status: newStatus },
        });
      },

      validateStep: (step: WizardStep): ValidationResult => {
        const stepData = state.formData[step as keyof WizardFormData];

        switch (step) {
          case WizardStep.CONTEXT:
            return validateContextStep(stepData);
          case WizardStep.SPECIFIC:
            return validateSpecificStep(stepData);
          case WizardStep.MEASURABLE:
            return validateMeasurableStep(stepData);
          case WizardStep.ACHIEVABLE:
            return validateAchievableStep(stepData);
          case WizardStep.RELEVANT:
            return validateRelevantStep(stepData);
          case WizardStep.TIMEBOUND:
            return validateTimeboundStep(stepData);
          case WizardStep.PREVIEW:
            return { isValid: true, errors: {} };
          default:
            return { isValid: false, errors: {} };
        }
      },

      getStepData: (step: WizardStep): any => {
        return state.formData[step as keyof WizardFormData];
      },

      resetStep: (step: WizardStep) => {
        const emptyData = createEmptyFormData();
        const stepData = emptyData[step as keyof WizardFormData];

        dispatch({
          type: WizardActionType.UPDATE_FORM_DATA,
          payload: { step, data: stepData },
        });

        dispatch({
          type: WizardActionType.SET_STEP_STATUS,
          payload: { step, status: StepStatus.NOT_STARTED },
        });

        dispatch({
          type: WizardActionType.SET_VALIDATION_RESULT,
          payload: { step, result: { isValid: false, errors: {} } },
        });
      },
    }),
    [state.formData, state.stepStatus]
  );

  // =============================================================================
  // Draft Management Functions
  // =============================================================================

  const draftManagement = useMemo(
    () => ({
      saveDraft: () => {
        try {
          const draftId = saveDraftToStorage(state.formData, state);
          dispatch({ type: WizardActionType.SAVE_DRAFT });
          return draftId;
        } catch (error) {
          console.error('Failed to save draft:', error);
          throw error;
        }
      },

      loadDraft: (draftId: string) => {
        try {
          const draft = loadDraftFromStorage(draftId);
          if (draft) {
            dispatch({
              type: WizardActionType.LOAD_DRAFT,
              payload: draft,
            });
          }
        } catch (error) {
          console.error('Failed to load draft:', error);
          throw error;
        }
      },

      deleteDraft: (draftId: string) => {
        try {
          deleteDraftFromStorage(draftId);
        } catch (error) {
          console.error('Failed to delete draft:', error);
          throw error;
        }
      },

      listDrafts: () => {
        try {
          return getDraftMetadataList();
        } catch (error) {
          console.error('Failed to list drafts:', error);
          return [];
        }
      },

      autoSave: () => {
        if (state.autoSaveEnabled && state.hasUnsavedChanges) {
          draftManagement.saveDraft();
        }
      },
    }),
    [state]
  );

  // =============================================================================
  // Template Functions
  // =============================================================================

  const templates = useMemo(() => {
    const templateDefinitions = getDefaultTemplates();

    return {
      applyTemplate: (template: GoalTemplate) => {
        const templateDef = templateDefinitions.find(t => t.id === template);
        if (templateDef) {
          dispatch({
            type: WizardActionType.APPLY_TEMPLATE,
            payload: templateDef,
          });
        }
      },

      getTemplate: (id: GoalTemplate): TemplateDefinition | undefined => {
        return templateDefinitions.find(t => t.id === id);
      },

      listTemplates: (): TemplateDefinition[] => {
        return templateDefinitions;
      },
    };
  }, []);

  // =============================================================================
  // Export Functions
  // =============================================================================

  const exportFunctions = useMemo(
    () => ({
      exportGoal: async (options: ExportOptions): Promise<ExportResult> => {
        try {
          const smartGoal = transformToSmartGoal(state.formData as WizardFormData);

          switch (options.format) {
            case 'json':
              const jsonContent = JSON.stringify(smartGoal, null, 2);
              return {
                success: true,
                content: jsonContent,
                fileSize: new Blob([jsonContent]).size,
              };

            case 'markdown':
              const markdownContent = generateMarkdownExport(smartGoal, state.smartScore, options);
              return {
                success: true,
                content: markdownContent,
                fileSize: new Blob([markdownContent]).size,
              };

            default:
              throw new Error(`Unsupported export format: ${options.format}`);
          }
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Export failed',
          };
        }
      },

      generatePreview: (): SmartGoalCreate => {
        return transformToSmartGoal(state.formData as WizardFormData);
      },
    }),
    [state.formData, state.smartScore]
  );

  // =============================================================================
  // Context Value
  // =============================================================================

  const contextValue: WizardContextValue = {
    state,
    dispatch,
    navigation,
    dataManagement,
    draftManagement,
    templates,
    export: exportFunctions,
  };

  return <WizardContext.Provider value={contextValue}>{children}</WizardContext.Provider>;
};

// =============================================================================
// Hook for using Wizard Context
// =============================================================================

/**
 * Hook to access wizard context
 */
export const useWizardContext = (): WizardContextValue => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizardContext must be used within a WizardContextProvider');
  }
  return context;
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generate markdown export content
 */
function generateMarkdownExport(
  goal: SmartGoalCreate,
  smartScore?: any,
  options: ExportOptions = { format: 'markdown' }
): string {
  const sections: string[] = [];

  // Header
  sections.push(`# ${goal.title}\n`);
  sections.push(`**Category:** ${goal.category}`);
  sections.push(`**Priority:** ${goal.priority}`);
  sections.push(`**Status:** ${goal.status}\n`);

  // Description
  sections.push(`## Description\n${goal.description}\n`);

  // SMART Criteria
  sections.push(`## SMART Criteria\n`);

  // Specific
  sections.push(`### Specific\n**Objective:** ${goal.specificObjective}\n`);
  if (goal.successCriteria.length > 0) {
    sections.push(`**Success Criteria:**`);
    goal.successCriteria.forEach(criteria => {
      sections.push(`- ${criteria}`);
    });
    sections.push('');
  }

  // Measurable
  sections.push(`### Measurable`);
  sections.push(`**Target:** ${goal.measurable.targetValue} ${goal.measurable.unit}`);
  sections.push(`**Current:** ${goal.measurable.currentValue} ${goal.measurable.unit}`);
  sections.push(`**Measurement Frequency:** ${goal.measurable.measurementFrequency}\n`);

  // Achievable
  if (goal.achievability.requiredResources.length > 0) {
    sections.push(`### Achievable`);
    sections.push(`**Required Resources:**`);
    goal.achievability.requiredResources.forEach(resource => {
      sections.push(`- ${resource.name}: ${resource.quantity} ${resource.unit}`);
    });
    sections.push('');
  }

  // Relevant
  sections.push(`### Relevant\n${goal.relevance.rationale}\n`);

  // Time-bound
  sections.push(`### Time-bound`);
  sections.push(`**Start Date:** ${goal.timebound.startDate.toDateString()}`);
  sections.push(`**Target Date:** ${goal.timebound.targetDate.toDateString()}`);
  if (goal.timebound.deadline) {
    sections.push(`**Deadline:** ${goal.timebound.deadline.toDateString()}`);
  }
  sections.push('');

  // SMART Score
  if (options.includeScore && smartScore) {
    sections.push(`## SMART Score: ${smartScore.breakdown.total}/100\n`);
    sections.push(`**Category:** ${smartScore.category}\n`);
  }

  // Tags
  if (goal.tags.length > 0) {
    sections.push(`## Tags\n${goal.tags.map(tag => `\`${tag}\``).join(', ')}\n`);
  }

  return sections.join('\n');
}

export default WizardContextProvider;