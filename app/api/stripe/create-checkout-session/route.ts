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

    const { priceId, trialDays, isLifetime } = await request.json();
    if (!priceId) {
      console.error('Missing priceId in request');
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    console.log('Creating checkout session with priceId:', priceId);

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
      console.log('Creating new Stripe customer for user:', userId);
      const customer = await stripe.customers.create({
        email,
        metadata: {
          clerk_user_id: userId,
        },
      });
      stripeCustomerId = customer.id;
      console.log('Created Stripe customer:', stripeCustomerId);

      // Create or update subscription record with customer ID
      if (subscription) {
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating subscription record:', updateError);
          throw new Error('Failed to update subscription record');
        }
      } else {
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            entitlement_tier: 'free',
          });

        if (insertError) {
          console.error('Error creating subscription record:', insertError);
          throw new Error('Failed to create subscription record');
        }
      }
    }

    // Create Checkout Session
    // Get the base URL from the request or environment variable
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const requestUrl = host ? `${protocol}://${host}` : null;

    // Prefer request URL over environment variable to avoid stale deployment URLs
    const appUrl = requestUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const tier = getTierFromPriceId(priceId);

    console.log('Checkout session details:', {
      host,
      requestUrl,
      envUrl: process.env.NEXT_PUBLIC_APP_URL,
      finalAppUrl: appUrl,
      successUrl: `${appUrl}/upgrade?success=true&tier=${tier}`,
      cancelUrl: `${appUrl}/upgrade?canceled=true`
    });

    const createSession = async (customerId: string) => {
      if (isLifetime) {
        return stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'payment',
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${appUrl}/dashboard?success=true&tier=${tier}`,
          cancel_url: `${appUrl}/upgrade?canceled=true`,
          payment_intent_data: {
            metadata: { clerk_user_id: userId },
          },
        });
      }
      return stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/dashboard?success=true&tier=${tier}`,
        cancel_url: `${appUrl}/upgrade?canceled=true`,
        subscription_data: {
          metadata: { clerk_user_id: userId },
          ...(trialDays && { trial_period_days: trialDays }),
        },
      });
    };

    let session;
    try {
      console.log('Creating Stripe checkout session for customer:', stripeCustomerId);
      session = await createSession(stripeCustomerId);
    } catch (stripeError: any) {
      // Stale test-mode customer ID — create a fresh live customer and retry
      if (stripeError?.code === 'resource_missing' && stripeError?.param === 'customer') {
        console.log('Stale customer ID detected, creating new live customer for user:', userId);
        const newCustomer = await stripe.customers.create({
          email,
          metadata: { clerk_user_id: userId },
        });
        stripeCustomerId = newCustomer.id;

        await supabase
          .from('subscriptions')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('user_id', userId);

        session = await createSession(stripeCustomerId);
      } else {
        throw stripeError;
      }
    }

    console.log('Checkout session created:', session.id);
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
