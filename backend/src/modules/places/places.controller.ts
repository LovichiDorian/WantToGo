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
import { CreatePlaceDto, UpdatePlaceDto } from './places.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { id: string; email: string };
}

@Controller('places')
@UseGuards(JwtAuthGuard)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.placesService.findAll(req.user.id);
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    await this.placesService.remove(id, req.user.id);
  }
}
