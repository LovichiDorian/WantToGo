import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlacesModule } from './modules/places/places.module';
import { SyncModule } from './modules/sync/sync.module';
import { PhotosModule } from './modules/photos/photos.module';
import { FriendsModule } from './modules/friends/friends.module';
import { AuthModule } from './modules/auth/auth.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { PlaceImageModule } from './modules/place-image/place-image.module';
// New modules for gamification, social features, and premium
import { GamificationModule } from './modules/gamification/gamification.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { TripsModule } from './modules/trips/trips.module';
import { PremiumModule } from './modules/premium/premium.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Serve uploaded files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    PlacesModule,
    SyncModule,
    PhotosModule,
    FriendsModule,
    AssistantModule,
    PlaceImageModule,
    // New modules
    GamificationModule,
    ActivitiesModule,
    LeaderboardModule,
    TripsModule,
    PremiumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
