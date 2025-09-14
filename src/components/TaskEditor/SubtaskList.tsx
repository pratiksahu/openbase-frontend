/**
 * SubtaskList Component
 *
 * A comprehensive subtask management component with drag-and-drop reordering,
 * inline editing, and CRUD operations.
 *
 * @fileoverview SubtaskList component for TaskEditor
 * @version 1.0.0
 */

'use client';

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  GripVertical,
  Edit3,
  Trash2,
  Check,
  X,
  Clock,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';

// UI Components
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';


// Types and utilities
import { TaskStatus, GoalPriority } from '@/types/smart-goals.types';
import type { Subtask } from '@/types/smart-goals.types';

import {
  SubtaskListProps,
  SubtaskFormData,
} from './TaskEditor.types';
import {
  subtaskFormSchema,
  getStatusColor,
  getPriorityColor,
  formatDuration,
} from './TaskEditor.utils';

// =============================================================================
// Sortable Subtask Item Component
// =============================================================================

interface SortableSubtaskItemProps {
  subtask: Subtask;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: SubtaskFormData) => void;
  onCancel: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  availableAssignees: Array<{ id: string; name: string; email: string }>;
  isReadOnly: boolean;
}

function SortableSubtaskItem({
  subtask,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onStatusChange: _onStatusChange,
  availableAssignees,
  isReadOnly,
}: SortableSubtaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subtask.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Form for editing
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SubtaskFormData>({
    resolver: zodResolver(subtaskFormSchema),
    defaultValues: {
      title: subtask.title,
      description: subtask.description || '',
      status: subtask.status,
      priority: subtask.priority,
      assignedTo: subtask.assignedTo,
      estimatedHours: subtask.estimatedHours,
      dueDate: subtask.dueDate,
      order: subtask.order,
      tags: subtask.tags || [],
    },
  });

  const onSubmit = (data: SubtaskFormData) => {
    onSave(data);
  };

  const assigneeName = availableAssignees.find(a => a.id === subtask.assignedTo)?.name;

  if (isEditing) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`${isDragging ? 'opacity-50' : ''}`}
      >
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab hover:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <h4 className="font-medium">Edit Subtask</h4>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor={`title-${subtask.id}`}>Title *</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id={`title-${subtask.id}`}
                    placeholder="Subtask title..."
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
              <Label htmlFor={`description-${subtask.id}`}>Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id={`description-${subtask.id}`}
                    placeholder="Subtask description..."
                    rows={2}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
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
                <Label>Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
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
              {/* Assignee */}
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {availableAssignees.map((assignee) => (
                          <SelectItem key={assignee.id} value={assignee.id}>
                            {assignee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Estimated Hours */}
              <div className="space-y-2">
                <Label>Estimated Hours</Label>
                <Controller
                  name="estimatedHours"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.5"
                      min="0"
                      value={value || ''}
                      onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="0"
                    />
                  )}
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Input
                    {...field}
                    type="datetime-local"
                    value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                    onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''} ${subtask.status === TaskStatus.COMPLETED ? 'bg-green-50 border-green-200' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing mt-1"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className={`font-medium ${subtask.status === TaskStatus.COMPLETED ? 'line-through text-muted-foreground' : ''}`}>
                {subtask.title}
              </h4>
              <Badge variant="outline" className={getStatusColor(subtask.status)}>
                {subtask.status}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(subtask.priority)}>
                {subtask.priority}
              </Badge>
            </div>

            {subtask.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {subtask.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {assigneeName && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {assigneeName}
                </div>
              )}
              {subtask.estimatedHours && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(subtask.estimatedHours)}
                </div>
              )}
              {subtask.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(subtask.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>

            {subtask.progress > 0 && subtask.status !== TaskStatus.COMPLETED && (
              <div className="mt-2">
                <Progress value={subtask.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {subtask.progress}% complete
                </p>
              </div>
            )}
          </div>

          {!isReadOnly && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Main SubtaskList Component
// =============================================================================

export function SubtaskList({
  subtasks,
  onSubtasksChange: _onSubtasksChange,
  onSubtaskAdd,
  onSubtaskUpdate,
  onSubtaskDelete,
  onSubtaskReorder,
  availableAssignees = [],
  isReadOnly = false,
  className = '',
}: SubtaskListProps): React.JSX.Element {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Form for adding new subtask
  const {
    control: addControl,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    formState: { errors: addErrors },
  } = useForm<SubtaskFormData>({
    resolver: zodResolver(subtaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: TaskStatus.TODO,
      priority: GoalPriority.MEDIUM,
      order: subtasks.length,
      tags: [],
    },
  });

  // =============================================================================
  // Handlers
  // =============================================================================

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = subtasks.findIndex(item => item.id === active.id);
      const newIndex = subtasks.findIndex(item => item.id === over.id);

      onSubtaskReorder(oldIndex, newIndex);
    }
  }, [subtasks, onSubtaskReorder]);

  const handleEdit = useCallback((subtaskId: string) => {
    setEditingId(subtaskId);
  }, []);

  const handleSave = useCallback((subtaskId: string, data: SubtaskFormData) => {
    onSubtaskUpdate(subtaskId, data);
    setEditingId(null);
    toast.success('Subtask updated');
  }, [onSubtaskUpdate]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setIsAddingNew(false);
    resetAddForm();
  }, [resetAddForm]);

  const handleDelete = useCallback((subtaskId: string, subtaskTitle: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete subtask "${subtaskTitle}"?`
    );

    if (!confirmDelete) return;

    onSubtaskDelete(subtaskId);
    toast.success('Subtask deleted');
  }, [onSubtaskDelete]);

  const handleStatusChange = useCallback((subtaskId: string, status: TaskStatus) => {
    onSubtaskUpdate(subtaskId, { status });
    toast.success(`Subtask status updated to ${status}`);
  }, [onSubtaskUpdate]);

  const handleAddNew = useCallback((data: SubtaskFormData) => {
    onSubtaskAdd(data);
    setIsAddingNew(false);
    resetAddForm();
    toast.success('Subtask added');
  }, [onSubtaskAdd, resetAddForm]);

  // =============================================================================
  // Computed Values
  // =============================================================================

  const completedCount = subtasks.filter(s => s.status === TaskStatus.COMPLETED).length;
  const totalEstimatedHours = subtasks.reduce((sum, s) => sum + (s.estimatedHours || 0), 0);

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Subtasks</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {subtasks.length} completed
            {totalEstimatedHours > 0 && ` • ${formatDuration(totalEstimatedHours)} total estimated`}
          </p>
        </div>
        {!isReadOnly && (
          <Button
            onClick={() => setIsAddingNew(true)}
            disabled={isAddingNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subtask
          </Button>
        )}
      </div>

      {subtasks.length > 0 && (
        <div className="mb-4">
          <Progress value={(completedCount / subtasks.length) * 100} className="h-2" />
        </div>
      )}

      <div className="space-y-4">
        {/* Add new subtask form */}
        {isAddingNew && (
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleAddSubmit(handleAddNew)} className="space-y-4">
                <h4 className="font-medium mb-4">Add New Subtask</h4>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="add-title">Title *</Label>
                  <Controller
                    name="title"
                    control={addControl}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="add-title"
                        placeholder="Subtask title..."
                        className={addErrors.title ? 'border-destructive' : ''}
                      />
                    )}
                  />
                  {addErrors.title && (
                    <p className="text-sm text-destructive">{addErrors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="add-description">Description</Label>
                  <Controller
                    name="description"
                    control={addControl}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="add-description"
                        placeholder="Subtask description..."
                        rows={2}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Priority */}
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Controller
                      name="priority"
                      control={addControl}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
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

                  {/* Estimated Hours */}
                  <div className="space-y-2">
                    <Label>Estimated Hours</Label>
                    <Controller
                      name="estimatedHours"
                      control={addControl}
                      render={({ field: { value, onChange, ...field } }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.5"
                          min="0"
                          value={value || ''}
                          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="0"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subtask
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Subtasks list */}
        {subtasks.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={subtasks.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {subtasks.map((subtask) => (
                <SortableSubtaskItem
                  key={subtask.id}
                  subtask={subtask}
                  isEditing={editingId === subtask.id}
                  onEdit={() => handleEdit(subtask.id)}
                  onSave={(data) => handleSave(subtask.id, data)}
                  onCancel={handleCancel}
                  onDelete={() => handleDelete(subtask.id, subtask.title)}
                  onStatusChange={(status) => handleStatusChange(subtask.id, status)}
                  availableAssignees={availableAssignees}
                  isReadOnly={isReadOnly}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : !isAddingNew ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium text-muted-foreground mb-2">No subtasks yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Break down this task into smaller, manageable subtasks.
              </p>
              {!isReadOnly && (
                <Button onClick={() => setIsAddingNew(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Subtask
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}