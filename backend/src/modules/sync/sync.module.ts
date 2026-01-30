import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { PlacesModule } from '../places/places.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PlacesModule, AuthModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
