import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-12 w-[300px]" />
          <Skeleton className="h-4 w-[500px]" />
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}