"use client";

import { useState, useMemo } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LineChart,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Download,
  TrendingUp,
  AlertTriangle,
  Info,
  Target,
  DollarSign,
} from "lucide-react";

// Format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage
const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Monte Carlo simulation function
function runMonteCarloSimulation(
  initialPortfolio: number,
  annualWithdrawal: number,
  years: number,
  meanReturn: number,
  stdDeviation: number,
  iterations: number = 1000
): { year: number; successRate: number; medianBalance: number; p10: number; p90: number }[] {
  const results: number[][] = [];

  // Run simulations
  for (let i = 0; i < iterations; i++) {
    const simulation: number[] = [initialPortfolio];
    let balance = initialPortfolio;

    for (let year = 1; year <= years; year++) {
      // Generate random return using normal distribution (Box-Muller transform)
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const annualReturn = meanReturn + z0 * stdDeviation;

      // Apply return and withdrawal
      balance = balance * (1 + annualReturn / 100) - annualWithdrawal;
      simulation.push(Math.max(0, balance));
    }
    results.push(simulation);
  }

  // Calculate success rates and percentiles for each year
  const chartData: { year: number; successRate: number; medianBalance: number; p10: number; p90: number }[] = [];

  for (let year = 0; year <= years; year++) {
    const balancesAtYear = results.map(sim => sim[year]);
    const successCount = balancesAtYear.filter(b => b > 0).length;
    const successRate = (successCount / iterations) * 100;

    // Calculate percentiles
    const sorted = [...balancesAtYear].sort((a, b) => a - b);
    const p10Index = Math.floor(iterations * 0.1);
    const p50Index = Math.floor(iterations * 0.5);
    const p90Index = Math.floor(iterations * 0.9);

    chartData.push({
      year,
      successRate,
      medianBalance: sorted[p50Index],
      p10: sorted[p10Index],
      p90: sorted[p90Index],
    });
  }

  return chartData;
}

export default function WithdrawalStressTestPage() {
  const { isPro } = useSubscription();
  const [initialPortfolio, setInitialPortfolio] = useState(1000000);
  const [annualWithdrawal, setAnnualWithdrawal] = useState(40000);
  const [years, setYears] = useState(30);
  const [meanReturn, setMeanReturn] = useState(7);
  const [stdDeviation, setStdDeviation] = useState(15);
  const [iterations] = useState(1000);

  // Run simulation
  const simulationData = useMemo(() => {
    return runMonteCarloSimulation(
      initialPortfolio,
      annualWithdrawal,
      years,
      meanReturn,
      stdDeviation,
      iterations
    );
  }, [initialPortfolio, annualWithdrawal, years, meanReturn, stdDeviation, iterations]);

  // Calculate key metrics
  const finalSuccessRate = simulationData[simulationData.length - 1].successRate;
  const withdrawalRate = (annualWithdrawal / initialPortfolio) * 100;
  const yearsUntil90Percent = simulationData.findIndex(d => d.successRate < 90);
  const yearsUntil50Percent = simulationData.findIndex(d => d.successRate < 50);

  // Export to CSV
  const handleExport = () => {
    const headers = ["Year", "Success Rate (%)", "Median Balance", "10th Percentile", "90th Percentile"];
    const rows = simulationData.map(d => [
      d.year,
      d.successRate.toFixed(1),
      d.medianBalance.toFixed(0),
      d.p10.toFixed(0),
      d.p90.toFixed(0),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monte-carlo-simulation-${Date.now()}.csv`;
    a.click();
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-slate-900 mb-2">Year {data.year}</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-600 font-medium">
              Success Rate: {formatPercent(data.successRate)}
            </p>
            <p className="text-slate-600">
              Median Balance: {formatCurrency(data.medianBalance)}
            </p>
            <p className="text-slate-500 text-xs">
              10th-90th: {formatCurrency(data.p10)} - {formatCurrency(data.p90)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="">
      <div className="space-y-6 py-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            Withdrawal Stress Test
          </h1>
          <p className="text-slate-500 mt-1">
            Monte Carlo simulation to test your retirement withdrawal strategy
          </p>
        </div>

        {/* Educational Content */}
        <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Understanding Monte Carlo Simulations for Retirement Planning
                  </h3>
                  <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                    <p>
                      A Monte Carlo simulation is a sophisticated mathematical technique that runs thousands of hypothetical scenarios to assess the probability of your retirement plan succeeding. Rather than assuming your portfolio will grow at a fixed rate every year—which never happens in reality—this method accounts for market volatility by simulating hundreds or thousands of different return sequences, each with realistic variation.
                    </p>
                    <p>
                      <strong>Why this matters for your withdrawal strategy:</strong> The traditional "4% rule" was derived from historical data, but it doesn't account for sequence-of-returns risk—the danger of experiencing poor market performance early in retirement when you're making withdrawals. A Monte Carlo simulation reveals how different market conditions affect your plan's viability. If you retire into a bear market and withdraw aggressively, your portfolio may never recover. This tool shows you the probability of success under various scenarios.
                    </p>
                    <p>
                      <strong>How to interpret the results:</strong> The success rate represents the percentage of simulated scenarios where your portfolio lasted the full retirement period without running out of money. A 90% success rate means in 900 out of 1,000 simulations, your money lasted. Most financial advisors recommend targeting at least an 80-90% success rate, though your personal risk tolerance may vary. The chart also shows the median portfolio balance over time, plus the 10th and 90th percentile outcomes, giving you a sense of both best-case and worst-case scenarios.
                    </p>
                    <p>
                      <strong>Key variables that affect your outcome:</strong> Your withdrawal rate (annual spending divided by starting portfolio) is the primary driver. Higher withdrawal rates dramatically reduce success probability. Market return assumptions matter too—being too optimistic can give false confidence, while being too conservative may cause you to under-spend and miss enjoying your wealth. Volatility (standard deviation) captures how much returns fluctuate year-to-year; higher volatility increases the range of possible outcomes and slightly reduces success rates due to sequence-of-returns risk.
                    </p>
                    <p className="text-slate-600 italic">
                      As a financial advisor would tell you: run this simulation with your actual numbers, then stress-test it. What if you retire in a market crash? What if inflation is higher than expected? What if you live to 100? Understanding your plan's resilience across scenarios is more valuable than knowing a single projected outcome. This isn't about predicting the future—it's about understanding the range of possibilities and making informed decisions accordingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Panel */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Simulation Parameters</CardTitle>
            <CardDescription>Adjust your retirement scenario assumptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="portfolio" className="text-sm font-medium">
                  Starting Portfolio
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="portfolio"
                    type="number"
                    value={initialPortfolio}
                    onChange={(e) => setInitialPortfolio(Number(e.target.value))}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="withdrawal" className="text-sm font-medium">
                  Annual Withdrawal
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="withdrawal"
                    type="number"
                    value={annualWithdrawal}
                    onChange={(e) => setAnnualWithdrawal(Number(e.target.value))}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="years" className="text-sm font-medium">
                  Time Horizon (Years)
                </Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="return" className="text-sm font-medium">
                  Expected Return (%)
                </Label>
                <Input
                  id="return"
                  type="number"
                  step="0.1"
                  value={meanReturn}
                  onChange={(e) => setMeanReturn(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="volatility" className="text-sm font-medium">
                  Volatility (Std Dev %)
                </Label>
                <Input
                  id="volatility"
                  type="number"
                  step="0.1"
                  value={stdDeviation}
                  onChange={(e) => setStdDeviation(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <div className="w-full">
                  <Label className="text-sm font-medium">Withdrawal Rate</Label>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">
                    {withdrawalRate.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`border-2 ${finalSuccessRate >= 90 ? 'border-emerald-500 bg-emerald-50' : finalSuccessRate >= 75 ? 'border-amber-500 bg-amber-50' : 'border-red-500 bg-red-50'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Success Rate</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: finalSuccessRate >= 90 ? '#10b981' : finalSuccessRate >= 75 ? '#f59e0b' : '#ef4444' }}>
                    {formatPercent(finalSuccessRate)}
                  </p>
                </div>
                <Target className="h-10 w-10" style={{ color: finalSuccessRate >= 90 ? '#10b981' : finalSuccessRate >= 75 ? '#f59e0b' : '#ef4444' }} />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {finalSuccessRate >= 90 ? 'Excellent probability' : finalSuccessRate >= 75 ? 'Moderate risk' : 'High risk of depletion'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Years Until 90% Success</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {yearsUntil90Percent > 0 ? yearsUntil90Percent : years}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-blue-500" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {yearsUntil90Percent > 0 ? 'High confidence horizon' : 'Full period covered'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Final Median Balance</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {formatCurrency(simulationData[simulationData.length - 1].medianBalance)}
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-emerald-500" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Expected balance at year {years}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {isPro ? (
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">
                Retirement Success Probability Over Time
              </CardTitle>
              <CardDescription className="mt-1">
                Based on {iterations.toLocaleString()} Monte Carlo simulations
              </CardDescription>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={simulationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  tick={{ fill: "#64748b", fontSize: 14, fontWeight: 500 }}
                  label={{ value: "Years in Retirement", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 14, fontWeight: 500 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: "#64748b", fontSize: 14, fontWeight: 500 }}
                  tickFormatter={(value) => `${value}%`}
                  label={{ value: "Success Rate", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 14, fontWeight: 500 }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={90} stroke="#10b981" strokeDasharray="3 3" label={{ value: "90%", fill: "#10b981", fontSize: 13, fontWeight: 600 }} />
                <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "75%", fill: "#f59e0b", fontSize: 13, fontWeight: 600 }} />
                <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "50%", fill: "#ef4444", fontSize: 13, fontWeight: 600 }} />
                <Area
                  type="monotone"
                  dataKey="successRate"
                  stroke="none"
                  fill="url(#successGradient)"
                  isAnimationActive={true}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, fill: "#10b981" }}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </ComposedChart>
            </ResponsiveContainer>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border border-slate-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-600">
                  <p className="font-medium text-slate-900 mb-1">Interpretation Guide</p>
                  <p>
                    The chart shows the probability that your portfolio will have a positive balance at each year.
                    A declining line indicates increasing risk of portfolio depletion over time.
                    Target at least 80-90% success rate for conservative planning.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        ) : (
          <LockedModule
            title="Retirement Success Probability Over Time"
            description="Monte Carlo simulation showing probability of portfolio success over your retirement timeline"
            icon={<Activity className="h-5 w-5 text-emerald-600" />}
            benefits={[
              "Visual chart with success probability over time",
              "Reference lines at 90%, 75%, and 50% thresholds",
              "Animated, interactive visualization",
              "Based on 1,000 Monte Carlo simulations"
            ]}
          />
        )}

        {/* Data Table */}
        {isPro ? (
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Detailed Simulation Results</CardTitle>
                  <CardDescription>Year-by-year breakdown of all variables</CardDescription>
                </div>
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Success Rate</TableHead>
                    <TableHead className="text-right">Median Balance</TableHead>
                    <TableHead className="text-right">10th Percentile</TableHead>
                    <TableHead className="text-right">90th Percentile</TableHead>
                    <TableHead className="text-right">Annual Withdrawal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulationData.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="font-medium">{row.year}</TableCell>
                      <TableCell className={`text-right font-medium ${row.successRate >= 90 ? 'text-emerald-600' : row.successRate >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                        {formatPercent(row.successRate)}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(row.medianBalance)}</TableCell>
                      <TableCell className="text-right text-slate-500">{formatCurrency(row.p10)}</TableCell>
                      <TableCell className="text-right text-slate-500">{formatCurrency(row.p90)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(annualWithdrawal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        ) : (
          <LockedModule
            title="Detailed Simulation Results"
            description="Complete year-by-year breakdown with export functionality"
            icon={<Download className="h-5 w-5 text-emerald-600" />}
            benefits={[
              "Year-by-year success rates",
              "Median and percentile portfolio balances",
              "Annual withdrawal tracking",
              "CSV export for further analysis"
            ]}
          />
        )}
      </div>
    </div>
  );
}
