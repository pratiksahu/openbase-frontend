/**
 * MeasurableStep Component
 *
 * This component provides the third step of the GoalWizard where users define
 * quantifiable metrics using the integrated MetricEditor component to ensure
 * their goals are measurable and trackable.
 */

'use client';

import {
  Plus,
  BarChart3,
  Target,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  HelpCircle,
} from 'lucide-react';
import React, { useState } from 'react';

import { MetricEditor } from '@/components/MetricEditor/MetricEditor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MeasurableSpec, MetricCheckpoint } from '@/types/smart-goals.types';

import { MeasurableStepProps, MeasurableStepData } from '../GoalWizard.types';

// =============================================================================
// Measurement Template Data
// =============================================================================

const MEASUREMENT_TEMPLATES = {
  kpi: {
    name: 'Key Performance Indicators (KPIs)',
    description: 'Traditional business metrics focused on specific outcomes',
    icon: BarChart3,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/30',
    examples: [
      'Revenue Growth Rate',
      'Customer Acquisition Cost',
      'Customer Satisfaction Score',
      'Website Conversion Rate',
    ],
    successDefinitions: [
      'Achieve target value',
      'Maintain consistency over time',
      'Show positive trend',
    ],
  },
  okr: {
    name: 'Objectives & Key Results (OKRs)',
    description: 'Ambitious objectives with specific, time-bound key results',
    icon: Target,
    color:
      'bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950/30',
    examples: [
      'Improve product quality',
      'Increase user engagement',
      'Enhance team productivity',
      'Expand market presence',
    ],
    successDefinitions: [
      'All key results achieved',
      'Significant progress on objective',
      'Measurable impact delivered',
    ],
  },
  balanced_scorecard: {
    name: 'Balanced Scorecard',
    description:
      'Multi-perspective measurement covering financial, customer, process, and learning',
    icon: TrendingUp,
    color:
      'bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/30',
    examples: [
      'Financial Performance',
      'Customer Perspective',
      'Internal Process',
      'Learning & Growth',
    ],
    successDefinitions: [
      'Balanced performance across perspectives',
      'Strategic alignment achieved',
      'Continuous improvement demonstrated',
    ],
  },
};

// =============================================================================
// Common Success Definitions
// =============================================================================

const COMMON_SUCCESS_DEFINITIONS = [
  'Target value reached within timeframe',
  'Consistent improvement over measurement period',
  'Baseline established and maintained',
  'Quality standards met alongside quantity metrics',
  'Stakeholder satisfaction criteria achieved',
  'ROI targets exceeded',
  'Risk thresholds not breached',
  'Compliance requirements satisfied',
];

// =============================================================================
// Template Card Component
// =============================================================================

interface TemplateCardProps {
  templateKey: keyof typeof MEASUREMENT_TEMPLATES;
  template: (typeof MEASUREMENT_TEMPLATES)[keyof typeof MEASUREMENT_TEMPLATES];
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  templateKey: _templateKey,
  template,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  const IconComponent = template.icon;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        template.color,
        isSelected && 'ring-primary shadow-md ring-2',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onClick={() => !disabled && onSelect()}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-white/50 p-2 dark:bg-black/20">
            <IconComponent className="text-primary h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">{template.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="mb-3 text-sm">
          {template.description}
        </CardDescription>
        <div className="space-y-1">
          <div className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Examples:
          </div>
          {template.examples.slice(0, 2).map((example, index) => (
            <div key={index} className="text-muted-foreground text-xs">
              • {example}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// Success Definition List Component
// =============================================================================

interface SuccessDefinitionListProps {
  definitions: string[];
  onChange: (definitions: string[]) => void;
  disabled?: boolean;
}

const SuccessDefinitionList: React.FC<SuccessDefinitionListProps> = ({
  definitions,
  onChange,
  disabled = false,
}) => {
  const [customDefinition, setCustomDefinition] = useState('');

  const addDefinition = (definition: string) => {
    if (definition.trim() && !definitions.includes(definition.trim())) {
      onChange([...definitions, definition.trim()]);
    }
  };

  const removeDefinition = (index: number) => {
    onChange(definitions.filter((_, i) => i !== index));
  };

  const addCustomDefinition = () => {
    if (customDefinition.trim()) {
      addDefinition(customDefinition);
      setCustomDefinition('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Definitions */}
      {definitions.length > 0 && (
        <div className="space-y-2">
          {definitions.map((definition, index) => (
            <div
              key={index}
              className="bg-secondary flex items-center justify-between rounded-md p-3"
            >
              <span className="text-sm">{definition}</span>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-destructive/20 h-auto p-1"
                  onClick={() => removeDefinition(index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Common Definitions */}
      {!disabled && (
        <div className="space-y-3">
          <div className="text-sm font-medium">
            Add common success definitions:
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMON_SUCCESS_DEFINITIONS.filter(
              def => !definitions.includes(def)
            )
              .slice(0, 4)
              .map((definition, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-auto px-2 py-1 text-xs"
                  onClick={() => addDefinition(definition)}
                >
                  + {definition}
                </Button>
              ))}
          </div>

          {/* Custom Definition */}
          <div className="flex space-x-2">
            <Textarea
              value={customDefinition}
              onChange={e => setCustomDefinition(e.target.value)}
              placeholder="Add a custom success definition..."
              rows={2}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addCustomDefinition}
              disabled={!customDefinition.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Metric Summary Component
// =============================================================================

interface MetricSummaryProps {
  metric: MeasurableSpec;
}

const MetricSummary: React.FC<MetricSummaryProps> = ({ metric }) => {
  const progressPercentage = Math.round(
    ((metric.currentValue - (metric.minimumValue || 0)) /
      (metric.targetValue - (metric.minimumValue || 0))) *
      100
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Primary Metric</CardTitle>
          <Badge variant="outline">{metric.metricType}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current:</span>
              <div className="font-medium">
                {metric.currentValue} {metric.unit}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Target:</span>
              <div className="font-medium">
                {metric.targetValue} {metric.unit}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Direction:</span>
              <div className="font-medium">
                {metric.higherIsBetter ? 'Increase' : 'Decrease'}
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="bg-secondary h-2 w-full rounded-full">
              <div
                className={cn(
                  'h-2 rounded-full transition-all',
                  progressPercentage >= 100
                    ? 'bg-green-500'
                    : progressPercentage >= 50
                      ? 'bg-blue-500'
                      : 'bg-orange-500'
                )}
                style={{
                  width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// Main MeasurableStep Component
// =============================================================================

export const MeasurableStep: React.FC<MeasurableStepProps> = ({
  data,
  onChange,
  errors,
  readOnly = false,
  className,
  warnings,
  suggestions,
  goalId,
}) => {
  const [showMetricEditor, setShowMetricEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    keyof typeof MEASUREMENT_TEMPLATES | null
  >(data.measurementTemplate || null);

  const handleChange = (field: keyof MeasurableStepData, value: any) => {
    onChange({ [field]: value });
  };

  const handleTemplateSelect = (
    template: keyof typeof MEASUREMENT_TEMPLATES
  ) => {
    setSelectedTemplate(template);
    handleChange('measurementTemplate', template);

    // Auto-populate success definitions based on template
    const templateData = MEASUREMENT_TEMPLATES[template];
    if (!data.successDefinitions?.length) {
      handleChange('successDefinitions', templateData.successDefinitions);
    }
  };

  const handleMetricSave = (
    metric: MeasurableSpec,
    _checkpoints: MetricCheckpoint[]
  ) => {
    handleChange('measurable', metric);
    setShowMetricEditor(false);
  };

  // const _handleAddAdditionalMetric = (metric: MeasurableSpec) => {
  //   const currentAdditional = data.additionalMetrics || [];
  //   handleChange('additionalMetrics', [...currentAdditional, metric]);
  // };

  return (
    <TooltipProvider>
      <div className={cn('space-y-8', className)}>
        {/* Step Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Make it Measurable
          </h2>
          <p className="text-muted-foreground">
            Define clear, quantifiable metrics to track progress and success.
          </p>
        </div>

        {/* Measurement Template Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Choose a Measurement Framework (Optional)
            </Label>
            <p className="text-muted-foreground text-sm">
              Select a framework to guide your measurement approach.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(
              Object.entries(MEASUREMENT_TEMPLATES) as [
                keyof typeof MEASUREMENT_TEMPLATES,
                (typeof MEASUREMENT_TEMPLATES)[keyof typeof MEASUREMENT_TEMPLATES],
              ][]
            ).map(([key, template]) => (
              <TemplateCard
                key={key}
                templateKey={key}
                template={template}
                isSelected={selectedTemplate === key}
                onSelect={() => !readOnly && handleTemplateSelect(key)}
                disabled={readOnly}
              />
            ))}
          </div>

          {selectedTemplate && (
            <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center space-x-2 text-sm">
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  Framework Selected
                </Badge>
                <span className="font-medium">
                  {MEASUREMENT_TEMPLATES[selectedTemplate].name}
                </span>
              </div>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(null);
                    handleChange('measurementTemplate', undefined);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Primary Metric */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Primary Metric *
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-1 h-auto p-0">
                    <HelpCircle className="text-muted-foreground h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    The main metric that will determine success for this goal.
                    This should be specific, quantifiable, and directly related
                    to your objective.
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <p className="text-muted-foreground text-sm">
              Define the main metric that will measure success for this goal.
            </p>
          </div>

          {data.measurable ? (
            <div className="space-y-4">
              <MetricSummary metric={data.measurable} />
              {!readOnly && (
                <div className="flex space-x-2">
                  <Dialog
                    open={showMetricEditor}
                    onOpenChange={setShowMetricEditor}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit Metric</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Primary Metric</DialogTitle>
                      </DialogHeader>
                      <MetricEditor
                        initialMetric={data.measurable}
                        onSave={handleMetricSave}
                        onCancel={() => setShowMetricEditor(false)}
                        goalId={goalId}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChange('measurable', undefined)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {!readOnly && (
                <Dialog
                  open={showMetricEditor}
                  onOpenChange={setShowMetricEditor}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Primary Metric
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Primary Metric</DialogTitle>
                    </DialogHeader>
                    <MetricEditor
                      onSave={handleMetricSave}
                      onCancel={() => setShowMetricEditor(false)}
                      goalId={goalId}
                    />
                  </DialogContent>
                </Dialog>
              )}

              {errors.measurable && (
                <div className="text-destructive text-sm">
                  {errors.measurable[0]}
                </div>
              )}

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <div className="mb-1 font-medium">
                      Tips for good metrics:
                    </div>
                    <ul className="list-inside list-disc space-y-1 text-xs">
                      <li>Be specific and unambiguous</li>
                      <li>Include clear target values</li>
                      <li>Define the measurement frequency</li>
                      <li>Ensure data is accessible and reliable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Definitions */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Success Definitions *
            </Label>
            <p className="text-muted-foreground text-sm">
              Define what success looks like beyond just hitting the target
              number.
            </p>
          </div>

          <SuccessDefinitionList
            definitions={data.successDefinitions}
            onChange={definitions =>
              handleChange('successDefinitions', definitions)
            }
            disabled={readOnly}
          />

          {errors.successDefinitions && (
            <div className="text-destructive text-sm">
              {errors.successDefinitions[0]}
            </div>
          )}
        </div>

        {/* Additional Metrics (Optional) */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Additional Metrics (Optional)
              {data.additionalMetrics && data.additionalMetrics.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {data.additionalMetrics.length}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="text-muted-foreground text-sm">
                Add supporting metrics that provide additional context or
                validation for your primary goal.
              </div>

              {data.additionalMetrics && data.additionalMetrics.length > 0 && (
                <div className="space-y-3">
                  {data.additionalMetrics.map((metric, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {metric.metricType}: {metric.currentValue} →{' '}
                              {metric.targetValue} {metric.unit}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {metric.higherIsBetter ? 'Increase' : 'Decrease'}{' '}
                              • {metric.measurementFrequency}
                            </div>
                          </div>
                          {!readOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newMetrics =
                                  data.additionalMetrics?.filter(
                                    (_, i) => i !== index
                                  ) || [];
                                handleChange('additionalMetrics', newMetrics);
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!readOnly && (
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supporting Metric
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Warnings and Suggestions */}
        {(warnings?.length || suggestions?.length) && (
          <div className="space-y-4">
            {warnings && warnings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  Suggestions for improvement:
                </div>
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 text-sm text-amber-700 dark:text-amber-300"
                  >
                    <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-amber-500" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {suggestions && suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <Lightbulb className="h-4 w-4" />
                  Additional suggestions:
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 text-sm text-blue-700 dark:text-blue-300"
                  >
                    <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-blue-500" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default MeasurableStep;
