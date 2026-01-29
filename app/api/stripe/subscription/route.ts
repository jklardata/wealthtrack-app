import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { Subscription, EntitlementTier } from '@/lib/types';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    // Return default free tier if no subscription exists
    if (!subscription) {
      return NextResponse.json({
        entitlement_tier: 'free' as EntitlementTier,
        status: 'active',
        current_period_end: null,
      });
    }

    return NextResponse.json({
      entitlement_tier: subscription.entitlement_tier,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
    });
  } catch (error) {
    console.error('Error in subscription route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
