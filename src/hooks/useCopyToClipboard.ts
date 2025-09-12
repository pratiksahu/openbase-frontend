'use client';

import { useState } from 'react';

/**
 * Hook to copy text to clipboard
 * @returns Tuple of [copyToClipboard function, copied state, error]
 */
export function useCopyToClipboard(): [
  (text: string) => Promise<boolean>,
  boolean,
  string | null,
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
