import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component with header, content, and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card with all sections
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can place any content.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Continue</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Simple card with just title and content
 */
export const Simple: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a simple card with just a title and content.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A simplified card with just title and content sections.',
      },
    },
  },
};

/**
 * Card with statistics or metrics
 */
export const Statistics: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <span className="text-2xl">💰</span>
        </div>
        <div>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Users</CardTitle>
          <span className="text-2xl">👥</span>
        </div>
        <div>
          <div className="text-2xl font-bold">+2,350</div>
          <p className="text-xs text-muted-foreground">
            +180.1% from last month
          </p>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <span className="text-2xl">📈</span>
        </div>
        <div>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">
            +19% from last month
          </p>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards displaying statistics or metrics with icons and comparison data.',
      },
    },
  },
};

/**
 * Product card example
 */
export const ProductCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <div className="aspect-square bg-gray-100 rounded-t-xl flex items-center justify-center">
        <span className="text-6xl">📱</span>
      </div>
      <CardHeader>
        <CardTitle>iPhone 15 Pro</CardTitle>
        <CardDescription>
          The most advanced iPhone yet with titanium design and powerful A17 chip.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">$999</span>
          <span className="text-sm text-muted-foreground">Starting at</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a product card with image, description, and action button.',
      },
    },
  },
};

/**
 * Notification card
 */
export const Notification: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <span className="text-blue-600">🔔</span>
          </div>
          <div>
            <CardTitle className="text-base">New Message</CardTitle>
            <CardDescription>2 minutes ago</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>You have received a new message from John Doe. Click to view the full conversation.</p>
      </CardContent>
      <CardFooter className="pt-3">
        <Button variant="ghost" size="sm">Dismiss</Button>
        <Button size="sm" className="ml-auto">View Message</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card used for displaying notifications with actions.',
      },
    },
  },
};