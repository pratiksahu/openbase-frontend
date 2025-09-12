import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A label component that provides accessible labeling for form controls.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'The ID of the form control this label is associated with',
    },
    children: {
      control: 'text',
      description: 'The content of the label',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic label
 */
export const Default: Story = {
  args: {
    children: 'Email address',
  },
};

/**
 * With input field
 */
export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email address</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label properly associated with an input field.',
      },
    },
  },
};

/**
 * Required field indicator
 */
export const Required: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input id="name" placeholder="John Doe" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input id="phone" type="tel" placeholder="(555) 123-4567" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Company (optional)</Label>
        <Input id="company" placeholder="Acme Inc." />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels with required field indicators.',
      },
    },
  },
};

/**
 * With description
 */
export const WithDescription: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="password">Password</Label>
      <Input type="password" id="password" placeholder="Enter password" />
      <p className="text-xs text-muted-foreground">
        Must be at least 8 characters with uppercase, lowercase, and numbers.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label with additional description text.',
      },
    },
  },
};

/**
 * With checkbox
 */
export const WithCheckbox: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">I accept the terms and conditions</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" />
        <Label htmlFor="newsletter">Subscribe to our newsletter</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="updates" />
        <Label htmlFor="updates">Receive product updates via email</Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels used with checkbox inputs.',
      },
    },
  },
};

/**
 * With switch
 */
export const WithSwitch: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Push Notifications</Label>
        <Switch id="notifications" />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <Switch id="dark-mode" />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="analytics">Analytics</Label>
        <Switch id="analytics" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels used with switch controls.',
      },
    },
  },
};

/**
 * Form layout
 */
export const FormLayout: Story = {
  render: () => (
    <form className="space-y-6 max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input id="first-name" placeholder="John" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input id="last-name" placeholder="Doe" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email-form">Email</Label>
        <Input type="email" id="email-form" placeholder="john@example.com" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          className="w-full p-2 border rounded-md"
          rows={4}
          placeholder="Your message here..."
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="contact-consent" />
        <Label htmlFor="contact-consent" className="text-sm">
          I consent to being contacted about this message
        </Label>
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Send Message
      </button>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels used in a complete form layout.',
      },
    },
  },
};

/**
 * Different label styles
 */
export const Styles: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="default">Default Label</Label>
        <Input id="default" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medium" className="text-base font-medium">
          Medium Label
        </Label>
        <Input id="medium" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="large" className="text-lg font-semibold">
          Large Label
        </Label>
        <Input id="large" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="muted" className="text-muted-foreground">
          Muted Label
        </Label>
        <Input id="muted" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="error" className="text-red-600">
          Error Label
        </Label>
        <Input id="error" className="border-red-500" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels with different styling variations.',
      },
    },
  },
};
