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
    description: 'Essential tools to get started',
    features: [
      'Net worth tracking',
      'Tax optimization',
      'Credit card tracking',
      'Portfolio optimizer',
      'Retirement projections',
      'Retirement location & spending',
      'Educational calculators',
      'Geo-arbitrage',
    ],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 249,
    description: 'Advanced tools for serious planners',
    features: [
      'Everything in Free',
      'Advanced tax optimization tools',
      'Tax-optimized take-home calculator',
      'Business structure comparison (LLC, S-Corp, W-2)',
      'Quarterly estimated taxes',
      'Capital gains strategy simulator',
      'Geo-arbitrage saved scenarios',
      'Self-employment tax optimization',
      'Personalized insights',
    ],
  },
  // Legacy tier - maps to Pro for existing subscribers
  premium: {
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 249,
    description: 'Advanced tools for serious planners',
    features: [
      'Everything in Free',
      'Advanced tax optimization tools',
      'Tax-optimized take-home calculator',
      'Business structure comparison (LLC, S-Corp, W-2)',
      'Quarterly estimated taxes',
      'Capital gains strategy simulator',
      'Geo-arbitrage saved scenarios',
      'Self-employment tax optimization',
      'Personalized insights',
    ],
  },
} as const;
