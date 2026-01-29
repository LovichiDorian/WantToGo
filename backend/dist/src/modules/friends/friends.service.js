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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const FRIEND_COLORS = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#14b8a6',
    '#06b6d4',
    '#8b5cf6',
    '#ec4899',
    '#f43f5e',
    '#6366f1',
];
let FriendsService = class FriendsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyCode(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { places: { where: { deletedAt: null } } },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            shareCode: user.shareCode,
            placesCount: user.places.length,
        };
    }
    async getFriendPlaces(shareCode) {
        const user = await this.prisma.user.findUnique({
            where: { shareCode },
            include: {
                places: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Friend not found with this code');
        }
        const places = user.places.map((place) => ({
            id: place.id,
            name: place.name,
            notes: place.notes || undefined,
            latitude: place.latitude,
            longitude: place.longitude,
            address: place.address || undefined,
            tripDate: place.tripDate?.toISOString(),
        }));
        return {
            shareCode: user.shareCode,
            name: user.name || 'Anonymous',
            places,
        };
    }
    async addFriend(userId, friendCode) {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!currentUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (currentUser.shareCode === friendCode) {
            throw new common_1.BadRequestException('You cannot add yourself as a friend');
        }
        const friendUser = await this.prisma.user.findUnique({
            where: { shareCode: friendCode },
            include: {
                places: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!friendUser) {
            throw new common_1.NotFoundException('Friend not found with this code');
        }
        const existingFriendship = await this.prisma.friendship.findUnique({
            where: {
                userId_friendCode: {
                    userId,
                    friendCode,
                },
            },
        });
        if (existingFriendship) {
            throw new common_1.ConflictException('You have already added this friend');
        }
        const friendCount = await this.prisma.friendship.count({
            where: { userId },
        });
        const color = FRIEND_COLORS[friendCount % FRIEND_COLORS.length];
        const friendship = await this.prisma.friendship.create({
            data: {
                userId,
                friendCode,
                friendName: friendUser.name || 'Anonymous',
                color,
            },
        });
        const places = friendUser.places.map((place) => ({
            id: place.id,
            name: place.name,
            notes: place.notes || undefined,
            latitude: place.latitude,
            longitude: place.longitude,
            address: place.address || undefined,
            tripDate: place.tripDate?.toISOString(),
        }));
        return {
            id: friendship.id,
            friendCode: friendship.friendCode,
            friendName: friendship.friendName,
            color: friendship.color,
            places,
            createdAt: friendship.createdAt.toISOString(),
        };
    }
    async getFriends(userId) {
        const friendships = await this.prisma.friendship.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        const friendsWithPlaces = await Promise.all(friendships.map(async (friendship) => {
            const friendUser = await this.prisma.user.findUnique({
                where: { shareCode: friendship.friendCode },
                include: {
                    places: {
                        where: { deletedAt: null },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
            const places = friendUser
                ? friendUser.places.map((place) => ({
                    id: place.id,
                    name: place.name,
                    notes: place.notes || undefined,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    address: place.address || undefined,
                    tripDate: place.tripDate?.toISOString(),
                }))
                : [];
            if (friendUser && friendUser.name && friendUser.name !== friendship.friendName) {
                await this.prisma.friendship.update({
                    where: { id: friendship.id },
                    data: { friendName: friendUser.name },
                });
            }
            return {
                id: friendship.id,
                friendCode: friendship.friendCode,
                friendName: friendUser?.name || friendship.friendName,
                color: friendship.color,
                places,
                createdAt: friendship.createdAt.toISOString(),
            };
        }));
        return friendsWithPlaces;
    }
    async deleteFriend(userId, friendshipId) {
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                id: friendshipId,
                userId,
            },
        });
        if (!friendship) {
            throw new common_1.NotFoundException('Friendship not found');
        }
        await this.prisma.friendship.delete({
            where: { id: friendshipId },
        });
    }
    async updateMyName(userId, name) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { name },
        });
    }
};
exports.FriendsService = FriendsService;
exports.FriendsService = FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FriendsService);
//# sourceMappingURL=friends.service.js.map