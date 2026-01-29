import { apiRequest } from './client';
import type { FriendPlace } from '../types';

const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('wanttogo-device-id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('wanttogo-device-id', deviceId);
  }
  return deviceId;
};

export interface MyCodeResponse {
  shareCode: string;
  placesCount: number;
}

export interface FriendResponse {
  shareCode: string;
  name: string;
  places: FriendPlace[];
}

/**
 * Get my share code (creates user if needed)
 */
export async function getMyShareCode(): Promise<MyCodeResponse> {
  return apiRequest<MyCodeResponse>('/friends/my-code', {
    headers: {
      'x-device-id': getDeviceId(),
    },
  });
}

/**
 * Get friend's places by their share code
 */
export async function getFriendPlaces(shareCode: string): Promise<FriendResponse> {
  return apiRequest<FriendResponse>(`/friends/places/${shareCode}`);
}

/**
 * Update my display name
 */
export async function updateMyName(name: string): Promise<void> {
  await apiRequest('/friends/my-name', {
    method: 'PATCH',
    headers: {
      'x-device-id': getDeviceId(),
    },
    body: JSON.stringify({ name }),
  });
}
