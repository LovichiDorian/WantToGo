import { apiRequest } from './client';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  shareCode: string;
  xp: number;
  level: number;
  placesAdded: number;
  placesVisited: number;
  xpThisMonth: number;
  isCurrentUser: boolean;
}

export interface MonthlyChallengeStats {
  daysLeft: number;
  leaderboard: (LeaderboardEntry & { placesThisMonth: number })[];
  userRank: number;
  userPlacesThisMonth: number;
}

export interface TopCity {
  city: string;
  count: number;
}

export interface CountryHeatmapEntry {
  country: string;
  count: number;
}

// Get friends leaderboard
export async function getFriendsLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiRequest<LeaderboardEntry[]>('/leaderboard/friends');
}

// Get monthly challenge stats
export async function getMonthlyChallengeStats(): Promise<MonthlyChallengeStats> {
  return apiRequest<MonthlyChallengeStats>('/leaderboard/monthly-challenge');
}

// Get user's rank
export async function getUserRank(): Promise<{ rank: number; total: number }> {
  return apiRequest<{ rank: number; total: number }>('/leaderboard/rank');
}

// Get top cities (premium)
export async function getTopCities(): Promise<TopCity[]> {
  return apiRequest<TopCity[]>('/leaderboard/top-cities');
}

// Get country heatmap (premium)
export async function getCountryHeatmap(): Promise<CountryHeatmapEntry[]> {
  return apiRequest<CountryHeatmapEntry[]>('/leaderboard/country-heatmap');
}

// Get total distance traveled
export async function getTotalDistance(): Promise<{ totalDistanceKm: number }> {
  return apiRequest<{ totalDistanceKm: number }>('/leaderboard/total-distance');
}
