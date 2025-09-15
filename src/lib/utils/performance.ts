/**
 * Performance Optimization Utilities
 *
 * This module provides utilities for performance optimization:
 * - Memoization and caching
 * - Debouncing and throttling
 * - Virtual scrolling helpers
 * - Bundle size optimization
 * - Memory leak prevention
 * - Performance monitoring
 *
 * @fileoverview Performance optimization utilities
 * @version 1.0.0
 */

import React, { useCallback, useEffect, useMemo, useRef } from 'react';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  cleanupInterval?: number; // Cleanup interval in milliseconds
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  cacheHitRate?: number;
  apiResponseTime?: number;
  timestamp: number;
}

// =============================================================================
// Memoization and Caching
// =============================================================================

export class MemoryCache<K, V> {
  private cache = new Map<
    K,
    { value: V; timestamp: number; accessed: number }
  >();
  private readonly ttl: number;
  private readonly maxSize: number;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(options: CacheOptions = {}) {
    this.ttl = options.ttl ?? 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize ?? 1000;

    if (options.cleanupInterval) {
      this.startCleanupTimer(options.cleanupInterval);
    }
  }

  set(key: K, value: V): void {
    const now = Date.now();

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      timestamp: now,
      accessed: now,
    });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    const now = Date.now();

    // Check if entry has expired
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    // Update access time
    entry.accessed = now;
    return entry.value;
  }

  has(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private evictOldest(): void {
    if (this.cache.size === 0) return;

    let oldestKey: K | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessed < oldestTime) {
        oldestTime = entry.accessed;
        oldestKey = key;
      }
    }

    if (oldestKey !== null) {
      this.cache.delete(oldestKey);
    }
  }

  private startCleanupTimer(interval: number): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, interval);
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: K[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }

  getStats(): {
    size: number;
    hitRate: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    if (this.cache.size === 0) {
      return { size: 0, hitRate: 0, oldestEntry: 0, newestEntry: 0 };
    }

    let oldest = Infinity;
    let newest = 0;
    let totalAccesses = 0;
    let totalEntries = 0;

    for (const entry of this.cache.values()) {
      oldest = Math.min(oldest, entry.timestamp);
      newest = Math.max(newest, entry.timestamp);
      totalAccesses += 1;
      totalEntries += 1;
    }

    return {
      size: this.cache.size,
      hitRate: totalAccesses / totalEntries,
      oldestEntry: oldest,
      newestEntry: newest,
    };
  }
}

// =============================================================================
// Memoization Hook
// =============================================================================

export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList,
  isEqual?: (a: T, b: T) => boolean
): T {
  const valueRef = useRef<T | undefined>(undefined);
  const depsRef = useRef<React.DependencyList | undefined>(undefined);

  return useMemo(() => {
    // Check if dependencies have changed
    const depsChanged =
      !depsRef.current ||
      deps.length !== depsRef.current.length ||
      deps.some((dep, index) => dep !== depsRef.current![index]);

    if (depsChanged || !valueRef.current) {
      const newValue = factory();

      // Use custom equality check if provided
      if (isEqual && valueRef.current && !isEqual(valueRef.current, newValue)) {
        valueRef.current = newValue;
      } else if (!isEqual) {
        valueRef.current = newValue;
      }

      depsRef.current = deps;
    }

    return valueRef.current!;
  }, deps);
}

// =============================================================================
// Debouncing and Throttling
// =============================================================================

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      },
      limit - (Date.now() - lastRan.current)
    );

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const lastRan = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRan.current >= limit) {
        callback(...args);
        lastRan.current = Date.now();
      }
    },
    [callback, limit]
  ) as T;
}

// =============================================================================
// Virtual Scrolling Helpers
// =============================================================================

export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  totalItems: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  visibleItems: number;
  offsetY: number;
  totalHeight: number;
}

export function calculateVirtualScroll(
  scrollTop: number,
  options: VirtualScrollOptions
): VirtualScrollResult {
  const { itemHeight, containerHeight, overscan = 5, totalItems } = options;

  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    startIndex + visibleItems + overscan * 2
  );

  return {
    startIndex,
    endIndex,
    visibleItems,
    offsetY: startIndex * itemHeight,
    totalHeight: totalItems * itemHeight,
  };
}

export function useVirtualScroll(options: VirtualScrollOptions) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const virtualData = useMemo(
    () => calculateVirtualScroll(scrollTop, options),
    [
      scrollTop,
      options.itemHeight,
      options.containerHeight,
      options.totalItems,
      options.overscan,
    ]
  );

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    ...virtualData,
    onScroll: handleScroll,
  };
}

// =============================================================================
// Performance Monitoring
// =============================================================================

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];
  private static maxMetrics = 100;

  static startMeasure(_label: string): () => void {
    const start = performance.now();

    return () => {
      const end = performance.now();
      const renderTime = end - start;

      this.addMetric({
        renderTime,
        timestamp: Date.now(),
        memoryUsage: this.getMemoryUsage(),
      });

      // Performance measurement: ${label} completed
    };
  }

  static addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  static getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  static getAverageRenderTime(): number {
    if (this.metrics.length === 0) return 0;

    const totalTime = this.metrics.reduce(
      (sum, metric) => sum + metric.renderTime,
      0
    );
    return totalTime / this.metrics.length;
  }

  static getMemoryUsage(): number | undefined {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return undefined;
    }

    const memory = (performance as any).memory;
    return memory.usedJSHeapSize / memory.totalJSHeapSize;
  }

  static clear(): void {
    this.metrics = [];
  }
}

// =============================================================================
// Performance Hooks
// =============================================================================

export function usePerformanceMonitor(
  label: string,
  dependencies: React.DependencyList = []
) {
  useEffect(() => {
    const stopMeasure = PerformanceMonitor.startMeasure(label);
    return stopMeasure;
  }, dependencies);
}

export function useRenderCount(_name?: string): number {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
    // Render count tracking for component: ${name}
  });

  return renderCount.current;
}

export function useWhyDidYouUpdate(
  name: string,
  props: Record<string, any>
): void {
  const previousProps = useRef<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    if (previousProps.current && process.env.NODE_ENV === 'development') {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      // Component ${name} re-rendered due to prop changes
    }

    previousProps.current = props;
  });
}

// =============================================================================
// Memory Management
// =============================================================================

export function useMemoryLeakDetection(componentName: string): void {
  const mountTime = useRef<number>(Date.now());

  useEffect(() => {
    return () => {
      // Component unmount tracking
      // Could log lifetime: Date.now() - mountTime.current
    };
  }, [componentName, mountTime]);
}

export function useCleanupEffect(
  cleanup: () => void,
  dependencies: React.DependencyList = []
): void {
  useEffect(() => {
    return cleanup;
  }, dependencies);
}

// =============================================================================
// Bundle Size Optimization
// =============================================================================

export function lazyWithRetry<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 3
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    let lastError: Error;

    for (let i = 0; i < retries; i++) {
      try {
        return await importFunc();
      } catch (error) {
        lastError = error as Error;

        // Wait before retrying
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    throw lastError!;
  });
}

// =============================================================================
// Performance Testing Utilities
// =============================================================================

export function measureAsyncOperation<T>(
  operation: () => Promise<T>,
  _label?: string
): Promise<{ result: T; duration: number }> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();

    try {
      const result = await operation();
      const duration = performance.now() - start;

      // Async operation ${label} completed

      resolve({ result, duration });
    } catch (error) {
      reject(error);
    }
  });
}

export function profileComponent<P extends object>(
  Component: React.ComponentType<P>,
  profileName?: string
): React.ComponentType<P> {
  return function ProfiledComponent(props: P) {
    usePerformanceMonitor(profileName || Component.displayName || 'Unknown', [
      props,
    ]);

    // Always call hooks, but only log in development
    useRenderCount(
      process.env.NODE_ENV === 'development'
        ? profileName || Component.displayName
        : undefined
    );
    useWhyDidYouUpdate(
      profileName || Component.displayName || 'Unknown',
      process.env.NODE_ENV === 'development' ? (props as any) : {}
    );

    return React.createElement(Component as React.ComponentType<any>, props);
  };
}

// =============================================================================
// React 18 Specific Optimizations
// =============================================================================

export function useDeferredValue<T>(value: T): T {
  // Always create state for fallback
  const [deferredValue, setDeferredValue] = React.useState(value);

  useEffect(() => {
    // Use React 18's useDeferredValue if available, otherwise use fallback
    if (typeof React.useDeferredValue === 'function') {
      // For React 18+, we can't dynamically switch, so we'll use the fallback approach
      // to maintain consistency. In a real app, you'd pick one approach.
    }

    const timeout = setTimeout(() => {
      setDeferredValue(value);
    }, 0);

    return () => clearTimeout(timeout);
  }, [value]);

  return deferredValue;
}

export function useTransition(): [boolean, (callback: () => void) => void] {
  // Always create fallback state and callback
  const [isPending, setIsPending] = React.useState(false);

  const startTransition = useCallback((callback: () => void) => {
    // Use React 18's useTransition if available, otherwise use fallback
    if (typeof React.useTransition === 'function') {
      // For React 18+, we can't dynamically switch, so we'll use the fallback approach
      // to maintain consistency. In a real app, you'd pick one approach.
    }

    setIsPending(true);
    setTimeout(() => {
      callback();
      setIsPending(false);
    }, 0);
  }, []);

  return [isPending, startTransition];
}

const performanceUtils = {
  MemoryCache,
  PerformanceMonitor,
  useMemoizedValue,
  useThrottle,
  useThrottledCallback,
  useVirtualScroll,
  usePerformanceMonitor,
  useRenderCount,
  useWhyDidYouUpdate,
  useMemoryLeakDetection,
  useCleanupEffect,
  lazyWithRetry,
  measureAsyncOperation,
  profileComponent,
  useDeferredValue,
  useTransition,
};

export default performanceUtils;
