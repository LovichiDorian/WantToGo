import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    getMyActivities(req: {
        user: {
            id: string;
        };
    }, limit?: string, cursor?: string): Promise<{
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
            metadata: import("@prisma/client/runtime/client").JsonValue;
            xpEarned: number;
        })[];
        nextCursor: string | undefined;
        hasMore: boolean;
    }>;
    getFriendsActivities(req: {
        user: {
            id: string;
        };
    }, limit?: string, cursor?: string): Promise<{
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
            metadata: import("@prisma/client/runtime/client").JsonValue;
            xpEarned: number;
        }[];
        nextCursor: string | undefined;
        hasMore: boolean;
    }>;
    getXpHistory(req: {
        user: {
            id: string;
        };
    }, days?: string): Promise<{
        date: string;
        xp: number;
        cumulative: number;
    }[]>;
}
