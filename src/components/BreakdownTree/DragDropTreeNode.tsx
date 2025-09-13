/**
 * DragDropTreeNode Component
 *
 * A wrapper component that adds drag-and-drop functionality to TreeNode
 * using @dnd-kit with proper accessibility and visual feedback.
 *
 * @fileoverview Drag-and-drop enhanced TreeNode component
 * @version 1.0.0
 */

'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';

import { type TreeNodeProps, type DropValidation } from './BreakdownTree.types';
import { TreeNode } from './TreeNode';

// =============================================================================
// Types
// =============================================================================

interface DragDropTreeNodeProps extends TreeNodeProps {
  /** Whether drag and drop is enabled */
  enableDragDrop: boolean;
  /** Validation function for drop operations */
  validateDrop?: (
    draggedNodeId: string,
    targetNodeId: string
  ) => DropValidation;
  /** Drop indicator position */
  dropIndicator?: 'above' | 'below' | 'inside' | null;
  /** Whether this node is being dragged */
  isDragging?: boolean;
  /** Whether this node is a valid drop target */
  isValidDropTarget?: boolean;
}

// =============================================================================
// DragDropTreeNode Component
// =============================================================================

export function DragDropTreeNode({
  node,
  viewState,
  enableDragDrop,
  validateDrop,
  dropIndicator,
  isDragging = false,
  isValidDropTarget = false,
  onExpand,
  onCollapse,
  onSelect,
  onFocus,
  onAction,
  className,
  ...props
}: DragDropTreeNodeProps) {
  // =============================================================================
  // Drag and Drop Setup
  // =============================================================================

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: node.id,
    disabled: !enableDragDrop || !node.isDraggable,
    data: {
      type: 'tree-node',
      node,
    },
  });

  // =============================================================================
  // Computed Styles
  // =============================================================================

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
    }),
    [transform, transition]
  );

  // =============================================================================
  // Drop Validation
  // =============================================================================

  const dropValidation = useMemo(() => {
    if (!validateDrop)
      return {
        isValid: true,
        wouldCreateCircularDependency: false,
        areTypesCompatible: true,
      };

    // This would be called during drag over events
    // For now, we'll assume it's valid since validation is handled elsewhere
    return {
      isValid: true,
      wouldCreateCircularDependency: false,
      areTypesCompatible: true,
    };
  }, [validateDrop]);

  // =============================================================================
  // Enhanced Event Handlers
  // =============================================================================

  const handleDragStart = (nodeId: string) => {
    // Mark node as being dragged in global state if needed
    props.onDragStart?.(nodeId);
  };

  const handleDragEnd = () => {
    // Clean up drag state
    props.onDragEnd?.();
  };

  const handleDrop = (
    draggedNodeId: string,
    targetNodeId: string,
    position: 'before' | 'after' | 'inside'
  ) => {
    // Validate the drop before executing
    if (validateDrop) {
      const validation = validateDrop(draggedNodeId, targetNodeId);
      if (!validation.isValid) {
        console.warn('Invalid drop operation:', validation.reason);
        return;
      }
    }

    props.onDrop?.(draggedNodeId, targetNodeId, position);
  };

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        // Dragging state
        isSortableDragging && 'z-50 opacity-50',
        isDragging && 'ring-primary/50 shadow-lg ring-2',

        // Drop target state
        isValidDropTarget && 'ring-2 ring-green-500/50',
        !dropValidation.isValid &&
          isValidDropTarget &&
          'ring-2 ring-red-500/50',

        className
      )}
      {...attributes}
      {...listeners}
    >
      {/* Drop Indicator */}
      {dropIndicator && (
        <div
          className={cn(
            'bg-primary absolute right-0 left-0 z-10 h-0.5',
            dropIndicator === 'above' && '-top-px',
            dropIndicator === 'below' && '-bottom-px',
            dropIndicator === 'inside' &&
              'bg-primary/20 border-primary top-1/2 h-full -translate-y-1/2 border-2 border-dashed'
          )}
        />
      )}

      {/* Tree Node */}
      <TreeNode
        node={node}
        viewState={viewState}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onSelect={onSelect}
        onFocus={onFocus}
        onAction={onAction}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        enableDragDrop={enableDragDrop}
        className={cn(
          // Disable pointer events during drag
          isSortableDragging && 'pointer-events-none',

          // Visual feedback for drag state
          isDragging && 'bg-accent/50',

          // Drop target styling
          isValidDropTarget &&
            dropValidation.isValid &&
            'ring-1 ring-green-500/30',
          isValidDropTarget &&
            !dropValidation.isValid &&
            'ring-1 ring-red-500/30'
        )}
        {...props}
      />

      {/* Accessibility announcement for drag state */}
      {isSortableDragging && (
        <div className="sr-only" aria-live="assertive">
          Moving {node.title}
        </div>
      )}

      {/* Drop validation feedback */}
      {isValidDropTarget && !dropValidation.isValid && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-red-500/10 text-xs font-medium text-red-700 dark:text-red-300"
          aria-live="polite"
        >
          {dropValidation.wouldCreateCircularDependency
            ? 'Cannot move to descendant'
            : !dropValidation.areTypesCompatible
              ? 'Incompatible node types'
              : 'Invalid drop target'}
        </div>
      )}
    </div>
  );
}
