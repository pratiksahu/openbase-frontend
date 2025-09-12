'use client';

import { FormHTMLAttributes, ReactNode } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';

interface FormProps<T extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
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
