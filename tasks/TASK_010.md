# TASK_010: Custom Hooks

## Overview
Develop a collection of reusable custom React hooks that encapsulate common functionality and stateful logic across the application. These hooks will provide consistent behavior for media queries, debouncing, local storage, and theme management while following React best practices.

## Objectives
- Create useMediaQuery hook for responsive design logic
- Implement useDebounce hook for input optimization
- Build useLocalStorage hook for persistent state
- Develop useTheme hook for theme management
- Ensure hooks are type-safe and well-tested
- Provide comprehensive documentation and examples
- Follow React hooks rules and conventions

## Implementation Steps

### 1. Create Custom Hooks Directory Structure

```bash
# Create hooks directory
mkdir -p src/hooks
mkdir -p src/hooks/__tests__
```

### 2. Implement useMediaQuery Hook

Create `src/hooks/useMediaQuery.ts`:

```typescript
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
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1280px)');

// Preference-based queries
export const usePrefersReducedMotion = () => 
  useMediaQuery('(prefers-reduced-motion: reduce)');
export const usePrefersDarkMode = () => 
  useMediaQuery('(prefers-color-scheme: dark)');
```

### 3. Implement useDebounce Hook

Create `src/hooks/useDebounce.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if the value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook that debounces a callback function
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @param deps - Dependencies array for the callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(
    () => callback
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, ...deps]);

  return debouncedCallback;
}

/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds
 * @returns Object with search value, debounced value, and setter
 */
export function useDebouncedSearch(initialValue: string = '', delay: number = 300) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce(searchValue, delay);

  return {
    searchValue,
    debouncedSearchValue,
    setSearchValue,
  };
}
```

### 4. Implement useLocalStorage Hook

Create `src/hooks/useLocalStorage.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';

type SetValue<T> = T | ((val: T) => T);

/**
 * Custom hook for managing localStorage with React state
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: SetValue<T>) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Function to remove the value from localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

/**
 * Hook to sync localStorage across tabs/windows
 * @param key - The localStorage key to sync
 * @param initialValue - Initial value if key doesn't exist
 */
export function useSyncedLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, setValue]);

  return [value, setValue, removeValue];
}
```

### 5. Implement useTheme Hook

Create `src/hooks/useTheme.ts`:

```typescript
'use client';

import { useEffect, useState, useContext, createContext, ReactNode } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useMediaQuery } from './useMediaQuery';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
}

/**
 * Theme Provider Component
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  attribute = 'class',
}: ThemeProviderProps) {
  const [theme, setStoredTheme] = useLocalStorage<Theme>(storageKey, defaultTheme);
  const [mounted, setMounted] = useState(false);
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  // Calculate resolved theme
  const resolvedTheme: ResolvedTheme = 
    theme === 'system' 
      ? systemPrefersDark ? 'dark' : 'light'
      : theme === 'dark' ? 'dark' : 'light';

  const setTheme = (newTheme: Theme) => {
    setStoredTheme(newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(systemPrefersDark ? 'light' : 'dark');
    } else {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  // Update DOM when theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);
    } else {
      root.setAttribute(attribute, resolvedTheme);
    }

    // Update meta theme-color for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      const color = resolvedTheme === 'dark' ? '#0a0a0a' : '#ffffff';
      themeColorMeta.setAttribute('content', color);
    }
  }, [resolvedTheme, attribute, mounted]);

  // Set mounted after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Standalone hook for theme management without context (lightweight version)
 */
export function useSimpleTheme(storageKey: string = 'simple-theme') {
  const [theme, setTheme] = useLocalStorage<ResolvedTheme>('light', 'light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Update DOM
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
```

### 6. Create Additional Utility Hooks

Create `src/hooks/useClickOutside.ts`:

```typescript
'use client';

import { RefObject, useEffect } from 'react';

/**
 * Hook to detect clicks outside of a ref element
 * @param ref - React ref object
 * @param handler - Function to call when clicking outside
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

Create `src/hooks/useToggle.ts`:

```typescript
'use client';

import { useState, useCallback } from 'react';

/**
 * Hook for managing boolean state with toggle functionality
 * @param initialValue - Initial boolean value
 * @returns Tuple of [value, toggle, setValue]
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  
  return [value, toggle, setValue];
}
```

Create `src/hooks/useCopyToClipboard.ts`:

```typescript
'use client';

import { useState } from 'react';

/**
 * Hook to copy text to clipboard
 * @returns Tuple of [copyToClipboard function, copied state, error]
 */
export function useCopyToClipboard(): [
  (text: string) => Promise<boolean>,
  boolean,
  string | null
] {
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      setError('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Copy failed');
      setCopied(false);
      return false;
    }
  };

  return [copyToClipboard, copied, error];
}
```

### 7. Create Hook Tests

Create `src/hooks/__tests__/useMediaQuery.test.ts`:

```typescript
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from '../useMediaQuery';

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('useMediaQuery', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return false when media query does not match', () => {
    mockMatchMedia(false);
    
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    expect(result.current).toBe(false);
  });

  it('should return true when media query matches', () => {
    mockMatchMedia(true);
    
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    expect(result.current).toBe(true);
  });

  it('should return default value when window is undefined', () => {
    const originalWindow = global.window;
    delete (global as any).window;
    
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)', true));
    
    expect(result.current).toBe(true);
    
    global.window = originalWindow;
  });
});
```

### 8. Create Hook Index File

Create `src/hooks/index.ts`:

```typescript
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from './useMediaQuery';
export { useDebounce, useDebouncedCallback, useDebouncedSearch } from './useDebounce';
export { useLocalStorage, useSyncedLocalStorage } from './useLocalStorage';
export { useTheme, ThemeProvider, useSimpleTheme } from './useTheme';
export { useClickOutside } from './useClickOutside';
export { useToggle } from './useToggle';
export { useCopyToClipboard } from './useCopyToClipboard';
```

### 9. Create Example Test Page

Create `src/app/test-hooks/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import {
  useMediaQuery,
  useDebounce,
  useLocalStorage,
  useTheme,
  useToggle,
  useCopyToClipboard,
} from '@/hooks';

export default function TestHooksPage() {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);
  
  const [storedValue, setStoredValue] = useLocalStorage('test-key', '');
  const [showModal, toggleModal] = useToggle();
  
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  const { theme, toggleTheme } = useTheme();
  const [copyToClipboard, copied] = useCopyToClipboard();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Hook Testing Page</h1>
      
      {/* Media Query Hook */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Media Query Hook</h2>
        <p data-testid="is-desktop">Desktop: {isDesktop.toString()}</p>
        <p data-testid="is-mobile">Mobile: {isMobile.toString()}</p>
      </div>

      {/* Debounce Hook */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Debounce Hook</h2>
        <input
          data-testid="debounce-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
          className="border p-2 rounded"
        />
        <p>Input: {inputValue}</p>
        <p data-testid="debounce-output">Debounced: {debouncedValue}</p>
      </div>

      {/* Local Storage Hook */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Local Storage Hook</h2>
        <button
          data-testid="localstorage-set"
          onClick={() => setStoredValue('test-value-' + Date.now())}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Set Local Storage Value
        </button>
        <p data-testid="localstorage-value">Stored: {storedValue}</p>
      </div>

      {/* Theme Hook */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Theme Hook</h2>
        <button
          data-testid="theme-toggle-hook"
          onClick={toggleTheme}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Toggle Theme
        </button>
        <p data-testid="current-theme">Current theme: {theme}</p>
      </div>

      {/* Toggle Hook */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Toggle Hook</h2>
        <button
          onClick={toggleModal}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Toggle Modal: {showModal ? 'Open' : 'Closed'}
        </button>
      </div>

      {/* Copy to Clipboard Hook */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Copy to Clipboard Hook</h2>
        <button
          onClick={() => copyToClipboard('Hello, World!')}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>
    </div>
  );
}
```

## Acceptance Criteria

- [ ] All custom hooks follow React rules of hooks
- [ ] Hooks are properly typed with TypeScript
- [ ] Hooks handle edge cases (SSR, undefined window)
- [ ] Local storage hook handles JSON serialization errors
- [ ] Theme hook provides both context and standalone versions
- [ ] Media query hook cleans up listeners properly
- [ ] Debounce hook prevents memory leaks
- [ ] All hooks have comprehensive tests
- [ ] Hooks are properly exported and importable
- [ ] Documentation includes usage examples

## Testing Instructions

### 1. Test useMediaQuery Hook
- Resize browser window to test responsive breakpoints
- Check console for any errors during resize
- Verify cleanup of event listeners

### 2. Test useDebounce Hook
- Type rapidly in input field
- Verify debounced value updates after delay
- Test with different delay values

### 3. Test useLocalStorage Hook
- Set values and refresh page
- Check browser localStorage in dev tools
- Test with invalid JSON values
- Test cross-tab synchronization

### 4. Test useTheme Hook
- Toggle between light/dark themes
- Check system preference detection
- Verify DOM class updates
- Test localStorage persistence

### 5. Test Error Handling
- Test hooks with invalid parameters
- Test SSR behavior
- Verify graceful degradation

## References and Dependencies

### Dependencies
- React: Core hooks functionality
- TypeScript: Type definitions

### Documentation
- [React Hooks Rules](https://reactjs.org/docs/rules-of-hooks.html)
- [Custom Hooks](https://reactjs.org/docs/hooks-custom.html)
- [Media Query API](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList)
- [Local Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Estimated Time
**6-8 hours**

- Hook implementation: 4-5 hours
- Testing setup: 2-3 hours
- Documentation and examples: 1-2 hours
- Code review and refinement: 1 hour

## Troubleshooting

### Common Issues

1. **SSR hydration mismatches**
   - Use default values for server-side rendering
   - Check for `typeof window !== 'undefined'`
   - Consider using `useIsomorphicLayoutEffect`

2. **Memory leaks in useEffect**
   - Always clean up event listeners
   - Clear timeouts in cleanup functions
   - Remove media query listeners

3. **localStorage not available**
   - Wrap localStorage calls in try-catch
   - Provide fallback for private browsing mode
   - Handle quota exceeded errors

4. **Hook dependency warnings**
   - Include all dependencies in dependency arrays
   - Use `useCallback` for function dependencies
   - Consider `useMemo` for expensive computations

5. **TypeScript errors**
   - Define proper interface types
   - Use generic types for reusable hooks
   - Handle undefined/null values properly