'use client';

import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex min-h-[400px] flex-col items-center justify-center"
      data-testid="error-boundary"
    >
      <div className="mx-auto max-w-md text-center">
        <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive h-6 w-6" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground mb-4">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
      </div>
    </div>
  );
}
