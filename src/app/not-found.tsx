'use client';

import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div
      className="flex min-h-[600px] flex-col items-center justify-center"
      data-testid="not-found"
    >
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-muted-foreground/20 mb-2 text-9xl font-bold">
          404
        </h1>
        <h2 className="mb-4 text-3xl font-bold">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
