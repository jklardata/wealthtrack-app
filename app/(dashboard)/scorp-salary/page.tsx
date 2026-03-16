"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Info, Lock } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";

const SS_WAGE_BASE = 168600;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

// State-specific S-Corp additional costs beyond federal
const STATE_SCORP = {
  CA: { label: "California", extra: (net: number) => Math.max(800, net * 0.015), note: "1.5% franchise tax, min $800/yr" },
  MA: { label: "Massachusetts", extra: (net: number) => net * 0.0875, note: "8.75% corporate excise on income" },
  NH: { label: "New Hampshire", extra: (net: number) => net * 0.085, note: "8.5% Business Profits Tax" },
  TN: { label: "Tennessee", extra: (net: number) => net * 0.065, note: "6.5% excise tax on income" },
  TX: { label: "Texas", extra: (net: number) => net * 0.0075, note: "0.75% franchise tax on margin" },
  IL: { label: "Illinois", extra: (net: number) => net * 0.015, note: "1.5% personal property replacement tax" },
  NJ: { label: "New Jersey", extra: () => 375, note: "~$375 minimum CBT filing fee" },
  NY: { label: "New York", extra: () => 0, note: "No additional S-Corp entity tax (NYC may vary)" },
  OTHER: { label: "Other state", extra: () => 0, note: "No significant additional S-Corp entity tax" },
} as const;

type StateKey = keyof typeof STATE_SCORP;

const BRACKETS = [
  { label: "22%", value: 0.22 },
  { label: "24%", value: 0.24 },
  { label: "32%", value: 0.32 },
  { label: "35%", value: 0.35 },
  { label: "37%", value: 0.37 },
];

function calcForNet(
  net: number,
  salary: number,
  adminCosts: number,
  stateExtra: number,
  bracketRate: number
) {
  if (net < 1000) return null;

  // Sole prop
  const solepropSETax = net * 0.9235 * 0.153;
  // Sole prop deducts half of SE tax from income
  const solepropDeduction = solepropSETax * 0.5;
  const solepropIncomeTaxBenefit = solepropDeduction * bracketRate;

  // S-Corp payroll taxes
  const salaryForSS = Math.min(salary, SS_WAGE_BASE);
  const scorpPayrollTax = salaryForSS * 0.124 + salary * 0.029;
  // Employer half is deductible by S-Corp (flows to owner)
  const scorpEmployerDeduction = salary * 0.0765;
  const scorpIncomeTaxBenefit = scorpEmployerDeduction * bracketRate;

  const distributions = Math.max(0, net - salary);

  // Payroll tax savings
  const payrollSavings = solepropSETax - scorpPayrollTax;
  // Income tax delta (S-Corp employer deduction vs sole prop SE deduction)
  const incomeTaxDelta = scorpIncomeTaxBenefit - solepropIncomeTaxBenefit;
  // Total gross savings
  const grossSavings = payrollSavings + incomeTaxDelta;
  // Net savings after admin + state
  const netSavings = grossSavings - adminCosts - stateExtra;

  return {
    net,
    salary,
    distributions,
    solepropSETax,
    solepropIncomeTaxBenefit,
    scorpPayrollTax,
    scorpIncomeTaxBenefit,
    payrollSavings,
    incomeTaxDelta,
    grossSavings,
    netSavings,
    adminCosts,
    stateExtra,
    worthIt: netSavings > 0,
  };
}

export default function SCorpSalaryPage() {
  const { isPro } = useSubscription();
  const [revenue, setRevenue] = useState("");
  const [salaryPct, setSalaryPct] = useState(50);
  const [customSalary, setCustomSalary] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [adminCosts, setAdminCosts] = useState("1800");
  const [stateKey, setStateKey] = useState<StateKey>("OTHER");
  const [bracketRate, setBracketRate] = useState(0.32);

  const net = parseFloat(revenue.replace(/,/g, "")) || 0;
  const admin = parseFloat(adminCosts.replace(/,/g, "")) || 1800;
  const stateInfo = STATE_SCORP[stateKey];
  const stateExtra = net > 0 ? stateInfo.extra(net) : 0;

  const salary = useMemo(() => {
    if (useCustom) return parseFloat(customSalary.replace(/,/g, "")) || 0;
    return net * (salaryPct / 100);
  }, [net, salaryPct, customSalary, useCustom]);

  const result = useMemo(
    () => calcForNet(net, salary, admin, stateExtra, bracketRate),
    [net, salary, admin, stateExtra, bracketRate]
  );

  // IRS reasonable compensation zone
  const minReasonable = net * 0.4;
  const maxReasonable = net * 0.6;
  let irsZone: "low" | "good" | "high" = "good";
  if (salary < minReasonable) irsZone = "low";
  else if (salary > maxReasonable) irsZone = "high";

  // Breakeven income (at current salary %)
  const pct = salaryPct / 100;
  const breakeven =
    pct < 0.9235 ? (admin + stateExtra) / (0.153 * (0.9235 - pct)) : null;

  // SS wage base tip
  const showSSOptimTip = net > 0 && salary > SS_WAGE_BASE;
  const ssOptimalSalary = Math.max(minReasonable, Math.min(SS_WAGE_BASE, maxReasonable));
  const ssOptimalResult = net > 0
    ? calcForNet(net, ssOptimalSalary, admin, stateExtra, bracketRate)
    : null;
  const ssOptimSaving =
    result && ssOptimalResult ? ssOptimalResult.netSavings - result.netSavings : 0;

  // Sensitivity table
  const sensitivityIncome = [100000, 150000, 200000, 250000, 300000];
  const sensitivityRows = sensitivityIncome.map((inc) => {
    const sal = inc * (salaryPct / 100);
    const se = stateInfo.extra(inc);
    const r = calcForNet(inc, sal, admin, se, bracketRate);
    return { inc, sal, savings: r?.netSavings ?? 0, worthIt: (r?.netSavings ?? 0) > 0 };
  });

  return (
    <div className="space-y-6 py-2 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">S-Corp Salary Optimizer</h1>
        <p className="text-sm text-slate-500">
          Find the salary that minimizes payroll taxes without triggering IRS scrutiny. In an
          S-Corp, only your salary is subject to the 15.3% payroll tax—distributions above it are
          not.
        </p>
      </div>

      {/* Inputs */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">Your Numbers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-slate-700 mb-1.5 block">Annual Net Profit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="200,000"
                  className="pl-7 border-slate-300"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Revenue minus all business expenses</p>
            </div>
            <div>
              <Label className="text-sm text-slate-700 mb-1.5 block">S-Corp Annual Admin Costs</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={adminCosts}
                  onChange={(e) => setAdminCosts(e.target.value)}
                  placeholder="1800"
                  className="pl-7 border-slate-300"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Payroll service (~$600) + tax filing (~$1,200)</p>
            </div>
            <div>
              <Label className="text-sm text-slate-700 mb-1.5 block">State</Label>
              <Select value={stateKey} onValueChange={(v) => setStateKey(v as StateKey)}>
                <SelectTrigger className="border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(STATE_SCORP) as [StateKey, typeof STATE_SCORP[StateKey]][]).map(
                    ([key, s]) => (
                      <SelectItem key={key} value={key}>
                        {s.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {net > 0 && stateExtra > 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  +{fmt(stateExtra)}/yr state cost · {stateInfo.note}
                </p>
              )}
              {net > 0 && stateExtra === 0 && (
                <p className="text-xs text-slate-400 mt-1">{stateInfo.note}</p>
              )}
            </div>
            <div>
              <Label className="text-sm text-slate-700 mb-1.5 block">Federal Marginal Tax Bracket</Label>
              <Select
                value={String(bracketRate)}
                onValueChange={(v) => setBracketRate(parseFloat(v))}
              >
                <SelectTrigger className="border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRACKETS.map((b) => (
                    <SelectItem key={b.value} value={String(b.value)}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400 mt-1">Used to calculate income tax deduction benefit</p>
            </div>
          </div>

          {/* Salary selector */}
          <div>
            <Label className="text-sm text-slate-700 mb-2 block">S-Corp Salary</Label>
            {!useCustom ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  {[40, 50, 60].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setSalaryPct(pct)}
                      className={`flex-1 py-2.5 text-sm rounded-lg border font-medium transition-colors ${
                        salaryPct === pct
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {pct}% of profit
                    </button>
                  ))}
                  <button
                    onClick={() => setUseCustom(true)}
                    className="flex-1 py-2.5 text-sm rounded-lg border font-medium bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  >
                    Custom $
                  </button>
                </div>
                {net > 0 && (
                  <p className="text-xs text-slate-500">
                    Salary: <span className="font-semibold text-slate-700">{fmt(salary)}</span>
                    {" · "}Distributions:{" "}
                    <span className="font-semibold text-emerald-600">{fmt(Math.max(0, net - salary))}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="flex gap-3 items-start">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={customSalary}
                    onChange={(e) => setCustomSalary(e.target.value)}
                    placeholder="100,000"
                    className="pl-7 border-slate-300"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => { setUseCustom(false); setCustomSalary(""); }}
                  className="py-2.5 px-4 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Use %
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* SS Wage Base Optimization Tip */}
          {showSSOptimTip && ssOptimSaving > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">SS wage base optimization available</p>
                <p className="text-sm text-blue-700 mt-0.5">
                  Your salary ({fmt(salary)}) is above the $168,600 SS wage base. Salary above
                  that threshold only adds 2.9% Medicare tax, not 12.4% SS. Reducing your salary
                  to {fmt(ssOptimalSalary)} (still IRS-defensible) would save an additional{" "}
                  <span className="font-bold">{fmt(ssOptimSaving)}/yr</span>.
                </p>
              </div>
            </div>
          )}

          {/* Savings headline */}
          <div className={`rounded-xl p-6 text-center ${result.worthIt ? "bg-emerald-600" : "bg-slate-700"}`}>
            <p className="text-sm font-medium mb-1 text-white/80">
              {result.worthIt
                ? "Total annual savings vs. sole proprietorship"
                : "S-Corp not yet worth it at this income level"}
            </p>
            <p className="text-5xl font-bold text-white mb-2">{fmt(result.netSavings)}</p>
            {result.worthIt ? (
              <p className="text-sm text-white/70">
                {fmt(result.payrollSavings)} payroll tax savings
                {result.incomeTaxDelta !== 0 && (
                  <> + {fmt(Math.abs(result.incomeTaxDelta))} income tax {result.incomeTaxDelta > 0 ? "benefit" : "cost"}</>
                )}
                {" − "}
                {fmt(admin + stateExtra)} costs
              </p>
            ) : (
              breakeven && (
                <p className="text-sm text-slate-300">Break-even at {fmt(breakeven)} in annual profit</p>
              )
            )}
          </div>

          {/* Full comparison */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Sole Proprietor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Net profit</span>
                  <span className="font-semibold text-slate-900">{fmt(result.net)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">SE tax (15.3% on 92.35%)</span>
                  <span className="font-semibold text-red-500">−{fmt(result.solepropSETax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Income tax deduction (½ SE tax × {Math.round(bracketRate * 100)}%)</span>
                  <span className="font-semibold text-emerald-600">+{fmt(result.solepropIncomeTaxBenefit)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Admin / state costs</span>
                  <span className="font-semibold text-slate-900">$0</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-slate-200 pt-2">
                  <span className="text-slate-700">Net tax cost</span>
                  <span className="text-red-500">{fmt(result.solepropSETax - result.solepropIncomeTaxBenefit)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-emerald-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                  S-Corporation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Salary ({useCustom ? "custom" : `${salaryPct}%`})</span>
                  <span className="font-semibold text-slate-900">{fmt(result.salary)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payroll tax on salary</span>
                  <span className="font-semibold text-red-500">−{fmt(result.scorpPayrollTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Employer deduction benefit (× {Math.round(bracketRate * 100)}%)</span>
                  <span className="font-semibold text-emerald-600">+{fmt(result.scorpIncomeTaxBenefit)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Distributions (no payroll tax)</span>
                  <span className="font-semibold text-emerald-600">{fmt(result.distributions)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Admin + state costs</span>
                  <span className="font-semibold text-slate-900">−{fmt(admin + stateExtra)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-slate-200 pt-2">
                  <span className="text-slate-700">Net tax cost</span>
                  <span className="text-emerald-600">
                    {fmt(result.scorpPayrollTax - result.scorpIncomeTaxBenefit + admin + stateExtra)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* State warning if significant */}
          {stateExtra > 1000 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  {stateInfo.label} adds {fmt(stateExtra)}/yr in state S-Corp costs
                </p>
                <p className="text-sm text-amber-700 mt-0.5">
                  {stateInfo.note}. This significantly impacts your break-even and net savings.
                  Make sure to include this in your decision.
                </p>
              </div>
            </div>
          )}

          {/* IRS Zone + Recommended */}
          <div className="grid sm:grid-cols-2 gap-4">
            {isPro ? (
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-900">IRS Scrutiny Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      irsZone === "good"
                        ? "bg-emerald-50 border border-emerald-100"
                        : irsZone === "low"
                        ? "bg-red-50 border border-red-100"
                        : "bg-amber-50 border border-amber-100"
                    }`}
                  >
                    {irsZone === "good" && <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {irsZone === "low" && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
                    {irsZone === "high" && <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className={`text-sm font-semibold ${
                        irsZone === "good" ? "text-emerald-800" : irsZone === "low" ? "text-red-800" : "text-amber-800"
                      }`}>
                        {irsZone === "good"
                          ? "Within reasonable compensation range"
                          : irsZone === "low"
                          ? "Salary too low — IRS audit risk"
                          : "Salary may be above typical range"}
                      </p>
                      <p className={`text-xs mt-1 ${
                        irsZone === "good" ? "text-emerald-700" : irsZone === "low" ? "text-red-700" : "text-amber-700"
                      }`}>
                        IRS guideline: {fmt(minReasonable)} – {fmt(maxReasonable)} (40–60% of net profit)
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    Reasonable compensation is based on what you&apos;d pay someone to do your role.
                    40–60% of net profit is a common starting point, but industry and role complexity
                    also factor in. Work with your CPA to document justification.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    IRS Scrutiny Risk
                    <span className="text-xs font-medium bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">Pro</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="select-none blur-sm pointer-events-none" aria-hidden>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">Within reasonable compensation range</p>
                        <p className="text-xs mt-1 text-emerald-700">IRS guideline: $80,000 – $120,000 (40–60%)</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px]">
                    <Lock className="h-5 w-5 text-slate-400 mb-2" />
                    <p className="text-sm font-semibold text-slate-700 mb-1">Pro feature</p>
                    <Link href="/pricing" className="text-xs text-purple-600 hover:underline font-medium">Upgrade to unlock</Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {isPro ? (
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-900">Recommended Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-2">
                    <p className="text-3xl font-bold text-emerald-600 mb-1">
                      {net > 0 ? fmt(Math.min(net * 0.5, SS_WAGE_BASE > net * 0.4 ? net * 0.5 : SS_WAGE_BASE)) : "—"}
                    </p>
                    <p className="text-sm text-slate-500 mb-4">
                      {net > SS_WAGE_BASE * 2
                        ? `50% of profit, capped at SS wage base ($${(SS_WAGE_BASE / 1000).toFixed(0)}k)`
                        : "50% of profit — IRS-defensible, optimal savings"}
                    </p>
                    {result.netSavings > 0 && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                        <p className="text-sm text-emerald-800">
                          At current settings, net annual savings:{" "}
                          <span className="font-bold">{fmt(result.netSavings)}</span>
                        </p>
                      </div>
                    )}
                    {result.netSavings <= 0 && breakeven && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-sm text-slate-600">
                          S-Corp breaks even at <span className="font-semibold">{fmt(breakeven)}</span> in profit
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    Recommended Salary
                    <span className="text-xs font-medium bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">Pro</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="select-none blur-sm pointer-events-none" aria-hidden>
                    <div className="text-center py-2">
                      <p className="text-3xl font-bold text-emerald-600 mb-1">$100,000</p>
                      <p className="text-sm text-slate-500 mb-4">50% of profit — IRS-defensible, optimal savings</p>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                        <p className="text-sm text-emerald-800">Net annual savings: <span className="font-bold">$12,400</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px]">
                    <Lock className="h-5 w-5 text-slate-400 mb-2" />
                    <p className="text-sm font-semibold text-slate-700 mb-1">Pro feature</p>
                    <Link href="/pricing" className="text-xs text-purple-600 hover:underline font-medium">Upgrade to unlock</Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sensitivity Table */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900">
                Savings at Different Income Levels
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                At {salaryPct}% salary, {Math.round(bracketRate * 100)}% bracket, {stateInfo.label}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Net Profit
                      </th>
                      <th className="text-right py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Salary
                      </th>
                      <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Net Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityRows.map((row) => (
                      <tr
                        key={row.inc}
                        className={`border-b border-slate-100 ${
                          Math.abs(row.inc - net) < 1000 && net > 0 ? "bg-emerald-50" : ""
                        }`}
                      >
                        <td className="py-2.5 pr-4 font-medium text-slate-900">{fmt(row.inc)}</td>
                        <td className="py-2.5 pr-4 text-right text-slate-600">{fmt(row.sal)}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`font-semibold ${
                              row.worthIt ? "text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            {row.worthIt ? fmt(row.savings) : `(${fmt(Math.abs(row.savings))})`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* CTA: Quarterly taxes */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-sm font-semibold text-slate-900">Now calculate your quarterly taxes</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Use your S-Corp salary to estimate quarterly estimated tax payments and safe harbor amounts.
              </p>
            </div>
            <Link
              href="/quarterly-estimated-taxes"
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 whitespace-nowrap ml-4"
            >
              Quarterly Est. Taxes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Explainer */}
          <Card className="bg-slate-50 border border-slate-200">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                How S-Corp payroll tax savings work
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                As a sole proprietor, the full 15.3% payroll tax applies to all your net profit (on
                92.35% of it). In an S-Corp, only your salary is subject to payroll taxes.
                Distributions above your salary escape the 12.4% Social Security tax entirely—only
                the 2.9% Medicare applies above the $168,600 SS wage base. The employer half of
                payroll taxes (7.65% of salary) is also a deductible business expense, adding
                income tax savings at your marginal rate on top of the payroll savings.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
