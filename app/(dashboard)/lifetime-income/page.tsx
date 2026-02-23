"use client";

import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AgeInput } from "@/components/ui/age-input";
import { ProjectionChart } from "./components/ProjectionChart";
import { ProjectionSummary } from "./components/ProjectionSummary";
import { TrendingUp, Calculator, RefreshCw, Settings as SettingsIcon, DollarSign } from "lucide-react";
import Link from "next/link";
import type { ProjectionPoint } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function LifetimeIncomePage() {
  const { isPro, isLoading: subLoading } = useSubscription();
  const [currentAge, setCurrentAge] = useState<number | null>(null);
  const [currentNetWorth, setCurrentNetWorth] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("7");
  const [inflationRate, setInflationRate] = useState("3");
  const [longevityAge, setLongevityAge] = useState("65");

  const [projection, setProjection] = useState<ProjectionPoint[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [incomeSources, setIncomeSources] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  // Fetch latest net worth entry and user settings to pre-populate
  useEffect(() => {
    fetchLatestNetWorth();
    fetchUserSettings();
    fetchIncomeSources();
    fetchExpenses();
  }, []);

  const fetchIncomeSources = async () => {
    try {
      const response = await fetch("/api/income-sources");
      const data = await response.json();
      if (response.ok) {
        setIncomeSources(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching income sources:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      if (response.ok) {
        setExpenses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchLatestNetWorth = async () => {
    try {
      const response = await fetch("/api/net-worth");
      const data = await response.json();
      if (response.ok && data.data && data.data.length > 0) {
        const latest = data.data[0];
        setCurrentNetWorth(Math.round(latest.net_worth).toString());
      }
    } catch (error) {
      console.error("Error fetching net worth:", error);
    }
  };

  const fetchUserSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (response.ok && data.data) {
        if (data.data.current_age) {
          setCurrentAge(data.data.current_age);
        }
        // Pre-populate longevity age from life expectancy assumption
        if (data.data.life_expectancy_assumption) {
          setLongevityAge(data.data.life_expectancy_assumption.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const calculateProjection = async () => {
    if (!currentAge || !currentNetWorth || !expectedReturn || !inflationRate) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCalculating(true);
    try {
      const response = await fetch("/api/projected-net-worth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAge: currentAge,
          currentNetWorth: parseFloat(currentNetWorth),
          expectedReturn: parseFloat(expectedReturn) / 100,
          inflationRate: parseFloat(inflationRate) / 100,
          longevityAge: parseInt(longevityAge),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setProjection(data.projection);
        setHasCalculated(true);
      } else {
        alert(data.error || "Failed to calculate projection");
      }
    } catch (error) {
      console.error("Error calculating projection:", error);
      alert("Error calculating projection");
    } finally {
      setIsCalculating(false);
    }
  };

  if (subLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-12 w-full sm:w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span>Trajectory</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Model your complete financial future by combining all income sources with expenses to project your lifetime net worth trajectory
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/profile">
            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              <DollarSign className="h-4 w-4 mr-2" />
              Update Income & Expenses
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Explanation Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200">
        <CardContent className="py-6">
          <h3 className="font-semibold text-slate-900 mb-3">How This Works</h3>
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              This tool creates a comprehensive financial projection by integrating <span className="font-medium">all your income sources</span> (work, social security, passive income, windfalls) with <span className="font-medium">your expenses</span> over your lifetime.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/60 p-3 rounded-lg">
                <p className="font-medium text-slate-900 mb-1">📊 Income Sources</p>
                <p className="text-xs">Configure work income, social security benefits, passive income streams, and one-time windfalls in your Profile</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg">
                <p className="font-medium text-slate-900 mb-1">💰 Expenses</p>
                <p className="text-xs">Set recurring expenses, medical costs, Medicare, and age-specific one-time expenses to model your spending</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg">
                <p className="font-medium text-slate-900 mb-1">📈 Projection</p>
                <p className="text-xs">See year-by-year portfolio growth accounting for contributions, withdrawals, investment returns, and inflation</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3">
              The projection shows how your net worth evolves as income sources turn on and off at different ages, while accounting for inflation and investment growth.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA Banner when no data */}
      {(!currentNetWorth || incomeSources.length === 0 || expenses.length === 0) && (
        <Card className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border-2 border-emerald-300">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  🚀 Get Started with Your Net Worth Projection
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  To create an accurate lifetime projection, you need to:
                </p>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  {!currentNetWorth && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 font-bold">1.</span>
                      <div>
                        <p className="font-medium text-slate-900">Add Net Worth Data</p>
                        <p className="text-xs text-slate-600">Track your assets and debts</p>
                      </div>
                    </div>
                  )}
                  {(incomeSources.length === 0 || expenses.length === 0) && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 font-bold">2.</span>
                      <div>
                        <p className="font-medium text-slate-900">Configure Income & Expenses</p>
                        <p className="text-xs text-slate-600">Add all your income sources and monthly expenses</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {!currentNetWorth && (
                    <Link href="/net-worth">
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Add Net Worth Entry
                      </Button>
                    </Link>
                  )}
                  {(incomeSources.length === 0 || expenses.length === 0) && (
                    <Link href="/profile">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Update Profile
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculation Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-black">
            <Calculator className="h-5 w-5 text-slate-600" />
            <span>Projection Parameters</span>
          </CardTitle>
          <CardDescription className="text-sm">Set your current situation and assumptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_age">Age *</Label>
              <AgeInput
                id="current_age"
                value={currentAge || undefined}
                onChange={(ageMonths) => setCurrentAge(ageMonths)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longevity_age">Project to Age *</Label>
              <Input
                id="longevity_age"
                type="number"
                placeholder="95"
                value={longevityAge}
                onChange={(e) => setLongevityAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_net_worth">Current Net Worth *</Label>
              <Input
                id="current_net_worth"
                type="number"
                placeholder="500000"
                value={currentNetWorth}
                onChange={(e) => setCurrentNetWorth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_return">Expected Return (%)</Label>
              <Input
                id="expected_return"
                type="number"
                step="0.1"
                placeholder="7.0"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="inflation_rate">Inflation Rate (%)</Label>
              <Input
                id="inflation_rate"
                type="number"
                step="0.1"
                placeholder="3.0"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={calculateProjection}
              disabled={isCalculating}
              className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Projection
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary - Pro Only */}
      {isPro ? (
        <>
          {hasCalculated && <ProjectionSummary projection={projection} />}
          {hasCalculated && projection.length > 0 && (
            <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-black">
                  <span>💼 Financial Advisor Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {(() => {
                  const finalValue = projection[projection.length - 1]?.portfolioValue || 0;
                  const peakEntry = projection.reduce((max, entry) =>
                    entry.portfolioValue > max.portfolioValue ? entry : max, projection[0]
                  );
                  const peakAge = peakEntry?.age || 0;
                  const peakValue = peakEntry?.portfolioValue || 0;
                  const depletionAge = projection.find(p => p.portfolioValue <= 0)?.age;
                  const currentValue = parseFloat(currentNetWorth) || 0;
                  const totalGrowth = finalValue - currentValue;
                  const averageAnnualGrowth = totalGrowth / (projection.length || 1);

                  return (
                    <div className="space-y-4">
                      {/* Overall Assessment */}
                      <div className="p-4 bg-white/60 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">📊 Overall Financial Picture</h4>
                        {depletionAge ? (
                          <div className="space-y-2">
                            <p className="text-red-700 font-medium">
                              ⚠️ Portfolio Depletion Warning: Your assets are projected to run out around age {depletionAge}.
                            </p>
                            <p className="text-slate-700">
                              This is a critical finding. At your current spending and income levels, you're withdrawing more than your portfolio can sustain. You have three levers to pull: increase income, reduce expenses, or delay major expenditures. The earlier you act, the less drastic the changes need to be.
                            </p>
                          </div>
                        ) : finalValue < currentValue * 0.5 ? (
                          <div className="space-y-2">
                            <p className="text-amber-700 font-medium">
                              ⚠️ Declining Trajectory: Your portfolio is projected to decline significantly by age {parseInt(longevityAge)}.
                            </p>
                            <p className="text-slate-700">
                              While you're not running out of money, your net worth is heading in the wrong direction. This often happens when retirement spending exceeds the sustainable withdrawal rate. Consider adjusting your assumptions—either increase income sources, reduce planned expenses, or revisit your return expectations.
                            </p>
                          </div>
                        ) : finalValue > currentValue * 2 ? (
                          <div className="space-y-2">
                            <p className="text-emerald-700 font-medium">
                              ✅ Strong Growth Trajectory: Your portfolio is projected to more than double to {formatCurrency(finalValue)} by age {parseInt(longevityAge)}.
                            </p>
                            <p className="text-slate-700">
                              This is an excellent position. Your income exceeds your expenses by enough that compound growth does the heavy lifting. You're building real wealth, not just maintaining it. This gives you optionality—you can retire earlier, increase lifestyle spending, or leave a larger legacy.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-blue-700 font-medium">
                              ✓ Stable Financial Path: Your portfolio maintains positive growth to {formatCurrency(finalValue)} by age {parseInt(longevityAge)}.
                            </p>
                            <p className="text-slate-700">
                              You're on a sustainable path. Your income and investment returns are keeping pace with expenses and inflation. This is solid financial planning—nothing flashy, but you're building security. Continue monitoring and adjusting as life circumstances change.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Key Milestones */}
                      <div className="p-4 bg-white/60 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">🎯 Key Milestones</h4>
                        <div className="space-y-2 text-slate-700">
                          <p>
                            <span className="font-medium">Peak Net Worth:</span> {formatCurrency(peakValue)} around age {peakAge}
                          </p>
                          {peakAge < parseInt(longevityAge) && (
                            <p className="text-slate-600 text-xs mt-1">
                              Your portfolio peaks at age {peakAge}, then begins drawing down. This is normal in retirement—you're converting assets into lifestyle. The question is whether the drawdown rate is sustainable through age {longevityAge}.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* What This Means For You */}
                      <div className="p-4 bg-white/60 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">💡 What This Means For You</h4>
                        <div className="space-y-2 text-slate-700">
                          {averageAnnualGrowth > 50000 ? (
                            <p>
                              You're adding roughly {formatCurrency(averageAnnualGrowth)} to your net worth annually on average. That's strong momentum. The key is maintaining this pace—make sure your income sources are reliable and your expense assumptions are realistic. Life has a way of costing more than spreadsheets predict.
                            </p>
                          ) : averageAnnualGrowth > 0 ? (
                            <p>
                              Your net worth is growing at about {formatCurrency(averageAnnualGrowth)} per year on average. It's positive, which is good, but modest. Small changes to income or expenses can have outsized impacts on your long-term trajectory. Run a few scenarios—what if you earn 10% more? Spend 10% less? The math might surprise you.
                            </p>
                          ) : (
                            <p>
                              Your portfolio is declining at roughly {formatCurrency(Math.abs(averageAnnualGrowth))} annually. This isn't sustainable indefinitely. Think of your net worth as your financial runway—how long before you run out? Use this projection as a wake-up call to make proactive changes while you still have time and options.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Items */}
                      <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-lg">
                        <h4 className="font-semibold text-emerald-900 mb-2">🚀 Recommended Actions</h4>
                        <ul className="space-y-1 text-emerald-900 text-xs">
                          <li>• Review your income sources in Profile—are they realistic and complete?</li>
                          <li>• Stress-test your assumptions: What if returns are 2% lower? Expenses 20% higher?</li>
                          <li>• Check that Social Security is included if you'll be eligible</li>
                          <li>• Model different scenarios: early retirement, part-time work, geographic arbitrage</li>
                          <li>• Update this projection annually as circumstances change</li>
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
          <ProjectionChart
            projection={projection}
            expectedReturn={parseFloat(expectedReturn)}
            incomeSources={incomeSources}
            expenses={expenses}
          />
        </>
      ) : (
        <LockedModule
          title="Net Worth Projection Graphs"
          description="View detailed charts and analysis of your lifetime net worth trajectory"
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          benefits={[
            "Year-by-year portfolio value visualization",
            "Income vs expenses stacked charts",
            "Net cash flow analysis",
            "Portfolio depletion warnings",
            "Peak net worth insights"
          ]}
        />
      )}

      {/* Instructions */}
      {!hasCalculated && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl font-black text-blue-900">How to Use This Tool</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 space-y-2">
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to your <Link href="/profile" className="underline font-medium">Profile</Link> to add income sources and expenses</li>
              <li>Enter your current age and net worth in the parameters above</li>
              <li>Click "Calculate Projection" to see your lifetime net worth trajectory</li>
              <li>Adjust assumptions and modify income/expenses to model different scenarios</li>
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      {hasCalculated && (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-900 flex items-center gap-2 text-lg sm:text-xl">
              <span>💡 Tips to Strengthen Your Projection</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-emerald-800 space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/60 p-3 rounded-lg">
                <p className="font-medium text-emerald-900 mb-2">📊 Add More Income Sources</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Include all expected work income with start/stop ages</li>
                  <li>Add Social Security benefits (use auto-estimate or manual entry)</li>
                  <li>Don't forget passive income: rentals, dividends, side businesses</li>
                  <li>Include one-time windfalls: inheritance, bonuses, property sales</li>
                </ul>
              </div>
              <div className="bg-white/60 p-3 rounded-lg">
                <p className="font-medium text-emerald-900 mb-2">💰 Refine Your Expenses</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Break down recurring expenses by category for accuracy</li>
                  <li>Add age ranges for expenses that start/stop at specific ages</li>
                  <li>Include healthcare costs (medical pre-65, Medicare 65+)</li>
                  <li>Model one-time expenses: home purchases, college tuition, travel</li>
                </ul>
              </div>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="font-medium text-emerald-900 mb-2">🎯 Use the Data Table</p>
              <p className="text-xs">
                Scroll to the <span className="font-medium">Year-by-Year Projection Data</span> table below to see exactly which income sources and expenses contribute to each year's numbers.
                Download the CSV to analyze trends, share with advisors, or track changes over time.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
