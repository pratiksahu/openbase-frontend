# TASK_006: Create Loading, Error, and Not Found Pages

## 📋 Task Overview
Implement loading states, error boundaries, and not found pages for better user experience and error handling.

## 🎯 Objectives
- Create loading.tsx for loading states
- Implement error.tsx for error boundaries
- Create not-found.tsx for 404 pages
- Set up metadata configuration
- Create reusable loading components

## 📝 Implementation Steps

### 1. Create Root Loading State (app/loading.tsx)
```typescript
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-12 w-[300px]" />
          <Skeleton className="h-4 w-[500px]" />
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}
```

### 2. Create Root Error Boundary (app/error.tsx)
```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center" data-testid="error-boundary">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Something went wrong!</h2>
        <p className="mb-4 text-muted-foreground">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button
          onClick={() => reset()}
          variant="default"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}
```

### 3. Create Global Error Page (app/global-error.tsx)
```typescript
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
            <button
              onClick={() => reset()}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

### 4. Create Not Found Page (app/not-found.tsx)
```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center" data-testid="not-found">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-2 text-9xl font-bold text-muted-foreground/20">404</h1>
        <h2 className="mb-4 text-3xl font-bold">Page not found</h2>
        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### 5. Create Custom 404 Page (app/404/page.tsx)
```typescript
import NotFound from '@/app/not-found'

export default function Custom404() {
  return <NotFound />
}
```

### 6. Create Loading Skeleton Components (components/shared/loading-skeleton.tsx)
```typescript
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4" data-testid="loading-skeleton">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[300px]" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="pt-4">
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}
```

### 7. Create Loading Spinner Component (components/shared/loading-spinner.tsx)
```typescript
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
    </div>
  )
}
```

### 8. Update Metadata Configuration (app/layout.tsx)
```typescript
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Modern Next.js App',
    template: '%s | Modern Next.js App'
  },
  description: 'Production-ready Next.js application with TypeScript and Tailwind CSS',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Company',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    title: 'Modern Next.js App',
    description: 'Production-ready Next.js application',
    siteName: 'Modern Next.js App',
    images: [
      {
        url: 'https://yoursite.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Modern Next.js App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Next.js App',
    description: 'Production-ready Next.js application',
    images: ['https://yoursite.com/twitter-image.jpg'],
    creator: '@yourhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
```

### 9. Create Test Page for States (app/states-test/page.tsx)
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { CardSkeleton, TableSkeleton, ContentSkeleton } from '@/components/shared/loading-skeleton'

export default function StatesTest() {
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (showError) {
    throw new Error('This is a test error!')
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Loading & Error States Test</h1>

      {/* Error trigger */}
      <Card>
        <CardHeader>
          <CardTitle>Error Boundary Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowError(true)}
          >
            Trigger Error Boundary
          </Button>
        </CardContent>
      </Card>

      {/* Loading states */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Loading Spinner</h3>
            <div className="flex gap-4">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Card Skeleton</h3>
            <CardSkeleton />
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Table Skeleton</h3>
            <TableSkeleton />
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Content Skeleton</h3>
            <ContentSkeleton />
          </div>
        </CardContent>
      </Card>

      {/* Async loading simulation */}
      <Card>
        <CardHeader>
          <CardTitle>Async Loading Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => setIsLoading(false), 3000)
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              'Simulate Loading (3s)'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

## ✅ Acceptance Criteria
- [ ] Loading states display during page loads
- [ ] Error boundary catches and displays errors
- [ ] Not found page shows for invalid routes
- [ ] Loading skeletons render properly
- [ ] Loading spinner animates correctly
- [ ] Metadata is properly configured
- [ ] Error recovery (reset) works
- [ ] All states are accessible

## 🧪 Testing
```bash
# Run development server
npm run dev

# Test loading states:
1. Navigate to /states-test
2. View all loading skeleton variations
3. Test async loading simulation

# Test error boundary:
1. Click "Trigger Error Boundary" button
2. Verify error message displays
3. Test "Try again" button

# Test 404 page:
1. Navigate to /nonexistent-page
2. Verify 404 page displays
3. Test navigation buttons

# Test metadata:
1. View page source
2. Check meta tags in head
3. Verify Open Graph tags
```

## 📚 References
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

## 🏷️ Tags
`loading` `error-handling` `404` `metadata` `ux`

## ⏱️ Estimated Time
2 hours

## 🔗 Dependencies
- TASK_001 (Project initialization)
- TASK_003 (shadcn/ui components)

## 🚀 Next Steps
Phase 1-3 complete! Proceed to TASK_007 (Developer Experience Setup) from Phase 4