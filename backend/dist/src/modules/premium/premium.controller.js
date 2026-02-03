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
exports.PremiumController = void 0;
const common_1 = require("@nestjs/common");
const premium_service_1 = require("./premium.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PremiumController = class PremiumController {
    premiumService;
    constructor(premiumService) {
        this.premiumService = premiumService;
    }
    getPricing() {
        return this.premiumService.getPricing();
    }
    async getSubscriptionStatus(req) {
        return this.premiumService.getSubscriptionStatus(req.user.id);
    }
    async checkFeature(req, body) {
        const hasAccess = await this.premiumService.hasFeature(req.user.id, body.feature);
        return { hasAccess };
    }
    async registerInterest(req, body) {
        return this.premiumService.registerInterest(req.user.id, body.email);
    }
    async createCheckout(req, body) {
        return this.premiumService.createCheckoutSession(req.user.id, body.priceId);
    }
    async cancelSubscription(req) {
        return this.premiumService.cancelSubscription(req.user.id);
    }
    async handleWebhook(event) {
        return this.premiumService.handleStripeWebhook(event);
    }
};
exports.PremiumController = PremiumController;
__decorate([
    (0, common_1.Get)('pricing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PremiumController.prototype, "getPricing", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PremiumController.prototype, "getSubscriptionStatus", null);
__decorate([
    (0, common_1.Get)('check/:feature'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PremiumController.prototype, "checkFeature", null);
__decorate([
    (0, common_1.Post)('notify-me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PremiumController.prototype, "registerInterest", null);
__decorate([
    (0, common_1.Post)('checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PremiumController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)('cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PremiumController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PremiumController.prototype, "handleWebhook", null);
exports.PremiumController = PremiumController = __decorate([
    (0, common_1.Controller)('premium'),
    __metadata("design:paramtypes", [premium_service_1.PremiumService])
], PremiumController);
//# sourceMappingURL=premium.controller.js.map