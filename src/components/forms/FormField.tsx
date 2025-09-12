'use client';

import { ReactNode, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';

interface FormFieldProps {
  label?: string;
  error?: FieldError | string;
  description?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, error, description, required, className, children, ...props },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label className="text-foreground flex items-center text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}

        <div className="relative">{children}</div>

        {errorMessage && (
          <p
            className="text-destructive flex items-center text-sm"
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
