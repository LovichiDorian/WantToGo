import { useState, useEffect, useCallback, useMemo } from 'react';

export interface DailyQuest {
  id: string;
  type: 'add_place' | 'add_photo' | 'visit_place' | 'add_friend' | 'view_map' | 'check_leaderboard';
  titleKey: string;
  descriptionKey: string;
  icon: string;
  xpReward: number;
  target: number;
  current: number;
  completed: boolean;
  claimedAt?: string;
}

interface DailyQuestsData {
  quests: DailyQuest[];
  generatedDate: string;
  completedCount: number;
  bonusClaimed: boolean;
}

const QUESTS_STORAGE_KEY = 'wanttogo_daily_quests';

const QUEST_TEMPLATES: Omit<DailyQuest, 'id' | 'current' | 'completed' | 'claimedAt'>[] = [
  {
    type: 'add_place',
    titleKey: 'dailyQuests.addPlace.title',
    descriptionKey: 'dailyQuests.addPlace.description',
    icon: '📍',
    xpReward: 150,
    target: 1,
  },
  {
    type: 'add_place',
    titleKey: 'dailyQuests.addPlaces.title',
    descriptionKey: 'dailyQuests.addPlaces.description',
    icon: '🗺️',
    xpReward: 400,
    target: 3,
  },
  {
    type: 'add_photo',
    titleKey: 'dailyQuests.addPhoto.title',
    descriptionKey: 'dailyQuests.addPhoto.description',
    icon: '📸',
    xpReward: 100,
    target: 1,
  },
  {
    type: 'add_photo',
    titleKey: 'dailyQuests.addPhotos.title',
    descriptionKey: 'dailyQuests.addPhotos.description',
    icon: '🖼️',
    xpReward: 300,
    target: 3,
  },
  {
    type: 'visit_place',
    titleKey: 'dailyQuests.visitPlace.title',
    descriptionKey: 'dailyQuests.visitPlace.description',
    icon: '✅',
    xpReward: 200,
    target: 1,
  },
  {
    type: 'add_friend',
    titleKey: 'dailyQuests.addFriend.title',
    descriptionKey: 'dailyQuests.addFriend.description',
    icon: '👥',
    xpReward: 250,
    target: 1,
  },
  {
    type: 'view_map',
    titleKey: 'dailyQuests.exploreMap.title',
    descriptionKey: 'dailyQuests.exploreMap.description',
    icon: '🌍',
    xpReward: 50,
    target: 1,
  },
  {
    type: 'check_leaderboard',
    titleKey: 'dailyQuests.checkLeaderboard.title',
    descriptionKey: 'dailyQuests.checkLeaderboard.description',
    icon: '🏆',
    xpReward: 50,
    target: 1,
  },
];

const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateDailyQuests = (): DailyQuest[] => {
  // Pick 3 random quests, ensuring variety
  const shuffled = shuffleArray(QUEST_TEMPLATES);
  const selected: typeof QUEST_TEMPLATES = [];
  const usedTypes = new Set<string>();

  for (const quest of shuffled) {
    if (selected.length >= 3) break;
    // Try to have different types
    if (usedTypes.size < 3 && usedTypes.has(quest.type)) continue;
    selected.push(quest);
    usedTypes.add(quest.type);
  }

  // If we don't have 3 yet, fill with remaining
  while (selected.length < 3 && shuffled.length > selected.length) {
    const remaining = shuffled.filter(q => !selected.includes(q));
    if (remaining.length > 0) {
      selected.push(remaining[0]);
    }
  }

  return selected.map((template, index) => ({
    ...template,
    id: `quest_${getToday()}_${index}`,
    current: 0,
    completed: false,
  }));
};

export function useDailyQuests() {
  const [questsData, setQuestsData] = useState<DailyQuestsData>(() => {
    try {
      const stored = localStorage.getItem(QUESTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DailyQuestsData;
        // Check if quests are from today
        if (parsed.generatedDate === getToday()) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load daily quests:', e);
    }

    // Generate new quests for today
    return {
      quests: generateDailyQuests(),
      generatedDate: getToday(),
      completedCount: 0,
      bonusClaimed: false,
    };
  });

  // Check for new day and regenerate quests
  useEffect(() => {
    const checkDate = () => {
      const today = getToday();
      if (questsData.generatedDate !== today) {
        setQuestsData({
          quests: generateDailyQuests(),
          generatedDate: today,
          completedCount: 0,
          bonusClaimed: false,
        });
      }
    };

    checkDate();
    const interval = setInterval(checkDate, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [questsData.generatedDate]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(questsData));
    } catch (e) {
      console.error('Failed to save daily quests:', e);
    }
  }, [questsData]);

  const updateQuestProgress = useCallback((type: DailyQuest['type'], increment: number = 1) => {
    setQuestsData(prev => {
      const updatedQuests = prev.quests.map(quest => {
        if (quest.type !== type || quest.completed) return quest;

        const newCurrent = Math.min(quest.current + increment, quest.target);
        const nowCompleted = newCurrent >= quest.target;

        return {
          ...quest,
          current: newCurrent,
          completed: nowCompleted,
          claimedAt: nowCompleted ? new Date().toISOString() : undefined,
        };
      });

      const newCompletedCount = updatedQuests.filter(q => q.completed).length;

      return {
        ...prev,
        quests: updatedQuests,
        completedCount: newCompletedCount,
      };
    });
  }, []);

  const claimBonus = useCallback(() => {
    if (questsData.completedCount < 3 || questsData.bonusClaimed) return 0;

    setQuestsData(prev => ({
      ...prev,
      bonusClaimed: true,
    }));

    return 500; // Bonus XP for completing all 3 quests
  }, [questsData.completedCount, questsData.bonusClaimed]);

  const totalXPAvailable = useMemo(() => {
    return questsData.quests.reduce((sum, q) => sum + q.xpReward, 0) + 500; // +500 bonus
  }, [questsData.quests]);

  const xpEarned = useMemo(() => {
    let earned = questsData.quests
      .filter(q => q.completed)
      .reduce((sum, q) => sum + q.xpReward, 0);
    if (questsData.bonusClaimed) earned += 500;
    return earned;
  }, [questsData.quests, questsData.bonusClaimed]);

  const allCompleted = questsData.completedCount === 3;
  const canClaimBonus = allCompleted && !questsData.bonusClaimed;

  const timeUntilReset = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  }, []);

  return {
    quests: questsData.quests,
    completedCount: questsData.completedCount,
    bonusClaimed: questsData.bonusClaimed,
    allCompleted,
    canClaimBonus,
    totalXPAvailable,
    xpEarned,
    timeUntilReset,
    updateQuestProgress,
    claimBonus,
  };
}

export default useDailyQuests;
