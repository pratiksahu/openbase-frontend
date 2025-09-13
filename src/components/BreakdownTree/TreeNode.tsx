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
import React, { forwardRef, useCallback, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

import {
  type TreeNodeProps,
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
  on_hold:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  blocked:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
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
      [
        hasChildren,
        node.isExpanded,
        node.id,
        onExpand,
        onCollapse,
        onSelect,
        onAction,
      ]
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

    const handleDragOver = useCallback(
      (e: React.DragEvent) => {
        if (!enableDragDrop || !node.canAcceptDrop) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      },
      [enableDragDrop, node.canAcceptDrop]
    );

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
          'group relative flex min-h-[44px] items-center px-2 py-1',
          'transition-all duration-200 ease-in-out',
          'border-l-4',
          PRIORITY_COLORS[node.priority],

          // Hover state
          'hover:bg-muted/50',

          // Selected state
          isSelected && 'bg-primary/10 border-primary/20',

          // Focused state
          isFocused && 'ring-primary/50 ring-2 ring-offset-2',

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
          <div className="mr-1 flex h-4 w-4 cursor-grab items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
            <GripVertical className="text-muted-foreground h-3 w-3" />
          </div>
        )}

        {/* Expansion Toggle */}
        <div className="mr-1 flex h-6 w-6 items-center justify-center">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent h-6 w-6 p-0"
              onClick={handleToggleExpansion}
              aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
            >
              {node.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="h-4 w-4" /> // Placeholder for alignment
          )}
        </div>

        {/* Node Icon */}
        <div
          className={cn(
            'mr-2 flex h-5 w-5 items-center justify-center',
            nodeIconColor
          )}
        >
          <NodeIcon className="h-4 w-4" />
        </div>

        {/* Node Content */}
        <div className="min-w-0 flex-1">
          {/* Title and Description */}
          <div className="mb-1 flex items-center gap-2">
            <h4 className="text-foreground truncate text-sm font-medium">
              {node.title}
            </h4>

            {/* Status Badge */}
            <Badge
              variant="secondary"
              className={cn(
                'px-2 py-0.5 text-xs',
                STATUS_COLORS[node.status as keyof typeof STATUS_COLORS] ||
                  STATUS_COLORS.draft
              )}
            >
              {node.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Description */}
          {node.description && (
            <p className="text-muted-foreground mb-1 line-clamp-2 text-xs">
              {node.description}
            </p>
          )}

          {/* Progress Bar */}
          {node.progress > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <Progress value={node.progress} className="h-1.5 flex-1" />
              <span className="text-muted-foreground text-xs font-medium">
                {node.progress}%
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-destructive mt-1 truncate text-xs" title={error}>
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="ml-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <TreeActions
            node={node}
            actions={quickActions}
            onAction={handleAction}
          >
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent h-6 w-6 p-0"
              aria-label="More actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </TreeActions>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}
      </div>
    );
  }
);

TreeNode.displayName = 'TreeNode';
