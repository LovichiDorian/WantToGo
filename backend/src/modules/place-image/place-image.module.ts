import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlaceImageService } from './place-image.service';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [ConfigModule, forwardRef(() => PlacesModule)],
  providers: [PlaceImageService],
  exports: [PlaceImageService],
})
export class PlaceImageModule {}
