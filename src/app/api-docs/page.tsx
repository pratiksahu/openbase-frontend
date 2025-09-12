'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch('/api/swagger');
        if (!response.ok) {
          throw new Error('Failed to fetch API specification');
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load API documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground">API Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive API documentation for OpenBase v2. Explore endpoints, test requests, and understand response formats.
          </p>
        </div>
        
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🔐 Authentication</CardTitle>
              <CardDescription className="text-sm">
                Secure endpoints with JWT tokens and API keys
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">👥 User Management</CardTitle>
              <CardDescription className="text-sm">
                Create, read, update, and manage user accounts
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🏥 Health Checks</CardTitle>
              <CardDescription className="text-sm">
                Monitor system status and API availability
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="swagger-ui-container">
          {spec && (
            <SwaggerUI 
              spec={spec} 
              tryItOutEnabled={true}
              displayRequestDuration={true}
              docExpansion="list"
              filter={true}
              showExtensions={true}
              showCommonExtensions={true}
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        .swagger-ui-container .swagger-ui {
          font-family: inherit;
        }
        .swagger-ui-container .swagger-ui .topbar {
          display: none;
        }
        .swagger-ui-container .swagger-ui .info {
          margin: 20px 0;
        }
        .swagger-ui-container .swagger-ui .scheme-container {
          background: transparent;
          box-shadow: none;
          border: 1px solid var(--border);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}