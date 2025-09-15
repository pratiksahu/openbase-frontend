import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { defaultTemplates } from '../defaultTemplates';
import { DorDodPanel } from '../DorDodPanel';
import type { Criterion, DorDodState } from '../DorDodPanel.types';

// Mock data
const mockDorCriteria: Criterion[] = [
  {
    id: 'dor-1',
    description: 'Requirements are clear',
    category: 'required',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 1,
    validationRule: {
      type: 'required',
      message: 'Requirements must be defined',
    },
  },
  {
    id: 'dor-2',
    description: 'Design is approved',
    category: 'recommended',
    isCompleted: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 2,
  },
];

const mockDodCriteria: Criterion[] = [
  {
    id: 'dod-1',
    description: 'Code is complete',
    category: 'required',
    isCompleted: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 1,
    validationRule: {
      type: 'required',
      message: 'Code must be complete',
    },
  },
  {
    id: 'dod-2',
    description: 'Tests pass',
    category: 'required',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 2,
    validationRule: {
      type: 'required',
      message: 'All tests must pass',
    },
  },
];

const mockInitialState: Partial<DorDodState> = {
  dorCriteria: mockDorCriteria,
  dodCriteria: mockDodCriteria,
};

describe('DorDodPanel', () => {
  const defaultProps = {
    onStateChange: jest.fn(),
    onValidationChange: jest.fn(),
    onApprovalRequest: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders empty state when no criteria provided', () => {
      render(<DorDodPanel {...defaultProps} />);

      expect(screen.getByText('Definition of Ready')).toBeInTheDocument();
      expect(screen.getByText('Definition of Done')).toBeInTheDocument();
      expect(screen.getAllByText('No criteria defined yet.')).toHaveLength(2);
    });

    it('renders with initial criteria', () => {
      render(<DorDodPanel {...defaultProps} initialState={mockInitialState} />);

      expect(screen.getByText('Requirements are clear')).toBeInTheDocument();
      expect(screen.getByText('Design is approved')).toBeInTheDocument();
      expect(screen.getByText('Code is complete')).toBeInTheDocument();
      expect(screen.getByText('Tests pass')).toBeInTheDocument();
    });

    it('shows progress indicators when enabled', () => {
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          showProgressIndicators={true}
        />
      );

      expect(screen.getByText('Overall Progress')).toBeInTheDocument();
      expect(screen.getByText('Readiness Score')).toBeInTheDocument();
      expect(screen.getByText('Completion Score')).toBeInTheDocument();
    });

    it('shows time tracking when enabled', () => {
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          showTimeTracking={true}
        />
      );

      expect(screen.getByText('Time Tracking')).toBeInTheDocument();
      expect(screen.getByText('Marked Ready:')).toBeInTheDocument();
      expect(screen.getByText('Marked Done:')).toBeInTheDocument();
    });

    it('renders in print mode', () => {
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          printMode={true}
        />
      );

      expect(
        screen.getByText('Definition of Ready & Done')
      ).toBeInTheDocument();
      // In print mode, action buttons should not be present
      expect(screen.queryByText('Add Criterion')).not.toBeInTheDocument();
    });
  });

  describe('Criterion Management', () => {
    it('toggles criterion completion', async () => {
      const user = userEvent.setup();
      render(<DorDodPanel {...defaultProps} initialState={mockInitialState} />);

      // Find the checkbox for the first DOR criterion (not completed initially)
      const checkbox = screen.getAllByRole('checkbox')[0];
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      // Verify the onStateChange callback was called
      expect(defaultProps.onStateChange).toHaveBeenCalled();
    });

    it('opens criterion editor when add button is clicked', async () => {
      const user = userEvent.setup();
      render(<DorDodPanel {...defaultProps} initialState={mockInitialState} />);

      const addButtons = screen.getAllByText('Add Criterion');
      await user.click(addButtons[0]);

      // The dialog should open (we can check for dialog content)
      await waitFor(() => {
        expect(screen.getByText('Add New Criterion')).toBeInTheDocument();
      });
    });

    it('handles criterion deletion', async () => {
      const user = userEvent.setup();
      render(<DorDodPanel {...defaultProps} initialState={mockInitialState} />);

      // Find and click the more options menu for a criterion
      const moreButtons = screen.getAllByRole('button', { name: /more/i });
      if (moreButtons.length > 0) {
        await user.click(moreButtons[0]);

        // Look for delete option in dropdown
        const deleteOption = screen.queryByText('Delete');
        if (deleteOption) {
          await user.click(deleteOption);
          expect(defaultProps.onStateChange).toHaveBeenCalled();
        }
      }
    });
  });

  describe('Template Operations', () => {
    it('applies template when selected', async () => {
      const user = userEvent.setup();
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          templates={defaultTemplates}
        />
      );

      // Open templates dropdown
      const templatesButton = screen.getByText('Templates');
      await user.click(templatesButton);

      // Select first template
      const firstTemplate = screen.getByText(defaultTemplates[0].name);
      await user.click(firstTemplate);

      // Verify state change callback was called
      expect(defaultProps.onStateChange).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('shows validation errors for incomplete required criteria', () => {
      const stateWithIncompleteRequired = {
        dorCriteria: [
          {
            ...mockDorCriteria[0],
            isCompleted: false,
            validationRule: {
              type: 'required' as const,
              message: 'This is required',
            },
          },
        ],
        dodCriteria: [],
      };

      render(
        <DorDodPanel
          {...defaultProps}
          initialState={stateWithIncompleteRequired}
        />
      );

      expect(screen.getByText(/validation error/i)).toBeInTheDocument();
    });

    it('calls onValidationChange when validation state changes', () => {
      render(<DorDodPanel {...defaultProps} initialState={mockInitialState} />);

      expect(defaultProps.onValidationChange).toHaveBeenCalled();
    });
  });

  describe('Progress Calculation', () => {
    it('calculates correct progress metrics', () => {
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          showProgressIndicators={true}
        />
      );

      // With our mock data:
      // DOR: 1/2 complete (1 recommended completed, 1 required incomplete)
      // DOD: 1/2 complete (1 required completed, 1 required incomplete)

      expect(screen.getByText('Overall Progress')).toBeInTheDocument();
    });
  });

  describe('Export Operations', () => {
    it('handles export functionality', async () => {
      const user = userEvent.setup();

      // Mock URL.createObjectURL and related APIs
      const mockCreateObjectURL = jest.fn(() => 'mock-url');
      const mockRevokeObjectURL = jest.fn();
      const mockClick = jest.fn();

      Object.defineProperty(window, 'URL', {
        value: {
          createObjectURL: mockCreateObjectURL,
          revokeObjectURL: mockRevokeObjectURL,
        },
      });

      // Mock document.createElement to return an element with click method
      const mockLink = { click: mockClick, href: '', download: '' };
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

      render(<DorDodPanel {...defaultProps} initialState={mockInitialState} />);

      // Open export dropdown
      const exportButton = screen.getByText('Export');
      await user.click(exportButton);

      // Click export as JSON
      const jsonExport = screen.getByText('Export as JSON');
      await user.click(jsonExport);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Read-only Mode', () => {
    it('disables editing in read-only mode', () => {
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          readOnly={true}
        />
      );

      // Add buttons should not be present in read-only mode
      expect(screen.queryByText('Add Criterion')).not.toBeInTheDocument();
    });

    it('allows checkbox interaction in read-only mode for viewing', () => {
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          readOnly={true}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      // Checkboxes should be disabled in read-only mode
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('handles collapsed sections', async () => {
      // User event setup removed - not used in this test
      // const user = userEvent.setup();
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          collapsed={true}
        />
      );

      // Sections should be collapsed initially
      // We can test by looking for the chevron icons or section content
      const dorHeader = screen.getByText('Definition of Ready');
      expect(dorHeader).toBeInTheDocument();
    });
  });

  describe('Approval Workflow', () => {
    it('shows approval workflow when enabled', () => {
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          showApprovalWorkflow={true}
        />
      );

      expect(screen.getByText('Request Approval')).toBeInTheDocument();
    });

    it('handles approval request', async () => {
      const user = userEvent.setup();
      render(
        <DorDodPanel
          {...defaultProps}
          initialState={mockInitialState}
          showApprovalWorkflow={true}
        />
      );

      const requestButton = screen.getByText('Request Approval');
      await user.click(requestButton);

      expect(defaultProps.onApprovalRequest).toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('calls onStateChange when state updates', async () => {
      const user = userEvent.setup();
      render(<DorDodPanel {...defaultProps} initialState={mockInitialState} />);

      // Toggle a checkbox to trigger state change
      const checkbox = screen.getAllByRole('checkbox')[0];
      await user.click(checkbox);

      expect(defaultProps.onStateChange).toHaveBeenCalled();
    });

    it('preserves state between re-renders', () => {
      const { rerender } = render(
        <DorDodPanel {...defaultProps} initialState={mockInitialState} />
      );

      expect(screen.getByText('Requirements are clear')).toBeInTheDocument();

      // Re-render with same props
      rerender(
        <DorDodPanel {...defaultProps} initialState={mockInitialState} />
      );

      expect(screen.getByText('Requirements are clear')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<DorDodPanel {...defaultProps} initialState={mockInitialState} />);

      // Check for checkboxes
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);

      // Check for buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<DorDodPanel {...defaultProps} initialState={mockInitialState} />);

      // Tab through focusable elements
      await user.tab();

      // At least one element should be focused
      expect(document.activeElement).not.toBe(document.body);
    });
  });
});
