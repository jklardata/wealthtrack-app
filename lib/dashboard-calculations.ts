import type { NetWorthEntry } from "./types";

// ============================================
// Net Worth Momentum
// ============================================

export interface MomentumMetrics {
  velocity: number; // $/month average (last 3 months)
  acceleration: number; // Change in velocity vs prior 3mo
  contribution12mo: {
    portfolioGrowth: number; // Market appreciation estimate
    netContributions: number; // Savings minus withdrawals estimate
    totalChange: number; // Net change
  };
}

export function calculateMomentum(entries: NetWorthEntry[]): MomentumMetrics | null {
  if (entries.length < 2) return null;

  // Sort by date descending
  const sorted = [...entries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Last 3 months velocity (if we have data)
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const recentEntries = sorted.filter(e => new Date(e.date) >= threeMonthsAgo);

  let velocity = 0;
  if (recentEntries.length >= 2) {
    const oldest = recentEntries[recentEntries.length - 1];
    const newest = recentEntries[0];
    const daysDiff = (new Date(newest.date).getTime() - new Date(oldest.date).getTime()) / (1000 * 60 * 60 * 24);
    const monthsDiff = daysDiff / 30;
    velocity = monthsDiff > 0 ? (newest.net_worth - oldest.net_worth) / monthsDiff : 0;
  }

  // 12-month contribution (simplified - actual vs expected if just market growth)
  const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const yearAgoEntry = sorted.find(e => new Date(e.date) <= twelveMonthsAgo);

  let contribution12mo = {
    portfolioGrowth: 0,
    netContributions: 0,
    totalChange: 0
  };

  if (yearAgoEntry && sorted[0]) {
    const totalChange = sorted[0].net_worth - yearAgoEntry.net_worth;
    // Rough estimate: assume 7% market return on starting balance
    const expectedGrowth = yearAgoEntry.net_worth * 0.07;
    const netContributions = totalChange - expectedGrowth;

    contribution12mo = {
      portfolioGrowth: expectedGrowth,
      netContributions: Math.max(0, netContributions),
      totalChange
    };
  }

  return {
    velocity,
    acceleration: 0, // Simplified for now
    contribution12mo
  };
}

// ============================================
// FI Progress
// ============================================

export interface FIMetrics {
  fiNumber: number;
  currentProgress: number; // %
  yearsRemaining: number | null;
  monthsOfRunway: number;
  savingsRate: number | null;
  fiScore: 'building' | 'progressing' | 'approaching' | 'achieved';
}

export function calculateFIProgress(
  entries: NetWorthEntry[],
  safeWithdrawalRate: number = 0.04
): FIMetrics | null {
  if (entries.length === 0) return null;

  const latest = entries[0];
  const annualExpenses = (latest.monthly_expenses || 0) * 12;

  if (annualExpenses === 0) {
    return null; // Can't calculate without expense data
  }

  const fiNumber = annualExpenses / safeWithdrawalRate;
  const currentProgress = Math.min(100, (latest.net_worth / fiNumber) * 100);

  // Calculate runway (months of liquid assets)
  const liquidAssets = latest.cash + latest.bonds;
  const monthsOfRunway = latest.monthly_expenses > 0
    ? liquidAssets / latest.monthly_expenses
    : 0;

  // Estimate years remaining
  let yearsRemaining = null;
  let savingsRate = null;

  if (latest.pre_tax_income > 0 && annualExpenses > 0) {
    const annualSavings = latest.pre_tax_income - annualExpenses;
    savingsRate = annualSavings / latest.pre_tax_income;

    if (annualSavings > 0) {
      const shortfall = fiNumber - latest.net_worth;
      yearsRemaining = Math.max(0, shortfall / annualSavings);
    }
  }

  // Determine FI score
  let fiScore: FIMetrics['fiScore'] = 'building';
  if (currentProgress >= 100) fiScore = 'achieved';
  else if (currentProgress >= 70) fiScore = 'approaching';
  else if (currentProgress >= 30) fiScore = 'progressing';

  return {
    fiNumber,
    currentProgress,
    yearsRemaining,
    monthsOfRunway,
    savingsRate,
    fiScore
  };
}

// ============================================
// Wealth Risk Metrics
// ============================================

export interface WealthRiskMetrics {
  concentrationRisk: {
    score: number;
    label: 'Low' | 'Medium' | 'High';
    largestHolding: string;
    largestPercent: number;
  };
  liquidityRatio: {
    ratio: number;
    score: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    monthsOfExpenses: number;
  };
  flexibilityScore: {
    score: number;
    label: 'Low' | 'Medium' | 'High';
    components: {
      cashReserve: number;
      portfolioBalance: number;
      debtLoad: number;
    };
  };
}

export function calculateWealthRisk(entry: NetWorthEntry): WealthRiskMetrics {
  const assetAllocations = [
    { name: 'Stocks', value: entry.stocks },
    { name: 'Bonds', value: entry.bonds },
    { name: 'Cash', value: entry.cash },
    { name: 'Real Estate', value: entry.real_estate },
    { name: 'Commodities', value: entry.commodities },
    { name: 'Other', value: entry.other_assets }
  ].filter(a => a.value > 0);

  // Concentration Risk
  const largest = assetAllocations.reduce((max, curr) =>
    curr.value > max.value ? curr : max, assetAllocations[0] || { name: 'None', value: 0 }
  );
  const concentrationPercent = entry.total_assets > 0
    ? (largest.value / entry.total_assets) * 100
    : 0;

  const concentrationScore = concentrationPercent;
  let concentrationLabel: 'Low' | 'Medium' | 'High' = 'Low';
  if (concentrationPercent > 60) concentrationLabel = 'High';
  else if (concentrationPercent > 40) concentrationLabel = 'Medium';

  // Liquidity Ratio
  const liquidAssets = entry.cash + entry.bonds;
  const liquidityRatio = entry.total_assets > 0
    ? liquidAssets / entry.total_assets
    : 0;
  const monthsOfExpenses = entry.monthly_expenses > 0
    ? liquidAssets / entry.monthly_expenses
    : 0;

  let liquidityScore: 'Poor' | 'Fair' | 'Good' | 'Excellent' = 'Poor';
  if (liquidityRatio >= 0.30) liquidityScore = 'Excellent';
  else if (liquidityRatio >= 0.20) liquidityScore = 'Good';
  else if (liquidityRatio >= 0.10) liquidityScore = 'Fair';

  // Flexibility Score
  const cashScore = entry.total_assets > 0
    ? (entry.cash / entry.total_assets) * 100
    : 0;
  const balanceScore = entry.total_assets > 0
    ? (1 - (largest.value / entry.total_assets)) * 100
    : 50;
  const debtScore = entry.total_assets > 0
    ? Math.max(0, (1 - (entry.total_debts / entry.total_assets)) * 100)
    : 50;
  const flexScore = (cashScore + balanceScore + debtScore) / 3;

  let flexLabel: 'Low' | 'Medium' | 'High' = 'Low';
  if (flexScore >= 60) flexLabel = 'High';
  else if (flexScore >= 40) flexLabel = 'Medium';

  return {
    concentrationRisk: {
      score: concentrationScore,
      label: concentrationLabel,
      largestHolding: largest.name,
      largestPercent: concentrationPercent
    },
    liquidityRatio: {
      ratio: liquidityRatio,
      score: liquidityScore,
      monthsOfExpenses
    },
    flexibilityScore: {
      score: flexScore,
      label: flexLabel,
      components: {
        cashReserve: cashScore,
        portfolioBalance: balanceScore,
        debtLoad: debtScore
      }
    }
  };
}

// ============================================
// Next Best Actions
// ============================================

export interface NextAction {
  title: string;
  description: string;
  actionLabel: string;
  actionLink: string;
  priority: number;
  category: 'opportunity' | 'warning' | 'milestone';
  icon: 'alert' | 'star' | 'trophy' | 'zap';
}

export function determineNextActions(
  entry: NetWorthEntry,
  fiMetrics: FIMetrics | null,
  riskMetrics: WealthRiskMetrics
): NextAction[] {
  const actions: NextAction[] = [];

  // High concentration risk
  if (riskMetrics.concentrationRisk.score > 50) {
    actions.push({
      title: "Diversify Your Portfolio",
      description: `${riskMetrics.concentrationRisk.largestHolding} makes up ${riskMetrics.concentrationRisk.largestPercent.toFixed(0)}% of your assets`,
      actionLabel: "Optimize Portfolio",
      actionLink: "/portfolio-optimizer",
      priority: 1,
      category: 'warning',
      icon: 'alert'
    });
  }

  // Low liquidity
  if (riskMetrics.liquidityRatio.monthsOfExpenses < 6 && entry.monthly_expenses > 0) {
    actions.push({
      title: "Build Cash Reserves",
      description: `Only ${riskMetrics.liquidityRatio.monthsOfExpenses.toFixed(1)} months of emergency fund`,
      actionLabel: "Learn More",
      actionLink: "/articles/best-bank-accounts-for-consultants",
      priority: 2,
      category: 'warning',
      icon: 'alert'
    });
  }

  // FI milestone
  if (fiMetrics && fiMetrics.currentProgress > 40 && fiMetrics.currentProgress < 70) {
    actions.push({
      title: "You're Making Great Progress!",
      description: `${fiMetrics.currentProgress.toFixed(0)}% to FI - model scenarios to optimize your path`,
      actionLabel: "Run Projections",
      actionLink: "/retirement",
      priority: 3,
      category: 'milestone',
      icon: 'trophy'
    });
  }

  // Tax optimization opportunity
  if (entry.pre_tax_income > 0 && entry.stocks > 100000) {
    actions.push({
      title: "Optimize Your Taxes",
      description: "Explore Roth conversions and tax-loss harvesting strategies",
      actionLabel: "Calculate Impact",
      actionLink: "/tax-optimization",
      priority: 4,
      category: 'opportunity',
      icon: 'zap'
    });
  }

  // Early retirement opportunity
  if (fiMetrics && fiMetrics.currentProgress > 60) {
    actions.push({
      title: "Plan Your Early Retirement",
      description: "Model withdrawal strategies and semi-retirement scenarios",
      actionLabel: "Explore Options",
      actionLink: "/early-retirement",
      priority: 5,
      category: 'opportunity',
      icon: 'star'
    });
  }

  // Sort by priority and return top 3
  return actions.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

// ============================================
// Formatting Helpers
// ============================================

export function formatVelocity(velocity: number): string {
  const monthly = velocity;
  const prefix = monthly >= 0 ? '+' : '';
  return `${prefix}$${(Math.abs(monthly) / 1000).toFixed(1)}k/mo`;
}

export function getFIScoreLabel(score: FIMetrics['fiScore']): string {
  const labels = {
    building: 'Building Foundation',
    progressing: 'Making Progress',
    approaching: 'Approaching FI',
    achieved: 'FI Achieved! 🎉'
  };
  return labels[score];
}

export function getRiskScoreColor(score: number): string {
  if (score >= 70) return 'text-red-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-green-600';
}
