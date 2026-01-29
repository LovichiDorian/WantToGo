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
exports.MyCodeDto = exports.FriendshipDto = exports.FriendDto = exports.FriendPlaceDto = exports.AddFriendDto = void 0;
const class_validator_1 = require("class-validator");
class AddFriendDto {
    shareCode;
}
exports.AddFriendDto = AddFriendDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], AddFriendDto.prototype, "shareCode", void 0);
class FriendPlaceDto {
    id;
    name;
    notes;
    latitude;
    longitude;
    address;
    tripDate;
}
exports.FriendPlaceDto = FriendPlaceDto;
class FriendDto {
    shareCode;
    name;
    places;
}
exports.FriendDto = FriendDto;
class FriendshipDto {
    id;
    friendCode;
    friendName;
    color;
    places;
    createdAt;
}
exports.FriendshipDto = FriendshipDto;
class MyCodeDto {
    shareCode;
    placesCount;
}
exports.MyCodeDto = MyCodeDto;
//# sourceMappingURL=friends.dto.js.map