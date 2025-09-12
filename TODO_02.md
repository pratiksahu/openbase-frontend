# TODO Phase 4-5: Development Setup & Core Components

## 🔧 Phase 4: Developer Experience
- [ ] Install and configure ESLint
- [ ] Set up Prettier for code formatting
- [ ] Create .prettierrc configuration
- [ ] Install Husky for git hooks
- [ ] Configure lint-staged
- [ ] Set up pre-commit hooks
- [ ] Create VS Code workspace settings
- [ ] Add recommended extensions list
- [ ] Configure editor settings

## 🏗️ Phase 5: Core Features Setup
- [ ] Create shared components structure:
  - [ ] Container component
  - [ ] Section component
  - [ ] PageHeader component
  - [ ] Breadcrumb component
- [ ] Implement authentication layout group
- [ ] Create dashboard layout
- [ ] Set up API route structure
- [ ] Create utility functions (cn, formatters)
- [ ] Implement custom hooks:
  - [ ] useMediaQuery
  - [ ] useDebounce
  - [ ] useLocalStorage
  - [ ] useTheme

## 📊 Milestone 2: Development Setup
**Goal**: Complete development environment with shared components
**Estimated Time**: Week 2 (first half)
**Priority**: High

## ✅ Completion Checklist
- [ ] ESLint running without errors
- [ ] Prettier formatting on save
- [ ] Git hooks working properly
- [ ] VS Code configured optimally
- [ ] All shared components created
- [ ] Custom hooks implemented
- [ ] Utility functions tested
- [ ] API structure established

## 🧪 Playwright Browser Test Verification

### Test File: `tests/dev-setup.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Core Components UI', () => {

  test('Container component renders correctly', async ({ page }) => {
    await page.goto('/test-components');
    
    const container = page.locator('[data-testid="container"]');
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/container/);
    await expect(container).toHaveClass(/mx-auto/);
  });

  test('Section component applies proper spacing', async ({ page }) => {
    await page.goto('/test-components');
    
    const section = page.locator('[data-testid="section"]');
    await expect(section).toBeVisible();
    
    const styles = await section.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        paddingTop: computed.paddingTop,
        paddingBottom: computed.paddingBottom,
      };
    });
    
    expect(parseInt(styles.paddingTop)).toBeGreaterThan(0);
    expect(parseInt(styles.paddingBottom)).toBeGreaterThan(0);
  });

  test('PageHeader component displays title and description', async ({ page }) => {
    await page.goto('/test-components');
    
    const pageHeader = page.locator('[data-testid="page-header"]');
    await expect(pageHeader).toBeVisible();
    
    const title = pageHeader.locator('h1');
    await expect(title).toBeVisible();
    
    const description = pageHeader.locator('p');
    await expect(description).toBeVisible();
  });

  test('Breadcrumb component shows navigation path', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    const breadcrumb = page.locator('[data-testid="breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    
    const items = breadcrumb.locator('[data-testid="breadcrumb-item"]');
    await expect(items).toHaveCount(3); // Home > Dashboard > Settings
  });

  test('Authentication layout group works', async ({ page }) => {
    await page.goto('/login');
    
    // Auth layout should be applied
    const authLayout = page.locator('[data-testid="auth-layout"]');
    await expect(authLayout).toBeVisible();
    
    // Should not have main navigation
    const mainNav = page.locator('[data-testid="main-nav"]');
    await expect(mainNav).toBeHidden();
  });

  test('Dashboard layout renders correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    const dashboardLayout = page.locator('[data-testid="dashboard-layout"]');
    await expect(dashboardLayout).toBeVisible();
    
    // Should have sidebar
    const sidebar = page.locator('[data-testid="dashboard-sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // Should have main content area
    const mainContent = page.locator('[data-testid="dashboard-content"]');
    await expect(mainContent).toBeVisible();
  });
});

test.describe('API Routes Structure', () => {
  
  test('API routes follow Next.js App Router structure', async ({ request }) => {
    // Test API route exists and responds
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
  });

  test('API routes handle errors properly', async ({ request }) => {
    const response = await request.get('/api/non-existent');
    expect(response.status()).toBe(404);
  });
});

test.describe('Utility Functions', () => {
  
  test('cn utility function exists and works', async ({ page }) => {
    await page.goto('/');
    
    // Test cn function in browser context
    const result = await page.evaluate(() => {
      // @ts-ignore - cn should be available globally for testing
      return window.testUtils?.cn('text-red-500', 'bg-blue-500', { 'font-bold': true });
    });
    
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('font-bold');
  });

  test('Formatter utilities work correctly', async ({ page }) => {
    await page.goto('/');
    
    const formatters = await page.evaluate(() => {
      // @ts-ignore
      const utils = window.testUtils;
      return {
        currency: utils?.formatCurrency(1234.56),
        date: utils?.formatDate(new Date('2024-01-01')),
        relative: utils?.formatRelativeTime(new Date()),
      };
    });
    
    expect(formatters.currency).toMatch(/[\$€£]?1,?234\.56/);
    expect(formatters.date).toContain('2024');
    expect(formatters.relative).toBeTruthy();
  });
});

test.describe('Custom Hooks', () => {
  
  test('useMediaQuery hook detects viewport changes', async ({ page }) => {
    await page.goto('/test-hooks');
    
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    let isDesktop = await page.locator('[data-testid="is-desktop"]').textContent();
    expect(isDesktop).toBe('true');
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    let isMobile = await page.locator('[data-testid="is-mobile"]').textContent();
    expect(isMobile).toBe('true');
  });

  test('useDebounce hook delays value updates', async ({ page }) => {
    await page.goto('/test-hooks');
    
    const input = page.locator('[data-testid="debounce-input"]');
    const output = page.locator('[data-testid="debounce-output"]');
    
    await input.fill('test');
    
    // Immediate check - should not be updated yet
    let immediateValue = await output.textContent();
    expect(immediateValue).toBe('');
    
    // Wait for debounce delay
    await page.waitForTimeout(600);
    
    let debouncedValue = await output.textContent();
    expect(debouncedValue).toBe('test');
  });

  test('useLocalStorage hook persists data', async ({ page, context }) => {
    await page.goto('/test-hooks');
    
    // Set value
    const button = page.locator('[data-testid="localstorage-set"]');
    await button.click();
    
    // Verify value is stored
    const stored = await page.evaluate(() => {
      return localStorage.getItem('test-key');
    });
    expect(stored).toBeTruthy();
    
    // Open new page in same context
    const newPage = await context.newPage();
    await newPage.goto('/test-hooks');
    
    // Value should persist
    const persistedValue = await newPage.locator('[data-testid="localstorage-value"]').textContent();
    expect(persistedValue).toBe(stored);
  });

  test('useTheme hook manages theme state', async ({ page }) => {
    await page.goto('/test-hooks');
    
    const themeDisplay = page.locator('[data-testid="current-theme"]');
    const toggleButton = page.locator('[data-testid="theme-toggle-hook"]');
    
    // Check initial theme
    const initialTheme = await themeDisplay.textContent();
    expect(['light', 'dark', 'system']).toContain(initialTheme);
    
    // Toggle theme
    await toggleButton.click();
    await page.waitForTimeout(100);
    
    // Theme should change
    const newTheme = await themeDisplay.textContent();
    expect(newTheme).not.toBe(initialTheme);
  });
});
```

### Running the Tests

```bash
# Run all development setup tests
npx playwright test tests/dev-setup.spec.ts

# Run with UI mode for debugging
npx playwright test tests/dev-setup.spec.ts --ui

# Run specific test suite
npx playwright test tests/dev-setup.spec.ts -g "Developer Experience"

# Run hooks tests
npx playwright test tests/dev-setup.spec.ts -g "Custom Hooks"
```