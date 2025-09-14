# Claude Development Guidelines

This document provides specific instructions for AI assistants working on this Next.js project.

## 🔄 IMPORTANT: Keep This File Updated

**After completing any significant development activity, update this CLAUDE.md file with:**

- New commands or scripts added
- Project structure changes
- New patterns or conventions established
- Common issues and their solutions
- Performance optimizations discovered
- Testing strategies implemented
- Any context that would help future development

This ensures the development context remains current and helpful for ongoing work.

## Project Overview

This is a modern Next.js 15 application using App Router, TypeScript, shadcn/ui, and Tailwind CSS.

### Major Features

- **SMART Goals Management System**: Comprehensive goal tracking with metrics, tasks, collaboration, and analytics
- **Authentication System**: User management and session handling
- **Component Library**: shadcn/ui with custom extensions
- **Testing Infrastructure**: Playwright E2E testing with comprehensive coverage

## 📚 Setup & Development

**IMPORTANT: For detailed setup instructions and development workflow, refer to [README.md](./README.md)**

The README.md contains comprehensive information about:

- Installation and setup
- Starting/stopping development servers
- Running tests (Playwright, unit tests)
- Storybook development
- Port configuration
- Development workflow for running multiple tools

## 🚨 IMPORTANT: Port Configuration

**ALWAYS USE PORT 3001 FOR THE DEVELOPMENT SERVER**

The development server must run on port 3001 to ensure compatibility with Playwright tests and avoid port conflicts.

```bash
# ALWAYS start the dev server with:
PORT=3001 npm run dev

# DO NOT use:
npm run dev  # This may use port 3000 which will conflict
```

### Quick Reference

```bash
# Start development (see README.md for full workflow)
PORT=3001 npm run dev  # Start Next.js dev server on port 3001 (ALWAYS USE THIS)
npm run storybook      # Start Storybook on port 6006 (separate terminal)
npx playwright test --ui  # Run tests in UI mode (separate terminal)

# Code quality
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run typecheck  # Run TypeScript type checking

# Production
npm run build      # Build for production
npm run start      # Start production server
```

**Note**: Always check README.md for the most up-to-date commands and port configurations.

## Code Standards

### File Naming Conventions

- Components: PascalCase (e.g., `Button.tsx`, `NavigationBar.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`, `useDebounce.ts`)
- Types: PascalCase with `.types.ts` extension (e.g., `User.types.ts`)
- Constants: UPPER_SNAKE_CASE in `.constants.ts` files

### Component Structure

```typescript
// Always use TypeScript
// Define interfaces for props
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

// Use function components with explicit return types
export function Component({ title, onClick }: ComponentProps): JSX.Element {
  return <div>{title}</div>;
}
```

### Import Order

1. React/Next.js imports
2. Third-party libraries
3. UI components (from @/components/ui)
4. Local components
5. Utilities/hooks
6. Types
7. Styles

Example:

```typescript
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/shared/Header';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/User.types';
```

## shadcn/ui Components

### Installing New Components

```bash
npx shadcn@latest add [component-name]
```

Common components to use:

- `button`, `card`, `dialog`, `dropdown-menu`
- `form`, `input`, `label`, `textarea`
- `select`, `checkbox`, `radio-group`
- `toast`, `alert`, `badge`
- `table`, `tabs`, `accordion`

### Component Usage

Always prefer shadcn/ui components over custom implementations:

```typescript
// Good
import { Button } from '@/components/ui/button';

// Avoid creating custom buttons unless absolutely necessary
```

## Styling Guidelines

### Tailwind CSS

- Use Tailwind utilities for all styling
- Follow mobile-first responsive design: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Use semantic color classes from the theme

### Theme Colors

```css
/* Use these CSS variables */
--primary
--secondary
--accent
--destructive
--muted
--card
--popover
```

Example:

```tsx
<div className="bg-background text-foreground">
  <Button variant="default">Primary Action</Button>
  <Button variant="secondary">Secondary Action</Button>
  <Button variant="destructive">Delete</Button>
</div>
```

### Dark Mode

- All components should support dark mode
- Use Tailwind's dark mode classes: `dark:bg-gray-800`
- Test both light and dark themes

## Project Structure

### App Router Conventions

```
app/
├── layout.tsx           # Root layout with providers
├── page.tsx            # Home page
├── globals.css         # Global styles (Tailwind imports)
├── (auth)/            # Route group for auth pages
│   ├── login/
│   └── register/
├── dashboard/         # Dashboard routes
│   ├── layout.tsx     # Dashboard-specific layout
│   └── page.tsx
└── api/              # API routes
    └── auth/
        └── route.ts
```

### Component Organization

```
components/
├── ui/               # shadcn/ui components (don't modify)
├── shared/          # Shared components used across pages
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── features/        # Feature-specific components
│   ├── auth/
│   ├── dashboard/
│   └── SmartGoals/  # SMART Goals feature components
├── providers/       # Context providers
│   └── ThemeProvider.tsx
├── TaskEditor/      # Task management components
├── GoalWizard/      # Goal creation wizard
├── MetricsChart/    # Progress visualization
└── CollaborationPanel/ # Team collaboration
```

## Data Fetching

### Server Components (default)

```typescript
// app/page.tsx
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  return <div>{/* Render data */}</div>;
}
```

### Client Components

```typescript
'use client';

import { useState, useEffect } from 'react';

export function ClientComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Client-side data fetching
  }, []);

  return <div>{/* Render data */}</div>;
}
```

## Forms

### Using React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Use shadcn/ui Form components
}
```

## Performance Best Practices

1. **Image Optimization**

   ```tsx
   import Image from 'next/image';

   <Image
     src="/hero.jpg"
     alt="Hero"
     width={1920}
     height={1080}
     priority // For above-fold images
   />;
   ```

2. **Code Splitting**

   ```typescript
   import dynamic from 'next/dynamic';

   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Skeleton />,
   });
   ```

3. **Fonts**

   ```typescript
   // app/layout.tsx
   import { Inter } from 'next/font/google';

   const inter = Inter({ subsets: ['latin'] });
   ```

## Error Handling

### Error Boundaries

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Loading States

```typescript
// app/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return <Skeleton className="w-full h-screen" />;
}
```

## Environment Variables

### Naming Convention

- Public variables: `NEXT_PUBLIC_*`
- Server-only variables: No prefix

### Usage

```typescript
// Client-side
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server-side only
const secretKey = process.env.SECRET_KEY;
```

## Common Patterns

### Authentication Check

```typescript
import { redirect } from 'next/navigation';

async function ProtectedPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <div>Protected content</div>;
}
```

### Metadata

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

## Debugging Tips

1. Use `console.log` strategically (remove before committing)
2. Check Next.js dev tools in browser
3. Use React Developer Tools extension
4. For hydration errors, check for client/server mismatches
5. For build errors, run `npm run build` locally first

## 🧪 Testing Requirements

**CRITICAL: Every feature added to the project MUST:**

1. Have corresponding Playwright tests written
2. Pass all new tests before marking as complete
3. Ensure ALL existing tests continue to pass
4. Run the full test suite: `npx playwright test`

**Testing Workflow:**

```bash
# Before marking any feature as done:
npx playwright test                    # Run all tests
npx playwright test --grep "feature"   # Run specific feature tests
npx playwright test --ui               # Debug failing tests
```

If any test fails after adding new code, fix the issue before proceeding.

## Pre-commit Checklist

Before committing code, ensure:

- [ ] `npm run lint` passes without errors
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] `npx playwright test` passes ALL tests
- [ ] New features have Playwright tests
- [ ] No console.log statements in production code
- [ ] Components follow accessibility guidelines
- [ ] Dark mode is properly supported
- [ ] Responsive design works on mobile

### Git Hooks Configuration

**Note**: The pre-push hook has been removed to simplify the development workflow. While pre-commit hooks still run for code quality, pushes are no longer blocked by automated checks. This allows for more flexibility when pushing documentation changes or work-in-progress code.

However, it's still recommended to manually run the quality checks before pushing:

```bash
npm run lint
npm run typecheck
npm run build
```

## 📚 Important Project Files

### Feature Documentation

- **FEATURES.md** - Contains detailed documentation of all implemented features, their usage, and examples
- **TODO\_\*.md** - Phased implementation checklists with Playwright test verification

### Testing Documentation

- **TESTING.md** - Comprehensive testing strategy including unit tests, integration tests, and E2E tests
- **tests/** - Directory containing all Playwright test specifications

### Keep these files updated when:

- Adding new features → Update FEATURES.md
- Implementing test cases → Update TESTING.md
- Completing TODO items → Mark as complete in TODO\_\*.md files
- Discovering patterns → Document in relevant section

## 🎯 SMART Goals Feature Patterns

### State Management with Zustand

The SMART Goals feature uses Zustand for state management with the following patterns:

```typescript
// Store structure
interface GoalStore {
  goals: SmartGoalSummary[];
  currentGoal: SmartGoal | null;
  loading: LoadingStates;
  error: ErrorStates;
  filters: GoalFilters;
  sort: GoalSort;
  pagination: PaginationState;
  actions: GoalActions;
}

// Usage with selectors
const goals = useGoalsSelector();
const loading = useGoalsLoading();
const actions = useGoalActions();
```

### Custom Hook Patterns

Implement specialized hooks for different data access patterns:

```typescript
// Main data hook
useGoals(options)      // All goals with filtering/pagination
useGoal(id, options)   // Single goal with real-time updates
useMetrics(goalId)     // Goal metrics and checkpoints
useTasks(goalId)       // Goal tasks and management

// Specialized variants
useGoalsByStatus(status)     // Filter by status
useGoalsByPriority(priority) // Filter by priority
useDashboardGoals()          // Dashboard-optimized data
useOverdueGoals()            # Overdue goals specifically
```

### Component Composition Patterns

```typescript
// Compound component pattern for complex features
<GoalCard goal={goal}>
  <GoalCard.Header />
  <GoalCard.Progress />
  <GoalCard.Tasks />
  <GoalCard.Actions />
</GoalCard>

// Render props for flexible data access
<GoalProvider goalId={id}>
  {({ goal, loading, error }) => (
    <div>{/* Goal content */}</div>
  )}
</GoalProvider>
```

### Testing Patterns

#### E2E Test Organization

```
tests/smart-goals/
├── goal-creation.spec.ts      # Creation workflows
├── goal-management.spec.ts    # CRUD operations
├── goal-collaboration.spec.ts # Team features
├── metrics-tracking.spec.ts   # Progress tracking
├── task-workflow.spec.ts      # Task management
└── full-journey.spec.ts       # End-to-end scenarios
```

#### Test Data Management

```typescript
// Demo data generators
export function generateTestGoalData(count: number): SmartGoal[]
export function generateStressTestData(): SmartGoal[]

// Mock data patterns
const mockGoals = createSampleGoalsDataset().goals;
const demoScenarios = getDemoScenarios();
```

### Performance Optimizations Discovered

#### Bundle Size Management
- Use dynamic imports for heavy components: `dynamic(() => import('./HeavyChart'))`
- Implement virtual scrolling for large goal lists
- Lazy load metrics charts and visualizations

#### Memory Management
- Clear intervals and timeouts in useEffect cleanup
- Use AbortController for cancelling fetch requests
- Implement proper cleanup in Zustand stores

#### Rendering Optimizations
- Memoize expensive calculations with useMemo
- Use React.memo for frequently re-rendering components
- Implement debounced search to reduce API calls

### Common Issues and Solutions

#### Export/Import Issues

```typescript
// Problem: Missing exports causing build errors
// Solution: Always export mock data and utilities
export const mockGoals = createSampleGoalsDataset().goals;
export { toast } from './use-toast';

// Problem: Icon imports from lucide-react
// Solution: Check icon availability before using
import { Hash as Markdown } from 'lucide-react'; // Not MarkdownIcon
```

#### TypeScript Patterns

```typescript
// Strong typing for API responses
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Generic hook typing
function useData<T>(
  fetcher: () => Promise<T>,
  options?: UseDataOptions
): UseDataResult<T>
```

#### Error Handling Patterns

```typescript
// Centralized error handling in hooks
const handleError = useCallback((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  setError(message);
  onError?.(message);
}, [onError]);

// Toast notifications for user feedback
const { toast } = useToast();
toast({
  title: "Success",
  description: "Goal created successfully",
  variant: "default"
});
```

## 🔍 Accessibility Patterns

### WCAG 2.1 AA Compliance

```typescript
// Proper ARIA labeling
<button
  aria-label="Add new goal"
  aria-describedby="goal-help-text"
>
  Add Goal
</button>

// Keyboard navigation support
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
};

// Focus management
const dialogRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  if (isOpen && dialogRef.current) {
    dialogRef.current.focus();
  }
}, [isOpen]);
```

### Screen Reader Support

```typescript
// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Progress announcements
<div role="progressbar"
     aria-valuenow={progress}
     aria-valuemin={0}
     aria-valuemax={100}
     aria-label={`Goal progress: ${progress}%`}>
</div>
```

## 📊 Performance Monitoring

### Lighthouse Metrics Targets
- **First Contentful Paint**: < 1.8s (Currently: 1.1s ✅)
- **Largest Contentful Paint**: < 2.5s (Currently: 15.8s ❌ - Needs optimization)
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.8s

### Performance Issues Identified
1. **LCP Issue**: Large components loading slowly - implement code splitting
2. **Bundle Size**: Monitor with `npm run analyze` (if available)
3. **Memory Leaks**: Ensure proper cleanup of intervals and event listeners

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
