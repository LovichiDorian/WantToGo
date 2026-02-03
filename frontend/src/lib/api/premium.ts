import { apiRequest } from './client';

export interface SubscriptionStatus {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubId: string | null;
  stripePriceId: string | null;
  status: 'free' | 'premium' | 'lifetime' | 'cancelled';
  features: string[];
  startedAt: string | null;
  expiresAt: string | null;
  cancelledAt: string | null;
  isPremium: boolean;
  availableFeatures: string[];
}

export interface PricingInfo {
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
  features: {
    key: string;
    nameEn: string;
    nameFr: string;
  }[];
}

// Get pricing info
export async function getPricing(): Promise<PricingInfo> {
  return apiRequest<PricingInfo>('/premium/pricing');
}

// Get subscription status
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  return apiRequest<SubscriptionStatus>('/premium/status');
}

// Check if user has a specific feature
export async function checkFeature(feature: string): Promise<{ hasAccess: boolean }> {
  return apiRequest<{ hasAccess: boolean }>(`/premium/check/${feature}`, {
    method: 'GET',
    body: JSON.stringify({ feature }),
  });
}

// Register interest for premium (notify me)
export async function registerInterest(email: string): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>('/premium/notify-me', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Create checkout session (placeholder)
export async function createCheckout(priceId: string): Promise<{ success: boolean; message: string; checkoutUrl: string | null }> {
  return apiRequest<{ success: boolean; message: string; checkoutUrl: string | null }>('/premium/checkout', {
    method: 'POST',
    body: JSON.stringify({ priceId }),
  });
}

// Cancel subscription (placeholder)
export async function cancelSubscription(): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>('/premium/cancel', {
    method: 'POST',
  });
}
