"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const places_module_1 = require("./modules/places/places.module");
const sync_module_1 = require("./modules/sync/sync.module");
const photos_module_1 = require("./modules/photos/photos.module");
const friends_module_1 = require("./modules/friends/friends.module");
const auth_module_1 = require("./modules/auth/auth.module");
const assistant_module_1 = require("./modules/assistant/assistant.module");
const place_image_module_1 = require("./modules/place-image/place-image.module");
const gamification_module_1 = require("./modules/gamification/gamification.module");
const activities_module_1 = require("./modules/activities/activities.module");
const leaderboard_module_1 = require("./modules/leaderboard/leaderboard.module");
const trips_module_1 = require("./modules/trips/trips.module");
const premium_module_1 = require("./modules/premium/premium.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            places_module_1.PlacesModule,
            sync_module_1.SyncModule,
            photos_module_1.PhotosModule,
            friends_module_1.FriendsModule,
            assistant_module_1.AssistantModule,
            place_image_module_1.PlaceImageModule,
            gamification_module_1.GamificationModule,
            activities_module_1.ActivitiesModule,
            leaderboard_module_1.LeaderboardModule,
            trips_module_1.TripsModule,
            premium_module_1.PremiumModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map