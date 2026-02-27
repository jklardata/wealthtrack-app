"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  US_STATES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/profile-constants";

interface OnboardingModalProps {
  firstName?: string;
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

export function OnboardingModal({ firstName, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Step 2: About You
  const [fullName, setFullName] = useState(firstName || "");
  const [currentAge, setCurrentAge] = useState("");
  const [stateOfResidence, setStateOfResidence] = useState("");

  // Step 3: Your Goals
  const [desiredRetirementAge, setDesiredRetirementAge] = useState("");
  const [lifeExpectancy, setLifeExpectancy] = useState("90");
  const [riskTolerance, setRiskTolerance] = useState("");

  // Step 4: Net Worth
  const [stocks, setStocks] = useState("");
  const [cash, setCash] = useState("");
  const [realEstate, setRealEstate] = useState("");
  const [otherAssets, setOtherAssets] = useState("");
  const [totalDebts, setTotalDebts] = useState("");

  const saveStepData = async (step: number) => {
    if (step === 1) {
      // About You
      const body: Record<string, unknown> = {};
      if (fullName) body.full_name = fullName;
      if (currentAge) body.current_age = parseInt(currentAge);
      if (stateOfResidence) body.state_of_residence = stateOfResidence;
      if (Object.keys(body).length > 0) {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
    } else if (step === 2) {
      // Your Goals
      const body: Record<string, unknown> = {};
      if (desiredRetirementAge) body.desired_retirement_age = parseInt(desiredRetirementAge);
      if (lifeExpectancy) body.life_expectancy_assumption = parseInt(lifeExpectancy);
      if (riskTolerance) body.risk_tolerance = riskTolerance;
      if (Object.keys(body).length > 0) {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
    } else if (step === 3) {
      // Net Worth
      const stocksVal = parseFloat(stocks) || 0;
      const cashVal = parseFloat(cash) || 0;
      const realEstateVal = parseFloat(realEstate) || 0;
      const otherAssetsVal = parseFloat(otherAssets) || 0;
      const totalDebtsVal = parseFloat(totalDebts) || 0;
      const totalAssets = stocksVal + cashVal + realEstateVal + otherAssetsVal;

      if (totalAssets > 0 || totalDebtsVal > 0) {
        await fetch("/api/net-worth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: new Date().toISOString().split("T")[0],
            stocks: stocksVal,
            bonds: 0,
            cash: cashVal,
            real_estate: realEstateVal,
            points_value: 0,
            commodities: 0,
            other_assets: otherAssetsVal,
            total_debts: totalDebtsVal,
            pre_tax_income: 0,
            monthly_expenses: 0,
          }),
        });
      }
    }
  };

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      await saveStepData(currentStep);

      if (currentStep === TOTAL_STEPS - 1) {
        // Final step — mark onboarding complete
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ onboarding_completed: true }),
        });
        onComplete();
      } else {
        setCurrentStep((s) => s + 1);
      }
    } catch (err) {
      console.error("Error saving onboarding step:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    if (currentStep === TOTAL_STEPS - 1) {
      // On the last step, skip still marks onboarding complete
      setIsSaving(true);
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ onboarding_completed: true }),
        });
        onComplete();
      } finally {
        setIsSaving(false);
      }
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const stepTitles = [
    "Welcome to SoloFI!",
    "Tell us about yourself",
    "Your financial goals",
    "Your current net worth",
  ];

  const stepSubtitles = [
    firstName ? `Hey ${firstName}! Let's get your account set up.` : "Let's get your account set up.",
    "This helps personalize your experience.",
    "We'll use these to tailor your projections.",
    "Start tracking where you stand today.",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black rounded-sm max-w-lg w-full mx-4 p-8 flex flex-col gap-6">
        {/* Progress dots */}
        <div className="flex flex-col gap-1 items-center">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= currentStep ? "bg-black" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400">Step {currentStep + 1} of {TOTAL_STEPS}</p>
        </div>

        {/* Step header */}
        <div className="text-center">
          {currentStep === 0 && (
            <div className="text-5xl mb-3">👋</div>
          )}
          <h2 className="text-2xl font-black">{stepTitles[currentStep]}</h2>
          <p className="text-sm text-slate-500 mt-1">{stepSubtitles[currentStep]}</p>
        </div>

        {/* Step content */}
        <div className="flex flex-col gap-4 min-h-[180px]">
          {currentStep === 0 && (
            <div className="text-center text-slate-600 space-y-3 mt-2">
              <p>SoloFI helps you track your net worth, plan your retirement, and optimize your finances—all in one place.</p>
              <p className="text-sm text-slate-400">We&apos;ll ask you a few quick questions to get started. You can skip anything you&apos;re not ready to share.</p>
            </div>
          )}

          {currentStep === 1 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="current_age">Current Age</Label>
                <Input
                  id="current_age"
                  type="number"
                  placeholder="35"
                  min={18}
                  max={100}
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state_of_residence">State of Residence</Label>
                <Select value={stateOfResidence} onValueChange={setStateOfResidence}>
                  <SelectTrigger id="state_of_residence">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="desired_retirement_age">Desired Retirement Age</Label>
                <Input
                  id="desired_retirement_age"
                  type="number"
                  placeholder="60"
                  min={30}
                  max={80}
                  value={desiredRetirementAge}
                  onChange={(e) => setDesiredRetirementAge(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="life_expectancy">Life Expectancy Assumption</Label>
                <Input
                  id="life_expectancy"
                  type="number"
                  placeholder="90"
                  min={60}
                  max={110}
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
                <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                  <SelectTrigger id="risk_tolerance">
                    <SelectValue placeholder="Select tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_TOLERANCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="stocks">Stocks / Investments</Label>
                  <Input
                    id="stocks"
                    type="number"
                    placeholder="0"
                    min={0}
                    value={stocks}
                    onChange={(e) => setStocks(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cash">Cash / Savings</Label>
                  <Input
                    id="cash"
                    type="number"
                    placeholder="0"
                    min={0}
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="real_estate">Real Estate</Label>
                  <Input
                    id="real_estate"
                    type="number"
                    placeholder="0"
                    min={0}
                    value={realEstate}
                    onChange={(e) => setRealEstate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="other_assets">Other Assets</Label>
                  <Input
                    id="other_assets"
                    type="number"
                    placeholder="0"
                    min={0}
                    value={otherAssets}
                    onChange={(e) => setOtherAssets(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="total_debts">Total Debts</Label>
                <Input
                  id="total_debts"
                  type="number"
                  placeholder="0"
                  min={0}
                  value={totalDebts}
                  onChange={(e) => setTotalDebts(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-600"
          >
            {currentStep === TOTAL_STEPS - 1 ? "Skip" : "Skip"}
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isSaving}
            className="bg-black text-white hover:bg-slate-800 font-semibold px-6"
          >
            {isSaving
              ? "Saving..."
              : currentStep === TOTAL_STEPS - 1
              ? "Finish"
              : "Continue →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
