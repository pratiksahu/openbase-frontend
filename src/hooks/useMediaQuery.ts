'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to track media query matches
 * @param query - The media query string (e.g., "(min-width: 768px)")
 * @param defaultValue - Default value when running on server
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(
  query: string,
  defaultValue: boolean = false
): boolean {
  const [matches, setMatches] = useState<boolean>(defaultValue);

  useEffect(() => {
    // Return early if window is not available (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Add listener
    mediaQueryList.addEventListener('change', listener);

    // Cleanup
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

// Predefined breakpoint hooks for convenience
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () =>
  useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1280px)');

// Preference-based queries
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
export const usePrefersDarkMode = () =>
  useMediaQuery('(prefers-color-scheme: dark)');
