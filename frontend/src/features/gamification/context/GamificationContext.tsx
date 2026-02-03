import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import * as gamificationAPI from '@/lib/api/gamification';
import type { UserProfile, Achievement, XpProgress } from '@/lib/api/gamification';

interface GamificationContextType {
  profile: UserProfile | null;
  achievements: Achievement[];
  xpProgress: XpProgress | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  refreshAchievements: () => Promise<void>;
  checkAchievements: () => Promise<{ unlocked: { code: string; xpReward: number }[] }>;
  updateLanguage: (language: 'fr' | 'en') => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [xpProgress, setXpProgress] = useState<XpProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await gamificationAPI.getProfile();
      setProfile(data);
      setXpProgress({
        xp: data.xp,
        level: data.level,
        ...data.xpProgress,
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const refreshAchievements = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await gamificationAPI.getAchievements();
      setAchievements(data);
    } catch (err) {
      console.error('Failed to fetch achievements:', err);
    }
  }, [isAuthenticated]);

  const checkAchievements = useCallback(async () => {
    if (!isAuthenticated) return { unlocked: [] };
    
    try {
      const result = await gamificationAPI.checkAchievements();
      if (result.unlocked.length > 0) {
        // Refresh data if new achievements were unlocked
        await Promise.all([refreshProfile(), refreshAchievements()]);
      }
      return result;
    } catch (err) {
      console.error('Failed to check achievements:', err);
      return { unlocked: [] };
    }
  }, [isAuthenticated, refreshProfile, refreshAchievements]);

  const updateLanguage = useCallback(async (language: 'fr' | 'en') => {
    if (!isAuthenticated) return;
    
    try {
      await gamificationAPI.updateLanguage(language);
      await refreshProfile();
    } catch (err) {
      console.error('Failed to update language:', err);
    }
  }, [isAuthenticated, refreshProfile]);

  // Load profile on auth change
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshProfile();
      refreshAchievements();
    } else {
      setProfile(null);
      setAchievements([]);
      setXpProgress(null);
    }
  }, [isAuthenticated, user, refreshProfile, refreshAchievements]);

  return (
    <GamificationContext.Provider
      value={{
        profile,
        achievements,
        xpProgress,
        isLoading,
        error,
        refreshProfile,
        refreshAchievements,
        checkAchievements,
        updateLanguage,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
