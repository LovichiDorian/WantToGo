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
exports.TripsController = void 0;
const common_1 = require("@nestjs/common");
const trips_service_1 = require("./trips.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const trips_dto_1 = require("./trips.dto");
let TripsController = class TripsController {
    tripsService;
    constructor(tripsService) {
        this.tripsService = tripsService;
    }
    async createTrip(req, dto) {
        return this.tripsService.createTrip(req.user.id, dto);
    }
    async getUserTrips(req) {
        return this.tripsService.getUserTrips(req.user.id);
    }
    async getTripById(tripId, req) {
        return this.tripsService.getTripById(tripId, req.user.id);
    }
    async updateTrip(tripId, req, dto) {
        return this.tripsService.updateTrip(tripId, req.user.id, dto);
    }
    async deleteTrip(tripId, req) {
        return this.tripsService.deleteTrip(tripId, req.user.id);
    }
    async addPlaceToTrip(tripId, req, dto) {
        return this.tripsService.addPlaceToTrip(tripId, req.user.id, dto);
    }
    async removePlaceFromTrip(tripId, placeId, req) {
        return this.tripsService.removePlaceFromTrip(tripId, placeId, req.user.id);
    }
    async addMemberToTrip(tripId, req, dto) {
        return this.tripsService.addMemberToTrip(tripId, req.user.id, dto);
    }
    async removeMemberFromTrip(tripId, memberId, req) {
        return this.tripsService.removeMemberFromTrip(tripId, memberId, req.user.id);
    }
    async leaveTrip(tripId, req) {
        return this.tripsService.leaveTrip(tripId, req.user.id);
    }
};
exports.TripsController = TripsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trips_dto_1.CreateTripDto]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "createTrip", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "getUserTrips", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "getTripById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trips_dto_1.UpdateTripDto]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "updateTrip", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "deleteTrip", null);
__decorate([
    (0, common_1.Post)(':id/places'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trips_dto_1.AddTripPlaceDto]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "addPlaceToTrip", null);
__decorate([
    (0, common_1.Delete)(':id/places/:placeId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('placeId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "removePlaceFromTrip", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trips_dto_1.AddTripMemberDto]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "addMemberToTrip", null);
__decorate([
    (0, common_1.Delete)(':id/members/:memberId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "removeMemberFromTrip", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "leaveTrip", null);
exports.TripsController = TripsController = __decorate([
    (0, common_1.Controller)('trips'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [trips_service_1.TripsService])
], TripsController);
//# sourceMappingURL=trips.controller.js.map