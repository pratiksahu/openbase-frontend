/**
 * MetricEditor Component
 *
 * Main component for creating and editing measurable specifications with
 * comprehensive form validation, type-specific configuration, and real-time preview.
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Save,
  X,
  AlertCircle,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MeasurableSpec, MetricCheckpoint, Frequency } from '@/types/smart-goals.types';

import { CheckpointTracker } from './CheckpointTracker';
import { MetricChart } from './MetricChart';
import {
  ExtendedMetricType,
  MetricDirection,
  MetricEditorProps,
  ChartType,
} from './MetricEditor.types';
import {
  METRIC_TYPE_CONFIGS,
  formatMetricValue,
  analyzeProgress,
  getStatusColor,
} from './MetricEditor.utils';
import { MetricTypeSelector } from './MetricTypeSelector';


// Zod schema for form validation
const metricFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  metricType: z.nativeEnum(ExtendedMetricType),
  baselineValue: z.number().optional(),
  targetValue: z.number(),
  currentValue: z.number(),
  unit: z.string().min(1, 'Unit is required'),
  direction: z.nativeEnum(MetricDirection),
  minimumValue: z.number().optional(),
  maximumValue: z.number().optional(),
  measurementFrequency: z.nativeEnum(Frequency),
  description: z.string().optional(),
  dataSource: z.string().optional(),
  calculationMethod: z.string().optional(),
});

type FormData = z.infer<typeof metricFormSchema>;

/**
 * MetricEditor Component
 *
 * Comprehensive metric editor with form validation, progress analysis, and visualization
 */
export function MetricEditor({
  initialMetric,
  initialCheckpoints = [],
  onSave,
  onCancel,
  readOnly = false,
  goalId,
  className,
}: MetricEditorProps): React.JSX.Element {
  // Form state
  const [checkpoints, setCheckpoints] = useState<MetricCheckpoint[]>(initialCheckpoints);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'checkpoints' | 'analysis'>('config');

  // Initialize form with default values
  const defaultValues: Partial<FormData> = {
    name: initialMetric?.metricType ? METRIC_TYPE_CONFIGS[initialMetric.metricType as unknown as ExtendedMetricType]?.label : '',
    metricType: (initialMetric?.metricType as unknown as ExtendedMetricType) || ExtendedMetricType.NUMBER,
    baselineValue: initialMetric?.minimumValue,
    targetValue: initialMetric?.targetValue || 100,
    currentValue: initialMetric?.currentValue || 0,
    unit: initialMetric?.unit || '',
    direction: initialMetric?.higherIsBetter ? MetricDirection.INCREASE : MetricDirection.DECREASE,
    minimumValue: initialMetric?.minimumValue,
    maximumValue: initialMetric?.maximumValue,
    measurementFrequency: (initialMetric?.measurementFrequency as Frequency) || Frequency.WEEKLY,
    description: initialMetric?.calculationMethod || '',
    dataSource: initialMetric?.dataSource || '',
    calculationMethod: initialMetric?.calculationMethod || '',
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(metricFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Watch form values for real-time updates
  const watchedValues = watch();
  const { metricType, direction, targetValue, currentValue, baselineValue, unit } = watchedValues;

  // Auto-update unit when metric type changes
  useEffect(() => {
    if (metricType) {
      const config = METRIC_TYPE_CONFIGS[metricType];
      if (config.defaultUnit && (!unit || unit === '')) {
        setValue('unit', config.defaultUnit, { shouldValidate: true });
      }
      setValue('direction', config.defaultDirection, { shouldValidate: true });
    }
  }, [metricType, setValue, unit]);

  // Convert form data to MeasurableSpec
  const buildMeasurableSpec = (data: FormData): MeasurableSpec => {
    return {
      metricType: data.metricType as any,
      targetValue: data.targetValue,
      currentValue: data.currentValue,
      unit: data.unit,
      minimumValue: data.minimumValue,
      maximumValue: data.maximumValue,
      higherIsBetter: data.direction === MetricDirection.INCREASE,
      calculationMethod: data.calculationMethod,
      dataSource: data.dataSource,
      measurementFrequency: data.measurementFrequency as any,
    };
  };

  // Progress analysis
  const progressAnalysis = useMemo(() => {
    if (typeof currentValue !== 'number' || typeof targetValue !== 'number') {
      return null;
    }

    const spec = buildMeasurableSpec(getValues());
    return analyzeProgress(spec, checkpoints);
  }, [currentValue, targetValue, baselineValue, direction, checkpoints, getValues]);

  // Handle form submission
  const onSubmit = (data: FormData) => {
    if (readOnly) return;

    const measurableSpec = buildMeasurableSpec(data);
    onSave(measurableSpec, checkpoints);
  };

  // Handle type-specific value formatting
  const formatDisplayValue = (value: number) => {
    return formatMetricValue(value, metricType, unit);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Metric Editor</h2>
            <p className="text-muted-foreground">
              Define a measurable specification for your goal
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={readOnly}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || !isDirty || readOnly}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Metric
            </Button>
          </div>
        </div>

        {/* Progress Preview */}
        {progressAnalysis && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Progress Preview</CardTitle>
                  <CardDescription>Real-time analysis based on current values</CardDescription>
                </div>
                <Badge className={getStatusColor(progressAnalysis.status)}>
                  {progressAnalysis.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={progressAnalysis.progressPercentage} className="h-3" />
                  </div>
                  <div className="text-sm font-medium">
                    {progressAnalysis.progressPercentage.toFixed(1)}%
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current:</span>
                    <div className="font-medium">{formatDisplayValue(currentValue)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target:</span>
                    <div className="font-medium">{formatDisplayValue(targetValue)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trend:</span>
                    <div className="flex items-center gap-1 font-medium">
                      {progressAnalysis.trend === 'increasing' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {progressAnalysis.trend === 'decreasing' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {progressAnalysis.trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
                      {progressAnalysis.trend}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab as any} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="checkpoints">Checkpoints ({checkpoints.length})</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            {/* Basic Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Basic Configuration
                </CardTitle>
                <CardDescription>
                  Define the fundamental properties of your metric
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metric Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Metric Name *
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="inline-block w-4 h-4 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>A clear, descriptive name for your metric</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="name"
                        placeholder="e.g., Customer Satisfaction Score"
                        disabled={readOnly}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Metric Type Selector */}
                <div className="space-y-2">
                  <Controller
                    name="metricType"
                    control={control}
                    render={({ field }) => (
                      <MetricTypeSelector
                        value={field.value}
                        onChange={field.onChange}
                        disabled={readOnly}
                      />
                    )}
                  />
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Current Value */}
                  <div className="space-y-2">
                    <Label htmlFor="currentValue">
                      Current Value *
                    </Label>
                    <Controller
                      name="currentValue"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="currentValue"
                          type="number"
                          step={METRIC_TYPE_CONFIGS[metricType]?.allowDecimals ? '0.01' : '1'}
                          disabled={readOnly}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                    {errors.currentValue && (
                      <p className="text-sm text-red-500">{errors.currentValue.message}</p>
                    )}
                  </div>

                  {/* Target Value */}
                  <div className="space-y-2">
                    <Label htmlFor="targetValue">
                      Target Value *
                    </Label>
                    <Controller
                      name="targetValue"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="targetValue"
                          type="number"
                          step={METRIC_TYPE_CONFIGS[metricType]?.allowDecimals ? '0.01' : '1'}
                          disabled={readOnly}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                    {errors.targetValue && (
                      <p className="text-sm text-red-500">{errors.targetValue.message}</p>
                    )}
                  </div>

                  {/* Unit */}
                  <div className="space-y-2">
                    <Label htmlFor="unit">
                      Unit *
                    </Label>
                    <Controller
                      name="unit"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="unit"
                          placeholder="e.g., %, $, hours"
                          disabled={readOnly}
                        />
                      )}
                    />
                    {errors.unit && (
                      <p className="text-sm text-red-500">{errors.unit.message}</p>
                    )}
                  </div>
                </div>

                {/* Direction and Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Direction */}
                  <div className="space-y-2">
                    <Label htmlFor="direction">Direction</Label>
                    <Controller
                      name="direction"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} disabled={readOnly}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={MetricDirection.INCREASE}>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Increase (Higher is Better)
                              </div>
                            </SelectItem>
                            <SelectItem value={MetricDirection.DECREASE}>
                              <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4" />
                                Decrease (Lower is Better)
                              </div>
                            </SelectItem>
                            <SelectItem value={MetricDirection.MAINTAIN}>
                              <div className="flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Maintain (Target Specific Value)
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Measurement Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor="measurementFrequency">Measurement Frequency</Label>
                    <Controller
                      name="measurementFrequency"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} disabled={readOnly}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(Frequency).map((freq) => (
                              <SelectItem key={freq} value={freq}>
                                {freq.charAt(0).toUpperCase() + freq.slice(1).replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Advanced Configuration</CardTitle>
                    <CardDescription>
                      Optional settings for more precise control
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced
                  </Button>
                </div>
              </CardHeader>
              {showAdvanced && (
                <CardContent className="space-y-4">
                  {/* Baseline and Range */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="baselineValue">Baseline Value</Label>
                      <Controller
                        name="baselineValue"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="baselineValue"
                            type="number"
                            step={METRIC_TYPE_CONFIGS[metricType]?.allowDecimals ? '0.01' : '1'}
                            disabled={readOnly}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimumValue">Minimum Value</Label>
                      <Controller
                        name="minimumValue"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="minimumValue"
                            type="number"
                            step={METRIC_TYPE_CONFIGS[metricType]?.allowDecimals ? '0.01' : '1'}
                            disabled={readOnly}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maximumValue">Maximum Value</Label>
                      <Controller
                        name="maximumValue"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="maximumValue"
                            type="number"
                            step={METRIC_TYPE_CONFIGS[metricType]?.allowDecimals ? '0.01' : '1'}
                            disabled={readOnly}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="Describe what this metric measures and why it's important..."
                          disabled={readOnly}
                          rows={3}
                          value={field.value || ''}
                        />
                      )}
                    />
                  </div>

                  {/* Data Source */}
                  <div className="space-y-2">
                    <Label htmlFor="dataSource">Data Source</Label>
                    <Controller
                      name="dataSource"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="dataSource"
                          placeholder="e.g., Google Analytics, Sales Database, Survey Results"
                          disabled={readOnly}
                          value={field.value || ''}
                        />
                      )}
                    />
                  </div>

                  {/* Calculation Method */}
                  <div className="space-y-2">
                    <Label htmlFor="calculationMethod">Calculation Method</Label>
                    <Controller
                      name="calculationMethod"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="calculationMethod"
                          placeholder="Describe how this metric is calculated..."
                          disabled={readOnly}
                          rows={2}
                          value={field.value || ''}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Checkpoints Tab */}
          <TabsContent value="checkpoints" className="space-y-6">
            <CheckpointTracker
              checkpoints={checkpoints}
              metric={buildMeasurableSpec(getValues())}
              onChange={setCheckpoints}
              readOnly={readOnly}
            />
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {checkpoints.length > 0 ? (
              <MetricChart
                checkpoints={checkpoints}
                metric={buildMeasurableSpec(getValues())}
                chartType={ChartType.LINE}
                onChartTypeChange={() => {}}
                showTarget={true}
                showBaseline={true}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center space-y-2">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium">No Data to Analyze</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Add some checkpoints in the Checkpoints tab to see progress analysis and charts.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}

export default MetricEditor;