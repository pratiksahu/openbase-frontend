import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A profile picture or user representation component with image and fallback support.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Avatar with image
 */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Avatar with fallback (when image fails to load)
 */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-link.jpg" alt="Broken Image" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar showing fallback initials when image fails to load.',
      },
    },
  },
};

/**
 * Different avatar sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6 text-xs">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8 text-sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="Medium" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
        <AvatarFallback>D</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16 text-lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="Extra Large" />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars in different sizes from small to extra large.',
      },
    },
  },
};

/**
 * Avatar group
 */
export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&q=80&fit=crop&crop=face" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&q=80&fit=crop&crop=face" alt="User 3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>+2</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple avatars grouped together with overlapping layout.',
      },
    },
  },
};

/**
 * Different fallback styles
 */
export const FallbackStyles: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-green-500 text-white">CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-purple-500 text-white">EF</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-red-500 text-white">GH</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar fallbacks with different background colors.',
      },
    },
  },
};

/**
 * Avatar with status indicator
 */
export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Online User" />
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
      </div>
      
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&q=80&fit=crop&crop=face" alt="Away User" />
          <AvatarFallback>AW</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-white"></span>
      </div>
      
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&q=80&fit=crop&crop=face" alt="Busy User" />
          <AvatarFallback>BS</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
      </div>
      
      <div className="relative">
        <Avatar>
          <AvatarFallback>OF</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-400 ring-2 ring-white"></span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with status indicators showing online/away/busy/offline states.',
      },
    },
  },
};

/**
 * User profile examples
 */
export const UserProfiles: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">john@example.com</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&q=80&fit=crop&crop=face" alt="Alex Smith" />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Alex Smith</p>
          <p className="text-xs text-muted-foreground">alex@example.com</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Maria Santos</p>
          <p className="text-xs text-muted-foreground">maria@example.com</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars used in user profile listings with names and emails.',
      },
    },
  },
};