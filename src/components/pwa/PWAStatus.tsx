'use client';

import { WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';


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
    <div className="fixed right-4 top-4 z-40 flex flex-col space-y-2">
      {/* Online/Offline indicator */}
      {!isOnline && (
        <div
          className="flex items-center space-x-2 rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground shadow-md"
          data-testid="offline-indicator"
        >
          <WifiOff className="h-4 w-4" />
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