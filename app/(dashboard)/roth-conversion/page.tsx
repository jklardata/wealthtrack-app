"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "recharts";
import { TrendingUp, Download, ArrowRight, AlertTriangle, Lightbulb, Calculator } from "lucide-react";

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
}

interface ConversionAnalysis {
  optimalYears: number[];
  lifetimeTaxSavings: number;
  breakEvenYear: number;
  rmdReduction: number;
  avgEffectiveTaxRate: number;
}

const TAX_BRACKETS_2026 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

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

  // Fetch user settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const settings = data.data;
            if (settings.current_age) setCurrentAge(settings.current_age);
            if (settings.desired_retirement_age) setRetirementAge(settings.desired_retirement_age);
            if (settings.life_expectancy_assumption) setLifeExpectancy(settings.life_expectancy_assumption);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    }
    fetchSettings();
  }, []);

  // Calculate projections
  const projections = useMemo((): YearlyProjection[] => {
    if (!currentAge) return [];

    const results: YearlyProjection[] = [];
    let trad = traditionalBalance;
    let roth = rothBalance;
    let taxable = taxableBalance;

    // Adjust future tax brackets
    let futureBrackets = TAX_BRACKETS_2026;
    if (futureTaxAssumption === "higher") {
      futureBrackets = TAX_BRACKETS_2026.map(b => ({ ...b, rate: b.rate * 1.15 }));
    } else if (futureTaxAssumption === "lower") {
      futureBrackets = TAX_BRACKETS_2026.map(b => ({ ...b, rate: b.rate * 0.85 }));
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
      "Conversion Amount",
      "Taxable Income",
      "Estimated Taxes",
      "Traditional Balance",
      "Roth Balance",
      "Taxable Balance",
      "Total Portfolio",
      "Withdrawal Amount",
      "Effective Tax Rate",
    ];

    const rows = projections.map(p => [
      p.year,
      p.age,
      p.conversionAmount,
      p.taxableIncome,
      p.estimatedTaxes,
      p.traditionalBalance,
      p.rothBalance,
      p.taxableBalance,
      p.totalPortfolio,
      p.withdrawalAmount,
      p.effectiveTaxRate,
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-emerald-600" />
          Roth Conversion Optimizer
        </h1>
        <p className="text-lg font-semibold text-slate-700 mt-2">
          Model conversion strategies to minimize lifetime taxes and maximize after-tax retirement wealth
        </p>
      </div>

      {/* Advisory Introduction */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-2 border-black">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-2xl font-black text-slate-900">Understanding Roth Conversions</h2>

          <p className="text-base font-medium text-slate-800 leading-relaxed">
            A Roth conversion is when you move money from a traditional IRA or pre-tax retirement account into a Roth IRA. You pay taxes on the converted amount now, but in exchange, that money grows tax-free forever and you never pay taxes on qualified withdrawals. For early retirees, this creates a powerful opportunity.
          </p>

          <p className="text-base font-medium text-slate-800 leading-relaxed">
            Here's why this matters for your plan: Once you retire early but before you start Social Security or required minimum distributions, you likely have several years of low taxable income. These are golden years for conversions—you can fill up the lower tax brackets with conversions at rates you'll never see again. You're essentially prepaying taxes at 12% or 22% to avoid paying 24% or 32% later when RMDs kick in.
          </p>

          <h3 className="text-xl font-black text-slate-900 mt-6">How to Use This Tool</h3>

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

          <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-base font-bold text-amber-900 mb-2">Critical Decision Points</p>
                <p className="text-sm font-medium text-amber-800 leading-relaxed">
                  Watch for years where your effective tax rate spikes—those are years to reduce conversions. The visualization below will highlight optimal conversion windows in green. If future tax rates increase (as many advisors expect), converting now becomes even more valuable.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Parameters */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <Calculator className="h-6 w-6 text-emerald-600" />
            Your Conversion Scenario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Age inputs */}
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

            {/* Account balances */}
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

            {/* Spending and returns */}
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

            {/* Conversion parameters */}
            <div>
              <Label className="text-base font-bold">Annual Conversion Amount</Label>
              <Input
                type="number"
                value={annualConversion}
                onChange={(e) => setAnnualConversion(Number(e.target.value))}
                className="text-base font-semibold"
              />
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

            {/* Future tax assumption */}
            <div className="md:col-span-3">
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
        </CardContent>
      </Card>

      {/* Main Visualization */}
      {projections.length > 0 && (
        <Card className="border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl font-black">Portfolio Projection with Roth Conversions</CardTitle>
            <p className="text-base font-medium text-slate-600 mt-2">
              Track how your account balances evolve with conversions. Green shading indicates optimal conversion years.
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
                  labelStyle={{ fontWeight: "bold", fontSize: "14px" }}
                  formatter={(value: any, name: string | undefined) => {
                    if (name === "Traditional IRA") return [formatCurrency(value), name];
                    if (name === "Roth IRA") return [formatCurrency(value), name];
                    if (name === "Taxable") return [formatCurrency(value), name];
                    if (name === "Conversion") return [formatCurrency(value), name];
                    return [value, name];
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
        <Card className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-emerald-600" />
              Strategy Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-base font-bold text-slate-900">
                • Most tax-efficient conversion years:
              </p>
              <p className="text-base font-medium text-slate-700 pl-4">
                {analysis.optimalYears.length > 0
                  ? `Focus conversions in ${analysis.optimalYears.slice(0, 5).join(", ")}. These are your lowest-income years where you can fill up the 12% and 22% brackets without jumping to higher rates.`
                  : "Based on your inputs, conversions may not provide significant tax savings. Consider increasing conversion amounts or adjusting timing."}
              </p>

              <p className="text-base font-bold text-slate-900">
                • Estimated lifetime tax impact:
              </p>
              <p className="text-base font-medium text-slate-700 pl-4">
                {analysis.lifetimeTaxSavings > 0
                  ? `You could save approximately ${formatCurrency(analysis.lifetimeTaxSavings)} in lifetime taxes by converting during low-income years instead of paying higher rates on RMDs later.`
                  : `With current assumptions, this conversion strategy would result in ${formatCurrency(Math.abs(analysis.lifetimeTaxSavings))} more in lifetime taxes. Consider reducing conversion amounts or timing differently.`}
              </p>

              <p className="text-base font-bold text-slate-900">
                • Impact on early retirement withdrawals:
              </p>
              <p className="text-base font-medium text-slate-700 pl-4">
                Once you've converted funds to Roth, you gain tax-free withdrawal flexibility. This is particularly valuable if you retire early and want to manage your tax bracket during the years before Social Security begins. You can withdraw from Roth accounts without triggering additional income taxes.
              </p>

              <p className="text-base font-bold text-slate-900">
                • Reduction in future required minimum distributions:
              </p>
              <p className="text-base font-medium text-slate-700 pl-4">
                By converting, you reduce your traditional IRA balance by approximately {formatPercent(analysis.rmdReduction)}, which means smaller forced withdrawals at age 72 when RMDs begin. This gives you more control over your taxable income in your 70s and 80s.
              </p>

              <p className="text-base font-bold text-slate-900">
                • Sensitivity to future tax changes:
              </p>
              <p className="text-base font-medium text-slate-700 pl-4">
                {futureTaxAssumption === "higher"
                  ? "You're assuming higher future tax rates, which strongly favors converting now. Paying 22% today to avoid 28% later is a clear win."
                  : futureTaxAssumption === "lower"
                  ? "You're assuming lower future tax rates, which reduces the benefit of converting. Make sure this assumption is based on solid reasoning—most advisors expect rates to increase."
                  : "You're assuming tax rates stay the same. Given current deficit levels, many advisors view this as optimistic. Consider running scenarios with higher future rates."}
              </p>

              <p className="text-base font-bold text-slate-900">
                • Break-even analysis:
              </p>
              <p className="text-base font-medium text-slate-700 pl-4">
                {analysis.breakEvenYear > 0
                  ? `Based on this model, you break even on conversion taxes around age ${projections.find(p => p.year === analysis.breakEvenYear)?.age}. After that point, all additional tax savings flow directly to your benefit.`
                  : "The model doesn't show a clear break-even point within your time horizon. This suggests conversions may not be optimal with current parameters."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Helper Panels */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-amber-50 border-2 border-amber-300">
          <CardHeader>
            <CardTitle className="text-lg font-black text-amber-900">What if you convert too much in one year?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-amber-800 leading-relaxed">
              Converting too much can push you into a higher tax bracket, defeating the purpose. For example, if you're in the 12% bracket and convert enough to jump to 22% or 24%, you're paying unnecessarily high taxes. The key is to convert just enough to "fill up" your current bracket without spilling into the next one. This is why spreading conversions over multiple years is usually optimal.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-2 border-blue-300">
          <CardHeader>
            <CardTitle className="text-lg font-black text-blue-900">Why early retirement creates tax opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-blue-800 leading-relaxed">
              When you retire early, you often have a gap of 5-10 years between leaving work and starting Social Security. During these years, your taxable income can be very low—maybe just investment income or part-time consulting. This is your conversion window. You can convert $50,000-$100,000+ per year while staying in the 12% or 22% brackets, rates you'll never see again once RMDs and Social Security kick in.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Year-by-Year Table */}
      {projections.length > 0 && (
        <Card className="border-2 border-black">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-black">Detailed Year-by-Year Projection</CardTitle>
            <Button onClick={exportToCSV} className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow className="border-b-2 border-black">
                    <TableHead className="font-black text-slate-900">Year</TableHead>
                    <TableHead className="font-black text-slate-900">Age</TableHead>
                    <TableHead className="font-black text-slate-900">Conversion</TableHead>
                    <TableHead className="font-black text-slate-900">Taxable Income</TableHead>
                    <TableHead className="font-black text-slate-900">Est. Taxes</TableHead>
                    <TableHead className="font-black text-slate-900">Traditional</TableHead>
                    <TableHead className="font-black text-slate-900">Roth</TableHead>
                    <TableHead className="font-black text-slate-900">Taxable</TableHead>
                    <TableHead className="font-black text-slate-900">Total Portfolio</TableHead>
                    <TableHead className="font-black text-slate-900">Withdrawal</TableHead>
                    <TableHead className="font-black text-slate-900">Eff. Tax Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projections.map((p, idx) => (
                    <TableRow
                      key={idx}
                      className={p.conversionAmount > 0 && p.effectiveTaxRate < 20 ? "bg-emerald-50" : ""}
                    >
                      <TableCell className="font-semibold">{p.year}</TableCell>
                      <TableCell className="font-semibold">{p.age}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.conversionAmount)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.taxableIncome)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.estimatedTaxes)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.traditionalBalance)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.rothBalance)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.taxableBalance)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.totalPortfolio)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.withdrawalAmount)}</TableCell>
                      <TableCell className="font-semibold">{formatPercent(p.effectiveTaxRate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Rows highlighted in green indicate years with optimal conversion opportunities (low effective tax rates).
            </p>
          </CardContent>
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
