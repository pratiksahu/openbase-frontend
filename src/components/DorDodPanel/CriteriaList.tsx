'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit3,
  GripVertical,
  Info,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { useState, useMemo } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { CriteriaListProps, Criterion } from './DorDodPanel.types';
import {
  calculateProgressMetrics,
  getCategoryInfo,
  getCategoryProgress,
  getProgressColor,
  sortCriteria,
} from './DorDodPanel.utils';

export function CriteriaList({
  criteria,
  onCriterionToggle,
  onCriterionEdit,
  onCriterionDelete,
  onReorder,
  readOnly = false,
  showCategories = true,
  showProgress = true,
  validationResult,
}: CriteriaListProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const sortedCriteria = useMemo(() => sortCriteria(criteria), [criteria]);
  const progressMetrics = useMemo(() => calculateProgressMetrics(criteria), [criteria]);

  const groupedCriteria = useMemo(() => {
    if (!showCategories) {
      return { all: sortedCriteria };
    }

    return sortedCriteria.reduce((groups, criterion) => {
      const category = criterion.category;
      if (!groups[category]) groups[category] = [];
      groups[category].push(criterion);
      return groups;
    }, {} as Record<string, Criterion[]>);
  }, [sortedCriteria, showCategories]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, criterionId: string) => {
    if (readOnly || !onReorder) return;
    setDraggedItem(criterionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (readOnly || !onReorder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    if (readOnly || !onReorder || !draggedItem) return;
    e.preventDefault();

    const currentIds = sortedCriteria.map(c => c.id);
    const draggedIndex = currentIds.indexOf(draggedItem);
    const targetIndex = currentIds.indexOf(targetId);

    if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return;

    const reorderedIds = [...currentIds];
    reorderedIds.splice(draggedIndex, 1);
    reorderedIds.splice(targetIndex, 0, draggedItem);

    onReorder(reorderedIds);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getValidationStatus = (criterionId: string) => {
    if (!validationResult) return null;

    const hasError = validationResult.errors.some(e => e.criterionId === criterionId);
    const hasWarning = validationResult.warnings.some(w => w.criterionId === criterionId);
    const isBlocking = validationResult.blockingCriteria.includes(criterionId);

    if (hasError || isBlocking) return 'error';
    if (hasWarning) return 'warning';
    return null;
  };

  const getValidationMessage = (criterionId: string) => {
    if (!validationResult) return '';

    const error = validationResult.errors.find(e => e.criterionId === criterionId);
    const warning = validationResult.warnings.find(w => w.criterionId === criterionId);

    return error?.message || warning?.message || '';
  };

  const renderCriterion = (criterion: Criterion) => {
    const validationStatus = getValidationStatus(criterion.id);
    const validationMessage = getValidationMessage(criterion.id);
    const categoryInfo = getCategoryInfo(criterion.category);

    return (
      <div
        key={criterion.id}
        draggable={!readOnly && !!onReorder}
        onDragStart={(e) => handleDragStart(e, criterion.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, criterion.id)}
        onDragEnd={handleDragEnd}
        className={`
          group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-200
          ${draggedItem === criterion.id ? 'opacity-50 scale-95' : ''}
          ${criterion.isCompleted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-background border-border'}
          ${validationStatus === 'error' ? 'border-red-300 dark:border-red-700' : ''}
          ${validationStatus === 'warning' ? 'border-yellow-300 dark:border-yellow-700' : ''}
          hover:shadow-sm
        `}
      >
        {/* Drag Handle */}
        {!readOnly && onReorder && (
          <div className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        {/* Checkbox */}
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={criterion.isCompleted}
            onCheckedChange={(checked) => onCriterionToggle(criterion.id, !!checked)}
            disabled={readOnly}
            className={validationStatus === 'error' ? 'border-red-500' : ''}
          />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-grow">
              <p className={`text-sm font-medium ${criterion.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {criterion.description}
              </p>

              {criterion.helpText && (
                <p className="text-xs text-muted-foreground mt-1">
                  {criterion.helpText}
                </p>
              )}

              {/* Category Badge */}
              {showCategories && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${categoryInfo.color} border-current`}
                  >
                    <span className="mr-1">{categoryInfo.icon}</span>
                    {categoryInfo.label}
                  </Badge>

                  {/* Validation Status */}
                  {validationStatus && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {validationStatus === 'error' ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{validationMessage}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {!readOnly && (onCriterionEdit || onCriterionDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onCriterionEdit && (
                    <DropdownMenuItem onClick={() => onCriterionEdit(criterion)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onCriterionEdit && onCriterionDelete && <DropdownMenuSeparator />}
                  {onCriterionDelete && (
                    <DropdownMenuItem
                      onClick={() => onCriterionDelete(criterion.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Completion Status Icon */}
        <div className="flex-shrink-0 mt-1">
          {criterion.isCompleted && (
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          )}
        </div>
      </div>
    );
  };

  const renderProgressSection = () => {
    if (!showProgress) return null;

    return (
      <Card className="p-4 mb-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Progress Overview</h3>
            <Badge variant="outline" className={getProgressColor(progressMetrics.completionScore)}>
              {progressMetrics.completionScore}% Complete
            </Badge>
          </div>

          {/* Overall Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Overall Completion</span>
              <span>{criteria.filter(c => c.isCompleted).length} of {criteria.length}</span>
            </div>
            <Progress value={progressMetrics.completionScore} className="h-2" />
          </div>

          {/* Category Progress */}
          {showCategories && (
            <div className="grid grid-cols-3 gap-4 text-center">
              {(['required', 'recommended', 'optional'] as const).map((category) => {
                const categoryItems = criteria.filter(c => c.category === category);
                const progress = getCategoryProgress(criteria, category);
                const categoryInfo = getCategoryInfo(category);

                if (categoryItems.length === 0) return null;

                return (
                  <div key={category}>
                    <div className={`text-xs font-medium ${categoryInfo.color}`}>
                      {categoryInfo.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {categoryItems.filter(c => c.isCompleted).length}/{categoryItems.length}
                    </div>
                    <Progress value={progress} className="h-1 mt-1" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Ready Status */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              {progressMetrics.isReadyToStart ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              )}
              <span className="text-sm">
                {progressMetrics.isReadyToStart ? 'Ready to Start' : 'Not Ready'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {progressMetrics.isReadyToComplete ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              )}
              <span className="text-sm">
                {progressMetrics.isReadyToComplete ? 'Ready to Complete' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderValidationAlerts = () => {
    if (!validationResult || validationResult.isValid) return null;

    return (
      <div className="space-y-2 mb-4">
        {validationResult.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {validationResult.errors.length} validation error(s) found.
              Please complete all required criteria.
            </AlertDescription>
          </Alert>
        )}

        {validationResult.warnings.length > 0 && (
          <Alert className="border-yellow-200 dark:border-yellow-800">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              {validationResult.warnings.length} recommendation(s) not completed.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  if (criteria.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No criteria defined yet.</p>
        {!readOnly && (
          <p className="text-sm mt-1">Add some criteria to get started.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderProgressSection()}
      {renderValidationAlerts()}

      {showCategories ? (
        // Grouped by categories
        <div className="space-y-6">
          {Object.entries(groupedCriteria).map(([category, items]) => {
            const categoryInfo = getCategoryInfo(category as any);
            const progress = getCategoryProgress(items, category as any);

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold ${categoryInfo.color}`}>
                      <span className="mr-1">{categoryInfo.icon}</span>
                      {categoryInfo.label}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {items.filter(c => c.isCompleted).length} of {items.length}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {progress}% complete
                  </div>
                </div>

                <div className="space-y-2">
                  {items.map(renderCriterion)}
                </div>

                {category !== 'optional' && <Separator className="mt-6" />}
              </div>
            );
          })}
        </div>
      ) : (
        // Flat list
        <div className="space-y-2">
          {sortedCriteria.map(renderCriterion)}
        </div>
      )}
    </div>
  );
}