import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

const VALID_PROMO_CODES: Record<string, {
  tier: 'pro' | 'premium';
  duration: 'lifetime' | 'trial';
  trialDays?: number;
}> = {
  'SAVERTEST': {
    tier: 'pro',
    duration: 'lifetime', // Can be changed to 'trial' with trialDays if needed
  },
};

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    const promoConfig = VALID_PROMO_CODES[code.toUpperCase()];
    if (!promoConfig) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Check current subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Don't allow promo codes if user already has paid subscription
    if (subscription?.entitlement_tier !== 'free') {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Update subscription with promo tier
    const updates: Record<string, unknown> = {
      entitlement_tier: promoConfig.tier,
      status: 'active',
      promo_code_used: code.toUpperCase(),
      promo_activated_at: new Date().toISOString(),
    };

    if (promoConfig.duration === 'trial' && promoConfig.trialDays) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + promoConfig.trialDays);
      updates.current_period_end = expiresAt.toISOString();
    } else {
      // Lifetime promo - set far future date
      const farFuture = new Date();
      farFuture.setFullYear(farFuture.getFullYear() + 100);
      updates.current_period_end = farFuture.toISOString();
    }

    if (subscription) {
      await supabase
        .from('subscriptions')
        .update(updates)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          ...updates,
        });
    }

    return NextResponse.json({
      message: `Successfully upgraded to ${promoConfig.tier === 'pro' ? 'Pro' : 'Premium'}!`,
      tier: promoConfig.tier,
    });
  } catch (error) {
    console.error('Promo code redemption error:', error);
    return NextResponse.json(
      { error: 'Failed to redeem promo code' },
      { status: 500 }
    );
  }
}
