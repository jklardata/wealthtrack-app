"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  Heart,
  Info,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────
const HSA_LIMITS_2025 = {
  self_only: 4300,
  family: 8550,
  catchup: 1000,
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

const formatCurrencyK = (v: number) =>
  Math.abs(v) >= 1000 ? `$${(v / 1000).toFixed(0)}k` : formatCurrency(v);

// ─── Calculation ──────────────────────────────────────────────────────────────
function buildComparisonData(
  annualContribution: number,
  returnRate: number,
  federalRate: number,
  stateRate: number,
  years: number
) {
  const totalTaxRate = federalRate + stateRate;
  const cgRate = 0.15;
  const data = [];

  let hsaFV = 0;
  let k401FV = 0;
  let taxableFV = 0;
  const afterTaxContrib = annualContribution * (1 - totalTaxRate);

  for (let y = 1; y <= years; y++) {
    hsaFV = (hsaFV + annualContribution) * (1 + returnRate);
    k401FV = (k401FV + annualContribution) * (1 + returnRate);
    taxableFV = (taxableFV + afterTaxContrib) * (1 + returnRate * (1 - cgRate));

    if (y % 5 === 0 || y === 1 || y === years) {
      data.push({
        year: y,
        HSA: Math.round(hsaFV),
        "401k": Math.round(k401FV * (1 - totalTaxRate)),
        Taxable: Math.round(taxableFV),
      });
    }
  }

  return data;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HSACalculatorPage() {
  const [coverageType, setCoverageType] = useState<"self_only" | "family">("self_only");
  const [age, setAge] = useState(35);
  const [annualContrib, setAnnualContrib] = useState(HSA_LIMITS_2025.self_only);
  const [federalRate, setFederalRate] = useState(0.22);
  const [stateRate, setStateRate] = useState(5);
  const [returnRate, setReturnRate] = useState(7);
  const [yearsToRetirement, setYearsToRetirement] = useState(30);
  const [expectedMedicalExpenses, setExpectedMedicalExpenses] = useState(10000);

  const catchupEligible = age >= 55;
  const maxContrib = HSA_LIMITS_2025[coverageType] + (catchupEligible ? HSA_LIMITS_2025.catchup : 0);
  const totalTaxRate = federalRate + stateRate / 100;

  const annualTaxSavings = annualContrib * totalTaxRate;
  const cgRate = 0.15;

  const comparisonData = useMemo(
    () =>
      buildComparisonData(annualContrib, returnRate / 100, federalRate, stateRate / 100, yearsToRetirement),
    [annualContrib, returnRate, federalRate, stateRate, yearsToRetirement]
  );

  const finalValues = comparisonData[comparisonData.length - 1] ?? { HSA: 0, "401k": 0, Taxable: 0 };
  const vsK401Advantage = finalValues.HSA - finalValues["401k"];

  const annualMedicalCoverage = Math.min(annualContrib, expectedMedicalExpenses);
  const medicalTaxSavings = annualMedicalCoverage * totalTaxRate;

  const atLimit = annualContrib >= maxContrib;
  const overLimit = annualContrib > maxContrib;

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Heart className="h-5 w-5 text-emerald-600" />
          HSA Triple-Tax Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          The only account with three tax advantages: pre-tax contributions, tax-free growth, and tax-free medical withdrawals.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Your HSA Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-600">Coverage Type</Label>
                <Select value={coverageType} onValueChange={(v: "self_only" | "family") => setCoverageType(v)}>
                  <SelectTrigger className="mt-1 text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self_only">Self-Only HDHP (2025 max: $4,300)</SelectItem>
                    <SelectItem value="family">Family HDHP (2025 max: $8,550)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Your Age</Label>
                <Input
                  type="number"
                  min={18}
                  max={75}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="mt-1 text-sm"
                />
                {catchupEligible && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-1 mt-1">
                    Age 55+ catch-up: +$1,000/year allowed
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Annual HSA Contribution</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={annualContrib}
                    onChange={(e) => setAnnualContrib(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  2025 limit: {formatCurrency(maxContrib)}{catchupEligible ? " (incl. catch-up)" : ""}
                </p>
                {overLimit && (
                  <p className="text-xs text-red-600 mt-1">Exceeds 2025 limit — contributions above this face a 6% excise tax.</p>
                )}
                {atLimit && !overLimit && (
                  <p className="text-xs text-emerald-600 mt-1">At the maximum — excellent!</p>
                )}
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Expected Annual Medical Expenses</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={expectedMedicalExpenses}
                    onChange={(e) => setExpectedMedicalExpenses(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Used to model tax-free withdrawal benefit</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Growth & Tax Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-600">Federal Tax Bracket</Label>
                <Select value={String(federalRate)} onValueChange={(v) => setFederalRate(Number(v))}>
                  <SelectTrigger className="mt-1 text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.22">22%</SelectItem>
                    <SelectItem value="0.24">24%</SelectItem>
                    <SelectItem value="0.32">32%</SelectItem>
                    <SelectItem value="0.35">35%</SelectItem>
                    <SelectItem value="0.37">37%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">State Income Tax Rate</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min={0}
                    max={15}
                    step={0.5}
                    value={stateRate}
                    onChange={(e) => setStateRate(Number(e.target.value))}
                    className="text-sm w-24"
                  />
                  <span className="text-sm text-slate-500">%</span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Expected Annual Return</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min={1}
                    max={15}
                    step={0.5}
                    value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    className="text-sm w-24"
                  />
                  <span className="text-sm text-slate-500">%</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">7% is a common long-term equity assumption</p>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Years Until Retirement</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={yearsToRetirement}
                  onChange={(e) => setYearsToRetirement(Number(e.target.value))}
                  className="mt-1 text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-emerald-600 border-none shadow-sm">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-emerald-100 mb-1">Annual Tax Savings</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(annualTaxSavings)}</p>
                <p className="text-xs text-emerald-200 mt-0.5">from contribution deduction</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Medical Tax Savings</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(medicalTaxSavings)}</p>
                <p className="text-xs text-slate-400 mt-0.5">vs paying out-of-pocket</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-slate-500 mb-1">vs 401(k) Advantage</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(vsK401Advantage)}</p>
                <p className="text-xs text-slate-400 mt-0.5">over {yearsToRetirement} years</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">The Triple Tax Advantage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
                  <div className="text-emerald-600 font-bold text-lg mb-1">1</div>
                  <p className="text-xs font-semibold text-emerald-900 mb-1">Pre-Tax Contribution</p>
                  <p className="text-xs text-emerald-700">Reduces taxable income immediately</p>
                  <p className="text-xs font-bold text-emerald-800 mt-2">Save {formatCurrency(annualTaxSavings)}/yr</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <div className="text-blue-600 font-bold text-lg mb-1">2</div>
                  <p className="text-xs font-semibold text-blue-900 mb-1">Tax-Free Growth</p>
                  <p className="text-xs text-blue-700">No tax on dividends or capital gains inside HSA</p>
                  <p className="text-xs font-bold text-blue-800 mt-2">vs {cgRate * 100}% LTCG in taxable</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                  <div className="text-purple-600 font-bold text-lg mb-1">3</div>
                  <p className="text-xs font-semibold text-purple-900 mb-1">Tax-Free Withdrawal</p>
                  <p className="text-xs text-purple-700">For qualified medical expenses</p>
                  <p className="text-xs font-bold text-purple-800 mt-2">vs {(totalTaxRate * 100).toFixed(0)}% tax on 401(k)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  {yearsToRetirement}-Year Growth Comparison
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Same {formatCurrency(annualContrib)}/yr contribution across three account types (after-tax values)
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={comparisonData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#0f172a", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `Yr ${v}`}
                  />
                  <YAxis
                    tick={{ fill: "#0f172a", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatCurrencyK}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(v, name) => [formatCurrency(Number(v)), name]}
                    labelFormatter={(l) => `Year ${l}`}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="HSA" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="401k" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="Taxable" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">HSA (tax-free for medical)</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(finalValues.HSA)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">401(k) (after tax on withdrawal)</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(finalValues["401k"])}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Taxable (after cap gains)</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(finalValues.Taxable)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border border-emerald-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">HSA Strategy Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { icon: CheckCircle, text: "Invest your HSA — don't let it sit in cash. Many plans allow index fund investing once you hit a $1k–$2k minimum.", color: "text-emerald-600" },
                { icon: CheckCircle, text: "Pay medical expenses out-of-pocket now, save receipts, and reimburse yourself years later for a tax-free investment strategy.", color: "text-emerald-600" },
                { icon: CheckCircle, text: "After age 65, HSA withdrawals for non-medical expenses are taxed like a 401(k) — it becomes a second retirement account if you stay healthy.", color: "text-emerald-600" },
                { icon: AlertTriangle, text: "You can't contribute to an HSA if enrolled in Medicare or a non-HDHP plan, including a spouse's FSA.", color: "text-amber-600" },
              ].map(({ icon: Icon, text, color }, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <Icon className={`h-4 w-4 ${color} flex-shrink-0 mt-0.5`} />
                  <p>{text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              HSA requires enrollment in a High-Deductible Health Plan (HDHP). 2025 HDHP minimum deductible: $1,650 (self-only) / $3,300 (family). Projections assume consistent annual contributions and investment returns. Actual results vary.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/quarterly-estimated-taxes"
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Quarterly tax planner
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/qbi-deduction"
              className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              QBI deduction calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
