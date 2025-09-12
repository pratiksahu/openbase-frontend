'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
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
              'peer border-input bg-background ring-offset-background focus-visible:ring-ring h-4 w-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-destructive',
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              description ? `${props.id}-description` : undefined
            }
            {...props}
          />
          <CheckIcon className="text-background pointer-events-none absolute inset-0 h-4 w-4 opacity-0 peer-checked:opacity-100" />
        </div>

        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                htmlFor={props.id}
                className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${props.id}-description`}
                className="text-muted-foreground text-xs"
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
