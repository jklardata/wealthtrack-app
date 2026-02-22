/**
 * Test Webhook Signature Verification Locally
 * This simulates a Stripe webhook event to verify your webhook secret is correct
 *
 * Usage: npx tsx scripts/test-webhook-locally.ts
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testWebhookSignature() {
  console.log('🧪 Testing Webhook Signature Verification\n');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not found in .env.local');
    console.log('   Set this from: Stripe Dashboard > Developers > Webhooks > [Your endpoint] > Signing secret');
    process.exit(1);
  }

  if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY not found in .env.local');
    process.exit(1);
  }

  console.log(`✓ Webhook secret found: ${webhookSecret.slice(0, 12)}...`);
  console.log(`✓ Stripe key found: ${stripeSecretKey.slice(0, 12)}...\n`);

  // Create a test event payload
  const testEvent = {
    id: 'evt_test_webhook',
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        mode: 'subscription',
        customer: 'cus_test_123',
        subscription: 'sub_test_123',
      }
    }
  };

  const payload = JSON.stringify(testEvent);

  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
    });

    // Generate a test signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: webhookSecret,
    });

    console.log('📝 Test signature generated');
    console.log(`   Timestamp: ${timestamp}`);
    console.log(`   Signature: ${signature.slice(0, 50)}...\n`);

    // Verify the signature
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    console.log('✅ Webhook signature verification PASSED!\n');
    console.log('Event details:');
    console.log(`   Type: ${event.type}`);
    console.log(`   ID: ${event.id}`);
    console.log('\n✓ Your webhook secret is correctly configured.');
    console.log('✓ Webhook endpoint should work in production.\n');

  } catch (error) {
    console.error('❌ Webhook signature verification FAILED!\n');

    if (error instanceof Error) {
      console.error(`Error: ${error.message}\n`);

      if (error.message.includes('No signatures found')) {
        console.log('💡 Troubleshooting:');
        console.log('   1. Make sure STRIPE_WEBHOOK_SECRET is set correctly');
        console.log('   2. Secret should start with "whsec_"');
        console.log('   3. Copy from: Stripe Dashboard > Developers > Webhooks > Signing secret\n');
      }
    }

    process.exit(1);
  }
}

testWebhookSignature();
