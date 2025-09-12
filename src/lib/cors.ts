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