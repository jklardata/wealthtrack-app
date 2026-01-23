"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { NetWorthEntry } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<NetWorthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Calculate stats
  const latestEntry = entries[0];
  const previousEntry = entries[1];
  const monthlyChange = latestEntry && previousEntry
    ? latestEntry.net_worth - previousEntry.net_worth
    : 0;
  const monthlyChangePercent = previousEntry && previousEntry.net_worth !== 0
    ? ((monthlyChange / previousEntry.net_worth) * 100).toFixed(1)
    : "0";

  // Prepare chart data (last 12 months, chronological order)
  const chartData = entries
    .slice(0, 12)
    .reverse()
    .map((entry) => ({
      date: formatDate(entry.date),
      netWorth: Number(entry.net_worth),
      assets: Number(entry.total_assets),
      debts: Number(entry.total_debts),
    }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your financial progress over time
          </p>
        </div>
        <Link href="/net-worth">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                as of {formatDate(latestEntry.date)}
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
              {monthlyChangePercent}% from last month
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
              {entries.length} entries tracked
            </p>
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
                No data yet. Add your first net worth entry to see your progress.
              </p>
              <Link href="/net-worth">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Entry
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

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

        <Card className="opacity-50 cursor-not-allowed">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-lg bg-muted">
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Credit Cards</h3>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
            <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">Soon</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
