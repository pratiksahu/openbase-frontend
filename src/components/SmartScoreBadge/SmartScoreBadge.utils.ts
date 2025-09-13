/**
 * Utility functions for calculating SMART goal scores
 */

import { SmartGoal } from '@/types/smart-goals.types';

import {
  SmartScoreBreakdown,
  SmartScoreResult,
  ScoreConfig,
} from './SmartScoreBadge.types';

/** Default configuration for score calculation */
export const DEFAULT_CONFIG: Required<ScoreConfig> = {
  specificWeight: 20,
  measurableWeight: 20,
  achievableWeight: 20,
  relevantWeight: 20,
  timeBoundWeight: 20,
};

/**
 * Calculate the Specific (S) criteria score
 * Checks if title, description, specificObjective, and successCriteria are present
 */
function calculateSpecificScore(goal: SmartGoal): number {
  let score = 0;
  const maxScore = 20;
  const criteriaCount = 4;
  const pointsPerCriteria = maxScore / criteriaCount;

  // Check title (required, must be non-empty)
  if (goal.title && goal.title.trim().length > 0) {
    score += pointsPerCriteria;
  }

  // Check description (required, must be non-empty)
  if (goal.description && goal.description.trim().length > 0) {
    score += pointsPerCriteria;
  }

  // Check specificObjective (required, must be non-empty)
  if (goal.specificObjective && goal.specificObjective.trim().length > 0) {
    score += pointsPerCriteria;
  }

  // Check successCriteria (must be array with at least one item)
  if (goal.successCriteria && goal.successCriteria.length > 0) {
    score += pointsPerCriteria;
  }

  return Math.round(score);
}

/**
 * Calculate the Measurable (M) criteria score
 * Checks if measurable specs and checkpoints exist
 */
function calculateMeasurableScore(goal: SmartGoal): number {
  let score = 0;
  const maxScore = 20;
  const criteriaCount = 4;
  const pointsPerCriteria = maxScore / criteriaCount;

  // Check if measurable spec exists
  if (goal.measurable) {
    score += pointsPerCriteria;

    // Check if target value is set and greater than 0
    if (
      goal.measurable.targetValue !== undefined &&
      goal.measurable.targetValue !== null &&
      goal.measurable.targetValue > 0
    ) {
      score += pointsPerCriteria;
    }

    // Check if unit is defined
    if (goal.measurable.unit && goal.measurable.unit.trim().length > 0) {
      score += pointsPerCriteria;
    }

    // Check if measurement frequency is set
    if (goal.measurable.measurementFrequency) {
      score += pointsPerCriteria;
    }
  }

  return Math.round(score);
}

/**
 * Calculate the Achievable (A) criteria score
 * Checks achievability score and resources
 */
function calculateAchievableScore(goal: SmartGoal): number {
  let score = 0;
  const maxScore = 20;
  const criteriaCount = 4;
  const pointsPerCriteria = maxScore / criteriaCount;

  // Check if achievability assessment exists
  if (goal.achievability) {
    score += pointsPerCriteria;

    // Check if achievability score is reasonable (>= 0.3)
    if (goal.achievability.score >= 0.3) {
      score += pointsPerCriteria;
    }

    // Check if required resources are identified
    if (
      goal.achievability.requiredResources &&
      goal.achievability.requiredResources.length > 0
    ) {
      score += pointsPerCriteria;
    }

    // Check if required skills are identified
    if (
      goal.achievability.requiredSkills &&
      goal.achievability.requiredSkills.length > 0
    ) {
      score += pointsPerCriteria;
    }
  }

  return Math.round(score);
}

/**
 * Calculate the Relevant (R) criteria score
 * Checks relevance score and stakeholders
 */
function calculateRelevantScore(goal: SmartGoal): number {
  let score = 0;
  const maxScore = 20;
  const criteriaCount = 4;
  const pointsPerCriteria = maxScore / criteriaCount;

  // Check if relevance assessment exists
  if (goal.relevance) {
    score += pointsPerCriteria;

    // Check if relevance score is good (>= 0.6)
    if (goal.relevance.relevanceScore >= 0.6) {
      score += pointsPerCriteria;
    }

    // Check if rationale is provided
    if (
      goal.relevance.rationale &&
      goal.relevance.rationale.trim().length > 0
    ) {
      score += pointsPerCriteria;
    }

    // Check if stakeholders are identified
    if (goal.relevance.stakeholders && goal.relevance.stakeholders.length > 0) {
      score += pointsPerCriteria;
    }
  }

  return Math.round(score);
}

/**
 * Calculate the Time-bound (T) criteria score
 * Checks timebound dates and milestones
 */
function calculateTimeBoundScore(goal: SmartGoal): number {
  let score = 0;
  const maxScore = 20;
  const criteriaCount = 4;
  const pointsPerCriteria = maxScore / criteriaCount;

  // Check if timebound specification exists
  if (goal.timebound) {
    score += pointsPerCriteria;

    // Check if start date is set
    if (goal.timebound.startDate) {
      score += pointsPerCriteria;
    }

    // Check if target date is set
    if (goal.timebound.targetDate) {
      score += pointsPerCriteria;
    }

    // Check if estimated duration is set
    if (goal.timebound.estimatedDuration > 0) {
      score += pointsPerCriteria;
    }
  }

  return Math.round(score);
}

/**
 * Generate improvement suggestions based on missing criteria
 */
function generateSuggestions(
  goal: SmartGoal,
  breakdown: SmartScoreBreakdown
): string[] {
  const suggestions: string[] = [];

  // Specific suggestions
  if (breakdown.specific < 20) {
    if (!goal.title || goal.title.trim().length === 0) {
      suggestions.push('Add a clear and concise title');
    }
    if (!goal.description || goal.description.trim().length === 0) {
      suggestions.push('Provide a detailed description');
    }
    if (!goal.specificObjective || goal.specificObjective.trim().length === 0) {
      suggestions.push('Define a specific objective');
    }
    if (!goal.successCriteria || goal.successCriteria.length === 0) {
      suggestions.push('Add success criteria');
    }
  }

  // Measurable suggestions
  if (breakdown.measurable < 20) {
    if (!goal.measurable) {
      suggestions.push('Add measurable specifications');
    } else {
      if (
        goal.measurable.targetValue === undefined ||
        goal.measurable.targetValue === null ||
        goal.measurable.targetValue === 0
      ) {
        suggestions.push('Set a target value');
      }
      if (!goal.measurable.unit || goal.measurable.unit.trim().length === 0) {
        suggestions.push('Define measurement unit');
      }
      if (!goal.measurable.measurementFrequency) {
        suggestions.push('Set measurement frequency');
      }
    }
  }

  // Achievable suggestions
  if (breakdown.achievable < 20) {
    if (!goal.achievability) {
      suggestions.push('Add achievability assessment');
    } else {
      if (goal.achievability.score < 0.3) {
        suggestions.push('Improve achievability score or adjust goal scope');
      }
      if (
        !goal.achievability.requiredResources ||
        goal.achievability.requiredResources.length === 0
      ) {
        suggestions.push('Identify required resources');
      }
      if (
        !goal.achievability.requiredSkills ||
        goal.achievability.requiredSkills.length === 0
      ) {
        suggestions.push('List required skills');
      }
    }
  }

  // Relevant suggestions
  if (breakdown.relevant < 20) {
    if (!goal.relevance) {
      suggestions.push('Add relevance assessment');
    } else {
      if (goal.relevance.relevanceScore < 0.6) {
        suggestions.push('Improve relevance or align with strategic goals');
      }
      if (
        !goal.relevance.rationale ||
        goal.relevance.rationale.trim().length === 0
      ) {
        suggestions.push('Provide rationale for why this goal matters');
      }
      if (
        !goal.relevance.stakeholders ||
        goal.relevance.stakeholders.length === 0
      ) {
        suggestions.push('Identify affected stakeholders');
      }
    }
  }

  // Time-bound suggestions
  if (breakdown.timeBound < 20) {
    if (!goal.timebound) {
      suggestions.push('Add timebound specifications');
    } else {
      if (!goal.timebound.startDate) {
        suggestions.push('Set a start date');
      }
      if (!goal.timebound.targetDate) {
        suggestions.push('Set a target completion date');
      }
      if (goal.timebound.estimatedDuration <= 0) {
        suggestions.push('Estimate duration for the goal');
      }
    }
  }

  return suggestions;
}

/**
 * Determine score category based on total score
 */
function getScoreCategory(
  totalScore: number
): 'poor' | 'fair' | 'good' | 'excellent' {
  if (totalScore >= 80) return 'excellent';
  if (totalScore >= 60) return 'good';
  if (totalScore >= 40) return 'fair';
  return 'poor';
}

/**
 * Calculate the overall SMART score for a goal
 */
export function calculateSmartScore(
  goal: SmartGoal,
  _config: ScoreConfig = {}
): SmartScoreResult {
  // Calculate individual scores
  const specific = calculateSpecificScore(goal);
  const measurable = calculateMeasurableScore(goal);
  const achievable = calculateAchievableScore(goal);
  const relevant = calculateRelevantScore(goal);
  const timeBound = calculateTimeBoundScore(goal);

  // Calculate total score (each component is already scored out of 20)
  const total = Math.round(
    specific + measurable + achievable + relevant + timeBound
  );

  const breakdown: SmartScoreBreakdown = {
    specific,
    measurable,
    achievable,
    relevant,
    timeBound,
    total,
  };

  const suggestions = generateSuggestions(goal, breakdown);
  const category = getScoreCategory(total);

  return {
    breakdown,
    suggestions,
    category,
  };
}

/**
 * Get badge variant based on score
 */
export function getBadgeVariant(
  score: number
): 'destructive' | 'secondary' | 'default' | 'outline' {
  if (score >= 80) return 'default'; // Green for excellent
  if (score >= 60) return 'outline'; // Yellow for good
  if (score >= 40) return 'secondary'; // Orange for fair
  return 'destructive'; // Red for poor
}

/**
 * Get color classes for custom styling based on score
 */
export function getScoreColorClasses(score: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (score >= 80) {
    return {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
    };
  }
  if (score >= 60) {
    return {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
    };
  }
  if (score >= 40) {
    return {
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
    };
  }
  return {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
  };
}
