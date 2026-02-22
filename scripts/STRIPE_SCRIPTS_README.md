# Stripe Production Upgrade Scripts

Automation scripts to help you upgrade from Stripe test mode to production mode safely.

## Prerequisites

Install required dependencies:

```bash
npm install -D tsx
npm install stripe dotenv @supabase/supabase-js
```

---

## Scripts Overview

### 1. **verify-stripe-setup.ts** - Complete Setup Verification
**Purpose**: Comprehensive check of all Stripe configuration

**Checks:**
- ✅ All environment variables present
- ✅ Stripe API connectivity
- ✅ Account activation status
- ✅ Price IDs exist and are correct
- ✅ Supabase database connection
- ✅ Clerk authentication setup

**Usage:**
```bash
npx tsx scripts/verify-stripe-setup.ts
```

**When to run:**
- Before deploying to production
- After updating environment variables
- When troubleshooting payment issues

**Expected output:**
```
✅ Passed: 12
❌ Failed: 0
⚠️  Warnings: 1
```

---

### 2. **compare-test-prod-keys.ts** - Key Mode Checker
**Purpose**: Verify you're using the correct key mode (test vs production)

**Checks:**
- Stripe keys (secret, publishable, webhook)
- Clerk keys (publishable, secret)
- Detects mixed mode (critical error)

**Usage:**
```bash
npx tsx scripts/compare-test-prod-keys.ts
```

**When to run:**
- Before switching to production
- When unsure which mode you're in
- After updating .env.local

**Expected output:**
```
✅ PROD    STRIPE_SECRET_KEY             sk_live_...
✅ PROD    STRIPE_PUBLISHABLE_KEY        pk_live_...
⚠️  TEST   CLERK_SECRET_KEY              sk_test_...
```

---

### 3. **test-webhook-locally.ts** - Webhook Signature Test
**Purpose**: Verify your webhook secret is correctly configured

**Tests:**
- Webhook secret format
- Signature generation
- Signature verification

**Usage:**
```bash
npx tsx scripts/test-webhook-locally.ts
```

**When to run:**
- After setting up a new webhook endpoint
- When webhooks are failing in production
- Before going live

**Expected output:**
```
✅ Webhook signature verification PASSED!
✓ Your webhook secret is correctly configured.
```

---

### 4. **create-test-customer.ts** - Create Test Customer
**Purpose**: Create a test customer in Stripe for testing

**Creates:**
- A customer with test email
- Metadata for tracking
- Returns customer ID for testing

**Usage:**
```bash
npx tsx scripts/create-test-customer.ts
```

**When to run:**
- Testing production checkout flow
- Verifying webhook delivery
- Setting up test scenarios

**Expected output:**
```
✅ Test customer created successfully!
Customer ID: cus_XXXXXX
🔗 https://dashboard.stripe.com/customers/cus_XXXXXX
```

---

### 5. **cleanup-test-data.sql** - Database Cleanup
**Purpose**: Remove test mode data from Supabase database

**Operations:**
- Preview test data (run first!)
- Delete test mode subscriptions
- Reset subscriptions to free tier
- Verify cleanup results

**Usage:**
```bash
# 1. Copy the SQL file content
cat scripts/cleanup-test-data.sql

# 2. Go to Supabase SQL Editor
# 3. Paste and run the preview query first
# 4. Review the results
# 5. Uncomment the DELETE sections if safe
# 6. Run the deletion queries
```

**When to run:**
- After switching to production keys
- Before launching publicly
- When cleaning up old test data

⚠️ **WARNING**: This permanently deletes data. Preview first!

---

## Recommended Workflow

### Step-by-Step Production Upgrade

**1. Check current setup:**
```bash
npx tsx scripts/compare-test-prod-keys.ts
```
- Should show all TEST mode

**2. Update .env.local with production keys**
- Get keys from Stripe Dashboard
- Replace sk_test_ with sk_live_
- Replace pk_test_ with pk_live_

**3. Verify new configuration:**
```bash
npx tsx scripts/verify-stripe-setup.ts
```
- All checks should pass
- Should show PRODUCTION mode

**4. Test webhook signature:**
```bash
npx tsx scripts/test-webhook-locally.ts
```
- Verify webhook secret is correct

**5. Update Vercel environment variables**
- Copy production keys to Vercel
- Redeploy

**6. Create test customer:**
```bash
npx tsx scripts/create-test-customer.ts
```
- Use this to test production flow

**7. Test real payment**
- Use test customer ID
- Complete checkout with real card
- Verify webhook delivery

**8. Clean up test data:**
```bash
# Run preview query in Supabase first
# Then run delete queries if safe
```

---

## Troubleshooting

### Script says "STRIPE_SECRET_KEY not found"
**Solution:**
- Check `.env.local` exists in project root
- Verify variable name is exact: `STRIPE_SECRET_KEY`
- Try: `cat .env.local | grep STRIPE_SECRET_KEY`

### "Failed to connect to Stripe API"
**Solution:**
- Verify API key starts with `sk_test_` or `sk_live_`
- Check for extra spaces or newlines in .env.local
- Test key in Stripe Dashboard API request builder

### "Webhook signature verification failed"
**Solution:**
- Get webhook secret from: Dashboard > Developers > Webhooks > [endpoint] > Signing secret
- Must start with `whsec_`
- Each webhook endpoint has its own secret

### "Mixed mode" error
**Solution:**
- All Stripe keys must be in same mode (all test OR all production)
- Check: `npx tsx scripts/compare-test-prod-keys.ts`
- Update any mismatched keys

### Script shows warnings but passes
**Solution:**
- Warnings are informational (e.g., "test mode")
- Review each warning
- Decide if action needed

---

## Environment Variables Reference

### Required for Production:

```bash
# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (production)
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...

# Clerk Production Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Supabase (same for test/prod)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Safety Tips

1. **Always run verify-stripe-setup.ts before deploying**
2. **Never commit production keys to git**
3. **Keep test and production keys in separate .env files**
4. **Test webhooks locally before production**
5. **Backup database before cleanup-test-data.sql**
6. **Use compare-test-prod-keys.ts to avoid mixed mode**

---

## Getting Help

If scripts fail:

1. **Read the error message** - It usually tells you exactly what's wrong
2. **Check environment variables** - 90% of issues are typos or missing variables
3. **Verify Stripe Dashboard** - Ensure products/prices exist
4. **Check Stripe API logs** - Dashboard > Developers > Logs
5. **Review webhook deliveries** - Dashboard > Developers > Webhooks > [endpoint]

---

## Additional Resources

- [Stripe API Docs](https://docs.stripe.com/api)
- [Stripe Webhook Guide](https://docs.stripe.com/webhooks)
- [Stripe Testing](https://docs.stripe.com/testing)
- [Clerk Production Checklist](https://clerk.com/docs/deployments/production-checklist)
