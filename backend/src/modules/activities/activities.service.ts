import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export type ActivityType = 
  | 'place_added'
  | 'place_visited'
  | 'photo_added'
  | 'friend_added'
  | 'achievement_unlocked'
  | 'level_up'
  | 'trip_created'
  | 'trip_place_added';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new activity entry
   */
  async createActivity(
    userId: string,
    type: string,
    metadata: Record<string, unknown>,
    xpEarned: number = 0,
  ) {
    return this.prisma.userActivity.create({
      data: {
        userId,
        type,
        metadata: metadata as Prisma.InputJsonValue,
        xpEarned,
      },
    });
  }

  /**
   * Get user's own activity feed
   */
  async getUserActivities(userId: string, limit = 20, cursor?: string) {
    const activities = await this.prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            shareCode: true,
          },
        },
      },
    });

    const hasMore = activities.length > limit;
    const items = hasMore ? activities.slice(0, -1) : activities;
    const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Get friends' activity feed for social features
   */
  async getFriendsActivities(userId: string, limit = 20, cursor?: string) {
    // Get user's friend codes
    const friendships = await this.prisma.friendship.findMany({
      where: { userId },
      select: { friendCode: true },
    });

    if (friendships.length === 0) {
      return { items: [], nextCursor: undefined, hasMore: false };
    }

    // Get friend user IDs from their share codes
    const friendCodes = friendships.map(f => f.friendCode);
    const friends = await this.prisma.user.findMany({
      where: { shareCode: { in: friendCodes } },
      select: { id: true },
    });

    const friendIds = friends.map(f => f.id);

    // Get activities from friends
    const activities = await this.prisma.userActivity.findMany({
      where: {
        userId: { in: friendIds },
        type: {
          in: ['place_added', 'place_visited', 'photo_added', 'achievement_unlocked', 'level_up'],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            shareCode: true,
            level: true,
          },
        },
      },
    });

    const hasMore = activities.length > limit;
    const items = hasMore ? activities.slice(0, -1) : activities;
    const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

    return {
      items: items.map(activity => ({
        ...activity,
        userName: activity.user.name || activity.user.email.split('@')[0],
      })),
      nextCursor,
      hasMore,
    };
  }

  /**
   * Get XP history for charts (premium feature)
   */
  async getXpHistory(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await this.prisma.userActivity.findMany({
      where: {
        userId,
        xpEarned: { gt: 0 },
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        createdAt: true,
        xpEarned: true,
        type: true,
      },
    });

    // Group by day
    const dailyXp: Record<string, number> = {};
    for (const activity of activities) {
      const day = activity.createdAt.toISOString().split('T')[0];
      dailyXp[day] = (dailyXp[day] || 0) + activity.xpEarned;
    }

    // Fill in missing days with 0
    const result: Array<{ date: string; xp: number; cumulative: number }> = [];
    let cumulative = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const xp = dailyXp[dateStr] || 0;
      cumulative += xp;
      result.push({ date: dateStr, xp, cumulative });
    }

    return result;
  }
}
