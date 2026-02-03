"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceImageModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const place_image_service_1 = require("./place-image.service");
const places_module_1 = require("../places/places.module");
let PlaceImageModule = class PlaceImageModule {
};
exports.PlaceImageModule = PlaceImageModule;
exports.PlaceImageModule = PlaceImageModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, (0, common_1.forwardRef)(() => places_module_1.PlacesModule)],
        providers: [place_image_service_1.PlaceImageService],
        exports: [place_image_service_1.PlaceImageService],
    })
], PlaceImageModule);
//# sourceMappingURL=place-image.module.js.map