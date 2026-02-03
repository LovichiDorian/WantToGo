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
exports.PlacesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const gamification_service_1 = require("../gamification/gamification.service");
let PlacesService = class PlacesService {
    prisma;
    gamificationService;
    constructor(prisma, gamificationService) {
        this.prisma = prisma;
        this.gamificationService = gamificationService;
    }
    async findAll(userId) {
        return this.prisma.place.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            include: {
                photos: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id, userId) {
        const place = await this.prisma.place.findFirst({
            where: {
                id,
                userId,
                deletedAt: null,
            },
            include: {
                photos: true,
            },
        });
        if (!place) {
            throw new common_1.NotFoundException(`Place with ID ${id} not found`);
        }
        return place;
    }
    async create(userId, dto) {
        const place = await this.prisma.place.create({
            data: {
                userId,
                name: dto.name,
                notes: dto.notes,
                latitude: dto.latitude,
                longitude: dto.longitude,
                address: dto.address,
                city: dto.city,
                country: dto.country,
                tripDate: dto.tripDate ? new Date(dto.tripDate) : null,
                clientId: dto.clientId,
            },
            include: {
                photos: true,
            },
        });
        const achievements = await this.gamificationService.onPlaceAdded(userId, place.id, place.name);
        return {
            ...place,
            xpEarned: 50,
            achievements: achievements.unlocked,
        };
    }
    async update(id, userId, dto) {
        await this.findOne(id, userId);
        return this.prisma.place.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.notes !== undefined && { notes: dto.notes }),
                ...(dto.latitude !== undefined && { latitude: dto.latitude }),
                ...(dto.longitude !== undefined && { longitude: dto.longitude }),
                ...(dto.address !== undefined && { address: dto.address }),
                ...(dto.city !== undefined && { city: dto.city }),
                ...(dto.country !== undefined && { country: dto.country }),
                ...(dto.tripDate !== undefined && { tripDate: dto.tripDate ? new Date(dto.tripDate) : null }),
            },
            include: {
                photos: true,
            },
        });
    }
    async markVisited(id, userId, dto) {
        const place = await this.findOne(id, userId);
        if (place.isVisited) {
            throw new Error('Place is already marked as visited');
        }
        const updatedPlace = await this.prisma.place.update({
            where: { id },
            data: {
                isVisited: true,
                visitedAt: new Date(),
                visitedWithGeoloc: dto.isNearby || false,
            },
            include: {
                photos: true,
            },
        });
        const achievements = await this.gamificationService.onPlaceVisited(userId, place.id, place.name, dto.isNearby || false);
        const baseXp = 200;
        const bonusXp = dto.isNearby ? 300 : 0;
        return {
            ...updatedPlace,
            xpEarned: baseXp + bonusXp,
            bonusXp,
            achievements: achievements.unlocked,
        };
    }
    async undoVisited(id, userId) {
        const place = await this.findOne(id, userId);
        if (!place.isVisited || !place.visitedAt) {
            throw new Error('Place is not marked as visited');
        }
        const hoursSinceVisit = (Date.now() - new Date(place.visitedAt).getTime()) / (1000 * 60 * 60);
        if (hoursSinceVisit > 24) {
            throw new Error('Cannot undo visit after 24 hours');
        }
        return this.prisma.place.update({
            where: { id },
            data: {
                isVisited: false,
                visitedAt: null,
                visitedWithGeoloc: false,
            },
            include: {
                photos: true,
            },
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.place.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    async findByClientId(clientId, userId) {
        return this.prisma.place.findFirst({
            where: {
                clientId,
                userId,
            },
            include: {
                photos: true,
            },
        });
    }
    async getStats(userId) {
        const [totalPlaces, visitedPlaces, placesWithPhotos] = await Promise.all([
            this.prisma.place.count({
                where: { userId, deletedAt: null },
            }),
            this.prisma.place.count({
                where: { userId, deletedAt: null, isVisited: true },
            }),
            this.prisma.place.count({
                where: {
                    userId,
                    deletedAt: null,
                    photos: { some: {} },
                },
            }),
        ]);
        return {
            totalPlaces,
            visitedPlaces,
            placesWithPhotos,
            visitRate: totalPlaces > 0 ? Math.round((visitedPlaces / totalPlaces) * 100) : 0,
        };
    }
};
exports.PlacesService = PlacesService;
exports.PlacesService = PlacesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => gamification_service_1.GamificationService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gamification_service_1.GamificationService])
], PlacesService);
//# sourceMappingURL=places.service.js.map