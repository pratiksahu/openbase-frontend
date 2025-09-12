#!/usr/bin/env node

const { z } = require('zod');

// Define environment schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Modern Next.js App'),
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

  // PWA
  NEXT_PUBLIC_VAPID_KEY: z.string().optional(),

  // Deployment
  VERCEL: z.coerce.boolean().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
});

// Parse and validate environment variables
try {
  const env = envSchema.parse(process.env);
  console.log('✅ Environment validation passed');
  console.log('Environment:', env.NODE_ENV);
  console.log('Site URL:', env.NEXT_PUBLIC_SITE_URL);
  console.log('App Name:', env.NEXT_PUBLIC_APP_NAME);
  console.log('App Version:', env.NEXT_PUBLIC_APP_VERSION);
  process.exit(0);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    error.errors.forEach(err => {
      console.error(`  ${err.path.join('.')}: ${err.message}`);
    });
  } else {
    console.error('❌ Unknown error:', error.message);
  }
  process.exit(1);
}