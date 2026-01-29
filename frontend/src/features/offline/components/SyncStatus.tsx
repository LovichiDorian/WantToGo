import { useTranslation } from 'react-i18next';
import { RefreshCw, CheckCircle, AlertCircle, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SyncState } from '../hooks/useSync';

interface SyncStatusProps {
  syncState: SyncState;
  pendingCount: number;
}

export function SyncStatus({ syncState, pendingCount }: SyncStatusProps) {
  const { t } = useTranslation();

  if (syncState === 'idle' && pendingCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-12 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all',
        syncState === 'syncing' && 'bg-blue-500 text-white',
        syncState === 'success' && 'bg-green-500 text-white',
        syncState === 'error' && 'bg-red-500 text-white',
        syncState === 'idle' && pendingCount > 0 && 'bg-amber-500 text-amber-950'
      )}
    >
      {syncState === 'syncing' && (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>{t('offline.syncing')}</span>
        </>
      )}
      {syncState === 'success' && (
        <>
          <CheckCircle className="h-4 w-4" />
          <span>{t('offline.syncComplete')}</span>
        </>
      )}
      {syncState === 'error' && (
        <>
          <AlertCircle className="h-4 w-4" />
          <span>Sync failed</span>
        </>
      )}
      {syncState === 'idle' && pendingCount > 0 && (
        <>
          <Cloud className="h-4 w-4" />
          <span>{pendingCount} pending</span>
        </>
      )}
    </div>
  );
}
