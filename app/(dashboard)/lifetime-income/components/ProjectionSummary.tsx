"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ProjectionPoint } from "@/lib/types";
import {
  findPeakNetWorth,
  findDepletionAge,
  calculateTotalLifetimeIncome,
} from "@/lib/projection-calculator";

interface ProjectionSummaryProps {
  projection: ProjectionPoint[];
}

export function ProjectionSummary({ projection }: ProjectionSummaryProps) {
  if (!projection || projection.length === 0) {
    return null;
  }

  const peakNetWorth = findPeakNetWorth(projection);
  const depletionAge = findDepletionAge(projection);
  const totalLifetimeIncome = calculateTotalLifetimeIncome(projection);
  const finalPortfolioValue = projection[projection.length - 1]?.portfolioValue || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Peak Net Worth */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Peak Net Worth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 break-words">
              ${Math.round(peakNetWorth?.amount || 0).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">at age {peakNetWorth?.age || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Lifetime Income */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            Total Lifetime Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-xl sm:text-2xl font-bold text-blue-600 break-words">
              ${Math.round(totalLifetimeIncome).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">across all sources</p>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Status */}
      <Card
        className={
          depletionAge
            ? "border-red-200 bg-red-50"
            : finalPortfolioValue > 0
            ? "border-green-200 bg-green-50"
            : ""
        }
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {depletionAge ? (
              <>
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-red-900">Portfolio Depletion</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-green-900">Portfolio Status</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {depletionAge ? (
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-red-600">Age {depletionAge}</p>
              <p className="text-sm text-red-800">Portfolio depletes at this age</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-green-600 break-words">
                ${Math.round(finalPortfolioValue).toLocaleString()}
              </p>
              <p className="text-sm text-green-800">Portfolio at end of projection</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
