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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const gamification_service_1 = require("../gamification/gamification.service");
const FREE_TRIP_LIMIT = 3;
let TripsService = class TripsService {
    prisma;
    gamificationService;
    constructor(prisma, gamificationService) {
        this.prisma = prisma;
        this.gamificationService = gamificationService;
    }
    async createTrip(userId, dto) {
        const subscription = await this.prisma.userSubscription.findUnique({
            where: { userId },
        });
        const isPremium = subscription?.status === 'premium' || subscription?.status === 'lifetime';
        if (!isPremium) {
            const tripCount = await this.prisma.trip.count({
                where: { creatorId: userId },
            });
            if (tripCount >= FREE_TRIP_LIMIT) {
                throw new common_1.ForbiddenException('Free users can only create up to 3 trips. Upgrade to Premium for unlimited trips.');
            }
        }
        const trip = await this.prisma.trip.create({
            data: {
                nameEn: dto.nameEn,
                nameFr: dto.nameFr,
                description: dto.description,
                creatorId: userId,
                isPublic: dto.isPublic ?? false,
                members: {
                    create: {
                        userId,
                        role: 'owner',
                    },
                },
            },
            include: {
                members: {
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
                },
                places: {
                    include: {
                        place: true,
                    },
                },
            },
        });
        await this.gamificationService.checkAchievements(userId);
        return trip;
    }
    async getUserTrips(userId) {
        const trips = await this.prisma.trip.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    { members: { some: { userId } } },
                ],
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                members: {
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
                },
                _count: {
                    select: {
                        places: true,
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        const subscription = await this.prisma.userSubscription.findUnique({
            where: { userId },
        });
        const isPremium = subscription?.status === 'premium' || subscription?.status === 'lifetime';
        const ownedTrips = trips.filter(t => t.creatorId === userId).length;
        return {
            trips,
            limits: {
                current: ownedTrips,
                max: isPremium ? null : FREE_TRIP_LIMIT,
                isPremium,
            },
        };
    }
    async getTripById(tripId, userId) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                members: {
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
                },
                places: {
                    include: {
                        place: {
                            include: {
                                photos: true,
                            },
                        },
                    },
                    orderBy: { addedAt: 'desc' },
                },
            },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        const isMember = trip.members.some(m => m.userId === userId);
        if (!trip.isPublic && !isMember) {
            throw new common_1.ForbiddenException('You do not have access to this trip');
        }
        return {
            ...trip,
            userRole: trip.members.find(m => m.userId === userId)?.role || null,
        };
    }
    async updateTrip(tripId, userId, dto) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
            include: { members: true },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        const userMember = trip.members.find(m => m.userId === userId);
        if (!userMember || (userMember.role !== 'owner' && userMember.role !== 'editor')) {
            throw new common_1.ForbiddenException('You do not have permission to edit this trip');
        }
        return this.prisma.trip.update({
            where: { id: tripId },
            data: {
                ...(dto.nameEn && { nameEn: dto.nameEn }),
                ...(dto.nameFr && { nameFr: dto.nameFr }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
            },
            include: {
                members: {
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
                },
                places: {
                    include: {
                        place: true,
                    },
                },
            },
        });
    }
    async deleteTrip(tripId, userId) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        if (trip.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the trip creator can delete it');
        }
        await this.prisma.trip.delete({
            where: { id: tripId },
        });
        return { success: true };
    }
    async addPlaceToTrip(tripId, userId, dto) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
            include: { members: true },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        const userMember = trip.members.find(m => m.userId === userId);
        if (!userMember) {
            throw new common_1.ForbiddenException('You are not a member of this trip');
        }
        const place = await this.prisma.place.findUnique({
            where: { id: dto.placeId },
        });
        if (!place) {
            throw new common_1.NotFoundException('Place not found');
        }
        const existing = await this.prisma.tripPlace.findUnique({
            where: {
                tripId_placeId: {
                    tripId,
                    placeId: dto.placeId,
                },
            },
        });
        if (existing) {
            throw new common_1.ForbiddenException('This place is already in the trip');
        }
        return this.prisma.tripPlace.create({
            data: {
                tripId,
                placeId: dto.placeId,
                addedBy: userId,
            },
            include: {
                place: true,
            },
        });
    }
    async removePlaceFromTrip(tripId, placeId, userId) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
            include: { members: true },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        const userMember = trip.members.find(m => m.userId === userId);
        if (!userMember || userMember.role === 'member') {
            throw new common_1.ForbiddenException('You do not have permission to remove places from this trip');
        }
        await this.prisma.tripPlace.delete({
            where: {
                tripId_placeId: {
                    tripId,
                    placeId,
                },
            },
        });
        return { success: true };
    }
    async addMemberToTrip(tripId, userId, dto) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
            include: { members: true },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        const userMember = trip.members.find(m => m.userId === userId);
        if (!userMember || (userMember.role !== 'owner' && userMember.role !== 'editor')) {
            throw new common_1.ForbiddenException('You do not have permission to add members');
        }
        const newMember = await this.prisma.user.findUnique({
            where: { shareCode: dto.shareCode },
        });
        if (!newMember) {
            throw new common_1.NotFoundException('User not found with this share code');
        }
        const existing = trip.members.find(m => m.userId === newMember.id);
        if (existing) {
            throw new common_1.ForbiddenException('This user is already a member of the trip');
        }
        return this.prisma.tripMember.create({
            data: {
                tripId,
                userId: newMember.id,
                role: dto.role || 'member',
            },
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
    }
    async removeMemberFromTrip(tripId, memberId, userId) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
            include: { members: true },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        const userMember = trip.members.find(m => m.userId === userId);
        if (!userMember || userMember.role !== 'owner') {
            throw new common_1.ForbiddenException('Only the trip owner can remove members');
        }
        if (memberId === userId) {
            throw new common_1.ForbiddenException('You cannot remove yourself. Delete the trip instead.');
        }
        await this.prisma.tripMember.delete({
            where: {
                tripId_userId: {
                    tripId,
                    userId: memberId,
                },
            },
        });
        return { success: true };
    }
    async leaveTrip(tripId, userId) {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
            include: { members: true },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        if (trip.creatorId === userId) {
            throw new common_1.ForbiddenException('Trip owner cannot leave. Delete the trip instead.');
        }
        const membership = trip.members.find(m => m.userId === userId);
        if (!membership) {
            throw new common_1.NotFoundException('You are not a member of this trip');
        }
        await this.prisma.tripMember.delete({
            where: { id: membership.id },
        });
        return { success: true };
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => gamification_service_1.GamificationService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gamification_service_1.GamificationService])
], TripsService);
//# sourceMappingURL=trips.service.js.map