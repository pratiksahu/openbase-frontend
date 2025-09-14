/**
 * MetricTypeSelector Component
 *
 * A component for selecting and configuring different metric types with
 * visual indicators, descriptions, and examples.
 */

'use client';

import {
  Hash,
  Percent,
  DollarSign,
  Clock,
  CheckSquare,
  Star,
  Target,
  Divide,
  Plus,
  TrendingUp,
  Info,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { ExtendedMetricType, MetricTypeSelectorProps } from './MetricEditor.types';
import { METRIC_TYPE_CONFIGS } from './MetricEditor.utils';

// Icon mapping for metric types
const ICON_MAP = {
  Hash,
  Percent,
  DollarSign,
  Clock,
  CheckSquare,
  Star,
  Target,
  Divide,
  Plus,
  TrendingUp,
} as const;

/**
 * MetricTypeSelector Component
 *
 * Provides a dropdown selector for different metric types with rich information
 * about each type including examples and default configurations.
 */
export function MetricTypeSelector({
  value,
  onChange,
  disabled = false,
  className,
}: MetricTypeSelectorProps): React.JSX.Element {
  const selectedConfig = METRIC_TYPE_CONFIGS[value];
  const IconComponent = ICON_MAP[selectedConfig?.icon as keyof typeof ICON_MAP];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Type Selector */}
      <div className="space-y-2">
        <label htmlFor="metric-type" className="text-sm font-medium text-foreground">
          Metric Type
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="inline-block w-4 h-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose the type of measurement that best fits your metric</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </label>

        <Select
          value={value}
          onValueChange={(newValue) => onChange(newValue as ExtendedMetricType)}
          disabled={disabled}
        >
          <SelectTrigger id="metric-type" className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                {IconComponent && <IconComponent className="w-4 h-4" />}
                <span>{selectedConfig?.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>

          <SelectContent className="max-h-80 overflow-y-auto">
            {Object.entries(METRIC_TYPE_CONFIGS).map(([type, config]) => {
              const Icon = ICON_MAP[config.icon as keyof typeof ICON_MAP];
              return (
                <SelectItem key={type} value={type} className="py-3">
                  <div className="flex items-start gap-3">
                    {Icon && <Icon className="w-4 h-4 mt-0.5 text-muted-foreground" />}
                    <div className="space-y-1">
                      <div className="font-medium">{config.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {config.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Type Information */}
      {selectedConfig && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComponent && <IconComponent className="w-5 h-5" />}
              {selectedConfig.label}
              <Badge variant="outline" className="ml-auto">
                {selectedConfig.defaultDirection}
              </Badge>
            </CardTitle>
            <CardDescription>
              {selectedConfig.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Default Configuration */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Default Unit:</span>
                <div className="mt-1">
                  <Badge variant="secondary">{selectedConfig.defaultUnit || 'None'}</Badge>
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Allows Decimals:</span>
                <div className="mt-1">
                  <Badge variant={selectedConfig.allowDecimals ? 'default' : 'outline'}>
                    {selectedConfig.allowDecimals ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div>
              <span className="font-medium text-muted-foreground text-sm">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedConfig.examples.map((example, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {example}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Validation Pattern */}
            {selectedConfig.validationPattern && (
              <div>
                <span className="font-medium text-muted-foreground text-sm">Validation:</span>
                <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                  {selectedConfig.validationPattern.source}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * MetricTypeGrid Component
 *
 * Alternative grid layout for selecting metric types with larger cards
 */
export function MetricTypeGrid({
  value,
  onChange,
  disabled = false,
  className,
}: MetricTypeSelectorProps): React.JSX.Element {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <label className="text-sm font-medium text-foreground">
          Choose Metric Type
        </label>
        <p className="text-sm text-muted-foreground mt-1">
          Select the type of measurement that best represents your goal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(METRIC_TYPE_CONFIGS).map(([type, config]) => {
          const Icon = ICON_MAP[config.icon as keyof typeof ICON_MAP];
          const isSelected = value === type;

          return (
            <Card
              key={type}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-2 ring-primary shadow-md',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !disabled && onChange(type as ExtendedMetricType)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {Icon && <Icon className="w-4 h-4" />}
                  {config.label}
                  {isSelected && (
                    <Badge variant="default" className="ml-auto text-xs">
                      Selected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {config.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Unit:</span>
                  <Badge variant="outline" className="text-xs">
                    {config.defaultUnit || 'None'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {config.examples.slice(0, 2).map((example, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/**
 * MetricTypeCompact Component
 *
 * Compact version for use in forms or tight spaces
 */
export function MetricTypeCompact({
  value,
  onChange,
  disabled = false,
  className,
}: MetricTypeSelectorProps): React.JSX.Element {
  const selectedConfig = METRIC_TYPE_CONFIGS[value];
  const IconComponent = ICON_MAP[selectedConfig?.icon as keyof typeof ICON_MAP];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select
        value={value}
        onValueChange={(newValue) => onChange(newValue as ExtendedMetricType)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              {IconComponent && <IconComponent className="w-3 h-3" />}
              <span className="text-sm">{selectedConfig?.label}</span>
            </div>
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {Object.entries(METRIC_TYPE_CONFIGS).map(([type, config]) => {
            const Icon = ICON_MAP[config.icon as keyof typeof ICON_MAP];
            return (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-3 h-3" />}
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {selectedConfig && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-sm">
              <div className="space-y-2">
                <div className="font-medium">{selectedConfig.label}</div>
                <div className="text-xs">{selectedConfig.description}</div>
                <div className="text-xs">
                  <strong>Unit:</strong> {selectedConfig.defaultUnit || 'None'}
                </div>
                <div className="text-xs">
                  <strong>Examples:</strong> {selectedConfig.examples.join(', ')}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export default MetricTypeSelector;