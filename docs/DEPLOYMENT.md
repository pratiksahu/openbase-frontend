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

## Environment Variables

### Required Variables

- `NEXT_PUBLIC_SITE_URL`: The public URL of your application
- `NEXT_PUBLIC_APP_NAME`: Name of your application
- `NEXT_PUBLIC_APP_VERSION`: Version of your application

### Optional Variables

- `DATABASE_URL`: Database connection string (if using database)
- `NEXTAUTH_SECRET`: Secret for NextAuth.js (if using authentication)
- `SENTRY_DSN`: Sentry DSN for error tracking
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID

See `.env.example` for a complete list.

## CI/CD Pipeline

The GitHub Actions workflow includes:

1. **Lint and Type Check**: ESLint and TypeScript validation
2. **Tests**: Unit tests and E2E tests with Playwright
3. **Build**: Production build verification
4. **Security Audit**: npm audit and optional Snyk scan
5. **Deploy Preview**: Automatic preview deployments for PRs
6. **Deploy Production**: Production deployment on main branch

## Vercel Configuration

The application is configured for Vercel with:

- Automatic deployments from GitHub
- Custom headers for security
- API routes with proper CORS
- Redirects and rewrites
- Build optimization

## Docker Configuration

The Dockerfile uses multi-stage builds for optimal image size:

1. **Dependencies**: Install only production dependencies
2. **Builder**: Build the application
3. **Runner**: Run the application with minimal footprint

## Scripts

- `npm run deploy`: Full deployment with tests and validation
- `npm run deploy:preview`: Preview deployment
- `npm run docker:build`: Build Docker image
- `npm run docker:run`: Run Docker container
- `npm run docker:compose`: Start with docker-compose
- `npm run env:check`: Validate environment variables
- `npm run health:check`: Check application health

## Troubleshooting

### Common Issues

1. **Build failures**: Check TypeScript errors and run `npm run build` locally
2. **Environment variables**: Verify all required vars are set using `npm run env:check`
3. **API routes**: Check function timeouts in Vercel (max 30s)
4. **Database connections**: Verify connection strings and network access

### Debug Steps

1. Check build logs in Vercel dashboard
2. Review GitHub Actions workflow logs
3. Test locally with production build: `npm run build && npm start`
4. Check health endpoint: `curl /api/health`

### Performance Issues

1. Check bundle size with `npm run analyze`
2. Monitor with Vercel Analytics
3. Use Lighthouse for performance audit: `npm run perf:audit`

### Security

1. All security headers are configured in `vercel.json`
2. Run security audit: `npm audit`
3. Check for vulnerabilities with Snyk (if configured)

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel dashboard
2. Select the deployment you want to rollback to
3. Click "Promote to Production"

### Emergency Rollback

If the application is completely broken:

1. Revert the problematic commit in Git
2. Push to main branch
3. Wait for automatic deployment

## Monitoring and Alerting

### Health Monitoring

The `/api/health` endpoint provides:
- Application status
- Environment information
- Memory usage
- Uptime
- Service dependencies status

### Error Tracking

Configure Sentry for production error tracking:
1. Set `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN`
2. Errors are automatically captured and reported

### Performance Monitoring

Enable Vercel Analytics for performance insights:
1. Add `@vercel/analytics` to dependencies
2. Configure in the application

## Security Checklist

- [ ] Environment variables are properly configured
- [ ] Security headers are set in `vercel.json`
- [ ] API routes have proper validation
- [ ] No sensitive data in client-side code
- [ ] HTTPS is enforced
- [ ] Dependencies are regularly updated
- [ ] Security audit runs in CI/CD

## Production Readiness Checklist

- [ ] All tests pass
- [ ] Build succeeds locally
- [ ] Environment variables validated
- [ ] Health check returns healthy status
- [ ] Performance budget is within limits
- [ ] Security headers configured
- [ ] Error tracking is working
- [ ] Monitoring is set up
- [ ] Backup and rollback procedures tested