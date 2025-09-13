import { z } from 'zod';

// Define environment schema
const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_APP_NAME: z.string().default('Modern Next.js App'),
    NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),

    // Database
    DATABASE_URL: z.string().url().optional(),
    DIRECT_URL: z.string().url().optional(),
    DATABASE_SSL: z.coerce.boolean().default(true),

    // Authentication
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    JWT_SECRET: z.string().min(32).optional(),
    SESSION_SECRET: z.string().min(32).optional(),

    // APIs
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
    API_SECRET_KEY: z.string().min(20).optional(),
    WEBHOOK_SECRET: z.string().min(20).optional(),
    ENCRYPTION_KEY: z.string().min(32).optional(),

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

    // Security
    ENABLE_RATE_LIMITING: z.coerce.boolean().default(true),
    ENABLE_CORS: z.coerce.boolean().default(true),
    SECURITY_HEADERS: z.coerce.boolean().default(true),
    SECURITY_LOG_LEVEL: z
      .enum(['error', 'warn', 'info', 'debug'])
      .default('warn'),
    SECURITY_WEBHOOK_URL: z.string().url().optional(),
    DISABLE_HTTPS_REDIRECT: z.coerce.boolean().default(false),

    // Deployment
    VERCEL: z.coerce.boolean().optional(),
    VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  })
  .refine(
    data => {
      // Production-specific validations
      if (data.NODE_ENV === 'production') {
        return (
          data.JWT_SECRET &&
          data.SESSION_SECRET &&
          data.API_SECRET_KEY &&
          data.NEXTAUTH_SECRET
        );
      }
      return true;
    },
    {
      message:
        'Production environment requires JWT_SECRET, SESSION_SECRET, API_SECRET_KEY, and NEXTAUTH_SECRET',
    }
  );

// Parse and validate environment variables
const parseEnv = () => {
  try {
    const env = envSchema.parse(process.env);

    // Security configuration validated (without secrets)
    // NODE_ENV, SITE_URL, RATE_LIMITING, CORS, SECURITY_HEADERS, DATABASE_SSL

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.issues.forEach(issue => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;

// Utility to check if secrets are properly configured
export function validateSecuritySecrets(): boolean {
  const requiredSecrets = ['JWT_SECRET', 'SESSION_SECRET', 'API_SECRET_KEY'];

  const missing = requiredSecrets.filter(secret => !process.env[secret]);

  if (missing.length > 0) {
    console.error('❌ Missing required security secrets:', missing);
    return false;
  }

  return true;
}

// Generate secure random string for development
export function generateSecureSecret(length: number = 32): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return result;
}
