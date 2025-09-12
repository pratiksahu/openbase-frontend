'use client';

import { XIcon, DownloadIcon } from 'lucide-react';
import { useState, useEffect } from 'react';


import { Button } from '@/components/ui/button';

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
      // User accepted the install prompt
    } else {
      // User dismissed the install prompt
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
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <DownloadIcon className="h-6 w-6 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-foreground">Install App</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Install our app for a better experience with offline support and
              quick access.
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Close install prompt"
          >
            <XIcon className="h-4 w-4" />
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