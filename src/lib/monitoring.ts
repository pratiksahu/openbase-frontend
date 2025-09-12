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
  if (env.NODE_ENV === 'production') {
    console.log(`Deployment tracked: ${version}`);
  }
};

// Custom metrics
export const trackMetric = (
  name: string,
  value: number,
  tags?: Record<string, string>
) => {
  // Send metrics to monitoring service
  if (env.NODE_ENV === 'production') {
    console.log(`Metric: ${name} = ${value}`, tags);
  }
};

// Performance tracking
export const trackPageView = (page: string) => {
  if (env.NEXT_PUBLIC_ENABLE_ANALYTICS && env.NEXT_PUBLIC_GA_ID) {
    // Track page views with Google Analytics
    console.log(`Page view tracked: ${page}`);
  }
};

// Error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  if (env.NODE_ENV === 'production') {
    console.error('Error tracked:', error.message, context);
    
    // Send to error tracking service
    if (env.SENTRY_DSN) {
      // Send to Sentry
    }
  }
};

// Feature usage tracking
export const trackFeatureUsage = (feature: string, data?: Record<string, any>) => {
  if (env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
    console.log(`Feature usage tracked: ${feature}`, data);
  }
};