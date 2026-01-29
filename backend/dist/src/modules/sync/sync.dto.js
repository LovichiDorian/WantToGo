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
exports.BulkSyncRequestDto = exports.SyncActionDto = exports.SyncEntityType = exports.SyncActionType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var SyncActionType;
(function (SyncActionType) {
    SyncActionType["CREATE"] = "create";
    SyncActionType["UPDATE"] = "update";
    SyncActionType["DELETE"] = "delete";
})(SyncActionType || (exports.SyncActionType = SyncActionType = {}));
var SyncEntityType;
(function (SyncEntityType) {
    SyncEntityType["PLACE"] = "place";
    SyncEntityType["PHOTO"] = "photo";
})(SyncEntityType || (exports.SyncEntityType = SyncEntityType = {}));
class SyncActionDto {
    actionType;
    entityType;
    clientId;
    serverId;
    payload;
    timestamp;
}
exports.SyncActionDto = SyncActionDto;
__decorate([
    (0, class_validator_1.IsEnum)(SyncActionType),
    __metadata("design:type", String)
], SyncActionDto.prototype, "actionType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(SyncEntityType),
    __metadata("design:type", String)
], SyncActionDto.prototype, "entityType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncActionDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncActionDto.prototype, "serverId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SyncActionDto.prototype, "payload", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SyncActionDto.prototype, "timestamp", void 0);
class BulkSyncRequestDto {
    actions;
    lastSyncedAt;
}
exports.BulkSyncRequestDto = BulkSyncRequestDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SyncActionDto),
    __metadata("design:type", Array)
], BulkSyncRequestDto.prototype, "actions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkSyncRequestDto.prototype, "lastSyncedAt", void 0);
//# sourceMappingURL=sync.dto.js.map