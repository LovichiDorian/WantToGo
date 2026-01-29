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
