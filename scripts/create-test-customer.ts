/**
 * Create a Test Customer in Stripe
 * Useful for testing your production setup with a real Stripe customer
 *
 * Usage: npx tsx scripts/create-test-customer.ts
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function createTestCustomer() {
  console.log('👤 Creating Test Customer in Stripe\n');

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY not found in .env.local');
    process.exit(1);
  }

  const isProduction = stripeSecretKey.startsWith('sk_live_');
  const mode = isProduction ? 'PRODUCTION' : 'TEST';

  console.log(`⚠️  Running in ${mode} mode`);

  if (isProduction) {
    console.log('\n⚠️  WARNING: You are about to create a customer in PRODUCTION mode.');
    console.log('   This will not charge anything, but the customer will be real.\n');
  }

  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
    });

    // Create a test customer
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      name: 'Test User',
      description: 'Test customer for WealthTrack',
      metadata: {
        environment: mode.toLowerCase(),
        created_by: 'create-test-customer-script',
        clerk_user_id: 'test_user_12345',
      },
    });

    console.log('✅ Test customer created successfully!\n');
    console.log('Customer Details:');
    console.log(`   ID: ${customer.id}`);
    console.log(`   Email: ${customer.email}`);
    console.log(`   Name: ${customer.name}`);
    console.log(`   Created: ${new Date(customer.created * 1000).toLocaleString()}\n`);

    console.log('🔗 View in Stripe Dashboard:');
    const dashboardUrl = isProduction
      ? `https://dashboard.stripe.com/customers/${customer.id}`
      : `https://dashboard.stripe.com/test/customers/${customer.id}`;
    console.log(`   ${dashboardUrl}\n`);

    console.log('💡 Next Steps:');
    console.log('   1. Use this customer ID to test checkout flow');
    console.log('   2. Create a subscription for this customer');
    console.log(`   3. Use a test card: 4242 4242 4242 4242 (any future date, any CVC)\n`);

  } catch (error) {
    console.error('❌ Failed to create customer\n');
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

createTestCustomer();
