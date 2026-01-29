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
exports.FriendsController = void 0;
const common_1 = require("@nestjs/common");
const friends_service_1 = require("./friends.service");
let FriendsController = class FriendsController {
    friendsService;
    constructor(friendsService) {
        this.friendsService = friendsService;
    }
    async getMyCode(deviceId) {
        if (!deviceId) {
            throw new common_1.BadRequestException('Device ID header is required');
        }
        return this.friendsService.getMyCode(deviceId);
    }
    async getFriendPlaces(shareCode) {
        return this.friendsService.getFriendPlaces(shareCode);
    }
    async updateMyName(deviceId, name) {
        if (!deviceId) {
            throw new common_1.BadRequestException('Device ID header is required');
        }
        await this.friendsService.updateMyName(deviceId, name);
        return { success: true };
    }
};
exports.FriendsController = FriendsController;
__decorate([
    (0, common_1.Get)('my-code'),
    __param(0, (0, common_1.Headers)('x-device-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getMyCode", null);
__decorate([
    (0, common_1.Get)('places/:shareCode'),
    __param(0, (0, common_1.Param)('shareCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "getFriendPlaces", null);
__decorate([
    (0, common_1.Patch)('my-name'),
    __param(0, (0, common_1.Headers)('x-device-id')),
    __param(1, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendsController.prototype, "updateMyName", null);
exports.FriendsController = FriendsController = __decorate([
    (0, common_1.Controller)('friends'),
    __metadata("design:paramtypes", [friends_service_1.FriendsService])
], FriendsController);
//# sourceMappingURL=friends.controller.js.map