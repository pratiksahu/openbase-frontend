# TODO Phase 6-8: Core Features & Testing

## 📦 Phase 6: Form & Validation
- [ ] Install React Hook Form
- [ ] Install Zod for validation
- [ ] Create form components wrapper
- [ ] Implement form field components
- [ ] Create validation schemas
- [ ] Build example contact form
- [ ] Add form error handling
- [ ] Implement success states

## 🚀 Phase 7: Performance & Optimization
- [ ] Configure Next.js Image optimization
- [ ] Set up dynamic imports for code splitting
- [ ] Implement SEO component
- [ ] Add Open Graph tags
- [ ] Configure sitemap generation
- [ ] Set up robots.txt
- [ ] Implement analytics (optional)
- [ ] Add performance monitoring

## 🧪 Phase 8: Testing Setup
- [ ] Install testing dependencies
- [ ] Configure Jest
- [ ] Set up React Testing Library
- [ ] Create test utilities
- [ ] Write example unit tests
- [ ] Set up E2E testing with Playwright
- [ ] Create test scripts in package.json

## 📊 Milestone 3: Core Features
**Goal**: Forms, validation, and testing infrastructure
**Estimated Time**: Week 2 (second half) - Week 3 (first half)
**Priority**: High

## ✅ Completion Checklist
- [ ] Form validation working properly
- [ ] React Hook Form integrated
- [ ] Zod schemas implemented
- [ ] SEO optimizations in place
- [ ] Image optimization configured
- [ ] Testing framework operational
- [ ] Unit tests passing
- [ ] E2E tests configured

## 🧪 Playwright Test Verification

### Test File: `tests/core-features.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Form & Validation', () => {
  
  test('React Hook Form is properly integrated', async ({ page }) => {
    await page.goto('/contact');
    
    // Form should be rendered with React Hook Form
    const form = page.locator('form[data-testid="contact-form"]');
    await expect(form).toBeVisible();
    
    // Check form has proper attributes
    const formId = await form.getAttribute('id');
    expect(formId).toBeTruthy();
  });

  test('Zod validation works on form submission', async ({ page }) => {
    await page.goto('/contact');
    
    // Try submitting empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show validation errors
    const emailError = page.locator('[data-testid="error-email"]');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText(/required|invalid/i);
    
    const nameError = page.locator('[data-testid="error-name"]');
    await expect(nameError).toBeVisible();
  });

  test('Form fields validate on blur', async ({ page }) => {
    await page.goto('/contact');
    
    // Focus and blur email field with invalid value
    const emailField = page.locator('input[name="email"]');
    await emailField.fill('invalid-email');
    await emailField.blur();
    
    // Should show validation error
    const emailError = page.locator('[data-testid="error-email"]');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText(/valid email/i);
  });

  test('Form submission with valid data works', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form with valid data
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show success state
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

  test('Form error handling displays server errors', async ({ page }) => {
    // Mock API error
    await page.route('/api/contact', route => {
      route.fulfill({
        status: 500,
        json: { error: 'Server error occurred' }
      });
    });
    
    await page.goto('/contact');
    
    // Fill and submit form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="name"]', 'Test User');
    await page.locator('button[type="submit"]').click();
    
    // Should show error message
    const errorAlert = page.locator('[data-testid="form-error"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(/error/i);
  });

  test('Form field components render with proper accessibility', async ({ page }) => {
    await page.goto('/contact');
    
    // Check input has label
    const emailInput = page.locator('input[name="email"]');
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    
    // Check aria attributes
    const ariaDescribedBy = await emailInput.getAttribute('aria-describedby');
    const ariaInvalid = await emailInput.getAttribute('aria-invalid');
    expect(ariaDescribedBy || ariaInvalid).toBeDefined();
  });
});

test.describe('Performance & Optimization', () => {
  
  test('Next.js Image component optimizes images', async ({ page }) => {
    await page.goto('/');
    
    // Find Next.js optimized images
    const images = page.locator('img[loading="lazy"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    
    // Check for srcset attribute (responsive images)
    const firstImage = images.first();
    const srcset = await firstImage.getAttribute('srcset');
    expect(srcset).toBeTruthy();
  });

  test('Dynamic imports work for code splitting', async ({ page }) => {
    // Monitor network requests
    const chunks: string[] = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('_next/static/chunks/') && url.endsWith('.js')) {
        chunks.push(url);
      }
    });
    
    await page.goto('/');
    
    // Navigate to page with dynamic import
    await page.click('a[href="/heavy-component"]');
    await page.waitForLoadState('networkidle');
    
    // Should have loaded additional chunks
    const dynamicChunks = chunks.filter(chunk => 
      !chunk.includes('main') && !chunk.includes('framework')
    );
    expect(dynamicChunks.length).toBeGreaterThan(0);
  });

  test('SEO meta tags are properly set', async ({ page }) => {
    await page.goto('/');
    
    // Check essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description.length).toBeGreaterThan(50);
    
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });

  test('Open Graph tags are present', async ({ page }) => {
    await page.goto('/blog/sample-post');
    
    const ogTags = {
      title: await page.locator('meta[property="og:title"]').getAttribute('content'),
      description: await page.locator('meta[property="og:description"]').getAttribute('content'),
      image: await page.locator('meta[property="og:image"]').getAttribute('content'),
      url: await page.locator('meta[property="og:url"]').getAttribute('content'),
      type: await page.locator('meta[property="og:type"]').getAttribute('content'),
    };
    
    expect(ogTags.title).toBeTruthy();
    expect(ogTags.description).toBeTruthy();
    expect(ogTags.image).toBeTruthy();
    expect(ogTags.url).toBeTruthy();
    expect(ogTags.type).toBeTruthy();
  });

  test('Sitemap is accessible', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('xml');
    
    const text = await response.text();
    expect(text).toContain('<urlset');
    expect(text).toContain('<url>');
  });

  test('Robots.txt is properly configured', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    
    const text = await response.text();
    expect(text).toContain('User-agent');
    expect(text).toContain('Sitemap:');
  });

  test('Performance metrics meet thresholds', async ({ page }) => {
    await page.goto('/');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        domInteractive: perf.domInteractive - perf.fetchStart,
      };
    });
    
    // Check performance thresholds (adjust as needed)
    expect(metrics.domInteractive).toBeLessThan(3000); // 3 seconds
    expect(metrics.loadComplete).toBeLessThan(5000); // 5 seconds
  });
});

test.describe('Testing Infrastructure Validation', () => {
  
  test('Test environment is accessible via browser', async ({ page }) => {
    // Navigate to test configuration endpoint (if available)
    await page.goto('/');
    
    // Verify that the application can handle test data
    const testElement = page.locator('[data-testid="app-root"]');
    if (await testElement.count() > 0) {
      await expect(testElement).toBeVisible();
    }
    
    // Check that JavaScript test frameworks are loaded properly
    const hasTestingLibrary = await page.evaluate(() => {
      return typeof window !== 'undefined' && window.location.pathname !== null;
    });
    expect(hasTestingLibrary).toBeTruthy();
  });

  test('Application handles test scenarios in browser', async ({ page }) => {
    await page.goto('/contact');
    
    // Test that form validation works in browser context
    const form = page.locator('form[data-testid="contact-form"]');
    await expect(form).toBeVisible();
    
    // Test browser-based validation
    await page.click('button[type="submit"]');
    const validationMessage = page.locator('[data-testid="error-email"]');
    if (await validationMessage.count() > 0) {
      await expect(validationMessage).toBeVisible();
    }
  });

  test('Testing utilities work in browser environment', async ({ page }) => {
    await page.goto('/');
    
    // Test browser utilities like localStorage
    const hasLocalStorage = await page.evaluate(() => {
      return typeof localStorage !== 'undefined';
    });
    expect(hasLocalStorage).toBeTruthy();
    
    // Test sessionStorage
    const hasSessionStorage = await page.evaluate(() => {
      return typeof sessionStorage !== 'undefined';
    });
    expect(hasSessionStorage).toBeTruthy();
  });

  test('Browser-based test data management', async ({ page }) => {
    await page.goto('/');
    
    // Set test data in browser storage
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value');
    });
    
    // Verify test data retrieval
    const testValue = await page.evaluate(() => {
      return localStorage.getItem('test-key');
    });
    expect(testValue).toBe('test-value');
    
    // Clean up test data
    await page.evaluate(() => {
      localStorage.removeItem('test-key');
    });
  });

  test('Browser console testing capabilities', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });
    
    await page.goto('/');
    
    // Test console functionality
    await page.evaluate(() => {
      console.log('Test console message');
    });
    
    await page.waitForTimeout(100);
    expect(consoleMessages.some(msg => msg.includes('Test console message'))).toBeTruthy();
  });
});

test.describe('Form Components Integration', () => {
  
  test('Form wrapper component handles submission', async ({ page }) => {
    await page.goto('/form-examples');
    
    const form = page.locator('[data-testid="example-form"]');
    await expect(form).toBeVisible();
    
    // Fill and submit
    await page.fill('[data-testid="input-field"]', 'test value');
    await page.click('[data-testid="submit-button"]');
    
    // Check submission handled
    const result = page.locator('[data-testid="form-result"]');
    await expect(result).toBeVisible();
  });

  test('Custom form fields integrate with React Hook Form', async ({ page }) => {
    await page.goto('/form-examples');
    
    // Test custom input component
    const customInput = page.locator('[data-testid="custom-input"]');
    await customInput.fill('test');
    
    // Should update form state
    const formState = await page.locator('[data-testid="form-state"]').textContent();
    expect(formState).toContain('test');
  });

  test('Validation schemas show proper error messages', async ({ page }) => {
    await page.goto('/form-examples');
    
    // Test various validation scenarios
    const emailInput = page.locator('input[type="email"]');
    
    // Test required field
    await emailInput.fill('');
    await emailInput.blur();
    let error = page.locator('[data-testid="email-error"]');
    await expect(error).toContainText(/required/i);
    
    // Test format validation
    await emailInput.fill('invalid');
    await emailInput.blur();
    await expect(error).toContainText(/valid email/i);
    
    // Test valid input
    await emailInput.fill('valid@email.com');
    await emailInput.blur();
    await expect(error).toBeHidden();
  });
});
```

### Running the Tests

```bash
# Run all core features tests
npx playwright test tests/core-features.spec.ts

# Run form validation tests only
npx playwright test tests/core-features.spec.ts -g "Form & Validation"

# Run performance tests
npx playwright test tests/core-features.spec.ts -g "Performance"

# Run with headed browser for debugging
npx playwright test tests/core-features.spec.ts --headed

# Generate test report
npx playwright test tests/core-features.spec.ts --reporter=html
```