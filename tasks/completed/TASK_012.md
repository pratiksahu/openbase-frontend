# TASK_012: Performance Optimization

## Overview

Implement comprehensive performance optimization techniques for the Next.js application, focusing on image optimization, code splitting, SEO enhancements, and monitoring. This task ensures the application loads quickly, ranks well in search engines, and provides an excellent user experience.

## Objectives

- Configure Next.js Image optimization for responsive and lazy-loaded images
- Implement dynamic imports for code splitting and reduced bundle sizes
- Create comprehensive SEO component with meta tags and Open Graph support
- Set up sitemap generation and robots.txt configuration
- Implement performance monitoring and analytics
- Optimize Core Web Vitals and Lighthouse scores
- Establish performance budgets and monitoring

## Implementation Steps

### 1. Configure Next.js Image Optimization

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [], // Add your image domains here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle analyzer (optional)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),
};

module.exports = nextConfig;
```

### 2. Create Optimized Image Component

Create `src/components/ui/OptimizedImage.tsx`:

```tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto';
  containerClassName?: string;
}

const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  showSkeleton = true,
  aspectRatio = 'auto',
  containerClassName,
  className,
  ...props
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClasses = {
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    auto: '',
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
        containerClassName
      )}
    >
      {/* Loading skeleton */}
      {isLoading && showSkeleton && (
        <div className="bg-muted absolute inset-0 animate-pulse" />
      )}

      {/* Image */}
      <Image
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'grayscale filter',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Error state overlay */}
      {hasError && (
        <div className="bg-muted absolute inset-0 flex items-center justify-center">
          <span className="text-muted-foreground text-xs">
            Failed to load image
          </span>
        </div>
      )}
    </div>
  );
};

export { OptimizedImage };
```

### 3. Implement Dynamic Imports for Code Splitting

Create `src/components/dynamic/DynamicComponents.tsx`:

```tsx
import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
  </div>
);

// Dynamically imported components for code splitting
export const DynamicChart = dynamic(
  () => import('@/components/charts/Chart').then(mod => mod.Chart),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Disable SSR for client-side only components
  }
);

export const DynamicDataTable = dynamic(
  () => import('@/components/tables/DataTable').then(mod => mod.DataTable),
  {
    loading: () => <LoadingSpinner />,
  }
);

export const DynamicModal = dynamic(
  () => import('@/components/ui/Modal').then(mod => mod.Modal),
  {
    loading: () => (
      <div className="bg-background/80 fixed inset-0 backdrop-blur-sm" />
    ),
  }
);

export const DynamicCodeEditor = dynamic(
  () => import('@/components/editors/CodeEditor').then(mod => mod.CodeEditor),
  {
    loading: () => (
      <div className="bg-muted flex h-96 items-center justify-center rounded-lg">
        <LoadingSpinner />
      </div>
    ),
    ssr: false,
  }
);

// Heavy feature components
export const DynamicDashboardAnalytics = dynamic(
  () => import('@/components/dashboard/Analytics').then(mod => mod.Analytics),
  {
    loading: () => <LoadingSpinner />,
  }
);

export const DynamicFileUploader = dynamic(
  () => import('@/components/forms/FileUploader').then(mod => mod.FileUploader),
  {
    loading: () => <div className="bg-muted h-32 animate-pulse rounded-lg" />,
  }
);

// Create a higher-order component for dynamic loading
export function withDynamicLoading<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  loadingComponent?: React.ComponentType,
  options?: {
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: loadingComponent || LoadingSpinner,
    ssr: options?.ssr ?? true,
  });
}

// Example usage in a page component:
// const HeavyComponent = withDynamicLoading(
//   () => import('@/components/HeavyComponent'),
//   () => <div>Loading...</div>,
//   { ssr: false }
// );
```

### 4. Create SEO Component

Create `src/components/seo/SEO.tsx`:

```tsx
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
}

const defaultSEO = {
  siteName: 'Your App Name',
  title: 'Your App - Description',
  description: 'Default description for your application',
  image: '/images/og-default.jpg',
  type: 'website' as const,
};

const SEO = ({
  title,
  description = defaultSEO.description,
  image = defaultSEO.image,
  url,
  type = defaultSEO.type,
  siteName = defaultSEO.siteName,
  author,
  publishedTime,
  modifiedTime,
  tags,
  noindex = false,
  canonical,
}: SEOProps) => {
  const router = useRouter();

  // Construct full URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourapp.com';
  const fullUrl = url || `${baseUrl}${router.asPath}`;
  const canonicalUrl = canonical || fullUrl;

  // Construct full image URL
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  // Construct page title
  const pageTitle = title ? `${title} | ${siteName}` : defaultSEO.title;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Author */}
      {author && <meta name="author" content={author} />}

      {/* Keywords */}
      {tags && tags.length > 0 && (
        <meta name="keywords" content={tags.join(', ')} />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title || defaultSEO.title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title || siteName} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {tags &&
            tags.map(tag => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultSEO.title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:url" content={fullUrl} />

      {/* Additional Meta */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'WebPage',
            headline: title,
            description: description,
            image: fullImageUrl,
            url: fullUrl,
            ...(author && { author: { '@type': 'Person', name: author } }),
            ...(publishedTime && { datePublished: publishedTime }),
            ...(modifiedTime && { dateModified: modifiedTime }),
          }),
        }}
      />
    </Head>
  );
};

export { SEO, type SEOProps };
```

### 5. Create Sitemap Generation

Create `src/lib/sitemap.ts`:

```typescript
import fs from 'fs';
import path from 'path';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourapp.com';

// Static pages that should be included in sitemap
const staticPages: SitemapEntry[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/about', changefreq: 'monthly', priority: 0.8 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
  { loc: '/features', changefreq: 'weekly', priority: 0.8 },
  { loc: '/pricing', changefreq: 'weekly', priority: 0.9 },
  { loc: '/blog', changefreq: 'daily', priority: 0.9 },
  { loc: '/login', changefreq: 'yearly', priority: 0.3 },
  { loc: '/register', changefreq: 'yearly', priority: 0.3 },
];

// Function to get dynamic pages (e.g., blog posts)
async function getDynamicPages(): Promise<SitemapEntry[]> {
  // TODO: Implement logic to fetch dynamic pages from your CMS/database
  // Example for blog posts:
  /*
  const posts = await getBlogPosts();
  return posts.map(post => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.updatedAt,
    changefreq: 'weekly' as const,
    priority: 0.7,
  }));
  */
  return [];
}

function generateSitemapXML(pages: SitemapEntry[]): string {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(page => {
    return `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    ${page.lastmod ? `    <lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `    <changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `    <priority>${page.priority}</priority>` : ''}
  </url>`;
  })
  .join('\n')}
</urlset>`;
  return sitemap;
}

export async function generateSitemap(): Promise<string> {
  const dynamicPages = await getDynamicPages();
  const allPages = [...staticPages, ...dynamicPages];
  return generateSitemapXML(allPages);
}

// Generate sitemap file
export async function writeSitemap(): Promise<void> {
  const sitemap = await generateSitemap();
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
}
```

Create `src/app/sitemap.xml/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateSitemap } from '@/lib/sitemap';

export async function GET(request: NextRequest) {
  try {
    const sitemap = await generateSitemap();

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
```

### 6. Create Robots.txt

Create `src/app/robots.txt/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourapp.com';

  const robotsContent = `User-agent: *
Allow: /

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /static/

# Block authentication pages
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

# Allow important pages
Allow: /about
Allow: /contact
Allow: /features
Allow: /pricing
Allow: /blog

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
```

### 7. Implement Performance Monitoring

Create `src/lib/analytics.ts`:

```typescript
// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = (action: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters);
  }
};

// Web Vitals reporting
export function reportWebVitals(metric: any) {
  if (GA_TRACKING_ID) {
    event('web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      non_interaction: true,
    });
  }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric);
  }
}

// Performance observer for custom metrics
export function observePerformance() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      event('performance_metric', {
        metric_name: 'LCP',
        metric_value: entry.startTime,
        metric_rating:
          entry.startTime < 2500
            ? 'good'
            : entry.startTime < 4000
              ? 'needs-improvement'
              : 'poor',
      });
    }
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP observer not supported');
  }

  // First Input Delay
  const fidObserver = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      event('performance_metric', {
        metric_name: 'FID',
        metric_value: entry.processingStart - entry.startTime,
        metric_rating:
          entry.processingStart - entry.startTime < 100
            ? 'good'
            : entry.processingStart - entry.startTime < 300
              ? 'needs-improvement'
              : 'poor',
      });
    }
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('FID observer not supported');
  }
}

// Bundle size monitoring
export function trackBundleSize() {
  if (typeof window === 'undefined' || !navigator.connection) {
    return;
  }

  const connection = (navigator as any).connection;
  const bundleSize =
    performance.getEntriesByType('navigation')[0]?.transferSize || 0;

  event('bundle_performance', {
    bundle_size: bundleSize,
    connection_type: connection.effectiveType,
    downlink: connection.downlink,
  });
}
```

### 8. Create Performance Budget Configuration

Create `performance-budget.json`:

```json
{
  "budget": [
    {
      "path": "/**",
      "timings": [
        {
          "metric": "interactive",
          "budget": 5000,
          "tolerance": 1000
        },
        {
          "metric": "first-contentful-paint",
          "budget": 2000,
          "tolerance": 500
        },
        {
          "metric": "largest-contentful-paint",
          "budget": 2500,
          "tolerance": 500
        }
      ],
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 170000
        },
        {
          "resourceType": "stylesheet",
          "budget": 50000
        },
        {
          "resourceType": "image",
          "budget": 300000
        },
        {
          "resourceType": "total",
          "budget": 500000
        }
      ],
      "resourceCounts": [
        {
          "resourceType": "script",
          "budget": 10
        },
        {
          "resourceType": "stylesheet",
          "budget": 5
        }
      ]
    }
  ]
}
```

### 9. Update App Configuration

Update `src/app/layout.tsx` to include performance monitoring:

```tsx
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { GA_TRACKING_ID } from '@/lib/analytics';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your App Name',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 10. Add Performance Scripts to Package.json

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "lighthouse": "lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html",
    "perf:audit": "npm run build && npm run lighthouse",
    "sitemap:generate": "node -e \"require('./src/lib/sitemap').writeSitemap()\"",
    "bundle:analyze": "npm run analyze && open .next/analyze/client.html"
  }
}
```

## Acceptance Criteria

- [ ] Next.js Image component configured with proper optimization settings
- [ ] Dynamic imports implemented for code splitting
- [ ] SEO component provides comprehensive meta tags
- [ ] Sitemap generates correctly with all pages
- [ ] Robots.txt configured appropriately
- [ ] Performance monitoring tracks Core Web Vitals
- [ ] Bundle analysis tools configured
- [ ] Lighthouse scores above 90 for Performance, SEO, and Accessibility
- [ ] Images load with proper lazy loading and responsive sizes
- [ ] Critical CSS inlined for above-the-fold content

## Testing Instructions

### 1. Test Image Optimization

```bash
# Check image formats in browser network tab
# Verify WebP/AVIF formats are served
# Test responsive image sizes at different breakpoints
# Confirm lazy loading behavior
```

### 2. Test Code Splitting

```bash
# Run bundle analyzer: npm run analyze
# Check network tab for dynamic chunk loading
# Verify components load only when needed
```

### 3. Test SEO Implementation

```bash
# Visit pages and check meta tags in browser inspector
# Test Open Graph tags with social media validators
# Verify structured data with Google's Rich Results Test
```

### 4. Test Performance

```bash
# Run Lighthouse audit: npm run lighthouse
# Check Core Web Vitals in PageSpeed Insights
# Monitor performance metrics in analytics
```

### 5. Test Sitemap and Robots

```bash
# Visit /sitemap.xml and verify content
# Check /robots.txt accessibility
# Verify search engine indexing rules
```

## References and Dependencies

### Dependencies

- `next/image`: Image optimization
- `next/dynamic`: Dynamic imports
- `@next/bundle-analyzer`: Bundle analysis

### Documentation

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance](https://developers.google.com/web/tools/lighthouse)

## Estimated Time

**8-10 hours**

- Image optimization setup: 2-3 hours
- Code splitting implementation: 2-3 hours
- SEO component development: 2-3 hours
- Performance monitoring: 2-3 hours
- Testing and optimization: 2-3 hours

## Troubleshooting

### Common Issues

1. **Image optimization not working**
   - Check Next.js configuration
   - Verify image domains are whitelisted
   - Ensure proper Image component usage

2. **Code splitting not effective**
   - Analyze bundle with webpack analyzer
   - Check dynamic import syntax
   - Verify lazy loading implementation

3. **Poor Lighthouse scores**
   - Optimize Cumulative Layout Shift (CLS)
   - Reduce Time to Interactive (TTI)
   - Minimize render-blocking resources

4. **SEO issues**
   - Validate meta tags and structured data
   - Check canonical URLs
   - Ensure proper heading hierarchy

5. **Performance monitoring issues**
   - Verify analytics configuration
   - Check browser support for Performance APIs
   - Test in production environment
