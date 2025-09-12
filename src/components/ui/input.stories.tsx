import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component supporting various types and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'text',
        'email',
        'password',
        'number',
        'tel',
        'url',
        'search',
        'file',
        'date',
        'time',
      ],
      description: 'The type of input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    onChange: {
      description: 'Callback fired when input value changes',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text input
 */
export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    onChange: (e) => console.log('Input changed:', e.target.value),
  },
};

/**
 * Different input types
 */
export const InputTypes: Story = {
  render: () => (
    <div className="grid gap-4 w-80">
      <div className="space-y-2">
        <Label htmlFor="text">Text</Label>
        <Input id="text" type="text" placeholder="Enter text..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter password..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number">Number</Label>
        <Input id="number" type="number" placeholder="Enter number..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input id="search" type="search" placeholder="Search..." />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input types with labels.',
      },
    },
  },
};

/**
 * Input with validation states
 */
export const ValidationStates: Story = {
  render: () => (
    <div className="grid gap-4 w-80">
      <div className="space-y-2">
        <Label htmlFor="valid">Valid Input</Label>
        <Input
          id="valid"
          type="email"
          value="user@example.com"
          className="border-green-500 focus-visible:ring-green-500"
          readOnly
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="invalid" className="text-destructive">
          Invalid Input
        </Label>
        <Input
          id="invalid"
          type="email"
          value="invalid-email"
          className="border-destructive focus-visible:ring-destructive"
          readOnly
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="disabled">Disabled Input</Label>
        <Input
          id="disabled"
          type="text"
          placeholder="Disabled input..."
          disabled
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input components showing different validation states.',
      },
    },
  },
};

/**
 * File input
 */
export const FileInput: Story = {
  render: () => (
    <div className="grid gap-4 w-80">
      <div className="space-y-2">
        <Label htmlFor="file">Upload File</Label>
        <Input id="file" type="file" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="multiple">Multiple Files</Label>
        <Input id="multiple" type="file" multiple />
      </div>
      <div className="space-y-2">
        <Label htmlFor="accept">Images Only</Label>
        <Input id="accept" type="file" accept="image/*" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'File input variations with different configurations.',
      },
    },
  },
};

/**
 * Form example
 */
export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-80" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" placeholder="John" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" placeholder="Doe" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="userEmail">Email</Label>
        <Input id="userEmail" type="email" placeholder="john@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="userPhone">Phone</Label>
        <Input id="userPhone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of inputs used in a form context.',
      },
    },
  },
};