"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ProjectionPoint } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ProjectionChartProps {
  projection: ProjectionPoint[];
}

export function ProjectionChart({ projection }: ProjectionChartProps) {
  if (!projection || projection.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Net Worth Projection
          </CardTitle>
          <CardDescription>
            Add income sources and expenses to see your projection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-slate-500">
            No data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = projection.map((point) => ({
    age: point.age,
    portfolioValue: point.portfolioValue,
    totalIncome: point.totalIncome,
    totalExpenses: point.totalExpenses,
    netCashFlow: point.netCashFlow,
  }));

  // Check if portfolio goes negative
  const hasNegativePortfolio = projection.some((p) => p.portfolioValue <= 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Net Worth Projection
        </CardTitle>
        <CardDescription>
          Lifetime portfolio value trajectory with income and expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasNegativePortfolio && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
            Warning: Portfolio depletes before end of projection
          </div>
        )}

        <div className="space-y-8">
          {/* Main Portfolio Chart */}
          <div>
            <h3 className="text-sm font-medium mb-3">Portfolio Value Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "insideBottom", offset: -5 }}
                  stroke="#64748b"
                />
                <YAxis
                  label={{ value: "Portfolio Value ($)", angle: -90, position: "insideLeft" }}
                  stroke="#64748b"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value !== undefined ? `$${value.toLocaleString()}` : ""
                  }
                  labelFormatter={(age) => `Age: ${age}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="portfolioValue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  name="Portfolio Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Income vs Expenses Chart */}
          <div>
            <h3 className="text-sm font-medium mb-3">Annual Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "insideBottom", offset: -5 }}
                  stroke="#64748b"
                />
                <YAxis
                  label={{ value: "Annual Amount ($)", angle: -90, position: "insideLeft" }}
                  stroke="#64748b"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value !== undefined ? `$${value.toLocaleString()}` : ""
                  }
                  labelFormatter={(age) => `Age: ${age}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="totalIncome"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Total Income"
                />
                <Area
                  type="monotone"
                  dataKey="totalExpenses"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Total Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Net Cash Flow Chart */}
          <div>
            <h3 className="text-sm font-medium mb-3">Net Cash Flow</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "insideBottom", offset: -5 }}
                  stroke="#64748b"
                />
                <YAxis
                  label={{ value: "Net Cash Flow ($)", angle: -90, position: "insideLeft" }}
                  stroke="#64748b"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number | undefined) => {
                    if (value === undefined) return "";
                    const sign = value >= 0 ? "+" : "";
                    return `${sign}$${value.toLocaleString()}`;
                  }}
                  labelFormatter={(age) => `Age: ${age}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                  }}
                />
                <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
                <Area
                  type="monotone"
                  dataKey="netCashFlow"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.5}
                  name="Net Cash Flow"
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-2">
              Positive = Adding to portfolio, Negative = Drawing from portfolio
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
