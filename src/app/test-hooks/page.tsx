'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useMediaQuery,
  useDebounce,
  useLocalStorage,
  useToggle,
  useCopyToClipboard,
  useIsMobile,
  useIsDesktop,
  useDebouncedSearch,
} from '@/hooks';

export default function TestHooksPage() {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);
  const { searchValue, debouncedSearchValue, setSearchValue } =
    useDebouncedSearch('', 300);

  const [storedValue, setStoredValue] = useLocalStorage('test-key', '');
  const [showModal, toggleModal] = useToggle();

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobile = useIsMobile();
  const isDesktopHook = useIsDesktop();

  const [copyToClipboard, copied] = useCopyToClipboard();

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Hook Testing Page</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Test and demonstrate custom React hooks functionality
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Media Query Hook */}
        <Card>
          <CardHeader>
            <CardTitle>Media Query Hook</CardTitle>
            <CardDescription>Responsive breakpoint detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p data-testid="is-desktop" className="text-sm">
              <span className="font-medium">Desktop (≥1024px):</span>{' '}
              <span className={isDesktop ? 'text-green-600' : 'text-red-600'}>
                {isDesktop.toString()}
              </span>
            </p>
            <p data-testid="is-mobile" className="text-sm">
              <span className="font-medium">Mobile (≤767px):</span>{' '}
              <span className={isMobile ? 'text-green-600' : 'text-red-600'}>
                {isMobile.toString()}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Desktop Hook:</span>{' '}
              <span
                className={isDesktopHook ? 'text-green-600' : 'text-red-600'}
              >
                {isDesktopHook.toString()}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Debounce Hook */}
        <Card>
          <CardHeader>
            <CardTitle>Debounce Hook</CardTitle>
            <CardDescription>Input debouncing with 500ms delay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="debounce-input" className="text-sm font-medium">
                Type something:
              </label>
              <Input
                id="debounce-input"
                data-testid="debounce-input"
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Type something..."
                className="mt-1"
              />
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Input:</span> {inputValue}
              </p>
              <p data-testid="debounce-output">
                <span className="font-medium">Debounced:</span> {debouncedValue}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Debounced Search Hook */}
        <Card>
          <CardHeader>
            <CardTitle>Debounced Search Hook</CardTitle>
            <CardDescription>Search with built-in debouncing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="search-input" className="text-sm font-medium">
                Search:
              </label>
              <Input
                id="search-input"
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Search something..."
                className="mt-1"
              />
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Search:</span> {searchValue}
              </p>
              <p>
                <span className="font-medium">Debounced:</span>{' '}
                {debouncedSearchValue}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Local Storage Hook */}
        <Card>
          <CardHeader>
            <CardTitle>Local Storage Hook</CardTitle>
            <CardDescription>Persistent state management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              data-testid="localstorage-set"
              onClick={() => setStoredValue('test-value-' + Date.now())}
              variant="outline"
            >
              Set Local Storage Value
            </Button>
            <p data-testid="localstorage-value" className="text-sm">
              <span className="font-medium">Stored:</span>{' '}
              {storedValue || 'No value'}
            </p>
          </CardContent>
        </Card>

        {/* Toggle Hook */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle Hook</CardTitle>
            <CardDescription>Boolean state management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={toggleModal} variant="outline">
              Toggle Modal: {showModal ? 'Open' : 'Closed'}
            </Button>
            {showModal && (
              <div className="bg-muted rounded-lg p-4 text-sm">
                <p>
                  Modal is currently open! Click the button again to close it.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Copy to Clipboard Hook */}
        <Card>
          <CardHeader>
            <CardTitle>Copy to Clipboard Hook</CardTitle>
            <CardDescription>Text copying functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() =>
                copyToClipboard(
                  'Hello, World! This was copied using useClipboard hook.'
                )
              }
              variant={copied ? 'default' : 'outline'}
            >
              {copied ? '✓ Copied!' : 'Copy Sample Text'}
            </Button>
            <p className="text-muted-foreground text-sm">
              Click the button to copy sample text to your clipboard.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hook Status Summary</CardTitle>
          <CardDescription>Current state of all hooks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <h4 className="font-medium">Media Queries:</h4>
              <ul className="mt-2 space-y-1">
                <li>• Desktop: {isDesktop ? '✓' : '✗'}</li>
                <li>• Mobile: {isMobile ? '✓' : '✗'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">State Management:</h4>
              <ul className="mt-2 space-y-1">
                <li>• Modal: {showModal ? 'Open' : 'Closed'}</li>
                <li>• Clipboard: {copied ? 'Copied' : 'Ready'}</li>
                <li>• LocalStorage: {storedValue ? 'Has value' : 'Empty'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Debouncing:</h4>
              <ul className="mt-2 space-y-1">
                <li>• Input length: {inputValue.length}</li>
                <li>• Debounced length: {debouncedValue.length}</li>
                <li>• Search length: {searchValue.length}</li>
                <li>• Search debounced: {debouncedSearchValue.length}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Viewport Info:</h4>
              <ul className="mt-2 space-y-1">
                <li>
                  • Window available:{' '}
                  {typeof window !== 'undefined' ? '✓' : '✗'}
                </li>
                <li>
                  • Screen width:{' '}
                  {typeof window !== 'undefined'
                    ? window.innerWidth + 'px'
                    : 'N/A'}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
