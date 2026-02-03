import { useState, useEffect, useCallback } from 'react';
import type { Place } from '@/lib/types';
import * as placesDB from '@/lib/db/places';
import { addToSyncQueue } from '@/lib/db/syncQueue';
import { fetchPlaces, createPlace as createPlaceAPI } from '@/lib/api/places';
import { useOnlineStatus } from '@/features/offline/hooks/useOnlineStatus';

interface UsePlacesReturn {
  places: Place[];
  isLoading: boolean;
  error: string | null;
  createPlace: (place: Omit<Place, 'id' | 'photos' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => Promise<Place>;
  updatePlace: (id: string, updates: Partial<Place>) => Promise<void>;
  deletePlace: (id: string) => Promise<void>;
  refreshPlaces: () => Promise<void>;
}

/**
 * Hook to manage places with offline-first architecture
 */
export function usePlaces(): UsePlacesReturn {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOnline = useOnlineStatus();

  // Load places from IndexedDB (always the source of truth for UI)
  const loadFromDB = useCallback(async () => {
    try {
      const dbPlaces = await placesDB.getAllPlaces();
      setPlaces(dbPlaces);
    } catch (err) {
      console.error('Failed to load places from DB:', err);
      setError('Failed to load places');
    }
  }, []);

  // Sync with server when online
  const syncWithServer = useCallback(async () => {
    if (!isOnline) return;

    try {
      const serverPlaces = await fetchPlaces();
      await placesDB.mergePlacesFromServer(serverPlaces);
      await loadFromDB();
    } catch (err) {
      console.error('Failed to sync with server:', err);
      // Don't set error - we can still work offline
    }
  }, [isOnline, loadFromDB]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadFromDB();
      await syncWithServer();
      setIsLoading(false);
    };
    init();
  }, [loadFromDB, syncWithServer]);

  // Create a new place
  const createPlace = useCallback(
    async (placeData: Omit<Place, 'id' | 'photos' | 'createdAt' | 'updatedAt' | 'syncStatus'>): Promise<Place> => {
      // Always try to create on server first (don't rely on navigator.onLine)
      try {
        // Create on server first
        const serverPlace = await createPlaceAPI(placeData);
        
        // Transform to local format with synced status
        const localPlace: Place = {
          ...serverPlace,
          id: serverPlace.id,
          serverId: serverPlace.id,
          photos: serverPlace.photos || [],
          syncStatus: 'synced',
        };
        
        // Save to IndexedDB
        await placesDB.savePlace(localPlace);
        
        // Update local state
        setPlaces((prev) => [localPlace, ...prev]);
        
        return localPlace;
      } catch (error) {
        console.warn('Failed to create on server, saving offline:', error);
        // Fall through to offline mode
      }
      
      // Offline mode: Save to IndexedDB first (optimistic)
      const newPlace = await placesDB.savePlace(placeData);
      
      // Add to sync queue
      await addToSyncQueue({
        actionType: 'create',
        entityType: 'place',
        entityId: newPlace.id,
        payload: {
          ...placeData,
          clientId: newPlace.id,
        },
        timestamp: new Date().toISOString(),
        retryCount: 0,
      });

      // Update local state
      setPlaces((prev) => [newPlace, ...prev]);

      // Trigger background sync if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        // @ts-expect-error - sync not in types
        await registration.sync.register('place-sync');
      }

      return newPlace;
    },
    []
  );

  // Update an existing place
  const updatePlace = useCallback(
    async (id: string, updates: Partial<Place>): Promise<void> => {
      const existing = places.find((p) => p.id === id);
      if (!existing) return;

      // Save to IndexedDB
      await placesDB.savePlace({
        ...existing,
        ...updates,
        id,
      });

      // Add to sync queue
      await addToSyncQueue({
        actionType: 'update',
        entityType: 'place',
        entityId: id,
        payload: {
          ...updates,
          serverId: existing.serverId,
        },
        timestamp: new Date().toISOString(),
        retryCount: 0,
      });

      // Update local state
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...updates, updatedAt: new Date().toISOString(), syncStatus: 'pending' }
            : p
        )
      );
    },
    [places]
  );

  // Delete a place
  const deletePlace = useCallback(
    async (id: string): Promise<void> => {
      const existing = places.find((p) => p.id === id);
      
      // Add to sync queue before deleting
      await addToSyncQueue({
        actionType: 'delete',
        entityType: 'place',
        entityId: id,
        payload: {
          serverId: existing?.serverId,
        },
        timestamp: new Date().toISOString(),
        retryCount: 0,
      });

      // Delete from IndexedDB
      await placesDB.deletePlace(id);

      // Update local state
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    },
    [places]
  );

  // Refresh places
  const refreshPlaces = useCallback(async () => {
    await loadFromDB();
    await syncWithServer();
  }, [loadFromDB, syncWithServer]);

  return {
    places,
    isLoading,
    error,
    createPlace,
    updatePlace,
    deletePlace,
    refreshPlaces,
  };
}
