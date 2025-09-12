'use client';

import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: ReactNode;
  current?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

const defaultNavigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: <ChartBarIcon className="h-5 w-5" />,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: <UserIcon className="h-5 w-5" />,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: <CogIcon className="h-5 w-5" />,
  },
];

const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = defaultNavigation.map(item => ({
    ...item,
    current: pathname === item.href,
  }));

  return (
    <div className="bg-background min-h-screen" data-testid="dashboard-layout">
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
      >
        <div
          className="bg-background/80 fixed inset-0 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
        <div className="bg-card border-border fixed inset-y-0 left-0 w-64 border-r">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-lg font-semibold">Dashboard</span>
            <button
              type="button"
              className="hover:bg-accent rounded-md p-2"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-2 px-4">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  item.current
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className="lg:bg-card lg:border-border hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:border-r"
        data-testid="dashboard-sidebar"
      >
        <div className="border-border flex h-16 items-center border-b px-4">
          <span className="text-lg font-semibold">Dashboard</span>
        </div>
        <nav className="space-y-2 px-4 py-4">
          {navigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                item.current
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        {sidebar && (
          <div className="border-border mt-auto border-t px-4 py-4">
            {sidebar}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border sticky top-0 z-30 flex h-16 items-center border-b px-4 backdrop-blur">
          <button
            type="button"
            className="hover:bg-accent rounded-md p-2 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          {/* Add top bar content here */}
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8" data-testid="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };
