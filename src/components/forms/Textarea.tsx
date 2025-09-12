'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize';

import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError | string;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    const baseClassName = cn(
      'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      hasError && 'border-destructive focus-visible:ring-destructive',
      !autoResize && 'min-h-[80px] resize-y',
      className
    );

    if (autoResize) {
      const autosizeProps: TextareaAutosizeProps = {
        className: baseClassName,
        minRows,
        maxRows,
        'aria-invalid': hasError,
        value: props.value,
        defaultValue: props.defaultValue,
        onChange: props.onChange,
        placeholder: props.placeholder,
        disabled: props.disabled,
        readOnly: props.readOnly,
        required: props.required,
        name: props.name,
        id: props.id,
      };

      return <TextareaAutosize ref={ref} {...autosizeProps} />;
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
