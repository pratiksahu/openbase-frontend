import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A breadcrumb navigation component that shows the current page location within a navigational hierarchy.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic breadcrumb navigation
 */
export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Laptops', href: '/products/laptops' },
      { label: 'MacBook Pro' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic breadcrumb with multiple navigation levels.',
      },
    },
  },
};

/**
 * Breadcrumb with icons
 */
export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
      { label: 'Projects', href: '/projects', icon: '📁' },
      { label: 'Website Redesign', href: '/projects/website', icon: '🎨' },
      { label: 'Settings', icon: '⚙️' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumb navigation with icons for each item.',
      },
    },
  },
};

/**
 * Simple two-level breadcrumb
 */
export const Simple: Story = {
  args: {
    items: [
      { label: 'Blog', href: '/blog' },
      { label: 'Getting Started with React' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A simple two-level breadcrumb navigation.',
      },
    },
  },
};

/**
 * Deep navigation breadcrumb
 */
export const DeepNavigation: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Components', href: '/docs/components' },
      { label: 'Navigation', href: '/docs/components/navigation' },
      { label: 'Breadcrumb', href: '/docs/components/navigation/breadcrumb' },
      { label: 'Examples' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A deep navigation breadcrumb with many levels.',
      },
    },
  },
};

/**
 * E-commerce style breadcrumb
 */
export const ECommerce: Story = {
  args: {
    items: [
      { label: 'Shop', href: '/shop', icon: '🛍️' },
      { label: 'Electronics', href: '/shop/electronics', icon: '⚡' },
      { label: 'Smartphones', href: '/shop/electronics/smartphones', icon: '📱' },
      { label: 'iPhone 15 Pro', icon: '🍎' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'E-commerce style breadcrumb with category navigation.',
      },
    },
  },
};