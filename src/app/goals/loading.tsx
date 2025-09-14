/**
 * Goals Loading Component
 *
 * Loading state for the goals section with skeleton loaders
 * that match the layout and structure of the goals list page.
 */

import { Target, TrendingUp, Clock, Users } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// =============================================================================
// Loading Components
// =============================================================================

const GoalsHeaderSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 pb-4">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between space-x-4">
        {/* Search */}
        <Skeleton className="h-10 w-full max-w-md" />

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <Separator />
    </div>
  );
};

const StatsCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[Target, TrendingUp, Clock, Users].map((Icon, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <Skeleton className="h-6 w-8 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const GoalCardSkeleton: React.FC = () => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center space-x-1">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GoalListSkeleton: React.FC = () => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          {/* Goal Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Metrics */}
          <div className="flex items-center space-x-4">
            {/* Progress */}
            <div className="min-w-[120px] space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>

            {/* SMART Score */}
            <Skeleton className="h-6 w-12" />

            {/* Status */}
            <Skeleton className="h-6 w-16" />

            {/* Due Date */}
            <div className="text-right min-w-[80px] space-y-1">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-4 w-12" />
            </div>

            {/* Owner */}
            <Skeleton className="h-8 w-8 rounded-full" />

            {/* Actions */}
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// Main Loading Component
// =============================================================================

export default function GoalsLoading() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <GoalsHeaderSkeleton />

      <main className="mt-6 space-y-6">
        {/* Stats Cards */}
        <StatsCardsSkeleton />

        {/* Filters and Sort */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-12" />
        </div>

        {/* Goals Grid - Default to grid view skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <GoalCardSkeleton key={index} />
          ))}
        </div>

        {/* Alternative: Goals List View Skeleton */}
        {/* Uncomment this and comment the grid above for list view skeleton */}
        {/*
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <GoalListSkeleton key={index} />
          ))}
        </div>
        */}

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-20" />
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-10" />
              ))}
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </main>
    </div>
  );
}