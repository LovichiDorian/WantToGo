import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Place, Photo, SyncQueueItem } from '../types';

/**
 * IndexedDB schema for WantToGo
 * This is the local source of truth when offline
 */
interface WantToGoDBSchema extends DBSchema {
  places: {
    key: string;
    value: Place;
    indexes: {
      'by-sync-status': string;
      'by-updated': string;
    };
  };
  photos: {
    key: string;
    value: Photo;
    indexes: {
      'by-place': string;
      'by-sync-status': string;
    };
  };
  syncQueue: {
    key: number;
    value: SyncQueueItem;
    indexes: {
      'by-entity': string;
    };
  };
}

const DB_NAME = 'wanttogo-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<WantToGoDBSchema> | null = null;

/**
 * Initialize and get the IndexedDB database instance
 */
export async function getDB(): Promise<IDBPDatabase<WantToGoDBSchema>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<WantToGoDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Places store
      if (!db.objectStoreNames.contains('places')) {
        const placesStore = db.createObjectStore('places', { keyPath: 'id' });
        placesStore.createIndex('by-sync-status', 'syncStatus');
        placesStore.createIndex('by-updated', 'updatedAt');
      }

      // Photos store
      if (!db.objectStoreNames.contains('photos')) {
        const photosStore = db.createObjectStore('photos', { keyPath: 'id' });
        photosStore.createIndex('by-place', 'placeId');
        photosStore.createIndex('by-sync-status', 'syncStatus');
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', {
          keyPath: 'id',
          autoIncrement: true,
        });
        syncStore.createIndex('by-entity', 'entityId');
      }
    },
  });

  return dbInstance;
}

/**
 * Close the database connection
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
