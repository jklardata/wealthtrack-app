import Stripe from 'stripe';

// Initialize Stripe client only when env var is available
// This allows the build to succeed without the env var
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  : (null as unknown as Stripe);

export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
  }
  return stripe;
}
