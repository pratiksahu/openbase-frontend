import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small status descriptor component for labeling content with different visual styles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style variant of the badge',
    },
    children: {
      control: 'text',
      description: 'The content to display inside the badge',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge style
 */
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

/**
 * All badge variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the badge component.',
      },
    },
  },
};

/**
 * Badges with different content
 */
export const Content: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>New</Badge>
      <Badge variant="secondary">Beta</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">v2.1.0</Badge>
      <Badge>🔥 Hot</Badge>
      <Badge variant="secondary">✨ Featured</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with different types of content including emojis.',
      },
    },
  },
};

/**
 * Status badges
 */
export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge>Active</Badge>
        <Badge variant="secondary">Pending</Badge>
        <Badge variant="destructive">Inactive</Badge>
        <Badge variant="outline">Draft</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge>Online</Badge>
        <Badge variant="secondary">Away</Badge>
        <Badge variant="destructive">Offline</Badge>
        <Badge variant="outline">Busy</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge>Completed</Badge>
        <Badge variant="secondary">In Progress</Badge>
        <Badge variant="destructive">Failed</Badge>
        <Badge variant="outline">Cancelled</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common status indicators using different badge variants.',
      },
    },
  },
};

/**
 * Notification badges
 */
export const NotificationBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="relative">
        <button className="rounded border p-2">Messages</button>
        <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">3</Badge>
      </div>

      <div className="relative">
        <button className="rounded border p-2">Notifications</button>
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 px-2 py-1 text-xs"
        >
          99+
        </Badge>
      </div>

      <div className="relative">
        <button className="rounded border p-2">Cart</button>
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-2 px-2 py-1 text-xs"
        >
          12
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Badges used as notification indicators on buttons or UI elements.',
      },
    },
  },
};

/**
 * Tag-style badges
 */
export const Tags: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">JavaScript</Badge>
        <Badge variant="outline">TypeScript</Badge>
        <Badge variant="outline">React</Badge>
        <Badge variant="outline">Next.js</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Frontend</Badge>
        <Badge variant="secondary">Backend</Badge>
        <Badge variant="secondary">Full Stack</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge>Beginner</Badge>
        <Badge>Intermediate</Badge>
        <Badge>Advanced</Badge>
        <Badge variant="destructive">Expert</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges used as tags for categorization and labeling.',
      },
    },
  },
};

/**
 * Interactive badge example
 */
export const Interactive: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge
        className="hover:bg-primary/90 cursor-pointer transition-colors"
        onClick={() => {
          // Badge clicked
        }}
      >
        Clickable
      </Badge>
      <Badge
        variant="secondary"
        className="hover:bg-secondary/80 cursor-pointer transition-colors"
        onClick={() => {
          // Secondary badge clicked
        }}
      >
        Interactive
      </Badge>
      <Badge
        variant="outline"
        className="hover:bg-accent cursor-pointer transition-colors"
        onClick={() => {
          // Outline badge clicked
        }}
      >
        Hoverable
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive badges that respond to clicks and hover states.',
      },
    },
  },
};
