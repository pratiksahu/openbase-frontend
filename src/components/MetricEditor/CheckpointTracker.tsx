/**
 * CheckpointTracker Component
 *
 * Component for managing metric checkpoints with add, edit, delete functionality
 * and comprehensive data validation and evidence attachment.
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO, isValid } from 'date-fns';
import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Clock,
  User,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MetricCheckpoint } from '@/types/smart-goals.types';

import {
  CheckpointTrackerProps,
  ConfidenceLevel,
  ExtendedMetricType,
} from './MetricEditor.types';
import {
  formatMetricValue,
  formatCheckpointDate,
  formatConfidenceLevel,
  calculateProgressPercentage,
  MetricDirection,
} from './MetricEditor.utils';


// Zod schema for checkpoint validation
const checkpointSchema = z.object({
  value: z.number(),
  recordedDate: z.date(),
  note: z.string().optional(),
  evidence: z.string().optional(),
  confidence: z.nativeEnum(ConfidenceLevel),
  isAutomatic: z.boolean(),
  source: z.string().optional(),
});

type CheckpointForm = z.infer<typeof checkpointSchema>;

/**
 * CheckpointTracker Component
 *
 * Manages a list of checkpoints with CRUD operations and visualization
 */
export function CheckpointTracker({
  checkpoints,
  metric,
  onChange,
  readOnly = false,
  className,
}: CheckpointTrackerProps): React.JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCheckpoint, setEditingCheckpoint] = useState<MetricCheckpoint | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Form for adding/editing checkpoints
  const form = useForm<CheckpointForm>({
    resolver: zodResolver(checkpointSchema),
    defaultValues: {
      value: metric.currentValue || 0,
      recordedDate: new Date(),
      note: '',
      evidence: '',
      confidence: ConfidenceLevel.MEDIUM,
      isAutomatic: false,
      source: '',
    },
  });

  // Sort checkpoints
  const sortedCheckpoints = useMemo(() => {
    const sorted = [...checkpoints].sort((a, b) => {
      if (sortBy === 'date') {
        const comparison = a.recordedDate.getTime() - b.recordedDate.getTime();
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = a.value - b.value;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });
    return sorted;
  }, [checkpoints, sortBy, sortOrder]);

  // Calculate trends
  const trends = useMemo(() => {
    if (checkpoints.length < 2) return {};

    const trendMap: Record<string, 'up' | 'down' | 'stable'> = {};
    const sorted = [...checkpoints].sort((a, b) => a.recordedDate.getTime() - b.recordedDate.getTime());

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const previous = sorted[i - 1];
      const change = current.value - previous.value;

      if (Math.abs(change) < metric.targetValue * 0.01) { // Less than 1% change
        trendMap[current.id] = 'stable';
      } else if (change > 0) {
        trendMap[current.id] = 'up';
      } else {
        trendMap[current.id] = 'down';
      }
    }

    return trendMap;
  }, [checkpoints, metric.targetValue]);

  // Handle form submission
  const handleSubmit = (data: CheckpointForm) => {
    if (readOnly) return;

    const checkpointData: Omit<MetricCheckpoint, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'> = {
      goalId: editingCheckpoint?.goalId || '',
      value: data.value,
      recordedDate: data.recordedDate,
      note: data.note || undefined,
      isAutomatic: data.isAutomatic,
      source: data.source || undefined,
      confidence: data.confidence ? parseFloat(data.confidence as any) : undefined,
    };

    if (editingCheckpoint) {
      // Update existing checkpoint
      const updated = checkpoints.map(cp =>
        cp.id === editingCheckpoint.id
          ? { ...cp, ...checkpointData, updatedAt: new Date(), updatedBy: 'current-user' }
          : cp
      );
      onChange(updated);
    } else {
      // Add new checkpoint
      const newCheckpoint: MetricCheckpoint = {
        ...checkpointData,
        id: `checkpoint-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user',
        updatedBy: 'current-user',
      };
      onChange([...checkpoints, newCheckpoint]);
    }

    // Reset form and close dialog
    form.reset();
    setEditingCheckpoint(null);
    setIsDialogOpen(false);
  };

  // Handle edit
  const handleEdit = (checkpoint: MetricCheckpoint) => {
    if (readOnly) return;

    setEditingCheckpoint(checkpoint);
    form.reset({
      value: checkpoint.value,
      recordedDate: checkpoint.recordedDate,
      note: checkpoint.note || '',
      evidence: '', // Evidence handling would be more complex in real implementation
      confidence: (checkpoint.confidence?.toString() as ConfidenceLevel) || ConfidenceLevel.MEDIUM,
      isAutomatic: checkpoint.isAutomatic,
      source: checkpoint.source || '',
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = (checkpointId: string) => {
    if (readOnly) return;

    const updated = checkpoints.filter(cp => cp.id !== checkpointId);
    onChange(updated);
  };

  // Get confidence badge variant
  const getConfidenceBadgeVariant = (confidence?: number): 'default' | 'secondary' | 'outline' => {
    if (!confidence) return 'outline';
    if (confidence >= 0.8) return 'default';
    if (confidence >= 0.5) return 'secondary';
    return 'outline';
  };

  // Format metric value for display
  const formatValue = (value: number) => {
    return formatMetricValue(value, metric.metricType as unknown as ExtendedMetricType, metric.unit);
  };

  // Calculate progress for each checkpoint
  const calculateCheckpointProgress = (value: number) => {
    const baseline = metric.minimumValue || 0;
    const direction = metric.higherIsBetter ? MetricDirection.INCREASE : MetricDirection.DECREASE;
    return calculateProgressPercentage(baseline, value, metric.targetValue, direction);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Progress Checkpoints</h3>
          <p className="text-sm text-muted-foreground">
            Track your progress over time with measurable data points
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sort Controls */}
          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
            const [newSortBy, newSortOrder] = value.split('-') as ['date' | 'value', 'asc' | 'desc'];
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
          }}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Latest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="value-desc">Highest Value</SelectItem>
              <SelectItem value="value-asc">Lowest Value</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Checkpoint Button */}
          {!readOnly && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingCheckpoint(null);
                    form.reset({
                      value: metric.currentValue || 0,
                      recordedDate: new Date(),
                      note: '',
                      evidence: '',
                      confidence: ConfidenceLevel.MEDIUM,
                      isAutomatic: false,
                      source: '',
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Checkpoint
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingCheckpoint ? 'Edit Checkpoint' : 'Add New Checkpoint'}
                  </DialogTitle>
                  <DialogDescription>
                    Record a new measurement for this metric
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  {/* Value and Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkpoint-value">Value *</Label>
                      <Controller
                        name="value"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="checkpoint-value"
                            type="number"
                            step="0.01"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        )}
                      />
                      {form.formState.errors.value && (
                        <p className="text-sm text-red-500">{form.formState.errors.value.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkpoint-date">Date *</Label>
                      <Controller
                        name="recordedDate"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="checkpoint-date"
                            type="datetime-local"
                            value={format(field.value, "yyyy-MM-dd'T'HH:mm")}
                            onChange={(e) => {
                              const date = parseISO(e.target.value);
                              if (isValid(date)) {
                                field.onChange(date);
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Confidence and Source */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkpoint-confidence">Confidence</Label>
                      <Controller
                        name="confidence"
                        control={form.control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(ConfidenceLevel).map((level) => (
                                <SelectItem key={level} value={level}>
                                  {formatConfidenceLevel(level)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkpoint-source">Source</Label>
                      <Controller
                        name="source"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="checkpoint-source"
                            placeholder="e.g., Analytics Dashboard"
                            value={field.value || ''}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Automatic Recording */}
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isAutomatic"
                      control={form.control}
                      render={({ field }) => (
                        <Switch
                          id="checkpoint-automatic"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="checkpoint-automatic" className="text-sm">
                      This was automatically recorded
                    </Label>
                  </div>

                  {/* Note */}
                  <div className="space-y-2">
                    <Label htmlFor="checkpoint-note">Note</Label>
                    <Controller
                      name="note"
                      control={form.control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="checkpoint-note"
                          placeholder="Add any relevant context or observations..."
                          rows={3}
                          value={field.value || ''}
                        />
                      )}
                    />
                  </div>

                  {/* Evidence */}
                  <div className="space-y-2">
                    <Label htmlFor="checkpoint-evidence">Evidence (URL or Reference)</Label>
                    <Controller
                      name="evidence"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="checkpoint-evidence"
                          placeholder="Link to report, screenshot, or other evidence"
                          value={field.value || ''}
                        />
                      )}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCheckpoint ? 'Update' : 'Add'} Checkpoint
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Checkpoints List */}
      {sortedCheckpoints.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No Checkpoints Yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Start tracking your progress by adding your first checkpoint
              </p>
              {!readOnly && (
                <Button
                  className="mt-4"
                  onClick={() => {
                    setEditingCheckpoint(null);
                    form.reset();
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Checkpoint
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedCheckpoints.map((checkpoint, index) => {
            const progress = calculateCheckpointProgress(checkpoint.value);
            const trend = trends[checkpoint.id];
            const isLatest = index === 0 && sortBy === 'date' && sortOrder === 'desc';

            return (
              <Card key={checkpoint.id} className={cn(isLatest && 'ring-2 ring-primary/20')}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {formatValue(checkpoint.value)}
                        </CardTitle>
                        {isLatest && (
                          <Badge variant="default" className="text-xs">
                            Latest
                          </Badge>
                        )}
                        {trend && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                                {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                                {trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Trend compared to previous checkpoint</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatCheckpointDate(checkpoint.recordedDate)}
                        </span>
                        {checkpoint.confidence && (
                          <Badge variant={getConfidenceBadgeVariant(checkpoint.confidence)} className="text-xs">
                            {formatConfidenceLevel(checkpoint.confidence.toString() as ConfidenceLevel)}
                          </Badge>
                        )}
                        {checkpoint.isAutomatic && (
                          <Badge variant="outline" className="text-xs">
                            Auto
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    {!readOnly && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(checkpoint)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Checkpoint?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The checkpoint data will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(checkpoint.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Note */}
                  {checkpoint.note && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        Note
                      </div>
                      <p className="text-sm bg-muted p-2 rounded">{checkpoint.note}</p>
                    </div>
                  )}

                  {/* Source and metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {checkpoint.source && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {checkpoint.source}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(checkpoint.createdAt, 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CheckpointTracker;