import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('friends')
  async getFriendsLeaderboard(@Request() req: { user: { id: string } }) {
    return this.leaderboardService.getFriendsLeaderboard(req.user.id);
  }

  @Get('monthly-challenge')
  async getMonthlyChallengeStats(@Request() req: { user: { id: string } }) {
    return this.leaderboardService.getMonthlyChallengeStats(req.user.id);
  }

  @Get('rank')
  async getUserRank(@Request() req: { user: { id: string } }) {
    return this.leaderboardService.getUserRank(req.user.id);
  }

  @Get('top-cities')
  async getTopCities(@Request() req: { user: { id: string } }) {
    return this.leaderboardService.getTopCities(req.user.id);
  }

  @Get('country-heatmap')
  async getCountryHeatmap(@Request() req: { user: { id: string } }) {
    return this.leaderboardService.getCountryHeatmap(req.user.id);
  }

  @Get('total-distance')
  async getTotalDistance(@Request() req: { user: { id: string } }) {
    const distance = await this.leaderboardService.getTotalDistance(req.user.id);
    return { totalDistanceKm: distance };
  }
}
