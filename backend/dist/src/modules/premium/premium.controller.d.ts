import { PremiumService, PremiumFeature } from './premium.service';
export declare class PremiumController {
    private readonly premiumService;
    constructor(premiumService: PremiumService);
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
    getSubscriptionStatus(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
    checkFeature(req: {
        user: {
            id: string;
        };
    }, body: {
        feature: PremiumFeature;
    }): Promise<{
        hasAccess: boolean;
    }>;
    registerInterest(req: {
        user: {
            id: string;
        };
    }, body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    createCheckout(req: {
        user: {
            id: string;
        };
    }, body: {
        priceId: string;
    }): Promise<{
        success: boolean;
        message: string;
        checkoutUrl: null;
    }>;
    cancelSubscription(req: {
        user: {
            id: string;
        };
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    handleWebhook(event: {
        type: string;
        data: {
            object: unknown;
        };
    }): Promise<{
        received: boolean;
    }>;
}
