"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Calculator, PieChart, Building2, TrendingUp, Shield, Lock, Eye } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";
import { useState } from "react";

// Quick quarterly tax estimator state type
type TaxFilingStatus = "single" | "married" | "hoh";

function QuarterlyTaxWidget() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [filingStatus, setFilingStatus] = useState<TaxFilingStatus>("single");
  const [result, setResult] = useState<null | {
    netIncome: number;
    selfEmploymentTax: number;
    estimatedFederalTax: number;
    quarterlyPayment: number;
    effectiveRate: number;
    safeHarbor90: number;
    safeHarbor100: number;
    totalAnnual: number;
  }>(null);

  const calculate = () => {
    const gross = parseFloat(income.replace(/,/g, "")) || 0;
    const exp = parseFloat(expenses.replace(/,/g, "")) || 0;
    const net = Math.max(0, gross - exp);

    // SE tax
    const seTax = net * 0.9235 * 0.153;
    const seDeduction = seTax * 0.5;

    // Standard deductions
    const standardDeduction = filingStatus === "married" ? 29200 : filingStatus === "hoh" ? 21900 : 14600;

    // Federal taxable income
    const taxableIncome = Math.max(0, net - seDeduction - standardDeduction);

    // Simple progressive tax estimate (2024 brackets, single as baseline)
    let federalTax = 0;
    if (filingStatus === "married") {
      const brackets = [[23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37]] as [number, number][];
      let remaining = taxableIncome;
      let prev = 0;
      for (const [cap, rate] of brackets) {
        const inBracket = Math.min(remaining, cap - prev);
        federalTax += inBracket * rate;
        remaining -= inBracket;
        if (remaining <= 0) break;
        prev = cap;
      }
    } else {
      const brackets = [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]] as [number, number][];
      let remaining = taxableIncome;
      let prev = 0;
      for (const [cap, rate] of brackets) {
        const inBracket = Math.min(remaining, cap - prev);
        federalTax += inBracket * rate;
        remaining -= inBracket;
        if (remaining <= 0) break;
        prev = cap;
      }
    }

    const totalAnnual = seTax + federalTax;
    const quarterly = totalAnnual / 4;
    const effectiveRate = net > 0 ? (totalAnnual / net) * 100 : 0;

    setResult({
      netIncome: net,
      selfEmploymentTax: seTax,
      estimatedFederalTax: federalTax,
      quarterlyPayment: quarterly,
      effectiveRate,
      safeHarbor90: totalAnnual * 0.9 / 4,
      safeHarbor100: totalAnnual / 4, // same as quarterly (100% of current year estimate)
      totalAnnual,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-emerald-600 px-5 py-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-white" />
          <h3 className="text-white font-semibold">Quick Quarterly Tax Estimate</h3>
        </div>
        <p className="text-emerald-100 text-sm mt-1">Free · No signup · Results in seconds</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Annual Gross Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="150,000"
                className="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Business Expenses</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="20,000"
                className="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Filing Status</label>
          <div className="flex gap-2">
            {(["single", "married", "hoh"] as TaxFilingStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilingStatus(s)}
                className={`flex-1 py-2 text-xs rounded-lg border transition-colors font-medium ${
                  filingStatus === s
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {s === "single" ? "Single" : s === "married" ? "Married" : "HOH"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!income}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          Calculate My Quarterly Tax
        </button>

        {result && (
          <div className="mt-2 space-y-3">
            {/* Tax breakdown */}
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tax Breakdown</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Net SE Income</span>
                <span className="font-medium text-slate-900">{fmt(result.netIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Self-Employment Tax</span>
                <span className="font-medium text-slate-900">{fmt(result.selfEmploymentTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Est. Federal Income Tax</span>
                <span className="font-medium text-slate-900">{fmt(result.estimatedFederalTax)}</span>
              </div>
            </div>

            {/* Quarterly payment highlight */}
            <div className="rounded-lg bg-emerald-600 p-4 text-white text-center">
              <p className="text-emerald-100 text-xs mb-1">Pay per quarter</p>
              <p className="text-3xl font-bold">{fmt(result.quarterlyPayment)}</p>
              <p className="text-emerald-200 text-xs mt-1">{result.effectiveRate.toFixed(1)}% effective rate · federal + SE only</p>
            </div>

            {/* Sign up CTA */}
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-slate-600 mb-2.5">
                <span className="font-semibold text-slate-800">Want the full breakdown?</span> Safe Harbor amounts, state tax, due dates + payment tracker.
              </p>
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2.5 rounded-lg transition-colors"
              >
                Sign up to see full breakdown — free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {!result && (
          <p className="text-center text-xs text-slate-400">
            Federal + SE tax estimate. State tax not included.
          </p>
        )}
      </div>
    </div>
  );
}

// Force deployment refresh

const VARIANT = "landing_21_decision_engine";

export default function Landing21() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        setEmail("");
      } else {
        setMessage({ type: "error", text: data.error || "Something went wrong" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to subscribe. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingAnalytics variant={VARIANT} />

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link href="https://solofi.io">
          <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-emerald-600">Solo</span>FI
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/tools" className="hidden md:block text-slate-600 hover:text-slate-900 text-sm">
            Resources
          </Link>
          <Link href="/pricing" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm">
            Pricing
          </Link>
          <TrackedLink
            href="/sign-in"
            trackingAction="sign_in"
            trackingLocation="nav"
            trackingVariant={VARIANT}
            buttonProps={{ variant: "ghost", className: "text-slate-600 text-xs sm:text-sm px-2 sm:px-4" }}
          >
            Sign in
          </TrackedLink>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6 sm:mb-8 leading-tight">
            Stop optimizing blind.
          </h1>
          <div className="mb-8 sm:mb-10 max-w-xl mx-auto space-y-3 text-left sm:text-center">
            <p className="text-base sm:text-lg text-slate-400">
              Your CPA files the return. Your portfolio tracker shows the balance.
            </p>
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
              Nobody&apos;s connecting the dots between your structure, your taxes, and your retirement timeline.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <TrackedLink
              href="/sign-up"
              trackingAction="get_started"
              trackingLocation="hero"
              trackingVariant={VARIANT}
              buttonProps={{ size: "lg", className: "bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-6 text-base sm:text-lg" }}
            >
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </TrackedLink>

          </div>
        </div>

        {/* Product Preview */}
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 overflow-hidden shadow-lg">
            <div className="bg-slate-100 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 border-b border-slate-200">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
              <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-slate-500 font-mono">solofi.io</span>
            </div>
            <div className="p-3 sm:p-6 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm flex sm:block items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Net Worth</p>
                    <p className="text-xs text-emerald-600 sm:hidden">+12.4% YTD</p>
                  </div>
                  <p className="text-lg sm:text-2xl font-semibold text-slate-900 font-mono">$847K</p>
                  <p className="text-xs text-emerald-600 mt-0.5 hidden sm:block">+12.4% YTD</p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm flex sm:block items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Portfolio</p>
                    <p className="text-xs text-emerald-600 sm:hidden">Tax-optimized</p>
                  </div>
                  <p className="text-lg sm:text-2xl font-semibold text-slate-900 font-mono">$524K</p>
                  <p className="text-xs text-emerald-600 mt-0.5 hidden sm:block">Tax-optimized</p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm flex sm:block items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Tax Savings</p>
                    <p className="text-xs text-slate-500 sm:hidden">S-Corp</p>
                  </div>
                  <p className="text-lg sm:text-2xl font-semibold text-emerald-600 font-mono">$35K</p>
                  <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">S-Corp optimized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for strip */}
      <section className="bg-slate-900 text-white py-10 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 max-w-2xl mx-auto">
            Your W-2 colleagues have a payroll department, a 401k match, and an HR team handling this. You&apos;re earning more than most of them but navigating it entirely alone. SoloFI becomes your self-employment companion.
          </p>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            The average SoloFI user finds $18,000 in tax they didn&apos;t have to pay. Takes about 10 minutes to model. Free to start. No credit card required.
          </p>
        </div>
      </section>

      {/* Quarterly Tax Calculator CTA Section */}
      <section className="py-10 sm:py-14 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Try it free</p>
              <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 mb-3">
                How much should you pay in quarterly taxes?
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Most self-employed professionals either overpay and lose liquidity, or underpay and get hit with penalties. Get your estimate in seconds — no signup required.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  Federal + self-employment tax breakdown
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  Accounts for business expense deductions
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  Safe Harbor amounts to avoid IRS penalties
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  2025 quarterly due dates
                </li>
              </ul>
            </div>
            <div>
              <QuarterlyTaxWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Pillars */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-medium text-slate-900 text-center mb-3 sm:mb-4">The decisions SoloFI helps you make</h2>
          <p className="text-sm sm:text-base text-slate-600 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            Not a brokerage. Not a tracker. A modeling tool built specifically for the financial decisions self-employed people face and get wrong most often.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8 border-t-2 border-t-emerald-500">
              <h3 className="text-lg font-medium text-slate-900 mb-3">Should I stay self-employed or take the W-2 offer?</h3>
              <p className="text-slate-600 mb-4">
                Model the full tax picture of self-employment vs. W-2, including retirement contributions, benefits, and your effective take-home at different income levels.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Business structure comparison
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Retirement timeline scenarios
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Tax strategy simulations
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 border-t-2 border-t-emerald-500">
              <h3 className="text-lg font-medium text-slate-900 mb-3">What should my S-Corp salary actually be?</h3>
              <p className="text-slate-600 mb-4">
                Most S-Corp owners set their salary once and never revisit it. SoloFI models the exact salary that minimizes your SE tax without triggering IRS scrutiny at your specific income level.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Solo 401k and SEP IRA modeling
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  S-Corp salary optimization
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Quarterly tax estimates
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 border-t-2 border-t-emerald-500">
              <h3 className="text-lg font-medium text-slate-900 mb-3">Where do I actually stand financially?</h3>
              <p className="text-slate-600 mb-4">
                Track net worth across all accounts without linking them. Enter your numbers, see your complete picture and watch how each decision you model changes your trajectory.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  No bank linking required—enter your numbers, your way
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Net worth tracking over time
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Asset allocation analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Tax-location optimization
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 border-t-2 border-t-emerald-500">
              <h3 className="text-lg font-medium text-slate-900 mb-3">Can I actually retire at 55?</h3>
              <p className="text-slate-600 mb-4">
                Run scenarios across different retirement ages, spending levels, and locations. See your probability of success before committing and not after it&apos;s too late to adjust.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Know exactly what number you need to retire
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  See how moving changes your timeline
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Stress-test your plan before you commit
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who SoloFI is for */}
      <section className="bg-white border-y border-slate-200 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-medium text-slate-900 text-center mb-3 sm:mb-4">Built for established self-employed professionals earning $150k+</h2>
          <p className="text-sm sm:text-base text-slate-600 text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
            You&apos;re doing the right things. The problem isn&apos;t effort. It&apos;s visibility.
          </p>
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
                Your CPA optimizes the return. Your brokerage shows the balance. But nobody is modeling how your business structure, tax decisions, and savings rate compound into your actual retirement timeline. The cost isn&apos;t the subscription. It&apos;s what you don&apos;t know.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">S-Corp or LLC?</p>
                    <p className="text-xs text-slate-500">Model the breakeven at your exact income</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Retire at 55?</p>
                    <p className="text-xs text-slate-500">See your real number and timeline</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Roth conversion?</p>
                    <p className="text-xs text-slate-500">Find the optimal amount this year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-medium text-center mb-3 sm:mb-4">A different kind of financial tool</h2>
          <p className="text-sm sm:text-base text-slate-400 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            Most platforms want to hold your assets or sell you products. SoloFI exists to help you think clearly.
          </p>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5 text-slate-300">Typical platforms</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2" />
                  <span className="text-sm sm:text-base text-slate-400">Require asset transfers or account linking</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2" />
                  <span className="text-sm sm:text-base text-slate-400">Optimized for AUM fees or product sales</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2" />
                  <span className="text-sm sm:text-base text-slate-400">Generic advice that doesn't account for self-employment</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2" />
                  <span className="text-sm sm:text-base text-slate-400">Lock you into their ecosystem</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5 text-white">SoloFI</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">No asset transfers. Your money stays where it is.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Simple subscription. No hidden incentives.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Built specifically for self-employed tax complexity</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Use alongside any advisor or platform you choose</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Photo strip — self-employed professional */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1600&h=600&fit=crop"
          alt="Self-employed professional working independently"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/55 to-slate-900/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">Built for the self-employed</p>
            <h2 className="text-2xl sm:text-3xl font-medium text-white mb-3 max-w-xl">
              Variable income. Complex taxes.<br className="hidden sm:block" /> Big financial decisions.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-md">
              SoloFI models the tradeoffs so you understand exactly what each decision costs before you commit.
            </p>
          </div>
        </div>
      </section>

      {/* Tax Optimization Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Tax optimization that understands self-employment</h2>
              <p className="text-slate-600 mb-6">
                Self-employment taxes add 15.3% before you even get to income tax. The right structure and timing decisions can save tens of thousands per year, but only if you can model the tradeoffs accurately.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">S-Corp election timing</h4>
                    <p className="text-sm text-slate-500">See exactly when an S-Corp saves you money vs adds complexity</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Retirement contribution strategy</h4>
                    <p className="text-sm text-slate-500">Solo 401k vs SEP IRA vs both—modeled for your specific income</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PieChart className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Quarterly estimate planning</h4>
                    <p className="text-sm text-slate-500">Avoid penalties and surprise bills with accurate projections</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm h-80">
              <img
                src="https://images.pexels.com/photos/6863243/pexels-photo-6863243.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Self-employed professional reviewing tax strategy"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Photo strip — retirement lifestyle */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1600&h=500&fit=crop"
          alt="Financial freedom and early retirement lifestyle"
          className="w-full h-full object-cover object-[center_30%]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/85 via-slate-900/55 to-slate-900/20" />
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="max-w-5xl mx-auto px-6 w-full flex justify-end">
            <div className="max-w-md text-right">
              <p className="text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">Retire on your terms</p>
              <h2 className="text-2xl sm:text-3xl font-medium text-white mb-3">
                What does financial independence actually look like for you?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Model it. Adjust it. Know your number.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Retirement Planning Section */}
      <section className="bg-white border-y border-slate-200 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                <div className="text-sm text-slate-500 mb-6">Retirement scenario comparison</div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                    <div>
                      <div className="font-medium text-slate-900">Retire at 55</div>
                      <div className="text-sm text-slate-500">$2.1M target</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-amber-600">78% success</div>
                      <div className="text-sm text-slate-500">Monte Carlo</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200">
                    <div>
                      <div className="font-medium text-slate-900">Retire at 58</div>
                      <div className="text-sm text-slate-500">$2.1M target</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-emerald-600">94% success</div>
                      <div className="text-sm text-slate-500">Monte Carlo</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                    <div>
                      <div className="font-medium text-slate-900">Retire at 55 (Portugal)</div>
                      <div className="text-sm text-slate-500">$1.4M target</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-emerald-600">91% success</div>
                      <div className="text-sm text-slate-500">Monte Carlo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Retirement planning with real numbers</h2>
              <p className="text-slate-600 mb-6">
                Generic retirement calculators assume a steady salary and employer 401k match. Your situation is different. Model retirement scenarios that account for variable income, self-employment tax savings, and geographic flexibility.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Monte Carlo simulations with 1,000+ scenarios
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Coast FI and Barista FI calculations
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Geographic arbitrage with cost-of-living data
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Safe withdrawal rate sensitivity analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Principles */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-slate-900 text-center mb-4">Our principles</h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            How we think about building financial tools.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">Clarity over complexity</h3>
              <p className="text-sm text-slate-500">
                Financial decisions are hard enough. Our job is to make the implications clear, not to add more noise.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">Independence by design</h3>
              <p className="text-sm text-slate-500">
                We don't hold your assets or earn commissions. Our only incentive is to be useful enough that you keep subscribing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">No account required to start</h3>
              <p className="text-sm text-slate-500">
                Your data is saved locally on your device and never sent to our servers until you choose to create an account. No account linking, no data selling, export everything anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-xl font-medium text-slate-900 mb-3">Tax strategies for the self-employed</h2>
          <p className="text-slate-600 mb-6">
            Occasional emails on tax optimization, retirement planning, and financial modeling. No spam, no sales pitches.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          {message && (
            <p className={`mt-3 text-sm text-center ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-medium text-slate-900 mb-4">See what you&apos;re leaving on the table.</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            The average SoloFI user finds $18,000 in tax they didn&apos;t have to pay. Takes about 10 minutes to model. Free to start — no credit card required.
          </p>
          <TrackedLink
            href="/sign-up"
            trackingAction="create_account"
            trackingLocation="cta_section"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", className: "bg-emerald-600 hover:bg-emerald-700 text-white px-8" }}
          >
            Create free account
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
            <span>© 2026 SoloFI</span>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/about" className="hover:text-slate-700">About</Link>
              <Link href="/contact" className="hover:text-slate-700">Contact</Link>
              <Link href="/learn" className="hover:text-slate-700">Documentation</Link>
              <Link href="/faq" className="hover:text-slate-700">FAQ</Link>
              <Link href="/tools" className="hover:text-slate-700">Resources</Link>
              <Link href="https://solofi.io/blog" className="hover:text-slate-700">Learn</Link>
              <Link href="/pricing" className="hover:text-slate-700">Pricing</Link>
              <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
