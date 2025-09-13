/**
 * ChecklistEditor Component
 *
 * A comprehensive checklist management component with drag-and-drop reordering,
 * inline editing, markdown support, and bulk operations.
 *
 * @fileoverview ChecklistEditor component for TaskEditor
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
  CheckSquare,
  Square,
  MoreHorizontal,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import React, { useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';

// UI Components
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';


// Types and utilities
import type { ChecklistItem } from '@/types/smart-goals.types';

import {
  ChecklistEditorProps,
  ChecklistFormData,
} from './TaskEditor.types';
import {
  checklistItemSchema,
} from './TaskEditor.utils';

// =============================================================================
// Sortable Checklist Item Component
// =============================================================================

interface SortableChecklistItemProps {
  item: ChecklistItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: ChecklistFormData) => void;
  onCancel: () => void;
  onDelete: () => void;
  onToggle: () => void;
  supportMarkdown: boolean;
  isReadOnly: boolean;
  showPreview: boolean;
  onTogglePreview: () => void;
}

function SortableChecklistItem({
  item,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggle,
  supportMarkdown,
  isReadOnly,
  showPreview,
  onTogglePreview,
}: SortableChecklistItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Form for editing
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistItemSchema),
    defaultValues: {
      title: item.title,
      description: item.description || '',
      isCompleted: item.isCompleted,
      isRequired: item.isRequired,
      order: item.order,
    },
  });

  const onSubmit = (data: ChecklistFormData) => {
    onSave(data);
  };

  // Render markdown content (simplified version)
  const renderMarkdownContent = (content: string) => {
    if (!supportMarkdown || !showPreview) {
      return content;
    }

    // Simple markdown rendering for demonstration
    // In a real app, you'd use a proper markdown parser like react-markdown
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`border rounded-lg p-4 bg-background ${isDragging ? 'opacity-50' : ''}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <h4 className="font-medium">Edit Checklist Item</h4>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor={`title-${item.id}`}>Title *</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={`title-${item.id}`}
                  placeholder="Checklist item title..."
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
            <div className="flex items-center justify-between">
              <Label htmlFor={`description-${item.id}`}>
                Description {supportMarkdown && '(Markdown supported)'}
              </Label>
              {supportMarkdown && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onTogglePreview}
                  className="h-8 px-2"
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPreview ? 'Edit' : 'Preview'}
                </Button>
              )}
            </div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                showPreview && supportMarkdown && field.value ? (
                  <div
                    className="min-h-[80px] p-3 border rounded-md bg-muted"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdownContent(field.value),
                    }}
                  />
                ) : (
                  <Textarea
                    {...field}
                    id={`description-${item.id}`}
                    placeholder={supportMarkdown
                      ? "Optional description... Use **bold**, *italic*, `code` for formatting"
                      : "Optional description..."
                    }
                    rows={3}
                  />
                )
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Completed status */}
            <div className="flex items-center space-x-2">
              <Controller
                name="isCompleted"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id={`completed-${item.id}`}
                  />
                )}
              />
              <Label htmlFor={`completed-${item.id}`}>Completed</Label>
            </div>

            {/* Required status */}
            <div className="flex items-center space-x-2">
              <Controller
                name="isRequired"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id={`required-${item.id}`}
                  />
                )}
              />
              <Label htmlFor={`required-${item.id}`}>Required</Label>
            </div>
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
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 ${
        isDragging ? 'opacity-50' : ''
      } ${item.isCompleted ? 'bg-green-50 border-green-200' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <button
            onClick={onToggle}
            className="mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            disabled={isReadOnly}
          >
            {item.isCompleted ? (
              <CheckSquare className="h-5 w-5 text-green-600" />
            ) : (
              <Square className="h-5 w-5 text-muted-foreground hover:text-primary" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                  {item.title}
                  {item.isRequired && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Required
                    </Badge>
                  )}
                </h4>

                {item.description && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {supportMarkdown && showPreview ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdownContent(item.description),
                        }}
                      />
                    ) : (
                      <p>{item.description}</p>
                    )}
                  </div>
                )}

                {item.completedAt && (
                  <p className="text-xs text-green-600 mt-1">
                    Completed {new Date(item.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {!isReadOnly && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main ChecklistEditor Component
// =============================================================================

export function ChecklistEditor({
  checklist,
  onChecklistChange,
  onItemAdd,
  onItemUpdate,
  onItemDelete,
  onItemToggle,
  onItemReorder,
  supportMarkdown = false,
  isReadOnly = false,
  className = '',
}: ChecklistEditorProps): JSX.Element {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

  // Form for adding new item
  const {
    control: addControl,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    watch: watchAddForm,
    formState: { errors: addErrors },
  } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistItemSchema),
    defaultValues: {
      title: '',
      description: '',
      isCompleted: false,
      isRequired: false,
      order: checklist.length,
    },
  });

  const watchedDescription = watchAddForm('description');

  // =============================================================================
  // Computed Values
  // =============================================================================

  const completedCount = useMemo(() => {
    return checklist.filter(item => item.isCompleted).length;
  }, [checklist]);

  const requiredCount = useMemo(() => {
    return checklist.filter(item => item.isRequired).length;
  }, [checklist]);

  const completedRequiredCount = useMemo(() => {
    return checklist.filter(item => item.isRequired && item.isCompleted).length;
  }, [checklist]);

  const progressPercentage = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  // =============================================================================
  // Handlers
  // =============================================================================

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = checklist.findIndex(item => item.id === active.id);
      const newIndex = checklist.findIndex(item => item.id === over.id);

      onItemReorder(oldIndex, newIndex);
    }
  }, [checklist, onItemReorder]);

  const handleEdit = useCallback((itemId: string) => {
    setEditingId(itemId);
  }, []);

  const handleSave = useCallback((itemId: string, data: ChecklistFormData) => {
    onItemUpdate(itemId, data);
    setEditingId(null);
    toast.success('Checklist item updated');
  }, [onItemUpdate]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setIsAddingNew(false);
    resetAddForm();
  }, [resetAddForm]);

  const handleDelete = useCallback((itemId: string, itemTitle: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${itemTitle}"?`
    );

    if (!confirmDelete) return;

    onItemDelete(itemId);
    toast.success('Checklist item deleted');
  }, [onItemDelete]);

  const handleToggle = useCallback((itemId: string) => {
    onItemToggle(itemId);
  }, [onItemToggle]);

  const handleAddNew = useCallback((data: ChecklistFormData) => {
    onItemAdd(data);
    setIsAddingNew(false);
    resetAddForm();
    toast.success('Checklist item added');
  }, [onItemAdd, resetAddForm]);

  const handleBulkCheckAll = useCallback(() => {
    const allCompleted = completedCount === checklist.length;
    checklist.forEach(item => {
      if (item.isCompleted !== !allCompleted) {
        onItemToggle(item.id);
      }
    });
    toast.success(allCompleted ? 'All items unchecked' : 'All items checked');
  }, [checklist, completedCount, onItemToggle]);

  const handleRemoveCompleted = useCallback(() => {
    const completedItems = checklist.filter(item => item.isCompleted);

    if (completedItems.length === 0) {
      toast.info('No completed items to remove');
      return;
    }

    const confirmRemove = window.confirm(
      `Are you sure you want to remove ${completedItems.length} completed item(s)?`
    );

    if (!confirmRemove) return;

    completedItems.forEach(item => onItemDelete(item.id));
    toast.success(`${completedItems.length} completed items removed`);
  }, [checklist, onItemDelete]);

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Checklist</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {checklist.length} completed
            {requiredCount > 0 && (
              <span className="ml-2">
                • {completedRequiredCount}/{requiredCount} required items
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {checklist.length > 0 && !isReadOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleBulkCheckAll}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {completedCount === checklist.length ? 'Uncheck All' : 'Check All'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleRemoveCompleted}
                  disabled={completedCount === 0}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Completed ({completedCount})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {supportMarkdown && checklist.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}

          {!isReadOnly && (
            <Button
              onClick={() => setIsAddingNew(true)}
              disabled={isAddingNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          )}
        </div>
      </div>

      {checklist.length > 0 && (
        <div className="mb-4">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{Math.round(progressPercentage)}% complete</span>
            {requiredCount > 0 && (
              <span>
                {completedRequiredCount === requiredCount ? (
                  <span className="text-green-600">All required items completed</span>
                ) : (
                  <span className="text-amber-600">
                    {requiredCount - completedRequiredCount} required items remaining
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {/* Add new item form */}
        {isAddingNew && (
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleAddSubmit(handleAddNew)} className="space-y-4">
                <h4 className="font-medium mb-4">Add New Checklist Item</h4>

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
                        placeholder="Checklist item title..."
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="add-description">
                      Description {supportMarkdown && '(Markdown supported)'}
                    </Label>
                    {supportMarkdown && watchedDescription && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="h-8 px-2"
                      >
                        {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showPreview ? 'Edit' : 'Preview'}
                      </Button>
                    )}
                  </div>
                  <Controller
                    name="description"
                    control={addControl}
                    render={({ field }) => (
                      showPreview && supportMarkdown && field.value ? (
                        <div
                          className="min-h-[80px] p-3 border rounded-md bg-muted"
                          dangerouslySetInnerHTML={{
                            __html: field.value
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'),
                          }}
                        />
                      ) : (
                        <Textarea
                          {...field}
                          id="add-description"
                          placeholder={supportMarkdown
                            ? "Optional description... Use **bold**, *italic*, `code` for formatting"
                            : "Optional description..."
                          }
                          rows={3}
                        />
                      )
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  {/* Required status */}
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isRequired"
                      control={addControl}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="add-required"
                        />
                      )}
                    />
                    <Label htmlFor="add-required">Required item</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Checklist items */}
        {checklist.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={checklist.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {checklist.map((item) => (
                <SortableChecklistItem
                  key={item.id}
                  item={item}
                  isEditing={editingId === item.id}
                  onEdit={() => handleEdit(item.id)}
                  onSave={(data) => handleSave(item.id, data)}
                  onCancel={handleCancel}
                  onDelete={() => handleDelete(item.id, item.title)}
                  onToggle={() => handleToggle(item.id)}
                  supportMarkdown={supportMarkdown}
                  isReadOnly={isReadOnly}
                  showPreview={showPreview}
                  onTogglePreview={() => setShowPreview(!showPreview)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : !isAddingNew ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium text-muted-foreground mb-2">No checklist items yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Create a checklist to track specific requirements and deliverables.
              </p>
              {!isReadOnly && (
                <Button onClick={() => setIsAddingNew(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}