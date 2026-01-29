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
exports.PhotosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const promises_1 = require("fs/promises");
const path_1 = require("path");
let PhotosService = class PhotosService {
    prisma;
    uploadsPath = (0, path_1.join)(process.cwd(), 'uploads', 'photos');
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, placeId, dto) {
        const place = await this.prisma.place.findFirst({
            where: {
                id: placeId,
                userId,
                deletedAt: null,
            },
        });
        if (!place) {
            throw new common_1.NotFoundException('Place not found');
        }
        return this.prisma.photo.create({
            data: {
                placeId,
                filename: `/uploads/photos/${dto.filename}`,
                mimeType: dto.mimeType,
                size: dto.size,
            },
        });
    }
    async findByPlace(placeId) {
        return this.prisma.photo.findMany({
            where: { placeId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(userId, placeId, photoId) {
        const place = await this.prisma.place.findFirst({
            where: {
                id: placeId,
                userId,
            },
        });
        if (!place) {
            throw new common_1.ForbiddenException('Not authorized to delete this photo');
        }
        const photo = await this.prisma.photo.findFirst({
            where: {
                id: photoId,
                placeId,
            },
        });
        if (!photo) {
            throw new common_1.NotFoundException('Photo not found');
        }
        await this.prisma.photo.delete({
            where: { id: photoId },
        });
        try {
            const filename = photo.filename.replace('/uploads/photos/', '');
            await (0, promises_1.unlink)((0, path_1.join)(this.uploadsPath, filename));
        }
        catch (error) {
            console.warn(`Failed to delete photo file: ${photo.filename}`, error);
        }
    }
};
exports.PhotosService = PhotosService;
exports.PhotosService = PhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PhotosService);
//# sourceMappingURL=photos.service.js.map