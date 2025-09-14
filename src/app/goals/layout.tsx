/**
 * Goals Layout Component
 *
 * Main layout for the SMART Goals section with navigation, breadcrumbs,
 * and consistent UI structure across all goal-related pages.
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Plus, Filter, Grid, List, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { Toggle } from '@/components/ui/toggle'; // TODO: Add toggle component

export const metadata: Metadata = {
  title: {
    template: '%s | Goals | OpenBase',
    default: 'Goals | OpenBase',
  },
  description: 'Manage your SMART goals with comprehensive tracking and analysis.',
};

interface GoalsLayoutProps {
  children: React.ReactNode;
}

// =============================================================================
// Breadcrumb Component
// =============================================================================

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />

      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href && !item.current ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? 'text-foreground font-medium' : ''}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </React.Fragment>
      ))}
    </nav>
  );
};

// =============================================================================
// Goals Header Component
// =============================================================================

const GoalsHeader: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 pb-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Goals', href: '/goals' },
        ]}
      />

      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">
            Create, track, and achieve your SMART goals
          </p>
        </div>

        <Button asChild className="flex items-center space-x-2">
          <Link href="/goals/new">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Link>
        </Button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search goals..."
            className="pl-10"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                All Goals
              </DropdownMenuItem>
              <DropdownMenuItem>
                Active Goals
              </DropdownMenuItem>
              <DropdownMenuItem>
                Completed Goals
              </DropdownMenuItem>
              <DropdownMenuItem>
                Draft Goals
              </DropdownMenuItem>
              <DropdownMenuItem>
                My Goals
              </DropdownMenuItem>
              <DropdownMenuItem>
                Team Goals
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle - TODO: Add toggle component */}
          <div className="flex items-center border rounded-md">
            <Button variant="outline" size="sm" className="rounded-r-none border-r">
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-l-none">
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      <Separator />
    </div>
  );
};

// =============================================================================
// Main Layout Component
// =============================================================================

export default function GoalsLayout({ children }: GoalsLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <GoalsHeader />

      <main className="mt-6">
        {children}
      </main>
    </div>
  );
}