import type {
  Allocation,
  RiskTolerance,
  OptimizationResult,
  RebalancingTrade,
} from './types';

// Historical return assumptions (annualized)
// Based on long-term historical averages
const ASSET_RETURNS = {
  stocks: 0.10,      // 10% expected return
  bonds: 0.05,       // 5% expected return
  cash: 0.04,        // 4% (current high-yield savings)
  real_estate: 0.08, // 8% expected return
  other: 0.06,       // 6% expected return
};

// Historical volatility assumptions (annualized standard deviation)
const ASSET_VOLATILITY = {
  stocks: 0.18,      // 18% volatility
  bonds: 0.06,       // 6% volatility
  cash: 0.01,        // 1% volatility (nearly risk-free)
  real_estate: 0.12, // 12% volatility
  other: 0.10,       // 10% volatility
};

// Correlation matrix (simplified)
const CORRELATIONS = {
  stocks_bonds: 0.2,
  stocks_cash: 0.0,
  stocks_real_estate: 0.6,
  bonds_cash: 0.1,
  bonds_real_estate: 0.3,
  cash_real_estate: 0.0,
};

// Risk tolerance constraints
const RISK_CONSTRAINTS = {
  conservative: {
    stocks: { min: 0.20, max: 0.40 },
    bonds: { min: 0.30, max: 0.50 },
    cash: { min: 0.15, max: 0.35 },
    real_estate: { min: 0, max: 0.15 },
    other: { min: 0, max: 0.10 },
  },
  moderate: {
    stocks: { min: 0.40, max: 0.65 },
    bonds: { min: 0.20, max: 0.35 },
    cash: { min: 0.05, max: 0.20 },
    real_estate: { min: 0, max: 0.20 },
    other: { min: 0, max: 0.10 },
  },
  aggressive: {
    stocks: { min: 0.60, max: 0.85 },
    bonds: { min: 0.05, max: 0.20 },
    cash: { min: 0.02, max: 0.10 },
    real_estate: { min: 0, max: 0.25 },
    other: { min: 0, max: 0.15 },
  },
};

// Target allocations based on risk tolerance (optimal for Sharpe ratio)
const TARGET_ALLOCATIONS: Record<RiskTolerance, Allocation> = {
  conservative: {
    stocks: 0.30,
    bonds: 0.40,
    cash: 0.20,
    real_estate: 0.10,
    other: 0.00,
  },
  moderate: {
    stocks: 0.55,
    bonds: 0.25,
    cash: 0.10,
    real_estate: 0.10,
    other: 0.00,
  },
  aggressive: {
    stocks: 0.75,
    bonds: 0.10,
    cash: 0.05,
    real_estate: 0.10,
    other: 0.00,
  },
};

// Calculate portfolio expected return
function calculateExpectedReturn(allocation: Allocation): number {
  return (
    allocation.stocks * ASSET_RETURNS.stocks +
    allocation.bonds * ASSET_RETURNS.bonds +
    allocation.cash * ASSET_RETURNS.cash +
    allocation.real_estate * ASSET_RETURNS.real_estate +
    allocation.other * ASSET_RETURNS.other
  );
}

// Calculate portfolio volatility (standard deviation)
function calculateVolatility(allocation: Allocation): number {
  const { stocks, bonds, cash, real_estate } = allocation;

  // Variance = sum of (weight^2 * variance) + 2 * sum of (weight_i * weight_j * cov_ij)
  const stocksVar = Math.pow(stocks * ASSET_VOLATILITY.stocks, 2);
  const bondsVar = Math.pow(bonds * ASSET_VOLATILITY.bonds, 2);
  const cashVar = Math.pow(cash * ASSET_VOLATILITY.cash, 2);
  const realEstateVar = Math.pow(real_estate * ASSET_VOLATILITY.real_estate, 2);

  // Covariance terms (simplified)
  const stocksBondsCov =
    2 * stocks * bonds * ASSET_VOLATILITY.stocks * ASSET_VOLATILITY.bonds * CORRELATIONS.stocks_bonds;
  const stocksCashCov =
    2 * stocks * cash * ASSET_VOLATILITY.stocks * ASSET_VOLATILITY.cash * CORRELATIONS.stocks_cash;
  const stocksRealEstateCov =
    2 * stocks * real_estate * ASSET_VOLATILITY.stocks * ASSET_VOLATILITY.real_estate * CORRELATIONS.stocks_real_estate;
  const bondsCashCov =
    2 * bonds * cash * ASSET_VOLATILITY.bonds * ASSET_VOLATILITY.cash * CORRELATIONS.bonds_cash;
  const bondsRealEstateCov =
    2 * bonds * real_estate * ASSET_VOLATILITY.bonds * ASSET_VOLATILITY.real_estate * CORRELATIONS.bonds_real_estate;
  const cashRealEstateCov =
    2 * cash * real_estate * ASSET_VOLATILITY.cash * ASSET_VOLATILITY.real_estate * CORRELATIONS.cash_real_estate;

  const variance =
    stocksVar + bondsVar + cashVar + realEstateVar +
    stocksBondsCov + stocksCashCov + stocksRealEstateCov +
    bondsCashCov + bondsRealEstateCov + cashRealEstateCov;

  return Math.sqrt(Math.max(0, variance));
}

// Calculate Sharpe Ratio
function calculateSharpeRatio(expectedReturn: number, volatility: number, riskFreeRate = 0.04): number {
  if (volatility === 0) return 0;
  return (expectedReturn - riskFreeRate) / volatility;
}

// Convert dollar amounts to percentages
function amountsToPercentages(amounts: Record<string, number>): Allocation {
  const total = Object.values(amounts).reduce((sum, val) => sum + val, 0);
  if (total === 0) {
    return { stocks: 0, bonds: 0, cash: 0, real_estate: 0, other: 0 };
  }

  return {
    stocks: amounts.stocks / total,
    bonds: amounts.bonds / total,
    cash: amounts.cash / total,
    real_estate: amounts.real_estate / total,
    other: amounts.other / total,
  };
}

// Calculate rebalancing trades
function calculateRebalancingTrades(
  currentAllocation: Allocation,
  recommendedAllocation: Allocation,
  totalValue: number,
  threshold = 0.05 // Only suggest changes > 5%
): RebalancingTrade[] {
  const trades: RebalancingTrade[] = [];
  const categories: (keyof Allocation)[] = ['stocks', 'bonds', 'cash', 'real_estate', 'other'];

  for (const category of categories) {
    const currentPct = currentAllocation[category];
    const recommendedPct = recommendedAllocation[category];
    const difference = recommendedPct - currentPct;

    if (Math.abs(difference) >= threshold) {
      const amount = Math.abs(difference) * totalValue;
      trades.push({
        action: difference > 0 ? 'buy' : 'sell',
        category,
        amount: Math.round(amount),
        percentage: Math.abs(difference) * 100,
      });
    }
  }

  // Sort by amount (largest first)
  return trades.sort((a, b) => b.amount - a.amount);
}

// Adjust target allocation based on time horizon
function adjustForTimeHorizon(
  baseAllocation: Allocation,
  timeHorizon: number,
  riskTolerance: RiskTolerance
): Allocation {
  // Shorter time horizons = more conservative
  // Longer time horizons = can take more risk
  const constraints = RISK_CONSTRAINTS[riskTolerance];

  let stocksAdjustment = 0;
  if (timeHorizon < 5) {
    stocksAdjustment = -0.10; // Reduce stocks for short horizons
  } else if (timeHorizon > 15) {
    stocksAdjustment = 0.05; // Increase stocks for long horizons
  }

  const adjustedStocks = Math.max(
    constraints.stocks.min,
    Math.min(constraints.stocks.max, baseAllocation.stocks + stocksAdjustment)
  );

  // Redistribute the difference to bonds and cash
  const stocksDiff = baseAllocation.stocks - adjustedStocks;
  const adjustedBonds = Math.max(
    constraints.bonds.min,
    Math.min(constraints.bonds.max, baseAllocation.bonds + stocksDiff * 0.6)
  );
  const adjustedCash = Math.max(
    constraints.cash.min,
    Math.min(constraints.cash.max, baseAllocation.cash + stocksDiff * 0.4)
  );

  // Normalize to ensure sum = 1
  const total = adjustedStocks + adjustedBonds + adjustedCash + baseAllocation.real_estate + baseAllocation.other;

  return {
    stocks: adjustedStocks / total,
    bonds: adjustedBonds / total,
    cash: adjustedCash / total,
    real_estate: baseAllocation.real_estate / total,
    other: baseAllocation.other / total,
  };
}

// Main optimization function
export function optimizePortfolio(
  currentAmounts: {
    stocks: number;
    bonds: number;
    cash: number;
    real_estate: number;
    other_assets: number;
  },
  riskTolerance: RiskTolerance,
  timeHorizon: number,
  customConstraints?: {
    min_stocks?: number;
    max_stocks?: number;
    min_bonds?: number;
    max_bonds?: number;
    min_cash?: number;
    max_cash?: number;
  }
): OptimizationResult {
  // Calculate total portfolio value
  const totalValue =
    currentAmounts.stocks +
    currentAmounts.bonds +
    currentAmounts.cash +
    currentAmounts.real_estate +
    currentAmounts.other_assets;

  // Convert to allocation percentages
  const currentAllocation = amountsToPercentages({
    stocks: currentAmounts.stocks,
    bonds: currentAmounts.bonds,
    cash: currentAmounts.cash,
    real_estate: currentAmounts.real_estate,
    other: currentAmounts.other_assets,
  });

  // Get base target allocation
  let recommendedAllocation = { ...TARGET_ALLOCATIONS[riskTolerance] };

  // Adjust for time horizon
  recommendedAllocation = adjustForTimeHorizon(recommendedAllocation, timeHorizon, riskTolerance);

  // Apply custom constraints if provided
  if (customConstraints) {
    const constraints = { ...RISK_CONSTRAINTS[riskTolerance] };

    if (customConstraints.min_stocks !== undefined) constraints.stocks.min = customConstraints.min_stocks;
    if (customConstraints.max_stocks !== undefined) constraints.stocks.max = customConstraints.max_stocks;
    if (customConstraints.min_bonds !== undefined) constraints.bonds.min = customConstraints.min_bonds;
    if (customConstraints.max_bonds !== undefined) constraints.bonds.max = customConstraints.max_bonds;
    if (customConstraints.min_cash !== undefined) constraints.cash.min = customConstraints.min_cash;
    if (customConstraints.max_cash !== undefined) constraints.cash.max = customConstraints.max_cash;

    // Clamp to constraints
    recommendedAllocation.stocks = Math.max(constraints.stocks.min, Math.min(constraints.stocks.max, recommendedAllocation.stocks));
    recommendedAllocation.bonds = Math.max(constraints.bonds.min, Math.min(constraints.bonds.max, recommendedAllocation.bonds));
    recommendedAllocation.cash = Math.max(constraints.cash.min, Math.min(constraints.cash.max, recommendedAllocation.cash));

    // Normalize
    const total = Object.values(recommendedAllocation).reduce((sum, val) => sum + val, 0);
    if (total !== 1) {
      const factor = 1 / total;
      recommendedAllocation.stocks *= factor;
      recommendedAllocation.bonds *= factor;
      recommendedAllocation.cash *= factor;
      recommendedAllocation.real_estate *= factor;
      recommendedAllocation.other *= factor;
    }
  }

  // Calculate metrics
  const expectedReturn = calculateExpectedReturn(recommendedAllocation);
  const expectedVolatility = calculateVolatility(recommendedAllocation);
  const sharpeRatio = calculateSharpeRatio(expectedReturn, expectedVolatility);

  // Calculate rebalancing trades
  const rebalancingTrades = calculateRebalancingTrades(
    currentAllocation,
    recommendedAllocation,
    totalValue
  );

  return {
    current_allocation: currentAllocation,
    recommended_allocation: recommendedAllocation,
    expected_return: Math.round(expectedReturn * 10000) / 100, // Convert to percentage with 2 decimals
    expected_volatility: Math.round(expectedVolatility * 10000) / 100,
    sharpe_ratio: Math.round(sharpeRatio * 100) / 100,
    rebalancing_trades: rebalancingTrades,
    total_portfolio_value: totalValue,
  };
}

// Risk questionnaire scoring
export interface RiskQuestion {
  id: number;
  question: string;
  options: { text: string; score: number }[];
}

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: 1,
    question: "If your portfolio dropped 20% in a month, what would you do?",
    options: [
      { text: "Sell everything immediately to prevent further losses", score: 1 },
      { text: "Sell some investments to reduce risk", score: 2 },
      { text: "Hold and wait for recovery", score: 3 },
      { text: "Buy more while prices are low", score: 4 },
      { text: "Significantly increase my investments", score: 5 },
    ],
  },
  {
    id: 2,
    question: "How long do you plan to keep your investments before needing the money?",
    options: [
      { text: "Less than 2 years", score: 1 },
      { text: "2-5 years", score: 2 },
      { text: "5-10 years", score: 3 },
      { text: "10-20 years", score: 4 },
      { text: "More than 20 years", score: 5 },
    ],
  },
  {
    id: 3,
    question: "How stable is your current income?",
    options: [
      { text: "Very unstable - it varies significantly", score: 1 },
      { text: "Somewhat unstable - some variation", score: 2 },
      { text: "Moderately stable", score: 3 },
      { text: "Stable with occasional bonuses", score: 4 },
      { text: "Very stable and predictable", score: 5 },
    ],
  },
  {
    id: 4,
    question: "What is your primary investment goal?",
    options: [
      { text: "Preserve my capital - avoid any losses", score: 1 },
      { text: "Generate steady income with minimal risk", score: 2 },
      { text: "Balance growth and income", score: 3 },
      { text: "Grow my wealth over time", score: 4 },
      { text: "Maximize growth - I can handle volatility", score: 5 },
    ],
  },
  {
    id: 5,
    question: "How would you describe your investment experience?",
    options: [
      { text: "None - I'm new to investing", score: 1 },
      { text: "Limited - I have a basic understanding", score: 2 },
      { text: "Moderate - I've invested for a few years", score: 3 },
      { text: "Experienced - I actively manage investments", score: 4 },
      { text: "Expert - I understand complex strategies", score: 5 },
    ],
  },
];

export function calculateRiskScore(answers: { questionId: number; answer: number }[]): {
  score: number;
  tolerance: RiskTolerance;
  timeHorizon: number;
} {
  // Calculate total score (5-25 range)
  const totalScore = answers.reduce((sum, a) => sum + a.answer, 0);

  // Normalize to 0-100
  const normalizedScore = ((totalScore - 5) / 20) * 100;

  // Determine risk tolerance
  let tolerance: RiskTolerance;
  if (normalizedScore < 35) {
    tolerance = 'conservative';
  } else if (normalizedScore < 65) {
    tolerance = 'moderate';
  } else {
    tolerance = 'aggressive';
  }

  // Extract time horizon from question 2
  const timeHorizonAnswer = answers.find(a => a.questionId === 2)?.answer || 3;
  const timeHorizonMap: Record<number, number> = {
    1: 2,
    2: 4,
    3: 7,
    4: 15,
    5: 25,
  };
  const timeHorizon = timeHorizonMap[timeHorizonAnswer] || 10;

  return {
    score: Math.round(normalizedScore),
    tolerance,
    timeHorizon,
  };
}
