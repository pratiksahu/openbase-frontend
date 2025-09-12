import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A select component built on top of Radix UI Select primitive, providing dropdown selection functionality.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic select with simple options
 */
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic select with simple fruit options.',
      },
    },
  },
};

/**
 * Select with grouped options
 */
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
          <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
          <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
          <SelectItem value="west">
            Western European Summer Time (WEST)
          </SelectItem>
          <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
          <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A select with grouped options using SelectGroup and SelectLabel.',
      },
    },
  },
};

/**
 * Select with disabled options
 */
export const WithDisabledOptions: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free Plan</SelectItem>
        <SelectItem value="pro">Pro Plan</SelectItem>
        <SelectItem value="enterprise" disabled>
          Enterprise Plan (Coming Soon)
        </SelectItem>
        <SelectItem value="custom" disabled>
          Custom Plan (Contact Us)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A select with some disabled options.',
      },
    },
  },
};

/**
 * Select with form label
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="framework-select">Framework</Label>
      <Select>
        <SelectTrigger id="framework-select">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="sveltekit">SvelteKit</SelectItem>
          <SelectItem value="nuxt">Nuxt.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A select with a form label.',
      },
    },
  },
};

/**
 * Select with controlled state
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="red">Red</SelectItem>
            <SelectItem value="blue">Blue</SelectItem>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="yellow">Yellow</SelectItem>
            <SelectItem value="purple">Purple</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Selected value: {value || 'None'}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A controlled select component with external state.',
      },
    },
  },
};

/**
 * Select with default value
 */
export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="medium">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="small">Small</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="large">Large</SelectItem>
        <SelectItem value="extra-large">Extra Large</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A select with a default value pre-selected.',
      },
    },
  },
};

/**
 * Select with different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Small</Label>
        <Select>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Small" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Default</Label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Large</Label>
        <Select>
          <SelectTrigger className="w-[220px] h-12">
            <SelectValue placeholder="Large" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select components with different sizes.',
      },
    },
  },
};

/**
 * Disabled select
 */
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A disabled select component.',
      },
    },
  },
};

/**
 * Select with many options (scrollable)
 */
export const ScrollableOptions: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="mx">Mexico</SelectItem>
        <SelectItem value="gb">United Kingdom</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="it">Italy</SelectItem>
        <SelectItem value="es">Spain</SelectItem>
        <SelectItem value="pt">Portugal</SelectItem>
        <SelectItem value="nl">Netherlands</SelectItem>
        <SelectItem value="be">Belgium</SelectItem>
        <SelectItem value="ch">Switzerland</SelectItem>
        <SelectItem value="at">Austria</SelectItem>
        <SelectItem value="dk">Denmark</SelectItem>
        <SelectItem value="se">Sweden</SelectItem>
        <SelectItem value="no">Norway</SelectItem>
        <SelectItem value="fi">Finland</SelectItem>
        <SelectItem value="pl">Poland</SelectItem>
        <SelectItem value="cz">Czech Republic</SelectItem>
        <SelectItem value="hu">Hungary</SelectItem>
        <SelectItem value="ro">Romania</SelectItem>
        <SelectItem value="bg">Bulgaria</SelectItem>
        <SelectItem value="hr">Croatia</SelectItem>
        <SelectItem value="si">Slovenia</SelectItem>
        <SelectItem value="sk">Slovakia</SelectItem>
        <SelectItem value="lt">Lithuania</SelectItem>
        <SelectItem value="lv">Latvia</SelectItem>
        <SelectItem value="ee">Estonia</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A select with many options that requires scrolling.',
      },
    },
  },
};