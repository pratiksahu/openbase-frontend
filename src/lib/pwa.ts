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

      // Service Worker registered successfully

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
              // New service worker version available

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

    const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      ...options,
    };

    const notification = new Notification(title, notificationOptions);

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

    // Push subscription successful
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