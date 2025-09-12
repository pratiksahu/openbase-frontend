import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Form } from './Form';
import { FormField } from './FormField';

const meta = {
  title: 'Components/Forms/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form wrapper component built on top of React Hook Form, providing form state management and validation.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define schemas for different examples
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;
type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Basic login form
 */
export const LoginForm: Story = {
  render: () => {
    const form = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    });

    const onSubmit = (data: LoginFormData) => {
      console.log('Login form data:', data);
      alert(`Login attempt for: ${data.email}`);
    };

    return (
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Sign In</h2>
          <p className="text-muted-foreground">Enter your credentials to continue</p>
        </div>
        
        <Form form={form} onSubmit={onSubmit}>
          <FormField
            label="Email"
            required
            error={form.formState.errors.email}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              {...form.register('email')}
            />
          </FormField>

          <FormField
            label="Password"
            required
            error={form.formState.errors.password}
          >
            <Input
              type="password"
              placeholder="Enter your password"
              {...form.register('password')}
            />
          </FormField>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </Form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic login form with email and password fields.',
      },
    },
  },
};

/**
 * Profile form with multiple fields
 */
export const ProfileForm: Story = {
  render: () => {
    const form = useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        bio: '',
        website: '',
      },
    });

    const onSubmit = (data: ProfileFormData) => {
      console.log('Profile form data:', data);
      alert('Profile updated successfully!');
    };

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <p className="text-muted-foreground">Update your profile information</p>
        </div>
        
        <Form form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="First Name"
              required
              error={form.formState.errors.firstName}
            >
              <Input placeholder="John" {...form.register('firstName')} />
            </FormField>

            <FormField
              label="Last Name"
              required
              error={form.formState.errors.lastName}
            >
              <Input placeholder="Doe" {...form.register('lastName')} />
            </FormField>
          </div>

          <FormField
            label="Email"
            required
            error={form.formState.errors.email}
          >
            <Input
              type="email"
              placeholder="john@example.com"
              {...form.register('email')}
            />
          </FormField>

          <FormField
            label="Website"
            description="Your personal or professional website"
            error={form.formState.errors.website}
          >
            <Input
              type="url"
              placeholder="https://yourwebsite.com"
              {...form.register('website')}
            />
          </FormField>

          <FormField
            label="Bio"
            description="Tell us a bit about yourself"
            error={form.formState.errors.bio}
          >
            <Textarea
              placeholder="I'm a software developer passionate about..."
              rows={3}
              {...form.register('bio')}
            />
          </FormField>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" className="flex-1">
              Save Profile
            </Button>
          </div>
        </Form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A profile form with multiple fields and validation.',
      },
    },
  },
};

/**
 * Contact form with loading state
 */
export const ContactFormWithLoading: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<ContactFormData>({
      resolver: zodResolver(contactSchema),
      defaultValues: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
    });

    const onSubmit = async (data: ContactFormData) => {
      setIsLoading(true);
      console.log('Contact form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsLoading(false);
      alert('Message sent successfully!');
      form.reset();
    };

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground">We'd love to hear from you</p>
        </div>
        
        <Form form={form} onSubmit={onSubmit} loading={isLoading}>
          <FormField
            label="Name"
            required
            error={form.formState.errors.name}
          >
            <Input placeholder="Your name" {...form.register('name')} />
          </FormField>

          <FormField
            label="Email"
            required
            error={form.formState.errors.email}
          >
            <Input
              type="email"
              placeholder="your@email.com"
              {...form.register('email')}
            />
          </FormField>

          <FormField
            label="Subject"
            required
            error={form.formState.errors.subject}
          >
            <Input
              placeholder="What's this about?"
              {...form.register('subject')}
            />
          </FormField>

          <FormField
            label="Message"
            required
            description="Please provide as much detail as possible"
            error={form.formState.errors.message}
          >
            <Textarea
              placeholder="Your message here..."
              rows={4}
              {...form.register('message')}
            />
          </FormField>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </Form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A contact form with loading state simulation.',
      },
    },
  },
};

/**
 * Form with conditional fields
 */
export const ConditionalForm: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        accountType: 'personal',
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
      },
    });

    const watchAccountType = form.watch('accountType');

    const onSubmit = (data: any) => {
      console.log('Conditional form data:', data);
      alert('Account created successfully!');
    };

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">Create Account</h2>
          <p className="text-muted-foreground">Choose your account type</p>
        </div>
        
        <Form form={form} onSubmit={onSubmit}>
          <FormField label="Account Type" required>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...form.register('accountType')}
            >
              <option value="personal">Personal</option>
              <option value="business">Business</option>
            </select>
          </FormField>

          {watchAccountType === 'personal' ? (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name" required>
                <Input placeholder="John" {...form.register('firstName')} />
              </FormField>
              <FormField label="Last Name" required>
                <Input placeholder="Doe" {...form.register('lastName')} />
              </FormField>
            </div>
          ) : (
            <FormField label="Company Name" required>
              <Input placeholder="Acme Corp" {...form.register('companyName')} />
            </FormField>
          )}

          <FormField label="Email" required>
            <Input
              type="email"
              placeholder="your@email.com"
              {...form.register('email')}
            />
          </FormField>

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </Form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A form with conditional fields based on user selection.',
      },
    },
  },
};

/**
 * Form with custom validation
 */
export const CustomValidation: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      mode: 'onChange',
    });

    const password = form.watch('password');

    const onSubmit = (data: any) => {
      console.log('Registration form data:', data);
      alert('Registration successful!');
    };

    return (
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">Register</h2>
          <p className="text-muted-foreground">Create your account</p>
        </div>
        
        <Form form={form} onSubmit={onSubmit}>
          <FormField
            label="Username"
            required
            description="Must be at least 3 characters"
            error={form.formState.errors.username}
          >
            <Input
              placeholder="username"
              {...form.register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores',
                },
              })}
            />
          </FormField>

          <FormField
            label="Password"
            required
            description="Must be at least 8 characters"
            error={form.formState.errors.password}
          >
            <Input
              type="password"
              placeholder="password"
              {...form.register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
          </FormField>

          <FormField
            label="Confirm Password"
            required
            error={form.formState.errors.confirmPassword}
          >
            <Input
              type="password"
              placeholder="confirm password"
              {...form.register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
          </FormField>

          <Button 
            type="submit" 
            disabled={!form.formState.isValid}
            className="w-full"
          >
            Register
          </Button>
        </Form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A form with custom validation rules and real-time validation.',
      },
    },
  },
};