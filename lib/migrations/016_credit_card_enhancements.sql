-- Add credit card family and rewards category columns
ALTER TABLE credit_cards
ADD COLUMN credit_card_family TEXT,
ADD COLUMN rewards_category TEXT;

-- Add indexes for filtering
CREATE INDEX idx_credit_cards_family ON credit_cards(credit_card_family);
CREATE INDEX idx_credit_cards_rewards ON credit_cards(rewards_category);

-- Add comments for clarity
COMMENT ON COLUMN credit_cards.credit_card_family IS 'Card issuer/bank family (e.g., Chase, Amex, Citi)';
COMMENT ON COLUMN credit_cards.rewards_category IS 'Primary rewards category (e.g., cash back, travel rewards, airline miles)';
