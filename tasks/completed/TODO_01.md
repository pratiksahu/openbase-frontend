# TODO Phase 1-3: Foundation Setup

## 🎯 Phase 1: Initial Setup

- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Configure TypeScript settings (tsconfig.json)
- [ ] Set up project structure (folders: app, components, lib, hooks, types, config)
- [ ] Install and configure Tailwind CSS
- [ ] Set up CSS variables for theming
- [ ] Configure path aliases (@/\* imports)

## 🎨 Phase 2: UI & Design System

- [ ] Install shadcn/ui CLI
- [ ] Initialize shadcn/ui configuration
- [ ] Install essential shadcn/ui components:
  - [ ] Button
  - [ ] Card
  - [ ] Input
  - [ ] Label
  - [ ] Select
  - [ ] Dialog
  - [ ] Dropdown Menu
  - [ ] Toast
  - [ ] Form
  - [ ] Table
  - [ ] Tabs
  - [ ] Navigation Menu
  - [ ] Sheet (mobile navigation)
  - [ ] Skeleton (loading states)
  - [ ] Alert
  - [ ] Badge
  - [ ] Avatar
  - [ ] Separator
- [ ] Install Lucide React icons
- [ ] Create theme provider for dark mode
- [ ] Implement theme toggle component
- [ ] Set up global CSS with Tailwind directives
- [ ] Configure font system (Inter or system fonts)

## 📁 Phase 3: Core Layout & Navigation

- [ ] Create root layout with providers
- [ ] Implement responsive header component
- [ ] Create navigation menu (desktop)
- [ ] Implement mobile navigation (hamburger menu)
- [ ] Create footer component
- [ ] Set up loading.tsx for loading states
- [ ] Create error.tsx for error boundaries
- [ ] Implement not-found.tsx page
- [ ] Create metadata configuration

## 📊 Milestone 1: Foundation

**Goal**: Basic Next.js app with UI framework and navigation
**Estimated Time**: Week 1
**Priority**: High

## ✅ Completion Checklist

- [ ] Next.js app runs successfully
- [ ] TypeScript configured properly
- [ ] Tailwind CSS working
- [ ] shadcn/ui components installed
- [ ] Dark mode toggle functional
- [ ] Navigation responsive on all devices
- [ ] Basic layout structure complete

## 🧪 Playwright Browser Test Verification

### Test File: `tests/foundation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Foundation Setup Verification', () => {
  test('Next.js app runs successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Next\.js/);
    const response = await page.request.get('/');
    expect(response.status()).toBe(200);
  });

  test('Page loads without console errors', async ({ page }) => {
    // Verify no errors in browser console
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.goto('/');
    expect(consoleErrors.filter(err => !err.includes('Warning'))).toHaveLength(
      0
    );
  });

  test('Tailwind CSS classes apply correctly', async ({ page }) => {
    await page.goto('/');
    const element = page.locator('.text-primary').first();
    await expect(element).toBeVisible();
    const color = await element.evaluate(
      el => window.getComputedStyle(el).color
    );
    expect(color).not.toBe('');
  });

  test('shadcn/ui Button component renders', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('button[data-testid="ui-button"]').first();
    await expect(button).toBeVisible();
    await expect(button).toHaveClass(/inline-flex/);
  });

  test('Dark mode toggle functions correctly', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();

    // Check initial theme
    const htmlElement = page.locator('html');
    const initialTheme = await htmlElement.getAttribute('class');

    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);

    // Verify theme changed
    const newTheme = await htmlElement.getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
    expect(newTheme).toMatch(/dark|light/);
  });

  test('Navigation is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu should be visible
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    await expect(mobileMenuButton).toBeVisible();

    // Desktop nav should be hidden
    const desktopNav = page.locator('[data-testid="desktop-nav"]');
    await expect(desktopNav).toBeHidden();

    // Open mobile menu
    await mobileMenuButton.click();
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    await expect(mobileNav).toBeVisible();
  });

  test('Navigation is responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Desktop nav should be visible
    const desktopNav = page.locator('[data-testid="desktop-nav"]');
    await expect(desktopNav).toBeVisible();

    // Mobile menu button should be hidden
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    await expect(mobileMenuButton).toBeHidden();
  });

  test('Basic layout structure is complete', async ({ page }) => {
    await page.goto('/');

    // Header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Main content area exists
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('Loading states work correctly', async ({ page }) => {
    await page.goto('/slow-page');

    // Loading component should appear
    const loadingElement = page.locator('[data-testid="loading-skeleton"]');
    await expect(loadingElement).toBeVisible();
  });

  test('Error boundaries catch errors', async ({ page }) => {
    await page.goto('/error-test');

    // Error boundary should display
    const errorBoundary = page.locator('[data-testid="error-boundary"]');
    await expect(errorBoundary).toBeVisible();

    // Reset button should be present
    const resetButton = page.locator('button:has-text("Try again")');
    await expect(resetButton).toBeVisible();
  });

  test('404 page displays for invalid routes', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);

    const notFoundElement = page.locator('[data-testid="not-found"]');
    await expect(notFoundElement).toBeVisible();
  });

  test('Metadata is properly configured', async ({ page }) => {
    await page.goto('/');

    // Check meta tags
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(description).toBeTruthy();

    // Check Open Graph tags
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content');
    expect(ogTitle).toBeTruthy();
  });
});

test.describe('UI Component Tests', () => {
  test('All essential shadcn/ui components render', async ({ page }) => {
    await page.goto('/components-showcase');

    const components = [
      'button',
      'card',
      'input',
      'label',
      'select',
      'dialog',
      'dropdown-menu',
      'toast',
      'form',
      'table',
      'tabs',
      'navigation-menu',
      'sheet',
      'skeleton',
      'alert',
      'badge',
      'avatar',
      'separator',
    ];

    for (const component of components) {
      const element = page.locator(`[data-testid="ui-${component}"]`);
      await expect(element).toBeVisible();
    }
  });

  test('Lucide icons render correctly', async ({ page }) => {
    await page.goto('/');
    const icon = page.locator('[data-testid="lucide-icon"]').first();
    await expect(icon).toBeVisible();
    const svg = icon.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('CSS variables for theming are applied', async ({ page }) => {
    await page.goto('/');

    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        primary: styles.getPropertyValue('--primary'),
        secondary: styles.getPropertyValue('--secondary'),
        accent: styles.getPropertyValue('--accent'),
        background: styles.getPropertyValue('--background'),
        foreground: styles.getPropertyValue('--foreground'),
      };
    });

    expect(rootStyles.primary).toBeTruthy();
    expect(rootStyles.secondary).toBeTruthy();
    expect(rootStyles.accent).toBeTruthy();
    expect(rootStyles.background).toBeTruthy();
    expect(rootStyles.foreground).toBeTruthy();
  });
});
```

### Running the Tests

```bash
# Run all foundation tests
npx playwright test tests/foundation.spec.ts

# Run with UI mode for debugging
npx playwright test tests/foundation.spec.ts --ui

# Run specific test
npx playwright test tests/foundation.spec.ts -g "Next.js app runs"
```
