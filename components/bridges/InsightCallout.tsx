"use client";

import * as React from "react";
import { Lightbulb, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCalloutProps {
  insightText: string;
  deltaYearsToFI?: number;
  deltaRequiredNetWorth?: number;
  variant?: "default" | "positive" | "negative" | "neutral";
  className?: string;
}

/**
 * Prominent callout displaying the main insight from a scenario comparison
 *
 * Examples:
 * - "Moving to Mexico City buys you ~5 years of financial independence and lowers the bar by $420k."
 * - "Staying in New York requires an additional $840k but offers higher earning potential."
 */
export function InsightCallout({
  insightText,
  deltaYearsToFI,
  deltaRequiredNetWorth,
  variant = "default",
  className,
}: InsightCalloutProps) {
  // Auto-detect variant based on deltas if not specified
  const autoVariant = React.useMemo(() => {
    if (variant !== "default") return variant;

    // Negative delta in years/NW = positive outcome (comparison city is better)
    if (deltaYearsToFI !== undefined && deltaYearsToFI < -0.5) return "positive";
    if (deltaRequiredNetWorth !== undefined && deltaRequiredNetWorth < -10000) return "positive";
    if (deltaYearsToFI !== undefined && deltaYearsToFI > 0.5) return "negative";
    if (deltaRequiredNetWorth !== undefined && deltaRequiredNetWorth > 10000) return "negative";

    return "neutral";
  }, [variant, deltaYearsToFI, deltaRequiredNetWorth]);

  const Icon = autoVariant === "positive"
    ? TrendingUp
    : autoVariant === "negative"
    ? TrendingDown
    : Lightbulb;

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        autoVariant === "positive" && "bg-green-50 border-green-200 text-green-900",
        autoVariant === "negative" && "bg-red-50 border-red-200 text-red-900",
        autoVariant === "neutral" && "bg-muted border-muted-foreground/20",
        className
      )}
    >
      <div className="flex gap-3">
        <Icon
          className={cn(
            "h-5 w-5 flex-shrink-0 mt-0.5",
            autoVariant === "positive" && "text-green-600",
            autoVariant === "negative" && "text-red-600",
            autoVariant === "neutral" && "text-muted-foreground"
          )}
        />
        <div className="space-y-1">
          <p className="font-medium leading-relaxed">{insightText}</p>
          {(deltaYearsToFI !== undefined || deltaRequiredNetWorth !== undefined) && (
            <div className="flex flex-wrap gap-4 text-sm opacity-75 pt-1">
              {deltaYearsToFI !== undefined && isFinite(deltaYearsToFI) && (
                <span>
                  Years to FI:{" "}
                  <strong>
                    {deltaYearsToFI > 0 ? "+" : ""}
                    {deltaYearsToFI.toFixed(1)}
                  </strong>
                </span>
              )}
              {deltaRequiredNetWorth !== undefined && (
                <span>
                  Required NW:{" "}
                  <strong>
                    {deltaRequiredNetWorth > 0 ? "+" : ""}
                    {formatCurrency(deltaRequiredNetWorth)}
                  </strong>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toFixed(0)}`;
}
