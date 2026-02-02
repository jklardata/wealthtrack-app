import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getTierFromMetadata, getTierFromPriceId } from '@/lib/stripe-config';
import type Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode !== 'subscription' || !session.subscription || !session.customer) {
          break;
        }

        const subscriptionId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription.id;

        const customerId = typeof session.customer === 'string'
          ? session.customer
          : session.customer.id;

        // Fetch the subscription to get the price/product details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;

        // Try to get tier from price ID first, fallback to product metadata
        let tier = getTierFromPriceId(priceId);

        // If not found in price config, try product metadata
        if (tier === 'free') {
          const product = await stripe.products.retrieve(
            subscription.items.data[0]?.price.product as string
          );
          tier = getTierFromMetadata(product.metadata);
        }

        console.log('Webhook: Processing checkout.session.completed', {
          subscriptionId,
          priceId,
          tier,
          customerId
        });

        // Update subscription in database
        // Get current_period_end from the first subscription item
        const periodEndTimestamp = subscription.items.data[0]?.current_period_end;
        const periodEnd = periodEndTimestamp
          ? new Date(periodEndTimestamp * 1000).toISOString()
          : null;
        const { error } = await supabase
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscriptionId,
            entitlement_tier: tier,
            status: subscription.status,
            current_period_end: periodEnd,
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription:', error);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        console.log(`Subscription activated: ${subscriptionId}, tier: ${tier}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id;

        // Reset to free tier
        const { error } = await supabase
          .from('subscriptions')
          .update({
            entitlement_tier: 'free',
            status: 'canceled',
            stripe_subscription_id: null,
            current_period_end: null,
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error resetting subscription:', error);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        console.log(`Subscription canceled for customer: ${customerId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id;

        // Try to get tier from price ID first, fallback to product metadata
        const priceId = subscription.items.data[0]?.price.id;
        let tier = getTierFromPriceId(priceId);

        // If not found in price config, try product metadata
        if (tier === 'free') {
          const product = await stripe.products.retrieve(
            subscription.items.data[0]?.price.product as string
          );
          tier = getTierFromMetadata(product.metadata);
        }

        console.log('Webhook: Processing customer.subscription.updated', {
          subscriptionId: subscription.id,
          priceId,
          tier,
          customerId,
          status: subscription.status
        });

        // Get current_period_end from the first subscription item
        const periodEndUpdatedTimestamp = subscription.items.data[0]?.current_period_end;
        const periodEndUpdated = periodEndUpdatedTimestamp
          ? new Date(periodEndUpdatedTimestamp * 1000).toISOString()
          : null;
        const { error } = await supabase
          .from('subscriptions')
          .update({
            entitlement_tier: tier,
            status: subscription.status,
            current_period_end: periodEndUpdated,
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription:', error);
        }

        console.log(`Subscription updated for customer: ${customerId}, tier: ${tier}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
