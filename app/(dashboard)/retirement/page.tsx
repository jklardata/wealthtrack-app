"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, MapPin, Calculator, DollarSign, Globe, CheckCircle, Clock } from "lucide-react";
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
import type { NetWorthEntry } from "@/lib/types";

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

export default function RetirementPage() {
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
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
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

  // Format chart data
  const chartData = results?.projections.map((p) => ({
    year: p.year,
    "Net Worth": p.netWorth,
  })) || [];

  if (loadingNetWorth) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-orange-500" />
          Retirement Calculator
        </h1>
        <p className="text-muted-foreground">
          Plan your retirement with cost-of-living adjustments
        </p>
      </div>

      {/* Dynamic Headline */}
      {currentNetWorth > 0 && (
        <Card className={citiesCanRetireNow.length > 0 ? "border-green-500/30 bg-green-500/5" : "border-orange-500/30 bg-orange-500/5"}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {citiesCanRetireNow.length > 0 ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-lg font-semibold text-green-600">
                      You can retire today in {cheapestRetireNow?.city.city_name}!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      With your {formatCurrency(currentNetWorth)} net worth, you could retire in{" "}
                      <span className="font-medium">{citiesCanRetireNow.length} {citiesCanRetireNow.length === 1 ? "city" : "cities"}</span> right now.
                      {citiesCanRetireNow.length > 1 && (
                        <> Including: {citiesCanRetireNow.slice(0, 3).map(c => c.city.city_name).join(", ")}{citiesCanRetireNow.length > 3 && ` and ${citiesCanRetireNow.length - 3} more`}.</>
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="h-6 w-6 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-lg font-semibold text-orange-600">
                      {nextMilestone && isFinite(nextMilestone.yearsToRetirement)
                        ? `${nextMilestone.yearsToRetirement.toFixed(1)} years to retire in ${nextMilestone.city.city_name}`
                        : "Keep saving to reach your retirement goal!"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current net worth: {formatCurrency(currentNetWorth)} •
                      Need {nextMilestone ? formatCurrency(nextMilestone.requiredNW) : "more savings"} to retire in the most affordable city.
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No data warning */}
      {netWorthEntries.length === 0 && (
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-500">No Net Worth Data</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add net worth entries to see personalized calculations based on your current financial situation and savings rate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            Retirement Location & Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentCity">Current City (Baseline)</Label>
                <Select value={currentCityId} onValueChange={setCurrentCityId}>
                  <SelectTrigger id="currentCity" className="w-full">
                    <SelectValue placeholder="Select your current city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city.city_id} value={city.city_id}>
                        {city.city_name}, {city.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentCity && (
                  <p className="text-xs text-muted-foreground">
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
                    {CITIES.map((city) => (
                      <SelectItem key={city.city_id} value={city.city_id}>
                        {city.city_name}, {city.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCity && currentCity && (
                  <p className="text-xs text-muted-foreground">
                    {((calculateEffectiveCOL(selectedCity, weights) / calculateEffectiveCOL(currentCity, weights)) * 100).toFixed(0)}% of {currentCity.city_name}&apos;s cost • Confidence: {selectedCity.confidence}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentSpend">Current Annual Spending</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                <p className="text-xs text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
                  Annual return after inflation (historically ~7% for stocks, ~3% inflation)
                </p>
              </div>
            </div>

            {latestEntry && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <h4 className="text-sm font-medium">Your Financial Snapshot</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Net Worth</span>
                    <span className="font-medium">{formatCurrency(currentNetWorth)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Savings</span>
                    <span className={`font-medium ${annualSavings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(annualSavings)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Safe Withdrawal ({withdrawalRate}%)</span>
                    <span className="font-medium text-purple-500">{formatCurrency(safeWithdrawalAmount)}/yr</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Spending Weights & Cost Breakdown - Side by Side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Spending Category Weights */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Spending Category Weights</CardTitle>
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
                <span className="text-muted-foreground">Total Weight</span>
                <span className={`font-medium ${Math.abs(totalWeights - 1.0) > 0.05 ? 'text-red-500' : 'text-green-500'}`}>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
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
                        <span className="text-muted-foreground">({(category.weight * 100).toFixed(0)}%)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">Index: {category.index}</span>
                        <span className="font-medium">{formatCurrency(monthlyCost)}/mo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Total Monthly</span>
                  <span className="text-orange-500">{formatCurrency(results.monthlySpend)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium mt-1">
                  <span>Total Annual</span>
                  <span className="text-orange-500">{formatCurrency(results.adjustedSpend)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="space-y-1">
              {errors.map((error, idx) => (
                <p key={idx} className="text-sm text-red-500">
                  • {error}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {results && errors.length === 0 && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Effective COL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(results.effectiveCOL * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  of NYC cost
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Adjusted Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {formatCurrency(results.adjustedSpend)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(results.monthlySpend)}/month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Safe Withdrawal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">
                  {formatCurrency(safeWithdrawalAmount)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {withdrawalRate}% of {formatCurrency(currentNetWorth)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Required Net Worth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {formatCurrency(results.requiredNetWorth)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  at {withdrawalRate}% withdrawal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Years to Retirement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {isFinite(results.yearsToRetirement)
                    ? results.yearsToRetirement.toFixed(1)
                    : "∞"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isFinite(results.yearsToRetirement)
                    ? `Gap: ${formatCurrency(results.savingsGap)}`
                    : "Goal not reachable"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Projection Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Net Worth Projection</CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on {formatPercent(parseFloat(expectedReturn) / 100)} annual return and {formatCurrency(annualSavings)}/year savings
              </p>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="year"
                      label={{ value: "Years from Now", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      label={{ value: "Net Worth", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      formatter={(value) => value ? formatCurrency(value as number) : ''}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Legend />
                    <ReferenceLine
                      y={results.requiredNetWorth}
                      stroke="#22c55e"
                      strokeDasharray="5 5"
                      label={{ value: "Retirement Goal", position: "right" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Net Worth"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No projection data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Cities Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-500" />
                All Cities Comparison
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on your {formatCurrency(parseFloat(currentSpend))} annual spending in {currentCity?.city_name || "your current city"} • Current Net Worth: {formatCurrency(currentNetWorth)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City</TableHead>
                      <TableHead className="text-right">Years to Retire</TableHead>
                      <TableHead className="text-right">Net Worth</TableHead>
                      <TableHead className="text-right">Required NW</TableHead>
                      <TableHead className="text-right">Safe Withdrawal</TableHead>
                      <TableHead className="text-right">Annual Cost</TableHead>
                      <TableHead className="text-right">COL vs {currentCity?.city_name || "NYC"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allCitiesComparison.map((item) => (
                      <TableRow
                        key={item.city.city_id}
                        className={
                          item.city.city_id === selectedCityId
                            ? "bg-orange-500/10"
                            : item.canRetireNow
                            ? "bg-green-500/5"
                            : ""
                        }
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {item.canRetireNow && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {item.city.city_name}
                            <span className="text-xs text-muted-foreground">{item.city.country}</span>
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${item.canRetireNow ? "text-green-500" : ""}`}>
                          {item.canRetireNow
                            ? "Now!"
                            : isFinite(item.yearsToRetirement)
                            ? `${item.yearsToRetirement.toFixed(1)} yrs`
                            : "∞"}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(currentNetWorth)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.requiredNW)}
                        </TableCell>
                        <TableCell className={`text-right ${item.withdrawalAmount >= item.adjustedSpend ? "text-green-500" : "text-muted-foreground"}`}>
                          {formatCurrency(item.withdrawalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.adjustedSpend)}
                        </TableCell>
                        <TableCell className={`text-right ${item.relativeMultiplier < 1 ? "text-green-500" : item.relativeMultiplier > 1 ? "text-red-500" : ""}`}>
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
      )}
    </div>
  );
}
