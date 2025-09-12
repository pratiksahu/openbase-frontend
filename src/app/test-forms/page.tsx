'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  ContactForm,
  Form,
  FormField,
  Input,
  Select,
  Textarea,
  Checkbox,
} from '@/components/forms';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
  type ContactFormData,
} from '@/lib/validations';

// Demo form schema
const demoSchema = z.object({
  textInput: z.string().min(1, 'This field is required'),
  email: z.string().email('Please enter a valid email'),
  textarea: z.string().min(10, 'Please enter at least 10 characters'),
  select: z.string().min(1, 'Please select an option'),
  checkbox: z.boolean().refine(val => val === true, {
    message: 'You must check this box',
  }),
});

type DemoFormData = z.infer<typeof demoSchema>;

const selectOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4', disabled: true },
];

export default function TestFormsPage() {
  const [demoSubmitSuccess, setDemoSubmitSuccess] = useState(false);
  const [loginSubmitSuccess, setLoginSubmitSuccess] = useState(false);
  const [registerSubmitSuccess, setRegisterSubmitSuccess] = useState(false);

  // Demo form
  const demoForm = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      textInput: '',
      email: '',
      textarea: '',
      select: '',
      checkbox: false,
    },
  });

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const handleDemoSubmit = async (_data: DemoFormData) => {
    // Demo form submitted successfully
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDemoSubmitSuccess(true);
    setTimeout(() => setDemoSubmitSuccess(false), 3000);
  };

  const handleLoginSubmit = async (_data: LoginFormData) => {
    // Login form submitted successfully
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoginSubmitSuccess(true);
    setTimeout(() => setLoginSubmitSuccess(false), 3000);
  };

  const handleRegisterSubmit = async (_data: RegisterFormData) => {
    // Register form submitted successfully
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRegisterSubmitSuccess(true);
    setTimeout(() => setRegisterSubmitSuccess(false), 3000);
  };

  const handleContactSubmit = async (_data: ContactFormData) => {
    // Contact form will use default API route
    // This will use the default API route
  };

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Form Testing Page</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Test and demonstrate form components with React Hook Form and Zod
          validation
        </p>
      </div>

      <div className="grid gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
            <CardDescription>
              Complete contact form with validation, API integration, and
              success/error states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm onSubmit={handleContactSubmit} />
          </CardContent>
        </Card>

        <Separator />

        {/* Demo Form Components */}
        <Card>
          <CardHeader>
            <CardTitle>Form Component Demo</CardTitle>
            <CardDescription>
              Test all form input types with validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {demoSubmitSuccess && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                Demo form submitted successfully!
              </div>
            )}

            <Form form={demoForm} onSubmit={handleDemoSubmit}>
              <FormField
                label="Text Input"
                error={demoForm.formState.errors.textInput}
                required
              >
                <Input
                  placeholder="Enter some text"
                  {...demoForm.register('textInput')}
                  error={demoForm.formState.errors.textInput}
                />
              </FormField>

              <FormField
                label="Email Input"
                error={demoForm.formState.errors.email}
                required
              >
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...demoForm.register('email')}
                  error={demoForm.formState.errors.email}
                />
              </FormField>

              <FormField
                label="Select Dropdown"
                error={demoForm.formState.errors.select}
                required
              >
                <Select
                  options={selectOptions}
                  placeholder="Choose an option"
                  {...demoForm.register('select')}
                  error={demoForm.formState.errors.select}
                />
              </FormField>

              <FormField
                label="Textarea"
                error={demoForm.formState.errors.textarea}
                description="Auto-resizing textarea with minimum 10 characters"
                required
              >
                <Textarea
                  placeholder="Enter your message here..."
                  autoResize
                  minRows={3}
                  maxRows={6}
                  {...demoForm.register('textarea')}
                  error={demoForm.formState.errors.textarea}
                />
              </FormField>

              <FormField error={demoForm.formState.errors.checkbox}>
                <Checkbox
                  label="I agree to the terms and conditions"
                  description="This is a required checkbox"
                  {...demoForm.register('checkbox')}
                  error={demoForm.formState.errors.checkbox}
                />
              </FormField>

              <Button type="submit" className="w-full">
                Submit Demo Form
              </Button>
            </Form>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Login Form</CardTitle>
              <CardDescription>User authentication form</CardDescription>
            </CardHeader>
            <CardContent>
              {loginSubmitSuccess && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                  Login form submitted successfully!
                </div>
              )}

              <Form form={loginForm} onSubmit={handleLoginSubmit}>
                <FormField
                  label="Email"
                  error={loginForm.formState.errors.email}
                  required
                >
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    {...loginForm.register('email')}
                    error={loginForm.formState.errors.email}
                  />
                </FormField>

                <FormField
                  label="Password"
                  error={loginForm.formState.errors.password}
                  required
                >
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...loginForm.register('password')}
                    error={loginForm.formState.errors.password}
                  />
                </FormField>

                <FormField error={loginForm.formState.errors.rememberMe}>
                  <Checkbox
                    label="Remember me"
                    {...loginForm.register('rememberMe')}
                    error={loginForm.formState.errors.rememberMe}
                  />
                </FormField>

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Form</CardTitle>
              <CardDescription>User signup with validation</CardDescription>
            </CardHeader>
            <CardContent>
              {registerSubmitSuccess && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                  Registration form submitted successfully!
                </div>
              )}

              <Form form={registerForm} onSubmit={handleRegisterSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="First Name"
                    error={registerForm.formState.errors.firstName}
                    required
                  >
                    <Input
                      placeholder="John"
                      {...registerForm.register('firstName')}
                      error={registerForm.formState.errors.firstName}
                    />
                  </FormField>

                  <FormField
                    label="Last Name"
                    error={registerForm.formState.errors.lastName}
                    required
                  >
                    <Input
                      placeholder="Doe"
                      {...registerForm.register('lastName')}
                      error={registerForm.formState.errors.lastName}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Email"
                  error={registerForm.formState.errors.email}
                  required
                >
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...registerForm.register('email')}
                    error={registerForm.formState.errors.email}
                  />
                </FormField>

                <FormField
                  label="Password"
                  error={registerForm.formState.errors.password}
                  description="Must contain uppercase, lowercase, number, and special character"
                  required
                >
                  <Input
                    type="password"
                    placeholder="Enter secure password"
                    {...registerForm.register('password')}
                    error={registerForm.formState.errors.password}
                  />
                </FormField>

                <FormField
                  label="Confirm Password"
                  error={registerForm.formState.errors.confirmPassword}
                  required
                >
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...registerForm.register('confirmPassword')}
                    error={registerForm.formState.errors.confirmPassword}
                  />
                </FormField>

                <FormField error={registerForm.formState.errors.terms}>
                  <Checkbox
                    label="I accept the terms and conditions"
                    {...registerForm.register('terms')}
                    error={registerForm.formState.errors.terms}
                  />
                </FormField>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Form Validation Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Form Validation Showcase</CardTitle>
            <CardDescription>
              Test validation by submitting empty forms or invalid data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm">
              <div>
                <h4 className="font-medium">Testing Instructions:</h4>
                <ul className="text-muted-foreground mt-2 space-y-1">
                  <li>• Submit empty forms to see required field validation</li>
                  <li>
                    • Enter invalid email addresses to test email validation
                  </li>
                  <li>
                    • Try passwords that don&apos;t meet complexity requirements
                  </li>
                  <li>• Test password confirmation matching</li>
                  <li>• Check form submission loading states</li>
                  <li>• Verify success and error message display</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Accessibility Features:</h4>
                <ul className="text-muted-foreground mt-2 space-y-1">
                  <li>• Proper form labels and ARIA attributes</li>
                  <li>• Error messages with aria-live regions</li>
                  <li>• Keyboard navigation support</li>
                  <li>• Focus management</li>
                  <li>• Screen reader compatible</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
