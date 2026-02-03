import { apiRequest } from './client';
import type { Place } from '../types';

/**
 * Fetch all places from the server
 */
export async function fetchPlaces(): Promise<Place[]> {
  return apiRequest<Place[]>('/places');
}

/**
 * Fetch a single place from the server
 */
export async function fetchPlace(id: string): Promise<Place> {
  return apiRequest<Place>(`/places/${id}`);
}

/**
 * Create a new place on the server
 */
export async function createPlace(place: Omit<Place, 'id' | 'photos' | 'createdAt' | 'updatedAt' | 'syncStatus'>): Promise<Place> {
  return apiRequest<Place>('/places', {
    method: 'POST',
    body: JSON.stringify(place),
  });
}

/**
 * Update a place on the server
 */
export async function updatePlace(id: string, place: Partial<Place>): Promise<Place> {
  return apiRequest<Place>(`/places/${id}`, {
    method: 'PUT',
    body: JSON.stringify(place),
  });
}

/**
 * Delete a place on the server
 */
export async function deletePlace(id: string): Promise<void> {
  return apiRequest(`/places/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Mark a place as visited
 */
export interface MarkVisitedResponse {
  id: string;
  isVisited: boolean;
  visitedAt: string;
  visitedWithGeoloc: boolean;
  xpEarned: number;
  bonusXp: number;
  achievements: { code: string; xpReward: number }[];
}

export async function markPlaceVisited(
  id: string, 
  isNearby: boolean = false
): Promise<MarkVisitedResponse> {
  return apiRequest<MarkVisitedResponse>(`/places/${id}/visited`, {
    method: 'POST',
    body: JSON.stringify({ isNearby }),
  });
}

/**
 * Undo marking a place as visited (within 24h)
 */
export async function undoPlaceVisited(id: string): Promise<Place> {
  return apiRequest<Place>(`/places/${id}/visited`, {
    method: 'DELETE',
  });
}

/**
 * Get place statistics
 */
export interface PlaceStats {
  totalPlaces: number;
  visitedPlaces: number;
  placesWithPhotos: number;
  visitRate: number;
}

export async function getPlaceStats(): Promise<PlaceStats> {
  return apiRequest<PlaceStats>('/places/stats');
}
