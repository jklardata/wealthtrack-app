"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  ArrowRight,
  Info,
  Heart,
  PiggyBank,
  Building2,
  Calendar,
  Users,
  CheckCircle,
  ClipboardList,
  Shield,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const SE_TAX_RATE = 0.153;
const SE_DEDUCTION_RATE = 0.0765;

const FEDERAL_BRACKETS = [
  { label: "22% (taxable income ~$47k–$103k, single)", value: 0.22 },
  { label: "24% (taxable income ~$103k–$197k, single)", value: 0.24 },
  { label: "32% (taxable income ~$197k–$250k, single)", value: 0.32 },
  { label: "35% (taxable income ~$250k–$626k, single)", value: 0.35 },
  { label: "37% (taxable income $626k+, single)", value: 0.37 },
];

const SCORP_ACCOUNTING_COST = 2500;

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

// ─── Types ────────────────────────────────────────────────────────────────────
interface RateResult {
  grossIncomeNeeded: number;
  annualBillableHours: number;
  billableHoursPerWeek: number;
  hourlyRate: number;
  dayRate: number;
  weeklyRate: number;
  projectRanges: { small: [number, number]; medium: [number, number]; large: [number, number] };
  utilizationNote: string;
  seTax: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  w2Equivalent: number;
  freelancePremium: number;
  scorp: { salary: number; distributions: number; seTaxSavings: number; netSavings: number } | null;
  quarterlySetAside: number;
  rateIncreaseImpact: number;
  bufferRate: number;
  vacationRateImpact: number;
}

// ─── Core Calculation ─────────────────────────────────────────────────────────
function analyzeRate(
  targetTakeHome: number,
  annualExpenses: number,
  healthInsurance: number,
  retirementContrib: number,
  hoursPerWeek: number,
  billablePercent: number,
  vacationWeeks: number,
  federalRate: number,
  stateRate: number
): RateResult {
  const workingWeeks = 52 - vacationWeeks;
  const billableHoursPerWeek = hoursPerWeek * (billablePercent / 100);
  const annualBillableHours = Math.round(billableHoursPerWeek * workingWeeks);

  const totalRate = federalRate + stateRate;
  const fixedCosts = annualExpenses + healthInsurance + retirementContrib;
  const grossMultiplier = 1 - SE_TAX_RATE - (1 - SE_DEDUCTION_RATE) * totalRate;
  const grossIncomeNeeded = Math.max(
    0,
    Math.ceil((targetTakeHome + fixedCosts * (1 - totalRate)) / grossMultiplier)
  );

  const seDeduction = grossIncomeNeeded * SE_DEDUCTION_RATE;
  const taxableIncome = Math.max(0, grossIncomeNeeded - seDeduction - fixedCosts);
  const seTax = Math.round(grossIncomeNeeded * SE_TAX_RATE);
  const federalTax = Math.round(taxableIncome * federalRate);
  const stateTax = Math.round(taxableIncome * stateRate);
  const totalTax = seTax + federalTax + stateTax;
  const effectiveRate = grossIncomeNeeded > 0 ? totalTax / grossIncomeNeeded : 0;

  const hourlyRate = annualBillableHours > 0 ? Math.ceil(grossIncomeNeeded / annualBillableHours) : 0;
  const dayRate = Math.ceil(hourlyRate * 8);
  const weeklyRate = Math.ceil(hourlyRate * billableHoursPerWeek);

  const projectRanges: RateResult["projectRanges"] = {
    small: [hourlyRate * 4, hourlyRate * 16],
    medium: [hourlyRate * 20, hourlyRate * 60],
    large: [hourlyRate * 80, hourlyRate * 200],
  };

  let utilizationNote = "";
  if (billablePercent < 60) utilizationNote = "Low utilization — tighten your pipeline to bill more hours.";
  else if (billablePercent >= 85) utilizationNote = "High utilization — leave buffer for business development.";
  else utilizationNote = "Healthy utilization for a sustainable freelance practice.";

  const w2TaxRate = 0.0765 + federalRate + stateRate;
  const w2Equivalent = w2TaxRate < 1 ? Math.ceil(targetTakeHome / (1 - w2TaxRate)) : 0;
  const freelancePremium = Math.max(0, grossIncomeNeeded - w2Equivalent);

  // $10/hr rate increase → additional take-home after taxes
  const rateIncreaseImpact = Math.round(10 * annualBillableHours * (1 - effectiveRate));

  // Buffer rate: cover 1 slow month (4 weeks with 0 billing)
  const slowMonthHoursLost = billableHoursPerWeek * 4;
  const bufferRate = annualBillableHours > slowMonthHoursLost
    ? Math.ceil(grossIncomeNeeded / (annualBillableHours - slowMonthHoursLost))
    : 0;

  // Rate impact of 1 extra vacation week
  const annualHoursWithExtraWeek = Math.round(billableHoursPerWeek * (workingWeeks - 1));
  const rateWithExtraWeek = annualHoursWithExtraWeek > 0
    ? Math.ceil(grossIncomeNeeded / annualHoursWithExtraWeek)
    : 0;
  const vacationRateImpact = rateWithExtraWeek - hourlyRate;

  let scorp: RateResult["scorp"] = null;
  if (grossIncomeNeeded > 80000) {
    const reasonableSalary = Math.round(grossIncomeNeeded * 0.55);
    const distributions = grossIncomeNeeded - reasonableSalary;
    const seTaxSavings = Math.round(distributions * SE_TAX_RATE);
    const netSavings = seTaxSavings - SCORP_ACCOUNTING_COST;
    if (netSavings > 1000) {
      scorp = { salary: reasonableSalary, distributions, seTaxSavings, netSavings };
    }
  }

  const quarterlySetAside = Math.ceil(totalTax / 4);

  return {
    grossIncomeNeeded,
    annualBillableHours,
    billableHoursPerWeek,
    hourlyRate,
    dayRate,
    weeklyRate,
    projectRanges,
    utilizationNote,
    seTax,
    federalTax,
    stateTax,
    totalTax,
    effectiveRate,
    w2Equivalent,
    freelancePremium,
    scorp,
    quarterlySetAside,
    rateIncreaseImpact,
    bufferRate,
    vacationRateImpact,
  };
}

// ─── Revenue Bar Segment ──────────────────────────────────────────────────────
function RevenueBar({ gross, seTax, federalTax, stateTax, health, retirement, expenses, takeHome }: {
  gross: number; seTax: number; federalTax: number; stateTax: number;
  health: number; retirement: number; expenses: number; takeHome: number;
}) {
  if (gross === 0) return null;
  const pct = (v: number) => ((v / gross) * 100).toFixed(1);
  const segments = [
    { label: "SE Tax", value: seTax, color: "bg-red-500", textColor: "text-red-700", bg: "bg-red-50" },
    { label: "Federal Tax", value: federalTax, color: "bg-orange-400", textColor: "text-orange-700", bg: "bg-orange-50" },
    ...(stateTax > 0 ? [{ label: "State Tax", value: stateTax, color: "bg-amber-400", textColor: "text-amber-700", bg: "bg-amber-50" }] : []),
    { label: "Health", value: health, color: "bg-rose-300", textColor: "text-rose-700", bg: "bg-rose-50" },
    { label: "Retirement", value: retirement, color: "bg-blue-400", textColor: "text-blue-700", bg: "bg-blue-50" },
    { label: "Expenses", value: expenses, color: "bg-slate-300", textColor: "text-slate-600", bg: "bg-slate-50" },
    { label: "Take-Home", value: takeHome, color: "bg-emerald-500", textColor: "text-emerald-700", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-3">
      {/* Stacked bar */}
      <div className="flex h-8 rounded-lg overflow-hidden w-full">
        {segments.map((s) => (
          <div
            key={s.label}
            className={`${s.color} transition-all`}
            style={{ width: `${pct(s.value)}%` }}
            title={`${s.label}: ${formatCurrency(s.value)} (${pct(s.value)}%)`}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${s.color} flex-shrink-0`} />
              <span className="text-slate-500">{s.label}</span>
            </div>
            <div className="text-right">
              <span className={`font-semibold ${s.textColor}`}>{formatCurrency(s.value)}</span>
              <span className="text-slate-400 ml-1">({pct(s.value)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FreelanceRatePage() {
  const { isPro } = useSubscription();

  const [targetTakeHome, setTargetTakeHome] = useState(80000);
  const [healthInsurance, setHealthInsurance] = useState(12000);
  const [retirementContrib, setRetirementContrib] = useState(20000);
  const [annualExpenses, setAnnualExpenses] = useState(12000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [billablePercent, setBillablePercent] = useState(70);
  const [vacationWeeks, setVacationWeeks] = useState(4);
  const [federalRate, setFederalRate] = useState(0.22);
  const [stateRate, setStateRate] = useState(5);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("solofi_freelance_rate");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.targetTakeHome !== undefined) setTargetTakeHome(p.targetTakeHome);
        if (p.healthInsurance !== undefined) setHealthInsurance(p.healthInsurance);
        if (p.retirementContrib !== undefined) setRetirementContrib(p.retirementContrib);
        if (p.annualExpenses !== undefined) setAnnualExpenses(p.annualExpenses);
        if (p.hoursPerWeek !== undefined) setHoursPerWeek(p.hoursPerWeek);
        if (p.billablePercent !== undefined) setBillablePercent(p.billablePercent);
        if (p.vacationWeeks !== undefined) setVacationWeeks(p.vacationWeeks);
        if (p.federalRate !== undefined) setFederalRate(p.federalRate);
        if (p.stateRate !== undefined) setStateRate(p.stateRate);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("solofi_freelance_rate", JSON.stringify({
        targetTakeHome, healthInsurance, retirementContrib, annualExpenses,
        hoursPerWeek, billablePercent, vacationWeeks, federalRate, stateRate,
      }));
    } catch {}
  }, [targetTakeHome, healthInsurance, retirementContrib, annualExpenses, hoursPerWeek, billablePercent, vacationWeeks, federalRate, stateRate]);

  const result = useMemo(
    () => analyzeRate(
      targetTakeHome, annualExpenses, healthInsurance, retirementContrib,
      hoursPerWeek, billablePercent, vacationWeeks, federalRate, stateRate / 100
    ),
    [targetTakeHome, annualExpenses, healthInsurance, retirementContrib, hoursPerWeek, billablePercent, vacationWeeks, federalRate, stateRate]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          What should you actually charge?
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          See the minimum rate you need to hit your take-home—accounting for SE tax, benefits, and time off. Then decide if your current rate is enough.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* ── Inputs ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Income Goals */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Your Income Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-600">Target Annual Take-Home</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={targetTakeHome}
                    onChange={(e) => setTargetTakeHome(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">After taxes—what you want to keep as cash</p>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                  <Heart className="h-3 w-3 text-rose-400" />
                  Health Insurance (annual)
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Self-paid premiums (fully deductible)</p>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                  <PiggyBank className="h-3 w-3 text-emerald-500" />
                  Retirement Contributions
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={retirementContrib}
                    onChange={(e) => setRetirementContrib(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Solo 401(k), SEP-IRA, etc. (deductible)</p>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Annual Business Expenses</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={annualExpenses}
                    onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Software, equipment, coworking, etc.{" "}
                  <Link href="/freelance-checklist" className="text-emerald-600 hover:text-emerald-700 underline-offset-2 hover:underline">
                    See deduction checklist →
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Work Schedule */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Your Work Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-600">Hours Worked / Week</Label>
                <Input
                  type="number"
                  min={1}
                  max={80}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-medium text-slate-600">Billable Utilization</Label>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600">{billablePercent}%</span>
                    <span className="text-xs text-slate-400 ml-1.5">
                      = {Math.round(hoursPerWeek * (billablePercent / 100))} client hrs/wk · {result.annualBillableHours.toLocaleString()} hrs/yr
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={billablePercent}
                  onChange={(e) => setBillablePercent(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                  <span>20%</span>
                  <span>60% typical</span>
                  <span>100%</span>
                </div>
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5 mt-2">
                  {result.utilizationNote}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-medium text-slate-600">Vacation Weeks / Year</Label>
                  {result.vacationRateImpact > 0 && (
                    <span className="text-xs text-slate-400">
                      +1 week = +${result.vacationRateImpact}/hr
                    </span>
                  )}
                </div>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={vacationWeeks}
                  onChange={(e) => setVacationWeeks(Number(e.target.value))}
                  className="mt-1 text-sm"
                />
                <p className="text-xs text-slate-400 mt-0.5">
                  Each week off requires a higher rate to hit the same gross.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tax Settings */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Tax Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-600">Federal Tax Bracket</Label>
                <Select value={String(federalRate)} onValueChange={(v) => setFederalRate(Number(v))}>
                  <SelectTrigger className="mt-1 text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FEDERAL_BRACKETS.map((b) => (
                      <SelectItem key={b.value} value={String(b.value)} className="text-xs">
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400 mt-0.5">Your marginal rate on taxable income after deductions</p>
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
                <p className="text-xs text-slate-400 mt-0.5">0% for TX, FL, WA, NV, SD, WY, AK</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Hero Rate Card */}
          <Card className="bg-slate-900 border-none shadow-md overflow-hidden">
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Your minimum viable rate</p>
              <div className="flex items-end gap-4 mb-4">
                <div>
                  <span className="text-6xl font-bold text-white">${result.hourlyRate}</span>
                  <span className="text-slate-400 text-lg ml-2">/ hour</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Day Rate (8 hrs)</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(result.dayRate)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Weekly ({Math.round(result.billableHoursPerWeek)} billable hrs)</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(result.weeklyRate)}</p>
                </div>
              </div>
              {result.rateIncreaseImpact > 0 && (
                <p className="text-sm text-emerald-400 mt-3 border-t border-white/10 pt-3">
                  A $10/hr rate increase adds <span className="font-bold text-emerald-300">{formatCurrency(result.rateIncreaseImpact)}</span> to your annual take-home at your current utilization.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Revenue Breakdown — visual bar */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Revenue Breakdown</CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">
                You need to bill <span className="font-semibold text-slate-700">{formatCurrency(result.grossIncomeNeeded)}</span> gross to hit your take-home—here's where it goes.
              </p>
            </CardHeader>
            <CardContent>
              <RevenueBar
                gross={result.grossIncomeNeeded}
                seTax={result.seTax}
                federalTax={result.federalTax}
                stateTax={result.stateTax}
                health={healthInsurance}
                retirement={retirementContrib}
                expenses={annualExpenses}
                takeHome={targetTakeHome}
              />
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                <span>Effective total tax rate: <span className="font-semibold text-slate-600">{(result.effectiveRate * 100).toFixed(1)}%</span></span>
                <span>Billable hrs/yr: <span className="font-semibold text-slate-600">{result.annualBillableHours.toLocaleString()}</span></span>
              </div>
            </CardContent>
          </Card>

          {/* Market Context */}
          <Card className="bg-slate-50 border border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-slate-500" />
                Market Rate Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 mb-3">Typical ranges for experienced independent professionals (US market, 2026):</p>
              <div className="space-y-2">
                {[
                  { role: "Software Engineering / Architecture", range: "$150 – $300/hr" },
                  { role: "Product Management / Strategy", range: "$125 – $250/hr" },
                  { role: "Financial Advisory / CFO", range: "$150 – $350/hr" },
                  { role: "Marketing Strategy / Brand", range: "$75 – $175/hr" },
                  { role: "Legal / Compliance", range: "$200 – $500/hr" },
                  { role: "Operations / Project Management", range: "$75 – $150/hr" },
                ].map(({ role, range }) => (
                  <div key={role} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{role}</span>
                    <span className="font-semibold text-slate-800 flex-shrink-0 ml-4">{range}</span>
                  </div>
                ))}
              </div>
              {result.hourlyRate > 0 && (
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-2 mt-3">
                  Your minimum viable rate is <span className="font-bold">${result.hourlyRate}/hr</span>. If market rates in your field are higher, that difference is pure upside to your take-home.
                </p>
              )}
            </CardContent>
          </Card>

          {/* W2 Equivalent comparison */}
          {isPro ? (
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  Your Freelance Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">W2 Equivalent Salary</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(result.w2Equivalent)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">to net the same take-home as employee</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <p className="text-xs text-slate-500 mb-1">Freelance Premium</p>
                    <p className="text-xl font-bold text-amber-700">+{formatCurrency(result.freelancePremium)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">more gross just to break even</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  You need to earn <span className="font-semibold">{formatCurrency(result.freelancePremium)} more</span> than a W2 employee before capturing any freelance upside. That premium covers:
                </p>
                <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Both sides of FICA (15.3% vs employee's 7.65%)</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Self-funded health insurance ({formatCurrency(healthInsurance)}/yr)</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>No employer 401(k) match, PTO, or benefits</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Business costs paid from revenue ({formatCurrency(annualExpenses)}/yr)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedModule
              title="Your Freelance Premium"
              description="See exactly how much more you need to earn vs. a W2 employee just to break even"
              icon={<Users className="h-5 w-5 text-blue-500" />}
              benefits={["W2 vs freelance gross comparison", "True freelance premium calculation", "FICA, health, and benefits breakdown"]}
            />
          )}

          {/* S-Corp savings alert (conditional) */}
          {result.scorp && (
            isPro ? (
              <Card className="bg-blue-50 border border-blue-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    S-Corp Election Could Save You Money
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-blue-800">
                    At your income level, electing S-Corp status lets you split revenue between salary and profit distributions—SE tax only applies to the salary portion.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2 border border-blue-100">
                      <p className="text-xs text-slate-500">Reasonable Salary</p>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(result.scorp.salary)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-blue-100">
                      <p className="text-xs text-slate-500">Distributions</p>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(result.scorp.distributions)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-blue-100">
                      <p className="text-xs text-slate-500">Est. Net Savings</p>
                      <p className="text-sm font-bold text-emerald-600">{formatCurrency(result.scorp.netSavings)}/yr</p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700">
                    SE tax saved: {formatCurrency(result.scorp.seTaxSavings)} minus ~{formatCurrency(SCORP_ACCOUNTING_COST)} extra accounting. Consult a CPA to evaluate for your situation.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <LockedModule
                title="S-Corp Election Could Save You Money"
                description="At your income level, S-Corp election could significantly reduce SE tax"
                icon={<Building2 className="h-5 w-5 text-blue-600" />}
                benefits={["Salary vs distribution split analysis", "Estimated annual SE tax savings", "Accounting cost break-even analysis"]}
              />
            )
          )}

          {/* Project ranges */}
          {isPro ? (
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-emerald-600" />
                  Project Price Ranges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Small (4–16 hrs)", range: result.projectRanges.small, desc: "Quick audits, short consulting calls, small deliverables" },
                  { label: "Medium (20–60 hrs)", range: result.projectRanges.medium, desc: "Strategy sprints, detailed assessments, short engagements" },
                  { label: "Large (80–200 hrs)", range: result.projectRanges.large, desc: "Full engagements, ongoing retainers, complex builds" },
                ].map(({ label, range, desc }) => (
                  <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{label}</p>
                      <p className="text-sm text-slate-500">{desc}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 flex-shrink-0">
                      {formatCurrency(range[0])} – {formatCurrency(range[1])}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <LockedModule
              title="Project Price Ranges"
              description="Translate your hourly rate into fixed-price project quotes"
              icon={<ClipboardList className="h-5 w-5 text-emerald-600" />}
              benefits={["Small, medium, and large project ranges", "Based on your actual billable rate", "Anchor pricing for client proposals"]}
            />
          )}

          {/* Bottom callouts — Pro only */}
          {isPro ? (
            <>
              {/* Quarterly tax + buffer rate */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <Calendar className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-900">Quarterly Estimated Tax</p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Set aside <span className="font-bold">{formatCurrency(result.quarterlySetAside)}</span> every quarter (Apr 15, Jun 15, Sep 15, Jan 15) to avoid underpayment penalties.
                  </p>
                  {result.bufferRate > 0 && (
                    <p className="text-xs text-amber-800 mt-1.5 border-t border-amber-200 pt-1.5">
                      <span className="font-semibold">Slow month buffer:</span> To cover 1 month with no clients, charge <span className="font-bold">${result.bufferRate}/hr</span> the other 11 months. That's ${result.bufferRate - result.hourlyRate}/hr above your minimum.
                    </p>
                  )}
                </div>
              </div>

              {/* Tax note */}
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-900 mb-1">About these estimates</p>
                  <p className="text-xs text-blue-800">
                    Uses your marginal rate applied to taxable income after deductions (SE tax deduction, health insurance, retirement, and business expenses). Actual taxes depend on filing status, standard/itemized deductions, QBI deduction eligibility, and other factors. Use the Tax Calculator for a precise estimate.
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <Link
                  href="/tax-calculator"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Precise tax calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/quarterly-estimated-taxes"
                  className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Quarterly tax planner
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <LockedModule
              title="Quarterly Tax Set-Aside & Slow Month Buffer"
              description="Know exactly what to pay quarterly and how to rate-protect against dry spells"
              icon={<Shield className="h-5 w-5 text-amber-600" />}
              benefits={["Exact quarterly set-aside amount", "Slow month buffer rate calculation", "Links to tax calculator and quarterly planner"]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
