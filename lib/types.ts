export interface User {
  id: string;
  clerk_id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_tier: 'starter' | 'pro' | 'complete';
  amount_cents: number;
  currency: string;
  gumroad_sale_id: string | null;
  purchased_at: string;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  currency: string;
  date_format: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  source: string;
  subscribed_at: string;
}

export interface NetWorthEntry {
  id: string;
  user_id: string;
  date: string;
  stocks: number;
  bonds: number;
  cash: number;
  real_estate: number;
  points_value: number;
  commodities: number;
  other_assets: number;
  total_assets: number;
  total_debts: number;
  net_worth: number;
  pre_tax_income: number;
  monthly_expenses: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NetWorthFormData {
  date: string;
  stocks: number;
  bonds: number;
  cash: number;
  real_estate: number;
  points_value: number;
  commodities: number;
  other_assets: number;
  total_debts: number;
  pre_tax_income: number;
  monthly_expenses: number;
  notes?: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  google_sheet_id: string | null;
  credit_cards_sheet_id: string | null;
  consulting_income_sheet_id: string | null;
  last_sync_at: string | null;
  credit_cards_last_sync_at: string | null;
  consulting_income_last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SheetRow {
  date: string;
  stocks: number;
  bonds: number;
  cash: number;
  real_estate: number;
  points_value: number;
  commodities: number;
  other_assets: number;
  total_debts: number;
  notes?: string;
  pre_tax_income: number;
  monthly_expenses: number;
}

// Consulting Income Sheet Row - for semi-retirement planning
export interface ConsultingIncomeSheetRow {
  year: number;                    // Year of consulting income (e.g., 2025)
  gross_income: number;            // Annual gross consulting income
  effective_tax_rate: number;      // Tax rate as decimal (e.g., 0.20 for 20%)
  client_name?: string;            // Optional client/project name
  income_type: ConsultingIncomeType; // Type of income
  notes?: string;                  // Optional notes
}

export type ConsultingIncomeType = 'consulting' | 'freelance' | 'part-time' | 'contract' | 'other';

// Database entry for consulting income
export interface ConsultingIncomeEntry {
  id: string;
  user_id: string;
  year: number;
  gross_income: number;
  effective_tax_rate: number;
  client_name: string | null;
  income_type: ConsultingIncomeType;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Calculated metrics for net worth entries (computed in UI, not stored)
export interface NetWorthMetrics {
  monthlyNetProfit: number;        // pre_tax_income - monthly_expenses
  monthlySavingsRate: number;      // (monthlyNetProfit / pre_tax_income) * 100
  netWorthGrowth: number;          // $ change from previous entry
  netWorthGrowthPercent: number;   // % change from previous entry
  rolling1YearGrowth: number;      // $ change from ~1 year ago
  rolling1YearGrowthPercent: number; // % change from ~1 year ago
}

export interface CreditCardSheetRow {
  card_name: string;
  last_four: string;
  status: CreditCardStatus;
  signup_bonus: string;
  sub_requirement: number;
  current_spend: number;
  sub_deadline: string;
  got_bonus: boolean;
  annual_fee: number;
  signup_date: string;
  annual_fee_date: string;
  close_date: string;
  notes: string;
}

export type CreditCardStatus = 'active' | 'pending' | 'closed';

export interface CreditCard {
  id: string;
  user_id: string;
  card_name: string;
  last_four: string | null;
  status: CreditCardStatus;
  signup_bonus: string | null;
  sub_requirement: number | null;
  current_spend: number;
  sub_deadline: string | null;
  got_bonus: boolean;
  annual_fee: number;
  signup_date: string | null;
  annual_fee_date: string | null;
  close_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditCardFormData {
  card_name: string;
  last_four?: string;
  status: CreditCardStatus;
  signup_bonus?: string;
  sub_requirement?: number;
  current_spend?: number;
  sub_deadline?: string;
  got_bonus?: boolean;
  annual_fee?: number;
  signup_date?: string;
  annual_fee_date?: string;
  close_date?: string;
  notes?: string;
}

// Portfolio Optimization Types
export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';

export interface Allocation {
  stocks: number;
  bonds: number;
  cash: number;
  real_estate: number;
  commodities: number;
  other: number;
}

export interface RebalancingTrade {
  action: 'buy' | 'sell';
  category: keyof Allocation;
  amount: number;
  percentage: number;
}

export interface PortfolioOptimization {
  id: string;
  user_id: string;
  run_date: string;
  risk_tolerance: RiskTolerance;
  time_horizon: number;
  current_allocation: Allocation;
  recommended_allocation: Allocation;
  expected_return: number;
  expected_volatility: number;
  sharpe_ratio: number;
  rebalancing_trades: RebalancingTrade[];
  applied: boolean;
  applied_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface RiskQuestionnaireAnswer {
  questionId: number;
  answer: number; // 1-5 scale
}

export interface RiskAssessmentResult {
  score: number; // 0-100
  tolerance: RiskTolerance;
  timeHorizon: number;
}

export interface OptimizationRequest {
  risk_tolerance: RiskTolerance;
  time_horizon: number;
  constraints?: {
    min_stocks?: number;
    max_stocks?: number;
    min_bonds?: number;
    max_bonds?: number;
    min_cash?: number;
    max_cash?: number;
  };
}

export interface MarketValuation {
  cape: number;           // Shiller CAPE ratio
  historicalAvg: number;  // Historical average CAPE
  valuation: 'cheap' | 'fair' | 'expensive' | 'very_expensive';
  fetchedAt: string;
}

export interface FactorTilt {
  name: string;
  ticker: string;
  allocation: number;      // Percentage of stock allocation
  dollarAmount: number;
  reason: string;
  status: 'recommended' | 'reduced' | 'neutral';
}

export interface StockBreakdown {
  coreHoldings: {
    usTotalMarket: { allocation: number; amount: number };
    intlTotalMarket: { allocation: number; amount: number };
  };
  factorTilts: FactorTilt[];
  corePercentage: number;    // % of stocks in core
  tiltPercentage: number;    // % of stocks in tilts
}

export interface AllocationAdjustment {
  stocks: number;
  bonds: number;
  cash: number;
  reason: string;
}

export interface OptimizationResult {
  current_allocation: Allocation;
  recommended_allocation: Allocation;
  base_allocation: Allocation;
  market_adjustment: AllocationAdjustment | null;
  expected_return: number;
  expected_volatility: number;
  sharpe_ratio: number;
  rebalancing_trades: RebalancingTrade[];
  total_portfolio_value: number;
  market_valuation?: MarketValuation;
  rationale?: string;
  stock_breakdown?: StockBreakdown;
}

export type AccountType = 'taxable' | '401k' | 'ira' | 'roth_ira' | 'hsa' | 'other';
export type AssetClass = 'stocks' | 'bonds' | 'cash' | 'real_estate' | 'crypto' | 'other';

export interface Holding {
  id: string;
  user_id: string;
  symbol: string;
  name: string | null;
  shares: number;
  cost_basis: number;
  current_price: number | null;
  purchase_date: string | null;
  account_type: AccountType;
  asset_class: AssetClass;
  created_at: string;
  updated_at: string;
}
