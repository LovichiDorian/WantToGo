import { useState, useEffect, useCallback, useMemo } from 'react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  multiplier: number;
  isActiveToday: boolean;
}

const STREAK_STORAGE_KEY = 'wanttogo_streak_data';

const getMultiplier = (streak: number): number => {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.75;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
};

const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getYesterday = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>(() => {
    try {
      const stored = localStorage.getItem(STREAK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StreakData;
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load streak data:', e);
    }
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      multiplier: 1.0,
      isActiveToday: false,
    };
  });

  // Check and update streak on mount and date change
  useEffect(() => {
    const checkStreak = () => {
      const today = getToday();
      const yesterday = getYesterday();

      setStreakData(prev => {
        // Already active today
        if (prev.lastActiveDate === today) {
          return {
            ...prev,
            isActiveToday: true,
            multiplier: getMultiplier(prev.currentStreak),
          };
        }

        // Was active yesterday - streak continues (but not yet active today)
        if (prev.lastActiveDate === yesterday) {
          return {
            ...prev,
            isActiveToday: false,
            multiplier: getMultiplier(prev.currentStreak),
          };
        }

        // Streak broken - reset to 0
        if (prev.lastActiveDate && prev.lastActiveDate < yesterday) {
          return {
            currentStreak: 0,
            longestStreak: prev.longestStreak,
            lastActiveDate: prev.lastActiveDate,
            multiplier: 1.0,
            isActiveToday: false,
          };
        }

        return prev;
      });
    };

    checkStreak();

    // Check every minute for date changes
    const interval = setInterval(checkStreak, 60000);
    return () => clearInterval(interval);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
    } catch (e) {
      console.error('Failed to save streak data:', e);
    }
  }, [streakData]);

  const recordActivity = useCallback(() => {
    const today = getToday();
    const yesterday = getYesterday();

    setStreakData(prev => {
      // Already recorded today
      if (prev.lastActiveDate === today) {
        return prev;
      }

      let newStreak: number;

      // Continuing streak from yesterday
      if (prev.lastActiveDate === yesterday) {
        newStreak = prev.currentStreak + 1;
      }
      // Starting fresh (first time or broken streak)
      else {
        newStreak = 1;
      }

      const newLongest = Math.max(newStreak, prev.longestStreak);

      return {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today,
        multiplier: getMultiplier(newStreak),
        isActiveToday: true,
      };
    });
  }, []);

  const resetStreak = useCallback(() => {
    setStreakData({
      currentStreak: 0,
      longestStreak: streakData.longestStreak,
      lastActiveDate: null,
      multiplier: 1.0,
      isActiveToday: false,
    });
  }, [streakData.longestStreak]);

  const streakMilestones = useMemo(() => {
    const milestones = [3, 7, 14, 30, 50, 100, 365];
    return milestones.map(days => ({
      days,
      achieved: streakData.longestStreak >= days,
      current: streakData.currentStreak >= days,
    }));
  }, [streakData.currentStreak, streakData.longestStreak]);

  const nextMilestone = useMemo(() => {
    const milestones = [3, 7, 14, 30, 50, 100, 365];
    return milestones.find(m => m > streakData.currentStreak) || null;
  }, [streakData.currentStreak]);

  const daysUntilNextMilestone = useMemo(() => {
    if (!nextMilestone) return null;
    return nextMilestone - streakData.currentStreak;
  }, [nextMilestone, streakData.currentStreak]);

  return {
    ...streakData,
    recordActivity,
    resetStreak,
    streakMilestones,
    nextMilestone,
    daysUntilNextMilestone,
    getMultiplier,
  };
}

export default useStreak;
