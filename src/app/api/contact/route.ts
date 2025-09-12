import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { withSecurity } from '@/lib/api-security';
import { contactRateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/sanitization';
import { securityMonitor, SecurityEventType } from '@/lib/security-monitor';

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
            details: error.issues,
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

  // TODO: Implement email service
  // TODO: Save to database if needed
}