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
exports.LeaderboardController = void 0;
const common_1 = require("@nestjs/common");
const leaderboard_service_1 = require("./leaderboard.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LeaderboardController = class LeaderboardController {
    leaderboardService;
    constructor(leaderboardService) {
        this.leaderboardService = leaderboardService;
    }
    async getFriendsLeaderboard(req) {
        return this.leaderboardService.getFriendsLeaderboard(req.user.id);
    }
    async getMonthlyChallengeStats(req) {
        return this.leaderboardService.getMonthlyChallengeStats(req.user.id);
    }
    async getUserRank(req) {
        return this.leaderboardService.getUserRank(req.user.id);
    }
    async getTopCities(req) {
        return this.leaderboardService.getTopCities(req.user.id);
    }
    async getCountryHeatmap(req) {
        return this.leaderboardService.getCountryHeatmap(req.user.id);
    }
    async getTotalDistance(req) {
        const distance = await this.leaderboardService.getTotalDistance(req.user.id);
        return { totalDistanceKm: distance };
    }
};
exports.LeaderboardController = LeaderboardController;
__decorate([
    (0, common_1.Get)('friends'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getFriendsLeaderboard", null);
__decorate([
    (0, common_1.Get)('monthly-challenge'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getMonthlyChallengeStats", null);
__decorate([
    (0, common_1.Get)('rank'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getUserRank", null);
__decorate([
    (0, common_1.Get)('top-cities'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getTopCities", null);
__decorate([
    (0, common_1.Get)('country-heatmap'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getCountryHeatmap", null);
__decorate([
    (0, common_1.Get)('total-distance'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getTotalDistance", null);
exports.LeaderboardController = LeaderboardController = __decorate([
    (0, common_1.Controller)('leaderboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [leaderboard_service_1.LeaderboardService])
], LeaderboardController);
//# sourceMappingURL=leaderboard.controller.js.map