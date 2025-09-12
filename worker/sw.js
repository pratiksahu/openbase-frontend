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