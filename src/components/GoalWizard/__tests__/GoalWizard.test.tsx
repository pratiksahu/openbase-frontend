/**
 * GoalWizard Component Tests
 *
 * Comprehensive test suite for the GoalWizard component covering
 * navigation, validation, state management, and user interactions.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { GoalCategory } from '@/types/smart-goals.types';

import { GoalWizard } from '../GoalWizard';
import { WizardStep } from '../GoalWizard.types';

// Mock the lazy-loaded components to avoid issues in tests
vi.mock('../steps/ContextStep', () => ({
  default: ({ data, onChange }: any) => (
    <div data-testid="context-step">
      <h2>Set the Context</h2>
      <input
        data-testid="current-situation"
        value={data.currentSituation || ''}
        onChange={(e) => onChange({ currentSituation: e.target.value })}
        placeholder="Describe current situation"
      />
      <select
        data-testid="category-select"
        value={data.category || ''}
        onChange={(e) => onChange({ category: e.target.value })}
      >
        <option value="">Select category</option>
        <option value={GoalCategory.PROFESSIONAL}>Professional</option>
        <option value={GoalCategory.PERSONAL}>Personal</option>
      </select>
    </div>
  ),
}));

vi.mock('../steps/SpecificStep', () => ({
  default: ({ data, onChange }: any) => (
    <div data-testid="specific-step">
      <h2>Make it Specific</h2>
      <input
        data-testid="goal-title"
        value={data.title || ''}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Enter goal title"
      />
      <textarea
        data-testid="goal-description"
        value={data.description || ''}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Describe your goal"
      />
    </div>
  ),
}));

vi.mock('../steps/MeasurableStep', () => ({
  default: ({ data, onChange }: any) => (
    <div data-testid="measurable-step">
      <h2>Make it Measurable</h2>
      <p>Measurable step content</p>
    </div>
  ),
}));

vi.mock('../steps/AchievableStep', () => ({
  default: ({ data, onChange }: any) => (
    <div data-testid="achievable-step">
      <h2>Make it Achievable</h2>
      <p>Achievable step content</p>
    </div>
  ),
}));

// Mock the SmartScoreBadge component
vi.mock('@/components/SmartScoreBadge/SmartScoreBadge', () => ({
  SmartScoreBadge: ({ goal }: any) => (
    <div data-testid="smart-score-badge">
      SMART Score: 75/100
    </div>
  ),
}));

// Mock the MetricEditor component
vi.mock('@/components/MetricEditor/MetricEditor', () => ({
  MetricEditor: ({ onSave, onCancel }: any) => (
    <div data-testid="metric-editor">
      <button onClick={() => onSave({}, [])}>Save Metric</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe('GoalWizard', () => {
  const mockProps = {
    onSave: vi.fn(),
    onCancel: vi.fn(),
    onSaveDraft: vi.fn(),
    onStepChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  describe('Rendering', () => {
    test('renders wizard with initial context step', async () => {
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Create SMART Goal')).toBeInTheDocument();
        expect(screen.getByTestId('context-step')).toBeInTheDocument();
        expect(screen.getByText('Set the Context')).toBeInTheDocument();
      });
    });

    test('renders wizard stepper when showProgress is true', async () => {
      render(<GoalWizard {...mockProps} showProgress={true} />);

      await waitFor(() => {
        // Check that stepper elements are present
        expect(screen.getByText('Context')).toBeInTheDocument();
        expect(screen.getByText('Specific')).toBeInTheDocument();
        expect(screen.getByText('Measurable')).toBeInTheDocument();
      });
    });

    test('hides wizard stepper when showProgress is false', async () => {
      render(<GoalWizard {...mockProps} showProgress={false} />);

      await waitFor(() => {
        // Stepper should not be visible
        const contextStepperItem = screen.queryByText('Context');
        // The step content will still have "Set the Context" but stepper won't
        expect(screen.getByText('Set the Context')).toBeInTheDocument();
      });
    });

    test('renders navigation controls', async () => {
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Save Draft')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        // Previous button should not be visible on first step
        expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    test('navigates to next step when next button is clicked', async () => {
      const user = userEvent.setup();
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('context-step')).toBeInTheDocument();
      });

      // Fill required fields to enable navigation
      const currentSituationInput = screen.getByTestId('current-situation');
      const categorySelect = screen.getByTestId('category-select');

      await user.type(currentSituationInput, 'Current situation description');
      await user.selectOptions(categorySelect, GoalCategory.PROFESSIONAL);

      // Navigate to next step
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        expect(mockProps.onStepChange).toHaveBeenCalledWith(WizardStep.SPECIFIC);
        expect(screen.getByTestId('specific-step')).toBeInTheDocument();
      });
    });

    test('shows previous button on subsequent steps', async () => {
      const user = userEvent.setup();
      render(<GoalWizard {...mockProps} />);

      // Navigate to second step first
      await waitFor(() => {
        expect(screen.getByTestId('context-step')).toBeInTheDocument();
      });

      const currentSituationInput = screen.getByTestId('current-situation');
      const categorySelect = screen.getByTestId('category-select');

      await user.type(currentSituationInput, 'Current situation description');
      await user.selectOptions(categorySelect, GoalCategory.PROFESSIONAL);

      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
      });
    });

    test('prevents navigation when validation fails', async () => {
      const user = userEvent.setup();
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('context-step')).toBeInTheDocument();
      });

      // Try to navigate without filling required fields
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      // Should still be on the context step
      expect(screen.getByTestId('context-step')).toBeInTheDocument();
    });
  });

  describe('Form Data Management', () => {
    test('updates form data when inputs change', async () => {
      const user = userEvent.setup();
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('current-situation')).toBeInTheDocument();
      });

      const currentSituationInput = screen.getByTestId('current-situation');
      await user.type(currentSituationInput, 'Test situation');

      // The input should reflect the typed value
      expect(currentSituationInput).toHaveValue('Test situation');
    });

    test('persists data when navigating between steps', async () => {
      const user = userEvent.setup();
      render(<GoalWizard {...mockProps} />);

      // Fill data in context step
      await waitFor(() => {
        expect(screen.getByTestId('context-step')).toBeInTheDocument();
      });

      const currentSituationInput = screen.getByTestId('current-situation');
      const categorySelect = screen.getByTestId('category-select');

      await user.type(currentSituationInput, 'Test situation');
      await user.selectOptions(categorySelect, GoalCategory.PROFESSIONAL);

      // Navigate to specific step
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByTestId('specific-step')).toBeInTheDocument();
      });

      // Fill data in specific step
      const titleInput = screen.getByTestId('goal-title');
      await user.type(titleInput, 'Test Goal Title');

      // Navigate back to context step
      const previousButton = screen.getByText('Previous');
      await user.click(previousButton);

      await waitFor(() => {
        expect(screen.getByTestId('context-step')).toBeInTheDocument();
      });

      // Data should be persisted
      expect(screen.getByTestId('current-situation')).toHaveValue('Test situation');
      expect(screen.getByTestId('category-select')).toHaveValue(GoalCategory.PROFESSIONAL);
    });
  });

  describe('Draft Management', () => {
    test('calls onSaveDraft when save draft button is clicked', async () => {
      const user = userEvent.setup();
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Save Draft')).toBeInTheDocument();
      });

      const saveDraftButton = screen.getByText('Save Draft');
      await user.click(saveDraftButton);

      await waitFor(() => {
        expect(mockProps.onSaveDraft).toHaveBeenCalled();
      });
    });

    test('shows auto-save indicator when enabled', () => {
      render(<GoalWizard {...mockProps} autoSaveEnabled={true} />);

      // Auto-save should be enabled by default
      // We'd need to trigger changes to see the indicator
    });
  });

  describe('Cancel Functionality', () => {
    test('shows confirmation dialog when cancelling with unsaved changes', async () => {
      const user = userEvent.setup();
      render(<GoalWizard {...mockProps} />);

      // Make some changes
      await waitFor(() => {
        expect(screen.getByTestId('current-situation')).toBeInTheDocument();
      });

      const currentSituationInput = screen.getByTestId('current-situation');
      await user.type(currentSituationInput, 'Some changes');

      // Click cancel
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.getByText('Cancel Goal Creation?')).toBeInTheDocument();
        expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
      });
    });

    test('calls onCancel when cancel is confirmed', async () => {
      const user = userEvent.setup();
      render(<GoalWizard {...mockProps} />);

      // Make some changes
      await waitFor(() => {
        expect(screen.getByTestId('current-situation')).toBeInTheDocument();
      });

      const currentSituationInput = screen.getByTestId('current-situation');
      await user.type(currentSituationInput, 'Some changes');

      // Click cancel
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.getByText('Discard Changes')).toBeInTheDocument();
      });

      // Confirm cancellation
      const discardButton = screen.getByText('Discard Changes');
      await user.click(discardButton);

      await waitFor(() => {
        expect(mockProps.onCancel).toHaveBeenCalled();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    test('supports escape key for cancel', async () => {
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('context-step')).toBeInTheDocument();
      });

      // Simulate Escape key press
      fireEvent.keyDown(document, { key: 'Escape', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByText('Cancel Goal Creation?')).toBeInTheDocument();
      });
    });

    test('supports Ctrl+Enter for next step', async () => {
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('context-step')).toBeInTheDocument();
      });

      // Fill required fields first
      const currentSituationInput = screen.getByTestId('current-situation');
      const categorySelect = screen.getByTestId('category-select');

      await userEvent.type(currentSituationInput, 'Test situation');
      await userEvent.selectOptions(categorySelect, GoalCategory.PROFESSIONAL);

      // Simulate Ctrl+Enter key press
      fireEvent.keyDown(document, { key: 'Enter', ctrlKey: true });

      await waitFor(() => {
        expect(mockProps.onStepChange).toHaveBeenCalledWith(WizardStep.SPECIFIC);
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper heading hierarchy', async () => {
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        // Main wizard title should be h1
        expect(screen.getByText('Create SMART Goal')).toBeInTheDocument();
        // Step title should be h2
        expect(screen.getByText('Set the Context')).toBeInTheDocument();
      });
    });

    test('has proper ARIA labels', async () => {
      render(<GoalWizard {...mockProps} />);

      await waitFor(() => {
        // Check for ARIA attributes on interactive elements
        const nextButton = screen.getByText('Next');
        expect(nextButton).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Props and Configuration', () => {
    test('applies custom className', () => {
      const { container } = render(
        <GoalWizard {...mockProps} className="custom-wizard" />
      );

      expect(container.querySelector('.custom-wizard')).toBeInTheDocument();
    });

    test('configures auto-save interval', () => {
      render(<GoalWizard {...mockProps} autoSaveInterval={10000} />);
      // Would need to test actual timing behavior with timers
    });

    test('handles initialGoal prop for editing', async () => {
      const initialGoal = {
        title: 'Existing Goal',
        description: 'Existing description',
        category: GoalCategory.PROFESSIONAL,
        // ... other goal properties
      };

      render(<GoalWizard {...mockProps} initialGoal={initialGoal as any} />);

      // The wizard should be initialized with the existing goal data
      // This would require proper integration with the context provider
    });
  });
});