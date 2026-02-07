"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Calculator,
  DollarSign,
  PiggyBank,
  Building2,
  Mail,
  CheckCircle,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { EmailCaptureCard } from "@/components/email-capture-card";
import {
  calculateTaxSavings,
  formatCurrency,
  formatPercent,
  STATE_TAX_RATES,
  TAX_CONSTANTS,
  type FilingStatus,
  type TaxSavingsResults,
} from "@/lib/tax-calculations";
import { analytics, type CTALocation } from "@/lib/analytics";

const VARIANT = "lead_magnet_tax_calculator";

type Step = 1 | 2 | 3 | 4 | 5;

interface CalculatorState {
  // Step 1
  grossIncome: number;
  businessExpenses: number;
  filingStatus: FilingStatus;
  stateCode: string;
  // Step 2
  current401k: number;
  currentHSA: number;
  hsaCoverageType: "individual" | "family";
  // Step 4
  email: string;
  // State
  currentStep: Step;
  isSubmitting: boolean;
  submitError: string | null;
  emailSubmitted: boolean;
}

export default function TaxSavingsLeadMagnet() {
  const [state, setState] = useState<CalculatorState>({
    grossIncome: 150000,
    businessExpenses: 10000,
    filingStatus: "single",
    stateCode: "none",
    current401k: 0,
    currentHSA: 0,
    hsaCoverageType: "individual",
    email: "",
    currentStep: 1,
    isSubmitting: false,
    submitError: null,
    emailSubmitted: false,
  });

  const results = useMemo<TaxSavingsResults>(() => {
    return calculateTaxSavings({
      grossIncome: state.grossIncome,
      businessExpenses: state.businessExpenses,
      filingStatus: state.filingStatus,
      stateCode: state.stateCode,
      current401k: state.current401k,
      currentHSA: state.currentHSA,
      hsaCoverageType: state.hsaCoverageType,
    });
  }, [state.grossIncome, state.businessExpenses, state.filingStatus, state.stateCode, state.current401k, state.currentHSA, state.hsaCoverageType]);

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
          source: "tax_calculator_lead_magnet",
          metadata: {
            grossIncome: state.grossIncome,
            businessExpenses: state.businessExpenses,
            filingStatus: state.filingStatus,
            stateCode: state.stateCode,
            calculatedSavings: results.totalPotentialSavings,
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
      updateState({ submitError: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      updateState({ isSubmitting: false });
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
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Tax Savings Calculator
          </h1>
          <p className="text-lg text-slate-600">
            Discover how much you could save as a self-employed professional
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

        {/* Step 1: Income Info */}
        {state.currentStep === 1 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Income</h2>
                  <p className="text-sm text-slate-500">Tell us about your consulting income</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">
                    Gross Annual Income: {formatCurrency(state.grossIncome)}
                  </Label>
                  <Slider
                    value={[state.grossIncome]}
                    onValueChange={([v]) => updateState({ grossIncome: v })}
                    min={50000}
                    max={500000}
                    step={5000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$50K</span>
                    <span>$500K</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Business Expenses: {formatCurrency(state.businessExpenses)}
                  </Label>
                  <Slider
                    value={[state.businessExpenses]}
                    onValueChange={([v]) => updateState({ businessExpenses: v })}
                    min={0}
                    max={100000}
                    step={1000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$0</span>
                    <span>$100K</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Filing Status</Label>
                    <Select
                      value={state.filingStatus}
                      onValueChange={(v) => updateState({ filingStatus: v as FilingStatus })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married Filing Jointly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">State</Label>
                    <Select
                      value={state.stateCode}
                      onValueChange={(v) => updateState({ stateCode: v })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATE_TAX_RATES).map(([code, { name }]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 bg-slate-50 -mx-8 -mb-8 px-8 py-6 rounded-b-lg">
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-slate-600">Net Self-Employment Income</span>
                    <span className="font-semibold">{formatCurrency(results.netIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Current SE Tax</span>
                    <span className="font-semibold text-red-600">{formatCurrency(results.currentSETax)}</span>
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

        {/* Step 2: Current Retirement */}
        {state.currentStep === 2 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Current Retirement Savings</h2>
                  <p className="text-sm text-slate-500">What are you contributing now?</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">
                    Current 401k/IRA Contributions: {formatCurrency(state.current401k)}
                  </Label>
                  <Slider
                    value={[state.current401k]}
                    onValueChange={([v]) => updateState({ current401k: v })}
                    min={0}
                    max={TAX_CONSTANTS.solo401kEmployeeLimit}
                    step={500}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$0</span>
                    <span>{formatCurrency(TAX_CONSTANTS.solo401kEmployeeLimit)}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Current HSA Contributions: {formatCurrency(state.currentHSA)}
                  </Label>
                  <Slider
                    value={[state.currentHSA]}
                    onValueChange={([v]) => updateState({ currentHSA: v })}
                    min={0}
                    max={TAX_CONSTANTS.hsaLimitFamily}
                    step={100}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$0</span>
                    <span>{formatCurrency(TAX_CONSTANTS.hsaLimitFamily)}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">HSA Coverage Type</Label>
                  <Select
                    value={state.hsaCoverageType}
                    onValueChange={(v) => updateState({ hsaCoverageType: v as "individual" | "family" })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual ({formatCurrency(TAX_CONSTANTS.hsaLimitSingle)} max)</SelectItem>
                      <SelectItem value="family">Family ({formatCurrency(TAX_CONSTANTS.hsaLimitFamily)} max)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 bg-emerald-50 -mx-8 -mb-8 px-8 py-6 rounded-b-lg border-t border-emerald-100">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-emerald-800">Solo 401k Room</span>
                    <span className="font-semibold text-emerald-700">+{formatCurrency(results.solo401kAdditionalRoom)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-800">HSA Room</span>
                    <span className="font-semibold text-emerald-700">+{formatCurrency(results.hsaAdditionalRoom)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => goToStep(3)} className="bg-emerald-600 hover:bg-emerald-700">
                  See My Savings <ArrowRight className="ml-2 h-4 w-4" />
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
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Potential Savings</h2>
                  <p className="text-sm text-slate-500">Based on your inputs</p>
                </div>
              </div>

              {/* Big Number Teaser */}
              <div className="text-center py-8 bg-gradient-to-b from-emerald-50 to-white rounded-xl mb-6">
                <p className="text-sm text-slate-500 mb-2">You could save up to</p>
                <p className="text-5xl md:text-6xl font-bold text-emerald-600">
                  {formatCurrency(results.totalPotentialSavings)}
                </p>
                <p className="text-sm text-slate-500 mt-2">per year in taxes</p>
              </div>

              {/* Blurred Preview */}
              <div className="relative">
                <div className="blur-sm select-none pointer-events-none space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Solo 401k Savings</span>
                    <span className="font-semibold">{formatCurrency(results.solo401kTaxSavings)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>HSA Tax Savings</span>
                    <span className="font-semibold">{formatCurrency(results.hsaTaxSavings)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>S-Corp Potential</span>
                    <span className="font-semibold">{formatCurrency(results.sCorpNetSavings)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>QBI Deduction</span>
                    <span className="font-semibold">{formatCurrency(results.qbiTaxSavings)}</span>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="text-center px-4">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="font-semibold text-slate-800 mb-1">Unlock Your Full Breakdown</p>
                    <p className="text-sm text-slate-500">Enter your email to see the complete analysis</p>
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
                  <h2 className="text-xl font-semibold">Get Your Full Results</h2>
                  <p className="text-sm text-slate-500">Enter your email to unlock your tax savings breakdown</p>
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

                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">
                    You&apos;ll receive your personalized tax savings breakdown plus occasional tips
                    on tax optimization for self-employed professionals. Unsubscribe anytime.
                  </p>
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
                  {state.isSubmitting ? "Submitting..." : "Show My Results"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Full Results */}
        {state.currentStep === 5 && (
          <div className="space-y-6">
            <Card className="shadow-lg border-emerald-200 bg-gradient-to-b from-emerald-50 to-white">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Tax Savings Potential</h2>
                <p className="text-5xl font-bold text-emerald-600 my-4">
                  {formatCurrency(results.totalPotentialSavings)}
                </p>
                <p className="text-slate-600">per year in potential tax savings</p>
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Your Savings Breakdown</h3>
                <div className="space-y-4">
                  {/* Solo 401k */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <PiggyBank className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Solo 401(k) Opportunity</p>
                            <p className="text-sm text-slate-500">
                              Max contribution: {formatCurrency(results.solo401kTotalMax)}
                            </p>
                          </div>
                          <p className="font-semibold text-emerald-600">
                            {formatCurrency(results.solo401kTaxSavings)}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          Room to contribute: {formatCurrency(results.solo401kAdditionalRoom)} more
                          ({formatCurrency(results.solo401kEmployeeMax)} employee + {formatCurrency(results.solo401kEmployerMax)} employer)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* HSA */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">HSA Tax Savings</p>
                            <p className="text-sm text-slate-500">
                              Max: {formatCurrency(results.hsaMax)} ({state.hsaCoverageType})
                            </p>
                          </div>
                          <p className="font-semibold text-emerald-600">
                            {formatCurrency(results.hsaTaxSavings)}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          HSA saves income tax AND 7.65% FICA tax - double benefit!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* S-Corp */}
                  {results.sCorpQualified && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">S-Corp Election Potential</p>
                              <p className="text-sm text-slate-500">
                                Reasonable salary: {formatCurrency(results.sCorpReasonableSalary)}
                              </p>
                            </div>
                            <p className="font-semibold text-emerald-600">
                              {formatCurrency(results.sCorpNetSavings)}
                            </p>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">
                            Distributions of {formatCurrency(results.sCorpDistributions)} avoid SE tax
                            (net of ~$3K compliance costs)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QBI */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calculator className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">QBI Deduction (Section 199A)</p>
                            <p className="text-sm text-slate-500">
                              20% of qualified business income
                            </p>
                          </div>
                          <p className="font-semibold text-emerald-600">
                            {formatCurrency(results.qbiTaxSavings)}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          Deduction: {formatCurrency(results.qbiDeduction)} at {formatPercent(results.marginalRate)} marginal rate
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{formatPercent(results.marginalRate)}</p>
                    <p className="text-sm text-slate-500">Marginal Tax Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{formatPercent(results.effectiveRate)}</p>
                    <p className="text-sm text-slate-500">Effective Tax Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Capture */}
            <EmailCaptureCard
              toolName="Tax Savings Calculator"
              resultsSummary={`Total potential savings: ${formatCurrency(results.totalPotentialSavings)}`}
              className="mt-6"
            />

            {/* CTA */}
            <Card className="shadow-lg bg-emerald-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to Optimize Your Taxes?</h3>
                <p className="text-emerald-100 mb-6">
                  Get the full SoloFI toolkit: net worth tracking, tax optimization, and retirement planning.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500">
                  <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only.
                  Tax laws are complex and change frequently. The calculations shown are based on 2025 tax rates
                  and limits. Consult a qualified tax professional or CPA before making any tax decisions.
                  Individual results may vary based on your specific circumstances.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-sm text-slate-500">
          <span>&copy; 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
