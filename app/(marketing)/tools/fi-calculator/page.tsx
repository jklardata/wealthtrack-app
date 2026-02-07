"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ArrowRight,
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  Percent,
  Lock,
  CheckCircle,
  Zap,
  PiggyBank,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { EmailCaptureCard } from "@/components/email-capture-card";
import { analytics } from "@/lib/analytics";

const VARIANT = "lead_magnet_fi_calculator";

type Stage = "inputs" | "teaser" | "email" | "results";

interface FIScenario {
  name: string;
  icon: React.ReactNode;
  description: string;
  annualExpenses: number;
  savingsRate: number;
  fiNumber: number;
  yearsToFI: number;
  monthlyInvestment: number;
  color: string;
}

function calculateYearsToFI(
  currentNetWorth: number,
  annualInvestment: number,
  fiNumber: number,
  annualReturn: number
): number {
  if (currentNetWorth >= fiNumber) return 0;
  if (annualInvestment <= 0) return Infinity;

  const r = annualReturn;
  let years = 0;
  let balance = currentNetWorth;

  while (balance < fiNumber && years < 100) {
    balance = balance * (1 + r) + annualInvestment;
    years++;
  }

  return years;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(1) + "M";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatYears(years: number): string {
  if (years === Infinity || years >= 100) return "100+ years";
  if (years === 0) return "Already FI!";
  return `${years} years`;
}

export default function FICalculator() {
  const [stage, setStage] = useState<Stage>("inputs");
  const [currentNetWorth, setCurrentNetWorth] = useState(100000);
  const [annualIncome, setAnnualIncome] = useState(150000);
  const [annualExpenses, setAnnualExpenses] = useState(60000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scenarios = useMemo<FIScenario[]>(() => {
    const annualSavings = annualIncome - annualExpenses;
    const savingsRate = annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0;
    const returnRate = expectedReturn / 100;

    // Current scenario
    const currentFI = annualExpenses * 25;
    const currentYears = calculateYearsToFI(currentNetWorth, annualSavings, currentFI, returnRate);

    // +10% savings rate scenario
    const boostedSavingsRate = Math.min(savingsRate + 10, 90);
    const boostedSavings = annualIncome * (boostedSavingsRate / 100);
    const boostedExpenses = annualIncome - boostedSavings;
    const boostedFI = boostedExpenses * 25;
    const boostedYears = calculateYearsToFI(currentNetWorth, boostedSavings, boostedFI, returnRate);

    // Lower expenses scenario (20% cut)
    const lowerExpenses = annualExpenses * 0.8;
    const lowerExpensesSavings = annualIncome - lowerExpenses;
    const lowerExpensesFI = lowerExpenses * 25;
    const lowerExpensesSavingsRate = annualIncome > 0 ? (lowerExpensesSavings / annualIncome) * 100 : 0;
    const lowerExpensesYears = calculateYearsToFI(currentNetWorth, lowerExpensesSavings, lowerExpensesFI, returnRate);

    // Tax optimized scenario (+$15K/year from tax savings)
    const taxSavings = 15000;
    const taxOptimizedSavings = annualSavings + taxSavings;
    const taxOptimizedSavingsRate = annualIncome > 0 ? (taxOptimizedSavings / annualIncome) * 100 : 0;
    const taxOptimizedYears = calculateYearsToFI(currentNetWorth, taxOptimizedSavings, currentFI, returnRate);

    return [
      {
        name: "Current Path",
        icon: <TrendingUp className="h-5 w-5" />,
        description: "Your current trajectory",
        annualExpenses,
        savingsRate,
        fiNumber: currentFI,
        yearsToFI: currentYears,
        monthlyInvestment: annualSavings / 12,
        color: "slate",
      },
      {
        name: "+10% Savings Rate",
        icon: <PiggyBank className="h-5 w-5" />,
        description: "Boost savings by 10 percentage points",
        annualExpenses: boostedExpenses,
        savingsRate: boostedSavingsRate,
        fiNumber: boostedFI,
        yearsToFI: boostedYears,
        monthlyInvestment: boostedSavings / 12,
        color: "blue",
      },
      {
        name: "Cut Expenses 20%",
        icon: <MapPin className="h-5 w-5" />,
        description: "Geo-arbitrage or lifestyle optimization",
        annualExpenses: lowerExpenses,
        savingsRate: lowerExpensesSavingsRate,
        fiNumber: lowerExpensesFI,
        yearsToFI: lowerExpensesYears,
        monthlyInvestment: lowerExpensesSavings / 12,
        color: "emerald",
      },
      {
        name: "Tax Optimized",
        icon: <Zap className="h-5 w-5" />,
        description: "+$15K/year from Solo 401k, S-Corp, etc.",
        annualExpenses,
        savingsRate: taxOptimizedSavingsRate,
        fiNumber: currentFI,
        yearsToFI: taxOptimizedYears,
        monthlyInvestment: taxOptimizedSavings / 12,
        color: "purple",
      },
    ];
  }, [currentNetWorth, annualIncome, annualExpenses, expectedReturn]);

  const currentScenario = scenarios[0];
  const bestScenario = scenarios.reduce((best, s) => (s.yearsToFI < best.yearsToFI ? s : best), scenarios[0]);
  const yearsSaved = currentScenario.yearsToFI - bestScenario.yearsToFI;

  const handleCalculate = () => {
    setStage("teaser");
    analytics.ctaClick("calculator_step", "step_1", VARIANT);
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      setSubmitError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "fi_calculator",
          metadata: {
            currentNetWorth,
            annualIncome,
            annualExpenses,
            fiNumber: currentScenario.fiNumber,
            yearsToFI: currentScenario.yearsToFI,
            savingsRate: currentScenario.savingsRate,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      analytics.ctaClick("calculator_email_submit", "email_gate", VARIANT);
      setStage("results");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Target className="h-6 w-6 text-violet-600" />
            <span className="font-semibold text-lg">SoloFI</span>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Financial Independence Calculator
          </h1>
          <p className="text-lg text-slate-600">
            Calculate your FI number and compare paths to get there faster
          </p>
        </div>

        {/* Inputs Stage */}
        {stage === "inputs" && (
          <Card className="shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-violet-600" />
                    Current Net Worth: {formatCurrency(currentNetWorth)}
                  </Label>
                  <Slider
                    value={[currentNetWorth]}
                    onValueChange={([v]) => setCurrentNetWorth(v)}
                    min={0}
                    max={2000000}
                    step={10000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$0</span>
                    <span>$2M</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-violet-600" />
                    Annual Income: {formatCurrency(annualIncome)}
                  </Label>
                  <Slider
                    value={[annualIncome]}
                    onValueChange={([v]) => setAnnualIncome(v)}
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
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    Annual Expenses: {formatCurrency(annualExpenses)}
                  </Label>
                  <Slider
                    value={[annualExpenses]}
                    onValueChange={([v]) => setAnnualExpenses(v)}
                    min={20000}
                    max={200000}
                    step={2000}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$20K</span>
                    <span>$200K</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Percent className="h-4 w-4 text-violet-600" />
                    Expected Annual Return: {expectedReturn}%
                  </Label>
                  <Slider
                    value={[expectedReturn]}
                    onValueChange={([v]) => setExpectedReturn(v)}
                    min={4}
                    max={12}
                    step={0.5}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>4%</span>
                    <span>12%</span>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="pt-4 bg-violet-50 -mx-8 -mb-8 px-8 py-6 rounded-b-lg">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-violet-600">Savings Rate</p>
                      <p className="text-2xl font-bold text-violet-900">
                        {currentScenario.savingsRate.toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-violet-600">Monthly Savings</p>
                      <p className="text-2xl font-bold text-violet-900">
                        {formatCurrency(currentScenario.monthlyInvestment)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button onClick={handleCalculate} className="w-full bg-violet-600 hover:bg-violet-700">
                  Calculate My FI Number <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teaser Stage */}
        {stage === "teaser" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="shadow-lg border-violet-200 bg-gradient-to-b from-violet-50 to-white">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-violet-600 mx-auto mb-4" />
                <p className="text-sm text-violet-600 mb-2">Your FI Number</p>
                <p className="text-5xl font-bold text-violet-900 mb-2">
                  {formatCurrency(currentScenario.fiNumber)}
                </p>
                <p className="text-slate-600">
                  Based on {formatCurrency(annualExpenses)}/year expenses × 25
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <Calendar className="h-10 w-10 text-slate-400 mx-auto mb-4" />
                <p className="text-sm text-slate-500 mb-2">Time to FI (Current Path)</p>
                <p className="text-4xl font-bold text-slate-900 mb-2">
                  {formatYears(currentScenario.yearsToFI)}
                </p>
                <p className="text-slate-600">
                  at {currentScenario.savingsRate.toFixed(0)}% savings rate
                </p>
              </CardContent>
            </Card>

            {/* Blurred Comparison Preview */}
            <Card className="shadow-lg overflow-hidden">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4 text-center">Compare Scenarios</h3>

                <div className="relative">
                  <div className="blur-sm select-none pointer-events-none">
                    <div className="grid grid-cols-2 gap-4">
                      {scenarios.slice(1).map((s) => (
                        <div key={s.name} className="p-4 bg-slate-50 rounded-lg">
                          <p className="font-medium">{s.name}</p>
                          <p className="text-2xl font-bold">{formatYears(s.yearsToFI)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="text-center px-4">
                      <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                      <p className="font-semibold text-slate-800 mb-1">
                        See How to Reach FI {yearsSaved > 0 ? `${yearsSaved} Years Faster` : "Faster"}
                      </p>
                      <p className="text-sm text-slate-500">Enter your email to unlock the comparison</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={() => setStage("email")} className="w-full bg-violet-600 hover:bg-violet-700">
                    Unlock Full Comparison <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Email Stage */}
        {stage === "email" && (
          <Card className="shadow-lg max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-violet-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Unlock Your FI Comparison
                </h2>
                <p className="text-slate-600">
                  See how different strategies affect your timeline to financial independence.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubmitError(null);
                    }}
                    className="mt-2"
                  />
                  {submitError && (
                    <p className="text-sm text-red-600 mt-2">{submitError}</p>
                  )}
                </div>

                <Button
                  onClick={handleEmailSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isSubmitting ? "Loading..." : "Show My Comparison"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  We&apos;ll send you tips on reaching FI faster. Unsubscribe anytime.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Stage */}
        {stage === "results" && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-violet-200">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                  <p className="text-sm text-violet-600">Your FI Number</p>
                  <p className="text-3xl font-bold text-violet-900">
                    {formatCurrency(currentScenario.fiNumber)}
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-emerald-200">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-emerald-600">Fastest Path</p>
                  <p className="text-3xl font-bold text-emerald-900">
                    {formatYears(bestScenario.yearsToFI)}
                  </p>
                  <p className="text-sm text-emerald-600">{bestScenario.name}</p>
                </CardContent>
              </Card>
            </div>

            {/* Scenario Comparison */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-6">Path Comparison</h3>

                <div className="space-y-4">
                  {scenarios.map((scenario, idx) => {
                    const isBest = scenario.yearsToFI === bestScenario.yearsToFI && idx !== 0;
                    const yearsDiff = currentScenario.yearsToFI - scenario.yearsToFI;

                    return (
                      <div
                        key={scenario.name}
                        className={`p-4 rounded-xl border-2 ${
                          isBest ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              isBest ? "bg-emerald-200 text-emerald-700" : "bg-slate-200 text-slate-600"
                            }`}>
                              {scenario.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-900">{scenario.name}</p>
                                {isBest && (
                                  <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                                    Best
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500">{scenario.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${isBest ? "text-emerald-700" : "text-slate-900"}`}>
                              {formatYears(scenario.yearsToFI)}
                            </p>
                            {yearsDiff > 0 && idx !== 0 && (
                              <p className="text-sm text-emerald-600">
                                {yearsDiff} years faster
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
                          <div>
                            <p className="text-xs text-slate-500">FI Number</p>
                            <p className="font-medium">{formatCurrency(scenario.fiNumber)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Savings Rate</p>
                            <p className="font-medium">{scenario.savingsRate.toFixed(0)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Monthly Investment</p>
                            <p className="font-medium">{formatCurrency(scenario.monthlyInvestment)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Key Insight */}
            {yearsSaved > 0 && (
              <Card className="shadow-lg border-violet-200 bg-violet-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-violet-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-violet-900">Key Insight</p>
                      <p className="text-violet-800 mt-1">
                        By optimizing with <strong>{bestScenario.name.toLowerCase()}</strong>, you could reach
                        financial independence <strong>{yearsSaved} years earlier</strong>. That&apos;s {yearsSaved} extra
                        years of freedom to spend however you want.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Capture */}
            <EmailCaptureCard
              toolName="FIRE Calculator"
              resultsSummary={`FI Number: ${formatCurrency(currentScenario.fiNumber)} | Years to FI: ${formatYears(bestScenario.yearsToFI)}`}
              className="mt-6"
            />

            {/* CTA */}
            <Card className="shadow-lg bg-violet-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Track Your Progress to FI</h3>
                <p className="text-violet-100 mb-6">
                  SoloFI helps you track net worth, optimize taxes, and monitor your FI timeline in real-time.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-violet-600 hover:bg-violet-50">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
