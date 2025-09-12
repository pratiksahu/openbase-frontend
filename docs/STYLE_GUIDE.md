# Style Guide

This document outlines the coding standards, conventions, and best practices for the OpenBase v2 project.

## Table of Contents

- [General Principles](#general-principles)
- [TypeScript](#typescript)
- [React Components](#react-components)
- [CSS and Styling](#css-and-styling)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Import Organization](#import-organization)
- [Component Patterns](#component-patterns)
- [Testing Guidelines](#testing-guidelines)
- [Performance Guidelines](#performance-guidelines)
- [Accessibility Guidelines](#accessibility-guidelines)

## General Principles

### Code Quality
- Write clean, readable, and maintainable code
- Follow the principle of least surprise
- Use meaningful names for variables, functions, and components
- Keep functions small and focused on a single responsibility
- Prefer composition over inheritance

### Documentation
- Document all public APIs with JSDoc comments
- Include usage examples in component documentation
- Keep README files up to date
- Write clear commit messages following conventional commits

## TypeScript

### Configuration
- Use TypeScript strict mode
- Enable all recommended TypeScript ESLint rules
- Prefer explicit typing over `any`

### Types and Interfaces
- Use interfaces for object shapes
- Use types for unions and computed types
- Prefer `interface` over `type` for extensible object types

```typescript
// Good - Interface for object shape
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Good - Type for union
type Status = 'loading' | 'success' | 'error';

// Good - Type for computed types
type UserKeys = keyof User;
```

### Generics
- Use descriptive generic names
- Add constraints when appropriate
- Document complex generic types

```typescript
// Good
interface ApiResponse<TData = unknown> {
  data: TData;
  status: number;
  message?: string;
}

// Better - with constraints
interface Repository<TEntity extends { id: string }> {
  findById(id: string): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}
```

## React Components

### Component Structure
- Use functional components with hooks
- Prefer composition over inheritance
- Extract custom hooks for reusable logic
- Use `forwardRef` for components that need ref access

```typescript
// Good
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

### Props and State
- Define clear prop interfaces
- Use default parameters for optional props
- Minimize component state
- Lift state up when multiple components need it

```typescript
// Good - Clear prop interface
interface UserProfileProps {
  user: User;
  onUpdate?: (user: Partial<User>) => void;
  readonly?: boolean;
}

// Good - Default parameters
const UserProfile = ({
  user,
  onUpdate,
  readonly = false
}: UserProfileProps) => {
  // Component implementation
};
```

### Hooks
- Follow the rules of hooks
- Create custom hooks for reusable logic
- Use descriptive names starting with 'use'

```typescript
// Good - Custom hook
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}
```

## CSS and Styling

### Tailwind CSS
- Use Tailwind utility classes for styling
- Follow mobile-first responsive design principles
- Use semantic color classes from the theme

```tsx
// Good - Mobile-first responsive design
<div className="p-4 sm:p-6 lg:p-8">
  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
    Responsive Heading
  </h1>
</div>

// Good - Theme colors
<div className="bg-background text-foreground">
  <Button variant="default">Primary Action</Button>
  <Button variant="secondary">Secondary Action</Button>
  <Button variant="destructive">Delete Item</Button>
</div>
```

### CSS Custom Properties
- Use CSS custom properties for theming
- Define semantic color names
- Support dark mode

```css
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
}

.dark {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 84% 4.9%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
}
```

### Component Styling
- Keep styles close to components
- Use CSS Modules or styled-components for complex styles
- Avoid inline styles except for dynamic values

```tsx
// Good - Utility classes
<Card className="bg-card border-border shadow-sm">
  <CardHeader className="pb-3">
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
</Card>

// Acceptable - Dynamic styles
<div 
  className="w-full bg-primary" 
  style={{ height: `${progress}%` }}
>
  Progress Bar
</div>
```

## File Organization

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Basic UI components (shadcn/ui)
│   ├── forms/             # Form-related components
│   ├── layout/            # Layout components
│   ├── navigation/        # Navigation components
│   └── providers/         # Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configs
├── types/                 # TypeScript type definitions
└── constants/             # Application constants
```

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase starting with 'use' (e.g., `useLocalStorage.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase with `.types.ts` (e.g., `User.types.ts`)
- Constants: UPPER_SNAKE_CASE in `.constants.ts`

## Naming Conventions

### Variables and Functions
```typescript
// Good - Descriptive names
const userCount = 42;
const isAuthenticated = true;
const getUserById = (id: string) => { /* ... */ };

// Avoid - Abbreviated or unclear names
const uc = 42;
const auth = true;
const getUser = (i: string) => { /* ... */ };
```

### Components
```typescript
// Good - PascalCase, descriptive
const UserProfileCard = () => { /* ... */ };
const NavigationSidebar = () => { /* ... */ };

// Avoid - Generic or unclear names
const Card = () => { /* ... */ };
const Sidebar = () => { /* ... */ };
```

### Constants
```typescript
// Good - UPPER_SNAKE_CASE
const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: '/api/auth',
} as const;

const MAX_RETRY_ATTEMPTS = 3;
```

## Import Organization

Organize imports in the following order:

```typescript
// 1. React and Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 2. Third-party libraries
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { z } from 'zod';

// 3. UI components (absolute imports)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// 4. Internal components and hooks (absolute imports)
import { UserProfile } from '@/components/features/user-profile';
import { useAuth } from '@/hooks/useAuth';

// 5. Types and constants (absolute imports)
import type { User } from '@/types/User.types';
import { API_ENDPOINTS } from '@/constants/api.constants';

// 6. Relative imports
import { validateUser } from '../utils/validation';
import { UserCard } from './UserCard';
```

## Component Patterns

### Compound Components
```tsx
// Good - Compound component pattern
const Card = ({ children, className, ...props }: CardProps) => (
  <div className={cn('rounded-lg border bg-card', className)} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className, ...props }: CardHeaderProps) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
    {children}
  </div>
);

// Usage
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </CardHeader>
  <CardContent>
    <UserForm />
  </CardContent>
</Card>
```

### Render Props
```tsx
// Good - Render props for flexible data fetching
interface DataFetcherProps<T> {
  url: string;
  children: (props: {
    data: T | null;
    loading: boolean;
    error: Error | null;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  // Implementation...
  return <>{children({ data, loading, error })}</>;
}

// Usage
<DataFetcher<User> url="/api/users/1">
  {({ data: user, loading, error }) => {
    if (loading) return <Skeleton />;
    if (error) return <ErrorMessage error={error} />;
    if (user) return <UserProfile user={user} />;
    return null;
  }}
</DataFetcher>
```

### Higher-Order Components
```tsx
// Good - HOC for authentication
function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!user) {
      redirect('/login');
      return null;
    }
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

## Testing Guidelines

### Unit Tests
- Test component behavior, not implementation
- Use meaningful test descriptions
- Group related tests with describe blocks
- Mock external dependencies

```typescript
// Good - Behavioral testing
describe('Button Component', () => {
  describe('when clicked', () => {
    it('should call onClick handler', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      await user.click(screen.getByRole('button', { name: /click me/i }));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('when disabled', () => {
    it('should not call onClick handler', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} disabled>Click me</Button>);
      await user.click(screen.getByRole('button', { name: /click me/i }));
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
```

### Integration Tests
- Test user workflows and component interactions
- Use realistic test data
- Test error scenarios

```typescript
// Good - Integration test
describe('User Registration Flow', () => {
  it('should successfully register a new user', async () => {
    const mockRegister = jest.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();
    
    render(<RegistrationForm onRegister={mockRegister} />);
    
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
    await user.click(screen.getByRole('button', { name: /register/i }));
    
    expect(mockRegister).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'SecurePass123!',
    });
  });
});
```

## Performance Guidelines

### React Performance
- Use `React.memo` for expensive components
- Use `useMemo` and `useCallback` judiciously
- Implement proper loading states
- Use React Suspense for code splitting

```tsx
// Good - Memoized expensive component
const ExpensiveUserList = memo(({ users, filters }: UserListProps) => {
  const filteredUsers = useMemo(() => {
    return users.filter(user => applyFilters(user, filters));
  }, [users, filters]);
  
  const handleUserSelect = useCallback((userId: string) => {
    // Handle selection
  }, []);
  
  return (
    <div>
      {filteredUsers.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onSelect={handleUserSelect}
        />
      ))}
    </div>
  );
});
```

### Bundle Size
- Use dynamic imports for code splitting
- Monitor bundle size with tools like webpack-bundle-analyzer
- Remove unused dependencies regularly

```tsx
// Good - Dynamic import for code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Image Optimization
- Use Next.js Image component
- Provide proper alt text
- Use appropriate sizes and formats

```tsx
// Good - Optimized images
<Image
  src="/user-avatar.jpg"
  alt="User profile picture"
  width={100}
  height={100}
  priority // For above-the-fold images
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## Accessibility Guidelines

### Semantic HTML
- Use proper HTML elements for their intended purpose
- Provide meaningful alt text for images
- Use headings hierarchically

```tsx
// Good - Semantic HTML
<article>
  <header>
    <h1>Article Title</h1>
    <time dateTime="2024-01-01">January 1, 2024</time>
  </header>
  <main>
    <p>Article content...</p>
  </main>
</article>
```

### ARIA Labels
- Provide ARIA labels for interactive elements
- Use proper ARIA roles
- Maintain focus management

```tsx
// Good - Proper ARIA usage
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onClick={onClose}
  className="rounded-md p-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
>
  <XIcon className="h-4 w-4" />
</button>

<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Confirm Action</h2>
  {/* Dialog content */}
</div>
```

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Provide visible focus indicators
- Use proper tab order

```tsx
// Good - Keyboard accessible menu
const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        // Navigate to next item
        break;
      case 'ArrowUp':
        // Navigate to previous item
        break;
    }
  };
  
  return (
    <div onKeyDown={handleKeyDown}>
      {/* Menu implementation */}
    </div>
  );
};
```

### Color and Contrast
- Ensure sufficient color contrast (WCAG AA: 4.5:1)
- Don't rely solely on color to convey information
- Test with color blindness simulators

```tsx
// Good - High contrast and multiple indicators
<Alert variant={error ? 'destructive' : 'default'}>
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>
    {error ? 'Error' : 'Success'}
  </AlertTitle>
  <AlertDescription>
    {message}
  </AlertDescription>
</Alert>
```

## Code Review Guidelines

### What to Look For
- Code follows style guide conventions
- Logic is clear and well-documented
- Tests cover edge cases
- No obvious performance issues
- Accessibility considerations are met
- Security best practices are followed

### Review Process
- Be constructive and specific in feedback
- Explain the reasoning behind suggestions
- Approve when standards are met
- Request changes for critical issues

---

This style guide is a living document and should be updated as the project evolves and new patterns emerge.