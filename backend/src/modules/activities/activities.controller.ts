import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('me')
  async getMyActivities(
    @Request() req: { user: { id: string } },
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.activitiesService.getUserActivities(
      req.user.id,
      limit ? parseInt(limit, 10) : 20,
      cursor,
    );
  }

  @Get('friends')
  async getFriendsActivities(
    @Request() req: { user: { id: string } },
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.activitiesService.getFriendsActivities(
      req.user.id,
      limit ? parseInt(limit, 10) : 20,
      cursor,
    );
  }

  @Get('xp-history')
  async getXpHistory(
    @Request() req: { user: { id: string } },
    @Query('days') days?: string,
  ) {
    return this.activitiesService.getXpHistory(
      req.user.id,
      days ? parseInt(days, 10) : 30,
    );
  }
}
