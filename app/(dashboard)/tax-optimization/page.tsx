"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Info,
  DollarSign,
  Percent,
  Calculator,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import type { TaxReturn } from "@/lib/types";

// ============================================
// Calculation Helpers
// ============================================

/**
 * Safely divide two numbers, returning 0 if denominator is 0 or null
 */
function safeDivide(numerator: number | null, denominator: number | null): number {
  if (!numerator || !denominator || denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Format a number as currency
 */
function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as percentage
 */
function formatPercent(value: number | null, decimals = 1): string {
  if (value === null || value === undefined) return "0%";
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Get trend indicator component based on value change
 */
function TrendIndicator({
  current,
  previous,
  invertColors = false,
}: {
  current: number;
  previous: number;
  invertColors?: boolean;
}) {
  if (!previous) return null;

  const change = current - previous;
  const percentChange = safeDivide(change, previous);

  if (Math.abs(percentChange) < 0.01) {
    return (
      <span className="inline-flex items-center text-muted-foreground text-sm">
        <Minus className="h-3 w-3 mr-1" />
        No change
      </span>
    );
  }

  // For taxes/amounts owed, decrease is good (invertColors = true)
  const isPositive = invertColors ? change < 0 : change > 0;

  return (
    <span
      className={`inline-flex items-center text-sm ${
        isPositive ? "text-green-600" : "text-red-600"
      }`}
    >
      {change > 0 ? (
        <TrendingUp className="h-3 w-3 mr-1" />
      ) : (
        <TrendingDown className="h-3 w-3 mr-1" />
      )}
      {formatPercent(Math.abs(percentChange))} YoY
    </span>
  );
}

/**
 * Get benchmark label for deduction metrics
 */
function getBenchmarkLabel(value: number, thresholds: [number, number]): {
  label: string;
  color: string;
} {
  if (value < thresholds[0]) {
    return { label: "Low", color: "text-yellow-600" };
  } else if (value <= thresholds[1]) {
    return { label: "Typical", color: "text-green-600" };
  }
  return { label: "High", color: "text-blue-600" };
}

/**
 * Calculate S-Corp tax savings estimate
 *
 * Assumptions:
 * - Self-employment tax rate: 15.3% (12.4% Social Security + 2.9% Medicare)
 * - S-Corp allows splitting income into salary (subject to payroll tax) and distributions (not subject)
 * - "Reasonable salary" must be paid to avoid IRS scrutiny
 */
function calculateSCorpSavings(
  netProfit: number,
  reasonableSalary: number,
  complianceCost: number = 3000
): {
  currentSETax: number;
  sCorpPayrollTax: number;
  distributions: number;
  annualSavings: number;
  breakEven: boolean;
} {
  // Current SE tax on full profit (only on first $160,200 for Social Security portion in 2023)
  const socialSecurityCap = 160200;
  const socialSecurityRate = 0.124;
  const medicareRate = 0.029;

  // Current SE tax calculation
  const seTaxableIncome = netProfit * 0.9235; // 92.35% of net profit is subject to SE tax
  const socialSecurityTax = Math.min(seTaxableIncome, socialSecurityCap) * socialSecurityRate;
  const medicareTax = seTaxableIncome * medicareRate;
  const currentSETax = socialSecurityTax + medicareTax;

  // S-Corp payroll tax (employer + employee portions on salary only)
  const salarySocialSecurity = Math.min(reasonableSalary, socialSecurityCap) * socialSecurityRate * 2;
  const salaryMedicare = reasonableSalary * medicareRate * 2;
  const sCorpPayrollTax = salarySocialSecurity + salaryMedicare;

  // Distributions (not subject to payroll tax)
  const distributions = Math.max(0, netProfit - reasonableSalary);

  // Net savings after compliance costs
  const grossSavings = currentSETax - sCorpPayrollTax;
  const annualSavings = grossSavings - complianceCost;

  return {
    currentSETax,
    sCorpPayrollTax,
    distributions,
    annualSavings,
    breakEven: annualSavings > 0,
  };
}

/**
 * Calculate quarterly estimated tax payments
 *
 * Assumptions:
 * - Safe harbor: pay 100% of prior year tax (110% if AGI > $150k)
 * - Assumes income distribution is even throughout year
 */
function calculateQuarterlyEstimates(
  priorYearTax: number,
  priorYearAGI: number,
  expectedIncomeChange: number = 0
): {
  quarterlyPayment: number;
  annualEstimate: number;
  safeHarborAmount: number;
  needsHigherSafeHarbor: boolean;
} {
  // Safe harbor threshold
  const needsHigherSafeHarbor = priorYearAGI > 150000;
  const safeHarborRate = needsHigherSafeHarbor ? 1.1 : 1.0;

  // Safe harbor amount based on prior year
  const safeHarborAmount = priorYearTax * safeHarborRate;

  // Estimated current year tax (adjusted for income change)
  const annualEstimate = priorYearTax * (1 + expectedIncomeChange);

  // Quarterly payment (use higher of safe harbor or estimate)
  const quarterlyPayment = Math.max(safeHarborAmount, annualEstimate) / 4;

  return {
    quarterlyPayment,
    annualEstimate,
    safeHarborAmount,
    needsHigherSafeHarbor,
  };
}

// ============================================
// Empty State Component
// ============================================

function EmptyState() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">
            Upload your tax data to unlock optimization insights
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Upload a sanitized tax summary (CSV) to see your tax health,
            deduction efficiency, self-employment optimization opportunities,
            and quarterly estimates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No SSNs. No addresses. No sensitive PII.
          </p>
          <Button onClick={() => router.push("/settings")} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload tax_data.csv
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// Module 1: Tax Health Dashboard
// ============================================

function TaxHealthDashboard({
  taxReturns,
}: {
  taxReturns: TaxReturn[];
}) {
  // Sort by year descending to get most recent first
  const sortedReturns = [...taxReturns].sort((a, b) => b.tax_year - a.tax_year);
  const current = sortedReturns[0];
  const previous = sortedReturns[1];

  // Calculate metrics
  const effectiveTaxRate = safeDivide(current.total_tax, current.total_income);
  const previousEffectiveRate = previous
    ? safeDivide(previous.total_tax, previous.total_income)
    : null;

  const agiVsIncome = safeDivide(current.agi, current.total_income);
  const taxableVsAGI = safeDivide(current.taxable_income, current.agi);

  const refundOrOwed = current.refund_amount > 0
    ? { type: "refund" as const, amount: current.refund_amount }
    : { type: "owed" as const, amount: current.amount_owed };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Tax Health Dashboard
        </CardTitle>
        <CardDescription>
          Overview of your {current.tax_year} tax situation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Effective Tax Rate */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Effective Tax Rate
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total tax divided by total income</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-3xl font-bold">{formatPercent(effectiveTaxRate)}</p>
            {previous && (
              <TrendIndicator
                current={effectiveTaxRate}
                previous={previousEffectiveRate || 0}
                invertColors
              />
            )}
          </div>

          {/* AGI vs Total Income */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                AGI vs Total Income
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Shows how much income was reduced by above-the-line deductions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-3xl font-bold">{formatPercent(agiVsIncome)}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(current.total_income - current.agi)} in adjustments
            </p>
          </div>

          {/* Taxable vs AGI */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Taxable Income vs AGI
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Shows impact of deductions on reducing taxable income</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-3xl font-bold">{formatPercent(taxableVsAGI)}</p>
            <p className="text-sm text-muted-foreground">
              {current.deduction_type === "itemized" ? "Itemized" : "Standard"} deduction
            </p>
          </div>

          {/* Refund or Amount Owed */}
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">
              {refundOrOwed.type === "refund" ? "Refund" : "Amount Owed"}
            </span>
            <p
              className={`text-3xl font-bold ${
                refundOrOwed.type === "refund" ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(refundOrOwed.amount)}
            </p>
            {previous && (
              <TrendIndicator
                current={refundOrOwed.type === "refund" ? refundOrOwed.amount : -refundOrOwed.amount}
                previous={
                  previous.refund_amount > 0
                    ? previous.refund_amount
                    : -previous.amount_owed
                }
              />
            )}
          </div>
        </div>

        {/* Year-over-year comparison if multiple years */}
        {sortedReturns.length > 1 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium mb-3">Year-over-Year Comparison</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Tax</span>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(current.total_tax)}</p>
                  <TrendIndicator
                    current={current.total_tax}
                    previous={previous?.total_tax || 0}
                    invertColors
                  />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Income</span>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(current.total_income)}</p>
                  <TrendIndicator
                    current={current.total_income}
                    previous={previous?.total_income || 0}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">AGI</span>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(current.agi)}</p>
                  <TrendIndicator
                    current={current.agi}
                    previous={previous?.agi || 0}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Module 2: Deduction Efficiency Analyzer
// ============================================

function DeductionEfficiencyAnalyzer({
  taxReturn,
}: {
  taxReturn: TaxReturn;
}) {
  // Calculate efficiency metrics
  const businessExpenseRatio = safeDivide(
    taxReturn.total_income - taxReturn.business_income, // Implied expenses = gross - net reported
    taxReturn.business_income + (taxReturn.total_income - taxReturn.business_income)
  );

  // Use adjustments as proxy for above-the-line deductions
  const agiReductionPercent = safeDivide(
    taxReturn.adjustments,
    taxReturn.total_income
  );

  // Net profit margin (for self-employed)
  const netProfitMargin = safeDivide(
    taxReturn.se_income,
    taxReturn.business_income || taxReturn.se_income
  );

  // Get benchmark labels
  const expenseBenchmark = getBenchmarkLabel(businessExpenseRatio, [0.2, 0.4]);
  const agiReductionBenchmark = getBenchmarkLabel(agiReductionPercent, [0.05, 0.15]);
  const profitMarginBenchmark = getBenchmarkLabel(netProfitMargin, [0.4, 0.7]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-primary" />
          Deduction Efficiency Analyzer
        </CardTitle>
        <CardDescription>
          How effectively are deductions reducing your taxable income
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Business Expense Ratio */}
        {(taxReturn.business_income > 0 || taxReturn.se_income > 0) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Business Expense Ratio</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        The ratio of business expenses to gross business income.
                        Many self-employed filers fall within the 20-40% range.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className={`text-sm font-medium ${expenseBenchmark.color}`}>
                {expenseBenchmark.label}
              </span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(businessExpenseRatio * 100, 100)}%` }}
              />
              {/* Benchmark markers */}
              <div
                className="absolute h-full w-0.5 bg-yellow-500"
                style={{ left: "20%" }}
              />
              <div
                className="absolute h-full w-0.5 bg-green-500"
                style={{ left: "40%" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>20% (Low)</span>
              <span>40% (Typical)</span>
              <span>60%+</span>
            </div>
          </div>
        )}

        {/* AGI Reduction Percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">AGI Reduction</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Percentage of total income reduced by above-the-line
                      adjustments (retirement contributions, SE tax deduction, HSA, etc.).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className={`text-sm font-medium ${agiReductionBenchmark.color}`}>
              {agiReductionBenchmark.label}
            </span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(agiReductionPercent * 100 * 3, 100)}%` }}
            />
            <div
              className="absolute h-full w-0.5 bg-yellow-500"
              style={{ left: "15%" }}
            />
            <div
              className="absolute h-full w-0.5 bg-green-500"
              style={{ left: "45%" }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>5% (Low)</span>
            <span>15% (Typical)</span>
            <span>30%+</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your adjustments: {formatCurrency(taxReturn.adjustments)} ({formatPercent(agiReductionPercent)})
          </p>
        </div>

        {/* Net Profit Margin (for self-employed) */}
        {taxReturn.se_income > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Net Profit Margin</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        Net self-employment income as a percentage of gross business income.
                        Service-based businesses typically see 40-70% margins.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className={`text-sm font-medium ${profitMarginBenchmark.color}`}>
                {profitMarginBenchmark.label}
              </span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(netProfitMargin * 100, 100)}%` }}
              />
              <div
                className="absolute h-full w-0.5 bg-yellow-500"
                style={{ left: "40%" }}
              />
              <div
                className="absolute h-full w-0.5 bg-green-500"
                style={{ left: "70%" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>40% (Low)</span>
              <span>70% (Typical)</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Deduction Summary */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Deduction Summary</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deduction Type</span>
              <span className="font-medium capitalize">{taxReturn.deduction_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deduction Amount</span>
              <span className="font-medium">{formatCurrency(taxReturn.deduction_amount)}</span>
            </div>
            {taxReturn.qbi_deduction > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">QBI Deduction</span>
                <span className="font-medium">{formatCurrency(taxReturn.qbi_deduction)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Module 3: Self-Employment Tax Optimization
// ============================================

function SelfEmploymentOptimization({
  taxReturn,
}: {
  taxReturn: TaxReturn;
}) {
  const [reasonableSalary, setReasonableSalary] = useState(
    Math.round(taxReturn.se_income * 0.6) // Default to 60% of net profit
  );
  const [complianceCost, setComplianceCost] = useState(3000);

  const netProfit = taxReturn.se_income || 0;

  // SE tax as percentage of net profit
  const seTaxPercent = safeDivide(taxReturn.se_tax, netProfit);

  // Calculate S-Corp savings
  const sCorpAnalysis = useMemo(
    () => calculateSCorpSavings(netProfit, reasonableSalary, complianceCost),
    [netProfit, reasonableSalary, complianceCost]
  );

  // If no self-employment income, show a message
  if (netProfit <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Self-Employment Tax Optimization
          </CardTitle>
          <CardDescription>
            Analyze self-employment tax and S-Corp potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No self-employment income detected.</p>
            <p className="text-sm mt-2">
              This module requires Schedule SE data to analyze optimization opportunities.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Self-Employment Tax Optimization
        </CardTitle>
        <CardDescription>
          Analyze self-employment tax burden and S-Corp break-even
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current SE Tax Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Net SE Income</span>
            <p className="text-2xl font-bold">{formatCurrency(netProfit)}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">SE Tax Paid</span>
            <p className="text-2xl font-bold">{formatCurrency(taxReturn.se_tax)}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">SE Tax Rate</span>
            <p className="text-2xl font-bold">{formatPercent(seTaxPercent)}</p>
            <p className="text-xs text-muted-foreground">of net profit</p>
          </div>
        </div>

        {/* S-Corp Break-Even Estimator */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">S-Corp Break-Even Estimator</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    S-Corps allow splitting income between salary (subject to payroll tax)
                    and distributions (not subject). Requires paying a "reasonable salary."
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Reasonable Salary Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reasonable Salary</span>
              <span className="font-medium">{formatCurrency(reasonableSalary)}</span>
            </div>
            <Slider
              value={[reasonableSalary]}
              onValueChange={([value]) => setReasonableSalary(value)}
              min={Math.round(netProfit * 0.3)}
              max={Math.round(netProfit * 0.9)}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30% of profit</span>
              <span>90% of profit</span>
            </div>
          </div>

          {/* Compliance Cost Input */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Annual Compliance Cost</span>
              <span className="font-medium">{formatCurrency(complianceCost)}</span>
            </div>
            <Slider
              value={[complianceCost]}
              onValueChange={([value]) => setComplianceCost(value)}
              min={1000}
              max={10000}
              step={500}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Includes payroll service, tax prep, and state fees
            </p>
          </div>

          {/* Results */}
          <div className="grid gap-3 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current SE Tax</span>
              <span className="font-medium text-red-600">
                {formatCurrency(sCorpAnalysis.currentSETax)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">S-Corp Payroll Tax</span>
              <span className="font-medium text-orange-600">
                {formatCurrency(sCorpAnalysis.sCorpPayrollTax)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax-Free Distributions</span>
              <span className="font-medium text-green-600">
                {formatCurrency(sCorpAnalysis.distributions)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Compliance Cost</span>
              <span className="font-medium">-{formatCurrency(complianceCost)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">Estimated Annual Savings</span>
              <span
                className={`text-xl font-bold ${
                  sCorpAnalysis.annualSavings > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(sCorpAnalysis.annualSavings)}
              </span>
            </div>
          </div>

          {/* Summary Callout */}
          <div
            className={`p-4 rounded-lg ${
              sCorpAnalysis.breakEven
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            {sCorpAnalysis.breakEven ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">
                    Based on this model, an S-Corp structure may reduce total taxes by
                    approximately {formatCurrency(sCorpAnalysis.annualSavings)} per year.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">
                    At current income levels, S-Corp compliance costs may exceed tax savings.
                    Consider revisiting when net profit exceeds ~$50,000.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Estimates only.</strong> Consult a tax professional before changing
            entity structure. Actual savings depend on state taxes, reasonable compensation
            requirements, and individual circumstances.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Module 4: Quarterly Tax Estimator
// ============================================

function QuarterlyTaxEstimator({
  taxReturn,
}: {
  taxReturn: TaxReturn;
}) {
  const [incomeChangePercent, setIncomeChangePercent] = useState(0);

  // Calculate quarterly estimates
  const estimates = useMemo(
    () =>
      calculateQuarterlyEstimates(
        taxReturn.total_tax,
        taxReturn.agi,
        incomeChangePercent / 100
      ),
    [taxReturn.total_tax, taxReturn.agi, incomeChangePercent]
  );

  // Quarters with due dates
  const quarters = [
    { q: "Q1", period: "Jan-Mar", due: "April 15" },
    { q: "Q2", period: "Apr-May", due: "June 15" },
    { q: "Q3", period: "Jun-Aug", due: "September 15" },
    { q: "Q4", period: "Sep-Dec", due: "January 15" },
  ];

  // Check if prior year had significant underpayment or large refund
  const hadUnderpayment = taxReturn.amount_owed > 1000;
  const hadLargeRefund = taxReturn.refund_amount > 3000;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Quarterly Tax Estimator
        </CardTitle>
        <CardDescription>
          Estimated payments for {taxReturn.tax_year + 1} based on {taxReturn.tax_year} data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warning Alerts */}
        {hadUnderpayment && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Underpayment Warning</p>
              <p className="text-sm text-red-700">
                You owed {formatCurrency(taxReturn.amount_owed)} for {taxReturn.tax_year}.
                Consider increasing quarterly payments to avoid penalties.
              </p>
            </div>
          </div>
        )}

        {hadLargeRefund && (
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Large Refund Note</p>
              <p className="text-sm text-blue-700">
                Your {formatCurrency(taxReturn.refund_amount)} refund means you overpaid.
                Consider reducing estimated payments to keep more cash flow during the year.
              </p>
            </div>
          </div>
        )}

        {/* Income Adjustment Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expected Income Change</span>
            <span className="font-medium">
              {incomeChangePercent > 0 ? "+" : ""}
              {incomeChangePercent}%
            </span>
          </div>
          <Slider
            value={[incomeChangePercent]}
            onValueChange={([value]) => setIncomeChangePercent(value)}
            min={-50}
            max={50}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-50% (Lower income)</span>
            <span>Same</span>
            <span>+50% (Higher income)</span>
          </div>
        </div>

        {/* Safe Harbor Info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Safe Harbor Amount</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Pay at least {estimates.needsHigherSafeHarbor ? "110%" : "100%"} of
                    prior year tax to avoid underpayment penalties, regardless of actual
                    current year liability.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(estimates.safeHarborAmount)}</p>
          <p className="text-sm text-muted-foreground">
            {estimates.needsHigherSafeHarbor
              ? "110% of prior year (AGI > $150k)"
              : "100% of prior year tax"}
          </p>
        </div>

        {/* Quarterly Timeline */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recommended Quarterly Payments</h4>
          <div className="grid gap-3">
            {quarters.map((quarter, idx) => (
              <div
                key={quarter.q}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      idx === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {quarter.q}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{quarter.period}</p>
                    <p className="text-xs text-muted-foreground">Due: {quarter.due}</p>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  {formatCurrency(estimates.quarterlyPayment)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Annual Summary */}
        <div className="grid gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prior Year Tax ({taxReturn.tax_year})</span>
            <span className="font-medium">{formatCurrency(taxReturn.total_tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated {taxReturn.tax_year + 1} Tax</span>
            <span className="font-medium">{formatCurrency(estimates.annualEstimate)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-medium">Total Quarterly Payments</span>
            <span className="text-lg font-bold">
              {formatCurrency(estimates.quarterlyPayment * 4)}
            </span>
          </div>
        </div>

        {/* Assumptions */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">Assumptions:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Income distributed evenly throughout the year</li>
            <li>Tax rates remain consistent with prior year</li>
            <li>No major life changes (marriage, dependents, etc.)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Module 5: Raw Tax Return Data (All Years)
// ============================================

function TaxReturnRawData({
  taxReturns,
}: {
  taxReturns: TaxReturn[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  // Sort returns by year descending
  const sortedReturns = useMemo(
    () => [...taxReturns].sort((a, b) => b.tax_year - a.tax_year),
    [taxReturns]
  );

  // Filter to selected year or show all
  const displayReturns = selectedYear === "all"
    ? sortedReturns
    : sortedReturns.filter(r => r.tax_year === selectedYear);

  // Get fields for a specific tax return
  const getFieldsForReturn = (taxReturn: TaxReturn) => {
    const incomeFields = [
      { label: "Wages (W-2)", key: "wages", value: taxReturn.wages },
      { label: "Interest Income", key: "interest_income", value: taxReturn.interest_income },
      { label: "Dividend Income", key: "dividend_income", value: taxReturn.dividend_income },
      { label: "Qualified Dividends", key: "qualified_dividends", value: taxReturn.qualified_dividends },
      { label: "Capital Gains/Losses", key: "capital_gains", value: taxReturn.capital_gains },
      { label: "IRA Distributions", key: "ira_distributions", value: taxReturn.ira_distributions },
      { label: "Pension Income", key: "pension_income", value: taxReturn.pension_income },
      { label: "Social Security", key: "social_security", value: taxReturn.social_security },
      { label: "Business Income (Sch C)", key: "business_income", value: taxReturn.business_income },
      { label: "Other Income", key: "other_income", value: taxReturn.other_income },
      { label: "Total Income", key: "total_income", value: taxReturn.total_income, isTotal: true },
      { label: "Adjusted Gross Income (AGI)", key: "agi", value: taxReturn.agi, isTotal: true },
    ];

    const deductionFields = [
      { label: "Adjustments to Income", key: "adjustments", value: taxReturn.adjustments },
      { label: "Deduction Type", key: "deduction_type", value: taxReturn.deduction_type, isText: true },
      { label: "Deduction Amount", key: "deduction_amount", value: taxReturn.deduction_amount },
      { label: "QBI Deduction", key: "qbi_deduction", value: taxReturn.qbi_deduction },
      { label: "Taxable Income", key: "taxable_income", value: taxReturn.taxable_income, isTotal: true },
    ];

    const taxPaymentFields = [
      { label: "Total Tax", key: "total_tax", value: taxReturn.total_tax, isTotal: true },
      { label: "Federal Withheld", key: "federal_withheld", value: taxReturn.federal_withheld },
      { label: "Estimated Payments", key: "estimated_payments", value: taxReturn.estimated_payments },
      { label: "Refund Amount", key: "refund_amount", value: taxReturn.refund_amount, isPositive: true },
      { label: "Amount Owed", key: "amount_owed", value: taxReturn.amount_owed, isNegative: true },
      { label: "Effective Tax Rate", key: "effective_tax_rate", value: taxReturn.effective_tax_rate, isPercent: true },
    ];

    const selfEmploymentFields = [
      { label: "SE Income (Net)", key: "se_income", value: taxReturn.se_income },
      { label: "SE Tax", key: "se_tax", value: taxReturn.se_tax },
      { label: "SE Tax Deduction", key: "se_deduction", value: taxReturn.se_deduction },
    ];

    const metadataFields = [
      { label: "Filing Status", value: taxReturn.filing_status.replace(/_/g, " "), isText: true },
      { label: "Source", value: taxReturn.source.replace(/_/g, " "), isText: true },
      { label: "Imported", value: new Date(taxReturn.created_at).toLocaleDateString(), isText: true },
    ];

    return { incomeFields, deductionFields, taxPaymentFields, selfEmploymentFields, metadataFields };
  };

  const renderField = (field: {
    label: string;
    key?: string;
    value: number | string;
    isTotal?: boolean;
    isText?: boolean;
    isPercent?: boolean;
    isPositive?: boolean;
    isNegative?: boolean;
  }) => {
    let displayValue: string;
    let valueClass = "text-right";

    if (field.isText) {
      displayValue = String(field.value);
      valueClass = "text-right capitalize";
    } else if (field.isPercent) {
      displayValue = formatPercent(field.value as number);
    } else {
      displayValue = formatCurrency(field.value as number);
      if (field.isPositive && (field.value as number) > 0) {
        valueClass = "text-right text-green-600";
      } else if (field.isNegative && (field.value as number) > 0) {
        valueClass = "text-right text-red-600";
      }
    }

    return (
      <div
        key={field.label}
        className={`flex justify-between py-1.5 ${field.isTotal ? "font-medium border-t pt-2 mt-1" : ""}`}
      >
        <span className="text-muted-foreground">{field.label}</span>
        <span className={valueClass}>{displayValue}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Tax Return Data
            </CardTitle>
            <CardDescription>
              All imported fields from your tax returns ({taxReturns.length} year{taxReturns.length !== 1 ? "s" : ""})
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : parseInt(e.target.value))}
              className="px-3 py-1.5 text-sm border rounded-md bg-background"
            >
              <option value="all">All Years</option>
              {sortedReturns.map(r => (
                <option key={r.tax_year} value={r.tax_year}>{r.tax_year}</option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {displayReturns.map((taxReturn) => {
          const { incomeFields, deductionFields, taxPaymentFields, selfEmploymentFields, metadataFields } = getFieldsForReturn(taxReturn);

          return (
            <div key={taxReturn.id} className="space-y-4">
              {/* Year Header (only if showing all) */}
              {selectedYear === "all" && (
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-lg">{taxReturn.tax_year}</h3>
                  <span className="text-sm text-muted-foreground capitalize">
                    ({taxReturn.filing_status.replace(/_/g, " ")})
                  </span>
                </div>
              )}

              <div className={`grid gap-6 ${expanded ? "" : "md:grid-cols-2 lg:grid-cols-4"}`}>
                {/* Income Section */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Income
                  </h4>
                  <div className="text-sm space-y-0.5">
                    {incomeFields.map(renderField)}
                  </div>
                </div>

                {/* Deductions Section */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Minus className="h-4 w-4 text-blue-600" />
                    Deductions
                  </h4>
                  <div className="text-sm space-y-0.5">
                    {deductionFields.map(renderField)}
                  </div>
                </div>

                {/* Tax & Payments Section */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-red-600" />
                    Tax & Payments
                  </h4>
                  <div className="text-sm space-y-0.5">
                    {taxPaymentFields.map(renderField)}
                  </div>
                </div>

                {/* Self-Employment Section */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-600" />
                    Self-Employment
                  </h4>
                  <div className="text-sm space-y-0.5">
                    {selfEmploymentFields.map(renderField)}
                  </div>

                  {/* Metadata */}
                  <h4 className="font-medium text-sm flex items-center gap-2 mt-4 pt-4 border-t">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    Metadata
                  </h4>
                  <div className="text-sm space-y-0.5">
                    {metadataFields.map(renderField)}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {taxReturn.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{taxReturn.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ============================================
// Main Dashboard Component
// ============================================

export default function TaxOptimizationPage() {
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tax returns on mount
  useEffect(() => {
    async function fetchTaxReturns() {
      try {
        const response = await fetch("/api/tax-returns");
        if (!response.ok) {
          throw new Error("Failed to fetch tax returns");
        }
        const result = await response.json();
        setTaxReturns(result.data || []);
      } catch (err) {
        console.error("Error fetching tax returns:", err);
        setError("Failed to load tax data");
      } finally {
        setLoading(false);
      }
    }

    fetchTaxReturns();
  }, []);

  // Get most recent tax return for single-year modules
  const mostRecentReturn = useMemo(() => {
    if (taxReturns.length === 0) return null;
    return [...taxReturns].sort((a, b) => b.tax_year - a.tax_year)[0];
  }, [taxReturns]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tax Optimization</h1>
          <p className="text-muted-foreground">Loading your tax data...</p>
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tax Optimization</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (taxReturns.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tax Optimization</h1>
          <p className="text-muted-foreground">
            Insights and modeling for self-employed tax planning
          </p>
        </div>
        <EmptyState />
      </div>
    );
  }

  // Dashboard with data
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tax Optimization</h1>
        <p className="text-muted-foreground">
          Insights and modeling for self-employed tax planning
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <p>
          <strong>Educational estimates only — not tax advice.</strong> Consult a
          qualified tax professional for personalized guidance.
        </p>
      </div>

      {/* Module 1: Tax Health Dashboard */}
      <TaxHealthDashboard taxReturns={taxReturns} />

      {/* Module Grid for remaining modules */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Module 2: Deduction Efficiency Analyzer */}
        <DeductionEfficiencyAnalyzer taxReturn={mostRecentReturn!} />

        {/* Module 3: Self-Employment Tax Optimization */}
        <SelfEmploymentOptimization taxReturn={mostRecentReturn!} />
      </div>

      {/* Module 4: Quarterly Tax Estimator (full width) */}
      <QuarterlyTaxEstimator taxReturn={mostRecentReturn!} />

      {/* Module 5: Raw Tax Return Data (All Years) */}
      <TaxReturnRawData taxReturns={taxReturns} />
    </div>
  );
}
