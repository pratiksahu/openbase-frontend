const { chromium, firefox, webkit } = require('playwright');

async function runCrossBrowserTests() {
  console.log('🌐 Running cross-browser compatibility tests...');

  const browsers = [
    { name: 'Chromium', launcher: chromium },
    { name: 'Firefox', launcher: firefox },
    { name: 'WebKit', launcher: webkit },
  ];

  const testResults = {};

  for (const browserInfo of browsers) {
    console.log(`\nTesting with ${browserInfo.name}...`);

    try {
      const browser = await browserInfo.launcher.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      // Collect console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Collect JavaScript errors
      const jsErrors = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });

      // Test critical pages
      const pagesToTest = ['/', '/features', '/contact', '/dashboard'];

      const pageResults = {};

      for (const pagePath of pagesToTest) {
        try {
          await page.goto(`http://localhost:3000${pagePath}`, {
            waitUntil: 'networkidle',
            timeout: 30000,
          });

          // Basic functionality tests
          const tests = {
            pageLoads: true,
            titlePresent: (await page.title()) !== '',
            bodyVisible: await page.locator('body').isVisible(),
            navigationPresent:
              (await page.locator('nav, [role="navigation"]').count()) > 0,
            consoleErrors: consoleErrors.length === 0,
            jsErrors: jsErrors.length === 0,
          };

          // Test specific functionality based on page
          if (pagePath === '/') {
            const heroSection = page.locator('[data-testid="hero-section"]');
            const ctaButton = page.locator('[data-testid="cta-button"]');
            
            tests.heroSection = await heroSection.isVisible().catch(() => false);
            tests.ctaButton = await ctaButton.isVisible().catch(() => false);
          }

          if (pagePath === '/contact') {
            const contactForm = page.locator('form');
            const emailInput = page.locator('input[type="email"]');
            
            tests.contactForm = await contactForm.first().isVisible().catch(() => false);
            tests.formInputs = await emailInput.first().isVisible().catch(() => false);
          }

          if (pagePath === '/dashboard') {
            const dashboardLayout = page.locator('[data-testid="dashboard"]');
            
            tests.dashboardLayout = await dashboardLayout.isVisible().catch(() => false);
          }

          pageResults[pagePath] = tests;

          const passedTests = Object.values(tests).filter(Boolean).length;
          const totalTests = Object.keys(tests).length;

          console.log(
            `  ${pagePath}: ${passedTests}/${totalTests} tests passed`
          );

          if (consoleErrors.length > 0) {
            console.log(`    Console errors: ${consoleErrors.length}`);
          }
          if (jsErrors.length > 0) {
            console.log(`    JS errors: ${jsErrors.length}`);
          }
        } catch (error) {
          console.log(`  ${pagePath}: Failed to load - ${error.message}`);
          pageResults[pagePath] = { error: error.message };
        }

        // Clear errors for next page
        consoleErrors.length = 0;
        jsErrors.length = 0;
      }

      testResults[browserInfo.name] = pageResults;
      await browser.close();
    } catch (error) {
      console.error(`Failed to test ${browserInfo.name}:`, error.message);
      testResults[browserInfo.name] = { error: error.message };
    }
  }

  // Generate summary report
  console.log('\n📊 Cross-Browser Test Summary:');
  console.log('=============================');

  let overallSuccess = true;

  Object.entries(testResults).forEach(([browser, results]) => {
    if (results.error) {
      console.log(`❌ ${browser}: Failed to test`);
      overallSuccess = false;
      return;
    }

    const pageCount = Object.keys(results).length;
    const successfulPages = Object.values(results).filter(
      page => !page.error && Object.values(page).every(test => test === true)
    ).length;

    console.log(
      `${successfulPages === pageCount ? '✅' : '⚠️'} ${browser}: ${successfulPages}/${pageCount} pages passed all tests`
    );

    if (successfulPages !== pageCount) {
      overallSuccess = false;
    }
  });

  // Save detailed results
  const fs = require('fs');
  fs.writeFileSync(
    './cross-browser-results.json',
    JSON.stringify(testResults, null, 2)
  );
  console.log('\n📄 Detailed results saved to cross-browser-results.json');

  return overallSuccess;
}

// Run tests
runCrossBrowserTests()
  .then(success => {
    console.log(
      success
        ? '\n🎉 Cross-browser tests passed!'
        : '\n⚠️ Cross-browser tests have issues!'
    );
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Cross-browser tests failed:', err);
    process.exit(1);
  });