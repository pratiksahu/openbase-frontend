/**
 * Test utilities for React components
 * Re-exports testing-library functions with custom render method
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import React, { ReactElement } from 'react';

// Define the interface for providers wrapper
interface ProvidersProps {
  children: React.ReactNode;
}

// Providers wrapper for tests
const AllTheProviders = ({ children }: ProvidersProps): React.JSX.Element => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render };