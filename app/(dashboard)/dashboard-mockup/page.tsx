"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Plus,
  Calculator,
  Target,
  Sparkles,
  ArrowRight,
  DollarSign,
  BarChart3,
} from "lucide-react";

/**
 * MINIMAL DASHBOARD MOCKUP
 *
 * This is a simplified version showing what a cleaner dashboard could look like.
 * Compare this to the current dashboard to see the difference in information hierarchy.
 *
 * Key differences:
 * 1. Single primary action above the fold
 * 2. Clear visual hierarchy (hero → supporting → actions)
 * 3. Reduced cognitive load (3 sections vs 15)
 * 4. Upgrade prompt only appears when contextually relevant
 */

export default function DashboardMockup() {
  // Simulate whether user has data
  const hasData = false; // Toggle this to see both states
  const isPro = false;

  // ========================================
  // EMPTY STATE - First Visit
  // ========================================
  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-medium text-slate-900 mb-3">
              Welcome to Solofi
            </h1>
            <p className="text-lg text-slate-600">
              Track your net worth. Build wealth with clarity.
            </p>
          </div>

          {/* Hero CTA Card */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-lg mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-medium text-slate-900 mb-3">
                Start tracking your net worth
              </h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Add your first entry to see how your wealth changes over time.
                Takes 2 minutes.
              </p>
              <Link href="/net-worth">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Entry
                </Button>
              </Link>
              <p className="text-sm text-slate-500 mt-4">
                Track stocks, bonds, cash, real estate, and debts
              </p>
            </CardContent>
          </Card>

          {/* What You'll Get */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              What you'll get
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-slate-200">
                <CardContent className="pt-6 pb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2">See trends clearly</h4>
                  <p className="text-sm text-slate-600">
                    Visualize your wealth trajectory. Monthly tracking shows what's working.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="pt-6 pb-6">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                    <Calculator className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2">Optimize taxes</h4>
                  <p className="text-sm text-slate-600">
                    Calculate S-Corp savings, deductions, and quarterly estimates.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="pt-6 pb-6">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2">Plan FI timeline</h4>
                  <p className="text-sm text-slate-600">
                    See exactly when you hit financial independence based on current trajectory.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Alternative: Google Sheets */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 mb-1">
                    Already tracking in Google Sheets?
                  </h4>
                  <p className="text-sm text-slate-600">
                    Connect your spreadsheet for automatic sync instead of manual entry.
                  </p>
                </div>
                <Link href="/settings">
                  <Button variant="outline" className="whitespace-nowrap">
                    Connect Sheets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ========================================
  // WITH DATA - Active User (Minimal Version)
  // ========================================
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-medium text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Last updated: Dec 2025</p>
          </div>
          <Link href="/net-worth">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </Link>
        </div>

        {/* Primary Stats - Only 3 */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                Net Worth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-slate-900 font-mono mb-1">
                $487,340
              </div>
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +$12,450 this month (+2.6%)
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                FI Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-slate-900 font-mono mb-2">
                64%
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[64%]" />
              </div>
              <p className="text-sm text-slate-600 mt-2">~4.2 years to FI</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                This Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-emerald-600 font-mono mb-1">
                +$89,200
              </div>
              <p className="text-sm text-slate-600">
                YTD growth (+22.4%)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Net Worth Chart - Primary Visual */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Net Worth Over Time</CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              The trend matters more than the absolute number. You're looking for consistent upward progress.
            </p>
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart */}
            <div className="h-80 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
              <p className="text-slate-400">[Chart visualization goes here]</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Best Action - Single Focus */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Target className="h-5 w-5 text-emerald-600" />
              Next Best Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calculator className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 mb-1">
                  Should you elect S-Corp status?
                </h4>
                <p className="text-sm text-slate-600 mb-3">
                  At your income level ($180K+), an S-Corp could save you $8,000+ in self-employment taxes this year.
                </p>
                <Link href="/tax-optimization">
                  <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    Calculate Savings
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tools - Consolidated */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
            Quick Tools
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/tax-calculator">
              <Card className="border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Calculator className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="font-medium text-slate-900">Tax Calculator</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/portfolio-optimizer">
              <Card className="border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="font-medium text-slate-900">Portfolio Optimizer</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/retirement">
              <Card className="border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="font-medium text-slate-900">Retirement Planner</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/geo-arbitrage">
              <Card className="border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="font-medium text-slate-900">Geo Arbitrage</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Contextual Upgrade - Only if free user tries to use Pro feature */}
        {!isPro && (
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 mb-1">
                    Unlock advanced modeling
                  </h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Pro gives you S-Corp analysis, Monte Carlo simulations, portfolio optimization, and Roth conversion planning. $29/month.
                  </p>
                  <Link href="/pricing">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      View Pro Features
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
