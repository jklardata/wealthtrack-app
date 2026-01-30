"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { TaxReturn } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  PieChart,
  Pie,
} from "recharts";
import {
  Calculator,
  DollarSign,
  Building2,
  Briefcase,
  Plane,
  PiggyBank,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  AlertTriangle,
  Landmark,
  Receipt,
  ArrowRight,
  FileText,
  RefreshCw,
} from "lucide-react";

// 2024 Tax Constants
const TAX_CONSTANTS = {
  // Social Security
  socialSecurityWageBase: 168600,
  socialSecurityRate: 0.062,
  medicareRate: 0.0145,
  additionalMedicareThreshold: 200000,
  additionalMedicareRate: 0.009,

  // Self-Employment
  selfEmploymentTaxRate: 0.153, // 12.4% SS + 2.9% Medicare
  selfEmploymentDeduction: 0.5, // Deduct half of SE tax

  // FEIE
  feieExclusion2024: 126500,

  // Standard Deduction 2024
  standardDeductionSingle: 14600,
  standardDeductionMarried: 29200,

  // QBI Deduction
  qbiDeductionRate: 0.20,
  qbiPhaseoutSingle: 191950,
  qbiPhaseoutMarried: 383900,

  // Roth IRA 2024
  rothIraLimit: 7000,
  rothIraCatchUp: 1000, // Additional if age 50+
  rothIncomePhaseoutSingle: { start: 146000, end: 161000 },
  rothIncomePhaseoutMarried: { start: 230000, end: 240000 },

  // SEP IRA 2024
  sepIraMaxPercent: 0.25,
  sepIraMaxDollar: 69000,

  // Tax Loss Harvesting
  capitalLossDeductionLimit: 3000, // $3,000 against ordinary income ($1,500 if MFS)

  // Federal Tax Brackets 2024 (Single)
  federalBracketsSingle: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],

  // Federal Tax Brackets 2024 (Married Filing Jointly)
  federalBracketsMarried: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
};

// State tax rates (simplified - using flat rates for major states)
const STATE_TAX_RATES: Record<string, { rate: number; name: string }> = {
  none: { rate: 0, name: "No State Tax (TX, FL, WY, etc.)" },
  ca: { rate: 0.093, name: "California (9.3% avg)" },
  ny: { rate: 0.0685, name: "New York (6.85% avg)" },
  nj: { rate: 0.0637, name: "New Jersey (6.37% avg)" },
  ma: { rate: 0.05, name: "Massachusetts (5%)" },
  il: { rate: 0.0495, name: "Illinois (4.95%)" },
  pa: { rate: 0.0307, name: "Pennsylvania (3.07%)" },
  wa: { rate: 0, name: "Washington (0%)" },
  co: { rate: 0.044, name: "Colorado (4.4%)" },
  ga: { rate: 0.055, name: "Georgia (5.5% avg)" },
  nc: { rate: 0.0525, name: "North Carolina (5.25%)" },
  az: { rate: 0.025, name: "Arizona (2.5%)" },
  other: { rate: 0.05, name: "Other (5% estimate)" },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + "%";
}

// Calculate federal income tax
function calculateFederalTax(taxableIncome: number, filingStatus: "single" | "married"): number {
  const brackets = filingStatus === "single"
    ? TAX_CONSTANTS.federalBracketsSingle
    : TAX_CONSTANTS.federalBracketsMarried;

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
}

// Calculate Self-Employment Tax
function calculateSETax(netSelfEmploymentIncome: number): { ssTax: number; medicareTax: number; total: number } {
  // SE tax is calculated on 92.35% of net SE income
  const seBase = netSelfEmploymentIncome * 0.9235;

  // Social Security portion (capped at wage base)
  const ssBase = Math.min(seBase, TAX_CONSTANTS.socialSecurityWageBase);
  const ssTax = ssBase * TAX_CONSTANTS.socialSecurityRate * 2; // Both employer and employee portions

  // Medicare portion (no cap)
  let medicareTax = seBase * TAX_CONSTANTS.medicareRate * 2;

  // Additional Medicare tax on income over threshold
  if (seBase > TAX_CONSTANTS.additionalMedicareThreshold) {
    medicareTax += (seBase - TAX_CONSTANTS.additionalMedicareThreshold) * TAX_CONSTANTS.additionalMedicareRate;
  }

  return {
    ssTax,
    medicareTax,
    total: ssTax + medicareTax,
  };
}

// Calculate FICA taxes for W-2 income
function calculateFICA(wages: number): { employeeSS: number; employeeMedicare: number; employerSS: number; employerMedicare: number; total: number } {
  const ssBase = Math.min(wages, TAX_CONSTANTS.socialSecurityWageBase);
  const employeeSS = ssBase * TAX_CONSTANTS.socialSecurityRate;
  const employerSS = ssBase * TAX_CONSTANTS.socialSecurityRate;

  let employeeMedicare = wages * TAX_CONSTANTS.medicareRate;
  const employerMedicare = wages * TAX_CONSTANTS.medicareRate;

  // Additional Medicare tax on employee side only
  if (wages > TAX_CONSTANTS.additionalMedicareThreshold) {
    employeeMedicare += (wages - TAX_CONSTANTS.additionalMedicareThreshold) * TAX_CONSTANTS.additionalMedicareRate;
  }

  return {
    employeeSS,
    employeeMedicare,
    employerSS,
    employerMedicare,
    total: employeeSS + employeeMedicare + employerSS + employerMedicare,
  };
}

interface TaxCalculation {
  grossIncome: number;
  structure: string;
  salary: number;
  distributions: number;
  seTax: number;
  ficaEmployee: number;
  ficaEmployer: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  takeHomePay: number;
  effectiveRate: number;
  qbiDeduction: number;
  retirement401k: number;
  hsaContribution: number;
  rothIraContribution: number;
  sepIraContribution: number;
  taxLossHarvesting: number;
  feieExclusion: number;
  // New metrics for better comparison
  totalWealthBuild: number; // Take-home + 401k + HSA + Roth IRA (what you actually keep/save)
  taxSavingsFrom401k: number;
  taxSavingsFromHSA: number;
  taxSavingsFromExpenses: number;
  taxSavingsFromTLH: number;
  totalTaxSavings: number; // Combined tax savings from all deductions
}

export default function TaxCalculatorPage() {
  // Input state
  const [grossIncome, setGrossIncome] = useState("150000");
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");
  const [stateCode, setStateCode] = useState("none");
  const [businessExpenses, setBusinessExpenses] = useState("10000");

  // S-Corp settings
  const [sCorpSalaryPercent, setSCorpSalaryPercent] = useState(40);
  const [customSalary, setCustomSalary] = useState("");

  // Retirement & Benefits
  const [solo401kContribution, setSolo401kContribution] = useState("23000");
  const [hsaContribution, setHsaContribution] = useState("4150");
  const [rothIraContribution, setRothIraContribution] = useState("0");
  const [sepIraContribution, setSepIraContribution] = useState("0");
  const [taxLossHarvesting, setTaxLossHarvesting] = useState("0");

  // FEIE
  const [useFEIE, setUseFEIE] = useState(false);
  const [daysAbroad, setDaysAbroad] = useState("330");

  // UI State
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Tax Return Data (for auto-populate)
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [loadingTaxReturns, setLoadingTaxReturns] = useState(true);

  // Fetch tax returns on mount
  useEffect(() => {
    async function fetchTaxReturns() {
      try {
        const response = await fetch("/api/tax-returns");
        if (response.ok) {
          const result = await response.json();
          setTaxReturns(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching tax returns:", error);
      } finally {
        setLoadingTaxReturns(false);
      }
    }
    fetchTaxReturns();
  }, []);

  // Get most recent tax return
  const mostRecentTaxReturn = useMemo(() => {
    if (taxReturns.length === 0) return null;
    return [...taxReturns].sort((a, b) => b.tax_year - a.tax_year)[0];
  }, [taxReturns]);

  // Auto-populate from tax return
  const populateFromTaxReturn = () => {
    if (!mostRecentTaxReturn) return;

    // Use total_income as the gross consulting income
    if (mostRecentTaxReturn.total_income > 0) {
      setGrossIncome(mostRecentTaxReturn.total_income.toString());
    }

    // Set filing status if available
    if (mostRecentTaxReturn.filing_status === "married_filing_jointly") {
      setFilingStatus("married");
    } else {
      setFilingStatus("single");
    }

    // Set business expenses from adjustments if available
    if (mostRecentTaxReturn.adjustments > 0) {
      setBusinessExpenses(mostRecentTaxReturn.adjustments.toString());
    }
  };

  // Parse inputs
  const gross = parseFloat(grossIncome) || 0;
  const expenses = parseFloat(businessExpenses) || 0;
  const netIncome = gross - expenses;
  const retirement401k = parseFloat(solo401kContribution) || 0;
  const hsa = parseFloat(hsaContribution) || 0;
  const rothIra = Math.min(parseFloat(rothIraContribution) || 0, TAX_CONSTANTS.rothIraLimit);
  const sepIra = parseFloat(sepIraContribution) || 0;
  const tlh = Math.min(parseFloat(taxLossHarvesting) || 0, TAX_CONSTANTS.capitalLossDeductionLimit);
  const standardDeduction = filingStatus === "single"
    ? TAX_CONSTANTS.standardDeductionSingle
    : TAX_CONSTANTS.standardDeductionMarried;
  const stateRate = STATE_TAX_RATES[stateCode]?.rate || 0;

  // Combined retirement limit: Solo 401(k) + SEP IRA share the $69k total limit
  // Solo 401(k) = $23k employee deferral + employer profit-sharing (25% of net SE income)
  // SEP IRA = employer contribution only (25% of net SE income)
  // The employer portions share the same 25% limit, so effectively you pick one or the other
  const maxEmployerContribution = Math.min(46000, netIncome * TAX_CONSTANTS.sepIraMaxPercent);
  const maxSolo401k = 23000 + maxEmployerContribution; // $23k employee + employer portion
  const maxSepIra = Math.min(TAX_CONSTANTS.sepIraMaxDollar, netIncome * TAX_CONSTANTS.sepIraMaxPercent);

  // If user enters both, cap the total at $69k and prioritize Solo 401(k)
  const effectiveSolo401k = Math.min(retirement401k, maxSolo401k);
  const remainingLimit = Math.max(0, TAX_CONSTANTS.sepIraMaxDollar - effectiveSolo401k);
  const effectiveSepIra = Math.min(sepIra, maxSepIra, remainingLimit);
  const totalRetirementContribution = effectiveSolo401k + effectiveSepIra;

  // Roth IRA income phase-out calculation
  const rothPhaseout = filingStatus === "single"
    ? TAX_CONSTANTS.rothIncomePhaseoutSingle
    : TAX_CONSTANTS.rothIncomePhaseoutMarried;
  const isRothLimited = netIncome > rothPhaseout.start;

  // Calculate effective Roth IRA contribution based on income phase-out
  let effectiveRothIra = Math.min(rothIra, TAX_CONSTANTS.rothIraLimit);
  if (netIncome >= rothPhaseout.end) {
    // Income too high - no direct Roth IRA contribution allowed (backdoor Roth still possible)
    effectiveRothIra = 0;
  } else if (netIncome > rothPhaseout.start) {
    // Partial phase-out: reduce contribution proportionally
    const phaseoutRange = rothPhaseout.end - rothPhaseout.start;
    const incomeOverStart = netIncome - rothPhaseout.start;
    const reductionRatio = incomeOverStart / phaseoutRange;
    const maxAllowed = TAX_CONSTANTS.rothIraLimit * (1 - reductionRatio);
    effectiveRothIra = Math.min(rothIra, Math.max(0, maxAllowed));
  }

  // Calculate for each business structure
  const calculations = useMemo(() => {
    const results: TaxCalculation[] = [];

    // 1. Sole Proprietor / LLC (disregarded entity)
    const soleProprietor = (() => {
      const seTaxResult = calculateSETax(netIncome);
      const seDeduction = seTaxResult.total * 0.5; // Deduct half of SE tax

      // QBI Deduction (20% of qualified business income)
      const qbiBase = netIncome - seDeduction;
      const qbiDeduction = Math.min(qbiBase * TAX_CONSTANTS.qbiDeductionRate, qbiBase);

      // Taxable income (includes tax loss harvesting deduction)
      const taxableIncome = Math.max(0, netIncome - seDeduction - totalRetirementContribution - hsa - standardDeduction - qbiDeduction - tlh);

      // Apply FEIE if eligible
      let feieExclusion = 0;
      let adjustedTaxableIncome = taxableIncome;
      if (useFEIE && parseInt(daysAbroad) >= 330) {
        feieExclusion = Math.min(netIncome, TAX_CONSTANTS.feieExclusion2024);
        adjustedTaxableIncome = Math.max(0, taxableIncome - feieExclusion);
      }

      const federalTax = calculateFederalTax(adjustedTaxableIncome, filingStatus);
      const stateTax = (netIncome - totalRetirementContribution - hsa) * stateRate;
      const totalTax = seTaxResult.total + federalTax + stateTax;

      // Roth IRA doesn't reduce taxes but adds to wealth (post-tax contribution)
      const takeHomePay = gross - expenses - totalTax - totalRetirementContribution - hsa - effectiveRothIra;

      // Calculate tax savings (estimate marginal rate at 32% for high earners)
      const marginalRate = 0.32;
      const taxSavingsFrom401k = totalRetirementContribution * marginalRate;
      const taxSavingsFromHSA = hsa * (marginalRate + 0.0765); // HSA also saves FICA
      const taxSavingsFromExpenses = expenses * marginalRate;
      const taxSavingsFromTLH = tlh * marginalRate;
      const qbiTaxSavings = qbiDeduction * marginalRate;
      const taxSavingsFromFEIE = feieExclusion * marginalRate;
      const totalTaxSavings = taxSavingsFrom401k + taxSavingsFromHSA + taxSavingsFromExpenses + qbiTaxSavings + taxSavingsFromTLH + taxSavingsFromFEIE;

      return {
        grossIncome: gross,
        structure: "Sole Prop / LLC",
        salary: netIncome, // All SE income is earned income subject to SE tax
        distributions: 0,
        seTax: seTaxResult.total,
        ficaEmployee: 0,
        ficaEmployer: 0,
        federalTax,
        stateTax,
        totalTax,
        takeHomePay,
        effectiveRate: totalTax / gross,
        qbiDeduction,
        retirement401k: totalRetirementContribution,
        hsaContribution: hsa,
        rothIraContribution: effectiveRothIra,
        sepIraContribution: effectiveSepIra,
        taxLossHarvesting: tlh,
        feieExclusion,
        totalWealthBuild: takeHomePay + totalRetirementContribution + hsa + effectiveRothIra,
        taxSavingsFrom401k,
        taxSavingsFromHSA,
        taxSavingsFromExpenses,
        taxSavingsFromTLH,
        totalTaxSavings,
      };
    })();
    results.push(soleProprietor);

    // 2. S-Corp with reasonable salary
    const sCorp = (() => {
      // Calculate reasonable salary (either percentage or custom)
      const salary = customSalary
        ? parseFloat(customSalary)
        : netIncome * (sCorpSalaryPercent / 100);
      const distributions = netIncome - salary;

      // FICA on salary only
      const fica = calculateFICA(salary);

      // QBI Deduction on distributions only (S-Corp wages don't qualify)
      const qbiDeduction = distributions > 0
        ? Math.min(distributions * TAX_CONSTANTS.qbiDeductionRate, distributions)
        : 0;

      // Employer portion of FICA is deductible
      const taxableIncome = Math.max(0,
        salary + distributions - fica.employerSS - fica.employerMedicare - totalRetirementContribution - hsa - standardDeduction - qbiDeduction - tlh
      );

      // Apply FEIE if eligible (only applies to earned income / salary)
      let feieExclusion = 0;
      let adjustedTaxableIncome = taxableIncome;
      if (useFEIE && parseInt(daysAbroad) >= 330) {
        feieExclusion = Math.min(salary, TAX_CONSTANTS.feieExclusion2024);
        adjustedTaxableIncome = Math.max(0, taxableIncome - feieExclusion);
      }

      const federalTax = calculateFederalTax(adjustedTaxableIncome, filingStatus);
      const stateTax = (salary + distributions - totalRetirementContribution - hsa) * stateRate;
      const totalTax = fica.employeeSS + fica.employeeMedicare + fica.employerSS + fica.employerMedicare + federalTax + stateTax;

      // Roth IRA doesn't reduce taxes but adds to wealth
      const takeHomePay = gross - expenses - totalTax - totalRetirementContribution - hsa - effectiveRothIra;

      // Calculate tax savings
      const marginalRate = 0.32;
      const taxSavingsFrom401k = totalRetirementContribution * marginalRate;
      const taxSavingsFromHSA = hsa * (marginalRate + 0.0765);
      const taxSavingsFromExpenses = expenses * marginalRate;
      const taxSavingsFromTLH = tlh * marginalRate;
      const qbiTaxSavings = qbiDeduction * marginalRate;
      const taxSavingsFromFEIE = feieExclusion * marginalRate;
      const totalTaxSavings = taxSavingsFrom401k + taxSavingsFromHSA + taxSavingsFromExpenses + qbiTaxSavings + taxSavingsFromTLH + taxSavingsFromFEIE;

      return {
        grossIncome: gross,
        structure: "S-Corp",
        salary,
        distributions,
        seTax: 0,
        ficaEmployee: fica.employeeSS + fica.employeeMedicare,
        ficaEmployer: fica.employerSS + fica.employerMedicare,
        federalTax,
        stateTax,
        totalTax,
        takeHomePay,
        effectiveRate: totalTax / gross,
        qbiDeduction,
        retirement401k: totalRetirementContribution,
        hsaContribution: hsa,
        rothIraContribution: effectiveRothIra,
        sepIraContribution: effectiveSepIra,
        taxLossHarvesting: tlh,
        feieExclusion,
        totalWealthBuild: takeHomePay + totalRetirementContribution + hsa + effectiveRothIra,
        taxSavingsFrom401k,
        taxSavingsFromHSA,
        taxSavingsFromExpenses,
        taxSavingsFromTLH,
        totalTaxSavings,
      };
    })();
    results.push(sCorp);

    // 3. W-2 Employee comparison
    const w2Employee = (() => {
      const salary = netIncome; // Assume equivalent salary
      const fica = calculateFICA(salary);

      // W-2 employees limited to $23k employee contribution (no employer match in this comparison)
      const w2_401k = Math.min(retirement401k, 23000);

      // W-2 can still do tax loss harvesting
      const taxableIncome = Math.max(0, salary - w2_401k - hsa - standardDeduction - tlh);

      // FEIE for W-2 employees working abroad
      let feieExclusion = 0;
      let adjustedTaxableIncome = taxableIncome;
      if (useFEIE && parseInt(daysAbroad) >= 330) {
        feieExclusion = Math.min(salary, TAX_CONSTANTS.feieExclusion2024);
        adjustedTaxableIncome = Math.max(0, taxableIncome - feieExclusion);
      }

      const federalTax = calculateFederalTax(adjustedTaxableIncome, filingStatus);
      const stateTax = (salary - w2_401k - hsa) * stateRate;
      // Note: Employer FICA is not included in employee's tax burden for comparison
      const totalTax = fica.employeeSS + fica.employeeMedicare + federalTax + stateTax;

      // Roth IRA doesn't reduce taxes but adds to wealth
      const takeHomePay = salary - totalTax - w2_401k - hsa - effectiveRothIra;

      // Calculate tax savings (W-2 can't deduct business expenses, no QBI, no SEP IRA)
      const marginalRate = 0.32;
      const taxSavingsFrom401k = w2_401k * marginalRate;
      const taxSavingsFromHSA = hsa * marginalRate; // W-2 HSA doesn't save FICA if through payroll, but we'll assume same
      const taxSavingsFromExpenses = 0; // W-2 can't deduct business expenses
      const taxSavingsFromTLH = tlh * marginalRate;
      const taxSavingsFromFEIE = feieExclusion * marginalRate;
      const totalTaxSavings = taxSavingsFrom401k + taxSavingsFromHSA + taxSavingsFromTLH + taxSavingsFromFEIE;

      return {
        grossIncome: gross,
        structure: "W-2 Employee",
        salary,
        distributions: 0,
        seTax: 0,
        ficaEmployee: fica.employeeSS + fica.employeeMedicare,
        ficaEmployer: fica.employerSS + fica.employerMedicare,
        federalTax,
        stateTax,
        totalTax,
        takeHomePay,
        effectiveRate: totalTax / salary,
        qbiDeduction: 0,
        retirement401k: w2_401k,
        hsaContribution: hsa,
        rothIraContribution: effectiveRothIra,
        sepIraContribution: 0, // W-2 can't use SEP IRA
        taxLossHarvesting: tlh,
        feieExclusion,
        totalWealthBuild: takeHomePay + w2_401k + hsa + effectiveRothIra,
        taxSavingsFrom401k,
        taxSavingsFromHSA,
        taxSavingsFromExpenses,
        taxSavingsFromTLH,
        totalTaxSavings,
      };
    })();
    results.push(w2Employee);

    return results;
  }, [gross, netIncome, expenses, filingStatus, stateRate, sCorpSalaryPercent, customSalary, totalRetirementContribution, effectiveSolo401k, effectiveSepIra, hsa, effectiveRothIra, tlh, useFEIE, daysAbroad, standardDeduction]);

  // Calculate max Solo 401k for self-employed (employee $23k + employer 25% of net SE income, max $69k total)
  const maxSolo401k = Math.min(69000, 23000 + netIncome * 0.25);

  // Tradeoffs data for Sole Prop vs W-2
  const tradeoffsData = useMemo(() => {
    const soleProp = calculations[0];
    const w2 = calculations[2];

    return {
      seTaxDiff: soleProp.seTax - (w2.ficaEmployee), // SE tax vs employee FICA only
      qbiSavings: soleProp.qbiDeduction * 0.32, // Approximate tax savings from QBI at 32% bracket
      retirement401kDiff: soleProp.retirement401k - w2.retirement401k,
      takeHomeDiff: soleProp.takeHomePay - w2.takeHomePay,
      totalWealthDiff: soleProp.totalWealthBuild - w2.totalWealthBuild,
      totalTaxSavingsDiff: soleProp.totalTaxSavings - w2.totalTaxSavings,
      effectiveRateDiff: soleProp.effectiveRate - w2.effectiveRate,
    };
  }, [calculations]);

  // Find the best strategy based on Total Wealth Build (not just take-home)
  const bestStrategy = calculations.reduce((best, calc) =>
    calc.totalWealthBuild > best.totalWealthBuild ? calc : best
  , calculations[0]);

  // Savings comparison
  const sCorpSavings = calculations[1].takeHomePay - calculations[0].takeHomePay;

  // Quarterly estimated tax (for self-employed)
  const quarterlyTax = bestStrategy.structure !== "W-2 Employee"
    ? (bestStrategy.federalTax + bestStrategy.seTax) / 4
    : 0;

  // Chart data - using Total Wealth Build for comparison
  const comparisonData = calculations.map((calc, index) => ({
    name: calc.structure,
    "Total Wealth": calc.totalWealthBuild,
    "Take-Home": calc.takeHomePay,
    "Retirement + HSA": calc.retirement401k + calc.hsaContribution + calc.rothIraContribution,
    color: ["#3b82f6", "#06b6d4", "#8b5cf6"][index], // Blue, Cyan, Purple
  }));

  // Tax breakdown pie chart data for Sole Prop (first calculation)
  const solePropTaxData = [
    { name: "Federal Tax", value: calculations[0].federalTax, color: "#3b82f6" },
    { name: "State Tax", value: calculations[0].stateTax, color: "#06b6d4" },
    { name: "SE Tax", value: calculations[0].seTax, color: "#f472b6" },
    { name: "401k/SEP", value: calculations[0].retirement401k, color: "#22c55e" },
    { name: "HSA", value: calculations[0].hsaContribution, color: "#84cc16" },
    { name: "Roth IRA", value: calculations[0].rothIraContribution, color: "#14b8a6" },
    { name: "Take-Home", value: calculations[0].takeHomePay, color: "#8b5cf6" },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0" />
          <span className="leading-tight">Tax-Optimized Take-Home Calculator</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Compare tax strategies for consultants and solo practitioners
        </p>
      </div>

      {/* Key Insight Card */}
      {sCorpSavings > 1000 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <p className="text-lg font-semibold text-primary">
                  S-Corp could save you {formatCurrency(sCorpSavings)}/year
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  By paying yourself a {formatCurrency(calculations[1].salary)} salary and taking {formatCurrency(calculations[1].distributions)} as distributions,
                  you avoid {formatCurrency(calculations[0].seTax - calculations[1].ficaEmployee - calculations[1].ficaEmployer)} in self-employment taxes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Section */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Income & Business */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Income & Business
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tax Return Auto-Populate Banner */}
            {mostRecentTaxReturn && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-400 truncate">
                      {mostRecentTaxReturn.tax_year} tax data available
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={populateFromTaxReturn}
                    className="flex-shrink-0 text-blue-600 border-blue-300 hover:bg-blue-500/10"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Use Tax Data
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="grossIncome">Gross Consulting Income</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="grossIncome"
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(e.target.value)}
                  className="pl-9"
                  placeholder="150000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses">Business Expenses</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expenses"
                  type="number"
                  value={businessExpenses}
                  onChange={(e) => setBusinessExpenses(e.target.value)}
                  className="pl-9"
                  placeholder="10000"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Net business income: {formatCurrency(netIncome)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filingStatus">Filing Status</Label>
              <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as "single" | "married")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married Filing Jointly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={stateCode} onValueChange={setStateCode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATE_TAX_RATES).map(([code, { name }]) => (
                    <SelectItem key={code} value={code}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* S-Corp Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              S-Corp Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Reasonable Salary %</Label>
                <span className="text-sm font-medium">{sCorpSalaryPercent}%</span>
              </div>
              <Slider
                value={[sCorpSalaryPercent]}
                onValueChange={(v) => setSCorpSalaryPercent(v[0])}
                min={30}
                max={70}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Salary: {formatCurrency(netIncome * (sCorpSalaryPercent / 100))} •
                Distributions: {formatCurrency(netIncome * (1 - sCorpSalaryPercent / 100))}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customSalary">Or Custom Salary Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customSalary"
                  type="number"
                  value={customSalary}
                  onChange={(e) => setCustomSalary(e.target.value)}
                  className="pl-9"
                  placeholder="Leave blank to use %"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-2">
              <p className="font-medium flex items-center gap-1">
                <Info className="h-4 w-4" />
                Reasonable Salary Guidelines
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Must be "reasonable" for your industry/role</li>
                <li>• IRS scrutinizes salaries below 40% of net income</li>
                <li>• Consider similar W-2 positions as benchmark</li>
                <li>• Document your salary methodology</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tax-Advantaged Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              Tax-Advantaged Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="solo401k">Solo 401(k) Contribution</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="solo401k"
                  type="number"
                  value={solo401kContribution}
                  onChange={(e) => setSolo401kContribution(e.target.value)}
                  className="pl-9"
                  placeholder="23000"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your max: {formatCurrency(maxSolo401k)} ($23k employee + 25% employer)
              </p>
              {retirement401k > maxSolo401k && (
                <p className="text-xs text-amber-500">
                  Contribution exceeds limit. Using {formatCurrency(effectiveSolo401k)}.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hsa">HSA Contribution</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hsa"
                  type="number"
                  value={hsaContribution}
                  onChange={(e) => setHsaContribution(e.target.value)}
                  className="pl-9"
                  placeholder="4150"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                2024 max: $4,150 individual / $8,300 family
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rothIra">Roth IRA Contribution</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="rothIra"
                  type="number"
                  value={rothIraContribution}
                  onChange={(e) => setRothIraContribution(e.target.value)}
                  className="pl-9"
                  placeholder="0"
                  max={TAX_CONSTANTS.rothIraLimit}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                2024 max: $7,000 ($8,000 if 50+). Post-tax, no current deduction.
              </p>
              {netIncome >= rothPhaseout.end && (
                <p className="text-xs text-red-500">
                  Income exceeds {formatCurrency(rothPhaseout.end)} - no direct Roth IRA allowed. Use backdoor Roth.
                </p>
              )}
              {isRothLimited && netIncome < rothPhaseout.end && (
                <p className="text-xs text-amber-500">
                  Income phase-out: max allowed is {formatCurrency(effectiveRothIra)}. Consider backdoor Roth.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sepIra">SEP IRA Contribution</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sepIra"
                  type="number"
                  value={sepIraContribution}
                  onChange={(e) => setSepIraContribution(e.target.value)}
                  className="pl-9"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Max: 25% of net SE income (your max: {formatCurrency(maxSepIra)})
              </p>
              {retirement401k > 0 && sepIra > 0 && (
                <p className="text-xs text-amber-500">
                  Combined Solo 401k + SEP IRA capped at $69k. Using {formatCurrency(effectiveSepIra)} for SEP.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tlh">Tax Loss Harvesting</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tlh"
                  type="number"
                  value={taxLossHarvesting}
                  onChange={(e) => setTaxLossHarvesting(e.target.value)}
                  className="pl-9"
                  placeholder="0"
                  max={TAX_CONSTANTS.capitalLossDeductionLimit}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Deduct up to $3,000 of net capital losses against ordinary income.
              </p>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="feie" className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    Use FEIE
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Foreign Earned Income Exclusion
                  </p>
                </div>
                <Switch
                  id="feie"
                  checked={useFEIE}
                  onCheckedChange={setUseFEIE}
                />
              </div>

              {useFEIE && (
                <div className="mt-3 space-y-2">
                  <Label htmlFor="daysAbroad">Days Living Abroad</Label>
                  <Input
                    id="daysAbroad"
                    type="number"
                    value={daysAbroad}
                    onChange={(e) => setDaysAbroad(e.target.value)}
                    placeholder="330"
                  />
                  <p className="text-xs text-muted-foreground">
                    Need 330+ days to qualify. Excludes up to {formatCurrency(TAX_CONSTANTS.feieExclusion2024)} in 2024.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Tax Savings Highlight */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-green-600" />
            Total Tax Savings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Savings Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated annual savings (Sole Prop)</span>
            <span className="text-2xl font-bold text-green-600">{formatCurrency(calculations[0].totalTaxSavings)}</span>
          </div>

          {/* Savings Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">401(k)/SEP</span>
              <span className="text-sm font-medium text-green-600">{formatCurrency(calculations[0].taxSavingsFrom401k)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">HSA</span>
              <span className="text-sm font-medium text-green-600">{formatCurrency(calculations[0].taxSavingsFromHSA)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Business Expenses</span>
              <span className="text-sm font-medium text-green-600">{formatCurrency(calculations[0].taxSavingsFromExpenses)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">QBI Deduction</span>
              <span className="text-sm font-medium text-green-600">{formatCurrency(calculations[0].qbiDeduction * 0.32)}</span>
            </div>
            {calculations[0].feieExclusion > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">FEIE</span>
                <span className="text-sm font-medium text-green-600">{formatCurrency(calculations[0].feieExclusion * 0.32)}</span>
              </div>
            )}
          </div>

          {/* Limit Warnings */}
          {(retirement401k > effectiveSolo401k || sepIra > effectiveSepIra || rothIra > effectiveRothIra) && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-600">Contribution Limits Exceeded</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {retirement401k > effectiveSolo401k && (
                  <p>Solo 401(k) capped at {formatCurrency(effectiveSolo401k)} (entered: {formatCurrency(retirement401k)})</p>
                )}
                {sepIra > effectiveSepIra && (
                  <p>SEP IRA capped at {formatCurrency(effectiveSepIra)} (entered: {formatCurrency(sepIra)}). Combined 401k + SEP cannot exceed $69k.</p>
                )}
                {rothIra > effectiveRothIra && (
                  <p>Roth IRA {effectiveRothIra === 0 ? "not allowed - income too high for direct contributions. Consider backdoor Roth." : `reduced to ${formatCurrency(effectiveRothIra)} due to income phase-out.`}</p>
                )}
              </div>
            </div>
          )}

          {/* Missing Opportunities */}
          {(retirement401k < maxSolo401k || hsa < (filingStatus === "married" ? 8300 : 4150) || tlh < TAX_CONSTANTS.capitalLossDeductionLimit || (!useFEIE && netIncome > 100000)) && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Missed Opportunities</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {retirement401k < maxSolo401k && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max Solo 401(k)</span>
                    <span className="font-medium text-amber-600">+{formatCurrency((maxSolo401k - retirement401k) * 0.32)}</span>
                  </div>
                )}
                {hsa < (filingStatus === "married" ? 8300 : 4150) && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max HSA</span>
                    <span className="font-medium text-amber-600">+{formatCurrency(((filingStatus === "married" ? 8300 : 4150) - hsa) * 0.3965)}</span>
                  </div>
                )}
                {tlh < TAX_CONSTANTS.capitalLossDeductionLimit && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tax Loss Harvesting</span>
                    <span className="font-medium text-amber-600">+{formatCurrency((TAX_CONSTANTS.capitalLossDeductionLimit - tlh) * 0.32)}</span>
                  </div>
                )}
                {!useFEIE && netIncome > 100000 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">FEIE (live abroad)</span>
                    <span className="font-medium text-violet-600">+{formatCurrency(Math.min(netIncome, TAX_CONSTANTS.feieExclusion2024) * 0.32)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Strategy Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Side-by-side comparison of different business structures
          </p>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] sm:w-[180px] sticky left-0 bg-background z-10">Structure</TableHead>
                  <TableHead className="text-right whitespace-nowrap">401k</TableHead>
                  <TableHead className="text-right whitespace-nowrap">SE/FICA</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Federal</TableHead>
                  <TableHead className="text-right whitespace-nowrap">State</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Total Tax</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Take-Home</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Wealth</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.map((calc) => (
                  <TableRow
                    key={calc.structure}
                    className={calc.structure === bestStrategy.structure ? "bg-primary/10" : ""}
                  >
                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {calc.structure === bestStrategy.structure && (
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm">{calc.structure}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-green-600">{formatCurrency(calc.retirement401k)}</TableCell>
                    <TableCell className="text-right text-pink-500">
                      {formatCurrency(calc.seTax + calc.ficaEmployee + calc.ficaEmployer)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(calc.federalTax)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(calc.stateTax)}</TableCell>
                    <TableCell className="text-right font-medium text-red-500">
                      {formatCurrency(calc.totalTax)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(calc.takeHomePay)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {formatCurrency(calc.totalWealthBuild)}
                    </TableCell>
                    <TableCell className="text-right">{formatPercent(calc.effectiveRate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Key Tradeoffs Analysis: Self-Employed vs W-2 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Key Tradeoffs: Self-Employed vs W-2
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Understanding the trade-offs between consulting and traditional employment
          </p>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px] sm:w-[200px] sticky left-0 bg-background z-10">Factor</TableHead>
                  <TableHead className="whitespace-nowrap">Sole Prop</TableHead>
                  <TableHead className="whitespace-nowrap">W-2</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Diff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Payroll Taxes</TableCell>
                  <TableCell>
                    <div>
                      <span className="text-pink-500 font-medium">{formatCurrency(calculations[0].seTax)}</span>
                      <p className="text-xs text-muted-foreground">15.3% SE tax (both halves)</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="text-cyan-500 font-medium">{formatCurrency(calculations[2].ficaEmployee)}</span>
                      <p className="text-xs text-muted-foreground">7.65% FICA (employee only)</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={tradeoffsData.seTaxDiff > 0 ? "text-red-500" : "text-green-600"}>
                      {tradeoffsData.seTaxDiff > 0 ? "+" : ""}{formatCurrency(tradeoffsData.seTaxDiff)}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">QBI Deduction</TableCell>
                  <TableCell>
                    <div>
                      <span className="text-green-600 font-medium">{formatCurrency(calculations[0].qbiDeduction)}</span>
                      <p className="text-xs text-muted-foreground">20% of qualified business income</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="text-muted-foreground">$0</span>
                      <p className="text-xs text-muted-foreground">Not available for W-2 wages</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-600">~{formatCurrency(tradeoffsData.qbiSavings)} tax savings</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">401(k) Contribution</TableCell>
                  <TableCell>
                    <div>
                      <span className="text-primary font-medium">{formatCurrency(calculations[0].retirement401k)}</span>
                      <p className="text-xs text-muted-foreground">Max: {formatCurrency(maxSolo401k)} (Solo 401k)</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{formatCurrency(calculations[2].retirement401k)}</span>
                      <p className="text-xs text-muted-foreground">Max: $23,000 (employee only)</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={tradeoffsData.retirement401kDiff > 0 ? "text-green-600" : "text-red-500"}>
                      {tradeoffsData.retirement401kDiff > 0 ? "+" : ""}{formatCurrency(tradeoffsData.retirement401kDiff)}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Business Expenses</TableCell>
                  <TableCell>
                    <div>
                      <span className="text-green-600 font-medium">{formatCurrency(expenses)}</span>
                      <p className="text-xs text-muted-foreground">Fully deductible above-the-line</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="text-muted-foreground">$0</span>
                      <p className="text-xs text-muted-foreground">Unreimbursed expenses not deductible</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-600">+{formatCurrency(expenses)}</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Federal Income Tax</TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(calculations[0].federalTax)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(calculations[2].federalTax)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={calculations[0].federalTax - calculations[2].federalTax > 0 ? "text-red-500" : "text-green-600"}>
                      {calculations[0].federalTax - calculations[2].federalTax > 0 ? "+" : ""}
                      {formatCurrency(calculations[0].federalTax - calculations[2].federalTax)}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div>
                      Total Tax Savings
                      <p className="text-xs text-muted-foreground">From 401k, HSA, expenses, QBI</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">{formatCurrency(calculations[0].totalTaxSavings)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(calculations[2].totalTaxSavings)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={tradeoffsData.totalTaxSavingsDiff > 0 ? "text-green-600" : "text-red-500"}>
                      {tradeoffsData.totalTaxSavingsDiff > 0 ? "+" : ""}{formatCurrency(tradeoffsData.totalTaxSavingsDiff)}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Net Take-Home Pay</TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(calculations[0].takeHomePay)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(calculations[2].takeHomePay)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={tradeoffsData.takeHomeDiff > 0 ? "text-green-600" : "text-red-500"}>
                      {tradeoffsData.takeHomeDiff > 0 ? "+" : ""}{formatCurrency(tradeoffsData.takeHomeDiff)}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/30 font-medium">
                  <TableCell className="font-bold">
                    <div>
                      Total Wealth Build
                      <p className="text-xs font-normal text-muted-foreground">Take-home + 401k + HSA</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-primary font-bold">{formatCurrency(calculations[0].totalWealthBuild)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold">{formatCurrency(calculations[2].totalWealthBuild)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-bold ${tradeoffsData.totalWealthDiff > 0 ? "text-green-600" : "text-red-500"}`}>
                      {tradeoffsData.totalWealthDiff > 0 ? "+" : ""}{formatCurrency(tradeoffsData.totalWealthDiff)}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Summary insight */}
          <div className="mt-4 p-4 rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              {tradeoffsData.totalWealthDiff > 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-600">Self-employment wins by {formatCurrency(tradeoffsData.totalWealthDiff)} in total wealth</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Self-employed can contribute {formatCurrency(calculations[0].retirement401k)} to Solo 401k vs W-2&apos;s {formatCurrency(calculations[2].retirement401k)} limit,
                      plus deduct {formatCurrency(expenses)} in business expenses and get {formatCurrency(calculations[0].qbiDeduction)} QBI deduction.
                      {tradeoffsData.takeHomeDiff < 0 && (
                        <span className="block mt-1 text-primary">
                          Note: Take-home is {formatCurrency(Math.abs(tradeoffsData.takeHomeDiff))} lower because more goes to tax-advantaged retirement savings.
                        </span>
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-500">W-2 wins by {formatCurrency(Math.abs(tradeoffsData.totalWealthDiff))} in total wealth</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      At your income level, the SE tax burden ({formatCurrency(calculations[0].seTax)}) outweighs the
                      self-employment benefits. Consider S-Corp election to save {formatCurrency(sCorpSavings)} by
                      avoiding SE tax on distributions.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart - Total Wealth Build Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Wealth Build Comparison</CardTitle>
            <p className="text-sm text-muted-foreground">Take-home + 401k + HSA contributions</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} layout="vertical" margin={{ right: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                  stroke="#64748b"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Bar dataKey="Total Wealth" radius={[0, 4, 4, 0]} label={{
                  position: 'right',
                  formatter: (value) => typeof value === 'number' ? formatCurrency(value) : String(value),
                  fill: '#64748b',
                  fontSize: 12
                }}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tax Breakdown Pie - Sole Prop */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Tax Breakdown (Sole Prop / LLC)
            </CardTitle>
            <p className="text-sm text-muted-foreground">Where your gross income goes</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={solePropTaxData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                >
                  {solePropTaxData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => {
                    const item = solePropTaxData.find(d => d.name === value);
                    return `${value}: ${item ? formatCurrency(item.value) : ''}`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Estimates & Recommendations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quarterly Estimated Taxes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Quarterly Estimated Taxes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Federal + SE Tax</p>
                <p className="text-2xl font-bold">{formatCurrency(quarterlyTax)}</p>
                <p className="text-xs text-muted-foreground">per quarter</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">State Tax</p>
                <p className="text-2xl font-bold">{formatCurrency(bestStrategy.stateTax / 4)}</p>
                <p className="text-xs text-muted-foreground">per quarter</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium">2024 Quarterly Due Dates:</p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div>Q1: April 15, 2024</div>
                <div>Q2: June 17, 2024</div>
                <div>Q3: September 16, 2024</div>
                <div>Q4: January 15, 2025</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-500">Avoid Underpayment Penalty</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Pay at least 90% of current year tax or 100% of prior year tax (110% if AGI &gt; $150k).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* S-Corp Recommendation */}
            {sCorpSavings > 5000 && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Consider S-Corp Election</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      With {formatCurrency(gross)} gross income, S-Corp could save you {formatCurrency(sCorpSavings)}/year
                      by avoiding self-employment tax on distributions.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-primary mt-2">
                      <ArrowRight className="h-3 w-3" />
                      File Form 2553 by March 15th
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Solo 401k Recommendation */}
            {retirement401k < 23000 && netIncome > 100000 && (
              <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                <div className="flex items-start gap-3">
                  <PiggyBank className="h-5 w-5 text-cyan-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Max Out Solo 401(k)</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You could contribute up to {formatCurrency(Math.min(69000, 23000 + netIncome * 0.25))} and reduce
                      your taxable income significantly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* FEIE Recommendation */}
            {!useFEIE && netIncome > 100000 && (
              <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
                <div className="flex items-start gap-3">
                  <Plane className="h-5 w-5 text-violet-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Consider Living Abroad</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      The Foreign Earned Income Exclusion could exclude {formatCurrency(TAX_CONSTANTS.feieExclusion2024)} of
                      your income from federal taxes if you live abroad 330+ days.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* HSA Recommendation */}
            {hsa < 4150 && (
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Max Out HSA</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      HSA offers triple tax advantage. Consider maxing at {formatCurrency(filingStatus === "married" ? 8300 : 4150)}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* State Tax Note */}
            {stateRate > 0.05 && (
              <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20">
                <div className="flex items-start gap-3">
                  <Landmark className="h-5 w-5 text-rose-500 mt-0.5" />
                  <div>
                    <p className="font-medium">High State Tax</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You&apos;re paying {formatCurrency(bestStrategy.stateTax)} in state taxes.
                      Moving to a no-income-tax state could save you significantly.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only.
            Tax laws are complex and change frequently. Consult a qualified tax professional or CPA
            before making any tax decisions. This tool does not account for all deductions, credits,
            AMT, NIIT, state/local specifics, or individual circumstances.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
