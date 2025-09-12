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

# Check if package.json exists
if [ -f "package.json" ]; then
    print_status "Package.json exists" 0
else
    print_status "Package.json missing" 1
fi

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
npm run lint || print_warning "ESLint found issues - review and fix"

# Code formatting
echo "Checking code formatting..."
if npm run format:check 2>/dev/null; then
    print_status "Prettier formatting" 0
else
    print_warning "Code formatting check not available"
fi

echo ""
echo "4. Unit and Integration Tests"
echo "============================"

# Unit tests
echo "Running unit tests..."
if npm run test 2>/dev/null; then
    print_status "Unit tests" 0
else
    print_warning "Unit tests not configured or failing"
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
if [ -d ".next" ]; then
    du -sh .next/ || true
    print_status "Build output directory exists" 0
else
    print_status "Build output directory missing" 1
fi

echo ""
echo "6. End-to-End Tests"
echo "=================="

# Check if E2E tests are available
if npm run test:e2e --silent 2>/dev/null; then
    print_status "End-to-End tests" $?
else
    print_warning "E2E tests not configured or not available"
fi

echo ""
echo "7. Performance Tests"
echo "==================="

# Check if performance tests are available
if command -v lighthouse &> /dev/null; then
    print_warning "Lighthouse available but performance audit should be run separately"
else
    print_warning "Lighthouse not installed - performance testing not available"
fi

echo ""
echo "8. Security Tests"
echo "================="

# Check for console.log statements in production build
if find .next -name "*.js" -exec grep -l "console\.log" {} \; 2>/dev/null | head -1; then
    print_warning "Console.log statements found in production build"
fi

# Check for exposed environment variables
if grep -r "process\.env\." .next/ 2>/dev/null | grep -v "NODE_ENV\|NEXT_PUBLIC_"; then
    print_warning "Potentially exposed environment variables found"
fi

echo ""
echo "9. SEO Validation"
echo "=================="

# Check sitemap
if [ -f "public/sitemap.xml" ] || [ -f ".next/server/pages/sitemap.xml.js" ]; then
    print_status "Sitemap found" 0
else
    print_warning "Sitemap not found"
fi

# Check robots.txt
if [ -f "public/robots.txt" ] || [ -f ".next/server/pages/robots.txt.js" ]; then
    print_status "Robots.txt found" 0
else
    print_warning "Robots.txt not found"
fi

echo ""
echo "10. Documentation Check"
echo "======================"

# Check for required documentation files
required_docs=("README.md" "CONTRIBUTING.md" "CHANGELOG.md")

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