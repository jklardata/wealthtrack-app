import ComparisonPage from "../ComparisonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoloFI vs Copilot Money | Finance App Comparison 2025",
  description: "Compare SoloFI and Copilot Money for tracking finances. See which app is better for freelancers and self-employed professionals.",
  keywords: ["copilot money alternative", "copilot app review", "best finance app freelancers", "copilot vs"],
};

export default function CopilotComparison() {
  return (
    <ComparisonPage
      competitor={{
        name: "Copilot",
        tagline: "Smart money management app",
        description: "Copilot is a beautifully designed personal finance app focused on budgeting, spending insights, and investment tracking. Popular with tech-savvy users.",
        pricing: "$10/mo",
        pricingNote: "or $70/year",
        bestFor: [
          "People who love great design",
          "General budgeting and spending tracking",
          "Investment portfolio monitoring",
          "Those wanting a modern Mint alternative",
        ],
        limitations: [
          "Not designed for self-employed",
          "No freelancer tax tools",
          "No SE tax or quarterly payment help",
          "No retirement optimization for freelancers",
          "No S-Corp or business structure tools",
          "Treats all income the same",
        ],
      }}
      solofi={{
        pricing: "Free",
        pricingNote: "built for freelancers",
        bestFor: [
          "Freelancers and self-employed",
          "Those focused on tax optimization",
          "FI-focused solopreneurs",
          "Anyone with self-employment income",
        ],
        advantages: [
          "Built specifically for freelancers",
          "Understands SE tax and quarterly payments",
          "Tax optimization calculators",
          "S-Corp analysis tools",
          "Retirement planning for self-employed",
          "FI-focused features",
        ],
      }}
      features={[
        { name: "Bank Account Syncing", solofi: "coming soon", competitor: true },
        { name: "Spending Tracking", solofi: true, competitor: true },
        { name: "Beautiful Design", solofi: true, competitor: true },
        { name: "Investment Tracking", solofi: true, competitor: true },
        { name: "Net Worth Tracking", solofi: true, competitor: true },
        { name: "Budgeting Tools", solofi: "basic", competitor: true },
        { name: "Self-Employment Tax Calc", solofi: true, competitor: false, description: "Calculate SE tax on freelance income" },
        { name: "Quarterly Tax Estimates", solofi: true, competitor: false },
        { name: "Solo 401k Calculator", solofi: true, competitor: false },
        { name: "S-Corp Analysis", solofi: true, competitor: false },
        { name: "HSA Optimization", solofi: true, competitor: false },
        { name: "FI Number Calculator", solofi: true, competitor: false },
        { name: "Roth Conversion Planning", solofi: true, competitor: false },
        { name: "Business vs Personal Split", solofi: true, competitor: false },
        { name: "iOS App", solofi: "coming soon", competitor: true },
        { name: "Price", solofi: "Free", competitor: "$10/mo" },
      ]}
      verdict={{
        title: "Copilot is great, but not for freelancers",
        description: "Copilot is one of the best-designed personal finance apps available. But it treats all income the same—it doesn't understand the unique challenges of self-employment. If you're a freelancer, SoloFI's specialized tools will save you more money.",
        chooseSolofi: [
          "Have self-employment or freelance income",
          "Need to estimate quarterly taxes",
          "Want to optimize Solo 401k contributions",
          "Are considering S-Corp election",
          "Focus on financial independence",
          "Want freelancer-specific features free",
        ],
        chooseCompetitor: [
          "Are a W-2 employee (not self-employed)",
          "Prioritize beautiful app design above all",
          "Want robust iOS app experience",
          "Need detailed budgeting categories",
          "Don't have freelance income",
        ],
      }}
      seoKeywords={["copilot money alternative", "copilot app review", "copilot vs mint", "best finance app"]}
    />
  );
}
