import { HTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'muted' | 'accent';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  as?: 'section' | 'div' | 'article' | 'aside';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      variant = 'default',
      spacing = 'md',
      as: Component = 'section',
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-background',
      muted: 'bg-muted/50',
      accent: 'bg-accent/5',
    };

    const spacingClasses = {
      none: '',
      sm: 'py-8',
      md: 'py-12 sm:py-16',
      lg: 'py-16 sm:py-20',
      xl: 'py-20 sm:py-24',
    };

    // Use type assertion to handle dynamic component ref
    const ComponentWithRef = Component as any;

    return (
      <ComponentWithRef
        ref={ref}
        className={cn(
          'relative',
          variantClasses[variant],
          spacingClasses[spacing],
          className
        )}
        data-testid="section"
        {...props}
      >
        {children}
      </ComponentWithRef>
    );
  }
);

Section.displayName = 'Section';

export { Section };
