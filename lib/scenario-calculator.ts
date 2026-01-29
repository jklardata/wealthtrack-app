/**
 * Scenario Calculator
 *
 * Provides calculation functions for the Scenario abstraction that
 * connects Geographic Arbitrage, Retirement Calculator, and Portfolio Optimizer.
 *
 * Core principle:
 * - Geographic Arbitrage changes the size of the problem
 * - Retirement Calculator solves the problem
 * - Portfolio Optimizer manages the risk
 */

import { CityData, CITIES, DEFAULT_WEIGHTS } from './col-data';
import {
  Scenario,
  ScenarioInput,
  ScenarioComparison,
  SpendingWeights,
  GeoFIScore,
  RiskTolerance,
} from './types';
import {
  calculateEffectiveCOL,
  calculateRequiredNetWorth,
  calculateYearsToRetirement,
  calculateNetConsultingIncome,
  calculatePortfolioWithdrawalDuringSemi,
} from './retirement-calculator';

// ============================================
// Bridge Variables (Shared Across Tools)
// ============================================

/**
 * Calculate Annual Withdrawal Requirement
 *
 * This is the key "bridge variable" that connects location decisions
 * to retirement and portfolio calculations.
 *
 * Annual Withdrawal = Location-Adjusted Expenses - Net Consulting Income
 *
 * @param annualExpenses - Location-adjusted annual expenses
 * @param grossConsultingIncome - Gross consulting income (before taxes)
 * @param consultingTaxRate - Effective tax rate on consulting income (0-1)
 * @returns Annual withdrawal requirement from portfolio
 */
export function calculateAnnualWithdrawalRequirement(
  annualExpenses: number,
  grossConsultingIncome: number = 0,
  consultingTaxRate: number = 0.25
): number {
  const netConsultingIncome = calculateNetConsultingIncome(
    grossConsultingIncome,
    consultingTaxRate
  );
  return calculatePortfolioWithdrawalDuringSemi(annualExpenses, netConsultingIncome);
}

/**
 * Calculate Savings Rate
 *
 * @param primaryIncome - Annual gross primary income
 * @param annualExpenses - Annual expenses
 * @returns Savings rate as decimal (0-1)
 */
export function calculateSavingsRate(
  primaryIncome: number,
  annualExpenses: number
): number {
  if (primaryIncome <= 0) return 0;
  const savings = primaryIncome - annualExpenses;
  if (savings <= 0) return 0;
  return Math.min(savings / primaryIncome, 1);
}

/**
 * Calculate Savings Rate Ceiling
 *
 * Computes the maximum sustainable savings rate for a given location.
 * This helps constrain user inputs to realistic ranges.
 *
 * @param grossIncome - Annual gross income
 * @param colAdjustedExpenses - Cost-of-living adjusted minimum expenses
 * @param minimumExpenseFactor - Factor for minimum living expenses (default 0.3 = 30% of income)
 * @returns Maximum sustainable savings rate (0-0.9, capped at 90%)
 */
export function calculateSavingsRateCeiling(
  grossIncome: number,
  colAdjustedExpenses: number,
  minimumExpenseFactor: number = 0.3
): number {
  if (grossIncome <= 0) return 0;

  // Minimum expenses = higher of COL-adjusted or minimum factor of income
  const minimumExpenses = Math.max(colAdjustedExpenses * 0.5, grossIncome * minimumExpenseFactor);
  const maxSavings = grossIncome - minimumExpenses;

  if (maxSavings <= 0) return 0;

  // Cap at 90% - anything higher is unrealistic
  return Math.min(maxSavings / grossIncome, 0.9);
}

// ============================================
// Geo FI Score
// ============================================

/**
 * Calculate Geo FI Score
 *
 * A meta-metric that appears across all tools to indicate
 * location-based financial independence feasibility.
 *
 * Formula: (Savings Rate × 0.5 + Income Stability × 0.3 + Portfolio Factor × 0.2) × 100
 *
 * @param savingsRate - Savings rate as decimal (0-1)
 * @param incomeStability - Income stability factor (0-1), default 0.7 for consultants
 * @param requiredPortfolio - Required portfolio for FI
 * @param baselinePortfolio - Baseline for normalization (default $2M)
 * @returns GeoFIScore with numeric score and label
 */
export function calculateGeoFIScore(
  savingsRate: number,
  incomeStability: number = 0.7,
  requiredPortfolio: number,
  baselinePortfolio: number = 2000000
): GeoFIScore {
  // Normalize savings rate to 0-1 (already should be, but ensure)
  const normalizedSavingsRate = Math.max(0, Math.min(1, savingsRate));

  // Normalize income stability to 0-1
  const normalizedStability = Math.max(0, Math.min(1, incomeStability));

  // Portfolio factor: inverse relationship (lower required = better)
  // 0 if required >= baseline, 1 if required = 0
  const portfolioFactor = Math.max(0, 1 - (requiredPortfolio / baselinePortfolio));

  // Weighted score
  const rawScore =
    normalizedSavingsRate * 0.5 +
    normalizedStability * 0.3 +
    portfolioFactor * 0.2;

  const score = Math.min(100, Math.max(0, rawScore * 100));

  // Determine label
  let label: GeoFIScore['label'];
  if (score >= 75) {
    label = 'Excellent';
  } else if (score >= 50) {
    label = 'Good';
  } else if (score >= 25) {
    label = 'Neutral';
  } else {
    label = 'Poor';
  }

  return { score: Math.round(score * 10) / 10, label };
}

// ============================================
// Scenario Calculation
// ============================================

/**
 * Calculate all derived fields for a scenario
 *
 * This is the main function that computes:
 * - effective_col_index
 * - annual_withdrawal_requirement
 * - required_net_worth
 * - years_to_fi
 * - savings_rate
 * - fi_score
 *
 * @param input - Scenario input with user-provided values
 * @returns Complete scenario with all derived fields
 */
export function calculateScenarioDerivedFields(
  input: ScenarioInput & { user_id: string; id?: string }
): Omit<Scenario, 'id' | 'created_at' | 'updated_at' | 'cloned_from_id'> & { id?: string } {
  // Get city data for COL calculation
  const cityData = CITIES.find((c) => c.city_id === input.location_city_id);
  if (!cityData) {
    throw new Error(`City not found: ${input.location_city_id}`);
  }

  // Calculate effective COL using spending weights
  const weights = input.spending_weights || DEFAULT_WEIGHTS;
  const effectiveCOL = calculateEffectiveCOL(cityData, weights);

  // Calculate annual withdrawal requirement
  const annualWithdrawalRequirement = calculateAnnualWithdrawalRequirement(
    input.annual_expenses,
    input.consulting_income || 0,
    input.consulting_tax_rate || 0.25
  );

  // Calculate required net worth using safe withdrawal rate
  const withdrawalRate = input.withdrawal_rate || 0.04;
  const requiredNetWorth = calculateRequiredNetWorth(
    annualWithdrawalRequirement,
    withdrawalRate
  );

  // Calculate annual savings if not provided
  const annualSavings =
    input.annual_savings !== undefined
      ? input.annual_savings
      : Math.max(0, input.primary_income - input.annual_expenses);

  // Calculate years to FI
  const expectedReturn = input.expected_return || 0.05;
  const yearsToFI = calculateYearsToRetirement(
    input.current_net_worth,
    requiredNetWorth,
    annualSavings,
    expectedReturn
  );

  // Calculate savings rate
  const savingsRate = calculateSavingsRate(input.primary_income, input.annual_expenses);

  // Calculate Geo FI Score
  // Use risk tolerance to estimate income stability
  const incomeStability = getIncomeStabilityFromRiskTolerance(input.risk_tolerance);
  const fiScore = calculateGeoFIScore(
    savingsRate,
    incomeStability,
    requiredNetWorth
  );

  return {
    id: input.id,
    user_id: input.user_id,
    name: input.name,
    description: input.description || null,
    is_baseline: input.is_baseline || false,
    is_active: input.is_active || false,

    // Location
    location_city_id: input.location_city_id,
    location_city_name: input.location_city_name || cityData.city_name,
    location_country: input.location_country || cityData.country,
    effective_col_index: effectiveCOL,

    // Income
    primary_income: input.primary_income,
    consulting_income: input.consulting_income || 0,
    consulting_years: input.consulting_years || 0,
    consulting_tax_rate: input.consulting_tax_rate || 0.25,

    // Expenses
    annual_expenses: input.annual_expenses,
    spending_weights: weights,

    // FI Parameters
    withdrawal_rate: withdrawalRate,
    expected_return: expectedReturn,
    current_net_worth: input.current_net_worth,
    annual_savings: annualSavings,

    // Derived Fields
    annual_withdrawal_requirement: annualWithdrawalRequirement,
    required_net_worth: requiredNetWorth,
    years_to_fi: yearsToFI,
    savings_rate: savingsRate,
    fi_score: fiScore.score,

    // Portfolio Link
    risk_tolerance: input.risk_tolerance || null,
    time_horizon: input.time_horizon || null,
  };
}

/**
 * Map risk tolerance to income stability factor
 *
 * Conservative investors likely have more stable income,
 * Aggressive investors may have variable income (consultants, freelancers)
 */
function getIncomeStabilityFromRiskTolerance(
  riskTolerance?: RiskTolerance | null
): number {
  switch (riskTolerance) {
    case 'conservative':
      return 0.9; // Stable income
    case 'moderate':
      return 0.7; // Somewhat stable
    case 'aggressive':
      return 0.5; // Variable income
    default:
      return 0.7; // Default for consultants
  }
}

// ============================================
// Scenario Comparison
// ============================================

/**
 * Generate a comparison between two scenarios
 *
 * This is the "Move vs Stay" analysis that shows the delta
 * between staying in current location vs moving.
 *
 * @param baseline - The baseline scenario (typically current location)
 * @param compare - The comparison scenario (potential new location)
 * @returns Comparison with deltas and insight text
 */
export function generateScenarioComparison(
  baseline: Scenario,
  compare: Scenario
): Omit<ScenarioComparison, 'id' | 'created_at'> {
  // Calculate deltas (compare - baseline)
  // Negative delta for years/NW/expenses = better in compare scenario
  const deltaYearsToFI = compare.years_to_fi - baseline.years_to_fi;
  const deltaRequiredNetWorth = compare.required_net_worth - baseline.required_net_worth;
  const deltaAnnualExpenses = compare.annual_expenses - baseline.annual_expenses;

  // Positive delta for savings rate/FI score = better
  const deltaSavingsRate = compare.savings_rate - baseline.savings_rate;
  const deltaFIScore = compare.fi_score - baseline.fi_score;

  // Semi-retirement feasibility
  const netConsultingIncome = calculateNetConsultingIncome(
    compare.consulting_income,
    compare.consulting_tax_rate
  );
  const consultingCoversPercentage =
    compare.annual_expenses > 0
      ? Math.min(1, netConsultingIncome / compare.annual_expenses)
      : 0;
  const semiRetirementFeasible = consultingCoversPercentage >= 0.5;

  // Generate insight text
  const insightText = generateInsightText(
    deltaYearsToFI,
    deltaRequiredNetWorth,
    deltaAnnualExpenses,
    baseline.location_city_name || baseline.location_city_id,
    compare.location_city_name || compare.location_city_id
  );

  return {
    user_id: baseline.user_id,
    baseline_scenario_id: baseline.id,
    compare_scenario_id: compare.id,
    baseline,
    compare,
    delta_years_to_fi: deltaYearsToFI,
    delta_required_net_worth: deltaRequiredNetWorth,
    delta_annual_expenses: deltaAnnualExpenses,
    delta_savings_rate: deltaSavingsRate,
    delta_fi_score: deltaFIScore,
    semi_retirement_feasible: semiRetirementFeasible,
    consulting_covers_percentage: consultingCoversPercentage,
    insight_text: insightText,
  };
}

/**
 * Generate human-readable insight text for a comparison
 *
 * Examples:
 * - "Moving to Mexico City buys you ~5 years of financial independence and lowers the bar by $420k."
 * - "Staying in New York requires an additional $840k but offers higher earning potential."
 */
export function generateInsightText(
  deltaYearsToFI: number,
  deltaRequiredNetWorth: number,
  deltaAnnualExpenses: number,
  baselineCity: string,
  compareCity: string
): string {
  const parts: string[] = [];

  // Handle infinite years (can't reach FI)
  if (!isFinite(deltaYearsToFI)) {
    if (deltaRequiredNetWorth < 0) {
      return `Moving to ${compareCity} lowers your FI target by ${formatCurrency(Math.abs(deltaRequiredNetWorth))}, making financial independence more achievable.`;
    }
    return `Compare the numbers above to see how ${compareCity} affects your path to financial independence.`;
  }

  // Years analysis
  const yearsSaved = -deltaYearsToFI; // Negative delta = years saved
  if (Math.abs(yearsSaved) >= 0.5) {
    if (yearsSaved > 0) {
      parts.push(`Moving to ${compareCity} buys you ~${Math.round(yearsSaved)} year${Math.abs(yearsSaved) >= 1.5 ? 's' : ''} of financial independence`);
    } else {
      parts.push(`Staying in ${baselineCity} reaches FI ~${Math.round(Math.abs(yearsSaved))} year${Math.abs(yearsSaved) >= 1.5 ? 's' : ''} faster`);
    }
  }

  // Net worth analysis
  const nwSaved = -deltaRequiredNetWorth; // Negative delta = money saved
  if (Math.abs(nwSaved) >= 10000) {
    if (nwSaved > 0) {
      if (parts.length > 0) {
        parts.push(`and lowers the bar by ${formatCurrency(nwSaved)}`);
      } else {
        parts.push(`Moving to ${compareCity} lowers your FI target by ${formatCurrency(nwSaved)}`);
      }
    } else {
      if (parts.length > 0) {
        parts.push(`but requires an additional ${formatCurrency(Math.abs(nwSaved))}`);
      } else {
        parts.push(`${compareCity} requires ${formatCurrency(Math.abs(nwSaved))} more to reach FI`);
      }
    }
  }

  // Expenses analysis (if significant and not already covered)
  if (parts.length === 0 && Math.abs(deltaAnnualExpenses) >= 5000) {
    if (deltaAnnualExpenses < 0) {
      parts.push(`Living in ${compareCity} saves ${formatCurrency(Math.abs(deltaAnnualExpenses))}/year`);
    } else {
      parts.push(`${compareCity} costs ${formatCurrency(deltaAnnualExpenses)}/year more`);
    }
  }

  if (parts.length === 0) {
    return `Both locations offer similar paths to financial independence. Consider lifestyle factors.`;
  }

  return parts.join(' ') + '.';
}

/**
 * Format currency for display
 */
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`;
  }
  return `$${Math.round(value)}`;
}

// ============================================
// Scenario Utilities
// ============================================

/**
 * Clone a scenario with a new name and optional overrides
 */
export function cloneScenario(
  original: Scenario,
  newName: string,
  overrides?: Partial<ScenarioInput>
): ScenarioInput & { user_id: string } {
  return {
    user_id: original.user_id,
    name: newName,
    description: `Cloned from "${original.name}"`,
    is_baseline: false,
    is_active: false,

    location_city_id: original.location_city_id,
    location_city_name: original.location_city_name || undefined,
    location_country: original.location_country || undefined,

    primary_income: original.primary_income,
    consulting_income: original.consulting_income,
    consulting_years: original.consulting_years,
    consulting_tax_rate: original.consulting_tax_rate,

    annual_expenses: original.annual_expenses,
    spending_weights: original.spending_weights,

    withdrawal_rate: original.withdrawal_rate,
    expected_return: original.expected_return,
    current_net_worth: original.current_net_worth,
    annual_savings: original.annual_savings,

    risk_tolerance: original.risk_tolerance || undefined,
    time_horizon: original.time_horizon || undefined,

    ...overrides,
  };
}

/**
 * Calculate adjusted expenses for a new city based on COL difference
 *
 * @param baselineExpenses - Annual expenses in baseline city
 * @param baselineCOL - Effective COL of baseline city
 * @param targetCOL - Effective COL of target city
 * @returns Adjusted annual expenses for target city
 */
export function calculateAdjustedExpensesForCity(
  baselineExpenses: number,
  baselineCOL: number,
  targetCOL: number
): number {
  if (baselineCOL <= 0) return baselineExpenses;
  return baselineExpenses * (targetCOL / baselineCOL);
}

/**
 * Validate scenario input and return any warnings/errors
 */
export function validateScenarioInput(input: ScenarioInput): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!input.name || input.name.trim().length === 0) {
    errors.push('Scenario name is required');
  }
  if (!input.location_city_id) {
    errors.push('Location city is required');
  }
  if (input.annual_expenses === undefined || input.annual_expenses < 0) {
    errors.push('Annual expenses must be a positive number');
  }
  if (input.current_net_worth === undefined) {
    errors.push('Current net worth is required');
  }
  if (input.primary_income === undefined || input.primary_income < 0) {
    errors.push('Primary income must be a positive number');
  }

  // Range validation
  if (input.withdrawal_rate !== undefined && (input.withdrawal_rate <= 0 || input.withdrawal_rate > 0.2)) {
    errors.push('Withdrawal rate should be between 0% and 20%');
  }
  if (input.expected_return !== undefined && (input.expected_return < -0.5 || input.expected_return > 0.5)) {
    errors.push('Expected return should be between -50% and 50%');
  }
  if (input.consulting_tax_rate !== undefined && (input.consulting_tax_rate < 0 || input.consulting_tax_rate > 0.6)) {
    errors.push('Consulting tax rate should be between 0% and 60%');
  }
  if (input.consulting_years !== undefined && (input.consulting_years < 0 || input.consulting_years > 30)) {
    errors.push('Consulting years should be between 0 and 30');
  }

  // Warning for unusual values
  if (input.primary_income > 0 && input.annual_expenses > input.primary_income) {
    warnings.push('Annual expenses exceed primary income. Savings rate will be 0%.');
  }
  if (input.current_net_worth < 0) {
    warnings.push('Negative net worth. Years to FI will be calculated from debt.');
  }
  if (input.consulting_income && input.consulting_income > input.annual_expenses * 2) {
    warnings.push('Consulting income seems high relative to expenses. Consider reviewing assumptions.');
  }
  if (input.consulting_years && input.consulting_years > 15) {
    warnings.push('Planning for 15+ years of consulting may be optimistic.');
  }

  // Validate spending weights if provided
  if (input.spending_weights) {
    const totalWeight = Object.values(input.spending_weights).reduce((sum, w) => sum + w, 0);
    if (Math.abs(totalWeight - 1.0) > 0.05) {
      warnings.push(`Spending weights sum to ${(totalWeight * 100).toFixed(0)}%, expected 100%`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get default spending weights
 */
export function getDefaultSpendingWeights(): SpendingWeights {
  return { ...DEFAULT_WEIGHTS };
}
