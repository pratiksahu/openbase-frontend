import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Section className="flex min-h-screen items-center justify-center">
      <Container className="text-center" data-testid="404-page">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-muted-foreground text-6xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground mx-auto max-w-md">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild>
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => history.back()}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="mt-8">
            <p className="text-muted-foreground text-sm">
              If you think this is an error, please{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact our support team
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}