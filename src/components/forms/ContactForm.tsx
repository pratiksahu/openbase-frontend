'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { contactSchema, ContactFormData } from '@/lib/validations';

import { Checkbox } from './Checkbox';
import { Form } from './Form';
import { FormField } from './FormField';
import { Input } from './Input';
import { Textarea } from './Textarea';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
  className?: string;
}

const ContactForm = ({ onSubmit, className }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      phone: '',
      newsletter: false,
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default API call
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send message');
        }
      }

      setSubmitSuccess(true);
      form.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        className="rounded-lg border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20"
        data-testid="success-message"
      >
        <h3 className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
          Message Sent Successfully!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Thank you for your message. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Form
        form={form}
        onSubmit={handleSubmit}
        loading={isSubmitting}
        data-testid="contact-form"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Name" error={form.formState.errors.name} required>
            <Input
              id="name"
              placeholder="Your full name"
              {...form.register('name')}
              error={form.formState.errors.name}
            />
          </FormField>

          <FormField label="Email" error={form.formState.errors.email} required>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...form.register('email')}
              error={form.formState.errors.email}
              data-testid="error-email"
            />
          </FormField>
        </div>

        <FormField label="Phone (optional)" error={form.formState.errors.phone}>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            {...form.register('phone')}
            error={form.formState.errors.phone}
          />
        </FormField>

        <FormField
          label="Subject"
          error={form.formState.errors.subject}
          required
        >
          <Input
            id="subject"
            placeholder="How can we help you?"
            {...form.register('subject')}
            error={form.formState.errors.subject}
          />
        </FormField>

        <FormField
          label="Message"
          error={form.formState.errors.message}
          required
        >
          <Textarea
            id="message"
            placeholder="Tell us more about your inquiry..."
            autoResize
            minRows={4}
            maxRows={8}
            {...form.register('message')}
            error={form.formState.errors.message}
          />
        </FormField>

        <FormField error={form.formState.errors.newsletter}>
          <Checkbox
            id="newsletter"
            label="Subscribe to our newsletter"
            description="Get updates about new features and improvements"
            {...form.register('newsletter')}
            error={form.formState.errors.newsletter}
          />
        </FormField>

        {submitError && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
            data-testid="form-error"
          >
            <p className="text-sm text-red-800 dark:text-red-200">
              {submitError}
            </p>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </Form>
    </div>
  );
};

export { ContactForm };
