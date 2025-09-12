'use client';

import { WifiIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';


import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setLastUpdate(new Date().toLocaleString());

    const handleOnline = () => {
      setIsOnline(true);
      // Refresh the page when back online
      window.location.reload();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <Section className="flex min-h-screen items-center justify-center">
      <Container size="md" className="text-center">
        <div className="space-y-6">
          {/* Offline Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <WifiIcon className="h-24 w-24 text-muted-foreground" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-1 w-8 rotate-45 transform bg-destructive"></div>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              You&apos;re offline
            </h1>
            <p className="mx-auto max-w-md text-lg text-muted-foreground">
              It looks like you&apos;ve lost your internet connection.
              Don&apos;t worry, you can still browse cached content.
            </p>
          </div>

          {/* Status */}
          <div className="mx-auto max-w-sm rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span
                className={`font-medium ${
                  isOnline ? 'text-green-600' : 'text-destructive'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            {lastUpdate && (
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last update:</span>
                <span className="font-medium">{lastUpdate}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleRetry}
              disabled={!isOnline}
              className="flex items-center space-x-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Try Again</span>
            </Button>

            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>

          {/* Cached Content Info */}
          <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-900/20">
            <h3 className="mb-2 font-semibold">Available offline:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Recently visited pages</li>
              <li>• Cached images and resources</li>
              <li>• Form submissions (will sync when online)</li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}