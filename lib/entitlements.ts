import type { EntitlementTier } from './types';

// All available features
export type Feature =
  | 'net_worth_tracking'
  | 'dashboard_basic'
  | 'portfolio_optimizer'
  | 'credit_cards'
  | 'retirement_calculator'
  | 'google_sheets_sync'
  | 'geo_arbitrage'
  | 'scenarios'
  | 'tax_calculator';

// Feature flags mapped to tiers
export const TIER_FEATURES: Record<EntitlementTier, Feature[]> = {
  free: [
    'net_worth_tracking',
    'dashboard_basic',
  ],
  pro: [
    'net_worth_tracking',
    'dashboard_basic',
    'portfolio_optimizer',
    'credit_cards',
    'retirement_calculator',
    'google_sheets_sync',
  ],
  premium: [
    'net_worth_tracking',
    'dashboard_basic',
    'portfolio_optimizer',
    'credit_cards',
    'retirement_calculator',
    'google_sheets_sync',
    'geo_arbitrage',
    'scenarios',
    'tax_calculator',
  ],
};

// Tier hierarchy for comparison
const TIER_LEVELS: Record<EntitlementTier, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

/**
 * Check if a user with a given tier has access to a specific feature
 */
export function hasFeatureAccess(tier: EntitlementTier, feature: Feature): boolean {
  const features = TIER_FEATURES[tier];
  return features.includes(feature);
}

/**
 * Check if user's tier is at least the required tier
 */
export function tierAtLeast(userTier: EntitlementTier, requiredTier: EntitlementTier): boolean {
  return TIER_LEVELS[userTier] >= TIER_LEVELS[requiredTier];
}

/**
 * Get the minimum tier required for a feature
 */
export function getRequiredTier(feature: Feature): EntitlementTier {
  if (TIER_FEATURES.free.includes(feature)) return 'free';
  if (TIER_FEATURES.pro.includes(feature)) return 'pro';
  return 'premium';
}

/**
 * Feature to route mapping for gating
 */
export const ROUTE_FEATURES: Record<string, Feature> = {
  '/portfolio-optimizer': 'portfolio_optimizer',
  '/credit-cards': 'credit_cards',
  '/retirement': 'retirement_calculator',
  '/geo-arbitrage': 'geo_arbitrage',
  '/compare': 'scenarios',
  '/tax-calculator': 'tax_calculator',
};

/**
 * Get the feature required for a given route
 */
export function getRouteFeature(pathname: string): Feature | null {
  // Check for exact match first
  if (ROUTE_FEATURES[pathname]) {
    return ROUTE_FEATURES[pathname];
  }
  // Check if route starts with any of the feature routes
  for (const [route, feature] of Object.entries(ROUTE_FEATURES)) {
    if (pathname.startsWith(route)) {
      return feature;
    }
  }
  return null;
}
