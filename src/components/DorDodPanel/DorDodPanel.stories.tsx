import type { Meta, StoryObj } from '@storybook/nextjs';

// import { action } from '@storybook/addon-actions';
import { defaultTemplates } from './defaultTemplates';
import { DorDodPanel } from './DorDodPanel';
import type { Criterion } from './DorDodPanel.types';

const meta: Meta<typeof DorDodPanel> = {
  title: 'Components/DorDodPanel',
  component: DorDodPanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive panel component for managing Definition of Ready (DoR) and Definition of Done (DoD) criteria. Supports templates, progress tracking, validation, and approval workflows.',
      },
    },
  },
  argTypes: {
    onStateChange: { action: 'state changed' },
    onValidationChange: { action: 'validation changed' },
    onApprovalRequest: { action: 'approval requested' },
    readOnly: { control: 'boolean' },
    showProgressIndicators: { control: 'boolean' },
    showTimeTracking: { control: 'boolean' },
    showApprovalWorkflow: { control: 'boolean' },
    showAuditLog: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    printMode: { control: 'boolean' },
  },
  args: {
    onStateChange: () => {},
    onValidationChange: () => {},
    onApprovalRequest: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof DorDodPanel>;

// Sample criteria data
const sampleDorCriteria: Criterion[] = [
  {
    id: 'dor-1',
    description: 'Requirements are clearly defined and documented',
    category: 'required',
    helpText: 'All functional and non-functional requirements should be specified',
    isCompleted: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 1,
    validationRule: {
      type: 'required',
      message: 'Clear requirements are essential before starting development',
    },
  },
  {
    id: 'dor-2',
    description: 'Design mockups or wireframes are available',
    category: 'required',
    helpText: 'Visual guidance for implementation is provided',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 2,
  },
  {
    id: 'dor-3',
    description: 'Performance requirements are specified',
    category: 'recommended',
    helpText: 'Any specific performance criteria should be documented',
    isCompleted: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 3,
  },
  {
    id: 'dor-4',
    description: 'Accessibility requirements are defined',
    category: 'optional',
    helpText: 'WCAG compliance and accessibility standards',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 4,
  },
];

const sampleDodCriteria: Criterion[] = [
  {
    id: 'dod-1',
    description: 'Code is complete and follows coding standards',
    category: 'required',
    helpText: 'Implementation matches requirements and follows team conventions',
    isCompleted: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 1,
    validationRule: {
      type: 'required',
      message: 'Complete, standards-compliant code is mandatory',
    },
  },
  {
    id: 'dod-2',
    description: 'All tests pass (unit, integration, E2E)',
    category: 'required',
    helpText: 'Comprehensive test coverage with all tests green',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 2,
    validationRule: {
      type: 'required',
      message: 'All tests must pass before completion',
    },
  },
  {
    id: 'dod-3',
    description: 'Documentation is updated',
    category: 'required',
    helpText: 'Technical documentation, API docs, and user guides updated',
    isCompleted: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 3,
  },
  {
    id: 'dod-4',
    description: 'Performance benchmarks are met',
    category: 'recommended',
    helpText: 'Performance criteria from DoR are satisfied',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: 4,
  },
];

// Empty state
export const Empty: Story = {
  args: {
    showProgressIndicators: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the panel in its initial empty state with no criteria defined.',
      },
    },
  },
};

// Default with sample data
export const Default: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria,
      dodCriteria: sampleDodCriteria,
    },
    showProgressIndicators: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default panel with sample DoR and DoD criteria showing mixed completion states.',
      },
    },
  },
};

// With software development template
export const SoftwareDevelopmentTemplate: Story = {
  args: {
    initialState: {
      dorCriteria: defaultTemplates[0].dorCriteria.map((criterion, index) => ({
        ...criterion,
        id: `dor-${index + 1}`,
        isCompleted: Math.random() > 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      dodCriteria: defaultTemplates[0].dodCriteria.map((criterion, index) => ({
        ...criterion,
        id: `dod-${index + 1}`,
        isCompleted: Math.random() > 0.3,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      currentTemplate: defaultTemplates[0],
    },
    showProgressIndicators: true,
    templates: defaultTemplates,
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel populated with the software development template criteria.',
      },
    },
  },
};

// Partially complete state
export const PartiallyComplete: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria.map(c => ({ ...c, isCompleted: true })),
      dodCriteria: sampleDodCriteria.map((c, index) => ({
        ...c,
        isCompleted: index < 2
      })),
    },
    showProgressIndicators: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a partially complete state where DoR is ready but DoD is in progress.',
      },
    },
  },
};

// Fully complete
export const FullyComplete: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria.map(c => ({ ...c, isCompleted: true })),
      dodCriteria: sampleDodCriteria.map(c => ({ ...c, isCompleted: true })),
      timeTracking: {
        markedReadyAt: new Date(Date.now() - 86400000), // 1 day ago
        markedDoneAt: new Date(),
        timeInProgress: 86400000, // 1 day
      },
    },
    showProgressIndicators: true,
    showTimeTracking: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a fully completed state with all criteria marked as done.',
      },
    },
  },
};

// Read-only mode
export const ReadOnly: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria,
      dodCriteria: sampleDodCriteria,
    },
    readOnly: true,
    showProgressIndicators: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only view of the panel without editing capabilities.',
      },
    },
  },
};

// Collapsed sections
export const Collapsed: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria,
      dodCriteria: sampleDodCriteria,
    },
    collapsed: true,
    showProgressIndicators: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel with both sections collapsed by default.',
      },
    },
  },
};

// With validation errors
export const WithValidationErrors: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria.map(c => ({ ...c, isCompleted: false })),
      dodCriteria: sampleDodCriteria.map(c => ({ ...c, isCompleted: false })),
    },
    showProgressIndicators: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows validation errors when required criteria are not completed.',
      },
    },
  },
};

// With approval workflow
export const WithApprovalWorkflow: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria.map(c => ({ ...c, isCompleted: true })),
      dodCriteria: sampleDodCriteria,
      approvalWorkflow: {
        requestedAt: new Date(Date.now() - 3600000), // 1 hour ago
        status: 'requested',
        comments: [
          {
            id: 'comment-1',
            author: 'John Doe',
            message: 'Please review the test coverage before approving.',
            createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
            type: 'comment',
          },
        ],
      },
    },
    showProgressIndicators: true,
    showApprovalWorkflow: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the panel with an active approval workflow.',
      },
    },
  },
};

// Print mode
export const PrintMode: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria,
      dodCriteria: sampleDodCriteria,
      currentTemplate: defaultTemplates[0],
    },
    printMode: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Print-friendly view of the panel optimized for printing or PDF export.',
      },
    },
  },
};

// Dark mode
export const DarkMode: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria,
      dodCriteria: sampleDodCriteria,
    },
    showProgressIndicators: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Panel optimized for dark mode with appropriate color schemes.',
      },
    },
  },
};

// Mobile responsive
export const Mobile: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria,
      dodCriteria: sampleDodCriteria,
    },
    showProgressIndicators: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-responsive view with stacked layout.',
      },
    },
  },
};

// With all features enabled
export const FullFeatures: Story = {
  args: {
    initialState: {
      dorCriteria: sampleDorCriteria,
      dodCriteria: sampleDodCriteria,
      currentTemplate: defaultTemplates[0],
      timeTracking: {
        markedReadyAt: new Date(Date.now() - 86400000),
        estimatedDuration: 172800000, // 2 days
      },
      approvalWorkflow: {
        status: 'none',
        comments: [],
      },
      auditLog: [
        {
          id: 'audit-1',
          timestamp: new Date(),
          action: 'criterion-added',
          criterionId: 'dor-1',
        },
      ],
    },
    showProgressIndicators: true,
    showTimeTracking: true,
    showApprovalWorkflow: true,
    showAuditLog: true,
    templates: defaultTemplates,
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel with all features enabled including time tracking, approval workflow, and audit logging.',
      },
    },
  },
};

// Design project template
export const DesignProjectTemplate: Story = {
  args: {
    initialState: {
      dorCriteria: defaultTemplates[1].dorCriteria.map((criterion, index) => ({
        ...criterion,
        id: `dor-${index + 1}`,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      dodCriteria: defaultTemplates[1].dodCriteria.map((criterion, index) => ({
        ...criterion,
        id: `dod-${index + 1}`,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      currentTemplate: defaultTemplates[1],
    },
    showProgressIndicators: true,
    templates: defaultTemplates,
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel populated with the design project template criteria.',
      },
    },
  },
};