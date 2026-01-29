"use client";

import * as React from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Scenario } from "@/lib/types";

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  activeScenario: Scenario | null;
  onSelect: (scenario: Scenario) => void;
  onCreateNew?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Dropdown selector for switching between scenarios
 * Shows the active scenario name and allows quick switching
 */
export function ScenarioSelector({
  scenarios,
  activeScenario,
  onSelect,
  onCreateNew,
  className,
  disabled = false,
}: ScenarioSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (scenario: Scenario) => {
    onSelect(scenario);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between min-w-[200px]", className)}
          disabled={disabled}
        >
          <span className="truncate">
            {activeScenario ? activeScenario.name : "Select scenario..."}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="max-h-[300px] overflow-y-auto">
          {scenarios.length === 0 ? (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">
              No scenarios yet
            </div>
          ) : (
            <div className="p-1">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => handleSelect(scenario)}
                  className={cn(
                    "w-full flex items-start gap-2 px-3 py-2 rounded-md text-left hover:bg-accent transition-colors",
                    activeScenario?.id === scenario.id && "bg-accent"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 mt-0.5 shrink-0",
                      activeScenario?.id === scenario.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{scenario.name}</span>
                      {scenario.is_baseline && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          Baseline
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {scenario.location_city_name || scenario.location_city_id}
                      {scenario.years_to_fi !== null && (
                        <span className="ml-2">
                          {scenario.years_to_fi !== null && isFinite(scenario.years_to_fi)
                            ? `${scenario.years_to_fi.toFixed(1)} years to FI`
                            : "FI not achievable"}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {onCreateNew && (
          <>
            <div className="border-t" />
            <div className="p-1">
              <button
                onClick={() => {
                  onCreateNew();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-accent transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Create new scenario
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
