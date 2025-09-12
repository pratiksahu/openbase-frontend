# TASK_018: Security Implementation

## Overview

Implement comprehensive security measures for the Next.js application including Content Security Policy, CORS configuration, rate limiting, input sanitization, environment variable validation, and security headers. This task focuses on protecting the application from common security threats and vulnerabilities.

## Objectives

- Configure Content Security Policy (CSP) to prevent XSS attacks
- Set up CORS headers for API security
- Implement rate limiting to prevent abuse
- Add input sanitization and validation
- Secure environment variable handling
- Configure comprehensive security headers
- Implement authentication security measures
- Set up security monitoring and logging
- Create security best practices documentation

## Implementation Steps

### 1. Configure Content Security Policy

Create `src/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://api.vercel.com https://vercel.live https://www.google-analytics.com;
    media-src 'self';
    worker-src 'self' blob:;
  `
    .replace(/\\s{2,}/g, ' ')
    .trim();

  if (env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', cspHeader);
  } else {
    // More permissive CSP for development
    response.headers.set('Content-Security-Policy-Report-Only', cspHeader);
  }

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // HSTS (only for HTTPS)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Remove Server header for security
  response.headers.delete('Server');
  response.headers.delete('X-Powered-By');

  return response;
}

export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'],
};
```

### 2. Configure CORS and API Security

Create `src/lib/cors.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

interface CORSOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultOptions: CORSOptions = {
  origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
};

export function corsHandler(options: CORSOptions = {}) {
  const corsOptions = { ...defaultOptions, ...options };

  return async (request: NextRequest) => {
    const origin = request.headers.get('origin');
    const response = new NextResponse();

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: getCorsHeaders(origin, corsOptions),
      });
    }

    return response;
  };
}

function getCorsHeaders(
  origin: string | null,
  options: CORSOptions
): Record<string, string> {
  const headers: Record<string, string> = {};

  // Access-Control-Allow-Origin
  if (options.origin === true) {
    headers['Access-Control-Allow-Origin'] = origin || '*';
  } else if (typeof options.origin === 'string') {
    headers['Access-Control-Allow-Origin'] = options.origin;
  } else if (Array.isArray(options.origin) && origin) {
    if (options.origin.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
    }
  }

  // Access-Control-Allow-Methods
  if (options.methods) {
    headers['Access-Control-Allow-Methods'] = options.methods.join(', ');
  }

  // Access-Control-Allow-Headers
  if (options.allowedHeaders) {
    headers['Access-Control-Allow-Headers'] = options.allowedHeaders.join(', ');
  }

  // Access-Control-Allow-Credentials
  if (options.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  // Access-Control-Max-Age
  if (options.maxAge) {
    headers['Access-Control-Max-Age'] = options.maxAge.toString();
  }

  return headers;
}

// Higher-order function for API routes
export function withCors(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: CORSOptions
) {
  return async (request: NextRequest) => {
    const corsOptions = { ...defaultOptions, ...options };
    const origin = request.headers.get('origin');

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: getCorsHeaders(origin, corsOptions),
      });
    }

    // Execute the handler
    const response = await handler(request);

    // Add CORS headers to the response
    const corsHeaders = getCorsHeaders(origin, corsOptions);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}
```

### 3. Implement Rate Limiting

Create `src/lib/rate-limit.ts`:

```typescript
interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

class RateLimiter {
  private cache: Map<string, { count: number; resetTime: number }> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // Clean up expired entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (now > value.resetTime) {
          this.cache.delete(key);
        }
      }
    }, 60000);
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now;
    const windowEnd = windowStart + this.config.interval;

    const current = this.cache.get(identifier);

    if (!current || now > current.resetTime) {
      // First request in window or window has expired
      this.cache.set(identifier, {
        count: 1,
        resetTime: windowEnd,
      });

      return {
        success: true,
        limit: this.config.uniqueTokenPerInterval,
        remaining: this.config.uniqueTokenPerInterval - 1,
        reset: windowEnd,
      };
    }

    if (current.count >= this.config.uniqueTokenPerInterval) {
      // Rate limit exceeded
      return {
        success: false,
        limit: this.config.uniqueTokenPerInterval,
        remaining: 0,
        reset: current.resetTime,
      };
    }

    // Increment count
    current.count++;
    this.cache.set(identifier, current);

    return {
      success: true,
      limit: this.config.uniqueTokenPerInterval,
      remaining: this.config.uniqueTokenPerInterval - current.count,
      reset: current.resetTime,
    };
  }
}

// Create rate limiters for different use cases
export const apiRateLimit = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // 100 requests per minute
});

export const authRateLimit = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 auth attempts per 15 minutes
});

export const contactRateLimit = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 3, // 3 contact form submissions per hour
});

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (clientIP) {
    return clientIP;
  }

  return '127.0.0.1'; // Fallback
}

// Higher-order function for API routes
export function withRateLimit(
  handler: (req: Request) => Promise<Response>,
  limiter: RateLimiter = apiRateLimit
) {
  return async (request: Request) => {
    const ip = getClientIP(request);
    const result = limiter.check(ip);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(
              (result.reset - Date.now()) / 1000
            ).toString(),
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
          },
        }
      );
    }

    const response = await handler(request);

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.reset.toString());

    return response;
  };
}
```

### 4. Input Sanitization and Validation

Create `src/lib/sanitization.ts`:

```typescript
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// HTML sanitization
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

// Remove potentially dangerous characters
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>\"'%;()&+]/g, '') // Remove dangerous characters
    .trim()
    .slice(0, 1000); // Limit length
}

// Sanitize SQL inputs (for raw queries)
export function sanitizeSql(input: string): string {
  return input
    .replace(/[;'\"\\]/g, '') // Remove SQL injection characters
    .trim();
}

// Email sanitization
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._-]/g, ''); // Only allow valid email characters
}

// Phone number sanitization
export function sanitizePhone(phone: string): string {
  return phone
    .replace(/[^0-9+()-\s]/g, '') // Only allow phone number characters
    .trim();
}

// URL sanitization
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

// Comprehensive input sanitization
export function sanitizeInput(
  input: unknown,
  type: 'string' | 'email' | 'phone' | 'url' | 'html' = 'string'
): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  switch (type) {
    case 'email':
      sanitized = sanitizeEmail(sanitized);
      break;
    case 'phone':
      sanitized = sanitizePhone(sanitized);
      break;
    case 'url':
      sanitized = sanitizeUrl(sanitized);
      break;
    case 'html':
      sanitized = sanitizeHtml(sanitized);
      break;
    default:
      sanitized = sanitizeString(sanitized);
      break;
  }

  return sanitized;
}

// Validation schemas with sanitization
export const createSanitizedSchema = <T extends z.ZodTypeAny>(
  schema: T,
  type?: 'string' | 'email' | 'phone' | 'url' | 'html'
) => {
  return z.preprocess(val => {
    if (typeof val === 'string') {
      return sanitizeInput(val, type);
    }
    return val;
  }, schema);
};

// Common sanitized schemas
export const sanitizedString = (min?: number, max?: number) =>
  createSanitizedSchema(
    z
      .string()
      .min(min || 0)
      .max(max || 1000),
    'string'
  );

export const sanitizedEmail = createSanitizedSchema(
  z.string().email(),
  'email'
);

export const sanitizedPhone = createSanitizedSchema(
  z.string().regex(/^[0-9+()-\s]+$/),
  'phone'
);

export const sanitizedUrl = createSanitizedSchema(z.string().url(), 'url');

export const sanitizedHtml = createSanitizedSchema(z.string(), 'html');

// Middleware for automatic sanitization
export function withSanitization<T extends Record<string, unknown>>(
  handler: (sanitizedData: T) => Promise<Response>,
  schema: z.ZodSchema<T>
) {
  return async (request: Request) => {
    try {
      const body = await request.json();
      const sanitizedData = schema.parse(body);
      return await handler(sanitizedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: 'Validation failed',
            details: error.errors,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ error: 'Invalid request data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}
```

### 5. Secure Environment Variable Handling

Update `src/lib/env.ts` with additional security validations:

```typescript
import { z } from 'zod';

// Enhanced environment schema with security validations
const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),

    // Security-related environment variables
    JWT_SECRET: z.string().min(32).optional(),
    ENCRYPTION_KEY: z.string().min(32).optional(),
    SESSION_SECRET: z.string().min(32).optional(),

    // Database with security requirements
    DATABASE_URL: z.string().url().optional(),
    DATABASE_SSL: z.coerce.boolean().default(true),

    // API keys (should not be logged)
    API_SECRET_KEY: z.string().min(20).optional(),
    WEBHOOK_SECRET: z.string().min(20).optional(),

    // External service credentials
    SMTP_PASSWORD: z.string().optional(),
    STORAGE_SECRET_KEY: z.string().optional(),

    // Security features
    ENABLE_RATE_LIMITING: z.coerce.boolean().default(true),
    ENABLE_CORS: z.coerce.boolean().default(true),
    SECURITY_HEADERS: z.coerce.boolean().default(true),

    // Monitoring
    SECURITY_LOG_LEVEL: z
      .enum(['error', 'warn', 'info', 'debug'])
      .default('warn'),

    // Development only
    DISABLE_HTTPS_REDIRECT: z.coerce.boolean().default(false),
  })
  .refine(
    data => {
      // Production-specific validations
      if (data.NODE_ENV === 'production') {
        return data.JWT_SECRET && data.SESSION_SECRET && data.API_SECRET_KEY;
      }
      return true;
    },
    {
      message:
        'Production environment requires JWT_SECRET, SESSION_SECRET, and API_SECRET_KEY',
    }
  );

// Parse and validate environment
const parseEnv = () => {
  try {
    const env = envSchema.parse(process.env);

    // Log security configuration (without secrets)
    if (env.NODE_ENV !== 'test') {
      console.log('Security Configuration:', {
        NODE_ENV: env.NODE_ENV,
        SITE_URL: env.NEXT_PUBLIC_SITE_URL,
        RATE_LIMITING: env.ENABLE_RATE_LIMITING,
        CORS: env.ENABLE_CORS,
        SECURITY_HEADERS: env.SECURITY_HEADERS,
        DATABASE_SSL: env.DATABASE_SSL,
      });
    }

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
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
```

### 6. Authentication Security

Create `src/lib/auth-security.ts`:

```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from './env';

// Password security
export class PasswordSecurity {
  private static readonly SALT_ROUNDS = 12;
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;

  static async hash(password: string): Promise<string> {
    this.validatePassword(password);
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    this.validatePassword(password);
    return bcrypt.compare(password, hash);
  }

  static validatePassword(password: string): void {
    if (!password) {
      throw new Error('Password is required');
    }

    if (password.length < this.MIN_LENGTH) {
      throw new Error(
        `Password must be at least ${this.MIN_LENGTH} characters long`
      );
    }

    if (password.length > this.MAX_LENGTH) {
      throw new Error(`Password must not exceed ${this.MAX_LENGTH} characters`);
    }

    // Check for common patterns
    const patterns = [
      /(.)\1{3,}/, // More than 3 repeated characters
      /^(password|123456|qwerty)/i, // Common passwords
      /^(.{1,2})\1+$/, // Repeating patterns
    ];

    for (const pattern of patterns) {
      if (pattern.test(password)) {
        throw new Error('Password is too weak');
      }
    }

    // Require complexity
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const complexityCount = [
      hasLowerCase,
      hasUpperCase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;

    if (complexityCount < 3) {
      throw new Error(
        'Password must contain at least 3 of: lowercase, uppercase, numbers, special characters'
      );
    }
  }

  static calculateStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Add numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('Add special characters');

    return { score, feedback };
  }
}

// JWT Security
export class JWTSecurity {
  private static readonly ALGORITHM = 'HS256';
  private static readonly ISSUER = env.NEXT_PUBLIC_APP_NAME;

  static sign(payload: object, expiresIn: string = '1h'): string {
    if (!env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(payload, env.JWT_SECRET, {
      algorithm: this.ALGORITHM,
      expiresIn,
      issuer: this.ISSUER,
    });
  }

  static verify<T = any>(token: string): T {
    if (!env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      return jwt.verify(token, env.JWT_SECRET, {
        algorithms: [this.ALGORITHM],
        issuer: this.ISSUER,
      }) as T;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      throw new Error('Token verification failed');
    }
  }

  static decode(token: string): any {
    return jwt.decode(token);
  }
}

// Session Security
export class SessionSecurity {
  private static readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly SECURE_COOKIES = env.NODE_ENV === 'production';

  static createSessionToken(userId: string, additionalClaims?: object): string {
    const payload = {
      userId,
      sessionId: this.generateSessionId(),
      ...additionalClaims,
    };

    return JWTSecurity.sign(payload, '24h');
  }

  static verifySessionToken(token: string): {
    userId: string;
    sessionId: string;
    [key: string]: any;
  } {
    return JWTSecurity.verify(token);
  }

  static generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  static getCookieOptions() {
    return {
      maxAge: this.MAX_AGE,
      httpOnly: true,
      secure: this.SECURE_COOKIES,
      sameSite: 'strict' as const,
      path: '/',
    };
  }
}

// Account Security
export class AccountSecurity {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  private static attempts = new Map<
    string,
    {
      count: number;
      lockedUntil?: number;
    }
  >();

  static recordLoginAttempt(identifier: string, success: boolean): void {
    const current = this.attempts.get(identifier) || { count: 0 };

    if (success) {
      // Clear attempts on successful login
      this.attempts.delete(identifier);
      return;
    }

    current.count++;

    if (current.count >= this.MAX_LOGIN_ATTEMPTS) {
      current.lockedUntil = Date.now() + this.LOCKOUT_DURATION;
    }

    this.attempts.set(identifier, current);
  }

  static isAccountLocked(identifier: string): boolean {
    const attempt = this.attempts.get(identifier);

    if (!attempt || !attempt.lockedUntil) {
      return false;
    }

    if (Date.now() > attempt.lockedUntil) {
      // Lockout expired, clear the record
      this.attempts.delete(identifier);
      return false;
    }

    return true;
  }

  static getRemainingLockoutTime(identifier: string): number {
    const attempt = this.attempts.get(identifier);

    if (!attempt || !attempt.lockedUntil) {
      return 0;
    }

    return Math.max(0, attempt.lockedUntil - Date.now());
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    // Additional checks
    const parts = email.split('@');
    if (parts[1].includes('..') || parts[0].includes('..')) {
      return false; // Consecutive dots
    }

    return true;
  }
}

// CSRF Protection
export class CSRFSecurity {
  private static tokens = new Map<string, number>();
  private static readonly TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour

  static generateToken(): string {
    const token =
      Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
    this.tokens.set(token, Date.now() + this.TOKEN_LIFETIME);

    // Clean up expired tokens
    this.cleanupExpiredTokens();

    return token;
  }

  static verifyToken(token: string): boolean {
    const expiresAt = this.tokens.get(token);

    if (!expiresAt) {
      return false;
    }

    if (Date.now() > expiresAt) {
      this.tokens.delete(token);
      return false;
    }

    // Token is valid, remove it (one-time use)
    this.tokens.delete(token);
    return true;
  }

  private static cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, expiresAt] of this.tokens.entries()) {
      if (now > expiresAt) {
        this.tokens.delete(token);
      }
    }
  }
}
```

### 7. Security Monitoring and Logging

Create `src/lib/security-monitor.ts`:

```typescript
import { env } from './env';

export enum SecurityEventType {
  SUSPICIOUS_REQUEST = 'suspicious_request',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_TOKEN = 'invalid_token',
  FAILED_LOGIN = 'failed_login',
  ACCOUNT_LOCKED = 'account_locked',
  CSRF_ATTACK = 'csrf_attack',
  XSS_ATTEMPT = 'xss_attempt',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
}

interface SecurityEvent {
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  userId?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private alertThresholds = {
    [SecurityEventType.FAILED_LOGIN]: 5, // 5 failed logins
    [SecurityEventType.RATE_LIMIT_EXCEEDED]: 3, // 3 rate limit hits
    [SecurityEventType.XSS_ATTEMPT]: 1, // Any XSS attempt
    [SecurityEventType.SQL_INJECTION_ATTEMPT]: 1, // Any SQL injection attempt
  };

  logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
    };

    this.events.push(fullEvent);

    // Log to console in development
    if (env.NODE_ENV === 'development') {
      console.warn('🚨 Security Event:', fullEvent);
    }

    // Send to monitoring service in production
    if (env.NODE_ENV === 'production') {
      this.sendToMonitoringService(fullEvent);
    }

    // Check for alert conditions
    this.checkAlertConditions(fullEvent);

    // Keep only recent events (last 1000)
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  private sendToMonitoringService(event: SecurityEvent): void {
    // In a real application, send to your monitoring service
    // e.g., Sentry, DataDog, CloudWatch, etc.
    try {
      // Example: Send to webhook
      if (process.env.SECURITY_WEBHOOK_URL) {
        fetch(process.env.SECURITY_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }).catch(console.error);
      }
    } catch (error) {
      console.error(
        'Failed to send security event to monitoring service:',
        error
      );
    }
  }

  private checkAlertConditions(event: SecurityEvent): void {
    const threshold = this.alertThresholds[event.type];
    if (!threshold) return;

    // Count recent events of the same type
    const recentEvents = this.events.filter(
      e =>
        e.type === event.type &&
        Date.now() - e.timestamp.getTime() < 60 * 60 * 1000 // Last hour
    );

    if (recentEvents.length >= threshold) {
      this.sendAlert(event.type, recentEvents.length);
    }
  }

  private sendAlert(eventType: SecurityEventType, count: number): void {
    const alert = {
      type: 'SECURITY_ALERT',
      message: `Multiple ${eventType} events detected: ${count} in the last hour`,
      severity: 'high' as const,
      timestamp: new Date(),
    };

    console.error('🚨 SECURITY ALERT:', alert);

    // Send alert to administrators
    if (env.NODE_ENV === 'production') {
      this.sendToMonitoringService(alert as any);
    }
  }

  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getEventsByType(
    type: SecurityEventType,
    hours: number = 24
  ): SecurityEvent[] {
    const since = Date.now() - hours * 60 * 60 * 1000;
    return this.events.filter(
      e => e.type === type && e.timestamp.getTime() > since
    );
  }

  getSecurityMetrics(): Record<string, number> {
    const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
    const recentEvents = this.events.filter(
      e => e.timestamp.getTime() > last24Hours
    );

    const metrics: Record<string, number> = {};

    Object.values(SecurityEventType).forEach(type => {
      metrics[type] = recentEvents.filter(e => e.type === type).length;
    });

    return metrics;
  }
}

export const securityMonitor = new SecurityMonitor();

// Helper functions for common security events
export const logSuspiciousRequest = (req: Request, reason: string) => {
  securityMonitor.logEvent({
    type: SecurityEventType.SUSPICIOUS_REQUEST,
    severity: 'medium',
    message: `Suspicious request detected: ${reason}`,
    metadata: {
      url: req.url,
      method: req.method,
      reason,
    },
    ip: getIP(req),
    userAgent: req.headers.get('user-agent') || undefined,
  });
};

export const logFailedLogin = (email: string, ip: string, reason: string) => {
  securityMonitor.logEvent({
    type: SecurityEventType.FAILED_LOGIN,
    severity: 'medium',
    message: `Failed login attempt for ${email}: ${reason}`,
    metadata: { email, reason },
    ip,
  });
};

export const logRateLimitExceeded = (req: Request, limit: number) => {
  securityMonitor.logEvent({
    type: SecurityEventType.RATE_LIMIT_EXCEEDED,
    severity: 'medium',
    message: `Rate limit exceeded: ${limit} requests`,
    metadata: { limit },
    ip: getIP(req),
  });
};

export const logXSSAttempt = (req: Request, input: string) => {
  securityMonitor.logEvent({
    type: SecurityEventType.XSS_ATTEMPT,
    severity: 'high',
    message: 'Potential XSS attempt detected',
    metadata: { input: input.substring(0, 100) },
    ip: getIP(req),
  });
};

export const logSQLInjectionAttempt = (req: Request, input: string) => {
  securityMonitor.logEvent({
    type: SecurityEventType.SQL_INJECTION_ATTEMPT,
    severity: 'critical',
    message: 'Potential SQL injection attempt detected',
    metadata: { input: input.substring(0, 100) },
    ip: getIP(req),
  });
};

function getIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return '127.0.0.1';
}
```

### 8. API Security Middleware

Create `src/lib/api-security.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, apiRateLimit } from './rate-limit';
import { withCors } from './cors';
import { withSanitization } from './sanitization';
import { securityMonitor, logSuspiciousRequest } from './security-monitor';
import { z } from 'zod';

// Security middleware composition
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    rateLimiter?: typeof apiRateLimit;
    cors?: boolean;
    sanitization?: z.ZodSchema;
    auth?: boolean;
  } = {}
) {
  return async (request: NextRequest) => {
    try {
      // Security checks
      await performSecurityChecks(request);

      // Apply rate limiting
      if (options.rateLimiter) {
        const rateLimitedHandler = withRateLimit(
          async req => handler(req as NextRequest),
          options.rateLimiter
        );
        return await rateLimitedHandler(request);
      }

      // Apply CORS
      if (options.cors) {
        const corsHandler = withCors(async req => handler(req as NextRequest));
        return await corsHandler(request);
      }

      return await handler(request);
    } catch (error) {
      console.error('Security middleware error:', error);

      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

// Comprehensive security checks
async function performSecurityChecks(request: NextRequest): Promise<void> {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  // Check for suspicious patterns
  checkSuspiciousPatterns(request, url.pathname);

  // Check user agent
  checkUserAgent(request, userAgent);

  // Check for malicious headers
  checkMaliciousHeaders(request);

  // Check request size
  checkRequestSize(request);
}

function checkSuspiciousPatterns(request: NextRequest, pathname: string): void {
  const suspiciousPatterns = [
    // Path traversal
    /\.\.[\/\\]/,
    // SQL injection patterns
    /(union|select|insert|delete|update|drop|exec|script)/i,
    // XSS patterns
    /<script[^>]*>.*?<\/script>/gi,
    // Command injection
    /[;&|`$()]/,
    // Common attack paths
    /\/(wp-admin|phpmyadmin|admin|login\.php|config\.php)/i,
  ];

  const queryString = request.nextUrl.searchParams.toString();
  const testString = pathname + '?' + queryString;

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(testString)) {
      logSuspiciousRequest(
        request,
        `Suspicious pattern detected: ${pattern.source}`
      );
      throw new Error('Suspicious request detected');
    }
  }
}

function checkUserAgent(request: NextRequest, userAgent: string): void {
  // Block empty user agents
  if (!userAgent.trim()) {
    logSuspiciousRequest(request, 'Empty user agent');
    throw new Error('Invalid user agent');
  }

  // Block suspicious user agents
  const suspiciousUAs = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
  ];

  // Allow legitimate bots
  const legitimateBots = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /twitterbot/i,
    /facebookexternalhit/i,
    /linkedinbot/i,
    /whatsapp/i,
  ];

  const isLegitimateBot = legitimateBots.some(pattern =>
    pattern.test(userAgent)
  );
  const isSuspicious = suspiciousUAs.some(pattern => pattern.test(userAgent));

  if (isSuspicious && !isLegitimateBot) {
    logSuspiciousRequest(request, `Suspicious user agent: ${userAgent}`);
  }
}

function checkMaliciousHeaders(request: NextRequest): void {
  const headers = request.headers;

  // Check for injection attempts in headers
  const suspiciousHeaderValues = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
  ];

  for (const [name, value] of headers.entries()) {
    if (suspiciousHeaderValues.some(pattern => pattern.test(value))) {
      logSuspiciousRequest(request, `Malicious header detected: ${name}`);
      throw new Error('Malicious headers detected');
    }
  }

  // Check for unusual header combinations
  const referer = headers.get('referer');
  const origin = headers.get('origin');

  if (referer && origin) {
    try {
      const refererUrl = new URL(referer);
      const originUrl = new URL(origin);

      if (refererUrl.hostname !== originUrl.hostname) {
        logSuspiciousRequest(request, 'Referer/Origin mismatch');
      }
    } catch {
      // Invalid URLs in headers
      logSuspiciousRequest(request, 'Invalid URL in headers');
    }
  }
}

function checkRequestSize(request: NextRequest): void {
  const contentLength = request.headers.get('content-length');

  if (contentLength) {
    const size = parseInt(contentLength, 10);
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (size > maxSize) {
      logSuspiciousRequest(request, `Request too large: ${size} bytes`);
      throw new Error('Request too large');
    }
  }
}

// IP whitelist/blacklist
class IPFilter {
  private blacklist = new Set<string>();
  private whitelist = new Set<string>();

  addToBlacklist(ip: string): void {
    this.blacklist.add(ip);
  }

  addToWhitelist(ip: string): void {
    this.whitelist.add(ip);
  }

  isBlocked(ip: string): boolean {
    if (this.whitelist.size > 0 && !this.whitelist.has(ip)) {
      return true;
    }

    return this.blacklist.has(ip);
  }

  removeFromBlacklist(ip: string): void {
    this.blacklist.delete(ip);
  }
}

export const ipFilter = new IPFilter();

// Temporary IP blocking based on suspicious activity
class TemporaryBlocking {
  private blocked = new Map<string, number>();
  private readonly BLOCK_DURATION = 60 * 60 * 1000; // 1 hour

  block(ip: string, duration: number = this.BLOCK_DURATION): void {
    this.blocked.set(ip, Date.now() + duration);
    console.warn(`🚫 Temporarily blocked IP: ${ip}`);
  }

  isBlocked(ip: string): boolean {
    const blockedUntil = this.blocked.get(ip);

    if (!blockedUntil) {
      return false;
    }

    if (Date.now() > blockedUntil) {
      this.blocked.delete(ip);
      return false;
    }

    return true;
  }

  unblock(ip: string): void {
    this.blocked.delete(ip);
    console.info(`✅ Unblocked IP: ${ip}`);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [ip, blockedUntil] of this.blocked.entries()) {
      if (now > blockedUntil) {
        this.blocked.delete(ip);
      }
    }
  }
}

export const temporaryBlocking = new TemporaryBlocking();

// Clean up expired blocks every 10 minutes
setInterval(
  () => {
    temporaryBlocking.cleanup();
  },
  10 * 60 * 1000
);
```

### 9. Update Contact API with Security

Update `src/app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { withSecurity } from '@/lib/api-security';
import { contactRateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/sanitization';
import { securityMonitor, SecurityEventType } from '@/lib/security-monitor';
import { z } from 'zod';

// Sanitized contact schema
const sanitizedContactSchema = z.object({
  name: z.preprocess(
    val => sanitizeInput(val, 'string'),
    z.string().min(2).max(100)
  ),
  email: z.preprocess(val => sanitizeInput(val, 'email'), z.string().email()),
  subject: z.preprocess(
    val => sanitizeInput(val, 'string'),
    z.string().min(5).max(200)
  ),
  message: z.preprocess(
    val => sanitizeInput(val, 'string'),
    z.string().min(10).max(1000)
  ),
  phone: z.preprocess(
    val => sanitizeInput(val, 'phone'),
    z.string().optional()
  ),
  newsletter: z.boolean().optional(),
});

export const POST = withSecurity(
  async (request: NextRequest) => {
    try {
      const body = await request.json();

      // Validate and sanitize input
      const validatedData = sanitizedContactSchema.parse(body);

      // Additional security checks
      const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

      // Check for spam patterns
      if (
        isSpamContent(validatedData.message) ||
        isSpamContent(validatedData.subject)
      ) {
        securityMonitor.logEvent({
          type: SecurityEventType.SUSPICIOUS_REQUEST,
          severity: 'medium',
          message: 'Potential spam detected in contact form',
          metadata: { email: validatedData.email },
          ip,
        });

        return NextResponse.json(
          { error: 'Message appears to be spam' },
          { status: 400 }
        );
      }

      // Process the contact form (send email, save to database, etc.)
      await processContactForm(validatedData);

      // Log successful submission
      console.log('Contact form submitted:', {
        email: validatedData.email,
        subject: validatedData.subject,
        ip,
      });

      return NextResponse.json(
        {
          message: 'Message sent successfully',
          id: `contact-${Date.now()}`,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Contact API error:', error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation error',
            details: error.errors,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  {
    rateLimiter: contactRateLimit,
    cors: true,
  }
);

function isSpamContent(content: string): boolean {
  const spamPatterns = [
    /viagra|cialis|pharmacy|casino|poker|lottery/i,
    /click here|act now|limited time|urgent/i,
    /make money|work from home|get rich/i,
    /free gift|congratulations|winner/i,
    /(https?:\/\/[^\s]+){3,}/i, // Multiple URLs
  ];

  return spamPatterns.some(pattern => pattern.test(content));
}

async function processContactForm(
  data: z.infer<typeof sanitizedContactSchema>
) {
  // Implement your contact form processing logic here
  // e.g., send email, save to database, etc.
  console.log('Processing contact form:', data);
}
```

### 10. Security Configuration Documentation

Create `docs/SECURITY.md`:

````markdown
# Security Guide

## Overview

This document outlines the security measures implemented in the application and provides guidelines for maintaining security best practices.

## Security Features

### 1. Content Security Policy (CSP)

- Prevents XSS attacks by controlling resource loading
- Configured in `src/middleware.ts`
- Different policies for development and production

### 2. Rate Limiting

- Prevents abuse and DoS attacks
- Different limits for various endpoints
- IP-based tracking with automatic cleanup

### 3. Input Sanitization

- All user inputs are sanitized and validated
- Uses Zod for schema validation
- DOMPurify for HTML sanitization

### 4. Authentication Security

- Password strength requirements
- Account lockout after failed attempts
- Secure session management
- JWT with proper expiration

### 5. Security Headers

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HTTPS only)
- Referrer-Policy: origin-when-cross-origin

## Environment Variables

### Required Security Variables

```bash
JWT_SECRET=your-jwt-secret-32-chars-min
SESSION_SECRET=your-session-secret-32-chars-min
API_SECRET_KEY=your-api-secret-20-chars-min
```
````

### Optional Security Variables

```bash
WEBHOOK_SECRET=your-webhook-secret
ENCRYPTION_KEY=your-encryption-key
SECURITY_WEBHOOK_URL=https://your-monitoring-service.com/webhook
```

## Best Practices

### 1. Input Validation

- Always validate and sanitize user inputs
- Use Zod schemas for validation
- Never trust client-side validation alone

### 2. Authentication

- Implement strong password requirements
- Use secure session management
- Implement account lockout mechanisms

### 3. Authorization

- Check permissions for every request
- Use role-based access control
- Validate user permissions server-side

### 4. Data Protection

- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper CORS policies

### 5. Monitoring

- Log security events
- Monitor for suspicious patterns
- Set up alerts for critical events

## Security Checklist

- [ ] Environment variables properly configured
- [ ] CSP headers configured
- [ ] Rate limiting implemented
- [ ] Input sanitization active
- [ ] Security monitoring enabled
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Authentication security implemented
- [ ] Regular security audits performed

## Incident Response

### 1. Detection

- Monitor security logs
- Watch for unusual patterns
- Check monitoring alerts

### 2. Response

- Block malicious IPs temporarily
- Investigate the incident
- Document findings

### 3. Recovery

- Fix identified vulnerabilities
- Update security measures
- Review and improve processes

## Security Updates

- Regularly update dependencies
- Monitor security advisories
- Apply security patches promptly
- Review and update security policies

## Contact

For security issues, contact: security@yourapp.com

````

## Acceptance Criteria

- [ ] Content Security Policy configured and working
- [ ] CORS headers properly set for API endpoints
- [ ] Rate limiting prevents abuse across different endpoints
- [ ] All user inputs are sanitized and validated
- [ ] Environment variables are validated and secured
- [ ] Security headers are properly configured
- [ ] Authentication includes proper security measures
- [ ] Security monitoring logs suspicious activities
- [ ] API endpoints are protected with security middleware
- [ ] Security documentation is comprehensive

## Testing Instructions

### 1. Test CSP Configuration
```bash
# Check CSP headers in browser developer tools
# Try loading external scripts (should be blocked)
# Verify inline scripts work in development
````

### 2. Test Rate Limiting

```bash
# Make rapid requests to API endpoints
# Verify 429 responses after limit
# Check X-RateLimit-* headers
```

### 3. Test Input Sanitization

```bash
# Submit forms with malicious input
# Verify XSS attempts are blocked
# Check SQL injection patterns are caught
```

### 4. Test Security Headers

```bash
# Check response headers
curl -I https://yourapp.com/
# Verify all security headers present
```

### 5. Test Security Monitoring

```bash
# Trigger security events
# Check logs for proper recording
# Verify alerts are sent
```

## References and Dependencies

### Dependencies

- `isomorphic-dompurify`: HTML sanitization
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT handling
- `zod`: Input validation

### Documentation

- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Security Headers](https://securityheaders.com/)

## Estimated Time

**10-12 hours**

- CSP and headers configuration: 2-3 hours
- Rate limiting implementation: 2-3 hours
- Input sanitization: 2-3 hours
- Authentication security: 2-3 hours
- Security monitoring: 2-3 hours
- Documentation and testing: 2-3 hours

## Troubleshooting

### Common Issues

1. **CSP blocking legitimate resources**
   - Check browser console for violations
   - Update CSP policy to allow required sources
   - Use nonces or hashes for inline scripts

2. **Rate limiting too aggressive**
   - Adjust rate limit thresholds
   - Check IP detection logic
   - Consider user-based instead of IP-based limits

3. **Input sanitization breaking functionality**
   - Review sanitization rules
   - Test with various input types
   - Adjust validation schemas

4. **Authentication security issues**
   - Verify JWT secrets are properly configured
   - Check session cookie settings
   - Test password validation rules

5. **Security monitoring false positives**
   - Review detection patterns
   - Adjust alerting thresholds
   - Filter out legitimate bot traffic
