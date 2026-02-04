/**
 * Projection Calculator for Lifetime Net Worth
 *
 * Calculates year-by-year portfolio projection incorporating:
 * - Multiple income sources (work, social security, passive, windfalls)
 * - Age-dependent expenses
 * - Portfolio growth and withdrawals
 */

import { IncomeSource, ExpenseCategory, ProjectionInput, ProjectionPoint } from './types';

/**
 * Calculate lifetime net worth projection
 */
export function calculateProjection(input: ProjectionInput): ProjectionPoint[] {
  const {
    currentAge,
    currentNetWorth,
    expectedReturn,
    inflationRate,
    longevityAge = 65,
    incomeSources,
    expenses,
  } = input;

  const projection: ProjectionPoint[] = [];
  let portfolioValue = currentNetWorth;

  // Iterate year by year from current age to longevity age (in years)
  for (let age = currentAge; age <= longevityAge; age++) {
    const year = age - currentAge;
    const ageMonths = age * 12; // Convert to months for income/expense calculations

    // Calculate income for this year
    const workIncome = calculateWorkIncome(incomeSources, ageMonths, year, inflationRate);
    const socialSecurityIncome = calculateSocialSecurityIncome(incomeSources, ageMonths, year, inflationRate);
    const passiveIncome = calculatePassiveIncome(incomeSources, ageMonths, year, inflationRate);
    const windfallIncome = calculateWindfallIncome(incomeSources, year);

    const totalIncome = workIncome + socialSecurityIncome + passiveIncome + windfallIncome;

    // Calculate expenses for this year
    const totalExpenses = calculateExpenses(expenses, ageMonths, year, inflationRate);

    // Calculate taxes (simplified: 25% effective rate on non-social security income)
    const taxableIncome = workIncome + passiveIncome + windfallIncome;
    const socialSecurityTaxableIncome = socialSecurityIncome * 0.85; // 85% of SS is taxable
    const totalTaxableIncome = taxableIncome + socialSecurityTaxableIncome;
    const taxes = totalTaxableIncome * 0.25;

    // Net cash flow = income - expenses - taxes
    const netCashFlow = totalIncome - totalExpenses - taxes;

    // Update portfolio: growth + net cash flow
    const portfolioGrowth = portfolioValue * expectedReturn;
    portfolioValue = portfolioValue + portfolioGrowth + netCashFlow;

    projection.push({
      year,
      age,
      ageMonths,
      workIncome,
      socialSecurityIncome,
      passiveIncome,
      windfallIncome,
      totalIncome,
      totalExpenses: totalExpenses + taxes, // Include taxes in total expenses
      portfolioValue: Math.max(0, portfolioValue), // Can't go negative
      netCashFlow,
    });
  }

  return projection;
}

/**
 * Calculate work income for a given year
 */
function calculateWorkIncome(
  sources: IncomeSource[],
  ageMonths: number,
  year: number,
  inflationRate: number
): number {
  const workSources = sources.filter(s => s.source_type === 'work');
  let total = 0;

  for (const source of workSources) {
    // Check if income is active at this age
    if (source.start_age_months && ageMonths < source.start_age_months) continue;
    if (source.stop_age_months && ageMonths > source.stop_age_months) continue;

    // Apply growth rate (real growth + inflation)
    const growthRate = (source.growth_rate || 0) + inflationRate;
    const inflatedAmount = source.annual_amount * Math.pow(1 + growthRate, year);

    // Subtract pre-tax deductions
    const netAmount = inflatedAmount - (source.pretax_deductions || 0);

    total += netAmount;
  }

  return total;
}

/**
 * Calculate social security income
 */
function calculateSocialSecurityIncome(
  sources: IncomeSource[],
  ageMonths: number,
  year: number,
  inflationRate: number
): number {
  const ssSources = sources.filter(s => s.source_type === 'social_security');
  let total = 0;

  for (const source of ssSources) {
    // Check if claiming age has been reached
    if (!source.claiming_age_months || ageMonths < source.claiming_age_months) continue;

    // Use estimated benefit or annual_amount
    const benefit = source.estimated_benefit || source.annual_amount;

    // Apply COLA (inflation adjustment)
    const yearsSinceClaiming = Math.max(0, year - Math.floor((source.claiming_age_months - ageMonths + year * 12) / 12));
    const inflatedBenefit = benefit * Math.pow(1 + inflationRate, yearsSinceClaiming);

    total += inflatedBenefit;
  }

  return total;
}

/**
 * Calculate passive income (similar to work income)
 */
function calculatePassiveIncome(
  sources: IncomeSource[],
  ageMonths: number,
  year: number,
  inflationRate: number
): number {
  const passiveSources = sources.filter(s => s.source_type === 'passive');
  let total = 0;

  for (const source of passiveSources) {
    // Check if income is active at this age
    if (source.start_age_months && ageMonths < source.start_age_months) continue;
    if (source.stop_age_months && ageMonths > source.stop_age_months) continue;

    // Apply growth rate
    const growthRate = (source.growth_rate || 0) + inflationRate;
    const inflatedAmount = source.annual_amount * Math.pow(1 + growthRate, year);

    total += inflatedAmount;
  }

  return total;
}

/**
 * Calculate windfall income (one-time payments)
 */
function calculateWindfallIncome(sources: IncomeSource[], year: number): number {
  const windfalls = sources.filter(s => s.source_type === 'windfall');
  let total = 0;

  for (const source of windfalls) {
    if (source.windfall_year === year) {
      total += source.annual_amount;
    }
  }

  return total;
}

/**
 * Calculate total expenses for a given year
 */
function calculateExpenses(
  expenses: ExpenseCategory[],
  ageMonths: number,
  year: number,
  inflationRate: number
): number {
  let total = 0;

  for (const expense of expenses) {
    let isActive = false;

    switch (expense.category_type) {
      case 'recurring':
        // Always active
        isActive = true;
        break;

      case 'onetime':
        // Active only within age range
        if (expense.start_age_months && expense.end_age_months) {
          isActive = ageMonths >= expense.start_age_months && ageMonths <= expense.end_age_months;
        }
        break;

      case 'medical_pre65':
        // Active before age 65
        isActive = ageMonths < 65 * 12;
        break;

      case 'medicare':
        // Active at age 65+
        isActive = ageMonths >= 65 * 12;
        break;
    }

    if (isActive) {
      // Convert monthly to annual and apply inflation
      const annualExpense = expense.monthly_amount * 12;
      const inflatedExpense = annualExpense * Math.pow(1 + inflationRate, year);
      total += inflatedExpense;
    }
  }

  return total;
}

/**
 * Estimate Social Security benefit based on current work income
 * Uses simplified bend point formula
 */
export function estimateSocialSecurityBenefit(averageAnnualIncome: number): number {
  // Convert to monthly income
  const monthlyIncome = averageAnnualIncome / 12;

  // 2024 bend points (approximate)
  const bendPoint1 = 1174;
  const bendPoint2 = 7078;

  let benefit = 0;

  // First bend point: 90% of first $1,174
  if (monthlyIncome <= bendPoint1) {
    benefit = monthlyIncome * 0.9;
  } else {
    benefit = bendPoint1 * 0.9;

    // Second bend point: 32% of amount between $1,174 and $7,078
    if (monthlyIncome <= bendPoint2) {
      benefit += (monthlyIncome - bendPoint1) * 0.32;
    } else {
      benefit += (bendPoint2 - bendPoint1) * 0.32;

      // Above second bend point: 15%
      benefit += (monthlyIncome - bendPoint2) * 0.15;
    }
  }

  // Convert monthly benefit to annual
  return benefit * 12;
}

/**
 * Find portfolio depletion age (when portfolio goes to $0)
 */
export function findDepletionAge(projection: ProjectionPoint[]): number | null {
  for (const point of projection) {
    if (point.portfolioValue <= 0) {
      return point.age;
    }
  }
  return null;
}

/**
 * Find peak net worth point
 */
export function findPeakNetWorth(projection: ProjectionPoint[]): { age: number; amount: number } | null {
  if (projection.length === 0) return null;

  let peak = projection[0];
  for (const point of projection) {
    if (point.portfolioValue > peak.portfolioValue) {
      peak = point;
    }
  }

  return {
    age: peak.age,
    amount: peak.portfolioValue,
  };
}

/**
 * Calculate total lifetime income
 */
export function calculateTotalLifetimeIncome(projection: ProjectionPoint[]): number {
  return projection.reduce((sum, point) => sum + point.totalIncome, 0);
}
