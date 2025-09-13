import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from './button';
import { Label } from './label';
import { Textarea } from './textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A textarea component for multi-line text input with consistent styling and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the textarea',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text lines',
    },
    cols: {
      control: 'number',
      description: 'Width of the textarea in characters',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters allowed',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the textarea is read-only',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default textarea
 */
export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic textarea with placeholder text.',
      },
    },
  },
};

/**
 * Textarea with label
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here..." id="message" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A textarea with a label for accessibility.',
      },
    },
  },
};

/**
 * Textarea with helper text
 */
export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-2">Your message</Label>
      <Textarea placeholder="Type your message here..." id="message-2" />
      <p className="text-muted-foreground text-sm">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A textarea with helper text below.',
      },
    },
  },
};

/**
 * Disabled textarea
 */
export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A disabled textarea that cannot be edited.',
      },
    },
  },
};

/**
 * Read-only textarea
 */
export const ReadOnly: Story = {
  args: {
    value: 'This is read-only content that cannot be modified.',
    readOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A read-only textarea for displaying content.',
      },
    },
  },
};

/**
 * Textarea with different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <div>
        <Label htmlFor="small">Small (3 rows)</Label>
        <Textarea
          id="small"
          placeholder="Small textarea..."
          rows={3}
          className="min-h-[80px]"
        />
      </div>

      <div>
        <Label htmlFor="default">Default (4 rows)</Label>
        <Textarea id="default" placeholder="Default textarea..." rows={4} />
      </div>

      <div>
        <Label htmlFor="large">Large (6 rows)</Label>
        <Textarea
          id="large"
          placeholder="Large textarea..."
          rows={6}
          className="min-h-[150px]"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Textareas with different sizes using the rows prop.',
      },
    },
  },
};

/**
 * Textarea with character count
 */
export const WithCharacterCount: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const maxLength = 280;

    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor="message-count">Your message</Label>
        <Textarea
          placeholder="Type your message here..."
          id="message-count"
          value={value}
          onChange={e => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <p className="text-muted-foreground text-right text-sm">
          {value.length}/{maxLength} characters
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A controlled textarea with character count and max length.',
      },
    },
  },
};

/**
 * Textarea with validation states
 */
export const ValidationStates: Story = {
  render: () => (
    <div className="w-full space-y-6">
      <div className="grid gap-1.5">
        <Label htmlFor="success">Success State</Label>
        <Textarea
          id="success"
          placeholder="This field is valid"
          className="border-green-500 focus-visible:ring-green-500"
        />
        <p className="text-sm text-green-600">This field is valid!</p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="error">Error State</Label>
        <Textarea
          id="error"
          placeholder="This field has an error"
          className="border-red-500 focus-visible:ring-red-500"
        />
        <p className="text-sm text-red-600">This field is required.</p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="warning">Warning State</Label>
        <Textarea
          id="warning"
          placeholder="This field has a warning"
          className="border-yellow-500 focus-visible:ring-yellow-500"
        />
        <p className="text-sm text-yellow-600">
          This field should be reviewed.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Textareas with different validation states using custom styling.',
      },
    },
  },
};

/**
 * Controlled textarea
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('This is a controlled textarea.');

    return (
      <div className="w-full space-y-4">
        <div className="grid gap-1.5">
          <Label htmlFor="controlled">Controlled Textarea</Label>
          <Textarea
            id="controlled"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setValue('')}>
            Clear
          </Button>
          <Button
            variant="outline"
            onClick={() => setValue('This is preset text.')}
          >
            Set Preset Text
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Current value: &ldquo;{value}&rdquo;
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A controlled textarea with external state management.',
      },
    },
  },
};

/**
 * Textarea with auto-resize
 */
export const AutoResize: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      // Auto-resize logic
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    };

    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor="auto-resize">Auto-resize Textarea</Label>
        <Textarea
          id="auto-resize"
          placeholder="Start typing to see the textarea expand..."
          value={value}
          onChange={handleChange}
          className="resize-none overflow-hidden"
          rows={1}
        />
        <p className="text-muted-foreground text-sm">
          This textarea automatically resizes as you type.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A textarea that automatically resizes based on content.',
      },
    },
  },
};

/**
 * Textarea in a form layout
 */
export const FormExample: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="subject">Subject</Label>
        <input
          type="text"
          id="subject"
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          placeholder="Enter subject"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="message-form">Message</Label>
        <Textarea
          id="message-form"
          placeholder="Enter your message here..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Send Message</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A textarea used in a complete form layout.',
      },
    },
  },
};
