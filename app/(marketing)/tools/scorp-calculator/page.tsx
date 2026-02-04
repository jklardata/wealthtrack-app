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
  Building2,
  DollarSign,
  Calculator,
  Mail,
  CheckCircle,
  Lock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Scale,
} from "lucide-react";
import Link from "next/link";
import {
  calculateSETax,
  formatCurrency,
  formatPercent,
  TAX_CONSTANTS,
} from "@/lib/tax-calculations";
import { analytics, type CTALocation } from "@/lib/analytics";

const VARIANT = "lead_magnet_scorp_calculator";

type Step = 1 | 2 | 3 | 4 | 5;

// S-Corp related constants
const SCORP_CONSTANTS = {
  minReasonableSalaryPercent: 0.35,
  maxReasonableSalaryPercent: 0.60,
  typicalReasonableSalaryPercent: 0.40,
  annualComplianceCost: 3000, // Payroll, tax filings, accounting
  setupCost: 500, // One-time LLC to S-Corp election
  payrollServiceMonthly: 50,
  minimumBenefitThreshold: 5000, // Don't recommend if savings < this
  incomeThresholdLow: 60000, // Below this, rarely worth it
  incomeThresholdIdeal: 100000, // Above this, usually worth it
};

interface SCorpAnalysis {
  netIncome: number;
  // Current structure (sole prop / LLC)
  currentSETax: number;
  // S-Corp structure
  reasonableSalary: number;
  distributions: number;
  employerFICA: number;
  employeeFICA: number;
  sCorpTotalFICA: number;
  // Savings
  grossSavings: number;
  annualCosts: number;
  netSavings: number;
  breakEvenIncome: number;
  // Recommendation
  recommendation: "strong_yes" | "maybe" | "not_yet" | "no";
  yearsToRecoupSetup: number;
}

function analyzeSCorp(netIncome: number, salaryPercent: number): SCorpAnalysis {
  // Current SE tax as sole prop
  const seTaxResult = calculateSETax(netIncome);
  const currentSETax = seTaxResult.total;

  // S-Corp structure
  const reasonableSalary = Math.round(netIncome * salaryPercent);
  const distributions = netIncome - reasonableSalary;

  // S-Corp FICA: Only on salary (employer + employee portions)
  const ssWageBase = Math.min(reasonableSalary, TAX_CONSTANTS.socialSecurityWageBase);
  const employerFICA = (ssWageBase * 0.062) + (reasonableSalary * 0.0145);
  const employeeFICA = (ssWageBase * 0.062) + (reasonableSalary * 0.0145);
  const sCorpTotalFICA = employerFICA + employeeFICA;

  // Savings calculation
  const grossSavings = currentSETax - sCorpTotalFICA;
  const annualCosts = SCORP_CONSTANTS.annualComplianceCost;
  const netSavings = grossSavings - annualCosts;

  // Break-even calculation (find income where net savings = 0)
  // Approximate: SE tax grows ~15.3% of income, S-Corp FICA grows slower
  const breakEvenIncome = Math.round(annualCosts / 0.05); // Rough approximation

  // Years to recoup setup cost
  const yearsToRecoupSetup = netSavings > 0 ? SCORP_CONSTANTS.setupCost / netSavings : Infinity;

  // Recommendation logic
  let recommendation: SCorpAnalysis["recommendation"];
  if (netIncome < SCORP_CONSTANTS.incomeThresholdLow) {
    recommendation = "no";
  } else if (netSavings < SCORP_CONSTANTS.minimumBenefitThreshold) {
    recommendation = "not_yet";
  } else if (netIncome >= SCORP_CONSTANTS.incomeThresholdIdeal && netSavings >= 8000) {
    recommendation = "strong_yes";
  } else {
    recommendation = "maybe";
  }

  return {
    netIncome,
    currentSETax,
    reasonableSalary,
    distributions,
    employerFICA,
    employeeFICA,
    sCorpTotalFICA,
    grossSavings,
    annualCosts,
    netSavings,
    breakEvenIncome,
    recommendation,
    yearsToRecoupSetup,
  };
}

const RECOMMENDATION_CONFIG = {
  strong_yes: {
    icon: TrendingUp,
    title: "S-Corp Recommended",
    color: "emerald",
    description: "Your income level makes S-Corp election a smart move.",
  },
  maybe: {
    icon: Scale,
    title: "Worth Considering",
    color: "amber",
    description: "S-Corp could benefit you, but weigh the added complexity.",
  },
  not_yet: {
    icon: AlertTriangle,
    title: "Not Yet",
    color: "orange",
    description: "Your savings would be minimal after compliance costs.",
  },
  no: {
    icon: TrendingDown,
    title: "Not Recommended",
    color: "red",
    description: "At your income level, S-Corp costs outweigh benefits.",
  },
};

interface CalculatorState {
  netIncome: number;
  salaryPercent: number;
  email: string;
  currentStep: Step;
  isSubmitting: boolean;
  submitError: string | null;
  emailSubmitted: boolean;
}

export default function SCorpCalculator() {
  const [state, setState] = useState<CalculatorState>({
    netIncome: 120000,
    salaryPercent: 0.40,
    email: "",
    currentStep: 1,
    isSubmitting: false,
    submitError: null,
    emailSubmitted: false,
  });

  const analysis = useMemo<SCorpAnalysis>(() => {
    return analyzeSCorp(state.netIncome, state.salaryPercent);
  }, [state.netIncome, state.salaryPercent]);

  const updateState = (updates: Partial<CalculatorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (step: Step) => {
    updateState({ currentStep: step });
    analytics.ctaClick("calculator_step", `step_${step}` as CTALocation, VARIANT);
  };

  const handleEmailSubmit = async () => {
    if (!state.email || !state.email.includes("@")) {
      updateState({ submitError: "Please enter a valid email address" });
      return;
    }

    updateState({ isSubmitting: true, submitError: null });

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          source: "scorp_calculator",
          metadata: {
            netIncome: state.netIncome,
            salaryPercent: state.salaryPercent,
            recommendation: analysis.recommendation,
            netSavings: analysis.netSavings,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      analytics.ctaClick("calculator_email_submit", "email_gate", VARIANT);
      updateState({ emailSubmitted: true, currentStep: 5 });
    } catch (err) {
      updateState({
        submitError: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    } finally {
      updateState({ isSubmitting: false });
    }
  };

  const recConfig = RECOMMENDATION_CONFIG[analysis.recommendation];

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
            S-Corp Decision Calculator
          </h1>
          <p className="text-lg text-slate-600">
            Should you elect S-Corp status? Find out in 2 minutes.
          </p>
        </div>

        {/* Progress Indicator */}
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

        {/* Step 1: Income */}
        {state.currentStep === 1 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Business Income</h2>
                  <p className="text-sm text-slate-500">Net self-employment income (after expenses)</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">
                    Net Annual Income: {formatCurrency(state.netIncome)}
                  </Label>
                  <Slider
                    value={[state.netIncome]}
                    onValueChange={([v]) => updateState({ netIncome: v })}
                    min={40000}
                    max={500000}
                    step={5000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$40K</span>
                    <span>$500K</span>
                  </div>
                </div>

                {state.netIncome < SCORP_CONSTANTS.incomeThresholdLow && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                    S-Corp is typically not beneficial below ~$60K in net income due to compliance costs.
                  </div>
                )}

                {state.netIncome >= SCORP_CONSTANTS.incomeThresholdIdeal && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                    At this income level, S-Corp election often provides significant tax savings.
                  </div>
                )}

                <div className="pt-4 bg-slate-50 -mx-8 -mb-8 px-8 py-6 rounded-b-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Current Self-Employment Tax</span>
                    <span className="font-semibold text-red-600">{formatCurrency(analysis.currentSETax)}/year</span>
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

        {/* Step 2: Reasonable Salary */}
        {state.currentStep === 2 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Reasonable Salary</h2>
                  <p className="text-sm text-slate-500">What portion would be your W-2 salary?</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <strong>What is reasonable salary?</strong> The IRS requires S-Corp owners to pay themselves
                  a &quot;reasonable salary&quot; for services performed. This is typically 35-60% of net income,
                  depending on your role and industry.
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Salary Percentage: {Math.round(state.salaryPercent * 100)}%
                  </Label>
                  <Slider
                    value={[state.salaryPercent * 100]}
                    onValueChange={([v]) => updateState({ salaryPercent: v / 100 })}
                    min={35}
                    max={60}
                    step={5}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>35% (Aggressive)</span>
                    <span>60% (Conservative)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">Your W-2 Salary</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(analysis.reasonableSalary)}</p>
                    <p className="text-xs text-slate-400">Subject to FICA taxes</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-600">Distributions</p>
                    <p className="text-xl font-bold text-emerald-700">{formatCurrency(analysis.distributions)}</p>
                    <p className="text-xs text-emerald-500">No FICA taxes!</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => goToStep(3)} className="bg-emerald-600 hover:bg-emerald-700">
                  See Results <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Teaser Results */}
        {state.currentStep === 3 && (
          <Card className="shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Scale className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your S-Corp Analysis</h2>
                  <p className="text-sm text-slate-500">Should you make the switch?</p>
                </div>
              </div>

              {/* Big Number Teaser */}
              <div className={`text-center py-8 rounded-xl mb-6 ${
                analysis.netSavings > 0
                  ? "bg-gradient-to-b from-emerald-50 to-white"
                  : "bg-gradient-to-b from-amber-50 to-white"
              }`}>
                <p className="text-sm text-slate-500 mb-2">
                  {analysis.netSavings > 0 ? "Potential Annual Savings" : "Current Analysis"}
                </p>
                <p className={`text-5xl md:text-6xl font-bold ${
                  analysis.netSavings > 0 ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {analysis.netSavings > 0 ? formatCurrency(analysis.netSavings) : "Review Needed"}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  {analysis.netSavings > 0 ? "per year (after compliance costs)" : "See full analysis below"}
                </p>
              </div>

              {/* Blurred Preview */}
              <div className="relative">
                <div className="blur-sm select-none pointer-events-none space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Current SE Tax</span>
                    <span className="font-semibold">{formatCurrency(analysis.currentSETax)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>S-Corp FICA (Total)</span>
                    <span className="font-semibold">{formatCurrency(analysis.sCorpTotalFICA)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Compliance Costs</span>
                    <span className="font-semibold">-{formatCurrency(analysis.annualCosts)}</span>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="text-center px-4">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="font-semibold text-slate-800 mb-1">Unlock Full Comparison</p>
                    <p className="text-sm text-slate-500">See the complete breakdown and recommendation</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => goToStep(4)} className="bg-emerald-600 hover:bg-emerald-700">
                  Unlock Results <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Email Collection */}
        {state.currentStep === 4 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Get Your Full Analysis</h2>
                  <p className="text-sm text-slate-500">Plus S-Corp guides and tax tips</p>
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
                    onChange={(e) => updateState({ email: e.target.value, submitError: null })}
                    className="mt-2"
                  />
                  {state.submitError && (
                    <p className="text-sm text-red-600 mt-2">{state.submitError}</p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-slate-600 font-medium">You&apos;ll receive:</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Full S-Corp vs Sole Prop comparison
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Step-by-step S-Corp election guide
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Tax optimization strategies for freelancers
                    </li>
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
                  {state.isSubmitting ? "Submitting..." : "Get My Analysis"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Full Results */}
        {state.currentStep === 5 && (
          <div className="space-y-6">
            {/* Recommendation Card */}
            <Card className={`shadow-lg border-2 ${
              recConfig.color === "emerald" ? "border-emerald-300 bg-gradient-to-b from-emerald-50 to-white" :
              recConfig.color === "amber" ? "border-amber-300 bg-gradient-to-b from-amber-50 to-white" :
              recConfig.color === "orange" ? "border-orange-300 bg-gradient-to-b from-orange-50 to-white" :
              "border-red-300 bg-gradient-to-b from-red-50 to-white"
            }`}>
              <CardContent className="p-8 text-center">
                <recConfig.icon className={`h-12 w-12 mx-auto mb-4 ${
                  recConfig.color === "emerald" ? "text-emerald-600" :
                  recConfig.color === "amber" ? "text-amber-600" :
                  recConfig.color === "orange" ? "text-orange-600" :
                  "text-red-600"
                }`} />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{recConfig.title}</h2>
                <p className="text-slate-600 mb-4">{recConfig.description}</p>
                {analysis.netSavings > 0 && (
                  <>
                    <p className="text-4xl font-bold text-emerald-600 my-4">
                      {formatCurrency(analysis.netSavings)}
                    </p>
                    <p className="text-slate-500">potential annual savings</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Side-by-Side Comparison */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Sole Prop vs S-Corp Comparison</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Current: Sole Prop */}
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-3">Current: Sole Proprietor</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Net Income</span>
                        <span className="font-medium">{formatCurrency(analysis.netIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">SE Tax (15.3%)</span>
                        <span className="font-medium text-red-600">-{formatCurrency(analysis.currentSETax)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-red-200">
                        <span className="font-semibold">Total FICA/SE Tax</span>
                        <span className="font-bold text-red-700">{formatCurrency(analysis.currentSETax)}</span>
                      </div>
                    </div>
                  </div>

                  {/* S-Corp */}
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-3">With S-Corp Election</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">W-2 Salary</span>
                        <span className="font-medium">{formatCurrency(analysis.reasonableSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Distributions</span>
                        <span className="font-medium text-emerald-600">{formatCurrency(analysis.distributions)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">FICA on Salary</span>
                        <span className="font-medium">-{formatCurrency(analysis.sCorpTotalFICA)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-emerald-200">
                        <span className="font-semibold">Total FICA Tax</span>
                        <span className="font-bold text-emerald-700">{formatCurrency(analysis.sCorpTotalFICA)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Savings Breakdown */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Net Savings Calculation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Current SE Tax (Sole Prop)</span>
                    <span className="font-semibold text-red-600">{formatCurrency(analysis.currentSETax)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>S-Corp FICA Tax (on salary only)</span>
                    <span className="font-semibold text-emerald-600">-{formatCurrency(analysis.sCorpTotalFICA)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="font-medium">Gross Tax Savings</span>
                    <span className="font-bold text-emerald-700">{formatCurrency(analysis.grossSavings)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <div>
                      <span>Annual Compliance Costs</span>
                      <p className="text-xs text-slate-500">Payroll, tax filings, accounting</p>
                    </div>
                    <span className="font-semibold text-amber-700">-{formatCurrency(analysis.annualCosts)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-emerald-100 rounded-lg border border-emerald-300">
                    <span className="font-bold text-emerald-800">Net Annual Savings</span>
                    <span className="font-bold text-2xl text-emerald-700">{formatCurrency(analysis.netSavings)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Considerations */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Key Considerations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Tax savings on distributions</p>
                      <p className="text-slate-500">Distributions ({formatCurrency(analysis.distributions)}) avoid the 15.3% SE tax</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Reasonable salary requirement</p>
                      <p className="text-slate-500">IRS scrutinizes salaries that are too low. {formatPercent(state.salaryPercent)} is generally defensible.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Added complexity</p>
                      <p className="text-slate-500">Requires payroll, quarterly filings, and separate business banking</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="shadow-lg bg-emerald-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to Optimize Your Business Structure?</h3>
                <p className="text-emerald-100 mb-6">
                  SoloFI helps you track income, estimate taxes, and make smarter financial decisions.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                    Try SoloFI Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500">
                  <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only.
                  S-Corp election has significant legal and tax implications. Reasonable salary requirements
                  vary by industry, location, and role. Consult a qualified CPA or tax attorney before
                  making any business structure changes.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
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
