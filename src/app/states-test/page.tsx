'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { CardSkeleton, TableSkeleton, ContentSkeleton } from '@/components/shared/loading-skeleton'

export default function StatesTest() {
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (showError) {
    throw new Error('This is a test error!')
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Loading & Error States Test</h1>

      {/* Error trigger */}
      <Card>
        <CardHeader>
          <CardTitle>Error Boundary Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowError(true)}
          >
            Trigger Error Boundary
          </Button>
        </CardContent>
      </Card>

      {/* Loading states */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Loading Spinner</h3>
            <div className="flex gap-4">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Card Skeleton</h3>
            <CardSkeleton />
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Table Skeleton</h3>
            <TableSkeleton />
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Content Skeleton</h3>
            <ContentSkeleton />
          </div>
        </CardContent>
      </Card>

      {/* Async loading simulation */}
      <Card>
        <CardHeader>
          <CardTitle>Async Loading Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => setIsLoading(false), 3000)
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              'Simulate Loading (3s)'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}