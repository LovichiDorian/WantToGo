import { PrismaService } from '../../prisma/prisma.service';
export declare const PREMIUM_FEATURES: {
    readonly ADVANCED_STATS: "advanced_stats";
    readonly COUNTRY_HEATMAP: "country_heatmap";
    readonly XP_CHART: "xp_chart";
    readonly UNLIMITED_TRIPS: "unlimited_trips";
    readonly PDF_EXPORT: "pdf_export";
    readonly PRIORITY_SUPPORT: "priority_support";
};
export type PremiumFeature = typeof PREMIUM_FEATURES[keyof typeof PREMIUM_FEATURES];
export declare class PremiumService {
    private prisma;
    constructor(prisma: PrismaService);
    getSubscriptionStatus(userId: string): Promise<{
        isPremium: boolean;
        availableFeatures: ("advanced_stats" | "country_heatmap" | "xp_chart" | "unlimited_trips" | "pdf_export" | "priority_support")[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        stripeCustomerId: string | null;
        stripeSubId: string | null;
        stripePriceId: string | null;
        status: string;
        features: import("@prisma/client/runtime/client").JsonValue;
        startedAt: Date | null;
        expiresAt: Date | null;
        cancelledAt: Date | null;
    }>;
    hasFeature(userId: string, feature: PremiumFeature): Promise<boolean>;
    isPremium(userId: string): Promise<boolean>;
    registerInterest(userId: string, email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createCheckoutSession(userId: string, priceId: string): Promise<{
        success: boolean;
        message: string;
        checkoutUrl: null;
    }>;
    handleStripeWebhook(event: {
        type: string;
        data: {
            object: unknown;
        };
    }): Promise<{
        received: boolean;
    }>;
    cancelSubscription(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getPricing(): {
        monthly: {
            priceId: string;
            amount: number;
            currency: string;
            interval: string;
            displayPrice: string;
            displayPriceEur: string;
        };
        lifetime: {
            priceId: string;
            amount: number;
            currency: string;
            interval: string;
            displayPrice: string;
            displayPriceEur: string;
        };
        features: ({
            key: "advanced_stats";
            nameEn: string;
            nameFr: string;
        } | {
            key: "country_heatmap";
            nameEn: string;
            nameFr: string;
        } | {
            key: "xp_chart";
            nameEn: string;
            nameFr: string;
        } | {
            key: "unlimited_trips";
            nameEn: string;
            nameFr: string;
        } | {
            key: "pdf_export";
            nameEn: string;
            nameFr: string;
        } | {
            key: "priority_support";
            nameEn: string;
            nameFr: string;
        })[];
    };
}
