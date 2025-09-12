import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'Shared/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A theme toggle component that allows users to switch between light, dark, and system themes.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default theme toggle
 */
export const Default: Story = {};

/**
 * In navigation context
 */
export const InNavigation: Story = {
  render: () => (
    <nav className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">My App</h1>
        <div className="hidden md:flex space-x-4">
          <a href="#" className="text-sm hover:underline">Home</a>
          <a href="#" className="text-sm hover:underline">About</a>
          <a href="#" className="text-sm hover:underline">Contact</a>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
      </div>
    </nav>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Theme toggle used in a navigation bar context.',
      },
    },
  },
};

/**
 * In settings panel
 */
export const InSettingsPanel: Story = {
  render: () => (
    <div className="w-[400px] p-6 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Appearance Settings</h3>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Theme</p>
          <p className="text-sm text-muted-foreground">
            Choose your preferred color scheme
          </p>
        </div>
        <ThemeToggle />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Reduced Motion</p>
          <p className="text-sm text-muted-foreground">
            Minimize animations and transitions
          </p>
        </div>
        <button className="px-3 py-1 text-sm border rounded">Toggle</button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Theme toggle used in a settings panel.',
      },
    },
  },
};

/**
 * Compact version
 */
export const Compact: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <span className="text-sm">Theme:</span>
      <ThemeToggle />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact theme toggle with label.',
      },
    },
  },
};