"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Calculator, Shield, Calendar } from "lucide-react";
import { STATE_TAX_RATES } from "@/lib/tax-calculations";

type FilingStatus = "single" | "married" | "hoh";

const QUARTERLY_DUE_DATES = [
  { quarter: "Q1", period: "Jan 1 – Mar 31", dueDate: "April 15, 2025" },
  { quarter: "Q2", period: "Apr 1 – May 31", dueDate: "June 16, 2025" },
  { quarter: "Q3", period: "Jun 1 – Aug 31", dueDate: "September 15, 2025" },
  { quarter: "Q4", period: "Sep 1 – Dec 31", dueDate: "January 15, 2026" },
];

function getCurrentQuarter(): number {
  const month = new Date().getMonth();
  if (month < 3) return 0;
  if (month < 5) return 1;
  if (month < 8) return 2;
  return 3;
}

function QuarterlyTaxCalc() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState("none");
  const [result, setResult] = useState<null | {
    netIncome: number;
    selfEmploymentTax: number;
    estimatedFederalTax: number;
    stateTax: number;
    totalAnnual: number;
    quarterlyPayment: number;
    effectiveRate: number;
    taxableIncome: number;
  }>(null);

  const calculate = () => {
    const gross = parseFloat(income.replace(/,/g, "")) || 0;
    const exp = parseFloat(expenses.replace(/,/g, "")) || 0;
    const net = Math.max(0, gross - exp);
    const seTax = net * 0.9235 * 0.153;
    const seDeduction = seTax * 0.5;
    const standardDeduction = filingStatus === "married" ? 30000 : 15000;
    const taxableIncome = Math.max(0, net - seDeduction - standardDeduction);

    let federalTax = 0;
    if (filingStatus === "married") {
      const brackets: [number, number][] = [[23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37]];
      let remaining = taxableIncome, prev = 0;
      for (const [cap, rate] of brackets) {
        const inBracket = Math.min(remaining, cap - prev);
        federalTax += inBracket * rate;
        remaining -= inBracket;
        if (remaining <= 0) break;
        prev = cap;
      }
    } else {
      const brackets: [number, number][] = [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]];
      let remaining = taxableIncome, prev = 0;
      for (const [cap, rate] of brackets) {
        const inBracket = Math.min(remaining, cap - prev);
        federalTax += inBracket * rate;
        remaining -= inBracket;
        if (remaining <= 0) break;
        prev = cap;
      }
    }

    const stateRate = STATE_TAX_RATES[stateCode]?.rate || 0;
    const stateTax = taxableIncome * stateRate;
    const totalAnnual = seTax + federalTax + stateTax;

    setResult({
      netIncome: net,
      selfEmploymentTax: seTax,
      estimatedFederalTax: federalTax,
      stateTax,
      totalAnnual,
      quarterlyPayment: totalAnnual / 4,
      effectiveRate: net > 0 ? (totalAnnual / net) * 100 : 0,
      taxableIncome,
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const currentQuarter = getCurrentQuarter();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-emerald-600 px-5 py-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-white" />
          <h2 className="text-white font-semibold text-lg">Quarterly Tax Estimator</h2>
        </div>
        <p className="text-emerald-100 text-sm mt-1">Free · No signup · Results in seconds</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Annual Gross Income</label>
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
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Business Expenses</label>
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

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Filing Status</label>
            <div className="flex gap-2">
              {(["single", "married", "hoh"] as FilingStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilingStatus(s)}
                  className={`flex-1 py-2.5 text-xs rounded-lg border transition-colors font-medium ${
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
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">State</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full py-2.5 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              {Object.entries(STATE_TAX_RATES).map(([code, { name, rate }]) => (
                <option key={code} value={code}>
                  {name}{rate > 0 ? ` (${(rate * 100).toFixed(1)}%)` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!income}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg text-sm transition-colors"
        >
          Calculate My Quarterly Tax
        </button>

        {result && (
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
            {/* Tax breakdown */}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Net Income</span>
              <span className="font-medium text-slate-900">{fmt(result.netIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Self-Employment Tax</span>
              <span className="font-medium text-slate-900">{fmt(result.selfEmploymentTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Federal Income Tax</span>
              <span className="font-medium text-slate-900">{fmt(result.estimatedFederalTax)}</span>
            </div>
            {result.stateTax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">State Tax ({STATE_TAX_RATES[stateCode]?.name})</span>
                <span className="font-medium text-slate-900">{fmt(result.stateTax)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Pay per quarter</span>
                <span className="text-2xl font-bold text-emerald-600">{fmt(result.quarterlyPayment)}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ~{result.effectiveRate.toFixed(1)}% effective rate · {fmt(result.totalAnnual)}/year total
              </p>
            </div>

            {/* Payment schedule */}
            <div className="border-t border-slate-200 pt-3 mt-1">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">2025 Payment Schedule</p>
              <div className="space-y-1.5">
                {QUARTERLY_DUE_DATES.map((q, i) => (
                  <div
                    key={q.quarter}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                      i === currentQuarter
                        ? "bg-emerald-50 border border-emerald-200"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${i === currentQuarter ? "text-emerald-700" : "text-slate-500"}`}>
                        {q.quarter}
                      </span>
                      <span className="text-slate-500">{q.period}</span>
                      {i === currentQuarter && (
                        <span className="text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">Now</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-900">{fmt(result.quarterlyPayment)}</span>
                      <span className="text-slate-400 ml-1">due {q.dueDate.split(",")[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign-up CTA */}
            <div className="mt-3 pt-3 border-t border-slate-100 bg-emerald-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
              <p className="text-xs text-slate-600 mb-2">
                <span className="font-medium text-slate-800">Track this year-round.</span> SoloFI automatically estimates your taxes as income changes.
              </p>
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2.5 rounded-lg transition-colors"
              >
                Try SoloFI free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuarterlyTaxCalculatorPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center border-b border-slate-100">
        <Link href="/">
          <span className="text-xl font-semibold text-slate-900 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-emerald-600">Solo</span>FI
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-slate-600 hover:text-slate-900 text-sm hidden sm:block">Pricing</Link>
          <Link href="/sign-in" className="text-slate-600 hover:text-slate-900 text-sm">Sign in</Link>
          <Link href="/sign-up" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero + Calculator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Free tool</p>
            <h1 className="text-3xl sm:text-4xl font-medium text-slate-900 mb-3 leading-tight">
              How much should you pay in quarterly taxes?
            </h1>
            <p className="text-slate-600 leading-relaxed mb-5">
              Most self-employed professionals either overpay and lose liquidity, or underpay and get hit with penalties. Get your full estimate in seconds.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Federal + self-employment tax included",
                "State tax breakdown included",
                "Accounts for your business expenses",
                "2025 quarterly payment schedule",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Due dates */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">2025 Due Dates</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { q: "Q1", date: "Apr 15" },
                  { q: "Q2", date: "Jun 16" },
                  { q: "Q3", date: "Sep 15" },
                  { q: "Q4", date: "Jan 15, 2026" },
                ].map(({ q, date }) => (
                  <div key={q} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">{q}</span>
                    <span className="text-xs text-slate-700 font-medium">{date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Calculator */}
          <div>
            <QuarterlyTaxCalc />
          </div>
        </div>
      </section>

      {/* Safe Harbor Explainer */}
      <section className="bg-slate-50 border-y border-slate-200 py-12 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
              <Shield className="h-3.5 w-3.5" />
              IRS Safe Harbor Rules
            </div>
            <h2 className="text-2xl font-medium text-slate-900 mb-3">
              You&apos;re protected from penalties if you pay the lower of:
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-3xl font-bold text-emerald-600 mb-2">90%</div>
              <p className="text-sm font-medium text-slate-800 mb-1">Current year method</p>
              <p className="text-xs text-slate-500">Pay 90% of what you&apos;ll owe this tax year. Requires estimating your current income.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%<span className="text-base font-medium text-slate-500"> / 110%</span></div>
              <p className="text-sm font-medium text-slate-800 mb-1">Prior year method</p>
              <p className="text-xs text-slate-500">Pay 100% of last year&apos;s tax (110% if AGI &gt; $150K). No estimation needed — the safest approach.</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">Source: IRS Publication 505</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-medium text-slate-900 mb-6">Common questions</h2>
        <div className="space-y-5">
          {[
            {
              q: "When are quarterly estimated taxes due?",
              a: "Q1: April 15 · Q2: June 16 · Q3: September 15 · Q4: January 15 of the following year. Note Q4 is not December 31.",
            },
            {
              q: "What if I miss a payment?",
              a: "If you meet safe harbor requirements (90% current year OR 100%/110% prior year), there are no underpayment penalties. If you miss, the IRS charges interest (~8% annually) on the shortfall.",
            },
            {
              q: "Can I use prior year method even if my income went up a lot?",
              a: "Yes. That's the key advantage. Even if your income doubled, you can base payments on last year's tax and settle up at filing. No penalties.",
            },
            {
              q: "Does this work for S-Corps and sole proprietors?",
              a: "Yes. Safe harbor rules apply to all individual tax returns regardless of business structure.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-slate-100 pb-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 py-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-medium text-white mb-3">
            Ready to stop guessing?
          </h2>
          <p className="text-emerald-100 mb-6 text-sm leading-relaxed">
            SoloFI gives you quarterly tax tracking, Safe Harbor calculations, and your full financial picture in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-medium px-5 py-3 rounded-lg text-sm hover:bg-emerald-50 transition-colors"
            >
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <span>© 2026 SoloFI</span>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-slate-700">About</Link>
              <Link href="/contact" className="hover:text-slate-700">Contact</Link>
              <Link href="/blog" className="hover:text-slate-700">Resources</Link>
              <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
