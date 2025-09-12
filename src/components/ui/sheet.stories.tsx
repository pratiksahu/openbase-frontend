import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Textarea } from './textarea';

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A sheet component built on top of Radix UI Dialog primitive, providing slide-out panels from different sides of the screen.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic sheet sliding from the right
 */
export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            This is a basic sheet that slides in from the right side of the screen.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm">
            Sheet content goes here. You can add any content you need in this area.
          </p>
        </div>
        <SheetFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic sheet with header, content, and footer sliding from the right.',
      },
    },
  },
};

/**
 * Sheet sliding from different sides
 */
export const DifferentSides: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap justify-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Left Sheet</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the left side.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm">Content from the left side.</p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Right Sheet</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the right side.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm">Content from the right side.</p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Top Sheet</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the top.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm">Content from the top.</p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Bottom Sheet</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the bottom.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm">Content from the bottom.</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sheets sliding from different sides of the screen.',
      },
    },
  },
};

/**
 * Sheet with form content
 */
export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit Profile</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="John Doe"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              defaultValue="john@example.com"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea
              id="bio"
              defaultValue="Software developer passionate about creating amazing user experiences."
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A sheet containing a form with input fields.',
      },
    },
  },
};

/**
 * Navigation menu sheet (mobile-style)
 */
export const NavigationMenu: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">☰ Menu</Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Browse through the different sections of our website.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <nav className="flex flex-col space-y-4">
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:underline"
            >
              🏠 Home
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:underline"
            >
              📝 About
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:underline"
            >
              🛍️ Products
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:underline"
            >
              🎯 Services
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:underline"
            >
              📞 Contact
            </a>
            <div className="border-t pt-4 mt-4">
              <a
                href="#"
                className="flex items-center text-sm font-medium hover:underline"
              >
                👤 Account
              </a>
              <a
                href="#"
                className="flex items-center text-sm font-medium hover:underline mt-2"
              >
                ⚙️ Settings
              </a>
              <a
                href="#"
                className="flex items-center text-sm font-medium hover:underline mt-2"
              >
                📊 Dashboard
              </a>
            </div>
          </nav>
        </div>
        <SheetFooter>
          <Button variant="outline" className="w-full">
            🔓 Sign Out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A sheet used as a mobile-style navigation menu.',
      },
    },
  },
};

/**
 * Shopping cart sheet
 */
export const ShoppingCart: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">🛒 Cart (3)</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Review your items before checkout.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
              📱
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Smartphone</h4>
              <p className="text-sm text-muted-foreground">Color: Black</p>
              <p className="text-sm font-medium">$699.99</p>
            </div>
            <Button variant="outline" size="sm">
              Remove
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
              🎧
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Headphones</h4>
              <p className="text-sm text-muted-foreground">Color: White</p>
              <p className="text-sm font-medium">$199.99</p>
            </div>
            <Button variant="outline" size="sm">
              Remove
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
              💻
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Laptop</h4>
              <p className="text-sm text-muted-foreground">Storage: 512GB</p>
              <p className="text-sm font-medium">$1,299.99</p>
            </div>
            <Button variant="outline" size="sm">
              Remove
            </Button>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Subtotal:</span>
              <span className="text-sm font-medium">$2,199.97</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Tax:</span>
              <span className="text-sm font-medium">$219.99</span>
            </div>
            <div className="flex justify-between items-center font-medium">
              <span>Total:</span>
              <span>$2,419.96</span>
            </div>
          </div>
        </div>
        <SheetFooter className="flex flex-col space-y-2">
          <Button className="w-full">Proceed to Checkout</Button>
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A sheet used as a shopping cart with items and checkout.',
      },
    },
  },
};

/**
 * Controlled sheet
 */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open Sheet</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close Sheet
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Sheet is currently: {open ? 'Open' : 'Closed'}
        </p>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Controlled Sheet</SheetTitle>
              <SheetDescription>
                This sheet is controlled by external state.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <p className="text-sm">
                You can control this sheet programmatically using the buttons above.
              </p>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A sheet controlled by external state.',
      },
    },
  },
};

/**
 * Sheet without header or footer
 */
export const ContentOnly: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Content Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="h-full flex flex-col justify-center items-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold">Success!</h2>
          <p className="text-center text-muted-foreground">
            Your action was completed successfully. This sheet contains only content
            without a header or footer.
          </p>
          <Button onClick={() => {}}>Continue</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A sheet with only content, no header or footer.',
      },
    },
  },
};

/**
 * Custom sized sheet
 */
export const CustomSize: Story = {
  render: () => (
    <div className="flex gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Small Sheet</Button>
        </SheetTrigger>
        <SheetContent className="w-[300px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle>Small Sheet</SheetTitle>
            <SheetDescription>
              This is a smaller width sheet.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm">Compact content area.</p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Large Sheet</Button>
        </SheetTrigger>
        <SheetContent className="w-[600px] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle>Large Sheet</SheetTitle>
            <SheetDescription>
              This is a wider sheet with more space for content.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm">
              This larger sheet has more room for detailed content, forms, or other
              complex layouts.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Section 1</h4>
                <p className="text-sm text-muted-foreground">
                  Content for the first section.
                </p>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Section 2</h4>
                <p className="text-sm text-muted-foreground">
                  Content for the second section.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sheets with custom widths for different use cases.',
      },
    },
  },
};