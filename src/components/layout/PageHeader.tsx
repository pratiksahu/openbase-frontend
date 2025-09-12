import { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const PageHeader = ({
  className,
  title,
  description,
  actions,
  breadcrumb,
  size = 'md',
  ...props
}: PageHeaderProps) => {
  const sizeClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  const titleSizeClasses = {
    sm: 'text-2xl font-bold',
    md: 'text-3xl font-bold',
    lg: 'text-4xl font-bold',
  };

  const descriptionSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div
      className={cn(
        'border-border flex flex-col space-y-4 border-b pb-8',
        sizeClasses[size],
        className
      )}
      data-testid="page-header"
      {...props}
    >
      {breadcrumb && (
        <div className="flex items-center space-x-2">{breadcrumb}</div>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1
            className={cn(
              'text-foreground tracking-tight',
              titleSizeClasses[size]
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                'text-muted-foreground',
                descriptionSizeClasses[size]
              )}
            >
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
    </div>
  );
};

export { PageHeader };
