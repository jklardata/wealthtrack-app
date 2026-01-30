import type { EntitlementTier } from './types';

// Price IDs from Stripe Dashboard
// These should be set in environment variables
export const STRIPE_PRICES = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || '',
  },
  premium: {
    monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || '',
  },
} as const;

// Map price IDs to entitlement tiers
export function getTierFromPriceId(priceId: string): EntitlementTier {
  if (priceId === STRIPE_PRICES.premium.monthly || priceId === STRIPE_PRICES.premium.yearly) {
    return 'premium';
  }
  if (priceId === STRIPE_PRICES.pro.monthly || priceId === STRIPE_PRICES.pro.yearly) {
    return 'pro';
  }
  return 'free';
}

// Get tier from product metadata
export function getTierFromMetadata(metadata: Record<string, string> | null): EntitlementTier {
  if (!metadata) return 'free';
  const tier = metadata.tier as EntitlementTier;
  if (tier === 'pro' || tier === 'premium') {
    return tier;
  }
  return 'free';
}

// Pricing display information
export const PRICING_TIERS = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Get started with basic features',
    features: [
      'Net worth tracking',
      'Basic dashboard',
    ],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 249,
    description: 'Full access to all premium tools',
    features: [
      'Everything in Free',
      'Scenario modeling',
      'Advanced tax engine',
      'Retirement optimization',
      'Projections & alerts',
      'Saved plans',
      'Premium tools',
    ],
  },
} as const;
