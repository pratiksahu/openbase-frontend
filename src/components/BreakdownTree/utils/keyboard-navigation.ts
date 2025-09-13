/**
 * Keyboard Navigation Utilities
 *
 * This file contains utilities for handling keyboard navigation within the tree,
 * including arrow key navigation, selection, and accessibility features.
 *
 * @fileoverview Keyboard navigation utilities for BreakdownTree component
 * @version 1.0.0
 */

import {
  type FlatTree,
  type TreeNode,
  KeyboardAction,
  type SelectionState,
  SelectionMode,
} from '../BreakdownTree.types';

import { treeUtils } from './tree-utils';

// =============================================================================
// Key Constants
// =============================================================================

export const KEYBOARD_KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
} as const;

export const MODIFIER_KEYS = {
  CTRL: 'ctrlKey',
  SHIFT: 'shiftKey',
  ALT: 'altKey',
  META: 'metaKey',
} as const;

// =============================================================================
// Keyboard Action Detection
// =============================================================================

/**
 * Determines the keyboard action based on the key event
 */
export function getKeyboardAction(event: KeyboardEvent): KeyboardAction | null {
  const { key, ctrlKey, shiftKey, metaKey } = event;

  // Handle modifier combinations first
  if (ctrlKey || metaKey) {
    switch (key) {
      case 'a':
      case 'A':
        return KeyboardAction.SELECT; // Select all (handled by component)
      default:
        return null;
    }
  }

  if (shiftKey) {
    switch (key) {
      case KEYBOARD_KEYS.ARROW_UP:
      case KEYBOARD_KEYS.ARROW_DOWN:
        return KeyboardAction.RANGE_SELECT;
      default:
        return null;
    }
  }

  // Handle basic navigation
  switch (key) {
    case KEYBOARD_KEYS.ARROW_UP:
      return KeyboardAction.MOVE_UP;
    case KEYBOARD_KEYS.ARROW_DOWN:
      return KeyboardAction.MOVE_DOWN;
    case KEYBOARD_KEYS.ARROW_LEFT:
      return KeyboardAction.MOVE_LEFT;
    case KEYBOARD_KEYS.ARROW_RIGHT:
      return KeyboardAction.MOVE_RIGHT;
    case KEYBOARD_KEYS.ENTER:
    case KEYBOARD_KEYS.SPACE:
      return KeyboardAction.SELECT;
    default:
      return null;
  }
}

// =============================================================================
// Navigation Utilities
// =============================================================================

/**
 * Gets the next focusable node in the tree
 */
export function getNextFocusableNode(
  tree: FlatTree,
  currentNodeId: string | null,
  direction: 'up' | 'down' | 'left' | 'right'
): string | null {
  if (!currentNodeId) {
    // If no current focus, start with first root node
    return tree.rootIds.length > 0 ? tree.rootIds[0] : null;
  }

  const currentNode = treeUtils.findNode(tree, currentNodeId);
  if (!currentNode) return null;

  switch (direction) {
    case 'up':
      return getPreviousVisibleNode(tree, currentNodeId);
    case 'down':
      return getNextVisibleNode(tree, currentNodeId);
    case 'left':
      return handleLeftArrow(tree, currentNode);
    case 'right':
      return handleRightArrow(tree, currentNode);
    default:
      return null;
  }
}

/**
 * Gets the next visible node in tree order
 */
function getNextVisibleNode(tree: FlatTree, currentNodeId: string): string | null {
  const flatNodes = treeUtils.flattenTree(tree, true); // Only expanded nodes
  const currentIndex = flatNodes.findIndex(node => node.id === currentNodeId);

  if (currentIndex === -1 || currentIndex >= flatNodes.length - 1) {
    return null;
  }

  return flatNodes[currentIndex + 1].id;
}

/**
 * Gets the previous visible node in tree order
 */
function getPreviousVisibleNode(tree: FlatTree, currentNodeId: string): string | null {
  const flatNodes = treeUtils.flattenTree(tree, true); // Only expanded nodes
  const currentIndex = flatNodes.findIndex(node => node.id === currentNodeId);

  if (currentIndex <= 0) {
    return null;
  }

  return flatNodes[currentIndex - 1].id;
}

/**
 * Handles left arrow key navigation
 */
function handleLeftArrow(tree: FlatTree, currentNode: TreeNode): string | null {
  // If node is expanded and has children, collapse it but stay focused
  if (currentNode.isExpanded && currentNode.children.length > 0) {
    return currentNode.id; // Stay on current node, but trigger collapse
  }

  // If node is collapsed or has no children, move to parent
  if (currentNode.parentId) {
    return currentNode.parentId;
  }

  // If we're at root level, no movement
  return null;
}

/**
 * Handles right arrow key navigation
 */
function handleRightArrow(tree: FlatTree, currentNode: TreeNode): string | null {
  // If node has children and is collapsed, expand it but stay focused
  if (currentNode.children.length > 0 && !currentNode.isExpanded) {
    return currentNode.id; // Stay on current node, but trigger expand
  }

  // If node is expanded and has children, move to first child
  if (currentNode.isExpanded && currentNode.children.length > 0) {
    return currentNode.children[0];
  }

  // No movement possible
  return null;
}

/**
 * Gets the first visible node in the tree
 */
export function getFirstVisibleNode(tree: FlatTree): string | null {
  const flatNodes = treeUtils.flattenTree(tree, true);
  return flatNodes.length > 0 ? flatNodes[0].id : null;
}

/**
 * Gets the last visible node in the tree
 */
export function getLastVisibleNode(tree: FlatTree): string | null {
  const flatNodes = treeUtils.flattenTree(tree, true);
  return flatNodes.length > 0 ? flatNodes[flatNodes.length - 1].id : null;
}

// =============================================================================
// Selection Utilities
// =============================================================================

/**
 * Handles range selection between two nodes
 */
export function getRangeSelection(
  tree: FlatTree,
  startNodeId: string,
  endNodeId: string
): Set<string> {
  const flatNodes = treeUtils.flattenTree(tree, true);
  const startIndex = flatNodes.findIndex(node => node.id === startNodeId);
  const endIndex = flatNodes.findIndex(node => node.id === endNodeId);

  if (startIndex === -1 || endIndex === -1) {
    return new Set();
  }

  const minIndex = Math.min(startIndex, endIndex);
  const maxIndex = Math.max(startIndex, endIndex);
  const selectedIds = new Set<string>();

  for (let i = minIndex; i <= maxIndex; i++) {
    selectedIds.add(flatNodes[i].id);
  }

  return selectedIds;
}

/**
 * Updates selection based on keyboard navigation
 */
export function updateSelectionForKeyboard(
  currentSelection: SelectionState,
  action: KeyboardAction,
  targetNodeId: string,
  tree: FlatTree
): SelectionState {
  switch (action) {
    case KeyboardAction.SELECT:
      return {
        ...currentSelection,
        selectedIds: new Set([targetNodeId]),
        lastSelectedId: targetNodeId,
      };

    case KeyboardAction.MULTI_SELECT:
      if (currentSelection.mode === SelectionMode.MULTIPLE) {
        const selectedIds = new Set(currentSelection.selectedIds);
        if (selectedIds.has(targetNodeId)) {
          selectedIds.delete(targetNodeId);
        } else {
          selectedIds.add(targetNodeId);
        }

        return {
          ...currentSelection,
          selectedIds,
          lastSelectedId: selectedIds.has(targetNodeId) ? targetNodeId : currentSelection.lastSelectedId,
        };
      }
      return currentSelection;

    case KeyboardAction.RANGE_SELECT:
      if (currentSelection.mode === SelectionMode.MULTIPLE && currentSelection.lastSelectedId) {
        const rangeSelection = getRangeSelection(
          tree,
          currentSelection.lastSelectedId,
          targetNodeId
        );

        return {
          ...currentSelection,
          selectedIds: rangeSelection,
          // Don't update lastSelectedId for range selection
        };
      }
      return currentSelection;

    default:
      return currentSelection;
  }
}

// =============================================================================
// Accessibility Helpers
// =============================================================================

/**
 * Gets ARIA attributes for tree navigation
 */
export function getAriaAttributes(
  node: TreeNode,
  tree: FlatTree,
  isFocused: boolean,
  isSelected: boolean
) {
  const position = treeUtils.getNodePosition(tree, node.id);
  const siblings = treeUtils.getSiblings(tree, node.id);

  return {
    role: 'treeitem',
    'aria-expanded': node.canHaveChildren ? node.isExpanded : undefined,
    'aria-selected': isSelected,
    'aria-level': node.depth + 1,
    'aria-setsize': siblings.length + 1, // Include self in count
    'aria-posinset': position ? position.index + 1 : 1,
    'aria-label': `${node.type} ${node.title}${node.description ? ': ' + node.description : ''}`,
    tabIndex: isFocused ? 0 : -1,
  };
}

/**
 * Gets keyboard shortcuts for accessibility
 */
export function getKeyboardShortcuts() {
  return {
    navigation: [
      { key: 'Arrow Keys', description: 'Navigate between nodes' },
      { key: 'Home', description: 'Go to first node' },
      { key: 'End', description: 'Go to last node' },
    ],
    expansion: [
      { key: 'Right Arrow', description: 'Expand node (or move to first child)' },
      { key: 'Left Arrow', description: 'Collapse node (or move to parent)' },
    ],
    selection: [
      { key: 'Enter/Space', description: 'Select node' },
      { key: 'Ctrl+Click', description: 'Multi-select (if enabled)' },
      { key: 'Shift+Arrow', description: 'Range select (if enabled)' },
    ],
    actions: [
      { key: 'Delete', description: 'Delete selected node(s)' },
      { key: 'F2', description: 'Rename node' },
      { key: 'Ctrl+C', description: 'Copy node' },
      { key: 'Ctrl+V', description: 'Paste node' },
    ],
  };
}

// =============================================================================
// Focus Management
// =============================================================================

/**
 * Scrolls a node into view if it's not currently visible
 */
export function scrollNodeIntoView(nodeId: string, container?: HTMLElement) {
  const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;

  if (!nodeElement) return;

  // Use the provided container or find the scrollable parent
  const scrollContainer = container || findScrollableParent(nodeElement);

  if (scrollContainer) {
    const containerRect = scrollContainer.getBoundingClientRect();
    const nodeRect = nodeElement.getBoundingClientRect();

    // Check if node is visible
    const isVisible =
      nodeRect.top >= containerRect.top &&
      nodeRect.bottom <= containerRect.bottom;

    if (!isVisible) {
      nodeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }
}

/**
 * Finds the scrollable parent of an element
 */
function findScrollableParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;

  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;

    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }

    parent = parent.parentElement;
  }

  return document.documentElement;
}

/**
 * Sets focus on a tree node
 */
export function focusNode(nodeId: string, scrollIntoView = true) {
  const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;

  if (nodeElement) {
    nodeElement.focus();

    if (scrollIntoView) {
      scrollNodeIntoView(nodeId);
    }
  }
}

// =============================================================================
// Export utilities
// =============================================================================

export const keyboardNavigation = {
  getKeyboardAction,
  getNextFocusableNode,
  getFirstVisibleNode,
  getLastVisibleNode,
  getRangeSelection,
  updateSelectionForKeyboard,
  getAriaAttributes,
  getKeyboardShortcuts,
  scrollNodeIntoView,
  focusNode,
};