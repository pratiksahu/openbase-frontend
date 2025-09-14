/**
 * TaskEditor Component
 *
 * A comprehensive task editing component with support for subtasks, checklists,
 * acceptance criteria, and status management following SMART goals methodology.
 *
 * @fileoverview Main TaskEditor component
 * @version 1.0.0
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Save, X, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';

// UI Components
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// Component imports
import { TaskStatus, GoalPriority } from '@/types/smart-goals.types';
import type { Task, Subtask, ChecklistItem } from '@/types/smart-goals.types';

import { AcceptanceCriteria } from './AcceptanceCriteria';
import { ChecklistEditor } from './ChecklistEditor';
import { SubtaskList } from './SubtaskList';

// Types and utilities
import {
  TaskFormData,
  TaskEditorProps,
  TaskEditorMode,
  AcceptanceCriteriaFormat,
  AcceptanceCriteriaData,
} from './TaskEditor.types';
import {
  taskFormSchema,
  taskToFormData,
  formDataToTask,
  validateTaskForm,
  calculateTaskProgress,
  getStatusColor,
  getPriorityColor,
  formatDuration,
  debounce,
  generateId,
} from './TaskEditor.utils';


/**
 * TaskEditor Component
 * Main component for editing tasks with comprehensive functionality
 */
export function TaskEditor({
  task,
  goalId,
  mode = TaskEditorMode.CREATE,
  onSave,
  onCancel,
  onDelete,
  onStatusChange,
  availableAssignees = [],
  availableTasks: _availableTasks = [],
  templates: _templates = [],
  className = '',
  autoSave = true,
  autoSaveDelay = 3000,
}: TaskEditorProps): React.JSX.Element {
  // =============================================================================
  // State Management
  // =============================================================================

  const [currentMode, setCurrentMode] = useState<TaskEditorMode>(mode);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('details');
  const [isDirty, setIsDirty] = useState(false);

  // Subtasks and checklist state
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks || []);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task?.checklist || []);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<AcceptanceCriteriaData>({
    format: AcceptanceCriteriaFormat.PLAIN_TEXT,
    content: '',
    isValid: true,
  });

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty: formIsDirty },
    // reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task ? taskToFormData(task) : {
      title: '',
      description: '',
      status: TaskStatus.TODO,
      priority: GoalPriority.MEDIUM,
      tags: [],
      dependencies: [],
      order: 0,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // =============================================================================
  // Auto-save functionality
  // =============================================================================

  const debouncedAutoSave = useMemo(
    () => debounce(async () => {
      if (autoSave && isDirty && currentMode === TaskEditorMode.EDIT && task) {
        try {
          await handleSave(true);
        } catch {
          // Auto-save failed - silently handle
          toast.error('Auto-save failed');
        }
      }
    }, autoSaveDelay),
    [autoSave, isDirty, currentMode, task, autoSaveDelay]
  );

  // =============================================================================
  // Effects
  // =============================================================================

  // Track dirty state
  useEffect(() => {
    setIsDirty(formIsDirty || subtasks !== task?.subtasks || checklist !== task?.checklist);
  }, [formIsDirty, subtasks, checklist, task]);

  // Auto-save trigger
  useEffect(() => {
    if (isDirty && autoSave) {
      debouncedAutoSave();
    }
  }, [watchedValues, subtasks, checklist, acceptanceCriteria, isDirty, autoSave, debouncedAutoSave]);

  // =============================================================================
  // Handlers
  // =============================================================================

  const handleSave = useCallback(async (isAutoSave = false) => {
    if (!isAutoSave) setIsSaving(true);

    try {
      const formData = getValues();
      const validation = validateTaskForm(formData);

      if (!validation.isValid) {
        if (!isAutoSave) {
          toast.error('Please fix validation errors before saving');
        }
        return;
      }

      // Create task object
      const taskData: Partial<Task> = {
        ...formDataToTask(formData, task),
        goalId,
        subtasks,
        checklist,
        progress: task ? calculateTaskProgress({ ...task, subtasks, checklist } as Task) : 0,
        id: task?.id || generateId(),
        createdAt: task?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: task?.createdBy || 'current-user', // TODO: Get from auth
        updatedBy: 'current-user', // TODO: Get from auth
      };

      await onSave(taskData as Task);

      if (!isAutoSave) {
        toast.success('Task saved successfully');
        setCurrentMode(TaskEditorMode.EDIT);
      }

      setLastSaved(new Date());
      setIsDirty(false);
    } catch {
      // Save failed - handle gracefully
      if (!isAutoSave) {
        toast.error('Failed to save task');
      }
    } finally {
      if (!isAutoSave) {
        setIsSaving(false);
      }
    }
  }, [getValues, task, goalId, subtasks, checklist, onSave]);

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmCancel = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmCancel) return;
    }

    onCancel();
  }, [isDirty, onCancel]);

  const handleDelete = useCallback(async () => {
    if (!task || !onDelete) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      await onDelete(task.id);
      toast.success('Task deleted successfully');
    } catch {
      // Delete failed - handle gracefully
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  }, [task, onDelete]);

  /* const handleStatusChange = useCallback(async (newStatus: TaskStatus) => {
    if (!task || task.status === newStatus) return;

    try {
      setValue('status', newStatus);
      if (onStatusChange) {
        await onStatusChange(task.id, task.status, newStatus);
      }
      toast.success(`Task status updated to ${newStatus}`);
    } catch {
      // Status change failed - handle gracefully
      toast.error('Failed to update task status');
    }
  }, [task, setValue, onStatusChange]); */

  // =============================================================================
  // Computed Values
  // =============================================================================

  const currentProgress = useMemo(() => {
    if (!task) return 0;
    return calculateTaskProgress({ ...task, subtasks, checklist } as Task);
  }, [task, subtasks, checklist]);

  const totalEstimatedHours = useMemo(() => {
    const mainTaskHours = watchedValues.estimatedHours || 0;
    const subtaskHours = subtasks.reduce((sum, subtask) => sum + (subtask.estimatedHours || 0), 0);
    return mainTaskHours + subtaskHours;
  }, [watchedValues.estimatedHours, subtasks]);

  const completedSubtasks = useMemo(() => {
    return subtasks.filter(subtask => subtask.status === TaskStatus.COMPLETED).length;
  }, [subtasks]);

  const completedChecklistItems = useMemo(() => {
    return checklist.filter(item => item.isCompleted).length;
  }, [checklist]);

  // =============================================================================
  // Render Methods
  // =============================================================================

  const renderHeader = () => (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {currentMode === TaskEditorMode.CREATE ? 'Create Task' : 'Edit Task'}
          {task && (
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-sm text-muted-foreground">
              Last saved: {format(lastSaved, 'HH:mm:ss')}
            </span>
          )}
          {currentMode === TaskEditorMode.EDIT && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      {task && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Progress: {currentProgress}%
          </div>
          {totalEstimatedHours > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(totalEstimatedHours)} estimated
            </div>
          )}
          <div>
            Subtasks: {completedSubtasks}/{subtasks.length}
          </div>
          <div>
            Checklist: {completedChecklistItems}/{checklist.length}
          </div>
        </div>
      )}
    </CardHeader>
  );

  const renderBasicFields = () => (
    <div className="grid grid-cols-1 gap-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="title"
              placeholder="Enter task title..."
              className={errors.title ? 'border-destructive' : ''}
            />
          )}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
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
              placeholder="Enter task description..."
              rows={3}
              className={errors.description ? 'border-destructive' : ''}
            />
          )}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                        {status.replace('_', ' ')}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GoalPriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
                        {priority}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Assigned To */}
        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {availableAssignees.map((assignee) => (
                    <SelectItem key={assignee.id} value={assignee.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {assignee.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Estimated Hours */}
        <div className="space-y-2">
          <Label htmlFor="estimatedHours">Estimated Hours</Label>
          <Controller
            name="estimatedHours"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Input
                {...field}
                id="estimatedHours"
                type="number"
                step="0.5"
                min="0"
                max="1000"
                value={value || ''}
                onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="0"
              />
            )}
          />
          {errors.estimatedHours && (
            <p className="text-sm text-destructive">{errors.estimatedHours.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Input
                {...field}
                id="dueDate"
                type="datetime-local"
                value={value ? format(value, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : undefined)}
              />
            )}
          />
          {errors.dueDate && (
            <p className="text-sm text-destructive">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Controller
            name="startDate"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Input
                {...field}
                id="startDate"
                type="datetime-local"
                value={value ? format(value, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : undefined)}
              />
            )}
          />
        </div>
      </div>

      {/* Progress */}
      {currentMode === TaskEditorMode.EDIT && task && (
        <div className="space-y-2">
          <Label>Progress</Label>
          <div className="space-y-2">
            <Progress value={currentProgress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {currentProgress}% complete
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderActionButtons = () => (
    <div className="flex items-center justify-between pt-6">
      <div className="flex items-center gap-2">
        {isDirty && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            You have unsaved changes
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleCancel} disabled={isSaving || isLoading}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleSave)} disabled={isSaving || isLoading}>
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Task
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // =============================================================================
  // Main Render
  // =============================================================================

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {renderHeader()}
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="subtasks">
              Subtasks ({subtasks.length})
            </TabsTrigger>
            <TabsTrigger value="checklist">
              Checklist ({checklist.length})
            </TabsTrigger>
            <TabsTrigger value="acceptance">
              Acceptance Criteria
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {renderBasicFields()}
          </TabsContent>

          <TabsContent value="subtasks" className="mt-6">
            <SubtaskList
              subtasks={subtasks}
              onSubtasksChange={setSubtasks}
              onSubtaskAdd={(subtask) => {
                const newSubtask = {
                  ...subtask,
                  id: generateId(),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  createdBy: 'current-user', // TODO: Get from auth
                  updatedBy: 'current-user', // TODO: Get from auth
                  taskId: task?.id || 'new-task',
                  progress: 0,
                  checklist: [],
                  isDeleted: false,
                };
                setSubtasks(prev => [...prev, newSubtask as Subtask]);
              }}
              onSubtaskUpdate={(subtaskId, changes) => {
                setSubtasks(prev => prev.map(subtask =>
                  subtask.id === subtaskId
                    ? { ...subtask, ...changes, updatedAt: new Date() }
                    : subtask
                ));
              }}
              onSubtaskDelete={(subtaskId) => {
                setSubtasks(prev => prev.filter(subtask => subtask.id !== subtaskId));
              }}
              onSubtaskReorder={(fromIndex, toIndex) => {
                setSubtasks(prev => {
                  const newSubtasks = [...prev];
                  const [removed] = newSubtasks.splice(fromIndex, 1);
                  newSubtasks.splice(toIndex, 0, removed);
                  return newSubtasks.map((subtask, index) => ({
                    ...subtask,
                    order: index,
                  }));
                });
              }}
              availableAssignees={availableAssignees}
              isReadOnly={currentMode === TaskEditorMode.VIEW}
            />
          </TabsContent>

          <TabsContent value="checklist" className="mt-6">
            <ChecklistEditor
              checklist={checklist}
              onChecklistChange={setChecklist}
              onItemAdd={(item) => {
                const newItem = {
                  ...item,
                  id: generateId(),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  createdBy: 'current-user', // TODO: Get from auth
                  updatedBy: 'current-user', // TODO: Get from auth
                };
                setChecklist(prev => [...prev, newItem as ChecklistItem]);
              }}
              onItemUpdate={(itemId, changes) => {
                setChecklist(prev => prev.map(item =>
                  item.id === itemId
                    ? { ...item, ...changes, updatedAt: new Date() }
                    : item
                ));
              }}
              onItemDelete={(itemId) => {
                setChecklist(prev => prev.filter(item => item.id !== itemId));
              }}
              onItemToggle={(itemId) => {
                setChecklist(prev => prev.map(item =>
                  item.id === itemId
                    ? {
                        ...item,
                        isCompleted: !item.isCompleted,
                        completedAt: !item.isCompleted ? new Date() : undefined,
                        updatedAt: new Date(),
                      }
                    : item
                ));
              }}
              onItemReorder={(fromIndex, toIndex) => {
                setChecklist(prev => {
                  const newChecklist = [...prev];
                  const [removed] = newChecklist.splice(fromIndex, 1);
                  newChecklist.splice(toIndex, 0, removed);
                  return newChecklist.map((item, index) => ({
                    ...item,
                    order: index,
                  }));
                });
              }}
              supportMarkdown={true}
              isReadOnly={currentMode === TaskEditorMode.VIEW}
            />
          </TabsContent>

          <TabsContent value="acceptance" className="mt-6">
            <AcceptanceCriteria
              criteria={acceptanceCriteria}
              onCriteriaChange={setAcceptanceCriteria}
              supportedFormats={Object.values(AcceptanceCriteriaFormat)}
              showPreview={true}
              isReadOnly={currentMode === TaskEditorMode.VIEW}
            />
          </TabsContent>
        </Tabs>

        {/* Validation Errors */}
        {Object.keys(errors).length > 0 && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the following errors:
              <ul className="list-disc list-inside mt-2">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="text-sm">
                    {field}: {error?.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {renderActionButtons()}
      </CardContent>
    </Card>
  );
}