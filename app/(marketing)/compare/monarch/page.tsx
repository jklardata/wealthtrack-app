import ComparisonPage from "../ComparisonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoloFI vs Monarch Money | Finance Tracker Comparison 2025",
  description: "Compare SoloFI and Monarch Money for freelancers. See which financial tracking app is best for self-employed professionals.",
  keywords: ["monarch money alternative", "monarch money review", "mint alternative freelancers", "monarch vs"],
};

export default function MonarchComparison() {
  return (
    <ComparisonPage
      competitor={{
        name: "Monarch Money",
        tagline: "The modern way to manage your money",
        description: "Monarch Money is a comprehensive personal finance platform that replaced Mint for many users. Great for budgeting, goal tracking, and household finance management.",
        pricing: "$15/mo",
        pricingNote: "or $100/year",
        bestFor: [
          "Households managing shared finances",
          "People who loved Mint",
          "Those wanting collaborative budgeting",
          "General financial planning",
        ],
        limitations: [
          "No freelancer-specific features",
          "Doesn't understand SE tax",
          "No quarterly tax estimation",
          "No retirement optimization for self-employed",
          "No S-Corp or business tools",
          "Built for W-2 employees and households",
        ],
      }}
      solofi={{
        pricing: "Free",
        pricingNote: "freelancer-focused",
        bestFor: [
          "Self-employed individuals",
          "Freelancers and consultants",
          "Solopreneurs building wealth",
          "Those pursuing FIRE as a freelancer",
        ],
        advantages: [
          "Understands freelancer finances",
          "SE tax and quarterly payment tools",
          "Retirement optimization calculators",
          "S-Corp decision tools",
          "FI planning features",
          "Free to use",
        ],
      }}
      features={[
        { name: "Bank Syncing", solofi: "coming soon", competitor: true },
        { name: "Net Worth Tracking", solofi: true, competitor: true },
        { name: "Investment Tracking", solofi: true, competitor: true },
        { name: "Budget Categories", solofi: "basic", competitor: true },
        { name: "Goals & Milestones", solofi: true, competitor: true },
        { name: "Household Collaboration", solofi: false, competitor: true, description: "Share finances with partner" },
        { name: "Financial Reports", solofi: true, competitor: true },
        { name: "SE Tax Calculator", solofi: true, competitor: false },
        { name: "Quarterly Tax Estimates", solofi: true, competitor: false },
        { name: "Solo 401k Optimizer", solofi: true, competitor: false },
        { name: "SEP IRA Calculator", solofi: true, competitor: false },
        { name: "S-Corp Analysis", solofi: true, competitor: false },
        { name: "HSA Optimization", solofi: true, competitor: false },
        { name: "FI Calculator", solofi: true, competitor: false, description: "Financial independence projections" },
        { name: "Roth Conversion Ladder", solofi: true, competitor: false },
        { name: "QBI Deduction Calc", solofi: true, competitor: false },
        { name: "Portfolio Optimization", solofi: true, competitor: false },
        { name: "Withdrawal Stress Test", solofi: true, competitor: false, description: "Monte Carlo simulations" },
        { name: "Lifetime Income Projection", solofi: true, competitor: false },
        { name: "FEIE Calculator", solofi: true, competitor: false, description: "Foreign Earned Income Exclusion" },
        { name: "Geographic Arbitrage", solofi: true, competitor: false },
        { name: "Advisor Access", solofi: false, competitor: "paid add-on" },
        { name: "Price", solofi: "Free", competitor: "$15/mo" },
      ]}
      verdict={{
        title: "Monarch is excellent, but built for employees",
        description: "Monarch Money is arguably the best Mint replacement for W-2 employees and households. But freelancers have unique needs—SE tax, quarterly payments, Solo 401k optimization—that Monarch simply doesn't address. SoloFI fills that gap.",
        chooseSolofi: [
          "Are self-employed or have freelance income",
          "Need quarterly tax estimation",
          "Want Solo 401k / SEP IRA optimization",
          "Are evaluating S-Corp election",
          "Pursuing FI as a freelancer",
          "Want specialized tools for free",
        ],
        chooseCompetitor: [
          "Are primarily a W-2 employee",
          "Want to manage household finances with a partner",
          "Need detailed budgeting with rules",
          "Prefer established platform with support",
          "Don't have significant self-employment income",
        ],
      }}
      seoKeywords={["monarch money alternative", "monarch money review", "mint replacement freelancers", "best budget app"]}
    />
  );
}
