"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
  BookOpen,
  Globe,
  Building2,
  Calculator,
  PiggyBank,
  FileText,
  Briefcase,
  CheckCircle2,
  X,
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

// Vibrant, distinct colors for better visibility
const ASSET_COLORS = {
  stocks: "#f97316", // Bright Orange
  bonds: "#0ea5e9", // Sky Blue
  cash: "#10b981", // Emerald Green
  real_estate: "#8b5cf6", // Violet Purple
  points_value: "#f59e0b", // Amber Yellow
  other_assets: "#64748b", // Slate Gray
};

// Gradient pairs for visual appeal
const ASSET_GRADIENTS = {
  stocks: { start: "#fb923c", end: "#ea580c" },
  bonds: { start: "#38bdf8", end: "#0284c7" },
  cash: { start: "#34d399", end: "#059669" },
  real_estate: { start: "#a78bfa", end: "#7c3aed" },
  points_value: { start: "#fbbf24", end: "#d97706" },
  other_assets: { start: "#94a3b8", end: "#475569" },
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
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg min-w-[200px]">
      <div className="text-sm text-slate-500 mb-2">{data.date}</div>
      <div className="text-lg font-semibold text-slate-900 mb-3">
        {formatCurrency(data.netWorth)}
      </div>
      <div className="space-y-1 text-sm border-t border-slate-200 pt-2">
        {assets.map((asset, index) => (
          <div key={asset.key} className="flex items-center gap-2">
            <span className="text-slate-400">
              {index === assets.length - 1 ? "└─" : "├─"}
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: asset.color }}
            />
            <span className="text-slate-500">{ASSET_LABELS[asset.key]}:</span>
            <span className="text-slate-900 ml-auto">{formatCurrency(asset.value)}</span>
          </div>
        ))}
        {data.total_debts > 0 && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200 mt-1">
            <span className="text-slate-400">└─</span>
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-500">Debts:</span>
            <span className="text-red-500 ml-auto">-{formatCurrency(data.total_debts)}</span>
          </div>
        )}
      </div>
      <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-200">
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
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";
  const [showSuccessBanner, setShowSuccessBanner] = useState(showSuccess);

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

    const data = [
      { name: "Stocks", key: "stocks", value: Number(latestEntry.stocks), color: ASSET_COLORS.stocks },
      { name: "Bonds", key: "bonds", value: Number(latestEntry.bonds), color: ASSET_COLORS.bonds },
      { name: "Cash", key: "cash", value: Number(latestEntry.cash), color: ASSET_COLORS.cash },
      { name: "Real Estate", key: "real_estate", value: Number(latestEntry.real_estate), color: ASSET_COLORS.real_estate },
      { name: "Points", key: "points_value", value: Number(latestEntry.points_value), color: ASSET_COLORS.points_value },
      { name: "Other", key: "other_assets", value: Number(latestEntry.other_assets), color: ASSET_COLORS.other_assets },
    ].filter((item) => item.value > 0);

    // Calculate percentages
    return data.map((item) => ({
      ...item,
      percent: (item.value / total) * 100,
    })).sort((a, b) => b.value - a.value); // Sort by value descending
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
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="bg-white border-slate-200">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state - show when no entries
  if (!loading && entries.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-slate-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Track net worth, optimize your portfolio, plan retirement, and maximize tax savings.
            </p>
          </div>

          {/* Empty State */}
          <Card className="bg-white border-slate-200 border-t-2 border-t-emerald-500">
            <CardContent className="py-12 sm:py-16">
              <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-medium text-slate-900 mb-2">Get Started with Your Financial Data</h2>
                <p className="text-slate-500 mb-6">
                  Add your first entry to start tracking your net worth and unlock powerful financial insights.
                </p>
                <div className="space-y-4 w-full">
                  <Link href="/net-worth">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Data Manually
                    </Button>
                  </Link>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">Or</span>
                    </div>
                  </div>
                  <Link href="/settings">
                    <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Connect Google Sheets Template
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-slate-500 mt-6">
                  Use our Google Sheets template to easily import your financial data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="flex items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-emerald-900">Welcome to Pro!</p>
              <p className="text-sm text-emerald-700">Your subscription is now active. Enjoy full access to all premium features!</p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="text-emerald-600 hover:text-emerald-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header with Date Filters */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Track net worth, optimize your portfolio, plan retirement, and maximize tax savings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Date Range Dropdown */}
          <Select value={presetRange} onValueChange={(v) => handlePresetChange(v as PresetRange)}>
            <SelectTrigger className="w-[120px] sm:w-[140px] bg-white border-slate-200 text-slate-700 text-sm">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
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
                  "justify-start text-left font-normal bg-white border-slate-200 text-slate-700 text-sm hidden sm:flex",
                  !dateRange.from && "text-slate-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  "Pick dates"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-slate-200" align="end">
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
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Entry</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards - Responsive grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
              Net Worth
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-semibold text-slate-900 font-mono">
              {latestEntry ? formatCurrency(latestEntry.net_worth) : "$0"}
            </div>
            {latestEntry && (
              <p className="text-xs text-emerald-600 mt-1">
                as of {formatDateShort(latestEntry.date)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
              Monthly Change
            </CardTitle>
            {monthlyChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div
              className={`text-lg sm:text-2xl font-semibold font-mono ${
                monthlyChange >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {monthlyChange >= 0 ? "+" : ""}
              {formatCurrency(monthlyChange)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {monthlyChange >= 0 ? "+" : ""}
              {monthlyChangePercent}% from last
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
              Total Assets
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-semibold text-slate-900 font-mono">
              {latestEntry ? formatCurrency(latestEntry.total_assets) : "$0"}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {filteredEntries.length} entries
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
              Points Value
            </CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-semibold text-amber-600 font-mono">
              {latestEntry ? formatCurrency(latestEntry.points_value) : "$0"}
            </div>
            <p className="text-xs text-slate-500 mt-1">Points value</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
              Total Debts
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-semibold text-red-500 font-mono">
              {latestEntry ? formatCurrency(latestEntry.total_debts) : "$0"}
            </div>
            <p className="text-xs text-slate-500 mt-1">Outstanding balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics Section */}
      {entries.length > 1 && (
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              {/* This Month */}
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs sm:text-sm text-slate-500 mb-1">This Month</p>
                <p
                  className={`text-lg sm:text-xl font-semibold font-mono ${
                    growthMetrics.thisMonth.amount >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {growthMetrics.thisMonth.amount >= 0 ? "+" : ""}
                  {formatCurrency(growthMetrics.thisMonth.amount)}
                </p>
                <p
                  className={`text-xs sm:text-sm ${
                    growthMetrics.thisMonth.percent >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {growthMetrics.thisMonth.percent >= 0 ? "+" : ""}
                  {growthMetrics.thisMonth.percent.toFixed(1)}%
                </p>
              </div>

              {/* YTD */}
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs sm:text-sm text-slate-500 mb-1">Year to Date</p>
                <p
                  className={`text-lg sm:text-xl font-semibold font-mono ${
                    growthMetrics.ytd.amount >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {growthMetrics.ytd.amount >= 0 ? "+" : ""}
                  {formatCurrency(growthMetrics.ytd.amount)}
                </p>
                <p
                  className={`text-xs sm:text-sm ${
                    growthMetrics.ytd.percent >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {growthMetrics.ytd.percent >= 0 ? "+" : ""}
                  {growthMetrics.ytd.percent.toFixed(1)}%
                </p>
              </div>

              {/* All Time */}
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs sm:text-sm text-slate-500 mb-1">All Time</p>
                <p
                  className={`text-lg sm:text-xl font-semibold font-mono ${
                    growthMetrics.allTime.amount >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {growthMetrics.allTime.amount >= 0 ? "+" : ""}
                  {formatCurrency(growthMetrics.allTime.amount)}
                </p>
                <p
                  className={`text-xs sm:text-sm ${
                    growthMetrics.allTime.percent >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {growthMetrics.allTime.percent >= 0 ? "+" : ""}
                  {growthMetrics.allTime.percent.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Projection footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-2 text-sm">
              <div className="text-slate-500">
                <span className="font-medium text-slate-700">Avg Monthly:</span>{" "}
                <span className={growthMetrics.avgMonthlyGrowth >= 0 ? "text-emerald-600" : "text-red-500"}>
                  {growthMetrics.avgMonthlyGrowth >= 0 ? "+" : ""}
                  {formatCurrency(growthMetrics.avgMonthlyGrowth)}
                </span>
              </div>
              <div className="text-slate-500">
                <span className="font-medium text-slate-700">Projected:</span>{" "}
                <span className="text-emerald-600 font-medium">
                  {formatCurrency(growthMetrics.projectedYear)} by Dec {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Net Worth Chart */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-slate-900">Net Worth Over Time</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Chart-specific date range */}
            <div className="flex bg-slate-100 rounded-lg p-1 flex-1 sm:flex-initial">
              {(["3m", "6m", "1y", "all"] as ChartRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={cn(
                    "px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors flex-1 sm:flex-initial",
                    chartRange === range
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {range === "all" ? "All" : range.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href="/net-worth" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
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
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 pb-4 border-b border-slate-200">
                <button
                  onClick={() => toggleCategory("netWorth")}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 py-1 rounded-lg transition-opacity",
                    hiddenCategories.has("netWorth") ? "opacity-40" : "opacity-100"
                  )}
                >
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                  <span className="text-slate-700">Net Worth</span>
                </button>
                {Object.entries(ASSET_COLORS).map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => toggleCategory(key)}
                    className={cn(
                      "flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 py-1 rounded-lg transition-opacity",
                      hiddenCategories.has(key) ? "opacity-40" : "opacity-100"
                    )}
                  >
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-slate-700">{ASSET_LABELS[key]}</span>
                  </button>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} onClick={handleChartClick} style={{ cursor: "pointer" }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `$${(value / 1000).toFixed(0)}k`
                    }
                    width={50}
                  />
                  <Tooltip content={<NetWorthTooltip />} />
                  {!hiddenCategories.has("netWorth") && (
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      name="Net Worth"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 8, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
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
              <p className="text-slate-500 mb-4">
                No data in selected range. Try adjusting the date filter.
              </p>
              <Link href="/net-worth">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {allocationData.length > 0 ? (
              <div className="space-y-4">
                {/* Pie Chart */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <defs>
                        {Object.entries(ASSET_GRADIENTS).map(([key, gradient]) => (
                          <linearGradient key={key} id={`dash-gradient-${key}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={gradient.start} />
                            <stop offset="100%" stopColor={gradient.end} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {allocationData.map((entry) => (
                          <Cell
                            key={`cell-${entry.key}`}
                            fill={`url(#dash-gradient-${entry.key})`}
                            className="drop-shadow-sm"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload;
                            return (
                              <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-slate-200">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="font-medium text-slate-900">{item.name}</span>
                                </div>
                                <div className="text-lg font-semibold mt-1 text-slate-900">{item.percent.toFixed(1)}%</div>
                                <div className="text-sm text-slate-500">
                                  {formatCurrency(item.value)}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-semibold text-slate-900 font-mono">
                        {formatCurrency(latestEntry?.total_assets || 0)}
                      </div>
                      <div className="text-xs text-slate-500">Total Assets</div>
                    </div>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2">
                  {allocationData.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-sm font-semibold" style={{ color: item.color }}>
                          {item.percent.toFixed(1)}%
                        </span>
                        <span className="text-xs text-slate-500 w-16 sm:w-20 text-right font-mono">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-500">
                No asset data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stacked Bar Chart - Allocation Over Time */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Allocation Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {allocationOverTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={allocationOverTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                    }}
                    formatter={(value) => [`${(value as number).toFixed(1)}%`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="stocksPct" name="Stocks" stackId="a" fill={ASSET_COLORS.stocks} />
                  <Bar dataKey="bondsPct" name="Bonds" stackId="a" fill={ASSET_COLORS.bonds} />
                  <Bar dataKey="cashPct" name="Cash" stackId="a" fill={ASSET_COLORS.cash} />
                  <Bar dataKey="realEstatePct" name="Real Estate" stackId="a" fill={ASSET_COLORS.real_estate} />
                  <Bar dataKey="pointsPct" name="Points" stackId="a" fill={ASSET_COLORS.points_value} />
                  <Bar dataKey="otherPct" name="Other" stackId="a" fill={ASSET_COLORS.other_assets} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="bg-white border-slate-200 shadow-sm cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all">
          <Link href="/net-worth">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 text-sm sm:text-base">Net Worth Timeline</h3>
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  View and manage all entries
                </p>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" />
            </CardContent>
          </Link>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all">
          <Link href="/settings">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 text-sm sm:text-base">Google Sheets Sync</h3>
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  Connect spreadsheet for sync
                </p>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" />
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Articles Section */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </div>
            Resources for Independent Consultants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Article 1 */}
            <Link href="/articles/working-remotely-from-another-country">
              <div className="h-full cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-emerald-300 hover:shadow-lg transition-all">
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=300&fit=crop"
                    alt="Working remotely from another country"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-medium text-white bg-emerald-600 px-2 py-1 rounded-full">Remote Work</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-sm sm:text-base text-slate-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">A US Guide for Working Remotely From Another Country</h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                    Taxes, visas, and logistics for US-based consultants working abroad.
                  </p>
                </div>
              </div>
            </Link>

            {/* Article 2 */}
            <Link href="/articles/best-bank-accounts-for-consultants">
              <div className="h-full cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-emerald-300 hover:shadow-lg transition-all">
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop"
                    alt="Bank accounts for consultants"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-medium text-white bg-emerald-600 px-2 py-1 rounded-full">Banking</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-sm sm:text-base text-slate-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">Best Bank Accounts for Remote Workers and Consultants</h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                    Compare Mercury, Schwab, Wise, and other top banks for freelancers.
                  </p>
                </div>
              </div>
            </Link>

            {/* Article 3 */}
            <Link href="/articles/tax-strategies-2026-self-employed">
              <div className="h-full cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-emerald-300 hover:shadow-lg transition-all">
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&h=300&fit=crop"
                    alt="Tax strategies for self-employed"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-medium text-white bg-emerald-600 px-2 py-1 rounded-full">Taxes</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-sm sm:text-base text-slate-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">Tax Strategies in 2026 for Self-Employed Workers</h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                    S-Corp election, Solo 401k, QBI deduction, and more strategies.
                  </p>
                </div>
              </div>
            </Link>

            {/* Article 4 */}
            <Link href="/articles/why-track-net-worth">
              <div className="h-full cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-emerald-300 hover:shadow-lg transition-all">
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=300&fit=crop"
                    alt="Tracking net worth"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-medium text-white bg-emerald-600 px-2 py-1 rounded-full">Wealth Building</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-sm sm:text-base text-slate-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">Why Tracking Your Net Worth Over Time is Useful</h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                    The psychological and practical benefits of monitoring your progress.
                  </p>
                </div>
              </div>
            </Link>

            {/* Article 5 */}
            <Link href="/articles/how-feie-works">
              <div className="h-full cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-emerald-300 hover:shadow-lg transition-all">
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=600&h=300&fit=crop"
                    alt="FEIE Foreign Earned Income Exclusion"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-medium text-white bg-emerald-600 px-2 py-1 rounded-full">Tax Planning</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-sm sm:text-base text-slate-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">How the Foreign Earned Income Exclusion (FEIE) Works</h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                    Exclude up to $130,000 of foreign income from US taxes.
                  </p>
                </div>
              </div>
            </Link>

            {/* Article 6 */}
            <Link href="/articles/become-self-employed-freelancer-2026">
              <div className="h-full cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-emerald-300 hover:shadow-lg transition-all">
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=300&fit=crop"
                    alt="Become a freelancer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-medium text-white bg-emerald-600 px-2 py-1 rounded-full">Getting Started</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-sm sm:text-base text-slate-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">How to Become a Self-Employed Freelancer in 2026</h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                    A complete guide from finding clients to setting up your business.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Edit Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setEditingEntry(null);
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Edit Entry</DialogTitle>
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
    commodities: entry.commodities || 0,
    other_assets: entry.other_assets,
    total_debts: entry.total_debts,
    pre_tax_income: entry.pre_tax_income || 0,
    monthly_expenses: entry.monthly_expenses || 0,
    notes: entry.notes || "",
  });

  const totalAssets =
    Number(formData.stocks) +
    Number(formData.bonds) +
    Number(formData.cash) +
    Number(formData.real_estate) +
    Number(formData.points_value) +
    Number(formData.commodities) +
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
      commodities: Number(formData.commodities),
      other_assets: Number(formData.other_assets),
      total_debts: Number(formData.total_debts),
      pre_tax_income: Number(formData.pre_tax_income),
      monthly_expenses: Number(formData.monthly_expenses),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date" className="text-slate-700">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
          className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="stocks" className="text-slate-700 text-sm">Stocks</Label>
          <Input
            id="stocks"
            type="number"
            step="0.01"
            value={formData.stocks}
            onChange={(e) => handleChange("stocks", e.target.value)}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bonds" className="text-slate-700 text-sm">Bonds</Label>
          <Input
            id="bonds"
            type="number"
            step="0.01"
            value={formData.bonds}
            onChange={(e) => handleChange("bonds", e.target.value)}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cash" className="text-slate-700 text-sm">Cash</Label>
          <Input
            id="cash"
            type="number"
            step="0.01"
            value={formData.cash}
            onChange={(e) => handleChange("cash", e.target.value)}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="real_estate" className="text-slate-700 text-sm">Real Estate</Label>
          <Input
            id="real_estate"
            type="number"
            step="0.01"
            value={formData.real_estate}
            onChange={(e) => handleChange("real_estate", e.target.value)}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="points_value" className="text-slate-700 text-sm">Points Value</Label>
          <Input
            id="points_value"
            type="number"
            step="0.01"
            value={formData.points_value}
            onChange={(e) => handleChange("points_value", e.target.value)}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="other_assets" className="text-slate-700 text-sm">Other Assets</Label>
          <Input
            id="other_assets"
            type="number"
            step="0.01"
            value={formData.other_assets}
            onChange={(e) => handleChange("other_assets", e.target.value)}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_debts" className="text-slate-700">Total Debts</Label>
        <Input
          id="total_debts"
          type="number"
          step="0.01"
          value={formData.total_debts}
          onChange={(e) => handleChange("total_debts", e.target.value)}
          className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="pre_tax_income" className="text-slate-700 text-sm">Pre-tax Income</Label>
          <Input
            id="pre_tax_income"
            type="number"
            step="0.01"
            value={formData.pre_tax_income}
            onChange={(e) => handleChange("pre_tax_income", e.target.value)}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_expenses" className="text-slate-700 text-sm">Monthly Expenses</Label>
          <Input
            id="monthly_expenses"
            type="number"
            step="0.01"
            value={formData.monthly_expenses}
            onChange={(e) => handleChange("monthly_expenses", e.target.value)}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-slate-700">Notes (optional)</Label>
        <Input
          id="notes"
          type="text"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Any notes about this entry..."
          className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="pt-4 border-t border-slate-200 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Total Assets</span>
          <span className="font-medium text-slate-900">{formatCurrency(totalAssets)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Total Debts</span>
          <span className="font-medium text-red-500">
            -{formatCurrency(Number(formData.total_debts))}
          </span>
        </div>
        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-slate-200">
          <span className="text-slate-900">Net Worth</span>
          <span className={netWorth >= 0 ? "text-emerald-600" : "text-red-500"}>
            {formatCurrency(netWorth)}
          </span>
        </div>
        {(Number(formData.pre_tax_income) > 0 || Number(formData.monthly_expenses) > 0) && (
          <>
            <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
              <span className="text-slate-500">Monthly Net Profit</span>
              <span className={Number(formData.pre_tax_income) - Number(formData.monthly_expenses) >= 0 ? "text-emerald-600" : "text-red-500"}>
                {formatCurrency(Number(formData.pre_tax_income) - Number(formData.monthly_expenses))}
              </span>
            </div>
            {Number(formData.pre_tax_income) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Savings Rate</span>
                <span className="font-medium text-slate-900">
                  {(((Number(formData.pre_tax_income) - Number(formData.monthly_expenses)) / Number(formData.pre_tax_income)) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Update Entry"}
        </Button>
      </div>
    </form>
  );
}
