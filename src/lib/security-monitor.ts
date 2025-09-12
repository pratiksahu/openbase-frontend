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
      if (env.SECURITY_WEBHOOK_URL) {
        fetch(env.SECURITY_WEBHOOK_URL, {
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