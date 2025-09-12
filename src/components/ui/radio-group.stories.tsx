import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from './button';
import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A radio group component built on top of Radix UI RadioGroup primitive, allowing single selection from multiple options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the radio group is disabled',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the radio group',
    },
    defaultValue: {
      control: 'text',
      description: 'The default selected value',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic radio group with simple options
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">Option Three</Label>
      </div>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic radio group with three options.',
      },
    },
  },
};

/**
 * Radio group with form labels and descriptions
 */
export const WithLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">
          Choose your preferred notification method
        </Label>
        <p className="text-sm text-muted-foreground">
          Select how you'd like to receive notifications.
        </p>
      </div>
      <RadioGroup defaultValue="email" className="space-y-3">
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="email" id="email" />
          <div className="space-y-1">
            <Label htmlFor="email" className="font-medium">
              Email
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified via email
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="sms" id="sms" />
          <div className="space-y-1">
            <Label htmlFor="sms" className="font-medium">
              SMS
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified via text message
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="push" id="push" />
          <div className="space-y-1">
            <Label htmlFor="push" className="font-medium">
              Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified via push notifications
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="none" id="none" />
          <div className="space-y-1">
            <Label htmlFor="none" className="font-medium">
              No Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Don't send any notifications
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A radio group with detailed labels and descriptions.',
      },
    },
  },
};

/**
 * Horizontal radio group
 */
export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4">
      <Label className="text-base font-medium">Size</Label>
      <RadioGroup defaultValue="medium" className="flex space-x-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="small" id="h-small" />
          <Label htmlFor="h-small">Small</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="medium" id="h-medium" />
          <Label htmlFor="h-medium">Medium</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="large" id="h-large" />
          <Label htmlFor="h-large">Large</Label>
        </div>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A radio group arranged horizontally.',
      },
    },
  },
};

/**
 * Disabled radio group
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Label className="text-base font-medium text-muted-foreground">
        Payment Method (Disabled)
      </Label>
      <RadioGroup defaultValue="credit-card" disabled>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="credit-card" id="d-credit" />
          <Label htmlFor="d-credit">Credit Card</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paypal" id="d-paypal" />
          <Label htmlFor="d-paypal">PayPal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bank-transfer" id="d-bank" />
          <Label htmlFor="d-bank">Bank Transfer</Label>
        </div>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A disabled radio group that cannot be interacted with.',
      },
    },
  },
};

/**
 * Controlled radio group
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('option1');

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Controlled Radio Group</Label>
          <p className="text-sm text-muted-foreground">
            Currently selected: {value}
          </p>
        </div>
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="c-option1" />
            <Label htmlFor="c-option1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="c-option2" />
            <Label htmlFor="c-option2">Option 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option3" id="c-option3" />
            <Label htmlFor="c-option3">Option 3</Label>
          </div>
        </RadioGroup>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue('option1')}
          >
            Select Option 1
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue('option2')}
          >
            Select Option 2
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue('option3')}
          >
            Select Option 3
          </Button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A controlled radio group with external state management.',
      },
    },
  },
};

/**
 * Radio group with individual disabled items
 */
export const WithDisabledItems: Story = {
  render: () => (
    <div className="space-y-4">
      <Label className="text-base font-medium">Subscription Plan</Label>
      <RadioGroup defaultValue="pro">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="free" id="free" />
          <Label htmlFor="free">Free Plan - $0/month</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pro" id="pro" />
          <Label htmlFor="pro">Pro Plan - $10/month</Label>
        </div>
        <div className="flex items-center space-x-2 opacity-50">
          <RadioGroupItem value="enterprise" id="enterprise" disabled />
          <Label htmlFor="enterprise" className="text-muted-foreground">
            Enterprise Plan - $50/month (Coming Soon)
          </Label>
        </div>
        <div className="flex items-center space-x-2 opacity-50">
          <RadioGroupItem value="custom" id="custom" disabled />
          <Label htmlFor="custom" className="text-muted-foreground">
            Custom Plan - Contact Us (Unavailable)
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A radio group with some individual items disabled.',
      },
    },
  },
};

/**
 * Radio group with custom styling
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <Label className="text-base font-medium">Theme Preference</Label>
      <RadioGroup defaultValue="light" className="space-y-3">
        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
          <RadioGroupItem value="light" id="light-theme" />
          <div className="space-y-1">
            <Label htmlFor="light-theme" className="font-medium">
              🌞 Light Theme
            </Label>
            <p className="text-sm text-muted-foreground">
              Clean and bright interface
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
          <RadioGroupItem value="dark" id="dark-theme" />
          <div className="space-y-1">
            <Label htmlFor="dark-theme" className="font-medium">
              🌚 Dark Theme
            </Label>
            <p className="text-sm text-muted-foreground">
              Easy on the eyes in low light
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
          <RadioGroupItem value="system" id="system-theme" />
          <div className="space-y-1">
            <Label htmlFor="system-theme" className="font-medium">
              🔄 System Theme
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically match your system preference
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A radio group with custom card-style styling.',
      },
    },
  },
};

/**
 * Radio group in a form context
 */
export const InForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      deliveryMethod: 'standard',
    });

    return (
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Order Delivery</h3>
          <p className="text-sm text-muted-foreground">
            Choose your preferred delivery method for this order.
          </p>
        </div>
        
        <div className="space-y-4">
          <Label className="text-base font-medium">Delivery Method</Label>
          <RadioGroup
            value={formData.deliveryMethod}
            onValueChange={(value) =>
              setFormData({ ...formData, deliveryMethod: value })
            }
            className="space-y-2"
          >
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="standard" id="standard" />
                <div className="space-y-1">
                  <Label htmlFor="standard" className="font-medium">
                    Standard Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    5-7 business days
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">Free</span>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="express" id="express" />
                <div className="space-y-1">
                  <Label htmlFor="express" className="font-medium">
                    Express Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    2-3 business days
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">$9.99</span>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="overnight" id="overnight" />
                <div className="space-y-1">
                  <Label htmlFor="overnight" className="font-medium">
                    Overnight Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Next business day
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">$24.99</span>
            </div>
          </RadioGroup>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Selected:</span>
            <span className="capitalize">{formData.deliveryMethod} delivery</span>
          </div>
          <Button className="w-full">Continue to Payment</Button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A radio group used within a form with pricing information.',
      },
    },
  },
};