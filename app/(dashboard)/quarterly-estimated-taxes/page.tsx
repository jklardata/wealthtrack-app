"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";
import {
  calculateFederalTax,
  calculateSETax,
  TAX_CONSTANTS,
  STATE_TAX_RATES,
} from "@/lib/tax-calculations";
import {
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  Info,
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface QuarterlyPayment {
  quarter: 1 | 2 | 3 | 4;
  dueDate: Date;
  amount: number;
  amountPaid: number;
  status: "upcoming" | "paid" | "overdue";
  daysUntil: number;
}

interface SafeHarborResult {
  priorYearSafeHarbor: number;
  currentYearSafeHarbor: number;
  recommendedQuarterly: number;
  method: "prior-year" | "current-year";
  reasoning: string;
}

interface AnnualizedQuarter {
  quarter: 1 | 2 | 3 | 4;
  actualIncome: number;
  annualizedIncome: number;
  estimatedTax: number;
  cumulativeTax: number;
  requiredPayment: number;
  previousPayments: number;
  netPayment: number;
}

interface PenaltyCalculation {
  totalPenalty: number;
  quarterlyPenalties: { quarter: number; penalty: number; reason: string }[];
  interestRate: number;
  safeHarborMet: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function QuarterlyEstimatedTaxesPage() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();

  // ============================================================================
  // STATE: User Inputs
  // ============================================================================

  // Prior Year Data (auto-populated from API)
  const [priorYearAGI, setPriorYearAGI] = useState(0);
  const [priorYearTotalTax, setPriorYearTotalTax] = useState(0);

  // Current Year Projections
  const [expectedGrossIncome, setExpectedGrossIncome] = useState("150000");
  const [expectedBusinessExpenses, setExpectedBusinessExpenses] = useState("15000");
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");
  const [stateCode, setStateCode] = useState("CA");

  // Retirement & Deductions
  const [retirement401k, setRetirement401k] = useState("23500");
  const [hsaContribution, setHsaContribution] = useState("4300");
  const [itemizedDeductions, setItemizedDeductions] = useState("0");
  const [feieExclusion, setFeieExclusion] = useState("0");

  // Quarterly Income (for annualized method - Pro feature)
  const [useAnnualizedMethod, setUseAnnualizedMethod] = useState(false);
  const [q1Income, setQ1Income] = useState("37500");
  const [q2Income, setQ2Income] = useState("37500");
  const [q3Income, setQ3Income] = useState("37500");
  const [q4Income, setQ4Income] = useState("37500");

  // Payments Made
  const [q1Paid, setQ1Paid] = useState("0");
  const [q2Paid, setQ2Paid] = useState("0");
  const [q3Paid, setQ3Paid] = useState("0");
  const [q4Paid, setQ4Paid] = useState("0");

  // Method Selection (user can override auto-selection)
  const [selectedMethod, setSelectedMethod] = useState<"auto" | "prior-year" | "current-year">("prior-year");

  // UI State
  const [loading, setLoading] = useState(true);

  // ============================================================================
  // DATA FETCHING: Auto-populate from prior year
  // ============================================================================

  useEffect(() => {
    async function fetchPriorYearData() {
      try {
        // Fetch user settings
        const settingsRes = await fetch("/api/settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.data?.tax_filing_status) {
            setFilingStatus(
              settingsData.data.tax_filing_status.includes("married") ? "married" : "single"
            );
          }
          if (settingsData.data?.state_of_residence) {
            setStateCode(settingsData.data.state_of_residence);
          }
        }

        // Fetch prior tax returns
        const taxReturnsRes = await fetch("/api/tax-returns");
        if (taxReturnsRes.ok) {
          const returnsData = await taxReturnsRes.json();
          if (returnsData.data && returnsData.data.length > 0) {
            const latestReturn = returnsData.data.sort(
              (a: any, b: any) => b.tax_year - a.tax_year
            )[0];

            setPriorYearAGI(latestReturn.agi || 0);
            setPriorYearTotalTax(latestReturn.total_tax || 0);

            // Use prior year income as starting estimate
            if (latestReturn.business_income > 0) {
              setExpectedGrossIncome(latestReturn.business_income.toString());
              const quarterlyIncome = (latestReturn.business_income / 4).toString();
              setQ1Income(quarterlyIncome);
              setQ2Income(quarterlyIncome);
              setQ3Income(quarterlyIncome);
              setQ4Income(quarterlyIncome);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching prior year data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPriorYearData();
  }, []);

  // ============================================================================
  // CALCULATIONS (Memoized)
  // ============================================================================

  // Calculate current quarter based on date
  const currentQuarterInfo = useMemo(() => {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const year = now.getFullYear();

    if (month >= 0 && month <= 2)
      return { quarter: 1 as const, dueDate: new Date(year, 3, 15) };
    if (month >= 3 && month <= 4)
      return { quarter: 2 as const, dueDate: new Date(year, 5, 15) };
    if (month >= 5 && month <= 7)
      return { quarter: 3 as const, dueDate: new Date(year, 8, 15) };
    return { quarter: 4 as const, dueDate: new Date(year + 1, 0, 15) };
  }, []);

  // Safe harbor calculation
  const safeHarbor = useMemo((): SafeHarborResult => {
    // 110% rule applies if prior year AGI > $150k
    const priorYearMultiplier = priorYearAGI > 150000 ? 1.1 : 1.0;
    const priorYearSafeHarbor = priorYearTotalTax * priorYearMultiplier;

    // Calculate current year estimated tax (90% requirement)
    const grossIncome = parseFloat(expectedGrossIncome) || 0;
    const expenses = parseFloat(expectedBusinessExpenses) || 0;
    const netIncome = grossIncome - expenses;

    // FEIE exclusion (Foreign Earned Income Exclusion)
    const feie = parseFloat(feieExclusion) || 0;

    // SE tax is calculated on FULL net income (FEIE doesn't reduce SE tax)
    const seTax = calculateSETax(netIncome);
    const seDeduction = seTax.total * 0.5; // Deduct half of SE tax
    const retirement = parseFloat(retirement401k) || 0;
    const hsa = parseFloat(hsaContribution) || 0;
    const itemized = parseFloat(itemizedDeductions) || 0;
    const standardDeduction =
      filingStatus === "single"
        ? TAX_CONSTANTS.standardDeductionSingle
        : TAX_CONSTANTS.standardDeductionMarried;
    const deduction = Math.max(itemized, standardDeduction);

    // Federal taxable income is reduced by FEIE
    const taxableIncome = Math.max(
      0,
      netIncome - feie - seDeduction - retirement - hsa - deduction
    );
    const federalTax = calculateFederalTax(taxableIncome, filingStatus);
    const stateTaxRate = STATE_TAX_RATES[stateCode.toLowerCase()]?.rate || 0.05;
    // State tax base is also reduced by FEIE
    const stateTax = Math.max(0, netIncome - feie - retirement - hsa) * stateTaxRate;

    const totalCurrentYearTax = federalTax + seTax.total + stateTax;
    const currentYearSafeHarbor = totalCurrentYearTax * 0.9;

    // Determine which method to use based on user selection
    let recommendedAnnual: number;
    let actualMethod: "prior-year" | "current-year";

    if (selectedMethod === "prior-year") {
      // Prior Year: Use lower of prior year safe harbor OR current year (with FEIE/deductions)
      // This allows FEIE and retirement deductions to reduce the payment
      if (priorYearTotalTax > 0 && priorYearSafeHarbor < currentYearSafeHarbor) {
        recommendedAnnual = priorYearSafeHarbor;
        actualMethod = "prior-year";
      } else {
        recommendedAnnual = currentYearSafeHarbor;
        actualMethod = "current-year";
      }
    } else if (selectedMethod === "current-year") {
      // Current Year: Always use current year estimate (with deductions)
      recommendedAnnual = currentYearSafeHarbor;
      actualMethod = "current-year";
    } else {
      // Auto: use lower of two (taxpayer-favorable)
      if (priorYearSafeHarbor < currentYearSafeHarbor && priorYearTotalTax > 0) {
        recommendedAnnual = priorYearSafeHarbor;
        actualMethod = "prior-year";
      } else {
        recommendedAnnual = currentYearSafeHarbor;
        actualMethod = "current-year";
      }
    }

    const recommendedQuarterly = recommendedAnnual / 4;

    return {
      priorYearSafeHarbor,
      currentYearSafeHarbor,
      recommendedQuarterly: Math.ceil(recommendedQuarterly),
      method: actualMethod,
      reasoning: actualMethod === "prior-year"
        ? `Using ${Math.round(priorYearMultiplier * 100)}% of prior year tax${selectedMethod === "prior-year" && recommendedAnnual < currentYearSafeHarbor ? "" : selectedMethod === "auto" ? " (lower amount)" : ""}`
        : `Using 90% of current year estimated tax${selectedMethod === "prior-year" ? " (lower than prior year)" : ""}`,
    };
  }, [
    expectedGrossIncome,
    expectedBusinessExpenses,
    filingStatus,
    stateCode,
    retirement401k,
    hsaContribution,
    itemizedDeductions,
    feieExclusion,
    priorYearAGI,
    priorYearTotalTax,
    selectedMethod,
  ]);

  // Quarterly payment status
  const quarterlyPayments = useMemo((): QuarterlyPayment[] => {
    const QUARTERLY_DEADLINES = [
      { quarter: 1 as const, month: 3, day: 15 },
      { quarter: 2 as const, month: 5, day: 15 },
      { quarter: 3 as const, month: 8, day: 15 },
      { quarter: 4 as const, month: 0, day: 15, nextYear: true },
    ];

    const now = new Date();
    const currentYear = now.getFullYear();

    return QUARTERLY_DEADLINES.map((q) => {
      const year = q.nextYear ? currentYear + 1 : currentYear;
      const dueDate = new Date(year, q.month, q.day);
      const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const paidAmounts = {
        1: parseFloat(q1Paid) || 0,
        2: parseFloat(q2Paid) || 0,
        3: parseFloat(q3Paid) || 0,
        4: parseFloat(q4Paid) || 0,
      };

      const amountPaid = paidAmounts[q.quarter];
      const amount = safeHarbor.recommendedQuarterly;

      let status: "upcoming" | "paid" | "overdue";
      if (amountPaid >= amount) {
        status = "paid";
      } else if (daysUntil < 0) {
        status = "overdue";
      } else {
        status = "upcoming";
      }

      return {
        quarter: q.quarter,
        dueDate,
        amount,
        amountPaid,
        status,
        daysUntil,
      };
    });
  }, [safeHarbor, q1Paid, q2Paid, q3Paid, q4Paid]);

  // Annualized income calculation (Pro feature)
  const annualizedQuarters = useMemo((): AnnualizedQuarter[] => {
    if (!isPro || !useAnnualizedMethod) return [];

    const quarters = [
      { quarter: 1 as const, income: parseFloat(q1Income) || 0, annualizationPeriod: 4 },
      {
        quarter: 2 as const,
        income: (parseFloat(q1Income) || 0) + (parseFloat(q2Income) || 0),
        annualizationPeriod: 2,
      },
      {
        quarter: 3 as const,
        income:
          (parseFloat(q1Income) || 0) + (parseFloat(q2Income) || 0) + (parseFloat(q3Income) || 0),
        annualizationPeriod: 4 / 3,
      },
      {
        quarter: 4 as const,
        income:
          (parseFloat(q1Income) || 0) +
          (parseFloat(q2Income) || 0) +
          (parseFloat(q3Income) || 0) +
          (parseFloat(q4Income) || 0),
        annualizationPeriod: 1,
      },
    ];

    let cumulativePaid = 0;

    return quarters.map((q, idx) => {
      const annualizedIncome = q.income * q.annualizationPeriod;

      // Calculate tax on annualized income
      const expenses = parseFloat(expectedBusinessExpenses) || 0;
      const netIncome = annualizedIncome - expenses;

      // FEIE and deductions (same as safe harbor calculation)
      const feie = parseFloat(feieExclusion) || 0;
      const seTax = calculateSETax(netIncome);
      const seDeduction = seTax.total * 0.5; // Deduct half of SE tax
      const retirement = parseFloat(retirement401k) || 0;
      const hsa = parseFloat(hsaContribution) || 0;
      const itemized = parseFloat(itemizedDeductions) || 0;
      const standardDeduction =
        filingStatus === "single"
          ? TAX_CONSTANTS.standardDeductionSingle
          : TAX_CONSTANTS.standardDeductionMarried;
      const deduction = Math.max(itemized, standardDeduction);

      const taxableIncome = Math.max(
        0,
        netIncome - feie - seDeduction - retirement - hsa - deduction
      );
      const federalTax = calculateFederalTax(taxableIncome, filingStatus);
      const stateTaxRate = STATE_TAX_RATES[stateCode.toLowerCase()]?.rate || 0.05;
      const stateTax = Math.max(0, netIncome - feie - retirement - hsa) * stateTaxRate;
      const estimatedTax = federalTax + seTax.total + stateTax;

      // Cumulative tax owed through this quarter
      const cumulativeTax = (estimatedTax * (idx + 1)) / 4;

      // Required payment this quarter
      const requiredPayment = Math.max(0, cumulativeTax - cumulativePaid);

      cumulativePaid += requiredPayment;

      return {
        quarter: q.quarter,
        actualIncome: q.income,
        annualizedIncome,
        estimatedTax,
        cumulativeTax,
        requiredPayment: Math.ceil(requiredPayment),
        previousPayments: cumulativePaid - requiredPayment,
        netPayment: Math.ceil(requiredPayment),
      };
    });
  }, [
    isPro,
    useAnnualizedMethod,
    q1Income,
    q2Income,
    q3Income,
    q4Income,
    expectedBusinessExpenses,
    retirement401k,
    hsaContribution,
    itemizedDeductions,
    feieExclusion,
    filingStatus,
    stateCode,
  ]);

  // Underpayment penalty calculation (Pro feature)
  const penaltyCalculation = useMemo((): PenaltyCalculation => {
    if (!isPro) {
      return {
        totalPenalty: 0,
        quarterlyPenalties: [],
        interestRate: 8,
        safeHarborMet: true,
      };
    }

    const INTEREST_RATE = 0.08;

    // Use the actual recommended quarterly payment (which includes FEIE adjustments)
    const quarterlyTarget = safeHarbor.recommendedQuarterly;
    const payments = [
      parseFloat(q1Paid) || 0,
      parseFloat(q2Paid) || 0,
      parseFloat(q3Paid) || 0,
      parseFloat(q4Paid) || 0,
    ];

    let totalPenalty = 0;
    const quarterlyPenalties: { quarter: number; penalty: number; reason: string }[] = [];

    payments.forEach((paid, idx) => {
      const shortfall = Math.max(0, quarterlyTarget - paid);
      if (shortfall > 0) {
        const daysLate = (4 - idx) * 91;
        const penalty = shortfall * (daysLate / 365) * INTEREST_RATE;

        totalPenalty += penalty;
        quarterlyPenalties.push({
          quarter: idx + 1,
          penalty: Math.round(penalty),
          reason: `Underpaid by ${formatCurrency(shortfall)}`,
        });
      }
    });

    const totalPaid = payments.reduce((sum, p) => sum + p, 0);
    const safeHarborMet = totalPaid >= quarterlyTarget * 4;

    return {
      totalPenalty: Math.round(totalPenalty),
      quarterlyPenalties,
      interestRate: INTEREST_RATE * 100,
      safeHarborMet,
    };
  }, [isPro, safeHarbor, q1Paid, q2Paid, q3Paid, q4Paid]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const nextPayment = quarterlyPayments.find((p) => p.status !== "paid");
    const totalPaid = quarterlyPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalDue = safeHarbor.recommendedQuarterly * 4;
    const remaining = Math.max(0, totalDue - totalPaid);

    return {
      nextPayment,
      totalPaid,
      totalDue,
      remaining,
    };
  }, [quarterlyPayments, safeHarbor]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto space-y-8 py-4">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-slate-900">Quarterly Estimated Taxes</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Calculate safe harbor requirements, track payments, and avoid underpayment penalties.
            Self-employed individuals must pay quarterly estimated taxes to cover income tax and
            self-employment tax.
          </p>
        </div>

        {/* Current Quarter Alert */}
        {summaryStats.nextPayment && summaryStats.nextPayment.daysUntil < 30 && (
          <Card className="border-2 border-amber-400 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-amber-600" />
                <p className="text-base font-bold text-amber-900">
                  Q{summaryStats.nextPayment.quarter} payment due in {summaryStats.nextPayment.daysUntil}{" "}
                  days ({formatDate(summaryStats.nextPayment.dueDate)})
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Summary Card */}
        <Card className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl font-black">Quick Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-2">Recommended Quarterly Payment</p>
                <p className="text-4xl font-black text-emerald-600">
                  {formatCurrency(safeHarbor.recommendedQuarterly)}
                </p>
                <p className="text-xs text-slate-500 mt-1">{safeHarbor.reasoning}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Total Paid YTD</p>
                <p className="text-4xl font-black text-blue-600">
                  {formatCurrency(summaryStats.totalPaid)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  of {formatCurrency(summaryStats.totalDue)} annual requirement
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Next Due Date</p>
                <p className="text-4xl font-black text-slate-900">
                  {summaryStats.nextPayment
                    ? formatDate(summaryStats.nextPayment.dueDate)
                    : "All Paid"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {summaryStats.nextPayment
                    ? `Q${summaryStats.nextPayment.quarter} 2025`
                    : "Congratulations!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Controls Card */}
        <Card className="bg-white border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl font-black">Income & Deductions</CardTitle>
            <CardDescription>Adjust your projections to refine quarterly payment estimates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prior Year Data */}
            <div>
              <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Prior Year Tax Data (Auto-filled)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priorYearAGI">Prior Year AGI</Label>
                  <Input
                    id="priorYearAGI"
                    type="number"
                    value={priorYearAGI}
                    onChange={(e) => setPriorYearAGI(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="priorYearTotalTax">Prior Year Total Tax</Label>
                  <Input
                    id="priorYearTotalTax"
                    type="number"
                    value={priorYearTotalTax}
                    onChange={(e) => setPriorYearTotalTax(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Current Year Projections */}
            <div>
              <h3 className="text-lg font-bold mb-8">Current Year Projections</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedGrossIncome">Expected Gross Income</Label>
                  <Input
                    id="expectedGrossIncome"
                    type="number"
                    value={expectedGrossIncome}
                    onChange={(e) => setExpectedGrossIncome(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedBusinessExpenses">Business Expenses</Label>
                  <Input
                    id="expectedBusinessExpenses"
                    type="number"
                    value={expectedBusinessExpenses}
                    onChange={(e) => setExpectedBusinessExpenses(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <Select value={filingStatus} onValueChange={(v: any) => setFilingStatus(v)}>
                    <SelectTrigger id="filingStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married Filing Jointly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stateCode">State</Label>
                  <Input
                    id="stateCode"
                    type="text"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-lg font-bold mb-8">Retirement & Deductions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="retirement401k">401(k) / SEP IRA Contribution</Label>
                  <Input
                    id="retirement401k"
                    type="number"
                    value={retirement401k}
                    onChange={(e) => setRetirement401k(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hsaContribution">HSA Contribution</Label>
                  <Input
                    id="hsaContribution"
                    type="number"
                    value={hsaContribution}
                    onChange={(e) => setHsaContribution(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="feieExclusion">FEIE Exclusion</Label>
                  <Input
                    id="feieExclusion"
                    type="number"
                    value={feieExclusion}
                    onChange={(e) => setFeieExclusion(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="itemizedDeductions">Itemized Deductions</Label>
                  <Input
                    id="itemizedDeductions"
                    type="number"
                    value={itemizedDeductions}
                    onChange={(e) => setItemizedDeductions(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safe Harbor Calculation Card */}
        <Card className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-2 border-black">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Safe Harbor Calculation
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Meeting safe harbor requirements avoids underpayment penalties
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Method Selector */}
            <div className="flex items-center gap-3">
              <Label htmlFor="methodSelector" className="text-sm font-bold whitespace-nowrap">
                Calculation Method:
              </Label>
              <Select value={selectedMethod} onValueChange={(v: any) => setSelectedMethod(v)}>
                <SelectTrigger id="methodSelector" className="w-[280px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Use Lower Amount)</SelectItem>
                  <SelectItem value="prior-year">Prior Year Method</SelectItem>
                  <SelectItem value="current-year">Current Year Method</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Prior Year Method */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  safeHarbor.method === "prior-year"
                    ? "bg-emerald-50 border-emerald-400"
                    : "bg-slate-50 border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-sm">Prior Year Method</p>
                  {safeHarbor.method === "prior-year" && (
                    <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-emerald-600">
                  {formatCurrency(safeHarbor.priorYearSafeHarbor)}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {priorYearAGI > 150000 ? "110%" : "100%"} of{" "}
                  {formatCurrency(priorYearTotalTax)}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Quarterly: {formatCurrency(safeHarbor.priorYearSafeHarbor / 4)}
                </p>
              </div>

              {/* Current Year Method */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  safeHarbor.method === "current-year"
                    ? "bg-blue-50 border-blue-400"
                    : "bg-slate-50 border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-sm">Current Year Method</p>
                  {safeHarbor.method === "current-year" && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-blue-600">
                  {formatCurrency(safeHarbor.currentYearSafeHarbor)}
                </p>
                <p className="text-xs text-slate-600 mt-1">90% of estimated current year tax</p>
                <p className="text-xs text-slate-500 mt-2">
                  Quarterly: {formatCurrency(safeHarbor.currentYearSafeHarbor / 4)}
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 bg-white border-2 border-emerald-400 rounded-lg">
              <p className="text-sm font-bold text-slate-900 mb-2">
                💡 Recommended Quarterly Payment
              </p>
              <p className="text-3xl font-black text-emerald-600 mb-1">
                {formatCurrency(safeHarbor.recommendedQuarterly)}
              </p>
              <p className="text-xs text-slate-600">{safeHarbor.reasoning}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Tracking Card */}
        <Card className="bg-white border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl font-black">Payment Tracking</CardTitle>
            <CardDescription>Track your quarterly payments throughout the year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quarterlyPayments.map((payment) => (
                <Card
                  key={payment.quarter}
                  className={`border-2 ${
                    payment.status === "paid"
                      ? "border-emerald-400 bg-emerald-50"
                      : payment.status === "overdue"
                      ? "border-red-400 bg-red-50"
                      : "border-blue-400 bg-blue-50"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-black">Q{payment.quarter} 2025</CardTitle>
                      {payment.status === "paid" && (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      )}
                      {payment.status === "overdue" && (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600">
                      Due: {formatDate(payment.dueDate).replace(", 2025", "").replace(", 2026", "")}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Required Payment</p>
                      <p className="text-2xl font-black">{formatCurrency(payment.amount)}</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Paid: {formatCurrency(payment.amountPaid)}</span>
                        <span>
                          {Math.round((payment.amountPaid / payment.amount) * 100)}%
                        </span>
                      </div>
                      <Progress value={(payment.amountPaid / payment.amount) * 100} />
                    </div>

                    {payment.status === "paid" ? (
                      <p className="text-xs text-emerald-700 font-semibold">✓ Payment Recorded</p>
                    ) : payment.status === "overdue" ? (
                      <p className="text-xs text-red-700 font-semibold">
                        ⚠ Overdue by {Math.abs(payment.daysUntil)} days
                      </p>
                    ) : (
                      <p className="text-xs text-blue-700 font-semibold">
                        📅 Due in {payment.daysUntil} days
                      </p>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor={`q${payment.quarter}-paid`} className="text-xs">
                        Amount Paid
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`q${payment.quarter}-paid`}
                          type="number"
                          value={
                            payment.quarter === 1
                              ? q1Paid
                              : payment.quarter === 2
                              ? q2Paid
                              : payment.quarter === 3
                              ? q3Paid
                              : q4Paid
                          }
                          onChange={(e) => {
                            const setter =
                              payment.quarter === 1
                                ? setQ1Paid
                                : payment.quarter === 2
                                ? setQ2Paid
                                : payment.quarter === 3
                                ? setQ3Paid
                                : setQ4Paid;
                            setter(e.target.value);
                          }}
                          className="h-8"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            const currentValue =
                              payment.quarter === 1
                                ? q1Paid
                                : payment.quarter === 2
                                ? q2Paid
                                : payment.quarter === 3
                                ? q3Paid
                                : q4Paid;
                            const setter =
                              payment.quarter === 1
                                ? setQ1Paid
                                : payment.quarter === 2
                                ? setQ2Paid
                                : payment.quarter === 3
                                ? setQ3Paid
                                : setQ4Paid;
                            // Set to recommended quarterly amount
                            setter(payment.amount.toString());
                          }}
                          className="h-8 px-2 text-xs"
                        >
                          Mark Paid
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quarterly Timeline Visualization */}
        <Card className="bg-white border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl font-black flex items-center gap-2">
              <Calendar className="h-6 w-6 text-emerald-600" />
              2025 Quarterly Payment Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-12 rounded-lg overflow-hidden gap-1">
              {quarterlyPayments.map((payment) => {
                const statusColors = {
                  paid: "#10b981",
                  upcoming: "#3b82f6",
                  overdue: "#ef4444",
                };

                return (
                  <Tooltip key={payment.quarter}>
                    <TooltipTrigger asChild>
                      <div
                        className="flex-1 flex flex-col items-center justify-center cursor-help rounded-lg relative"
                        style={{
                          backgroundColor: statusColors[payment.status],
                        }}
                      >
                        {payment.status === "paid" && (
                          <CheckCircle className="h-6 w-6 text-white mb-1" />
                        )}
                        <span className="text-base font-bold text-white">Q{payment.quarter}</span>
                        <span className="text-sm text-white/80">
                          {payment.dueDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-bold">Quarter {payment.quarter} - 2025</p>
                      <p className="text-sm">Due: {formatDate(payment.dueDate)}</p>
                      <p className="text-sm">Amount: {formatCurrency(payment.amount)}</p>
                      <p className="text-sm">Paid: {formatCurrency(payment.amountPaid)}</p>
                      <p className="text-sm">Status: {payment.status}</p>
                      {payment.status === "upcoming" && (
                        <p className="text-sm text-emerald-600">Due in {payment.daysUntil} days</p>
                      )}
                      {payment.status === "overdue" && (
                        <p className="text-sm text-red-600">
                          Overdue by {Math.abs(payment.daysUntil)} days
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 mt-4 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-600"></div>
                <span>Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-600"></div>
                <span>Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <span>Overdue</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Annualized Income Method (Pro Feature) */}
        {isPro ? (
          <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-2 border-black">
            <CardHeader>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Annualized Income Installment Method
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-300">
                  Pro
                </span>
              </CardTitle>
              <p className="text-sm text-slate-600 mt-2">
                Optimize payments for variable/seasonal income
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={useAnnualizedMethod}
                  onCheckedChange={setUseAnnualizedMethod}
                />
                <Label>Use annualized income method</Label>
              </div>

              {useAnnualizedMethod && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Q1 Income</Label>
                      <Input
                        type="number"
                        value={q1Income}
                        onChange={(e) => setQ1Income(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Q2 Income</Label>
                      <Input
                        type="number"
                        value={q2Income}
                        onChange={(e) => setQ2Income(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Q3 Income</Label>
                      <Input
                        type="number"
                        value={q3Income}
                        onChange={(e) => setQ3Income(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Q4 Income</Label>
                      <Input
                        type="number"
                        value={q4Income}
                        onChange={(e) => setQ4Income(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b-2 border-black">
                          <th className="text-left p-2 font-bold">Quarter</th>
                          <th className="text-right p-2 font-bold">Actual Income</th>
                          <th className="text-right p-2 font-bold">Annualized</th>
                          <th className="text-right p-2 font-bold">Est. Tax</th>
                          <th className="text-right p-2 font-bold">Required Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {annualizedQuarters.map((q) => (
                          <tr key={q.quarter} className="border-b border-slate-200">
                            <td className="p-2 font-semibold">Q{q.quarter}</td>
                            <td className="text-right p-2">{formatCurrency(q.actualIncome)}</td>
                            <td className="text-right p-2">{formatCurrency(q.annualizedIncome)}</td>
                            <td className="text-right p-2">{formatCurrency(q.estimatedTax)}</td>
                            <td className="text-right p-2 font-bold text-emerald-600">
                              {formatCurrency(q.netPayment)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs">
                    <p className="font-semibold text-purple-900 mb-1">How this works</p>
                    <p className="text-purple-800">
                      The annualized income method calculates your tax liability based on
                      year-to-date income projected out to a full year. This allows you to pay less
                      in low-income quarters and more in high-income quarters, avoiding underpayment
                      penalties despite uneven income.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <LockedModule
            title="Annualized Income Installment Method"
            description="Optimize quarterly payments for variable/seasonal income"
            icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
            benefits={[
              "Variable income optimization",
              "Seasonal business support",
              "Minimize penalties with uneven income",
              "IRS Form 2210 Schedule AI calculation",
            ]}
          />
        )}

        {/* Underpayment Penalty Calculator (Pro Feature) */}
        {isPro && penaltyCalculation.quarterlyPenalties.length > 0 && (
          <Card className="bg-gradient-to-br from-red-50 via-white to-amber-50 border-2 border-black">
            <CardHeader>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Underpayment Penalty Estimate
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-300">
                  Pro
                </span>
              </CardTitle>
              <p className="text-sm text-slate-600 mt-2">
                Estimated penalty based on current payments (IRS interest rate:{" "}
                {penaltyCalculation.interestRate}%)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white border-2 border-red-400 rounded-lg">
                <p className="text-sm font-bold text-slate-900 mb-2">Total Estimated Penalty</p>
                <p className="text-3xl font-black text-red-600 mb-1">
                  {formatCurrency(penaltyCalculation.totalPenalty)}
                </p>
                <p className="text-xs text-slate-600">
                  {penaltyCalculation.safeHarborMet
                    ? "Safe harbor met"
                    : "Based on underpayments"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-sm">Quarterly Breakdown</p>
                {penaltyCalculation.quarterlyPenalties.map((qp) => (
                  <div key={qp.quarter} className="flex justify-between text-xs p-2 bg-red-50 rounded">
                    <span>Q{qp.quarter}</span>
                    <span>{qp.reason}</span>
                    <span className="font-bold">{formatCurrency(qp.penalty)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Educational Panels */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Safe Harbor */}
          <Card className="border-2 border-emerald-300 bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Safe Harbor Explained
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-semibold text-emerald-900">
                Safe harbor = no underpayment penalties
              </p>
              <p className="text-slate-700">
                You're safe if you pay the <strong>lower</strong> of:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>90% of current year tax</li>
                <li>100% of prior year tax (110% if AGI &gt; $150k)</li>
              </ul>
              <p className="text-xs text-slate-600 pt-2 border-t border-emerald-200">
                Most self-employed use prior year method when income is growing.
              </p>
            </CardContent>
          </Card>

          {/* Annualized Method */}
          <Card className="border-2 border-purple-300 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Annualized Income Method
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-semibold text-purple-900">For variable/seasonal income</p>
              <p className="text-slate-700">
                Calculate tax based on year-to-date income annualized. Pay more in high quarters,
                less in low quarters.
              </p>
              <p className="text-xs text-slate-600 pt-2 border-t border-purple-200">
                Requires IRS Form 2210 Schedule AI. Pro feature helps calculate this automatically.
              </p>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-2 border-amber-300 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Common Mistakes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>Forgetting self-employment tax (15.3%)</li>
                <li>Not adjusting when income spikes</li>
                <li>Missing Q4 deadline (Jan 15, not Dec 31)</li>
                <li>Paying equal amounts with seasonal income</li>
              </ul>
              <p className="text-xs text-slate-600 pt-2 border-t border-amber-200">
                Penalties are small (~8% interest) but avoidable with planning.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <p className="font-semibold mb-1">Tax Disclaimer</p>
          <p>
            This tool provides estimates for educational purposes only. Tax laws are complex and
            vary by situation. Consult with a qualified tax professional for personalized advice.
            IRS interest rates and penalties may differ from estimates shown here.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
