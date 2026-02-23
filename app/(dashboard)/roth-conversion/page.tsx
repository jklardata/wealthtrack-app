"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { TrendingUp, Download, ArrowRight, AlertTriangle, Lightbulb, Calculator, Settings, Lock, Sparkles } from "lucide-react";
import type { EntitlementTier } from "@/lib/types";

interface YearlyProjection {
  year: number;
  age: number;
  conversionAmount: number;
  taxableIncome: number;
  estimatedTaxes: number;
  traditionalBalance: number;
  rothBalance: number;
  taxableBalance: number;
  totalPortfolio: number;
  withdrawalAmount: number;
  effectiveTaxRate: number;
  rmdAmount: number;
  // New fields for enhanced modeling
  income: number;
  healthcareCost: number;
  healthcareSubsidyEligible: boolean;
  irmaaThreshold: boolean;
  marginalTaxRate: number;
  scenarioLabel: string;
}

interface ConversionAnalysis {
  optimalYears: number[];
  lifetimeTaxSavings: number;
  breakEvenYear: number;
  rmdReduction: number;
  avgEffectiveTaxRate: number;
}

// New types for multi-scenario engine
type ConversionStrategy =
  | "none"
  | "fixed"
  | "bracket-fill"
  | "variable-optimized"
  | "gap-year"
  | "feie-transition"
  | "pre-medicare";

interface ConversionScenario {
  id: string;
  name: string;
  strategy: ConversionStrategy;
  description: string;
  parameters: {
    fixedAmount?: number;
    bracketTarget?: number;
    startYear?: number;
    endYear?: number;
    feieReturnYear?: number;
    medicareTargetIncome?: number;
  };
}

interface ScenarioComparison {
  scenarioId: string;
  scenarioName: string;
  lifetimeTaxPaid: number;
  lifetimeTaxSavings: number;
  finalTraditionalBalance: number;
  finalRothBalance: number;
  averageEffectiveRate: number;
  rmdReduction: number;
  conversionYears: number[];
  optimalityScore: number;
}

type TaxBracket = { min: number; max: number; rate: number };
type FilingStatus = "single" | "married";

const TAX_BRACKETS_2026: TaxBracket[] = [
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

// Healthcare subsidy and IRMAA thresholds (2026 estimates)
const ACA_MAGI_LIMIT_SINGLE = 60000;
const ACA_MAGI_LIMIT_MARRIED = 80000;
const IRMAA_THRESHOLD_SINGLE = 106000;
const IRMAA_THRESHOLD_MARRIED = 212000;

function calculateFederalTax(income: number, brackets = TAX_BRACKETS_2026): number {
  let tax = 0;
  let remainingIncome = income;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const taxableInBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );

    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }

    if (remainingIncome <= 0) break;
  }

  return tax;
}

function calculateRMD(balance: number, age: number): number {
  // Simplified RMD calculation based on IRS Uniform Lifetime Table
  const rmdFactors: Record<number, number> = {
    72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9,
    78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7,
    84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9,
    90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9,
  };

  if (age < 72) return 0;
  if (age > 95) return balance / 8.9;

  const factor = rmdFactors[age] || 8.9;
  return balance / factor;
}

// New helper functions for enhanced modeling

function getMarginalTaxRate(income: number, brackets: TaxBracket[]): number {
  for (const bracket of brackets) {
    if (income >= bracket.min && income < bracket.max) {
      return bracket.rate;
    }
  }
  return brackets[brackets.length - 1].rate;
}

function checkHealthcareSubsidyEligibility(
  magi: number,
  filingStatus: FilingStatus
): { eligible: boolean; incomeLimit: number } {
  const limit = filingStatus === "single" ? ACA_MAGI_LIMIT_SINGLE : ACA_MAGI_LIMIT_MARRIED;
  return {
    eligible: magi <= limit,
    incomeLimit: limit,
  };
}

function checkIRMAAThreshold(
  magi: number,
  filingStatus: FilingStatus
): { triggered: boolean; threshold: number } {
  const threshold = filingStatus === "single" ? IRMAA_THRESHOLD_SINGLE : IRMAA_THRESHOLD_MARRIED;
  return {
    triggered: magi > threshold,
    threshold,
  };
}

function calculateBracketFillConversion(
  baseIncome: number,
  targetBracketTop: number,
  traditionalBalance: number,
  brackets: TaxBracket[]
): number {
  // Find current bracket
  let currentBracket = brackets[0];
  for (const bracket of brackets) {
    if (baseIncome >= bracket.min && baseIncome < bracket.max) {
      currentBracket = bracket;
      break;
    }
  }

  // Calculate room in current bracket
  const roomInBracket = Math.min(currentBracket.max - baseIncome, targetBracketTop - baseIncome);

  // Don't convert more than available balance
  return Math.min(Math.max(0, roomInBracket), traditionalBalance);
}

function getTaxBrackets(filingStatus: FilingStatus): TaxBracket[] {
  return filingStatus === "single" ? TAX_BRACKETS_2026 : TAX_BRACKETS_2026_MARRIED;
}

// Scenario definitions for user selection
const CONVERSION_SCENARIOS: ConversionScenario[] = [
  {
    id: "none",
    name: "No Conversions (Baseline)",
    strategy: "none",
    description: "Make no Roth conversions. Use as baseline to compare other strategies.",
    parameters: {},
  },
  {
    id: "fixed",
    name: "Fixed Annual Conversion",
    strategy: "fixed",
    description: "Convert a fixed dollar amount each year until retirement.",
    parameters: { fixedAmount: 50000 },
  },
  {
    id: "bracket-fill",
    name: "Tax Bracket Fill",
    strategy: "bracket-fill",
    description: "Convert just enough to fill your current tax bracket without crossing into the next bracket.",
    parameters: { bracketTarget: 100525 },
  },
  {
    id: "gap-year",
    name: "Gap Year Optimization",
    strategy: "gap-year",
    description: "Maximize conversions during low-income years between retirement and Social Security.",
    parameters: {},
  },
  {
    id: "variable-optimized",
    name: "Variable Income Optimized",
    strategy: "variable-optimized",
    description: "Adapt conversion amounts based on your variable income each year.",
    parameters: {},
  },
  {
    id: "feie-transition",
    name: "FEIE Return Transition",
    strategy: "feie-transition",
    description: "Aggressive conversions in the first 2-3 years after exiting FEIE.",
    parameters: {},
  },
  {
    id: "pre-medicare",
    name: "Pre-Medicare Income Planning",
    strategy: "pre-medicare",
    description: "Keep income below thresholds to maintain ACA subsidies and avoid IRMAA.",
    parameters: { medicareTargetIncome: 75000 },
  },
];

export default function RothConversionPage() {
  // User inputs
  const [currentAge, setCurrentAge] = useState<number | null>(35);
  const [retirementAge, setRetirementAge] = useState(55);
  const [lifeExpectancy, setLifeExpectancy] = useState(95);
  const [traditionalBalance, setTraditionalBalance] = useState(500000);
  const [rothBalance, setRothBalance] = useState(50000);
  const [taxableBalance, setTaxableBalance] = useState(100000);
  const [annualSpending, setAnnualSpending] = useState(60000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [currentTaxBracket, setCurrentTaxBracket] = useState(0.24);
  const [earlyRetirementIncome, setEarlyRetirementIncome] = useState(20000);
  const [annualConversion, setAnnualConversion] = useState(50000);
  const [yearsToModel, setYearsToModel] = useState(40);
  const [inflationRate, setInflationRate] = useState(3);
  const [futureTaxAssumption, setFutureTaxAssumption] = useState<"higher" | "same" | "lower">("same");

  // New Phase 1 state variables
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [healthcareCostPreMedicare, setHealthcareCostPreMedicare] = useState(15000);
  const [healthcareCostPostMedicare, setHealthcareCostPostMedicare] = useState(8000);
  const [selectedStrategy, setSelectedStrategy] = useState<ConversionStrategy>("fixed");

  // Subscription tier for Pro gating
  const [subscriptionTier, setSubscriptionTier] = useState<EntitlementTier>("free");

  // Fetch user settings and subscription status
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

  // Calculate projections
  const projections = useMemo((): YearlyProjection[] => {
    if (!currentAge) return [];

    const results: YearlyProjection[] = [];
    let trad = traditionalBalance;
    let roth = rothBalance;
    let taxable = taxableBalance;

    // Get tax brackets based on filing status
    const baseBrackets = getTaxBrackets(filingStatus);

    // Adjust future tax brackets
    let futureBrackets = baseBrackets;
    if (futureTaxAssumption === "higher") {
      futureBrackets = baseBrackets.map(b => ({ ...b, rate: b.rate * 1.15 }));
    } else if (futureTaxAssumption === "lower") {
      futureBrackets = baseBrackets.map(b => ({ ...b, rate: b.rate * 0.85 }));
    }

    for (let i = 0; i < yearsToModel; i++) {
      const age = currentAge + i;
      const year = new Date().getFullYear() + i;
      const isRetired = age >= retirementAge;
      const isConversionYear = !isRetired && annualConversion > 0 && trad > 0;

      // Conversion logic
      const conversionAmount = isConversionYear ? Math.min(annualConversion, trad) : 0;

      // Income calculation
      let taxableIncome = isRetired ? 0 : earlyRetirementIncome;
      taxableIncome += conversionAmount;

      // RMD calculation
      const rmdAmount = calculateRMD(trad, age);
      if (rmdAmount > 0) {
        taxableIncome += rmdAmount;
      }

      // Withdrawal calculation
      let withdrawalAmount = 0;
      if (isRetired) {
        const inflationAdjustedSpending = annualSpending * Math.pow(1 + inflationRate / 100, i);
        withdrawalAmount = inflationAdjustedSpending;

        // Withdrawal sequence: Taxable first, then Traditional, then Roth
        if (taxable >= withdrawalAmount) {
          taxable -= withdrawalAmount;
        } else {
          withdrawalAmount -= taxable;
          taxable = 0;

          if (trad >= withdrawalAmount) {
            trad -= withdrawalAmount;
            taxableIncome += withdrawalAmount;
            withdrawalAmount = 0;
          } else {
            taxableIncome += trad;
            withdrawalAmount -= trad;
            trad = 0;

            roth -= withdrawalAmount;
          }
        }
      }

      // Tax calculation
      const estimatedTaxes = calculateFederalTax(taxableIncome, futureBrackets);
      const effectiveTaxRate = taxableIncome > 0 ? (estimatedTaxes / taxableIncome) * 100 : 0;
      const marginalTaxRate = getMarginalTaxRate(taxableIncome, futureBrackets);

      // Healthcare calculations
      const healthcareCost = age < 65 ? healthcareCostPreMedicare : healthcareCostPostMedicare;
      const subsidyCheck = checkHealthcareSubsidyEligibility(taxableIncome, filingStatus);
      const irmaaCheck = checkIRMAAThreshold(taxableIncome, filingStatus);

      // After-tax conversion and RMD
      if (conversionAmount > 0) {
        trad -= conversionAmount;
        roth += conversionAmount;
      }

      if (rmdAmount > 0 && !isRetired) {
        trad -= rmdAmount;
        taxable += rmdAmount - calculateFederalTax(rmdAmount, futureBrackets);
      }

      // Growth
      const returnRate = expectedReturn / 100;
      trad *= (1 + returnRate);
      roth *= (1 + returnRate);
      taxable *= (1 + returnRate);

      results.push({
        year,
        age,
        conversionAmount,
        taxableIncome,
        estimatedTaxes,
        traditionalBalance: Math.max(0, trad),
        rothBalance: Math.max(0, roth),
        taxableBalance: Math.max(0, taxable),
        totalPortfolio: Math.max(0, trad + roth + taxable),
        withdrawalAmount,
        effectiveTaxRate,
        rmdAmount,
        // New Phase 1 fields
        income: isRetired ? 0 : earlyRetirementIncome,
        healthcareCost,
        healthcareSubsidyEligible: subsidyCheck.eligible,
        irmaaThreshold: irmaaCheck.triggered,
        marginalTaxRate: marginalTaxRate * 100,
        scenarioLabel: selectedStrategy,
      });
    }

    return results;
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    traditionalBalance,
    rothBalance,
    taxableBalance,
    annualSpending,
    expectedReturn,
    earlyRetirementIncome,
    annualConversion,
    yearsToModel,
    inflationRate,
    futureTaxAssumption,
    filingStatus,
    healthcareCostPreMedicare,
    healthcareCostPostMedicare,
    selectedStrategy,
  ]);

  // Analysis
  const analysis = useMemo((): ConversionAnalysis => {
    if (projections.length === 0) {
      return {
        optimalYears: [],
        lifetimeTaxSavings: 0,
        breakEvenYear: 0,
        rmdReduction: 0,
        avgEffectiveTaxRate: 0,
      };
    }

    // Find optimal conversion years (low tax rate years)
    const optimalYears = projections
      .filter(p => p.conversionAmount > 0 && p.effectiveTaxRate < 20)
      .map(p => p.year);

    // Calculate lifetime taxes
    const lifetimeTaxes = projections.reduce((sum, p) => sum + p.estimatedTaxes, 0);

    // Estimate tax savings vs no conversion scenario
    const noConversionTaxes = projections.reduce((sum, p) => {
      if (p.rmdAmount > 0) {
        return sum + calculateFederalTax(p.rmdAmount + (p.withdrawalAmount || 0));
      }
      return sum;
    }, 0);

    const lifetimeTaxSavings = noConversionTaxes - lifetimeTaxes;

    // Break-even calculation
    let cumulativeTaxPaid = 0;
    let cumulativeTaxSaved = 0;
    let breakEvenYear = 0;

    for (const p of projections) {
      cumulativeTaxPaid += p.estimatedTaxes;
      cumulativeTaxSaved += (p.rmdAmount * 0.24); // Rough estimate

      if (cumulativeTaxSaved > cumulativeTaxPaid && breakEvenYear === 0) {
        breakEvenYear = p.year;
      }
    }

    // RMD reduction
    const finalTraditional = projections[projections.length - 1]?.traditionalBalance || 0;
    const rmdReduction = ((traditionalBalance - finalTraditional) / traditionalBalance) * 100;

    // Average effective tax rate
    const totalIncome = projections.reduce((sum, p) => sum + p.taxableIncome, 0);
    const totalTaxes = projections.reduce((sum, p) => sum + p.estimatedTaxes, 0);
    const avgEffectiveTaxRate = totalIncome > 0 ? (totalTaxes / totalIncome) * 100 : 0;

    return {
      optimalYears,
      lifetimeTaxSavings,
      breakEvenYear,
      rmdReduction,
      avgEffectiveTaxRate,
    };
  }, [projections, traditionalBalance]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const exportToCSV = () => {
    const headers = [
      "Year",
      "Age",
      "Income",
      "Conversion Amount",
      "Taxable Income",
      "Estimated Taxes",
      "Effective Tax Rate %",
      "Marginal Tax Rate %",
      "Healthcare Cost",
      "ACA Subsidy Eligible",
      "IRMAA Triggered",
      "Traditional Balance",
      "Roth Balance",
      "Taxable Balance",
      "Total Portfolio",
      "Withdrawal Amount",
      "RMD Amount",
      "Scenario",
    ];

    const rows = projections.map(p => [
      p.year,
      p.age,
      p.income,
      p.conversionAmount,
      p.taxableIncome,
      p.estimatedTaxes,
      p.effectiveTaxRate.toFixed(2),
      p.marginalTaxRate.toFixed(2),
      p.healthcareCost,
      p.age < 65 ? (p.healthcareSubsidyEligible ? "Yes" : "No") : "N/A",
      p.age >= 65 ? (p.irmaaThreshold ? "Yes" : "No") : "N/A",
      p.traditionalBalance,
      p.rothBalance,
      p.taxableBalance,
      p.totalPortfolio,
      p.withdrawalAmount,
      p.rmdAmount,
      p.scenarioLabel,
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roth-conversion-analysis.csv";
    a.click();
  };

  return (
    <div className="space-y-5 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Roth Conversion Optimizer
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Model conversion strategies to minimize lifetime taxes and maximize after-tax retirement wealth
        </p>
      </div>

      {/* Advisory Introduction */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-slate-200">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Understanding Roth Conversions</h2>

          <p className="text-base font-medium text-slate-800 leading-relaxed">
            A Roth conversion is when you move money from a traditional IRA or pre-tax retirement account into a Roth IRA. You pay taxes on the converted amount now, but in exchange, that money grows tax-free forever and you never pay taxes on qualified withdrawals. For early retirees, this creates a powerful opportunity.
          </p>

          <p className="text-base font-medium text-slate-800 leading-relaxed">
            Here's why this matters for your plan: Once you retire early but before you start Social Security or required minimum distributions, you likely have several years of low taxable income. These are golden years for conversions—you can fill up the lower tax brackets with conversions at rates you'll never see again. You're essentially prepaying taxes at 12% or 22% to avoid paying 24% or 32% later when RMDs kick in.
          </p>

          <h3 className="text-sm font-semibold text-slate-900 mt-6">How to Use This Tool</h3>

          <p className="text-base font-medium text-slate-800 leading-relaxed">
            Start by entering your current account balances and retirement assumptions below. The tool will project your account balances year by year, showing exactly when conversions make sense and how much tax you'll pay. Pay special attention to the years between early retirement and age 72—this is your conversion window.
          </p>

          <div className="space-y-2">
            <p className="text-base font-bold text-slate-900">• Tax bracket management:</p>
            <p className="text-base font-medium text-slate-700 pl-4">
              Convert just enough each year to stay within your target tax bracket. Going from 12% to 22% might still make sense, but jumping to 32% rarely does.
            </p>

            <p className="text-base font-bold text-slate-900">• Timing matters:</p>
            <p className="text-base font-medium text-slate-700 pl-4">
              The best conversion years are when your income is lowest—typically the first few years of early retirement before Social Security or pension income begins.
            </p>

            <p className="text-base font-bold text-slate-900">• Future withdrawals:</p>
            <p className="text-base font-medium text-slate-700 pl-4">
              Money in your Roth IRA gives you tax-free income flexibility later. Unlike traditional IRAs, Roth accounts have no required minimum distributions during your lifetime.
            </p>

            <p className="text-base font-bold text-slate-900">• What we're assuming:</p>
            <p className="text-base font-medium text-slate-700 pl-4">
              This model assumes current tax law continues, uses today's tax brackets adjusted for inflation, and estimates your investment returns based on the rate you specify. We're modeling federal taxes only—state taxes may add 3-8% depending on where you live.
            </p>
          </div>

          <div className="mt-6 p-4 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1.5">Critical Decision Points</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Watch for years where your effective tax rate spikes—those are years to reduce conversions. The visualization below will highlight optimal conversion windows in green. If future tax rates increase (as many advisors expect), converting now becomes even more valuable.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Selector */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-600" />
            Select Conversion Strategy
          </CardTitle>
          <p className="text-base font-medium text-slate-600 mt-2">
            Choose a conversion strategy to model. Each strategy optimizes for different retirement scenarios.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-bold">Conversion Strategy</Label>
            <Select value={selectedStrategy} onValueChange={(v: ConversionStrategy) => setSelectedStrategy(v)}>
              <SelectTrigger className="text-base font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONVERSION_SCENARIOS.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.strategy}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-lg">
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              {CONVERSION_SCENARIOS.find(s => s.strategy === selectedStrategy)?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Input Parameters */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-600" />
            Your Conversion Scenario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="font-bold">Basic Inputs</TabsTrigger>
              <TabsTrigger value="advanced" className="font-bold">Advanced</TabsTrigger>
              <TabsTrigger value="healthcare" className="font-bold">Healthcare</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-base font-bold">Current Age</Label>
                  <Input
                    type="number"
                    value={currentAge || ""}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-base font-bold">Target Retirement Age</Label>
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-base font-bold">Life Expectancy</Label>
                  <Input
                    type="number"
                    value={lifeExpectancy}
                    onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>

                <div>
                  <Label className="text-base font-bold">Traditional IRA Balance</Label>
                  <Input
                    type="number"
                    value={traditionalBalance}
                    onChange={(e) => setTraditionalBalance(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-base font-bold">Current Roth Balance</Label>
                  <Input
                    type="number"
                    value={rothBalance}
                    onChange={(e) => setRothBalance(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-base font-bold">Taxable Brokerage Balance</Label>
                  <Input
                    type="number"
                    value={taxableBalance}
                    onChange={(e) => setTaxableBalance(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>

                <div>
                  <Label className="text-base font-bold">Annual Spending in Retirement</Label>
                  <Input
                    type="number"
                    value={annualSpending}
                    onChange={(e) => setAnnualSpending(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-base font-bold">Expected Annual Return (%)</Label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-base font-bold">Annual Conversion Amount</Label>
                  <Input
                    type="number"
                    value={annualConversion}
                    onChange={(e) => setAnnualConversion(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                  <p className="text-xs text-slate-500 mt-1">Used for Fixed Annual strategy</p>
                </div>
                <div>
                  <Label className="text-base font-bold">Years to Model</Label>
                  <Input
                    type="number"
                    value={yearsToModel}
                    onChange={(e) => setYearsToModel(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-base font-bold">Inflation Rate (%)</Label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                </div>

                <div>
                  <Label className="text-base font-bold">Early Retirement Income</Label>
                  <Input
                    type="number"
                    value={earlyRetirementIncome}
                    onChange={(e) => setEarlyRetirementIncome(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                  <p className="text-xs text-slate-500 mt-1">Part-time work, consulting, etc.</p>
                </div>

                <div className="md:col-span-2">
                  <Label className="text-base font-bold">Future Tax Rate Assumption</Label>
                  <Select value={futureTaxAssumption} onValueChange={(v: any) => setFutureTaxAssumption(v)}>
                    <SelectTrigger className="text-base font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lower">Lower than today</SelectItem>
                      <SelectItem value="same">Same as today</SelectItem>
                      <SelectItem value="higher">Higher than today</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    Most advisors expect higher future rates given federal debt levels
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Healthcare Tab */}
            <TabsContent value="healthcare" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-base font-bold">Tax Filing Status</Label>
                  <Select value={filingStatus} onValueChange={(v: FilingStatus) => setFilingStatus(v)}>
                    <SelectTrigger className="text-base font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married Filing Jointly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    Affects tax brackets, ACA subsidy limits, and IRMAA thresholds
                  </p>
                </div>

                <div>
                  <Label className="text-base font-bold">Pre-Medicare Healthcare Cost</Label>
                  <Input
                    type="number"
                    value={healthcareCostPreMedicare}
                    onChange={(e) => setHealthcareCostPreMedicare(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                  <p className="text-xs text-slate-500 mt-1">Annual cost before age 65</p>
                </div>

                <div>
                  <Label className="text-base font-bold">Post-Medicare Healthcare Cost</Label>
                  <Input
                    type="number"
                    value={healthcareCostPostMedicare}
                    onChange={(e) => setHealthcareCostPostMedicare(Number(e.target.value))}
                    className="text-base font-semibold"
                  />
                  <p className="text-xs text-slate-500 mt-1">Annual cost after age 65</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <p className="text-sm font-bold text-amber-900 mb-2">Healthcare Planning Notes</p>
                <div className="space-y-1 text-sm font-medium text-amber-800">
                  <p>• ACA subsidy eligibility ends at ${filingStatus === "single" ? "60,000" : "80,000"} MAGI</p>
                  <p>• Medicare IRMAA surcharges start at ${filingStatus === "single" ? "106,000" : "212,000"} MAGI</p>
                  <p>• IRMAA uses 2-year lookback, so plan conversions carefully before age 63</p>
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
            <CardTitle className="text-base font-semibold">Portfolio Projection with Roth Conversions</CardTitle>
            <p className="text-base font-medium text-slate-600 mt-2">
              Track how your account balances evolve with conversions. Green shading shows optimal gap year conversion windows.
              Dashed lines mark Medicare eligibility, tax bracket thresholds, and healthcare subsidy limits.
              Hover over the chart for detailed tax and healthcare status at each age.
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={600}>
              <ComposedChart data={projections}>
                <defs>
                  <linearGradient id="traditionalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="rothGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="taxableGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
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
                  label={{ value: "Portfolio Value ($)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 14, fontWeight: 600 }}
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
                            <p className="font-semibold text-amber-700">Traditional IRA: {formatCurrency(data.traditionalBalance)}</p>
                            <p className="font-semibold text-emerald-700">Roth IRA: {formatCurrency(data.rothBalance)}</p>
                            <p className="font-semibold text-blue-700">Taxable: {formatCurrency(data.taxableBalance)}</p>
                            <p className="font-bold text-slate-900 border-t border-slate-300 pt-1 mt-1">
                              Total: {formatCurrency(data.totalPortfolio)}
                            </p>
                            {data.conversionAmount > 0 && (
                              <p className="font-semibold text-purple-700">Conversion: {formatCurrency(data.conversionAmount)}</p>
                            )}
                            <div className="border-t border-slate-300 pt-1 mt-1">
                              <p className="font-medium text-slate-700">Effective Tax: {data.effectiveTaxRate.toFixed(1)}%</p>
                              <p className="font-medium text-slate-700">Marginal Tax: {data.marginalTaxRate.toFixed(1)}%</p>
                              {data.income > 0 && (
                                <p className="font-medium text-slate-700">Income: {formatCurrency(data.income)}</p>
                              )}
                              {data.age < 65 && data.healthcareSubsidyEligible && (
                                <p className="font-medium text-green-700">✓ ACA Subsidy Eligible</p>
                              )}
                              {data.irmaaThreshold && (
                                <p className="font-medium text-red-700">⚠ IRMAA Triggered</p>
                              )}
                              {data.rmdAmount > 0 && (
                                <p className="font-medium text-orange-700">RMD: {formatCurrency(data.rmdAmount)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px", fontSize: "14px", fontWeight: 700 }}
                />
                <Area
                  type="monotone"
                  dataKey="traditionalBalance"
                  stackId="1"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fill="url(#traditionalGradient)"
                  name="Traditional IRA"
                />
                <Area
                  type="monotone"
                  dataKey="rothBalance"
                  stackId="1"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#rothGradient)"
                  name="Roth IRA"
                />
                <Area
                  type="monotone"
                  dataKey="taxableBalance"
                  stackId="1"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#taxableGradient)"
                  name="Taxable"
                />
                <Line
                  type="monotone"
                  dataKey="conversionAmount"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={false}
                  name="Conversion"
                />

                {/* Shaded Regions */}
                {/* Gap Years - Optimal conversion window (retirement to RMD start at 72) */}
                {retirementAge && retirementAge < 72 && (
                  <ReferenceArea
                    x1={retirementAge}
                    x2={72}
                    fill="#10b981"
                    fillOpacity={0.1}
                    label={{
                      value: "Gap Years (Optimal Conversions)",
                      position: "insideTop",
                      fill: "#059669",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />
                )}

                {/* RMD Years (72+) */}
                {currentAge && (
                  <ReferenceArea
                    x1={Math.max(72, currentAge)}
                    x2={lifeExpectancy}
                    fill="#94a3b8"
                    fillOpacity={0.08}
                    label={{
                      value: "RMD Years",
                      position: "insideTop",
                      fill: "#64748b",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />
                )}

                {/* Reference Lines */}
                {/* Medicare Eligibility at 65 */}
                <ReferenceLine
                  x={65}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: "Medicare (65)",
                    fill: "#2563eb",
                    fontSize: 12,
                    fontWeight: 700,
                    position: "top",
                  }}
                />

                {/* Tax Bracket Thresholds - 12% bracket top (Single: $47,150, Married: $94,300) */}
                <ReferenceLine
                  y={filingStatus === "single" ? 47150 : 94300}
                  stroke="#22c55e"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  label={{
                    value: "12% Bracket",
                    fill: "#16a34a",
                    fontSize: 11,
                    fontWeight: 600,
                    position: "right",
                  }}
                />

                {/* 22% bracket top (Single: $100,525, Married: $201,050) */}
                <ReferenceLine
                  y={filingStatus === "single" ? 100525 : 201050}
                  stroke="#eab308"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  label={{
                    value: "22% Bracket",
                    fill: "#ca8a04",
                    fontSize: 11,
                    fontWeight: 600,
                    position: "right",
                  }}
                />

                {/* ACA Subsidy Threshold */}
                {currentAge && currentAge < 65 && (
                  <ReferenceLine
                    y={filingStatus === "single" ? ACA_MAGI_LIMIT_SINGLE : ACA_MAGI_LIMIT_MARRIED}
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    label={{
                      value: "ACA Subsidy Limit",
                      fill: "#d97706",
                      fontSize: 11,
                      fontWeight: 600,
                      position: "right",
                    }}
                  />
                )}

                {/* IRMAA Threshold */}
                {currentAge && currentAge >= 63 && (
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
                )}

                {retirementAge && (
                  <ReferenceLine
                    x={retirementAge}
                    stroke="#dc2626"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: "Retirement", fill: "#dc2626", fontSize: 13, fontWeight: 700, position: "top" }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Advisory Summary */}
      {projections.length > 0 && (
        <Card className={isPro ? "bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-slate-200" : "bg-slate-100 border-2 border-slate-300 relative"}>
          <CardHeader>
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${!isPro && "text-slate-400"}`}>
              {!isPro && <Lock className="h-6 w-6 text-slate-400" />}
              {isPro && <Lightbulb className="h-6 w-6 text-emerald-600" />}
              Strategy Insights
              {!isPro && <span className="ml-2 text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full border-2 border-amber-300">Pro Only</span>}
            </CardTitle>
          </CardHeader>
          {!isPro ? (
            <CardContent className="space-y-5">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-4">
                  <Lock className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Unlock Strategic Insights</h3>
                <p className="text-base font-semibold text-slate-600 mb-6 max-w-md mx-auto">
                  Get personalized analysis of optimal conversion windows, lifetime tax savings, RMD reduction estimates, healthcare impacts, and break-even timelines.
                </p>
                <Link href="/upgrade">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-6">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <CardContent className="space-y-5">
            {/* Optimal Conversion Window */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-1.5">
                • Your optimal conversion window is ages {retirementAge} to {Math.min(72, lifeExpectancy)}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                {analysis.optimalYears.length > 0
                  ? `Focus conversions in years ${analysis.optimalYears.slice(0, 5).join(", ")} when your effective tax rate is lowest. These gap years between retirement and RMDs/Social Security offer the best opportunity to fill the 12% and 22% brackets.`
                  : "Consider increasing conversion amounts to take advantage of low-income years during early retirement."}
              </p>
            </div>

            {/* Lifetime Tax Savings */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-1.5">
                • Estimated lifetime tax savings: {formatCurrency(Math.abs(analysis.lifetimeTaxSavings))}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                {analysis.lifetimeTaxSavings > 0
                  ? `By converting during low-income years, you avoid paying higher tax rates on future RMDs. This strategy pays for itself and generates ${formatCurrency(analysis.lifetimeTaxSavings)} in net tax savings over your lifetime.`
                  : `This strategy would increase lifetime taxes by ${formatCurrency(Math.abs(analysis.lifetimeTaxSavings))}. Consider reducing conversion amounts or adjusting timing.`}
              </p>
            </div>

            {/* RMD Reduction */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-1.5">
                • Future RMD exposure reduced by {formatPercent(analysis.rmdReduction)}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Converting now reduces your Traditional IRA balance, which means smaller forced withdrawals starting at age 72. This gives you more control over taxable income in your 70s and 80s, potentially keeping you in lower tax brackets.
              </p>
            </div>

            {/* Healthcare Impact */}
            {currentAge && currentAge < 65 && (
              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <p className="text-sm font-medium text-slate-900 mb-1.5">
                  • Healthcare subsidy considerations (pre-Medicare)
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {(() => {
                    const subsidyYears = projections.filter(p => p.age < 65 && p.healthcareSubsidyEligible);
                    const riskYears = projections.filter(p => p.age < 65 && !p.healthcareSubsidyEligible && p.taxableIncome > 0);
                    if (subsidyYears.length > riskYears.length) {
                      return `You maintain ACA subsidy eligibility in ${subsidyYears.length} of your pre-Medicare years by keeping income below ${formatCurrency(filingStatus === "single" ? ACA_MAGI_LIMIT_SINGLE : ACA_MAGI_LIMIT_MARRIED)}. This could save $5,000-$15,000 annually in healthcare costs.`;
                    } else if (riskYears.length > 0) {
                      return `Warning: Conversions may push you above the ACA subsidy cliff (${formatCurrency(filingStatus === "single" ? ACA_MAGI_LIMIT_SINGLE : ACA_MAGI_LIMIT_MARRIED)} MAGI) in ${riskYears.length} years, potentially costing $5,000-$15,000/year in lost subsidies. Consider reducing conversion amounts during pre-Medicare years.`;
                    } else {
                      return `Your income is projected to exceed ACA subsidy limits before age 65. If you're purchasing marketplace insurance, this strategy maintains that status.`;
                    }
                  })()}
                </p>
              </div>
            )}

            {/* IRMAA Risk */}
            {(() => {
              const irmaaYears = projections.filter(p => p.age >= 65 && p.irmaaThreshold);
              if (irmaaYears.length > 0) {
                return (
                  <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <p className="text-sm font-medium text-slate-900 mb-1.5">
                      • Conversion risk: IRMAA surcharges triggered in {irmaaYears.length} years
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Your conversions push income above the Medicare IRMAA threshold (${formatCurrency(filingStatus === "single" ? IRMAA_THRESHOLD_SINGLE : IRMAA_THRESHOLD_MARRIED)}) in years {irmaaYears.slice(0, 5).map(y => y.year).join(", ")}.
                      This triggers surcharges of $800-$6,000+ per year on Medicare premiums. Remember: IRMAA uses a 2-year lookback, so high-income years at age 63-64 affect Medicare costs at 65-66.
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            {/* Break-even Analysis */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-lg">
              <p className="text-base font-bold text-slate-900 mb-2">
                • Break-even timeline: {analysis.breakEvenYear > 0
                  ? `Age ${projections.find(p => p.year === analysis.breakEvenYear)?.age || "N/A"}`
                  : "Not achieved within time horizon"}
              </p>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {analysis.breakEvenYear > 0
                  ? `Tax savings from lower future RMDs exceed conversion costs paid by age ${projections.find(p => p.year === analysis.breakEvenYear)?.age}. After this point, all additional savings flow to your benefit. Earlier break-even is better.`
                  : "The model doesn't show net savings within your planning horizon. Consider adjusting conversion amounts or timing, or verify that your future tax rate assumption is realistic."}
              </p>
            </div>

            {/* Tax Rate Sensitivity */}
            <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
              <p className="text-base font-bold text-indigo-900 mb-2">
                • Future tax rate assumption: {futureTaxAssumption === "higher" ? "Higher rates expected" : futureTaxAssumption === "lower" ? "Lower rates expected" : "Same rates expected"}
              </p>
              <p className="text-sm font-medium text-indigo-800 leading-relaxed">
                {futureTaxAssumption === "higher"
                  ? "Converting now while rates are relatively low (12%-22%) to avoid potentially higher rates (15%-28%+) later is a sound strategy. Many advisors expect tax increases given federal debt levels."
                  : futureTaxAssumption === "lower"
                  ? "Be cautious with this assumption. Lower future tax rates reduce conversion benefits significantly. Most financial advisors expect rates to increase, not decrease."
                  : "Assuming unchanged tax rates is optimistic given current federal deficits. Consider running scenarios with higher future rates to stress-test your strategy."}
              </p>
            </div>
          </CardContent>
          )}
        </Card>
      )}

      {/* Helper Panels */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="font-medium text-slate-900">What if you convert too much in one year?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 leading-relaxed">
              Converting too much can push you into a higher tax bracket, defeating the purpose. For example, if you're in the 12% bracket and convert enough to jump to 22% or 24%, you're paying unnecessarily high taxes. The key is to convert just enough to "fill up" your current bracket without spilling into the next one. This is why spreading conversions over multiple years is usually optimal.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="font-medium text-slate-900">Why early retirement creates tax opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 leading-relaxed">
              When you retire early, you often have a gap of 5-10 years between leaving work and starting Social Security. During these years, your taxable income can be very low—maybe just investment income or part-time consulting. This is your conversion window. You can convert $50,000-$100,000+ per year while staying in the 12% or 22% brackets, rates you'll never see again once RMDs and Social Security kick in.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Year-by-Year Table */}
      {projections.length > 0 && (
        <Card className={isPro ? "border border-slate-200" : "bg-slate-100 border-2 border-slate-300"}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${!isPro && "text-slate-400"}`}>
              {!isPro && <Lock className="h-6 w-6 text-slate-400" />}
              Detailed Year-by-Year Projection
              {!isPro && <span className="ml-2 text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full border-2 border-amber-300">Pro Only</span>}
            </CardTitle>
            {isPro && (
              <Button onClick={exportToCSV} className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </Button>
            )}
          </CardHeader>
          {!isPro ? (
            <CardContent>
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-4">
                  <Lock className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Unlock Detailed Projections</h3>
                <p className="text-base font-semibold text-slate-600 mb-6 max-w-md mx-auto">
                  Get year-by-year breakdowns with income, conversions, taxes, healthcare, and account balances for your entire retirement timeline.
                </p>
                <Link href="/upgrade">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-6">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-slate-50">
                  <TableRow className="border-b border-slate-200">
                    <TableHead className="text-xs font-semibold text-slate-600">Year</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Age</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Income</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Conversion</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Taxable Income</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Est. Taxes</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Eff. Tax %</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Marg. Tax %</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Healthcare</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Subsidy</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">IRMAA</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Traditional</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Roth</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Taxable</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Total</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Withdrawal</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">RMD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projections.map((p, idx) => {
                    // Determine row highlighting
                    let rowClass = "";
                    if (p.conversionAmount > 0 && p.effectiveTaxRate < 20) {
                      rowClass = "bg-emerald-50"; // Optimal conversion year
                    } else if (p.irmaaThreshold) {
                      rowClass = "bg-red-50"; // IRMAA risk
                    } else if (p.age < 65 && !p.healthcareSubsidyEligible && p.taxableIncome > 0) {
                      rowClass = "bg-amber-50"; // ACA subsidy lost
                    }

                    return (
                      <TableRow key={idx} className={rowClass}>
                        <TableCell className="text-xs tabular-nums">{p.year}</TableCell>
                        <TableCell className="text-xs tabular-nums">{p.age}</TableCell>
                        <TableCell className="text-xs tabular-nums">{p.income > 0 ? formatCurrency(p.income) : "—"}</TableCell>
                        <TableCell className="text-xs tabular-nums">{p.conversionAmount > 0 ? formatCurrency(p.conversionAmount) : "—"}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(p.taxableIncome)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(p.estimatedTaxes)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatPercent(p.effectiveTaxRate)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatPercent(p.marginalTaxRate)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(p.healthcareCost)}</TableCell>
                        <TableCell className="text-xs text-center">
                          {p.age < 65 ? (
                            p.healthcareSubsidyEligible ? (
                              <span className="text-green-700 font-bold">✓</span>
                            ) : (
                              <span className="text-red-700 font-bold">✗</span>
                            )
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          {p.age >= 65 ? (
                            p.irmaaThreshold ? (
                              <span className="text-red-700 font-bold">⚠</span>
                            ) : (
                              <span className="text-green-700 font-bold">✓</span>
                            )
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(p.traditionalBalance)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(p.rothBalance)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(p.taxableBalance)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{formatCurrency(p.totalPortfolio)}</TableCell>
                        <TableCell className="text-xs tabular-nums">{p.withdrawalAmount > 0 ? formatCurrency(p.withdrawalAmount) : "—"}</TableCell>
                        <TableCell className="text-xs tabular-nums">{p.rmdAmount > 0 ? formatCurrency(p.rmdAmount) : "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <p className="text-xs tabular-nums">Row highlighting:</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-50 border border-emerald-200"></div>
                  <span>Optimal conversion year (low tax rate)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-50 border border-amber-200"></div>
                  <span>ACA subsidy lost</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-50 border border-red-200"></div>
                  <span>IRMAA surcharge triggered</span>
                </div>
              </div>
              <p className="mt-2">
                <strong>Subsidy:</strong> ✓ = ACA eligible, ✗ = Above income limit, — = Medicare age
                &nbsp;|&nbsp;
                <strong>IRMAA:</strong> ✓ = No surcharge, ⚠ = Surcharge triggered, — = Pre-Medicare
              </p>
            </div>
          </CardContent>
          )}
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="bg-slate-50 border-2 border-slate-300">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            <strong>Disclaimer:</strong> This Roth conversion optimization tool is for educational and planning purposes only. It is not personalized tax or investment advice. Tax laws are complex and subject to change. Individual circumstances vary significantly. The projections shown are based on assumptions you provide and may not reflect your actual tax liability or investment returns. Before implementing any Roth conversion strategy, consult with a qualified tax advisor or financial planner who understands your complete financial situation. This tool does not account for state taxes, capital gains, alternative minimum tax, Medicare premium surcharges (IRMAA), or other factors that may affect your specific situation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
