-- Add promo code fields to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS promo_code_used TEXT,
ADD COLUMN IF NOT EXISTS promo_activated_at TIMESTAMP WITH TIME ZONE;

-- Create index on promo_code_used for analytics
CREATE INDEX IF NOT EXISTS idx_subscriptions_promo_code ON subscriptions(promo_code_used) WHERE promo_code_used IS NOT NULL;

-- Add comment
COMMENT ON COLUMN subscriptions.promo_code_used IS 'Promo code that was redeemed by the user';
COMMENT ON COLUMN subscriptions.promo_activated_at IS 'When the promo code was activated';
