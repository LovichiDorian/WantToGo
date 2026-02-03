import { apiRequest } from './client';

export interface Activity {
  id: string;
  userId: string;
  type: 'place_added' | 'place_visited' | 'photo_added' | 'friend_added' | 'achievement_unlocked' | 'level_up' | 'trip_created' | 'trip_place_added';
  metadata: Record<string, unknown>;
  xpEarned: number;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    shareCode: string;
    level?: number;
  };
  userName?: string;
}

export interface ActivitiesResponse {
  items: Activity[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface XpHistoryEntry {
  date: string;
  xp: number;
  cumulative: number;
}

// Get user's own activities
export async function getMyActivities(limit = 20, cursor?: string): Promise<ActivitiesResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.append('cursor', cursor);
  return apiRequest<ActivitiesResponse>(`/activities/me?${params}`);
}

// Get friends' activities (social feed)
export async function getFriendsActivities(limit = 20, cursor?: string): Promise<ActivitiesResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.append('cursor', cursor);
  return apiRequest<ActivitiesResponse>(`/activities/friends?${params}`);
}

// Get XP history for charts (premium)
export async function getXpHistory(days = 30): Promise<XpHistoryEntry[]> {
  return apiRequest<XpHistoryEntry[]>(`/activities/xp-history?days=${days}`);
}
