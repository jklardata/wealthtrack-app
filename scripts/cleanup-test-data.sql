-- ============================================================================
-- Cleanup Test Mode Stripe Data
-- ============================================================================
-- Run this in Supabase SQL Editor when switching from test to production
-- This removes all test mode Stripe customers/subscriptions from your database
--
-- ⚠️  IMPORTANT: Only run this after:
--    1. You've switched to production Stripe keys
--    2. You've verified production webhooks are working
--    3. You've backed up any important test data
--
-- ============================================================================

-- Preview what will be deleted (run this first!)
SELECT
  user_id,
  stripe_customer_id,
  entitlement_tier,
  status,
  created_at
FROM subscriptions
WHERE
  stripe_customer_id LIKE 'cus_test_%'
  OR stripe_customer_id IS NULL;

-- UNCOMMENT BELOW TO DELETE TEST DATA
-- ============================================================================

-- -- 1. Delete test mode subscriptions
-- DELETE FROM subscriptions
-- WHERE stripe_customer_id LIKE 'cus_test_%';

-- -- 2. Reset subscriptions with no customer ID to free tier
-- UPDATE subscriptions
-- SET
--   entitlement_tier = 'free',
--   status = NULL,
--   stripe_subscription_id = NULL,
--   current_period_end = NULL
-- WHERE stripe_customer_id IS NULL;

-- -- 3. Verify cleanup
-- SELECT
--   COUNT(*) as total_subscriptions,
--   COUNT(CASE WHEN stripe_customer_id LIKE 'cus_live_%' THEN 1 END) as production_customers,
--   COUNT(CASE WHEN stripe_customer_id LIKE 'cus_test_%' THEN 1 END) as test_customers,
--   COUNT(CASE WHEN stripe_customer_id IS NULL THEN 1 END) as no_customer_id
-- FROM subscriptions;

-- ============================================================================
-- Notes:
-- - Test customer IDs start with: cus_test_
-- - Production customer IDs start with: cus_live_
-- - This script is safe to run multiple times
-- ============================================================================
