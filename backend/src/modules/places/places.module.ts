import { Module, forwardRef } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { AuthModule } from '../auth/auth.module';
import { PlaceImageModule } from '../place-image/place-image.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [
    AuthModule, 
    forwardRef(() => PlaceImageModule),
    forwardRef(() => GamificationModule),
  ],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}
