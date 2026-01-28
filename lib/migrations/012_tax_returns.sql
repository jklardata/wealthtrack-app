-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Tax return filing status enum
CREATE TYPE filing_status AS ENUM (
  'single',
  'married_filing_jointly',
  'married_filing_separately',
  'head_of_household',
  'qualifying_widow'
);

-- Main tax returns table
CREATE TABLE tax_returns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  tax_year INTEGER NOT NULL,
  filing_status filing_status NOT NULL,

  -- Income fields
  wages DECIMAL(12,2) DEFAULT 0,
  interest_income DECIMAL(12,2) DEFAULT 0,
  dividend_income DECIMAL(12,2) DEFAULT 0,
  qualified_dividends DECIMAL(12,2) DEFAULT 0,
  capital_gains DECIMAL(12,2) DEFAULT 0,
  ira_distributions DECIMAL(12,2) DEFAULT 0,
  pension_income DECIMAL(12,2) DEFAULT 0,
  social_security DECIMAL(12,2) DEFAULT 0,
  business_income DECIMAL(12,2) DEFAULT 0,
  other_income DECIMAL(12,2) DEFAULT 0,
  total_income DECIMAL(12,2) DEFAULT 0,
  agi DECIMAL(12,2) DEFAULT 0,

  -- Deductions
  adjustments DECIMAL(12,2) DEFAULT 0,
  deduction_type TEXT CHECK (deduction_type IN ('standard', 'itemized')) DEFAULT 'standard',
  deduction_amount DECIMAL(12,2) DEFAULT 0,
  qbi_deduction DECIMAL(12,2) DEFAULT 0,
  taxable_income DECIMAL(12,2) DEFAULT 0,

  -- Tax & Payments
  total_tax DECIMAL(12,2) DEFAULT 0,
  federal_withheld DECIMAL(12,2) DEFAULT 0,
  estimated_payments DECIMAL(12,2) DEFAULT 0,
  refund_amount DECIMAL(12,2) DEFAULT 0,
  amount_owed DECIMAL(12,2) DEFAULT 0,
  effective_tax_rate DECIMAL(5,4) DEFAULT 0,

  -- Self-employment (for consultants)
  se_income DECIMAL(12,2) DEFAULT 0,
  se_tax DECIMAL(12,2) DEFAULT 0,
  se_deduction DECIMAL(12,2) DEFAULT 0,

  -- Metadata
  source TEXT DEFAULT 'manual', -- 'manual', 'turbotax_pdf', 'csv_upload'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, tax_year)
);

-- Indexes
CREATE INDEX idx_tax_returns_user_id ON tax_returns(user_id);
CREATE INDEX idx_tax_returns_year ON tax_returns(tax_year);

-- RLS Policy
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tax returns"
  ON tax_returns FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Updated at trigger
CREATE TRIGGER update_tax_returns_updated_at
  BEFORE UPDATE ON tax_returns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
