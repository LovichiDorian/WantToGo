import { getDB } from './index';
import type { SyncQueueItem } from '../types';

/**
 * Add an action to the sync queue
 */
export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<number> {
  const db = await getDB();
  return db.add('syncQueue', item as SyncQueueItem);
}

/**
 * Get all pending sync actions
 */
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  const db = await getDB();
  return db.getAll('syncQueue');
}

/**
 * Remove a sync action from the queue
 */
export async function removeFromSyncQueue(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('syncQueue', id);
}

/**
 * Clear all processed sync actions
 */
export async function clearSyncQueue(): Promise<void> {
  const db = await getDB();
  await db.clear('syncQueue');
}

/**
 * Increment retry count for a sync action
 */
export async function incrementRetryCount(id: number): Promise<void> {
  const db = await getDB();
  const item = await db.get('syncQueue', id);
  
  if (item) {
    item.retryCount += 1;
    await db.put('syncQueue', item);
  }
}

/**
 * Get sync actions for a specific entity
 */
export async function getSyncActionsForEntity(entityId: string): Promise<SyncQueueItem[]> {
  const db = await getDB();
  return db.getAllFromIndex('syncQueue', 'by-entity', entityId);
}

/**
 * Remove sync actions for a specific entity (e.g., when entity is deleted)
 */
export async function removeSyncActionsForEntity(entityId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('syncQueue', 'readwrite');
  const index = tx.store.index('by-entity');
  
  const keys = await index.getAllKeys(entityId);
  for (const key of keys) {
    await tx.store.delete(key);
  }
  
  await tx.done;
}
