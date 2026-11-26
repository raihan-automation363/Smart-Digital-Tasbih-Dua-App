import { useCallback, useEffect, useRef, useState } from 'react';

interface WakeLockSentinelLike {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: string, listener: () => void) => void;
}

export function useWakeLock(enabled: boolean) {
  const [isSupported] = useState<boolean>(
    () => typeof navigator !== 'undefined' && 'wakeLock' in navigator
  );
  const [isActive, setIsActive] = useState(false);
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null);

  const requestLock = useCallback(async () => {
    if (!isSupported || !enabled) return;
    try {
      const nav = navigator as unknown as {
        wakeLock: { request: (type: 'screen') => Promise<WakeLockSentinelLike> };
      };
      const sentinel = await nav.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      setIsActive(true);
      sentinel.addEventListener('release', () => {
        setIsActive(false);
      });
    } catch {
      setIsActive(false);
    }
  }, [enabled, isSupported]);

  const releaseLock = useCallback(async () => {
    if (sentinelRef.current) {
      try {
        await sentinelRef.current.release();
      } catch {
        // Ignore release errors
      }
      sentinelRef.current = null;
    }
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      requestLock();
    } else {
      releaseLock();
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      releaseLock();
    };
  }, [enabled, requestLock, releaseLock]);

  return { isSupported, isActive };
}
