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
required_vars=("NEXT_PUBLIC_SITE_URL")
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
if [ -d ".next/static/chunks" ]; then
    js_size=$(find .next/static/chunks -name "*.js" -exec du -ch {} + | grep total | cut -f1)
    echo "JavaScript bundles: $js_size"
    
    # Check if bundles are reasonable size
    js_size_kb=$(du -sk .next/static/chunks | cut -f1)
    if [ "$js_size_kb" -lt 1000 ]; then
        print_status "JavaScript bundle size acceptable (<1MB)" 0
    else
        print_warning "JavaScript bundle size is large (>1MB): ${js_size_kb}KB"
    fi
fi

if [ -d ".next/static/css" ]; then
    css_size=$(find .next/static/css -name "*.css" -exec du -ch {} + 2>/dev/null | grep total | cut -f1 || echo "0")
    echo "CSS bundles: $css_size"
fi

# 4. Security Check
echo ""
echo "4. Security Verification"
echo "======================="

# Check for exposed secrets in build
if grep -r "sk_\|secret_\|key_" .next/ 2>/dev/null | grep -v "NEXT_PUBLIC_" | head -1; then
    print_warning "Potential secrets found in build output"
else
    print_status "No exposed secrets found in build" 0
fi

# 5. Asset Optimization Check
echo ""
echo "5. Asset Optimization"
echo "===================="

# Check for optimized images
if find public -name "*.jpg" -o -name "*.png" 2>/dev/null | head -1 > /dev/null; then
    print_status "Image assets found" 0

    # Check if images are optimized (basic check)
    large_images=$(find public -name "*.jpg" -o -name "*.png" -size +500k 2>/dev/null)
    if [ -n "$large_images" ]; then
        print_warning "Large images found (>500KB) - consider optimization:"
        echo "$large_images"
    else
        print_status "All images are reasonably sized" 0
    fi
else
    print_warning "No image assets found"
fi

# 6. SEO Readiness
echo ""
echo "6. SEO Readiness"
echo "==============="

# Check for sitemap
if [ -f "public/sitemap.xml" ] || find .next -name "*sitemap*" 2>/dev/null | head -1; then
    print_status "Sitemap configured" 0
else
    print_warning "Sitemap not found"
fi

# Check for robots.txt
if [ -f "public/robots.txt" ] || find .next -name "*robots*" 2>/dev/null | head -1; then
    print_status "Robots.txt configured" 0
else
    print_warning "Robots.txt not found"
fi

# 7. PWA Readiness (if applicable)
echo ""
echo "7. PWA Configuration"
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

# 8. Analytics Setup
echo ""
echo "8. Analytics Configuration"
echo "========================="

if [ -n "$NEXT_PUBLIC_GA_ID" ] || [ -n "$NEXT_PUBLIC_ANALYTICS_ID" ]; then
    print_status "Analytics configured" 0
else
    print_warning "Analytics not configured"
fi

# 9. Error Monitoring
echo ""
echo "9. Error Monitoring"
echo "==================="

if [ -n "$SENTRY_DSN" ] || [ -n "$NEXT_PUBLIC_SENTRY_DSN" ]; then
    print_status "Error monitoring configured" 0
else
    print_warning "Error monitoring not configured"
fi

echo ""
echo -e "${GREEN}🎉 Deployment readiness check completed!${NC}"
echo "Review any warnings above before deploying to production."