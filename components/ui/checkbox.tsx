"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, checked, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = ref || internalRef;

    React.useEffect(() => {
      if (typeof resolvedRef === "object" && resolvedRef?.current) {
        resolvedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate, resolvedRef]);

    const isChecked = checked || indeterminate;

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={resolvedRef as React.RefObject<HTMLInputElement>}
          checked={checked}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded border border-input bg-background",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            isChecked && "bg-orange-500 border-orange-500",
            "flex items-center justify-center transition-colors",
            className
          )}
        >
          {indeterminate ? (
            <Minus className="h-3 w-3 text-white" />
          ) : checked ? (
            <Check className="h-3 w-3 text-white" />
          ) : null}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
