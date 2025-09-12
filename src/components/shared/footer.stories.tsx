import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Footer } from './footer';

const meta = {
  title: 'Components/Shared/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive footer component with links, social media icons, and company information.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default footer
 */
export const Default: Story = {
  render: () => (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-muted/30 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <p className="text-muted-foreground">
            This represents the main content of your website.
            The footer appears at the bottom of the page.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default footer with all sections: Company, Product, Resources, and Legal.',
      },
    },
  },
};

/**
 * Footer isolated view
 */
export const Isolated: Story = {
  render: () => <Footer />,
  parameters: {
    docs: {
      description: {
        story: 'The footer component shown in isolation.',
      },
    },
  },
};

/**
 * Footer in full page context
 */
export const FullPageContext: Story = {
  render: () => (
    <div className="min-h-screen">
      {/* Header placeholder */}
      <div className="border-b p-4 bg-background/95">
        <div className="container flex items-center justify-between">
          <div className="font-bold text-xl">Your Logo</div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-sm hover:text-primary">Home</a>
            <a href="#" className="text-sm hover:text-primary">About</a>
            <a href="#" className="text-sm hover:text-primary">Contact</a>
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <main className="container py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Our Website</h1>
          <p className="text-xl text-muted-foreground mb-8">
            This is a demonstration of a complete page layout with header, main content, and footer.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Feature One</h3>
              <p className="text-muted-foreground">Description of the first feature.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Feature Two</h3>
              <p className="text-muted-foreground">Description of the second feature.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Feature Three</h3>
              <p className="text-muted-foreground">Description of the third feature.</p>
            </div>
          </div>
          
          <div className="mt-16 h-96 bg-muted/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Additional content area</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Footer shown in a complete page layout context with header and main content.',
      },
    },
  },
};

/**
 * Mobile view demonstration
 */
export const MobileView: Story = {
  render: () => (
    <div className="max-w-sm mx-auto border-x min-h-screen">
      <div className="flex-1 p-6 text-center">
        <h2 className="text-lg font-semibold mb-4">Mobile Layout</h2>
        <p className="text-sm text-muted-foreground">
          This demonstrates how the footer looks on mobile devices.
          The grid layout adapts to show 2 columns instead of 4.
        </p>
      </div>
      <Footer />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Footer component displayed in a mobile-width container to show responsive behavior.',
      },
    },
  },
};