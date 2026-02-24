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
  Briefcase,
  TrendingUp,
  ArrowRight,
  Info,
  Heart,
  PiggyBank,
  Building2,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const SE_TAX_RATE = 0.153;
const SE_DEDUCTION_RATE = 0.0765; // half of SE tax is deductible from income

const FEDERAL_BRACKETS = [
  { label: "22% bracket (income ~$47k–$103k single)", value: 0.22 },
  { label: "24% bracket (income ~$103k–$197k single)", value: 0.24 },
  { label: "32% bracket (income ~$197k–$250k single)", value: 0.32 },
  { label: "35% bracket (income ~$250k–$626k single)", value: 0.35 },
  { label: "37% bracket (income $626k+ single)", value: 0.37 },
];

const SCORP_ACCOUNTING_COST = 2500; // estimated annual extra accounting cost

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
  scorp: { salary: number; distributions: number; seTaxSavings: number; netSavings: number } | null;
  quarterlySetAside: number;
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

  // Solve for gross revenue needed:
  //   gross - SE_tax - federal_tax - state_tax - health - retirement - expenses = take_home
  //   SE_tax = gross × 15.3%
  //   SE_deduction = gross × 7.65%  (half of SE tax reduces taxable income)
  //   taxable = gross - SE_deduction - expenses - health - retirement
  //   federal_tax = taxable × federalRate
  //   state_tax = taxable × stateRate
  //
  //   → gross × (1 - 0.153 - 0.9235×(fed+state)) = takeHome + fixedCosts×(1 - fed - state)

  const totalRate = federalRate + stateRate;
  const fixedCosts = annualExpenses + healthInsurance + retirementContrib;
  const grossMultiplier = 1 - SE_TAX_RATE - (1 - SE_DEDUCTION_RATE) * totalRate;
  const grossIncomeNeeded = Math.max(
    0,
    Math.ceil((targetTakeHome + fixedCosts * (1 - totalRate)) / grossMultiplier)
  );

  // Tax breakdown
  const seDeduction = grossIncomeNeeded * SE_DEDUCTION_RATE;
  const taxableIncome = Math.max(0, grossIncomeNeeded - seDeduction - fixedCosts);
  const seTax = Math.round(grossIncomeNeeded * SE_TAX_RATE);
  const federalTax = Math.round(taxableIncome * federalRate);
  const stateTax = Math.round(taxableIncome * stateRate);
  const totalTax = seTax + federalTax + stateTax;
  const effectiveRate = grossIncomeNeeded > 0 ? totalTax / grossIncomeNeeded : 0;

  // Rates
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

  // W2 equivalent: what salary would net the same take-home?
  // Employee pays 7.65% FICA (employer covers the other half), federal, and state taxes.
  // Self-employed person can deduct health + retirement; W2 employee typically gets health through employer.
  // We compare apples-to-apples: just the take-home cash.
  const w2TaxRate = 0.0765 + federalRate + stateRate;
  const w2Equivalent = w2TaxRate < 1 ? Math.ceil(targetTakeHome / (1 - w2TaxRate)) : 0;

  // S-Corp savings (worthwhile when gross > ~$80k and savings exceed accounting overhead)
  let scorp: RateResult["scorp"] = null;
  if (grossIncomeNeeded > 80000) {
    // Reasonable salary = ~55% of net profit (IRS guideline: roughly what you'd pay an employee for the same work)
    const reasonableSalary = Math.round(grossIncomeNeeded * 0.55);
    const distributions = grossIncomeNeeded - reasonableSalary;
    // SE tax is only owed on salary, not distributions
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
    scorp,
    quarterlySetAside,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FreelanceRatePage() {
  const { isPro } = useSubscription();

  // Goals
  const [targetTakeHome, setTargetTakeHome] = useState(80000);
  const [healthInsurance, setHealthInsurance] = useState(12000);
  const [retirementContrib, setRetirementContrib] = useState(20000);
  const [annualExpenses, setAnnualExpenses] = useState(12000);

  // Schedule
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [billablePercent, setBillablePercent] = useState(70);
  const [vacationWeeks, setVacationWeeks] = useState(4);

  // Tax settings
  const [federalRate, setFederalRate] = useState(0.22);
  const [stateRate, setStateRate] = useState(5);

  // Load saved calculator preferences
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
    () =>
      analyzeRate(
        targetTakeHome,
        annualExpenses,
        healthInsurance,
        retirementContrib,
        hoursPerWeek,
        billablePercent,
        vacationWeeks,
        federalRate,
        stateRate / 100
      ),
    [
      targetTakeHome,
      annualExpenses,
      healthInsurance,
      retirementContrib,
      hoursPerWeek,
      billablePercent,
      vacationWeeks,
      federalRate,
      stateRate,
    ]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-emerald-600" />
          Freelance Rate Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Built for self-employed professionals. Factors in SE tax, health insurance, retirement, and your actual tax bracket.
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
                <p className="text-xs text-slate-400 mt-0.5">Software, equipment, coworking, etc.</p>
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
                  <span className="text-xs font-bold text-emerald-600">{billablePercent}%</span>
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
                <Label className="text-xs font-medium text-slate-600">Vacation Weeks / Year</Label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={vacationWeeks}
                  onChange={(e) => setVacationWeeks(Number(e.target.value))}
                  className="mt-1 text-sm"
                />
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
                <p className="text-xs text-slate-400 mt-0.5">Your marginal (top) federal rate</p>
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

          {/* Primary rate cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-emerald-600 border-none shadow-sm">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-emerald-100 mb-1">Hourly Rate</p>
                <p className="text-3xl font-bold text-white">${result.hourlyRate}</p>
                <p className="text-xs text-emerald-200 mt-0.5">/ hour</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Day Rate</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(result.dayRate)}</p>
                <p className="text-xs text-slate-400 mt-0.5">8 hours</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Weekly Rate</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(result.weeklyRate)}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {Math.round(hoursPerWeek * (billablePercent / 100))} billable hrs
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Income breakdown */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Where Your Revenue Goes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Gross Revenue Needed</span>
                <span className="font-semibold text-slate-900">{formatCurrency(result.grossIncomeNeeded)}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Self-Employment Tax (15.3%)</span>
                  <span className="font-medium text-red-500">− {formatCurrency(result.seTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Federal Income Tax ({(federalRate * 100).toFixed(0)}%)</span>
                  <span className="font-medium text-red-500">− {formatCurrency(result.federalTax)}</span>
                </div>
                {result.stateTax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">State Income Tax ({stateRate}%)</span>
                    <span className="font-medium text-red-500">− {formatCurrency(result.stateTax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Heart className="h-3 w-3 text-rose-400" /> Health Insurance
                  </span>
                  <span className="font-medium text-slate-600">− {formatCurrency(healthInsurance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <PiggyBank className="h-3 w-3 text-emerald-500" /> Retirement
                  </span>
                  <span className="font-medium text-slate-600">− {formatCurrency(retirementContrib)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Business Expenses</span>
                  <span className="font-medium text-slate-600">− {formatCurrency(annualExpenses)}</span>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="text-sm font-semibold text-slate-900">Take-Home Cash</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(targetTakeHome)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                <span>Effective total tax rate</span>
                <span>{(result.effectiveRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Billable hours / year</span>
                <span>{result.annualBillableHours.toLocaleString()} hrs</span>
              </div>
            </CardContent>
          </Card>

          {/* W2 Equivalent comparison */}
          {isPro ? (
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  W2 Equivalent Salary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(result.w2Equivalent)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">to net the same take-home as an employee</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Your freelance gross</p>
                    <p className="text-sm font-semibold text-slate-700">{formatCurrency(result.grossIncomeNeeded)}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 text-xs text-slate-600">
                  <p className="font-medium text-slate-700 mb-1">Why freelancers earn more gross:</p>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Pay both sides of FICA (employee + employer = 15.3% vs 7.65%)</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Self-fund health insurance ({formatCurrency(healthInsurance)}/yr)</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>No employer 401(k) match, PTO, or benefits</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Cover business costs from revenue</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedModule
              title="W2 Equivalent Salary"
              description="See what salary a W2 employee would need to match your take-home"
              icon={<Users className="h-5 w-5 text-blue-500" />}
              benefits={["W2 vs freelance gross comparison", "True cost breakdown of self-employment", "FICA, health, and benefits breakdown"]}
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
                      <p className="text-xs text-slate-500">Estimated Net Savings</p>
                      <p className="text-sm font-bold text-emerald-600">{formatCurrency(result.scorp.netSavings)}/yr</p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700">
                    SE tax saved: {formatCurrency(result.scorp.seTaxSavings)} minus ~{formatCurrency(SCORP_ACCOUNTING_COST)} extra accounting costs. Consult a CPA to evaluate for your situation.
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
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Project Price Ranges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  {
                    label: "Small (4–16 hrs)",
                    range: result.projectRanges.small,
                    desc: "Quick audits, short consulting calls, small deliverables",
                  },
                  {
                    label: "Medium (20–60 hrs)",
                    range: result.projectRanges.medium,
                    desc: "Strategy sprints, detailed assessments, short engagements",
                  },
                  {
                    label: "Large (80–200 hrs)",
                    range: result.projectRanges.large,
                    desc: "Full engagements, ongoing retainers, complex builds",
                  },
                ].map(({ label, range, desc }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{label}</p>
                      <p className="text-xs text-slate-400 truncate">{desc}</p>
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
              icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
              benefits={["Small, medium, and large project ranges", "Based on your actual billable rate", "Anchor pricing for client proposals"]}
            />
          )}

          {/* Bottom callouts — Pro only */}
          {isPro ? (
            <>
              {/* Quarterly estimated tax */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <Calendar className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-900">Quarterly Estimated Tax</p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Set aside <span className="font-bold">{formatCurrency(result.quarterlySetAside)}</span> every quarter (Apr 15, Jun 15, Sep 15, Jan 15) to avoid underpayment penalties. That&apos;s your total tax burden of {formatCurrency(result.totalTax)} split into 4 payments.
                  </p>
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
              title="Quarterly Tax Set-Aside & Insights"
              description="Calculated quarterly payment schedule and tax planning insights"
              icon={<Calendar className="h-5 w-5 text-amber-600" />}
              benefits={["Exact quarterly set-aside amount", "Payment due dates (Apr, Jun, Sep, Jan)", "Links to precise tax calculator and planner"]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
