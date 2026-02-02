import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

// WARNING: This immediately cancels the subscription and downgrades to free
// Use this for testing only. In production, use cancel-subscription which cancels at period end.
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get user's subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // Cancel immediately in Stripe if there's a subscription ID
    if (subscription.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
      } catch (stripeError) {
        console.error('Error canceling Stripe subscription:', stripeError);
        // Continue anyway to update local database
      }
    }

    // Update subscription in database to free tier
    await supabase
      .from('subscriptions')
      .update({
        entitlement_tier: 'free',
        status: 'canceled',
        stripe_subscription_id: null,
        current_period_end: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      message: 'Subscription downgraded to free immediately',
    });
  } catch (error) {
    console.error('Error downgrading subscription:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to downgrade subscription'
    }, { status: 500 });
  }
}
