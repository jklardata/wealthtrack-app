"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { parseAgeString, formatAgeYears } from "@/lib/age-utils";
import { cn } from "@/lib/utils";

interface AgeInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value?: number; // Age in years
  onChange?: (ageYears: number | null) => void;
  error?: boolean;
  errorMessage?: string;
}

/**
 * AgeInput Component
 *
 * Accepts age in years as value, displays as "35y" format
 * Parses user input on blur and converts to years
 */
export function AgeInput({
  value,
  onChange,
  error,
  errorMessage,
  className,
  placeholder = "35y",
  ...props
}: AgeInputProps) {
  const [displayValue, setDisplayValue] = React.useState("");
  const [isInvalid, setIsInvalid] = React.useState(false);

  // Initialize display value from prop
  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      setDisplayValue(formatAgeYears(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
    setIsInvalid(false);
  };

  const handleBlur = () => {
    if (!displayValue.trim()) {
      setIsInvalid(false);
      onChange?.(null);
      return;
    }

    try {
      const ageYears = parseAgeString(displayValue);
      setDisplayValue(formatAgeYears(ageYears));
      setIsInvalid(false);
      onChange?.(ageYears);
    } catch (err) {
      setIsInvalid(true);
      // Keep the invalid value for user to fix
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div className="space-y-1">
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          className,
          (error || isInvalid) && "border-red-500 focus-visible:ring-red-500/50"
        )}
        aria-invalid={error || isInvalid}
        {...props}
      />
      {(isInvalid || errorMessage) && (
        <p className="text-xs text-red-500">
          {errorMessage || 'Invalid format. Use "35y" or "35"'}
        </p>
      )}
    </div>
  );
}
