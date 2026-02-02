import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

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

    if (!subscription.stripe_subscription_id) {
      return NextResponse.json({ error: 'No Stripe subscription ID' }, { status: 400 });
    }

    // Cancel the subscription in Stripe (at period end)
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    );

    // Update subscription in database
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceling',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      current_period_end: canceledSubscription.current_period_end,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to cancel subscription'
    }, { status: 500 });
  }
}
