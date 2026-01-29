"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeltaMetricCard, DeltaInline } from "./DeltaMetricCard";
import { InsightCallout } from "./InsightCallout";
import { GeoFIScoreBadge } from "./GeoFIScoreBadge";
import type { ScenarioComparison } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MoveVsStayComparisonProps {
  comparison: ScenarioComparison;
  className?: string;
}

/**
 * Full Move vs Stay comparison view
 * Shows side-by-side metrics with deltas and the main insight
 */
export function MoveVsStayComparison({
  comparison,
  className,
}: MoveVsStayComparisonProps) {
  const { baseline, compare } = comparison;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Insight */}
      <InsightCallout
        insightText={comparison.insight_text}
        deltaYearsToFI={comparison.delta_years_to_fi}
        deltaRequiredNetWorth={comparison.delta_required_net_worth}
      />

      {/* Side-by-Side Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Baseline (Stay) */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Stay: {baseline.location_city_name || baseline.location_city_id}
              </CardTitle>
              <span className="text-xs bg-muted px-2 py-1 rounded">Baseline</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <MetricRow
              label="Years to FI"
              value={baseline.years_to_fi}
              format="years"
            />
            <MetricRow
              label="Required Net Worth"
              value={baseline.required_net_worth}
              format="currency"
            />
            <MetricRow
              label="Annual Expenses"
              value={baseline.annual_expenses}
              format="currency"
            />
            <MetricRow
              label="Savings Rate"
              value={baseline.savings_rate}
              format="percent"
            />
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">FI Score</span>
              <GeoFIScoreBadge score={baseline.fi_score} size="sm" />
            </div>
          </CardContent>
        </Card>

        {/* Compare (Move) */}
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Move: {compare.location_city_name || compare.location_city_id}
              </CardTitle>
              {comparison.delta_years_to_fi < 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Faster
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <MetricRowWithDelta
              label="Years to FI"
              value={compare.years_to_fi}
              delta={comparison.delta_years_to_fi}
              format="years"
              invertColors
            />
            <MetricRowWithDelta
              label="Required Net Worth"
              value={compare.required_net_worth}
              delta={comparison.delta_required_net_worth}
              format="currency"
              invertColors
            />
            <MetricRowWithDelta
              label="Annual Expenses"
              value={compare.annual_expenses}
              delta={comparison.delta_annual_expenses}
              format="currency"
              invertColors
            />
            <MetricRowWithDelta
              label="Savings Rate"
              value={compare.savings_rate}
              delta={comparison.delta_savings_rate}
              format="percent"
            />
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">FI Score</span>
              <div className="flex items-center gap-2">
                <GeoFIScoreBadge score={compare.fi_score} size="sm" />
                {comparison.delta_fi_score !== 0 && (
                  <DeltaInline delta={comparison.delta_fi_score} format="number" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semi-Retirement Analysis */}
      {(compare.consulting_income > 0 || baseline.consulting_income > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Semi-Retirement Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Consulting income coverage in {compare.location_city_name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tabular-nums">
                    {(comparison.consulting_covers_percentage * 100).toFixed(0)}%
                  </span>
                  <span className="text-sm text-muted-foreground">of expenses</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Semi-retirement feasibility
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium",
                    comparison.semi_retirement_feasible
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  )}
                >
                  {comparison.semi_retirement_feasible
                    ? "Feasible"
                    : "Partial Coverage"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricRow({
  label,
  value,
  format,
}: {
  label: string;
  value: number;
  format: "currency" | "years" | "percent";
}) {
  const formatted = formatValue(value, format);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{formatted}</span>
    </div>
  );
}

function MetricRowWithDelta({
  label,
  value,
  delta,
  format,
  invertColors = false,
}: {
  label: string;
  value: number;
  delta: number;
  format: "currency" | "years" | "percent";
  invertColors?: boolean;
}) {
  const formatted = formatValue(value, format);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium tabular-nums">{formatted}</span>
        {isFinite(delta) && Math.abs(delta) > 0.001 && (
          <DeltaInline delta={delta} format={format} invertColors={invertColors} />
        )}
      </div>
    </div>
  );
}

function formatValue(value: number, format: "currency" | "years" | "percent"): string {
  if (!isFinite(value)) return "—";

  switch (format) {
    case "currency":
      if (Math.abs(value) >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      if (Math.abs(value) >= 1000) {
        return `$${(value / 1000).toFixed(0)}k`;
      }
      return `$${value.toFixed(0)}`;
    case "years":
      return `${value.toFixed(1)} yrs`;
    case "percent":
      return `${(value * 100).toFixed(1)}%`;
    default:
      return value.toFixed(1);
  }
}
