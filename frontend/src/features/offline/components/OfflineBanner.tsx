import { useTranslation } from 'react-i18next';
import { WifiOff, Cloud, CloudOff, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useSync, type SyncState } from '../hooks/useSync';
import { useEffect, useState } from 'react';

function SyncIndicator({ state, pendingCount }: { state: SyncState; pendingCount: number }) {
  const { t } = useTranslation();

  if (state === 'syncing') {
    return (
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm">{t('offline.syncing')}</span>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <Check className="h-4 w-4" />
        <span className="text-sm">{t('offline.syncComplete')}</span>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{t('offline.syncFailed')}</span>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <CloudOff className="h-4 w-4" />
        <span className="text-sm">{t('settings.pendingCount', { count: pendingCount })}</span>
      </div>
    );
  }

  return null;
}

export function OfflineBanner() {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const { syncState, pendingCount } = useSync();
  const [showSyncStatus, setShowSyncStatus] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Track offline -> online transitions
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowSyncStatus(true);
      // Hide after sync completes + delay
      const timer = setTimeout(() => {
        setShowSyncStatus(false);
        setWasOffline(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // Show sync status when syncing
  useEffect(() => {
    if (syncState === 'syncing' || syncState === 'success' || syncState === 'error') {
      setShowSyncStatus(true);
      if (syncState === 'success') {
        const timer = setTimeout(() => setShowSyncStatus(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [syncState]);

  // Offline banner
  if (!isOnline) {
    return (
      <div className="fixed bottom-16 left-0 right-0 z-40 mx-2 mb-2">
        <div className="bg-amber-500/95 backdrop-blur-sm text-amber-950 px-4 py-3 rounded-xl flex items-center justify-center gap-3 shadow-lg">
          <WifiOff className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="font-medium">{t('offline.youAreOffline')}</span>
            {pendingCount > 0 && (
              <span className="text-xs opacity-80">
                {t('settings.pendingCount', { count: pendingCount })}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sync status banner (when coming back online or syncing)
  if (showSyncStatus && (syncState !== 'idle' || pendingCount > 0)) {
    return (
      <div className="fixed bottom-16 left-0 right-0 z-40 mx-2 mb-2">
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 px-4 py-3 rounded-xl flex items-center justify-center gap-3 shadow-lg">
          <Cloud className="h-5 w-5 text-primary" />
          <SyncIndicator state={syncState} pendingCount={pendingCount} />
        </div>
      </div>
    );
  }

  return null;
}
