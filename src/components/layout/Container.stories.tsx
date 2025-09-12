import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Container } from './Container';

const meta = {
  title: 'Components/Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive container component that provides consistent max-width and padding across different screen sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Maximum width of the container',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Horizontal padding of the container',
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo content component
const DemoContent = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-muted p-6 rounded-lg border-2 border-dashed border-muted-foreground/25">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-muted-foreground">{description}</p>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-background p-4 rounded border">
          <h3 className="font-medium">Content Block {i}</h3>
          <p className="text-sm text-muted-foreground">
            Some sample content to demonstrate the container layout.
          </p>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Default container (xl size with medium padding)
 */
export const Default: Story = {
  render: () => (
    <Container>
      <DemoContent
        title="Default Container (XL)"
        description="This is the default container size (max-w-7xl) with medium padding."
      />
    </Container>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default container with xl max-width and medium padding.',
      },
    },
  },
};

/**
 * Different container sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8 py-4">
      <Container size="sm">
        <DemoContent
          title="Small Container"
          description="Small container (max-w-2xl) - perfect for focused content like articles or forms."
        />
      </Container>
      
      <Container size="md">
        <DemoContent
          title="Medium Container"
          description="Medium container (max-w-4xl) - good for blog posts and documentation."
        />
      </Container>
      
      <Container size="lg">
        <DemoContent
          title="Large Container"
          description="Large container (max-w-6xl) - suitable for dashboards and complex layouts."
        />
      </Container>
      
      <Container size="xl">
        <DemoContent
          title="Extra Large Container"
          description="Extra large container (max-w-7xl) - the default size for most applications."
        />
      </Container>
      
      <Container size="full">
        <DemoContent
          title="Full Width Container"
          description="Full width container (max-w-full) - uses the entire available width."
        />
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different container sizes from small to full width.',
      },
    },
  },
};

/**
 * Different padding options
 */
export const Padding: Story = {
  render: () => (
    <div className="space-y-8 py-4">
      <div className="bg-red-100 dark:bg-red-900/20">
        <Container padding="none">
          <div className="bg-muted p-4 rounded">
            <h3 className="font-semibold">No Padding</h3>
            <p className="text-sm text-muted-foreground">Container with no horizontal padding.</p>
          </div>
        </Container>
      </div>
      
      <div className="bg-blue-100 dark:bg-blue-900/20">
        <Container padding="sm">
          <div className="bg-muted p-4 rounded">
            <h3 className="font-semibold">Small Padding</h3>
            <p className="text-sm text-muted-foreground">Container with small horizontal padding (px-4 sm:px-6).</p>
          </div>
        </Container>
      </div>
      
      <div className="bg-green-100 dark:bg-green-900/20">
        <Container padding="md">
          <div className="bg-muted p-4 rounded">
            <h3 className="font-semibold">Medium Padding</h3>
            <p className="text-sm text-muted-foreground">Container with medium horizontal padding (px-4 sm:px-6 lg:px-8).</p>
          </div>
        </Container>
      </div>
      
      <div className="bg-purple-100 dark:bg-purple-900/20">
        <Container padding="lg">
          <div className="bg-muted p-4 rounded">
            <h3 className="font-semibold">Large Padding</h3>
            <p className="text-sm text-muted-foreground">Container with large horizontal padding (px-4 sm:px-6 lg:px-8 xl:px-12).</p>
          </div>
        </Container>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different padding options with colored backgrounds to show the padding areas.',
      },
    },
  },
};

/**
 * Nested containers
 */
export const Nested: Story = {
  render: () => (
    <Container size="full" padding="lg" className="bg-muted/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Outer Container (Full Width)</h2>
        <p className="text-muted-foreground">This is a full-width container with large padding.</p>
      </div>
      
      <Container size="lg" padding="md" className="bg-background border rounded-lg">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Inner Container (Large)</h3>
          <p className="text-muted-foreground">Nested container with large max-width and medium padding.</p>
        </div>
        
        <Container size="sm" padding="sm" className="bg-muted/50 rounded">
          <div className="text-center py-8">
            <h4 className="font-medium">Innermost Container (Small)</h4>
            <p className="text-sm text-muted-foreground">The most nested container with small padding.</p>
          </div>
        </Container>
      </Container>
    </Container>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of nested containers with different sizes and padding.',
      },
    },
  },
};

/**
 * Container with custom styling
 */
export const CustomStyling: Story = {
  render: () => (
    <Container 
      size="md" 
      padding="lg" 
      className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border rounded-xl shadow-lg"
    >
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Custom Styled Container
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          This container has custom gradient background, rounded corners, and shadow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="font-semibold mb-2">Feature 1</h3>
            <p className="text-sm text-muted-foreground">
              Custom containers can have any styling applied.
            </p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="font-semibold mb-2">Feature 2</h3>
            <p className="text-sm text-muted-foreground">
              Perfect for landing pages and marketing sections.
            </p>
          </div>
        </div>
      </div>
    </Container>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Container with custom gradient background, shadows, and styling.',
      },
    },
  },
};

/**
 * Responsive behavior demonstration
 */
export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Responsive Container Behavior</h2>
        <p className="text-muted-foreground">
          Resize your browser to see how containers adapt to different screen sizes.
        </p>
      </div>
      
      <Container padding="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Mobile', 'Tablet', 'Desktop', 'Large'].map((device, index) => (
            <div key={device} className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">
                {index === 0 && '📱'}
                {index === 1 && '📱'}
                {index === 2 && '💻'}
                {index === 3 && '🖥️'}
              </div>
              <h3 className="font-medium">{device}</h3>
              <p className="text-sm text-muted-foreground">
                Responsive design
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h3 className="font-medium mb-2">Padding Breakdown:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Mobile:</strong> px-4 (16px horizontal padding)</li>
            <li>• <strong>Small screens:</strong> sm:px-6 (24px horizontal padding)</li>
            <li>• <strong>Large screens:</strong> lg:px-8 (32px horizontal padding)</li>
            <li>• <strong>Extra large:</strong> xl:px-12 (48px horizontal padding)</li>
          </ul>
        </div>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of how container padding adapts to different screen sizes.',
      },
    },
  },
};