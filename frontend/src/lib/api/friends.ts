import { apiRequest } from './client';
import type { FriendPlace } from '../types';
import { getStoredToken } from './auth';

export interface MyCodeResponse {
  shareCode: string;
  placesCount: number;
}

export interface FriendResponse {
  shareCode: string;
  name: string;
  places: FriendPlace[];
}

export interface FriendshipResponse {
  id: string;
  friendCode: string;
  friendName: string;
  color: string;
  places: FriendPlace[];
  createdAt: string;
}

/**
 * Get auth headers for authenticated requests
 */
function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  return {
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Get my share code (authenticated)
 */
export async function getMyShareCode(): Promise<MyCodeResponse> {
  return apiRequest<MyCodeResponse>('/friends/my-code', {
    headers: getAuthHeaders(),
  });
}

/**
 * Get all my friends (authenticated)
 */
export async function getFriends(): Promise<FriendshipResponse[]> {
  return apiRequest<FriendshipResponse[]>('/friends', {
    headers: getAuthHeaders(),
  });
}

/**
 * Add a friend by their share code (authenticated)
 */
export async function addFriend(shareCode: string): Promise<FriendshipResponse> {
  return apiRequest<FriendshipResponse>('/friends', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ shareCode }),
  });
}

/**
 * Delete a friend (authenticated)
 */
export async function deleteFriend(friendshipId: string): Promise<void> {
  await apiRequest(`/friends/${friendshipId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

/**
 * Get friend's places by their share code (public endpoint for preview)
 */
export async function getFriendPlaces(shareCode: string): Promise<FriendResponse> {
  return apiRequest<FriendResponse>(`/friends/places/${shareCode}`);
}
