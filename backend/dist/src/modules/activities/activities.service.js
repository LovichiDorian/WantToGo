"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ActivitiesService = class ActivitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createActivity(userId, type, metadata, xpEarned = 0) {
        return this.prisma.userActivity.create({
            data: {
                userId,
                type,
                metadata: metadata,
                xpEarned,
            },
        });
    }
    async getUserActivities(userId, limit = 20, cursor) {
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
    async getFriendsActivities(userId, limit = 20, cursor) {
        const friendships = await this.prisma.friendship.findMany({
            where: { userId },
            select: { friendCode: true },
        });
        if (friendships.length === 0) {
            return { items: [], nextCursor: undefined, hasMore: false };
        }
        const friendCodes = friendships.map(f => f.friendCode);
        const friends = await this.prisma.user.findMany({
            where: { shareCode: { in: friendCodes } },
            select: { id: true },
        });
        const friendIds = friends.map(f => f.id);
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
    async getXpHistory(userId, days = 30) {
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
        const dailyXp = {};
        for (const activity of activities) {
            const day = activity.createdAt.toISOString().split('T')[0];
            dailyXp[day] = (dailyXp[day] || 0) + activity.xpEarned;
        }
        const result = [];
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
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map