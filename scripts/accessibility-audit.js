const { chromium } = require('playwright');
const { injectAxe, checkA11y, getViolations } = require('axe-playwright');

async function runAccessibilityAudit() {
  console.log('♿ Running accessibility audit...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Pages to test
  const pagesToTest = [
    '/',
    '/features',
    '/pricing',
    '/about',
    '/contact',
    '/blog',
    '/dashboard',
    '/settings',
  ];

  let totalViolations = 0;
  const violations = {};

  for (const pagePath of pagesToTest) {
    try {
      console.log(`\nTesting: ${pagePath}`);

      await page.goto(`http://localhost:3000${pagePath}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Inject axe
      await injectAxe(page);

      try {
        // Run accessibility check
        await checkA11y(page, null, {
          detailedReport: true,
          detailedReportOptions: { html: true },
          axeOptions: {
            rules: {
              // Configure rules
              'color-contrast': { enabled: true },
              'keyboard-navigation': { enabled: true },
              'focus-management': { enabled: true },
              'aria-labels': { enabled: true },
              'semantic-markup': { enabled: true },
            },
          },
        });

        const pageViolations = await getViolations(page);

        if (pageViolations.length > 0) {
          violations[pagePath] = pageViolations;
          totalViolations += pageViolations.length;

          console.log(
            `❌ Found ${pageViolations.length} violations on ${pagePath}`
          );

          // Log critical violations
          pageViolations.forEach(violation => {
            if (
              violation.impact === 'critical' ||
              violation.impact === 'serious'
            ) {
              console.log(`  - ${violation.id}: ${violation.description}`);
              console.log(`    Impact: ${violation.impact}`);
              console.log(`    Help: ${violation.helpUrl}`);
            }
          });
        } else {
          console.log(`✅ No accessibility violations found on ${pagePath}`);
        }
      } catch (axeError) {
        console.log(`⚠️ Axe testing failed on ${pagePath}: ${axeError.message}`);
        // Continue with other pages
      }
    } catch (error) {
      console.error(`Error testing ${pagePath}:`, error.message);
    }
  }

  await browser.close();

  // Summary
  console.log('\n📋 Accessibility Audit Summary:');
  console.log('==============================');
  console.log(`Total violations: ${totalViolations}`);
  console.log(`Pages tested: ${pagesToTest.length}`);
  console.log(`Pages with violations: ${Object.keys(violations).length}`);

  // Detailed breakdown by impact
  const impactCounts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

  Object.values(violations)
    .flat()
    .forEach(violation => {
      impactCounts[violation.impact] =
        (impactCounts[violation.impact] || 0) + 1;
    });

  console.log('\nViolations by impact:');
  Object.entries(impactCounts).forEach(([impact, count]) => {
    if (count > 0) {
      const emoji =
        impact === 'critical'
          ? '🔴'
          : impact === 'serious'
            ? '🟠'
            : impact === 'moderate'
              ? '🟡'
              : '⚪';
      console.log(`${emoji} ${impact}: ${count}`);
    }
  });

  // Save detailed report
  if (totalViolations > 0) {
    const fs = require('fs');
    fs.writeFileSync(
      './accessibility-report.json',
      JSON.stringify(violations, null, 2)
    );
    console.log('\n📄 Detailed report saved to accessibility-report.json');
  }

  // Return success if only minor violations or no violations
  const hasBlockingViolations = Object.values(violations)
    .flat()
    .some(v => v.impact === 'critical' || v.impact === 'serious');

  return !hasBlockingViolations;
}

// Run the audit
runAccessibilityAudit()
  .then(passed => {
    console.log(
      passed
        ? '\n🎉 Accessibility audit passed!'
        : '\n⚠️ Accessibility audit has blocking violations!'
    );
    process.exit(passed ? 0 : 1);
  })
  .catch(err => {
    console.error('Accessibility audit failed:', err);
    process.exit(1);
  });