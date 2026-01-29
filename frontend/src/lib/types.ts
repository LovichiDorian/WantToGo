/**
 * Shared types between frontend and backend
 */

export interface Friend {
  id: string;
  name: string;
  color: string;
  places: FriendPlace[];
  addedAt: string;
}

export interface FriendPlace {
  id: string;
  name: string;
  notes?: string;
  latitude: number;
  longitude: number;
  address?: string;
  tripDate?: string;
}

export interface Place {
  id: string;
  serverId?: string;
  clientId?: string;
  name: string;
  notes?: string;
  latitude: number;
  longitude: number;
  address?: string;
  tripDate?: string;
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export interface Photo {
  id: string;
  placeId: string;
  filename?: string;
  blob?: Blob;
  mimeType: string;
  size?: number;
  createdAt: string;
  syncStatus: SyncStatus;
}

export type SyncStatus = 'synced' | 'pending' | 'conflict';

export interface SyncQueueItem {
  id?: number;
  actionType: 'create' | 'update' | 'delete';
  entityType: 'place' | 'photo';
  entityId: string;
  payload?: Record<string, unknown>;
  timestamp: string;
  retryCount: number;
}

export interface IdMapping {
  clientId: string;
  serverId: string;
}

export interface BulkSyncRequest {
  actions: SyncAction[];
  lastSyncedAt?: string;
}

export interface SyncAction {
  actionType: 'create' | 'update' | 'delete';
  entityType: 'place' | 'photo';
  clientId: string;
  serverId?: string;
  payload?: Record<string, unknown>;
  timestamp: string;
}

export interface BulkSyncResponse {
  success: boolean;
  idMappings: IdMapping[];
  updatedPlaces: Place[];
  conflicts: SyncConflict[];
  syncedAt: string;
}

export interface SyncConflict {
  clientId: string;
  serverVersion: Place;
  resolution: 'server_wins' | 'client_wins';
}
