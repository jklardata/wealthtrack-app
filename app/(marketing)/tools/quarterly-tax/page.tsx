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
  Calendar,
  DollarSign,
  Calculator,
  Mail,
  CheckCircle,
  Lock,
  Clock,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  calculateFederalTax,
  calculateSETax,
  getMarginalRate,
  formatCurrency,
  formatPercent,
  STATE_TAX_RATES,
  TAX_CONSTANTS,
  type FilingStatus,
} from "@/lib/tax-calculations";
import { analytics, type CTALocation } from "@/lib/analytics";

const VARIANT = "lead_magnet_quarterly_tax";

type Step = 1 | 2 | 3 | 4 | 5;

// Quarterly due dates for 2025
const QUARTERLY_DUE_DATES = [
  { quarter: "Q1", period: "Jan 1 - Mar 31", dueDate: "April 15, 2025", month: 3 },
  { quarter: "Q2", period: "Apr 1 - May 31", dueDate: "June 16, 2025", month: 5 },
  { quarter: "Q3", period: "Jun 1 - Aug 31", dueDate: "September 15, 2025", month: 8 },
  { quarter: "Q4", period: "Sep 1 - Dec 31", dueDate: "January 15, 2026", month: 0 },
];

interface QuarterlyTaxResults {
  grossIncome: number;
  businessExpenses: number;
  netIncome: number;
  selfEmploymentTax: number;
  seDeduction: number;
  federalTax: number;
  stateTax: number;
  totalAnnualTax: number;
  quarterlyPayment: number;
  effectiveRate: number;
  marginalRate: number;
  retirementDeduction: number;
  taxableIncome: number;
}

function calculateQuarterlyTax(
  grossIncome: number,
  businessExpenses: number,
  filingStatus: FilingStatus,
  stateCode: string,
  retirement401k: number = 0,
  hsaContribution: number = 0
): QuarterlyTaxResults {
  const netIncome = grossIncome - businessExpenses;

  // Self-employment tax
  const seTaxResult = calculateSETax(netIncome);
  const selfEmploymentTax = seTaxResult.total;

  // SE tax deduction (half)
  const seDeduction = selfEmploymentTax * 0.5;

  // Retirement deductions
  const retirementDeduction = retirement401k + hsaContribution;

  // Adjusted gross income
  const agi = netIncome - seDeduction - retirementDeduction;

  // Standard deduction
  const standardDeduction = filingStatus === "married"
    ? TAX_CONSTANTS.standardDeductionMarried
    : TAX_CONSTANTS.standardDeductionSingle;

  const taxableIncome = Math.max(0, agi - standardDeduction);

  // Federal tax
  const federalTax = calculateFederalTax(taxableIncome, filingStatus);

  // State tax
  const stateRate = STATE_TAX_RATES[stateCode]?.rate || 0;
  const stateTax = taxableIncome * stateRate;

  // Total annual tax
  const totalAnnualTax = federalTax + stateTax + selfEmploymentTax;
  const quarterlyPayment = Math.ceil(totalAnnualTax / 4);

  // Rates
  const effectiveRate = netIncome > 0 ? totalAnnualTax / netIncome : 0;
  const marginalRate = getMarginalRate(taxableIncome, filingStatus);

  return {
    grossIncome,
    businessExpenses,
    netIncome,
    selfEmploymentTax,
    seDeduction,
    federalTax,
    stateTax,
    totalAnnualTax,
    quarterlyPayment,
    effectiveRate,
    marginalRate,
    retirementDeduction,
    taxableIncome,
  };
}

function getCurrentQuarter(): number {
  const month = new Date().getMonth();
  if (month < 3) return 0; // Q1
  if (month < 5) return 1; // Q2
  if (month < 8) return 2; // Q3
  return 3; // Q4
}

function getNextDueDate(): { quarter: string; dueDate: string; daysUntil: number } {
  const now = new Date();
  const currentYear = now.getFullYear();

  for (let i = 0; i < QUARTERLY_DUE_DATES.length; i++) {
    const q = QUARTERLY_DUE_DATES[i];
    const year = q.quarter === "Q4" ? currentYear + 1 : currentYear;
    const dueDate = new Date(q.dueDate.replace("2025", String(year)).replace("2026", String(year + 1)));

    if (dueDate > now) {
      const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { quarter: q.quarter, dueDate: q.dueDate, daysUntil };
    }
  }

  // Default to Q1 next year
  return { quarter: "Q1", dueDate: "April 15, 2026", daysUntil: 365 };
}

interface CalculatorState {
  grossIncome: number;
  businessExpenses: number;
  filingStatus: FilingStatus;
  stateCode: string;
  retirement401k: number;
  hsaContribution: number;
  email: string;
  currentStep: Step;
  isSubmitting: boolean;
  submitError: string | null;
  emailSubmitted: boolean;
}

export default function QuarterlyTaxEstimator() {
  const [state, setState] = useState<CalculatorState>({
    grossIncome: 150000,
    businessExpenses: 15000,
    filingStatus: "single",
    stateCode: "none",
    retirement401k: 0,
    hsaContribution: 0,
    email: "",
    currentStep: 1,
    isSubmitting: false,
    submitError: null,
    emailSubmitted: false,
  });

  const results = useMemo<QuarterlyTaxResults>(() => {
    return calculateQuarterlyTax(
      state.grossIncome,
      state.businessExpenses,
      state.filingStatus,
      state.stateCode,
      state.retirement401k,
      state.hsaContribution
    );
  }, [
    state.grossIncome,
    state.businessExpenses,
    state.filingStatus,
    state.stateCode,
    state.retirement401k,
    state.hsaContribution,
  ]);

  const nextDue = getNextDueDate();
  const currentQuarter = getCurrentQuarter();

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
          source: "quarterly_tax_estimator",
          metadata: {
            grossIncome: state.grossIncome,
            businessExpenses: state.businessExpenses,
            filingStatus: state.filingStatus,
            stateCode: state.stateCode,
            quarterlyPayment: results.quarterlyPayment,
            totalAnnualTax: results.totalAnnualTax,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-600" />
            <span className="font-semibold text-lg">SoloFI</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Quarterly Tax Estimator
          </h1>
          <p className="text-lg text-slate-600">
            Calculate your estimated quarterly tax payments for 2025
          </p>
        </div>

        {/* Urgency Banner */}
        {nextDue.daysUntil <= 30 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">
                {nextDue.quarter} payment due in {nextDue.daysUntil} days
              </p>
              <p className="text-sm text-amber-700">Due date: {nextDue.dueDate}</p>
            </div>
          </div>
        )}

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
                  <h2 className="text-xl font-semibold">Your 2025 Income</h2>
                  <p className="text-sm text-slate-500">Expected annual self-employment income</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">
                    Expected Gross Income: {formatCurrency(state.grossIncome)}
                  </Label>
                  <Slider
                    value={[state.grossIncome]}
                    onValueChange={([v]) => updateState({ grossIncome: v })}
                    min={25000}
                    max={500000}
                    step={5000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$25K</span>
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
                    max={Math.min(state.grossIncome * 0.5, 150000)}
                    step={1000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$0</span>
                    <span>{formatCurrency(Math.min(state.grossIncome * 0.5, 150000))}</span>
                  </div>
                </div>

                <div className="pt-4 bg-slate-50 -mx-8 -mb-8 px-8 py-6 rounded-b-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Net Self-Employment Income</span>
                    <span className="font-semibold text-lg">{formatCurrency(results.netIncome)}</span>
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

        {/* Step 2: Filing Status & State */}
        {state.currentStep === 2 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Filing Details</h2>
                  <p className="text-sm text-slate-500">Your tax filing status and state</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Filing Status</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => updateState({ filingStatus: "single" })}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        state.filingStatus === "single"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-semibold">Single</div>
                      <div className="text-sm text-slate-500">or Head of Household</div>
                    </button>
                    <button
                      onClick={() => updateState({ filingStatus: "married" })}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        state.filingStatus === "married"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-semibold">Married</div>
                      <div className="text-sm text-slate-500">Filing Jointly</div>
                    </button>
                  </div>
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
                      {Object.entries(STATE_TAX_RATES).map(([code, { name, rate }]) => (
                        <SelectItem key={code} value={code}>
                          {name} {rate > 0 && `(${formatPercent(rate)})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {STATE_TAX_RATES[state.stateCode]?.rate === 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                    Great news! Your state has no income tax.
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

        {/* Step 3: Teaser Results */}
        {state.currentStep === 3 && (
          <Card className="shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Quarterly Payment</h2>
                  <p className="text-sm text-slate-500">Estimated amount due each quarter</p>
                </div>
              </div>

              {/* Big Number Teaser */}
              <div className="text-center py-8 bg-gradient-to-b from-emerald-50 to-white rounded-xl mb-6">
                <p className="text-sm text-slate-500 mb-2">Pay approximately</p>
                <p className="text-5xl md:text-6xl font-bold text-emerald-600">
                  {formatCurrency(results.quarterlyPayment)}
                </p>
                <p className="text-sm text-slate-500 mt-2">each quarter</p>
                <p className="text-xs text-slate-400 mt-1">
                  ({formatCurrency(results.totalAnnualTax)}/year total)
                </p>
              </div>

              {/* Blurred Preview */}
              <div className="relative">
                <div className="blur-sm select-none pointer-events-none space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Federal Income Tax</span>
                    <span className="font-semibold">{formatCurrency(results.federalTax)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>Self-Employment Tax</span>
                    <span className="font-semibold">{formatCurrency(results.selfEmploymentTax)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span>State Tax</span>
                    <span className="font-semibold">{formatCurrency(results.stateTax)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span>Payment Schedule with Due Dates...</span>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="text-center px-4">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="font-semibold text-slate-800 mb-1">Unlock Full Breakdown</p>
                    <p className="text-sm text-slate-500">Enter your email to see tax details & payment schedule</p>
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
                  <p className="text-sm text-slate-500">Plus quarterly tax deadline reminders</p>
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
                      Full tax breakdown with payment schedule
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Quarterly tax deadline reminders
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Tax optimization tips for freelancers
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
                  {state.isSubmitting ? "Submitting..." : "Get My Results"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Full Results */}
        {state.currentStep === 5 && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="shadow-lg border-emerald-200 bg-gradient-to-b from-emerald-50 to-white">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your 2025 Quarterly Tax Payment</h2>
                <p className="text-5xl font-bold text-emerald-600 my-4">
                  {formatCurrency(results.quarterlyPayment)}
                </p>
                <p className="text-slate-600">per quarter ({formatCurrency(results.totalAnnualTax)} annually)</p>
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div>
                    <span className="text-slate-500">Effective Rate:</span>
                    <span className="font-semibold ml-1">{formatPercent(results.effectiveRate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Marginal Rate:</span>
                    <span className="font-semibold ml-1">{formatPercent(results.marginalRate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Breakdown */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Annual Tax Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">Federal Income Tax</p>
                      <p className="text-sm text-slate-500">On taxable income of {formatCurrency(results.taxableIncome)}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(results.federalTax)}</p>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">Self-Employment Tax</p>
                      <p className="text-sm text-slate-500">12.4% Social Security + 2.9% Medicare</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(results.selfEmploymentTax)}</p>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">State Tax ({STATE_TAX_RATES[state.stateCode]?.name || "None"})</p>
                      <p className="text-sm text-slate-500">
                        {STATE_TAX_RATES[state.stateCode]?.rate > 0
                          ? `${formatPercent(STATE_TAX_RATES[state.stateCode].rate)} state rate`
                          : "No state income tax"}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(results.stateTax)}</p>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="font-semibold text-emerald-800">Total Annual Tax</p>
                    <p className="font-bold text-xl text-emerald-700">{formatCurrency(results.totalAnnualTax)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Schedule */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-lg">2025 Payment Schedule</h3>
                </div>

                <div className="space-y-3">
                  {QUARTERLY_DUE_DATES.map((q, index) => (
                    <div
                      key={q.quarter}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        index === currentQuarter
                          ? "bg-emerald-50 border-emerald-300"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === currentQuarter
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}>
                          {q.quarter}
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {q.period}
                            {index === currentQuarter && (
                              <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-slate-500">Due: {q.dueDate}</p>
                        </div>
                      </div>
                      <p className="font-bold text-lg">{formatCurrency(results.quarterlyPayment)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How to Pay */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">How to Pay Your Estimated Taxes</h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-emerald-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Go to IRS Direct Pay</p>
                      <a
                        href="https://www.irs.gov/payments/direct-pay"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        irs.gov/payments/direct-pay <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-emerald-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Select &quot;Estimated Tax&quot;</p>
                      <p className="text-sm text-slate-500">Choose reason: &quot;Estimated Tax&quot; and apply to 2025</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-emerald-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Pay via bank account (free)</p>
                      <p className="text-sm text-slate-500">Credit/debit cards incur processing fees</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Don&apos;t forget:</strong> Pay state estimated taxes separately if your state requires it.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="shadow-lg bg-emerald-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Track Your Taxes Year-Round</h3>
                <p className="text-emerald-100 mb-6">
                  SoloFI automatically tracks your income and estimates taxes in real-time, so you&apos;re never surprised.
                </p>
                <Link href="/dashboard">
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
                  <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only.
                  Actual tax liability may vary based on your specific circumstances, additional income sources,
                  deductions, and credits. Tax laws change frequently. Consult a qualified tax professional
                  or CPA before making tax decisions. Based on 2025 tax rates and limits.
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
