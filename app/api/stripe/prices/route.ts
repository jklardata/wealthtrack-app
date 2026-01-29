import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
    },
    premium: {
      monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY || '',
      yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY || '',
    },
  });
}
