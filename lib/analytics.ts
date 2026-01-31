import { track } from '@vercel/analytics';

// UTM parameters type
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

// Get UTM params from URL
export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  };
}

// Store UTM params in sessionStorage for attribution
export function storeUTMParams(): void {
  if (typeof window === 'undefined') return;

  const utm = getUTMParams();
  if (Object.values(utm).some(v => v)) {
    sessionStorage.setItem('utm_params', JSON.stringify(utm));
  }
}

// Get stored UTM params
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem('utm_params');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Analytics event types
export type CTALocation =
  | 'hero'
  | 'nav'
  | 'pricing_free'
  | 'pricing_pro'
  | 'cta_section'
  | 'feature'
  | 'demo'
  | 'email_gate'
  | 'results'
  | 'step_1'
  | 'step_2'
  | 'step_3'
  | 'step_4'
  | 'step_5';

export type CTAAction =
  | 'get_started'
  | 'sign_in'
  | 'start_free'
  | 'start_trial'
  | 'watch_demo'
  | 'create_account'
  | 'calculator_step'
  | 'calculator_email_submit';

// Core tracking functions
export const analytics = {
  // Track CTA button clicks
  ctaClick: (
    action: CTAAction,
    location: CTALocation,
    variant: string,
    tier?: 'free' | 'pro'
  ) => {
    const utm = getStoredUTMParams();
    track('cta_click', {
      action,
      location,
      variant,
      tier: tier || 'none',
      ...utm,
    });
  },

  // Track page view with variant info
  pageView: (variant: string) => {
    const utm = getStoredUTMParams();
    track('landing_page_view', {
      variant,
      ...utm,
    });
  },

  // Track scroll depth milestones
  scrollDepth: (percent: 25 | 50 | 75 | 100, variant: string) => {
    track('scroll_depth', {
      percent,
      variant,
    });
  },

  // Track pricing section view
  pricingView: (variant: string) => {
    track('pricing_view', {
      variant,
    });
  },

  // Track feature section engagement
  featureView: (featureName: string, variant: string) => {
    track('feature_view', {
      feature: featureName,
      variant,
    });
  },

  // Track calculator interactions (for landing page 9)
  calculatorInteraction: (field: string, value: number, variant: string) => {
    track('calculator_interaction', {
      field,
      value,
      variant,
    });
  },

  // Track demo button clicks
  demoClick: (variant: string) => {
    const utm = getStoredUTMParams();
    track('demo_click', {
      variant,
      ...utm,
    });
  },

  // Track testimonial section view
  testimonialView: (variant: string) => {
    track('testimonial_view', {
      variant,
    });
  },
};

export default analytics;
