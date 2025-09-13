/**
 * TreeActions Component
 *
 * A dropdown menu component that provides quick actions for tree nodes
 * including context-sensitive operations based on node type and state.
 *
 * @fileoverview TreeActions component for BreakdownTree
 * @version 1.0.0
 */

'use client';

import {
  Plus,
  Edit,
  Copy,
  Trash,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Target,
  BarChart,
  Check,
  Archive,
  Split,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import {
  type TreeActionsProps,
  type QuickAction,
  QuickActionType,
  TreeNodeType,
} from './BreakdownTree.types';

// =============================================================================
// Icon Mapping
// =============================================================================

const ACTION_ICONS = {
  add_child: Plus,
  edit: Edit,
  delete: Trash,
  duplicate: Copy,
  move_up: ArrowUp,
  move_down: ArrowDown,
  promote: ArrowLeft,
  demote: ArrowRight,
  split: Split,
  convert_to_subgoal: Target,
  add_metric: BarChart,
  mark_complete: Check,
  archive: Archive,
} as const;

// =============================================================================
// TreeActions Component
// =============================================================================

export function TreeActions({
  node,
  actions: _actions,
  onAction,
  children,
  className,
}: TreeActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // =============================================================================
  // Generate Context-Sensitive Actions
  // =============================================================================

  const contextActions = useMemo(() => {
    const baseActions: QuickAction[] = [
      // Edit action (always available)
      {
        type: QuickActionType.EDIT,
        label: 'Edit',
        icon: 'Edit',
        enabled: true,
        shortcut: 'E',
        handler: nodeId => onAction(QuickActionType.EDIT, nodeId),
      },
    ];

    // Add child actions (if node can have children)
    if (node.canHaveChildren) {
      const childActions: QuickAction[] = [];

      switch (node.type) {
        case TreeNodeType.GOAL:
          childActions.push(
            {
              type: QuickActionType.ADD_CHILD,
              label: 'Add Sub-Goal',
              icon: 'Target',
              enabled: true,
              handler: nodeId => onAction(QuickActionType.ADD_CHILD, nodeId),
            },
            {
              type: QuickActionType.ADD_CHILD,
              label: 'Add Outcome',
              icon: 'Circle',
              enabled: true,
              handler: nodeId => onAction(QuickActionType.ADD_CHILD, nodeId),
            },
            {
              type: QuickActionType.ADD_CHILD,
              label: 'Add Milestone',
              icon: 'Flag',
              enabled: true,
              handler: nodeId => onAction(QuickActionType.ADD_CHILD, nodeId),
            },
            {
              type: QuickActionType.ADD_CHILD,
              label: 'Add Task',
              icon: 'CheckSquare',
              enabled: true,
              handler: nodeId => onAction(QuickActionType.ADD_CHILD, nodeId),
            }
          );
          break;

        case TreeNodeType.MILESTONE:
          childActions.push({
            type: QuickActionType.ADD_CHILD,
            label: 'Add Task',
            icon: 'CheckSquare',
            enabled: true,
            handler: nodeId => onAction(QuickActionType.ADD_CHILD, nodeId),
          });
          break;

        case TreeNodeType.TASK:
          childActions.push({
            type: QuickActionType.ADD_CHILD,
            label: 'Add Subtask',
            icon: 'CheckSquare',
            enabled: true,
            handler: nodeId => onAction(QuickActionType.ADD_CHILD, nodeId),
          });
          break;
      }

      baseActions.push(...childActions);
    }

    // Movement actions
    baseActions.push(
      {
        type: QuickActionType.MOVE_UP,
        label: 'Move Up',
        icon: 'ArrowUp',
        enabled: true,
        shortcut: '↑',
        handler: nodeId => onAction(QuickActionType.MOVE_UP, nodeId),
      },
      {
        type: QuickActionType.MOVE_DOWN,
        label: 'Move Down',
        icon: 'ArrowDown',
        enabled: true,
        shortcut: '↓',
        handler: nodeId => onAction(QuickActionType.MOVE_DOWN, nodeId),
      }
    );

    // Hierarchy actions (if applicable)
    if (node.depth > 0) {
      baseActions.push({
        type: QuickActionType.PROMOTE,
        label: 'Promote (Move Left)',
        icon: 'ArrowLeft',
        enabled: true,
        shortcut: '←',
        handler: nodeId => onAction(QuickActionType.PROMOTE, nodeId),
      });
    }

    baseActions.push({
      type: QuickActionType.DEMOTE,
      label: 'Demote (Move Right)',
      icon: 'ArrowRight',
      enabled: true,
      shortcut: '→',
      handler: nodeId => onAction(QuickActionType.DEMOTE, nodeId),
    });

    // Utility actions
    baseActions.push(
      {
        type: QuickActionType.DUPLICATE,
        label: 'Duplicate',
        icon: 'Copy',
        enabled: true,
        shortcut: 'Ctrl+D',
        handler: nodeId => onAction(QuickActionType.DUPLICATE, nodeId),
      },
      {
        type: QuickActionType.SPLIT,
        label: 'Split Node',
        icon: 'Split',
        enabled:
          node.type === TreeNodeType.TASK || node.type === TreeNodeType.GOAL,
        handler: nodeId => onAction(QuickActionType.SPLIT, nodeId),
      }
    );

    // Conversion actions (context-specific)
    if (node.type === TreeNodeType.TASK) {
      baseActions.push({
        type: QuickActionType.CONVERT_TO_SUBGOAL,
        label: 'Convert to Sub-Goal',
        icon: 'Target',
        enabled: true,
        handler: nodeId => onAction(QuickActionType.CONVERT_TO_SUBGOAL, nodeId),
      });
    }

    // Metric actions (for goals and milestones)
    if (
      node.type === TreeNodeType.GOAL ||
      node.type === TreeNodeType.MILESTONE
    ) {
      baseActions.push({
        type: QuickActionType.ADD_METRIC,
        label: 'Add Metric',
        icon: 'BarChart',
        enabled: true,
        handler: nodeId => onAction(QuickActionType.ADD_METRIC, nodeId),
      });
    }

    // Status actions
    if (node.status !== 'completed') {
      baseActions.push({
        type: QuickActionType.MARK_COMPLETE,
        label: 'Mark Complete',
        icon: 'Check',
        enabled: true,
        shortcut: 'C',
        handler: nodeId => onAction(QuickActionType.MARK_COMPLETE, nodeId),
      });
    }

    // Destructive actions
    baseActions.push(
      {
        type: QuickActionType.ARCHIVE,
        label: 'Archive',
        icon: 'Archive',
        enabled: true,
        handler: nodeId => onAction(QuickActionType.ARCHIVE, nodeId),
      },
      {
        type: QuickActionType.DELETE,
        label: 'Delete',
        icon: 'Trash',
        enabled: true,
        shortcut: 'Del',
        handler: () => setShowDeleteDialog(true),
      }
    );

    return baseActions;
  }, [node, onAction]);

  // =============================================================================
  // Event Handlers
  // =============================================================================

  const handleActionClick = (action: QuickAction, e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (action.type === 'delete') {
      setShowDeleteDialog(true);
    } else {
      action.handler(node.id);
    }

    setIsOpen(false);
  };

  const handleDeleteConfirm = () => {
    onAction(QuickActionType.DELETE, node.id);
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  // =============================================================================
  // Group Actions by Category
  // =============================================================================

  const groupedActions = useMemo(() => {
    const groups = {
      primary: contextActions.filter(a =>
        ['edit', 'add_child'].includes(a.type)
      ),
      movement: contextActions.filter(a =>
        ['move_up', 'move_down', 'promote', 'demote'].includes(a.type)
      ),
      utility: contextActions.filter(a =>
        ['duplicate', 'split', 'convert_to_subgoal', 'add_metric'].includes(
          a.type
        )
      ),
      status: contextActions.filter(a => ['mark_complete'].includes(a.type)),
      destructive: contextActions.filter(a =>
        ['archive', 'delete'].includes(a.type)
      ),
    };

    return groups;
  }, [contextActions]);

  // =============================================================================
  // Render Action Item
  // =============================================================================

  const renderActionItem = (action: QuickAction) => {
    const Icon = ACTION_ICONS[action.type] || Edit;

    return (
      <DropdownMenuItem
        key={action.type}
        disabled={!action.enabled}
        onClick={e => handleActionClick(action, e)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm',
          action.type === 'delete' && 'text-destructive focus:text-destructive'
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{action.label}</span>
        {action.shortcut && (
          <DropdownMenuShortcut className="ml-auto">
            {action.shortcut}
          </DropdownMenuShortcut>
        )}
      </DropdownMenuItem>
    );
  };

  // =============================================================================
  // Render Sub Menu for Add Actions
  // =============================================================================

  const renderAddSubmenu = () => {
    const addActions = groupedActions.primary.filter(
      a => a.type === 'add_child'
    );

    if (addActions.length <= 1) {
      return addActions.map(renderActionItem);
    }

    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {addActions.map(action => {
            const Icon = ACTION_ICONS[action.type] || Plus;
            return (
              <DropdownMenuItem
                key={action.label}
                onClick={e => handleActionClick(action, e)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  };

  // =============================================================================
  // Main Render
  // =============================================================================

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild className={className}>
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {/* Primary Actions */}
          {groupedActions.primary
            .filter(a => a.type !== 'add_child')
            .map(renderActionItem)}

          {/* Add Actions */}
          {node.canHaveChildren && (
            <>
              {renderAddSubmenu()}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Movement Actions */}
          {groupedActions.movement.length > 0 && (
            <>
              {groupedActions.movement.map(renderActionItem)}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Utility Actions */}
          {groupedActions.utility.length > 0 && (
            <>
              {groupedActions.utility
                .filter(a => a.enabled)
                .map(renderActionItem)}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Status Actions */}
          {groupedActions.status.length > 0 && (
            <>
              {groupedActions.status.map(renderActionItem)}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Destructive Actions */}
          {groupedActions.destructive.map(renderActionItem)}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {node.type}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{node.title}&rdquo;?
              {node.children.length > 0 && (
                <span className="text-destructive mt-2 block font-medium">
                  This will also delete all {node.children.length} child
                  node(s).
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
