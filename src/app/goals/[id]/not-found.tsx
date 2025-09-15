/**
 * Goal Not Found Component
 *
 * 404 page for when a specific goal cannot be found.
 * Provides helpful navigation and suggestions.
 */

import { Search, Target, Plus, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// =============================================================================
// Not Found Component
// =============================================================================

export default function GoalNotFound() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-2xl text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <Target className="text-muted-foreground/30 mx-auto mb-4 h-24 w-24" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground/50 text-6xl font-bold">
                  404
                </span>
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold">Goal Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The goal you&apos;re looking for doesn&apos;t exist or may have
              been moved.
            </p>
          </div>

          {/* Possible Reasons */}
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle className="text-lg">
                What might have happened?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-primary mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full" />
                  <span className="text-sm">
                    The goal may have been deleted or archived
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full" />
                  <span className="text-sm">
                    You might not have permission to view this goal
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full" />
                  <span className="text-sm">
                    The URL might be incorrect or outdated
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full" />
                  <span className="text-sm">
                    The goal might have been moved to a different location
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Search Box */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Search className="mr-2 h-5 w-5" />
                Search for Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder="Search by goal title, description, or tags..."
                    className="pl-10"
                  />
                </div>
                <Button>Search</Button>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Try searching for keywords related to the goal you&apos;re
                looking for
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/goals" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Goals
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/goals/new" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create New Goal
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 text-center">
                <Target className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                <h3 className="mb-1 font-medium">Active Goals</h3>
                <p className="text-muted-foreground mb-3 text-xs">
                  View your currently active goals
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/goals?status=active">View Active</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 text-center">
                <Plus className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <h3 className="mb-1 font-medium">Goal Templates</h3>
                <p className="text-muted-foreground mb-3 text-xs">
                  Start with pre-built templates
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/templates">Browse Templates</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 text-center">
                <Search className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                <h3 className="mb-1 font-medium">Advanced Search</h3>
                <p className="text-muted-foreground mb-3 text-xs">
                  Use filters to find specific goals
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/goals/search">Advanced Search</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="bg-muted/20 mt-8 rounded-lg p-4">
            <h3 className="mb-2 font-medium">Need Help?</h3>
            <p className="text-muted-foreground mb-3 text-sm">
              If you believe this goal should exist or you&apos;re having
              trouble finding it, our support team can help.
            </p>
            <div className="flex flex-col justify-center gap-2 text-sm sm:flex-row">
              <Button variant="link" size="sm" asChild>
                <a href="/help/goals" target="_blank" rel="noopener noreferrer">
                  Goals Help Center
                </a>
              </Button>
              <Button variant="link" size="sm" asChild>
                <a href="/contact" target="_blank" rel="noopener noreferrer">
                  Contact Support
                </a>
              </Button>
              <Button variant="link" size="sm" asChild>
                <a href="/feedback" target="_blank" rel="noopener noreferrer">
                  Send Feedback
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
