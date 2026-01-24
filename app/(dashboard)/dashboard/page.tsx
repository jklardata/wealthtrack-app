"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { NetWorthEntry, NetWorthFormData } from "@/lib/types";
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

const ASSET_LABELS: Record<string, string> = {
  stocks: "Stocks",
  bonds: "Bonds",
  cash: "Cash",
  real_estate: "Real Estate",
  points_value: "Points",
  other_assets: "Other",
};

type ChartRange = "3m" | "6m" | "1y" | "all";

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

// Custom tooltip component with category breakdown
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      fullDate: string;
      netWorth: number;
      stocks: number;
      bonds: number;
      cash: number;
      real_estate: number;
      points_value: number;
      other_assets: number;
      total_debts: number;
      entryId: string;
    };
  }>;
}

function NetWorthTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;
  const assets = [
    { key: "stocks", value: data.stocks, color: ASSET_COLORS.stocks },
    { key: "bonds", value: data.bonds, color: ASSET_COLORS.bonds },
    { key: "cash", value: data.cash, color: ASSET_COLORS.cash },
    { key: "real_estate", value: data.real_estate, color: ASSET_COLORS.real_estate },
    { key: "points_value", value: data.points_value, color: ASSET_COLORS.points_value },
    { key: "other_assets", value: data.other_assets, color: ASSET_COLORS.other_assets },
  ].filter((a) => a.value > 0);

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 shadow-lg min-w-[200px]">
      <div className="text-sm text-muted-foreground mb-2">{data.date}</div>
      <div className="text-lg font-bold text-white mb-3">
        {formatCurrency(data.netWorth)}
      </div>
      <div className="space-y-1 text-sm border-t border-[#333] pt-2">
        {assets.map((asset, index) => (
          <div key={asset.key} className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {index === assets.length - 1 ? "└─" : "├─"}
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: asset.color }}
            />
            <span className="text-muted-foreground">{ASSET_LABELS[asset.key]}:</span>
            <span className="text-white ml-auto">{formatCurrency(asset.value)}</span>
          </div>
        ))}
        {data.total_debts > 0 && (
          <div className="flex items-center gap-2 pt-1 border-t border-[#333] mt-1">
            <span className="text-muted-foreground">└─</span>
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Debts:</span>
            <span className="text-red-500 ml-auto">-{formatCurrency(data.total_debts)}</span>
          </div>
        )}
      </div>
      <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-[#333]">
        Click to edit this entry
      </div>
    </div>
  );
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
  const [chartRange, setChartRange] = useState<ChartRange>("all");
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const [editingEntry, setEditingEntry] = useState<NetWorthEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEntries = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Handle chart data point click
  const handleChartClick = (data: unknown) => {
    const chartData = data as { activePayload?: Array<{ payload: { entryId: string } }> };
    if (chartData.activePayload && chartData.activePayload[0]) {
      const entryId = chartData.activePayload[0].payload.entryId;
      const entry = entries.find((e) => e.id === entryId);
      if (entry) {
        setEditingEntry(entry);
        setIsEditDialogOpen(true);
      }
    }
  };

  // Handle entry update
  const handleUpdateEntry = async (formData: NetWorthFormData) => {
    if (!editingEntry) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/net-worth/${editingEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update entry");
      }

      await fetchEntries();
      setIsEditDialogOpen(false);
      setEditingEntry(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle category visibility
  const toggleCategory = (category: string) => {
    setHiddenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

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

  // Calculate growth metrics
  const growthMetrics = useMemo(() => {
    if (entries.length === 0) {
      return {
        thisMonth: { amount: 0, percent: 0 },
        ytd: { amount: 0, percent: 0 },
        allTime: { amount: 0, percent: 0 },
        avgMonthlyGrowth: 0,
        projectedYear: 0,
      };
    }

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const yearStart = startOfYear(now);

    // Sort entries chronologically (oldest first) for calculations
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const oldestEntry = sortedEntries[0];
    const newestEntry = sortedEntries[sortedEntries.length - 1];

    // This month growth
    const thisMonthEntries = sortedEntries.filter(
      (e) => new Date(e.date) >= currentMonthStart
    );
    const lastMonthEnd = sortedEntries
      .filter((e) => new Date(e.date) < currentMonthStart)
      .pop();
    const thisMonthStart = thisMonthEntries[0] || lastMonthEnd;
    const thisMonthAmount = thisMonthStart
      ? newestEntry.net_worth - thisMonthStart.net_worth
      : 0;
    const thisMonthPercent =
      thisMonthStart && thisMonthStart.net_worth !== 0
        ? (thisMonthAmount / thisMonthStart.net_worth) * 100
        : 0;

    // YTD growth
    const ytdStartEntry = sortedEntries.find((e) => new Date(e.date) >= yearStart);
    const beforeYtdEntry = sortedEntries
      .filter((e) => new Date(e.date) < yearStart)
      .pop();
    const ytdBaseEntry = beforeYtdEntry || ytdStartEntry || oldestEntry;
    const ytdAmount = newestEntry.net_worth - ytdBaseEntry.net_worth;
    const ytdPercent =
      ytdBaseEntry.net_worth !== 0
        ? (ytdAmount / ytdBaseEntry.net_worth) * 100
        : 0;

    // All time growth
    const allTimeAmount = newestEntry.net_worth - oldestEntry.net_worth;
    const allTimePercent =
      oldestEntry.net_worth !== 0
        ? (allTimeAmount / oldestEntry.net_worth) * 100
        : 0;

    // Average monthly growth
    const monthsDiff = Math.max(
      1,
      (new Date(newestEntry.date).getTime() - new Date(oldestEntry.date).getTime()) /
        (1000 * 60 * 60 * 24 * 30)
    );
    const avgMonthlyGrowth = allTimeAmount / monthsDiff;

    // Projected year-end value (assuming avg monthly growth continues)
    const monthsRemaining = 12 - now.getMonth();
    const projectedYear = newestEntry.net_worth + avgMonthlyGrowth * monthsRemaining;

    return {
      thisMonth: { amount: thisMonthAmount, percent: thisMonthPercent },
      ytd: { amount: ytdAmount, percent: ytdPercent },
      allTime: { amount: allTimeAmount, percent: allTimePercent },
      avgMonthlyGrowth,
      projectedYear,
    };
  }, [entries]);

  // Apply chart-specific date range filter
  const chartFilteredEntries = useMemo(() => {
    if (chartRange === "all") return filteredEntries;

    const now = new Date();
    let cutoffDate: Date;

    switch (chartRange) {
      case "3m":
        cutoffDate = subMonths(now, 3);
        break;
      case "6m":
        cutoffDate = subMonths(now, 6);
        break;
      case "1y":
        cutoffDate = subYears(now, 1);
        break;
      default:
        return filteredEntries;
    }

    return filteredEntries.filter((entry) => new Date(entry.date) >= cutoffDate);
  }, [filteredEntries, chartRange]);

  // Prepare chart data (chronological order)
  const chartData = useMemo(() => {
    return [...chartFilteredEntries]
      .reverse()
      .map((entry) => ({
        date: formatDateShort(entry.date),
        fullDate: entry.date,
        entryId: entry.id,
        netWorth: Number(entry.net_worth),
        stocks: Number(entry.stocks),
        bonds: Number(entry.bonds),
        cash: Number(entry.cash),
        real_estate: Number(entry.real_estate),
        points_value: Number(entry.points_value),
        other_assets: Number(entry.other_assets),
        total_debts: Number(entry.total_debts),
      }));
  }, [chartFilteredEntries]);

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

      {/* Growth Metrics Section */}
      {entries.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* This Month */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">This Month</p>
                <p
                  className={`text-xl font-bold ${
                    growthMetrics.thisMonth.amount >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {growthMetrics.thisMonth.amount >= 0 ? "+" : ""}
                  {formatCurrency(growthMetrics.thisMonth.amount)}
                </p>
                <p
                  className={`text-sm ${
                    growthMetrics.thisMonth.percent >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {growthMetrics.thisMonth.percent >= 0 ? "+" : ""}
                  {growthMetrics.thisMonth.percent.toFixed(1)}%
                </p>
              </div>

              {/* YTD */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">Year to Date</p>
                <p
                  className={`text-xl font-bold ${
                    growthMetrics.ytd.amount >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {growthMetrics.ytd.amount >= 0 ? "+" : ""}
                  {formatCurrency(growthMetrics.ytd.amount)}
                </p>
                <p
                  className={`text-sm ${
                    growthMetrics.ytd.percent >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {growthMetrics.ytd.percent >= 0 ? "+" : ""}
                  {growthMetrics.ytd.percent.toFixed(1)}%
                </p>
              </div>

              {/* All Time */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">All Time</p>
                <p
                  className={`text-xl font-bold ${
                    growthMetrics.allTime.amount >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {growthMetrics.allTime.amount >= 0 ? "+" : ""}
                  {formatCurrency(growthMetrics.allTime.amount)}
                </p>
                <p
                  className={`text-sm ${
                    growthMetrics.allTime.percent >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {growthMetrics.allTime.percent >= 0 ? "+" : ""}
                  {growthMetrics.allTime.percent.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Projection footer */}
            <div className="pt-4 border-t flex flex-col sm:flex-row justify-between gap-2 text-sm">
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">Avg Monthly Growth:</span>{" "}
                <span className={growthMetrics.avgMonthlyGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                  {growthMetrics.avgMonthlyGrowth >= 0 ? "+" : ""}
                  {formatCurrency(growthMetrics.avgMonthlyGrowth)}
                </span>
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">At this rate:</span>{" "}
                <span className="text-orange-500 font-medium">
                  {formatCurrency(growthMetrics.projectedYear)} by Dec {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Net Worth Chart */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Net Worth Over Time</CardTitle>
          <div className="flex items-center gap-2">
            {/* Chart-specific date range */}
            <div className="flex bg-muted rounded-lg p-1">
              {(["3m", "6m", "1y", "all"] as ChartRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-md transition-colors",
                    chartRange === range
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {range === "all" ? "All" : range.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href="/net-worth">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <>
              {/* Category Legend with Toggle */}
              <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-border">
                <button
                  onClick={() => toggleCategory("netWorth")}
                  className={cn(
                    "flex items-center gap-2 text-sm px-2 py-1 rounded transition-opacity",
                    hiddenCategories.has("netWorth") ? "opacity-40" : "opacity-100"
                  )}
                >
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>Net Worth</span>
                </button>
                {Object.entries(ASSET_COLORS).map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => toggleCategory(key)}
                    className={cn(
                      "flex items-center gap-2 text-sm px-2 py-1 rounded transition-opacity",
                      hiddenCategories.has(key) ? "opacity-40" : "opacity-100"
                    )}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span>{ASSET_LABELS[key]}</span>
                  </button>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} onClick={handleChartClick} style={{ cursor: "pointer" }}>
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
                  <Tooltip content={<NetWorthTooltip />} />
                  {!hiddenCategories.has("netWorth") && (
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      name="Net Worth"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 8, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
                    />
                  )}
                  {!hiddenCategories.has("stocks") && (
                    <Line
                      type="monotone"
                      dataKey="stocks"
                      name="Stocks"
                      stroke={ASSET_COLORS.stocks}
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                  {!hiddenCategories.has("bonds") && (
                    <Line
                      type="monotone"
                      dataKey="bonds"
                      name="Bonds"
                      stroke={ASSET_COLORS.bonds}
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                  {!hiddenCategories.has("cash") && (
                    <Line
                      type="monotone"
                      dataKey="cash"
                      name="Cash"
                      stroke={ASSET_COLORS.cash}
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                  {!hiddenCategories.has("real_estate") && (
                    <Line
                      type="monotone"
                      dataKey="real_estate"
                      name="Real Estate"
                      stroke={ASSET_COLORS.real_estate}
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                  {!hiddenCategories.has("points_value") && (
                    <Line
                      type="monotone"
                      dataKey="points_value"
                      name="Points"
                      stroke={ASSET_COLORS.points_value}
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                  {!hiddenCategories.has("other_assets") && (
                    <Line
                      type="monotone"
                      dataKey="other_assets"
                      name="Other"
                      stroke={ASSET_COLORS.other_assets}
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </>
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

      {/* Edit Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setEditingEntry(null);
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <EditEntryForm
              entry={editingEntry}
              onSubmit={handleUpdateEntry}
              onClose={() => {
                setIsEditDialogOpen(false);
                setEditingEntry(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Entry Form Component
interface EditEntryFormProps {
  entry: NetWorthEntry;
  onSubmit: (data: NetWorthFormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

function EditEntryForm({ entry, onSubmit, onClose, isSubmitting }: EditEntryFormProps) {
  const [formData, setFormData] = useState<NetWorthFormData>({
    date: entry.date,
    stocks: entry.stocks,
    bonds: entry.bonds,
    cash: entry.cash,
    real_estate: entry.real_estate,
    points_value: entry.points_value,
    other_assets: entry.other_assets,
    total_debts: entry.total_debts,
    notes: entry.notes || "",
  });

  const totalAssets =
    Number(formData.stocks) +
    Number(formData.bonds) +
    Number(formData.cash) +
    Number(formData.real_estate) +
    Number(formData.points_value) +
    Number(formData.other_assets);

  const netWorth = totalAssets - Number(formData.total_debts);

  const handleChange = (field: keyof NetWorthFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      stocks: Number(formData.stocks),
      bonds: Number(formData.bonds),
      cash: Number(formData.cash),
      real_estate: Number(formData.real_estate),
      points_value: Number(formData.points_value),
      other_assets: Number(formData.other_assets),
      total_debts: Number(formData.total_debts),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stocks">Stocks</Label>
          <Input
            id="stocks"
            type="number"
            step="0.01"
            value={formData.stocks}
            onChange={(e) => handleChange("stocks", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bonds">Bonds</Label>
          <Input
            id="bonds"
            type="number"
            step="0.01"
            value={formData.bonds}
            onChange={(e) => handleChange("bonds", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cash">Cash</Label>
          <Input
            id="cash"
            type="number"
            step="0.01"
            value={formData.cash}
            onChange={(e) => handleChange("cash", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="real_estate">Real Estate</Label>
          <Input
            id="real_estate"
            type="number"
            step="0.01"
            value={formData.real_estate}
            onChange={(e) => handleChange("real_estate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="points_value">Points Value</Label>
          <Input
            id="points_value"
            type="number"
            step="0.01"
            value={formData.points_value}
            onChange={(e) => handleChange("points_value", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="other_assets">Other Assets</Label>
          <Input
            id="other_assets"
            type="number"
            step="0.01"
            value={formData.other_assets}
            onChange={(e) => handleChange("other_assets", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_debts">Total Debts</Label>
        <Input
          id="total_debts"
          type="number"
          step="0.01"
          value={formData.total_debts}
          onChange={(e) => handleChange("total_debts", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          type="text"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Any notes about this entry..."
        />
      </div>

      <div className="pt-4 border-t space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Assets</span>
          <span className="font-medium">{formatCurrency(totalAssets)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Debts</span>
          <span className="font-medium text-red-500">
            -{formatCurrency(Number(formData.total_debts))}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Net Worth</span>
          <span className={netWorth >= 0 ? "text-green-500" : "text-red-500"}>
            {formatCurrency(netWorth)}
          </span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-orange-500 hover:bg-orange-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Update Entry"}
        </Button>
      </div>
    </form>
  );
}
