import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Skeleton } from './skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A loading skeleton component for showing placeholder content while data is being fetched.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic skeleton
 */
export const Default: Story = {
  args: {
    className: 'h-4 w-[250px]',
  },
};

/**
 * Different skeleton sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-2 w-[100px]" />
      <Skeleton className="h-3 w-[150px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-6 w-[250px]" />
      <Skeleton className="h-8 w-[300px]" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loaders in different sizes.',
      },
    },
  },
};

/**
 * Card skeleton
 */
export const Card: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-4 border rounded-lg w-[400px]">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card layout skeleton with avatar and text content.',
      },
    },
  },
};

/**
 * Article skeleton
 */
export const Article: Story = {
  render: () => (
    <div className="space-y-4 w-[600px]">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-40 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Article layout skeleton with title, meta info, image, and paragraphs.',
      },
    },
  },
};

/**
 * Profile skeleton
 */
export const Profile: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User profile skeleton with large avatar and bio content.',
      },
    },
  },
};

/**
 * List skeleton
 */
export const List: Story = {
  render: () => (
    <div className="space-y-4 w-[500px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'List of items skeleton with repeated elements.',
      },
    },
  },
};

/**
 * Table skeleton
 */
export const Table: Story = {
  render: () => (
    <div className="w-[700px]">
      {/* Header */}
      <div className="flex space-x-4 p-4 border-b">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      
      {/* Rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-4 border-b">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Table skeleton with header and multiple rows.',
      },
    },
  },
};

/**
 * Dashboard skeleton
 */
export const Dashboard: Story = {
  render: () => (
    <div className="space-y-6 w-[800px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
      
      {/* Chart */}
      <div className="p-6 border rounded-lg">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
      
      {/* Recent activity */}
      <div className="p-6 border rounded-lg">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex dashboard layout skeleton with multiple sections.',
      },
    },
  },
};

/**
 * E-commerce skeleton
 */
export const ECommerce: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[600px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center mt-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-8 w-16 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Product grid skeleton for e-commerce applications.',
      },
    },
  },
};