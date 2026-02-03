"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { parseAgeString, formatAgeMonths } from "@/lib/age-utils";
import { cn } from "@/lib/utils";

interface AgeInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value?: number; // Age in months
  onChange?: (ageMonths: number | null) => void;
  error?: boolean;
  errorMessage?: string;
}

/**
 * AgeInput Component
 *
 * Accepts age in months as value, displays as "35y 6mos" format
 * Parses user input on blur and converts to months
 */
export function AgeInput({
  value,
  onChange,
  error,
  errorMessage,
  className,
  placeholder = "35y 6mos",
  ...props
}: AgeInputProps) {
  const [displayValue, setDisplayValue] = React.useState("");
  const [isInvalid, setIsInvalid] = React.useState(false);

  // Initialize display value from prop
  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      setDisplayValue(formatAgeMonths(value));
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
      const ageMonths = parseAgeString(displayValue);
      setDisplayValue(formatAgeMonths(ageMonths));
      setIsInvalid(false);
      onChange?.(ageMonths);
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
          {errorMessage || 'Invalid format. Use "35y 6mos", "35y", or "6mos"'}
        </p>
      )}
    </div>
  );
}
