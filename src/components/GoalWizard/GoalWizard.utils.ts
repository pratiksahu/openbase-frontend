/**
 * GoalWizard Utility Functions
 *
 * This file contains utility functions for the GoalWizard component including
 * validation, data transformation, template management, and local storage operations.
 */

import {
  SmartGoalCreate,
  GoalCategory,
  GoalPriority,
  GoalStatus,
  MetricType,
  Frequency,
} from '@/types/smart-goals.types';

import {
  WizardStep,
  StepStatus,
  WizardFormData,
  ValidationResult,
  TemplateDefinition,
  GoalTemplate,
  DraftMetadata,
  StoredDraft,
  WizardState,
  StepConfig,
  ContextStepData,
  SpecificStepData,
  MeasurableStepData,
  AchievableStepData,
  RelevantStepData,
  TimeboundStepData,
} from './GoalWizard.types';

// =============================================================================
// Constants
// =============================================================================

/** Default wizard steps configuration */
export const DEFAULT_STEPS: StepConfig[] = [
  {
    step: WizardStep.CONTEXT,
    title: 'Context',
    description: 'Set the background and foundation',
    icon: 'FileText',
    required: true,
    estimatedTime: 5,
    requiredFields: ['currentSituation', 'problemStatement', 'category'],
  },
  {
    step: WizardStep.SPECIFIC,
    title: 'Specific',
    description: 'Define clear objectives',
    icon: 'Target',
    required: true,
    estimatedTime: 10,
    requiredFields: ['title', 'description', 'specificObjective', 'successCriteria'],
  },
  {
    step: WizardStep.MEASURABLE,
    title: 'Measurable',
    description: 'Set quantifiable metrics',
    icon: 'BarChart3',
    required: true,
    estimatedTime: 15,
    requiredFields: ['measurable'],
  },
  {
    step: WizardStep.ACHIEVABLE,
    title: 'Achievable',
    description: 'Assess feasibility',
    icon: 'CheckCircle2',
    required: true,
    estimatedTime: 20,
    requiredFields: ['requiredResources', 'riskAssessment'],
  },
  {
    step: WizardStep.RELEVANT,
    title: 'Relevant',
    description: 'Ensure strategic alignment',
    icon: 'Users',
    required: true,
    estimatedTime: 15,
    requiredFields: ['rationale', 'expectedBenefits'],
  },
  {
    step: WizardStep.TIMEBOUND,
    title: 'Time-bound',
    description: 'Set deadlines and milestones',
    icon: 'Calendar',
    required: true,
    estimatedTime: 10,
    requiredFields: ['startDate', 'targetDate'],
  },
  {
    step: WizardStep.PREVIEW,
    title: 'Preview',
    description: 'Review and finalize',
    icon: 'Eye',
    required: true,
    estimatedTime: 5,
    requiredFields: [],
  },
];

/** Step order for navigation */
export const STEP_ORDER: WizardStep[] = [
  WizardStep.CONTEXT,
  WizardStep.SPECIFIC,
  WizardStep.MEASURABLE,
  WizardStep.ACHIEVABLE,
  WizardStep.RELEVANT,
  WizardStep.TIMEBOUND,
  WizardStep.PREVIEW,
];

/** Local storage keys */
export const STORAGE_KEYS = {
  DRAFTS: 'goalWizard_drafts',
  CURRENT_DRAFT: 'goalWizard_currentDraft',
  PREFERENCES: 'goalWizard_preferences',
} as const;

// =============================================================================
// Navigation Utilities
// =============================================================================

/**
 * Get the index of a wizard step
 */
export function getStepIndex(step: WizardStep): number {
  return STEP_ORDER.indexOf(step);
}

/**
 * Get the next step in the wizard flow
 */
export function getNextStep(currentStep: WizardStep): WizardStep | null {
  const currentIndex = getStepIndex(currentStep);
  if (currentIndex === -1 || currentIndex >= STEP_ORDER.length - 1) {
    return null;
  }
  return STEP_ORDER[currentIndex + 1];
}

/**
 * Get the previous step in the wizard flow
 */
export function getPreviousStep(currentStep: WizardStep): WizardStep | null {
  const currentIndex = getStepIndex(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return STEP_ORDER[currentIndex - 1];
}

/**
 * Check if a step can be navigated to based on previous step completion
 */
export function canNavigateToStep(
  targetStep: WizardStep,
  stepStatus: Record<WizardStep, StepStatus>
): boolean {
  const targetIndex = getStepIndex(targetStep);

  // Can always navigate to first step
  if (targetIndex === 0) {
    return true;
  }

  // Check all previous steps are completed or in progress
  for (let i = 0; i < targetIndex; i++) {
    const step = STEP_ORDER[i];
    const status = stepStatus[step];
    if (status === StepStatus.NOT_STARTED || status === StepStatus.ERROR) {
      return false;
    }
  }

  return true;
}

/**
 * Calculate overall wizard progress percentage
 */
export function calculateProgress(stepStatus: Record<WizardStep, StepStatus>): number {
  const completedSteps = STEP_ORDER.filter(
    step => stepStatus[step] === StepStatus.COMPLETED
  ).length;

  return Math.round((completedSteps / STEP_ORDER.length) * 100);
}

// =============================================================================
// Validation Utilities
// =============================================================================

/**
 * Validate context step data
 */
export function validateContextStep(data: Partial<ContextStepData>): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: string[] = [];

  if (!data.currentSituation?.trim()) {
    errors.currentSituation = ['Current situation is required'];
  } else if (data.currentSituation.length < 20) {
    warnings.push('Consider providing more detail about the current situation');
  }

  if (!data.problemStatement?.trim()) {
    errors.problemStatement = ['Problem statement is required'];
  } else if (data.problemStatement.length < 20) {
    warnings.push('Problem statement could be more detailed');
  }

  if (!data.category) {
    errors.category = ['Goal category is required'];
  }

  if (!data.stakeholdersInvolved?.length) {
    warnings.push('Consider identifying stakeholders involved');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate specific step data
 */
export function validateSpecificStep(data: Partial<SpecificStepData>): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (!data.title?.trim()) {
    errors.title = ['Goal title is required'];
  } else if (data.title.length < 5) {
    errors.title = ['Title should be at least 5 characters'];
  } else if (data.title.length > 100) {
    errors.title = ['Title should be less than 100 characters'];
  }

  if (!data.description?.trim()) {
    errors.description = ['Goal description is required'];
  } else if (data.description.length < 20) {
    warnings.push('Consider providing more detailed description');
  }

  if (!data.specificObjective?.trim()) {
    errors.specificObjective = ['Specific objective is required'];
  }

  if (!data.successCriteria?.length) {
    errors.successCriteria = ['At least one success criterion is required'];
  } else if (data.successCriteria.length < 2) {
    suggestions.push('Consider adding multiple success criteria for clarity');
  }

  if (!data.tags?.length) {
    warnings.push('Adding tags will help organize your goals');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Validate measurable step data
 */
export function validateMeasurableStep(data: Partial<MeasurableStepData>): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: string[] = [];

  if (!data.measurable) {
    errors.measurable = ['Primary metric is required'];
  } else {
    if (!data.measurable.unit?.trim()) {
      errors.measurable = [...(errors.measurable || []), 'Unit of measurement is required'];
    }

    if (data.measurable.targetValue === undefined || data.measurable.targetValue === null) {
      errors.measurable = [...(errors.measurable || []), 'Target value is required'];
    }

    if (data.measurable.currentValue === undefined || data.measurable.currentValue === null) {
      warnings.push('Consider setting a baseline/current value');
    }
  }

  if (!data.successDefinitions?.length) {
    warnings.push('Define clear success criteria for measurements');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate achievable step data
 */
export function validateAchievableStep(data: Partial<AchievableStepData>): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: string[] = [];

  if (!data.riskAssessment?.trim()) {
    errors.riskAssessment = ['Risk assessment is required'];
  }

  if (!data.requiredResources?.length) {
    warnings.push('Consider identifying required resources');
  }

  if (!data.requiredSkills?.length) {
    warnings.push('Identify skills needed for success');
  }

  if (!data.constraints?.length) {
    warnings.push('Consider potential constraints or obstacles');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate relevant step data
 */
export function validateRelevantStep(data: Partial<RelevantStepData>): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: string[] = [];

  if (!data.rationale?.trim()) {
    errors.rationale = ['Rationale for the goal is required'];
  } else if (data.rationale.length < 20) {
    warnings.push('Consider providing more detailed rationale');
  }

  if (!data.expectedBenefits?.length) {
    errors.expectedBenefits = ['At least one expected benefit is required'];
  }

  if (!data.stakeholders?.length) {
    warnings.push('Identify key stakeholders');
  }

  if (!data.strategyAlignments?.length) {
    warnings.push('Consider how this aligns with broader strategies');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate timebound step data
 */
export function validateTimeboundStep(data: Partial<TimeboundStepData>): ValidationResult {
  const errors: Record<string, string[]> = {};
  const warnings: string[] = [];

  if (!data.startDate) {
    errors.startDate = ['Start date is required'];
  }

  if (!data.targetDate) {
    errors.targetDate = ['Target date is required'];
  }

  if (data.startDate && data.targetDate) {
    if (data.startDate >= data.targetDate) {
      errors.targetDate = ['Target date must be after start date'];
    }

    const timeDiff = data.targetDate.getTime() - data.startDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff < 1) {
      warnings.push('Very short timeline - consider if this is realistic');
    } else if (daysDiff > 365) {
      warnings.push('Long timeline - consider breaking into smaller milestones');
    }
  }

  if (data.deadline && data.targetDate && data.deadline < data.targetDate) {
    errors.deadline = ['Deadline cannot be before target date'];
  }

  if (!data.milestones?.length) {
    warnings.push('Consider adding milestones to track progress');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate complete wizard form data
 */
export function validateCompleteForm(data: Partial<WizardFormData>): ValidationResult {
  const allErrors: Record<string, string[]> = {};
  const allWarnings: string[] = [];
  const allSuggestions: string[] = [];

  if (data.context) {
    const contextResult = validateContextStep(data.context);
    Object.assign(allErrors, contextResult.errors);
    if (contextResult.warnings) allWarnings.push(...contextResult.warnings);
  }

  if (data.specific) {
    const specificResult = validateSpecificStep(data.specific);
    Object.assign(allErrors, specificResult.errors);
    if (specificResult.warnings) allWarnings.push(...specificResult.warnings);
    if (specificResult.suggestions) allSuggestions.push(...specificResult.suggestions);
  }

  if (data.measurable) {
    const measurableResult = validateMeasurableStep(data.measurable);
    Object.assign(allErrors, measurableResult.errors);
    if (measurableResult.warnings) allWarnings.push(...measurableResult.warnings);
  }

  if (data.achievable) {
    const achievableResult = validateAchievableStep(data.achievable);
    Object.assign(allErrors, achievableResult.errors);
    if (achievableResult.warnings) allWarnings.push(...achievableResult.warnings);
  }

  if (data.relevant) {
    const relevantResult = validateRelevantStep(data.relevant);
    Object.assign(allErrors, relevantResult.errors);
    if (relevantResult.warnings) allWarnings.push(...relevantResult.warnings);
  }

  if (data.timebound) {
    const timeboundResult = validateTimeboundStep(data.timebound);
    Object.assign(allErrors, timeboundResult.errors);
    if (timeboundResult.warnings) allWarnings.push(...timeboundResult.warnings);
  }

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
    suggestions: allSuggestions.length > 0 ? allSuggestions : undefined,
  };
}

// =============================================================================
// Data Transformation Utilities
// =============================================================================

/**
 * Convert wizard form data to SmartGoalCreate
 */
export function transformToSmartGoal(formData: WizardFormData): SmartGoalCreate {
  const now = new Date();

  return {
    // Specific data
    title: formData.specific.title,
    description: formData.specific.description,
    specificObjective: formData.specific.specificObjective,
    successCriteria: formData.specific.successCriteria,
    category: formData.context.category,
    tags: formData.specific.tags,

    // Measurable data
    measurable: formData.measurable.measurable,
    checkpoints: [],
    progress: 0,

    // Achievable data
    achievability: {
      score: 0.8, // Will be calculated properly
      requiredResources: formData.achievable.requiredResources,
      requiredSkills: formData.achievable.requiredSkills,
      constraints: formData.achievable.constraints,
      riskAssessment: formData.achievable.riskAssessment,
      successProbability: 0.8, // Will be calculated
      assessmentConfidence: 0.8, // Will be calculated
      lastAssessedAt: now,
      assessedBy: 'current-user', // Will be replaced with actual user
    },

    // Relevant data
    relevance: {
      rationale: formData.relevant.rationale,
      strategyAlignments: formData.relevant.strategyAlignments,
      stakeholders: formData.relevant.stakeholders,
      expectedBenefits: formData.relevant.expectedBenefits,
      risksOfNotAchieving: formData.relevant.risksOfNotAchieving,
      relevanceScore: 0.8, // Will be calculated
      valueScore: 0.8, // Will be calculated
      lastReviewedAt: now,
      reviewedBy: 'current-user', // Will be replaced
    },

    // Timebound data
    timebound: {
      startDate: formData.timebound.startDate,
      targetDate: formData.timebound.targetDate,
      deadline: formData.timebound.deadline,
      estimatedDuration: Math.ceil(
        (formData.timebound.targetDate.getTime() - formData.timebound.startDate.getTime()) / (1000 * 60 * 60 * 24)
      ),
      bufferDays: formData.timebound.bufferDays,
      isRecurring: formData.timebound.isRecurring,
      recurrencePattern: formData.timebound.recurrencePattern as Frequency,
      dependencies: formData.timebound.dependencies,
    },

    // Goal management
    status: GoalStatus.DRAFT,
    priority: formData.priority,
    ownerId: 'current-user', // Will be replaced
    collaborators: [],
    childGoalIds: [],

    // Execution and tracking
    tasks: [],
    milestones: formData.timebound.milestones.map((milestone, index) => ({
      id: `milestone-${index}`,
      title: milestone.title,
      description: milestone.description,
      targetDate: milestone.date,
      isCompleted: false,
      successCriteria: [],
      progress: 0,
      priority: GoalPriority.MEDIUM,
      taskIds: [],
      dependencies: [],
      goalId: 'pending', // Will be set after goal creation
      order: index,
      isCritical: false,
      createdAt: now,
      updatedAt: now,
      createdBy: 'current-user',
      updatedBy: 'current-user',
      isDeleted: false,
    })),
    outcomes: [],

    // Metadata
    visibility: formData.visibility,
    isArchived: false,
    isDeleted: false,
  };
}

// =============================================================================
// Template Definitions
// =============================================================================

/**
 * Get default template definitions
 */
export function getDefaultTemplates(): TemplateDefinition[] {
  return [
    {
      id: GoalTemplate.BUSINESS,
      name: 'Business Goal',
      description: 'Revenue, growth, or market objectives',
      category: 'Business',
      icon: 'TrendingUp',
      tags: ['business', 'revenue', 'growth'],
      formData: {
        context: {
          category: GoalCategory.PROFESSIONAL,
          currentSituation: '',
          problemStatement: '',
          initialGoalDescription: '',
          stakeholdersInvolved: ['Management', 'Sales Team'],
        },
        specific: {
          title: '',
          description: '',
          specificObjective: '',
          successCriteria: [],
          tags: ['business', 'revenue'],
        },
        measurable: {
          measurable: {
            metricType: MetricType.CURRENCY,
            targetValue: 0,
            currentValue: 0,
            unit: '$',
            higherIsBetter: true,
            measurementFrequency: Frequency.MONTHLY,
          },
          successDefinitions: ['Achieve target revenue', 'Maintain profitability'],
        },
        priority: GoalPriority.HIGH,
      },
    },
    {
      id: GoalTemplate.PERSONAL_DEVELOPMENT,
      name: 'Personal Development',
      description: 'Skills, learning, or growth objectives',
      category: 'Personal',
      icon: 'GraduationCap',
      tags: ['personal', 'learning', 'skills'],
      formData: {
        context: {
          currentSituation: '',
          problemStatement: '',
          initialGoalDescription: '',
          category: GoalCategory.PERSONAL,
          stakeholdersInvolved: ['Self', 'Mentor'],
        },
        specific: {
          title: '',
          description: '',
          specificObjective: '',
          successCriteria: [],
          tags: ['personal', 'development'],
        },
        measurable: {
          measurable: {
            metricType: MetricType.RATING,
            targetValue: 8,
            currentValue: 5,
            unit: '/10',
            higherIsBetter: true,
            measurementFrequency: Frequency.WEEKLY,
          },
          successDefinitions: [],
        },
        priority: GoalPriority.MEDIUM,
      },
    },
    {
      id: GoalTemplate.PROJECT_MILESTONE,
      name: 'Project Milestone',
      description: 'Specific project deliverables or phases',
      category: 'Project',
      icon: 'Flag',
      tags: ['project', 'milestone', 'deliverable'],
      formData: {
        context: {
          currentSituation: '',
          problemStatement: '',
          initialGoalDescription: '',
          category: GoalCategory.PROFESSIONAL,
          stakeholdersInvolved: ['Project Team', 'Stakeholders'],
        },
        specific: {
          title: '',
          description: '',
          specificObjective: '',
          successCriteria: [],
          tags: ['project', 'milestone'],
        },
        measurable: {
          measurable: {
            metricType: MetricType.PERCENTAGE,
            targetValue: 100,
            currentValue: 0,
            unit: '%',
            higherIsBetter: true,
            measurementFrequency: Frequency.WEEKLY,
          },
          successDefinitions: [],
        },
        priority: GoalPriority.HIGH,
      },
    },
  ];
}

// =============================================================================
// Local Storage Utilities
// =============================================================================

/**
 * Save draft to local storage
 */
export function saveDraftToStorage(
  formData: Partial<WizardFormData>,
  wizardState: Partial<WizardState>
): string {
  try {
    const drafts = getDraftsFromStorage();
    const draftId = `draft-${Date.now()}`;

    const metadata: DraftMetadata = {
      id: draftId,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: formData.specific?.title || 'Untitled Goal',
      currentStep: wizardState.currentStep || WizardStep.CONTEXT,
      completionPercentage: calculateProgress(wizardState.stepStatus || {
        context: StepStatus.NOT_STARTED,
        specific: StepStatus.NOT_STARTED,
        measurable: StepStatus.NOT_STARTED,
        achievable: StepStatus.NOT_STARTED,
        relevant: StepStatus.NOT_STARTED,
        timebound: StepStatus.NOT_STARTED,
        preview: StepStatus.NOT_STARTED,
      }),
      version: 1,
    };

    const draft: StoredDraft = {
      metadata,
      formData,
      wizardState,
    };

    drafts[draftId] = draft;
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));

    return draftId;
  } catch (error) {
    console.error('Failed to save draft to storage:', error);
    throw error;
  }
}

/**
 * Get drafts from local storage
 */
export function getDraftsFromStorage(): Record<string, StoredDraft> {
  try {
    const draftsJson = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    return draftsJson ? JSON.parse(draftsJson) : {};
  } catch (error) {
    console.error('Failed to load drafts from storage:', error);
    return {};
  }
}

/**
 * Load draft from local storage
 */
export function loadDraftFromStorage(draftId: string): StoredDraft | null {
  try {
    const drafts = getDraftsFromStorage();
    const draft = drafts[draftId];

    if (draft) {
      // Convert date strings back to Date objects
      draft.metadata.createdAt = new Date(draft.metadata.createdAt);
      draft.metadata.updatedAt = new Date(draft.metadata.updatedAt);

      if (draft.formData.timebound?.startDate) {
        draft.formData.timebound.startDate = new Date(draft.formData.timebound.startDate);
      }
      if (draft.formData.timebound?.targetDate) {
        draft.formData.timebound.targetDate = new Date(draft.formData.timebound.targetDate);
      }
      if (draft.formData.timebound?.deadline) {
        draft.formData.timebound.deadline = new Date(draft.formData.timebound.deadline);
      }
    }

    return draft || null;
  } catch (error) {
    console.error('Failed to load draft from storage:', error);
    return null;
  }
}

/**
 * Delete draft from local storage
 */
export function deleteDraftFromStorage(draftId: string): void {
  try {
    const drafts = getDraftsFromStorage();
    delete drafts[draftId];
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  } catch (error) {
    console.error('Failed to delete draft from storage:', error);
  }
}

/**
 * Get draft metadata list from storage
 */
export function getDraftMetadataList(): DraftMetadata[] {
  try {
    const drafts = getDraftsFromStorage();
    return Object.values(drafts)
      .map(draft => draft.metadata)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error('Failed to get draft metadata list:', error);
    return [];
  }
}

// =============================================================================
// Initial State Utilities
// =============================================================================

/**
 * Create initial wizard state
 */
export function createInitialWizardState(): WizardState {
  const initialStepStatus = STEP_ORDER.reduce((acc, step) => {
    acc[step] = StepStatus.NOT_STARTED;
    return acc;
  }, {} as Record<WizardStep, StepStatus>);

  const initialValidation = STEP_ORDER.reduce((acc, step) => {
    acc[step] = { isValid: false, errors: {} };
    return acc;
  }, {} as Record<WizardStep, ValidationResult>);

  return {
    currentStep: WizardStep.CONTEXT,
    formData: {},
    stepStatus: initialStepStatus,
    validationResults: initialValidation,
    navigationHistory: [WizardStep.CONTEXT],
    isDraft: true,
    autoSaveEnabled: true,
    hasUnsavedChanges: false,
  };
}

/**
 * Create empty form data with defaults
 */
export function createEmptyFormData(): Partial<WizardFormData> {
  return {
    context: {
      currentSituation: '',
      problemStatement: '',
      initialGoalDescription: '',
      stakeholdersInvolved: [],
      category: GoalCategory.PERSONAL,
    },
    specific: {
      title: '',
      description: '',
      specificObjective: '',
      successCriteria: [],
      tags: [],
    },
    measurable: {
      measurable: {
        metricType: MetricType.NUMBER,
        targetValue: 0,
        currentValue: 0,
        unit: '',
        higherIsBetter: true,
        measurementFrequency: Frequency.WEEKLY,
      },
      successDefinitions: [],
    },
    achievable: {
      requiredResources: [],
      requiredSkills: [],
      constraints: [],
      riskAssessment: '',
      mitigationStrategies: [],
    },
    relevant: {
      rationale: '',
      strategyAlignments: [],
      stakeholders: [],
      expectedBenefits: [],
      risksOfNotAchieving: [],
    },
    timebound: {
      startDate: new Date(),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isRecurring: false,
      milestones: [],
    },
    priority: GoalPriority.MEDIUM,
    visibility: 'private',
  };
}