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
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto, UpdatePlaceDto } from './places.dto';

// TODO: Replace with actual user ID from auth middleware
const TEMP_USER_ID = 'default-user-id';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async findAll() {
    return this.placesService.findAll(TEMP_USER_ID);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.placesService.findOne(id, TEMP_USER_ID);
  }

  @Post()
  async create(@Body() dto: CreatePlaceDto) {
    return this.placesService.create(TEMP_USER_ID, dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePlaceDto) {
    return this.placesService.update(id, TEMP_USER_ID, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.placesService.remove(id, TEMP_USER_ID);
  }
}
