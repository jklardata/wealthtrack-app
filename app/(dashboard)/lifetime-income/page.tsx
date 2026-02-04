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
  const [longevityAge, setLongevityAge] = useState("95");

  const [projection, setProjection] = useState<ProjectionPoint[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Fetch latest net worth entry to pre-populate
  useEffect(() => {
    if (isPro) {
      fetchLatestNetWorth();
    }
  }, [isPro]);

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

  if (!isPro) {
    return (
      <LockedModule
        title="Projected Net Worth"
        description="Model your lifetime income from all sources and project your net worth trajectory"
        icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
        benefits={[
          "Track multiple income sources (work, social security, passive, windfalls)",
          "Model age-dependent expenses (medical, Medicare)",
          "Year-by-year portfolio projections with charts",
          "Social Security benefit estimation",
          "Portfolio depletion warnings and peak net worth analysis"
        ]}
      />
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
        <p className="text-slate-600 mt-2">
          View your lifetime net worth trajectory based on your income and expenses
        </p>
      </div>

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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="current_age">Age *</Label>
              <AgeInput
                id="current_age"
                value={currentAge || undefined}
                onChange={(ageMonths) => setCurrentAge(ageMonths)}
              />
            </div>
            <div>
              <Label htmlFor="current_net_worth">Current Net Worth *</Label>
              <Input
                id="current_net_worth"
                type="number"
                placeholder="500000"
                value={currentNetWorth}
                onChange={(e) => setCurrentNetWorth(e.target.value)}
              />
            </div>
            <div>
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
            <div>
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
            <div>
              <Label htmlFor="longevity_age">Project to Age</Label>
              <Input
                id="longevity_age"
                type="number"
                placeholder="95"
                value={longevityAge}
                onChange={(e) => setLongevityAge(e.target.value)}
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

      {/* Results Summary */}
      {hasCalculated && <ProjectionSummary projection={projection} />}

      {/* Projection Chart */}
      <ProjectionChart projection={projection} />

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
    </div>
  );
}
