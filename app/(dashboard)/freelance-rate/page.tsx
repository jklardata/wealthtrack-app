"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Clock, Briefcase, TrendingUp, ArrowRight, Info } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const SE_TAX_RATE = 0.153;
const EST_INCOME_TAX_RATE = 0.22;
const EFFECTIVE_TAX_RATE = 1 - (1 - SE_TAX_RATE) * (1 - EST_INCOME_TAX_RATE);

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

interface RateResult {
  grossIncomeNeeded: number;
  annualBillableHours: number;
  hourlyRate: number;
  dayRate: number;
  weeklyRate: number;
  projectRanges: { small: [number, number]; medium: [number, number]; large: [number, number] };
  utilizationNote: string;
  taxBurden: number;
  savingsAmount: number;
}

function analyzeRate(
  targetTakeHome: number,
  annualExpenses: number,
  hoursPerWeek: number,
  billablePercent: number,
  vacationWeeks: number,
  targetSavingsPercent: number
): RateResult {
  const workingWeeks = 52 - vacationWeeks;
  const billableHoursPerWeek = hoursPerWeek * (billablePercent / 100);
  const annualBillableHours = Math.round(billableHoursPerWeek * workingWeeks);

  // Total needed: take-home + expenses + target savings + taxes on gross
  const preTaxNeeded = targetTakeHome + annualExpenses;
  const grossIncomeNeeded = Math.ceil(preTaxNeeded / (1 - EFFECTIVE_TAX_RATE));
  const taxBurden = Math.round(grossIncomeNeeded * EFFECTIVE_TAX_RATE);
  const savingsAmount = Math.max(0, grossIncomeNeeded - taxBurden - annualExpenses - targetTakeHome);

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

  return { grossIncomeNeeded, annualBillableHours, hourlyRate, dayRate, weeklyRate, projectRanges, utilizationNote, taxBurden, savingsAmount };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FreelanceRatePage() {
  const [targetTakeHome, setTargetTakeHome] = useState(80000);
  const [annualExpenses, setAnnualExpenses] = useState(15000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [billablePercent, setBillablePercent] = useState(70);
  const [vacationWeeks, setVacationWeeks] = useState(4);
  const [targetSavingsPercent] = useState(20);

  const result = useMemo(
    () => analyzeRate(targetTakeHome, annualExpenses, hoursPerWeek, billablePercent, vacationWeeks, targetSavingsPercent),
    [targetTakeHome, annualExpenses, hoursPerWeek, billablePercent, vacationWeeks, targetSavingsPercent]
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
          Calculate the hourly and project rates you need to hit your take-home income goal after taxes.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Your Goals</CardTitle>
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
                <p className="text-xs text-slate-400 mt-0.5">After taxes, what you want to keep</p>
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
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5 mt-2">{result.utilizationNote}</p>
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
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Primary rates */}
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
                <p className="text-xs text-slate-400 mt-0.5">{Math.round(hoursPerWeek * (billablePercent / 100))} billable hrs</p>
              </CardContent>
            </Card>
          </div>

          {/* Income breakdown */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Income Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Gross Revenue Needed</span>
                <span className="font-semibold text-slate-900">{formatCurrency(result.grossIncomeNeeded)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">SE + Income Tax (~{(EFFECTIVE_TAX_RATE * 100).toFixed(0)}%)</span>
                <span className="font-medium text-red-600">− {formatCurrency(result.taxBurden)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Business Expenses</span>
                <span className="font-medium text-slate-600">− {formatCurrency(annualExpenses)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="text-sm font-semibold text-slate-900">Take-Home</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(targetTakeHome)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Billable hours / year</span>
                <span>{result.annualBillableHours.toLocaleString()} hrs</span>
              </div>
            </CardContent>
          </Card>

          {/* Project ranges */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
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
                    <p className="text-xs text-slate-400 truncate">{desc}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 flex-shrink-0">
                    {formatCurrency(range[0])} – {formatCurrency(range[1])}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tax note */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900 mb-1">About the tax estimate</p>
              <p className="text-xs text-blue-800">
                Uses a blended ~35% effective rate (15.3% SE tax + 22% federal income tax). Your actual rate may vary. Use the Tax Calculator for a precise estimate based on your deductions and state.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <Link
              href="/tax-calculator"
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Precise tax calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/net-worth"
              className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Track net worth
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
