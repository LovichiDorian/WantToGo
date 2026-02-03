import { PrismaService } from '../../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
export declare const XP_REWARDS: {
    readonly PLACE_ADDED: 50;
    readonly PHOTO_ADDED: 100;
    readonly PLACE_VISITED: 200;
    readonly PLACE_VISITED_GEOLOC: 300;
    readonly FRIEND_INVITED: 500;
};
export type AchievementCriteria = {
    type: string;
    count: number;
};
export declare class GamificationService {
    private prisma;
    private activitiesService;
    constructor(prisma: PrismaService, activitiesService: ActivitiesService);
    calculateLevel(xp: number): number;
    xpForLevel(level: number): number;
    xpToNextLevel(currentXp: number): {
        xpNeeded: number;
        nextLevel: number;
        progress: number;
    };
    awardXp(userId: string, amount: number, source: string, metadata?: Record<string, unknown>): Promise<{
        newXp: number;
        newLevel: number;
        leveledUp: boolean;
        oldLevel: number;
    }>;
    getUserProfile(userId: string): Promise<{
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
        shareCode: string;
        email: string;
        id: string;
        name: string | null;
        xp: number;
        level: number;
        placesVisitedCount: number;
        language: string;
        createdAt: Date;
        achievements: ({
            achievement: {
                id: string;
                createdAt: Date;
                code: string;
                nameEn: string;
                nameFr: string;
                descriptionEn: string;
                descriptionFr: string;
                icon: string;
                xpReward: number;
                criteria: import("@prisma/client/runtime/client").JsonValue;
                isGlobal: boolean;
                sortOrder: number;
            };
        } & {
            id: string;
            userId: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            unlockedAt: Date;
            achievementId: string;
        })[];
        _count: {
            places: number;
            friendships: number;
        };
    }>;
    getAchievements(userId: string): Promise<{
        unlocked: boolean;
        unlockedAt: Date | undefined;
        metadata: import("@prisma/client/runtime/client").JsonValue | undefined;
        progress: {
            current: number;
            target: number;
            percent: number;
        };
        id: string;
        createdAt: Date;
        code: string;
        nameEn: string;
        nameFr: string;
        descriptionEn: string;
        descriptionFr: string;
        icon: string;
        xpReward: number;
        criteria: import("@prisma/client/runtime/client").JsonValue;
        isGlobal: boolean;
        sortOrder: number;
    }[]>;
    private getUserStats;
    private getAchievementProgress;
    checkAchievements(userId: string): Promise<{
        unlocked: Array<{
            code: string;
            xpReward: number;
        }>;
    }>;
    onPlaceAdded(userId: string, placeId: string, placeName: string): Promise<{
        unlocked: Array<{
            code: string;
            xpReward: number;
        }>;
    }>;
    onPhotoAdded(userId: string, placeId: string, placeName: string): Promise<{
        unlocked: Array<{
            code: string;
            xpReward: number;
        }>;
    }>;
    onPlaceVisited(userId: string, placeId: string, placeName: string, isNearby: boolean): Promise<{
        unlocked: Array<{
            code: string;
            xpReward: number;
        }>;
    }>;
    onFriendSignup(referrerId: string, friendName: string): Promise<{
        unlocked: Array<{
            code: string;
            xpReward: number;
        }>;
    }>;
    updateLanguage(userId: string, language: 'fr' | 'en'): Promise<{
        language: string;
    }>;
}
