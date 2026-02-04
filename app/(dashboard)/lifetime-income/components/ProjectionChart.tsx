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
import { TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Format data for chart - include all income sources
  const chartData = projection.map((point) => ({
    age: point.age,
    portfolioValue: point.portfolioValue,
    workIncome: point.workIncome,
    socialSecurityIncome: point.socialSecurityIncome,
    passiveIncome: point.passiveIncome,
    windfallIncome: point.windfallIncome,
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

          {/* Projection Data Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-900">Year-by-Year Projection Data</h3>
              <Button
                onClick={() => {
                  // Convert chartData to CSV
                  const headers = [
                    'Age',
                    'Work Income',
                    'Social Security',
                    'Passive Income',
                    'Windfall',
                    'Total Income',
                    'Total Expenses',
                    'Net Cash Flow',
                    'Portfolio Value'
                  ];

                  const csvRows = [headers.join(',')];

                  chartData.forEach(point => {
                    const row = [
                      point.age,
                      point.workIncome,
                      point.socialSecurityIncome,
                      point.passiveIncome,
                      point.windfallIncome,
                      point.totalIncome,
                      point.totalExpenses,
                      point.netCashFlow,
                      point.portfolioValue
                    ];
                    csvRows.push(row.join(','));
                  });

                  const csvContent = csvRows.join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `net-worth-projection-${new Date().toISOString().split('T')[0]}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }}
                size="sm"
                className="bg-slate-700 hover:bg-slate-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto border rounded-lg">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-slate-100 z-10">
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold">Age</th>
                    <th className="text-right p-2 font-semibold text-blue-700">Work</th>
                    <th className="text-right p-2 font-semibold text-purple-700">Social Sec.</th>
                    <th className="text-right p-2 font-semibold text-emerald-700">Passive</th>
                    <th className="text-right p-2 font-semibold text-amber-700">Windfall</th>
                    <th className="text-right p-2 font-semibold">Total Income</th>
                    <th className="text-right p-2 font-semibold text-emerald-800">Expenses</th>
                    <th className="text-right p-2 font-semibold text-slate-700">Net Cash Flow</th>
                    <th className="text-right p-2 font-semibold">Portfolio</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((point, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="p-2 font-medium">{point.age}</td>
                      <td className="p-2 text-right tabular-nums text-blue-700">
                        ${Math.round(point.workIncome).toLocaleString()}
                      </td>
                      <td className="p-2 text-right tabular-nums text-purple-700">
                        ${Math.round(point.socialSecurityIncome).toLocaleString()}
                      </td>
                      <td className="p-2 text-right tabular-nums text-emerald-700">
                        ${Math.round(point.passiveIncome).toLocaleString()}
                      </td>
                      <td className="p-2 text-right tabular-nums text-amber-700">
                        ${Math.round(point.windfallIncome).toLocaleString()}
                      </td>
                      <td className="p-2 text-right tabular-nums font-medium">
                        ${Math.round(point.totalIncome).toLocaleString()}
                      </td>
                      <td className="p-2 text-right tabular-nums text-emerald-800">
                        ${Math.round(point.totalExpenses).toLocaleString()}
                      </td>
                      <td className={`p-2 text-right tabular-nums font-medium ${
                        point.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {point.netCashFlow >= 0 ? '+' : ''}${Math.round(point.netCashFlow).toLocaleString()}
                      </td>
                      <td className="p-2 text-right tabular-nums font-semibold">
                        ${Math.round(point.portfolioValue).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Complete year-by-year breakdown showing all income sources, expenses, and portfolio growth
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
