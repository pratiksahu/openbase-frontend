# TASK_011: React Hook Form and Zod Integration

## Overview
Implement a robust form management system using React Hook Form for form state management and Zod for schema validation. This task focuses on creating reusable form components, validation patterns, and error handling that can be used consistently throughout the application.

## Objectives
- Install and configure React Hook Form with TypeScript support
- Integrate Zod for runtime type checking and validation
- Create reusable form field components
- Build form wrapper components with error handling
- Implement validation schemas for common use cases
- Create a working contact form as an example
- Ensure accessibility compliance for all form components

## Implementation Steps

### 1. Install Dependencies

```bash
# Install React Hook Form
npm install react-hook-form

# Install Zod for validation
npm install zod

# Install hookform resolvers for Zod integration
npm install @hookform/resolvers

# Install additional form utilities
npm install react-textarea-autosize
```

### 2. Create Form Field Components

Create `src/components/forms/FormField.tsx`:

```tsx
'use client';

import { cn } from '@/lib/utils';
import { ReactNode, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label?: string;
  error?: FieldError | string;
  description?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, description, required, className, children, ...props }, ref) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label className="text-sm font-medium text-foreground flex items-center">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        
        <div className="relative">
          {children}
        </div>
        
        {errorMessage && (
          <p 
            className="text-sm text-destructive flex items-center"
            role="alert"
            aria-live="polite"
          >
            <span className="mr-1">⚠</span>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
```

### 3. Create Input Components

Create `src/components/forms/Input.tsx`:

```tsx
'use client';

import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError | string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        ref={ref}
        aria-invalid={hasError}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
```

Create `src/components/forms/Textarea.tsx`:

```tsx
'use client';

import { cn } from '@/lib/utils';
import { forwardRef, TextareaHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError | string;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    error, 
    autoResize = false, 
    minRows = 3, 
    maxRows = 10,
    ...props 
  }, ref) => {
    const hasError = Boolean(error);

    const baseClassName = cn(
      'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      hasError && 'border-destructive focus-visible:ring-destructive',
      !autoResize && 'min-h-[80px] resize-y',
      className
    );

    if (autoResize) {
      return (
        <TextareaAutosize
          className={baseClassName}
          ref={ref}
          minRows={minRows}
          maxRows={maxRows}
          aria-invalid={hasError}
          {...props}
        />
      );
    }

    return (
      <textarea
        className={baseClassName}
        ref={ref}
        aria-invalid={hasError}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
```

### 4. Create Select Component

Create `src/components/forms/Select.tsx`:

```tsx
'use client';

import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { forwardRef, SelectHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: FieldError | string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, children, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className="relative">
        <select
          className={cn(
            'flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          aria-invalid={hasError}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select, type SelectOption };
```

### 5. Create Checkbox and Radio Components

Create `src/components/forms/Checkbox.tsx`:

```tsx
'use client';

import { cn } from '@/lib/utils';
import { CheckIcon } from '@heroicons/react/24/outline';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: FieldError | string;
  label?: ReactNode;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, label, description, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className="flex items-start space-x-3">
        <div className="relative">
          <input
            type="checkbox"
            className={cn(
              'peer h-4 w-4 shrink-0 rounded-sm border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-destructive',
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={description ? `${props.id}-description` : undefined}
            {...props}
          />
          <CheckIcon className="absolute inset-0 h-4 w-4 text-background opacity-0 peer-checked:opacity-100 pointer-events-none" />
        </div>
        
        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label 
                htmlFor={props.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p 
                id={`${props.id}-description`}
                className="text-xs text-muted-foreground"
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
```

### 6. Create Form Component

Create `src/components/forms/Form.tsx`:

```tsx
'use client';

import { cn } from '@/lib/utils';
import { FormHTMLAttributes, ReactNode } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

interface FormProps<T extends FieldValues> extends FormHTMLAttributes<HTMLFormElement> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  loading?: boolean;
}

function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  loading,
  ...props
}: FormProps<T>) {
  const handleSubmit = form.handleSubmit(async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle form errors here if needed
    }
  });

  return (
    <FormProvider {...form}>
      <form
        className={cn('space-y-6', className)}
        onSubmit={handleSubmit}
        noValidate
        {...props}
      >
        <fieldset disabled={loading} className="space-y-6">
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
}

export { Form };
```

### 7. Create Validation Schemas

Create `src/lib/validations.ts`:

```typescript
import { z } from 'zod';

// Common validation patterns
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number');

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .or(z.literal(''));

// Contact form schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneSchema.safeParse(val).success, {
      message: 'Please enter a valid phone number',
    }),
  newsletter: z.boolean().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// User registration schema
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Profile update schema
export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: emailSchema,
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: urlSchema.optional(),
  location: z.string().max(100).optional(),
  birthDate: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Settings schema
export const settingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
  }),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    language: z.string(),
    timezone: z.string(),
  }),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
```

### 8. Create Contact Form Example

Create `src/components/forms/ContactForm.tsx`:

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
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
        className="text-center p-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        data-testid="success-message"
      >
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Thank you for your message. We'll get back to you soon.
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
          <FormField
            label="Name"
            error={form.formState.errors.name}
            required
          >
            <Input
              id="name"
              placeholder="Your full name"
              {...form.register('name')}
              error={form.formState.errors.name}
            />
          </FormField>

          <FormField
            label="Email"
            error={form.formState.errors.email}
            required
          >
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

        <FormField
          label="Phone (optional)"
          error={form.formState.errors.phone}
        >
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
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            data-testid="form-error"
          >
            <p className="text-red-800 dark:text-red-200 text-sm">{submitError}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          loading={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </Form>
    </div>
  );
};

export { ContactForm };
```

### 9. Create API Route for Contact Form

Create `src/app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = contactSchema.parse(body);
    
    // TODO: Implement your email service here
    // For now, we'll just log the data
    console.log('Contact form submission:', validatedData);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Send email using your preferred service
    // Examples: SendGrid, Nodemailer, AWS SES, etc.
    
    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        id: `contact-${Date.now()}`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Validation error',
          errors: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 10. Create Form Components Index

Create `src/components/forms/index.ts`:

```typescript
export { Form } from './Form';
export { FormField } from './FormField';
export { Input } from './Input';
export { Textarea } from './Textarea';
export { Select, type SelectOption } from './Select';
export { Checkbox } from './Checkbox';
export { ContactForm } from './ContactForm';
```

## Acceptance Criteria

- [ ] React Hook Form is properly integrated with TypeScript
- [ ] Zod validation schemas work correctly
- [ ] Form components are accessible (ARIA attributes, labels)
- [ ] Error messages are displayed appropriately
- [ ] Form submission handles loading and error states
- [ ] Contact form validates all fields correctly
- [ ] API routes handle form submissions with validation
- [ ] Form components are reusable and customizable
- [ ] Success states are handled gracefully
- [ ] Form data persists during validation errors

## Testing Instructions

### 1. Test Form Validation
```bash
# Navigate to contact form
# Try submitting empty form - should show validation errors
# Fill invalid email - should show email error
# Fill short message - should show length error
```

### 2. Test Form Submission
```bash
# Fill valid data and submit
# Verify loading state appears
# Check success message displays
# Verify form resets after success
```

### 3. Test Error Handling
```bash
# Mock API error in network tab
# Submit form and verify error display
# Check error messages are user-friendly
```

### 4. Test Accessibility
```bash
# Navigate form using only keyboard
# Verify screen reader compatibility
# Check ARIA attributes are present
# Test focus management
```

## References and Dependencies

### Dependencies
- `react-hook-form`: Form state management
- `zod`: Schema validation
- `@hookform/resolvers`: Zod integration
- `react-textarea-autosize`: Auto-resizing textarea

### Documentation
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Estimated Time
**6-8 hours**

- Form components development: 3-4 hours
- Validation schemas: 1-2 hours
- Contact form implementation: 2-3 hours
- API integration: 1-2 hours
- Testing and refinement: 1-2 hours

## Troubleshooting

### Common Issues

1. **Zod validation not working**
   - Ensure `@hookform/resolvers` is installed
   - Check resolver is properly configured
   - Verify schema matches form structure

2. **TypeScript errors with form data**
   - Use `z.infer<typeof schema>` for type inference
   - Ensure form default values match schema
   - Check register() calls match field names

3. **Accessibility issues**
   - Add proper labels and ARIA attributes
   - Ensure error messages are associated with fields
   - Test keyboard navigation

4. **Form submission errors**
   - Check API route validation
   - Handle network errors gracefully
   - Provide user-friendly error messages

5. **Styling inconsistencies**
   - Use consistent spacing in form components
   - Ensure focus states are visible
   - Test dark mode compatibility