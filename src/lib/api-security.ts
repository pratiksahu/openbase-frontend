import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { withCors } from './cors';
import { withRateLimit, apiRateLimit } from './rate-limit';
import { logSuspiciousRequest } from './security-monitor';

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
    // IP unblocked: ${ip}
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
