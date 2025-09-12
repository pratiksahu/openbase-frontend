import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal dialog component built on top of Radix UI Dialog primitive, providing a flexible overlay for content.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic dialog with trigger button
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a basic dialog with a title and description. You can add any content here.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A basic dialog with header, content, and footer.',
      },
    },
  },
};

/**
 * Confirmation dialog for destructive actions
 */
export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the item
            and remove it from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A confirmation dialog for destructive actions.',
      },
    },
  },
};

/**
 * Form dialog with input fields
 */
export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new item to your collection.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              className="col-span-3 px-3 py-2 border rounded-md"
              placeholder="Enter name..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="col-span-3 px-3 py-2 border rounded-md"
              rows={3}
              placeholder="Enter description..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A dialog containing a form with input fields.',
      },
    },
  },
};

/**
 * Information dialog without footer
 */
export const InfoDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Info</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Information</DialogTitle>
          <DialogDescription>
            Here's some important information you should know.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Accessible by default</li>
              <li>• Keyboard navigation support</li>
              <li>• Focus management</li>
              <li>• Customizable styling</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An information dialog without footer buttons.',
      },
    },
  },
};

/**
 * Controlled dialog example
 */
export const ControlledDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open Dialog</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close Dialog
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Dialog is currently: {open ? 'Open' : 'Closed'}
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                This dialog is controlled by external state.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm">
                You can control this dialog programmatically using the buttons above.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A dialog controlled by external state.',
      },
    },
  },
};

/**
 * Dialog with custom styling
 */
export const CustomStyledDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Custom Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Custom Styled Dialog
          </DialogTitle>
          <DialogDescription className="text-blue-700 dark:text-blue-300">
            This dialog demonstrates custom styling capabilities.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm">
              You can customize the appearance of dialogs using Tailwind classes
              or your own CSS styles.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A dialog with custom styling and gradient backgrounds.',
      },
    },
  },
};