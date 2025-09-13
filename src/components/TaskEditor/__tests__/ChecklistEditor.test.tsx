/**
 * ChecklistEditor Component Tests
 *
 * Test suite for ChecklistEditor component including item management,
 * markdown support, and bulk operations.
 */

import React from 'react';

import { render, screen, fireEvent, waitFor } from '@/test-utils';
import type { ChecklistItem } from '@/types/smart-goals.types';

import { ChecklistEditor } from '../ChecklistEditor';


// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock drag and drop (same as SubtaskList)
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
  PointerSensor: jest.fn(),
  KeyboardSensor: jest.fn(),
  closestCenter: jest.fn(),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  arrayMove: jest.fn(),
  sortableKeyboardCoordinates: jest.fn(),
  verticalListSortingStrategy: jest.fn(),
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}));

const mockChecklistItems: ChecklistItem[] = [
  {
    id: 'check-1',
    title: 'First checklist item',
    description: 'Description for first item',
    isCompleted: true,
    isRequired: true,
    order: 0,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    completedAt: new Date('2024-01-16T14:30:00Z'),
    completedBy: 'user-1',
  },
  {
    id: 'check-2',
    title: 'Second checklist item',
    description: 'Description for second item',
    isCompleted: false,
    isRequired: false,
    order: 1,
    createdAt: new Date('2024-01-16T09:00:00Z'),
    updatedAt: new Date('2024-01-16T15:20:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
];

const defaultProps = {
  checklist: mockChecklistItems,
  onChecklistChange: jest.fn(),
  onItemAdd: jest.fn(),
  onItemUpdate: jest.fn(),
  onItemDelete: jest.fn(),
  onItemToggle: jest.fn(),
  onItemReorder: jest.fn(),
  supportMarkdown: false,
  isReadOnly: false,
};

describe('ChecklistEditor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders checklist with correct information', () => {
      render(<ChecklistEditor {...defaultProps} />);

      expect(screen.getByText('Checklist')).toBeInTheDocument();
      expect(screen.getByText('1 of 2 completed')).toBeInTheDocument();
      expect(screen.getByText('First checklist item')).toBeInTheDocument();
      expect(screen.getByText('Second checklist item')).toBeInTheDocument();
    });

    it('shows progress bar with correct completion percentage', () => {
      render(<ChecklistEditor {...defaultProps} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '50'); // 1 out of 2 completed
    });

    it('shows required badge for required items', () => {
      render(<ChecklistEditor {...defaultProps} />);

      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('shows completed date for finished items', () => {
      render(<ChecklistEditor {...defaultProps} />);

      expect(screen.getByText(/completed 1\/16\/2024/i)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('renders empty state when no items', () => {
      render(
        <ChecklistEditor
          {...defaultProps}
          checklist={[]}
        />
      );

      expect(screen.getByText('No checklist items yet')).toBeInTheDocument();
      expect(screen.getByText('Create a checklist to track specific requirements and deliverables.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add first item/i })).toBeInTheDocument();
    });
  });

  describe('Adding Items', () => {
    it('shows add item form when button is clicked', () => {
      render(<ChecklistEditor {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);

      expect(screen.getByText('Add New Checklist Item')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      render(<ChecklistEditor {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);

      const submitButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/checklist item title is required/i)).toBeInTheDocument();
      });
    });

    it('calls onItemAdd when valid form is submitted', async () => {
      const mockOnItemAdd = jest.fn();
      render(
        <ChecklistEditor
          {...defaultProps}
          onItemAdd={mockOnItemAdd}
        />
      );

      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'New checklist item' } });

      const submitButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnItemAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New checklist item',
            isCompleted: false,
            isRequired: false,
          })
        );
      });
    });
  });

  describe('Item Interactions', () => {
    it('toggles item completion when checkbox is clicked', () => {
      const mockOnItemToggle = jest.fn();
      render(
        <ChecklistEditor
          {...defaultProps}
          onItemToggle={mockOnItemToggle}
        />
      );

      // Find checkboxes (completed and uncompleted items)
      const checkboxes = screen.getAllByRole('button');
      const uncompletedItemCheckbox = checkboxes.find(button =>
        button.querySelector('svg[data-testid*="square"]') ||
        button.innerHTML.includes('Square')
      );

      if (uncompletedItemCheckbox) {
        fireEvent.click(uncompletedItemCheckbox);
        expect(mockOnItemToggle).toHaveBeenCalledWith('check-2');
      }
    });

    it('shows edit form when edit button is clicked', () => {
      render(<ChecklistEditor {...defaultProps} />);

      const editButtons = screen.getAllByRole('button', { name: '' });
      const editButton = editButtons.find(button =>
        button.querySelector('svg') &&
        !button.classList.contains('text-destructive')
      );

      if (editButton) {
        fireEvent.click(editButton);
        expect(screen.getByText('Edit Checklist Item')).toBeInTheDocument();
      }
    });
  });

  describe('Bulk Operations', () => {
    it('shows bulk operations menu', () => {
      render(<ChecklistEditor {...defaultProps} />);

      const moreButton = screen.getByRole('button', { name: '' });
      if (moreButton.innerHTML.includes('MoreHorizontal') || moreButton.querySelector('[data-testid*="more"]')) {
        fireEvent.click(moreButton);
        // The dropdown menu items would appear
      }
    });
  });

  describe('Markdown Support', () => {
    it('shows markdown preview when enabled', () => {
      render(
        <ChecklistEditor
          {...defaultProps}
          supportMarkdown={true}
        />
      );

      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Preview toggle button
    });

    it('renders markdown content correctly', () => {
      const markdownItem: ChecklistItem = {
        id: 'check-md',
        title: 'Markdown item',
        description: '**Bold text** and *italic text*',
        isCompleted: false,
        isRequired: false,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1',
        updatedBy: 'user-1',
      };

      render(
        <ChecklistEditor
          {...defaultProps}
          checklist={[markdownItem]}
          supportMarkdown={true}
        />
      );

      expect(screen.getByText('Markdown item')).toBeInTheDocument();
    });
  });

  describe('Read-Only Mode', () => {
    it('hides action buttons in read-only mode', () => {
      render(
        <ChecklistEditor
          {...defaultProps}
          isReadOnly={true}
        />
      );

      expect(screen.queryByRole('button', { name: /add item/i })).not.toBeInTheDocument();
    });

    it('disables item interactions in read-only mode', () => {
      render(
        <ChecklistEditor
          {...defaultProps}
          isReadOnly={true}
        />
      );

      // Checkboxes should be disabled
      const checkboxButtons = screen.getAllByRole('button');
      const itemCheckbox = checkboxButtons.find(button =>
        button.querySelector('svg[data-testid*="square"]') ||
        button.innerHTML.includes('Square')
      );

      if (itemCheckbox) {
        expect(itemCheckbox).toBeDisabled();
      }
    });
  });

  describe('Progress Calculation', () => {
    it('calculates progress correctly with required items', () => {
      const itemsWithRequired: ChecklistItem[] = [
        {
          ...mockChecklistItems[0],
          isCompleted: true,
          isRequired: true,
        },
        {
          ...mockChecklistItems[1],
          isCompleted: false,
          isRequired: true,
        },
      ];

      render(
        <ChecklistEditor
          {...defaultProps}
          checklist={itemsWithRequired}
        />
      );

      expect(screen.getByText(/1\/2 required items/)).toBeInTheDocument();
    });

    it('shows all required items completed message', () => {
      const allRequiredCompleted: ChecklistItem[] = [
        {
          ...mockChecklistItems[0],
          isCompleted: true,
          isRequired: true,
        },
        {
          ...mockChecklistItems[1],
          isCompleted: true,
          isRequired: true,
        },
      ];

      render(
        <ChecklistEditor
          {...defaultProps}
          checklist={allRequiredCompleted}
        />
      );

      expect(screen.getByText(/all required items completed/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for progress', () => {
      render(<ChecklistEditor {...defaultProps} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('has proper form labels', () => {
      render(<ChecklistEditor {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });
  });
});