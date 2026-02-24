"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { TrendingUp, MapPin, Calculator, DollarSign, Globe, CheckCircle, Clock, ChevronDown, Plane, Building2, Landmark, PiggyBank, Lightbulb, ArrowRight, Layers } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CITIES, getCityById, DEFAULT_WEIGHTS } from "@/lib/col-data";
import {
  calculateRetirementProjection,
  calculateEffectiveCOL,
  validateRetirementParams,
  type SpendingWeights,
  type RetirementParams,
} from "@/lib/retirement-calculator";
import { FeedbackWidget } from "@/components/feedback-widget";
import type { NetWorthEntry, Scenario } from "@/lib/types";
import { InsightCallout } from "@/components/bridges/InsightCallout";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + "%";
}

function RetirementPageContent() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();

  // URL params for scenario support
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenario");

  // Scenario state
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [baselineScenario, setBaselineScenario] = useState<Scenario | null>(null);
  const [loadingScenario, setLoadingScenario] = useState(!!scenarioId);

  // Net worth data from API
  const [netWorthEntries, setNetWorthEntries] = useState<NetWorthEntry[]>([]);
  const [loadingNetWorth, setLoadingNetWorth] = useState(true);

  // User inputs
  const [currentCityId, setCurrentCityId] = useState("nyc"); // Anchor city for COL comparison
  const [selectedCityId, setSelectedCityId] = useState("austin");
  const [currentSpend, setCurrentSpend] = useState("60000");
  const [withdrawalRate, setWithdrawalRate] = useState("4");
  const [expectedReturn, setExpectedReturn] = useState("5");
  const [weights, setWeights] = useState<SpendingWeights>(DEFAULT_WEIGHTS);


  // Calculated values
  const [results, setResults] = useState<ReturnType<typeof calculateRetirementProjection> | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Fetch net worth data
  useEffect(() => {
    async function fetchNetWorth() {
      try {
        const response = await fetch("/api/net-worth");
        if (!response.ok) throw new Error("Failed to fetch net worth");
        const data = await response.json();
        setNetWorthEntries(data.data || []);
      } catch (error) {
        console.error("Error fetching net worth:", error);
      } finally {
        setLoadingNetWorth(false);
      }
    }
    fetchNetWorth();
  }, []);

  // Fetch scenario data if URL param present
  useEffect(() => {
    async function fetchScenarios() {
      if (!scenarioId) {
        setLoadingScenario(false);
        return;
      }

      try {
        // Fetch the active scenario
        const scenarioRes = await fetch(`/api/scenarios/${scenarioId}`);
        if (scenarioRes.ok) {
          const { data: scenario } = await scenarioRes.json();
          setActiveScenario(scenario);

          // Pre-fill inputs from scenario
          if (scenario) {
            setSelectedCityId(scenario.location_city_id);
            setCurrentSpend(Math.round(scenario.annual_expenses).toString());
            setWithdrawalRate((scenario.withdrawal_rate * 100).toString());
            setExpectedReturn((scenario.expected_return * 100).toString());
            if (scenario.spending_weights) {
              setWeights(scenario.spending_weights);
            }
          }
        }

        // Fetch baseline scenario for comparison
        const baselineRes = await fetch("/api/scenarios?baseline=true");
        if (baselineRes.ok) {
          const { data: scenarios } = await baselineRes.json();
          if (scenarios && scenarios.length > 0) {
            setBaselineScenario(scenarios[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      } finally {
        setLoadingScenario(false);
      }
    }
    fetchScenarios();
  }, [scenarioId]);


  // Get current net worth and annual savings from most recent entry
  const latestEntry = netWorthEntries.length > 0
    ? netWorthEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const currentNetWorth = latestEntry?.net_worth || 0;
  const annualSavings = latestEntry
    ? ((latestEntry.pre_tax_income || 0) - (latestEntry.monthly_expenses || 0)) * 12
    : 0;

  // Calculate retirement projection whenever inputs change
  useEffect(() => {
    const city = getCityById(selectedCityId);
    if (!city) return;

    const currentCityData = getCityById(currentCityId);
    if (!currentCityData) return;

    // Calculate relative COL multiplier based on current city
    const currentCityCOL = calculateEffectiveCOL(currentCityData, weights);
    const targetCityCOL = calculateEffectiveCOL(city, weights);
    const relativeMultiplier = targetCityCOL / currentCityCOL;

    const params: RetirementParams = {
      currentSpend: parseFloat(currentSpend) * relativeMultiplier || 0,
      currentNetWorth,
      annualSavings,
      withdrawalRate: parseFloat(withdrawalRate) / 100,
      expectedReturn: parseFloat(expectedReturn) / 100,
      city,
      weights,
    };

    const validationErrors = validateRetirementParams(params);
    // Filter out warnings (they start with "Warning:") from blocking errors
    const blockingErrors = validationErrors.filter(e => !e.startsWith('Warning:'));
    setErrors(validationErrors);

    if (blockingErrors.length === 0) {
      const projection = calculateRetirementProjection(params);
      setResults(projection);
    }
  }, [selectedCityId, currentCityId, currentSpend, withdrawalRate, expectedReturn, weights, currentNetWorth, annualSavings]);

  const handleWeightChange = (category: keyof SpendingWeights, value: number[]) => {
    setWeights((prev) => ({
      ...prev,
      [category]: value[0] / 100,
    }));
  };

  const resetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  const currentCity = getCityById(currentCityId);
  const selectedCity = getCityById(selectedCityId);
  const totalWeights = Object.values(weights).reduce((sum, w) => sum + w, 0);

  // Safe withdrawal amount from current net worth
  const safeWithdrawalAmount = currentNetWorth * (parseFloat(withdrawalRate) / 100);

  // Calculate comparison data for all cities
  const currentCOL = currentCity ? calculateEffectiveCOL(currentCity, weights) : 1;
  const allCitiesComparison = CITIES.map((city) => {
    const cityCOL = calculateEffectiveCOL(city, weights);
    const relativeMultiplier = cityCOL / currentCOL;
    const adjustedSpend = parseFloat(currentSpend) * relativeMultiplier;
    const requiredNW = adjustedSpend / (parseFloat(withdrawalRate) / 100);
    const cityWithdrawalAmount = currentNetWorth * (parseFloat(withdrawalRate) / 100);

    // Calculate years to retirement
    const r = parseFloat(expectedReturn) / 100;
    let years = Infinity;
    if (currentNetWorth >= requiredNW) {
      years = 0;
    } else if (r > 0 && annualSavings > 0) {
      const numerator = requiredNW * r + annualSavings;
      const denominator = currentNetWorth * r + annualSavings;
      if (denominator > 0 && numerator > 0) {
        years = Math.log(numerator / denominator) / Math.log(1 + r);
      }
    }

    return {
      city,
      effectiveCOL: cityCOL,
      relativeMultiplier,
      adjustedSpend,
      requiredNW,
      yearsToRetirement: years,
      canRetireNow: currentNetWorth >= requiredNW,
      withdrawalAmount: cityWithdrawalAmount,
    };
  }).sort((a, b) => a.yearsToRetirement - b.yearsToRetirement);

  // Dynamic headline - recalculate based on current inputs
  const citiesCanRetireNow = allCitiesComparison.filter(c => c.canRetireNow);
  const cheapestRetireNow = citiesCanRetireNow.length > 0 ? citiesCanRetireNow[0] : null;
  const nextMilestone = allCitiesComparison.find(c => !c.canRetireNow);

  // Format chart data with phase information
  const chartData = results?.projections.map((p) => ({
    year: p.year,
    "Net Worth": p.netWorth,
    phase: p.phase,
  })) || [];

  if (loadingNetWorth || loadingScenario || subscriptionLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  // Calculate delta vs baseline if both scenarios exist
  const scenarioDelta = activeScenario && baselineScenario ? {
    years: (activeScenario.years_to_fi || 0) - (baselineScenario.years_to_fi || 0),
    requiredNW: (activeScenario.required_net_worth || 0) - (baselineScenario.required_net_worth || 0),
  } : null;

  return (
    <div className="">
      <div className="space-y-6 py-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            Retirement Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">
          Plan your retirement with cost-of-living adjustments
        </p>
      </div>

      {/* Scenario Banner */}
      {activeScenario && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium">
                    Viewing: {activeScenario.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {activeScenario.location_city_name} • Created from Geographic Arbitrage
                  </p>
                </div>
              </div>
              {scenarioDelta && baselineScenario && isFinite(scenarioDelta.years) && (
                <div className="text-right">
                  <p className="text-sm text-slate-500">vs {baselineScenario.location_city_name} (Baseline)</p>
                  <p className={`font-semibold ${scenarioDelta.years < 0 ? "text-green-600" : scenarioDelta.years > 0 ? "text-red-500" : ""}`}>
                    {scenarioDelta.years < 0 ? "" : "+"}
                    {scenarioDelta.years.toFixed(1)} years to FI
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scenario Insight */}
      {activeScenario && baselineScenario && scenarioDelta && isFinite(scenarioDelta.years) && scenarioDelta.years < -0.5 && (
        <InsightCallout
          insightText={`Moving to ${activeScenario.location_city_name} from ${baselineScenario.location_city_name} could save you ~${Math.abs(scenarioDelta.years).toFixed(0)} years on your path to financial independence.`}
          deltaYearsToFI={scenarioDelta.years}
          deltaRequiredNetWorth={scenarioDelta.requiredNW}
        />
      )}

      {/* Input Section - Retirement Location & Spending (moved to top) */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-emerald-600" />
            Retirement Location & Spending
          </CardTitle>
          <p className="text-sm text-slate-500">
            You can retire when your safe withdrawal amount covers your annual spending. For example, with a 4% withdrawal rate,
            you need 25x your annual expenses saved (e.g., {formatCurrency(parseFloat(currentSpend) || 60000)} spending requires {formatCurrency((parseFloat(currentSpend) || 60000) * 25)}).
            Moving to a lower cost-of-living city reduces your required nest egg.
          </p>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentCity">Current City (Baseline)</Label>
                <Select value={currentCityId} onValueChange={setCurrentCityId}>
                  <SelectTrigger id="currentCity" className="w-full">
                    <SelectValue placeholder="Select your current city" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...CITIES].sort((a, b) => a.city_name.localeCompare(b.city_name)).map((city) => (
                      <SelectItem key={city.city_id} value={city.city_id}>
                        {city.city_name}, {city.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentCity && (
                  <p className="text-xs text-slate-500">
                    Your spending is anchored to this city&apos;s cost of living
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Target Retirement City</Label>
                <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...CITIES].sort((a, b) => a.city_name.localeCompare(b.city_name)).map((city) => (
                      <SelectItem key={city.city_id} value={city.city_id}>
                        {city.city_name}, {city.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCity && currentCity && (
                  <p className="text-xs text-slate-500">
                    {((calculateEffectiveCOL(selectedCity, weights) / calculateEffectiveCOL(currentCity, weights)) * 100).toFixed(0)}% of {currentCity.city_name}&apos;s cost • Confidence: {selectedCity.confidence}
                  </p>
                )}
                {/* Geo-Arbitrage Callout */}
                {selectedCity && currentCity && selectedCityId !== currentCityId && currentNetWorth > 0 && (() => {
                  const currentCityData = allCitiesComparison.find(c => c.city.city_id === currentCityId);
                  const targetCityData = allCitiesComparison.find(c => c.city.city_id === selectedCityId);
                  if (!currentCityData || !targetCityData) return null;

                  const netWorthSavings = currentCityData.requiredNW - targetCityData.requiredNW;
                  const yearsSaved = isFinite(currentCityData.yearsToRetirement) && isFinite(targetCityData.yearsToRetirement)
                    ? currentCityData.yearsToRetirement - targetCityData.yearsToRetirement
                    : null;
                  const canRetireNowInTarget = targetCityData.canRetireNow && !currentCityData.canRetireNow;

                  // Only show if there's a meaningful difference
                  if (netWorthSavings <= 0 && (yearsSaved === null || yearsSaved <= 0) && !canRetireNowInTarget) return null;

                  return (
                    <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="flex items-start gap-2">
                        <Plane className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <span className="font-medium text-primary">Geo-Arbitrage: </span>
                          <span className="text-slate-500">
                            Moving to {selectedCity.city_name}
                            {netWorthSavings > 0 && (
                              <> saves <span className="font-semibold text-primary">{formatCurrency(netWorthSavings)}</span></>
                            )}
                            {yearsSaved !== null && yearsSaved > 0 && (
                              <>{netWorthSavings > 0 ? " and " : " "}accelerates FI by <span className="font-semibold text-primary">{yearsSaved.toFixed(1)} years</span></>
                            )}
                            {canRetireNowInTarget && (
                              <> — <span className="font-semibold text-primary">you could retire now!</span></>
                            )}
                          </span>
                          {netWorthSavings > 0 && (
                            <p className="text-xs text-slate-500 mt-1">
                              Savings = Required NW in {currentCity?.city_name} ({formatCurrency(currentCityData.requiredNW)}) − Required NW in {selectedCity.city_name} ({formatCurrency(targetCityData.requiredNW)})
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentSpend">Current Annual Spending</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="currentSpend"
                    type="number"
                    value={currentSpend}
                    onChange={(e) => setCurrentSpend(e.target.value)}
                    className="pl-9"
                    placeholder="60000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdrawalRate">Safe Withdrawal Rate (%)</Label>
                <Input
                  id="withdrawalRate"
                  type="number"
                  step="0.1"
                  value={withdrawalRate}
                  onChange={(e) => setWithdrawalRate(e.target.value)}
                  placeholder="4.0"
                />
                <p className="text-xs text-slate-500">
                  The 4% rule suggests withdrawing 4% of your portfolio annually
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedReturn">Expected Real Return (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  placeholder="5.0"
                />
                <p className="text-xs text-slate-500">
                  Annual return after inflation (historically ~7% for stocks, ~3% inflation)
                </p>
              </div>
            </div>

            {latestEntry && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border border-slate-200 space-y-3">
                  <h4 className="text-sm font-medium text-slate-900">Your Financial Snapshot</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Current Net Worth</span>
                    <span className="font-medium text-slate-900">{formatCurrency(currentNetWorth)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Annual Savings</span>
                    <span className={`font-medium ${annualSavings >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {formatCurrency(annualSavings)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Safe Withdrawal ({withdrawalRate}%)</span>
                    <span className="font-medium text-purple-600">{formatCurrency(safeWithdrawalAmount)}/yr</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Headline */}
      {currentNetWorth > 0 && (() => {
        // Get the selected city's data for the headline
        const selectedCityData = allCitiesComparison.find(c => c.city.city_id === selectedCityId);
        const canRetireInSelected = selectedCityData?.canRetireNow || false;
        const yearsToRetireInSelected = selectedCityData?.yearsToRetirement || Infinity;

        return (
          <Card className={canRetireInSelected ? "border-emerald-200 bg-emerald-50/50" : "border-emerald-200 bg-emerald-50/30"}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {canRetireInSelected ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-lg font-semibold text-emerald-600">
                        You can retire today in {selectedCity?.city_name}!
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        With your {formatCurrency(currentNetWorth)} net worth, you have enough to retire in {selectedCity?.city_name}.
                        {citiesCanRetireNow.length > 1 && (
                          <> You could also retire in {citiesCanRetireNow.length - 1} other {citiesCanRetireNow.length === 2 ? "city" : "cities"}.</>
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="h-6 w-6 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-lg font-semibold text-emerald-600">
                        {isFinite(yearsToRetireInSelected)
                          ? `${yearsToRetireInSelected.toFixed(1)} years to retire in ${selectedCity?.city_name}`
                          : `Keep saving to retire in ${selectedCity?.city_name}`}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Current net worth: {formatCurrency(currentNetWorth)} •
                        Need {selectedCityData ? formatCurrency(selectedCityData.requiredNW) : "more savings"} to retire in {selectedCity?.city_name}.
                        {citiesCanRetireNow.length > 0 && (
                          <> You could retire now in {cheapestRetireNow?.city.city_name}!</>
                        )}
                      </p>
                      {selectedCityData && (
                        <p className="text-xs text-slate-500 mt-1">
                          Required NW = Adjusted Annual Spending ({formatCurrency(selectedCityData.adjustedSpend)}) ÷ Withdrawal Rate ({withdrawalRate}%)
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Tax Optimization Strategies */}
      {isPro ? (
        <Card className="border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-primary/5">
          <CardHeader
            className="cursor-pointer select-none"
            onClick={() => {
              const el = document.getElementById('tax-strategies-content');
              if (el) el.classList.toggle('hidden');
              const chevron = document.getElementById('tax-strategies-chevron');
              if (chevron) chevron.classList.toggle('rotate-180');
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-2xl font-black">Tax Optimization Strategies</CardTitle>
                <span className="text-xs text-slate-500 bg-muted px-2 py-0.5 rounded">For US Taxpayers</span>
              </div>
              <ChevronDown id="tax-strategies-chevron" className="h-5 w-5 text-slate-500 transition-transform" />
            </div>
            <p className="text-sm text-slate-500">
              Strategies to reduce your tax burden during accumulation and retirement
            </p>
          </CardHeader>
          <CardContent id="tax-strategies-content" className="hidden space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* FEIE */}
            <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Plane className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    Foreign Earned Income Exclusion (FEIE)
                    <span className="text-xs text-green-600 bg-green-600/10 px-2 py-0.5 rounded">Up to $126,500 tax-free (2024)</span>
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Live abroad for 330+ days/year to exclude foreign earned income from US taxes.
                    Combine with geo-arbitrage for maximum impact.
                  </p>
                  <div className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">Best for:</span> Consultants, remote workers living abroad
                  </div>
                </div>
              </div>
            </div>

            {/* S-Corp */}
            <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    S-Corp Election
                    <span className="text-xs text-green-600 bg-green-600/10 px-2 py-0.5 rounded">Save 15.3% SE tax</span>
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Pay yourself a reasonable salary and take remaining profits as distributions
                    to avoid self-employment tax on distributions.
                  </p>
                  <div className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">Best for:</span> Consultants earning $80k+/year with profits over salary
                  </div>
                </div>
              </div>
            </div>

            {/* Solo 401k */}
            <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <PiggyBank className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    Solo 401(k)
                    <span className="text-xs text-green-600 bg-green-600/10 px-2 py-0.5 rounded">Up to $69,000/year (2024)</span>
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Contribute as both employee ($23,000) and employer (25% of compensation).
                    Mega backdoor Roth available with some plans.
                  </p>
                  <div className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">Best for:</span> Self-employed with no employees
                  </div>
                </div>
              </div>
            </div>

            {/* HSA */}
            <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    Health Savings Account (HSA)
                    <span className="text-xs text-green-600 bg-green-600/10 px-2 py-0.5 rounded">Triple tax advantage</span>
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Contribute $4,150 (individual) or $8,300 (family) in 2024.
                    Tax-free contributions, growth, and qualified withdrawals.
                  </p>
                  <div className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">Best for:</span> Anyone with HDHP, invest and pay medical out-of-pocket
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Combinations */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-primary/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-700 dark:text-amber-300">
                  Optimal Strategy Stack for Consultants
                </p>
                <div className="mt-2 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-amber-500" />
                    <span><span className="font-medium">S-Corp + Solo 401(k):</span> Reduce SE taxes while maximizing retirement contributions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-amber-500" />
                    <span><span className="font-medium">FEIE + Geo-Arbitrage:</span> Live in a low-cost country, exclude income from US taxes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-amber-500" />
                    <span><span className="font-medium">HSA Stealth IRA:</span> Max HSA, invest aggressively, pay medical out-of-pocket, reimburse later</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-amber-500/20">
                  Consult a tax professional for your specific situation. Tax laws change annually.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      ) : (
        <LockedModule
          title="Tax Optimization Strategies"
          description="Advanced tax strategies for US taxpayers"
          icon={<Landmark className="h-5 w-5 text-amber-500" />}
          benefits={["FEIE (Foreign Earned Income Exclusion)", "S-Corp election strategies", "Solo 401(k) optimization", "HSA triple tax advantage"]}
        />
      )}

      {/* No data warning */}
      {netWorthEntries.length === 0 && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-600">No Net Worth Data</p>
                <p className="text-sm text-slate-500 mt-1">
                  Add net worth entries to see personalized calculations based on your current financial situation and savings rate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spending Weights & Cost Breakdown - Side by Side */}
      {isPro ? (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Spending Category Weights */}
          <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-slate-900">Spending Category Weights</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={resetWeights}
                className="text-xs"
              >
                Reset to Default
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {Object.entries(weights).map(([category, weight]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="capitalize">{category}</Label>
                    <span className="text-sm font-medium">{(weight * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[weight * 100]}
                    onValueChange={(value) => handleWeightChange(category as keyof SpendingWeights, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Weight</span>
                <span className={`font-medium ${Math.abs(totalWeights - 1.0) > 0.05 ? 'text-red-500' : 'text-green-600'}`}>
                  {(totalWeights * 100).toFixed(0)}%
                </span>
              </div>
              {Math.abs(totalWeights - 1.0) > 0.05 && (
                <p className="text-xs text-red-500 mt-1">
                  Warning: Weights should sum to 100%
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        {selectedCity && results && errors.length === 0 && (
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-900">
                Cost Breakdown in {selectedCity.city_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Housing", index: selectedCity.housing_index, weight: weights.housing },
                  { label: "Food", index: selectedCity.food_index, weight: weights.food },
                  { label: "Transport", index: selectedCity.transport_index, weight: weights.transport },
                  { label: "Healthcare", index: selectedCity.healthcare_index, weight: weights.healthcare },
                  { label: "Utilities", index: selectedCity.utilities_index, weight: weights.utilities },
                  { label: "Lifestyle", index: selectedCity.base_index, weight: weights.lifestyle },
                ].map((category) => {
                  const monthlyCost = (results.adjustedSpend / 12) * category.weight;
                  return (
                    <div key={category.label} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.label}</span>
                        <span className="text-slate-500">({(category.weight * 100).toFixed(0)}%)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">Index: {category.index}</span>
                        <span className="font-medium">{formatCurrency(monthlyCost)}/mo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Total Monthly</span>
                  <span className="text-primary">{formatCurrency(results.monthlySpend)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium mt-1">
                  <span>Total Annual</span>
                  <span className="text-primary">{formatCurrency(results.adjustedSpend)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      ) : (
        <LockedModule
          title="Spending Analysis & Cost Breakdown"
          description="Customize spending weights and see detailed cost breakdown by category"
          icon={<Calculator className="h-5 w-5 text-emerald-600" />}
          benefits={["Adjust spending category weights", "Detailed cost breakdown by city", "Monthly vs annual spending analysis"]}
        />
      )}

      {/* Validation Errors and Warnings */}
      {errors.length > 0 && (
        <Card className={errors.some(e => !e.startsWith('Warning:')) ? "border-red-500/20 bg-red-500/5" : "border-yellow-500/20 bg-yellow-500/5"}>
          <CardContent className="pt-6">
            <div className="space-y-1">
              {errors.map((error, idx) => (
                <p
                  key={idx}
                  className={`text-sm ${error.startsWith('Warning:') ? 'text-yellow-600' : 'text-red-500'}`}
                >
                  • {error}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {results && errors.filter(e => !e.startsWith('Warning:')).length === 0 && (
        isPro ? (
        <>
          {/* Key Metrics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Adjusted Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(results.adjustedSpend)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {formatCurrency(results.monthlySpend)}/month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Safe Withdrawal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(safeWithdrawalAmount)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {withdrawalRate}% × Current Net Worth ({formatCurrency(currentNetWorth)})
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Required Net Worth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(results.requiredNetWorth)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  To retire in {selectedCity?.city_name} at {withdrawalRate}% withdrawal
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Years to Retirement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isFinite(results.yearsToRetirement)
                    ? results.yearsToRetirement.toFixed(1)
                    : "∞"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isFinite(results.yearsToRetirement)
                    ? `Gap: ${formatCurrency(results.savingsGap)}`
                    : "Goal not reachable"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Projection Chart */}
          <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Net Worth Projection
              </CardTitle>
              <div className="text-sm text-slate-600 mt-2 space-y-2">
                <p>
                  This projection shows your path to financial independence. The horizontal lines represent your "finish line"—when your portfolio can sustain your lifestyle indefinitely.
                </p>
                <p className="text-xs text-slate-500">
                  Based on {formatPercent(parseFloat(expectedReturn) / 100)} annual return and {formatCurrency(annualSavings)}/year savings. Remember: your savings rate matters more than investment returns in the early years. Control what you can control.
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Legend explanation */}
              <div className="mb-6 space-y-3">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-primary rounded"></div>
                    <span className="text-slate-500">Your Net Worth Projection</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-medium">City Retirement Thresholds:</span> Horizontal lines show required net worth for each city
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  {allCitiesComparison.slice(0, 6).map((item, idx) => {
                    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
                    return (
                      <div key={item.city.city_id} className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-0.5"
                          style={{ backgroundColor: colors[idx], borderTop: `2px dashed ${colors[idx]}` }}
                        />
                        <span className="text-slate-500">
                          {item.city.city_name} ({formatCurrency(item.requiredNW)})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={450}>
                  <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      {/* Gradient for the area fill */}
                      <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                      {/* Glow effect for the line */}
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                    <XAxis
                      dataKey="year"
                      stroke="#94a3b8"
                      tick={{ fill: "#64748b", fontSize: 14, fontWeight: 500 }}
                      label={{
                        value: "Years from Now",
                        position: "insideBottom",
                        offset: -10,
                        fill: "#64748b",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    />

                    <YAxis
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                        return `$${(value / 1000).toFixed(0)}k`;
                      }}
                      stroke="#94a3b8"
                      tick={{ fill: "#64748b", fontSize: 14, fontWeight: 500 }}
                      width={70}
                    />

                    {/* Custom Tooltip */}
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const netWorth = data["Net Worth"] as number;
                          const distanceToGoal = results.requiredNetWorth - netWorth;
                          const percentToGoal = (netWorth / results.requiredNetWorth) * 100;

                          // Find cities you can retire in at this net worth
                          const citiesCanRetire = allCitiesComparison.filter(c => netWorth >= c.requiredNW);
                          const nextCity = allCitiesComparison.find(c => netWorth < c.requiredNW);

                          return (
                            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[250px]">
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  Year {label}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500 dark:text-gray-400 text-sm">Net Worth</span>
                                  <span className="font-bold text-primary text-lg">{formatCurrency(netWorth)}</span>
                                </div>

                                {citiesCanRetire.length > 0 && (
                                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <span className="text-xs text-green-600 font-medium">
                                      Can retire in: {citiesCanRetire.slice(0, 3).map(c => c.city.city_name).join(', ')}
                                      {citiesCanRetire.length > 3 && ` +${citiesCanRetire.length - 3} more`}
                                    </span>
                                  </div>
                                )}

                                {nextCity && (
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">Next: {nextCity.city.city_name}</span>
                                    <span className="text-slate-500">{formatCurrency(nextCity.requiredNW - netWorth)} away</span>
                                  </div>
                                )}

                                {/* Progress bar to selected city */}
                                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Progress to {selectedCity?.city_name}</span>
                                    <span className={percentToGoal >= 100 ? 'text-green-600' : 'text-slate-500'}>
                                      {percentToGoal.toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        percentToGoal >= 100 ? 'bg-green-600' : 'bg-primary'
                                      }`}
                                      style={{ width: `${Math.min(percentToGoal, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {/* City retirement threshold lines */}
                    {allCitiesComparison.slice(0, 6).map((item, idx) => {
                      const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
                      return (
                        <ReferenceLine
                          key={item.city.city_id}
                          y={item.requiredNW}
                          stroke={colors[idx]}
                          strokeWidth={idx === 0 ? 2 : 1.5}
                          strokeDasharray="8 4"
                          label={{
                            value: item.city.city_name,
                            position: 'right',
                            fill: colors[idx],
                            fontSize: 10,
                          }}
                        />
                      );
                    })}

                    {/* Area fill under the line */}
                    <Area
                      type="monotone"
                      dataKey="Net Worth"
                      stroke="none"
                      fill="url(#netWorthGradient)"
                    />

                    {/* Main net worth line */}
                    <Line
                      type="monotone"
                      dataKey="Net Worth"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      dot={false}
                      activeDot={{ r: 7, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-slate-500">
                  No projection data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Cities Comparison */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Globe className="h-5 w-5 text-emerald-600" />
                All Cities Comparison
              </CardTitle>
              <div className="text-sm text-slate-600 mt-2 space-y-2">
                <p>
                  Geographic arbitrage is one of the most powerful wealth acceleration strategies available. Moving to a lower cost-of-living city can shave years—sometimes decades—off your timeline to financial independence.
                </p>
                <p className="text-xs text-slate-500">
                  Based on your {formatCurrency(parseFloat(currentSpend))} annual spending in {currentCity?.city_name || "your current city"} • Current Net Worth: {formatCurrency(currentNetWorth)}. Each city shows how location impacts your retirement timeline and required wealth.
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10">City</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Years</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Net Worth</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Withdrawal</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Required</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Annual Cost</TableHead>
                      <TableHead className="text-right whitespace-nowrap">COL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allCitiesComparison.map((item) => (
                      <TableRow
                        key={item.city.city_id}
                        className={
                          item.city.city_id === selectedCityId
                            ? "bg-primary/10"
                            : item.canRetireNow
                            ? "bg-green-600/5"
                            : ""
                        }
                      >
                        <TableCell className="font-medium sticky left-0 bg-background z-10">
                          <div className="flex items-center gap-1 sm:gap-2">
                            {item.canRetireNow && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                            <div className="min-w-0">
                              <span className="text-xs sm:text-sm">{item.city.city_name}</span>
                              <span className="text-xs text-slate-500 hidden sm:inline ml-1">{item.city.country}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${item.canRetireNow ? "text-green-600" : ""}`}>
                          {item.canRetireNow
                            ? "Now!"
                            : isFinite(item.yearsToRetirement)
                            ? `${item.yearsToRetirement.toFixed(1)} yrs`
                            : "∞"}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(currentNetWorth)}
                        </TableCell>
                        <TableCell className={`text-right ${item.withdrawalAmount >= item.adjustedSpend ? "text-green-600" : "text-slate-500"}`}>
                          {formatCurrency(item.withdrawalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.requiredNW)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.adjustedSpend)}
                        </TableCell>
                        <TableCell className={`text-right ${item.relativeMultiplier < 1 ? "text-green-600" : item.relativeMultiplier > 1 ? "text-red-500" : ""}`}>
                          {(item.relativeMultiplier * 100).toFixed(0)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
        ) : (
          <>
            <LockedModule
              title="Key Metrics"
              description="View adjusted spending, safe withdrawal, required net worth, and years to retirement"
              icon={<Calculator className="h-5 w-5 text-emerald-600" />}
              benefits={["Adjusted spending by location", "Safe withdrawal calculations", "Required net worth", "Years to retirement"]}
            />
            <LockedModule
              title="Net Worth Projection"
              description="Interactive chart showing your path to retirement with city thresholds"
              icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
              benefits={["Retirement timeline projection", "Multiple city thresholds", "Interactive tooltips"]}
            />
            <LockedModule
              title="All Cities Comparison"
              description="Compare retirement requirements across all available cities"
              icon={<Globe className="h-5 w-5 text-emerald-600" />}
              benefits={["Compare all cities", "Years to retirement by location", "Cost-of-living multipliers"]}
            />
          </>
        )
      )}

      {/* Feedback Widget */}
      <div className="flex justify-center mt-6">
        <FeedbackWidget
          pageName="retirement-calculator"
          variant="inline"
          triggerText="Missing something? Let us know"
        />
      </div>
      </div>
    </div>
  );
}

export default function RetirementPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    }>
      <RetirementPageContent />
    </Suspense>
  );
}
