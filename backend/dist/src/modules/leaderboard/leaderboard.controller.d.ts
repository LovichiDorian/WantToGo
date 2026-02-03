import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getFriendsLeaderboard(req: {
        user: {
            id: string;
        };
    }): Promise<import("./leaderboard.service").LeaderboardEntry[]>;
    getMonthlyChallengeStats(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
    getUserRank(req: {
        user: {
            id: string;
        };
    }): Promise<{
        rank: number;
        total: number;
    }>;
    getTopCities(req: {
        user: {
            id: string;
        };
    }): Promise<{
        city: string | null;
        count: number;
    }[]>;
    getCountryHeatmap(req: {
        user: {
            id: string;
        };
    }): Promise<{
        country: string | null;
        count: number;
    }[]>;
    getTotalDistance(req: {
        user: {
            id: string;
        };
    }): Promise<{
        totalDistanceKm: number;
    }>;
}
