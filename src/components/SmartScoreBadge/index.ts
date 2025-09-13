/**
 * SmartScoreBadge component exports
 */

export { SmartScoreBadge as default, SmartScoreBadge } from './SmartScoreBadge';
export type {
  SmartScoreBadgeProps,
  BadgeSize,
  SmartScoreBreakdown,
  SmartScoreResult,
  ScoreConfig,
} from './SmartScoreBadge.types';
export {
  calculateSmartScore,
  getBadgeVariant,
  getScoreColorClasses,
} from './SmartScoreBadge.utils';
