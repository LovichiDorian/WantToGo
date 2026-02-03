import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';

// XP rewards configuration
export const XP_REWARDS = {
  PLACE_ADDED: 50,
  PHOTO_ADDED: 100,
  PLACE_VISITED: 200,
  PLACE_VISITED_GEOLOC: 300, // Bonus for being within 500m
  FRIEND_INVITED: 500,
} as const;

// Achievement criteria types
export type AchievementCriteria = {
  type: string;
  count: number;
};

@Injectable()
export class GamificationService {
  constructor(
    private prisma: PrismaService,
    private activitiesService: ActivitiesService,
  ) {}

  /**
   * Calculate level from XP using formula: level = floor(sqrt(xp / 1000)) + 1
   */
  calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 1000)) + 1;
  }

  /**
   * Calculate XP required for a specific level
   */
  xpForLevel(level: number): number {
    return (level - 1) * (level - 1) * 1000;
  }

  /**
   * Get XP needed to reach next level
   */
  xpToNextLevel(currentXp: number): { xpNeeded: number; nextLevel: number; progress: number } {
    const currentLevel = this.calculateLevel(currentXp);
    const nextLevel = currentLevel + 1;
    const xpForCurrent = this.xpForLevel(currentLevel);
    const xpForNext = this.xpForLevel(nextLevel);
    const xpNeeded = xpForNext - currentXp;
    const progress = ((currentXp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100;

    return { xpNeeded, nextLevel, progress: Math.min(100, Math.max(0, progress)) };
  }

  /**
   * Award XP to a user and check for level up
   */
  async awardXp(
    userId: string,
    amount: number,
    source: string,
    metadata?: Record<string, unknown>,
  ): Promise<{ newXp: number; newLevel: number; leveledUp: boolean; oldLevel: number }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const oldLevel = user.level;
    const newXp = user.xp + amount;
    const newLevel = this.calculateLevel(newXp);
    const leveledUp = newLevel > oldLevel;

    // Update user XP and level
    await this.prisma.user.update({
      where: { id: userId },
      data: { xp: newXp, level: newLevel },
    });

    // Record activity
    await this.activitiesService.createActivity(userId, source, {
      ...metadata,
      xpEarned: amount,
    }, amount);

    // If leveled up, create level up activity
    if (leveledUp) {
      await this.activitiesService.createActivity(userId, 'level_up', {
        oldLevel,
        newLevel,
      }, 0);
    }

    return { newXp, newLevel, leveledUp, oldLevel };
  }

  /**
   * Get user's gamification profile
   */
  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        shareCode: true,
        xp: true,
        level: true,
        placesVisitedCount: true,
        language: true,
        createdAt: true,
        achievements: {
          include: {
            achievement: true,
          },
          orderBy: {
            unlockedAt: 'desc',
          },
        },
        _count: {
          select: {
            places: true,
            friendships: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get photo count
    const photoCount = await this.prisma.photo.count({
      where: {
        place: {
          userId,
          deletedAt: null,
        },
      },
    });

    // Get unique countries and cities
    const places = await this.prisma.place.findMany({
      where: { userId, deletedAt: null },
      select: { country: true, city: true },
    });

    const countries = new Set(places.map(p => p.country).filter(Boolean));
    const cities = new Set(places.map(p => p.city).filter(Boolean));

    const xpProgress = this.xpToNextLevel(user.xp);

    return {
      ...user,
      photoCount,
      countriesCount: countries.size,
      citiesCount: cities.size,
      placesCount: user._count.places,
      friendsCount: user._count.friendships,
      xpProgress,
    };
  }

  /**
   * Get all achievements with user's progress
   */
  async getAchievements(userId: string) {
    const [achievements, userAchievements, userStats] = await Promise.all([
      this.prisma.achievement.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.userAchievement.findMany({
        where: { userId },
        select: {
          achievementId: true,
          unlockedAt: true,
          metadata: true,
        },
      }),
      this.getUserStats(userId),
    ]);

    const unlockedMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua]),
    );

    return achievements.map(achievement => {
      const unlocked = unlockedMap.get(achievement.id);
      const criteria = achievement.criteria as AchievementCriteria;
      const progress = this.getAchievementProgress(criteria, userStats);

      return {
        ...achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
        metadata: unlocked?.metadata,
        progress: {
          current: progress,
          target: criteria.count,
          percent: Math.min(100, (progress / criteria.count) * 100),
        },
      };
    });
  }

  /**
   * Get user statistics for achievement progress
   */
  private async getUserStats(userId: string) {
    const [placesCount, visitedCount, visitedWithGeolocCount, photosCount, friendsCount, tripsCount, placesWithDates, cityGroups, countryGroups] = await Promise.all([
      // Total places
      this.prisma.place.count({
        where: { userId, deletedAt: null },
      }),
      // Visited places
      this.prisma.place.count({
        where: { userId, deletedAt: null, isVisited: true },
      }),
      // Visited with geoloc
      this.prisma.place.count({
        where: { userId, deletedAt: null, isVisited: true, visitedWithGeoloc: true },
      }),
      // Photos
      this.prisma.photo.count({
        where: { place: { userId, deletedAt: null } },
      }),
      // Friends
      this.prisma.friendship.count({
        where: { userId },
      }),
      // Trips created
      this.prisma.trip.count({
        where: { creatorId: userId },
      }),
      // Places with dates
      this.prisma.place.count({
        where: { userId, deletedAt: null, tripDate: { not: null } },
      }),
      // Group by city for city_explorer achievement
      this.prisma.place.groupBy({
        by: ['city'],
        where: { userId, deletedAt: null, city: { not: null } },
        _count: true,
      }),
      // Distinct countries for globetrotter achievement
      this.prisma.place.findMany({
        where: { userId, deletedAt: null, country: { not: null } },
        distinct: ['country'],
        select: { country: true },
      }),
    ]);

    const maxCityCount = cityGroups.length > 0
      ? Math.max(...cityGroups.map(g => g._count))
      : 0;

    return {
      places_count: placesCount,
      visited_count: visitedCount,
      visited_with_geoloc: visitedWithGeolocCount,
      photos_count: photosCount,
      friends_count: friendsCount,
      trips_created: tripsCount,
      places_with_dates: placesWithDates,
      places_same_city: maxCityCount,
      different_countries: countryGroups.length,
    };
  }

  /**
   * Calculate progress for an achievement
   */
  private getAchievementProgress(criteria: AchievementCriteria, stats: Record<string, number>): number {
    return stats[criteria.type] || 0;
  }

  /**
   * Check and unlock achievements for a user
   */
  async checkAchievements(userId: string): Promise<{ unlocked: Array<{ code: string; xpReward: number }> }> {
    const [achievements, userAchievements, userStats] = await Promise.all([
      this.prisma.achievement.findMany(),
      this.prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true },
      }),
      this.getUserStats(userId),
    ]);

    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
    const newlyUnlocked: Array<{ code: string; xpReward: number }> = [];

    for (const achievement of achievements) {
      if (unlockedIds.has(achievement.id)) continue;

      const criteria = achievement.criteria as AchievementCriteria;
      const progress = this.getAchievementProgress(criteria, userStats);

      if (progress >= criteria.count) {
        // Unlock achievement
        await this.prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            metadata: { progress },
          },
        });

        // Award XP for achievement
        await this.awardXp(userId, achievement.xpReward, 'achievement_unlocked', {
          achievementCode: achievement.code,
          achievementName: achievement.nameEn,
        });

        newlyUnlocked.push({
          code: achievement.code,
          xpReward: achievement.xpReward,
        });
      }
    }

    return { unlocked: newlyUnlocked };
  }

  /**
   * Handle place added event
   */
  async onPlaceAdded(userId: string, placeId: string, placeName: string) {
    await this.awardXp(userId, XP_REWARDS.PLACE_ADDED, 'place_added', {
      placeId,
      placeName,
    });
    return this.checkAchievements(userId);
  }

  /**
   * Handle photo added event
   */
  async onPhotoAdded(userId: string, placeId: string, placeName: string) {
    await this.awardXp(userId, XP_REWARDS.PHOTO_ADDED, 'photo_added', {
      placeId,
      placeName,
    });
    return this.checkAchievements(userId);
  }

  /**
   * Handle place visited event
   */
  async onPlaceVisited(
    userId: string,
    placeId: string,
    placeName: string,
    isNearby: boolean,
  ) {
    const xpAmount = XP_REWARDS.PLACE_VISITED + (isNearby ? XP_REWARDS.PLACE_VISITED_GEOLOC : 0);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { placesVisitedCount: { increment: 1 } },
    });

    await this.awardXp(userId, xpAmount, 'place_visited', {
      placeId,
      placeName,
      isNearby,
      bonusXp: isNearby ? XP_REWARDS.PLACE_VISITED_GEOLOC : 0,
    });

    return this.checkAchievements(userId);
  }

  /**
   * Handle friend signup event (referral)
   */
  async onFriendSignup(referrerId: string, friendName: string) {
    await this.awardXp(referrerId, XP_REWARDS.FRIEND_INVITED, 'friend_invited', {
      friendName,
    });
    return this.checkAchievements(referrerId);
  }

  /**
   * Update user language preference
   */
  async updateLanguage(userId: string, language: 'fr' | 'en') {
    return this.prisma.user.update({
      where: { id: userId },
      data: { language },
      select: { language: true },
    });
  }
}
