"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApplyLocationButtonProps {
  cityId: string;
  cityName: string;
  baselineCityId: string;
  baselineAnnualSpend: number;
  grossIncome: number;
  currentNetWorth: number;
  consultingIncome?: number;
  consultingYears?: number;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

/**
 * Primary CTA for applying a location to a financial plan
 * Creates a scenario and navigates to the retirement calculator
 *
 * This is the main "bridge" between Geographic Arbitrage and Retirement Calculator
 */
export function ApplyLocationButton({
  cityId,
  cityName,
  baselineCityId,
  baselineAnnualSpend,
  grossIncome,
  currentNetWorth,
  consultingIncome = 0,
  consultingYears = 0,
  className,
  variant = "default",
  size = "default",
}: ApplyLocationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleApply = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/scenarios/apply-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city_id: cityId,
          baseline_city_id: baselineCityId,
          baseline_annual_spend: baselineAnnualSpend,
          gross_income: grossIncome,
          current_net_worth: currentNetWorth,
          consulting_income: consultingIncome,
          consulting_years: consultingYears,
          set_as_active: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create scenario");
      }

      const { data } = await response.json();

      // Navigate to retirement calculator with the new scenario
      router.push(`/retirement?scenario=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Button
        onClick={handleApply}
        disabled={isLoading || !grossIncome || !baselineAnnualSpend}
        variant={variant}
        size={size}
        className="gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Plan...
          </>
        ) : (
          <>
            Apply {cityName} to My Plan
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
