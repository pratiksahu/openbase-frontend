# TASK_014: PWA Features

## Overview

Implement Progressive Web App (PWA) functionality to enhance user experience with offline support, installability, and native app-like features. This task focuses on creating a web manifest, service worker implementation, offline capabilities, and install prompt functionality.

## Objectives

- Configure PWA web manifest with proper metadata and icons
- Implement service worker for caching and offline functionality
- Add offline support with fallback pages and data synchronization
- Create install prompt functionality for app installation
- Implement background sync for offline actions
- Add push notification support (optional)
- Ensure PWA criteria compliance for app stores
- Optimize for different platforms and devices

## Implementation Steps

### 1. Create Web Manifest

Create `public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "YourApp",
  "description": "A modern web application built with Next.js",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en-US",
  "categories": ["productivity", "utilities"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "shortcuts": [
    {
      "name": "Dashboard",
      "short_name": "Dashboard",
      "description": "Go to dashboard",
      "url": "/dashboard",
      "icons": [
        {
          "src": "/icons/dashboard-96x96.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Profile",
      "short_name": "Profile",
      "description": "View profile",
      "url": "/profile",
      "icons": [
        {
          "src": "/icons/profile-96x96.png",
          "sizes": "96x96"
        }
      ]
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop-1280x720.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Desktop view of the application"
    },
    {
      "src": "/screenshots/mobile-360x640.png",
      "sizes": "360x640",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Mobile view of the application"
    }
  ]
}
```

### 2. Update Next.js Configuration

Update `next.config.js` to include PWA configuration:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  customWorkerDir: 'worker',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    appDir: true,
  },
  // PWA specific headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
```

### 3. Create Custom Service Worker

Create `worker/sw.js`:

```javascript
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { Queue } from 'workbox-background-sync';

const CACHE_NAME = 'app-cache-v1';
const OFFLINE_PAGE = '/offline';
const FALLBACK_IMAGE = '/images/fallback.png';

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST);

// Clean up outdated caches
cleanupOutdatedCaches();

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Cache images with a cache-first strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Cache API responses with network-first strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 5, // 5 minutes
      }),
      new BackgroundSyncPlugin('api-sync', {
        maxRetentionTime: 24 * 60, // Retry for max of 24 hours
      }),
    ],
  })
);

// Cache pages with network-first strategy
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  })
);

// Background sync for offline actions
const bgSyncPlugin = new BackgroundSyncPlugin('offline-actions', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 hours
});

// Create a queue for offline form submissions
const formSubmissionQueue = new Queue('form-submissions', {
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.log('Offline form submission synced');
      } catch (error) {
        console.error('Failed to sync form submission', error);
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

// Handle offline form submissions
registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith('/api/contact') && request.method === 'POST',
  async ({ event }) => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      await formSubmissionQueue.pushRequest({ request: event.request });
      return new Response(
        JSON.stringify({
          message: 'Form submitted offline. Will sync when online.',
          offline: true,
        }),
        {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
);

// Fallback for offline pages
const navigationHandler = async params => {
  try {
    return await new NetworkFirst({
      cacheName: 'navigations',
      networkTimeoutSeconds: 3,
    }).handle(params);
  } catch (error) {
    return caches.match(OFFLINE_PAGE);
  }
};

const navigationRoute = new NavigationRoute(navigationHandler);
registerRoute(navigationRoute);

// Install event - cache essential resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        OFFLINE_PAGE,
        '/manifest.json',
        FALLBACK_IMAGE,
        // Add other critical resources
      ]);
    })
  );

  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );

  // Take control of all pages
  self.clients.claim();
});

// Handle push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icons/checkmark.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('App Notification', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});

// Sync event for background sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(backgroundSync());
  }
});

async function backgroundSync() {
  // Implement background sync logic
  console.log('Background sync triggered');
}
```

### 4. Create Offline Page

Create `src/app/offline/page.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { WifiIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setLastUpdate(new Date().toLocaleString());

    const handleOnline = () => {
      setIsOnline(true);
      // Refresh the page when back online
      window.location.reload();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <Section className="flex min-h-screen items-center justify-center">
      <Container size="md" className="text-center">
        <div className="space-y-6">
          {/* Offline Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <WifiIcon className="text-muted-foreground h-24 w-24" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-destructive h-1 w-8 rotate-45 transform"></div>
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold">
              You're offline
            </h1>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              It looks like you've lost your internet connection. Don't worry,
              you can still browse cached content.
            </p>
          </div>

          {/* Status */}
          <div className="bg-muted/50 mx-auto max-w-sm rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span
                className={`font-medium ${
                  isOnline ? 'text-green-600' : 'text-destructive'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            {lastUpdate && (
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last update:</span>
                <span className="font-medium">{lastUpdate}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleRetry}
              disabled={!isOnline}
              className="flex items-center space-x-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Try Again</span>
            </Button>

            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>

          {/* Cached Content Info */}
          <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-900/20">
            <h3 className="mb-2 font-semibold">Available offline:</h3>
            <ul className="text-muted-foreground space-y-1">
              <li>• Recently visited pages</li>
              <li>• Cached images and resources</li>
              <li>• Form submissions (will sync when online)</li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

### 5. Create Install Prompt Component

Create `src/components/pwa/InstallPrompt.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
  };

  // Don't show if already installed or prompt not available
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  // Check if user recently dismissed the prompt
  const dismissed = localStorage.getItem('install-prompt-dismissed');
  if (dismissed) {
    const dismissedTime = parseInt(dismissed);
    const dayInMs = 24 * 60 * 60 * 1000;
    if (Date.now() - dismissedTime < dayInMs * 7) {
      // Don't show for 7 days
      return null;
    }
  }

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-sm">
      <div className="bg-card border-border rounded-lg border p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <ArrowDownTrayIcon className="text-primary h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-foreground text-sm font-medium">Install App</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Install our app for a better experience with offline support and
              quick access.
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
            aria-label="Close install prompt"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex space-x-2">
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="flex-1"
            data-testid="pwa-install"
          >
            Install
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDismiss}
            className="flex-1"
          >
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
};

export { InstallPrompt };
```

### 6. Create PWA Status Component

Create `src/components/pwa/PWAStatus.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { WifiIcon, WifiSlashIcon } from '@heroicons/react/24/outline';

const PWAStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col space-y-2">
      {/* Online/Offline indicator */}
      {!isOnline && (
        <div
          className="bg-destructive text-destructive-foreground flex items-center space-x-2 rounded-md px-3 py-2 text-sm shadow-md"
          data-testid="offline-indicator"
        >
          <WifiSlashIcon className="h-4 w-4" />
          <span>Offline</span>
        </div>
      )}

      {/* Update available indicator */}
      {updateAvailable && (
        <div className="flex items-center space-x-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-md">
          <span>Update available</span>
          <button
            onClick={handleRefresh}
            className="ml-2 rounded bg-white px-2 py-1 text-xs font-medium text-blue-600 hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export { PWAStatus };
```

### 7. Create PWA Utilities

Create `src/lib/pwa.ts`:

```typescript
// PWA utility functions

export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Check if PWA is installed
export const isPWAInstalled = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (window.navigator as any).standalone === true
  );
};

// Check if device supports PWA installation
export const supportsPWAInstall = (): boolean => {
  return 'serviceWorker' in navigator && 'beforeinstallprompt' in window;
};

// Register service worker
export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker is not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully:', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New update available
              console.log('New service worker version available');

              // Dispatch custom event for UI to handle
              window.dispatchEvent(new CustomEvent('sw-update-available'));
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  };

// Request notification permission
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('Notifications are not supported');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return 'denied';
  };

// Show notification
export const showNotification = (
  title: string,
  options?: NotificationOptions
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('Notification' in window)) {
      reject(new Error('Notifications are not supported'));
      return;
    }

    if (Notification.permission !== 'granted') {
      reject(new Error('Notification permission not granted'));
      return;
    }

    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    notification.onshow = () => resolve();
    notification.onerror = error => reject(error);
  });
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    });

    console.log('Push subscription successful:', subscription);
    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
};

// Get network information
export const getNetworkInfo = () => {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!connection) {
    return { effectiveType: 'unknown', downlink: 0 };
  }

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
};

// Cache important resources
export const precacheResources = async (resources: string[]): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  const cache = await caches.open('manual-cache');
  await cache.addAll(resources);
};

// Clear all caches
export const clearAllCaches = async (): Promise<void> => {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
};
```

### 8. Update Layout with PWA Components

Update `src/app/layout.tsx`:

```tsx
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { PWAStatus } from '@/components/pwa/PWAStatus';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your App Name',
  description: 'Your app description',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Your App Name',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Your App Name" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <InstallPrompt />
          <PWAStatus />
        </Providers>
      </body>
    </html>
  );
}
```

### 9. Add PWA Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "next-pwa": "^5.6.0"
  },
  "devDependencies": {
    "workbox-webpack-plugin": "^7.0.0"
  },
  "scripts": {
    "pwa:build": "next build",
    "pwa:analyze": "npx pwa-builder-cli analyze",
    "icons:generate": "npx pwa-asset-generator logo.svg public/icons --background '#ffffff' --theme-color '#000000'"
  }
}
```

### 10. Create PWA Configuration Files

Create `public/browserconfig.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/icons/mstile-70x70.png"/>
      <square150x150logo src="/icons/mstile-150x150.png"/>
      <square310x310logo src="/icons/mstile-310x310.png"/>
      <wide310x150logo src="/icons/mstile-310x150.png"/>
      <TileColor>#000000</TileColor>
    </tile>
  </msapplication>
</browserconfig>
```

## Acceptance Criteria

- [ ] Web manifest configured with proper metadata and icons
- [ ] Service worker implements caching strategies and offline support
- [ ] Install prompt displays on supported devices
- [ ] Offline page provides useful information and functionality
- [ ] PWA passes Lighthouse PWA audit
- [ ] App works in standalone mode when installed
- [ ] Background sync handles offline actions
- [ ] Push notifications work (if implemented)
- [ ] App meets PWA criteria for app stores
- [ ] Icons and splash screens display correctly

## Testing Instructions

### 1. Test PWA Installation

```bash
# Use Chrome DevTools
# 1. Open Application tab
# 2. Check Service Workers section
# 3. Test "Add to Home Screen" functionality
# 4. Verify manifest details
```

### 2. Test Offline Functionality

```bash
# In DevTools Network tab:
# 1. Set to "Offline"
# 2. Navigate to different pages
# 3. Test form submissions
# 4. Check cached resources
```

### 3. Test Service Worker

```bash
# In DevTools Application tab:
# 1. Check service worker status
# 2. Test cache storage
# 3. Simulate service worker updates
```

### 4. Run PWA Audit

```bash
# Run Lighthouse PWA audit
npx lighthouse http://localhost:3000 --view --preset=pwa
```

## References and Dependencies

### Dependencies

- `next-pwa`: PWA configuration for Next.js
- `workbox-webpack-plugin`: Advanced service worker features

### Documentation

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web App Manifest](https://web.dev/add-manifest/)
- [Service Workers](https://web.dev/service-workers-cache-storage/)
- [Workbox](https://developers.google.com/web/tools/workbox)

## Estimated Time

**8-10 hours**

- Manifest and icons setup: 2-3 hours
- Service worker implementation: 3-4 hours
- Install prompt and offline features: 2-3 hours
- Testing and optimization: 2-3 hours

## Troubleshooting

### Common Issues

1. **Service worker not registering**
   - Check file paths and scope
   - Verify HTTPS requirement
   - Check console for errors

2. **Install prompt not showing**
   - Verify PWA criteria are met
   - Check beforeinstallprompt event
   - Test on supported browsers

3. **Offline functionality not working**
   - Check caching strategies
   - Verify network-first/cache-first logic
   - Test with different network conditions

4. **Icons not displaying**
   - Verify icon sizes and formats
   - Check manifest icon references
   - Test on different devices

5. **Performance issues**
   - Optimize cache strategies
   - Review what's being cached
   - Monitor cache storage limits
