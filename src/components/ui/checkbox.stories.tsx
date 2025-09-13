import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Checkbox } from './checkbox';
import { Label } from './label';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A checkbox component for boolean selections with support for indeterminate state.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'The checked state of the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    onCheckedChange: {
      description: 'Callback fired when the checked state changes',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic checkbox
 */
export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

/**
 * Controlled checkbox states
 */
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="unchecked" checked={false} />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="checked" checked={true} />
        <Label htmlFor="checked">Checked</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="indeterminate" checked="indeterminate" />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled" className="text-muted-foreground">
          Disabled
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled checked={true} />
        <Label htmlFor="disabled-checked" className="text-muted-foreground">
          Disabled & Checked
        </Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different states of the checkbox component.',
      },
    },
  },
};

/**
 * Interactive checkbox
 */
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="interactive"
            checked={checked}
            onCheckedChange={checkedState => {
              if (typeof checkedState === 'boolean') {
                setChecked(checkedState);
              }
            }}
          />
          <Label htmlFor="interactive">
            {checked ? 'Checked!' : 'Click to check'}
          </Label>
        </div>
        <p className="text-muted-foreground text-sm">
          Current state: {checked ? 'true' : 'false'}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive checkbox that responds to state changes.',
      },
    },
  },
};

/**
 * Checkbox list
 */
export const CheckboxList: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const items = [
      { id: 'item1', label: 'Item 1' },
      { id: 'item2', label: 'Item 2' },
      { id: 'item3', label: 'Item 3' },
      { id: 'item4', label: 'Item 4' },
    ];

    const handleItemToggle = (itemId: string) => {
      setSelectedItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => handleItemToggle(item.id)}
              />
              <Label htmlFor={item.id}>{item.label}</Label>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground text-sm">
          Selected:{' '}
          {selectedItems.length > 0 ? selectedItems.join(', ') : 'None'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple checkboxes in a list format with state management.',
      },
    },
  },
};

/**
 * Select all checkbox
 */
export const SelectAll: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const items = ['Apple', 'Banana', 'Cherry', 'Date'];

    const allSelected =
      items.length > 0 && selectedItems.length === items.length;
    const indeterminate =
      selectedItems.length > 0 && selectedItems.length < items.length;

    const handleSelectAll = () => {
      setSelectedItems(allSelected ? [] : items);
    };

    const handleItemToggle = (item: string) => {
      setSelectedItems(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b pb-2">
          <Checkbox
            id="select-all"
            checked={
              allSelected ? true : indeterminate ? 'indeterminate' : false
            }
            onCheckedChange={handleSelectAll}
          />
          <Label htmlFor="select-all" className="font-medium">
            Select All
          </Label>
        </div>

        <div className="space-y-2 pl-6">
          {items.map(item => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={selectedItems.includes(item)}
                onCheckedChange={() => handleItemToggle(item)}
              />
              <Label htmlFor={item}>{item}</Label>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground text-sm">
          Selected: {selectedItems.length}/{items.length}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Select all checkbox with indeterminate state for partial selection.',
      },
    },
  },
};

/**
 * Checkbox with descriptions
 */
export const WithDescriptions: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <Checkbox id="notifications" className="mt-1" />
        <div>
          <Label htmlFor="notifications" className="text-base font-medium">
            Email Notifications
          </Label>
          <p className="text-muted-foreground text-sm">
            Receive emails about your account activity
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox id="marketing" className="mt-1" />
        <div>
          <Label htmlFor="marketing" className="text-base font-medium">
            Marketing Communications
          </Label>
          <p className="text-muted-foreground text-sm">
            Receive emails about new products, features, and offers
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox id="security" className="mt-1" defaultChecked />
        <div>
          <Label htmlFor="security" className="text-base font-medium">
            Security Alerts
          </Label>
          <p className="text-muted-foreground text-sm">
            Receive important notifications about your account security
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Checkboxes with detailed descriptions and labels.',
      },
    },
  },
};

/**
 * Form validation example
 */
export const FormValidation: Story = {
  render: () => {
    const [agreed, setAgreed] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (agreed) {
        // Form submitted successfully
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreement"
              checked={agreed}
              onCheckedChange={checkedState => {
                if (typeof checkedState === 'boolean') {
                  setAgreed(checkedState);
                }
              }}
            />
            <Label htmlFor="agreement">
              I agree to the terms and conditions
            </Label>
          </div>

          {submitted && !agreed && (
            <p className="text-sm text-red-600">
              You must agree to the terms and conditions
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
        >
          Submit
        </button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox used in form validation scenarios.',
      },
    },
  },
};
