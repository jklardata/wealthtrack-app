/**
 * Interactive Production Checklist
 * Step-by-step guide through the production upgrade process
 *
 * Usage: npx tsx scripts/production-checklist.ts
 */

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

interface ChecklistItem {
  step: number;
  title: string;
  description: string;
  check: () => boolean | 'warning';
  successMessage: string;
  failureMessage: string;
  actionRequired: string;
}

const checklist: ChecklistItem[] = [
  {
    step: 1,
    title: 'Stripe Account Activated',
    description: 'Your Stripe account must be fully activated to accept live payments',
    check: () => {
      const key = process.env.STRIPE_SECRET_KEY;
      return key ? key.startsWith('sk_live_') : false;
    },
    successMessage: 'Using production Stripe key (sk_live_)',
    failureMessage: 'Still using test mode (sk_test_) or key not set',
    actionRequired: 'Go to Stripe Dashboard and complete account activation, then get your live API keys'
  },
  {
    step: 2,
    title: 'Production Products Created',
    description: 'Create products and prices in Stripe production mode',
    check: () => {
      const monthly = process.env.STRIPE_PRICE_PRO_MONTHLY;
      const yearly = process.env.STRIPE_PRICE_PRO_YEARLY;
      return !!(monthly && yearly && monthly.startsWith('price_') && yearly.startsWith('price_'));
    },
    successMessage: 'Price IDs configured',
    failureMessage: 'Price IDs not configured',
    actionRequired: 'In Stripe Dashboard (production mode): Products → Add Product → Create monthly and yearly prices'
  },
  {
    step: 3,
    title: 'Webhook Endpoint Created',
    description: 'Configure webhook endpoint for production',
    check: () => {
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      return !!(secret && secret.startsWith('whsec_'));
    },
    successMessage: 'Webhook secret configured',
    failureMessage: 'Webhook secret not set',
    actionRequired: 'In Stripe Dashboard: Developers → Webhooks → Add endpoint → https://app.solofi.io/api/stripe/webhooks'
  },
  {
    step: 4,
    title: 'Environment Variables Updated',
    description: 'All required environment variables must be set',
    check: () => {
      const required = [
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'STRIPE_PRICE_PRO_MONTHLY',
        'STRIPE_PRICE_PRO_YEARLY',
      ];
      return required.every(key => !!process.env[key]);
    },
    successMessage: 'All required variables set in .env.local',
    failureMessage: 'Some environment variables missing',
    actionRequired: 'Update .env.local with all Stripe production keys and price IDs'
  },
  {
    step: 5,
    title: 'Vercel Environment Variables',
    description: 'Production environment variables must be set in Vercel',
    check: () => {
      // Can't check Vercel directly, so this is a manual step
      return 'warning';
    },
    successMessage: 'N/A - Manual verification needed',
    failureMessage: 'Manual step - verify in Vercel dashboard',
    actionRequired: 'Go to Vercel → Your Project → Settings → Environment Variables → Add production keys'
  },
  {
    step: 6,
    title: 'Clerk Production Mode',
    description: 'Clerk authentication must use production keys',
    check: () => {
      const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      return publishable ? publishable.startsWith('pk_live_') : false;
    },
    successMessage: 'Using Clerk production keys',
    failureMessage: 'Still using Clerk test keys',
    actionRequired: 'In Clerk Dashboard: API Keys → Copy production keys → Update .env.local and Vercel'
  },
  {
    step: 7,
    title: 'Test Payment Completed',
    description: 'Verify end-to-end payment flow works',
    check: () => {
      // Can't auto-check, manual verification needed
      return 'warning';
    },
    successMessage: 'N/A - Manual test required',
    failureMessage: 'Test payment not completed',
    actionRequired: 'Go to app.solofi.io/upgrade → Complete checkout with real card → Verify Pro access'
  },
  {
    step: 8,
    title: 'Webhooks Delivering',
    description: 'Verify webhooks are being received successfully',
    check: () => {
      return 'warning';
    },
    successMessage: 'N/A - Check Stripe Dashboard',
    failureMessage: 'Verify webhook delivery',
    actionRequired: 'Stripe Dashboard → Developers → Webhooks → Check "Recent deliveries" shows successful events'
  },
  {
    step: 9,
    title: 'Test Data Cleaned',
    description: 'Remove test mode subscriptions from database',
    check: () => {
      return 'warning';
    },
    successMessage: 'N/A - Manual cleanup',
    failureMessage: 'Test data cleanup pending',
    actionRequired: 'Run: scripts/cleanup-test-data.sql in Supabase SQL Editor (preview first!)'
  },
  {
    step: 10,
    title: 'Monitoring Setup',
    description: 'Set up monitoring for failed payments and webhooks',
    check: () => {
      return 'warning';
    },
    successMessage: 'N/A - Manual setup',
    failureMessage: 'Monitoring not configured',
    actionRequired: 'Stripe Dashboard → Settings → Email notifications → Enable alerts for failed payments'
  },
];

function main() {
  console.log('🚀 Production Upgrade Checklist\n');
  console.log('='.repeat(80));
  console.log('\n');

  let completed = 0;
  let warnings = 0;
  let failed = 0;

  checklist.forEach((item) => {
    const result = item.check();
    const icon =
      result === true ? '✅' :
      result === 'warning' ? '⚠️' :
      '❌';

    console.log(`${icon} Step ${item.step}: ${item.title}`);
    console.log(`   ${item.description}`);

    if (result === true) {
      console.log(`   ✓ ${item.successMessage}`);
      completed++;
    } else if (result === 'warning') {
      console.log(`   ℹ️  ${item.failureMessage}`);
      console.log(`   → ${item.actionRequired}`);
      warnings++;
    } else {
      console.log(`   ✗ ${item.failureMessage}`);
      console.log(`   → ${item.actionRequired}`);
      failed++;
    }

    console.log('');
  });

  console.log('='.repeat(80));
  console.log('\n📊 Progress Summary\n');

  const total = checklist.length;
  const progress = Math.round((completed / total) * 100);

  console.log(`Completed: ${completed}/${total} (${progress}%)`);
  console.log(`Warnings: ${warnings}`);
  console.log(`Failed: ${failed}`);

  console.log('\n');

  if (completed === total) {
    console.log('🎉 All automated checks passed! Complete manual steps above.\n');
  } else if (failed > 0) {
    console.log('⚠️  Some steps require action. Follow the instructions above.\n');
    console.log('💡 Quick commands to help:\n');
    console.log('   Check configuration: npx tsx scripts/compare-test-prod-keys.ts');
    console.log('   Verify setup: npx tsx scripts/verify-stripe-setup.ts');
    console.log('   Test webhook: npx tsx scripts/test-webhook-locally.ts\n');
  } else {
    console.log('✓ Automated checks look good! Complete the manual verification steps.\n');
  }

  console.log('📖 For detailed help: cat scripts/STRIPE_SCRIPTS_README.md\n');
}

main();
