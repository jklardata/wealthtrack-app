"use client";

import { useEffect, useState, useMemo } from "react";
import { ProFeatureGate } from "@/components/pro-feature-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GitCompare, DollarSign, Info, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CITIES, DEFAULT_WEIGHTS } from "@/lib/col-data";
import { calculateEffectiveCOL, calculateYearsToRetirement } from "@/lib/retirement-calculator";
import { generateInsightText, calculateGeoFIScore, calculateSavingsRate } from "@/lib/scenario-calculator";
import { MoveVsStayComparison } from "@/components/bridges/MoveVsStayComparison";
import { InsightCallout } from "@/components/bridges/InsightCallout";
import type { Scenario, ScenarioComparison, SpendingWeights } from "@/lib/types";
import type { NetWorthEntry } from "@/lib/types";

export default function ComparePage() {
  // User inputs
  const [currentCityId, setCurrentCityId] = useState("nyc");
  const [targetCityId, setTargetCityId] = useState("austin");
  const [grossIncome, setGrossIncome] = useState(150000);
  const [baselineAnnualSpend, setBaselineAnnualSpend] = useState(75000);
  const [currentNetWorth, setCurrentNetWorth] = useState(100000);
  const [withdrawalRate] = useState(0.04);
  const [expectedReturn] = useState(0.05);
  const [weights] = useState<SpendingWeights>(DEFAULT_WEIGHTS);

  // Data state
  const [netWorthEntries, setNetWorthEntries] = useState<NetWorthEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch net worth data to pre-populate inputs
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/net-worth");
        if (response.ok) {
          const data = await response.json();
          setNetWorthEntries(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Pre-populate inputs from net worth data
  useEffect(() => {
    if (netWorthEntries.length === 0) return;

    const sorted = [...netWorthEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latest = sorted[0];
    if (latest) {
      if (latest.net_worth && latest.net_worth > 0) {
        setCurrentNetWorth(latest.net_worth);
      }
      if (latest.pre_tax_income && latest.pre_tax_income > 0) {
        setGrossIncome(latest.pre_tax_income * 12);
      }
      if (latest.monthly_expenses && latest.monthly_expenses > 0) {
        setBaselineAnnualSpend(latest.monthly_expenses * 12);
      }
    }
  }, [netWorthEntries]);

  // Calculate comparison
  const comparison = useMemo(() => {
    const currentCity = CITIES.find((c) => c.city_id === currentCityId);
    const targetCity = CITIES.find((c) => c.city_id === targetCityId);
    if (!currentCity || !targetCity || currentCityId === targetCityId) return null;

    // Calculate COL for both cities
    const currentCOL = calculateEffectiveCOL(currentCity, weights);
    const targetCOL = calculateEffectiveCOL(targetCity, weights);

    // Calculate adjusted expenses
    const currentExpenses = baselineAnnualSpend; // Baseline spend is for current city
    const targetExpenses = baselineAnnualSpend * (targetCOL / currentCOL);

    // Calculate savings
    const currentSavings = Math.max(0, grossIncome - currentExpenses);
    const targetSavings = Math.max(0, grossIncome - targetExpenses);

    // Calculate required net worth
    const currentRequiredNW = currentExpenses / withdrawalRate;
    const targetRequiredNW = targetExpenses / withdrawalRate;

    // Calculate years to FI
    const currentYearsToFI = calculateYearsToRetirement(
      currentNetWorth,
      currentRequiredNW,
      currentSavings,
      expectedReturn
    );
    const targetYearsToFI = calculateYearsToRetirement(
      currentNetWorth,
      targetRequiredNW,
      targetSavings,
      expectedReturn
    );

    // Calculate savings rates
    const currentSavingsRate = calculateSavingsRate(grossIncome, currentExpenses);
    const targetSavingsRate = calculateSavingsRate(grossIncome, targetExpenses);

    // Calculate FI scores
    const currentFIScore = calculateGeoFIScore(currentSavingsRate, 0.7, currentRequiredNW);
    const targetFIScore = calculateGeoFIScore(targetSavingsRate, 0.7, targetRequiredNW);

    // Build pseudo-scenario objects for the comparison component
    const baselineScenario: Scenario = {
      id: "baseline",
      user_id: "",
      name: `Stay in ${currentCity.city_name}`,
      description: null,
      is_baseline: true,
      is_active: false,
      location_city_id: currentCityId,
      location_city_name: currentCity.city_name,
      location_country: currentCity.country,
      effective_col_index: currentCOL,
      primary_income: grossIncome,
      consulting_income: 0,
      consulting_years: 0,
      consulting_tax_rate: 0.25,
      annual_expenses: currentExpenses,
      spending_weights: weights,
      withdrawal_rate: withdrawalRate,
      expected_return: expectedReturn,
      current_net_worth: currentNetWorth,
      annual_savings: currentSavings,
      annual_withdrawal_requirement: currentExpenses,
      required_net_worth: currentRequiredNW,
      years_to_fi: currentYearsToFI,
      savings_rate: currentSavingsRate,
      fi_score: currentFIScore.score,
      risk_tolerance: null,
      time_horizon: null,
      cloned_from_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const compareScenario: Scenario = {
      id: "compare",
      user_id: "",
      name: `Move to ${targetCity.city_name}`,
      description: null,
      is_baseline: false,
      is_active: true,
      location_city_id: targetCityId,
      location_city_name: targetCity.city_name,
      location_country: targetCity.country,
      effective_col_index: targetCOL,
      primary_income: grossIncome,
      consulting_income: 0,
      consulting_years: 0,
      consulting_tax_rate: 0.25,
      annual_expenses: targetExpenses,
      spending_weights: weights,
      withdrawal_rate: withdrawalRate,
      expected_return: expectedReturn,
      current_net_worth: currentNetWorth,
      annual_savings: targetSavings,
      annual_withdrawal_requirement: targetExpenses,
      required_net_worth: targetRequiredNW,
      years_to_fi: targetYearsToFI,
      savings_rate: targetSavingsRate,
      fi_score: targetFIScore.score,
      risk_tolerance: null,
      time_horizon: null,
      cloned_from_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Generate insight text
    const deltaYears = targetYearsToFI - currentYearsToFI;
    const deltaRequiredNW = targetRequiredNW - currentRequiredNW;
    const deltaExpenses = targetExpenses - currentExpenses;
    const insightText = generateInsightText(
      deltaYears,
      deltaRequiredNW,
      deltaExpenses,
      currentCity.city_name,
      targetCity.city_name
    );

    const comparisonResult: ScenarioComparison = {
      id: "temp",
      user_id: "",
      baseline_scenario_id: "baseline",
      compare_scenario_id: "compare",
      baseline: baselineScenario,
      compare: compareScenario,
      delta_years_to_fi: deltaYears,
      delta_required_net_worth: deltaRequiredNW,
      delta_annual_expenses: deltaExpenses,
      delta_savings_rate: targetSavingsRate - currentSavingsRate,
      delta_fi_score: targetFIScore.score - currentFIScore.score,
      semi_retirement_feasible: false,
      consulting_covers_percentage: 0,
      insight_text: insightText,
      created_at: new Date().toISOString(),
    };

    return comparisonResult;
  }, [
    currentCityId,
    targetCityId,
    grossIncome,
    baselineAnnualSpend,
    currentNetWorth,
    withdrawalRate,
    expectedReturn,
    weights,
  ]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <ProFeatureGate
      featureName="Scenario Comparison"
      description="Compare multiple retirement scenarios side-by-side with location-based adjustments."
      benefits={[
        "Side-by-side scenario comparison",
        "Location impact analysis",
        "Years to FI delta calculations",
        "Required net worth comparisons",
        "Cost-of-living adjustments",
        "Savings rate optimization"
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
          <GitCompare className="h-7 w-7 text-primary" />
          Move vs Stay Comparison
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Compare two cities side-by-side to see how relocation affects your path to financial independence.
        </p>
      </div>

      {/* How It Works */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">How This Works</h3>
              <p className="text-sm text-muted-foreground">
                This tool calculates how your financial independence timeline changes based on
                cost-of-living differences between cities. A lower cost city means you need
                less money to retire and can save more each year—both factors accelerate your
                path to FI.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Current City (Stay) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Current City (Stay)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Where you currently live. Your spending is based on this city.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={currentCityId} onValueChange={setCurrentCityId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.city_id} value={city.city_id}>
                      {city.city_name}, {city.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Target City (Move) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Target City (Move)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        The city you're considering moving to. Your spending will be adjusted
                        based on its cost of living.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={targetCityId} onValueChange={setTargetCityId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.filter((c) => c.city_id !== currentCityId).map((city) => (
                    <SelectItem key={city.city_id} value={city.city_id}>
                      {city.city_name}, {city.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gross Income */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Gross Annual Income
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(parseFloat(e.target.value) || 0)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Annual Spending */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Current Annual Spending
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={baselineAnnualSpend}
                  onChange={(e) => setBaselineAnnualSpend(parseFloat(e.target.value) || 0)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Net Worth */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Current Net Worth
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={currentNetWorth}
                  onChange={(e) => setCurrentNetWorth(parseFloat(e.target.value) || 0)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparison && currentCityId !== targetCityId ? (
        <MoveVsStayComparison comparison={comparison} />
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6 text-center text-muted-foreground">
            Select two different cities to compare your options.
          </CardContent>
        </Card>
      )}

      {/* Methodology Note */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2">How We Calculate This</h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Cost of Living Index:</strong> Weighted average of housing (35%), food (15%),
              transport (10%), healthcare (10%), utilities (10%), and lifestyle (20%). NYC = 100.
            </p>
            <p>
              <strong>Adjusted Spending:</strong> Your current spending scaled by the relative
              cost of living. If a city has a 50% lower COL, your spending decreases proportionally.
            </p>
            <p>
              <strong>Years to FI:</strong> Uses a {(expectedReturn * 100).toFixed(0)}% real return rate
              and {(withdrawalRate * 100).toFixed(0)}% safe withdrawal rate to calculate when your
              portfolio can sustain your spending indefinitely.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </ProFeatureGate>
  );
}
