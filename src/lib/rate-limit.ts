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