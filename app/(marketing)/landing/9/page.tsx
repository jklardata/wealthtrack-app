"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calculator } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";
import { analytics } from "@/lib/analytics";

// Style 9: Calculator-First - Interactive tool upfront
// Note: metadata cannot be exported from client components

const VARIANT = "landing_9_calculator";

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
}

export default function Landing9() {
  const [portfolio, setPortfolio] = useState(500000);
  const [expenses, setExpenses] = useState(80000);
  const [savings, setSavings] = useState(50000);
  const [returns, setReturns] = useState(7);

  const fiNumber = expenses * 25;
  const coverage = (portfolio / fiNumber) * 100;

  // Years to FI calculation
  const r = returns / 100;
  const yearsToFI = portfolio >= fiNumber
    ? 0
    : Math.log((fiNumber * r + savings) / (portfolio * r + savings)) / Math.log(1 + r);

  const taxSavings = Math.min(70000, savings * 0.9) * 0.32; // Rough estimate

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-xl font-bold text-gray-900">SoloFI</span>
        <TrackedLink
          href="/dashboard"
          trackingAction="sign_in"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ variant: "outline" }}
        >
          Sign In
        </TrackedLink>
      </nav>

      {/* Hero with Calculator */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Calculator className="h-4 w-4" />
            Free FI Calculator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            When can you retire?
          </h1>
          <p className="text-xl text-gray-600">
            Try our calculator and find out in 30 seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Calculator Inputs */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 space-y-8">
              <h2 className="text-xl font-semibold text-gray-900">Your Numbers</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Current Portfolio</Label>
                    <span className="font-medium text-blue-600">{formatCurrency(portfolio)}</span>
                  </div>
                  <Slider
                    value={[portfolio]}
                    onValueChange={([v]) => setPortfolio(v)}
                    min={0}
                    max={5000000}
                    step={10000}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Annual Expenses</Label>
                    <span className="font-medium text-blue-600">{formatCurrency(expenses)}</span>
                  </div>
                  <Slider
                    value={[expenses]}
                    onValueChange={([v]) => setExpenses(v)}
                    min={20000}
                    max={300000}
                    step={5000}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Annual Savings</Label>
                    <span className="font-medium text-blue-600">{formatCurrency(savings)}</span>
                  </div>
                  <Slider
                    value={[savings]}
                    onValueChange={([v]) => setSavings(v)}
                    min={0}
                    max={200000}
                    step={5000}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Expected Returns</Label>
                    <span className="font-medium text-blue-600">{returns}%</span>
                  </div>
                  <Slider
                    value={[returns]}
                    onValueChange={([v]) => setReturns(v)}
                    min={3}
                    max={12}
                    step={0.5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <Card className="bg-gray-900 text-white">
              <CardContent className="p-8">
                <h2 className="text-lg text-gray-400 mb-6">Your Results</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm">FI Number</p>
                    <p className="text-3xl font-bold">{formatCurrency(fiNumber)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Progress</p>
                    <p className="text-3xl font-bold">{coverage.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Years to FI</p>
                    <p className="text-3xl font-bold text-green-400">
                      {yearsToFI <= 0 ? "Done!" : `${yearsToFI.toFixed(1)} yrs`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Est. Tax Savings</p>
                    <p className="text-3xl font-bold text-amber-400">{formatCurrency(taxSavings)}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress to FI</span>
                    <span>{coverage.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                      style={{ width: `${Math.min(coverage, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Want the full picture?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Create a free account to see Monte Carlo simulations, tax optimization,
                  retirement scenarios, and more.
                </p>
                <TrackedLink
                  href="/dashboard"
                  trackingAction="get_started"
                  trackingLocation="hero"
                  trackingVariant={VARIANT}
                  buttonProps={{ className: "w-full bg-white text-blue-600 hover:bg-blue-50" }}
                >
                  Get Full Analysis Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </TrackedLink>
              </CardContent>
            </Card>

            <p className="text-sm text-gray-500 text-center">
              Formula: FI Number = Expenses × 25 (based on 4% withdrawal rate)
            </p>
          </div>
        </div>
      </section>

      {/* Features below */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          The full platform includes
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Net Worth Tracking</h3>
            <p className="text-gray-600 text-sm">Track all accounts in one dashboard</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Tax Optimization</h3>
            <p className="text-gray-600 text-sm">Maximize Solo 401k, SEP IRA, HSA</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎲</div>
            <h3 className="font-semibold text-gray-900 mb-2">Monte Carlo</h3>
            <p className="text-gray-600 text-sm">1,000 simulation scenarios</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for the complete picture?
          </h2>
          <p className="text-gray-400 mb-8">
            Free to start. No credit card required.
          </p>
          <TrackedLink
            href="/dashboard"
            trackingAction="create_account"
            trackingLocation="cta_section"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", variant: "secondary" }}
          >
            Create Free Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
