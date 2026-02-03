import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto, UpdatePlaceDto, MarkVisitedDto } from './places.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaceImageService } from '../place-image/place-image.service';

interface RequestWithUser extends Request {
  user: { id: string; email: string };
}

@Controller('places')
@UseGuards(JwtAuthGuard)
export class PlacesController {
  constructor(
    private readonly placesService: PlacesService,
    private readonly placeImageService: PlaceImageService,
  ) {}

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.placesService.findAll(req.user.id);
  }

  @Get('stats')
  async getStats(@Request() req: RequestWithUser) {
    return this.placesService.getStats(req.user.id);
  }

  /**
   * Get an image URL for a specific place
   * Must be before :id route to avoid route conflict
   */
  @Get(':id/image')
  async getPlaceImage(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<{ imageUrl: string; source: string; query?: string }> {
    return this.placeImageService.getPlaceImage(id, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.placesService.findOne(id, req.user.id);
  }

  @Post()
  async create(@Body() dto: CreatePlaceDto, @Request() req: RequestWithUser) {
    return this.placesService.create(req.user.id, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePlaceDto,
    @Request() req: RequestWithUser,
  ) {
    return this.placesService.update(id, req.user.id, dto);
  }

  /**
   * Mark a place as visited
   */
  @Post(':id/visited')
  async markVisited(
    @Param('id') id: string,
    @Body() dto: MarkVisitedDto,
    @Request() req: RequestWithUser,
  ) {
    return this.placesService.markVisited(id, req.user.id, dto);
  }

  /**
   * Undo mark visited (within 24 hours)
   */
  @Delete(':id/visited')
  async undoVisited(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.placesService.undoVisited(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    await this.placesService.remove(id, req.user.id);
  }
}
