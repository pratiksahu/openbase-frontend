import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { ContactForm } from './ContactForm';

const meta = {
  title: 'Components/Forms/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A complete contact form component with validation, built using React Hook Form and Zod schema validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      description: 'Callback function called when form is submitted',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
  },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default contact form
 */
export const Default: Story = {
  args: {
    onSubmit: _data => {
      // Contact form submitted with data
      alert(`Thank you ${_data.name}! We'll get back to you soon.`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'The default contact form with all fields and validation.',
      },
    },
  },
};

/**
 * Contact form with custom submit handler
 */
export const WithCustomHandler: Story = {
  render: () => {
    const [submissions, setSubmissions] = useState<any[]>([]);

    const handleSubmit = (_data: any) => {
      // Custom handler called with form data
      setSubmissions(prev => [
        ...prev,
        { ..._data, timestamp: new Date().toISOString() },
      ]);
    };

    return (
      <div className="space-y-6">
        <ContactForm onSubmit={handleSubmit} />

        {submissions.length > 0 && (
          <div className="bg-muted/50 w-full max-w-md rounded-lg border p-4">
            <h3 className="mb-2 font-medium">
              Submissions ({submissions.length})
            </h3>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {submissions.map((submission, index) => (
                <div
                  key={index}
                  className="bg-background rounded border p-2 text-sm"
                >
                  <div className="font-medium">{submission.name}</div>
                  <div className="text-muted-foreground">
                    {submission.email}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {new Date(submission.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Contact form with a custom submit handler that tracks submissions.',
      },
    },
  },
};

/**
 * Contact form with error simulation
 */
export const WithErrorSimulation: Story = {
  render: () => {
    const [shouldError, setShouldError] = useState(false);

    const handleSubmit = async (__data: any) => {
      if (shouldError) {
        throw new Error(
          'Network error: Failed to send message. Please try again.'
        );
      }
      alert('Message sent successfully!');
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <input
            type="checkbox"
            id="error-sim"
            checked={shouldError}
            onChange={_e => setShouldError(_e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="error-sim" className="text-sm">
            Simulate submission error
          </label>
        </div>

        <ContactForm onSubmit={handleSubmit} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Contact form with error simulation to test error handling.',
      },
    },
  },
};

/**
 * Contact form with custom styling
 */
export const CustomStyling: Story = {
  args: {
    className:
      'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border',
    onSubmit: _data => {
      // Styled form submitted with data
      alert('Message received! Thanks for reaching out.');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Contact form with custom gradient background styling.',
      },
    },
  },
};

/**
 * Minimal contact form example
 */
export const Minimal: Story = {
  render: () => (
    <div className="w-full max-w-xs">
      <ContactForm
        onSubmit={_data => {
          // Minimal form submitted with data
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Contact form in a minimal width container.',
      },
    },
  },
};

/**
 * Contact form in a modal-like container
 */
export const InModal: Story = {
  render: () => (
    <div className="mx-auto max-w-lg">
      <div className="bg-background rounded-lg border p-6 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold">Get In Touch</h2>
          <p className="text-muted-foreground">
            Have a question or want to work together? Send us a message!
          </p>
        </div>

        <ContactForm
          onSubmit={_data => {
            // Modal form submitted with data
            alert("Message sent! We'll respond within 24 hours.");
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Contact form presented in a modal-like container with header.',
      },
    },
  },
};

/**
 * Contact form with pre-filled data
 */
export const PreFilled: Story = {
  render: () => {
    // Note: This would require modifying the ContactForm component to accept defaultValues
    // For now, we show the concept
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This story demonstrates the concept of
            pre-filled forms. In a real implementation, you would pass
            defaultValues to the ContactForm component.
          </p>
        </div>

        <ContactForm
          onSubmit={_data => {
            // Pre-filled form submitted with data
            alert('Updated message sent!');
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Concept of a contact form with pre-filled data (would require component modification).',
      },
    },
  },
};
