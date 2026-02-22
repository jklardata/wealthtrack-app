/**
 * Compare Test vs Production Keys
 * Helps you verify which mode you're currently in
 *
 * Usage: npx tsx scripts/compare-test-prod-keys.ts
 */

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

interface KeyCheck {
  name: string;
  value: string | undefined;
  mode: 'test' | 'production' | 'unknown' | 'not-set';
  prefix?: string;
}

function checkKey(name: string, value: string | undefined): KeyCheck {
  if (!value) {
    return { name, value, mode: 'not-set' };
  }

  // Stripe keys
  if (value.startsWith('sk_test_') || value.startsWith('pk_test_')) {
    return { name, value, mode: 'test', prefix: value.slice(0, 12) };
  }
  if (value.startsWith('sk_live_') || value.startsWith('pk_live_')) {
    return { name, value, mode: 'production', prefix: value.slice(0, 12) };
  }
  if (value.startsWith('whsec_')) {
    // Webhook secrets don't have test/live prefix, so we can't determine mode
    return { name, value, mode: 'unknown', prefix: value.slice(0, 12) };
  }

  // Clerk keys
  if (value.startsWith('pk_test_') || value.startsWith('sk_test_')) {
    return { name, value, mode: 'test', prefix: value.slice(0, 12) };
  }
  if (value.startsWith('pk_live_') || value.startsWith('sk_live_')) {
    return { name, value, mode: 'production', prefix: value.slice(0, 12) };
  }

  // Price IDs
  if (value.startsWith('price_')) {
    return { name, value, mode: 'unknown', prefix: value };
  }

  return { name, value, mode: 'unknown' };
}

function main() {
  console.log('🔍 Checking Environment Configuration\n');
  console.log('='.repeat(80));
  console.log('\n');

  const keys: KeyCheck[] = [
    checkKey('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY),
    checkKey('STRIPE_PUBLISHABLE_KEY', process.env.STRIPE_PUBLISHABLE_KEY),
    checkKey('STRIPE_WEBHOOK_SECRET', process.env.STRIPE_WEBHOOK_SECRET),
    checkKey('STRIPE_PRICE_PRO_MONTHLY', process.env.STRIPE_PRICE_PRO_MONTHLY),
    checkKey('STRIPE_PRICE_PRO_YEARLY', process.env.STRIPE_PRICE_PRO_YEARLY),
    checkKey('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
    checkKey('CLERK_SECRET_KEY', process.env.CLERK_SECRET_KEY),
  ];

  // Group by service
  console.log('🔐 Stripe Configuration:\n');
  keys.filter(k => k.name.includes('STRIPE')).forEach(key => {
    const modeIcon =
      key.mode === 'production' ? '✅ PROD' :
      key.mode === 'test' ? '⚠️  TEST' :
      key.mode === 'not-set' ? '❌ NOT SET' :
      '❓ UNKNOWN';

    const displayValue = key.prefix || 'Not configured';

    console.log(`   ${modeIcon.padEnd(10)} ${key.name.padEnd(35)} ${displayValue}`);
  });

  console.log('\n🔐 Clerk Configuration:\n');
  keys.filter(k => k.name.includes('CLERK')).forEach(key => {
    const modeIcon =
      key.mode === 'production' ? '✅ PROD' :
      key.mode === 'test' ? '⚠️  TEST' :
      key.mode === 'not-set' ? '❌ NOT SET' :
      '❓ UNKNOWN';

    const displayValue = key.prefix || 'Not configured';

    console.log(`   ${modeIcon.padEnd(10)} ${key.name.padEnd(35)} ${displayValue}`);
  });

  console.log('\n' + '='.repeat(80));

  // Analysis
  const stripeKeys = keys.filter(k => k.name.includes('STRIPE') && !k.name.includes('PRICE'));
  const stripeInProduction = stripeKeys.some(k => k.mode === 'production');
  const stripeInTest = stripeKeys.some(k => k.mode === 'test');
  const stripeMixed = stripeInProduction && stripeInTest;

  const clerkKeys = keys.filter(k => k.name.includes('CLERK'));
  const clerkInProduction = clerkKeys.some(k => k.mode === 'production');
  const clerkInTest = clerkKeys.some(k => k.mode === 'test');
  const clerkMixed = clerkInProduction && clerkInTest;

  console.log('\n📊 Analysis:\n');

  // Stripe analysis
  if (stripeMixed) {
    console.log('❌ CRITICAL: Stripe keys are MIXED (test + production)!');
    console.log('   All Stripe keys must be in the same mode.');
  } else if (stripeInProduction) {
    console.log('✅ Stripe is in PRODUCTION mode');
  } else if (stripeInTest) {
    console.log('⚠️  Stripe is in TEST mode');
    console.log('   Switch to sk_live_ keys for production');
  } else {
    console.log('❌ Stripe configuration incomplete');
  }

  // Clerk analysis
  if (clerkMixed) {
    console.log('❌ CRITICAL: Clerk keys are MIXED (test + production)!');
    console.log('   All Clerk keys must be in the same mode.');
  } else if (clerkInProduction) {
    console.log('✅ Clerk is in PRODUCTION mode');
  } else if (clerkInTest) {
    console.log('⚠️  Clerk is in TEST mode');
    console.log('   Switch to pk_live_ keys for production');
  } else {
    console.log('❌ Clerk configuration incomplete');
  }

  // Overall recommendation
  console.log('\n💡 Recommendation:\n');

  if (stripeMixed || clerkMixed) {
    console.log('   🚨 URGENT: Fix mixed keys immediately!');
    console.log('   Your app will not work correctly with mixed test/production keys.');
  } else if (stripeInProduction && clerkInProduction) {
    console.log('   ✅ You are FULLY CONFIGURED for production!');
    console.log('   Ready to accept real payments.');
  } else if (stripeInTest && clerkInTest) {
    console.log('   ✅ You are in TEST mode (safe for development)');
    console.log('   Switch to production keys when ready to go live.');
  } else {
    console.log('   ⚠️  Configuration is incomplete or inconsistent');
    console.log('   Review the keys above and ensure all are properly set.');
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

main();
