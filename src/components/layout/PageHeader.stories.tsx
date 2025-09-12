import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';

import { PageHeader } from './PageHeader';

const meta = {
  title: 'Components/Layout/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A page header component that displays page title, description, actions, and optional breadcrumb navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The page title',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the header',
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic page header
 */
export const Default: Story = {
  args: {
    title: 'Dashboard',
    description: 'Overview of your account and recent activity.',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic page header with title and description.',
      },
    },
  },
};

/**
 * Page header with actions
 */
export const WithActions: Story = {
  args: {
    title: 'Projects',
    description: 'Manage and organize your projects.',
    actions: (
      <div className="flex gap-2">
        <Button variant="outline">Import</Button>
        <Button>New Project</Button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with action buttons on the right side.',
      },
    },
  },
};

/**
 * Page header with breadcrumb
 */
export const WithBreadcrumb: Story = {
  args: {
    title: 'Settings',
    description: 'Manage your account preferences and configuration.',
    breadcrumb: (
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground">Home</a>
        <span>/</span>
        <a href="#" className="hover:text-foreground">Account</a>
        <span>/</span>
        <span>Settings</span>
      </nav>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with breadcrumb navigation.',
      },
    },
  },
};

/**
 * Complete page header with all elements
 */
export const Complete: Story = {
  args: {
    title: 'User Management',
    description: 'Add, edit, and manage user accounts and permissions.',
    breadcrumb: (
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground">Admin</a>
        <span>/</span>
        <a href="#" className="hover:text-foreground">Users</a>
        <span>/</span>
        <span>Management</span>
      </nav>
    ),
    actions: (
      <div className="flex gap-2">
        <Button variant="outline">Export</Button>
        <Button variant="outline">Import</Button>
        <Button>Add User</Button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete page header with breadcrumb, title, description, and actions.',
      },
    },
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-12">
      <PageHeader
        size="sm"
        title="Small Header"
        description="This is a small page header with reduced spacing and font size."
        actions={<Button size="sm">Action</Button>}
      />
      
      <PageHeader
        size="md"
        title="Medium Header"
        description="This is a medium page header with default spacing and font size."
        actions={<Button>Action</Button>}
      />
      
      <PageHeader
        size="lg"
        title="Large Header"
        description="This is a large page header with increased spacing and font size."
        actions={<Button size="lg">Action</Button>}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Page headers in different sizes: small, medium, and large.',
      },
    },
  },
};

/**
 * Page header without description
 */
export const TitleOnly: Story = {
  args: {
    title: 'Analytics',
    actions: (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Export</Button>
        <Button size="sm">Refresh</Button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with only a title and actions, no description.',
      },
    },
  },
};

/**
 * Page header in context
 */
export const InContext: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="E-commerce Dashboard"
        description="Monitor your store performance, sales, and customer analytics."
        breadcrumb={
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Home</a>
            <span>/</span>
            <span>Dashboard</span>
          </nav>
        }
        actions={
          <div className="flex gap-2">
            <Button variant="outline">Download Report</Button>
            <Button>View Details</Button>
          </div>
        }
      />
      
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Revenue', value: '$12,345', change: '+12.5%' },
            { title: 'Orders', value: '1,234', change: '+5.2%' },
            { title: 'Customers', value: '5,678', change: '+8.1%' },
            { title: 'Products', value: '234', change: '+2.4%' },
          ].map((stat) => (
            <div key={stat.title} className="bg-card p-6 rounded-lg border">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-8 bg-card rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">
            This area would contain charts, tables, and other dashboard content.
            The page header provides context and actions for the entire page.
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Page header shown in the context of a complete dashboard page.',
      },
    },
  },
};