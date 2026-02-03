"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumService = exports.PREMIUM_FEATURES = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
exports.PREMIUM_FEATURES = {
    ADVANCED_STATS: 'advanced_stats',
    COUNTRY_HEATMAP: 'country_heatmap',
    XP_CHART: 'xp_chart',
    UNLIMITED_TRIPS: 'unlimited_trips',
    PDF_EXPORT: 'pdf_export',
    PRIORITY_SUPPORT: 'priority_support',
};
let PremiumService = class PremiumService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSubscriptionStatus(userId) {
        let subscription = await this.prisma.userSubscription.findUnique({
            where: { userId },
        });
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
            availableFeatures: isPremium ? Object.values(exports.PREMIUM_FEATURES) : [],
        };
    }
    async hasFeature(userId, feature) {
        const subscription = await this.getSubscriptionStatus(userId);
        if (subscription.isPremium) {
            return true;
        }
        const features = subscription.features;
        return features.includes(feature);
    }
    async isPremium(userId) {
        const subscription = await this.getSubscriptionStatus(userId);
        return subscription.isPremium;
    }
    async registerInterest(userId, email) {
        console.log(`[Premium Interest] User ${userId} registered interest with email: ${email}`);
        return {
            success: true,
            message: 'You will be notified when Premium launches!',
        };
    }
    async createCheckoutSession(userId, priceId) {
        console.log(`[Stripe Placeholder] Would create checkout for user ${userId}, price ${priceId}`);
        return {
            success: false,
            message: 'Stripe integration coming soon!',
            checkoutUrl: null,
        };
    }
    async handleStripeWebhook(event) {
        console.log(`[Stripe Webhook Placeholder] Would handle event: ${event.type}`);
        return { received: true };
    }
    async cancelSubscription(userId) {
        const subscription = await this.prisma.userSubscription.findUnique({
            where: { userId },
        });
        if (!subscription || subscription.status === 'free') {
            return { success: false, message: 'No active subscription to cancel' };
        }
        console.log(`[Stripe Placeholder] Would cancel subscription for user ${userId}`);
        return {
            success: false,
            message: 'Subscription management coming soon!',
        };
    }
    getPricing() {
        return {
            monthly: {
                priceId: 'price_monthly_placeholder',
                amount: 499,
                currency: 'usd',
                interval: 'month',
                displayPrice: '$4.99/month',
                displayPriceEur: '4,99 €/mois',
            },
            lifetime: {
                priceId: 'price_lifetime_placeholder',
                amount: 4900,
                currency: 'usd',
                interval: 'one_time',
                displayPrice: '$49 one-time',
                displayPriceEur: '49 € une fois',
            },
            features: [
                { key: exports.PREMIUM_FEATURES.ADVANCED_STATS, nameEn: 'Advanced statistics', nameFr: 'Statistiques avancées' },
                { key: exports.PREMIUM_FEATURES.COUNTRY_HEATMAP, nameEn: 'Country heatmap', nameFr: 'Carte thermique des pays' },
                { key: exports.PREMIUM_FEATURES.XP_CHART, nameEn: 'XP progression chart', nameFr: 'Graphique de progression XP' },
                { key: exports.PREMIUM_FEATURES.UNLIMITED_TRIPS, nameEn: 'Unlimited collaborative trips', nameFr: 'Voyages collaboratifs illimités' },
                { key: exports.PREMIUM_FEATURES.PDF_EXPORT, nameEn: 'PDF exports', nameFr: 'Exports PDF' },
                { key: exports.PREMIUM_FEATURES.PRIORITY_SUPPORT, nameEn: 'Priority support', nameFr: 'Support prioritaire' },
            ],
        };
    }
};
exports.PremiumService = PremiumService;
exports.PremiumService = PremiumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PremiumService);
//# sourceMappingURL=premium.service.js.map