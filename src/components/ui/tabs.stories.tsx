import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A set of layered sections of content that are displayed one at a time.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic tabs
 */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Account</h3>
          <p className="text-sm text-muted-foreground">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Pedro Duarte" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="@peduarte" />
        </div>
        <Button>Save changes</Button>
      </TabsContent>
      <TabsContent value="password" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Password</h3>
          <p className="text-sm text-muted-foreground">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="current">Current password</Label>
          <Input id="current" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new">New password</Label>
          <Input id="new" type="password" />
        </div>
        <Button>Save password</Button>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * More tabs
 */
export const MultipleTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <h3 className="text-xl font-bold">Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold">Total Users</h4>
            <p className="text-2xl font-bold text-blue-600">12,345</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold">Revenue</h4>
            <p className="text-2xl font-bold text-green-600">$45,678</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-4">
        <h3 className="text-xl font-bold">Analytics</h3>
        <div className="p-4 border rounded-lg">
          <p className="text-muted-foreground">Analytics dashboard would go here...</p>
          <div className="mt-4 h-32 bg-muted rounded flex items-center justify-center">
            <span className="text-muted-foreground">Chart Placeholder</span>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="reports" className="space-y-4">
        <h3 className="text-xl font-bold">Reports</h3>
        <div className="space-y-2">
          <div className="p-3 border rounded flex justify-between items-center">
            <span>Monthly Report - November 2023</span>
            <Button size="sm" variant="outline">Download</Button>
          </div>
          <div className="p-3 border rounded flex justify-between items-center">
            <span>Weekly Report - Week 47</span>
            <Button size="sm" variant="outline">Download</Button>
          </div>
          <div className="p-3 border rounded flex justify-between items-center">
            <span>Daily Report - Today</span>
            <Button size="sm" variant="outline">Download</Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-4">
        <h3 className="text-xl font-bold">Notifications</h3>
        <div className="space-y-3">
          <div className="p-3 border rounded">
            <p className="font-medium">New user registration</p>
            <p className="text-sm text-muted-foreground">2 minutes ago</p>
          </div>
          <div className="p-3 border rounded">
            <p className="font-medium">Payment received</p>
            <p className="text-sm text-muted-foreground">1 hour ago</p>
          </div>
          <div className="p-3 border rounded">
            <p className="font-medium">System maintenance scheduled</p>
            <p className="text-sm text-muted-foreground">3 hours ago</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tabs with multiple sections showing different types of content.',
      },
    },
  },
};

/**
 * Vertical tabs layout
 */
export const VerticalLayout: Story = {
  render: () => (
    <Tabs defaultValue="general" className="w-[600px]" orientation="vertical">
      <div className="flex">
        <TabsList className="flex-col h-auto w-48 p-1">
          <TabsTrigger value="general" className="w-full justify-start">
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start">
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="w-full justify-start">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="support" className="w-full justify-start">
            Support
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 ml-4">
          <TabsContent value="general" className="space-y-4 mt-0">
            <h3 className="text-lg font-semibold">General Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input id="app-name" placeholder="My Awesome App" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" 
                  className="w-full p-2 border rounded-md" 
                  rows={3}
                  placeholder="Describe your application..."
                />
              </div>
              <Button>Save Changes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 mt-0">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">API Keys</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Manage your API access keys
                </p>
                <Button variant="outline">Manage Keys</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4 mt-0">
            <h3 className="text-lg font-semibold">Integrations</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Slack</h4>
                  <p className="text-sm text-muted-foreground">Team communication</p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <div className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-medium">GitHub</h4>
                  <p className="text-sm text-muted-foreground">Code repository</p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="support" className="space-y-4 mt-0">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Contact Support</h4>
                <p className="text-sm text-muted-foreground">Get help from our support team</p>
                <Button className="mt-2">Contact Us</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Documentation</h4>
                <p className="text-sm text-muted-foreground">Learn how to use our platform</p>
                <Button variant="outline" className="mt-2">View Docs</Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical tabs layout for settings or configuration pages.',
      },
    },
  },
};

/**
 * Content tabs
 */
export const ContentTabs: Story = {
  render: () => (
    <Tabs defaultValue="preview" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="docs">Documentation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="preview" className="border rounded-lg p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Component Preview</h3>
          <div className="p-4 bg-muted rounded">
            <Button>Sample Button</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            This is how the component looks when rendered.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="code" className="border rounded-lg p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Source Code</h3>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
            <pre>{`<Button variant="default">
  Sample Button  
</Button>`}</pre>
          </div>
          <p className="text-sm text-muted-foreground">
            Copy and paste this code into your project.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="docs" className="border rounded-lg p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Documentation</h3>
          <div className="prose prose-sm max-w-none">
            <h4>Props</h4>
            <ul>
              <li><code>variant</code> - The visual style variant</li>
              <li><code>size</code> - The size of the button</li>
              <li><code>disabled</code> - Whether the button is disabled</li>
            </ul>
            <h4>Usage</h4>
            <p>The Button component is used for triggering actions and navigation.</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tabs for displaying different views of the same content (preview, code, docs).',
      },
    },
  },
};

/**
 * Disabled tab
 */
export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="available" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="available">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Available Content</h3>
          <p className="text-sm text-muted-foreground">
            This content is available and can be accessed.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="pending">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Pending Content</h3>
          <p className="text-sm text-muted-foreground">
            This content is pending approval.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="disabled">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Disabled Content</h3>
          <p className="text-sm text-muted-foreground">
            This content is currently disabled.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tabs with one disabled tab that cannot be selected.',
      },
    },
  },
};