import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    private readonly logger;
    constructor(gamificationService: GamificationService);
    getProfile(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
    getAchievements(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
    checkAchievements(req: {
        user: {
            id: string;
        };
    }): Promise<{
        unlocked: Array<{
            code: string;
            xpReward: number;
        }>;
    }>;
    updateLanguage(req: {
        user: {
            id: string;
        };
    }, body: {
        language: 'fr' | 'en';
    }): Promise<{
        language: string;
    }>;
    getXpProgress(req: {
        user: {
            id: string;
        };
    }): Promise<{
        xpNeeded: number;
        nextLevel: number;
        progress: number;
        xp: number;
        level: number;
    }>;
}
