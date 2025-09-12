import { HTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'xl', padding = 'md', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    };

    const paddingClasses = {
      none: '',
      sm: 'px-4 sm:px-6',
      md: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-4 sm:px-6 lg:px-8 xl:px-12',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto',
          sizeClasses[size],
          paddingClasses[padding],
          className
        )}
        data-testid="container"
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export { Container };
