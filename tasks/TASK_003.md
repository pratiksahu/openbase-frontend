# TASK_003: Install and Configure shadcn/ui Components

## 📋 Task Overview
Set up shadcn/ui component library and install all essential UI components for the application.

## 🎯 Objectives
- Initialize shadcn/ui in the project
- Install all essential UI components
- Configure component styling
- Set up Lucide React icons

## 📝 Implementation Steps

### 1. Initialize shadcn/ui
```bash
npx shadcn@latest init
```

Choose the following options:
- Style: Default
- Base color: Slate
- CSS variables: Yes

### 2. Install Essential Components
Run these commands to install all required components:

```bash
# Core components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast

# Form components
npx shadcn@latest add form
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add textarea

# Layout components
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add navigation-menu
npx shadcn@latest add sheet
npx shadcn@latest add separator
npx shadcn@latest add scroll-area

# Feedback components
npx shadcn@latest add skeleton
npx shadcn@latest add alert
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add progress
npx shadcn@latest add alert-dialog
```

### 3. Install Lucide React Icons
```bash
npm install lucide-react
```

### 4. Create Component Index File (components/ui/index.ts)
```typescript
// Export all UI components from a single file
export { Button, buttonVariants } from './button'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
export { Input } from './input'
export { Label } from './label'
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from './select'
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './dialog'
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from './dropdown-menu'
export { useToast, toast } from './use-toast'
export { Toaster } from './toaster'
// Add more exports as needed
```

### 5. Set Up Toast Provider (app/layout.tsx)
```typescript
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

### 6. Create Example Component Page (app/components-test/page.tsx)
```typescript
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Home, Settings, User } from "lucide-react"

export default function ComponentsTest() {
  const { toast } = useToast()

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Component Library Test</h1>
      
      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Various button styles and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-x-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </CardContent>
      </Card>

      {/* Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Lucide Icons</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Home className="h-6 w-6" />
          <User className="h-6 w-6" />
          <Settings className="h-6 w-6" />
          <Bell className="h-6 w-6" />
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent className="space-x-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      {/* Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </CardContent>
      </Card>

      {/* Toast Test */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              toast({
                title: "Test Notification",
                description: "This is a test toast message.",
              })
            }}
          >
            Show Toast
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 7. Update components.json (if needed)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## ✅ Acceptance Criteria
- [ ] shadcn/ui initialized successfully
- [ ] All essential components installed
- [ ] Components rendering correctly
- [ ] Lucide icons working
- [ ] Toast notifications functional
- [ ] Component test page working
- [ ] All components have proper TypeScript types
- [ ] Components follow design system colors

## 🧪 Testing
```bash
# Run development server
npm run dev

# Navigate to http://localhost:3000/components-test
# Verify all components render correctly
# Test interactive components (buttons, forms, toasts)
# Check dark mode compatibility
```

## 📚 References
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Radix UI Primitives](https://www.radix-ui.com)

## 🏷️ Tags
`ui` `components` `shadcn` `design-system`

## ⏱️ Estimated Time
2-3 hours

## 🔗 Dependencies
- TASK_001 (Project initialization)
- TASK_002 (Tailwind CSS configuration)

## 🚀 Next Steps
After completing this task, proceed to TASK_004 (Create Theme Provider and Dark Mode)