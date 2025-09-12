import dynamic from 'next/dynamic';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
  </div>
);

// Dynamically imported components for code splitting
// These are examples of how to use dynamic imports - uncomment and modify as needed

/*
export const DynamicChart = dynamic(
  () => import('@/components/charts/Chart').then(mod => mod.Chart),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Disable SSR for client-side only components
  }
);

export const DynamicDataTable = dynamic(
  () => import('@/components/tables/DataTable').then(mod => mod.DataTable),
  {
    loading: () => <LoadingSpinner />,
  }
);

export const DynamicModal = dynamic(
  () => import('@/components/ui/Modal').then(mod => mod.Modal),
  {
    loading: () => (
      <div className="bg-background/80 fixed inset-0 backdrop-blur-sm" />
    ),
  }
);

export const DynamicCodeEditor = dynamic(
  () => import('@/components/editors/CodeEditor').then(mod => mod.CodeEditor),
  {
    loading: () => (
      <div className="bg-muted flex h-96 items-center justify-center rounded-lg">
        <LoadingSpinner />
      </div>
    ),
    ssr: false,
  }
);

// Heavy feature components
export const DynamicDashboardAnalytics = dynamic(
  () => import('@/components/dashboard/Analytics').then(mod => mod.Analytics),
  {
    loading: () => <LoadingSpinner />,
  }
);

export const DynamicFileUploader = dynamic(
  () => import('@/components/forms/FileUploader').then(mod => mod.FileUploader),
  {
    loading: () => <div className="bg-muted h-32 animate-pulse rounded-lg" />,
  }
);
*/

// Create a higher-order component for dynamic loading
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withDynamicLoading<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  loadingComponent?: () => React.ReactElement,
  options?: {
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: loadingComponent || (() => <LoadingSpinner />),
    ssr: options?.ssr ?? true,
  });
}

// Example usage in a page component:
// const HeavyComponent = withDynamicLoading(
//   () => import('@/components/HeavyComponent'),
//   () => <div>Loading...</div>,
//   { ssr: false }
// );
