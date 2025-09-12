# Security Guide

## Overview

This document outlines the security measures implemented in the application and provides guidelines for maintaining security best practices.

## Security Features

### 1. Content Security Policy (CSP)

- Prevents XSS attacks by controlling resource loading
- Configured in `src/middleware.ts`
- Different policies for development and production
- Allows trusted sources for scripts, styles, and other resources

### 2. Rate Limiting

- Prevents abuse and DoS attacks
- Different limits for various endpoints:
  - API endpoints: 100 requests per minute
  - Authentication: 5 attempts per 15 minutes
  - Contact form: 3 submissions per hour
- IP-based tracking with automatic cleanup

### 3. Input Sanitization

- All user inputs are sanitized and validated
- Uses Zod for schema validation
- DOMPurify for HTML sanitization
- Removes dangerous characters and patterns

### 4. Authentication Security

- Password strength requirements (8+ chars, complexity)
- Account lockout after failed attempts (5 attempts, 15min lockout)
- Secure session management with HTTP-only cookies
- JWT with proper expiration and validation

### 5. Security Headers

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME confusion
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Strict-Transport-Security` - HTTPS enforcement (production)
- `Referrer-Policy: origin-when-cross-origin` - Controls referrer info

### 6. CORS Configuration

- Configurable origin whitelist
- Proper preflight handling
- Credential support control
- Method and header restrictions

### 7. Security Monitoring

- Real-time security event logging
- Automatic alerting for suspicious patterns
- IP-based temporary blocking
- Integration with monitoring services

## Environment Variables

### Required Security Variables

```bash
# Authentication secrets (32+ characters)
JWT_SECRET=your-jwt-secret-32-chars-minimum
SESSION_SECRET=your-session-secret-32-chars-minimum
NEXTAUTH_SECRET=your-nextauth-secret-32-chars-minimum

# API security (20+ characters)  
API_SECRET_KEY=your-api-secret-20-chars-minimum
WEBHOOK_SECRET=your-webhook-secret-20-chars-minimum

# Encryption (32+ characters)
ENCRYPTION_KEY=your-encryption-key-32-chars-minimum
```

### Optional Security Variables

```bash
# Database security
DATABASE_SSL=true

# Security features
ENABLE_RATE_LIMITING=true
ENABLE_CORS=true  
SECURITY_HEADERS=true
SECURITY_LOG_LEVEL=warn

# Monitoring
SECURITY_WEBHOOK_URL=https://your-monitoring-service.com/webhook

# Development only
DISABLE_HTTPS_REDIRECT=false
```

## Best Practices

### 1. Input Validation

- Always validate and sanitize user inputs
- Use Zod schemas for validation
- Never trust client-side validation alone
- Implement server-side sanitization

```typescript
import { sanitizeInput, sanitizedEmail } from '@/lib/sanitization';

// Sanitize strings
const cleanString = sanitizeInput(userInput, 'string');

// Use sanitized schemas
const schema = z.object({
  email: sanitizedEmail,
  message: sanitizedString(10, 1000),
});
```

### 2. Authentication

- Implement strong password requirements
- Use secure session management  
- Implement account lockout mechanisms
- Validate JWT tokens properly

```typescript
import { PasswordSecurity, JWTSecurity } from '@/lib/auth-security';

// Hash passwords securely
const hashedPassword = await PasswordSecurity.hash(password);

// Create secure JWT tokens
const token = JWTSecurity.sign({ userId }, '1h');
```

### 3. API Security

- Apply security middleware to all API routes
- Use rate limiting for public endpoints
- Implement proper CORS policies
- Log security events

```typescript
import { withSecurity } from '@/lib/api-security';
import { apiRateLimit } from '@/lib/rate-limit';

export const POST = withSecurity(
  async (request) => {
    // Your API logic
  },
  {
    rateLimiter: apiRateLimit,
    cors: true,
  }
);
```

### 4. Data Protection

- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper CORS policies
- Validate SSL certificates

### 5. Monitoring

- Log security events consistently
- Monitor for suspicious patterns
- Set up alerts for critical events
- Regular security audits

```typescript
import { securityMonitor, SecurityEventType } from '@/lib/security-monitor';

// Log security events
securityMonitor.logEvent({
  type: SecurityEventType.FAILED_LOGIN,
  severity: 'medium',
  message: 'Failed login attempt',
  ip: clientIP,
});
```

## Security Checklist

- [ ] Environment variables properly configured
- [ ] CSP headers configured and tested
- [ ] Rate limiting implemented on all public endpoints
- [ ] Input sanitization active on all forms
- [ ] Security monitoring enabled and configured
- [ ] HTTPS enforced in production
- [ ] Security headers configured and verified
- [ ] Authentication security implemented
- [ ] Password policies enforced
- [ ] Account lockout mechanisms active
- [ ] JWT tokens properly validated
- [ ] CORS policies configured
- [ ] Regular security audits performed
- [ ] Dependencies regularly updated

## Incident Response

### 1. Detection

- Monitor security logs regularly
- Watch for unusual patterns in metrics
- Check monitoring alerts promptly
- Review failed authentication attempts

### 2. Response

- Block malicious IPs temporarily
- Investigate the incident thoroughly
- Document findings and actions taken
- Notify relevant stakeholders

### 3. Recovery

- Fix identified vulnerabilities
- Update security measures as needed
- Review and improve security processes
- Conduct post-incident analysis

## Security Testing

### 1. Automated Testing

```bash
# Test rate limiting
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","message":"test"}' \
  --rate 10

# Test input sanitization
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"<script>alert(1)</script>","message":"test"}'

# Test CSP
# Check browser developer tools for CSP violations
```

### 2. Manual Testing

- Test XSS injection attempts
- Verify SQL injection protection
- Check CSRF protection
- Test authentication bypass attempts
- Verify authorization controls

### 3. Security Scans

- Use automated security scanners
- Perform dependency vulnerability scans
- Run OWASP ZAP or similar tools
- Conduct penetration testing

## Security Updates

### Regular Maintenance

- Update dependencies monthly
- Monitor security advisories
- Apply security patches promptly
- Review and update security policies quarterly

### Dependency Management

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

### Monitoring Security

- Set up alerts for dependency vulnerabilities
- Monitor CVE databases for relevant threats
- Subscribe to security newsletters
- Regular security training for team

## Compliance

### Data Protection

- Implement data minimization
- Provide data export functionality
- Enable data deletion requests
- Maintain audit logs

### Privacy

- Clear privacy policy
- Cookie consent management
- Data processing transparency
- User consent tracking

## Contact

For security issues or questions:
- Security team: security@yourapp.com
- Bug bounty: security-reports@yourapp.com

**Do not disclose security vulnerabilities publicly.**