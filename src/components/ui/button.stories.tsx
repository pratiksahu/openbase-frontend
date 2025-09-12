import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, sizes, and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child component',
    },
    onClick: {
      description: 'Callback fired when button is clicked',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default button style
 */
export const Default: Story = {
  args: {
    children: 'Button',
    onClick: () => console.log('Button clicked'),
  },
};

/**
 * Button variants showcase different visual styles
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the button component.',
      },
    },
  },
};

/**
 * Different button sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🔍</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes available for the button component.',
      },
    },
  },
};

/**
 * Disabled button state
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button in disabled state.',
      },
    },
  },
};

/**
 * Interactive example with actions
 */
export const Interactive: Story = {
  args: {
    children: 'Click me!',
    onClick: () => console.log('Interactive button clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive button that triggers actions when clicked.',
      },
    },
  },
};

/**
 * Button with different content types
 */
export const WithContent: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button>Text Only</Button>
        <Button>
          <span>🚀</span>
          With Icon
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="outline">
          <span>📁</span>
          File Upload
        </Button>
        <Button variant="destructive">
          <span>🗑️</span>
          Delete Item
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with different types of content including icons.',
      },
    },
  },
};