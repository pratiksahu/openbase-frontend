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
    .replace(/[<>"'%;()&+]/g, '') // Remove dangerous characters
    .trim()
    .slice(0, 1000); // Limit length
}

// Sanitize SQL inputs (for raw queries)
export function sanitizeSql(input: string): string {
  return input
    .replace(/[;'"\\]/g, '') // Remove SQL injection characters
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
            details: error.issues,
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
