"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GeoFIScore } from "@/lib/types";

interface GeoFIScoreBadgeProps {
  score: number;
  label?: GeoFIScore["label"];
  showScore?: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Badge displaying the Geo FI Score
 * Shows a score (0-100) with a qualitative label (Excellent, Good, Neutral, Poor)
 */
export function GeoFIScoreBadge({
  score,
  label,
  showScore = true,
  showLabel = true,
  size = "md",
  className,
}: GeoFIScoreBadgeProps) {
  // Calculate label from score if not provided
  const displayLabel = label || getLabel(score);

  // Get color based on label
  const colors = getColors(displayLabel);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full font-medium",
              colors.bg,
              colors.text,
              colors.border,
              "border",
              size === "sm" && "px-2 py-0.5 text-xs",
              size === "md" && "px-2.5 py-1 text-sm",
              size === "lg" && "px-3 py-1.5 text-base",
              className
            )}
          >
            {showScore && (
              <span className="tabular-nums font-semibold">{Math.round(score)}</span>
            )}
            {showLabel && <span>{displayLabel}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm max-w-[200px]">
            <p className="font-medium">Geo FI Score: {Math.round(score)}/100</p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on savings rate, income stability, and required portfolio size.
              Higher is better.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function getLabel(score: number): GeoFIScore["label"] {
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Good";
  if (score >= 25) return "Neutral";
  return "Poor";
}

function getColors(label: GeoFIScore["label"]): {
  bg: string;
  text: string;
  border: string;
} {
  switch (label) {
    case "Excellent":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
      };
    case "Good":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
      };
    case "Neutral":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
      };
    case "Poor":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
      };
    default:
      return {
        bg: "bg-muted",
        text: "text-muted-foreground",
        border: "border-muted-foreground/20",
      };
  }
}

/**
 * Compact inline version of the score for use in tables
 */
export function GeoFIScoreInline({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const label = getLabel(score);
  const colors = getColors(label);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium",
        colors.text,
        className
      )}
    >
      <span
        className={cn("w-2 h-2 rounded-full", colors.bg, "border", colors.border)}
      />
      {Math.round(score)}
    </span>
  );
}
