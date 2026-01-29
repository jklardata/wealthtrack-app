import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getTierFromPriceId } from '@/lib/stripe-config';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const { priceId } = await request.json();
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const email = user.emailAddresses[0].emailAddress;

    // Get or create subscription record
    let { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    let stripeCustomerId = subscription?.stripe_customer_id;

    const stripe = getStripe();

    // Create Stripe customer if none exists
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: {
          clerk_user_id: userId,
        },
      });
      stripeCustomerId = customer.id;

      // Create or update subscription record with customer ID
      if (subscription) {
        await supabase
          .from('subscriptions')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            entitlement_tier: 'free',
          });
      }
    }

    // Create Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const tier = getTierFromPriceId(priceId);
    console.log('Creating checkout session with appUrl:', appUrl);

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/settings?success=true&tier=${tier}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          clerk_user_id: userId,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create checkout session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
