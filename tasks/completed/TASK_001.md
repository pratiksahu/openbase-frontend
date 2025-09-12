# TASK_001: Initialize Next.js Project with TypeScript

## 📋 Task Overview

Set up a new Next.js 15 project with TypeScript and configure the initial project structure.

## 🎯 Objectives

- Initialize a new Next.js 15 project with TypeScript support
- Configure TypeScript settings for strict type checking
- Set up the recommended project folder structure
- Configure path aliases for clean imports

## 📝 Implementation Steps

### 1. Initialize Next.js Project

```bash
npx create-next-app@latest . --typescript --app --tailwind --eslint
```

Choose the following options:

- ✅ Would you like to use TypeScript? → Yes
- ✅ Would you like to use ESLint? → Yes
- ✅ Would you like to use Tailwind CSS? → Yes
- ✅ Would you like to use `src/` directory? → No
- ✅ Would you like to use App Router? → Yes
- ✅ Would you like to customize the default import alias? → Yes (use @/\*)

### 2. Configure TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. Create Project Structure

```bash
# Create folder structure
mkdir -p app/api
mkdir -p app/(auth)/login
mkdir -p app/(auth)/register
mkdir -p app/dashboard
mkdir -p components/ui
mkdir -p components/shared
mkdir -p components/features
mkdir -p components/providers
mkdir -p lib
mkdir -p hooks
mkdir -p types
mkdir -p config
mkdir -p public/images
mkdir -p public/fonts
```

### 4. Create Initial Files

#### app/layout.tsx

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modern Next.js App',
  description: 'Production-ready Next.js application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

#### lib/utils.ts

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 5. Install Required Dependencies

```bash
npm install clsx tailwind-merge
npm install -D @types/node
```

## ✅ Acceptance Criteria

- [ ] Next.js 15 project initialized with TypeScript
- [ ] TypeScript configured with strict mode
- [ ] Project structure created with all required folders
- [ ] Path aliases configured and working (@/\*)
- [ ] Initial layout and utility files created
- [ ] Project runs without errors: `npm run dev`
- [ ] TypeScript compilation successful: `npx tsc --noEmit`

## 🧪 Testing

Run the following commands to verify setup:

```bash
# Start development server
npm run dev

# Check TypeScript compilation
npx tsc --noEmit

# Run linting
npm run lint

# Build project
npm run build
```

## 📚 References

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🏷️ Tags

`setup` `initialization` `typescript` `structure`

## ⏱️ Estimated Time

1-2 hours

## 🔗 Dependencies

None - This is the first task

## 🚀 Next Steps

After completing this task, proceed to TASK_002 (Tailwind CSS Configuration)
