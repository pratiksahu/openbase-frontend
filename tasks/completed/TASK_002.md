# TASK_002: Configure Tailwind CSS and Design System

## 📋 Task Overview

Set up Tailwind CSS with custom configuration, CSS variables for theming, and establish the design system foundation.

## 🎯 Objectives

- Configure Tailwind CSS with custom settings
- Set up CSS variables for dynamic theming
- Create global styles with Tailwind directives
- Configure font system

## 📝 Implementation Steps

### 1. Update Tailwind Configuration (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
```

### 2. Create Global CSS with Variables (app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 3. Install Required Packages

```bash
npm install tailwindcss-animate
```

### 4. Configure Font System (app/layout.tsx)

```typescript
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

// In the body className:
<body className={`${inter.variable} ${robotoMono.variable} font-sans`}>
```

### 5. Update Tailwind Config for Custom Fonts

```typescript
// In tailwind.config.ts extend section:
fontFamily: {
  sans: ["var(--font-inter)", "system-ui", "sans-serif"],
  mono: ["var(--font-roboto-mono)", "monospace"],
},
```

### 6. Create CSS Utility Classes (optional)

```css
/* Add to globals.css */
@layer components {
  .container {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }

  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }

  .card-base {
    @apply bg-card text-card-foreground rounded-lg border shadow-sm;
  }
}
```

## ✅ Acceptance Criteria

- [ ] Tailwind CSS configured with custom theme
- [ ] CSS variables defined for light/dark themes
- [ ] Global styles applied correctly
- [ ] Custom fonts configured and loading
- [ ] Dark mode CSS variables working
- [ ] Tailwind Intellisense working in IDE
- [ ] Build process includes Tailwind CSS

## 🧪 Testing

```bash
# Test Tailwind compilation
npm run dev

# Verify styles are applied
# Open browser and check:
# - Background colors change with theme
# - Custom colors (primary, secondary) work
# - Fonts are loading correctly
# - Responsive utilities work
```

Test dark mode by adding to app/page.tsx:

```typescript
<div className="bg-primary text-primary-foreground p-4">
  Primary Color Test
</div>
<div className="dark:bg-white dark:text-black">
  Dark Mode Test
</div>
```

## 📚 References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Variables with Tailwind](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

## 🏷️ Tags

`styling` `tailwind` `css` `theming` `design-system`

## ⏱️ Estimated Time

1-2 hours

## 🔗 Dependencies

- TASK_001 (Project initialization must be complete)

## 🚀 Next Steps

After completing this task, proceed to TASK_003 (Install and Configure shadcn/ui)
