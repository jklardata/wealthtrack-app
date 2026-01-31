import ComparisonPage from "../ComparisonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoloFI vs QuickBooks Self-Employed | 2025 Comparison",
  description: "Compare SoloFI and QuickBooks Self-Employed for freelancer finances. See features, pricing, and which is best for your self-employed business.",
  keywords: ["quickbooks self-employed alternative", "quickbooks self-employed vs", "freelancer tax software", "self-employed accounting"],
};

export default function QuickBooksComparison() {
  return (
    <ComparisonPage
      competitor={{
        name: "QuickBooks Self-Employed",
        tagline: "Accounting software from Intuit",
        description: "QuickBooks Self-Employed is a simplified accounting tool designed for freelancers and sole proprietors, focusing on expense tracking and tax categorization.",
        pricing: "$15/mo",
        pricingNote: "or $30/mo with TurboTax",
        bestFor: [
          "Freelancers who need invoicing",
          "Those already in the Intuit ecosystem",
          "Simple expense tracking needs",
          "Quarterly tax estimation",
        ],
        limitations: [
          "No net worth tracking",
          "No FI planning tools",
          "Limited retirement optimization",
          "No S-Corp analysis",
          "Expensive for basic features",
          "Pushes TurboTax upsells",
        ],
      }}
      solofi={{
        pricing: "Free",
        pricingNote: "premium features coming soon",
        bestFor: [
          "Freelancers focused on building wealth",
          "Those pursuing financial independence",
          "Self-employed wanting tax optimization",
          "Solo business owners tracking net worth",
        ],
        advantages: [
          "Built specifically for FI-focused freelancers",
          "Tax optimization calculators (Solo 401k, HSA, S-Corp)",
          "Net worth tracking with FI projections",
          "Free to use",
          "No upsells or ecosystem lock-in",
        ],
      }}
      features={[
        { name: "Expense Tracking", solofi: true, competitor: true },
        { name: "Income Tracking", solofi: true, competitor: true },
        { name: "Quarterly Tax Estimates", solofi: true, competitor: true },
        { name: "Mileage Tracking", solofi: false, competitor: true },
        { name: "Invoicing", solofi: false, competitor: true },
        { name: "Net Worth Tracking", solofi: true, competitor: false, description: "Track all assets and liabilities" },
        { name: "FI Number Calculator", solofi: true, competitor: false, description: "Calculate your financial independence target" },
        { name: "Solo 401k Optimizer", solofi: true, competitor: false, description: "Maximize retirement contributions" },
        { name: "S-Corp Analysis", solofi: true, competitor: false, description: "Should you elect S-Corp status?" },
        { name: "HSA Optimization", solofi: true, competitor: false },
        { name: "Roth Conversion Planning", solofi: true, competitor: false },
        { name: "QBI Deduction Calculator", solofi: true, competitor: false },
        { name: "Bank Connection", solofi: "coming soon", competitor: true },
        { name: "Receipt Scanning", solofi: false, competitor: true },
        { name: "Tax Filing Integration", solofi: false, competitor: "TurboTax" },
        { name: "Price", solofi: "Free", competitor: "$15-30/mo" },
      ]}
      verdict={{
        title: "SoloFI is better for wealth-building freelancers",
        description: "QuickBooks Self-Employed is solid for basic bookkeeping, but if you're focused on optimizing taxes and building wealth toward financial independence, SoloFI offers specialized tools that QuickBooks lacks entirely.",
        chooseSolofi: [
          "Want to optimize retirement contributions (Solo 401k, SEP IRA)",
          "Are evaluating S-Corp election",
          "Track net worth and FI progress",
          "Want free tax optimization tools",
          "Focus on building long-term wealth",
          "Don't need invoicing features",
        ],
        chooseCompetitor: [
          "Need invoicing built-in",
          "Want mileage tracking",
          "Already use TurboTax and want integration",
          "Need receipt scanning",
          "Prefer established brand with phone support",
        ],
      }}
      seoKeywords={["quickbooks self-employed alternative", "quickbooks self-employed review", "best tax software freelancers"]}
    />
  );
}
