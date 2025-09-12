import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LoadingSpinner } from './loading-spinner';

const meta = {
  title: 'Shared/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable loading spinner component with different sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the spinner',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default loading spinner
 */
export const Default: Story = {
  args: {
    size: 'md',
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <LoadingSpinner size="sm" />
        <p className="text-xs mt-2 text-muted-foreground">Small</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" />
        <p className="text-xs mt-2 text-muted-foreground">Medium</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-xs mt-2 text-muted-foreground">Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading spinners in different sizes.',
      },
    },
  },
};

/**
 * In button context
 */
export const InButton: Story = {
  render: () => (
    <div className="flex gap-4">
      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
        <LoadingSpinner size="sm" className="h-4 w-4 p-0" />
        Loading...
      </button>
      <button disabled className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-md cursor-not-allowed">
        <LoadingSpinner size="sm" className="h-4 w-4 p-0" />
        Please wait
      </button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading spinners inside buttons for form submissions.',
      },
    },
  },
};

/**
 * In card context
 */
export const InCard: Story = {
  render: () => (
    <div className="w-[300px] h-[200px] border rounded-lg flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground mt-4">Loading data...</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading spinner centered in a card layout.',
      },
    },
  },
};

/**
 * Page loading
 */
export const PageLoading: Story = {
  render: () => (
    <div className="w-[600px] h-[400px] flex flex-col items-center justify-center bg-background">
      <LoadingSpinner size="lg" />
      <h3 className="text-lg font-semibold mt-4">Loading Application</h3>
      <p className="text-sm text-muted-foreground mt-2">Please wait while we set things up...</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full page loading state with spinner and descriptive text.',
      },
    },
  },
};

/**
 * Custom colors
 */
export const CustomColors: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="text-center">
        <LoadingSpinner size="md" className="text-blue-500" />
        <p className="text-xs mt-2 text-muted-foreground">Blue</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" className="text-green-500" />
        <p className="text-xs mt-2 text-muted-foreground">Green</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" className="text-red-500" />
        <p className="text-xs mt-2 text-muted-foreground">Red</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" className="text-purple-500" />
        <p className="text-xs mt-2 text-muted-foreground">Purple</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading spinners with custom colors.',
      },
    },
  },
};