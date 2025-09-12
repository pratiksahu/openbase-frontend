import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  // Additional props can be added here when needed
}

/**
 * A flexible input component supporting various types and states
 *
 * @example
 * ```tsx
 * <Input 
 *   type="email" 
 *   placeholder="Enter your email..." 
 *   onChange={handleChange}
 * />
 * ```
 *
 * @param props - The input component props
 * @param props.type - Input type (text, email, password, number, etc.)
 * @param props.placeholder - Placeholder text
 * @param props.className - Additional CSS classes
 * @param props.disabled - Whether the input is disabled
 * @param props.onChange - Change handler function
 *
 * @returns A styled input element
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
