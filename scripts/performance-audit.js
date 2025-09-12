const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

async function runPerformanceAudit() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: [
      'performance',
      'accessibility',
      'best-practices',
      'seo',
      'pwa',
    ],
    port: chrome.port,
  };

  console.log('🔍 Running Lighthouse performance audit...');

  try {
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
      const score = scores[category];
      if (score < threshold) {
        console.error(
          `❌ ${category} score (${score}) below threshold (${threshold})`
        );
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
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

// Run the audit
runPerformanceAudit()
  .then(passed => {
    console.log(
      passed
        ? '\n🎉 Performance audit passed!'
        : '\n⚠️ Performance audit failed!'
    );
    process.exit(passed ? 0 : 1);
  })
  .catch(err => {
    console.error('Performance audit failed:', err);
    process.exit(1);
  });