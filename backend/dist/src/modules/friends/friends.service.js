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
let FriendsService = class FriendsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyCode(deviceId) {
        let user = await this.prisma.user.findUnique({
            where: { email: deviceId },
            include: { places: { where: { deletedAt: null } } },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: deviceId,
                    name: 'User',
                },
                include: { places: { where: { deletedAt: null } } },
            });
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
    async updateMyName(deviceId, name) {
        await this.prisma.user.update({
            where: { email: deviceId },
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