"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ArrowRight,
  ArrowLeft,
  Globe,
  Calendar,
  Calculator,
  Mail,
  CheckCircle,
  Lock,
  XCircle,
  AlertTriangle,
  Plane,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/tax-calculations";
import { analytics, type CTALocation } from "@/lib/analytics";
import { EmailCaptureCard } from "@/components/email-capture-card";

const VARIANT = "lead_magnet_feie_checker";

// 2025 FEIE exclusion limit
const FEIE_EXCLUSION_LIMIT = 130_000;
const PHYSICAL_PRESENCE_DAYS = 330;

type Step = 1 | 2 | 3 | 4 | 5;
type WorkType = "self_employed" | "employee" | "both";
type ResidenceType = "physical_presence" | "bona_fide";

interface FEIEAnalysis {
  qualifyingDays: number;
  passesPhysicalPresence: boolean;
  passesBonafide: boolean;
  isEligible: boolean;
  eligibilityTest: ResidenceType | null;
  estimatedExclusion: number;
  selfEmployedNote: boolean;
  recommendation: "eligible" | "likely_eligible" | "borderline" | "not_eligible";
}

function analyzeFEIE(
  daysAbroad: number,
  workType: WorkType,
  residenceType: ResidenceType,
  hasEstablishedResidence: boolean,
  annualIncome: number
): FEIEAnalysis {
  const passesPhysicalPresence = daysAbroad >= PHYSICAL_PRESENCE_DAYS;
  const passesBonafide = residenceType === "bona_fide" && hasEstablishedResidence;
  const isEligible = passesPhysicalPresence || passesBonafide;

  let eligibilityTest: ResidenceType | null = null;
  if (passesPhysicalPresence) eligibilityTest = "physical_presence";
  else if (passesBonafide) eligibilityTest = "bona_fide";

  // Pro-rate exclusion based on qualifying days (max 365)
  const qualifyingFraction = Math.min(daysAbroad / 365, 1);
  const estimatedExclusion = isEligible
    ? Math.round(Math.min(annualIncome, FEIE_EXCLUSION_LIMIT) * qualifyingFraction)
    : 0;

  let recommendation: FEIEAnalysis["recommendation"];
  if (isEligible && daysAbroad >= 335) recommendation = "eligible";
  else if (isEligible) recommendation = "likely_eligible";
  else if (daysAbroad >= 310 && daysAbroad < 330) recommendation = "borderline";
  else recommendation = "not_eligible";

  return {
    qualifyingDays: daysAbroad,
    passesPhysicalPresence,
    passesBonafide,
    isEligible,
    eligibilityTest,
    estimatedExclusion,
    selfEmployedNote: workType === "self_employed" || workType === "both",
    recommendation,
  };
}

const REC_CONFIG = {
  eligible: {
    icon: CheckCircle,
    color: "emerald",
    title: "You Likely Qualify for the FEIE",
    description: "Based on your answers, you meet the criteria for the Foreign Earned Income Exclusion.",
  },
  likely_eligible: {
    icon: CheckCircle,
    color: "emerald",
    title: "You Likely Qualify for the FEIE",
    description: "You meet the physical presence or bona fide residence test. A tax professional can confirm.",
  },
  borderline: {
    icon: AlertTriangle,
    color: "amber",
    title: "You May Qualify — Verify with a Pro",
    description: "You're close to the 330-day threshold. Whether you qualify depends on your exact travel dates.",
  },
  not_eligible: {
    icon: XCircle,
    color: "red",
    title: "You Likely Don't Qualify This Year",
    description: "You don't meet the physical presence (330 days) or bona fide residence test for this tax year.",
  },
};

interface CheckerState {
  daysAbroad: number;
  annualIncome: number;
  workType: WorkType;
  residenceType: ResidenceType;
  hasEstablishedResidence: boolean;
  email: string;
  currentStep: Step;
  isSubmitting: boolean;
  submitError: string | null;
  emailSubmitted: boolean;
}

export default function FEIEChecker() {
  const [state, setState] = useState<CheckerState>({
    daysAbroad: 335,
    annualIncome: 100_000,
    workType: "self_employed",
    residenceType: "physical_presence",
    hasEstablishedResidence: false,
    email: "",
    currentStep: 1,
    isSubmitting: false,
    submitError: null,
    emailSubmitted: false,
  });

  const analysis = useMemo(() =>
    analyzeFEIE(
      state.daysAbroad,
      state.workType,
      state.residenceType,
      state.hasEstablishedResidence,
      state.annualIncome
    ),
    [state.daysAbroad, state.workType, state.residenceType, state.hasEstablishedResidence, state.annualIncome]
  );

  const update = (updates: Partial<CheckerState>) =>
    setState((prev) => ({ ...prev, ...updates }));

  const goToStep = (step: Step) => {
    update({ currentStep: step });
    analytics.ctaClick("calculator_step", `step_${step}` as CTALocation, VARIANT);
  };

  const handleEmailSubmit = async () => {
    if (!state.email || !state.email.includes("@")) {
      update({ submitError: "Please enter a valid email address" });
      return;
    }
    update({ isSubmitting: true, submitError: null });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          source: "feie_checker",
          metadata: {
            daysAbroad: state.daysAbroad,
            workType: state.workType,
            recommendation: analysis.recommendation,
            estimatedExclusion: analysis.estimatedExclusion,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      analytics.ctaClick("calculator_email_submit", "email_gate", VARIANT);
      update({ emailSubmitted: true, currentStep: 5 });
    } catch (err) {
      update({ submitError: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      update({ isSubmitting: false });
    }
  };

  const recConfig = REC_CONFIG[analysis.recommendation];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-600" />
            <span className="font-semibold text-lg">SoloFI</span>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            FEIE Eligibility Checker
          </h1>
          <p className="text-lg text-slate-600">
            Do you qualify for the Foreign Earned Income Exclusion? Find out in 2 minutes.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  state.currentStep >= step
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {state.currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${((state.currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Days Abroad + Income */}
        {state.currentStep === 1 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Plane className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Time Outside the US</h2>
                  <p className="text-sm text-slate-500">Full days you spent outside the US this tax year</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">
                    Days abroad this tax year: <span className="text-emerald-600 font-bold">{state.daysAbroad}</span>
                  </Label>
                  <Slider
                    value={[state.daysAbroad]}
                    onValueChange={([v]) => update({ daysAbroad: v })}
                    min={0}
                    max={365}
                    step={1}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0 days</span>
                    <span className="text-emerald-600 font-medium">330 days needed</span>
                    <span>365 days</span>
                  </div>
                </div>

                {state.daysAbroad >= PHYSICAL_PRESENCE_DAYS ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                    You meet the 330-day physical presence test threshold.
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                    {330 - state.daysAbroad} more days needed to meet the physical presence test.
                    You may still qualify via the bona fide residence test.
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">
                    Foreign earned income this year: <span className="text-emerald-600 font-bold">{formatCurrency(state.annualIncome)}</span>
                  </Label>
                  <Slider
                    value={[state.annualIncome]}
                    onValueChange={([v]) => update({ annualIncome: v })}
                    min={20_000}
                    max={300_000}
                    step={5_000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$20K</span>
                    <span>$130K max exclusion</span>
                    <span>$300K</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={() => goToStep(2)} className="bg-emerald-600 hover:bg-emerald-700">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Work Type */}
        {state.currentStep === 2 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Globe className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Work Situation</h2>
                  <p className="text-sm text-slate-500">How you earn your income abroad matters for the FEIE</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">How do you earn income while abroad?</Label>
                  <div className="space-y-3">
                    {[
                      { value: "self_employed", label: "Self-employed / Freelancer / Contractor", desc: "You run your own business or work on contracts" },
                      { value: "employee", label: "Employee of a foreign company", desc: "You're on a foreign employer's payroll" },
                      { value: "both", label: "Both", desc: "Mix of self-employment and employment income" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => update({ workType: opt.value as WorkType })}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          state.workType === opt.value
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <p className="font-medium text-slate-900">{opt.label}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {(state.workType === "self_employed" || state.workType === "both") && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                    <strong>Note for self-employed:</strong> The FEIE reduces income tax but not self-employment tax.
                    You can still claim the Foreign Housing Exclusion and deduct half your SE tax separately.
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => goToStep(3)} className="bg-emerald-600 hover:bg-emerald-700">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Residence Test */}
        {state.currentStep === 3 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Qualifying Test</h2>
                  <p className="text-sm text-slate-500">The IRS offers two ways to qualify for the FEIE</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Which best describes your situation?</Label>
                  <div className="space-y-3">
                    <button
                      onClick={() => update({ residenceType: "physical_presence" })}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        state.residenceType === "physical_presence"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <p className="font-medium text-slate-900">Physical Presence Test</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        I was physically outside the US for 330+ full days in any 12-month period
                      </p>
                      {state.daysAbroad >= 330 && (
                        <p className="text-sm text-emerald-600 font-medium mt-1">
                          ✓ You meet this threshold ({state.daysAbroad} days)
                        </p>
                      )}
                    </button>

                    <button
                      onClick={() => update({ residenceType: "bona_fide" })}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        state.residenceType === "bona_fide"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <p className="font-medium text-slate-900">Bona Fide Residence Test</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        I established a permanent home in a foreign country for an uninterrupted period
                        including a full tax year
                      </p>
                    </button>
                  </div>
                </div>

                {state.residenceType === "bona_fide" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium block">Have you established a bona fide foreign residence?</Label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => update({ hasEstablishedResidence: true })}
                        className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                          state.hasEstablishedResidence
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => update({ hasEstablishedResidence: false })}
                        className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                          !state.hasEstablishedResidence
                            ? "border-red-400 bg-red-50 text-red-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        No / Not Sure
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Bona fide residence means you intend to live in the foreign country indefinitely,
                      have a permanent home there, and have not maintained a US domicile.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => goToStep(4)} className="bg-emerald-600 hover:bg-emerald-700">
                  See My Eligibility <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Email Gate */}
        {state.currentStep === 4 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Get Your Full FEIE Analysis</h2>
                  <p className="text-sm text-slate-500">Plus a guide on filing Form 2555 and next steps</p>
                </div>
              </div>

              {/* Teaser */}
              <div className={`text-center py-6 rounded-xl mb-6 ${
                analysis.isEligible ? "bg-gradient-to-b from-emerald-50 to-white" : "bg-gradient-to-b from-amber-50 to-white"
              }`}>
                <p className="text-sm text-slate-500 mb-2">Your Estimated FEIE Exclusion</p>
                <p className={`text-5xl font-bold ${analysis.isEligible ? "text-emerald-600" : "text-amber-600"}`}>
                  {analysis.isEligible ? formatCurrency(analysis.estimatedExclusion) : "Check Needed"}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  {analysis.isEligible ? "in income potentially excluded from US taxes" : "See full eligibility analysis below"}
                </p>
              </div>

              {/* Blurred preview */}
              <div className="relative mb-6">
                <div className="blur-sm select-none pointer-events-none space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Qualifying Test</span>
                    <span className="font-semibold">Physical Presence</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Max 2025 Exclusion</span>
                    <span className="font-semibold">{formatCurrency(FEIE_EXCLUSION_LIMIT)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Your Estimated Exclusion</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(analysis.estimatedExclusion)}</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="text-center px-4">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="font-semibold text-slate-800 mb-1">Unlock Full Eligibility Report</p>
                    <p className="text-sm text-slate-500">See qualifying test, exclusion breakdown, and next steps</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={state.email}
                    onChange={(e) => update({ email: e.target.value, submitError: null })}
                    className="mt-2"
                  />
                  {state.submitError && (
                    <p className="text-sm text-red-600 mt-2">{state.submitError}</p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-slate-600 font-medium">You&apos;ll receive:</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {[
                      "Full FEIE eligibility determination",
                      "Estimated exclusion amount for your income",
                      "Form 2555 filing guide",
                      "Self-employed abroad tax checklist",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 pt-2">Unsubscribe anytime.</p>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(3)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleEmailSubmit}
                  disabled={state.isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {state.isSubmitting ? "Submitting..." : "Get My Report"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Full Results */}
        {state.currentStep === 5 && (
          <div className="space-y-6">
            {/* Recommendation */}
            <Card className={`shadow-lg border-2 ${
              recConfig.color === "emerald" ? "border-emerald-300 bg-gradient-to-b from-emerald-50 to-white" :
              recConfig.color === "amber" ? "border-amber-300 bg-gradient-to-b from-amber-50 to-white" :
              "border-red-300 bg-gradient-to-b from-red-50 to-white"
            }`}>
              <CardContent className="p-8 text-center">
                <recConfig.icon className={`h-12 w-12 mx-auto mb-4 ${
                  recConfig.color === "emerald" ? "text-emerald-600" :
                  recConfig.color === "amber" ? "text-amber-600" :
                  "text-red-600"
                }`} />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{recConfig.title}</h2>
                <p className="text-slate-600 mb-4">{recConfig.description}</p>
                {analysis.isEligible && (
                  <>
                    <p className="text-4xl font-bold text-emerald-600 my-4">
                      {formatCurrency(analysis.estimatedExclusion)}
                    </p>
                    <p className="text-slate-500">estimated income excluded from US taxes</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Your FEIE Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Days outside the US</span>
                    <span className="font-semibold">{state.daysAbroad} days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Physical presence test (330 days)</span>
                    <span className={`font-semibold ${analysis.passesPhysicalPresence ? "text-emerald-600" : "text-red-500"}`}>
                      {analysis.passesPhysicalPresence ? "✓ Passes" : "✗ Does not pass"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Bona fide residence test</span>
                    <span className={`font-semibold ${analysis.passesBonafide ? "text-emerald-600" : "text-slate-400"}`}>
                      {analysis.passesBonafide ? "✓ Passes" : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>2025 FEIE exclusion limit</span>
                    <span className="font-semibold">{formatCurrency(FEIE_EXCLUSION_LIMIT)}</span>
                  </div>
                  {analysis.isEligible && (
                    <div className="flex justify-between items-center p-4 bg-emerald-100 rounded-lg border border-emerald-300">
                      <span className="font-bold text-emerald-800">Your estimated exclusion</span>
                      <span className="font-bold text-2xl text-emerald-700">{formatCurrency(analysis.estimatedExclusion)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Next Steps</h3>
                <div className="space-y-3 text-sm">
                  {analysis.isEligible ? (
                    <>
                      <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">File Form 2555 with your tax return</p>
                          <p className="text-slate-500">Attach to your Form 1040 to claim the exclusion</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Document your travel dates precisely</p>
                          <p className="text-slate-500">Keep passport stamps, boarding passes, and calendar records</p>
                        </div>
                      </div>
                      {analysis.selfEmployedNote && (
                        <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-800">Self-employment tax still applies</p>
                            <p className="text-blue-700">The FEIE excludes income from income tax, not SE tax. Consider the Foreign Housing Exclusion and deducting half your SE tax to further reduce your bill.</p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Consider consulting a US expat tax specialist</p>
                          <p className="text-slate-500">FEIE claims are commonly audited. A specialist can optimize your filing and keep your records IRS-ready.</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-3 p-3 bg-amber-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Plan for next year</p>
                          <p className="text-slate-500">If you spend more time abroad next year, you may qualify. Track your days carefully from January 1.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Explore other deductions</p>
                          <p className="text-slate-500">Even without the FEIE, home office, health insurance, and retirement contributions reduce your taxable income significantly.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <EmailCaptureCard
              toolName="FEIE Eligibility Checker"
              resultsSummary={analysis.isEligible ? `Estimated exclusion: ${formatCurrency(analysis.estimatedExclusion)}` : "Eligibility check complete"}
              className="mt-6"
            />

            {/* CTA */}
            <Card className="shadow-lg bg-emerald-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Track Your Taxes as a Remote Freelancer</h3>
                <p className="text-emerald-100 mb-6">
                  SoloFI helps self-employed professionals track income, estimate taxes, and stay on top of their finances from anywhere in the world.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                    Try SoloFI Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500">
                  <strong>Disclaimer:</strong> This tool provides estimates for educational purposes only and does not constitute tax advice.
                  FEIE eligibility depends on specific IRS rules that vary by individual situation. Consult a qualified tax professional
                  or US expat tax specialist before filing.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Share */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="text-sm text-slate-500">Share this free tool:</span>
        <a
          href="https://twitter.com/intent/tweet?text=Check%20your%20FEIE%20eligibility%20for%20free%E2%80%94tool%20for%20self-employed%20expats%20by%20SoloFI%20solofi.io/tools/feie-checker%20%23FEIE%20%23Expat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black text-white hover:bg-slate-800 transition-colors"
        >
          𝕏 Twitter/X
        </a>
        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A//solofi.io/tools/feie-checker"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-700 text-white hover:bg-blue-800 transition-colors"
        >
          in LinkedIn
        </a>
      </div>

      <footer className="border-t mt-12 py-8">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-sm text-slate-500">
          <span>&copy; 2025 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
