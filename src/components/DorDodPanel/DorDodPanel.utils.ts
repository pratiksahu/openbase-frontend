import type {
  Criterion,
  CriteriaCategory,
  ProgressMetrics,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  AuditLogEntry,
  AuditAction,
  DorDodTemplate,
  TemplateApplyOptions,
} from './DorDodPanel.types';

/**
 * Calculates progress metrics for a set of criteria
 */
export function calculateProgressMetrics(criteria: Criterion[]): ProgressMetrics {
  const requiredItems = criteria.filter(c => c.category === 'required');
  const recommendedItems = criteria.filter(c => c.category === 'recommended');
  const optionalItems = criteria.filter(c => c.category === 'optional');

  const requiredCompleted = requiredItems.filter(c => c.isCompleted).length;
  const recommendedCompleted = recommendedItems.filter(c => c.isCompleted).length;
  const optionalCompleted = optionalItems.filter(c => c.isCompleted).length;

  const totalItems = criteria.length;
  const completedItems = criteria.filter(c => c.isCompleted).length;

  // Weighted scoring: required = 60%, recommended = 30%, optional = 10%
  const requiredScore = requiredItems.length > 0 ? (requiredCompleted / requiredItems.length) * 60 : 60;
  const recommendedScore = recommendedItems.length > 0 ? (recommendedCompleted / recommendedItems.length) * 30 : 30;
  const optionalScore = optionalItems.length > 0 ? (optionalCompleted / optionalItems.length) * 10 : 10;

  const readinessScore = Math.round(requiredScore + recommendedScore + optionalScore);
  const completionScore = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 100;

  return {
    readinessScore,
    completionScore,
    requiredItemsCompleted: requiredCompleted,
    totalRequiredItems: requiredItems.length,
    recommendedItemsCompleted: recommendedCompleted,
    totalRecommendedItems: recommendedItems.length,
    optionalItemsCompleted: optionalCompleted,
    totalOptionalItems: optionalItems.length,
    isReadyToStart: requiredCompleted === requiredItems.length,
    isReadyToComplete: requiredCompleted === requiredItems.length && completedItems === totalItems,
  };
}

/**
 * Validates criteria against their rules and dependencies
 */
export function validateCriteria(criteria: Criterion[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const blockingCriteria: string[] = [];

  for (const criterion of criteria) {
    if (!criterion.validationRule) continue;

    const rule = criterion.validationRule;

    switch (rule.type) {
      case 'required':
        if (criterion.category === 'required' && !criterion.isCompleted) {
          errors.push({
            criterionId: criterion.id,
            message: rule.message,
            type: 'required',
          });
          blockingCriteria.push(criterion.id);
        }
        break;

      case 'dependency':
        if (rule.dependsOn && criterion.isCompleted) {
          const unmetDependencies = rule.dependsOn.filter(depId => {
            const dependency = criteria.find(c => c.id === depId);
            return dependency && !dependency.isCompleted;
          });

          if (unmetDependencies.length > 0) {
            errors.push({
              criterionId: criterion.id,
              message: `Depends on: ${unmetDependencies.join(', ')}`,
              type: 'dependency',
            });
            blockingCriteria.push(criterion.id);
          }
        }
        break;

      case 'conditional':
        // TODO: Implement conditional validation based on rule.condition
        break;
    }

  }

  // Generate warnings for recommended items
  for (const criterion of criteria) {
    if (criterion.category === 'recommended' && !criterion.isCompleted) {
      warnings.push({
        criterionId: criterion.id,
        message: 'Recommended criterion not completed',
        type: 'recommendation',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    blockingCriteria,
  };
}

/**
 * Creates a new criterion with default values
 */
export function createCriterion(
  description: string,
  category: CriteriaCategory = 'required',
  order: number
): Omit<Criterion, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    description,
    category,
    isCompleted: false,
    order,
  };
}

/**
 * Generates a unique ID for a criterion
 */
export function generateCriterionId(): string {
  return `criterion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates an audit log entry
 */
export function createAuditLogEntry(
  action: AuditAction,
  criterionId?: string,
  userId?: string,
  oldValue?: any,
  newValue?: any,
  metadata?: Record<string, any>
): AuditLogEntry {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    action,
    criterionId,
    userId,
    oldValue,
    newValue,
    metadata,
  };
}

/**
 * Sorts criteria by order, category, and creation date
 */
export function sortCriteria(criteria: Criterion[]): Criterion[] {
  return criteria.sort((a, b) => {
    // First sort by order
    if (a.order !== b.order) {
      return a.order - b.order;
    }

    // Then by category priority
    const categoryOrder = { required: 0, recommended: 1, optional: 2 };
    const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];
    if (categoryDiff !== 0) {
      return categoryDiff;
    }

    // Finally by creation date
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

/**
 * Applies a template to existing criteria
 */
export function applyTemplate(
  template: DorDodTemplate,
  currentDorCriteria: Criterion[],
  currentDodCriteria: Criterion[],
  options: TemplateApplyOptions
): { dorCriteria: Criterion[]; dodCriteria: Criterion[] } {
  const now = new Date();

  const createCriteriaFromTemplate = (templateCriteria: DorDodTemplate['dorCriteria'], startOrder = 0) => {
    return templateCriteria.map((tc, index) => ({
      ...tc,
      id: generateCriterionId(),
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
      order: startOrder + index + 1,
    }));
  };

  let newDorCriteria: Criterion[];
  let newDodCriteria: Criterion[];

  if (options.replaceExisting) {
    newDorCriteria = createCriteriaFromTemplate(template.dorCriteria);
    newDodCriteria = createCriteriaFromTemplate(template.dodCriteria);
  } else if (options.mergeWithExisting) {
    const maxDorOrder = Math.max(0, ...currentDorCriteria.map(c => c.order));
    const maxDodOrder = Math.max(0, ...currentDodCriteria.map(c => c.order));

    newDorCriteria = [
      ...currentDorCriteria,
      ...createCriteriaFromTemplate(template.dorCriteria, maxDorOrder),
    ];

    newDodCriteria = [
      ...currentDodCriteria,
      ...createCriteriaFromTemplate(template.dodCriteria, maxDodOrder),
    ];
  } else {
    // Default to append
    newDorCriteria = [
      ...currentDorCriteria,
      ...createCriteriaFromTemplate(template.dorCriteria, currentDorCriteria.length),
    ];

    newDodCriteria = [
      ...currentDodCriteria,
      ...createCriteriaFromTemplate(template.dodCriteria, currentDodCriteria.length),
    ];
  }

  // Apply category filter if specified
  if (options.categoryFilter && options.categoryFilter.length > 0) {
    newDorCriteria = newDorCriteria.filter(c => options.categoryFilter!.includes(c.category));
    newDodCriteria = newDodCriteria.filter(c => options.categoryFilter!.includes(c.category));
  }

  return {
    dorCriteria: sortCriteria(newDorCriteria),
    dodCriteria: sortCriteria(newDodCriteria),
  };
}

/**
 * Calculates completion percentage by category
 */
export function getCategoryProgress(criteria: Criterion[], category: CriteriaCategory): number {
  const categoryItems = criteria.filter(c => c.category === category);
  if (categoryItems.length === 0) return 100;

  const completed = categoryItems.filter(c => c.isCompleted).length;
  return Math.round((completed / categoryItems.length) * 100);
}

/**
 * Gets color class for progress indicators based on percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'text-green-600 dark:text-green-400';
  if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
  if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
  if (percentage >= 25) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * Gets category display information
 */
export function getCategoryInfo(category: CriteriaCategory): {
  label: string;
  color: string;
  icon: string;
  description: string
} {
  switch (category) {
    case 'required':
      return {
        label: 'Required',
        color: 'text-red-600 dark:text-red-400',
        icon: '⚠️',
        description: 'Must be completed',
      };
    case 'recommended':
      return {
        label: 'Recommended',
        color: 'text-yellow-600 dark:text-yellow-400',
        icon: '👍',
        description: 'Should be completed',
      };
    case 'optional':
      return {
        label: 'Optional',
        color: 'text-gray-600 dark:text-gray-400',
        icon: '✨',
        description: 'Nice to have',
      };
  }
}

/**
 * Exports criteria to different formats
 */
export function exportCriteria(criteria: Criterion[], format: 'json' | 'csv' | 'markdown'): string {
  switch (format) {
    case 'json':
      return JSON.stringify(criteria, null, 2);

    case 'csv':
      const headers = ['Description', 'Category', 'Completed', 'Help Text', 'Order'];
      const rows = criteria.map(c => [
        `"${c.description.replace(/"/g, '""')}"`,
        c.category,
        c.isCompleted ? 'Yes' : 'No',
        `"${(c.helpText || '').replace(/"/g, '""')}"`,
        c.order.toString(),
      ]);
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    case 'markdown':
      const groupedByCategory = criteria.reduce((groups, criterion) => {
        const category = criterion.category;
        if (!groups[category]) groups[category] = [];
        groups[category].push(criterion);
        return groups;
      }, {} as Record<CriteriaCategory, Criterion[]>);

      let markdown = '';
      for (const [category, items] of Object.entries(groupedByCategory)) {
        const { label } = getCategoryInfo(category as CriteriaCategory);
        markdown += `\n## ${label}\n\n`;

        for (const item of items) {
          const checkbox = item.isCompleted ? '[x]' : '[ ]';
          markdown += `- ${checkbox} ${item.description}`;
          if (item.helpText) {
            markdown += `\n  > ${item.helpText}`;
          }
          markdown += '\n';
        }
      }

      return markdown;

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Calculates time-based metrics
 */
export function calculateTimeMetrics(
  markedReadyAt?: Date,
  markedDoneAt?: Date,
  estimatedDuration?: number
): {
  timeInProgress?: number;
  isOverdue?: boolean;
  remainingTime?: number;
  efficiency?: number;
} {
  const now = new Date();
  let timeInProgress: number | undefined;
  let isOverdue: boolean | undefined;
  let remainingTime: number | undefined;
  let efficiency: number | undefined;

  if (markedReadyAt) {
    const endTime = markedDoneAt || now;
    timeInProgress = endTime.getTime() - markedReadyAt.getTime();

    if (estimatedDuration) {
      isOverdue = timeInProgress > estimatedDuration;

      if (!markedDoneAt) {
        remainingTime = Math.max(0, estimatedDuration - timeInProgress);
      }

      if (markedDoneAt) {
        efficiency = (estimatedDuration / timeInProgress) * 100;
      }
    }
  }

  return {
    timeInProgress,
    isOverdue,
    remainingTime,
    efficiency,
  };
}

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Deep clone utility for state management
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as unknown as T;

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}