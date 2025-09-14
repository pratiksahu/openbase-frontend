/**
 * Error Handler Utilities - Centralized Error Management
 *
 * This module provides utilities for error handling and recovery:
 * - Error classification and typing
 * - Error recovery strategies
 * - Retry mechanisms
 * - Offline detection and handling
 * - Error reporting and logging
 *
 * @fileoverview Error handling utilities for robust error management
 * @version 1.0.0
 */

// =============================================================================
// Types and Interfaces
// =============================================================================

export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  TIMEOUT = 'timeout',
  OFFLINE = 'offline',
  UNKNOWN = 'unknown',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError?: Error;
  statusCode?: number;
  retryable: boolean;
  userFriendly: boolean;
  context?: Record<string, any>;
  timestamp: Date;
  stack?: string;
}

export interface ErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  retryCondition?: (error: AppError) => boolean;
  onRetry?: (attempt: number, error: AppError) => void;
  onMaxRetriesReached?: (error: AppError) => void;
}

export interface ErrorReportingOptions {
  includeUserAgent?: boolean;
  includeUrl?: boolean;
  includeTimestamp?: boolean;
  includeContext?: boolean;
  anonymize?: boolean;
}

// =============================================================================
// Error Classification
// =============================================================================

export class ErrorClassifier {
  static classifyError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return this.classifyJavaScriptError(error);
    }

    if (typeof error === 'object' && error !== null) {
      return this.classifyApiError(error);
    }

    return this.createUnknownError(error);
  }

  private static classifyJavaScriptError(error: Error): AppError {
    let type = ErrorType.CLIENT;
    let severity = ErrorSeverity.MEDIUM;
    let retryable = false;

    // Network errors
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      type = ErrorType.NETWORK;
      retryable = true;
    }

    // Timeout errors
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      type = ErrorType.TIMEOUT;
      retryable = true;
    }

    // Type errors (usually programming errors)
    if (error.name === 'TypeError') {
      severity = ErrorSeverity.HIGH;
    }

    // Reference errors (usually programming errors)
    if (error.name === 'ReferenceError') {
      severity = ErrorSeverity.CRITICAL;
    }

    return {
      type,
      severity,
      message: error.message,
      originalError: error,
      retryable,
      userFriendly: retryable,
      timestamp: new Date(),
      stack: error.stack,
    };
  }

  private static classifyApiError(error: any): AppError {
    const statusCode = error.status || error.statusCode || 0;
    let type = ErrorType.SERVER;
    let severity = ErrorSeverity.MEDIUM;
    let retryable = false;

    // Network errors
    if (statusCode === 0 || error.name === 'NetworkError') {
      type = ErrorType.NETWORK;
      retryable = true;
    }

    // Client errors
    if (statusCode >= 400 && statusCode < 500) {
      type = ErrorType.CLIENT;
      severity = ErrorSeverity.LOW;

      if (statusCode === 401) {
        type = ErrorType.AUTHENTICATION;
        severity = ErrorSeverity.HIGH;
      } else if (statusCode === 403) {
        type = ErrorType.AUTHORIZATION;
        severity = ErrorSeverity.HIGH;
      } else if (statusCode === 404) {
        type = ErrorType.NOT_FOUND;
      } else if (statusCode === 408) {
        type = ErrorType.TIMEOUT;
        retryable = true;
      } else if (statusCode === 422) {
        type = ErrorType.VALIDATION;
      } else if (statusCode === 429) {
        retryable = true;
      }
    }

    // Server errors
    if (statusCode >= 500) {
      type = ErrorType.SERVER;
      severity = ErrorSeverity.HIGH;
      retryable = true;
    }

    return {
      type,
      severity,
      message: error.message || `HTTP ${statusCode}: ${error.statusText || 'Unknown error'}`,
      originalError: error instanceof Error ? error : undefined,
      statusCode,
      retryable,
      userFriendly: true,
      timestamp: new Date(),
      context: {
        url: error.url,
        method: error.method,
        response: error.response,
      },
    };
  }

  private static createUnknownError(error: unknown): AppError {
    return {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: String(error) || 'An unknown error occurred',
      retryable: false,
      userFriendly: false,
      timestamp: new Date(),
    };
  }
}

// =============================================================================
// Error Recovery
// =============================================================================

export class ErrorRecovery {
  static async withRetry<T>(
    operation: () => Promise<T>,
    options: ErrorRecoveryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      exponentialBackoff = true,
      retryCondition = (error) => error.retryable,
      onRetry,
      onMaxRetriesReached,
    } = options;

    let lastError: AppError;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        return await operation();
      } catch (error) {
        lastError = ErrorClassifier.classifyError(error);

        // If it's not the last attempt and the error is retryable
        if (attempt < maxRetries && retryCondition(lastError)) {
          attempt++;
          onRetry?.(attempt, lastError);

          // Calculate delay with optional exponential backoff
          const delay = exponentialBackoff
            ? retryDelay * Math.pow(2, attempt - 1)
            : retryDelay;

          await this.sleep(delay);
          continue;
        }

        // Max retries reached or error not retryable
        if (attempt >= maxRetries) {
          onMaxRetriesReached?.(lastError);
        }

        throw lastError;
      }
    }

    throw lastError!;
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static createRetryCondition(
    types: ErrorType[],
    statusCodes?: number[]
  ): (error: AppError) => boolean {
    return (error: AppError) => {
      // Check error type
      if (types.includes(error.type)) {
        return true;
      }

      // Check status code if provided
      if (statusCodes && error.statusCode) {
        return statusCodes.includes(error.statusCode);
      }

      return false;
    };
  }
}

// =============================================================================
// Offline Detection and Handling
// =============================================================================

export class OfflineHandler {
  private static listeners: Array<(online: boolean) => void> = [];

  static initialize(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      this.notifyListeners(false);
    });
  }

  static isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  static onStatusChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private static notifyListeners(online: boolean): void {
    this.listeners.forEach(listener => {
      try {
        listener(online);
      } catch (error) {
        console.error('Error in offline status listener:', error);
      }
    });
  }

  static async waitForOnline(timeout?: number): Promise<boolean> {
    if (this.isOnline()) {
      return true;
    }

    return new Promise((resolve, reject) => {
      const cleanup = this.onStatusChange((online) => {
        if (online) {
          cleanup();
          if (timeoutId) clearTimeout(timeoutId);
          resolve(true);
        }
      });

      const timeoutId = timeout
        ? setTimeout(() => {
            cleanup();
            reject(new Error('Timeout waiting for online connection'));
          }, timeout)
        : null;
    });
  }
}

// =============================================================================
// Error Reporting
// =============================================================================

export class ErrorReporter {
  private static queue: AppError[] = [];
  private static isReporting = false;

  static report(error: AppError, options: ErrorReportingOptions = {}): void {
    const {
      includeUserAgent = true,
      includeUrl = true,
      includeTimestamp = true,
      includeContext = true,
      anonymize = false,
    } = options;

    // Enhance error with additional context
    const enhancedError = {
      ...error,
      ...(includeUserAgent && typeof navigator !== 'undefined' && {
        userAgent: navigator.userAgent,
      }),
      ...(includeUrl && typeof window !== 'undefined' && {
        url: window.location.href,
      }),
      ...(includeTimestamp && {
        reportedAt: new Date(),
      }),
      ...(includeContext && {
        viewport: this.getViewportInfo(),
        performance: this.getPerformanceInfo(),
      }),
    };

    // Anonymize if requested
    if (anonymize) {
      this.anonymizeError(enhancedError);
    }

    // Add to queue
    this.queue.push(enhancedError);

    // Process queue
    this.processQueue();
  }

  private static async processQueue(): Promise<void> {
    if (this.isReporting || this.queue.length === 0) {
      return;
    }

    this.isReporting = true;

    try {
      while (this.queue.length > 0) {
        const error = this.queue.shift()!;

        // In development, just log to console
        if (process.env.NODE_ENV === 'development') {
          console.group('🔴 Error Report');
          console.error(error);
          console.groupEnd();
          continue;
        }

        // In production, send to error reporting service
        try {
          await this.sendToReportingService(error);
        } catch (reportingError) {
          console.error('Failed to report error:', reportingError);
          // Re-queue the error for retry
          this.queue.unshift(error);
          break;
        }
      }
    } finally {
      this.isReporting = false;
    }
  }

  private static async sendToReportingService(error: AppError): Promise<void> {
    // This would integrate with your error reporting service
    // Examples: Sentry, LogRocket, Bugsnag, Rollbar, etc.

    // For now, we'll use a placeholder API call
    const response = await fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error),
    });

    if (!response.ok) {
      throw new Error(`Failed to report error: ${response.status}`);
    }
  }

  private static getViewportInfo() {
    if (typeof window === 'undefined') return null;

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    };
  }

  private static getPerformanceInfo() {
    if (typeof window === 'undefined' || !window.performance) return null;

    return {
      navigation: window.performance.navigation?.type,
      timing: window.performance.timing ? {
        loadEventEnd: window.performance.timing.loadEventEnd,
        domContentLoadedEventEnd: window.performance.timing.domContentLoadedEventEnd,
      } : null,
    };
  }

  private static anonymizeError(error: AppError): void {
    // Remove or hash sensitive information
    if (error.context?.url) {
      error.context.url = error.context.url.split('?')[0]; // Remove query params
    }

    if (error.message) {
      // Remove email patterns
      error.message = error.message.replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[EMAIL]');
      // Remove potential tokens
      error.message = error.message.replace(/\b[A-Za-z0-9]{20,}\b/g, '[TOKEN]');
    }
  }
}

// =============================================================================
// User-Friendly Error Messages
// =============================================================================

export class ErrorMessageFormatter {
  private static messages: Record<ErrorType, Record<string, string>> = {
    [ErrorType.NETWORK]: {
      title: 'Connection Problem',
      message: 'Please check your internet connection and try again.',
      action: 'Retry',
    },
    [ErrorType.TIMEOUT]: {
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.',
      action: 'Retry',
    },
    [ErrorType.AUTHENTICATION]: {
      title: 'Authentication Required',
      message: 'Please sign in to continue.',
      action: 'Sign In',
    },
    [ErrorType.AUTHORIZATION]: {
      title: 'Permission Denied',
      message: 'You don\'t have permission to perform this action.',
      action: 'Contact Support',
    },
    [ErrorType.NOT_FOUND]: {
      title: 'Not Found',
      message: 'The requested resource could not be found.',
      action: 'Go Back',
    },
    [ErrorType.VALIDATION]: {
      title: 'Invalid Data',
      message: 'Please check your input and try again.',
      action: 'Fix Errors',
    },
    [ErrorType.SERVER]: {
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      action: 'Retry',
    },
    [ErrorType.CLIENT]: {
      title: 'Request Error',
      message: 'There was a problem with your request. Please try again.',
      action: 'Retry',
    },
    [ErrorType.OFFLINE]: {
      title: 'No Internet Connection',
      message: 'You\'re currently offline. Please check your connection.',
      action: 'Retry When Online',
    },
    [ErrorType.UNKNOWN]: {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again.',
      action: 'Retry',
    },
  };

  static formatError(error: AppError): {
    title: string;
    message: string;
    action: string;
  } {
    const template = this.messages[error.type] || this.messages[ErrorType.UNKNOWN];

    return {
      title: template.title,
      message: error.userFriendly ? error.message : template.message,
      action: template.action,
    };
  }

  static getRecoveryAction(error: AppError): string {
    if (error.retryable) return 'retry';
    if (error.type === ErrorType.AUTHENTICATION) return 'authenticate';
    if (error.type === ErrorType.NOT_FOUND) return 'navigate_back';
    return 'reload';
  }
}

// =============================================================================
// Initialization
// =============================================================================

export function initializeErrorHandling(): void {
  // Initialize offline detection
  OfflineHandler.initialize();

  // Set up global error handlers
  if (typeof window !== 'undefined') {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = ErrorClassifier.classifyError(event.reason);
      ErrorReporter.report(error);
    });

    // Catch global JavaScript errors
    window.addEventListener('error', (event) => {
      const error = ErrorClassifier.classifyError(event.error);
      ErrorReporter.report(error);
    });
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

export function createAppError(
  type: ErrorType,
  message: string,
  options: Partial<AppError> = {}
): AppError {
  return {
    type,
    severity: ErrorSeverity.MEDIUM,
    message,
    retryable: false,
    userFriendly: true,
    timestamp: new Date(),
    ...options,
  };
}

export function isAppError(error: unknown): error is AppError {
  return typeof error === 'object' &&
         error !== null &&
         'type' in error &&
         'severity' in error &&
         'message' in error &&
         'timestamp' in error;
}

export { ErrorType, ErrorSeverity, ErrorClassifier, ErrorRecovery, OfflineHandler, ErrorReporter, ErrorMessageFormatter };