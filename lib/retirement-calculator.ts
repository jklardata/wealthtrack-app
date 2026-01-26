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

export interface RetirementParams {
  currentSpend: number;           // Current annual spending
  currentNetWorth: number;        // Current net worth
  annualSavings: number;          // Annual savings amount
  withdrawalRate: number;         // Safe withdrawal rate (e.g., 0.04 for 4%)
  expectedReturn: number;         // Expected real return rate (e.g., 0.05 for 5%)
  city: CityData;                 // Target retirement city
  weights: SpendingWeights;       // Spending category weights
}

export interface RetirementResults {
  effectiveCOL: number;           // Weighted COL multiplier
  adjustedSpend: number;          // Annual spending in target city
  requiredNetWorth: number;       // Net worth needed to retire
  yearsToRetirement: number;      // Years until retirement is possible
  currentAge?: number;            // Optional current age
  retirementAge?: number;         // Optional retirement age
  monthlySpend: number;           // Monthly spending in target city
  savingsGap: number;             // Gap between current and required net worth
  projections: ProjectionPoint[]; // Net worth growth projections
}

export interface ProjectionPoint {
  year: number;
  netWorth: number;
  age?: number;
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

  // Step 3: Calculate required net worth
  const requiredNetWorth = calculateRequiredNetWorth(
    adjustedSpend,
    params.withdrawalRate
  );

  // Step 4: Calculate years to retirement
  const yearsToRetirement = calculateYearsToRetirement(
    params.currentNetWorth,
    requiredNetWorth,
    params.annualSavings,
    params.expectedReturn
  );

  // Step 5: Generate projections
  const projections = generateProjections(
    params.currentNetWorth,
    params.annualSavings,
    params.expectedReturn,
    yearsToRetirement
  );

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

  return errors;
}
