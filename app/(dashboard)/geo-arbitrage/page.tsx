"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Globe,
  TrendingUp,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { CITIES, DEFAULT_WEIGHTS, type CityData } from "@/lib/col-data";
import {
  calculateEffectiveCOL,
  calculateYearsToRetirement,
  type SpendingWeights,
} from "@/lib/retirement-calculator";
import type { NetWorthEntry } from "@/lib/types";

// ============================================================================
// TYPES
// ============================================================================

interface CityAnalysis {
  city: CityData;
  effectiveCOL: number;
  adjustedSpend: number;
  afterTaxSpend: number;
  annualSavings: number;
  savingsRate: number;
  requiredNW: number;
  yearsToFI: number;
  deltaYears: number; // vs baseline city
  meetsSavingsTarget: boolean;
  canAchieveFI: boolean; // false if negative savings
}

type SortField = "city" | "col" | "spend" | "savingsRate" | "yearsToFI" | "delta";
type SortDirection = "asc" | "desc";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return (value * 100).toFixed(0) + "%";
}

/**
 * Calculate after-tax spending adjustment
 * Tax index represents relative tax burden (NYC = 100)
 * Lower tax index = lower taxes = more spendable income
 *
 * This is a simplified model: we adjust the effective spending
 * based on the tax differential. A city with tax_index = 50
 * means roughly half the tax burden, translating to more
 * disposable income.
 */
function calculateAfterTaxSpend(
  adjustedSpend: number,
  cityTaxIndex: number,
  baselineTaxIndex: number
): number {
  // Tax adjustment factor: how much more/less you pay in taxes
  // If city has lower taxes (tax_index < baseline), you keep more money
  // We model this as an adjustment to required spending
  const taxDifferential = (cityTaxIndex - baselineTaxIndex) / 100;

  // A 10% lower tax index translates to roughly 10% less gross income needed
  // to achieve the same after-tax spending. Simplified linear model.
  const taxMultiplier = 1 + (taxDifferential * 0.3); // 30% sensitivity to tax changes

  return adjustedSpend * Math.max(0.5, Math.min(1.5, taxMultiplier));
}

/**
 * Generate dynamic insight text based on city comparisons
 * Rules:
 * - Use plain language
 * - Avoid false precision (round to whole numbers)
 * - Highlight actionable findings
 */
function generateInsights(
  cities: CityAnalysis[],
  baselineCity: CityAnalysis | undefined,
  grossIncome: number,
  targetSavingsRate: number
): string[] {
  const insights: string[] = [];

  if (!baselineCity || cities.length === 0) {
    return insights;
  }

  // Find best city for savings rate
  const bestSavingsCity = cities
    .filter(c => c.canAchieveFI)
    .sort((a, b) => b.savingsRate - a.savingsRate)[0];

  // Find city that accelerates FI the most
  const bestFICity = cities
    .filter(c => c.canAchieveFI && c.deltaYears < 0)
    .sort((a, b) => a.deltaYears - b.deltaYears)[0];

  // Find cities where FI is not achievable
  const impossibleCities = cities.filter(c => !c.canAchieveFI);

  // Insight 1: Best savings opportunity
  if (bestSavingsCity && bestSavingsCity.city.city_id !== baselineCity.city.city_id) {
    const savingsRateDiff = bestSavingsCity.savingsRate - baselineCity.savingsRate;
    if (savingsRateDiff > 0.05) { // Only mention if >5% improvement
      insights.push(
        `${bestSavingsCity.city.city_name} offers a ${formatPercent(bestSavingsCity.savingsRate)} savings rate, ` +
        `${Math.round(savingsRateDiff * 100)} percentage points higher than ${baselineCity.city.city_name}.`
      );
    }
  }

  // Insight 2: FI acceleration
  if (bestFICity && Math.abs(bestFICity.deltaYears) >= 1) {
    insights.push(
      `Moving to ${bestFICity.city.city_name} could accelerate your financial independence by ~${Math.abs(Math.round(bestFICity.deltaYears))} years.`
    );
  }

  // Insight 3: Warning about high-cost cities
  if (impossibleCities.length > 0 && impossibleCities.some(c => c.city.city_id === baselineCity.city.city_id)) {
    const affordableCities = cities.filter(c => c.canAchieveFI).length;
    insights.push(
      `At current income, ${baselineCity.city.city_name} results in negative savings. ` +
      `Consider ${affordableCities} cities where you can achieve positive savings.`
    );
  }

  // Insight 4: Cities meeting target savings rate
  const meetingTarget = cities.filter(c => c.meetsSavingsTarget && c.canAchieveFI);
  if (meetingTarget.length > 0 && meetingTarget.length < cities.length / 2) {
    insights.push(
      `${meetingTarget.length} cities support your ${formatPercent(targetSavingsRate)} savings rate target, ` +
      `including ${meetingTarget.slice(0, 3).map(c => c.city.city_name).join(", ")}.`
    );
  }

  return insights.slice(0, 2); // Max 2 insights
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function GeoArbitragePage() {
  // Data state
  const [netWorthEntries, setNetWorthEntries] = useState<NetWorthEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // User inputs - local controls
  const [baselineCityId, setBaselineCityId] = useState("nyc");
  const [targetSavingsRate, setTargetSavingsRate] = useState(0.25);
  const [weights] = useState<SpendingWeights>(DEFAULT_WEIGHTS);

  // Global parameters (derived from data or defaults)
  const [grossIncome, setGrossIncome] = useState(150000);
  const [currentNetWorth, setCurrentNetWorth] = useState(100000);
  const [annualSavings, setAnnualSavings] = useState(50000);
  const [expectedReturn] = useState(0.05); // 5% real return
  const [withdrawalRate] = useState(0.04); // 4% SWR

  // UI state
  const [sortField, setSortField] = useState<SortField>("yearsToFI");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  // Fetch net worth data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/net-worth");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setNetWorthEntries(data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Derive global parameters from net worth data
  useEffect(() => {
    if (netWorthEntries.length === 0) return;

    // Sort by date descending
    const sorted = [...netWorthEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latest = sorted[0];
    if (latest) {
      // Use net worth directly from the entry
      const totalNW = latest.net_worth || 0;
      setCurrentNetWorth(totalNW);

      // Use pre_tax_income if available
      if (latest.pre_tax_income) {
        setGrossIncome(latest.pre_tax_income * 12); // Convert monthly to annual
      }

      // Estimate annual savings from data patterns
      if (sorted.length >= 2) {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const yearAgoEntry = sorted.find(
          (e) => new Date(e.date) <= oneYearAgo
        );

        if (yearAgoEntry) {
          const yearAgoNW = yearAgoEntry.net_worth || 0;

          // Estimate savings as change in NW (simplified - doesn't account for returns)
          const estimatedSavings = Math.max(0, totalNW - yearAgoNW);
          setAnnualSavings(estimatedSavings);

          // If we didn't get income from entry, estimate from savings
          if (!latest.pre_tax_income) {
            const impliedIncome = estimatedSavings / 0.3; // Assume 30% baseline savings rate
            setGrossIncome(Math.max(100000, impliedIncome));
          }
        }
      }
    }
  }, [netWorthEntries]);

  // Get baseline city
  const baselineCity = CITIES.find((c) => c.city_id === baselineCityId);
  const baselineTaxIndex = baselineCity?.tax_index || 100;

  // Calculate baseline spending (derived from income and savings)
  const baselineSpend = Math.max(0, grossIncome - annualSavings);

  // Calculate metrics for all cities
  const cityAnalyses: CityAnalysis[] = useMemo(() => {
    if (!baselineCity) return [];

    const baselineEffectiveCOL = calculateEffectiveCOL(baselineCity, weights);

    return CITIES.map((city) => {
      // Step 1: Calculate effective COL using weighted formula
      const effectiveCOL = calculateEffectiveCOL(city, weights);

      // Step 2: Calculate COL-adjusted spending
      // Relative to baseline city's COL
      const colMultiplier = effectiveCOL / baselineEffectiveCOL;
      const adjustedSpend = baselineSpend * colMultiplier;

      // Step 3: Calculate after-tax spending adjustment
      const afterTaxSpend = calculateAfterTaxSpend(
        adjustedSpend,
        city.tax_index,
        baselineTaxIndex
      );

      // Step 4: Calculate annual savings
      // Savings = Income - After-tax spending
      const savings = grossIncome - afterTaxSpend;
      const canAchieveFI = savings > 0;

      // Step 5: Calculate savings rate
      const savingsRate = canAchieveFI ? savings / grossIncome : 0;

      // Step 6: Calculate required net worth for FI
      // Required NW = Annual spending / withdrawal rate
      const requiredNW = afterTaxSpend / withdrawalRate;

      // Step 7: Calculate years to FI
      const yearsToFI = canAchieveFI
        ? calculateYearsToRetirement(
            currentNetWorth,
            requiredNW,
            savings,
            expectedReturn
          )
        : Infinity;

      return {
        city,
        effectiveCOL,
        adjustedSpend,
        afterTaxSpend,
        annualSavings: savings,
        savingsRate,
        requiredNW,
        yearsToFI,
        deltaYears: 0, // Will be calculated after baseline is determined
        meetsSavingsTarget: savingsRate >= targetSavingsRate,
        canAchieveFI,
      };
    });
  }, [
    baselineCity,
    baselineSpend,
    baselineTaxIndex,
    currentNetWorth,
    expectedReturn,
    grossIncome,
    targetSavingsRate,
    weights,
    withdrawalRate,
  ]);

  // Calculate delta vs baseline
  const cityAnalysesWithDelta = useMemo(() => {
    const baselineAnalysis = cityAnalyses.find(
      (c) => c.city.city_id === baselineCityId
    );
    const baselineYears = baselineAnalysis?.yearsToFI || 0;

    return cityAnalyses.map((c) => ({
      ...c,
      deltaYears: c.yearsToFI - baselineYears,
    }));
  }, [cityAnalyses, baselineCityId]);

  // Sort cities
  const sortedCities = useMemo(() => {
    const sorted = [...cityAnalysesWithDelta];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "city":
          comparison = a.city.city_name.localeCompare(b.city.city_name);
          break;
        case "col":
          comparison = a.effectiveCOL - b.effectiveCOL;
          break;
        case "spend":
          comparison = a.afterTaxSpend - b.afterTaxSpend;
          break;
        case "savingsRate":
          comparison = a.savingsRate - b.savingsRate;
          break;
        case "yearsToFI":
          // Handle infinity: push to end
          if (!isFinite(a.yearsToFI) && !isFinite(b.yearsToFI)) comparison = 0;
          else if (!isFinite(a.yearsToFI)) comparison = 1;
          else if (!isFinite(b.yearsToFI)) comparison = -1;
          else comparison = a.yearsToFI - b.yearsToFI;
          break;
        case "delta":
          if (!isFinite(a.deltaYears) && !isFinite(b.deltaYears)) comparison = 0;
          else if (!isFinite(a.deltaYears)) comparison = 1;
          else if (!isFinite(b.deltaYears)) comparison = -1;
          else comparison = a.deltaYears - b.deltaYears;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [cityAnalysesWithDelta, sortField, sortDirection]);

  // Generate insights
  const baselineAnalysis = cityAnalysesWithDelta.find(
    (c) => c.city.city_id === baselineCityId
  );
  const insights = generateInsights(
    cityAnalysesWithDelta,
    baselineAnalysis,
    grossIncome,
    targetSavingsRate
  );

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort indicator
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Globe className="h-7 w-7 text-primary" />
          Geographic Arbitrage
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          Compare cities to maximize your savings rate and accelerate financial independence
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-4">
            {/* Baseline City */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Current City (Baseline)</label>
              <Select value={baselineCityId} onValueChange={setBaselineCityId}>
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

            {/* Target Savings Rate */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Savings Rate</label>
              <Select
                value={targetSavingsRate.toString()}
                onValueChange={(v) => setTargetSavingsRate(parseFloat(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.20">20%</SelectItem>
                  <SelectItem value="0.25">25%</SelectItem>
                  <SelectItem value="0.30">30%</SelectItem>
                  <SelectItem value="0.40">40%</SelectItem>
                  <SelectItem value="0.50">50%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gross Income (editable) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Gross Annual Income</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-4 py-2 border rounded-md bg-background"
                />
              </div>
            </div>

            {/* Current Net Worth */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Net Worth</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={currentNetWorth}
                  onChange={(e) => setCurrentNetWorth(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-4 py-2 border rounded-md bg-background"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {insights.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                {insights.map((insight, i) => (
                  <p key={i} className="text-sm">
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Cities Analyzed</div>
            <div className="text-2xl font-bold">{CITIES.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Meet {formatPercent(targetSavingsRate)} Target</div>
            <div className="text-2xl font-bold text-green-600">
              {sortedCities.filter((c) => c.meetsSavingsTarget && c.canAchieveFI).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Fastest to FI</div>
            <div className="text-2xl font-bold text-primary">
              {sortedCities.filter((c) => c.canAchieveFI)[0]?.city.city_name || "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Baseline Years to FI</div>
            <div className="text-2xl font-bold">
              {baselineAnalysis && isFinite(baselineAnalysis.yearsToFI)
                ? `${Math.round(baselineAnalysis.yearsToFI)} yrs`
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            City Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Click column headers to sort. Green = faster FI than baseline. Red = slower or infeasible.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("city")}
                  >
                    City <SortIndicator field="city" />
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("col")}
                  >
                    COL Index <SortIndicator field="col" />
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("spend")}
                  >
                    After-Tax Spend <SortIndicator field="spend" />
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("savingsRate")}
                  >
                    Savings Rate <SortIndicator field="savingsRate" />
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("yearsToFI")}
                  >
                    Years to FI <SortIndicator field="yearsToFI" />
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("delta")}
                  >
                    vs Baseline <SortIndicator field="delta" />
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCities.map((analysis) => {
                  const isBaseline = analysis.city.city_id === baselineCityId;
                  const isFaster = analysis.deltaYears < -0.5 && analysis.canAchieveFI;
                  const isSlower = analysis.deltaYears > 0.5 || !analysis.canAchieveFI;
                  const isExpanded = expandedCity === analysis.city.city_id;

                  return (
                    <>
                      <TableRow
                        key={analysis.city.city_id}
                        className={`
                          ${isBaseline ? "bg-primary/10" : ""}
                          ${!analysis.canAchieveFI ? "opacity-50" : ""}
                          ${analysis.meetsSavingsTarget && analysis.canAchieveFI ? "bg-green-600/5" : ""}
                        `}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {isBaseline && <MapPin className="h-4 w-4 text-primary" />}
                            {analysis.meetsSavingsTarget && analysis.canAchieveFI && !isBaseline && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {!analysis.canAchieveFI && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <div>
                              <div>{analysis.city.city_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {analysis.city.country}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {Math.round(analysis.effectiveCOL * 100)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(analysis.afterTaxSpend)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            analysis.meetsSavingsTarget && analysis.canAchieveFI
                              ? "text-green-600"
                              : !analysis.canAchieveFI
                              ? "text-red-500"
                              : ""
                          }`}
                        >
                          {analysis.canAchieveFI ? formatPercent(analysis.savingsRate) : "N/A"}
                          {analysis.meetsSavingsTarget && analysis.canAchieveFI && (
                            <span className="ml-1 text-xs bg-green-600/20 text-green-600 px-1 rounded">
                              Target
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {analysis.canAchieveFI && isFinite(analysis.yearsToFI)
                            ? `${analysis.yearsToFI.toFixed(1)} yrs`
                            : "∞"}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            isFaster ? "text-green-600" : isSlower ? "text-red-500" : ""
                          }`}
                        >
                          {isBaseline ? (
                            <span className="text-muted-foreground">—</span>
                          ) : analysis.canAchieveFI && isFinite(analysis.deltaYears) ? (
                            <div className="flex items-center justify-end gap-1">
                              {analysis.deltaYears < 0 ? (
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                              ) : analysis.deltaYears > 0 ? (
                                <ArrowDownRight className="h-4 w-4 text-red-500" />
                              ) : null}
                              {analysis.deltaYears > 0 ? "+" : ""}
                              {analysis.deltaYears.toFixed(1)} yrs
                            </div>
                          ) : (
                            <span className="text-red-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedCity(isExpanded ? null : analysis.city.city_id)
                            }
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row - Drill Down */}
                      {isExpanded && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={7}>
                            <div className="py-4 px-2 space-y-4">
                              <div className="grid gap-4 md:grid-cols-3">
                                {/* Spend Breakdown */}
                                <div>
                                  <h4 className="font-medium mb-2">Spending Breakdown</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Housing ({(weights.housing * 100).toFixed(0)}%)</span>
                                      <span>{formatCurrency(analysis.afterTaxSpend * weights.housing)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Food ({(weights.food * 100).toFixed(0)}%)</span>
                                      <span>{formatCurrency(analysis.afterTaxSpend * weights.food)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Transport ({(weights.transport * 100).toFixed(0)}%)</span>
                                      <span>{formatCurrency(analysis.afterTaxSpend * weights.transport)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Healthcare ({(weights.healthcare * 100).toFixed(0)}%)</span>
                                      <span>{formatCurrency(analysis.afterTaxSpend * weights.healthcare)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Utilities ({(weights.utilities * 100).toFixed(0)}%)</span>
                                      <span>{formatCurrency(analysis.afterTaxSpend * weights.utilities)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Lifestyle ({(weights.lifestyle * 100).toFixed(0)}%)</span>
                                      <span>{formatCurrency(analysis.afterTaxSpend * weights.lifestyle)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* FI Metrics */}
                                <div>
                                  <h4 className="font-medium mb-2">Financial Independence</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Required Net Worth</span>
                                      <span className="font-medium">{formatCurrency(analysis.requiredNW)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Current Net Worth</span>
                                      <span>{formatCurrency(currentNetWorth)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Gap to FI</span>
                                      <span className={analysis.requiredNW > currentNetWorth ? "text-amber-600" : "text-green-600"}>
                                        {formatCurrency(Math.max(0, analysis.requiredNW - currentNetWorth))}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Annual Savings</span>
                                      <span className={analysis.canAchieveFI ? "text-green-600" : "text-red-500"}>
                                        {formatCurrency(analysis.annualSavings)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* City Details */}
                                <div>
                                  <h4 className="font-medium mb-2">City Details</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Housing Index</span>
                                      <span>{analysis.city.housing_index}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Food Index</span>
                                      <span>{analysis.city.food_index}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Healthcare Index</span>
                                      <span>{analysis.city.healthcare_index}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Tax Index</span>
                                      <span>{analysis.city.tax_index}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Data Confidence</span>
                                      <span className="capitalize">{analysis.city.confidence}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Comparison vs Baseline */}
                              {!isBaseline && baselineAnalysis && (
                                <div className="pt-3 border-t">
                                  <h4 className="font-medium mb-2">vs {baselineCity?.city_name}</h4>
                                  <div className="flex gap-6 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Spending: </span>
                                      <span className={analysis.afterTaxSpend < baselineAnalysis.afterTaxSpend ? "text-green-600" : "text-red-500"}>
                                        {analysis.afterTaxSpend < baselineAnalysis.afterTaxSpend ? "−" : "+"}
                                        {formatCurrency(Math.abs(analysis.afterTaxSpend - baselineAnalysis.afterTaxSpend))}/yr
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Savings: </span>
                                      <span className={analysis.annualSavings > baselineAnalysis.annualSavings ? "text-green-600" : "text-red-500"}>
                                        {analysis.annualSavings > baselineAnalysis.annualSavings ? "+" : "−"}
                                        {formatCurrency(Math.abs(analysis.annualSavings - baselineAnalysis.annualSavings))}/yr
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Required NW: </span>
                                      <span className={analysis.requiredNW < baselineAnalysis.requiredNW ? "text-green-600" : "text-red-500"}>
                                        {analysis.requiredNW < baselineAnalysis.requiredNW ? "−" : "+"}
                                        {formatCurrency(Math.abs(analysis.requiredNW - baselineAnalysis.requiredNW))}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Methodology Note */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Methodology:</strong> COL indices are weighted by spending category (housing 35%, food 15%, transport 10%,
            healthcare 10%, utilities 10%, lifestyle 20%). Tax adjustments use a simplified model based on relative tax burdens.
            Years to FI assumes a {(expectedReturn * 100).toFixed(0)}% real return and {(withdrawalRate * 100).toFixed(0)}% safe withdrawal rate.
            Data confidence varies by city. Always verify with local research before making relocation decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
