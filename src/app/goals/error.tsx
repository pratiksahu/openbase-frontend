/**
 * Goals Error Component
 *
 * Error boundary for the goals section with recovery actions
 * and user-friendly error messages.
 */

'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw, Home, Bug } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// =============================================================================
// Types
// =============================================================================

interface GoalsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// =============================================================================
// Error Classification
// =============================================================================

const classifyError = (error: Error) => {
  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch')) {
    return {
      type: 'network',
      title: 'Connection Problem',
      description: 'Unable to connect to the server. Please check your internet connection and try again.',
      icon: AlertTriangle,
      color: 'text-orange-600',
      suggestions: [
        'Check your internet connection',
        'Try refreshing the page',
        'Contact support if the problem persists',
      ],
    };
  }

  if (message.includes('auth') || message.includes('unauthorized') || message.includes('forbidden')) {
    return {
      type: 'auth',
      title: 'Authentication Error',
      description: 'You need to be logged in to view your goals.',
      icon: AlertTriangle,
      color: 'text-red-600',
      suggestions: [
        'Please log in to your account',
        'Check if your session has expired',
        'Contact support if you continue having issues',
      ],
    };
  }

  if (message.includes('not found') || message.includes('404')) {
    return {
      type: 'notfound',
      title: 'Content Not Found',
      description: 'The goals you\'re looking for could not be found.',
      icon: AlertTriangle,
      color: 'text-blue-600',
      suggestions: [
        'Check if the URL is correct',
        'Try going back to the main goals page',
        'The content might have been moved or deleted',
      ],
    };
  }

  // Default generic error
  return {
    type: 'generic',
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred while loading your goals.',
    icon: Bug,
    color: 'text-gray-600',
    suggestions: [
      'Try refreshing the page',
      'Clear your browser cache',
      'Try again in a few minutes',
    ],
  };
};

// =============================================================================
// Error Actions Component
// =============================================================================

interface ErrorActionsProps {
  onReset: () => void;
  errorType: string;
}

const ErrorActions: React.FC<ErrorActionsProps> = ({ onReset, errorType }) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportError = () => {
    // In a real app, this would open a support form or send to an error tracking service
    const subject = encodeURIComponent('Goals Page Error Report');
    const body = encodeURIComponent(`I encountered an error on the Goals page.\n\nError Type: ${errorType}\n\nPlease help me resolve this issue.`);
    window.location.href = `mailto:support@openbase.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button onClick={onReset} className="flex items-center">
        <RefreshCcw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
      <Button variant="outline" onClick={handleGoHome}>
        <Home className="h-4 w-4 mr-2" />
        Go Home
      </Button>
      <Button variant="ghost" onClick={handleReportError} size="sm">
        <Bug className="h-4 w-4 mr-2" />
        Report Issue
      </Button>
    </div>
  );
};

// =============================================================================
// Error Details Component
// =============================================================================

interface ErrorDetailsProps {
  error: Error;
  digest?: string;
}

const ErrorDetails: React.FC<ErrorDetailsProps> = ({ error, digest }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="text-muted-foreground"
      >
        {showDetails ? 'Hide' : 'Show'} Error Details
      </Button>

      {showDetails && (
        <Card className="mt-3 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-sm">Technical Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Error Message</h4>
              <p className="text-sm font-mono bg-muted p-2 rounded">{error.message}</p>
            </div>

            {digest && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Error ID</h4>
                <p className="text-sm font-mono bg-muted p-2 rounded">{digest}</p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Timestamp</h4>
              <p className="text-sm">{new Date().toISOString()}</p>
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              <p>
                Please include this information when reporting the issue to our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// =============================================================================
// Main Error Component
// =============================================================================

export default function GoalsError({ error, reset }: GoalsErrorProps) {
  const errorInfo = classifyError(error);
  const Icon = errorInfo.icon;

  React.useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Goals page error:', error);
    }

    // In production, you would send this to your error tracking service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    // trackError('goals_page_error', error, { digest: error.digest });
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <div className="mb-6">
            <Icon className={`h-16 w-16 mx-auto mb-4 ${errorInfo.color}`} />
            <div className="flex items-center justify-center mb-2">
              <h1 className="text-2xl font-bold mr-3">{errorInfo.title}</h1>
              <Badge variant="outline" className="capitalize">
                {errorInfo.type} Error
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">
              {errorInfo.description}
            </p>
          </div>

          {/* Suggestions */}
          <Card className="mb-6 text-left">
            <CardHeader>
              <CardTitle className="text-lg">What can you do?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {errorInfo.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <ErrorActions onReset={reset} errorType={errorInfo.type} />

          {/* Error Details */}
          <ErrorDetails error={error} digest={error.digest} />

          {/* Help Section */}
          <div className="mt-8 p-4 bg-muted/20 rounded-lg">
            <h3 className="font-medium mb-2">Still need help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Our support team is here to help you get back on track with your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <Button variant="link" size="sm" asChild>
                <a href="/help" target="_blank" rel="noopener noreferrer">
                  Visit Help Center
                </a>
              </Button>
              <Button variant="link" size="sm" asChild>
                <a href="/contact" target="_blank" rel="noopener noreferrer">
                  Contact Support
                </a>
              </Button>
              <Button variant="link" size="sm" asChild>
                <a href="/status" target="_blank" rel="noopener noreferrer">
                  System Status
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}