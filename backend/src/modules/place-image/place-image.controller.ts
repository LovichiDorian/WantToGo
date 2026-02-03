import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaceImageService } from './place-image.service';

@Controller('places')
@UseGuards(JwtAuthGuard)
export class PlaceImageController {
  constructor(private readonly placeImageService: PlaceImageService) {}

  /**
   * Get an image URL for a specific place
   * Uses AI to determine the best strategy (Unsplash or AI generation)
   */
  @Get(':id/image')
  async getPlaceImage(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ): Promise<{ imageUrl: string; source: string; query?: string }> {
    return this.placeImageService.getPlaceImage(id, req.user.id);
  }
}
