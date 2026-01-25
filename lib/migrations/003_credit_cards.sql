-- Credit Cards table for tracking SUB progress and card management
CREATE TABLE credit_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  last_four TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'closed')),
  signup_bonus TEXT,
  sub_requirement DECIMAL(10,2),
  current_spend DECIMAL(10,2) DEFAULT 0,
  sub_deadline DATE,
  got_bonus BOOLEAN DEFAULT FALSE,
  annual_fee DECIMAL(10,2) DEFAULT 0,
  signup_date DATE,
  annual_fee_date DATE,
  close_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user queries
CREATE INDEX idx_credit_cards_user_id ON credit_cards(user_id);

-- Enable RLS
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;

-- RLS policies (users can only access their own cards)
CREATE POLICY "Users can view own credit cards" ON credit_cards
  FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert own credit cards" ON credit_cards
  FOR INSERT WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update own credit cards" ON credit_cards
  FOR UPDATE USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can delete own credit cards" ON credit_cards
  FOR DELETE USING (user_id = current_setting('app.user_id', true));
