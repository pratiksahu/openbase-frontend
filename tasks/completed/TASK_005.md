# TASK_005: Create Core Layout Components

## 📋 Task Overview
Build the core layout components including header, footer, navigation, and responsive mobile menu.

## 🎯 Objectives
- Create responsive header with navigation
- Build footer component
- Implement mobile navigation with hamburger menu
- Create layout wrapper components

## 📝 Implementation Steps

### 1. Create Header Component (components/shared/header.tsx)
```typescript
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">YourLogo</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium" data-testid="desktop-nav">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side items */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="mobile-menu-button"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]" data-testid="mobile-nav">
                <nav className="flex flex-col space-y-4 mt-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-foreground/80",
                        pathname === item.href ? "text-foreground" : "text-foreground/60"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

### 2. Create Footer Component (components/shared/footer.tsx)
```typescript
import Link from "next/link"
import { Facebook, Twitter, Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-foreground">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground md:order-1 md:mt-0">
            © 2024 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### 3. Create Main Layout Wrapper (components/shared/layout-wrapper.tsx)
```typescript
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

### 4. Create Container Component (components/shared/container.tsx)
```typescript
import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div 
      className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}
      data-testid="container"
    >
      {children}
    </div>
  )
}
```

### 5. Create Section Component (components/shared/section.tsx)
```typescript
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section 
      id={id}
      className={cn("py-12 md:py-24 lg:py-32", className)}
      data-testid="section"
    >
      {children}
    </section>
  )
}
```

### 6. Create Page Header Component (components/shared/page-header.tsx)
```typescript
interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-4 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16" data-testid="page-header">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          {description}
        </p>
      )}
    </div>
  )
}
```

### 7. Update Root Layout to Use Layout Wrapper (app/layout.tsx)
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { LayoutWrapper } from '@/components/shared/layout-wrapper'
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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 8. Create Test Page (app/layout-test/page.tsx)
```typescript
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LayoutTest() {
  return (
    <>
      <Container>
        <PageHeader 
          title="Layout Components Test"
          description="Testing all layout components for proper rendering and responsiveness"
        />
      </Container>

      <Section className="bg-muted/50">
        <Container>
          <Card>
            <CardHeader>
              <CardTitle>Section with Container</CardTitle>
            </CardHeader>
            <CardContent>
              This demonstrates the Section and Container components working together.
              The section provides vertical spacing while the container manages horizontal padding.
            </CardContent>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Card 1</CardTitle>
              </CardHeader>
              <CardContent>
                Responsive grid layout
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Card 2</CardTitle>
              </CardHeader>
              <CardContent>
                Works on all screen sizes
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Card 3</CardTitle>
              </CardHeader>
              <CardContent>
                Mobile-first approach
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
```

## ✅ Acceptance Criteria
- [ ] Header component renders with navigation
- [ ] Mobile menu works on small screens
- [ ] Footer displays all sections properly
- [ ] Layout wrapper integrates header and footer
- [ ] Container component provides proper spacing
- [ ] Section component adds vertical rhythm
- [ ] Page header displays title and description
- [ ] All components are responsive
- [ ] Navigation highlights active page

## 🧪 Testing
```bash
# Run development server
npm run dev

# Test on different screen sizes:
1. Desktop (1920px) - verify desktop nav visible
2. Tablet (768px) - verify layout adjusts
3. Mobile (375px) - verify mobile menu works

# Navigate to /layout-test
# Verify all components render correctly
# Test mobile menu open/close
# Check active navigation highlighting
```

## 📚 References
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Responsive Design Patterns](https://web.dev/responsive-web-design-basics/)
- [Accessible Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/navigation/)

## 🏷️ Tags
`layout` `navigation` `header` `footer` `responsive`

## ⏱️ Estimated Time
2-3 hours

## 🔗 Dependencies
- TASK_001 (Project initialization)
- TASK_003 (shadcn/ui components)
- TASK_004 (Theme provider)

## 🚀 Next Steps
After completing this task, proceed to TASK_006 (Create Loading and Error States)