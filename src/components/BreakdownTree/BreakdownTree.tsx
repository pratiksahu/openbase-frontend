/**
 * BreakdownTree Component
 *
 * The main component that provides hierarchical visualization and management
 * of SMART goals breakdown structure with full drag-and-drop, search, and
 * accessibility support.
 *
 * @fileoverview Main BreakdownTree component
 * @version 1.0.0
 */

'use client';

import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DropAnimation,
  defaultDropAnimationSideEffects,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { ExpandIcon, ShrinkIcon, TreePine } from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import {
  type BreakdownTreeProps,
  type TreeNode as TreeNodeData,
  type TreeNodeMove,
  type QuickActionType,
  SelectionMode,
  TreeNodeType,
  KeyboardAction,
} from './BreakdownTree.types';
import { DragDropTreeNode } from './DragDropTreeNode';
import { TreeProvider, useTreeContext } from './TreeContext';
import { TreeNode } from './TreeNode';
import { TreeSearch } from './TreeSearch';
import { keyboardNavigation } from './utils/keyboard-navigation';
import { treeUtils } from './utils/tree-utils';

// =============================================================================
// Drop Animation Configuration
// =============================================================================

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

// =============================================================================
// TreeContent Component (Internal)
// =============================================================================

function TreeContent({
  config,
  onNodeSelect: _onNodeSelect,
  onNodeUpdate: _onNodeUpdate,
  onNodeMove,
  onNodeCreate: _onNodeCreate,
  onNodeDelete,
  onTreeChange: _onTreeChange,
  className,
  isLoading = false,
  error,
}: Omit<BreakdownTreeProps, 'initialData'>) {
  const { state, operations, utils } = useTreeContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [, setDraggedNode] = useState<TreeNodeData | null>(null);
  const [dragOverlay, setDragOverlay] = useState<React.ReactNode>(null);

  // =============================================================================
  // Sensor Configuration
  // =============================================================================

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

  // =============================================================================
  // Computed Values
  // =============================================================================

  const enableDragDrop = config?.enableDragDrop ?? true;
  const enableSearch = config?.enableSearch ?? true;
  const enableFilters = config?.enableFilters ?? true;
  const enableKeyboardNavigation = config?.enableKeyboardNavigation ?? true;
  // TODO: Implement connection lines feature
  // const showConnectionLines = config?.showConnectionLines ?? true;

  // Get visible nodes based on expansion and search/filter state
  const visibleNodes = useMemo(() => {
    const flatNodes = treeUtils.flattenTree(state.tree, true);

    // Apply search/filter if active
    if (state.searchFilter.isActive) {
      return flatNodes.filter(
        node =>
          state.searchFilter.matchingIds.has(node.id) ||
          // Also include parents of matching nodes to maintain hierarchy
          treeUtils
            .getDescendants(state.tree, node.id)
            .some(descendant =>
              state.searchFilter.matchingIds.has(descendant.id)
            )
      );
    }

    return flatNodes;
  }, [state.tree, state.searchFilter]);

  const sortableIds = useMemo(
    () => visibleNodes.map(node => node.id),
    [visibleNodes]
  );

  const selectedCount = state.selection.selectedIds.size;
  const totalNodes = state.tree.count;

  // =============================================================================
  // Event Handlers
  // =============================================================================

  const handleNodeAction = useCallback(
    async (action: QuickActionType, nodeId: string) => {
      try {
        switch (action) {
          case 'edit':
            // Trigger edit mode - this would typically open a modal/form
            // Handle edit node action
            break;

          case 'add_child':
            await operations.createNode({
              type: TreeNodeType.TASK, // Default to task, could be dynamic based on parent
              title: 'New Task',
              description: 'Enter description...',
              parentId: nodeId,
              index: 0,
            });
            break;

          case 'duplicate':
            await operations.duplicateNode(nodeId);
            break;

          case 'delete':
            await operations.deleteNode(nodeId);
            onNodeDelete?.(nodeId);
            break;

          case 'move_up':
          case 'move_down':
            // Handle sibling reordering
            const node = utils.getNode(nodeId);
            const siblings = utils.getSiblings(nodeId);
            if (node && siblings.length > 0) {
              const currentIndex = siblings.findIndex(s => s.id === nodeId);
              const newIndex =
                action === 'move_up'
                  ? Math.max(0, currentIndex - 1)
                  : Math.min(siblings.length - 1, currentIndex + 1);

              if (currentIndex !== newIndex) {
                await operations.moveNode({
                  nodeId,
                  newParentId: node.parentId,
                  newIndex,
                });
              }
            }
            break;

          case 'promote':
          case 'demote':
            // Handle hierarchy changes
            const nodeToMove = utils.getNode(nodeId);
            if (nodeToMove) {
              if (action === 'promote' && nodeToMove.parentId) {
                const parent = utils.getNode(nodeToMove.parentId);
                if (parent) {
                  await operations.moveNode({
                    nodeId,
                    newParentId: parent.parentId,
                    newIndex: 0,
                  });
                }
              } else if (action === 'demote') {
                const siblings = utils.getSiblings(nodeId);
                const prevSibling = siblings.find(
                  s => s.order < nodeToMove.order
                );
                if (prevSibling && prevSibling.canHaveChildren) {
                  await operations.moveNode({
                    nodeId,
                    newParentId: prevSibling.id,
                    newIndex: prevSibling.children.length,
                  });
                }
              }
            }
            break;

          default:
            // Unhandled action type
            break;
        }
      } catch (error) {
        console.error('Action failed:', action, error);
      }
    },
    [operations, utils, onNodeDelete]
  );

  const handleExpandAll = useCallback(() => {
    operations.expandAll();
  }, [operations]);

  const handleCollapseAll = useCallback(() => {
    operations.collapseAll();
  }, [operations]);

  // =============================================================================
  // Drag and Drop Handlers
  // =============================================================================

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const node = utils.getNode(active.id as string);

      if (node) {
        setDraggedNode(node);
        setDragOverlay(
          <TreeNode
            node={node}
            viewState={state}
            onExpand={() => {}}
            onCollapse={() => {}}
            onSelect={() => {}}
            onFocus={() => {}}
            onAction={() => {}}
            className="opacity-80 shadow-lg"
          />
        );
      }
    },
    [utils, state]
  );

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Handle drag over logic if needed
    // This could update visual indicators for drop zones
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setDraggedNode(null);
      setDragOverlay(null);

      if (!over || active.id === over.id) {
        return;
      }

      const draggedNodeId = active.id as string;
      const targetNodeId = over.id as string;

      try {
        // For now, we'll assume dropping inside the target node
        // In a more sophisticated implementation, we'd determine
        // the exact drop position based on cursor location
        const move: TreeNodeMove = {
          nodeId: draggedNodeId,
          newParentId: targetNodeId,
          newIndex: 0,
        };

        await operations.moveNode(move);
        onNodeMove?.(move);
      } catch (error) {
        console.error('Drag and drop failed:', error);
      }
    },
    [operations, onNodeMove]
  );

  // =============================================================================
  // Keyboard Navigation
  // =============================================================================

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enableKeyboardNavigation) return;

      const action = keyboardNavigation.getKeyboardAction(e.nativeEvent);
      if (!action) return;

      const { focusedNodeId } = state;
      if (!focusedNodeId) return;

      e.preventDefault();

      switch (action) {
        case KeyboardAction.MOVE_UP:
        case KeyboardAction.MOVE_DOWN:
        case KeyboardAction.MOVE_LEFT:
        case KeyboardAction.MOVE_RIGHT:
          const direction = action.replace('MOVE_', '').toLowerCase() as
            | 'up'
            | 'down'
            | 'left'
            | 'right';
          const nextNodeId = keyboardNavigation.getNextFocusableNode(
            state.tree,
            focusedNodeId,
            direction
          );

          if (nextNodeId) {
            operations.focusNode(nextNodeId);

            // Handle expansion/collapse for left/right arrows
            if (direction === 'left') {
              operations.collapseNode(focusedNodeId);
            } else if (direction === 'right') {
              operations.expandNode(focusedNodeId);
            }
          }
          break;

        case KeyboardAction.SELECT:
          operations.selectNode(
            focusedNodeId,
            e.nativeEvent.ctrlKey || e.nativeEvent.metaKey
          );
          break;
      }
    },
    [enableKeyboardNavigation, state, operations]
  );

  // =============================================================================
  // Render Helpers
  // =============================================================================

  const renderNode = useCallback(
    (node: TreeNodeData) => {
      if (enableDragDrop) {
        return (
          <DragDropTreeNode
            key={node.id}
            node={node}
            viewState={state}
            enableDragDrop={enableDragDrop}
            validateDrop={utils.validateDrop}
            onExpand={operations.expandNode}
            onCollapse={operations.collapseNode}
            onSelect={operations.selectNode}
            onFocus={operations.focusNode}
            onAction={handleNodeAction}
          />
        );
      }

      return (
        <TreeNode
          key={node.id}
          node={node}
          viewState={state}
          onExpand={operations.expandNode}
          onCollapse={operations.collapseNode}
          onSelect={operations.selectNode}
          onFocus={operations.focusNode}
          onAction={handleNodeAction}
        />
      );
    },
    [enableDragDrop, state, utils.validateDrop, operations, handleNodeAction]
  );

  const renderEmptyState = useCallback(
    () => (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <TreePine className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-muted-foreground mb-2 text-lg font-medium">
          No nodes to display
        </h3>
        <p className="text-muted-foreground max-w-md text-sm">
          {state.searchFilter.isActive
            ? 'Try adjusting your search criteria or filters.'
            : 'Get started by creating your first goal or task.'}
        </p>
      </div>
    ),
    [state.searchFilter.isActive]
  );

  const renderLoadingState = useCallback(
    () => (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 flex-1" />
          </div>
        ))}
      </div>
    ),
    []
  );

  // =============================================================================
  // Error Handling
  // =============================================================================

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading tree</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // =============================================================================
  // Main Render
  // =============================================================================

  return (
    <div
      className={cn('bg-background flex h-full flex-col', className)}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Header with Search and Controls */}
      <div className="bg-card/50 flex-shrink-0 space-y-4 border-b p-4">
        {/* Search and Filters */}
        {(enableSearch || enableFilters) && (
          <TreeSearch
            enableSearch={enableSearch}
            enableFilters={enableFilters}
          />
        )}

        {/* Tree Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExpandAll}
              disabled={visibleNodes.length === 0}
            >
              <ExpandIcon className="mr-2 h-4 w-4" />
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCollapseAll}
              disabled={visibleNodes.length === 0}
            >
              <ShrinkIcon className="mr-2 h-4 w-4" />
              Collapse All
            </Button>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            {selectedCount > 0 && (
              <Badge variant="secondary">{selectedCount} selected</Badge>
            )}
            <span>
              {visibleNodes.length} of {totalNodes} nodes
            </span>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          {isLoading ? (
            renderLoadingState()
          ) : visibleNodes.length === 0 ? (
            renderEmptyState()
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortableIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1 p-2" role="tree">
                  {visibleNodes.map(renderNode)}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={dropAnimation}>
                {dragOverlay}
              </DragOverlay>
            </DndContext>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

// =============================================================================
// Main BreakdownTree Component
// =============================================================================

export function BreakdownTree(props: BreakdownTreeProps) {
  const {
    initialData = [],
    config,
    onNodeSelect,
    onTreeChange,
    ...restProps
  } = props;

  return (
    <TreeProvider
      initialData={initialData}
      selectionMode={config?.selectionMode || SelectionMode.SINGLE}
      onNodeSelect={onNodeSelect}
      onTreeChange={onTreeChange}
    >
      <TreeContent
        config={config}
        onNodeSelect={onNodeSelect}
        onTreeChange={onTreeChange}
        {...restProps}
      />
    </TreeProvider>
  );
}

// =============================================================================
// Export
// =============================================================================

export default BreakdownTree;
