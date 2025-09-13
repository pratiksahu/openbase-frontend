/**
 * TreeNode Component
 *
 * A highly interactive tree node component that supports expansion/collapse,
 * selection, drag-and-drop, keyboard navigation, and accessibility features.
 *
 * @fileoverview TreeNode component for BreakdownTree
 * @version 1.0.0
 */

'use client';

import React, { forwardRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  ChevronDown,
  Target,
  CheckSquare,
  Flag,
  Circle,
  MoreHorizontal,
  GripVertical,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  type TreeNodeProps,
  type TreeNode as TreeNodeData,
  TreeNodeType,
  QuickActionType,
} from './BreakdownTree.types';
import { TreeActions } from './TreeActions';

// =============================================================================
// Node Type Icons
// =============================================================================

const NODE_TYPE_ICONS = {
  [TreeNodeType.GOAL]: Target,
  [TreeNodeType.OUTCOME]: Circle,
  [TreeNodeType.MILESTONE]: Flag,
  [TreeNodeType.TASK]: CheckSquare,
  [TreeNodeType.SUBTASK]: CheckSquare,
} as const;

const NODE_TYPE_COLORS = {
  [TreeNodeType.GOAL]: 'text-blue-600 dark:text-blue-400',
  [TreeNodeType.OUTCOME]: 'text-green-600 dark:text-green-400',
  [TreeNodeType.MILESTONE]: 'text-orange-600 dark:text-orange-400',
  [TreeNodeType.TASK]: 'text-purple-600 dark:text-purple-400',
  [TreeNodeType.SUBTASK]: 'text-gray-600 dark:text-gray-400',
} as const;

// =============================================================================
// Status Badge Colors
// =============================================================================

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  blocked: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
} as const;

const PRIORITY_COLORS = {
  low: 'border-l-gray-300',
  medium: 'border-l-blue-300',
  high: 'border-l-orange-300',
  critical: 'border-l-red-300',
} as const;

// =============================================================================
// TreeNode Component
// =============================================================================

export const TreeNode = forwardRef<HTMLDivElement, TreeNodeProps>(
  (
    {
      node,
      viewState,
      onExpand,
      onCollapse,
      onSelect,
      onFocus,
      onAction,
      onDragStart,
      onDragEnd,
      onDrop,
      enableDragDrop = false,
      className,
      ...props
    },
    ref
  ) => {
    // =============================================================================
    // State and Computed Values
    // =============================================================================

    const hasChildren = node.children.length > 0;
    const isSelected = node.isSelected;
    const isFocused = viewState.focusedNodeId === node.id;
    const isLoading = viewState.loading.get(node.id) || false;
    const error = viewState.errors.get(node.id);
    const isMatchingSearch = viewState.searchFilter.matchingIds.has(node.id);

    // Get node type icon and color
    const NodeIcon = NODE_TYPE_ICONS[node.type];
    const nodeIconColor = NODE_TYPE_COLORS[node.type];

    // Calculate indentation based on depth
    const indentLevel = node.depth * 24; // 24px per level

    // =============================================================================
    // Event Handlers
    // =============================================================================

    const handleToggleExpansion = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasChildren) {
          if (node.isExpanded) {
            onCollapse(node.id);
          } else {
            onExpand(node.id);
          }
        }
      },
      [hasChildren, node.isExpanded, node.id, onExpand, onCollapse]
    );

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(node.id, e.ctrlKey || e.metaKey);
        onFocus(node.id);
      },
      [node.id, onSelect, onFocus]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            if (hasChildren && !node.isExpanded) {
              onExpand(node.id);
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (hasChildren && node.isExpanded) {
              onCollapse(node.id);
            }
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            onSelect(node.id, e.ctrlKey || e.metaKey);
            break;
          case 'Delete':
            e.preventDefault();
            onAction(QuickActionType.DELETE, node.id);
            break;
        }
      },
      [hasChildren, node.isExpanded, node.id, onExpand, onCollapse, onSelect, onAction]
    );

    const handleAction = useCallback(
      (action: QuickActionType) => {
        onAction(action, node.id);
      },
      [onAction, node.id]
    );

    // =============================================================================
    // Quick Actions
    // =============================================================================

    const quickActions = useMemo(() => {
      const actions = [
        {
          type: QuickActionType.EDIT,
          label: 'Edit',
          icon: 'Edit',
          enabled: true,
          handler: (_nodeId: string) => handleAction(QuickActionType.EDIT),
        },
      ];

      if (node.canHaveChildren) {
        actions.push({
          type: QuickActionType.ADD_CHILD,
          label: 'Add Child',
          icon: 'Plus',
          enabled: true,
          handler: (_nodeId: string) => handleAction(QuickActionType.ADD_CHILD),
        });
      }

      actions.push(
        {
          type: QuickActionType.DUPLICATE,
          label: 'Duplicate',
          icon: 'Copy',
          enabled: true,
          handler: (_nodeId: string) => handleAction(QuickActionType.DUPLICATE),
        },
        {
          type: QuickActionType.DELETE,
          label: 'Delete',
          icon: 'Trash',
          enabled: true,
          handler: (_nodeId: string) => handleAction(QuickActionType.DELETE),
        }
      );

      return actions;
    }, [node.canHaveChildren, handleAction]);

    // =============================================================================
    // Drag and Drop Handlers
    // =============================================================================

    const handleDragStart = useCallback(
      (e: React.DragEvent) => {
        if (!enableDragDrop || !node.isDraggable) {
          e.preventDefault();
          return;
        }

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', node.id);
        onDragStart?.(node.id);
      },
      [enableDragDrop, node.isDraggable, node.id, onDragStart]
    );

    const handleDragEnd = useCallback(() => {
      onDragEnd?.();
    }, [onDragEnd]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      if (!enableDragDrop || !node.canAcceptDrop) return;

      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }, [enableDragDrop, node.canAcceptDrop]);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        if (!enableDragDrop || !node.canAcceptDrop) return;

        e.preventDefault();
        const draggedNodeId = e.dataTransfer.getData('text/plain');

        if (draggedNodeId && draggedNodeId !== node.id) {
          onDrop?.(draggedNodeId, node.id, 'inside');
        }
      },
      [enableDragDrop, node.canAcceptDrop, node.id, onDrop]
    );

    // =============================================================================
    // Render
    // =============================================================================

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'group relative flex items-center min-h-[44px] px-2 py-1',
          'transition-all duration-200 ease-in-out',
          'border-l-4',
          PRIORITY_COLORS[node.priority],

          // Hover state
          'hover:bg-muted/50',

          // Selected state
          isSelected && 'bg-primary/10 border-primary/20',

          // Focused state
          isFocused && 'ring-2 ring-primary/50 ring-offset-2',

          // Search highlight
          isMatchingSearch && 'bg-yellow-100/50 dark:bg-yellow-900/20',

          // Error state
          error && 'bg-destructive/10 border-destructive/20',

          // Loading state
          isLoading && 'opacity-50',

          className
        )}
        style={{ paddingLeft: `${indentLevel + 8}px` }}
        tabIndex={0}
        role="treeitem"
        aria-expanded={hasChildren ? node.isExpanded : undefined}
        aria-selected={isSelected}
        aria-level={node.depth + 1}
        data-node-id={node.id}
        data-node-type={node.type}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        draggable={enableDragDrop && node.isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...props}
      >
        {/* Drag Handle */}
        {enableDragDrop && node.isDraggable && (
          <div className="flex items-center justify-center w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </div>
        )}

        {/* Expansion Toggle */}
        <div className="flex items-center justify-center w-6 h-6 mr-1">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-accent"
              onClick={handleToggleExpansion}
              aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
            >
              {node.isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          ) : (
            <div className="w-4 h-4" /> // Placeholder for alignment
          )}
        </div>

        {/* Node Icon */}
        <div className={cn('flex items-center justify-center w-5 h-5 mr-2', nodeIconColor)}>
          <NodeIcon className="w-4 h-4" />
        </div>

        {/* Node Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Description */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate text-foreground">
              {node.title}
            </h4>

            {/* Status Badge */}
            <Badge
              variant="secondary"
              className={cn(
                'text-xs px-2 py-0.5',
                STATUS_COLORS[node.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.draft
              )}
            >
              {node.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Description */}
          {node.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
              {node.description}
            </p>
          )}

          {/* Progress Bar */}
          {node.progress > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <Progress value={node.progress} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground font-medium">
                {node.progress}%
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-xs text-destructive mt-1 truncate" title={error}>
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <TreeActions
            node={node}
            actions={quickActions}
            onAction={handleAction}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-accent"
              aria-label="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </TreeActions>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }
);

TreeNode.displayName = 'TreeNode';