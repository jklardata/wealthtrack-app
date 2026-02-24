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
import { Map, Download, Lightbulb, TrendingUp, AlertTriangle, Target, Lock, Sparkles } from "lucide-react";
import type { EntitlementTier } from "@/lib/types";

// ========== TypeScript Interfaces ==========

interface YearProjection {
  year: number;
  age: number;
  consultingIncome: number;
  rothConversion: number;
  capitalGainsRealized: number;
  withdrawals: number;
  socialSecurityIncome: number;
  totalIncome: number;
  taxableIncome: number;
  taxesPaid: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  cumulativeLifetimeTaxes: number;
  traditionalBalance: number;
  rothBalance: number;
  taxableBalance: number;
  totalPortfolio: number;
  bracketUtilization: number;
  healthcareCost: number;
  healthcareSubsidyEligible: boolean;
  irmaaTriggered: boolean;
  isGapYear: boolean;
  isFeieYear: boolean;
  isRmdYear: boolean;
  strategyScenario: string;
}

type FilingStatus = "single" | "married";
type FutureTaxAssumption = "lower" | "same" | "higher";

// ========== Tax Constants ==========

const TAX_BRACKETS_2026_SINGLE = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const TAX_BRACKETS_2026_MARRIED = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

const STANDARD_DEDUCTION_SINGLE = 14600;
const STANDARD_DEDUCTION_MARRIED = 29200;
const ACA_MAGI_LIMIT_SINGLE = 60000;
const ACA_MAGI_LIMIT_MARRIED = 80000;
const IRMAA_THRESHOLD_SINGLE = 106000;
const IRMAA_THRESHOLD_MARRIED = 212000;

const RMD_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
  80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4,
  88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9,
};

// ========== Helper Functions ==========

function getTaxBrackets(filingStatus: FilingStatus) {
  return filingStatus === "single" ? TAX_BRACKETS_2026_SINGLE : TAX_BRACKETS_2026_MARRIED;
}

function getStandardDeduction(filingStatus: FilingStatus) {
  return filingStatus === "single" ? STANDARD_DEDUCTION_SINGLE : STANDARD_DEDUCTION_MARRIED;
}

function calculateFederalTax(taxableIncome: number, brackets: any[]) {
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      tax += taxableInBracket * bracket.rate;
    }
  }
  return tax;
}

function getMarginalTaxRate(income: number, brackets: any[]) {
  for (const bracket of brackets) {
    if (income >= bracket.min && income < bracket.max) {
      return bracket.rate;
    }
  }
  return brackets[brackets.length - 1].rate;
}

function calculateRMD(balance: number, age: number) {
  if (age < 72) return 0;
  const divisor = RMD_TABLE[age] || RMD_TABLE[95];
  return balance / divisor;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

// ========== Main Component ==========

export default function LifetimeTaxMapPage() {
  // ========== State Management ==========

  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(55);
  const [lifeExpectancy, setLifeExpectancy] = useState(95);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");

  const [baseConsultingIncome, setBaseConsultingIncome] = useState(150000);
  const [traditionalBalance, setTraditionalBalance] = useState(500000);
  const [rothBalance, setRothBalance] = useState(100000);
  const [taxableBalance, setTaxableBalance] = useState(200000);
  const [annualSpending, setAnnualSpending] = useState(80000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);

  const [feieStartYear, setFeieStartYear] = useState<number | null>(null);
  const [feieEndYear, setFeieEndYear] = useState<number | null>(null);
  const [healthcareCostPreMedicare, setHealthcareCostPreMedicare] = useState(15000);
  const [healthcareCostPostMedicare, setHealthcareCostPostMedicare] = useState(8000);
  const [socialSecurityStartAge, setSocialSecurityStartAge] = useState<number | null>(67);
  const [socialSecurityAmount, setSocialSecurityAmount] = useState(30000);

  const [strategyScenario, setStrategyScenario] = useState("mixed");
  const [futureTaxAssumption, setFutureTaxAssumption] = useState<FutureTaxAssumption>("same");

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
      // Override API defaults with user's saved calculator preferences
      try {
        const saved = localStorage.getItem("solofi_lifetime_tax");
        if (saved) {
          const p = JSON.parse(saved);
          if (p.currentAge !== undefined) setCurrentAge(p.currentAge);
          if (p.retirementAge !== undefined) setRetirementAge(p.retirementAge);
          if (p.lifeExpectancy !== undefined) setLifeExpectancy(p.lifeExpectancy);
          if (p.filingStatus !== undefined) setFilingStatus(p.filingStatus);
          if (p.baseConsultingIncome !== undefined) setBaseConsultingIncome(p.baseConsultingIncome);
          if (p.traditionalBalance !== undefined) setTraditionalBalance(p.traditionalBalance);
          if (p.rothBalance !== undefined) setRothBalance(p.rothBalance);
          if (p.taxableBalance !== undefined) setTaxableBalance(p.taxableBalance);
          if (p.annualSpending !== undefined) setAnnualSpending(p.annualSpending);
          if (p.expectedReturn !== undefined) setExpectedReturn(p.expectedReturn);
          if (p.inflationRate !== undefined) setInflationRate(p.inflationRate);
          if (p.healthcareCostPreMedicare !== undefined) setHealthcareCostPreMedicare(p.healthcareCostPreMedicare);
          if (p.healthcareCostPostMedicare !== undefined) setHealthcareCostPostMedicare(p.healthcareCostPostMedicare);
          if (p.socialSecurityStartAge !== undefined) setSocialSecurityStartAge(p.socialSecurityStartAge);
          if (p.socialSecurityAmount !== undefined) setSocialSecurityAmount(p.socialSecurityAmount);
          if (p.strategyScenario !== undefined) setStrategyScenario(p.strategyScenario);
          if (p.futureTaxAssumption !== undefined) setFutureTaxAssumption(p.futureTaxAssumption);
        }
      } catch {}
    }
    fetchSettings();
  }, []);

  // Save calculator preferences on any change
  useEffect(() => {
    try {
      localStorage.setItem("solofi_lifetime_tax", JSON.stringify({
        currentAge, retirementAge, lifeExpectancy, filingStatus, baseConsultingIncome,
        traditionalBalance, rothBalance, taxableBalance, annualSpending, expectedReturn,
        inflationRate, healthcareCostPreMedicare, healthcareCostPostMedicare,
        socialSecurityStartAge, socialSecurityAmount, strategyScenario, futureTaxAssumption,
      }));
    } catch {}
  }, [currentAge, retirementAge, lifeExpectancy, filingStatus, baseConsultingIncome, traditionalBalance, rothBalance, taxableBalance, annualSpending, expectedReturn, inflationRate, healthcareCostPreMedicare, healthcareCostPostMedicare, socialSecurityStartAge, socialSecurityAmount, strategyScenario, futureTaxAssumption]);

  const isPro = subscriptionTier === "pro" || subscriptionTier === "premium";

  // ========== Core Projection Calculations ==========

  const projections = useMemo((): YearProjection[] => {
    const results: YearProjection[] = [];
    const currentYear = new Date().getFullYear();
    const brackets = getTaxBrackets(filingStatus);
    const standardDeduction = getStandardDeduction(filingStatus);

    let traditionalBal = traditionalBalance;
    let rothBal = rothBalance;
    let taxableBal = taxableBalance;
    let cumulativeTaxes = 0;

    const returnRate = expectedReturn / 100;
    const inflationAdj = 1 + (inflationRate / 100);

    for (let i = 0; i < (lifeExpectancy - currentAge); i++) {
      const year = currentYear + i;
      const age = currentAge + i;
      const isRetired = age >= retirementAge;
      const isMedicareAge = age >= 65;
      const isRmdAge = age >= 72;
      const isSocialSecurityAge = socialSecurityStartAge && age >= socialSecurityStartAge;
      const isFeieYear = feieStartYear && feieEndYear && year >= feieStartYear && year <= feieEndYear;

      // Consulting income
      let consultingIncome = 0;
      if (!isRetired && !isFeieYear) {
        consultingIncome = baseConsultingIncome * Math.pow(inflationAdj, i);
      }

      // Social Security
      const socialSecurity = isSocialSecurityAge ? socialSecurityAmount : 0;

      // RMD
      const rmdAmount = calculateRMD(traditionalBal, age);

      // Strategy-based conversions and gains
      let rothConversion = 0;
      let capitalGainsRealized = 0;
      let withdrawals = 0;

      if (strategyScenario === "mixed" && isRetired && age < 72) {
        const baseIncome = socialSecurity + rmdAmount;
        const target = filingStatus === "single" ? 100525 : 201050;
        const roomInBracket = Math.max(0, target - baseIncome - standardDeduction);
        rothConversion = Math.min(roomInBracket * 0.6, traditionalBal);
        capitalGainsRealized = Math.min(roomInBracket * 0.3, taxableBal * 0.2);
      }

      // Withdrawals
      if (isRetired) {
        const needed = annualSpending * Math.pow(inflationAdj, i - (retirementAge - currentAge));
        withdrawals = Math.min(needed, taxableBal + traditionalBal);
      }

      // Total income and taxes
      const totalOrdinaryIncome = consultingIncome + socialSecurity + rmdAmount + rothConversion + withdrawals;
      const taxableIncome = Math.max(0, totalOrdinaryIncome - standardDeduction);
      const taxesPaid = calculateFederalTax(taxableIncome, brackets);
      const effectiveTaxRate = totalOrdinaryIncome > 0 ? (taxesPaid / totalOrdinaryIncome) * 100 : 0;
      const marginalTaxRate = getMarginalTaxRate(taxableIncome, brackets) * 100;

      cumulativeTaxes += taxesPaid;

      // Healthcare
      const healthcareCost = isMedicareAge ? healthcareCostPostMedicare : healthcareCostPreMedicare;
      const acaLimit = filingStatus === "single" ? ACA_MAGI_LIMIT_SINGLE : ACA_MAGI_LIMIT_MARRIED;
      const irmaaThreshold = filingStatus === "single" ? IRMAA_THRESHOLD_SINGLE : IRMAA_THRESHOLD_MARRIED;
      const healthcareSubsidyEligible = !isMedicareAge && taxableIncome <= acaLimit;
      const irmaaTriggered = isMedicareAge && taxableIncome > irmaaThreshold;

      // Update balances
      traditionalBal = (traditionalBal - rothConversion - rmdAmount - withdrawals * 0.3) * (1 + returnRate);
      rothBal = (rothBal + rothConversion - withdrawals * 0.3) * (1 + returnRate);
      taxableBal = (taxableBal - capitalGainsRealized - withdrawals * 0.4) * (1 + returnRate);

      const totalPortfolio = traditionalBal + rothBal + taxableBal;
      const isGapYear = isRetired && !isSocialSecurityAge && !isRmdAge;

      const targetBracket = filingStatus === "single" ? 100525 : 201050;
      const bracketUtilization = (taxableIncome / targetBracket) * 100;

      results.push({
        year,
        age,
        consultingIncome,
        rothConversion,
        capitalGainsRealized,
        withdrawals,
        socialSecurityIncome: socialSecurity,
        totalIncome: totalOrdinaryIncome + capitalGainsRealized,
        taxableIncome,
        taxesPaid,
        effectiveTaxRate,
        marginalTaxRate,
        cumulativeLifetimeTaxes: cumulativeTaxes,
        traditionalBalance: traditionalBal,
        rothBalance: rothBal,
        taxableBalance: taxableBal,
        totalPortfolio,
        bracketUtilization,
        healthcareCost,
        healthcareSubsidyEligible,
        irmaaTriggered,
        isGapYear,
        isFeieYear: isFeieYear || false,
        isRmdYear: isRmdAge,
        strategyScenario,
      });
    }

    return results;
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    filingStatus,
    baseConsultingIncome,
    traditionalBalance,
    rothBalance,
    taxableBalance,
    annualSpending,
    expectedReturn,
    inflationRate,
    feieStartYear,
    feieEndYear,
    healthcareCostPreMedicare,
    healthcareCostPostMedicare,
    socialSecurityStartAge,
    socialSecurityAmount,
    strategyScenario,
  ]);

  // ========== Analysis ==========

  const analysis = useMemo(() => {
    if (projections.length === 0) return {
      lowestTaxYears: [],
      bestConversionYears: [],
      highTaxRiskYears: [],
      totalLifetimeTaxes: 0,
      averageEffectiveTaxRate: 0,
    };

    const lowestTaxYears = projections
      .filter(p => p.age >= retirementAge && p.effectiveTaxRate < 15)
      .map(p => p.year);

    const bestConversionYears = projections
      .filter(p => p.isGapYear && p.bracketUtilization < 80)
      .map(p => p.year);

    const highTaxRiskYears = projections
      .filter(p => p.effectiveTaxRate > 25 || p.irmaaTriggered)
      .map(p => p.year);

    const totalLifetimeTaxes = projections[projections.length - 1]?.cumulativeLifetimeTaxes || 0;
    const avgEffectiveRate = projections.reduce((sum, p) => sum + p.effectiveTaxRate, 0) / projections.length;

    return {
      lowestTaxYears,
      bestConversionYears,
      highTaxRiskYears,
      totalLifetimeTaxes,
      averageEffectiveTaxRate: avgEffectiveRate,
    };
  }, [projections, retirementAge]);

  // ========== CSV Export ==========

  const exportToCSV = () => {
    const headers = [
      "Year", "Age", "Total Income", "Consulting Income", "Roth Conversions",
      "Capital Gains Realized", "Withdrawals", "Taxable Income", "Taxes Paid",
      "Effective Tax Rate", "Cumulative Lifetime Taxes", "Traditional Balance",
      "Roth Balance", "Taxable Balance", "Portfolio Total", "Strategy Scenario"
    ];

    const rows = projections.map(p => [
      p.year, p.age, p.totalIncome.toFixed(0), p.consultingIncome.toFixed(0),
      p.rothConversion.toFixed(0), p.capitalGainsRealized.toFixed(0),
      p.withdrawals.toFixed(0), p.taxableIncome.toFixed(0), p.taxesPaid.toFixed(0),
      p.effectiveTaxRate.toFixed(2), p.cumulativeLifetimeTaxes.toFixed(0),
      p.traditionalBalance.toFixed(0), p.rothBalance.toFixed(0),
      p.taxableBalance.toFixed(0), p.totalPortfolio.toFixed(0), p.strategyScenario
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifetime-tax-map-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // ========== Render ==========

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Map className="h-5 w-5 text-emerald-600" />
          Lifetime Tax Map
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Visualize your complete tax exposure across decades to identify optimization windows and minimize lifetime tax burden
        </p>
      </div>

      {/* Educational Guide */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Map className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Understanding Your Lifetime Tax Map
                </h3>
                <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                  <p>
                    A lifetime tax map is a visual timeline showing your projected tax exposure from today through life expectancy. Unlike annual tax planning that focuses on minimizing this year's bill, it reveals decades-long patterns in your tax burden—when you'll pay the most, when you'll pay the least, and crucially, when you have opportunities to shift income across years to reduce your total lifetime tax bill.
                  </p>
                  <p>
                    <strong>Why lifetime exposure matters more than annual taxes:</strong> Most people optimize taxes one year at a time. But this misses the bigger picture. If you pay 12% on a Roth conversion today to avoid 24% on RMDs in 20 years, you've cut your effective tax rate in half on that money. Lifetime tax minimization often means strategically paying some tax now to avoid much larger bills later—opportunities invisible in a single tax year.
                  </p>
                  <p>
                    <strong>How early retirement creates unique windows:</strong> When you retire early at 50–60, you create a 5–15 year gap before Social Security and RMDs begin. During this period, taxable income drops to near zero if you live off Roth withdrawals or taxable account principal—creating artificially low-income years ideal for filling the 12% and 22% brackets with Roth conversions and capital gains harvesting. Once Social Security and RMDs begin, your income floor rises permanently and this window closes forever.
                  </p>
                  <p>
                    <strong>How to read the visualization:</strong> The horizontal axis shows your age across your full financial timeline. Stacked colored areas represent different income sources (blue = consulting, purple = Roth conversions, green = capital gains, orange = withdrawals, yellow = Social Security). The red line tracks cumulative lifetime taxes paid. Vertical dashed lines mark key events—retirement, Medicare eligibility, RMD start, Social Security claim. Green-shaded regions indicate optimal tax optimization windows (gap years).
                  </p>
                  <p>
                    <strong>Key model assumptions:</strong> Federal income tax only (no state taxes). 2026 brackets held constant unless the future assumption is changed. Portfolio returns assumed constant with no sequence-of-returns risk. Standard deduction used throughout. Withdrawal sequencing: taxable first, then Traditional IRA, then Roth. Healthcare subsidy and IRMAA thresholds use simplified current-year rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Controls */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Your Lifetime Projection Inputs</CardTitle>
          <p className="text-sm text-slate-500">Adjust your financial scenario assumptions</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium">Current Age</Label>
                  <Input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Retirement Age</Label>
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Life Expectancy</Label>
                  <Input
                    type="number"
                    value={lifeExpectancy}
                    onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Filing Status</Label>
                  <Select value={filingStatus} onValueChange={(v: FilingStatus) => setFilingStatus(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married Filing Jointly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Traditional IRA Balance</Label>
                  <Input
                    type="number"
                    value={traditionalBalance}
                    onChange={(e) => setTraditionalBalance(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Roth IRA Balance</Label>
                  <Input
                    type="number"
                    value={rothBalance}
                    onChange={(e) => setRothBalance(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Taxable Brokerage Balance</Label>
                  <Input
                    type="number"
                    value={taxableBalance}
                    onChange={(e) => setTaxableBalance(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Annual Spending Target</Label>
                  <Input
                    type="number"
                    value={annualSpending}
                    onChange={(e) => setAnnualSpending(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Expected Portfolio Return (%)</Label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Inflation Rate (%)</Label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Income Tab */}
            <TabsContent value="income" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Base Consulting Income</Label>
                  <Input
                    type="number"
                    value={baseConsultingIncome}
                    onChange={(e) => setBaseConsultingIncome(Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">Annual income before retirement</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Social Security Start Age</Label>
                  <Input
                    type="number"
                    value={socialSecurityStartAge || ""}
                    onChange={(e) => setSocialSecurityStartAge(e.target.value ? Number(e.target.value) : null)}
                    className="mt-1"
                  />
                </div>

                {socialSecurityStartAge && (
                  <div>
                    <Label className="text-sm font-medium">Annual Social Security Amount</Label>
                    <Input
                      type="number"
                      value={socialSecurityAmount}
                      onChange={(e) => setSocialSecurityAmount(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Pre-Medicare Healthcare Cost</Label>
                  <Input
                    type="number"
                    value={healthcareCostPreMedicare}
                    onChange={(e) => setHealthcareCostPreMedicare(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Post-Medicare Healthcare Cost</Label>
                  <Input
                    type="number"
                    value={healthcareCostPostMedicare}
                    onChange={(e) => setHealthcareCostPostMedicare(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Strategy Tab */}
            <TabsContent value="strategy" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Strategy Scenario</Label>
                  <Select value={strategyScenario} onValueChange={setStrategyScenario}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Optimization</SelectItem>
                      <SelectItem value="roth-only">Roth Conversions Only</SelectItem>
                      <SelectItem value="gains-only">Capital Gains Only</SelectItem>
                      <SelectItem value="mixed">Mixed Strategy (Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Future Tax Rate Assumption</Label>
                  <Select value={futureTaxAssumption} onValueChange={(v: FutureTaxAssumption) => setFutureTaxAssumption(v)}>
                    <SelectTrigger className="mt-1">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Main Timeline Visualization */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Your Lifetime Tax Exposure Timeline
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Income layers, tax rates, and cumulative tax burden across {lifeExpectancy - currentAge} years
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={600}>
            <ComposedChart data={projections} margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              {/* X-axis: Age */}
              <XAxis
                dataKey="age"
                label={{ value: "Age", position: "insideBottom", offset: -10, className: "font-bold" }}
                tick={{ fontSize: 12, fontWeight: 600 }}
              />

              {/* Left Y-axis: Income */}
              <YAxis
                yAxisId="left"
                label={{ value: "Annual Income ($)", angle: -90, position: "insideLeft", className: "font-bold" }}
                tick={{ fontSize: 12, fontWeight: 600 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />

              {/* Right Y-axis: Cumulative Taxes */}
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Cumulative Lifetime Taxes ($)", angle: 90, position: "insideRight", className: "font-bold" }}
                tick={{ fontSize: 12, fontWeight: 600 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Reference Lines for Key Events */}
              <ReferenceLine
                yAxisId="left"
                x={retirementAge}
                stroke="#ea580c"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: "Retirement", position: "top", fill: "#ea580c", fontWeight: 700 }}
              />
              <ReferenceLine
                yAxisId="left"
                x={65}
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: "Medicare", position: "top", fill: "#3b82f6", fontWeight: 700 }}
              />
              <ReferenceLine
                yAxisId="left"
                x={72}
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: "RMDs Begin", position: "top", fill: "#dc2626", fontWeight: 700 }}
              />
              {socialSecurityStartAge && (
                <ReferenceLine
                  yAxisId="left"
                  x={socialSecurityStartAge}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: "Social Security", position: "top", fill: "#f59e0b", fontWeight: 700 }}
                />
              )}

              {/* Shaded regions for Gap Years */}
              {projections.filter(p => p.isGapYear).length > 0 && (
                <ReferenceArea
                  yAxisId="left"
                  x1={retirementAge}
                  x2={socialSecurityStartAge || 72}
                  fill="#10b981"
                  fillOpacity={0.1}
                  label={{ value: "Gap Year Window", position: "insideTop", fill: "#10b981", fontWeight: 700 }}
                />
              )}

              {/* Income Layer Areas - Stacked */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="consultingIncome"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.8}
                name="Consulting Income"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="rothConversion"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.8}
                name="Roth Conversions"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="capitalGainsRealized"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.8}
                name="Capital Gains"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="withdrawals"
                stackId="1"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.8}
                name="Withdrawals"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="socialSecurityIncome"
                stackId="1"
                stroke="#eab308"
                fill="#eab308"
                fillOpacity={0.8}
                name="Social Security"
              />

              {/* Cumulative Lifetime Taxes Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulativeLifetimeTaxes"
                stroke="#dc2626"
                strokeWidth={3}
                dot={false}
                name="Cumulative Taxes"
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="rect"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Advisory Summary */}
      <Card className={isPro ? "bg-white border border-slate-200 shadow-sm" : "bg-slate-50 border border-slate-200"}>
        <CardHeader>
          <CardTitle className={`text-base font-semibold flex items-center gap-2 ${!isPro && "text-slate-400"}`}>
            {!isPro && <Lock className="h-4 w-4 text-slate-400" />}
            {isPro && <Lightbulb className="h-5 w-5 text-amber-600" />}
            Strategic Insights from Your Lifetime Tax Map
            {!isPro && <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">Pro Only</span>}
          </CardTitle>
        </CardHeader>
        {!isPro ? (
          <CardContent>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 mb-3">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 mb-1.5">Unlock Strategic Insights</h3>
              <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                Get lifetime tax burden projections, low-tax opportunity windows, gap year conversion insights, high-risk year analysis, and strategy impact assessments.
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
          <CardContent className="space-y-6">
          {/* Lifetime Tax Summary */}
          <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <p className="text-lg font-bold text-slate-900 mb-3">Projected Lifetime Tax Burden</p>
            <p className="text-4xl font-black text-slate-900 mb-2">
              {formatCurrency(analysis.totalLifetimeTaxes)}
            </p>
            <p className="text-base font-semibold text-slate-600">
              Average effective tax rate over {lifeExpectancy - currentAge} years: {formatPercent(analysis.averageEffectiveTaxRate)}
            </p>
          </div>

          {/* Low Tax Opportunity Years */}
          {analysis.lowestTaxYears.length > 0 && (
            <div className="p-6 bg-emerald-50 border-2 border-emerald-600 rounded-lg">
              <p className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Low Tax Opportunity Windows Identified
              </p>
              <p className="text-base font-semibold text-emerald-800">
                • You have {analysis.lowestTaxYears.length} years with effective tax rates below 15%
              </p>
              <p className="text-base font-semibold text-emerald-800">
                • These years ({analysis.lowestTaxYears.slice(0, 3).join(", ")}{analysis.lowestTaxYears.length > 3 ? "..." : ""})
                are optimal for Roth conversions and capital gains harvesting
              </p>
              <p className="text-base font-semibold text-emerald-800">
                • Strategic conversions during these windows can reduce your lifetime tax burden significantly
              </p>
            </div>
          )}

          {/* Best Conversion Years */}
          {analysis.bestConversionYears.length > 0 && (
            <div className="p-6 bg-blue-50 border-2 border-blue-600 rounded-lg">
              <p className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Gap Year Conversion Windows
              </p>
              <p className="text-base font-semibold text-blue-800">
                • Your retirement gap years ({analysis.bestConversionYears.slice(0, 3).join(", ")}{analysis.bestConversionYears.length > 3 ? "..." : ""})
                offer prime Roth conversion opportunities
              </p>
              <p className="text-base font-semibold text-blue-800">
                • During these {analysis.bestConversionYears.length} years, you're utilizing less than 80% of available tax brackets
              </p>
              <p className="text-base font-semibold text-blue-800">
                • Fill unused bracket capacity with conversions before Social Security and RMDs begin
              </p>
            </div>
          )}

          {/* High Tax Risk Years */}
          {analysis.highTaxRiskYears.length > 0 && (
            <div className="p-6 bg-red-50 border-2 border-red-600 rounded-lg">
              <p className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                High Tax Exposure Risk Years
              </p>
              <p className="text-base font-semibold text-red-800">
                • {analysis.highTaxRiskYears.length} years show effective tax rates exceeding 25% or IRMAA triggers
              </p>
              <p className="text-base font-semibold text-red-800">
                • Years with highest risk: {analysis.highTaxRiskYears.slice(0, 3).join(", ")}{analysis.highTaxRiskYears.length > 3 ? "..." : ""}
              </p>
              <p className="text-base font-semibold text-red-800">
                • Consider pre-emptive Roth conversions in earlier low-tax years to reduce future RMD exposure
              </p>
            </div>
          )}

          {/* Strategy Recommendation */}
          <div className="p-6 bg-slate-50 border-2 border-slate-300 rounded-lg">
            <p className="text-lg font-bold text-slate-900 mb-3">Current Strategy Impact</p>
            <p className="text-base font-semibold text-slate-700">
              • Selected strategy: <strong className="text-emerald-600">{
                strategyScenario === "none" ? "No Optimization" :
                strategyScenario === "roth-only" ? "Roth Conversions Only" :
                strategyScenario === "gains-only" ? "Capital Gains Only" :
                "Mixed Strategy (Conversions + Gains)"
              }</strong>
            </p>
            <p className="text-base font-semibold text-slate-700">
              • Cumulative lifetime taxes under this strategy: {formatCurrency(analysis.totalLifetimeTaxes)}
            </p>
            <p className="text-base font-semibold text-slate-700">
              • Consider testing alternative strategies using the dropdown above to compare lifetime tax outcomes
            </p>
          </div>
        </CardContent>
        )}
      </Card>

      {/* Detailed Year-by-Year Table */}
      <Card className={isPro ? "bg-white border border-slate-200 shadow-sm" : "bg-slate-50 border border-slate-200"}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={`text-base font-semibold flex items-center gap-2 ${!isPro && "text-slate-400"}`}>
              {!isPro && <Lock className="h-4 w-4 text-slate-400" />}
              Year-by-Year Tax Projection Detail
              {!isPro && <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">Pro Only</span>}
            </CardTitle>
            {isPro && (
              <p className="text-sm text-slate-500 mt-0.5">
                Complete breakdown of income sources, taxes, and balances for every year
              </p>
            )}
          </div>
          {isPro && (
            <Button onClick={exportToCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Download className="h-4 w-4 mr-2" />
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
                Get complete year-by-year projections with income sources, conversions, gains, taxes, cumulative lifetime taxes, and account balances.
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
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold text-slate-600 sticky left-0 bg-slate-50 z-10">Year</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600 sticky left-[60px] bg-slate-50 z-10">Age</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Total Income</TableHead>
                  <TableHead className="text-xs font-semibold text-blue-600">Consulting</TableHead>
                  <TableHead className="text-xs font-semibold text-purple-600">Roth Conv.</TableHead>
                  <TableHead className="text-xs font-semibold text-green-600">Cap. Gains</TableHead>
                  <TableHead className="text-xs font-semibold text-orange-600">Withdrawals</TableHead>
                  <TableHead className="text-xs font-semibold text-yellow-600">Soc. Sec.</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Taxable Inc.</TableHead>
                  <TableHead className="text-xs font-semibold text-red-600">Taxes Paid</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Effective Rate</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Marginal Rate</TableHead>
                  <TableHead className="text-xs font-semibold text-red-600 bg-red-50">Cumulative Taxes</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Trad. Balance</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Roth Balance</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Taxable Balance</TableHead>
                  <TableHead className="text-xs font-semibold text-emerald-600">Total Portfolio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projections.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className={
                      row.isGapYear ? "bg-emerald-50 hover:bg-emerald-100" :
                      row.irmaaTriggered ? "bg-red-50 hover:bg-red-100" :
                      row.effectiveTaxRate > 25 ? "bg-amber-50 hover:bg-amber-100" :
                      "hover:bg-slate-50"
                    }
                  >
                    <TableCell className="text-xs font-medium sticky left-0 bg-inherit z-10">{row.year}</TableCell>
                    <TableCell className="text-xs font-medium sticky left-[60px] bg-inherit z-10">{row.age}</TableCell>
                    <TableCell className="text-xs tabular-nums">{formatCurrency(row.totalIncome)}</TableCell>
                    <TableCell className="text-xs tabular-nums text-blue-700">{formatCurrency(row.consultingIncome)}</TableCell>
                    <TableCell className="text-xs tabular-nums text-purple-700">{formatCurrency(row.rothConversion)}</TableCell>
                    <TableCell className="text-xs tabular-nums text-green-700">{formatCurrency(row.capitalGainsRealized)}</TableCell>
                    <TableCell className="text-xs tabular-nums text-orange-700">{formatCurrency(row.withdrawals)}</TableCell>
                    <TableCell className="text-xs tabular-nums text-yellow-700">{formatCurrency(row.socialSecurityIncome)}</TableCell>
                    <TableCell className="text-xs tabular-nums">{formatCurrency(row.taxableIncome)}</TableCell>
                    <TableCell className="text-xs tabular-nums text-red-700">{formatCurrency(row.taxesPaid)}</TableCell>
                    <TableCell className="text-xs tabular-nums">{formatPercent(row.effectiveTaxRate)}</TableCell>
                    <TableCell className="text-xs tabular-nums">{formatPercent(row.marginalTaxRate)}</TableCell>
                    <TableCell className="text-xs tabular-nums text-red-700 bg-red-50">{formatCurrency(row.cumulativeLifetimeTaxes)}</TableCell>
                    <TableCell className="text-xs tabular-nums">{formatCurrency(row.traditionalBalance)}</TableCell>
                    <TableCell className="text-xs tabular-nums">{formatCurrency(row.rothBalance)}</TableCell>
                    <TableCell className="text-xs tabular-nums">{formatCurrency(row.taxableBalance)}</TableCell>
                    <TableCell className="text-xs tabular-nums font-medium text-emerald-700">{formatCurrency(row.totalPortfolio)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        )}
      </Card>

      {/* Educational Panels */}
      {isPro && (
      <div className="grid md:grid-cols-2 gap-6">
        {/* Panel 1: Lifetime vs Annual */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-emerald-600" />
              Why Lifetime Tax Planning Beats Annual Tax Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base font-medium text-slate-700 leading-relaxed space-y-3">
            <p>
              Traditional tax planning focuses on minimizing taxes in the current year. But this approach misses
              opportunities to arbitrage across decades.
            </p>
            <p>
              <strong>Example:</strong> Converting $50k from Traditional to Roth IRA at age 60 might cost you $6k
              in taxes (12% bracket). But if you don't convert, that $50k becomes a $15k RMD at age 75, taxed at
              24% for $3.6k. Plus the original conversion would have grown tax-free.
            </p>
            <p>
              The lifetime perspective reveals these multi-decade opportunities that annual planning completely misses.
            </p>
          </CardContent>
        </Card>

        {/* Panel 2: Gap Years */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              How Early Retirement Gap Years Create Tax Arbitrage
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base font-medium text-slate-700 leading-relaxed space-y-3">
            <p>
              Gap years occur between early retirement and when Social Security or RMDs begin. During this window,
              your income can drop to near-zero if you live off savings strategically.
            </p>
            <p>
              <strong>The arbitrage:</strong> You worked at 24-32% marginal rates during your career. In gap years,
              you can fill the 10-22% brackets with Roth conversions and capital gains harvesting, paying far less
              tax on the same money.
            </p>
            <p>
              A 10-year gap from age 55-65 could allow converting $500k at 12-22% instead of paying 24-32% on RMDs later.
            </p>
          </CardContent>
        </Card>

        {/* Panel 3: Cumulative Tax Curve */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              Reading the Cumulative Tax Curve
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base font-medium text-slate-700 leading-relaxed space-y-3">
            <p>
              The red line on your timeline shows cumulative lifetime taxes—the running total of every dollar paid
              to the IRS from now until life expectancy.
            </p>
            <p>
              <strong>What to look for:</strong> Steep upward slopes indicate high-tax years. Flat or gradual slopes
              show periods of low tax burden. The final endpoint is your total lifetime tax bill.
            </p>
            <p>
              Compare different strategies by watching how this line changes. A strategy that increases the curve
              early but flattens it dramatically later might save you hundreds of thousands over your lifetime.
            </p>
          </CardContent>
        </Card>

        {/* Panel 4: Income Stacking */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Map className="h-6 w-6 text-orange-600" />
              Understanding Income Stacking and Marginal Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base font-medium text-slate-700 leading-relaxed space-y-3">
            <p>
              The stacked colored areas show how different income sources combine to determine your total taxable income
              each year. The US tax system is progressive, so each dollar is taxed at the rate of the bracket it falls into.
            </p>
            <p>
              <strong>Key insight:</strong> Social Security and RMDs create an "income floor" that forces you into higher
              brackets permanently. Roth conversions done before these begin can reduce your future income floor.
            </p>
            <p>
              Capital gains stack on top of ordinary income, so years with high consulting income are poor years to
              realize gains—wait for low-income gap years instead.
            </p>
          </CardContent>
        </Card>

        {/* Panel 5: FEIE and International */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              FEIE Transitions and Repatriation Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base font-medium text-slate-700 leading-relaxed space-y-3">
            <p>
              If you've been using the Foreign Earned Income Exclusion while working abroad, your return to US taxation
              creates a unique window for aggressive Roth conversions.
            </p>
            <p>
              <strong>The strategy:</strong> In your first 2-3 years back in the US, you may have low income as you
              transition careers or take sabbatical. These years offer a once-in-a-lifetime opportunity to convert
              large Traditional IRA balances at minimal tax rates.
            </p>
            <p>
              Plan your FEIE exit year carefully—it's often worth delaying high-income work for 1-2 years to maximize
              conversion opportunities.
            </p>
          </CardContent>
        </Card>

        {/* Panel 6: Common Mistakes */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Common Lifetime Tax Planning Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base font-medium text-slate-700 leading-relaxed space-y-3">
            <p>
              <strong>Mistake #1: Avoiding all conversions to "save taxes now"</strong> — This often means paying
              2-3x more in RMD taxes later.
            </p>
            <p>
              <strong>Mistake #2: Converting too aggressively in a single year</strong> — Spiking into 32% brackets
              defeats the purpose. Spread conversions across multiple low-income years instead.
            </p>
            <p>
              <strong>Mistake #3: Ignoring state tax implications</strong> — Some states don't tax retirement income.
              Consider residency changes as part of your lifetime tax strategy.
            </p>
            <p>
              <strong>Mistake #4: Not modeling Medicare IRMAA thresholds</strong> — Excess conversions at age 63 could
              trigger IRMAA surcharges at age 65 due to the 2-year lookback.
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Disclaimer */}
      <Card className="border-2 border-amber-600 bg-amber-50">
        <CardContent className="p-6">
          <p className="text-sm font-bold text-amber-900">
            <strong>Disclaimer:</strong> This Lifetime Tax Map is a projection tool for educational and planning purposes only.
            It does not constitute professional tax, financial, or legal advice. Actual tax liabilities will vary based on
            tax law changes, state taxes, individual circumstances, deductions, credits, and other factors not modeled here.
            Portfolio returns are assumed constant and do not reflect sequence of returns risk or market volatility.
            Healthcare subsidy eligibility and IRMAA calculations use simplified thresholds and may not reflect actual
            program rules. Consult with a qualified tax professional or financial advisor before making any tax or investment
            decisions. Past performance does not guarantee future results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Custom Tooltip Component
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as YearProjection;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-lg min-w-[280px]">
      <p className="text-sm font-black text-slate-900 mb-2">
        {data.year} (Age {data.age})
      </p>

      <div className="space-y-1 text-xs font-semibold">
        {data.consultingIncome > 0 && (
          <p className="text-blue-700">Consulting: {formatCurrency(data.consultingIncome)}</p>
        )}
        {data.rothConversion > 0 && (
          <p className="text-purple-700">Roth Conversion: {formatCurrency(data.rothConversion)}</p>
        )}
        {data.capitalGainsRealized > 0 && (
          <p className="text-green-700">Capital Gains: {formatCurrency(data.capitalGainsRealized)}</p>
        )}
        {data.withdrawals > 0 && (
          <p className="text-orange-700">Withdrawals: {formatCurrency(data.withdrawals)}</p>
        )}
        {data.socialSecurityIncome > 0 && (
          <p className="text-yellow-700">Social Security: {formatCurrency(data.socialSecurityIncome)}</p>
        )}

        <div className="border-t border-slate-200 my-2"></div>

        <p className="text-slate-900">Total Income: {formatCurrency(data.totalIncome)}</p>
        <p className="text-slate-900">Taxable Income: {formatCurrency(data.taxableIncome)}</p>
        <p className="text-red-700 font-bold">Taxes Paid: {formatCurrency(data.taxesPaid)}</p>
        <p className="text-slate-700">Effective Rate: {formatPercent(data.effectiveTaxRate)}</p>
        <p className="text-slate-700">Marginal Rate: {formatPercent(data.marginalTaxRate)}</p>

        <div className="border-t border-slate-200 my-2"></div>

        <p className="text-red-800 font-black">Lifetime Taxes: {formatCurrency(data.cumulativeLifetimeTaxes)}</p>

        {data.isGapYear && (
          <p className="text-emerald-700 font-bold mt-2">✓ Gap Year Opportunity</p>
        )}
        {data.irmaaTriggered && (
          <p className="text-red-700 font-bold mt-2">⚠ IRMAA Triggered</p>
        )}
        {data.healthcareSubsidyEligible && (
          <p className="text-blue-700 font-bold mt-2">✓ ACA Subsidy Eligible</p>
        )}
      </div>
    </div>
  );
}
