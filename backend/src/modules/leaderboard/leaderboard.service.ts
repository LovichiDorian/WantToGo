import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get friends leaderboard for a user
   */
  async getFriendsLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
    // Get user's friends
    const friendships = await this.prisma.friendship.findMany({
      where: { userId },
      select: { friendCode: true },
    });

    const friendCodes = friendships.map(f => f.friendCode);

    // Get current user's shareCode
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { shareCode: true },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Include current user in leaderboard
    const allCodes = [...friendCodes, currentUser.shareCode];

    // Get all users (friends + current user)
    const users = await this.prisma.user.findMany({
      where: { shareCode: { in: allCodes } },
      select: {
        id: true,
        name: true,
        email: true,
        shareCode: true,
        xp: true,
        level: true,
        placesVisitedCount: true,
        _count: {
          select: {
            places: {
              where: { deletedAt: null },
            },
          },
        },
      },
      orderBy: { xp: 'desc' },
    });

    // Calculate monthly XP for each user
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyXpPromises = users.map(async (user) => {
      const activities = await this.prisma.userActivity.aggregate({
        where: {
          userId: user.id,
          createdAt: { gte: startOfMonth },
        },
        _sum: { xpEarned: true },
      });
      return { userId: user.id, xpThisMonth: activities._sum.xpEarned || 0 };
    });

    const monthlyXpResults = await Promise.all(monthlyXpPromises);
    const monthlyXpMap = new Map(monthlyXpResults.map(r => [r.userId, r.xpThisMonth]));

    // Build leaderboard entries
    const entries: LeaderboardEntry[] = users.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      name: user.name || user.email.split('@')[0],
      shareCode: user.shareCode,
      xp: user.xp,
      level: user.level,
      placesAdded: user._count.places,
      placesVisited: user.placesVisitedCount,
      xpThisMonth: monthlyXpMap.get(user.id) || 0,
      isCurrentUser: user.id === userId,
    }));

    return entries;
  }

  /**
   * Get monthly challenge stats
   */
  async getMonthlyChallengeStats(userId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const daysLeft = Math.ceil((endOfMonth.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    // Get friends for the leaderboard
    const leaderboard = await this.getFriendsLeaderboard(userId);

    // Sort by places added this month (we need to calculate this)
    const placesThisMonthPromises = leaderboard.map(async (entry) => {
      const count = await this.prisma.place.count({
        where: {
          userId: entry.userId,
          createdAt: { gte: startOfMonth },
          deletedAt: null,
        },
      });
      return { ...entry, placesThisMonth: count };
    });

    const entriesWithPlaces = await Promise.all(placesThisMonthPromises);
    entriesWithPlaces.sort((a, b) => b.placesThisMonth - a.placesThisMonth);

    // Reassign ranks
    entriesWithPlaces.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    const currentUserEntry = entriesWithPlaces.find(e => e.isCurrentUser);

    return {
      daysLeft,
      leaderboard: entriesWithPlaces.slice(0, 10),
      userRank: currentUserEntry?.rank || 0,
      userPlacesThisMonth: (currentUserEntry as { placesThisMonth?: number })?.placesThisMonth || 0,
    };
  }

  /**
   * Get user's rank among friends
   */
  async getUserRank(userId: string): Promise<{ rank: number; total: number }> {
    const leaderboard = await this.getFriendsLeaderboard(userId);
    const userEntry = leaderboard.find(e => e.isCurrentUser);
    
    return {
      rank: userEntry?.rank || 0,
      total: leaderboard.length,
    };
  }

  /**
   * Get top cities for a user (premium feature)
   */
  async getTopCities(userId: string, limit = 5) {
    const cityGroups = await this.prisma.place.groupBy({
      by: ['city'],
      where: { userId, deletedAt: null, city: { not: null } },
      _count: true,
      orderBy: { _count: { city: 'desc' } },
      take: limit,
    });

    return cityGroups.map(group => ({
      city: group.city,
      count: group._count,
    }));
  }

  /**
   * Get country heatmap data (premium feature)
   */
  async getCountryHeatmap(userId: string) {
    const countryGroups = await this.prisma.place.groupBy({
      by: ['country'],
      where: { userId, deletedAt: null, country: { not: null } },
      _count: true,
    });

    return countryGroups.map(group => ({
      country: group.country,
      count: group._count,
    }));
  }

  /**
   * Calculate total distance traveled using Haversine formula
   */
  async getTotalDistance(userId: string): Promise<number> {
    const places = await this.prisma.place.findMany({
      where: { userId, deletedAt: null, isVisited: true },
      select: { latitude: true, longitude: true },
      orderBy: { visitedAt: 'asc' },
    });

    if (places.length < 2) return 0;

    let totalDistance = 0;

    for (let i = 1; i < places.length; i++) {
      const prev = places[i - 1];
      const curr = places[i];
      totalDistance += this.haversineDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude,
      );
    }

    return Math.round(totalDistance);
  }

  /**
   * Haversine formula to calculate distance between two coordinates
   */
  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
