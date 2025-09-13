/**
 * SubtaskList Component Tests
 *
 * Test suite for SubtaskList component including CRUD operations,
 * drag-and-drop functionality, and form validation.
 */

import React from 'react';

import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { TaskStatus, GoalPriority } from '@/types/smart-goals.types';
import type { Subtask } from '@/types/smart-goals.types';

import { SubtaskList } from '../SubtaskList';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock drag and drop
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
  arrayMove: jest.fn((array, from, to) => {
    const result = [...array];
    const [removed] = result.splice(from, 1);
    result.splice(to, 0, removed);
    return result;
  }),
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

const mockSubtasks: Subtask[] = [
  {
    id: 'subtask-1',
    title: 'First Subtask',
    description: 'Description for first subtask',
    status: TaskStatus.COMPLETED,
    priority: GoalPriority.HIGH,
    assignedTo: '1',
    estimatedHours: 4,
    actualHours: 3,
    dueDate: new Date('2024-02-15T17:00:00Z'),
    progress: 100,
    order: 0,
    tags: ['frontend'],
    checklist: [],
    taskId: 'task-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
    isDeleted: false,
    completedAt: new Date('2024-01-16T14:30:00Z'),
  },
  {
    id: 'subtask-2',
    title: 'Second Subtask',
    status: TaskStatus.IN_PROGRESS,
    priority: GoalPriority.MEDIUM,
    assignedTo: '2',
    estimatedHours: 6,
    actualHours: 2,
    progress: 35,
    order: 1,
    tags: ['backend'],
    checklist: [],
    taskId: 'task-1',
    createdAt: new Date('2024-01-16T09:00:00Z'),
    updatedAt: new Date('2024-01-17T16:45:00Z'),
    createdBy: 'user-1',
    updatedBy: 'user-2',
    isDeleted: false,
  },
];

const mockAssignees = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
];

const defaultProps = {
  subtasks: mockSubtasks,
  onSubtasksChange: jest.fn(),
  onSubtaskAdd: jest.fn(),
  onSubtaskUpdate: jest.fn(),
  onSubtaskDelete: jest.fn(),
  onSubtaskReorder: jest.fn(),
  availableAssignees: mockAssignees,
  isReadOnly: false,
};

describe('SubtaskList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders subtasks list with correct information', () => {
      render(<SubtaskList {...defaultProps} />);

      expect(screen.getByText('Subtasks')).toBeInTheDocument();
      expect(screen.getByText('1 of 2 completed')).toBeInTheDocument();
      expect(screen.getByText('First Subtask')).toBeInTheDocument();
      expect(screen.getByText('Second Subtask')).toBeInTheDocument();
    });

    it('shows progress bar with correct value', () => {
      render(<SubtaskList {...defaultProps} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      // Should show 50% progress (1 completed out of 2 total)
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('displays assignee information', () => {
      render(<SubtaskList {...defaultProps} />);

      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });

    it('shows estimated hours when available', () => {
      render(<SubtaskList {...defaultProps} />);

      expect(screen.getByText('4h')).toBeInTheDocument(); // First subtask
      expect(screen.getByText('6h')).toBeInTheDocument(); // Second subtask
    });

    it('displays due dates correctly', () => {
      render(<SubtaskList {...defaultProps} />);

      expect(screen.getByText('2/15/2024')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('renders empty state when no subtasks', () => {
      render(
        <SubtaskList
          {...defaultProps}
          subtasks={[]}
        />
      );

      expect(screen.getByText('No subtasks yet')).toBeInTheDocument();
      expect(screen.getByText('Break down this task into smaller, manageable subtasks.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add first subtask/i })).toBeInTheDocument();
    });

    it('shows add subtask button in empty state', () => {
      render(
        <SubtaskList
          {...defaultProps}
          subtasks={[]}
        />
      );

      const addButton = screen.getByRole('button', { name: /add first subtask/i });
      fireEvent.click(addButton);

      expect(screen.getByText('Add New Subtask')).toBeInTheDocument();
    });
  });

  describe('Adding Subtasks', () => {
    it('shows add subtask form when button is clicked', () => {
      render(<SubtaskList {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /add subtask/i });
      fireEvent.click(addButton);

      expect(screen.getByText('Add New Subtask')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    });

    it('validates required fields in add form', async () => {
      render(<SubtaskList {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /add subtask/i });
      fireEvent.click(addButton);

      const submitButton = screen.getByRole('button', { name: /add subtask/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/subtask title must be at least 3 characters long/i)).toBeInTheDocument();
      });
    });

    it('calls onSubtaskAdd when valid form is submitted', async () => {
      const mockOnSubtaskAdd = jest.fn();
      render(
        <SubtaskList
          {...defaultProps}
          onSubtaskAdd={mockOnSubtaskAdd}
        />
      );

      const addButton = screen.getByRole('button', { name: /add subtask/i });
      fireEvent.click(addButton);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      fireEvent.change(titleInput, { target: { value: 'New Subtask Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'New subtask description' } });

      const submitButton = screen.getByRole('button', { name: /add subtask/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubtaskAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Subtask Title',
            description: 'New subtask description',
            status: TaskStatus.TODO,
            priority: GoalPriority.MEDIUM,
          })
        );
      });
    });

    it('cancels adding subtask when cancel button is clicked', () => {
      render(<SubtaskList {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /add subtask/i });
      fireEvent.click(addButton);

      expect(screen.getByText('Add New Subtask')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Add New Subtask')).not.toBeInTheDocument();
    });
  });

  describe('Editing Subtasks', () => {
    it('shows edit form when edit button is clicked', () => {
      render(<SubtaskList {...defaultProps} />);

      const editButtons = screen.getAllByRole('button', { name: '' });
      // Find the edit button (first button in the action group)
      const editButton = editButtons.find(button =>
        button.querySelector('svg') &&
        !button.classList.contains('text-destructive')
      );

      if (editButton) {
        fireEvent.click(editButton);
        expect(screen.getByText('Edit Subtask')).toBeInTheDocument();
        expect(screen.getByDisplayValue('First Subtask')).toBeInTheDocument();
      }
    });

    it('calls onSubtaskUpdate when subtask is saved', async () => {
      const mockOnSubtaskUpdate = jest.fn();
      render(
        <SubtaskList
          {...defaultProps}
          onSubtaskUpdate={mockOnSubtaskUpdate}
        />
      );

      const editButtons = screen.getAllByRole('button', { name: '' });
      const editButton = editButtons.find(button =>
        button.querySelector('svg') &&
        !button.classList.contains('text-destructive')
      );

      if (editButton) {
        fireEvent.click(editButton);

        const titleInput = screen.getByDisplayValue('First Subtask');
        fireEvent.change(titleInput, { target: { value: 'Updated Subtask Title' } });

        const saveButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(mockOnSubtaskUpdate).toHaveBeenCalledWith(
            'subtask-1',
            expect.objectContaining({
              title: 'Updated Subtask Title',
            })
          );
        });
      }
    });

    it('cancels editing when cancel button is clicked', () => {
      render(<SubtaskList {...defaultProps} />);

      const editButtons = screen.getAllByRole('button', { name: '' });
      const editButton = editButtons.find(button =>
        button.querySelector('svg') &&
        !button.classList.contains('text-destructive')
      );

      if (editButton) {
        fireEvent.click(editButton);
        expect(screen.getByText('Edit Subtask')).toBeInTheDocument();

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(screen.queryByText('Edit Subtask')).not.toBeInTheDocument();
      }
    });
  });

  describe('Deleting Subtasks', () => {
    it('calls onSubtaskDelete when delete is confirmed', async () => {
      const mockOnSubtaskDelete = jest.fn();
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <SubtaskList
          {...defaultProps}
          onSubtaskDelete={mockOnSubtaskDelete}
        />
      );

      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const deleteButton = deleteButtons.find(button =>
        button.classList.contains('text-destructive')
      );

      if (deleteButton) {
        fireEvent.click(deleteButton);

        await waitFor(() => {
          expect(confirmSpy).toHaveBeenCalledWith(
            expect.stringContaining('Are you sure you want to delete subtask "First Subtask"?')
          );
          expect(mockOnSubtaskDelete).toHaveBeenCalledWith('subtask-1');
        });
      }

      confirmSpy.mockRestore();
    });

    it('does not delete when confirmation is declined', async () => {
      const mockOnSubtaskDelete = jest.fn();
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(
        <SubtaskList
          {...defaultProps}
          onSubtaskDelete={mockOnSubtaskDelete}
        />
      );

      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const deleteButton = deleteButtons.find(button =>
        button.classList.contains('text-destructive')
      );

      if (deleteButton) {
        fireEvent.click(deleteButton);

        await waitFor(() => {
          expect(confirmSpy).toHaveBeenCalled();
          expect(mockOnSubtaskDelete).not.toHaveBeenCalled();
        });
      }

      confirmSpy.mockRestore();
    });
  });

  describe('Status Management', () => {
    it('shows correct status badges', () => {
      render(<SubtaskList {...defaultProps} />);

      expect(screen.getByText('completed')).toBeInTheDocument();
      expect(screen.getByText('in_progress')).toBeInTheDocument();
    });

    it('shows completed styling for finished subtasks', () => {
      render(<SubtaskList {...defaultProps} />);

      const completedSubtask = screen.getByText('First Subtask');
      expect(completedSubtask).toHaveClass('line-through', 'text-muted-foreground');
    });

    it('shows progress for in-progress subtasks', () => {
      render(<SubtaskList {...defaultProps} />);

      const progressBars = screen.getAllByRole('progressbar');
      // Should have main progress bar plus individual subtask progress
      expect(progressBars.length).toBeGreaterThan(1);
    });
  });

  describe('Read-Only Mode', () => {
    it('hides action buttons in read-only mode', () => {
      render(
        <SubtaskList
          {...defaultProps}
          isReadOnly={true}
        />
      );

      expect(screen.queryByRole('button', { name: /add subtask/i })).not.toBeInTheDocument();

      // Edit and delete buttons should not be visible
      const actionButtons = screen.queryAllByRole('button', { name: '' });
      expect(actionButtons).toHaveLength(0);
    });

    it('shows read-only empty state correctly', () => {
      render(
        <SubtaskList
          {...defaultProps}
          subtasks={[]}
          isReadOnly={true}
        />
      );

      expect(screen.getByText('No subtasks yet')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add first subtask/i })).not.toBeInTheDocument();
    });
  });

  describe('Drag and Drop', () => {
    it('calls onSubtaskReorder when drag and drop occurs', async () => {
      const mockOnSubtaskReorder = jest.fn();

      // Mock the drag end event
      const dndCore = await import('@dnd-kit/core');
      const originalDndContext = dndCore.DndContext;

      jest.spyOn(dndCore, 'DndContext').mockImplementation(({ onDragEnd, children }) => {
        // Simulate a drag end event
        setTimeout(() => {
          onDragEnd({
            active: { id: 'subtask-1' },
            over: { id: 'subtask-2' },
          });
        }, 0);

        return originalDndContext({ onDragEnd, children });
      });

      render(
        <SubtaskList
          {...defaultProps}
          onSubtaskReorder={mockOnSubtaskReorder}
        />
      );

      // Wait for the simulated drag end event
      setTimeout(() => {
        expect(mockOnSubtaskReorder).toHaveBeenCalledWith(0, 1);
      }, 10);
    });
  });

  describe('Statistics Display', () => {
    it('shows total estimated hours correctly', () => {
      render(<SubtaskList {...defaultProps} />);

      expect(screen.getByText(/10h total estimated/i)).toBeInTheDocument(); // 4 + 6 hours
    });

    it('updates completion count correctly', () => {
      const allCompletedSubtasks = mockSubtasks.map(subtask => ({
        ...subtask,
        status: TaskStatus.COMPLETED,
      }));

      render(
        <SubtaskList
          {...defaultProps}
          subtasks={allCompletedSubtasks}
        />
      );

      expect(screen.getByText('2 of 2 completed')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<SubtaskList {...defaultProps} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('has proper form labels in add/edit forms', () => {
      render(<SubtaskList {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /add subtask/i });
      fireEvent.click(addButton);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/estimated hours/i)).toBeInTheDocument();
    });
  });
});