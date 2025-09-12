import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { contactSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body against schema
    contactSchema.parse(body);

    // TODO: Implement your email service here
    // TODO: Process validated form data

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Send email using your preferred service
    // Examples: SendGrid, Nodemailer, AWS SES, etc.

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
          message: 'Validation error',
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
