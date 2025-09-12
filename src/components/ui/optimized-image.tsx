'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto';
  containerClassName?: string;
}

const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  showSkeleton = true,
  aspectRatio = 'auto',
  containerClassName,
  className,
  ...props
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClasses = {
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    auto: '',
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
        containerClassName
      )}
    >
      {/* Loading skeleton */}
      {isLoading && showSkeleton && (
        <div className="bg-muted absolute inset-0 animate-pulse" />
      )}

      {/* Image */}
      <Image
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'grayscale filter',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Error state overlay */}
      {hasError && (
        <div className="bg-muted absolute inset-0 flex items-center justify-center">
          <span className="text-muted-foreground text-xs">
            Failed to load image
          </span>
        </div>
      )}
    </div>
  );
};

export { OptimizedImage };
