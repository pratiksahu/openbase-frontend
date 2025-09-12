'use client';

import {
  useEffect,
  useState,
  useContext,
  createContext,
  ReactNode,
} from 'react';

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
  const [theme, setStoredTheme] = useLocalStorage<Theme>(
    storageKey,
    defaultTheme
  );
  const [mounted, setMounted] = useState(false);
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  // Calculate resolved theme
  const resolvedTheme: ResolvedTheme =
    theme === 'system'
      ? systemPrefersDark
        ? 'dark'
        : 'light'
      : theme === 'dark'
        ? 'dark'
        : 'light';

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
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
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
  const [theme, setTheme] = useLocalStorage<ResolvedTheme>(storageKey, 'light');

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
