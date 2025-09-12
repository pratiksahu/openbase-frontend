# TASK_004: Implement Theme Provider and Dark Mode

## 📋 Task Overview

Create a theme provider for dark mode support with system preference detection and manual toggle functionality.

## 🎯 Objectives

- Implement theme provider using next-themes
- Create theme toggle component
- Set up system preference detection
- Persist theme preference

## 📝 Implementation Steps

### 1. Install Dependencies

```bash
npm install next-themes
```

### 2. Create Theme Provider (components/providers/theme-provider.tsx)

```typescript
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### 3. Create Theme Toggle Component (components/shared/theme-toggle.tsx)

```typescript
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          data-testid="theme-toggle"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 4. Create Simple Toggle Button (components/shared/theme-toggle-simple.tsx)

```typescript
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      data-testid="theme-toggle"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

### 5. Update Root Layout (app/layout.tsx)

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 6. Create useTheme Hook (hooks/use-theme-config.ts)

```typescript
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useThemeConfig() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return {
    theme: mounted ? currentTheme : undefined,
    setTheme,
    mounted,
    isLight: currentTheme === 'light',
    isDark: currentTheme === 'dark',
  };
}
```

### 7. Create Header with Theme Toggle (components/shared/header.tsx)

```typescript
import Link from "next/link"
import { ThemeToggle } from "@/components/shared/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Logo</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

### 8. Create Theme Test Page (app/theme-test/page.tsx)

```typescript
"use client"

import { useThemeConfig } from "@/hooks/use-theme-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ThemeTest() {
  const { theme, isLight, isDark, mounted } = useThemeConfig()

  if (!mounted) {
    return <div>Loading theme...</div>
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Theme Test Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>Current Theme</CardTitle>
          <CardDescription>Testing theme functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="text-lg p-2">
                Current theme: {theme}
              </Badge>
            </div>
            <div className="flex gap-4">
              <span>Is Light: {isLight ? "✅" : "❌"}</span>
              <span>Is Dark: {isDark ? "✅" : "❌"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Primary Color</CardTitle>
        </CardHeader>
        <CardContent>
          This card uses primary colors
        </CardContent>
      </Card>

      <Card className="bg-secondary text-secondary-foreground">
        <CardHeader>
          <CardTitle>Secondary Color</CardTitle>
        </CardHeader>
        <CardContent>
          This card uses secondary colors
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-background text-foreground border rounded">
          Background / Foreground
        </div>
        <div className="p-4 bg-muted text-muted-foreground rounded">
          Muted / Muted Foreground
        </div>
      </div>
    </div>
  )
}
```

## ✅ Acceptance Criteria

- [ ] Theme provider integrated with Next.js
- [ ] Theme toggle component working
- [ ] Dark mode switching without flicker
- [ ] System preference detection working
- [ ] Theme preference persisted in localStorage
- [ ] All UI components respect theme
- [ ] No hydration errors
- [ ] Smooth transitions between themes

## 🧪 Testing

```bash
# Run development server
npm run dev

# Test theme functionality:
1. Navigate to http://localhost:3000/theme-test
2. Click theme toggle - verify smooth transition
3. Select "System" - change OS theme and verify it follows
4. Refresh page - verify theme persists
5. Check console for any hydration errors
6. Test on mobile devices
```

## 📚 References

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)
- [Avoiding Flicker](https://www.joshwcomeau.com/react/dark-mode/)

## 🏷️ Tags

`theme` `dark-mode` `provider` `ui`

## ⏱️ Estimated Time

1-2 hours

## 🔗 Dependencies

- TASK_001 (Project initialization)
- TASK_002 (Tailwind CSS configuration)
- TASK_003 (shadcn/ui components)

## 🚀 Next Steps

After completing this task, proceed to TASK_005 (Create Core Layout Components)
