"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
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
            <h3 className="text-sm font-medium mb-3 text-slate-900">Portfolio Value Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "insideBottom", offset: -5, fill: "#64748b", fontFamily: "system-ui, -apple-system, sans-serif" }}
                  stroke="#cbd5e1"
                  tick={{ fill: "#64748b", fontSize: 12, fontFamily: "system-ui, -apple-system, sans-serif" }}
                />
                <YAxis
                  stroke="#cbd5e1"
                  tick={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value !== undefined ? `$${Math.round(value).toLocaleString()}` : ""
                  }
                  labelFormatter={(age) => `Age: ${age}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="portfolioValue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  name="Portfolio Value"
                  fill="url(#portfolioGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Income vs Expenses Chart */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-slate-900">Annual Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "insideBottom", offset: -5, fill: "#64748b", fontFamily: "system-ui, -apple-system, sans-serif" }}
                  stroke="#cbd5e1"
                  tick={{ fill: "#64748b", fontSize: 12, fontFamily: "system-ui, -apple-system, sans-serif" }}
                />
                <YAxis
                  stroke="#cbd5e1"
                  tick={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value !== undefined ? `$${Math.round(value).toLocaleString()}` : ""
                  }
                  labelFormatter={(age) => `Age: ${age}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                {/* Stacked Bar Chart for Income Sources */}
                <Bar
                  dataKey="workIncome"
                  stackId="income"
                  fill="#3b82f6"
                  name="Work Income"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="socialSecurityIncome"
                  stackId="income"
                  fill="#8b5cf6"
                  name="Social Security"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="passiveIncome"
                  stackId="income"
                  fill="#10b981"
                  name="Passive Income"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="windfallIncome"
                  stackId="income"
                  fill="#f59e0b"
                  name="Windfall"
                  radius={[4, 4, 0, 0]}
                />
                {/* Dotted Line for Expenses */}
                <Line
                  type="monotone"
                  dataKey="totalExpenses"
                  stroke="#047857"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Total Expenses"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Net Cash Flow Chart */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-slate-900">Net Cash Flow</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "insideBottom", offset: -5, fill: "#64748b", fontFamily: "system-ui, -apple-system, sans-serif" }}
                  stroke="#cbd5e1"
                  tick={{ fill: "#64748b", fontSize: 12, fontFamily: "system-ui, -apple-system, sans-serif" }}
                />
                <YAxis
                  stroke="#cbd5e1"
                  tick={false}
                  axisLine={false}
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
