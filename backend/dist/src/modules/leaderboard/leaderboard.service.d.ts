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
export declare class LeaderboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getFriendsLeaderboard(userId: string): Promise<LeaderboardEntry[]>;
    getMonthlyChallengeStats(userId: string): Promise<{
        daysLeft: number;
        leaderboard: {
            placesThisMonth: number;
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
        }[];
        userRank: number;
        userPlacesThisMonth: number;
    }>;
    getUserRank(userId: string): Promise<{
        rank: number;
        total: number;
    }>;
    getTopCities(userId: string, limit?: number): Promise<{
        city: string | null;
        count: number;
    }[]>;
    getCountryHeatmap(userId: string): Promise<{
        country: string | null;
        count: number;
    }[]>;
    getTotalDistance(userId: string): Promise<number>;
    private haversineDistance;
    private toRad;
}
