import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { FormField } from './FormField';

const meta = {
  title: 'Components/Forms/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form field wrapper component that provides consistent styling for labels, descriptions, errors, and form inputs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the form field',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required (shows asterisk)',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    description: {
      control: 'text',
      description: 'Helper text description',
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic form field with input
 */
export const Default: Story = {
  args: {
    label: 'Email Address',
    children: <Input type="email" placeholder="Enter your email" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic form field with a label and input.',
      },
    },
  },
};

/**
 * Required field with asterisk
 */
export const Required: Story = {
  args: {
    label: 'Password',
    required: true,
    children: <Input type="password" placeholder="Enter your password" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'A required form field showing an asterisk indicator.',
      },
    },
  },
};

/**
 * Field with description
 */
export const WithDescription: Story = {
  args: {
    label: 'Username',
    description: 'Choose a unique username that will be visible to other users.',
    children: <Input placeholder="Enter username" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'A form field with helpful description text.',
      },
    },
  },
};

/**
 * Field with error state
 */
export const WithError: Story = {
  args: {
    label: 'Email Address',
    required: true,
    error: 'Please enter a valid email address',
    children: <Input type="email" placeholder="Enter your email" className="border-red-500" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'A form field showing an error state with error message.',
      },
    },
  },
};

/**
 * Field with description and error
 */
export const WithDescriptionAndError: Story = {
  args: {
    label: 'Password',
    required: true,
    description: 'Password must be at least 8 characters long and contain both letters and numbers.',
    error: 'Password must be at least 8 characters long',
    children: <Input type="password" placeholder="Enter password" className="border-red-500" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'A form field with both description and error message.',
      },
    },
  },
};

/**
 * Field with textarea
 */
export const WithTextarea: Story = {
  args: {
    label: 'Message',
    description: 'Tell us how we can help you.',
    children: <Textarea placeholder="Type your message here..." rows={4} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'A form field with a textarea input.',
      },
    },
  },
};

/**
 * Field with select dropdown
 */
export const WithSelect: Story = {
  args: {
    label: 'Country',
    required: true,
    description: 'Select your country of residence.',
    children: (
      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <option value="">Select a country</option>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
        <option value="au">Australia</option>
      </select>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'A form field with a select dropdown.',
      },
    },
  },
};

/**
 * Field with checkbox
 */
export const WithCheckbox: Story = {
  args: {
    label: 'Terms and Conditions',
    required: true,
    children: (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms"
          className="h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary"
        />
        <label htmlFor="terms" className="text-sm">
          I agree to the terms and conditions
        </label>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'A form field with a checkbox input.',
      },
    },
  },
};

/**
 * Interactive example showing state changes
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [showError, setShowError] = useState(false);
    const [showDescription, setShowDescription] = useState(true);

    const validateInput = (val: string) => {
      setShowError(val.length > 0 && val.length < 3);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      validateInput(newValue);
    };

    return (
      <div className="space-y-4 w-full max-w-sm">
        <FormField
          label="Interactive Field"
          required
          description={showDescription ? 'Enter at least 3 characters' : undefined}
          error={showError ? 'Input must be at least 3 characters long' : undefined}
        >
          <Input
            value={value}
            onChange={handleChange}
            placeholder="Type something..."
            className={showError ? 'border-red-500' : ''}
          />
        </FormField>
        
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDescription(!showDescription)}
          >
            Toggle Description
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue('')}
          >
            Clear
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Current value: "{value}" (length: {value.length})
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive form field demonstrating dynamic states.',
      },
    },
  },
};

/**
 * Multiple fields layout
 */
export const MultipleFields: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <FormField label="First Name" required>
        <Input placeholder="John" />
      </FormField>
      
      <FormField label="Last Name" required>
        <Input placeholder="Doe" />
      </FormField>
      
      <FormField
        label="Email"
        required
        description="We'll never share your email with anyone else."
      >
        <Input type="email" placeholder="john@example.com" />
      </FormField>
      
      <FormField
        label="Phone Number"
        description="Optional - for account security purposes."
      >
        <Input type="tel" placeholder="(555) 123-4567" />
      </FormField>
      
      <FormField
        label="Bio"
        description="Tell us a bit about yourself."
      >
        <Textarea placeholder="I'm a software developer..." rows={3} />
      </FormField>
      
      <div className="pt-4">
        <Button className="w-full">Save Profile</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple form fields in a typical form layout.',
      },
    },
  },
};

/**
 * Field without label
 */
export const NoLabel: Story = {
  args: {
    description: 'This field has no label, just a description.',
    children: <Input placeholder="Enter value..." />,
  },
  parameters: {
    docs: {
      description: {
        story: 'A form field without a label, using only description text.',
      },
    },
  },
};