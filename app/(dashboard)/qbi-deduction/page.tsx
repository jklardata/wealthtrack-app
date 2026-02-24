"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  Percent,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Lightbulb,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
// 2025 QBI income thresholds
const THRESHOLDS = {
  single:  { lower: 197300, upper: 247300, range: 50000 },
  married: { lower: 394600, upper: 494600, range: 100000 },
};

const SSTB_TYPES = [
  "Health (doctors, dentists, nurses)",
  "Law",
  "Accounting / Tax Services",
  "Actuarial Science",
  "Performing Arts",
  "Consulting",
  "Athletics",
  "Financial Services",
  "Brokerage Services",
  "Investing / Trading",
];

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

// ─── Types ────────────────────────────────────────────────────────────────────
type FilingStatus = "single" | "married";

interface QBIResult {
  baseDeduction: number;
  incomeCap: number;
  w2Limit: number | null;
  phaseOutFraction: number;
  finalDeduction: number;
  taxSavings: number;
  status: "full" | "phase_out" | "eliminated" | "w2_limited";
  zone: "green" | "yellow" | "red";
  tips: string[];
  incomeRoomToFullDeduction: number;
}

// ─── Core Calculation ─────────────────────────────────────────────────────────
function calculateQBI(
  qbi: number,
  taxableIncome: number,
  capitalGains: number,
  isSSTB: boolean,
  filingStatus: FilingStatus,
  w2Wages: number,
  qualifiedProperty: number,
  federalRate: number
): QBIResult {
  const { lower, upper, range } = THRESHOLDS[filingStatus];

  const baseDeduction = qbi * 0.2;
  // Income cap: 20% of (ordinary taxable income) — capital gains excluded
  const incomeCap = Math.max(0, (taxableIncome - Math.max(0, capitalGains)) * 0.2);

  let finalDeduction = 0;
  let w2Limit: number | null = null;
  let phaseOutFraction = 0;
  let status: QBIResult["status"] = "full";
  let zone: QBIResult["zone"] = "green";
  const tips: string[] = [];

  if (taxableIncome <= lower) {
    // ── Below threshold: full deduction, no W-2 test ──────────────────────────
    finalDeduction = Math.min(baseDeduction, incomeCap);
    status = "full";
    zone = "green";
    tips.push(`You're in the full deduction zone — ${formatCurrency(lower - taxableIncome)} below the ${filingStatus === "single" ? "single" : "married filing jointly"} threshold of ${formatCurrency(lower)}.`);
    tips.push("No W-2 wage test applies. The deduction is simply 20% of your QBI.");

  } else if (taxableIncome >= upper && isSSTB) {
    // ── Above upper threshold + SSTB: zero deduction ──────────────────────────
    finalDeduction = 0;
    phaseOutFraction = 1;
    status = "eliminated";
    zone = "red";
    tips.push(`Your income exceeds the SSTB phase-out limit of ${formatCurrency(upper)}. No QBI deduction is available.`);
    tips.push(`Maximize retirement deductions (Solo 401k up to $70k, SEP-IRA) to reduce taxable income below ${formatCurrency(upper)}.`);
    tips.push("Health insurance premiums (self-employed deduction) also directly reduce QBI income.");

  } else if (taxableIncome > lower && isSSTB) {
    // ── In phase-out range + SSTB: deduction reduced proportionally ───────────
    phaseOutFraction = (taxableIncome - lower) / range;
    const uncapped = Math.min(baseDeduction, incomeCap);
    finalDeduction = uncapped * (1 - phaseOutFraction);
    status = "phase_out";
    zone = "yellow";
    const incomeOverThreshold = taxableIncome - lower;
    tips.push(`You're ${Math.round(phaseOutFraction * 100)}% through the SSTB phase-out range. Your deduction is reduced by that same fraction.`);
    tips.push(`Reducing taxable income by ${formatCurrency(incomeOverThreshold)} (back below ${formatCurrency(lower)}) would restore your full deduction.`);
    tips.push("Consider maximizing Solo 401(k), SEP-IRA, health insurance, and business expense deductions.");

  } else {
    // ── Non-SSTB (any income) or above threshold: apply W-2 wage test ─────────
    const w2Method1 = w2Wages * 0.5;
    const w2Method2 = w2Wages * 0.25 + qualifiedProperty * 0.025;
    w2Limit = Math.max(w2Method1, w2Method2);

    const uncapped = Math.min(baseDeduction, incomeCap);

    if (taxableIncome <= lower) {
      // Below threshold non-SSTB: no W-2 test (shouldn't reach here but guard)
      finalDeduction = uncapped;
      status = "full";
      zone = "green";
    } else if (taxableIncome < upper) {
      // Phase-out range non-SSTB: gradually introduce W-2 test
      phaseOutFraction = (taxableIncome - lower) / range;
      const w2Reduction = Math.max(0, uncapped - w2Limit) * phaseOutFraction;
      finalDeduction = Math.max(uncapped - w2Reduction, w2Limit < uncapped ? w2Limit : uncapped);
      finalDeduction = Math.min(finalDeduction, incomeCap);

      if (w2Limit < uncapped) {
        status = "w2_limited";
        zone = "yellow";
        tips.push(`You're in the phase-out range and the W-2 wage test is being phased in (${Math.round(phaseOutFraction * 100)}%).`);
        tips.push(`W-2 wage limit (50% of wages): ${formatCurrency(w2Limit)} vs potential deduction: ${formatCurrency(uncapped)}.`);
        tips.push("For S-Corp owners: paying yourself a higher salary increases the W-2 wage base.");
      } else {
        status = "full";
        zone = "green";
        tips.push("Your W-2 wages are sufficient — not limiting your deduction.");
      }
    } else {
      // Above upper threshold non-SSTB: full W-2 wage test
      finalDeduction = Math.min(uncapped, w2Limit);
      if (w2Limit < uncapped) {
        status = "w2_limited";
        zone = "yellow";
        tips.push(`Your deduction is limited by the W-2 wage test to ${formatCurrency(w2Limit)}.`);
        tips.push(`To unlock the full ${formatCurrency(uncapped)} deduction, W-2 wages would need to reach ${formatCurrency(uncapped / 0.5)}.`);
        tips.push("S-Corp owners can optimize this by adjusting salary — but balance against SE tax cost.");
      } else {
        status = "full";
        zone = "green";
        tips.push("Great — your W-2 wages exceed the limitation threshold. You get the full deduction.");
      }
    }
  }

  finalDeduction = Math.max(0, finalDeduction);
  const taxSavings = finalDeduction * federalRate;

  return {
    baseDeduction,
    incomeCap,
    w2Limit,
    phaseOutFraction,
    finalDeduction,
    taxSavings,
    status,
    zone,
    tips,
    incomeRoomToFullDeduction: Math.max(0, taxableIncome - lower),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function QBIDeductionPage() {
  const [isSSTB, setIsSSTB] = useState<"yes" | "no">("no");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [qbi, setQbi] = useState(120000);
  const [taxableIncome, setTaxableIncome] = useState(150000);
  const [capitalGains, setCapitalGains] = useState(0);
  const [w2Wages, setW2Wages] = useState(0);
  const [qualifiedProperty, setQualifiedProperty] = useState(0);
  const [federalRate, setFederalRate] = useState(0.22);

  // Load saved calculator preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem("solofi_qbi");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.isSSTB !== undefined) setIsSSTB(p.isSSTB);
        if (p.filingStatus !== undefined) setFilingStatus(p.filingStatus);
        if (p.qbi !== undefined) setQbi(p.qbi);
        if (p.taxableIncome !== undefined) setTaxableIncome(p.taxableIncome);
        if (p.capitalGains !== undefined) setCapitalGains(p.capitalGains);
        if (p.w2Wages !== undefined) setW2Wages(p.w2Wages);
        if (p.qualifiedProperty !== undefined) setQualifiedProperty(p.qualifiedProperty);
        if (p.federalRate !== undefined) setFederalRate(p.federalRate);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("solofi_qbi", JSON.stringify({
        isSSTB, filingStatus, qbi, taxableIncome, capitalGains, w2Wages, qualifiedProperty, federalRate,
      }));
    } catch {}
  }, [isSSTB, filingStatus, qbi, taxableIncome, capitalGains, w2Wages, qualifiedProperty, federalRate]);

  const isSSTBBool = isSSTB === "yes";
  const threshold = THRESHOLDS[filingStatus];

  const result = useMemo(
    () =>
      calculateQBI(
        qbi,
        taxableIncome,
        capitalGains,
        isSSTBBool,
        filingStatus,
        w2Wages,
        qualifiedProperty,
        federalRate
      ),
    [qbi, taxableIncome, capitalGains, isSSTBBool, filingStatus, w2Wages, qualifiedProperty, federalRate]
  );

  // Progress bar: how close to the threshold
  const thresholdProgress = Math.min(100, (taxableIncome / threshold.upper) * 100);

  const zoneColor = {
    green: { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800 border-emerald-200", card: "bg-emerald-50 border-emerald-200" },
    yellow: { bar: "bg-amber-400", badge: "bg-amber-100 text-amber-800 border-amber-200", card: "bg-amber-50 border-amber-200" },
    red: { bar: "bg-red-500", badge: "bg-red-100 text-red-800 border-red-200", card: "bg-red-50 border-red-200" },
  }[result.zone];

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Percent className="h-5 w-5 text-emerald-600" />
          QBI Deduction Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Calculate your Section 199A Qualified Business Income deduction — up to 20% of business income, tax-free.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* ── Inputs ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Business Setup */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Business Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-600">Business Type</Label>
                <Select value={isSSTB} onValueChange={(v: "yes" | "no") => setIsSSTB(v)}>
                  <SelectTrigger className="mt-1 text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Non-SSTB (Tech, Real Estate, Manufacturing, etc.)</SelectItem>
                    <SelectItem value="yes">SSTB (Consulting, Law, Finance, Healthcare, etc.)</SelectItem>
                  </SelectContent>
                </Select>
                {isSSTBBool && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-xs text-amber-800 font-medium mb-1">SSTB includes:</p>
                    <p className="text-xs text-amber-700">{SSTB_TYPES.slice(0, 5).join(", ")}, and more.</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Filing Status</Label>
                <Select value={filingStatus} onValueChange={(v: FilingStatus) => setFilingStatus(v)}>
                  <SelectTrigger className="mt-1 text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married Filing Jointly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Income */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Income</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-600">Qualified Business Income (QBI)</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={qbi}
                    onChange={(e) => setQbi(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Net profit from your pass-through business</p>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Total Taxable Income</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={taxableIncome}
                    onChange={(e) => setTaxableIncome(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">After standard/itemized deductions, before QBI</p>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Net Capital Gains</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={capitalGains}
                    onChange={(e) => setCapitalGains(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Excluded from the QBI income cap calculation</p>
              </div>

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
            </CardContent>
          </Card>

          {/* W-2 Wage Limit (non-SSTB above threshold) */}
          {(!isSSTBBool || taxableIncome > threshold.lower) && !isSSTBBool && (
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900">W-2 Wage Limitation</CardTitle>
                <p className="text-xs text-slate-500">Only applies to non-SSTBs above the income threshold</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-slate-600">W-2 Wages Paid</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      type="number"
                      value={w2Wages}
                      onChange={(e) => setW2Wages(Number(e.target.value))}
                      className="pl-8 text-sm"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Total W-2 wages paid to you (S-Corp salary) or employees</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600">Qualified Business Property (UBIA)</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      type="number"
                      value={qualifiedProperty}
                      onChange={(e) => setQualifiedProperty(Number(e.target.value))}
                      className="pl-8 text-sm"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Original cost of depreciable property used in business</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Deduction Amount */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-emerald-600 border-none shadow-sm">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-emerald-100 mb-1">QBI Deduction</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(result.finalDeduction)}</p>
                <p className="text-xs text-emerald-200 mt-0.5">tax-free income</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Tax Savings</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(result.taxSavings)}</p>
                <p className="text-xs text-slate-400 mt-0.5">at {(federalRate * 100).toFixed(0)}% bracket</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-slate-500 mb-1">% of QBI</p>
                <p className="text-2xl font-bold text-slate-900">
                  {qbi > 0 ? ((result.finalDeduction / qbi) * 100).toFixed(1) : "0"}%
                </p>
                <p className="text-xs text-slate-400 mt-0.5">effective deduction rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Income Threshold Status */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-900">Income Threshold Status</CardTitle>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${zoneColor.badge}`}>
                  {result.status === "full" ? "Full Deduction" :
                   result.status === "phase_out" ? "Phasing Out" :
                   result.status === "eliminated" ? "Eliminated" : "W-2 Limited"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>$0</span>
                  <span className="text-emerald-700 font-medium">{formatCurrency(threshold.lower)} threshold</span>
                  <span className={isSSTBBool ? "text-red-600 font-medium" : "text-slate-500"}>{formatCurrency(threshold.upper)} limit</span>
                </div>
                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                  {/* Green zone */}
                  <div className="absolute inset-y-0 left-0 bg-emerald-200 rounded-full" style={{ width: `${(threshold.lower / threshold.upper) * 100}%` }} />
                  {/* Phase-out zone */}
                  <div className="absolute inset-y-0 bg-amber-200" style={{ left: `${(threshold.lower / threshold.upper) * 100}%`, right: 0 }} />
                  {/* Income marker */}
                  <div className={`absolute inset-y-0 left-0 rounded-full opacity-70 ${zoneColor.bar}`} style={{ width: `${thresholdProgress}%` }} />
                  {/* Marker line */}
                  <div className="absolute inset-y-0 w-0.5 bg-slate-800" style={{ left: `${Math.min(99.5, thresholdProgress)}%` }} />
                </div>
                <p className="text-xs text-slate-600">
                  Your taxable income: <span className="font-semibold">{formatCurrency(taxableIncome)}</span>
                  {result.status === "full" && taxableIncome <= threshold.lower && (
                    <span className="text-emerald-600"> ({formatCurrency(threshold.lower - taxableIncome)} below full-deduction threshold)</span>
                  )}
                  {result.status === "phase_out" && (
                    <span className="text-amber-600"> ({Math.round(result.phaseOutFraction * 100)}% through phase-out)</span>
                  )}
                  {result.status === "eliminated" && (
                    <span className="text-red-600"> (above phase-out limit)</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Calculation Breakdown */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Calculation Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Qualified Business Income</span>
                <span className="font-semibold text-slate-900">{formatCurrency(qbi)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">× 20%</span>
                <span className="font-medium text-slate-700">= {formatCurrency(result.baseDeduction)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Income cap (20% of ordinary income)</span>
                <span className="font-medium text-slate-700">{formatCurrency(result.incomeCap)}</span>
              </div>
              {result.w2Limit !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">W-2 wage limit (50% of wages)</span>
                  <span className="font-medium text-slate-700">{formatCurrency(result.w2Limit)}</span>
                </div>
              )}
              {result.phaseOutFraction > 0 && result.phaseOutFraction < 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Phase-out reduction</span>
                  <span className="font-medium text-red-500">× {((1 - result.phaseOutFraction) * 100).toFixed(0)}% remaining</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="text-sm font-semibold text-slate-900">Final QBI Deduction</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(result.finalDeduction)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-100 pt-2">
                <span className="text-slate-500">Tax saved at {(federalRate * 100).toFixed(0)}% bracket</span>
                <span className="font-bold text-emerald-600">{formatCurrency(result.taxSavings)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          {result.tips.length > 0 && (
            <Card className={`border shadow-sm ${zoneColor.card}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-emerald-600" />
                  How to Optimize Your Deduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p>{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Info note */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900 mb-1">About QBI (Section 199A)</p>
              <p className="text-xs text-blue-800">
                The QBI deduction applies to sole proprietors, S-Corps, partnerships, and LLCs taxed as pass-throughs. It does not apply to C-Corps or W-2 employees. Thresholds shown are 2025 approximate values and adjust annually for inflation. Consult a CPA for your specific situation.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <Link
              href="/tax-bracket-filling"
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Tax bracket filling
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tax-calculator"
              className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Full tax calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
