import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PremiumService, PremiumFeature } from './premium.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('premium')
export class PremiumController {
  constructor(private readonly premiumService: PremiumService) {}

  @Get('pricing')
  getPricing() {
    return this.premiumService.getPricing();
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getSubscriptionStatus(@Request() req: { user: { id: string } }) {
    return this.premiumService.getSubscriptionStatus(req.user.id);
  }

  @Get('check/:feature')
  @UseGuards(JwtAuthGuard)
  async checkFeature(
    @Request() req: { user: { id: string } },
    @Body() body: { feature: PremiumFeature },
  ) {
    const hasAccess = await this.premiumService.hasFeature(req.user.id, body.feature);
    return { hasAccess };
  }

  @Post('notify-me')
  @UseGuards(JwtAuthGuard)
  async registerInterest(
    @Request() req: { user: { id: string } },
    @Body() body: { email: string },
  ) {
    return this.premiumService.registerInterest(req.user.id, body.email);
  }

  // PLACEHOLDER ENDPOINTS - Will be activated when Stripe is integrated

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(
    @Request() req: { user: { id: string } },
    @Body() body: { priceId: string },
  ) {
    return this.premiumService.createCheckoutSession(req.user.id, body.priceId);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@Request() req: { user: { id: string } }) {
    return this.premiumService.cancelSubscription(req.user.id);
  }

  // Stripe webhook endpoint (no auth - validated via Stripe signature)
  @Post('webhook')
  async handleWebhook(@Body() event: { type: string; data: { object: unknown } }) {
    // In production, validate Stripe signature first
    return this.premiumService.handleStripeWebhook(event);
  }
}
