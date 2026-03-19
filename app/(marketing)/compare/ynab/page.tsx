import ComparisonPage from "../ComparisonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoloFI vs YNAB | Budgeting App Comparison 2026",
  description: "Compare SoloFI and YNAB for freelancers. See why self-employed professionals need more than zero-based budgeting to build real wealth.",
  keywords: ["ynab alternative", "ynab review", "you need a budget freelancers", "ynab vs mint", "budgeting app self-employed"],
  openGraph: {
    title: "SoloFI vs YNAB — Which Is Better for Freelancers?",
    description: "YNAB controls spending. SoloFI builds wealth. Compare budgeting, tax optimization, S-Corp analysis, and FI planning tools for self-employed professionals.",
    url: "https://solofi.io/compare/ynab",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=SoloFI+vs+YNAB&category=Compare", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloFI vs YNAB | Budgeting App Comparison 2026",
    description: "YNAB controls spending. SoloFI builds wealth. Compare budgeting, tax optimization, S-Corp analysis, and FI planning tools for self-employed professionals.",
    images: ["https://solofi.io/api/og?title=SoloFI+vs+YNAB&category=Compare"],
  },
  alternates: {
    canonical: "https://solofi.io/compare/ynab",
  },
};

export default function YNABComparison() {
  return (
    <ComparisonPage
      competitor={{
        name: "YNAB",
        tagline: "Give every dollar a job",
        description: "YNAB (You Need A Budget) is a zero-based budgeting app built to help you control spending, pay off debt, and build saving habits. Excellent at what it does—but it's a budgeting tool, not a wealth-building platform.",
        pricing: "$14.99/mo",
        pricingNote: "or $99/year",
        bestFor: [
          "People focused on controlling spending",
          "Those paying off debt or building an emergency fund",
          "Households wanting a shared budgeting system",
          "People new to budgeting who need structure",
        ],
        limitations: [
          "Budgeting-only—no investment or net worth tools",
          "No retirement or FI planning",
          "No SE tax calculator or quarterly estimates",
          "Not built for irregular freelance income",
          "No S-Corp, Solo 401k, or tax optimization",
          "Monthly fee for a spending-focused mindset",
        ],
      }}
      solofi={{
        pricing: "Free",
        pricingNote: "wealth-building for freelancers",
        bestFor: [
          "Freelancers building toward financial independence",
          "Self-employed wanting tax optimization",
          "Solopreneurs tracking net worth and trajectory",
          "Anyone with self-employment income",
        ],
        advantages: [
          "Net worth tracking and lifetime income projection",
          "SE tax and quarterly payment calculators",
          "Retirement contribution optimization (Solo 401k, SEP IRA)",
          "S-Corp analysis—critical for high earners",
          "Portfolio optimization and withdrawal stress test",
          "FEIE and geographic arbitrage tools",
          "Free to use",
        ],
      }}
      features={[
        { name: "Zero-Based Budgeting", solofi: false, competitor: true, description: "Assign every dollar a category" },
        { name: "Spending Tracking", solofi: true, competitor: true },
        { name: "Bank Syncing", solofi: "coming soon", competitor: true },
        { name: "Net Worth Tracking", solofi: true, competitor: "basic", description: "SoloFI shows full trajectory" },
        { name: "Investment Tracking", solofi: true, competitor: false },
        { name: "Portfolio Optimization", solofi: true, competitor: false },
        { name: "Lifetime Income Projection", solofi: true, competitor: false },
        { name: "Withdrawal Stress Test", solofi: true, competitor: false, description: "Monte Carlo simulations" },
        { name: "FI / FIRE Calculator", solofi: true, competitor: false },
        { name: "Roth Conversion Planning", solofi: true, competitor: false },
        { name: "SE Tax Calculator", solofi: true, competitor: false },
        { name: "Quarterly Tax Estimates", solofi: true, competitor: false },
        { name: "Solo 401k / SEP IRA Optimizer", solofi: true, competitor: false },
        { name: "S-Corp Analysis", solofi: true, competitor: false },
        { name: "HSA Optimization", solofi: true, competitor: false },
        { name: "FEIE Calculator", solofi: true, competitor: false, description: "Foreign Earned Income Exclusion" },
        { name: "Geographic Arbitrage", solofi: true, competitor: false },
        { name: "Debt Payoff Planning", solofi: false, competitor: true },
        { name: "Price", solofi: "Free", competitor: "$14.99/mo" },
      ]}
      verdict={{
        title: "YNAB controls spending; SoloFI builds wealth",
        description: "YNAB is the gold standard for budgeting and debt payoff—it's a behavioral change tool that works. But freelancers need more: SE tax optimization, retirement planning, S-Corp analysis, and FI projections. SoloFI fills that gap with tools built specifically for self-employed income.",
        chooseSolofi: [
          "Are self-employed or have freelance income",
          "Want to optimize taxes, not just track spending",
          "Need Solo 401k, SEP IRA, or S-Corp guidance",
          "Are focused on financial independence or early retirement",
          "Want portfolio optimization and withdrawal planning",
          "Prefer free, wealth-building focused tools",
        ],
        chooseCompetitor: [
          "Struggle with impulse spending and need structure",
          "Are focused on paying off debt",
          "Want a zero-based budgeting system",
          "Manage household finances with a partner",
          "Are a W-2 employee with simple, predictable income",
        ],
      }}
      seoKeywords={["ynab alternative", "ynab review", "you need a budget self-employed", "budgeting app freelancers", "ynab vs"]}
    />
  );
}
