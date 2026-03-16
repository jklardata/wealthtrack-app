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
  Home,
  FileText,
  Calendar,
  TrendingUp,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const FEIE_LIMIT_2026 = 130_000;
const FHE_BASE_2026 = 19_200; // IRS base housing amount for most locations
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
  housingExclusion: number;
  totalExclusion: number;
  estimatedSavings: number;
  selfEmployedNote: boolean;
  recommendation: "eligible" | "likely_eligible" | "borderline" | "not_eligible";
  proRatePercent: number;
  daysToQualify: number;
  bufferDays: number;
  incomeBeyondLimit: number;
}

function analyzeFEIE(
  daysAbroad: number,
  workType: WorkType,
  residenceTest: ResidenceTest,
  hasEstablishedResidence: boolean,
  annualIncome: number,
  effectiveTaxRate: number,
  housingCosts: number
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
    ? Math.round(Math.min(annualIncome, FEIE_LIMIT_2026) * proRateFraction)
    : 0;

  // Foreign Housing Exclusion: housing costs above IRS base, up to ~30% of FEIE limit
  const fheMax = Math.round(FEIE_LIMIT_2026 * 0.30 * proRateFraction);
  const housingExclusion = isEligible && housingCosts > 0
    ? Math.round(Math.min(Math.max(0, housingCosts - FHE_BASE_2026 * proRateFraction), fheMax))
    : 0;

  const totalExclusion = estimatedExclusion + housingExclusion;
  const estimatedSavings = Math.round(totalExclusion * (effectiveTaxRate / 100));

  let recommendation: FEIEResult["recommendation"];
  if (isEligible && daysAbroad >= 335) recommendation = "eligible";
  else if (isEligible) recommendation = "likely_eligible";
  else if (daysAbroad >= 310 && daysAbroad < 330) recommendation = "borderline";
  else recommendation = "not_eligible";

  const daysToQualify = passesPhysicalPresence ? 0 : Math.max(0, PHYSICAL_PRESENCE_DAYS - daysAbroad);
  const bufferDays = passesPhysicalPresence ? 365 - daysAbroad : 0;
  const incomeBeyondLimit = Math.max(0, annualIncome - FEIE_LIMIT_2026);

  return {
    passesPhysicalPresence,
    passesBonafide,
    isEligible,
    eligibilityTest,
    estimatedExclusion,
    housingExclusion,
    totalExclusion,
    estimatedSavings,
    selfEmployedNote: workType === "self_employed" || workType === "both",
    recommendation,
    proRatePercent,
    daysToQualify,
    bufferDays,
    incomeBeyondLimit,
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
  const [housingCosts, setHousingCosts] = useState(0);

  const result = useMemo(
    () => analyzeFEIE(daysAbroad, workType, residenceTest, hasEstablishedResidence, annualIncome, effectiveTaxRate, housingCosts),
    [daysAbroad, workType, residenceTest, hasEstablishedResidence, annualIncome, effectiveTaxRate, housingCosts]
  );

  const statusConfig = {
    eligible: { icon: CheckCircle, label: "Likely Eligible", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", iconColor: "text-emerald-600" },
    likely_eligible: { icon: CheckCircle, label: "Likely Eligible", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", iconColor: "text-emerald-600" },
    borderline: { icon: AlertTriangle, label: "Borderline — Verify with a CPA", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", iconColor: "text-amber-600" },
    not_eligible: { icon: XCircle, label: "Likely Not Eligible This Year", bg: "bg-red-50 border-red-200", text: "text-red-700", iconColor: "text-red-500" },
  };

  const status = statusConfig[result.recommendation];
  const StatusIcon = status.icon;
  const daysInUS = 365 - daysAbroad;

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Globe className="h-6 w-6 text-emerald-600" />
          Foreign Income Exclusion
        </h1>
        <p className="text-base text-slate-500 mt-1">
          Are you spending enough time abroad to exclude your income from US taxes? Enter your details to find out—and see exactly how much you could save.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* ── Inputs ── */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Your Situation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Days abroad */}
              <div>
                <Label className="text-sm font-medium text-slate-700">Days outside the US this tax year</Label>
                <div className="mt-2">
                  <Input
                    type="number"
                    min={0}
                    max={365}
                    value={daysAbroad}
                    onChange={(e) => setDaysAbroad(Math.min(365, Math.max(0, Number(e.target.value))))}
                    className="text-base"
                  />
                  {/* Days in US counter */}
                  <div className="flex justify-between text-sm mt-1.5">
                    <span className="text-slate-500">
                      Days in the US: <span className="font-semibold text-slate-800">{daysInUS}</span>
                    </span>
                    <span className={`font-semibold ${daysAbroad >= 330 ? "text-emerald-600" : daysAbroad >= 310 ? "text-amber-600" : "text-red-500"}`}>
                      {daysAbroad}/365 abroad
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${daysAbroad >= 330 ? "bg-emerald-500" : daysAbroad >= 310 ? "bg-amber-400" : "bg-red-400"}`}
                      style={{ width: `${(daysAbroad / 365) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0</span>
                    <span className={daysAbroad >= 330 ? "text-emerald-600 font-semibold" : "text-slate-400"}>330 required</span>
                    <span>365</span>
                  </div>

                  {/* Days to qualify / buffer */}
                  {result.daysToQualify > 0 && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
                      You need <span className="font-bold">{result.daysToQualify} more days abroad</span> to qualify via Physical Presence this year.
                    </div>
                  )}
                  {result.bufferDays > 0 && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
                      You have a <span className="font-bold">{result.bufferDays}-day buffer</span>—you can spend {result.bufferDays} more days in the US and still qualify.
                    </div>
                  )}
                </div>
              </div>

              {/* Annual income */}
              <div>
                <Label className="text-sm font-medium text-slate-700">Annual Foreign Income</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="pl-9 text-base"
                  />
                </div>
                {result.incomeBeyondLimit > 0 && (
                  <p className="text-sm text-amber-700 mt-1.5">
                    You can exclude up to {formatCurrency(FEIE_LIMIT_2026)}—the remaining <span className="font-semibold">{formatCurrency(result.incomeBeyondLimit)}</span> stays taxable at your normal rate.
                  </p>
                )}
              </div>

              {/* Work type */}
              <div>
                <Label className="text-sm font-medium text-slate-700">Work Type</Label>
                <Select value={workType} onValueChange={(v) => setWorkType(v as WorkType)}>
                  <SelectTrigger className="mt-2 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self_employed">Self-Employed / Freelance</SelectItem>
                    <SelectItem value="employee">Employee (W-2 equivalent)</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Qualifying test */}
              <div>
                <Label className="text-sm font-medium text-slate-700">How you qualify</Label>
                <Select value={residenceTest} onValueChange={(v) => setResidenceTest(v as ResidenceTest)}>
                  <SelectTrigger className="mt-2 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical_presence">I spend 330+ days/year abroad (Physical Presence)</SelectItem>
                    <SelectItem value="bona_fide">I'm a full-time resident of a foreign country (Bona Fide)</SelectItem>
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
                  <label htmlFor="hasResidence" className="text-sm text-slate-700 cursor-pointer">
                    I have established bona fide residence in a foreign country
                  </label>
                </div>
              )}

              {/* Estimated tax rate */}
              <div>
                <Label className="text-sm font-medium text-slate-700">Estimated Tax Rate (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  value={effectiveTaxRate}
                  onChange={(e) => setEffectiveTaxRate(Number(e.target.value))}
                  className="mt-2 text-base"
                />
                <p className="text-sm text-slate-400 mt-1">Use 28–35% for most self-employed earners, or check your last return</p>
              </div>

              {/* Housing costs */}
              <div>
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Home className="h-4 w-4 text-slate-400" />
                  Annual Foreign Housing Costs (optional)
                </Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    value={housingCosts}
                    onChange={(e) => setHousingCosts(Number(e.target.value))}
                    className="pl-9 text-base"
                    placeholder="0"
                  />
                </div>
                <p className="text-sm text-slate-400 mt-1">Rent, utilities, repairs paid abroad. Used to estimate Foreign Housing Exclusion.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Eligibility status */}
          <div className={`rounded-xl border p-5 ${status.bg}`}>
            <div className="flex items-center gap-3 mb-4">
              <StatusIcon className={`h-7 w-7 ${status.iconColor}`} />
              <h2 className={`text-xl font-bold ${status.text}`}>{status.label}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-sm text-slate-500 mb-1">Physical Presence Test</p>
                <p className={`text-base font-semibold ${result.passesPhysicalPresence ? "text-emerald-700" : "text-red-600"}`}>
                  {result.passesPhysicalPresence
                    ? `✓ Passes (${daysAbroad} days)`
                    : `✗ Fails (${daysAbroad}/330 days)`}
                </p>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-sm text-slate-500 mb-1">Bona Fide Residence Test</p>
                <p className={`text-base font-semibold ${result.passesBonafide ? "text-emerald-700" : "text-slate-500"}`}>
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
                    <p className="text-sm text-slate-500 mb-1">FEIE Limit</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(FEIE_LIMIT_2026)}</p>
                    <p className="text-sm text-slate-400 mt-0.5">2026 limit</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm text-slate-500 mb-1">Your Exclusion</p>
                    <p className="text-xl font-bold text-emerald-600">{formatCurrency(result.totalExclusion)}</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {result.housingExclusion > 0
                        ? `FEIE + housing`
                        : `${result.proRatePercent}% of year`}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm text-slate-500 mb-1">Est. Tax Savings</p>
                    <p className="text-xl font-bold text-emerald-600">{formatCurrency(result.estimatedSavings)}</p>
                    <p className="text-sm text-slate-400 mt-0.5">at {effectiveTaxRate}% rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Exclusion breakdown if housing */}
              {result.housingExclusion > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-sm text-slate-500">Income Exclusion (FEIE)</p>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{formatCurrency(result.estimatedExclusion)}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="text-sm text-slate-500">Housing Exclusion (FHE)</p>
                    <p className="text-lg font-bold text-emerald-700 mt-0.5">+{formatCurrency(result.housingExclusion)}</p>
                  </div>
                </div>
              )}

              {/* SE Tax warning — always show for self-employed */}
              {result.selfEmployedNote && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base font-semibold text-amber-900 mb-1">Self-Employment Tax Still Applies</p>
                    <p className="text-sm text-amber-800">
                      The FEIE excludes your income from <strong>federal income tax</strong>, but you still owe self-employment tax (15.3%) on net SE income. FEIE does not reduce your SE tax base. This is a common surprise—plan your quarterly estimates accordingly.
                    </p>
                  </div>
                </div>
              )}

              {/* What to do next */}
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    What to Do Next
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      icon: FileText,
                      title: "File Form 2555 with your federal return",
                      desc: "This is the IRS form that claims the FEIE. Your tax software or CPA will need your exact travel dates.",
                    },
                    {
                      icon: Calendar,
                      title: "Keep records of every entry and exit",
                      desc: "Track dates in a spreadsheet. Passport stamps, boarding passes, and hotel receipts all count as documentation.",
                    },
                    {
                      icon: Globe,
                      title: "Consider whether FEIE or Foreign Tax Credit is better",
                      desc: "If your host country's tax rate is higher than the US (Germany, France, Netherlands), Foreign Tax Credit (FTC) may save you more. FEIE is typically better for low-tax countries.",
                    },
                    {
                      icon: Shield,
                      title: "Consult a CPA who specializes in expat taxes",
                      desc: "FEIE interacts with NIIT, AMT, and state taxes in ways that need professional review for anything above $80K income.",
                    },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <Icon className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {/* SE Tax note for non-eligible self-employed */}
          {!result.isEligible && result.selfEmployedNote && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-semibold text-amber-900 mb-1">Important: FEIE Doesn't Reduce SE Tax</p>
                <p className="text-sm text-amber-800">
                  Even if you qualify for FEIE, self-employment tax (15.3%) still applies to your net income. Many expat freelancers are surprised by this. Factor it into your planning whether or not you pursue the exclusion.
                </p>
              </div>
            </div>
          )}

          {/* Foreign Housing Exclusion callout — always show */}
          <Card className="bg-blue-50 border border-blue-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-blue-900 flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Foreign Housing Exclusion (FHE)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-blue-800">
                FEIE filers can <strong>also</strong> claim the Foreign Housing Exclusion—excluding housing costs above the IRS base amount (~{formatCurrency(FHE_BASE_2026)}/year for most locations). For someone paying $2,500/month rent abroad, that's an additional <strong>~$10,800 excluded</strong> on top of the income exclusion.
              </p>
              <p className="text-sm text-blue-700">
                Enter your annual foreign housing costs in the input panel to see your estimated FHE added to the calculation above.
              </p>
            </CardContent>
          </Card>

          {/* FEIE vs FTC comparison */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-slate-500" />
                FEIE vs. Foreign Tax Credit — Which Is Better?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">
                FEIE isn't always the best strategy. The right choice depends on where you live and your income level.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Plane className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-800">FEIE is better when...</p>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• You're in a <strong>low-tax</strong> country (Dubai, Thailand, Panama)</li>
                    <li>• Income is under ${(FEIE_LIMIT_2026 / 1000).toFixed(0)}K</li>
                    <li>• You're a digital nomad with no fixed base</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-semibold text-slate-800">FTC is better when...</p>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• You're in a <strong>high-tax</strong> country (Germany, France, UK, Japan)</li>
                    <li>• Income exceeds ${(FEIE_LIMIT_2026 / 1000).toFixed(0)}K</li>
                    <li>• You pay more in foreign taxes than you'd owe the IRS</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                You cannot claim both FEIE and FTC on the same income. The election is made annually on your return—a CPA can model both to find your optimal path.
              </p>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                How the Two Tests Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Plane className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-800">Physical Presence</p>
                  </div>
                  <p className="text-sm text-slate-600">330+ full days outside the US in any 12-month period. Most straightforward path for digital nomads. Days count regardless of which countries.</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-semibold text-slate-800">Bona Fide Residence</p>
                  </div>
                  <p className="text-sm text-slate-600">Establish legal residence in a foreign country for a full tax year. Better for long-term expats with a fixed base, and more flexible on travel days.</p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Pro-rating:</span> If you were abroad for only part of the year, your exclusion is pro-rated. {result.proRatePercent}% of {formatCurrency(FEIE_LIMIT_2026)} = {formatCurrency(Math.round(FEIE_LIMIT_2026 * result.proRatePercent / 100))} FEIE exclusion.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/geo-arbitrage"
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Model geo arbitrage
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tax-calculator"
              className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium py-3 px-4 rounded-lg transition-colors"
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
