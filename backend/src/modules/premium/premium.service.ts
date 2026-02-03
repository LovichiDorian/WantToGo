import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Premium features that can be checked
export const PREMIUM_FEATURES = {
  ADVANCED_STATS: 'advanced_stats',
  COUNTRY_HEATMAP: 'country_heatmap',
  XP_CHART: 'xp_chart',
  UNLIMITED_TRIPS: 'unlimited_trips',
  PDF_EXPORT: 'pdf_export',
  PRIORITY_SUPPORT: 'priority_support',
} as const;

export type PremiumFeature = typeof PREMIUM_FEATURES[keyof typeof PREMIUM_FEATURES];

@Injectable()
export class PremiumService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user's subscription status
   */
  async getSubscriptionStatus(userId: string) {
    let subscription = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });

    // Create free subscription if none exists
    if (!subscription) {
      subscription = await this.prisma.userSubscription.create({
        data: {
          userId,
          status: 'free',
          features: [],
        },
      });
    }

    const isPremium = subscription.status === 'premium' || subscription.status === 'lifetime';

    return {
      ...subscription,
      isPremium,
      availableFeatures: isPremium ? Object.values(PREMIUM_FEATURES) : [],
    };
  }

  /**
   * Check if user has access to a specific premium feature
   */
  async hasFeature(userId: string, feature: PremiumFeature): Promise<boolean> {
    const subscription = await this.getSubscriptionStatus(userId);
    
    if (subscription.isPremium) {
      return true;
    }

    const features = subscription.features as string[];
    return features.includes(feature);
  }

  /**
   * Check if user is premium
   */
  async isPremium(userId: string): Promise<boolean> {
    const subscription = await this.getSubscriptionStatus(userId);
    return subscription.isPremium;
  }

  /**
   * Register interest for premium (notify me)
   * This is a placeholder - in production, would save email to a mailing list
   */
  async registerInterest(userId: string, email: string) {
    // In production, this would:
    // 1. Add email to a mailing list (Mailchimp, SendGrid, etc.)
    // 2. Record interest in a separate table
    // For now, just return success

    console.log(`[Premium Interest] User ${userId} registered interest with email: ${email}`);

    return {
      success: true,
      message: 'You will be notified when Premium launches!',
    };
  }

  /**
   * PLACEHOLDER: Create Stripe checkout session
   * This would be implemented when Stripe is integrated
   */
  async createCheckoutSession(userId: string, priceId: string) {
    // STRIPE INTEGRATION PLACEHOLDER
    // When implementing:
    // 1. Initialize Stripe with STRIPE_SECRET_KEY
    // 2. Create customer if not exists
    // 3. Create checkout session with success/cancel URLs
    // 4. Return session URL for redirect

    console.log(`[Stripe Placeholder] Would create checkout for user ${userId}, price ${priceId}`);

    return {
      success: false,
      message: 'Stripe integration coming soon!',
      checkoutUrl: null,
    };
  }

  /**
   * PLACEHOLDER: Handle Stripe webhook
   * This would be implemented when Stripe is integrated
   */
  async handleStripeWebhook(event: { type: string; data: { object: unknown } }) {
    // STRIPE WEBHOOK PLACEHOLDER
    // When implementing, handle these events:
    // - checkout.session.completed
    // - customer.subscription.updated
    // - customer.subscription.deleted
    // - invoice.payment_failed

    console.log(`[Stripe Webhook Placeholder] Would handle event: ${event.type}`);

    return { received: true };
  }

  /**
   * PLACEHOLDER: Cancel subscription
   */
  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.status === 'free') {
      return { success: false, message: 'No active subscription to cancel' };
    }

    // In production, would cancel via Stripe API
    // For now, just mark as cancelled

    console.log(`[Stripe Placeholder] Would cancel subscription for user ${userId}`);

    return {
      success: false,
      message: 'Subscription management coming soon!',
    };
  }

  /**
   * Get pricing information (for display)
   */
  getPricing() {
    return {
      monthly: {
        priceId: 'price_monthly_placeholder',
        amount: 499, // cents
        currency: 'usd',
        interval: 'month',
        displayPrice: '$4.99/month',
        displayPriceEur: '4,99 €/mois',
      },
      lifetime: {
        priceId: 'price_lifetime_placeholder',
        amount: 4900, // cents
        currency: 'usd',
        interval: 'one_time',
        displayPrice: '$49 one-time',
        displayPriceEur: '49 € une fois',
      },
      features: [
        { key: PREMIUM_FEATURES.ADVANCED_STATS, nameEn: 'Advanced statistics', nameFr: 'Statistiques avancées' },
        { key: PREMIUM_FEATURES.COUNTRY_HEATMAP, nameEn: 'Country heatmap', nameFr: 'Carte thermique des pays' },
        { key: PREMIUM_FEATURES.XP_CHART, nameEn: 'XP progression chart', nameFr: 'Graphique de progression XP' },
        { key: PREMIUM_FEATURES.UNLIMITED_TRIPS, nameEn: 'Unlimited collaborative trips', nameFr: 'Voyages collaboratifs illimités' },
        { key: PREMIUM_FEATURES.PDF_EXPORT, nameEn: 'PDF exports', nameFr: 'Exports PDF' },
        { key: PREMIUM_FEATURES.PRIORITY_SUPPORT, nameEn: 'Priority support', nameFr: 'Support prioritaire' },
      ],
    };
  }
}
