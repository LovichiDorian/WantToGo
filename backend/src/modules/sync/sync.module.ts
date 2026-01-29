import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [PlacesModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
