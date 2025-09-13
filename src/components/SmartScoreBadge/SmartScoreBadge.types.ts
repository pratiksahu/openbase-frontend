/**
 * Type definitions for SmartScoreBadge component
 */

import { SmartGoal } from '@/types/smart-goals.types';

/** Size variants for the badge */
export type BadgeSize = 'sm' | 'md' | 'lg';

/** Score breakdown for individual SMART criteria */
export interface SmartScoreBreakdown {
  /** Specific criteria score (0-20) */
  specific: number;
  /** Measurable criteria score (0-20) */
  measurable: number;
  /** Achievable criteria score (0-20) */
  achievable: number;
  /** Relevant criteria score (0-20) */
  relevant: number;
  /** Time-bound criteria score (0-20) */
  timeBound: number;
  /** Total SMART score (0-100) */
  total: number;
}

/** Score calculation result */
export interface SmartScoreResult {
  /** Individual criteria breakdown */
  breakdown: SmartScoreBreakdown;
  /** Improvement suggestions based on missing criteria */
  suggestions: string[];
  /** Overall score category */
  category: 'poor' | 'fair' | 'good' | 'excellent';
}

/** Props for SmartScoreBadge component */
export interface SmartScoreBadgeProps {
  /** SMART goal to calculate score for */
  goal: SmartGoal;
  /** Size variant of the badge */
  size?: BadgeSize;
  /** Whether to show the tooltip with breakdown */
  showTooltip?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Callback when score is calculated */
  onScoreCalculated?: (result: SmartScoreResult) => void;
}

/** Configuration for score calculation */
export interface ScoreConfig {
  /** Weight for specific criteria (default: 20) */
  specificWeight?: number;
  /** Weight for measurable criteria (default: 20) */
  measurableWeight?: number;
  /** Weight for achievable criteria (default: 20) */
  achievableWeight?: number;
  /** Weight for relevant criteria (default: 20) */
  relevantWeight?: number;
  /** Weight for time-bound criteria (default: 20) */
  timeBoundWeight?: number;
}
