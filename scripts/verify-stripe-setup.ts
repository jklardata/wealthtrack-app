/**
 * Stripe Setup Verification Script
 * Run this to verify your Stripe configuration before going live
 *
 * Usage: npx tsx scripts/verify-stripe-setup.ts
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

const results: CheckResult[] = [];

function addResult(result: CheckResult) {
  results.push(result);
  const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${result.name}: ${result.message}`);
  if (result.details) {
    console.log(`   ${result.details}`);
  }
}

async function main() {
  console.log('🔍 Verifying Stripe Setup...\n');

  // 1. Check environment variables exist
  console.log('📋 Step 1: Environment Variables\n');

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const priceProMonthly = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const priceProYearly = process.env.STRIPE_PRICE_PRO_YEARLY;

  if (!stripeSecretKey) {
    addResult({
      name: 'STRIPE_SECRET_KEY',
      status: 'fail',
      message: 'Missing',
      details: 'Set this in .env.local (sk_test_... or sk_live_...)'
    });
  } else {
    const isLive = stripeSecretKey.startsWith('sk_live_');
    const isTest = stripeSecretKey.startsWith('sk_test_');

    if (isLive) {
      addResult({
        name: 'STRIPE_SECRET_KEY',
        status: 'pass',
        message: '✓ Production key detected',
        details: `Prefix: ${stripeSecretKey.slice(0, 12)}...`
      });
    } else if (isTest) {
      addResult({
        name: 'STRIPE_SECRET_KEY',
        status: 'warning',
        message: 'Test mode key',
        details: 'Using test mode - switch to sk_live_ for production'
      });
    } else {
      addResult({
        name: 'STRIPE_SECRET_KEY',
        status: 'fail',
        message: 'Invalid format',
        details: 'Should start with sk_test_ or sk_live_'
      });
    }
  }

  if (!stripePublishableKey) {
    addResult({
      name: 'STRIPE_PUBLISHABLE_KEY',
      status: 'warning',
      message: 'Not set (optional for server-only)',
      details: 'Only needed if using Stripe.js on client-side'
    });
  } else {
    const isLive = stripePublishableKey.startsWith('pk_live_');
    addResult({
      name: 'STRIPE_PUBLISHABLE_KEY',
      status: isLive ? 'pass' : 'warning',
      message: isLive ? '✓ Production key' : 'Test mode key',
      details: `Prefix: ${stripePublishableKey.slice(0, 12)}...`
    });
  }

  if (!stripeWebhookSecret) {
    addResult({
      name: 'STRIPE_WEBHOOK_SECRET',
      status: 'fail',
      message: 'Missing',
      details: 'Set this from Stripe Dashboard > Developers > Webhooks'
    });
  } else {
    addResult({
      name: 'STRIPE_WEBHOOK_SECRET',
      status: 'pass',
      message: '✓ Configured',
      details: `Prefix: ${stripeWebhookSecret.slice(0, 12)}...`
    });
  }

  if (!priceProMonthly) {
    addResult({
      name: 'STRIPE_PRICE_PRO_MONTHLY',
      status: 'fail',
      message: 'Missing',
      details: 'Create a product in Stripe Dashboard and copy the price ID'
    });
  } else {
    addResult({
      name: 'STRIPE_PRICE_PRO_MONTHLY',
      status: 'pass',
      message: '✓ Configured',
      details: priceProMonthly
    });
  }

  if (!priceProYearly) {
    addResult({
      name: 'STRIPE_PRICE_PRO_YEARLY',
      status: 'fail',
      message: 'Missing',
      details: 'Create a product in Stripe Dashboard and copy the price ID'
    });
  } else {
    addResult({
      name: 'STRIPE_PRICE_PRO_YEARLY',
      status: 'pass',
      message: '✓ Configured',
      details: priceProYearly
    });
  }

  // 2. Test Stripe API connection
  console.log('\n🔌 Step 2: Stripe API Connection\n');

  if (stripeSecretKey && (stripeSecretKey.startsWith('sk_test_') || stripeSecretKey.startsWith('sk_live_'))) {
    try {
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2026-01-28.clover',
      });

      const account = await stripe.accounts.retrieve();
      addResult({
        name: 'Stripe API Connection',
        status: 'pass',
        message: `✓ Connected to Stripe account`,
        details: `Account ID: ${account.id} | Email: ${account.email || 'N/A'}`
      });

      // Check if account is active
      if (account.charges_enabled && account.payouts_enabled) {
        addResult({
          name: 'Account Status',
          status: 'pass',
          message: '✓ Account is fully activated',
          details: 'Can accept payments and receive payouts'
        });
      } else {
        addResult({
          name: 'Account Status',
          status: 'warning',
          message: 'Account activation incomplete',
          details: 'Complete activation in Stripe Dashboard to accept payments'
        });
      }

    } catch (error) {
      addResult({
        name: 'Stripe API Connection',
        status: 'fail',
        message: 'Failed to connect',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    addResult({
      name: 'Stripe API Connection',
      status: 'fail',
      message: 'Skipped - invalid API key'
    });
  }

  // 3. Verify Price IDs exist
  console.log('\n💰 Step 3: Price IDs Verification\n');

  if (stripeSecretKey && priceProMonthly) {
    try {
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2026-01-28.clover',
      });

      const monthlyPrice = await stripe.prices.retrieve(priceProMonthly);
      addResult({
        name: 'Pro Monthly Price',
        status: 'pass',
        message: `✓ Found: ${monthlyPrice.unit_amount! / 100} ${monthlyPrice.currency.toUpperCase()}/${monthlyPrice.recurring?.interval}`,
        details: `Product: ${monthlyPrice.product}`
      });

      if (priceProYearly) {
        const yearlyPrice = await stripe.prices.retrieve(priceProYearly);
        addResult({
          name: 'Pro Yearly Price',
          status: 'pass',
          message: `✓ Found: ${yearlyPrice.unit_amount! / 100} ${yearlyPrice.currency.toUpperCase()}/${yearlyPrice.recurring?.interval}`,
          details: `Product: ${yearlyPrice.product}`
        });
      }

    } catch (error) {
      addResult({
        name: 'Price IDs',
        status: 'fail',
        message: 'Failed to retrieve prices',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 4. Check Supabase connection
  console.log('\n🗄️  Step 4: Supabase Database\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    addResult({
      name: 'Supabase Configuration',
      status: 'fail',
      message: 'Missing Supabase credentials',
      details: 'Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    });
  } else {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from('subscriptions').select('*').limit(1);

      if (error) throw error;

      addResult({
        name: 'Supabase Connection',
        status: 'pass',
        message: '✓ Connected to database',
        details: 'subscriptions table accessible'
      });
    } catch (error) {
      addResult({
        name: 'Supabase Connection',
        status: 'fail',
        message: 'Failed to connect',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 5. Check Clerk configuration
  console.log('\n🔐 Step 5: Clerk Authentication\n');

  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!clerkPublishableKey || !clerkSecretKey) {
    addResult({
      name: 'Clerk Configuration',
      status: 'fail',
      message: 'Missing Clerk credentials'
    });
  } else {
    const isClerkLive = clerkPublishableKey.startsWith('pk_live_');
    addResult({
      name: 'Clerk Mode',
      status: isClerkLive ? 'pass' : 'warning',
      message: isClerkLive ? '✓ Production mode' : 'Test mode',
      details: isClerkLive ? 'Ready for production' : 'Switch to pk_live_ for production'
    });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary\n');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warning').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`Total: ${results.length} checks`);

  if (failed > 0) {
    console.log('\n❌ Setup incomplete. Fix the failed checks above.');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  Setup complete with warnings. Review warnings before production.');
    process.exit(0);
  } else {
    console.log('\n✅ All checks passed! Ready for production.');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
