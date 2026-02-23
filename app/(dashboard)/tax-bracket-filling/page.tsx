"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { TrendingUp, Download, Settings, AlertTriangle, Lightbulb, Target, Edit, Lock, Sparkles } from "lucide-react";
import type { EntitlementTier } from "@/lib/types";

// ========== TypeScript Interfaces ==========

interface YearlyProjection {
  year: number;
  age: number;
  consultingIncome: number;
  rothConversion: number;
  capitalGainsRealized: number;
  withdrawals: number;
  totalIncome: number;
  taxableIncome: number;
  taxesPaid: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  bracketUtilization: number; // % of target bracket filled
  remainingBracketCapacity: number;
  traditionalBalance: number;
  rothBalance: number;
  taxableBalance: number;
  totalPortfolio: number;
  strategyLabel: string;
  healthcareCost: number;
  healthcareSubsidyEligible: boolean;
  irmaaThreshold: boolean;
  isGapYear: boolean;
  isOptimalYear: boolean;
}

type FilingStatus = "single" | "married";
type FutureTaxAssumption = "lower" | "same" | "higher";
type BracketStrategy =
  | "none"
  | "roth-only"
  | "gains-only"
  | "mixed"
  | "variable-income"
  | "gap-year"
  | "feie-exit"
  | "pre-medicare";

interface BracketStrategyDefinition {
  id: string;
  name: string;
  strategy: BracketStrategy;
  description: string;
}

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface IncomeYear {
  year: number;
  income: number;
}

// ========== Tax Constants ==========

const TAX_BRACKETS_2026_SINGLE: TaxBracket[] = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const TAX_BRACKETS_2026_MARRIED: TaxBracket[] = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

const STANDARD_DEDUCTION_2026_SINGLE = 14600;
const STANDARD_DEDUCTION_2026_MARRIED = 29200;

const LONG_TERM_CAPITAL_GAINS_BRACKETS_SINGLE = [
  { min: 0, max: 47025, rate: 0.00 },
  { min: 47025, max: 518900, rate: 0.15 },
  { min: 518900, max: Infinity, rate: 0.20 },
];

const LONG_TERM_CAPITAL_GAINS_BRACKETS_MARRIED = [
  { min: 0, max: 94050, rate: 0.00 },
  { min: 94050, max: 583750, rate: 0.15 },
  { min: 583750, max: Infinity, rate: 0.20 },
];

const ACA_MAGI_LIMIT_SINGLE = 60000;
const ACA_MAGI_LIMIT_MARRIED = 80000;
const IRMAA_THRESHOLD_SINGLE = 106000;
const IRMAA_THRESHOLD_MARRIED = 212000;

const RMD_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
  80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4,
  88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9,
};

// ========== Strategy Definitions ==========

const BRACKET_STRATEGIES: BracketStrategyDefinition[] = [
  {
    id: "none",
    name: "No Optimization (Baseline)",
    strategy: "none",
    description: "Take no proactive tax optimization actions. Use as baseline for comparison.",
  },
  {
    id: "roth-only",
    name: "Bracket Fill with Roth Conversions",
    strategy: "roth-only",
    description: "Fill to target tax bracket using only Roth conversions during low-income years.",
  },
  {
    id: "gains-only",
    name: "Bracket Fill with Capital Gains",
    strategy: "gains-only",
    description: "Harvest long-term capital gains to fill remaining bracket capacity after ordinary income.",
  },
  {
    id: "mixed",
    name: "Mixed Strategy (Conversions + Gains)",
    strategy: "mixed",
    description: "Use both Roth conversions and capital gains harvesting to fully optimize bracket usage.",
  },
  {
    id: "variable-income",
    name: "Variable Income Optimization",
    strategy: "variable-income",
    description: "Maximize bracket filling in low consulting income years, minimize in high income years.",
  },
  {
    id: "gap-year",
    name: "Early Retirement Gap Year Strategy",
    strategy: "gap-year",
    description: "Aggressive bracket filling during gap years between retirement and Social Security/RMDs.",
  },
  {
    id: "feie-exit",
    name: "FEIE Exit Transition Strategy",
    strategy: "feie-exit",
    description: "Strategic bracket filling in first 2-3 years after exiting Foreign Earned Income Exclusion.",
  },
  {
    id: "pre-medicare",
    name: "Pre-Medicare Planning Strategy",
    strategy: "pre-medicare",
    description: "Balance bracket filling with maintaining ACA subsidies and avoiding IRMAA triggers before 65.",
  },
];

// ========== Helper Functions ==========

function getTaxBrackets(filingStatus: FilingStatus): TaxBracket[] {
  return filingStatus === "single" ? TAX_BRACKETS_2026_SINGLE : TAX_BRACKETS_2026_MARRIED;
}

function getStandardDeduction(filingStatus: FilingStatus): number {
  return filingStatus === "single" ? STANDARD_DEDUCTION_2026_SINGLE : STANDARD_DEDUCTION_2026_MARRIED;
}

function getCapitalGainsBrackets(filingStatus: FilingStatus) {
  return filingStatus === "single" ? LONG_TERM_CAPITAL_GAINS_BRACKETS_SINGLE : LONG_TERM_CAPITAL_GAINS_BRACKETS_MARRIED;
}

function calculateFederalTax(taxableIncome: number, brackets: TaxBracket[]): number {
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      tax += taxableInBracket * bracket.rate;
    }
  }
  return tax;
}

function calculateCapitalGainsTax(capitalGains: number, ordinaryIncome: number, filingStatus: FilingStatus): number {
  const brackets = getCapitalGainsBrackets(filingStatus);
  const stackedIncome = ordinaryIncome; // Capital gains stack on top of ordinary income

  let tax = 0;
  let remainingGains = capitalGains;

  for (const bracket of brackets) {
    if (stackedIncome + remainingGains > bracket.min) {
      const gainsInBracket = Math.min(
        Math.max(0, stackedIncome + remainingGains - bracket.min),
        bracket.max - Math.max(stackedIncome, bracket.min)
      );
      tax += gainsInBracket * bracket.rate;
      remainingGains -= gainsInBracket;
    }
    if (remainingGains <= 0) break;
  }

  return tax;
}

function getMarginalTaxRate(income: number, brackets: TaxBracket[]): number {
  for (const bracket of brackets) {
    if (income >= bracket.min && income < bracket.max) {
      return bracket.rate;
    }
  }
  return brackets[brackets.length - 1].rate;
}

function calculateRMD(balance: number, age: number): number {
  if (age < 72) return 0;
  const divisor = RMD_TABLE[age] || RMD_TABLE[95];
  return balance / divisor;
}

function calculateBracketCapacity(
  currentIncome: number,
  targetBracketTop: number,
  standardDeduction: number
): number {
  const adjustedIncome = currentIncome - standardDeduction;
  return Math.max(0, targetBracketTop - adjustedIncome);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// ========== Main Component ==========

export default function TaxBracketFillingPage() {
  // ========== State Management ==========

  // Basic inputs
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [retirementAge, setRetirementAge] = useState<number>(55);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(95);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");

  // Income inputs
  const [baseConsultingIncome, setBaseConsultingIncome] = useState<number>(150000);
  const [incomeVariability, setIncomeVariability] = useState<boolean>(false);
  const [customIncomeSchedule, setCustomIncomeSchedule] = useState<Map<number, number>>(new Map());

  // Account balances
  const [traditionalBalance, setTraditionalBalance] = useState<number>(500000);
  const [rothBalance, setRothBalance] = useState<number>(100000);
  const [taxableBalance, setTaxableBalance] = useState<number>(200000);

  // Spending and returns
  const [annualSpending, setAnnualSpending] = useState<number>(80000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(3);

  // FEIE inputs
  const [feieStartYear, setFeieStartYear] = useState<number | null>(null);
  const [feieEndYear, setFeieEndYear] = useState<number | null>(null);
  const [usReturnYear, setUsReturnYear] = useState<number | null>(null);

  // Healthcare
  const [healthcareCostPreMedicare, setHealthcareCostPreMedicare] = useState<number>(15000);
  const [healthcareCostPostMedicare, setHealthcareCostPostMedicare] = useState<number>(8000);

  // Social Security
  const [socialSecurityStartAge, setSocialSecurityStartAge] = useState<number | null>(67);
  const [socialSecurityAmount, setSocialSecurityAmount] = useState<number>(30000);

  // Strategy inputs
  const [selectedStrategy, setSelectedStrategy] = useState<BracketStrategy>("mixed");
  const [targetBracketTop, setTargetBracketTop] = useState<number>(100525); // 22% bracket top for single
  const [futureTaxAssumption, setFutureTaxAssumption] = useState<FutureTaxAssumption>("same");

  // Years to model
  const [yearsToModel, setYearsToModel] = useState<number>(40);

  // Subscription tier for Pro gating
  const [subscriptionTier, setSubscriptionTier] = useState<EntitlementTier>("free");

  // Update target bracket when filing status changes
  useEffect(() => {
    if (filingStatus === "married") {
      setTargetBracketTop(201050); // 22% bracket top for married
    } else {
      setTargetBracketTop(100525); // 22% bracket top for single
    }
  }, [filingStatus]);

  // Fetch user settings from profile and subscription status
  useEffect(() => {
    async function fetchSettings() {
      try {
        const [settingsRes, subscriptionRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/stripe/subscription"),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.data) {
            const settings = data.data;
            if (settings.current_age) setCurrentAge(settings.current_age);
            if (settings.desired_retirement_age) setRetirementAge(settings.desired_retirement_age);
            if (settings.life_expectancy_assumption) setLifeExpectancy(settings.life_expectancy_assumption);
            if (settings.tax_filing_status) {
              setFilingStatus(settings.tax_filing_status === "married" ? "married" : "single");
            }
          }
        }

        if (subscriptionRes.ok) {
          const subData = await subscriptionRes.json();
          if (subData.entitlement_tier) {
            setSubscriptionTier(subData.entitlement_tier);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    }
    fetchSettings();
  }, []);

  const isPro = subscriptionTier === "pro" || subscriptionTier === "premium";

  // ========== Core Projection Calculations ==========

  const projections = useMemo((): YearlyProjection[] => {
    const results: YearlyProjection[] = [];
    const currentYear = new Date().getFullYear();
    const brackets = getTaxBrackets(filingStatus);
    const standardDeduction = getStandardDeduction(filingStatus);

    let traditionalBal = traditionalBalance;
    let rothBal = rothBalance;
    let taxableBal = taxableBalance;

    const returnRate = expectedReturn / 100;
    const inflationAdjustment = 1 + (inflationRate / 100);

    for (let i = 0; i < yearsToModel; i++) {
      const year = currentYear + i;
      const age = currentAge + i;
      const isRetired = age >= retirementAge;
      const isMedicareAge = age >= 65;
      const isRMDAge = age >= 72;
      const isSocialSecurityAge = socialSecurityStartAge && age >= socialSecurityStartAge;

      // Determine consulting income
      let consultingIncome = 0;
      if (!isRetired) {
        if (customIncomeSchedule.has(year)) {
          consultingIncome = customIncomeSchedule.get(year)!;
        } else {
          consultingIncome = baseConsultingIncome * Math.pow(inflationAdjustment, i);
        }
      }

      // Social Security income
      const socialSecurityIncome = isSocialSecurityAge ? socialSecurityAmount : 0;

      // Calculate RMD
      const rmdAmount = calculateRMD(traditionalBal, age);

      // Base ordinary income before optimization
      let ordinaryIncome = consultingIncome + socialSecurityIncome + rmdAmount;

      // Strategy-specific optimization
      let rothConversion = 0;
      let capitalGainsRealized = 0;
      let withdrawals = 0;

      if (selectedStrategy !== "none") {
        const bracketCapacity = calculateBracketCapacity(ordinaryIncome, targetBracketTop, standardDeduction);

        switch (selectedStrategy) {
          case "roth-only":
            // Fill bracket with Roth conversions only
            if (isRetired && age < 72 && traditionalBal > 0) {
              rothConversion = Math.min(bracketCapacity, traditionalBal);
            }
            break;

          case "gains-only":
            // Harvest capital gains only
            if (taxableBal > 0) {
              // Estimate available gains (assume 30% of balance is gains)
              const availableGains = taxableBal * 0.3;
              capitalGainsRealized = Math.min(bracketCapacity * 0.5, availableGains);
            }
            break;

          case "mixed":
            // Use both Roth and gains
            if (isRetired && age < 72 && traditionalBal > 0) {
              rothConversion = Math.min(bracketCapacity * 0.6, traditionalBal);
            }
            if (taxableBal > 0) {
              const remainingCapacity = bracketCapacity - rothConversion;
              const availableGains = taxableBal * 0.3;
              capitalGainsRealized = Math.min(remainingCapacity * 0.4, availableGains);
            }
            break;

          case "variable-income":
            // More aggressive in low income years
            if (consultingIncome < baseConsultingIncome * 0.7) {
              rothConversion = Math.min(bracketCapacity * 0.8, traditionalBal);
            } else if (consultingIncome > baseConsultingIncome * 1.2) {
              rothConversion = Math.min(bracketCapacity * 0.2, traditionalBal);
            } else {
              rothConversion = Math.min(bracketCapacity * 0.5, traditionalBal);
            }
            break;

          case "gap-year":
            // Aggressive during gap years (retired but before SS/RMDs)
            const isGapYear = isRetired && !isSocialSecurityAge && !isRMDAge;
            if (isGapYear && traditionalBal > 0) {
              rothConversion = Math.min(bracketCapacity * 0.9, traditionalBal);
              const remainingCapacity = bracketCapacity - rothConversion;
              if (taxableBal > 0) {
                const availableGains = taxableBal * 0.3;
                capitalGainsRealized = Math.min(remainingCapacity * 0.5, availableGains);
              }
            }
            break;

          case "feie-exit":
            // Aggressive first 3 years after FEIE exit
            if (usReturnYear && year >= usReturnYear && year < usReturnYear + 3) {
              rothConversion = Math.min(bracketCapacity * 0.85, traditionalBal);
            }
            break;

          case "pre-medicare":
            // Balance optimization with ACA subsidy preservation
            if (!isMedicareAge) {
              const acaLimit = filingStatus === "single" ? ACA_MAGI_LIMIT_SINGLE : ACA_MAGI_LIMIT_MARRIED;
              const safeCapacity = Math.min(bracketCapacity, acaLimit - ordinaryIncome);
              if (safeCapacity > 0 && traditionalBal > 0) {
                rothConversion = Math.min(safeCapacity * 0.6, traditionalBal);
              }
            } else {
              rothConversion = Math.min(bracketCapacity * 0.7, traditionalBal);
            }
            break;
        }
      }

      // Calculate withdrawals if needed for spending
      if (isRetired) {
        const totalNeeded = annualSpending * Math.pow(inflationAdjustment, i - (retirementAge - currentAge));
        // Withdrawal sequencing: taxable first, then traditional, then Roth
        if (taxableBal > 0) {
          withdrawals = Math.min(totalNeeded, taxableBal);
        } else if (traditionalBal > 0) {
          withdrawals = Math.min(totalNeeded, traditionalBal);
        } else {
          withdrawals = Math.min(totalNeeded, rothBal);
        }
      }

      // Total income calculation
      const totalOrdinaryIncome = ordinaryIncome + rothConversion + withdrawals;
      const taxableIncome = Math.max(0, totalOrdinaryIncome - standardDeduction);

      // Tax calculations
      const ordinaryTax = calculateFederalTax(taxableIncome, brackets);
      const capitalGainsTax = calculateCapitalGainsTax(capitalGainsRealized, taxableIncome, filingStatus);
      const totalTaxes = ordinaryTax + capitalGainsTax;

      const effectiveTaxRate = totalOrdinaryIncome > 0 ? (totalTaxes / totalOrdinaryIncome) * 100 : 0;
      const marginalTaxRate = getMarginalTaxRate(taxableIncome, brackets) * 100;

      // Bracket utilization
      const bracketUsed = taxableIncome;
      const bracketUtilizationPct = targetBracketTop > 0 ? Math.min(100, (bracketUsed / targetBracketTop) * 100) : 0;
      const remainingBracketCapacity = Math.max(0, targetBracketTop - bracketUsed);

      // Healthcare checks
      const healthcareCost = isMedicareAge ? healthcareCostPostMedicare : healthcareCostPreMedicare;
      const acaLimit = filingStatus === "single" ? ACA_MAGI_LIMIT_SINGLE : ACA_MAGI_LIMIT_MARRIED;
      const healthcareSubsidyEligible = !isMedicareAge && taxableIncome <= acaLimit;

      const irmaaThreshold = filingStatus === "single" ? IRMAA_THRESHOLD_SINGLE : IRMAA_THRESHOLD_MARRIED;
      const irmaaTriggered = isMedicareAge && taxableIncome > irmaaThreshold;

      // Update balances
      traditionalBal = traditionalBal - rothConversion - rmdAmount - (withdrawals * 0.3);
      traditionalBal = traditionalBal * (1 + returnRate);

      rothBal = rothBal + rothConversion - (withdrawals * 0.3);
      rothBal = rothBal * (1 + returnRate);

      taxableBal = taxableBal - capitalGainsRealized - (withdrawals * 0.4);
      taxableBal = taxableBal * (1 + returnRate);

      const totalPortfolio = traditionalBal + rothBal + taxableBal;

      const isGapYear = isRetired && !isSocialSecurityAge && !isRMDAge;
      const isOptimalYear = bracketUtilizationPct >= 70 && bracketUtilizationPct <= 95 && effectiveTaxRate < 20;

      results.push({
        year,
        age,
        consultingIncome,
        rothConversion,
        capitalGainsRealized,
        withdrawals,
        totalIncome: totalOrdinaryIncome + capitalGainsRealized,
        taxableIncome,
        taxesPaid: totalTaxes,
        effectiveTaxRate,
        marginalTaxRate,
        bracketUtilization: bracketUtilizationPct,
        remainingBracketCapacity,
        traditionalBalance: traditionalBal,
        rothBalance: rothBal,
        taxableBalance: taxableBal,
        totalPortfolio,
        strategyLabel: BRACKET_STRATEGIES.find(s => s.strategy === selectedStrategy)?.name || "Unknown",
        healthcareCost,
        healthcareSubsidyEligible,
        irmaaThreshold: irmaaTriggered,
        isGapYear,
        isOptimalYear,
      });
    }

    return results;
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    filingStatus,
    baseConsultingIncome,
    customIncomeSchedule,
    traditionalBalance,
    rothBalance,
    taxableBalance,
    annualSpending,
    expectedReturn,
    inflationRate,
    socialSecurityStartAge,
    socialSecurityAmount,
    selectedStrategy,
    targetBracketTop,
    yearsToModel,
    healthcareCostPreMedicare,
    healthcareCostPostMedicare,
    usReturnYear,
  ]);

  // ========== Analysis Calculations ==========

  const analysis = useMemo(() => {
    if (projections.length === 0) {
      return {
        underutilizedYears: [],
        optimalYears: [],
        highTaxYears: [],
        lifetimeTaxes: 0,
        avgBracketUtilization: 0,
        totalRothConversions: 0,
        totalCapitalGainsHarvested: 0,
      };
    }

    const underutilizedYears = projections
      .filter(p => p.age >= retirementAge && p.bracketUtilization < 60)
      .map(p => p.year);

    const optimalYears = projections
      .filter(p => p.isOptimalYear)
      .map(p => p.year);

    const highTaxYears = projections
      .filter(p => p.effectiveTaxRate > 25 || p.irmaaThreshold)
      .map(p => p.year);

    const lifetimeTaxes = projections.reduce((sum, p) => sum + p.taxesPaid, 0);
    const avgBracketUtilization = projections.reduce((sum, p) => sum + p.bracketUtilization, 0) / projections.length;
    const totalRothConversions = projections.reduce((sum, p) => sum + p.rothConversion, 0);
    const totalCapitalGainsHarvested = projections.reduce((sum, p) => sum + p.capitalGainsRealized, 0);

    return {
      underutilizedYears,
      optimalYears,
      highTaxYears,
      lifetimeTaxes,
      avgBracketUtilization,
      totalRothConversions,
      totalCapitalGainsHarvested,
    };
  }, [projections, retirementAge]);

  // ========== CSV Export ==========

  const exportToCSV = () => {
    const headers = [
      "Year",
      "Age",
      "Total Income",
      "Consulting Income",
      "Roth Conversion",
      "Capital Gains Realized",
      "Withdrawals",
      "Taxable Income",
      "Taxes Paid",
      "Effective Tax Rate %",
      "Marginal Tax Rate %",
      "Bracket Utilization %",
      "Remaining Capacity",
      "Traditional Balance",
      "Roth Balance",
      "Taxable Balance",
      "Total Portfolio",
      "Strategy",
    ];

    const rows = projections.map(p => [
      p.year,
      p.age,
      p.totalIncome.toFixed(0),
      p.consultingIncome.toFixed(0),
      p.rothConversion.toFixed(0),
      p.capitalGainsRealized.toFixed(0),
      p.withdrawals.toFixed(0),
      p.taxableIncome.toFixed(0),
      p.taxesPaid.toFixed(0),
      p.effectiveTaxRate.toFixed(2),
      p.marginalTaxRate.toFixed(2),
      p.bracketUtilization.toFixed(1),
      p.remainingBracketCapacity.toFixed(0),
      p.traditionalBalance.toFixed(0),
      p.rothBalance.toFixed(0),
      p.taxableBalance.toFixed(0),
      p.totalPortfolio.toFixed(0),
      p.strategyLabel,
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tax-bracket-filling-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // ========== Render ==========

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          Tax Bracket Filling Strategy Engine
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Model multi-year tax optimization using Roth conversions, capital gains harvesting, and income smoothing
        </p>
      </div>

      {/* Educational Guide */}
      <Card className="border border-slate-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            Understanding Tax Bracket Filling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">What Tax Bracket Filling Means</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tax bracket filling is the strategy of intentionally using your available tax bracket space each year to minimize lifetime taxes.
                Our progressive tax system means you pay different rates on different portions of your income. The goal is to avoid leaving
                low-rate bracket space unused in some years while paying high rates in others. By strategically triggering income through
                Roth conversions, capital gains harvesting, or planned withdrawals, you smooth your tax burden across decades.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Why Early Retirees Have Unique Opportunities</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                When you retire early, you create a window of low-income years between leaving work and starting Social Security or RMDs at age 72.
                This gap is your opportunity to fill lower brackets with Roth conversions or capital gains harvesting—a window that closes permanently once floor income begins.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">How to Use This Engine</p>
              <div className="space-y-1.5 text-sm text-slate-600 leading-relaxed">
                <p>1. Enter your financial situation (age, balances, income, filing status)</p>
                <p>2. Set retirement timeline and choose your target tax bracket</p>
                <p>3. Select a strategy and review the visualization</p>
                <p>4. Compare against "No Optimization" baseline to quantify savings</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Key Assumptions</p>
              <div className="space-y-1.5 text-sm text-slate-600 leading-relaxed">
                <p>• Standard deduction used; state taxes and itemized deductions not included</p>
                <p>• Portfolio returns are constant; sequence-of-returns risk not modeled</p>
                <p>• Healthcare subsidies use simplified MAGI thresholds</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Selector */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Settings className="h-4 w-4 text-emerald-600" />
            Select Bracket Filling Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs font-medium text-slate-600">Strategy</Label>
            <Select value={selectedStrategy} onValueChange={(v: BracketStrategy) => setSelectedStrategy(v)}>
              <SelectTrigger className="text-sm mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRACKET_STRATEGIES.map((strategy) => (
                  <SelectItem key={strategy.id} value={strategy.strategy}>
                    {strategy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-600 leading-relaxed">
              {BRACKET_STRATEGIES.find(s => s.strategy === selectedStrategy)?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Input Parameters */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900">Your Financial Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-xs font-medium text-slate-600">Current Age</Label>
                  <Input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600">Retirement Age</Label>
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600">Life Expectancy</Label>
                  <Input
                    type="number"
                    value={lifeExpectancy}
                    onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-600">Filing Status</Label>
                  <Select value={filingStatus} onValueChange={(v: FilingStatus) => setFilingStatus(v)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married Filing Jointly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-600">Traditional IRA Balance</Label>
                  <Input
                    type="number"
                    value={traditionalBalance}
                    onChange={(e) => setTraditionalBalance(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600">Roth IRA Balance</Label>
                  <Input
                    type="number"
                    value={rothBalance}
                    onChange={(e) => setRothBalance(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600">Taxable Brokerage Balance</Label>
                  <Input
                    type="number"
                    value={taxableBalance}
                    onChange={(e) => setTaxableBalance(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-600">Annual Spending Target</Label>
                  <Input
                    type="number"
                    value={annualSpending}
                    onChange={(e) => setAnnualSpending(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600">Expected Portfolio Return (%)</Label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600">Inflation Rate (%)</Label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Income Tab */}
            <TabsContent value="income" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-slate-600">Base Consulting Income</Label>
                  <Input
                    type="number"
                    value={baseConsultingIncome}
                    onChange={(e) => setBaseConsultingIncome(Number(e.target.value))}
                    className="text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">Annual income before retirement</p>
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-600">Social Security Start Age</Label>
                  <Input
                    type="number"
                    value={socialSecurityStartAge || ""}
                    onChange={(e) => setSocialSecurityStartAge(e.target.value ? Number(e.target.value) : null)}
                    className="text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave blank if not planning to claim</p>
                </div>

                {socialSecurityStartAge && (
                  <div>
                    <Label className="text-xs font-medium text-slate-600">Annual Social Security Amount</Label>
                    <Input
                      type="number"
                      value={socialSecurityAmount}
                      onChange={(e) => setSocialSecurityAmount(Number(e.target.value))}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">Income Timeline Note</p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  The engine uses your base consulting income until retirement age, then zeros it out. If you have variable income or
                  part-time work planned during retirement, you can model those scenarios by adjusting the base income or selecting the
                  Variable Income Optimization strategy.
                </p>
              </div>
            </TabsContent>

            {/* Strategy Tab */}
            <TabsContent value="strategy" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-slate-600">Target Bracket Top</Label>
                  <Select
                    value={targetBracketTop.toString()}
                    onValueChange={(v) => setTargetBracketTop(Number(v))}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filingStatus === "single" ? (
                        <>
                          <SelectItem value="11600">10% Bracket ($11,600)</SelectItem>
                          <SelectItem value="47150">12% Bracket ($47,150)</SelectItem>
                          <SelectItem value="100525">22% Bracket ($100,525)</SelectItem>
                          <SelectItem value="191950">24% Bracket ($191,950)</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="23200">10% Bracket ($23,200)</SelectItem>
                          <SelectItem value="94300">12% Bracket ($94,300)</SelectItem>
                          <SelectItem value="201050">22% Bracket ($201,050)</SelectItem>
                          <SelectItem value="383900">24% Bracket ($383,900)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">Most retirees target 12% or 22% bracket</p>
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-600">Future Tax Rate Assumption</Label>
                  <Select value={futureTaxAssumption} onValueChange={(v: FutureTaxAssumption) => setFutureTaxAssumption(v)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lower">Lower than today</SelectItem>
                      <SelectItem value="same">Same as today</SelectItem>
                      <SelectItem value="higher">Higher than today</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-900 mb-1">Strategy Selection Guidance</p>
                <div className="space-y-1.5 text-sm text-amber-700">
                  <p>• <strong>No Optimization:</strong> Use as baseline to measure improvement</p>
                  <p>• <strong>Roth Only:</strong> Best if you have large Traditional IRA and want tax-free growth</p>
                  <p>• <strong>Gains Only:</strong> Best if you have large taxable brokerage with unrealized gains</p>
                  <p>• <strong>Mixed Strategy:</strong> Optimal for most early retirees with both account types</p>
                  <p>• <strong>Variable Income:</strong> For consultants with fluctuating annual income</p>
                  <p>• <strong>Gap Year:</strong> Aggressive optimization during early retirement gap years</p>
                  <p>• <strong>FEIE Exit:</strong> For expats returning to US tax system</p>
                  <p>• <strong>Pre-Medicare:</strong> Balances optimization with ACA subsidy preservation</p>
                </div>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-xs font-medium text-slate-600">Pre-Medicare Healthcare Cost</Label>
                  <Input
                    type="number"
                    value={healthcareCostPreMedicare}
                    onChange={(e) => setHealthcareCostPreMedicare(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-600">Post-Medicare Healthcare Cost</Label>
                  <Input
                    type="number"
                    value={healthcareCostPostMedicare}
                    onChange={(e) => setHealthcareCostPostMedicare(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-600">Years to Model</Label>
                  <Input
                    type="number"
                    value={yearsToModel}
                    onChange={(e) => setYearsToModel(Number(e.target.value))}
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-600">US Return Year (FEIE Exit)</Label>
                  <Input
                    type="number"
                    value={usReturnYear || ""}
                    onChange={(e) => setUsReturnYear(e.target.value ? Number(e.target.value) : null)}
                    className="text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave blank if not applicable</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Main Visualization */}
      {projections.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">Tax Bracket Utilization Over Time</CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              See how income layers stack into tax brackets each year. Green shading shows optimal bracket filling windows.
              Dashed lines mark key thresholds for Medicare, ACA subsidies, and your target bracket.
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={700}>
              <ComposedChart data={projections}>
                <defs>
                  <linearGradient id="consultingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="rothGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="gainsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 14, fontWeight: 600 }}
                  stroke="#94a3b8"
                  tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }}
                />
                <YAxis
                  label={{ value: "Taxable Income ($)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 14, fontWeight: 600 }}
                  stroke="#94a3b8"
                  tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "2px solid #000", borderRadius: "8px", padding: "12px" }}
                  labelStyle={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      const data = payload[0].payload as YearlyProjection;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <p className="font-bold text-sm mb-2">Age {label} ({data.year})</p>
                          <div className="space-y-1 text-xs">
                            {data.consultingIncome > 0 && (
                              <p className="font-semibold text-blue-700">Consulting: {formatCurrency(data.consultingIncome)}</p>
                            )}
                            {data.rothConversion > 0 && (
                              <p className="font-semibold text-purple-700">Roth Conversion: {formatCurrency(data.rothConversion)}</p>
                            )}
                            {data.capitalGainsRealized > 0 && (
                              <p className="font-semibold text-emerald-700">Capital Gains: {formatCurrency(data.capitalGainsRealized)}</p>
                            )}
                            <p className="font-bold text-slate-900 border-t border-slate-300 pt-1 mt-1">
                              Total Income: {formatCurrency(data.totalIncome)}
                            </p>
                            <p className="font-medium text-slate-700">Taxable Income: {formatCurrency(data.taxableIncome)}</p>
                            <p className="font-medium text-slate-700">Taxes Paid: {formatCurrency(data.taxesPaid)}</p>
                            <div className="border-t border-slate-300 pt-1 mt-1">
                              <p className="font-medium text-slate-700">Bracket Used: {data.bracketUtilization.toFixed(0)}%</p>
                              <p className="font-medium text-slate-700">Remaining Capacity: {formatCurrency(data.remainingBracketCapacity)}</p>
                              {data.isGapYear && (
                                <p className="font-bold text-green-700">⭐ Gap Year Opportunity</p>
                              )}
                              {data.irmaaThreshold && (
                                <p className="font-bold text-red-700">⚠ IRMAA Triggered</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "14px", fontWeight: 700 }} />

                {/* Shaded Regions */}
                {/* Gap Years */}
                {projections.filter(p => p.isGapYear).length > 0 && (
                  <ReferenceArea
                    x1={projections.find(p => p.isGapYear)?.age}
                    x2={projections.filter(p => p.isGapYear).slice(-1)[0]?.age}
                    fill="#10b981"
                    fillOpacity={0.08}
                    label={{
                      value: "Gap Years",
                      position: "insideTop",
                      fill: "#059669",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />
                )}

                {/* RMD Years */}
                <ReferenceArea
                  x1={Math.max(72, currentAge)}
                  x2={lifeExpectancy}
                  fill="#94a3b8"
                  fillOpacity={0.06}
                  label={{
                    value: "RMD Years",
                    position: "insideTop",
                    fill: "#64748b",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />

                {/* Reference Lines */}
                <ReferenceLine
                  x={65}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: "Medicare (65)", fill: "#2563eb", fontSize: 12, fontWeight: 700, position: "top" }}
                />

                <ReferenceLine
                  x={retirementAge}
                  stroke="#dc2626"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: "Retirement", fill: "#dc2626", fontSize: 13, fontWeight: 700, position: "top" }}
                />

                {/* Target Bracket Line */}
                <ReferenceLine
                  y={targetBracketTop}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: `Target Bracket (${formatCurrency(targetBracketTop)})`,
                    fill: "#d97706",
                    fontSize: 12,
                    fontWeight: 700,
                    position: "right",
                  }}
                />

                {/* ACA Subsidy Limit */}
                <ReferenceLine
                  y={filingStatus === "single" ? ACA_MAGI_LIMIT_SINGLE : ACA_MAGI_LIMIT_MARRIED}
                  stroke="#10b981"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  label={{
                    value: "ACA Subsidy Limit",
                    fill: "#059669",
                    fontSize: 11,
                    fontWeight: 600,
                    position: "right",
                  }}
                />

                {/* IRMAA Threshold */}
                <ReferenceLine
                  y={filingStatus === "single" ? IRMAA_THRESHOLD_SINGLE : IRMAA_THRESHOLD_MARRIED}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  label={{
                    value: "IRMAA Threshold",
                    fill: "#dc2626",
                    fontSize: 11,
                    fontWeight: 600,
                    position: "right",
                  }}
                />

                {/* Income Layers */}
                <Area
                  type="monotone"
                  dataKey="consultingIncome"
                  stackId="1"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#consultingGradient)"
                  name="Consulting Income"
                />
                <Area
                  type="monotone"
                  dataKey="rothConversion"
                  stackId="1"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#rothGradient)"
                  name="Roth Conversions"
                />
                <Area
                  type="monotone"
                  dataKey="capitalGainsRealized"
                  stackId="1"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#gainsGradient)"
                  name="Capital Gains"
                />

                {/* Bracket Utilization Line */}
                <Line
                  type="monotone"
                  dataKey="taxableIncome"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={false}
                  name="Total Taxable Income"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Advisory Summary */}
      {projections.length > 0 && (
        <Card className={isPro ? "bg-white border border-slate-200 shadow-sm" : "bg-slate-50 border border-slate-200"}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${!isPro ? "text-slate-400" : "text-slate-900"}`}>
              {!isPro && <Lock className="h-4 w-4 text-slate-400" />}
              {isPro && <Lightbulb className="h-4 w-4 text-emerald-600" />}
              Strategy Analysis & Recommendations
              {!isPro && <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">Pro Only</span>}
            </CardTitle>
          </CardHeader>
          {!isPro ? (
            <CardContent>
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 mb-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1.5">Unlock Strategic Analysis</h3>
                <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                  Get personalized recommendations on underutilized tax years, optimal filling windows, lifetime tax savings estimates, and risk assessments.
                </p>
                <Link href="/upgrade">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-6 py-2">
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <CardContent className="space-y-5">
            {/* Underutilized Years */}
            {analysis.underutilizedYears.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  • You have {analysis.underutilizedYears.length} years where tax brackets are significantly underutilized
                </p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Years {analysis.underutilizedYears.slice(0, 5).join(", ")} show bracket utilization below 60%.
                  These are missed opportunities to reduce lifetime taxes through Roth conversions or capital gains harvesting.
                  Consider increasing optimization during these low-income windows.
                </p>
              </div>
            )}

            {/* Optimal Years */}
            {analysis.optimalYears.length > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm font-semibold text-emerald-900 mb-1">
                  • Optimal bracket filling windows identified in {analysis.optimalYears.length} years
                </p>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  Years {analysis.optimalYears.slice(0, 5).join(", ")} show strong bracket utilization (70-95%) with low effective tax rates.
                  These years demonstrate efficient tax planning where you're maximizing bracket usage without triggering higher rates or surcharges.
                </p>
              </div>
            )}

            {/* Lifetime Tax Impact */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                • Estimated lifetime federal taxes under this strategy: {formatCurrency(analysis.lifetimeTaxes)}
              </p>
              <p className="text-sm text-blue-700 leading-relaxed">
                This represents {formatPercent(analysis.avgBracketUtilization)} average bracket utilization across all years.
                {analysis.totalRothConversions > 0 && ` Total Roth conversions: ${formatCurrency(analysis.totalRothConversions)}.`}
                {analysis.totalCapitalGainsHarvested > 0 && ` Total capital gains harvested: ${formatCurrency(analysis.totalCapitalGainsHarvested)}.`}
                Compare this against the "No Optimization" baseline to quantify tax savings.
              </p>
            </div>

            {/* High Tax Risk Years */}
            {analysis.highTaxYears.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-900 mb-1">
                  • High tax risk detected in {analysis.highTaxYears.length} years
                </p>
                <p className="text-sm text-red-700 leading-relaxed">
                  Years {analysis.highTaxYears.slice(0, 5).join(", ")} show effective tax rates above 25% or trigger IRMAA surcharges.
                  Review these years carefully. You may be converting or harvesting too aggressively, or income stacking is creating unintended consequences.
                  Consider reducing optimization amounts or timing conversions differently.
                </p>
              </div>
            )}

            {/* Portfolio Impact */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-semibold text-purple-900 mb-1">
                • Impact on retirement portfolio allocation and future flexibility
              </p>
              <p className="text-sm text-purple-700 leading-relaxed">
                {analysis.totalRothConversions > 0
                  ? `Converting ${formatCurrency(analysis.totalRothConversions)} to Roth over time reduces future RMD exposure and creates tax-free withdrawal flexibility during retirement. This allows precise income control in your 70s and 80s.`
                  : "With minimal Roth conversions, you'll face larger RMDs starting at age 72, which may push you into higher brackets regardless of your actual spending needs."}
              </p>
            </div>

            {/* Healthcare Subsidy Impact */}
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-sm font-semibold text-indigo-900 mb-1">
                • Healthcare subsidy and Medicare premium considerations
              </p>
              <p className="text-sm text-indigo-700 leading-relaxed">
                {(() => {
                  const subsidyYears = projections.filter(p => p.age < 65 && p.healthcareSubsidyEligible).length;
                  const irmaaYears = projections.filter(p => p.irmaaThreshold).length;
                  if (subsidyYears > 0) {
                    return `You maintain ACA subsidy eligibility in ${subsidyYears} pre-Medicare years. Be cautious not to over-optimize and lose valuable subsidies worth $5k-$15k annually.`;
                  }
                  if (irmaaYears > 0) {
                    return `IRMAA surcharges are triggered in ${irmaaYears} years. Remember: IRMAA uses a 2-year lookback, so high-income years at 63-64 affect Medicare costs at 65-66. Consider reducing conversions before age 63.`;
                  }
                  return "Your income levels don't trigger significant healthcare subsidy or IRMAA concerns under this strategy.";
                })()}
              </p>
            </div>

            {/* Future Tax Rate Sensitivity */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm font-semibold text-slate-900 mb-1">
                • Sensitivity to future tax rate changes
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {futureTaxAssumption === "higher"
                  ? "You're assuming higher future tax rates, which strongly favors aggressive bracket filling now. Every dollar converted at today's 12-22% rates could avoid 15-28%+ rates later if Congress allows TCJA provisions to sunset."
                  : futureTaxAssumption === "lower"
                  ? "You're assuming lower future tax rates, which reduces the urgency of bracket filling. Be sure this assumption is grounded in realistic policy expectations, as most advisors anticipate rate increases given federal debt levels."
                  : "You're assuming tax rates remain constant. This is a neutral assumption but may be optimistic. Consider testing scenarios with higher future rates to stress-test your strategy."}
              </p>
            </div>
          </CardContent>
          )}
        </Card>
      )}

      {/* Year-by-Year Table */}
      {projections.length > 0 && (
        <Card className={isPro ? "bg-white border border-slate-200 shadow-sm" : "bg-slate-50 border border-slate-200"}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${!isPro ? "text-slate-400" : "text-slate-900"}`}>
              {!isPro && <Lock className="h-4 w-4 text-slate-400" />}
              Detailed Year-by-Year Projection
              {!isPro && <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">Pro Only</span>}
            </CardTitle>
            {isPro && (
              <Button onClick={exportToCSV} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export CSV
              </Button>
            )}
          </CardHeader>
          {!isPro ? (
            <CardContent>
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 mb-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1.5">Unlock Detailed Projections</h3>
                <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                  Get complete year-by-year breakdowns with income, conversions, gains realized, taxes paid, and full account balance tracking.
                </p>
                <Link href="/upgrade">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-6 py-2">
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow className="border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700 text-xs">Year</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Age</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Total Income</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Consulting</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Roth Conv.</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Cap. Gains</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Withdrawals</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Taxable Income</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Taxes Paid</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Eff. Tax %</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Bracket Use %</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Remaining Cap.</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Traditional</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Roth</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Taxable</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Total Portfolio</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-xs">Strategy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projections.map((p, idx) => {
                    let rowClass = "";
                    if (p.isOptimalYear) {
                      rowClass = "bg-emerald-50";
                    } else if (p.irmaaThreshold) {
                      rowClass = "bg-red-50";
                    } else if (p.bracketUtilization < 50 && p.age >= retirementAge) {
                      rowClass = "bg-amber-50";
                    }

                    return (
                      <TableRow key={idx} className={rowClass}>
                        <TableCell className="font-semibold">{p.year}</TableCell>
                        <TableCell className="font-semibold">{p.age}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.totalIncome)}</TableCell>
                        <TableCell className="font-semibold">{p.consultingIncome > 0 ? formatCurrency(p.consultingIncome) : "—"}</TableCell>
                        <TableCell className="font-semibold">{p.rothConversion > 0 ? formatCurrency(p.rothConversion) : "—"}</TableCell>
                        <TableCell className="font-semibold">{p.capitalGainsRealized > 0 ? formatCurrency(p.capitalGainsRealized) : "—"}</TableCell>
                        <TableCell className="font-semibold">{p.withdrawals > 0 ? formatCurrency(p.withdrawals) : "—"}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.taxableIncome)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.taxesPaid)}</TableCell>
                        <TableCell className="font-semibold">{formatPercent(p.effectiveTaxRate)}</TableCell>
                        <TableCell className="font-semibold">{formatPercent(p.bracketUtilization)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.remainingBracketCapacity)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.traditionalBalance)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.rothBalance)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.taxableBalance)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.totalPortfolio)}</TableCell>
                        <TableCell className="font-semibold text-xs">{p.strategyLabel}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <p className="font-semibold">Row highlighting:</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-50 border border-emerald-200"></div>
                  <span>Optimal bracket filling year</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-50 border border-amber-200"></div>
                  <span>Underutilized bracket (retirement years)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-50 border border-red-200"></div>
                  <span>IRMAA surcharge triggered</span>
                </div>
              </div>
            </div>
          </CardContent>
          )}
        </Card>
      )}

      {/* Educational Panels */}
      {isPro && (
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 border border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-blue-900">Why Gradual Bracket Filling Reduces Lifetime Taxes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 leading-relaxed">
              Progressive taxation means your effective rate increases as income rises. By intentionally filling lower brackets each year instead
              of taking large distributions later, you minimize the amount of income taxed at higher marginal rates. A $50k conversion at 12%
              is far better than a $50k RMD at 24%. Over 20-30 years, this compounds to six-figure tax savings.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border border-purple-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-purple-900">How Variable Income Impacts Bracket Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700 leading-relaxed">
              Consultants and freelancers with fluctuating income should maximize bracket filling in low-earning years. A year with $80k income
              leaves room to fill the 12% or 22% bracket with conversions. A $200k year does not. By front-loading conversions during lean years,
              you use bracket space that would otherwise go to waste while avoiding high-rate conversions during peak income years.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border border-emerald-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-emerald-900">Why Early Retirement Gap Years Are So Valuable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-700 leading-relaxed">
              The 5-15 years between early retirement (age 50-60) and Social Security/RMDs (age 67-72) represent your peak optimization window.
              With no earned income, no required distributions, and potentially no Social Security, your taxable income is just what you choose
              to withdraw. This creates artificially low income years where you can fill the 12% and 22% brackets almost entirely with Roth
              conversions or capital gains harvesting. This window closes permanently once floor income begins.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 border border-indigo-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-indigo-900">How FEIE Transitions Change Tax Stacking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-indigo-700 leading-relaxed">
              If you've been using the Foreign Earned Income Exclusion and plan to return to the US tax system, your first 2-3 years back create
              unique opportunities. You may have minimal US income initially while re-establishing, combined with large Traditional IRA balances
              that were never optimized. Aggressive Roth conversions during these transition years can dramatically reduce future RMD exposure
              before normal income resumes.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border border-amber-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-amber-900">Pre-Medicare Income Planning Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 leading-relaxed">
              Before age 65, you must balance bracket filling with ACA marketplace subsidy preservation. Exceeding MAGI thresholds ($60k single,
              $80k married) eliminates subsidies worth $5k-$15k annually. Additionally, high income at ages 63-64 triggers IRMAA surcharges
              at 65-66 due to the 2-year lookback. Strategic bracket filling pre-65 means staying just below subsidy cliffs while maximizing
              optimization, then ramping up conversions after Medicare enrollment.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border border-red-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-red-900">Common Bracket Filling Mistakes to Avoid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 text-sm text-red-700 leading-relaxed">
              <p>• <strong>Converting too much in one year:</strong> Jumping tax brackets negates the benefit</p>
              <p>• <strong>Ignoring healthcare subsidies:</strong> A $1 income increase can cost thousands in lost subsidies</p>
              <p>• <strong>Triggering IRMAA before Medicare:</strong> High income at 63 means surcharges at 65</p>
              <p>• <strong>Not planning for RMDs:</strong> Waiting until 72 means forced high-tax distributions</p>
              <p>• <strong>Forgetting capital gains stacking:</strong> Gains stack on top of ordinary income, affecting rates</p>
              <p>• <strong>Over-depleting taxable accounts:</strong> You still need money to live on</p>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Disclaimer */}
      <Card className="bg-slate-50 border border-slate-200">
        <CardContent className="pt-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong> This Tax Bracket Filling Strategy Engine is an educational financial modeling tool for planning purposes only.
            It is not personalized tax, legal, or investment advice. Tax laws are complex, change frequently, and vary by jurisdiction. Individual
            circumstances differ significantly. The projections shown are based on assumptions you provide and simplified calculations that may not
            reflect your actual tax liability, investment returns, or financial outcomes. This tool does not account for state taxes, alternative
            minimum tax, net investment income tax, capital gains basis tracking, Roth conversion pro-rata rules, or many other factors that affect
            your specific situation. Before implementing any tax optimization strategy, consult with a qualified tax advisor, CPA, or financial
            planner who understands your complete financial picture. The creators of this tool are not responsible for any financial decisions made
            based on its output.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
