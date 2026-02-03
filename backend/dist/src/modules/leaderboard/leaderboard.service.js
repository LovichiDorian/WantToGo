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
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LeaderboardService = class LeaderboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFriendsLeaderboard(userId) {
        const friendships = await this.prisma.friendship.findMany({
            where: { userId },
            select: { friendCode: true },
        });
        const friendCodes = friendships.map(f => f.friendCode);
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { shareCode: true },
        });
        if (!currentUser) {
            throw new Error('User not found');
        }
        const allCodes = [...friendCodes, currentUser.shareCode];
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
        const entries = users.map((user, index) => ({
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
    async getMonthlyChallengeStats(userId) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        const daysLeft = Math.ceil((endOfMonth.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const leaderboard = await this.getFriendsLeaderboard(userId);
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
        entriesWithPlaces.forEach((entry, index) => {
            entry.rank = index + 1;
        });
        const currentUserEntry = entriesWithPlaces.find(e => e.isCurrentUser);
        return {
            daysLeft,
            leaderboard: entriesWithPlaces.slice(0, 10),
            userRank: currentUserEntry?.rank || 0,
            userPlacesThisMonth: currentUserEntry?.placesThisMonth || 0,
        };
    }
    async getUserRank(userId) {
        const leaderboard = await this.getFriendsLeaderboard(userId);
        const userEntry = leaderboard.find(e => e.isCurrentUser);
        return {
            rank: userEntry?.rank || 0,
            total: leaderboard.length,
        };
    }
    async getTopCities(userId, limit = 5) {
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
    async getCountryHeatmap(userId) {
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
    async getTotalDistance(userId) {
        const places = await this.prisma.place.findMany({
            where: { userId, deletedAt: null, isVisited: true },
            select: { latitude: true, longitude: true },
            orderBy: { visitedAt: 'asc' },
        });
        if (places.length < 2)
            return 0;
        let totalDistance = 0;
        for (let i = 1; i < places.length; i++) {
            const prev = places[i - 1];
            const curr = places[i];
            totalDistance += this.haversineDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
        }
        return Math.round(totalDistance);
    }
    haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.LeaderboardService = LeaderboardService;
exports.LeaderboardService = LeaderboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map