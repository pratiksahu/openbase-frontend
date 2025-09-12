import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://api.vercel.com https://vercel.live https://www.google-analytics.com https://vitals.vercel-insights.com;
    media-src 'self';
    worker-src 'self' blob:;
    child-src 'self';
    manifest-src 'self';
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
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