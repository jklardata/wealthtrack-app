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
        setCurrentNetWorth(latest.net_worth.toString());
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
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-emerald-600" />
          Net Worth Projected
        </h1>
        <p className="text-slate-600 mt-3 text-base">
          Model your complete financial future by combining all income sources with expenses to project your lifetime net worth trajectory
        </p>
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

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/profile">
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <DollarSign className="h-4 w-4 mr-2" />
            Modify Income
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Modify Expenses
          </Button>
        </Link>
      </div>

      {/* Calculation Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-slate-600" />
            Projection Parameters
          </CardTitle>
          <CardDescription>Set your current situation and assumptions</CardDescription>
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
              className="bg-emerald-600 hover:bg-emerald-700"
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
            <CardTitle className="text-blue-900">How to Use This Tool</CardTitle>
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
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              💡 Tips to Strengthen Your Projection
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
