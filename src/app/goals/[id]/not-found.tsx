/**
 * Goal Not Found Component
 *
 * 404 page for when a specific goal cannot be found.
 * Provides helpful navigation and suggestions.
 */

import React from 'react';
import Link from 'next/link';
import { Search, Target, Plus, ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// =============================================================================
// Not Found Component
// =============================================================================

export default function GoalNotFound() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-2xl">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <Target className="h-24 w-24 mx-auto text-muted-foreground/30 mb-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-muted-foreground/50">404</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Goal Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The goal you're looking for doesn't exist or may have been moved.
            </p>
          </div>

          {/* Possible Reasons */}
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle className="text-lg">What might have happened?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-sm">The goal may have been deleted or archived</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-sm">You might not have permission to view this goal</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-sm">The URL might be incorrect or outdated</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-sm">The goal might have been moved to a different location</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Search Box */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search for Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by goal title, description, or tags..."
                    className="pl-10"
                  />
                </div>
                <Button>Search</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Try searching for keywords related to the goal you're looking for
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg">
              <Link href="/goals" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                View All Goals
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/goals/new" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create New Goal
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/" className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium mb-1">Active Goals</h3>
                <p className="text-muted-foreground text-xs mb-3">
                  View your currently active goals
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/goals?status=active">View Active</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium mb-1">Goal Templates</h3>
                <p className="text-muted-foreground text-xs mb-3">
                  Start with pre-built templates
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/templates">Browse Templates</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Search className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium mb-1">Advanced Search</h3>
                <p className="text-muted-foreground text-xs mb-3">
                  Use filters to find specific goals
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/goals/search">Advanced Search</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-muted/20 rounded-lg">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you believe this goal should exist or you're having trouble finding it,
              our support team can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
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