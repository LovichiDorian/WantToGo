import { useState, useCallback, useEffect } from 'react';
import { getSyncQueue, clearSyncQueue } from '@/lib/db/syncQueue';
import { reconcilePlaceId, mergePlacesFromServer } from '@/lib/db/places';
import { bulkSync } from '@/lib/api/sync';
import type { SyncAction } from '@/lib/types';
import { useOnlineStatus } from './useOnlineStatus';

export type SyncState = 'idle' | 'syncing' | 'success' | 'error';

/**
 * Hook to manage synchronization with the backend
 */
export function useSync() {
  const isOnline = useOnlineStatus();
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(
    localStorage.getItem('lastSyncedAt')
  );
  const [pendingCount, setPendingCount] = useState(0);

  // Update pending count
  const updatePendingCount = useCallback(async () => {
    const queue = await getSyncQueue();
    setPendingCount(queue.length);
  }, []);

  // Run sync operation
  const performSync = useCallback(async () => {
    if (syncState === 'syncing') return;

    try {
      setSyncState('syncing');

      // Get all pending actions from queue
      const queue = await getSyncQueue();
      
      if (queue.length === 0) {
        setSyncState('idle');
        return;
      }

      // Convert queue items to sync actions
      const actions: SyncAction[] = queue.map((item) => ({
        actionType: item.actionType,
        entityType: item.entityType,
        clientId: item.entityId,
        serverId: item.payload?.serverId as string | undefined,
        payload: item.payload,
        timestamp: item.timestamp,
      }));

      // Send to server
      const response = await bulkSync({
        actions,
        lastSyncedAt: lastSyncedAt || undefined,
      });

      if (response.success) {
        // Process ID mappings
        for (const mapping of response.idMappings) {
          await reconcilePlaceId(mapping.clientId, mapping.serverId);
        }

        // Merge updated places from server
        await mergePlacesFromServer(response.updatedPlaces);

        // Clear processed queue
        await clearSyncQueue();

        // Update last synced timestamp
        const syncedAt = response.syncedAt;
        localStorage.setItem('lastSyncedAt', syncedAt);
        setLastSyncedAt(syncedAt);

        setSyncState('success');
        
        // Reset to idle after a short delay
        setTimeout(() => setSyncState('idle'), 2000);
      } else {
        setSyncState('error');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncState('error');
    }

    await updatePendingCount();
  }, [syncState, lastSyncedAt, updatePendingCount]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline) {
      performSync();
    }
  }, [isOnline]); // Only trigger on online status change

  // Update pending count on mount
  useEffect(() => {
    updatePendingCount();
  }, [updatePendingCount]);

  // Register for background sync if supported
  useEffect(() => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        // @ts-expect-error - sync is not in the types yet
        registration.sync.register('place-sync').catch(console.error);
      });
    }
  }, []);

  return {
    syncState,
    isOnline,
    pendingCount,
    lastSyncedAt,
    performSync,
    updatePendingCount,
  };
}
