"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plane,
  DollarSign,
  Shield,
  Info,
  ArrowRight,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const FEIE_LIMIT_2025 = 130_000;
const PHYSICAL_PRESENCE_DAYS = 330;

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

// ─── Types ────────────────────────────────────────────────────────────────────
type WorkType = "self_employed" | "employee" | "both";
type ResidenceTest = "physical_presence" | "bona_fide";

interface FEIEResult {
  passesPhysicalPresence: boolean;
  passesBonafide: boolean;
  isEligible: boolean;
  eligibilityTest: ResidenceTest | null;
  estimatedExclusion: number;
  estimatedSavings: number;
  selfEmployedNote: boolean;
  recommendation: "eligible" | "likely_eligible" | "borderline" | "not_eligible";
  proRatePercent: number;
}

function analyzeFEIE(
  daysAbroad: number,
  workType: WorkType,
  residenceTest: ResidenceTest,
  hasEstablishedResidence: boolean,
  annualIncome: number,
  effectiveTaxRate: number
): FEIEResult {
  const passesPhysicalPresence = daysAbroad >= PHYSICAL_PRESENCE_DAYS;
  const passesBonafide = residenceTest === "bona_fide" && hasEstablishedResidence;
  const isEligible = passesPhysicalPresence || passesBonafide;

  let eligibilityTest: ResidenceTest | null = null;
  if (passesPhysicalPresence) eligibilityTest = "physical_presence";
  else if (passesBonafide) eligibilityTest = "bona_fide";

  const proRateFraction = Math.min(daysAbroad / 365, 1);
  const proRatePercent = Math.round(proRateFraction * 100);
  const estimatedExclusion = isEligible
    ? Math.round(Math.min(annualIncome, FEIE_LIMIT_2025) * proRateFraction)
    : 0;
  const estimatedSavings = Math.round(estimatedExclusion * (effectiveTaxRate / 100));

  let recommendation: FEIEResult["recommendation"];
  if (isEligible && daysAbroad >= 335) recommendation = "eligible";
  else if (isEligible) recommendation = "likely_eligible";
  else if (daysAbroad >= 310 && daysAbroad < 330) recommendation = "borderline";
  else recommendation = "not_eligible";

  return {
    passesPhysicalPresence,
    passesBonafide,
    isEligible,
    eligibilityTest,
    estimatedExclusion,
    estimatedSavings,
    selfEmployedNote: workType === "self_employed" || workType === "both",
    recommendation,
    proRatePercent,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FEIEEligibilityPage() {
  const [daysAbroad, setDaysAbroad] = useState(335);
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [workType, setWorkType] = useState<WorkType>("self_employed");
  const [residenceTest, setResidenceTest] = useState<ResidenceTest>("physical_presence");
  const [hasEstablishedResidence, setHasEstablishedResidence] = useState(false);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(28);

  const result = useMemo(
    () => analyzeFEIE(daysAbroad, workType, residenceTest, hasEstablishedResidence, annualIncome, effectiveTaxRate),
    [daysAbroad, workType, residenceTest, hasEstablishedResidence, annualIncome, effectiveTaxRate]
  );

  const statusConfig = {
    eligible: { icon: CheckCircle, color: "emerald", label: "Likely Eligible", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
    likely_eligible: { icon: CheckCircle, color: "emerald", label: "Likely Eligible", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
    borderline: { icon: AlertTriangle, color: "amber", label: "Borderline — Verify with a CPA", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
    not_eligible: { icon: XCircle, color: "red", label: "Likely Not Eligible This Year", bg: "bg-red-50 border-red-200", text: "text-red-700" },
  };

  const status = statusConfig[result.recommendation];
  const StatusIcon = status.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Globe className="h-5 w-5 text-emerald-600" />
          FEIE Eligibility
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Foreign Earned Income Exclusion — exclude up to {formatCurrency(FEIE_LIMIT_2025)} of foreign income from US federal taxes.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Inputs — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Your Situation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-600">Days outside the US (this tax year)</Label>
                <div className="mt-1">
                  <Input
                    type="number"
                    min={0}
                    max={365}
                    value={daysAbroad}
                    onChange={(e) => setDaysAbroad(Math.min(365, Math.max(0, Number(e.target.value))))}
                    className="text-sm"
                  />
                  <div className="mt-1.5 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${daysAbroad >= 330 ? "bg-emerald-500" : daysAbroad >= 310 ? "bg-amber-400" : "bg-red-400"}`}
                      style={{ width: `${(daysAbroad / 365) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                    <span>0</span>
                    <span className={daysAbroad >= 330 ? "text-emerald-600 font-medium" : "text-slate-400"}>330 needed</span>
                    <span>365</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Annual Foreign Income</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="pl-8 text-sm"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Work Type</Label>
                <Select value={workType} onValueChange={(v) => setWorkType(v as WorkType)}>
                  <SelectTrigger className="mt-1 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self_employed">Self-Employed / Freelance</SelectItem>
                    <SelectItem value="employee">Employee (W-2 equivalent)</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-600">Qualifying Test</Label>
                <Select value={residenceTest} onValueChange={(v) => setResidenceTest(v as ResidenceTest)}>
                  <SelectTrigger className="mt-1 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical_presence">Physical Presence (330+ days)</SelectItem>
                    <SelectItem value="bona_fide">Bona Fide Residence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {residenceTest === "bona_fide" && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    id="hasResidence"
                    checked={hasEstablishedResidence}
                    onChange={(e) => setHasEstablishedResidence(e.target.checked)}
                    className="h-4 w-4 accent-emerald-600"
                  />
                  <label htmlFor="hasResidence" className="text-xs text-slate-700 cursor-pointer">
                    I have established bona fide residence in a foreign country
                  </label>
                </div>
              )}

              <div>
                <Label className="text-xs font-medium text-slate-600">Effective Tax Rate (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  value={effectiveTaxRate}
                  onChange={(e) => setEffectiveTaxRate(Number(e.target.value))}
                  className="mt-1 text-sm"
                />
                <p className="text-xs text-slate-400 mt-0.5">Used to estimate tax savings from exclusion</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results — 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Eligibility status */}
          <div className={`rounded-xl border p-5 ${status.bg}`}>
            <div className="flex items-center gap-3 mb-3">
              <StatusIcon className={`h-6 w-6 ${status.text}`} />
              <h2 className={`text-lg font-bold ${status.text}`}>{status.label}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-0.5">Physical Presence Test</p>
                <p className={`text-sm font-semibold ${result.passesPhysicalPresence ? "text-emerald-700" : "text-red-600"}`}>
                  {result.passesPhysicalPresence ? `✓ Passes (${daysAbroad} days)` : `✗ Fails (${daysAbroad}/330 days)`}
                </p>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-0.5">Bona Fide Residence Test</p>
                <p className={`text-sm font-semibold ${result.passesBonafide ? "text-emerald-700" : "text-slate-500"}`}>
                  {result.passesBonafide ? "✓ Passes" : "Not claimed"}
                </p>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          {result.isEligible && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-slate-500 mb-1">Exclusion Limit</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(FEIE_LIMIT_2025)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">2025 limit</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-slate-500 mb-1">Your Exclusion</p>
                    <p className="text-xl font-bold text-emerald-600">{formatCurrency(result.estimatedExclusion)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{result.proRatePercent}% of year abroad</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-slate-500 mb-1">Est. Tax Savings</p>
                    <p className="text-xl font-bold text-emerald-600">{formatCurrency(result.estimatedSavings)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">at {effectiveTaxRate}% effective rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* SE Tax note */}
              {result.selfEmployedNote && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">Self-Employment Tax Still Applies</p>
                    <p className="text-xs text-amber-800">
                      The FEIE excludes income from federal income tax, but self-employed individuals still owe self-employment tax (15.3%) on net SE income. The FEIE does not reduce your SE tax base.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* How it works */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                How the FEIE Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Plane className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-semibold text-slate-800">Physical Presence</p>
                  </div>
                  <p className="text-xs text-slate-600">Spend 330+ full days outside the US in any 12-month period. Most straightforward path for digital nomads.</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <p className="text-xs font-semibold text-slate-800">Bona Fide Residence</p>
                  </div>
                  <p className="text-xs text-slate-600">Establish residence in a foreign country for an entire tax year. Better for longer-term expats with a fixed base.</p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">Pro-rating:</span> If you were only abroad for part of the year, your exclusion is pro-rated. {result.proRatePercent}% of {formatCurrency(FEIE_LIMIT_2025)} = {formatCurrency(result.estimatedExclusion)}.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/geo-arbitrage"
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Model geo arbitrage
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
