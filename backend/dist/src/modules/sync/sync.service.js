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
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const places_service_1 = require("../places/places.service");
const sync_dto_1 = require("./sync.dto");
let SyncService = SyncService_1 = class SyncService {
    prisma;
    placesService;
    logger = new common_1.Logger(SyncService_1.name);
    constructor(prisma, placesService) {
        this.prisma = prisma;
        this.placesService = placesService;
    }
    async processBulkSync(userId, dto) {
        const idMappings = [];
        const conflicts = [];
        for (const action of dto.actions) {
            try {
                if (action.entityType === sync_dto_1.SyncEntityType.PLACE) {
                    const mapping = await this.processPlaceAction(userId, action, conflicts);
                    if (mapping) {
                        idMappings.push(mapping);
                    }
                }
            }
            catch (error) {
                this.logger.error(`Failed to process sync action: ${JSON.stringify(action)}`, error);
            }
        }
        const updatedPlaces = await this.placesService.findAll(userId);
        return {
            success: true,
            idMappings,
            updatedPlaces: updatedPlaces,
            conflicts,
            syncedAt: new Date().toISOString(),
        };
    }
    async processPlaceAction(userId, action, conflicts) {
        const payload = action.payload;
        const actionTimestamp = new Date(action.timestamp);
        switch (action.actionType) {
            case sync_dto_1.SyncActionType.CREATE: {
                const existing = await this.placesService.findByClientId(action.clientId, userId);
                if (existing) {
                    return { clientId: action.clientId, serverId: existing.id };
                }
                const createDto = {
                    name: payload?.name,
                    notes: payload?.notes,
                    latitude: payload?.latitude,
                    longitude: payload?.longitude,
                    address: payload?.address,
                    tripDate: payload?.tripDate,
                    clientId: action.clientId,
                };
                const newPlace = await this.placesService.create(userId, createDto);
                return { clientId: action.clientId, serverId: newPlace.id };
            }
            case sync_dto_1.SyncActionType.UPDATE: {
                if (!action.serverId) {
                    const existing = await this.placesService.findByClientId(action.clientId, userId);
                    if (!existing) {
                        this.logger.warn(`Cannot update - place not found for clientId: ${action.clientId}`);
                        return null;
                    }
                    action.serverId = existing.id;
                }
                try {
                    const serverPlace = await this.placesService.findOne(action.serverId, userId);
                    if (serverPlace.updatedAt > actionTimestamp) {
                        conflicts.push({
                            clientId: action.clientId,
                            serverVersion: serverPlace,
                            resolution: 'server_wins',
                        });
                        return null;
                    }
                    const updateDto = {
                        name: payload?.name,
                        notes: payload?.notes,
                        latitude: payload?.latitude,
                        longitude: payload?.longitude,
                        address: payload?.address,
                        tripDate: payload?.tripDate,
                    };
                    await this.placesService.update(action.serverId, userId, updateDto);
                }
                catch {
                    this.logger.warn(`Place not found for update: ${action.serverId}`);
                }
                return null;
            }
            case sync_dto_1.SyncActionType.DELETE: {
                if (!action.serverId) {
                    const existing = await this.placesService.findByClientId(action.clientId, userId);
                    if (!existing) {
                        return null;
                    }
                    action.serverId = existing.id;
                }
                try {
                    await this.placesService.remove(action.serverId, userId);
                }
                catch {
                }
                return null;
            }
            default:
                return null;
        }
    }
    async getChangesSince(userId, since) {
        return this.prisma.place.findMany({
            where: {
                userId,
                updatedAt: {
                    gt: since,
                },
            },
            include: {
                photos: true,
            },
            orderBy: {
                updatedAt: 'asc',
            },
        });
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        places_service_1.PlacesService])
], SyncService);
//# sourceMappingURL=sync.service.js.map