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