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

## Key Commands

### Development

```bash
npm run dev        # Start development server on http://localhost:3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run typecheck  # Run TypeScript type checking
```

### Testing

```bash
npm run test       # Run unit tests
npm run test:e2e   # Run E2E tests
```

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
│   └── dashboard/
└── providers/       # Context providers
    └── ThemeProvider.tsx
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

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
