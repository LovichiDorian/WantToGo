import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTripDto, UpdateTripDto, AddTripPlaceDto, AddTripMemberDto } from './trips.dto';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  async createTrip(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateTripDto,
  ) {
    return this.tripsService.createTrip(req.user.id, dto);
  }

  @Get()
  async getUserTrips(@Request() req: { user: { id: string } }) {
    return this.tripsService.getUserTrips(req.user.id);
  }

  @Get(':id')
  async getTripById(
    @Param('id') tripId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.tripsService.getTripById(tripId, req.user.id);
  }

  @Patch(':id')
  async updateTrip(
    @Param('id') tripId: string,
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripsService.updateTrip(tripId, req.user.id, dto);
  }

  @Delete(':id')
  async deleteTrip(
    @Param('id') tripId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.tripsService.deleteTrip(tripId, req.user.id);
  }

  @Post(':id/places')
  async addPlaceToTrip(
    @Param('id') tripId: string,
    @Request() req: { user: { id: string } },
    @Body() dto: AddTripPlaceDto,
  ) {
    return this.tripsService.addPlaceToTrip(tripId, req.user.id, dto);
  }

  @Delete(':id/places/:placeId')
  async removePlaceFromTrip(
    @Param('id') tripId: string,
    @Param('placeId') placeId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.tripsService.removePlaceFromTrip(tripId, placeId, req.user.id);
  }

  @Post(':id/members')
  async addMemberToTrip(
    @Param('id') tripId: string,
    @Request() req: { user: { id: string } },
    @Body() dto: AddTripMemberDto,
  ) {
    return this.tripsService.addMemberToTrip(tripId, req.user.id, dto);
  }

  @Delete(':id/members/:memberId')
  async removeMemberFromTrip(
    @Param('id') tripId: string,
    @Param('memberId') memberId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.tripsService.removeMemberFromTrip(tripId, memberId, req.user.id);
  }

  @Post(':id/leave')
  async leaveTrip(
    @Param('id') tripId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.tripsService.leaveTrip(tripId, req.user.id);
  }
}
