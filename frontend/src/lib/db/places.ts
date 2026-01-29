import { getDB } from './index';
import type { Place } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get all places from IndexedDB
 */
export async function getAllPlaces(): Promise<Place[]> {
  const db = await getDB();
  const places = await db.getAll('places');
  return places.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get a single place by ID
 */
export async function getPlace(id: string): Promise<Place | undefined> {
  const db = await getDB();
  return db.get('places', id);
}

/**
 * Save a place to IndexedDB (create or update)
 */
export async function savePlace(place: Partial<Place> & { name: string; latitude: number; longitude: number }): Promise<Place> {
  const db = await getDB();
  const now = new Date().toISOString();
  
  const existingPlace = place.id ? await db.get('places', place.id) : undefined;
  
  const placeToSave: Place = {
    id: place.id || uuidv4(),
    name: place.name,
    notes: place.notes,
    latitude: place.latitude,
    longitude: place.longitude,
    address: place.address,
    tripDate: place.tripDate,
    photos: existingPlace?.photos || [],
    createdAt: existingPlace?.createdAt || now,
    updatedAt: now,
    syncStatus: 'pending',
    ...(existingPlace?.serverId && { serverId: existingPlace.serverId }),
  };

  await db.put('places', placeToSave);
  return placeToSave;
}

/**
 * Delete a place from IndexedDB
 */
export async function deletePlace(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('places', id);
  
  // Also delete associated photos
  const tx = db.transaction('photos', 'readwrite');
  const index = tx.store.index('by-place');
  const photos = await index.getAllKeys(id);
  for (const photoId of photos) {
    await tx.store.delete(photoId);
  }
  await tx.done;
}

/**
 * Get all places with pending sync status
 */
export async function getPendingPlaces(): Promise<Place[]> {
  const db = await getDB();
  return db.getAllFromIndex('places', 'by-sync-status', 'pending');
}

/**
 * Update place sync status after successful sync
 */
export async function updatePlaceSyncStatus(
  id: string, 
  syncStatus: 'synced' | 'pending' | 'conflict',
  serverId?: string
): Promise<void> {
  const db = await getDB();
  const place = await db.get('places', id);
  
  if (place) {
    place.syncStatus = syncStatus;
    if (serverId) {
      place.serverId = serverId;
    }
    await db.put('places', place);
  }
}

/**
 * Merge server places with local places after sync
 * Uses server data as source of truth for synced items
 */
export async function mergePlacesFromServer(serverPlaces: Place[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('places', 'readwrite');
  
  for (const serverPlace of serverPlaces) {
    const localPlace = await tx.store.get(serverPlace.id);
    
    // Only update if local version is not pending
    if (!localPlace || localPlace.syncStatus !== 'pending') {
      await tx.store.put({
        ...serverPlace,
        syncStatus: 'synced',
      });
    }
  }
  
  await tx.done;
}

/**
 * Update local place ID with server ID after sync
 */
export async function reconcilePlaceId(clientId: string, serverId: string): Promise<void> {
  const db = await getDB();
  const place = await db.get('places', clientId);
  
  if (place) {
    // Update the place with server ID
    place.serverId = serverId;
    place.syncStatus = 'synced';
    await db.put('places', place);
  }
}
