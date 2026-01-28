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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Home,
  Target,
  Zap,
  Briefcase,
  TrendingDown,
  Clock,
  Info,
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
  effectiveCOL: number;           // Weighted COL multiplier (1.0 = baseline)
  adjustedSpend: number;          // COL-adjusted annual spending
  afterTaxSpend: number;          // After tax adjustment
  annualSavings: number;          // Gross income - after-tax spend
  savingsRate: number;            // Savings / gross income
  requiredNW: number;             // Required net worth for FI
  yearsToFI: number;              // Years to reach FI
  deltaYears: number;             // vs baseline city
  deltaRequiredNW: number;        // vs baseline city
  meetsSavingsTarget: boolean;
  canAchieveFI: boolean;          // false if negative savings
  housingCostDelta: number;       // Housing cost % difference vs baseline
  fiEfficiencyRatio: number;      // savingsRate / effectiveCOL
}

type SortField = "city" | "col" | "spend" | "savingsRate" | "yearsToFI" | "delta";
type SortDirection = "asc" | "desc";

// FI Efficiency qualitative labels
type FIEfficiencyLabel = "Excellent" | "Good" | "Neutral" | "Poor";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(value: number): string {
  if (!isFinite(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyCompact(value: number): string {
  if (!isFinite(value)) return "N/A";
  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (absValue >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return formatCurrency(value);
}

function formatPercent(value: number, decimals = 0): string {
  if (!isFinite(value)) return "N/A";
  return (value * 100).toFixed(decimals) + "%";
}

function formatYears(years: number): string {
  if (!isFinite(years)) return "Never";
  if (years <= 0) return "Now";
  return years.toFixed(1) + " yrs";
}

/**
 * Get FI Efficiency label from ratio
 * Higher ratio = better (high savings in low COL area)
 */
function getFIEfficiencyLabel(ratio: number): FIEfficiencyLabel {
  if (ratio >= 0.5) return "Excellent";
  if (ratio >= 0.35) return "Good";
  if (ratio >= 0.2) return "Neutral";
  return "Poor";
}

function getFIEfficiencyColor(label: FIEfficiencyLabel): string {
  switch (label) {
    case "Excellent": return "text-green-600";
    case "Good": return "text-blue-600";
    case "Neutral": return "text-muted-foreground";
    case "Poor": return "text-red-500";
  }
}

/**
 * Calculate after-tax spending adjustment
 * Tax index represents relative tax burden (NYC = 100)
 * Lower tax index = lower taxes = more spendable income
 */
function calculateAfterTaxSpend(
  adjustedSpend: number,
  cityTaxIndex: number,
  baselineTaxIndex: number
): number {
  if (adjustedSpend <= 0) return 0;

  // Tax adjustment factor: how much more/less you pay in taxes
  // If city has lower taxes (tax_index < baseline), you keep more money
  const taxDifferential = (cityTaxIndex - baselineTaxIndex) / 100;

  // A 10% lower tax index translates to roughly 10% less gross income needed
  // Simplified linear model with 30% sensitivity
  const taxMultiplier = 1 + (taxDifferential * 0.3);

  return adjustedSpend * Math.max(0.5, Math.min(1.5, taxMultiplier));
}

// ============================================================================
// CALLOUT TYPES & GENERATOR
// ============================================================================

interface Callout {
  type: "sweet-spot" | "compression" | "consulting-friendly" | "comparison";
  icon: typeof Zap;
  title: string;
  description: string;
  color: string;
}

function generateCallouts(
  selectedCity: CityAnalysis | undefined,
  baselineCity: CityAnalysis | undefined,
  targetSavingsRate: number
): Callout[] {
  if (!selectedCity || !baselineCity) return [];

  const callouts: Callout[] = [];
  const isBaseline = selectedCity.city.city_id === baselineCity.city.city_id;

  // Don't show callouts for baseline city
  if (isBaseline) return [];

  // Geo-Arbitrage Sweet Spot
  // Trigger: effectiveCOL < 0.7 AND savingsRate >= 25%
  if (selectedCity.effectiveCOL < 0.7 && selectedCity.savingsRate >= 0.25) {
    callouts.push({
      type: "sweet-spot",
      icon: Zap,
      title: "Geo-Arbitrage Sweet Spot",
      description: "This city supports aggressive savings without extreme lifestyle tradeoffs.",
      color: "text-green-600",
    });
  }

  // Lifestyle Compression Required
  // Trigger: savingsRate < targetSavingsRate (and city is achievable)
  if (selectedCity.canAchieveFI && selectedCity.savingsRate < targetSavingsRate) {
    callouts.push({
      type: "compression",
      icon: TrendingDown,
      title: "Lifestyle Compression Required",
      description: "To reach your savings target here, housing or lifestyle spending would need to be reduced.",
      color: "text-amber-600",
    });
  }

  // Consulting-Friendly Location
  // Trigger: healthcare_index < baseline AND transport_index < baseline
  if (
    selectedCity.city.healthcare_index < baselineCity.city.healthcare_index &&
    selectedCity.city.transport_index < baselineCity.city.transport_index
  ) {
    callouts.push({
      type: "consulting-friendly",
      icon: Briefcase,
      title: "Consulting-Friendly Location",
      description: "Strong fit for remote consultants with flexible income.",
      color: "text-blue-600",
    });
  }

  // Comparison Callout - always show for non-baseline cities
  if (selectedCity.canAchieveFI && Math.abs(selectedCity.deltaYears) >= 0.5) {
    const yearsText = Math.abs(selectedCity.deltaYears).toFixed(0);
    const direction = selectedCity.deltaYears < 0 ? "saves" : "costs";
    const nwDelta = Math.abs(selectedCity.deltaRequiredNW);

    let description = "";
    if (selectedCity.deltaYears < 0) {
      description = `Moving from ${baselineCity.city.city_name} to ${selectedCity.city.city_name} ${direction} ~${yearsText} working years.`;
      if (nwDelta >= 100000) {
        description += ` You need ${formatCurrencyCompact(nwDelta)} less invested to retire.`;
      }
    } else {
      description = `${selectedCity.city.city_name} would add ~${yearsText} years to your FI timeline vs ${baselineCity.city.city_name}.`;
    }

    callouts.push({
      type: "comparison",
      icon: selectedCity.deltaYears < 0 ? ArrowUpRight : ArrowDownRight,
      title: selectedCity.deltaYears < 0 ? "FI Acceleration" : "Slower Path to FI",
      description,
      color: selectedCity.deltaYears < 0 ? "text-green-600" : "text-red-500",
    });
  }

  return callouts.slice(0, 3); // Max 3 callouts
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
  const [compareCityId, setCompareCityId] = useState<string | null>(null);
  const [targetSavingsRate, setTargetSavingsRate] = useState(0.25);
  const [weights] = useState<SpendingWeights>(DEFAULT_WEIGHTS);

  // Core financial parameters
  const [grossIncome, setGrossIncome] = useState(150000);
  const [baselineAnnualSpend, setBaselineAnnualSpend] = useState(75000);
  const [currentNetWorth, setCurrentNetWorth] = useState(100000);
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

  // Derive parameters from net worth data
  useEffect(() => {
    if (netWorthEntries.length === 0) return;

    // Sort by date descending
    const sorted = [...netWorthEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latest = sorted[0];
    if (latest) {
      // Use net worth directly from the entry
      if (latest.net_worth && latest.net_worth > 0) {
        setCurrentNetWorth(latest.net_worth);
      }

      // Use pre_tax_income if available (convert monthly to annual)
      if (latest.pre_tax_income && latest.pre_tax_income > 0) {
        setGrossIncome(latest.pre_tax_income * 12);
      }

      // Use monthly_expenses if available (convert to annual)
      if (latest.monthly_expenses && latest.monthly_expenses > 0) {
        setBaselineAnnualSpend(latest.monthly_expenses * 12);
      }
    }
  }, [netWorthEntries]);

  // Get baseline city data
  const baselineCity = CITIES.find((c) => c.city_id === baselineCityId);
  const baselineTaxIndex = baselineCity?.tax_index || 100;

  // Calculate baseline effective COL (for relative comparisons)
  const baselineEffectiveCOL = useMemo(() => {
    if (!baselineCity) return 1;
    return calculateEffectiveCOL(baselineCity, weights);
  }, [baselineCity, weights]);

  // Calculate metrics for all cities
  const cityAnalyses: CityAnalysis[] = useMemo(() => {
    if (!baselineCity) return [];

    return CITIES.map((city) => {
      // Step 1: Calculate effective COL using weighted formula
      const effectiveCOL = calculateEffectiveCOL(city, weights);

      // Step 2: Calculate COL-adjusted spending relative to baseline
      const colMultiplier = effectiveCOL / baselineEffectiveCOL;
      const adjustedSpend = baselineAnnualSpend * colMultiplier;

      // Step 3: Calculate after-tax spending adjustment
      const afterTaxSpend = calculateAfterTaxSpend(
        adjustedSpend,
        city.tax_index,
        baselineTaxIndex
      );

      // Step 4: Calculate annual savings
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

      // Step 8: Housing cost delta vs baseline
      const baselineHousingIndex = baselineCity.housing_index;
      const housingCostDelta = (city.housing_index - baselineHousingIndex) / baselineHousingIndex;

      // Step 9: FI Efficiency Ratio
      // Higher is better: high savings rate in low COL area
      const fiEfficiencyRatio = effectiveCOL > 0 ? savingsRate / effectiveCOL : 0;

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
        deltaRequiredNW: 0,
        meetsSavingsTarget: savingsRate >= targetSavingsRate,
        canAchieveFI,
        housingCostDelta,
        fiEfficiencyRatio,
      };
    });
  }, [
    baselineCity,
    baselineAnnualSpend,
    baselineEffectiveCOL,
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
    const baselineRequiredNW = baselineAnalysis?.requiredNW || 0;

    return cityAnalyses.map((c) => ({
      ...c,
      deltaYears: c.yearsToFI - baselineYears,
      deltaRequiredNW: c.requiredNW - baselineRequiredNW,
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

  // Get baseline and comparison city analyses
  const baselineAnalysis = cityAnalysesWithDelta.find(
    (c) => c.city.city_id === baselineCityId
  );
  const compareAnalysis = compareCityId
    ? cityAnalysesWithDelta.find((c) => c.city.city_id === compareCityId)
    : sortedCities.filter((c) => c.city.city_id !== baselineCityId && c.canAchieveFI)[0];

  // Generate callouts for the comparison city
  const callouts = generateCallouts(compareAnalysis, baselineAnalysis, targetSavingsRate);

  // Find best cities for hero stats
  const bestFICity = sortedCities.filter((c) => c.canAchieveFI)[0];
  const citiesMeetingTarget = sortedCities.filter((c) => c.meetsSavingsTarget && c.canAchieveFI);

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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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

            {/* Target Savings Rate - Extended to 90% */}
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
                  <SelectItem value="0.10">10%</SelectItem>
                  <SelectItem value="0.15">15%</SelectItem>
                  <SelectItem value="0.20">20%</SelectItem>
                  <SelectItem value="0.25">25%</SelectItem>
                  <SelectItem value="0.30">30%</SelectItem>
                  <SelectItem value="0.35">35%</SelectItem>
                  <SelectItem value="0.40">40%</SelectItem>
                  <SelectItem value="0.45">45%</SelectItem>
                  <SelectItem value="0.50">50%</SelectItem>
                  <SelectItem value="0.55">55%</SelectItem>
                  <SelectItem value="0.60">60%</SelectItem>
                  <SelectItem value="0.65">65%</SelectItem>
                  <SelectItem value="0.70">70%</SelectItem>
                  <SelectItem value="0.75">75%</SelectItem>
                  <SelectItem value="0.80">80%</SelectItem>
                  <SelectItem value="0.85">85%</SelectItem>
                  <SelectItem value="0.90">90%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gross Income */}
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

            {/* Baseline Annual Spend - NEW: Explicit input */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                Baseline Annual Spend
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Your current annual spending in your baseline city.
                        This will be adjusted for each city based on cost of living.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={baselineAnnualSpend}
                  onChange={(e) => setBaselineAnnualSpend(parseFloat(e.target.value) || 0)}
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

      {/* ============================================================ */}
      {/* HERO METRICS - Top Strip */}
      {/* ============================================================ */}
      {compareAnalysis && baselineAnalysis && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* 1. Years to FI (Delta vs Baseline) */}
          <Card className={`${
            compareAnalysis.deltaYears < -0.5
              ? "border-green-500/50 bg-green-50/50"
              : compareAnalysis.deltaYears > 0.5
                ? "border-red-500/50 bg-red-50/50"
                : ""
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Years to FI
                  </div>
                  <div className={`text-3xl font-bold mt-1 ${
                    compareAnalysis.deltaYears < -0.5
                      ? "text-green-600"
                      : compareAnalysis.deltaYears > 0.5
                        ? "text-red-500"
                        : ""
                  }`}>
                    {compareAnalysis.canAchieveFI && isFinite(compareAnalysis.deltaYears) ? (
                      <>
                        {compareAnalysis.deltaYears < 0 ? "" : "+"}
                        {compareAnalysis.deltaYears.toFixed(1)} yrs
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {compareAnalysis.deltaYears < 0
                      ? `Retire faster vs ${baselineCity?.city_name}`
                      : compareAnalysis.deltaYears > 0
                        ? `Slower vs ${baselineCity?.city_name}`
                        : `Same as ${baselineCity?.city_name}`
                    }
                  </div>
                </div>
                {compareAnalysis.deltaYears < 0 ? (
                  <ArrowUpRight className="h-8 w-8 text-green-600" />
                ) : compareAnalysis.deltaYears > 0 ? (
                  <ArrowDownRight className="h-8 w-8 text-red-500" />
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* 2. Required Net Worth (Delta) */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Target className="h-4 w-4" />
                Required Net Worth
              </div>
              <div className="text-3xl font-bold mt-1">
                {formatCurrencyCompact(compareAnalysis.requiredNW)}
              </div>
              <div className={`text-xs mt-1 ${
                compareAnalysis.deltaRequiredNW < 0 ? "text-green-600" : "text-red-500"
              }`}>
                {compareAnalysis.deltaRequiredNW < 0 ? "−" : "+"}
                {formatCurrencyCompact(Math.abs(compareAnalysis.deltaRequiredNW))} vs baseline
              </div>
            </CardContent>
          </Card>

          {/* 3. Achievable Savings Rate */}
          <Card className={compareAnalysis.meetsSavingsTarget ? "border-green-500/50 bg-green-50/50" : ""}>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Savings Rate
              </div>
              <div className={`text-3xl font-bold mt-1 ${
                compareAnalysis.savingsRate < 0
                  ? "text-red-500"
                  : compareAnalysis.meetsSavingsTarget
                    ? "text-green-600"
                    : ""
              }`}>
                {compareAnalysis.canAchieveFI
                  ? formatPercent(compareAnalysis.savingsRate)
                  : "Negative"
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {compareAnalysis.savingsRate < 0
                  ? "Unsustainable at current assumptions"
                  : compareAnalysis.meetsSavingsTarget
                    ? `Above your ${formatPercent(targetSavingsRate)} target`
                    : `Below ${formatPercent(targetSavingsRate)} target`
                }
              </div>
            </CardContent>
          </Card>

          {/* 4. Housing Cost Leverage */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Home className="h-4 w-4" />
                Housing Costs
              </div>
              <div className={`text-3xl font-bold mt-1 ${
                compareAnalysis.housingCostDelta < -0.1
                  ? "text-green-600"
                  : compareAnalysis.housingCostDelta > 0.1
                    ? "text-red-500"
                    : ""
              }`}>
                {compareAnalysis.housingCostDelta <= 0 ? "" : "+"}
                {formatPercent(compareAnalysis.housingCostDelta)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                vs {baselineCity?.city_name}
              </div>
            </CardContent>
          </Card>

          {/* 5. FI Efficiency Ratio */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Zap className="h-4 w-4" />
                FI Efficiency
              </div>
              <div className={`text-3xl font-bold mt-1 ${getFIEfficiencyColor(getFIEfficiencyLabel(compareAnalysis.fiEfficiencyRatio))}`}>
                {getFIEfficiencyLabel(compareAnalysis.fiEfficiencyRatio)}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-xs text-muted-foreground mt-1 cursor-help underline decoration-dotted">
                    Ratio: {compareAnalysis.fiEfficiencyRatio.toFixed(2)}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      FI Efficiency = Savings Rate ÷ Effective COL.
                      Higher ratio means better value: high savings in a low-cost area.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compare City Selector */}
      {cityAnalysesWithDelta.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-sm font-medium">Compare to:</label>
              <Select
                value={compareCityId || "auto"}
                onValueChange={(v) => setCompareCityId(v === "auto" ? null : v)}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Best FI city (auto)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Best FI city (auto)</SelectItem>
                  {CITIES.filter((c) => c.city_id !== baselineCityId).map((city) => (
                    <SelectItem key={city.city_id} value={city.city_id}>
                      {city.city_name}, {city.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {compareAnalysis && (
                <span className="text-sm text-muted-foreground">
                  Comparing <span className="font-medium">{baselineCity?.city_name}</span> to{" "}
                  <span className="font-medium">{compareAnalysis.city.city_name}</span>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================================ */}
      {/* INTELLIGENT CALLOUTS */}
      {/* ============================================================ */}
      {callouts.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          {callouts.map((callout, i) => {
            const Icon = callout.icon;
            return (
              <Card key={i} className="border-l-4" style={{ borderLeftColor: callout.color.replace("text-", "").includes("green") ? "#16a34a" : callout.color.includes("amber") ? "#d97706" : callout.color.includes("blue") ? "#2563eb" : "#ef4444" }}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${callout.color}`} />
                    <div>
                      <h4 className={`font-medium text-sm ${callout.color}`}>{callout.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{callout.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
              {citiesMeetingTarget.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Fastest to FI</div>
            <div className="text-2xl font-bold text-primary">
              {bestFICity?.city.city_name || "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Baseline Years to FI</div>
            <div className="text-2xl font-bold">
              {baselineAnalysis && isFinite(baselineAnalysis.yearsToFI)
                ? formatYears(baselineAnalysis.yearsToFI)
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
            All Cities Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Click column headers to sort. Click a row to expand details. Green = meets savings target.
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
                    Annual Spend <SortIndicator field="spend" />
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
                  const isComparing = analysis.city.city_id === (compareCityId || compareAnalysis?.city.city_id);
                  const isFaster = analysis.deltaYears < -0.5 && analysis.canAchieveFI;
                  const isSlower = analysis.deltaYears > 0.5 || !analysis.canAchieveFI;
                  const isExpanded = expandedCity === analysis.city.city_id;

                  return (
                    <>
                      <TableRow
                        key={analysis.city.city_id}
                        className={`
                          cursor-pointer transition-colors
                          ${isBaseline ? "bg-primary/10" : ""}
                          ${isComparing && !isBaseline ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}
                          ${!analysis.canAchieveFI ? "opacity-50" : ""}
                          ${analysis.meetsSavingsTarget && analysis.canAchieveFI && !isBaseline ? "bg-green-600/5" : ""}
                          hover:bg-muted/50
                        `}
                        onClick={() => setExpandedCity(isExpanded ? null : analysis.city.city_id)}
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
                            ? formatYears(analysis.yearsToFI)
                            : "Never"}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCity(isExpanded ? null : analysis.city.city_id);
                            }}
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
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">FI Efficiency</span>
                                      <span className={getFIEfficiencyColor(getFIEfficiencyLabel(analysis.fiEfficiencyRatio))}>
                                        {getFIEfficiencyLabel(analysis.fiEfficiencyRatio)} ({analysis.fiEfficiencyRatio.toFixed(2)})
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
                                  <div className="flex gap-6 text-sm flex-wrap">
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
                                    <div>
                                      <span className="text-muted-foreground">Housing: </span>
                                      <span className={analysis.housingCostDelta < 0 ? "text-green-600" : "text-red-500"}>
                                        {analysis.housingCostDelta <= 0 ? "" : "+"}
                                        {formatPercent(analysis.housingCostDelta)}
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
            FI Efficiency Ratio = Savings Rate ÷ Effective COL (higher is better).
            Data confidence varies by city. Always verify with local research before making relocation decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
