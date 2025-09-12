# TASK_019: Final Checklist

## Overview
Perform comprehensive final validation and quality assurance of the complete Next.js application before launch. This task involves running all tests, validating performance metrics, ensuring accessibility compliance, checking cross-browser compatibility, and performing final deployment verification.

## Objectives
- Execute comprehensive testing across all components and features
- Validate performance metrics and optimization
- Ensure WCAG accessibility compliance
- Verify cross-browser and cross-device compatibility
- Complete security audit and vulnerability assessment
- Validate SEO implementation and search engine readiness
- Perform final code quality and clean-up tasks
- Verify deployment configuration and production readiness
- Update all documentation and create launch checklist
- Prepare monitoring and post-launch procedures

## Implementation Steps

### 1. Create Comprehensive Test Suite

Create `scripts/final-tests.sh`:

```bash
#!/bin/bash

set -e

echo "🚀 Starting Final Quality Assurance Tests..."
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1 PASSED${NC}"
    else
        echo -e "${RED}❌ $1 FAILED${NC}"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "1. Environment Validation"
echo "========================"

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2)
required_version="18.0.0"
if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" = "$required_version" ]; then 
    print_status "Node.js version ($node_version)" 0
else
    print_status "Node.js version ($node_version - required: $required_version)" 1
fi

# Check environment variables
npm run env:check
print_status "Environment variables validation" $?

echo ""
echo "2. Dependency Security Audit"
echo "============================="

# Run security audit
npm audit --audit-level=moderate
print_status "Security audit" $?

# Check for outdated packages
npm outdated || print_warning "Some packages are outdated - consider updating"

echo ""
echo "3. Code Quality Checks"
echo "====================="

# TypeScript compilation
echo "Running TypeScript compilation..."
npm run type-check
print_status "TypeScript compilation" $?

# Linting
echo "Running ESLint..."
npm run lint
print_status "ESLint checks" $?

# Code formatting
echo "Checking code formatting..."
npm run format:check
print_status "Prettier formatting" $?

echo ""
echo "4. Unit and Integration Tests"
echo "============================"

# Unit tests with coverage
echo "Running unit tests..."
npm run test:ci
print_status "Unit tests" $?

# Check coverage thresholds
coverage_report=$(npm run test:coverage 2>&1 || true)
if echo "$coverage_report" | grep -q "Coverage threshold"; then
    print_warning "Coverage thresholds not met - review test coverage"
fi

echo ""
echo "5. Build Verification"
echo "==================="

# Clean previous builds
rm -rf .next

# Build for production
echo "Building for production..."
npm run build
print_status "Production build" $?

# Check bundle size
echo "Analyzing bundle size..."
du -sh .next/ || true

echo ""
echo "6. End-to-End Tests"
echo "=================="

# Start development server in background
echo "Starting development server..."
npm run dev > /tmp/dev-server.log 2>&1 &
DEV_PID=$!

# Wait for server to start
sleep 10

# Run Playwright tests
echo "Running E2E tests..."
npm run test:e2e
test_result=$?

# Stop development server
kill $DEV_PID || true

print_status "End-to-End tests" $test_result

echo ""
echo "7. Performance Tests"
echo "==================="

# Lighthouse CI (if configured)
if command -v lighthouse &> /dev/null; then
    echo "Running Lighthouse audit..."
    npm run lighthouse || print_warning "Lighthouse audit failed or not configured"
fi

echo ""
echo "8. Accessibility Tests"
echo "====================="

# Run accessibility tests
if npm run test:a11y 2>/dev/null; then
    print_status "Accessibility tests" $?
else
    print_warning "Accessibility tests not configured"
fi

echo ""
echo "9. Security Tests"
echo "================="

# Check for common security issues
echo "Checking for security issues..."

# Check for console.log statements in production build
if find .next -name "*.js" -exec grep -l "console\.log" {} \; 2>/dev/null | head -1; then
    print_warning "Console.log statements found in production build"
fi

# Check for exposed environment variables
if grep -r "process\.env\." .next/ 2>/dev/null | grep -v "NODE_ENV\|NEXT_PUBLIC_"; then
    print_warning "Potentially exposed environment variables found"
fi

echo ""
echo "10. SEO Validation"
echo "=================="

# Check sitemap
if curl -f -s http://localhost:3000/sitemap.xml > /dev/null; then
    print_status "Sitemap accessibility" 0
else
    print_warning "Sitemap not accessible"
fi

# Check robots.txt
if curl -f -s http://localhost:3000/robots.txt > /dev/null; then
    print_status "Robots.txt accessibility" 0
else
    print_warning "Robots.txt not accessible"
fi

echo ""
echo "11. API Health Checks"
echo "===================="

# Test API health endpoint
if curl -f -s http://localhost:3000/api/health > /dev/null; then
    print_status "API health endpoint" 0
else
    print_warning "API health endpoint not accessible"
fi

echo ""
echo "12. Documentation Check"
echo "======================"

# Check for required documentation files
required_docs=("README.md" "CONTRIBUTING.md" "CODE_OF_CONDUCT.md" "CHANGELOG.md")

for doc in "${required_docs[@]}"; do
    if [ -f "$doc" ]; then
        print_status "$doc exists" 0
    else
        print_warning "$doc not found"
    fi
done

echo ""
echo -e "${GREEN}🎉 Final Quality Assurance Complete!${NC}"
echo "=================================="
```

### 2. Create Performance Audit Script

Create `scripts/performance-audit.js`:

```javascript
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

async function runPerformanceAudit() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
    port: chrome.port,
  };
  
  console.log('🔍 Running Lighthouse performance audit...');
  
  const runnerResult = await lighthouse('http://localhost:3000', options);
  
  await chrome.kill();
  
  // Extract scores
  const lhr = runnerResult.lhr;
  const scores = {
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    pwa: Math.round(lhr.categories.pwa.score * 100),
  };
  
  console.log('\n📊 Lighthouse Scores:');
  console.log('===================');
  console.log(`Performance: ${scores.performance}/100`);
  console.log(`Accessibility: ${scores.accessibility}/100`);
  console.log(`Best Practices: ${scores.bestPractices}/100`);
  console.log(`SEO: ${scores.seo}/100`);
  console.log(`PWA: ${scores.pwa}/100`);
  
  // Check thresholds
  const thresholds = {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 95,
    pwa: 80,
  };
  
  let allPassed = true;
  
  Object.entries(thresholds).forEach(([category, threshold]) => {
    const score = scores[category] || scores[category.replace(/([A-Z])/g, '-$1').toLowerCase()];
    if (score < threshold) {
      console.error(`❌ ${category} score (${score}) below threshold (${threshold})`);
      allPassed = false;
    } else {
      console.log(`✅ ${category} score meets threshold`);
    }
  });
  
  // Save detailed report
  const reportHtml = runnerResult.report;
  fs.writeFileSync('./lighthouse-report.html', reportHtml);
  console.log('\n📋 Detailed report saved to lighthouse-report.html');
  
  // Core Web Vitals
  const audits = lhr.audits;
  console.log('\n⚡ Core Web Vitals:');
  console.log('==================');
  
  if (audits['largest-contentful-paint']) {
    const lcp = audits['largest-contentful-paint'].displayValue;
    console.log(`LCP: ${lcp}`);
  }
  
  if (audits['first-input-delay']) {
    const fid = audits['first-input-delay'].displayValue || 'N/A';
    console.log(`FID: ${fid}`);
  }
  
  if (audits['cumulative-layout-shift']) {
    const cls = audits['cumulative-layout-shift'].displayValue;
    console.log(`CLS: ${cls}`);
  }
  
  return allPassed;
}

// Run the audit
runPerformanceAudit()
  .then(passed => {
    console.log(passed ? '\n🎉 Performance audit passed!' : '\n⚠️ Performance audit failed!');
    process.exit(passed ? 0 : 1);
  })
  .catch(err => {
    console.error('Performance audit failed:', err);
    process.exit(1);
  });
```

### 3. Create Accessibility Audit

Create `scripts/accessibility-audit.js`:

```javascript
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
      
      await page.goto(`http://localhost:3000${pagePath}`);
      await page.waitForLoadState('networkidle');
      
      // Inject axe
      await injectAxe(page);
      
      // Run accessibility check
      const results = await checkA11y(page, null, {
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
          }
        }
      });
      
      const pageViolations = await getViolations(page);
      
      if (pageViolations.length > 0) {
        violations[pagePath] = pageViolations;
        totalViolations += pageViolations.length;
        
        console.log(`❌ Found ${pageViolations.length} violations on ${pagePath}`);
        
        // Log critical violations
        pageViolations.forEach(violation => {
          if (violation.impact === 'critical' || violation.impact === 'serious') {
            console.log(`  - ${violation.id}: ${violation.description}`);
            console.log(`    Impact: ${violation.impact}`);
            console.log(`    Help: ${violation.helpUrl}`);
          }
        });
      } else {
        console.log(`✅ No accessibility violations found on ${pagePath}`);
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
  
  Object.values(violations).flat().forEach(violation => {
    impactCounts[violation.impact] = (impactCounts[violation.impact] || 0) + 1;
  });
  
  console.log('\nViolations by impact:');
  Object.entries(impactCounts).forEach(([impact, count]) => {
    if (count > 0) {
      const emoji = impact === 'critical' ? '🔴' : impact === 'serious' ? '🟠' : impact === 'moderate' ? '🟡' : '⚪';
      console.log(`${emoji} ${impact}: ${count}`);
    }
  });
  
  // Save detailed report
  if (totalViolations > 0) {
    const fs = require('fs');
    fs.writeFileSync('./accessibility-report.json', JSON.stringify(violations, null, 2));
    console.log('\n📄 Detailed report saved to accessibility-report.json');
  }
  
  // Return success if only minor violations or no violations
  const hasBlockingViolations = Object.values(violations).flat()
    .some(v => v.impact === 'critical' || v.impact === 'serious');
  
  return !hasBlockingViolations;
}

// Run the audit
runAccessibilityAudit()
  .then(passed => {
    console.log(passed ? '\n🎉 Accessibility audit passed!' : '\n⚠️ Accessibility audit has blocking violations!');
    process.exit(passed ? 0 : 1);
  })
  .catch(err => {
    console.error('Accessibility audit failed:', err);
    process.exit(1);
  });
```

### 4. Create Cross-Browser Testing Script

Create `scripts/cross-browser-test.js`:

```javascript
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
      const pagesToTest = [
        '/',
        '/features',
        '/contact',
        '/dashboard',
      ];
      
      const pageResults = {};
      
      for (const pagePath of pagesToTest) {
        try {
          await page.goto(`http://localhost:3000${pagePath}`, { 
            waitUntil: 'networkidle',
            timeout: 30000 
          });
          
          // Basic functionality tests
          const tests = {
            pageLoads: true,
            titlePresent: await page.title() !== '',
            bodyVisible: await page.locator('body').isVisible(),
            navigationPresent: await page.locator('nav, [role="navigation"]').count() > 0,
            consoleErrors: consoleErrors.length === 0,
            jsErrors: jsErrors.length === 0,
          };
          
          // Test specific functionality based on page
          if (pagePath === '/') {
            tests.heroSection = await page.locator('[data-testid="hero-section"]').isVisible();
            tests.ctaButton = await page.locator('[data-testid="cta-button"]').isVisible();
          }
          
          if (pagePath === '/contact') {
            tests.contactForm = await page.locator('form[data-testid="contact-form"]').isVisible();
            tests.formInputs = await page.locator('input[name="email"]').isVisible();
          }
          
          if (pagePath === '/dashboard') {
            tests.dashboardLayout = await page.locator('[data-testid="dashboard"]').isVisible();
            tests.sidebar = await page.locator('[data-testid="dashboard-sidebar"]').isVisible();
          }
          
          pageResults[pagePath] = tests;
          
          const passedTests = Object.values(tests).filter(Boolean).length;
          const totalTests = Object.keys(tests).length;
          
          console.log(`  ${pagePath}: ${passedTests}/${totalTests} tests passed`);
          
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
    const successfulPages = Object.values(results).filter(page => 
      !page.error && Object.values(page).every(test => test === true)
    ).length;
    
    console.log(`${successfulPages === pageCount ? '✅' : '⚠️'} ${browser}: ${successfulPages}/${pageCount} pages passed all tests`);
    
    if (successfulPages !== pageCount) {
      overallSuccess = false;
    }
  });
  
  // Save detailed results
  const fs = require('fs');
  fs.writeFileSync('./cross-browser-results.json', JSON.stringify(testResults, null, 2));
  console.log('\n📄 Detailed results saved to cross-browser-results.json');
  
  return overallSuccess;
}

// Run tests
runCrossBrowserTests()
  .then(success => {
    console.log(success ? '\n🎉 Cross-browser tests passed!' : '\n⚠️ Cross-browser tests have issues!');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Cross-browser tests failed:', err);
    process.exit(1);
  });
```

### 5. Create Final Deployment Check

Create `scripts/deployment-check.sh`:

```bash
#!/bin/bash

set -e

echo "🚀 Deployment Readiness Check"
echo "============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Environment Check
echo ""
echo "1. Production Environment Check"
echo "=============================="

# Check if production environment variables are set
if [ -f ".env.production.local" ]; then
    print_status "Production environment file exists" 0
else
    print_warning "No .env.production.local file found"
fi

# Check critical environment variables
required_vars=("NEXT_PUBLIC_SITE_URL" "NODE_ENV")
for var in "${required_vars[@]}"; do
    if [ -n "${!var}" ]; then
        print_status "$var is set" 0
    else
        print_warning "$var not set in environment"
    fi
done

# 2. Build Verification  
echo ""
echo "2. Production Build Verification"
echo "==============================="

# Clean build
rm -rf .next
echo "Cleaned previous build"

# Build for production
NODE_ENV=production npm run build
print_status "Production build completed" $?

# Check build output
if [ -d ".next/static" ]; then
    print_status "Static assets generated" 0
else
    print_status "Static assets missing" 1
fi

if [ -f ".next/BUILD_ID" ]; then
    build_id=$(cat .next/BUILD_ID)
    echo "Build ID: $build_id"
    print_status "Build ID generated" 0
else
    print_status "Build ID missing" 1
fi

# 3. Bundle Analysis
echo ""
echo "3. Bundle Size Analysis"
echo "======================"

# Calculate bundle sizes
js_size=$(find .next/static/chunks -name "*.js" -exec du -ch {} + | grep total | cut -f1)
css_size=$(find .next/static/css -name "*.css" -exec du -ch {} + 2>/dev/null | grep total | cut -f1 || echo "0")

echo "JavaScript bundles: $js_size"
echo "CSS bundles: $css_size"

# Check if bundles are reasonable size (adjust thresholds as needed)
js_size_kb=$(du -sk .next/static/chunks | cut -f1)
if [ "$js_size_kb" -lt 1000 ]; then
    print_status "JavaScript bundle size acceptable (<1MB)" 0
else
    print_warning "JavaScript bundle size is large (>1MB): ${js_size_kb}KB"
fi

# 4. Security Check
echo ""
echo "4. Security Verification"
echo "======================="

# Check for exposed secrets in build
if grep -r "sk_\|secret_\|key_" .next/ 2>/dev/null | grep -v "NEXT_PUBLIC_"; then
    print_warning "Potential secrets found in build output"
else
    print_status "No exposed secrets found in build" 0
fi

# Check for console statements
if find .next -name "*.js" -exec grep -l "console\." {} \; 2>/dev/null | head -1; then
    print_warning "Console statements found in production build"
else
    print_status "No console statements in production build" 0
fi

# 5. Performance Check
echo ""
echo "5. Performance Validation"
echo "========================"

# Start production server
PORT=3001 npm start &
SERVER_PID=$!
sleep 5

# Basic performance test
if command -v curl &> /dev/null; then
    response_time=$(curl -o /dev/null -s -w "%{time_total}" http://localhost:3001/)
    if (( $(echo "$response_time < 2.0" | bc -l) )); then
        print_status "Response time acceptable (<2s): ${response_time}s" 0
    else
        print_warning "Response time slow (>2s): ${response_time}s"
    fi
fi

# Stop server
kill $SERVER_PID || true

# 6. Asset Optimization Check
echo ""
echo "6. Asset Optimization"
echo "===================="

# Check for optimized images
if find public -name "*.jpg" -o -name "*.png" | head -1 > /dev/null; then
    print_status "Image assets found" 0
    
    # Check if images are optimized (basic check)
    large_images=$(find public -name "*.jpg" -o -name "*.png" -size +500k)
    if [ -n "$large_images" ]; then
        print_warning "Large images found (>500KB) - consider optimization:"
        echo "$large_images"
    else
        print_status "All images are reasonably sized" 0
    fi
else
    print_warning "No image assets found"
fi

# 7. SEO Readiness
echo ""
echo "7. SEO Readiness"
echo "==============="

# Check for sitemap
if [ -f "public/sitemap.xml" ] || grep -q "sitemap" .next/server/pages/sitemap.xml.js 2>/dev/null; then
    print_status "Sitemap configured" 0
else
    print_warning "Sitemap not found"
fi

# Check for robots.txt
if [ -f "public/robots.txt" ] || grep -q "robots" .next/server/pages/robots.txt.js 2>/dev/null; then
    print_status "Robots.txt configured" 0
else
    print_warning "Robots.txt not found"
fi

# 8. PWA Readiness (if applicable)
echo ""
echo "8. PWA Configuration"
echo "==================="

if [ -f "public/manifest.json" ]; then
    print_status "PWA manifest found" 0
    
    # Check service worker
    if [ -f "public/sw.js" ]; then
        print_status "Service worker found" 0
    else
        print_warning "Service worker not found"
    fi
else
    print_warning "PWA manifest not found"
fi

# 9. Analytics Setup
echo ""
echo "9. Analytics Configuration"
echo "========================="

if [ -n "$NEXT_PUBLIC_GA_ID" ] || [ -n "$NEXT_PUBLIC_ANALYTICS_ID" ]; then
    print_status "Analytics configured" 0
else
    print_warning "Analytics not configured"
fi

# 10. Error Monitoring
echo ""
echo "10. Error Monitoring"
echo "==================="

if [ -n "$SENTRY_DSN" ] || [ -n "$NEXT_PUBLIC_SENTRY_DSN" ]; then
    print_status "Error monitoring configured" 0
else
    print_warning "Error monitoring not configured"
fi

echo ""
echo -e "${GREEN}🎉 Deployment readiness check completed!${NC}"
echo "Review any warnings above before deploying to production."
```

### 6. Create Code Quality Report

Create `scripts/quality-report.js`:

```javascript
const fs = require('fs');
const path = require('path');

async function generateQualityReport() {
  console.log('📊 Generating code quality report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {},
    details: {},
  };
  
  // 1. File statistics
  const fileStats = await getFileStatistics();
  report.details.fileStats = fileStats;
  report.summary.totalFiles = fileStats.totalFiles;
  report.summary.linesOfCode = fileStats.totalLines;
  
  // 2. Test coverage (if available)
  try {
    const coverageData = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
    report.details.coverage = coverageData.total;
    report.summary.testCoverage = Math.round(coverageData.total.lines.pct);
  } catch (error) {
    console.log('No coverage data found');
    report.summary.testCoverage = 'N/A';
  }
  
  // 3. Dependencies analysis
  const depsAnalysis = await analyzeDependencies();
  report.details.dependencies = depsAnalysis;
  report.summary.totalDependencies = depsAnalysis.production + depsAnalysis.development;
  
  // 4. Bundle analysis (if build exists)
  try {
    const bundleStats = await analyzeBundleSize();
    report.details.bundleSize = bundleStats;
    report.summary.bundleSize = bundleStats.totalSize;
  } catch (error) {
    console.log('No build found for bundle analysis');
  }
  
  // 5. Code complexity (basic analysis)
  const complexityStats = await analyzeComplexity();
  report.details.complexity = complexityStats;
  report.summary.avgComplexity = complexityStats.averageComplexity;
  
  // Generate report
  const reportPath = './quality-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Generate human-readable summary
  generateReadableReport(report);
  
  console.log(`📋 Quality report saved to ${reportPath}`);
  return report;
}

async function getFileStatistics() {
  const stats = {
    totalFiles: 0,
    totalLines: 0,
    fileTypes: {},
    largestFiles: [],
  };
  
  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath);
      } else if (stat.isFile()) {
        const ext = path.extname(file);
        
        if (['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.md'].includes(ext)) {
          stats.totalFiles++;
          
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n').length;
          stats.totalLines += lines;
          
          // Track file types
          stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;
          
          // Track largest files
          stats.largestFiles.push({ path: filePath, lines });
        }
      }
    });
  };
  
  walkDir('./src');
  
  // Sort largest files
  stats.largestFiles.sort((a, b) => b.lines - a.lines);
  stats.largestFiles = stats.largestFiles.slice(0, 10);
  
  return stats;
}

async function analyzeDependencies() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  return {
    production: Object.keys(packageJson.dependencies || {}).length,
    development: Object.keys(packageJson.devDependencies || {}).length,
    total: Object.keys({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }).length,
  };
}

async function analyzeBundleSize() {
  if (!fs.existsSync('.next')) {
    throw new Error('No build found');
  }
  
  const stats = {
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    chunks: [],
  };
  
  // Analyze JS chunks
  const chunksDir = '.next/static/chunks';
  if (fs.existsSync(chunksDir)) {
    const chunks = fs.readdirSync(chunksDir);
    
    chunks.forEach(chunk => {
      if (chunk.endsWith('.js')) {
        const chunkPath = path.join(chunksDir, chunk);
        const size = fs.statSync(chunkPath).size;
        
        stats.jsSize += size;
        stats.chunks.push({ name: chunk, size, type: 'js' });
      }
    });
  }
  
  // Analyze CSS
  const cssDir = '.next/static/css';
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir);
    
    cssFiles.forEach(cssFile => {
      const cssPath = path.join(cssDir, cssFile);
      const size = fs.statSync(cssPath).size;
      
      stats.cssSize += size;
      stats.chunks.push({ name: cssFile, size, type: 'css' });
    });
  }
  
  stats.totalSize = stats.jsSize + stats.cssSize;
  
  // Sort chunks by size
  stats.chunks.sort((a, b) => b.size - a.size);
  
  return stats;
}

async function analyzeComplexity() {
  let totalComplexity = 0;
  let functionCount = 0;
  const complexFiles = [];
  
  const analyzeFile = (filePath) => {
    if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Simple complexity analysis
      const functions = content.match(/function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>/g) || [];
      const conditionals = content.match(/if\s*\(|switch\s*\(|for\s*\(|while\s*\(/g) || [];
      const complexity = functions.length + conditionals.length;
      
      if (complexity > 20) {
        complexFiles.push({ path: filePath, complexity });
      }
      
      totalComplexity += complexity;
      functionCount += functions.length;
      
    } catch (error) {
      // Skip files that can't be read
    }
  };
  
  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        walkDir(filePath);
      } else if (stat.isFile()) {
        analyzeFile(filePath);
      }
    });
  };
  
  walkDir('./src');
  
  return {
    averageComplexity: functionCount > 0 ? Math.round(totalComplexity / functionCount) : 0,
    totalComplexity,
    functionCount,
    complexFiles: complexFiles.slice(0, 5),
  };
}

function generateReadableReport(report) {
  const readable = `
CODE QUALITY REPORT
==================
Generated: ${new Date(report.timestamp).toLocaleString()}

SUMMARY
-------
📁 Total Files: ${report.summary.totalFiles}
📝 Lines of Code: ${report.summary.linesOfCode.toLocaleString()}
📦 Dependencies: ${report.summary.totalDependencies}
🧪 Test Coverage: ${report.summary.testCoverage}${typeof report.summary.testCoverage === 'number' ? '%' : ''}
📊 Bundle Size: ${report.summary.bundleSize ? Math.round(report.summary.bundleSize / 1024) + ' KB' : 'N/A'}
🔄 Avg Complexity: ${report.summary.avgComplexity}

FILE BREAKDOWN
--------------
${Object.entries(report.details.fileStats.fileTypes)
  .map(([ext, count]) => `${ext}: ${count} files`)
  .join('\n')}

LARGEST FILES
-------------
${report.details.fileStats.largestFiles
  .slice(0, 5)
  .map(file => `${file.lines} lines: ${file.path}`)
  .join('\n')}

${report.details.coverage ? `
TEST COVERAGE
-------------
Lines: ${report.details.coverage.lines.pct}%
Statements: ${report.details.coverage.statements.pct}%
Functions: ${report.details.coverage.functions.pct}%
Branches: ${report.details.coverage.branches.pct}%
` : ''}

${report.details.complexity.complexFiles.length > 0 ? `
COMPLEX FILES (>20 complexity)
-------------------------------
${report.details.complexity.complexFiles
  .map(file => `${file.complexity}: ${file.path}`)
  .join('\n')}
` : ''}

RECOMMENDATIONS
---------------
${generateRecommendations(report)}
`;
  
  fs.writeFileSync('./quality-report.txt', readable);
  console.log('\n' + readable);
}

function generateRecommendations(report) {
  const recommendations = [];
  
  if (report.summary.testCoverage < 80 && typeof report.summary.testCoverage === 'number') {
    recommendations.push('• Increase test coverage to at least 80%');
  }
  
  if (report.summary.bundleSize > 500 * 1024) {
    recommendations.push('• Consider code splitting to reduce bundle size');
  }
  
  if (report.details.complexity.complexFiles.length > 0) {
    recommendations.push('• Refactor complex files to improve maintainability');
  }
  
  if (report.summary.totalDependencies > 100) {
    recommendations.push('• Review dependencies and remove unused packages');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('• Code quality looks good! 🎉');
  }
  
  return recommendations.join('\n');
}

// Run the report
generateQualityReport()
  .then(() => {
    console.log('✅ Quality report generated successfully');
  })
  .catch(err => {
    console.error('❌ Failed to generate quality report:', err);
    process.exit(1);
  });
```

### 7. Create Final Launch Checklist

Create `LAUNCH_CHECKLIST.md`:

```markdown
# 🚀 Launch Checklist

Use this checklist to ensure everything is ready for production deployment.

## Pre-Launch Validation

### 🧪 Testing
- [ ] All unit tests passing (`npm run test:ci`)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] Cross-browser testing completed
- [ ] Mobile device testing completed
- [ ] Performance tests meet thresholds (Lighthouse score >90)
- [ ] Accessibility audit passed (WCAG compliance)
- [ ] Security audit completed
- [ ] Load testing performed (if applicable)

### 🔧 Code Quality
- [ ] TypeScript compilation successful (`npm run type-check`)
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] Code formatting consistent (`npm run format:check`)
- [ ] Test coverage meets requirements (>80%)
- [ ] No console.log statements in production build
- [ ] No exposed secrets or API keys
- [ ] Code complexity within acceptable limits

### 🏗️ Build & Deployment
- [ ] Production build successful (`npm run build`)
- [ ] Bundle size optimized (<500KB JS, <50KB CSS)
- [ ] Static assets properly optimized
- [ ] Image optimization enabled
- [ ] Service worker configured (if PWA)
- [ ] Environment variables configured for production
- [ ] Database migrations completed (if applicable)
- [ ] CDN configuration verified

### 🔒 Security
- [ ] HTTPS enabled and configured
- [ ] Security headers implemented
- [ ] Content Security Policy configured
- [ ] Rate limiting enabled
- [ ] Input sanitization active
- [ ] Authentication security measures active
- [ ] Environment variables secured
- [ ] Security monitoring enabled

### 📊 Performance
- [ ] Core Web Vitals optimized (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] Images lazy loaded and optimized
- [ ] Code splitting implemented
- [ ] Caching strategies configured
- [ ] API response times acceptable (<200ms)
- [ ] Database queries optimized (if applicable)

### 🔍 SEO & Analytics
- [ ] Meta tags configured for all pages
- [ ] Open Graph tags implemented
- [ ] Sitemap.xml accessible
- [ ] Robots.txt configured
- [ ] Structured data implemented
- [ ] Analytics tracking active
- [ ] Error monitoring configured (Sentry, etc.)
- [ ] Search console verification

### ♿ Accessibility
- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard navigation functional
- [ ] Screen reader compatibility tested
- [ ] Color contrast ratios meet standards
- [ ] Focus management implemented
- [ ] Alt text for all images
- [ ] Semantic HTML structure

### 📱 Progressive Web App (if applicable)
- [ ] Web manifest configured
- [ ] Service worker registered
- [ ] Offline functionality tested
- [ ] Install prompt working
- [ ] Push notifications configured (if used)
- [ ] App icons for all platforms

### 🌐 Cross-Platform Compatibility
- [ ] Chrome/Chromium tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] Edge tested
- [ ] Mobile Safari tested
- [ ] Mobile Chrome tested
- [ ] Internet Explorer 11 (if required)

### 📚 Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Component documentation (Storybook)
- [ ] Deployment instructions current
- [ ] Contributing guidelines updated
- [ ] Changelog updated
- [ ] User documentation complete

### 🔄 Monitoring & Maintenance
- [ ] Health check endpoint functional
- [ ] Uptime monitoring configured
- [ ] Error tracking active
- [ ] Performance monitoring enabled
- [ ] Log aggregation configured
- [ ] Backup procedures documented
- [ ] Incident response plan ready

### 📋 Business Requirements
- [ ] All acceptance criteria met
- [ ] Stakeholder approval received
- [ ] User acceptance testing completed
- [ ] Content review completed
- [ ] Legal compliance verified
- [ ] Privacy policy updated
- [ ] Terms of service current

## Deployment Steps

### 1. Pre-Deployment
- [ ] Create deployment branch
- [ ] Final code review completed
- [ ] All tests passing in CI/CD
- [ ] Staging environment validated
- [ ] Database backup completed
- [ ] Rollback plan documented

### 2. Production Deployment
- [ ] DNS configuration ready
- [ ] SSL certificates installed
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Static assets deployed to CDN
- [ ] Cache invalidation completed
- [ ] Health checks passing

### 3. Post-Deployment
- [ ] Smoke tests completed
- [ ] User flows validated
- [ ] Analytics tracking verified
- [ ] Error monitoring active
- [ ] Performance metrics baseline established
- [ ] Team notified of successful deployment

## Emergency Procedures

### Rollback Plan
- [ ] Rollback procedure documented
- [ ] Database rollback plan ready
- [ ] DNS rollback configured
- [ ] Team contact information current
- [ ] Incident communication plan ready

### Monitoring Setup
- [ ] Alert thresholds configured
- [ ] On-call schedule established
- [ ] Escalation procedures documented
- [ ] Status page configured (if applicable)

## Sign-Off

### Technical Lead
- [ ] Code quality approved
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Technical documentation complete

**Signature:** _________________ **Date:** _________

### Product Owner
- [ ] Business requirements satisfied
- [ ] User acceptance criteria met
- [ ] Content and design approved
- [ ] Launch strategy confirmed

**Signature:** _________________ **Date:** _________

### DevOps/Infrastructure
- [ ] Deployment pipeline tested
- [ ] Monitoring configured
- [ ] Scaling plan documented
- [ ] Backup procedures verified

**Signature:** _________________ **Date:** _________

---

## Final Validation

Run the comprehensive test suite:

```bash
# Run all quality checks
npm run final-tests

# Performance audit
npm run performance-audit

# Accessibility audit
npm run accessibility-audit

# Cross-browser tests
npm run cross-browser-test

# Deployment readiness check
npm run deployment-check
```

**All checks passing:** ✅

**Launch approved by:** _________________ **Date:** _________

🎉 **Ready for Production Launch!**
```

### 8. Update Package.json Scripts

Add final testing scripts to `package.json`:

```json
{
  "scripts": {
    "final-tests": "./scripts/final-tests.sh",
    "performance-audit": "node scripts/performance-audit.js",
    "accessibility-audit": "node scripts/accessibility-audit.js", 
    "cross-browser-test": "node scripts/cross-browser-test.js",
    "deployment-check": "./scripts/deployment-check.sh",
    "quality-report": "node scripts/quality-report.js",
    "pre-launch": "npm run final-tests && npm run performance-audit && npm run accessibility-audit",
    "launch-ready": "npm run pre-launch && npm run deployment-check"
  }
}
```

## Acceptance Criteria

- [ ] All automated tests pass consistently
- [ ] Performance metrics meet or exceed targets (Lighthouse >90)
- [ ] Accessibility compliance verified (WCAG 2.1 AA)
- [ ] Cross-browser compatibility confirmed
- [ ] Security audit completed with no critical issues
- [ ] Bundle size optimized and within limits
- [ ] All documentation updated and accurate
- [ ] Deployment process tested and verified
- [ ] Monitoring and error tracking functional
- [ ] Final launch checklist completed and signed off

## Testing Instructions

### 1. Run Comprehensive Test Suite
```bash
npm run final-tests
```

### 2. Performance Validation  
```bash
npm run performance-audit
# Review lighthouse-report.html
# Check Core Web Vitals metrics
```

### 3. Accessibility Testing
```bash
npm run accessibility-audit  
# Review accessibility-report.json
# Test with screen readers
```

### 4. Cross-Browser Testing
```bash
npm run cross-browser-test
# Review cross-browser-results.json
# Manual testing on target browsers
```

### 5. Deployment Readiness
```bash
npm run deployment-check
# Review all warnings and errors
# Verify production configuration
```

### 6. Quality Assessment
```bash
npm run quality-report
# Review quality-report.txt
# Address any recommendations
```

### 7. Complete Launch Checklist
```bash
# Work through LAUNCH_CHECKLIST.md systematically
# Get required sign-offs
# Document any exceptions
```

## References and Dependencies

### Dependencies
- `lighthouse`: Performance auditing
- `axe-playwright`: Accessibility testing
- `playwright`: Cross-browser testing
- All previously established testing tools

### Documentation
- [Web Vitals](https://web.dev/vitals/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

## Estimated Time
**8-10 hours**

- Test script development: 3-4 hours
- Comprehensive testing execution: 3-4 hours
- Documentation and checklist completion: 2-3 hours
- Final validation and sign-off: 1-2 hours

## Troubleshooting

### Common Issues

1. **Test failures in different environments**
   - Verify environment configurations match
   - Check for timing-dependent test failures
   - Update test expectations for environment differences

2. **Performance metrics below targets**
   - Review bundle analysis for optimization opportunities
   - Check image optimization and lazy loading
   - Verify caching strategies are effective

3. **Accessibility violations**
   - Use automated tools as starting point
   - Conduct manual testing with screen readers
   - Review semantic HTML and ARIA implementation

4. **Cross-browser compatibility issues**
   - Test with actual devices and browsers
   - Review polyfill requirements
   - Check for vendor-specific CSS issues

5. **Deployment readiness failures**
   - Review environment variable configuration
   - Check build optimization settings
   - Verify security configurations are complete

---

**🎉 Congratulations! You've completed the comprehensive Next.js application setup with all 19 tasks. The application is now ready for production deployment with enterprise-grade features, security, performance, and maintainability.**