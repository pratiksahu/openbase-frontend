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
    const coverageData = JSON.parse(
      fs.readFileSync('coverage/coverage-summary.json', 'utf8')
    );
    report.details.coverage = coverageData.total;
    report.summary.testCoverage = Math.round(coverageData.total.lines.pct);
  } catch (error) {
    console.log('No coverage data found');
    report.summary.testCoverage = 'N/A';
  }

  // 3. Dependencies analysis
  const depsAnalysis = await analyzeDependencies();
  report.details.dependencies = depsAnalysis;
  report.summary.totalDependencies =
    depsAnalysis.production + depsAnalysis.development;

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

  const walkDir = dir => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (
        stat.isDirectory() &&
        !file.startsWith('.') &&
        file !== 'node_modules' &&
        file !== '.next'
      ) {
        walkDir(filePath);
      } else if (stat.isFile()) {
        const ext = path.extname(file);

        if (
          ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.md'].includes(ext)
        ) {
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

  const analyzeFile = filePath => {
    if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) return;

    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Simple complexity analysis
      const functions =
        content.match(/function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>/g) || [];
      const conditionals =
        content.match(/if\s*\(|switch\s*\(|for\s*\(|while\s*\(/g) || [];
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

  const walkDir = dir => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath);
      } else if (stat.isFile()) {
        analyzeFile(filePath);
      }
    });
  };

  walkDir('./src');

  return {
    averageComplexity:
      functionCount > 0 ? Math.round(totalComplexity / functionCount) : 0,
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

${
  report.details.coverage
    ? `
TEST COVERAGE
-------------
Lines: ${report.details.coverage.lines.pct}%
Statements: ${report.details.coverage.statements.pct}%
Functions: ${report.details.coverage.functions.pct}%
Branches: ${report.details.coverage.branches.pct}%
`
    : ''
}

${
  report.details.complexity.complexFiles.length > 0
    ? `
COMPLEX FILES (>20 complexity)
-------------------------------
${report.details.complexity.complexFiles
  .map(file => `${file.complexity}: ${file.path}`)
  .join('\n')}
`
    : ''
}

RECOMMENDATIONS
---------------
${generateRecommendations(report)}
`;

  fs.writeFileSync('./quality-report.txt', readable);
  console.log('\n' + readable);
}

function generateRecommendations(report) {
  const recommendations = [];

  if (
    report.summary.testCoverage < 80 &&
    typeof report.summary.testCoverage === 'number'
  ) {
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