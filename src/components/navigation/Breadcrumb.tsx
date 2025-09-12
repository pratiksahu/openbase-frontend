import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

const Breadcrumb = ({
  items,
  separator = <ChevronRightIcon className="h-4 w-4" />,
  className,
}: BreadcrumbProps) => {
  return (
    <nav
      className={cn(
        'text-muted-foreground flex items-center space-x-1 text-sm',
        className
      )}
      data-testid="breadcrumb"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={index}>
              <li
                className="flex items-center space-x-1"
                data-testid="breadcrumb-item"
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}

                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && 'text-foreground font-medium')}>
                    {item.label}
                  </span>
                )}
              </li>

              {!isLast && <li className="flex items-center">{separator}</li>}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export { Breadcrumb, type BreadcrumbItem };
