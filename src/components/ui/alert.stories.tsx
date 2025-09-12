import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Alert, AlertDescription, AlertTitle } from './alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible alert component for displaying important information with optional title and description.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'The visual style variant of the alert',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic alert with title and description
 */
export const Default: Story = {
  render: () => (
    <Alert className="w-[600px]">
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert. It can be used to display general information to users.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive alert for errors or warnings
 */
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[600px]">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        This is a destructive alert. Use it to display error messages or critical warnings.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Destructive variant for error messages and critical warnings.',
      },
    },
  },
};

/**
 * Alert with icon
 */
export const WithIcon: Story = {
  render: () => (
    <div className="space-y-4 w-[600px]">
      <Alert>
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add an icon to make your alert more noticeable.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <AlertTitle>Warning!</AlertTitle>
        <AlertDescription>
          This action cannot be undone. Please proceed with caution.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alerts with icons for better visual communication.',
      },
    },
  },
};

/**
 * Alert with only description (no title)
 */
export const DescriptionOnly: Story = {
  render: () => (
    <Alert className="w-[600px]">
      <AlertDescription>
        This is a simple alert with only a description. Perfect for brief notifications.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Simple alert with only description text.',
      },
    },
  },
};

/**
 * Alert with only title (no description)
 */
export const TitleOnly: Story = {
  render: () => (
    <Alert className="w-[600px]">
      <AlertTitle>Important Notice</AlertTitle>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert with only a title for brief announcements.',
      },
    },
  },
};

/**
 * Different alert variants comparison
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-[600px]">
      <Alert>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is the default alert variant for general information.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>
          This is the destructive alert variant for errors and warnings.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available alert variants.',
      },
    },
  },
};