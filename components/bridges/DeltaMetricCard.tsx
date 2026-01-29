"use client";

import * as React from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaMetricCardProps {
  label: string;
  value: number;
  delta: number;
  format?: "currency" | "years" | "percent" | "number";
  invertColors?: boolean; // If true, negative delta is good (e.g., years to FI, required NW)
  compactDelta?: boolean;
  className?: string;
}

/**
 * Displays a metric with its delta vs baseline
 * Uses color coding to indicate if the change is positive or negative
 */
export function DeltaMetricCard({
  label,
  value,
  delta,
  format = "number",
  invertColors = false,
  compactDelta = false,
  className,
}: DeltaMetricCardProps) {
  const formatValue = (val: number): string => {
    switch (format) {
      case "currency":
        if (Math.abs(val) >= 1000000) {
          return `$${(val / 1000000).toFixed(1)}M`;
        }
        if (Math.abs(val) >= 1000) {
          return `$${(val / 1000).toFixed(0)}k`;
        }
        return `$${val.toFixed(0)}`;
      case "years":
        return `${val.toFixed(1)} yr${Math.abs(val) !== 1 ? "s" : ""}`;
      case "percent":
        return `${(val * 100).toFixed(1)}%`;
      case "number":
      default:
        return val.toFixed(1);
    }
  };

  const formatDelta = (val: number): string => {
    const sign = val > 0 ? "+" : "";
    if (compactDelta) {
      switch (format) {
        case "currency":
          if (Math.abs(val) >= 1000000) {
            return `${sign}$${(val / 1000000).toFixed(1)}M`;
          }
          if (Math.abs(val) >= 1000) {
            return `${sign}$${(val / 1000).toFixed(0)}k`;
          }
          return `${sign}$${val.toFixed(0)}`;
        case "years":
          return `${sign}${val.toFixed(1)}`;
        case "percent":
          return `${sign}${(val * 100).toFixed(1)}%`;
        default:
          return `${sign}${val.toFixed(1)}`;
      }
    }
    return `${sign}${formatValue(val)}`;
  };

  // Determine if the delta is "good" or "bad"
  // For inverted metrics (like years to FI), negative is good
  const isPositive = invertColors ? delta < 0 : delta > 0;
  const isNegative = invertColors ? delta > 0 : delta < 0;
  const isNeutral = Math.abs(delta) < 0.01;

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums">
          {!isFinite(value) ? "—" : formatValue(value)}
        </span>
        {isFinite(delta) && !isNeutral && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-sm font-medium",
              isPositive && "text-green-600",
              isNegative && "text-red-600"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : isNegative ? (
              <TrendingDown className="h-3.5 w-3.5" />
            ) : (
              <Minus className="h-3.5 w-3.5" />
            )}
            {formatDelta(delta)}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Inline delta display for use within text or compact spaces
 */
export function DeltaInline({
  delta,
  format = "number",
  invertColors = false,
  className,
}: {
  delta: number;
  format?: "currency" | "years" | "percent" | "number";
  invertColors?: boolean;
  className?: string;
}) {
  const formatDelta = (val: number): string => {
    const sign = val > 0 ? "+" : "";
    switch (format) {
      case "currency":
        if (Math.abs(val) >= 1000000) {
          return `${sign}$${(val / 1000000).toFixed(1)}M`;
        }
        if (Math.abs(val) >= 1000) {
          return `${sign}$${(val / 1000).toFixed(0)}k`;
        }
        return `${sign}$${val.toFixed(0)}`;
      case "years":
        return `${sign}${val.toFixed(1)} yr${Math.abs(val) !== 1 ? "s" : ""}`;
      case "percent":
        return `${sign}${(val * 100).toFixed(1)}%`;
      default:
        return `${sign}${val.toFixed(1)}`;
    }
  };

  const isPositive = invertColors ? delta < 0 : delta > 0;
  const isNegative = invertColors ? delta > 0 : delta < 0;
  const isNeutral = Math.abs(delta) < 0.01;

  if (!isFinite(delta) || isNeutral) {
    return <span className={cn("text-muted-foreground", className)}>—</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-medium",
        isPositive && "text-green-600",
        isNegative && "text-red-600",
        className
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {formatDelta(delta)}
    </span>
  );
}
