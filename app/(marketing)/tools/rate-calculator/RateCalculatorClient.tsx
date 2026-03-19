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
  DollarSign,
  Clock,
  Calculator,
  Mail,
  CheckCircle,
  Lock,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/tax-calculations";
import { analytics, type CTALocation } from "@/lib/analytics";
import { EmailCaptureCard } from "@/components/email-capture-card";

const VARIANT = "lead_magnet_rate_calculator";

type Step = 1 | 2 | 3 | 4 | 5;

// Effective tax rate estimate for self-employed (SE tax + federal + state avg)
const SE_TAX_RATE = 0.153;
const EST_INCOME_TAX_RATE = 0.22; // conservative avg for $80k-$200k income
const EFFECTIVE_TAX_RATE = 1 - (1 - SE_TAX_RATE) * (1 - EST_INCOME_TAX_RATE);

interface RateAnalysis {
  grossIncomeNeeded: number;
  annualBillableHours: number;
  hourlyRate: number;
  dayRate: number;
  weeklyRate: number;
  projectRanges: { small: [number, number]; medium: [number, number]; large: [number, number] };
  utilizationNote: string;
}

function analyzeRate(
  targetTakeHome: number,
  annualExpenses: number,
  hoursPerWeek: number,
  billablePercent: number,
  vacationWeeks: number
): RateAnalysis {
  // Gross needed = take-home + expenses + taxes on gross
  const grossIncomeNeeded = Math.ceil((targetTakeHome + annualExpenses) / (1 - EFFECTIVE_TAX_RATE));

  // Available billable hours
  const workingWeeks = 52 - vacationWeeks;
  const billableHoursPerWeek = hoursPerWeek * (billablePercent / 100);
  const annualBillableHours = Math.round(billableHoursPerWeek * workingWeeks);

  const hourlyRate = annualBillableHours > 0 ? Math.ceil(grossIncomeNeeded / annualBillableHours) : 0;
  const dayRate = Math.ceil(hourlyRate * 8);
  const weeklyRate = Math.ceil(hourlyRate * billableHoursPerWeek);

  const projectRanges: RateAnalysis["projectRanges"] = {
    small: [hourlyRate * 4, hourlyRate * 16],   // 4-16 hrs
    medium: [hourlyRate * 20, hourlyRate * 60],  // 20-60 hrs
    large: [hourlyRate * 80, hourlyRate * 200],  // 80-200 hrs
  };

  let utilizationNote = "";
  if (billablePercent < 60) {
    utilizationNote = "Your billable rate is low — consider tightening your pipeline to bill more hours.";
  } else if (billablePercent >= 85) {
    utilizationNote = "High utilization — great, but leave buffer to avoid burnout and business development.";
  } else {
    utilizationNote = "Healthy utilization rate for a sustainable freelance practice.";
  }

  return { grossIncomeNeeded, annualBillableHours, hourlyRate, dayRate, weeklyRate, projectRanges, utilizationNote };
}

interface CalcState {
  targetTakeHome: number;
  annualExpenses: number;
  hoursPerWeek: number;
  billablePercent: number;
  vacationWeeks: number;
  email: string;
  currentStep: Step;
  isSubmitting: boolean;
  submitError: string | null;
  emailSubmitted: boolean;
}

export default function RateCalculator() {
  const [state, setState] = useState<CalcState>({
    targetTakeHome: 100_000,
    annualExpenses: 10_000,
    hoursPerWeek: 40,
    billablePercent: 70,
    vacationWeeks: 3,
    email: "",
    currentStep: 1,
    isSubmitting: false,
    submitError: null,
    emailSubmitted: false,
  });

  const analysis = useMemo(() =>
    analyzeRate(
      state.targetTakeHome,
      state.annualExpenses,
      state.hoursPerWeek,
      state.billablePercent,
      state.vacationWeeks
    ),
    [state.targetTakeHome, state.annualExpenses, state.hoursPerWeek, state.billablePercent, state.vacationWeeks]
  );

  const update = (updates: Partial<CalcState>) => setState((prev) => ({ ...prev, ...updates }));

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
          source: "rate_calculator",
          metadata: {
            targetTakeHome: state.targetTakeHome,
            hourlyRate: analysis.hourlyRate,
            annualBillableHours: analysis.annualBillableHours,
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
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Freelance Rate Calculator
          </h1>
          <p className="text-lg text-slate-600">
            What should you charge? Find your minimum viable rate in 2 minutes.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  state.currentStep >= step ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
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

        {/* Step 1: Target Income */}
        {state.currentStep === 1 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Income Goals</h2>
                  <p className="text-sm text-slate-500">What do you want to take home after taxes?</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">
                    Target annual take-home: <span className="text-emerald-600 font-bold">{formatCurrency(state.targetTakeHome)}</span>
                  </Label>
                  <Slider
                    value={[state.targetTakeHome]}
                    onValueChange={([v]) => update({ targetTakeHome: v })}
                    min={40_000}
                    max={400_000}
                    step={5_000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$40K</span>
                    <span>$400K</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    This is what lands in your bank account after taxes — not your gross revenue.
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Annual business expenses: <span className="text-emerald-600 font-bold">{formatCurrency(state.annualExpenses)}</span>
                  </Label>
                  <Slider
                    value={[state.annualExpenses]}
                    onValueChange={([v]) => update({ annualExpenses: v })}
                    min={0}
                    max={100_000}
                    step={1_000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$0</span>
                    <span>$100K</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Software, contractors, office, equipment — anything you spend to run your business.
                  </p>
                </div>

                <div className="pt-4 bg-slate-50 -mx-8 -mb-8 px-8 py-6 rounded-b-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Gross revenue needed (estimated)</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(analysis.grossIncomeNeeded)}/year</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Includes estimated self-employment + income taxes</p>
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

        {/* Step 2: Hours + Time Off */}
        {state.currentStep === 2 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Clock className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Work Schedule</h2>
                  <p className="text-sm text-slate-500">How many hours are you willing to work?</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">
                    Hours per week: <span className="text-emerald-600 font-bold">{state.hoursPerWeek} hrs</span>
                  </Label>
                  <Slider
                    value={[state.hoursPerWeek]}
                    onValueChange={([v]) => update({ hoursPerWeek: v })}
                    min={10}
                    max={60}
                    step={1}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>10 hrs (part-time)</span>
                    <span>60 hrs (heavy)</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Billable percentage: <span className="text-emerald-600 font-bold">{state.billablePercent}%</span>
                  </Label>
                  <Slider
                    value={[state.billablePercent]}
                    onValueChange={([v]) => update({ billablePercent: v })}
                    min={40}
                    max={90}
                    step={5}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>40% (lots of admin)</span>
                    <span>90% (fully booked)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    The rest goes to sales, admin, learning, and business development. 65-75% is typical.
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Vacation weeks per year: <span className="text-emerald-600 font-bold">{state.vacationWeeks} weeks</span>
                  </Label>
                  <Slider
                    value={[state.vacationWeeks]}
                    onValueChange={([v]) => update({ vacationWeeks: v })}
                    min={0}
                    max={12}
                    step={1}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0 weeks</span>
                    <span>12 weeks</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual billable hours</span>
                    <span className="font-semibold">{analysis.annualBillableHours.toLocaleString()} hrs</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => goToStep(3)} className="bg-emerald-600 hover:bg-emerald-700">
                  See My Rate <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Teaser */}
        {state.currentStep === 3 && (
          <Card className="shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Rate Analysis</h2>
                  <p className="text-sm text-slate-500">Here&apos;s what you need to charge</p>
                </div>
              </div>

              <div className="text-center py-8 rounded-xl mb-6 bg-gradient-to-b from-emerald-50 to-white">
                <p className="text-sm text-slate-500 mb-2">Your Minimum Hourly Rate</p>
                <p className="text-6xl font-bold text-emerald-600">${analysis.hourlyRate}</p>
                <p className="text-sm text-slate-500 mt-2">per hour to hit your income goal</p>
              </div>

              <div className="relative">
                <div className="blur-sm select-none pointer-events-none space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Day rate (8 hrs)</span>
                    <span className="font-semibold">{formatCurrency(analysis.dayRate)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Weekly rate</span>
                    <span className="font-semibold">{formatCurrency(analysis.weeklyRate)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Small project range</span>
                    <span className="font-semibold">{formatCurrency(analysis.projectRanges.small[0])} – {formatCurrency(analysis.projectRanges.small[1])}</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="text-center px-4">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="font-semibold text-slate-800 mb-1">Unlock Full Rate Breakdown</p>
                    <p className="text-sm text-slate-500">Day rate, project ranges, and pricing strategy</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => goToStep(4)} className="bg-emerald-600 hover:bg-emerald-700">
                  Unlock Full Breakdown <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Email */}
        {state.currentStep === 4 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Get Your Full Rate Sheet</h2>
                  <p className="text-sm text-slate-500">Plus tips on raising rates and value-based pricing</p>
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
                      "Hourly, day, weekly, and project rates",
                      "Small, medium, and large project ranges",
                      "How to raise your rates without losing clients",
                      "Introduction to value-based pricing",
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
                  {state.isSubmitting ? "Submitting..." : "Get My Rate Sheet"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Full Results */}
        {state.currentStep === 5 && (
          <div className="space-y-6">
            {/* Headline */}
            <Card className="shadow-lg border-2 border-emerald-300 bg-gradient-to-b from-emerald-50 to-white">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Freelance Rate Sheet</h2>
                <p className="text-slate-600 mb-4">Based on your income goals and schedule</p>
                <p className="text-6xl font-bold text-emerald-600">${analysis.hourlyRate}</p>
                <p className="text-slate-500 mt-2">minimum hourly rate</p>
              </CardContent>
            </Card>

            {/* Rate Breakdown */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Your Rate Sheet</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Hourly rate</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(analysis.hourlyRate)}/hr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Day rate (8 hrs)</span>
                    <span className="font-semibold">{formatCurrency(analysis.dayRate)}/day</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Weekly rate ({Math.round(state.hoursPerWeek * state.billablePercent / 100)} billable hrs)</span>
                    <span className="font-semibold">{formatCurrency(analysis.weeklyRate)}/week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Ranges */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Project Rate Ranges</h3>
                <div className="space-y-3">
                  {[
                    { label: "Small project", desc: "4–16 hours", range: analysis.projectRanges.small },
                    { label: "Medium project", desc: "20–60 hours", range: analysis.projectRanges.medium },
                    { label: "Large project", desc: "80–200 hours", range: analysis.projectRanges.large },
                  ].map(({ label, desc, range }) => (
                    <div key={label} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(range[0])} – {formatCurrency(range[1])}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Income Summary */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Income Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Annual billable hours</span>
                    <span className="font-semibold">{analysis.annualBillableHours.toLocaleString()} hrs</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Gross revenue needed</span>
                    <span className="font-semibold">{formatCurrency(analysis.grossIncomeNeeded)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="font-medium text-emerald-800">Target take-home</span>
                    <span className="font-bold text-emerald-700">{formatCurrency(state.targetTakeHome)}</span>
                  </div>
                  <p className="text-xs text-slate-500 px-1">{analysis.utilizationNote}</p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Strategy Tips */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Pricing Strategy</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">This is your floor, not your ceiling</p>
                      <p className="text-slate-500">
                        {formatCurrency(analysis.hourlyRate)}/hr is the minimum to hit your goals.
                        Experienced freelancers typically charge 20-40% above this as a buffer for slow months.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Consider value-based pricing for projects</p>
                      <p className="text-slate-500">
                        For clearly scoped projects, pricing based on value delivered — not hours — often
                        results in higher rates and fewer scope disputes.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Raise your rate 10-15% annually</p>
                      <p className="text-slate-500">
                        Inflation, experience, and demand all justify regular increases. New clients should
                        always start at your current rate — existing clients get a 30-day heads-up.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <EmailCaptureCard
              toolName="Freelance Rate Calculator"
              resultsSummary={`Minimum rate: ${formatCurrency(analysis.hourlyRate)}/hr`}
              className="mt-6"
            />

            <Card className="shadow-lg bg-emerald-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Track Your Income and Hit Your Numbers</h3>
                <p className="text-emerald-100 mb-6">
                  SoloFI helps freelancers track net worth, estimate taxes, and see exactly where they stand financially.
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
                  <strong>Disclaimer:</strong> Rate estimates are based on simplified tax assumptions (approx. 35% effective rate for self-employed individuals).
                  Actual taxes vary by income level, state, filing status, and deductions. This tool is for planning purposes only.
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
          href="https://twitter.com/intent/tweet?text=Calculate%20your%20ideal%20freelance%20hourly%20rate%20for%20free%E2%80%94by%20SoloFI%20solofi.io/tools/rate-calculator%20%23Freelance%20%23Consulting"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black text-white hover:bg-slate-800 transition-colors"
        >
          𝕏 Twitter/X
        </a>
        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A//solofi.io/tools/rate-calculator"
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
