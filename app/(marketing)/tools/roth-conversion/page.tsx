"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
  RefreshCcw,
  DollarSign,
  Calendar,
  Mail,
  CheckCircle,
  Lock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  Wallet,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import { EmailCaptureCard } from "@/components/email-capture-card";
import { analytics } from "@/lib/analytics";

const VARIANT = "lead_magnet_roth_conversion";

type Step = 1 | 2 | 3 | 4 | 5;

interface CalculatorState {
  // Step 1: Age & Timeline
  currentAge: number;
  retirementAge: number;
  // Step 2: Balances
  traditionalBalance: number;
  currentRothBalance: number;
  // Step 3: Tax Info
  currentMarginalRate: number;
  retirementMarginalRate: number;
  // Step 4: Email
  email: string;
  // State
  currentStep: Step;
  isSubmitting: boolean;
  submitError: string | null;
  emailSubmitted: boolean;
}

interface RothConversionYear {
  year: number;
  age: number;
  conversionAmount: number;
  taxOnConversion: number;
  availableAge: number;
  cumulativeConverted: number;
  remainingTraditional: number;
}

interface RothConversionResults {
  conversions: RothConversionYear[];
  totalConversions: number;
  totalTaxPaid: number;
  taxSavingsVsLater: number;
  optimalAnnualConversion: number;
  yearsInLadder: number;
  firstAccessAge: number;
  effectiveTaxRate: number;
  taxIfWithdrawnAtHigherRate: number;
}

function calculateRothConversion(
  currentAge: number,
  retirementAge: number,
  traditionalBalance: number,
  retirementMarginalRate: number
): RothConversionResults {
  const PENALTY_FREE_AGE = 59.5;
  const FIVE_YEAR_RULE = 5;

  // Years between retirement and penalty-free age
  const yearsInLadder = Math.max(0, Math.min(Math.floor(PENALTY_FREE_AGE - retirementAge), 15));

  // 2026 tax brackets for filling low brackets
  // Standard deduction: ~$15,000
  // 10% bracket: $0-$11,925
  // 12% bracket: $11,925-$48,475
  // Total to fill 10-12%: ~$63,475
  const lowBracketLimit = 63000;

  // Optimal conversion to stay in low brackets
  const optimalAnnualConversion = yearsInLadder > 0
    ? Math.min(lowBracketLimit, traditionalBalance / yearsInLadder)
    : 0;

  const conversions: RothConversionYear[] = [];
  let remainingBalance = traditionalBalance;
  let cumulativeConverted = 0;

  for (let i = 0; i < yearsInLadder && remainingBalance > 0; i++) {
    const conversionAmount = Math.min(optimalAnnualConversion, remainingBalance);
    const taxOnConversion = conversionAmount * (retirementMarginalRate / 100);

    cumulativeConverted += conversionAmount;
    remainingBalance -= conversionAmount;

    conversions.push({
      year: i + 1,
      age: retirementAge + i,
      conversionAmount,
      taxOnConversion,
      availableAge: retirementAge + i + FIVE_YEAR_RULE,
      cumulativeConverted,
      remainingTraditional: remainingBalance,
    });
  }

  const totalConversions = conversions.reduce((sum, c) => sum + c.conversionAmount, 0);
  const totalTaxPaid = conversions.reduce((sum, c) => sum + c.taxOnConversion, 0);

  // Compare to withdrawing later at higher rate (assume 22-24% in RMD years)
  const laterTaxRate = 0.22;
  const taxIfWithdrawnAtHigherRate = totalConversions * laterTaxRate;
  const taxSavingsVsLater = taxIfWithdrawnAtHigherRate - totalTaxPaid;

  const effectiveTaxRate = totalConversions > 0 ? (totalTaxPaid / totalConversions) * 100 : 0;
  const firstAccessAge = conversions.length > 0 ? conversions[0].availableAge : PENALTY_FREE_AGE;

  return {
    conversions,
    totalConversions,
    totalTaxPaid,
    taxSavingsVsLater,
    optimalAnnualConversion,
    yearsInLadder,
    firstAccessAge,
    effectiveTaxRate,
    taxIfWithdrawnAtHigherRate,
  };
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toFixed(0)}`;
}

function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RothConversionLeadMagnet() {
  const [state, setState] = useState<CalculatorState>({
    currentAge: 35,
    retirementAge: 50,
    traditionalBalance: 500000,
    currentRothBalance: 100000,
    currentMarginalRate: 24,
    retirementMarginalRate: 12,
    email: "",
    currentStep: 1,
    isSubmitting: false,
    submitError: null,
    emailSubmitted: false,
  });

  const results = useMemo<RothConversionResults>(() => {
    return calculateRothConversion(
      state.currentAge,
      state.retirementAge,
      state.traditionalBalance,
      state.retirementMarginalRate
    );
  }, [state.currentAge, state.retirementAge, state.traditionalBalance, state.retirementMarginalRate]);

  const updateState = (updates: Partial<CalculatorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (step: Step) => {
    updateState({ currentStep: step });
    analytics.ctaClick("calculator_step", `step_${step}` as any, VARIANT);
  };

  const handleEmailSubmit = async () => {
    if (!state.email || !state.email.includes("@")) {
      updateState({ submitError: "Please enter a valid email address" });
      return;
    }

    updateState({ isSubmitting: true, submitError: null });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          source: "roth_conversion_calculator",
          metadata: {
            currentAge: state.currentAge,
            retirementAge: state.retirementAge,
            traditionalBalance: state.traditionalBalance,
            taxSavings: results.taxSavingsVsLater,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to subscribe");
      }

      analytics.ctaClick("calculator_email_submit", "email_gate", VARIANT);
      updateState({ emailSubmitted: true, currentStep: 5 });
    } catch (error) {
      updateState({
        submitError: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      updateState({ isSubmitting: false });
    }
  };

  const taxBrackets = [
    { rate: 10, label: "10%" },
    { rate: 12, label: "12%" },
    { rate: 22, label: "22%" },
    { rate: 24, label: "24%" },
    { rate: 32, label: "32%" },
    { rate: 35, label: "35%" },
    { rate: 37, label: "37%" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-medium tracking-tight">
          SoloFI
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm text-white/60 hover:text-white hidden md:block">
            Blog
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
            <RefreshCcw className="h-4 w-4 text-purple-400" />
            <span className="text-white/70">Early Retirement Strategy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
            Roth Conversion{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Ladder Calculator
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Access your retirement funds before 59½ without penalties. Calculate your optimal Roth conversion strategy.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    state.currentStep >= step
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {state.currentStep > step ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 5 && (
                  <div
                    className={`w-12 h-0.5 ${
                      state.currentStep > step ? "bg-purple-500" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          {/* Step 1: Age & Timeline */}
          {state.currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-medium mb-2">Your Timeline</h2>
                <p className="text-white/60">When do you plan to retire early?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
                <div className="space-y-2">
                  <Label className="text-white/70">Current Age</Label>
                  <Input
                    type="number"
                    value={state.currentAge}
                    onChange={(e) => updateState({ currentAge: parseInt(e.target.value) || 0 })}
                    className="bg-white/5 border-white/20 text-white h-12 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Target Retirement Age</Label>
                  <Input
                    type="number"
                    value={state.retirementAge}
                    onChange={(e) => updateState({ retirementAge: parseInt(e.target.value) || 0 })}
                    className="bg-white/5 border-white/20 text-white h-12 text-lg"
                  />
                </div>
              </div>

              <div className="max-w-xl mx-auto">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <p className="text-sm text-white/80">
                    <strong className="text-purple-400">
                      {Math.max(0, Math.floor(59.5 - state.retirementAge))} years
                    </strong>{" "}
                    between retirement and 59½ when traditional withdrawals become penalty-free.
                    The Roth ladder helps bridge this gap.
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => goToStep(2)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Balances */}
          {state.currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <PiggyBank className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-medium mb-2">Your Retirement Accounts</h2>
                <p className="text-white/60">Current balances in tax-advantaged accounts</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
                <div className="space-y-2">
                  <Label className="text-white/70">Traditional IRA/401k Balance</Label>
                  <Input
                    type="number"
                    value={state.traditionalBalance}
                    onChange={(e) => updateState({ traditionalBalance: parseInt(e.target.value) || 0 })}
                    className="bg-white/5 border-white/20 text-white h-12 text-lg"
                  />
                  <p className="text-xs text-white/40">Pre-tax retirement funds</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Current Roth Balance</Label>
                  <Input
                    type="number"
                    value={state.currentRothBalance}
                    onChange={(e) => updateState({ currentRothBalance: parseInt(e.target.value) || 0 })}
                    className="bg-white/5 border-white/20 text-white h-12 text-lg"
                  />
                  <p className="text-xs text-white/40">Already tax-free (contributions accessible)</p>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button
                  onClick={() => goToStep(1)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => goToStep(3)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Tax Rates - Shows Teaser */}
          {state.currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <DollarSign className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-medium mb-2">Tax Bracket Optimization</h2>
                <p className="text-white/60">Your conversion strategy depends on tax rates</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
                <div className="space-y-2">
                  <Label className="text-white/70">Current Marginal Tax Rate</Label>
                  <Select
                    value={state.currentMarginalRate.toString()}
                    onValueChange={(v) => updateState({ currentMarginalRate: parseInt(v) })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taxBrackets.map((b) => (
                        <SelectItem key={b.rate} value={b.rate.toString()}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-white/40">While working</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Expected Retirement Tax Rate</Label>
                  <Select
                    value={state.retirementMarginalRate.toString()}
                    onValueChange={(v) => updateState({ retirementMarginalRate: parseInt(v) })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taxBrackets.map((b) => (
                        <SelectItem key={b.rate} value={b.rate.toString()}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-white/40">During low-income early retirement</p>
                </div>
              </div>

              {/* Teaser Results - Blurred */}
              <div className="relative mt-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <div className="blur-sm pointer-events-none">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-2xl font-bold text-purple-400">$XX,XXX</p>
                      <p className="text-xs text-white/60">Convert Per Year</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-2xl font-bold text-green-400">$XX,XXX</p>
                      <p className="text-xs text-white/60">Tax Savings</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-2xl font-bold text-amber-400">XX</p>
                      <p className="text-xs text-white/60">First Access Age</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-2xl font-bold text-blue-400">X Years</p>
                      <p className="text-xs text-white/60">Ladder Duration</p>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="text-center">
                    <Lock className="h-8 w-8 text-white/60 mx-auto mb-2" />
                    <p className="text-white/80 font-medium">Enter email to see your results</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button
                  onClick={() => goToStep(2)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => goToStep(4)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8"
                >
                  See My Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Email Gate */}
          {state.currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Mail className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-medium mb-2">Get Your Personalized Strategy</h2>
                <p className="text-white/60">
                  Enter your email to unlock your Roth conversion ladder plan
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Email Address</Label>
                  <Input
                    type="email"
                    value={state.email}
                    onChange={(e) => updateState({ email: e.target.value, submitError: null })}
                    placeholder="you@example.com"
                    className="bg-white/5 border-white/20 text-white h-12"
                  />
                  {state.submitError && (
                    <p className="text-red-400 text-sm">{state.submitError}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-white/60">
                  <p className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Personalized conversion ladder timeline
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Tax savings calculation
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Year-by-year conversion amounts
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Weekly early retirement tips (unsubscribe anytime)
                  </p>
                </div>

                <Button
                  onClick={handleEmailSubmit}
                  disabled={state.isSubmitting}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white h-12"
                >
                  {state.isSubmitting ? "Processing..." : "Unlock My Strategy"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  onClick={() => goToStep(3)}
                  variant="ghost"
                  className="w-full text-white/60 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Full Results */}
          {state.currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-medium mb-2">Your Roth Conversion Strategy</h2>
                <p className="text-white/60">
                  Based on retiring at age {state.retirementAge} with {formatCurrencyFull(state.traditionalBalance)} in traditional accounts
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {formatCurrency(results.optimalAnnualConversion)}
                  </p>
                  <p className="text-xs text-white/60">Convert Per Year</p>
                </div>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(results.taxSavingsVsLater)}
                  </p>
                  <p className="text-xs text-white/60">Potential Tax Savings</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <p className="text-2xl font-bold text-amber-400">
                    {results.firstAccessAge.toFixed(0)}
                  </p>
                  <p className="text-xs text-white/60">First Access Age</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {results.yearsInLadder} Years
                  </p>
                  <p className="text-xs text-white/60">Ladder Duration</p>
                </div>
              </div>

              {/* Conversion Timeline */}
              {results.conversions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Conversion Ladder</h3>
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="text-left p-3 font-medium text-white/80">Year</th>
                          <th className="text-left p-3 font-medium text-white/80">Age</th>
                          <th className="text-right p-3 font-medium text-white/80">Convert</th>
                          <th className="text-right p-3 font-medium text-white/80">Tax</th>
                          <th className="text-right p-3 font-medium text-white/80">Available At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.conversions.slice(0, 10).map((conv, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="p-3 text-white/60">{conv.year}</td>
                            <td className="p-3 text-white">{conv.age}</td>
                            <td className="p-3 text-right text-purple-400 font-medium">
                              {formatCurrencyFull(conv.conversionAmount)}
                            </td>
                            <td className="p-3 text-right text-amber-400">
                              {formatCurrencyFull(conv.taxOnConversion)}
                            </td>
                            <td className="p-3 text-right text-green-400">
                              Age {conv.availableAge}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-white/5">
                          <td colSpan={2} className="p-3 font-medium text-white">Total</td>
                          <td className="p-3 text-right text-purple-400 font-bold">
                            {formatCurrencyFull(results.totalConversions)}
                          </td>
                          <td className="p-3 text-right text-amber-400 font-bold">
                            {formatCurrencyFull(results.totalTaxPaid)}
                          </td>
                          <td className="p-3"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Tax Comparison */}
              <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Tax Savings Breakdown
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-sm">If withdrawn later at 22%:</p>
                    <p className="text-xl font-bold text-red-400">
                      {formatCurrencyFull(results.taxIfWithdrawnAtHigherRate)} in taxes
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">With Roth conversion at {state.retirementMarginalRate}%:</p>
                    <p className="text-xl font-bold text-green-400">
                      {formatCurrencyFull(results.totalTaxPaid)} in taxes
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-500/30">
                  <p className="text-white/60 text-sm">Your savings:</p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrencyFull(results.taxSavingsVsLater)}
                  </p>
                </div>
              </div>

              {/* How It Works */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-medium mb-4">How the Roth Ladder Works</h3>
                <ol className="space-y-3 text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <span>Retire early and enter a low-income year (age {state.retirementAge})</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <span>Convert {formatCurrency(results.optimalAnnualConversion)}/year from Traditional to Roth (pay {state.retirementMarginalRate}% tax)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <span>Wait 5 years for each conversion to become accessible</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                    <span>At age {results.firstAccessAge}, start withdrawing converted funds tax and penalty-free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                    <span>Continue until age 59½ when all retirement funds are accessible</span>
                  </li>
                </ol>
              </div>

              {/* Warning for late retirees */}
              {state.retirementAge >= 54 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-400">Limited Ladder Window</p>
                      <p className="text-sm text-white/70">
                        Retiring at {state.retirementAge} leaves only {Math.max(0, Math.floor(59.5 - state.retirementAge))} years before 59½.
                        Consider the Rule of 55 (401k access after separation at 55+) or SEPP/72(t) substantially equal periodic payments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Capture */}
              <EmailCaptureCard
                toolName="Roth Conversion Calculator"
                resultsSummary={`Convert ${formatCurrency(results.optimalAnnualConversion)}/year | Tax savings: ${formatCurrency(results.taxSavingsVsLater)}`}
                className="mt-6"
              />

              {/* CTA */}
              <div className="text-center pt-4">
                <p className="text-white/60 mb-4">
                  Want to track your full early retirement plan?
                </p>
                <Link href="/sign-up">
                  <Button className="bg-white text-black hover:bg-white/90 px-8">
                    Get Started with SoloFI
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-white/40 text-center mt-8 max-w-2xl mx-auto">
          This calculator is for educational purposes only and should not be considered tax or financial advice.
          Tax laws are complex and change frequently. Consult a qualified CPA or tax professional before implementing a Roth conversion strategy.
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/tools/tax-savings" className="hover:text-white">Tax Calculator</Link>
            <Link href="/tools/fi-calculator" className="hover:text-white">FI Calculator</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
