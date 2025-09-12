# TASK_013: Testing Setup

## Overview
Establish a comprehensive testing infrastructure for the Next.js application using Jest for unit testing, React Testing Library for component testing, and Playwright for end-to-end testing. This task ensures code quality, reliability, and maintainability through automated testing.

## Objectives
- Set up Jest with TypeScript support for unit testing
- Configure React Testing Library for component testing
- Implement Playwright for end-to-end testing
- Create testing utilities and helpers
- Establish testing patterns and best practices
- Set up test coverage reporting
- Integrate testing with CI/CD pipeline
- Create example tests for different scenarios

## Implementation Steps

### 1. Install Testing Dependencies

```bash
# Jest and related packages
npm install --save-dev jest @types/jest jest-environment-jsdom

# React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Playwright for E2E testing
npm install --save-dev @playwright/test

# Additional testing utilities
npm install --save-dev msw @mswjs/data faker @faker-js/faker
npm install --save-dev jest-canvas-mock jest-axe

# Test coverage and reporting
npm install --save-dev @jest/reporters
```

### 2. Configure Jest

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mapping for absolute imports
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Test environment
  testEnvironment: 'jest-environment-jsdom',
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
  ],
  
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}',
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/'],
  
  // Setup files
  setupFiles: ['<rootDir>/jest.setup.js'],
  
  // Test timeout
  testTimeout: 10000,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  
  disconnect() {}
  
  observe() {}
  
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  
  observe() {}
  
  unobserve() {}
  
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Suppress console errors in tests unless explicitly testing them
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

### 3. Create Testing Utilities

Create `src/test-utils/index.tsx`:

```tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark';
  router?: {
    pathname?: string;
    query?: Record<string, string>;
  };
}

function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { theme = 'light', ...renderOptions } = options || {};
  
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllTheProviders>{children}</AllTheProviders>
  );
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
```

Create `src/test-utils/mocks.ts`:

```typescript
import { faker } from '@faker-js/faker';

// Mock data factories
export const createMockUser = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});

export const createMockPost = () => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(3),
  excerpt: faker.lorem.paragraph(),
  slug: faker.lorem.slug(),
  author: createMockUser(),
  publishedAt: faker.date.past().toISOString(),
  tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
    faker.lorem.word()
  ),
});

export const createMockApiResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  message: status === 200 ? 'Success' : 'Error',
});

// Mock API handlers using MSW
export const mockApiHandlers = [
  // Add MSW handlers here
];

// Mock localStorage
export const mockLocalStorage = () => {
  const storage: Record<string, string> = {};
  
  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach(key => delete storage[key]);
    },
  };
};

// Mock fetch
export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status < 400,
    status,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response)),
  });
};

// Reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};
```

### 4. Configure Playwright

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
  },
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  
  /* Global setup and teardown */
  globalSetup: require.resolve('./e2e/global-setup'),
  globalTeardown: require.resolve('./e2e/global-teardown'),
});
```

### 5. Create Example Component Tests

Create `src/components/__tests__/Button.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@/test-utils';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('can be disabled', () => {
    render(<Button disabled>Disabled button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
  
  it('shows loading state', () => {
    render(<Button loading>Loading button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('applies correct variant styles', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });
  
  it('renders with correct size', () => {
    render(<Button size="lg">Large button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');
  });
});
```

Create `src/hooks/__tests__/useLocalStorage.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockLocalStorage } from '@/test-utils/mocks';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage(),
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });
  
  it('returns initial value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
  });
  
  it('returns stored value when key exists', () => {
    window.localStorage.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('stored-value');
  });
  
  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(window.localStorage.getItem('test-key')).toBe(
      JSON.stringify('new-value')
    );
  });
  
  it('supports function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 1));
    
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    
    expect(result.current[0]).toBe(2);
  });
  
  it('removes value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('stored-value');
    });
    
    expect(window.localStorage.getItem('test-key')).toBe(
      JSON.stringify('stored-value')
    );
    
    act(() => {
      result.current[2](); // removeValue function
    });
    
    expect(result.current[0]).toBe('initial');
    expect(window.localStorage.getItem('test-key')).toBeNull();
  });
  
  it('handles JSON parsing errors gracefully', () => {
    window.localStorage.setItem('test-key', 'invalid-json');
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    
    expect(result.current[0]).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error reading localStorage'),
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });
});
```

### 6. Create E2E Tests

Create `e2e/example.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Your App Name/);
    
    // Check main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Check navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
  
  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    
    // Click on about link
    await page.click('a[href="/about"]');
    
    // Check URL
    await expect(page).toHaveURL('/about');
    
    // Check about page content
    await expect(page.locator('h1')).toContainText('About');
  });
});

test.describe('Contact Form', () => {
  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check success message
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });
  
  test('should show validation errors', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check validation errors
    const nameError = page.locator('[data-testid="error-name"]');
    const emailError = page.locator('[data-testid="error-email"]');
    
    await expect(nameError).toBeVisible();
    await expect(emailError).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile navigation
    const menuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();
    }
  });
});
```

### 7. Create Global Test Setup

Create `e2e/global-setup.ts`:

```typescript
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Setup code that runs once before all tests
  console.log('Setting up E2E tests...');
  
  // You can add database seeding, authentication setup, etc. here
  
  return async () => {
    // Teardown code
    console.log('Tearing down E2E tests...');
  };
}

export default globalSetup;
```

Create `e2e/global-teardown.ts`:

```typescript
async function globalTeardown() {
  // Global teardown code
  console.log('Global E2E teardown complete');
}

export default globalTeardown;
```

### 8. Add Testing Scripts to Package.json

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "npm run test:ci && npm run test:e2e",
    "playwright:install": "playwright install"
  }
}
```

### 9. Create Test Configuration Files

Create `.vscode/settings.json` for better testing experience:

```json
{
  "jest.jestCommandLine": "npm run test",
  "jest.autoRun": "off",
  "testing.automaticallyOpenPeekView": "never",
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

Create `vitest.config.ts` (alternative to Jest):

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 10. Create CI/CD Configuration

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:ci
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Acceptance Criteria

- [ ] Jest configured with TypeScript and Next.js support
- [ ] React Testing Library integrated for component testing
- [ ] Playwright configured for E2E testing
- [ ] Test utilities and mocks created
- [ ] Example tests cover different scenarios
- [ ] Test coverage reporting configured
- [ ] CI/CD pipeline includes automated testing
- [ ] Tests run successfully in different environments
- [ ] Coverage thresholds enforced
- [ ] Accessibility testing integrated

## Testing Instructions

### 1. Run Unit Tests
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### 2. Run E2E Tests
```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:debug
```

### 3. Check Coverage
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### 4. Run All Tests
```bash
npm run test:all
```

## References and Dependencies

### Dependencies
- `jest`: Testing framework
- `@testing-library/react`: Component testing utilities
- `@playwright/test`: E2E testing framework
- `msw`: API mocking
- `faker`: Test data generation

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)

## Estimated Time
**6-8 hours**

- Jest and RTL setup: 2-3 hours
- Playwright configuration: 2-3 hours
- Test utilities and examples: 2-3 hours
- CI/CD integration: 1-2 hours

## Troubleshooting

### Common Issues

1. **Jest configuration issues**
   - Check Next.js Jest setup
   - Verify TypeScript path mapping
   - Ensure proper mocks for Next.js features

2. **React Testing Library errors**
   - Use proper queries and assertions
   - Wrap components in providers when needed
   - Handle async operations correctly

3. **Playwright test failures**
   - Check viewport and timing issues
   - Verify selectors are correct
   - Handle loading states properly

4. **Coverage issues**
   - Exclude generated files from coverage
   - Set appropriate coverage thresholds
   - Handle dynamic imports in coverage

5. **CI/CD failures**
   - Ensure consistent Node.js versions
   - Handle environment differences
   - Check dependency installation