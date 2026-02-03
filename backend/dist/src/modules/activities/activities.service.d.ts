import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export type ActivityType = 'place_added' | 'place_visited' | 'photo_added' | 'friend_added' | 'achievement_unlocked' | 'level_up' | 'trip_created' | 'trip_place_added';
export declare class ActivitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    createActivity(userId: string, type: string, metadata: Record<string, unknown>, xpEarned?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: string;
        metadata: Prisma.JsonValue;
        xpEarned: number;
    }>;
    getUserActivities(userId: string, limit?: number, cursor?: string): Promise<{
        items: ({
            user: {
                shareCode: string;
                email: string;
                id: string;
                name: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            type: string;
            metadata: Prisma.JsonValue;
            xpEarned: number;
        })[];
        nextCursor: string | undefined;
        hasMore: boolean;
    }>;
    getFriendsActivities(userId: string, limit?: number, cursor?: string): Promise<{
        items: {
            userName: string;
            user: {
                shareCode: string;
                email: string;
                id: string;
                name: string | null;
                level: number;
            };
            id: string;
            createdAt: Date;
            userId: string;
            type: string;
            metadata: Prisma.JsonValue;
            xpEarned: number;
        }[];
        nextCursor: string | undefined;
        hasMore: boolean;
    }>;
    getXpHistory(userId: string, days?: number): Promise<{
        date: string;
        xp: number;
        cumulative: number;
    }[]>;
}
