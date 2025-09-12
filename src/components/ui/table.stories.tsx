import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './badge';
import { Button } from './button';
import { Checkbox } from './checkbox';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible table component built with semantic HTML elements and consistent styling.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic table with simple data
 */
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV004</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$450.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV005</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$550.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV006</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$200.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV007</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$300.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic table with header, body, footer, and caption.',
      },
    },
  },
};

/**
 * Table with status badges
 */
export const WithBadges: Story = {
  render: () => (
    <Table>
      <TableCaption>Project status overview</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Assignee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Website Redesign</TableCell>
          <TableCell>
            <Badge variant="default">In Progress</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="destructive">High</Badge>
          </TableCell>
          <TableCell>2024-01-15</TableCell>
          <TableCell>John Doe</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Mobile App</TableCell>
          <TableCell>
            <Badge variant="secondary">Planning</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="outline">Medium</Badge>
          </TableCell>
          <TableCell>2024-02-01</TableCell>
          <TableCell>Jane Smith</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">API Integration</TableCell>
          <TableCell>
            <Badge className="bg-green-600">Complete</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="outline">Low</Badge>
          </TableCell>
          <TableCell>2023-12-20</TableCell>
          <TableCell>Bob Johnson</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Database Migration</TableCell>
          <TableCell>
            <Badge variant="destructive">Blocked</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="destructive">High</Badge>
          </TableCell>
          <TableCell>2024-01-30</TableCell>
          <TableCell>Alice Wilson</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A table with status badges for better visual distinction.',
      },
    },
  },
};

/**
 * Table with checkboxes and actions
 */
export const WithCheckboxes: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Checkbox />
          </TableCell>
          <TableCell className="font-medium">John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox />
          </TableCell>
          <TableCell className="font-medium">Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>Editor</TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox />
          </TableCell>
          <TableCell className="font-medium">Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Viewer</TableCell>
          <TableCell>
            <Badge variant="secondary">Inactive</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A table with checkboxes for row selection and action buttons.',
      },
    },
  },
};

/**
 * Compact table with minimal spacing
 */
export const Compact: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="h-8">Product</TableHead>
          <TableHead className="h-8">SKU</TableHead>
          <TableHead className="h-8">Stock</TableHead>
          <TableHead className="h-8 text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="h-8">
          <TableCell className="py-1">Laptop</TableCell>
          <TableCell className="py-1">LP-001</TableCell>
          <TableCell className="py-1">25</TableCell>
          <TableCell className="py-1 text-right">$999.99</TableCell>
        </TableRow>
        <TableRow className="h-8">
          <TableCell className="py-1">Mouse</TableCell>
          <TableCell className="py-1">MS-002</TableCell>
          <TableCell className="py-1">150</TableCell>
          <TableCell className="py-1 text-right">$29.99</TableCell>
        </TableRow>
        <TableRow className="h-8">
          <TableCell className="py-1">Keyboard</TableCell>
          <TableCell className="py-1">KB-003</TableCell>
          <TableCell className="py-1">80</TableCell>
          <TableCell className="py-1 text-right">$79.99</TableCell>
        </TableRow>
        <TableRow className="h-8">
          <TableCell className="py-1">Monitor</TableCell>
          <TableCell className="py-1">MN-004</TableCell>
          <TableCell className="py-1">15</TableCell>
          <TableCell className="py-1 text-right">$299.99</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A compact table with reduced padding for dense information.',
      },
    },
  },
};

/**
 * Table with no data state
 */
export const NoData: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-muted-foreground">No data available</p>
              <Button variant="outline" size="sm">
                Add New Item
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A table showing empty state when no data is available.',
      },
    },
  },
};

/**
 * Table with custom styling
 */
export const CustomStyling: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead className="text-center font-bold">Rank</TableHead>
          <TableHead className="font-bold">Team</TableHead>
          <TableHead className="text-center font-bold">Played</TableHead>
          <TableHead className="text-center font-bold">Won</TableHead>
          <TableHead className="text-center font-bold">Drawn</TableHead>
          <TableHead className="text-center font-bold">Lost</TableHead>
          <TableHead className="text-center font-bold">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-green-50 dark:hover:bg-green-950/20">
          <TableCell className="text-center font-bold text-green-600">1</TableCell>
          <TableCell className="font-medium">Arsenal</TableCell>
          <TableCell className="text-center">38</TableCell>
          <TableCell className="text-center">26</TableCell>
          <TableCell className="text-center">8</TableCell>
          <TableCell className="text-center">4</TableCell>
          <TableCell className="text-center font-bold">86</TableCell>
        </TableRow>
        <TableRow className="hover:bg-blue-50 dark:hover:bg-blue-950/20">
          <TableCell className="text-center font-bold text-blue-600">2</TableCell>
          <TableCell className="font-medium">Manchester City</TableCell>
          <TableCell className="text-center">38</TableCell>
          <TableCell className="text-center">24</TableCell>
          <TableCell className="text-center">7</TableCell>
          <TableCell className="text-center">7</TableCell>
          <TableCell className="text-center font-bold">79</TableCell>
        </TableRow>
        <TableRow className="hover:bg-red-50 dark:hover:bg-red-950/20">
          <TableCell className="text-center font-bold text-red-600">3</TableCell>
          <TableCell className="font-medium">Liverpool</TableCell>
          <TableCell className="text-center">38</TableCell>
          <TableCell className="text-center">22</TableCell>
          <TableCell className="text-center">10</TableCell>
          <TableCell className="text-center">6</TableCell>
          <TableCell className="text-center font-bold">76</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A table with custom styling for different visual emphasis.',
      },
    },
  },
};

/**
 * Responsive table (horizontal scroll on mobile)
 */
export const Responsive: Story = {
  render: () => (
    <div className="w-[300px] border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Responsive Table</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono">TXN001</TableCell>
            <TableCell>2024-01-15</TableCell>
            <TableCell>Coffee Shop Purchase</TableCell>
            <TableCell>Food & Drink</TableCell>
            <TableCell>
              <Badge variant="default">Complete</Badge>
            </TableCell>
            <TableCell className="text-right">$4.50</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">TXN002</TableCell>
            <TableCell>2024-01-14</TableCell>
            <TableCell>Gas Station Fill-up</TableCell>
            <TableCell>Transportation</TableCell>
            <TableCell>
              <Badge variant="default">Complete</Badge>
            </TableCell>
            <TableCell className="text-right">$45.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A table that scrolls horizontally when content exceeds container width.',
      },
    },
  },
};