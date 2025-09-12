# TASK_015: Deployment Configuration

## Overview
Set up comprehensive deployment configuration for the Next.js application with support for multiple environments, automated CI/CD pipelines, and production-ready hosting. This task covers environment management, GitHub Actions workflows, Vercel deployment, Docker containerization, and deployment documentation.

## Objectives
- Create environment variables template and configuration
- Set up GitHub Actions workflows for CI/CD
- Configure Vercel deployment with custom domains
- Create Docker configuration for containerized deployment
- Implement preview deployments and testing
- Set up monitoring and error tracking
- Create deployment documentation and runbooks
- Optimize build processes and deployment speed

## Implementation Steps

### 1. Create Environment Configuration

Create `.env.example`:

```bash
# Application
NEXT_PUBLIC_SITE_URL=https://yourapp.com
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_VERSION=1.0.0

# Database (if using)
DATABASE_URL=postgresql://username:password@localhost:5432/yourapp
DIRECT_URL=postgresql://username:password@localhost:5432/yourapp

# Authentication (if using NextAuth.js)
NEXTAUTH_URL=https://yourapp.com
NEXTAUTH_SECRET=your-secret-key

# External APIs
NEXT_PUBLIC_API_URL=https://api.yourapp.com
API_SECRET_KEY=your-api-secret

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Error Tracking
SENTRY_DSN=https://your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=https://your-public-sentry-dsn

# Email Service
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# File Storage
NEXT_PUBLIC_STORAGE_URL=https://storage.yourapp.com
STORAGE_ACCESS_KEY=your-access-key
STORAGE_SECRET_KEY=your-secret-key

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=false

# Development
NODE_ENV=production
VERCEL=1
VERCEL_ENV=production
```

Create `src/lib/env.ts`:

```typescript
import { z } from 'zod';

// Define environment schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Your App'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  
  // Database
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  
  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  
  // APIs
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  API_SECRET_KEY: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  
  // Error Tracking
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  
  // Storage
  NEXT_PUBLIC_STORAGE_URL: z.string().url().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_PWA: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z.coerce.boolean().default(false),
  
  // Deployment
  VERCEL: z.coerce.boolean().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => e.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

export const env = parseEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
```

### 2. Create GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  lint-and-type-check:
    name: Lint and Type Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run ESLint
        run: npm run lint
        
      - name: Run type check
        run: npm run type-check
        
      - name: Check formatting
        run: npm run format:check

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
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
          name: codecov-umbrella

  e2e-test:
    name: E2E Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        
      - name: Build application
        run: npm run build
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint-and-type-check, test]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: .next/
          retention-days: 1

  security-audit:
    name: Security Audit
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run security audit
        run: npm audit --audit-level=moderate
        
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: [build, e2e-test]
    if: github.event_name == 'pull_request'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
          
      - name: Comment PR with preview URL
        uses: actions/github-script@v6
        with:
          script: |
            const { data: deployments } = await github.rest.repos.listDeployments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.sha
            });
            
            if (deployments.length > 0) {
              const deployment = deployments[0];
              const previewUrl = `https://${context.repo.repo}-${context.sha.substring(0, 7)}-${context.actor}.vercel.app`;
              
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: `🚀 Preview deployment ready!\n\n📱 **Preview URL**: ${previewUrl}\n\n✅ Build passed all checks.`
              });
            }

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, e2e-test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: 
      name: production
      url: https://yourapp.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
          
      - name: Notify deployment success
        uses: 8398a7/action-slack@v3
        if: success()
        with:
          status: success
          text: "🚀 Production deployment successful!"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
          
      - name: Notify deployment failure
        uses: 8398a7/action-slack@v3
        if: failure()
        with:
          status: failure
          text: "❌ Production deployment failed!"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 3. Configure Vercel Deployment

Create `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production",
    "NEXT_PUBLIC_SITE_URL": "@site-url",
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-Requested-With, Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/health",
      "destination": "/api/health"
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ],
  "trailingSlash": false,
  "cleanUrls": true,
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

Create `.vercelignore`:

```
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
/coverage
/test-results
/playwright-report

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# IDE
.vscode
.idea

# Logs
logs
*.log

# OS
Thumbs.db
```

### 4. Create Docker Configuration

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SITE_URL=http://localhost:3000
    volumes:
      - ./public:/app/public:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Optional: Add database, Redis, etc.
  # postgres:
  #   image: postgres:15
  #   environment:
  #     POSTGRES_DB: yourapp
  #     POSTGRES_USER: postgres
  #     POSTGRES_PASSWORD: password
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

# volumes:
#   postgres_data:
```

Create `.dockerignore`:

```
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
.next
out
build

# Development files
.env*.local
.git
.gitignore
README.md
Dockerfile
.dockerignore
docker-compose.yml

# Testing
coverage
.nyc_output
test-results
playwright-report

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock
```

### 5. Create Deployment Scripts

Create `scripts/deploy.sh`:

```bash
#!/bin/bash

# Deployment script for production
set -e

echo "🚀 Starting deployment process..."

# Environment check
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN environment variable is required"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Type check
echo "🔧 Type checking..."
npm run type-check

# Build application
echo "🏗️  Building application..."
npm run build

# Deploy to Vercel
echo "☁️  Deploying to Vercel..."
npx vercel deploy --prod --token "$VERCEL_TOKEN"

echo "✅ Deployment completed successfully!"
```

Create `scripts/preview-deploy.sh`:

```bash
#!/bin/bash

# Preview deployment script
set -e

echo "🚀 Starting preview deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build application
echo "🏗️  Building application..."
npm run build

# Deploy to Vercel preview
echo "☁️  Deploying preview to Vercel..."
PREVIEW_URL=$(npx vercel deploy --token "$VERCEL_TOKEN")

echo "✅ Preview deployment completed!"
echo "🔗 Preview URL: $PREVIEW_URL"

# Update PR with preview URL (if in CI)
if [ ! -z "$GITHUB_TOKEN" ] && [ ! -z "$GITHUB_REPOSITORY" ] && [ ! -z "$PR_NUMBER" ]; then
    curl -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/repos/$GITHUB_REPOSITORY/issues/$PR_NUMBER/comments \
        -d "{\"body\":\"🚀 Preview deployment ready!\\n\\n📱 **Preview URL**: $PREVIEW_URL\"}"
fi
```

### 6. Create Health Check Endpoint

Update `src/app/api/health/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET(request: NextRequest) {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: env.NEXT_PUBLIC_APP_VERSION,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      // Add more health checks as needed
      services: {
        database: await checkDatabase(),
        external_api: await checkExternalAPI(),
      },
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

async function checkDatabase(): Promise<string> {
  // Implement database health check
  try {
    // Example: await db.raw('SELECT 1');
    return 'healthy';
  } catch (error) {
    return 'unhealthy';
  }
}

async function checkExternalAPI(): Promise<string> {
  // Implement external API health check
  try {
    // Example: await fetch('https://api.example.com/health');
    return 'healthy';
  } catch (error) {
    return 'unhealthy';
  }
}
```

### 7. Create Monitoring Configuration

Create `src/lib/monitoring.ts`:

```typescript
import { env } from './env';

// Error tracking with Sentry (optional)
export const initSentry = () => {
  if (env.NEXT_PUBLIC_SENTRY_DSN) {
    // Initialize Sentry
    console.log('Sentry initialized');
  }
};

// Performance monitoring
export const trackDeployment = (version: string) => {
  // Track deployment metrics
  console.log(`Deployment tracked: ${version}`);
};

// Custom metrics
export const trackMetric = (name: string, value: number, tags?: Record<string, string>) => {
  // Send metrics to monitoring service
  if (env.NODE_ENV === 'production') {
    console.log(`Metric: ${name} = ${value}`, tags);
  }
};
```

### 8. Update Package.json with Deployment Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "deploy": "./scripts/deploy.sh",
    "deploy:preview": "./scripts/preview-deploy.sh",
    "docker:build": "docker build -t yourapp .",
    "docker:run": "docker run -p 3000:3000 yourapp",
    "docker:compose": "docker-compose up -d",
    "vercel:login": "vercel login",
    "vercel:deploy": "vercel deploy",
    "vercel:prod": "vercel deploy --prod",
    "env:check": "node -e \"require('./src/lib/env')\"",
    "health:check": "curl -f http://localhost:3000/api/health || exit 1"
  }
}
```

### 9. Create Deployment Documentation

Create `docs/DEPLOYMENT.md`:

```markdown
# Deployment Guide

## Prerequisites

- Node.js 18+
- Vercel account
- GitHub repository
- Environment variables configured

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in required environment variables
3. Validate configuration: `npm run env:check`

## Local Development

```bash
npm install
npm run dev
```

## Production Deployment

### Automatic Deployment (Recommended)

1. Push to `main` branch
2. GitHub Actions will automatically deploy
3. Monitor deployment in GitHub Actions tab

### Manual Deployment

```bash
npm run deploy
```

## Preview Deployments

- Every PR creates a preview deployment
- Preview URLs are posted in PR comments
- Previews are automatically cleaned up

## Docker Deployment

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Use docker-compose
npm run docker:compose
```

## Health Checks

- Health endpoint: `/api/health`
- Check application health: `npm run health:check`

## Monitoring

- Error tracking: Sentry (if configured)
- Performance monitoring: Vercel Analytics
- Uptime monitoring: Custom solution

## Troubleshooting

### Common Issues

1. **Build failures**: Check TypeScript errors
2. **Environment variables**: Verify all required vars are set
3. **API routes**: Check function timeouts in Vercel
4. **Database connections**: Verify connection strings

### Debug Steps

1. Check build logs in Vercel dashboard
2. Review GitHub Actions workflow logs
3. Test locally with production build: `npm run build && npm start`
4. Check health endpoint: `curl /api/health`
```

### 10. Create Environment-Specific Configurations

Create `config/environments.ts`:

```typescript
import { env } from '@/lib/env';

export const config = {
  development: {
    api: {
      timeout: 10000,
      retries: 1,
    },
    cache: {
      ttl: 60, // 1 minute
    },
    logging: {
      level: 'debug',
    },
  },
  production: {
    api: {
      timeout: 5000,
      retries: 3,
    },
    cache: {
      ttl: 300, // 5 minutes
    },
    logging: {
      level: 'error',
    },
  },
  preview: {
    api: {
      timeout: 7500,
      retries: 2,
    },
    cache: {
      ttl: 180, // 3 minutes
    },
    logging: {
      level: 'warn',
    },
  },
};

export const getCurrentConfig = () => {
  const environment = env.NODE_ENV;
  return config[environment] || config.development;
};
```

## Acceptance Criteria

- [ ] Environment variables are properly configured and validated
- [ ] GitHub Actions workflow builds and deploys successfully
- [ ] Vercel deployment works with custom domains
- [ ] Docker containerization works correctly
- [ ] Preview deployments are created for PRs
- [ ] Health check endpoint returns proper status
- [ ] Monitoring and error tracking are configured
- [ ] Deployment documentation is comprehensive
- [ ] Security headers are properly set
- [ ] Build optimization reduces deployment time

## Testing Instructions

### 1. Test Environment Configuration
```bash
npm run env:check
```

### 2. Test GitHub Actions
```bash
# Create PR and check workflow runs
# Push to main and verify production deployment
```

### 3. Test Vercel Deployment
```bash
npm run vercel:deploy
curl https://your-preview-url.vercel.app/api/health
```

### 4. Test Docker Build
```bash
npm run docker:build
npm run docker:run
curl http://localhost:3000/api/health
```

### 5. Test Health Endpoint
```bash
npm run health:check
```

## References and Dependencies

### Dependencies
- `vercel`: Deployment platform
- `@vercel/analytics`: Performance monitoring
- `zod`: Environment validation

### Documentation
- [Vercel Deployment](https://vercel.com/docs/deployments)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Estimated Time
**6-8 hours**

- Environment setup: 2-3 hours
- CI/CD pipeline: 2-3 hours
- Docker configuration: 1-2 hours
- Documentation: 1-2 hours

## Troubleshooting

### Common Issues

1. **Environment variable validation errors**
   - Check `.env.example` vs actual variables
   - Verify Zod schema matches requirements
   - Test with `npm run env:check`

2. **GitHub Actions failing**
   - Check secrets are configured
   - Verify workflow permissions
   - Review action logs for errors

3. **Vercel deployment issues**
   - Check build logs in dashboard
   - Verify environment variables in Vercel
   - Test build locally first

4. **Docker build failures**
   - Check Dockerfile syntax
   - Verify Node.js version compatibility
   - Test multi-stage build steps

5. **Health check failures**
   - Verify all services are running
   - Check database connections
   - Test external API dependencies