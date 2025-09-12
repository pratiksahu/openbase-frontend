import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Separator } from './separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A visual separator component for dividing content horizontally or vertically.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the separator is decorative (affects accessibility)',
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Horizontal separator (default)
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Section 1</h3>
        <p className="text-sm text-muted-foreground">
          This is some content in the first section.
        </p>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Section 2</h3>
        <p className="text-sm text-muted-foreground">
          This is some content in the second section.
        </p>
      </div>
    </div>
  ),
};

/**
 * Vertical separator
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex items-center space-x-4 h-20">
      <div className="space-y-1 text-center">
        <h4 className="text-sm font-medium">Left</h4>
        <p className="text-xs text-muted-foreground">Content</p>
      </div>
      
      <Separator orientation="vertical" />
      
      <div className="space-y-1 text-center">
        <h4 className="text-sm font-medium">Right</h4>
        <p className="text-xs text-muted-foreground">Content</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical separator for dividing content side by side.',
      },
    },
  },
};

/**
 * In navigation menu
 */
export const InNavigation: Story = {
  render: () => (
    <nav className="flex items-center space-x-1 text-sm">
      <a href="#" className="px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
        Home
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
        About
      </a>
      <Separator orientation="vertical" className="h-4" />
      <a href="#" className="px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
        Contact
      </a>
    </nav>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical separators used in navigation menus.',
      },
    },
  },
};

/**
 * In card layout
 */
export const InCard: Story = {
  render: () => (
    <div className="w-[400px] border rounded-lg p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-sm text-muted-foreground">
          This is the main content of the card with some descriptive text.
        </p>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Additional Information</h4>
        <p className="text-xs text-muted-foreground">
          Some extra details or metadata about the content.
        </p>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-end space-x-2">
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-accent">
          Cancel
        </button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Save
        </button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Horizontal separators used to divide sections within a card.',
      },
    },
  },
};

/**
 * In sidebar layout
 */
export const InSidebar: Story = {
  render: () => (
    <div className="flex w-[500px] h-64 border rounded-lg">
      <div className="w-48 p-4 space-y-4 bg-muted/50">
        <div>
          <h4 className="text-sm font-medium">Navigation</h4>
          <div className="mt-2 space-y-1 text-sm">
            <a href="#" className="block px-2 py-1 hover:bg-accent rounded">Dashboard</a>
            <a href="#" className="block px-2 py-1 hover:bg-accent rounded">Settings</a>
            <a href="#" className="block px-2 py-1 hover:bg-accent rounded">Profile</a>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="text-sm font-medium">Account</h4>
          <div className="mt-2 space-y-1 text-sm">
            <a href="#" className="block px-2 py-1 hover:bg-accent rounded">Billing</a>
            <a href="#" className="block px-2 py-1 hover:bg-accent rounded">Support</a>
          </div>
        </div>
      </div>
      
      <Separator orientation="vertical" />
      
      <div className="flex-1 p-4">
        <h3 className="text-lg font-semibold">Main Content</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This is the main content area separated from the sidebar.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Separators used in sidebar layouts with both horizontal and vertical orientations.',
      },
    },
  },
};

/**
 * Different styles
 */
export const Styles: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-2">Default</h4>
        <Separator />
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Thick</h4>
        <Separator className="h-0.5" />
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Dashed</h4>
        <Separator className="border-dashed border-t border-b-0 h-0" />
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Dotted</h4>
        <Separator className="border-dotted border-t border-b-0 h-0" />
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Colored</h4>
        <Separator className="bg-blue-500" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual styles for separators.',
      },
    },
  },
};

/**
 * Spacing examples
 */
export const Spacing: Story = {
  render: () => (
    <div className="w-[300px] space-y-8">
      <div>
        <h4 className="text-sm font-medium">Tight Spacing</h4>
        <p className="text-xs text-muted-foreground">Content above</p>
        <Separator className="my-2" />
        <p className="text-xs text-muted-foreground">Content below</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium">Normal Spacing</h4>
        <p className="text-xs text-muted-foreground">Content above</p>
        <Separator className="my-4" />
        <p className="text-xs text-muted-foreground">Content below</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium">Loose Spacing</h4>
        <p className="text-xs text-muted-foreground">Content above</p>
        <Separator className="my-6" />
        <p className="text-xs text-muted-foreground">Content below</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of different spacing around separators.',
      },
    },
  },
};