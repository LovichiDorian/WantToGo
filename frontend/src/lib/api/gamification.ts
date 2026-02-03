import { apiRequest } from './client';

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  shareCode: string;
  xp: number;
  level: number;
  placesVisitedCount: number;
  language: 'fr' | 'en';
  createdAt: string;
  achievements: UserAchievement[];
  photoCount: number;
  countriesCount: number;
  citiesCount: number;
  placesCount: number;
  friendsCount: number;
  xpProgress: {
    xpNeeded: number;
    nextLevel: number;
    progress: number;
  };
}

export interface Achievement {
  id: string;
  code: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  icon: string;
  xpReward: number;
  criteria: { type: string; count: number };
  isGlobal: boolean;
  sortOrder: number;
  unlocked: boolean;
  unlockedAt?: string;
  metadata?: Record<string, unknown>;
  progress: {
    current: number;
    target: number;
    percent: number;
  };
}

export interface UserAchievement {
  id: string;
  unlockedAt: string;
  achievement: {
    id: string;
    code: string;
    nameEn: string;
    nameFr: string;
    descriptionEn: string;
    descriptionFr: string;
    icon: string;
    xpReward: number;
  };
}

export interface XpProgress {
  xp: number;
  level: number;
  xpNeeded: number;
  nextLevel: number;
  progress: number;
}

// Get user's gamification profile
export async function getProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/gamification/profile');
}

// Get all achievements with progress
export async function getAchievements(): Promise<Achievement[]> {
  return apiRequest<Achievement[]>('/gamification/achievements');
}

// Check for new achievements
export async function checkAchievements(): Promise<{ unlocked: { code: string; xpReward: number }[] }> {
  return apiRequest<{ unlocked: { code: string; xpReward: number }[] }>('/gamification/check-achievements', {
    method: 'POST',
  });
}

// Get XP progress
export async function getXpProgress(): Promise<XpProgress> {
  return apiRequest<XpProgress>('/gamification/xp-progress');
}

// Update language preference
export async function updateLanguage(language: 'fr' | 'en'): Promise<{ language: string }> {
  return apiRequest<{ language: string }>('/gamification/language', {
    method: 'PATCH',
    body: JSON.stringify({ language }),
  });
}
