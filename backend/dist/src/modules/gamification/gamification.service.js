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
exports.GamificationService = exports.XP_REWARDS = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const activities_service_1 = require("../activities/activities.service");
exports.XP_REWARDS = {
    PLACE_ADDED: 50,
    PHOTO_ADDED: 100,
    PLACE_VISITED: 200,
    PLACE_VISITED_GEOLOC: 300,
    FRIEND_INVITED: 500,
};
let GamificationService = class GamificationService {
    prisma;
    activitiesService;
    constructor(prisma, activitiesService) {
        this.prisma = prisma;
        this.activitiesService = activitiesService;
    }
    calculateLevel(xp) {
        return Math.floor(Math.sqrt(xp / 1000)) + 1;
    }
    xpForLevel(level) {
        return (level - 1) * (level - 1) * 1000;
    }
    xpToNextLevel(currentXp) {
        const currentLevel = this.calculateLevel(currentXp);
        const nextLevel = currentLevel + 1;
        const xpForCurrent = this.xpForLevel(currentLevel);
        const xpForNext = this.xpForLevel(nextLevel);
        const xpNeeded = xpForNext - currentXp;
        const progress = ((currentXp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100;
        return { xpNeeded, nextLevel, progress: Math.min(100, Math.max(0, progress)) };
    }
    async awardXp(userId, amount, source, metadata) {
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
        await this.prisma.user.update({
            where: { id: userId },
            data: { xp: newXp, level: newLevel },
        });
        await this.activitiesService.createActivity(userId, source, {
            ...metadata,
            xpEarned: amount,
        }, amount);
        if (leveledUp) {
            await this.activitiesService.createActivity(userId, 'level_up', {
                oldLevel,
                newLevel,
            }, 0);
        }
        return { newXp, newLevel, leveledUp, oldLevel };
    }
    async getUserProfile(userId) {
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
        const photoCount = await this.prisma.photo.count({
            where: {
                place: {
                    userId,
                    deletedAt: null,
                },
            },
        });
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
    async getAchievements(userId) {
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
        const unlockedMap = new Map(userAchievements.map(ua => [ua.achievementId, ua]));
        return achievements.map(achievement => {
            const unlocked = unlockedMap.get(achievement.id);
            const criteria = achievement.criteria;
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
    async getUserStats(userId) {
        const [placesCount, visitedCount, visitedWithGeolocCount, photosCount, friendsCount, tripsCount, placesWithDates, cityGroups, countryGroups] = await Promise.all([
            this.prisma.place.count({
                where: { userId, deletedAt: null },
            }),
            this.prisma.place.count({
                where: { userId, deletedAt: null, isVisited: true },
            }),
            this.prisma.place.count({
                where: { userId, deletedAt: null, isVisited: true, visitedWithGeoloc: true },
            }),
            this.prisma.photo.count({
                where: { place: { userId, deletedAt: null } },
            }),
            this.prisma.friendship.count({
                where: { userId },
            }),
            this.prisma.trip.count({
                where: { creatorId: userId },
            }),
            this.prisma.place.count({
                where: { userId, deletedAt: null, tripDate: { not: null } },
            }),
            this.prisma.place.groupBy({
                by: ['city'],
                where: { userId, deletedAt: null, city: { not: null } },
                _count: true,
            }),
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
    getAchievementProgress(criteria, stats) {
        return stats[criteria.type] || 0;
    }
    async checkAchievements(userId) {
        const [achievements, userAchievements, userStats] = await Promise.all([
            this.prisma.achievement.findMany(),
            this.prisma.userAchievement.findMany({
                where: { userId },
                select: { achievementId: true },
            }),
            this.getUserStats(userId),
        ]);
        const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
        const newlyUnlocked = [];
        for (const achievement of achievements) {
            if (unlockedIds.has(achievement.id))
                continue;
            const criteria = achievement.criteria;
            const progress = this.getAchievementProgress(criteria, userStats);
            if (progress >= criteria.count) {
                await this.prisma.userAchievement.create({
                    data: {
                        userId,
                        achievementId: achievement.id,
                        metadata: { progress },
                    },
                });
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
    async onPlaceAdded(userId, placeId, placeName) {
        await this.awardXp(userId, exports.XP_REWARDS.PLACE_ADDED, 'place_added', {
            placeId,
            placeName,
        });
        return this.checkAchievements(userId);
    }
    async onPhotoAdded(userId, placeId, placeName) {
        await this.awardXp(userId, exports.XP_REWARDS.PHOTO_ADDED, 'photo_added', {
            placeId,
            placeName,
        });
        return this.checkAchievements(userId);
    }
    async onPlaceVisited(userId, placeId, placeName, isNearby) {
        const xpAmount = exports.XP_REWARDS.PLACE_VISITED + (isNearby ? exports.XP_REWARDS.PLACE_VISITED_GEOLOC : 0);
        await this.prisma.user.update({
            where: { id: userId },
            data: { placesVisitedCount: { increment: 1 } },
        });
        await this.awardXp(userId, xpAmount, 'place_visited', {
            placeId,
            placeName,
            isNearby,
            bonusXp: isNearby ? exports.XP_REWARDS.PLACE_VISITED_GEOLOC : 0,
        });
        return this.checkAchievements(userId);
    }
    async onFriendSignup(referrerId, friendName) {
        await this.awardXp(referrerId, exports.XP_REWARDS.FRIEND_INVITED, 'friend_invited', {
            friendName,
        });
        return this.checkAchievements(referrerId);
    }
    async updateLanguage(userId, language) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { language },
            select: { language: true },
        });
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activities_service_1.ActivitiesService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map