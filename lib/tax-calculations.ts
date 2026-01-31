// 2025 Tax Constants
export const TAX_CONSTANTS = {
  // Social Security
  socialSecurityWageBase: 176100,
  socialSecurityRate: 0.062,
  medicareRate: 0.0145,
  additionalMedicareThreshold: 200000,
  additionalMedicareRate: 0.009,

  // Self-Employment
  selfEmploymentTaxRate: 0.153, // 12.4% SS + 2.9% Medicare
  selfEmploymentDeduction: 0.5, // Deduct half of SE tax

  // Standard Deduction 2025
  standardDeductionSingle: 15000,
  standardDeductionMarried: 30000,

  // QBI Deduction
  qbiDeductionRate: 0.20,
  qbiPhaseoutSingle: 197300,
  qbiPhaseoutMarried: 394600,

  // HSA 2025
  hsaLimitSingle: 4300,
  hsaLimitFamily: 8550,

  // Solo 401k / SEP IRA 2025
  solo401kEmployeeLimit: 23500,
  solo401kTotalLimit: 69000,
  sepIraMaxPercent: 0.25,
  sepIraMaxDollar: 70000,

  // S-Corp
  sCorpComplianceCost: 3000, // Annual cost for S-Corp election

  // Federal Tax Brackets 2025 (Single)
  federalBracketsSingle: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],

  // Federal Tax Brackets 2025 (Married Filing Jointly)
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
export const STATE_TAX_RATES: Record<string, { rate: number; name: string }> = {
  none: { rate: 0, name: "No State Tax (TX, FL, WY, etc.)" },
  ca: { rate: 0.093, name: "California" },
  ny: { rate: 0.0685, name: "New York" },
  nj: { rate: 0.0637, name: "New Jersey" },
  ma: { rate: 0.05, name: "Massachusetts" },
  il: { rate: 0.0495, name: "Illinois" },
  pa: { rate: 0.0307, name: "Pennsylvania" },
  wa: { rate: 0, name: "Washington" },
  co: { rate: 0.044, name: "Colorado" },
  ga: { rate: 0.055, name: "Georgia" },
  nc: { rate: 0.0525, name: "North Carolina" },
  az: { rate: 0.025, name: "Arizona" },
  other: { rate: 0.05, name: "Other State" },
};

export type FilingStatus = "single" | "married";

// Calculate federal income tax
export function calculateFederalTax(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = filingStatus === "single"
    ? TAX_CONSTANTS.federalBracketsSingle
    : TAX_CONSTANTS.federalBracketsMarried;

  let tax = 0;
  let remainingIncome = Math.max(0, taxableIncome);

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
}

// Calculate Self-Employment Tax
export function calculateSETax(netSelfEmploymentIncome: number): { ssTax: number; medicareTax: number; total: number } {
  const seBase = netSelfEmploymentIncome * 0.9235;

  const ssBase = Math.min(seBase, TAX_CONSTANTS.socialSecurityWageBase);
  const ssTax = ssBase * TAX_CONSTANTS.socialSecurityRate * 2;

  let medicareTax = seBase * TAX_CONSTANTS.medicareRate * 2;

  if (seBase > TAX_CONSTANTS.additionalMedicareThreshold) {
    medicareTax += (seBase - TAX_CONSTANTS.additionalMedicareThreshold) * TAX_CONSTANTS.additionalMedicareRate;
  }

  return {
    ssTax,
    medicareTax,
    total: ssTax + medicareTax,
  };
}

// Get marginal tax rate for a given income
export function getMarginalRate(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = filingStatus === "single"
    ? TAX_CONSTANTS.federalBracketsSingle
    : TAX_CONSTANTS.federalBracketsMarried;

  for (let i = brackets.length - 1; i >= 0; i--) {
    if (taxableIncome > brackets[i].min) {
      return brackets[i].rate;
    }
  }
  return brackets[0].rate;
}

export interface TaxSavingsInput {
  grossIncome: number;
  businessExpenses: number;
  filingStatus: FilingStatus;
  stateCode: string;
  current401k: number;
  currentHSA: number;
  hsaCoverageType: "individual" | "family";
}

export interface TaxSavingsResults {
  // Income calculations
  netIncome: number;
  currentSETax: number;

  // Solo 401k
  solo401kEmployeeMax: number;
  solo401kEmployerMax: number;
  solo401kTotalMax: number;
  solo401kAdditionalRoom: number;
  solo401kTaxSavings: number;

  // HSA
  hsaMax: number;
  hsaAdditionalRoom: number;
  hsaTaxSavings: number; // Includes FICA savings

  // S-Corp potential
  sCorpQualified: boolean;
  sCorpReasonableSalary: number;
  sCorpDistributions: number;
  sCorpSETaxSavings: number;
  sCorpNetSavings: number; // After compliance costs

  // QBI Deduction
  qbiDeduction: number;
  qbiTaxSavings: number;

  // Totals
  totalPotentialSavings: number;
  marginalRate: number;
  effectiveRate: number;
}

export function calculateTaxSavings(input: TaxSavingsInput): TaxSavingsResults {
  const { grossIncome, businessExpenses, filingStatus, stateCode, current401k, currentHSA, hsaCoverageType } = input;

  // Net self-employment income
  const netIncome = grossIncome - businessExpenses;

  // Current SE tax
  const seTaxResult = calculateSETax(netIncome);
  const currentSETax = seTaxResult.total;

  // SE tax deduction (half of SE tax)
  const seDeduction = currentSETax * 0.5;

  // Standard deduction
  const standardDeduction = filingStatus === "single"
    ? TAX_CONSTANTS.standardDeductionSingle
    : TAX_CONSTANTS.standardDeductionMarried;

  // Calculate taxable income for marginal rate
  const taxableIncomeBase = netIncome - seDeduction - standardDeduction;
  const marginalRate = getMarginalRate(taxableIncomeBase, filingStatus);
  const stateRate = STATE_TAX_RATES[stateCode]?.rate || 0.05;
  const combinedRate = marginalRate + stateRate;

  // Solo 401k calculations
  const solo401kEmployeeMax = TAX_CONSTANTS.solo401kEmployeeLimit;
  const solo401kEmployerMax = Math.min(netIncome * 0.25, TAX_CONSTANTS.solo401kTotalLimit - solo401kEmployeeMax);
  const solo401kTotalMax = Math.min(solo401kEmployeeMax + solo401kEmployerMax, TAX_CONSTANTS.solo401kTotalLimit);
  const solo401kAdditionalRoom = Math.max(0, solo401kTotalMax - current401k);
  const solo401kTaxSavings = solo401kAdditionalRoom * combinedRate;

  // HSA calculations
  const hsaMax = hsaCoverageType === "family" ? TAX_CONSTANTS.hsaLimitFamily : TAX_CONSTANTS.hsaLimitSingle;
  const hsaAdditionalRoom = Math.max(0, hsaMax - currentHSA);
  // HSA saves income tax + SE tax (7.65% FICA equivalent)
  const hsaTaxSavings = hsaAdditionalRoom * (combinedRate + 0.0765);

  // S-Corp calculations (only beneficial above ~$80k typically)
  const sCorpQualified = netIncome > 80000;
  const sCorpReasonableSalary = sCorpQualified ? Math.round(netIncome * 0.4) : 0;
  const sCorpDistributions = sCorpQualified ? netIncome - sCorpReasonableSalary : 0;

  // S-Corp SE tax savings: Only pay payroll tax on salary, not distributions
  let sCorpSETaxSavings = 0;
  if (sCorpQualified) {
    // Current SE tax on full net income
    const currentSE = calculateSETax(netIncome).total;
    // S-Corp: FICA only on salary (both portions = 15.3%)
    const sCorpFICA = Math.min(sCorpReasonableSalary, TAX_CONSTANTS.socialSecurityWageBase) * 0.124 + sCorpReasonableSalary * 0.029;
    const sCorpFICATwoHalves = sCorpFICA * 2; // employer + employee
    sCorpSETaxSavings = currentSE - sCorpFICATwoHalves;
  }
  const sCorpNetSavings = Math.max(0, sCorpSETaxSavings - TAX_CONSTANTS.sCorpComplianceCost);

  // QBI Deduction
  const qbiBase = netIncome - seDeduction;
  const qbiDeduction = Math.min(qbiBase * TAX_CONSTANTS.qbiDeductionRate, qbiBase);
  const qbiTaxSavings = qbiDeduction * combinedRate;

  // Calculate effective rate
  const totalTaxBeforeOptimization = currentSETax + calculateFederalTax(taxableIncomeBase, filingStatus) + (taxableIncomeBase * stateRate);
  const effectiveRate = netIncome > 0 ? totalTaxBeforeOptimization / netIncome : 0;

  // Total potential savings (don't double count - take max of each category)
  // Solo 401k + HSA are additive, S-Corp is alternative structure
  const retirementAndHSASavings = solo401kTaxSavings + hsaTaxSavings;
  const totalPotentialSavings = retirementAndHSASavings + Math.max(sCorpNetSavings, 0) + qbiTaxSavings;

  return {
    netIncome,
    currentSETax,
    solo401kEmployeeMax,
    solo401kEmployerMax,
    solo401kTotalMax,
    solo401kAdditionalRoom,
    solo401kTaxSavings,
    hsaMax,
    hsaAdditionalRoom,
    hsaTaxSavings,
    sCorpQualified,
    sCorpReasonableSalary,
    sCorpDistributions,
    sCorpSETaxSavings,
    sCorpNetSavings,
    qbiDeduction,
    qbiTaxSavings,
    totalPotentialSavings,
    marginalRate,
    effectiveRate,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + "%";
}
