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
var GamificationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationController = void 0;
const common_1 = require("@nestjs/common");
const gamification_service_1 = require("./gamification.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let GamificationController = GamificationController_1 = class GamificationController {
    gamificationService;
    logger = new common_1.Logger(GamificationController_1.name);
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    async getProfile(req) {
        this.logger.log(`Getting profile for user: ${req.user?.id}`);
        try {
            const profile = await this.gamificationService.getUserProfile(req.user.id);
            return profile;
        }
        catch (error) {
            this.logger.error(`Error getting profile: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getAchievements(req) {
        return this.gamificationService.getAchievements(req.user.id);
    }
    async checkAchievements(req) {
        return this.gamificationService.checkAchievements(req.user.id);
    }
    async updateLanguage(req, body) {
        return this.gamificationService.updateLanguage(req.user.id, body.language);
    }
    async getXpProgress(req) {
        const profile = await this.gamificationService.getUserProfile(req.user.id);
        return {
            xp: profile.xp,
            level: profile.level,
            ...profile.xpProgress,
        };
    }
};
exports.GamificationController = GamificationController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('achievements'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getAchievements", null);
__decorate([
    (0, common_1.Post)('check-achievements'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "checkAchievements", null);
__decorate([
    (0, common_1.Patch)('language'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateLanguage", null);
__decorate([
    (0, common_1.Get)('xp-progress'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getXpProgress", null);
exports.GamificationController = GamificationController = GamificationController_1 = __decorate([
    (0, common_1.Controller)('gamification'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [gamification_service_1.GamificationService])
], GamificationController);
//# sourceMappingURL=gamification.controller.js.map