# TASK_009: Shared Components

## Overview

Create a comprehensive library of reusable shared components that form the foundation of the application's UI architecture. These components will provide consistent styling, behavior, and structure across all pages while maintaining flexibility for customization.

## Objectives

- Build essential layout components (Container, Section, PageHeader, Breadcrumb)
- Implement authentication and dashboard layout groups
- Create utility functions for consistent styling
- Establish component documentation and usage patterns
- Ensure accessibility and responsive design principles
- Set up component testing infrastructure

## Implementation Steps

### 1. Create Shared Components Directory Structure

```bash
# Create component directories
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/navigation
mkdir -p src/components/forms
mkdir -p src/lib
```

### 2. Implement Container Component

Create `src/components/layout/Container.tsx`:

```tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

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
```

### 3. Implement Section Component

Create `src/components/layout/Section.tsx`:

```tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

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

    return (
      <Component
        ref={ref as any}
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
      </Component>
    );
  }
);

Section.displayName = 'Section';

export { Section };
```

### 4. Implement PageHeader Component

Create `src/components/layout/PageHeader.tsx`:

```tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

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
```

### 5. Implement Breadcrumb Component

Create `src/components/navigation/Breadcrumb.tsx`:

```tsx
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Fragment, ReactNode } from 'react';

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
```

### 6. Create Authentication Layout Group

Create `src/app/(auth)/layout.tsx`:

```tsx
import { Container } from '@/components/layout/Container';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="bg-background flex min-h-screen items-center justify-center p-4"
      data-testid="auth-layout"
    >
      <Container size="sm" padding="md">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
```

### 7. Create Dashboard Layout

Create `src/components/layout/DashboardLayout.tsx`:

```tsx
'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  name: string;
  href: string;
  icon: ReactNode;
  current?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

const defaultNavigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: <ChartBarIcon className="h-5 w-5" />,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: <UserIcon className="h-5 w-5" />,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: <CogIcon className="h-5 w-5" />,
  },
];

const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = defaultNavigation.map(item => ({
    ...item,
    current: pathname === item.href,
  }));

  return (
    <div className="bg-background min-h-screen" data-testid="dashboard-layout">
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
      >
        <div
          className="bg-background/80 fixed inset-0 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="bg-card border-border fixed inset-y-0 left-0 w-64 border-r">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-lg font-semibold">Dashboard</span>
            <button
              type="button"
              className="hover:bg-accent rounded-md p-2"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-2 px-4">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  item.current
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className="lg:bg-card lg:border-border hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:border-r"
        data-testid="dashboard-sidebar"
      >
        <div className="border-border flex h-16 items-center border-b px-4">
          <span className="text-lg font-semibold">Dashboard</span>
        </div>
        <nav className="space-y-2 px-4 py-4">
          {navigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                item.current
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        {sidebar && (
          <div className="border-border mt-auto border-t px-4 py-4">
            {sidebar}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border sticky top-0 z-30 flex h-16 items-center border-b px-4 backdrop-blur">
          <button
            type="button"
            className="hover:bg-accent rounded-md p-2 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          {/* Add top bar content here */}
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8" data-testid="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };
```

### 8. Create API Route Structure

Create `src/app/api/health/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 500 }
    );
  }
}
```

### 9. Create Utility Functions

Update `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatters
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(undefined, options);
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### 10. Create Component Index Files

Create `src/components/layout/index.ts`:

```typescript
export { Container } from './Container';
export { Section } from './Section';
export { PageHeader } from './PageHeader';
export { DashboardLayout } from './DashboardLayout';
```

Create `src/components/navigation/index.ts`:

```typescript
export { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';
```

Create `src/components/index.ts`:

```typescript
export * from './layout';
export * from './navigation';
export * from './ui';
```

## Acceptance Criteria

- [ ] All shared components render correctly
- [ ] Components are responsive across all breakpoints
- [ ] Components follow accessibility guidelines (WCAG)
- [ ] TypeScript types are properly defined
- [ ] Components accept className for customization
- [ ] Components use forwardRef when appropriate
- [ ] Layout groups work correctly
- [ ] API route structure is established
- [ ] Utility functions are comprehensive and tested
- [ ] Components are properly exported and importable

## Testing Instructions

### 1. Test Container Component

```tsx
// Test different sizes and padding options
<Container size="sm" padding="lg">
  <p>Small container with large padding</p>
</Container>
```

### 2. Test Section Component

```tsx
// Test different variants and spacing
<Section variant="muted" spacing="xl">
  <Container>
    <h2>Section with muted background</h2>
  </Container>
</Section>
```

### 3. Test PageHeader Component

```tsx
// Test with all props
<PageHeader
  title="Test Page"
  description="This is a test page description"
  breadcrumb={
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Test' },
      ]}
    />
  }
  actions={<Button>Action Button</Button>}
/>
```

### 4. Test Responsive Behavior

- Resize browser window to test responsive layouts
- Test on mobile devices
- Verify sidebar behavior in dashboard layout

### 5. Test API Routes

```bash
curl http://localhost:3000/api/health
```

## References and Dependencies

### Dependencies

- `@heroicons/react`: Icons for UI components
- `clsx`: Conditional classname utility
- `tailwind-merge`: Tailwind CSS class merging
- `next`: Next.js framework

### Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)

## Estimated Time

**8-10 hours**

- Component development: 4-5 hours
- Layout implementation: 2-3 hours
- Utility functions: 1-2 hours
- Testing and refinement: 2-3 hours
- Documentation: 1 hour

## Troubleshooting

### Common Issues

1. **TypeScript errors with forwardRef**
   - Ensure proper generic typing: `forwardRef<HTMLDivElement, Props>`
   - Use `as any` for ref casting when necessary

2. **Tailwind classes not applying**
   - Check if Tailwind is properly configured
   - Ensure classes are not purged in production
   - Use `cn()` utility for dynamic classes

3. **Layout group routing issues**
   - Verify directory structure follows Next.js conventions
   - Check that layout.tsx files are in correct locations

4. **Component import issues**
   - Ensure proper barrel exports in index files
   - Check TypeScript path mapping configuration

5. **Responsive design issues**
   - Test breakpoints systematically
   - Use browser dev tools for responsive testing
   - Consider mobile-first approach
