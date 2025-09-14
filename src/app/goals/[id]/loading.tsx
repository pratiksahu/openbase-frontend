/**
 * Goal Detail Loading Component
 *
 * Loading state for individual goal pages with skeleton loaders
 * that match the layout of goal detail pages.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// =============================================================================
// Loading Components
// =============================================================================

const BreadcrumbSkeleton: React.FC = () => {
  return (
    <nav className="flex items-center space-x-1 text-sm">
      <Skeleton className="h-4 w-12" />
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <Skeleton className="h-4 w-12" />
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <Skeleton className="h-4 w-32" />
    </nav>
  );
};

const GoalHeaderSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <BreadcrumbSkeleton />

      {/* Back Button */}
      <div className="flex items-center">
        <ChevronLeft className="h-4 w-4 mr-2 text-muted-foreground" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Header Content */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-12" />
          </div>

          <Skeleton className="h-5 w-3/4" />

          {/* Status and Meta Info */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-16" />
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </div>

        {/* Action Menu */}
        <div className="flex items-center space-x-2">
          {/* Team Members */}
          <div className="flex items-center -space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      <Separator />
    </div>
  );
};

const NavigationTabsSkeleton: React.FC = () => {
  return (
    <Tabs value="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        {['Overview', 'Canvas', 'Board', 'Metrics', 'Review'].map((tab) => (
          <TabsTrigger key={tab} value={tab.toLowerCase()} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <span className="hidden sm:inline">{tab}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

const OverviewContentSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* SMART Criteria */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-12" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Skeleton className="flex-shrink-0 w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-0.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Skeleton key={i} className="h-3 w-3" />
                        ))}
                      </div>
                      <Skeleton className="h-3 w-8" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Breakdown Tree Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2 pl-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Next Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded">
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-12" />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded">
                    <Skeleton className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// =============================================================================
// Main Loading Component
// =============================================================================

export default function GoalDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Goal Header */}
        <GoalHeaderSkeleton />

        {/* Navigation Tabs */}
        <NavigationTabsSkeleton />

        {/* Main Content */}
        <main className="mt-6">
          <OverviewContentSkeleton />
        </main>
      </div>
    </div>
  );
}