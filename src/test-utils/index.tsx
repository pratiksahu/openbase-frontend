import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

import { ThemeProvider } from '@/components/providers/theme-provider';

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  router?: {
    pathname?: string;
    query?: Record<string, string>;
  };
}

function AllTheProviders({ children }: { children: ReactNode }) {
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
}

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { ...renderOptions } = options || {};

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllTheProviders>{children}</AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };