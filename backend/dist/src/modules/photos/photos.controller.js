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
exports.PhotosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const photos_service_1 = require("./photos.service");
const TEMP_USER_ID = 'default-user-id';
let PhotosController = class PhotosController {
    photosService;
    constructor(photosService) {
        this.photosService = photosService;
    }
    async uploadPhoto(placeId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return this.photosService.create(TEMP_USER_ID, placeId, {
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
        });
    }
    async deletePhoto(placeId, photoId) {
        await this.photosService.remove(TEMP_USER_ID, placeId, photoId);
    }
};
exports.PhotosController = PhotosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        dest: './uploads/photos',
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.startsWith('image/')) {
                return callback(new common_1.BadRequestException('Only image files are allowed'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('placeId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PhotosController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Delete)(':photoId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('placeId')),
    __param(1, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PhotosController.prototype, "deletePhoto", null);
exports.PhotosController = PhotosController = __decorate([
    (0, common_1.Controller)('places/:placeId/photos'),
    __metadata("design:paramtypes", [photos_service_1.PhotosService])
], PhotosController);
//# sourceMappingURL=photos.controller.js.map