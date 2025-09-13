import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Components Test - Modern Next.js App',
  description: 'Test page for UI components',
};

export default function ComponentsTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
