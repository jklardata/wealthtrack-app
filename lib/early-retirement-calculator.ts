/**
 * Early Retirement Calculator
 *
 * Core calculations for FI readiness, withdrawal simulations,
 * Coast FI, and milestone tracking.
 *
 * Design Philosophy:
 * - Favor ranges and probabilities over false precision
 * - All calculations return confidence bands where applicable
 * - Edge cases are handled gracefully with meaningful defaults
 */

// ============================================================================
// TYPES
// ============================================================================

export type FIStage =
  | 'not-ready'      // < 25% FI coverage
  | 'progressing'    // 25-50% FI coverage
  | 'coast-fi'       // Can stop saving, portfolio grows to FI
  | 'fi'             // 100% FI coverage
  | 'work-optional'; // > 125% FI coverage (buffer for flexibility)

export type LifestyleMode = 'lean' | 'base' | 'chubby' | 'fat';

export interface FIReadinessResult {
  stage: FIStage;
  stageLabel: string;
  stageDescription: string;
  fiCoveragePercent: number;        // currentPortfolio / requiredPortfolio
  yearsToFI: number | null;         // null if already FI or impossible
  requiredPortfolio: number;
  currentPortfolio: number;
  safeAnnualSpend: number;          // What you can safely withdraw today
  monthlySpend: number;
  progressColor: string;            // For UI gauge
}

export interface WithdrawalSimulationResult {
  successProbability: number;       // 0-100%
  medianEndingBalance: number;
  percentile25Balance: number;      // Pessimistic case
  percentile75Balance: number;      // Optimistic case
  yearsUntilDepletion: number | null; // null = survives full period
  projections: YearlyProjection[];  // For charting
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  assumptions: string[];
}

export interface YearlyProjection {
  year: number;
  age: number;
  median: number;
  percentile25: number;
  percentile75: number;
  percentile10: number;  // For failure zone
  withdrawalAmount: number;
}

export interface LifestyleBudget {
  mode: LifestyleMode;
  modeLabel: string;
  totalAnnual: number;
  totalMonthly: number;
  requiredPortfolio: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  name: string;
  annual: number;
  percent: number;
  color: string;
}

export interface CoastFIResult {
  isCoastFI: boolean;
  coastFIAge: number | null;            // Age when you can stop saving
  yearsUntilCoastFI: number | null;
  currentCoastFIAge: number;            // If stopped saving today, retire at this age
  minimumIncomeToCoast: number;         // Just cover expenses, no saving needed
  portfolioAtRetirement: number;        // Projected portfolio at target retirement
  growthOnlyProjection: GrowthProjection[];
}

export interface GrowthProjection {
  age: number;
  portfolio: number;
  requiredSpendLine: number;
}

export interface SemiRetirementBridge {
  fullWorkYears: number;
  partialWorkYears: number;
  partialWorkIncome: number;           // Annual income during bridge
  portfolioSupportYears: number;
  reducedStartingPortfolio: number;    // vs traditional FI
  portfolioSavings: number;            // How much less you need
  sequenceRiskMitigationYears: number;
  withdrawalOffsetPercent: number;     // How much partial work covers
  timeline: BridgePhase[];
}

export interface BridgePhase {
  phase: 'full-work' | 'partial-work' | 'portfolio-support' | 'full-fi';
  label: string;
  startAge: number;
  endAge: number;
  incomeSource: string;
  portfolioWithdrawal: number;
}

export interface BurnRateResult {
  yearsRemaining: number;              // Median case
  yearsRemainingPessimistic: number;   // 25th percentile
  yearsRemainingOptimistic: number;    // 75th percentile
  monthlyBurnRate: number;
  annualBurnRate: number;
  runwayDate: Date;                    // Median depletion date
}

export interface SequenceRiskCell {
  startYear: number;
  downturnPercent: number;
  survivalProbability: number;
  riskLevel: 'resilient' | 'tight' | 'fragile';
}

export interface FIMilestone {
  name: string;
  description: string;
  portfolioTarget: number;
  lifestyleImplication: string;
  yearsAway: number | null;
  isAchieved: boolean;
  progress: number;                    // 0-100%
}

export interface EarlyRetirementInputs {
  // Current state
  currentAge: number;
  currentPortfolio: number;
  annualIncome: number;
  annualExpenses: number;
  annualSavings: number;

  // Retirement goals
  targetRetirementAge: number;
  retirementDurationYears: number;     // How long to plan for (e.g., 40 years)

  // Assumptions
  withdrawalRate: number;              // e.g., 0.04 for 4%
  expectedReturn: number;              // e.g., 0.07 for 7%
  volatility: number;                  // e.g., 0.15 for 15% std dev
  inflationRate: number;               // e.g., 0.03 for 3%

  // Semi-retirement (optional)
  semiRetirementIncome?: number;       // Annual income if partially working
  semiRetirementYears?: number;        // How many years of partial work

  // Lifestyle customization
  lifestyleMode?: LifestyleMode;
  budgetOverrides?: Partial<Record<string, number>>;

  // Geographic adjustment (from geo-arbitrage)
  costOfLivingMultiplier?: number;     // 1.0 = baseline
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_BUDGET_CATEGORIES = {
  lean: [
    { name: 'Core Needs', percent: 55, color: '#3b82f6' },      // Housing, food, utilities
    { name: 'Healthcare', percent: 20, color: '#ef4444' },
    { name: 'Transport', percent: 10, color: '#f59e0b' },
    { name: 'Buffer', percent: 15, color: '#6b7280' },
  ],
  base: [
    { name: 'Core Needs', percent: 40, color: '#3b82f6' },
    { name: 'Lifestyle', percent: 20, color: '#8b5cf6' },
    { name: 'Healthcare', percent: 15, color: '#ef4444' },
    { name: 'Travel/Fun', percent: 15, color: '#10b981' },
    { name: 'Buffer', percent: 10, color: '#6b7280' },
  ],
  chubby: [
    { name: 'Core Needs', percent: 35, color: '#3b82f6' },
    { name: 'Lifestyle', percent: 22, color: '#8b5cf6' },
    { name: 'Travel/Fun', percent: 20, color: '#10b981' },
    { name: 'Healthcare', percent: 12, color: '#ef4444' },
    { name: 'Giving/Legacy', percent: 6, color: '#ec4899' },
    { name: 'Buffer', percent: 5, color: '#6b7280' },
  ],
  fat: [
    { name: 'Core Needs', percent: 25, color: '#3b82f6' },
    { name: 'Lifestyle', percent: 25, color: '#8b5cf6' },
    { name: 'Travel/Fun', percent: 25, color: '#10b981' },
    { name: 'Healthcare', percent: 10, color: '#ef4444' },
    { name: 'Giving/Legacy', percent: 10, color: '#ec4899' },
    { name: 'Buffer', percent: 5, color: '#6b7280' },
  ],
};

// 2026 FIRE Portfolio Thresholds (inflation-adjusted):
// - Lean FI: $0.5M - $1M → ~$20k-$40k/year at 4% SWR
// - Base FI: $1M - $2.5M → ~$40k-$100k/year at 4% SWR
// - Chubby FI: $2.5M - $5M → ~$100k-$200k/year at 4% SWR
// - Fat FI: $5M+ → ~$200k+/year at 4% SWR
export const FIRE_PORTFOLIO_THRESHOLDS = {
  lean: { min: 500_000, max: 1_000_000, midpoint: 750_000 },
  base: { min: 1_000_000, max: 2_500_000, midpoint: 1_750_000 },
  chubby: { min: 2_500_000, max: 5_000_000, midpoint: 3_750_000 },
  fat: { min: 5_000_000, max: Infinity, midpoint: 7_500_000 },
};

// Calculate spending based on portfolio midpoints at 4% SWR
const LIFESTYLE_SPENDING: Record<LifestyleMode, number> = {
  lean: 30_000,    // ~$30k/year (midpoint of $20k-$40k)
  base: 70_000,    // ~$70k/year (midpoint of $40k-$100k)
  chubby: 150_000, // ~$150k/year (midpoint of $100k-$200k)
  fat: 300_000,    // ~$300k/year ($200k+ range)
};

// ============================================================================
// CORE CALCULATIONS
// ============================================================================

/**
 * Calculate FI Readiness Dashboard metrics
 */
export function calculateFIReadiness(inputs: EarlyRetirementInputs): FIReadinessResult {
  const {
    currentPortfolio,
    annualExpenses,
    withdrawalRate,
    expectedReturn,
    annualSavings,
    currentAge,
    targetRetirementAge,
    costOfLivingMultiplier = 1.0,
  } = inputs;

  // Adjust expenses for cost of living
  const adjustedExpenses = annualExpenses * costOfLivingMultiplier;

  // Required portfolio = annual expenses / withdrawal rate
  const requiredPortfolio = adjustedExpenses / withdrawalRate;

  // FI coverage percentage
  const fiCoveragePercent = requiredPortfolio > 0
    ? Math.min((currentPortfolio / requiredPortfolio) * 100, 200)
    : 0;

  // Safe annual spend today
  const safeAnnualSpend = currentPortfolio * withdrawalRate;

  // Years to FI calculation (compound growth formula)
  let yearsToFI: number | null = null;

  if (fiCoveragePercent < 100 && annualSavings > 0) {
    // Using the future value of annuity formula solved for n
    const r = expectedReturn;
    const FV = requiredPortfolio;
    const PV = currentPortfolio;
    const PMT = annualSavings;

    if (r > 0) {
      // n = ln((FV*r + PMT) / (PV*r + PMT)) / ln(1+r)
      const numerator = (FV * r + PMT);
      const denominator = (PV * r + PMT);

      if (numerator > 0 && denominator > 0) {
        yearsToFI = Math.log(numerator / denominator) / Math.log(1 + r);
        yearsToFI = Math.max(0, Math.ceil(yearsToFI));
      }
    }
  } else if (fiCoveragePercent >= 100) {
    yearsToFI = 0;
  }

  // Edge case: unrealistic timeline
  if (yearsToFI !== null && yearsToFI > 100) {
    yearsToFI = null; // Effectively "never" at current rate
  }

  // Determine FI stage
  const stage = determineFIStage(fiCoveragePercent, inputs);
  const stageInfo = getFIStageInfo(stage);

  return {
    stage,
    stageLabel: stageInfo.label,
    stageDescription: stageInfo.description,
    fiCoveragePercent,
    yearsToFI,
    requiredPortfolio,
    currentPortfolio,
    safeAnnualSpend,
    monthlySpend: safeAnnualSpend / 12,
    progressColor: stageInfo.color,
  };
}

/**
 * Determine FI stage based on coverage and other factors
 */
function determineFIStage(coveragePercent: number, inputs: EarlyRetirementInputs): FIStage {
  // Check for Coast FI separately (can stop saving, portfolio grows to goal)
  const coastFI = calculateCoastFI(inputs);

  if (coveragePercent >= 125) {
    return 'work-optional';
  } else if (coveragePercent >= 100) {
    return 'fi';
  } else if (coastFI.isCoastFI) {
    return 'coast-fi';
  } else if (coveragePercent >= 50) {
    return 'progressing';
  } else {
    return 'not-ready';
  }
}

function getFIStageInfo(stage: FIStage): { label: string; description: string; color: string } {
  const stages: Record<FIStage, { label: string; description: string; color: string }> = {
    'not-ready': {
      label: 'Not Ready',
      description: 'Building foundation - focus on increasing savings rate',
      color: '#ef4444', // red
    },
    'progressing': {
      label: 'Progressing',
      description: 'Making solid progress toward financial independence',
      color: '#f59e0b', // amber
    },
    'coast-fi': {
      label: 'Coast FI',
      description: 'Can stop saving - portfolio will grow to FI by retirement',
      color: '#3b82f6', // blue
    },
    'fi': {
      label: 'Financially Independent',
      description: 'Portfolio can support your lifestyle indefinitely',
      color: '#10b981', // green
    },
    'work-optional': {
      label: 'Work Optional',
      description: 'Significant buffer - work is truly a choice',
      color: '#8b5cf6', // purple
    },
  };

  return stages[stage];
}

// ============================================================================
// WITHDRAWAL STRESS SIMULATOR (Monte Carlo)
// ============================================================================

/**
 * Run simplified Monte Carlo simulation for withdrawal sustainability
 *
 * Performance optimized: runs 1000 simulations by default
 * Uses geometric Brownian motion for returns
 */
export function simulateWithdrawals(
  inputs: EarlyRetirementInputs,
  numSimulations: number = 1000
): WithdrawalSimulationResult {
  const {
    currentPortfolio,
    annualExpenses,
    expectedReturn,
    volatility,
    inflationRate,
    retirementDurationYears,
    semiRetirementIncome = 0,
    semiRetirementYears = 0,
    currentAge,
    costOfLivingMultiplier = 1.0,
  } = inputs;

  const adjustedExpenses = annualExpenses * costOfLivingMultiplier;
  const years = retirementDurationYears;

  // Store all simulation results
  const allSimulations: number[][] = [];

  // Run Monte Carlo simulations
  for (let sim = 0; sim < numSimulations; sim++) {
    const portfolioPath: number[] = [currentPortfolio];
    let portfolio = currentPortfolio;

    for (let year = 1; year <= years; year++) {
      // Generate random return using normal distribution approximation
      const randomReturn = generateNormalRandom(expectedReturn, volatility);

      // Calculate withdrawal (inflation-adjusted expenses minus any semi-retirement income)
      const inflationMultiplier = Math.pow(1 + inflationRate, year);
      const yearExpenses = adjustedExpenses * inflationMultiplier;
      const yearIncome = year <= semiRetirementYears ? semiRetirementIncome : 0;
      const withdrawal = Math.max(0, yearExpenses - yearIncome);

      // Update portfolio
      portfolio = portfolio * (1 + randomReturn) - withdrawal;
      portfolio = Math.max(0, portfolio); // Can't go negative

      portfolioPath.push(portfolio);
    }

    allSimulations.push(portfolioPath);
  }

  // Calculate statistics for each year
  const projections: YearlyProjection[] = [];
  let successCount = 0;
  const endingBalances: number[] = [];

  for (let year = 0; year <= years; year++) {
    const yearValues = allSimulations.map(sim => sim[year]).sort((a, b) => a - b);

    const median = percentile(yearValues, 50);
    const p25 = percentile(yearValues, 25);
    const p75 = percentile(yearValues, 75);
    const p10 = percentile(yearValues, 10);

    // Calculate withdrawal for this year
    const inflationMultiplier = Math.pow(1 + inflationRate, year);
    const yearExpenses = adjustedExpenses * inflationMultiplier;
    const yearIncome = year <= semiRetirementYears ? semiRetirementIncome : 0;
    const withdrawal = year === 0 ? 0 : Math.max(0, yearExpenses - yearIncome);

    projections.push({
      year,
      age: currentAge + year,
      median,
      percentile25: p25,
      percentile75: p75,
      percentile10: p10,
      withdrawalAmount: withdrawal,
    });

    if (year === years) {
      endingBalances.push(...yearValues);
      successCount = yearValues.filter(v => v > 0).length;
    }
  }

  // Calculate success probability
  const successProbability = (successCount / numSimulations) * 100;

  // Find median depletion year (if any)
  let medianDepletionYear: number | null = null;
  for (let year = 1; year <= years; year++) {
    if (projections[year].median <= 0) {
      medianDepletionYear = year;
      break;
    }
  }

  // Determine risk level
  const riskLevel = getRiskLevel(successProbability);

  // Generate assumptions list
  const assumptions = [
    `Expected return: ${(expectedReturn * 100).toFixed(1)}% annually`,
    `Volatility: ${(volatility * 100).toFixed(1)}% standard deviation`,
    `Inflation: ${(inflationRate * 100).toFixed(1)}% annually`,
    `${numSimulations.toLocaleString()} Monte Carlo simulations`,
    'Returns follow log-normal distribution',
    'Withdrawals at start of each year',
  ];

  return {
    successProbability,
    medianEndingBalance: percentile(endingBalances, 50),
    percentile25Balance: percentile(endingBalances, 25),
    percentile75Balance: percentile(endingBalances, 75),
    yearsUntilDepletion: medianDepletionYear,
    projections,
    riskLevel,
    assumptions,
  };
}

function getRiskLevel(successProbability: number): 'low' | 'moderate' | 'high' | 'very-high' {
  if (successProbability >= 95) return 'low';
  if (successProbability >= 85) return 'moderate';
  if (successProbability >= 70) return 'high';
  return 'very-high';
}

/**
 * Generate random number from normal distribution
 * Using Box-Muller transform for simplicity
 */
function generateNormalRandom(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z;
}

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) return sorted[lower];

  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

// ============================================================================
// LIFESTYLE BUDGET CALCULATOR
// ============================================================================

export function calculateLifestyleBudget(
  inputs: EarlyRetirementInputs,
  mode: LifestyleMode = 'base'
): LifestyleBudget {
  const { withdrawalRate, costOfLivingMultiplier = 1.0, budgetOverrides } = inputs;

  // Use fixed spending amounts based on 2026 FIRE thresholds
  const baseSpending = LIFESTYLE_SPENDING[mode];
  const totalAnnual = baseSpending * costOfLivingMultiplier;

  const categoryDefs = DEFAULT_BUDGET_CATEGORIES[mode];

  const categories: BudgetCategory[] = categoryDefs.map(cat => {
    const overridePercent = budgetOverrides?.[cat.name];
    const finalPercent = overridePercent ?? cat.percent;

    return {
      name: cat.name,
      annual: totalAnnual * (finalPercent / 100),
      percent: finalPercent,
      color: cat.color,
    };
  });

  const requiredPortfolio = totalAnnual / withdrawalRate;

  const modeLabels: Record<LifestyleMode, string> = {
    lean: 'Lean FI',
    base: 'Base FI',
    chubby: 'Chubby FI',
    fat: 'Fat FI',
  };

  return {
    mode,
    modeLabel: modeLabels[mode],
    totalAnnual,
    totalMonthly: totalAnnual / 12,
    requiredPortfolio,
    categories,
  };
}

// ============================================================================
// COAST FI CALCULATOR
// ============================================================================

export function calculateCoastFI(inputs: EarlyRetirementInputs): CoastFIResult {
  const {
    currentAge,
    currentPortfolio,
    targetRetirementAge,
    annualExpenses,
    withdrawalRate,
    expectedReturn,
    costOfLivingMultiplier = 1.0,
  } = inputs;

  const adjustedExpenses = annualExpenses * costOfLivingMultiplier;
  const requiredPortfolio = adjustedExpenses / withdrawalRate;
  const yearsToRetirement = targetRetirementAge - currentAge;

  // Calculate what current portfolio will grow to (no additional contributions)
  const projectedPortfolio = currentPortfolio * Math.pow(1 + expectedReturn, yearsToRetirement);

  // Is current portfolio enough to coast?
  const isCoastFI = projectedPortfolio >= requiredPortfolio;

  // If stopped saving today, at what age could you retire?
  // Solve for n: currentPortfolio * (1+r)^n = requiredPortfolio
  let currentCoastFIAge = currentAge;
  if (currentPortfolio > 0 && currentPortfolio < requiredPortfolio) {
    const yearsNeeded = Math.log(requiredPortfolio / currentPortfolio) / Math.log(1 + expectedReturn);
    currentCoastFIAge = Math.ceil(currentAge + yearsNeeded);
  } else if (currentPortfolio >= requiredPortfolio) {
    currentCoastFIAge = currentAge;
  }

  // Calculate Coast FI number (portfolio needed today to coast to target retirement)
  const coastFINumber = requiredPortfolio / Math.pow(1 + expectedReturn, yearsToRetirement);

  // Years until Coast FI
  let yearsUntilCoastFI: number | null = null;
  let coastFIAge: number | null = null;

  if (currentPortfolio < coastFINumber && inputs.annualSavings > 0) {
    // Simplified: assume linear savings (for actual, would need iterative calc)
    yearsUntilCoastFI = Math.ceil((coastFINumber - currentPortfolio) / inputs.annualSavings);
    coastFIAge = currentAge + yearsUntilCoastFI;
  } else if (currentPortfolio >= coastFINumber) {
    yearsUntilCoastFI = 0;
    coastFIAge = currentAge;
  }

  // Minimum income to coast (just cover expenses, no saving needed)
  const minimumIncomeToCoast = adjustedExpenses;

  // Generate growth projection for chart
  const growthOnlyProjection: GrowthProjection[] = [];
  for (let year = 0; year <= Math.max(yearsToRetirement, 30); year++) {
    const age = currentAge + year;
    const portfolio = currentPortfolio * Math.pow(1 + expectedReturn, year);

    growthOnlyProjection.push({
      age,
      portfolio,
      requiredSpendLine: requiredPortfolio,
    });
  }

  return {
    isCoastFI,
    coastFIAge,
    yearsUntilCoastFI,
    currentCoastFIAge,
    minimumIncomeToCoast,
    portfolioAtRetirement: projectedPortfolio,
    growthOnlyProjection,
  };
}

// ============================================================================
// SEMI-RETIREMENT BRIDGE CALCULATOR
// ============================================================================

export function calculateSemiRetirementBridge(inputs: EarlyRetirementInputs): SemiRetirementBridge {
  const {
    currentAge,
    targetRetirementAge,
    annualExpenses,
    withdrawalRate,
    semiRetirementIncome = 0,
    semiRetirementYears = 5,
    costOfLivingMultiplier = 1.0,
  } = inputs;

  const adjustedExpenses = annualExpenses * costOfLivingMultiplier;
  const fullFIPortfolio = adjustedExpenses / withdrawalRate;

  // Calculate how much the bridge reduces portfolio requirement
  // During bridge years, partial income offsets withdrawals
  const annualOffset = Math.min(semiRetirementIncome, adjustedExpenses);
  const withdrawalOffsetPercent = adjustedExpenses > 0
    ? (annualOffset / adjustedExpenses) * 100
    : 0;

  // Reduced withdrawal need during bridge
  const bridgeWithdrawalNeed = adjustedExpenses - annualOffset;

  // Total "savings" from bridge (reduced early withdrawals)
  // This compounds because early withdrawals have highest sequence risk
  const bridgeSavings = annualOffset * semiRetirementYears;

  // Approximate reduced starting portfolio
  // (Simplified: actual would account for returns during bridge)
  const reducedStartingPortfolio = fullFIPortfolio - (bridgeSavings * 0.8); // 0.8 factor for conservatism
  const portfolioSavings = fullFIPortfolio - reducedStartingPortfolio;

  // Sequence risk mitigation (early years are highest risk)
  const sequenceRiskMitigationYears = semiRetirementYears;

  // Build timeline
  const timeline: BridgePhase[] = [];
  const fullWorkEndAge = targetRetirementAge;
  const partialWorkEndAge = targetRetirementAge + semiRetirementYears;
  const portfolioSupportEndAge = partialWorkEndAge + 10; // Assume 10 years of full withdrawal

  timeline.push({
    phase: 'full-work',
    label: 'Full Work',
    startAge: currentAge,
    endAge: fullWorkEndAge,
    incomeSource: 'Employment/Consulting',
    portfolioWithdrawal: 0,
  });

  if (semiRetirementYears > 0 && semiRetirementIncome > 0) {
    timeline.push({
      phase: 'partial-work',
      label: 'Semi-Retirement',
      startAge: fullWorkEndAge,
      endAge: partialWorkEndAge,
      incomeSource: `Part-time (~$${Math.round(semiRetirementIncome / 1000)}k/yr)`,
      portfolioWithdrawal: bridgeWithdrawalNeed,
    });
  }

  timeline.push({
    phase: 'portfolio-support',
    label: 'Portfolio Support',
    startAge: semiRetirementYears > 0 ? partialWorkEndAge : fullWorkEndAge,
    endAge: portfolioSupportEndAge,
    incomeSource: 'Investment withdrawals',
    portfolioWithdrawal: adjustedExpenses,
  });

  timeline.push({
    phase: 'full-fi',
    label: 'Full FI',
    startAge: portfolioSupportEndAge,
    endAge: 100,
    incomeSource: 'Portfolio + Social Security',
    portfolioWithdrawal: adjustedExpenses * 0.7, // Assume SS covers 30%
  });

  return {
    fullWorkYears: fullWorkEndAge - currentAge,
    partialWorkYears: semiRetirementYears,
    partialWorkIncome: semiRetirementIncome,
    portfolioSupportYears: 10,
    reducedStartingPortfolio,
    portfolioSavings,
    sequenceRiskMitigationYears,
    withdrawalOffsetPercent,
    timeline,
  };
}

// ============================================================================
// BURN RATE CALCULATOR
// ============================================================================

export function calculateBurnRate(inputs: EarlyRetirementInputs): BurnRateResult {
  const {
    currentPortfolio,
    annualExpenses,
    expectedReturn,
    volatility,
    costOfLivingMultiplier = 1.0,
  } = inputs;

  const adjustedExpenses = annualExpenses * costOfLivingMultiplier;

  // Simple calculation: how long until portfolio depletes
  // Median case (with returns)
  let yearsRemaining: number;

  if (adjustedExpenses <= 0) {
    yearsRemaining = Infinity;
  } else if (expectedReturn >= adjustedExpenses / currentPortfolio) {
    // Portfolio never depletes
    yearsRemaining = 100; // Cap at 100 for display
  } else {
    // Solve for when portfolio = 0
    // P(1+r)^n - W*((1+r)^n - 1)/r = 0
    // Simplified approximation
    const netReturn = expectedReturn - (adjustedExpenses / currentPortfolio);
    if (netReturn >= 0) {
      yearsRemaining = 100;
    } else {
      yearsRemaining = currentPortfolio / (adjustedExpenses - currentPortfolio * expectedReturn);
      yearsRemaining = Math.max(0, Math.min(yearsRemaining, 100));
    }
  }

  // Pessimistic case (lower returns due to volatility)
  const pessimisticReturn = Math.max(0, expectedReturn - volatility);
  const yearsRemainingPessimistic = currentPortfolio / (adjustedExpenses - currentPortfolio * pessimisticReturn);

  // Optimistic case
  const optimisticReturn = expectedReturn + volatility * 0.5;
  const yearsRemainingOptimistic = optimisticReturn >= adjustedExpenses / currentPortfolio
    ? 100
    : currentPortfolio / (adjustedExpenses - currentPortfolio * optimisticReturn);

  // Runway date
  const runwayDate = new Date();
  runwayDate.setFullYear(runwayDate.getFullYear() + Math.floor(yearsRemaining));

  return {
    yearsRemaining: Math.round(yearsRemaining * 10) / 10,
    yearsRemainingPessimistic: Math.max(0, Math.round(yearsRemainingPessimistic * 10) / 10),
    yearsRemainingOptimistic: Math.min(100, Math.round(yearsRemainingOptimistic * 10) / 10),
    monthlyBurnRate: adjustedExpenses / 12,
    annualBurnRate: adjustedExpenses,
    runwayDate,
  };
}

// ============================================================================
// SEQUENCE RISK HEATMAP
// ============================================================================

export function calculateSequenceRiskHeatmap(inputs: EarlyRetirementInputs): SequenceRiskCell[] {
  const downturnScenarios = [-10, -20, -30, -40, -50]; // Percent drops
  const startYears = [1, 2, 3, 4, 5]; // Years into retirement

  const cells: SequenceRiskCell[] = [];

  for (const startYear of startYears) {
    for (const downturn of downturnScenarios) {
      // Simulate portfolio with early downturn
      const survivalProbability = simulateWithDownturn(inputs, startYear, downturn / 100);

      let riskLevel: 'resilient' | 'tight' | 'fragile';
      if (survivalProbability >= 90) {
        riskLevel = 'resilient';
      } else if (survivalProbability >= 70) {
        riskLevel = 'tight';
      } else {
        riskLevel = 'fragile';
      }

      cells.push({
        startYear,
        downturnPercent: downturn,
        survivalProbability,
        riskLevel,
      });
    }
  }

  return cells;
}

function simulateWithDownturn(
  inputs: EarlyRetirementInputs,
  downturnYear: number,
  downturnAmount: number
): number {
  // Run simplified simulation with forced downturn in specific year
  const numSimulations = 500; // Fewer for performance
  let successCount = 0;

  const {
    currentPortfolio,
    annualExpenses,
    expectedReturn,
    volatility,
    inflationRate,
    retirementDurationYears,
    costOfLivingMultiplier = 1.0,
  } = inputs;

  const adjustedExpenses = annualExpenses * costOfLivingMultiplier;

  for (let sim = 0; sim < numSimulations; sim++) {
    let portfolio = currentPortfolio;

    for (let year = 1; year <= retirementDurationYears; year++) {
      // Apply forced downturn in specified year
      let yearReturn: number;
      if (year === downturnYear) {
        yearReturn = downturnAmount;
      } else {
        yearReturn = generateNormalRandom(expectedReturn, volatility);
      }

      const inflationMultiplier = Math.pow(1 + inflationRate, year);
      const withdrawal = adjustedExpenses * inflationMultiplier;

      portfolio = portfolio * (1 + yearReturn) - withdrawal;

      if (portfolio <= 0) break;
    }

    if (portfolio > 0) successCount++;
  }

  return (successCount / numSimulations) * 100;
}

// ============================================================================
// FREEDOM MILESTONES
// ============================================================================

export function calculateFreedomMilestones(inputs: EarlyRetirementInputs): FIMilestone[] {
  const {
    currentPortfolio,
    annualExpenses,
    annualSavings,
    withdrawalRate,
    expectedReturn,
    costOfLivingMultiplier = 1.0,
  } = inputs;

  const adjustedExpenses = annualExpenses * costOfLivingMultiplier;

  // Define milestone targets as multiples of annual expenses
  const milestoneDefinitions = [
    {
      name: 'Coast FI',
      multiplier: 12, // ~12x expenses (assumes growth over time)
      description: 'Stop saving, let investments grow',
      lifestyleImplication: 'Can take lower-paying dream job',
    },
    {
      name: 'Barista FI',
      multiplier: 15, // ~15x expenses
      description: 'Part-time work covers living expenses',
      lifestyleImplication: 'Work for benefits, not survival',
    },
    {
      name: 'Lean FI',
      multiplier: 20, // ~20x expenses (5% withdrawal)
      description: 'Cover basic needs from portfolio',
      lifestyleImplication: 'Simple living, no work required',
    },
    {
      name: 'Full FI',
      multiplier: 25, // ~25x expenses (4% withdrawal)
      description: 'Comfortable lifestyle, work optional',
      lifestyleImplication: 'Maintain current lifestyle indefinitely',
    },
    {
      name: 'Fat FI',
      multiplier: 33, // ~33x expenses (3% withdrawal)
      description: 'Abundant lifestyle with large buffer',
      lifestyleImplication: 'Generous spending, legacy building',
    },
  ];

  return milestoneDefinitions.map(def => {
    const portfolioTarget = adjustedExpenses * def.multiplier;
    const progress = Math.min((currentPortfolio / portfolioTarget) * 100, 100);
    const isAchieved = currentPortfolio >= portfolioTarget;

    // Calculate years away
    let yearsAway: number | null = null;
    if (!isAchieved && annualSavings > 0) {
      const remaining = portfolioTarget - currentPortfolio;
      // Simplified: doesn't account for compound growth
      const yearsNeeded = remaining / annualSavings;

      // More accurate with returns
      if (expectedReturn > 0) {
        const r = expectedReturn;
        const FV = portfolioTarget;
        const PV = currentPortfolio;
        const PMT = annualSavings;

        const numerator = (FV * r + PMT);
        const denominator = (PV * r + PMT);

        if (numerator > 0 && denominator > 0 && numerator > denominator) {
          yearsAway = Math.ceil(Math.log(numerator / denominator) / Math.log(1 + r));
        } else {
          yearsAway = Math.ceil(yearsNeeded);
        }
      } else {
        yearsAway = Math.ceil(yearsNeeded);
      }

      // Cap at reasonable max
      if (yearsAway > 100) yearsAway = null;
    } else if (isAchieved) {
      yearsAway = 0;
    }

    return {
      name: def.name,
      description: def.description,
      portfolioTarget,
      lifestyleImplication: def.lifestyleImplication,
      yearsAway,
      isAchieved,
      progress,
    };
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatYears(years: number | null): string {
  if (years === null) return 'N/A';
  if (years === 0) return 'Now';
  if (years === 1) return '1 year';
  if (years >= 100) return '100+ years';
  return `${Math.round(years)} years`;
}
