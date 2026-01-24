"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  ArrowRight,
  CalendarIcon,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import type { NetWorthEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, subMonths, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, subQuarters, subYears } from "date-fns";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type PresetRange = "all" | "this-month" | "last-month" | "this-quarter" | "last-quarter" | "ytd" | "last-year" | "custom";

const ASSET_COLORS = {
  stocks: "#f97316",
  bonds: "#3b82f6",
  cash: "#22c55e",
  real_estate: "#8b5cf6",
  points_value: "#eab308",
  other_assets: "#6b7280",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getPresetDateRange(preset: PresetRange): DateRange {
  const now = new Date();
  switch (preset) {
    case "this-month":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case "last-month":
      const lastMonth = subMonths(now, 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    case "this-quarter":
      return { from: startOfQuarter(now), to: endOfQuarter(now) };
    case "last-quarter":
      const lastQuarter = subQuarters(now, 1);
      return { from: startOfQuarter(lastQuarter), to: endOfQuarter(lastQuarter) };
    case "ytd":
      return { from: startOfYear(now), to: now };
    case "last-year":
      const lastYear = subYears(now, 1);
      return { from: startOfYear(lastYear), to: new Date(lastYear.getFullYear(), 11, 31) };
    case "all":
    default:
      return { from: undefined, to: undefined };
  }
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<NetWorthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [presetRange, setPresetRange] = useState<PresetRange>("all");

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/net-worth");
        if (!response.ok) {
          throw new Error("Failed to fetch entries");
        }
        const result = await response.json();
        setEntries(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  // Handle preset change
  const handlePresetChange = (value: PresetRange) => {
    setPresetRange(value);
    if (value !== "custom") {
      setDateRange(getPresetDateRange(value));
    }
  };

  // Filter entries by date range
  const filteredEntries = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return entries;

    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      if (dateRange.from && entryDate < dateRange.from) return false;
      if (dateRange.to && entryDate > dateRange.to) return false;
      return true;
    });
  }, [entries, dateRange]);

  // Calculate stats from filtered entries
  const latestEntry = filteredEntries[0];
  const previousEntry = filteredEntries[1];
  const monthlyChange = latestEntry && previousEntry
    ? latestEntry.net_worth - previousEntry.net_worth
    : 0;
  const monthlyChangePercent = previousEntry && previousEntry.net_worth !== 0
    ? ((monthlyChange / previousEntry.net_worth) * 100).toFixed(1)
    : "0";

  // Prepare chart data (chronological order)
  const chartData = useMemo(() => {
    return [...filteredEntries]
      .reverse()
      .map((entry) => ({
        date: formatDateShort(entry.date),
        netWorth: Number(entry.net_worth),
        stocks: Number(entry.stocks),
        bonds: Number(entry.bonds),
        cash: Number(entry.cash),
        real_estate: Number(entry.real_estate),
        points_value: Number(entry.points_value),
        other_assets: Number(entry.other_assets),
      }));
  }, [filteredEntries]);

  // Asset allocation data for pie chart
  const allocationData = useMemo(() => {
    if (!latestEntry) return [];
    const total = Number(latestEntry.total_assets);
    if (total === 0) return [];

    return [
      { name: "Stocks", value: Number(latestEntry.stocks), color: ASSET_COLORS.stocks },
      { name: "Bonds", value: Number(latestEntry.bonds), color: ASSET_COLORS.bonds },
      { name: "Cash", value: Number(latestEntry.cash), color: ASSET_COLORS.cash },
      { name: "Real Estate", value: Number(latestEntry.real_estate), color: ASSET_COLORS.real_estate },
      { name: "Points", value: Number(latestEntry.points_value), color: ASSET_COLORS.points_value },
      { name: "Other", value: Number(latestEntry.other_assets), color: ASSET_COLORS.other_assets },
    ].filter((item) => item.value > 0);
  }, [latestEntry]);

  // Stacked bar chart data for allocation over time
  const allocationOverTimeData = useMemo(() => {
    return chartData.map((entry) => {
      const total = entry.stocks + entry.bonds + entry.cash + entry.real_estate + entry.points_value + entry.other_assets;
      if (total === 0) return { ...entry, stocksPct: 0, bondsPct: 0, cashPct: 0, realEstatePct: 0, pointsPct: 0, otherPct: 0 };
      return {
        date: entry.date,
        stocksPct: (entry.stocks / total) * 100,
        bondsPct: (entry.bonds / total) * 100,
        cashPct: (entry.cash / total) * 100,
        realEstatePct: (entry.real_estate / total) * 100,
        pointsPct: (entry.points_value / total) * 100,
        otherPct: (entry.other_assets / total) * 100,
      };
    });
  }, [chartData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your financial progress over time
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Date Range Dropdown */}
          <Select value={presetRange} onValueChange={(v) => handlePresetChange(v as PresetRange)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  "Pick dates"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  setDateRange({ from: range?.from, to: range?.to });
                  setPresetRange("custom");
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Link href="/net-worth">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards - Now 5 columns */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Worth
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestEntry ? formatCurrency(latestEntry.net_worth) : "$0"}
            </div>
            {latestEntry && (
              <p className="text-xs text-muted-foreground">
                as of {formatDateShort(latestEntry.date)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Change
            </CardTitle>
            {monthlyChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                monthlyChange >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {monthlyChange >= 0 ? "+" : ""}
              {formatCurrency(monthlyChange)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyChange >= 0 ? "+" : ""}
              {monthlyChangePercent}% from last entry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestEntry ? formatCurrency(latestEntry.total_assets) : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredEntries.length} entries in range
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Points
            </CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {latestEntry ? formatCurrency(latestEntry.points_value) : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">Points value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Debts
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {latestEntry ? formatCurrency(latestEntry.total_debts) : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">Outstanding balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Net Worth Over Time</CardTitle>
          <Link href="/net-worth">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `$${(value / 1000).toFixed(0)}k`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [formatCurrency(value as number), ""]}
                  labelFormatter={(label) => String(label)}
                />
                <Line
                  type="monotone"
                  dataKey="netWorth"
                  name="Net Worth"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: "#f97316", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#f97316" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <p className="text-muted-foreground mb-4">
                No data in selected range. Try adjusting the date filter.
              </p>
              <Link href="/net-worth">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Allocation Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pie Chart - Current Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {allocationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [formatCurrency(value as number), ""]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No asset data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stacked Bar Chart - Allocation Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Allocation Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {allocationOverTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={allocationOverTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${(value as number).toFixed(1)}%`, ""]}
                  />
                  <Legend />
                  <Bar dataKey="stocksPct" name="Stocks" stackId="a" fill={ASSET_COLORS.stocks} />
                  <Bar dataKey="bondsPct" name="Bonds" stackId="a" fill={ASSET_COLORS.bonds} />
                  <Bar dataKey="cashPct" name="Cash" stackId="a" fill={ASSET_COLORS.cash} />
                  <Bar dataKey="realEstatePct" name="Real Estate" stackId="a" fill={ASSET_COLORS.real_estate} />
                  <Bar dataKey="pointsPct" name="Points" stackId="a" fill={ASSET_COLORS.points_value} />
                  <Bar dataKey="otherPct" name="Other" stackId="a" fill={ASSET_COLORS.other_assets} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:border-orange-500/50 transition-colors">
          <Link href="/net-worth">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">Net Worth Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage all your net worth entries
                </p>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:border-orange-500/50 transition-colors">
          <Link href="/settings">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-green-500/10">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Google Sheets Sync</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your spreadsheet for automatic sync
                </p>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
