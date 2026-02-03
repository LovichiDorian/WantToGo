import { Controller, Get, Post, Body, Patch, UseGuards, Request, Logger } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  private readonly logger = new Logger(GamificationController.name);

  constructor(private readonly gamificationService: GamificationService) {}

  @Get('profile')
  async getProfile(@Request() req: { user: { id: string } }) {
    this.logger.log(`Getting profile for user: ${req.user?.id}`);
    try {
      const profile = await this.gamificationService.getUserProfile(req.user.id);
      return profile;
    } catch (error) {
      this.logger.error(`Error getting profile: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('achievements')
  async getAchievements(@Request() req: { user: { id: string } }) {
    return this.gamificationService.getAchievements(req.user.id);
  }

  @Post('check-achievements')
  async checkAchievements(@Request() req: { user: { id: string } }) {
    return this.gamificationService.checkAchievements(req.user.id);
  }

  @Patch('language')
  async updateLanguage(
    @Request() req: { user: { id: string } },
    @Body() body: { language: 'fr' | 'en' },
  ) {
    return this.gamificationService.updateLanguage(req.user.id, body.language);
  }

  @Get('xp-progress')
  async getXpProgress(@Request() req: { user: { id: string } }) {
    const profile = await this.gamificationService.getUserProfile(req.user.id);
    return {
      xp: profile.xp,
      level: profile.level,
      ...profile.xpProgress,
    };
  }
}
