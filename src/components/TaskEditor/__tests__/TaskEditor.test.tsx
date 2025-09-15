/**
 * TaskEditor Component Tests
 *
 * Comprehensive test suite for the TaskEditor component including
 * form validation, user interactions, and edge cases.
 */

import React from 'react';

import { render, screen, fireEvent, waitFor, act } from '@/test-utils';
import { TaskStatus, GoalPriority } from '@/types/smart-goals.types';
import type { Task } from '@/types/smart-goals.types';

import { TaskEditor } from '../TaskEditor';
import { TaskEditorMode } from '../TaskEditor.types';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((date, _formatStr) => date.toISOString().slice(0, 16)),
  isAfter: jest.fn(() => true),
  isBefore: jest.fn(() => false),
  addDays: jest.fn(
    (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
  ),
}));

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test description',
  status: TaskStatus.TODO,
  priority: GoalPriority.MEDIUM,
  estimatedHours: 5,
  tags: ['test'],
  subtasks: [],
  checklist: [],
  dependencies: [],
  goalId: 'goal-1',
  order: 0,
  progress: 0,
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
  createdBy: 'user-1',
  updatedBy: 'user-1',
  isDeleted: false,
};

const mockAssignees = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

const defaultProps = {
  goalId: 'goal-1',
  onSave: jest.fn(),
  onCancel: jest.fn(),
  onDelete: jest.fn(),
  onStatusChange: jest.fn(),
  availableAssignees: mockAssignees,
  availableTasks: [],
  templates: [],
  autoSave: false,
};

describe('TaskEditor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('renders empty form in create mode', () => {
      render(<TaskEditor {...defaultProps} mode={TaskEditorMode.CREATE} />);

      expect(screen.getByText('Create Task')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
      expect(
        screen.getByRole('button', { name: /save task/i })
      ).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      render(<TaskEditor {...defaultProps} mode={TaskEditorMode.CREATE} />);

      const saveButton = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText(/title must be at least 3 characters long/i)
        ).toBeInTheDocument();
      });
    });

    it('calls onSave with correct data when form is submitted', async () => {
      const mockOnSave = jest.fn();
      render(
        <TaskEditor
          {...defaultProps}
          mode={TaskEditorMode.CREATE}
          onSave={mockOnSave as any}
        />
      );

      // Fill in the form
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      fireEvent.change(titleInput, { target: { value: 'New Test Task' } });
      fireEvent.change(descriptionInput, {
        target: { value: 'Test description' },
      });

      const saveButton = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Test Task',
            description: 'Test description',
            status: TaskStatus.TODO,
            priority: GoalPriority.MEDIUM,
            goalId: 'goal-1',
          })
        );
      });
    });
  });

  describe('Edit Mode', () => {
    it('renders populated form in edit mode', () => {
      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.EDIT}
        />
      );

      expect(screen.getByText('Edit Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();
    });

    it('shows task progress and statistics', () => {
      const taskWithProgress = {
        ...mockTask,
        progress: 75,
        estimatedHours: 10,
        subtasks: [
          {
            ...mockTask,
            id: 'subtask-1',
            title: 'Subtask 1',
            status: TaskStatus.COMPLETED,
            taskId: 'task-1',
          },
        ],
        checklist: [
          {
            id: 'check-1',
            title: 'Checklist item',
            isCompleted: true,
            isRequired: true,
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'user-1',
            updatedBy: 'user-1',
          },
        ],
      };

      render(
        <TaskEditor
          {...defaultProps}
          task={taskWithProgress}
          mode={TaskEditorMode.EDIT}
        />
      );

      expect(screen.getByText(/progress:/)).toBeInTheDocument();
      expect(screen.getByText(/subtasks: 1\/1/)).toBeInTheDocument();
      expect(screen.getByText(/checklist: 1\/1/)).toBeInTheDocument();
    });

    it('handles delete action with confirmation', async () => {
      const mockOnDelete = jest.fn();

      // Mock window.confirm
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.EDIT}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(confirmSpy).toHaveBeenCalledWith(
          expect.stringContaining('Are you sure you want to delete')
        );
        expect(mockOnDelete).toHaveBeenCalledWith('task-1');
      });

      confirmSpy.mockRestore();
    });

    it('cancels delete when confirmation is declined', async () => {
      const mockOnDelete = jest.fn();

      // Mock window.confirm to return false
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.EDIT}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(confirmSpy).toHaveBeenCalled();
        expect(mockOnDelete).not.toHaveBeenCalled();
      });

      confirmSpy.mockRestore();
    });
  });

  describe('Form Validation', () => {
    it('validates title length', async () => {
      render(<TaskEditor {...defaultProps} mode={TaskEditorMode.CREATE} />);

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'A' } }); // Too short

      const saveButton = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText(/title must be at least 3 characters long/i)
        ).toBeInTheDocument();
      });
    });

    it('validates estimated hours', async () => {
      render(<TaskEditor {...defaultProps} mode={TaskEditorMode.CREATE} />);

      const titleInput = screen.getByLabelText(/title/i);
      const estimatedHoursInput = screen.getByLabelText(/estimated hours/i);

      fireEvent.change(titleInput, { target: { value: 'Valid Task Title' } });
      fireEvent.change(estimatedHoursInput, { target: { value: '-5' } }); // Invalid

      const saveButton = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText(/estimated hours must be at least/i)
        ).toBeInTheDocument();
      });
    });

    it('validates description length', async () => {
      render(<TaskEditor {...defaultProps} mode={TaskEditorMode.CREATE} />);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      fireEvent.change(titleInput, { target: { value: 'Valid Task Title' } });
      fireEvent.change(descriptionInput, {
        target: { value: 'A'.repeat(501) },
      }); // Too long

      const saveButton = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText(/description must be less than 500 characters/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    it('switches between tabs correctly', () => {
      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.EDIT}
        />
      );

      // Check default tab is active
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();

      // Click subtasks tab
      const subtasksTab = screen.getByRole('tab', { name: /subtasks/i });
      fireEvent.click(subtasksTab);

      expect(screen.getByText(/no subtasks yet/i)).toBeInTheDocument();

      // Click checklist tab
      const checklistTab = screen.getByRole('tab', { name: /checklist/i });
      fireEvent.click(checklistTab);

      expect(screen.getByText(/no checklist items yet/i)).toBeInTheDocument();

      // Click acceptance criteria tab
      const acceptanceTab = screen.getByRole('tab', {
        name: /acceptance criteria/i,
      });
      fireEvent.click(acceptanceTab);

      expect(
        screen.getByText(/define clear, testable requirements/i)
      ).toBeInTheDocument();
    });
  });

  describe('Status Management', () => {
    it('updates status when changed', async () => {
      const mockOnStatusChange = jest.fn();

      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.EDIT}
          onStatusChange={mockOnStatusChange}
        />
      );

      const statusSelect = screen.getByDisplayValue('todo');
      fireEvent.change(statusSelect, {
        target: { value: TaskStatus.IN_PROGRESS },
      });

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith(
          'task-1',
          TaskStatus.TODO,
          TaskStatus.IN_PROGRESS
        );
      });
    });
  });

  describe('Auto-save Functionality', () => {
    it('triggers auto-save when enabled', async () => {
      const mockOnSave = jest.fn();

      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.EDIT}
          onSave={mockOnSave as any}
          autoSave={true}
          autoSaveDelay={100}
        />
      );

      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: 'Updated Test Task' } });

      // Wait for auto-save delay plus some buffer
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      expect(mockOnSave).toHaveBeenCalled();
    });

    it('does not auto-save in create mode', async () => {
      const mockOnSave = jest.fn();

      render(
        <TaskEditor
          {...defaultProps}
          mode={TaskEditorMode.CREATE}
          onSave={mockOnSave as any}
          autoSave={true}
          autoSaveDelay={100}
        />
      );

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'New Task Title' } });

      // Wait for auto-save delay
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Functionality', () => {
    it('calls onCancel without confirmation when no changes', () => {
      const mockOnCancel = jest.fn();

      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.EDIT}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('shows confirmation dialog when there are unsaved changes', () => {
      const mockOnCancel = jest.fn();
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.EDIT}
          onCancel={mockOnCancel}
        />
      );

      // Make a change to make the form dirty
      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: 'Changed Title' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(confirmSpy).toHaveBeenCalledWith(
        expect.stringContaining('You have unsaved changes')
      );
      expect(mockOnCancel).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });

  describe('View Mode', () => {
    it('disables editing in view mode', () => {
      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.VIEW}
        />
      );

      const titleInput = screen.getByDisplayValue('Test Task');
      expect(titleInput).toBeDisabled();

      expect(
        screen.queryByRole('button', { name: /save/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /delete/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for form inputs', () => {
      render(<TaskEditor {...defaultProps} mode={TaskEditorMode.CREATE} />);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    });

    it('shows validation errors with proper ARIA attributes', async () => {
      render(<TaskEditor {...defaultProps} mode={TaskEditorMode.CREATE} />);

      const saveButton = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i);
        const errorMessage = screen.getByText(
          /title must be at least 3 characters long/i
        );

        expect(titleInput).toHaveAttribute('aria-invalid', 'true');
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles save errors gracefully', async () => {
      const mockOnSave = jest.fn().mockRejectedValue(new Error('Save failed'));

      render(
        <TaskEditor
          {...defaultProps}
          mode={TaskEditorMode.CREATE}
          onSave={mockOnSave as any}
        />
      );

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'Valid Task Title' } });

      const saveButton = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
        // The component should handle the error and not crash
        expect(
          screen.getByRole('button', { name: /save task/i })
        ).toBeInTheDocument();
      });
    });

    it('handles delete errors gracefully', async () => {
      const mockOnDelete = jest
        .fn()
        .mockRejectedValue(new Error('Delete failed'));
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <TaskEditor
          {...defaultProps}
          task={mockTask}
          mode={TaskEditorMode.EDIT}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalled();
        // The component should handle the error and not crash
        expect(
          screen.getByRole('button', { name: /delete/i })
        ).toBeInTheDocument();
      });

      confirmSpy.mockRestore();
    });
  });

  describe('Loading States', () => {
    it('shows saving state when form is being submitted', async () => {
      const mockOnSave = jest.fn(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(
        <TaskEditor
          {...defaultProps}
          mode={TaskEditorMode.CREATE}
          onSave={mockOnSave as any}
        />
      );

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: 'Valid Task Title' } });

      const saveButton = screen.getByRole('button', { name: /save task/i });
      fireEvent.click(saveButton);

      expect(screen.getByText(/saving.../i)).toBeInTheDocument();
      expect(saveButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByText(/saving.../i)).not.toBeInTheDocument();
      });
    });
  });
});
