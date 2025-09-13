/**
 * SmartScoreBadge Component
 *
 * Displays a visual badge showing the SMART score of a goal with optional tooltip breakdown.
 * Provides color-coded feedback based on score ranges and includes improvement suggestions.
 */

'use client';

import React, { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import {
  SmartScoreBadgeProps,
  BadgeSize,
  SmartScoreResult,
} from './SmartScoreBadge.types';
import { calculateSmartScore, getBadgeVariant } from './SmartScoreBadge.utils';

/**
 * Size configuration for different badge variants
 */
const sizeConfig: Record<
  BadgeSize,
  { badge: string; text: string; icon: string }
> = {
  sm: {
    badge: 'px-2 py-1 text-xs',
    text: 'text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    badge: 'px-3 py-1.5 text-sm',
    text: 'text-sm',
    icon: 'h-4 w-4',
  },
  lg: {
    badge: 'px-4 py-2 text-base',
    text: 'text-base',
    icon: 'h-5 w-5',
  },
};

/**
 * Renders the tooltip content with score breakdown
 */
const TooltipContentComponent: React.FC<{
  result: SmartScoreResult;
  size: BadgeSize;
}> = ({ result, size }) => {
  const textClass = sizeConfig[size].text;

  return (
    <div className="max-w-sm space-y-3">
      {/* Header */}
      <div className="space-y-1">
        <h4 className={cn('font-semibold', textClass)}>
          SMART Score: {result.breakdown.total}/100
        </h4>
        <p
          className={cn(
            'text-muted-foreground',
            textClass === 'text-xs' ? 'text-xs' : 'text-sm'
          )}
        >
          {result.category === 'excellent' && 'Excellent goal definition!'}
          {result.category === 'good' && 'Good goal, with room for improvement'}
          {result.category === 'fair' && 'Fair goal, needs refinement'}
          {result.category === 'poor' && 'Goal needs significant improvement'}
        </p>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-2">
        <h5
          className={cn(
            'font-medium',
            textClass === 'text-xs' ? 'text-xs' : 'text-sm'
          )}
        >
          Breakdown:
        </h5>
        <div className="space-y-1.5">
          {[
            { label: 'Specific', score: result.breakdown.specific, key: 'S' },
            {
              label: 'Measurable',
              score: result.breakdown.measurable,
              key: 'M',
            },
            {
              label: 'Achievable',
              score: result.breakdown.achievable,
              key: 'A',
            },
            { label: 'Relevant', score: result.breakdown.relevant, key: 'R' },
            {
              label: 'Time-bound',
              score: result.breakdown.timeBound,
              key: 'T',
            },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold',
                    item.score >= 16
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : item.score >= 12
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                        : item.score >= 8
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  )}
                >
                  {item.key}
                </span>
                <span
                  className={cn(
                    textClass === 'text-xs' ? 'text-xs' : 'text-sm'
                  )}
                >
                  {item.label}
                </span>
              </div>
              <div className="flex min-w-[60px] items-center gap-2">
                <Progress
                  value={(item.score / 20) * 100}
                  className="h-1.5 w-8"
                />
                <span
                  className={cn(
                    'font-medium tabular-nums',
                    textClass === 'text-xs' ? 'text-xs' : 'text-sm'
                  )}
                >
                  {item.score}/20
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="space-y-2">
          <h5
            className={cn(
              'font-medium',
              textClass === 'text-xs' ? 'text-xs' : 'text-sm'
            )}
          >
            Suggestions:
          </h5>
          <ul className="space-y-1">
            {result.suggestions.slice(0, 3).map((suggestion, index) => (
              <li
                key={index}
                className={cn(
                  'text-muted-foreground',
                  textClass === 'text-xs' ? 'text-xs' : 'text-sm',
                  'flex items-start gap-1'
                )}
              >
                <span className="text-muted-foreground">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
            {result.suggestions.length > 3 && (
              <li
                className={cn(
                  'text-muted-foreground font-medium',
                  textClass === 'text-xs' ? 'text-xs' : 'text-sm'
                )}
              >
                +{result.suggestions.length - 3} more suggestions
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * SmartScoreBadge Component
 */
export const SmartScoreBadge: React.FC<SmartScoreBadgeProps> = ({
  goal,
  size = 'md',
  showTooltip = true,
  className,
  onScoreCalculated,
}) => {
  // Calculate score
  const result = useMemo(() => {
    const calculatedResult = calculateSmartScore(goal);
    onScoreCalculated?.(calculatedResult);
    return calculatedResult;
  }, [goal, onScoreCalculated]);

  const score = result.breakdown.total;
  const variant = getBadgeVariant(score);
  const config = sizeConfig[size];

  const badgeContent = (
    <Badge
      variant={variant}
      className={cn(
        'inline-flex cursor-default items-center gap-1.5 border font-semibold tabular-nums',
        config.badge,
        // Custom color styling for better visual feedback
        score >= 80 &&
          'border-green-200 bg-green-100 text-green-800 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300',
        score >= 60 &&
          score < 80 &&
          'border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        score >= 40 &&
          score < 60 &&
          'border-orange-200 bg-orange-100 text-orange-800 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
        score < 40 &&
          'border-red-200 bg-red-100 text-red-800 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300',
        className
      )}
    >
      {/* Score Icon */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold',
          config.icon,
          'text-current'
        )}
      >
        {score >= 80 ? '★' : score >= 60 ? '◆' : score >= 40 ? '▲' : '●'}
      </div>

      {/* Score Text */}
      <span className="leading-none">
        {score}
        {size !== 'sm' && '/100'}
      </span>

      {/* Category indicator for larger sizes */}
      {size === 'lg' && (
        <span className="ml-1 text-xs tracking-wider uppercase opacity-75">
          {result.category}
        </span>
      )}
    </Badge>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{badgeContent}</div>
        </TooltipTrigger>
        <TooltipContent side="top" className="z-50">
          <TooltipContentComponent result={result} size={size} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SmartScoreBadge;
