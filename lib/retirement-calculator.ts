/**
 * Retirement Calculator with Cost of Living Adjustments
 *
 * This module provides financial calculations for retirement planning,
 * incorporating cost of living adjustments for different cities.
 */

import { CityData, DEFAULT_WEIGHTS } from './col-data';

export interface SpendingWeights {
  housing: number;
  food: number;
  transport: number;
  healthcare: number;
  utilities: number;
  lifestyle: number;
}

/**
 * Semi-retirement / consulting income parameters
 * Allows modeling a "bridge" period where part-time income reduces portfolio withdrawals
 */
export interface SemiRetirementParams {
  grossConsultingIncome: number;  // Annual gross consulting income
  consultingYears: number;        // Number of years of semi-retirement income (0-20)
  consultingTaxRate: number;      // Effective tax rate on consulting income (0-0.4)
}

export interface RetirementParams {
  currentSpend: number;           // Current annual spending
  currentNetWorth: number;        // Current net worth
  annualSavings: number;          // Annual savings amount
  withdrawalRate: number;         // Safe withdrawal rate (e.g., 0.04 for 4%)
  expectedReturn: number;         // Expected real return rate (e.g., 0.05 for 5%)
  city: CityData;                 // Target retirement city
  weights: SpendingWeights;       // Spending category weights
  semiRetirement?: SemiRetirementParams; // Optional semi-retirement/consulting income
}

export interface RetirementResults {
  effectiveCOL: number;           // Weighted COL multiplier
  adjustedSpend: number;          // Annual spending in target city
  requiredNetWorth: number;       // Net worth needed to retire (full retirement)
  yearsToRetirement: number;      // Years until retirement is possible
  currentAge?: number;            // Optional current age
  retirementAge?: number;         // Optional retirement age
  monthlySpend: number;           // Monthly spending in target city
  savingsGap: number;             // Gap between current and required net worth
  projections: ProjectionPoint[]; // Net worth growth projections
  // Semi-retirement specific results
  semiRetirement?: SemiRetirementResults;
}

/**
 * Results specific to semi-retirement calculations
 */
export interface SemiRetirementResults {
  netConsultingIncome: number;           // After-tax consulting income
  portfolioWithdrawalDuringSemi: number; // Reduced withdrawal during semi-retirement
  excessSavings: number;                 // Extra savings if income > spending (added to portfolio)
  requiredNetWorthWithSemi: number;      // Lower required NW due to bridge income
  netWorthSavings: number;               // How much less NW needed vs full retirement
  yearsToSemiRetirement: number;         // Years until semi-retirement is possible
  totalSemiRetirementYears: number;      // Configured years of consulting
  // Phase breakdown for timeline visualization
  phases: RetirementPhase[];
}

export interface RetirementPhase {
  type: 'accumulation' | 'semi-retirement' | 'full-retirement';
  startYear: number;
  endYear: number;                // Infinity for full-retirement phase
  annualWithdrawal: number;       // Portfolio withdrawal during this phase
  consultingIncome: number;       // Consulting income during this phase (0 for non-semi phases)
  description: string;
}

export interface ProjectionPoint {
  year: number;
  netWorth: number;
  age?: number;
  phase?: 'accumulation' | 'semi-retirement' | 'full-retirement'; // Which phase this year is in
}

/**
 * Calculate the effective cost of living multiplier
 * based on spending category weights and city indices
 *
 * @param city - Target city data
 * @param weights - Spending category weights (should sum to 1.0)
 * @returns Effective COL multiplier (NYC = 1.0)
 */
export function calculateEffectiveCOL(
  city: CityData,
  weights: SpendingWeights = DEFAULT_WEIGHTS
): number {
  // Validate weights sum to approximately 1.0
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  if (Math.abs(totalWeight - 1.0) > 0.01) {
    console.warn(`Weights sum to ${totalWeight}, expected 1.0`);
  }

  // Calculate weighted average of indices (normalized to NYC = 100)
  const weightedIndex =
    (weights.housing * city.housing_index +
     weights.food * city.food_index +
     weights.transport * city.transport_index +
     weights.healthcare * city.healthcare_index +
     weights.utilities * city.utilities_index +
     weights.lifestyle * city.base_index) / 100;

  // Tax adjustment: Convert tax_index to a multiplier
  // If tax_index is 50 (50% of NYC taxes), spending power increases
  // Simplified model: Higher taxes reduce effective spending power
  const taxAdjustment = 1 + ((100 - city.tax_index) * 0.001); // Small adjustment for taxes

  return weightedIndex * taxAdjustment;
}

/**
 * Calculate adjusted annual spending in target city
 *
 * @param currentSpend - Current annual spending
 * @param effectiveCOL - Effective COL multiplier from calculateEffectiveCOL
 * @returns Adjusted annual spending
 */
export function calculateAdjustedSpend(
  currentSpend: number,
  effectiveCOL: number
): number {
  if (currentSpend < 0) {
    console.warn('Current spend is negative, returning 0');
    return 0;
  }
  return currentSpend * effectiveCOL;
}

/**
 * Calculate required net worth for retirement
 * Using the safe withdrawal rate approach
 *
 * @param adjustedSpend - Annual spending in target city
 * @param withdrawalRate - Safe withdrawal rate (e.g., 0.04 for 4%)
 * @returns Required net worth
 */
export function calculateRequiredNetWorth(
  adjustedSpend: number,
  withdrawalRate: number
): number {
  if (withdrawalRate <= 0) {
    console.error('Withdrawal rate must be positive');
    return Infinity;
  }
  if (adjustedSpend < 0) {
    console.warn('Adjusted spend is negative, returning 0');
    return 0;
  }
  // Portfolio needed = Annual spending / withdrawal rate
  // e.g., $40k/year at 4% = $1M portfolio
  return adjustedSpend / withdrawalRate;
}

/**
 * Calculate years to retirement using logarithmic growth formula
 *
 * Formula: years = ln((requiredNW × r + annualSavings) / (currentNW × r + annualSavings)) / ln(1 + r)
 * Where r = expected real return
 *
 * This accounts for compound growth of existing assets plus ongoing contributions
 *
 * @param currentNW - Current net worth
 * @param requiredNW - Required net worth for retirement
 * @param annualSavings - Annual savings amount
 * @param realReturn - Expected real return rate (e.g., 0.05 for 5%)
 * @returns Years to retirement (or Infinity if not achievable)
 */
export function calculateYearsToRetirement(
  currentNW: number,
  requiredNW: number,
  annualSavings: number,
  realReturn: number
): number {
  // Edge case: Already have enough
  if (currentNW >= requiredNW) {
    return 0;
  }

  // Edge case: Zero or negative return with insufficient assets
  if (realReturn <= 0) {
    // Without investment returns, only savings matter
    if (annualSavings <= 0) {
      return Infinity; // Can never reach goal
    }
    const gap = requiredNW - currentNW;
    return gap / annualSavings;
  }

  // Edge case: Negative annual savings (spending down)
  if (annualSavings < 0) {
    return Infinity; // Getting further from goal
  }

  // Standard formula for years to reach goal with compound growth and contributions
  const numerator = requiredNW * realReturn + annualSavings;
  const denominator = currentNW * realReturn + annualSavings;

  // Edge case: Denominator is zero or negative
  if (denominator <= 0) {
    return Infinity;
  }

  // Edge case: Numerator <= Denominator (shouldn't happen if currentNW < requiredNW)
  if (numerator <= denominator) {
    return Infinity;
  }

  const years = Math.log(numerator / denominator) / Math.log(1 + realReturn);

  // Sanity check: years should be positive
  if (years < 0 || !isFinite(years)) {
    return Infinity;
  }

  return years;
}

/**
 * Calculate net consulting income after taxes
 *
 * @param grossIncome - Gross annual consulting income
 * @param taxRate - Effective tax rate (federal + state + SE taxes)
 * @returns Net consulting income after taxes
 */
export function calculateNetConsultingIncome(
  grossIncome: number,
  taxRate: number
): number {
  if (grossIncome < 0) return 0;
  if (taxRate < 0 || taxRate > 1) {
    console.warn('Tax rate should be between 0 and 1');
    taxRate = Math.max(0, Math.min(1, taxRate));
  }
  return grossIncome * (1 - taxRate);
}

/**
 * Calculate portfolio withdrawal during semi-retirement
 * When consulting income partially covers expenses, withdrawal is reduced
 * If consulting income exceeds expenses, excess is added to savings (negative withdrawal)
 *
 * @param adjustedSpend - Annual spending in target city
 * @param netConsultingIncome - After-tax consulting income
 * @returns Portfolio withdrawal amount (0 if consulting covers all expenses)
 */
export function calculatePortfolioWithdrawalDuringSemi(
  adjustedSpend: number,
  netConsultingIncome: number
): number {
  // Withdrawal = spending - consulting income
  // If consulting > spending, we're adding to portfolio (but return 0, excess handled separately)
  return Math.max(0, adjustedSpend - netConsultingIncome);
}

/**
 * Calculate excess savings when consulting income exceeds spending
 * This amount gets added to the portfolio during semi-retirement
 *
 * @param adjustedSpend - Annual spending in target city
 * @param netConsultingIncome - After-tax consulting income
 * @returns Excess amount to add to portfolio (0 if spending >= income)
 */
export function calculateExcessSavings(
  adjustedSpend: number,
  netConsultingIncome: number
): number {
  return Math.max(0, netConsultingIncome - adjustedSpend);
}

/**
 * Calculate required net worth for semi-retirement
 * During semi-retirement, you only need to withdraw the gap between spending and consulting income
 *
 * @param adjustedSpend - Annual spending in target city
 * @param netConsultingIncome - After-tax consulting income
 * @param withdrawalRate - Safe withdrawal rate
 * @returns Required net worth for semi-retirement phase
 */
export function calculateRequiredNetWorthForSemi(
  adjustedSpend: number,
  netConsultingIncome: number,
  withdrawalRate: number
): number {
  const portfolioWithdrawal = calculatePortfolioWithdrawalDuringSemi(adjustedSpend, netConsultingIncome);

  // If consulting covers all expenses, minimal portfolio needed
  if (portfolioWithdrawal <= 0) {
    return 0;
  }

  return calculateRequiredNetWorth(portfolioWithdrawal, withdrawalRate);
}

/**
 * Calculate years to semi-retirement (lower threshold than full retirement)
 *
 * @param currentNW - Current net worth
 * @param requiredNWForSemi - Required net worth for semi-retirement
 * @param annualSavings - Annual savings amount
 * @param realReturn - Expected real return rate
 * @returns Years until semi-retirement is possible
 */
export function calculateYearsToSemiRetirement(
  currentNW: number,
  requiredNWForSemi: number,
  annualSavings: number,
  realReturn: number
): number {
  return calculateYearsToRetirement(currentNW, requiredNWForSemi, annualSavings, realReturn);
}

/**
 * Generate net worth projections with semi-retirement phases
 * Models three phases: accumulation, semi-retirement, and full retirement
 *
 * @param params - All retirement parameters including semi-retirement
 * @param adjustedSpend - Annual spending in target city
 * @param yearsToSemiRetirement - Years until semi-retirement begins
 * @param semiRetirementYears - Duration of semi-retirement phase
 * @param netConsultingIncome - After-tax consulting income during semi-retirement
 * @returns Array of projection points with phase annotations
 */
export function generateProjectionsWithSemiRetirement(
  currentNW: number,
  annualSavings: number,
  realReturn: number,
  adjustedSpend: number,
  withdrawalRate: number,
  yearsToSemiRetirement: number,
  semiRetirementYears: number,
  netConsultingIncome: number,
  currentAge?: number
): ProjectionPoint[] {
  const projections: ProjectionPoint[] = [];
  let netWorth = currentNW;

  // Calculate withdrawal amounts for each phase
  const portfolioWithdrawalDuringSemi = calculatePortfolioWithdrawalDuringSemi(adjustedSpend, netConsultingIncome);
  const excessSavingsDuringSemi = calculateExcessSavings(adjustedSpend, netConsultingIncome);
  const fullRetirementWithdrawal = adjustedSpend;

  // Calculate end of semi-retirement
  const semiRetirementEndYear = yearsToSemiRetirement + semiRetirementYears;

  // Cap projections at 50 years
  const maxYears = Math.min(
    Math.ceil(Math.max(semiRetirementEndYear + 10, yearsToSemiRetirement + 5)),
    50
  );

  // Add current year
  projections.push({
    year: 0,
    netWorth: currentNW,
    age: currentAge,
    phase: 'accumulation',
  });

  for (let year = 1; year <= maxYears; year++) {
    let phase: 'accumulation' | 'semi-retirement' | 'full-retirement';
    let annualCashFlow: number;

    if (year <= yearsToSemiRetirement) {
      // Accumulation phase: working full-time, adding savings
      phase = 'accumulation';
      annualCashFlow = annualSavings;
    } else if (year <= semiRetirementEndYear) {
      // Semi-retirement phase: consulting income reduces/eliminates withdrawals
      phase = 'semi-retirement';
      // Cash flow = excess savings (if any) - portfolio withdrawal
      annualCashFlow = excessSavingsDuringSemi - portfolioWithdrawalDuringSemi;
    } else {
      // Full retirement phase: full portfolio withdrawals
      phase = 'full-retirement';
      annualCashFlow = -fullRetirementWithdrawal;
    }

    // Apply investment returns, then cash flow
    netWorth = netWorth * (1 + realReturn) + annualCashFlow;

    projections.push({
      year,
      netWorth: Math.max(0, netWorth),
      age: currentAge ? currentAge + year : undefined,
      phase,
    });
  }

  return projections;
}

/**
 * Calculate complete semi-retirement results
 *
 * @param params - Retirement parameters with semi-retirement config
 * @param adjustedSpend - Annual spending in target city
 * @param requiredNetWorthFull - Required NW for full retirement (no consulting)
 * @returns Complete semi-retirement calculation results
 */
export function calculateSemiRetirementResults(
  params: RetirementParams,
  adjustedSpend: number,
  requiredNetWorthFull: number
): SemiRetirementResults | undefined {
  const semi = params.semiRetirement;
  if (!semi || semi.grossConsultingIncome <= 0 || semi.consultingYears <= 0) {
    return undefined;
  }

  // Calculate net consulting income
  const netConsultingIncome = calculateNetConsultingIncome(
    semi.grossConsultingIncome,
    semi.consultingTaxRate
  );

  // Calculate reduced portfolio withdrawal during semi-retirement
  const portfolioWithdrawalDuringSemi = calculatePortfolioWithdrawalDuringSemi(
    adjustedSpend,
    netConsultingIncome
  );

  // Calculate excess savings if consulting income exceeds spending
  const excessSavings = calculateExcessSavings(adjustedSpend, netConsultingIncome);

  // Calculate required net worth for semi-retirement phase
  const requiredNetWorthWithSemi = calculateRequiredNetWorthForSemi(
    adjustedSpend,
    netConsultingIncome,
    params.withdrawalRate
  );

  // How much less net worth is needed due to semi-retirement income
  const netWorthSavings = requiredNetWorthFull - requiredNetWorthWithSemi;

  // Calculate years to reach semi-retirement threshold
  const yearsToSemiRetirement = calculateYearsToSemiRetirement(
    params.currentNetWorth,
    requiredNetWorthWithSemi,
    params.annualSavings,
    params.expectedReturn
  );

  // Build phase breakdown for timeline visualization
  const phases: RetirementPhase[] = [];

  // Phase 1: Accumulation (if not already at semi-retirement threshold)
  if (yearsToSemiRetirement > 0) {
    phases.push({
      type: 'accumulation',
      startYear: 0,
      endYear: yearsToSemiRetirement,
      annualWithdrawal: 0,
      consultingIncome: 0,
      description: 'Working full-time, building savings',
    });
  }

  // Phase 2: Semi-retirement
  phases.push({
    type: 'semi-retirement',
    startYear: yearsToSemiRetirement,
    endYear: yearsToSemiRetirement + semi.consultingYears,
    annualWithdrawal: portfolioWithdrawalDuringSemi,
    consultingIncome: netConsultingIncome,
    description: excessSavings > 0
      ? `Consulting income exceeds expenses, adding ${formatCurrencyInternal(excessSavings)}/yr to portfolio`
      : `Consulting covers ${formatCurrencyInternal(netConsultingIncome)}/yr, withdrawing ${formatCurrencyInternal(portfolioWithdrawalDuringSemi)}/yr`,
  });

  // Phase 3: Full retirement
  phases.push({
    type: 'full-retirement',
    startYear: yearsToSemiRetirement + semi.consultingYears,
    endYear: Infinity,
    annualWithdrawal: adjustedSpend,
    consultingIncome: 0,
    description: `Full retirement, withdrawing ${formatCurrencyInternal(adjustedSpend)}/yr`,
  });

  return {
    netConsultingIncome,
    portfolioWithdrawalDuringSemi,
    excessSavings,
    requiredNetWorthWithSemi,
    netWorthSavings,
    yearsToSemiRetirement,
    totalSemiRetirementYears: semi.consultingYears,
    phases,
  };
}

// Internal helper for formatting currency in descriptions
function formatCurrencyInternal(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Generate net worth projection over time
 *
 * @param currentNW - Starting net worth
 * @param annualSavings - Annual contribution
 * @param realReturn - Annual return rate
 * @param years - Number of years to project
 * @param currentAge - Optional current age
 * @returns Array of projection points
 */
export function generateProjections(
  currentNW: number,
  annualSavings: number,
  realReturn: number,
  years: number,
  currentAge?: number
): ProjectionPoint[] {
  const projections: ProjectionPoint[] = [];
  let netWorth = currentNW;

  // Add current year
  projections.push({
    year: 0,
    netWorth: currentNW,
    age: currentAge,
  });

  // Project future years
  const maxYears = Math.min(Math.ceil(years) + 1, 50); // Cap at 50 years for performance
  for (let year = 1; year <= maxYears; year++) {
    // Future value = (Present Value × (1 + r)^t) + (Payment × [(1 + r)^t - 1] / r)
    // Simplified: Apply return to current net worth, then add savings
    netWorth = netWorth * (1 + realReturn) + annualSavings;

    projections.push({
      year,
      netWorth: Math.max(0, netWorth), // Can't go negative in this model
      age: currentAge ? currentAge + year : undefined,
    });
  }

  return projections;
}

/**
 * Main retirement calculation function
 * Combines all calculations into a comprehensive result
 * Supports both standard retirement and semi-retirement with consulting income
 *
 * @param params - Retirement calculation parameters
 * @returns Comprehensive retirement calculation results
 */
export function calculateRetirementProjection(
  params: RetirementParams
): RetirementResults {
  // Step 1: Calculate effective cost of living
  const effectiveCOL = calculateEffectiveCOL(params.city, params.weights);

  // Step 2: Calculate adjusted spending in target city
  const adjustedSpend = calculateAdjustedSpend(params.currentSpend, effectiveCOL);

  // Step 3: Calculate required net worth for full retirement
  const requiredNetWorth = calculateRequiredNetWorth(
    adjustedSpend,
    params.withdrawalRate
  );

  // Step 4: Calculate years to full retirement (baseline)
  const yearsToRetirement = calculateYearsToRetirement(
    params.currentNetWorth,
    requiredNetWorth,
    params.annualSavings,
    params.expectedReturn
  );

  // Step 5: Calculate semi-retirement results if configured
  const semiRetirementResults = calculateSemiRetirementResults(
    params,
    adjustedSpend,
    requiredNetWorth
  );

  // Step 6: Generate projections (with or without semi-retirement phases)
  let projections: ProjectionPoint[];

  if (semiRetirementResults && semiRetirementResults.yearsToSemiRetirement < Infinity) {
    // Use semi-retirement aware projection generator
    projections = generateProjectionsWithSemiRetirement(
      params.currentNetWorth,
      params.annualSavings,
      params.expectedReturn,
      adjustedSpend,
      params.withdrawalRate,
      semiRetirementResults.yearsToSemiRetirement,
      semiRetirementResults.totalSemiRetirementYears,
      semiRetirementResults.netConsultingIncome
    );
  } else {
    // Standard projections without semi-retirement
    projections = generateProjections(
      params.currentNetWorth,
      params.annualSavings,
      params.expectedReturn,
      yearsToRetirement
    );
  }

  // Calculate additional metrics
  const savingsGap = Math.max(0, requiredNetWorth - params.currentNetWorth);
  const monthlySpend = adjustedSpend / 12;

  return {
    effectiveCOL,
    adjustedSpend,
    requiredNetWorth,
    yearsToRetirement,
    monthlySpend,
    savingsGap,
    projections,
    semiRetirement: semiRetirementResults,
  };
}

/**
 * Validate retirement parameters
 *
 * @param params - Parameters to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateRetirementParams(params: RetirementParams): string[] {
  const errors: string[] = [];

  if (params.currentSpend < 0) {
    errors.push('Current spending cannot be negative');
  }

  if (params.currentNetWorth < 0) {
    errors.push('Current net worth cannot be negative');
  }

  if (params.withdrawalRate <= 0 || params.withdrawalRate > 0.2) {
    errors.push('Withdrawal rate should be between 0% and 20%');
  }

  if (params.expectedReturn < -0.5 || params.expectedReturn > 0.5) {
    errors.push('Expected return should be between -50% and 50%');
  }

  const totalWeight = Object.values(params.weights).reduce((sum, w) => sum + w, 0);
  if (Math.abs(totalWeight - 1.0) > 0.05) {
    errors.push('Spending weights should sum to approximately 100%');
  }

  Object.entries(params.weights).forEach(([key, value]) => {
    if (value < 0 || value > 1) {
      errors.push(`Weight for ${key} must be between 0 and 1`);
    }
  });

  // Validate semi-retirement parameters if provided
  if (params.semiRetirement) {
    const semi = params.semiRetirement;

    if (semi.grossConsultingIncome < 0) {
      errors.push('Consulting income cannot be negative');
    }

    if (semi.consultingYears < 0 || semi.consultingYears > 20) {
      errors.push('Semi-retirement years should be between 0 and 20');
    }

    if (semi.consultingTaxRate < 0 || semi.consultingTaxRate > 0.6) {
      errors.push('Consulting tax rate should be between 0% and 60%');
    }

    // Warning for overly optimistic assumptions
    if (semi.grossConsultingIncome > params.currentSpend * 2) {
      errors.push('Warning: Consulting income seems high relative to spending. Consider reviewing assumptions.');
    }

    if (semi.consultingYears > 15) {
      errors.push('Warning: Planning for 15+ years of consulting may be optimistic. Consider a more conservative estimate.');
    }
  }

  return errors;
}
