import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Header } from './header';

const meta = {
  title: 'Components/Shared/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive header component with navigation menu, logo, and theme toggle functionality.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default header
 */
export const Default: Story = {
  render: () => (
    <div>
      <Header />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Page Content</h1>
        <p className="text-muted-foreground">
          This is the main content area below the header. The header is sticky and will remain at the top when scrolling.
        </p>
        <div className="h-[200vh] flex items-center justify-center text-muted-foreground">
          <p>Scroll to see the sticky header behavior</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default header with navigation, logo, and theme toggle.',
      },
    },
  },
};

/**
 * Header in different contexts
 */
export const InContext: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
          <p className="text-lg text-muted-foreground mb-6">
            This demonstrates the header component in a typical page layout.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Features</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Responsive navigation menu</li>
                <li>• Mobile-friendly hamburger menu</li>
                <li>• Theme toggle (light/dark)</li>
                <li>• Sticky positioning</li>
                <li>• Active link highlighting</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Navigation</h2>
              <p className="text-muted-foreground">
                The header includes navigation links for Home, Features, Pricing, Blog, About, and Contact pages. 
                On mobile devices, these are collapsed into a hamburger menu.
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Try it out:</h3>
            <p className="text-sm text-muted-foreground">
              Click on the navigation items, toggle the theme, or resize your browser window to see the mobile menu.
            </p>
          </div>
        </div>
      </main>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header component shown in a realistic page context with content.',
      },
    },
  },
};