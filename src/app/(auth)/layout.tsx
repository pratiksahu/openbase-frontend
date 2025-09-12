import { ReactNode } from 'react';

import { Container } from '@/components/layout/Container';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="bg-background flex min-h-screen items-center justify-center p-4"
      data-testid="auth-layout"
    >
      <Container size="sm" padding="md">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
