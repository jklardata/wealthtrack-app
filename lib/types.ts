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

// Stripe Subscription Types
export type EntitlementTier = 'free' | 'pro' | 'premium';

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  entitlement_tier: EntitlementTier;
  status: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
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
  current_age: number | null;
  desired_retirement_age: number | null;
  // Personal Information
  full_name: string | null;
  date_of_birth: string | null;
  marital_status: MaritalStatus | null;
  number_of_dependents: number | null;
  state_of_residence: string | null;
  // Tax Information
  tax_filing_status: TaxFilingStatus | null;
  // Financial Planning
  risk_tolerance: RiskTolerance | null;
  life_expectancy_assumption: number | null;
  // Employment & Contact
  employer_name: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'domestic_partner';

export type TaxFilingStatus = 'single' | 'married_filing_jointly' | 'married_filing_separately' | 'head_of_household';

// Note: RiskTolerance type already exists in the file at line 211

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

export type CreditCardFamily =
  | 'Chase'
  | 'American Express (Amex)'
  | 'Citi'
  | 'Capital One'
  | 'Bank of America'
  | 'Discover'
  | 'Wells Fargo'
  | 'U.S. Bank'
  | 'Barclays'
  | 'Synchrony'
  | 'Navy Federal Credit Union'
  | 'PNC'
  | 'TD Bank'
  | 'Fifth Third Bank'
  | 'Truist'
  | 'Regions Bank'
  | 'Huntington Bank'
  | 'Ally Bank'
  | 'Comerica'
  | 'First Citizens Bank'
  | 'BMO Harris'
  | 'KeyBank'
  | 'Citizens Bank'
  | 'Santander'
  | 'HSBC'
  | 'SoFi'
  | 'Upgrade'
  | 'Bread Financial'
  | 'Comenity';

export type RewardsCategory =
  | 'cash back'
  | 'travel rewards'
  | 'airline miles'
  | 'hotel points'
  | 'dining rewards'
  | 'grocery rewards'
  | 'gas & EV charging'
  | 'streaming services'
  | 'entertainment'
  | 'rotating categories';

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
  credit_card_family: string | null;
  rewards_category: string | null;
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
  credit_card_family?: string;
  rewards_category?: string;
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

// ============================================
// Scenario Types (Cross-Tool Financial Planning)
// ============================================

/**
 * Spending category weights for cost-of-living calculations
 * Must sum to 1.0 (100%)
 */
export interface SpendingWeights {
  housing: number;
  food: number;
  transport: number;
  healthcare: number;
  utilities: number;
  lifestyle: number;
}

/**
 * Geo FI Score - Meta metric for location-based financial independence feasibility
 */
export interface GeoFIScore {
  score: number;  // 0-100
  label: 'Excellent' | 'Good' | 'Neutral' | 'Poor';
}

/**
 * Scenario - A unified financial plan that persists across all tools
 *
 * Core principle:
 * - Geographic Arbitrage changes the size of the problem
 * - Retirement Calculator solves the problem
 * - Portfolio Optimizer manages the risk
 */
export interface Scenario {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_baseline: boolean;
  is_active: boolean;

  // Location Data
  location_city_id: string;
  location_city_name: string | null;
  location_country: string | null;
  effective_col_index: number;      // NYC = 1.0

  // Income Streams
  primary_income: number;           // Annual gross primary income
  consulting_income: number;        // Annual gross consulting income (semi-retirement bridge)
  consulting_years: number;         // Number of years of consulting bridge
  consulting_tax_rate: number;      // Effective tax rate on consulting (0-1)

  // Expenses
  annual_expenses: number;          // Location-adjusted annual expenses
  spending_weights: SpendingWeights;

  // FI Parameters
  withdrawal_rate: number;          // Safe withdrawal rate (default 0.04 = 4%)
  expected_return: number;          // Expected real return (default 0.05 = 5%)
  current_net_worth: number;        // Current portfolio value
  annual_savings: number;           // Annual savings amount

  // Derived Fields (calculated, not user-input)
  annual_withdrawal_requirement: number;  // expenses - net consulting income
  required_net_worth: number;             // Portfolio needed for FI
  years_to_fi: number;                    // Years until financial independence
  savings_rate: number;                   // Savings as % of income (0-1)
  fi_score: number;                       // Geo FI Score (0-100)

  // Portfolio Link
  risk_tolerance: RiskTolerance | null;
  time_horizon: number | null;

  // Metadata
  cloned_from_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Input for creating/updating a scenario (excludes derived fields)
 */
export interface ScenarioInput {
  name: string;
  description?: string;
  is_baseline?: boolean;
  is_active?: boolean;

  location_city_id: string;
  location_city_name?: string;
  location_country?: string;

  primary_income: number;
  consulting_income?: number;
  consulting_years?: number;
  consulting_tax_rate?: number;

  annual_expenses: number;
  spending_weights?: SpendingWeights;

  withdrawal_rate?: number;
  expected_return?: number;
  current_net_worth: number;
  annual_savings?: number;

  risk_tolerance?: RiskTolerance;
  time_horizon?: number;
}

/**
 * Comparison between two scenarios (Move vs Stay analysis)
 */
export interface ScenarioComparison {
  id: string;
  user_id: string;
  baseline_scenario_id: string;
  compare_scenario_id: string;

  // The full scenario objects for display
  baseline: Scenario;
  compare: Scenario;

  // Deltas (compare - baseline): negative = better in compare scenario
  delta_years_to_fi: number;          // Negative = retire faster
  delta_required_net_worth: number;   // Negative = need less
  delta_annual_expenses: number;      // Negative = spend less
  delta_savings_rate: number;         // Positive = higher savings rate
  delta_fi_score: number;             // Positive = better FI efficiency

  // Semi-retirement analysis
  semi_retirement_feasible: boolean;
  consulting_covers_percentage: number;  // 0-1

  // Human-readable insight
  insight_text: string;               // "This move buys you ~5 years of FI"

  created_at: string;
}

/**
 * Summary comparison without full scenario objects (for lists)
 */
export interface ScenarioComparisonSummary {
  id: string;
  baseline_name: string;
  compare_name: string;
  delta_years_to_fi: number;
  delta_required_net_worth: number;
  insight_text: string;
  created_at: string;
}

// ============================================
// Tax Return Types
// ============================================

export type FilingStatus =
  | 'single'
  | 'married_filing_jointly'
  | 'married_filing_separately'
  | 'head_of_household'
  | 'qualifying_widow';

export interface TaxReturn {
  id: string;
  user_id: string;
  tax_year: number;
  filing_status: FilingStatus;

  // Income
  wages: number;
  interest_income: number;
  dividend_income: number;
  qualified_dividends: number;
  capital_gains: number;
  ira_distributions: number;
  pension_income: number;
  social_security: number;
  business_income: number;
  other_income: number;
  total_income: number;
  agi: number;

  // Deductions
  adjustments: number;
  deduction_type: 'standard' | 'itemized';
  deduction_amount: number;
  qbi_deduction: number;
  taxable_income: number;

  // Tax & Payments
  total_tax: number;
  federal_withheld: number;
  estimated_payments: number;
  refund_amount: number;
  amount_owed: number;
  effective_tax_rate: number;

  // Self-employment
  se_income: number;
  se_tax: number;
  se_deduction: number;

  // Metadata
  source: 'manual' | 'turbotax_pdf' | 'csv_upload';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Projected Net Worth / Lifetime Income Types
// ============================================

export type IncomeSourceType = 'work' | 'social_security' | 'passive' | 'windfall';
export type ExpenseCategoryType = 'recurring' | 'onetime' | 'medical_pre65' | 'medicare';

export interface IncomeSource {
  id: string;
  user_id: string;
  source_type: IncomeSourceType;
  name: string;
  annual_amount: number;
  start_age_months?: number;
  stop_age_months?: number;
  growth_rate?: number;
  pretax_deductions?: number;
  claiming_age_months?: number;
  auto_estimate?: boolean;
  estimated_benefit?: number;
  windfall_year?: number;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategory {
  id: string;
  user_id: string;
  category_type: ExpenseCategoryType;
  name: string;
  monthly_amount: number;
  start_age_months?: number;
  end_age_months?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectionPoint {
  year: number;
  age: number;
  ageMonths: number;
  workIncome: number;
  socialSecurityIncome: number;
  passiveIncome: number;
  windfallIncome: number;
  totalIncome: number;
  totalExpenses: number;
  portfolioValue: number;
  netCashFlow: number;
}

export interface ProjectionInput {
  currentAge: number; // in months
  currentNetWorth: number;
  expectedReturn: number; // decimal, e.g., 0.07 for 7%
  inflationRate: number; // decimal, e.g., 0.03 for 3%
  longevityAge?: number; // default 95
  incomeSources: IncomeSource[];
  expenses: ExpenseCategory[];
}
