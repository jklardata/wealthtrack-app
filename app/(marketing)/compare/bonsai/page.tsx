import ComparisonPage from "../ComparisonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoloFI vs Bonsai | Freelance Software Comparison 2026",
  description: "Compare SoloFI and Bonsai for freelancers. See which platform is better for contracts, invoicing, and financial management.",
  keywords: ["bonsai freelance alternative", "bonsai review", "freelance invoicing software", "bonsai vs honeybook"],
  openGraph: {
    title: "SoloFI vs Bonsai — Which Freelance Platform Wins?",
    description: "Bonsai handles contracts and invoicing. SoloFI handles the financial planning side — taxes, S-Corp, retirement, and FI. Compare both for freelancers.",
    url: "https://solofi.io/compare/bonsai",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=SoloFI+vs+Bonsai&category=Compare", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloFI vs Bonsai | Freelance Software Comparison 2026",
    description: "Bonsai handles contracts and invoicing. SoloFI handles the financial planning side — taxes, S-Corp, retirement, and FI. Compare both for freelancers.",
    images: ["https://solofi.io/api/og?title=SoloFI+vs+Bonsai&category=Compare"],
  },
  alternates: {
    canonical: "https://solofi.io/compare/bonsai",
  },
};

export default function BonsaiComparison() {
  return (
    <ComparisonPage
      competitor={{
        name: "Bonsai",
        tagline: "All-in-one freelance management",
        description: "Bonsai is a business management platform for freelancers covering contracts, proposals, invoicing, accounting, and taxes. Strong on client management, lighter on financial optimization.",
        pricing: "$21/mo",
        pricingNote: "Workflow plan, up to $79/mo",
        bestFor: [
          "Freelancers needing contracts and proposals",
          "Those wanting all-in-one client management",
          "Designers, developers, consultants",
          "Freelancers who invoice clients regularly",
        ],
        limitations: [
          "Tax features are basic",
          "No retirement optimization tools",
          "No S-Corp analysis",
          "No FI planning features",
          "Net worth tracking absent",
          "Focused on operations, not wealth building",
        ],
      }}
      solofi={{
        pricing: "Free",
        pricingNote: "focused on financial optimization",
        bestFor: [
          "Freelancers focused on tax optimization",
          "Those building toward financial independence",
          "Self-employed wanting retirement guidance",
          "Solopreneurs tracking net worth",
        ],
        advantages: [
          "Deep tax optimization tools",
          "Solo 401k and SEP IRA calculators",
          "S-Corp decision analysis",
          "Net worth and FI tracking",
          "Quarterly tax estimation",
          "Free to use",
        ],
      }}
      features={[
        { name: "Contract Templates", solofi: false, competitor: true },
        { name: "Proposal Builder", solofi: false, competitor: true },
        { name: "Invoicing", solofi: false, competitor: true },
        { name: "Time Tracking", solofi: false, competitor: true },
        { name: "Client CRM", solofi: false, competitor: true },
        { name: "Expense Tracking", solofi: true, competitor: true },
        { name: "Basic Tax Estimates", solofi: true, competitor: true },
        { name: "1099 Tracking", solofi: true, competitor: true },
        { name: "Net Worth Tracking", solofi: true, competitor: false },
        { name: "FI Calculator", solofi: true, competitor: false },
        { name: "Solo 401k Optimizer", solofi: true, competitor: false },
        { name: "SEP IRA Calculator", solofi: true, competitor: false },
        { name: "S-Corp Analysis", solofi: true, competitor: false },
        { name: "HSA Optimization", solofi: true, competitor: false },
        { name: "Roth Conversion Planning", solofi: true, competitor: false },
        { name: "QBI Deduction Calculator", solofi: true, competitor: false },
        { name: "Portfolio Optimization", solofi: true, competitor: false },
        { name: "Withdrawal Stress Test", solofi: true, competitor: false, description: "Monte Carlo simulations" },
        { name: "Lifetime Income Projection", solofi: true, competitor: false },
        { name: "FEIE Calculator", solofi: true, competitor: false, description: "Foreign Earned Income Exclusion" },
        { name: "Geographic Arbitrage", solofi: true, competitor: false },
        { name: "Tax Filing", solofi: false, competitor: "Bonsai Tax ($10/mo)" },
        { name: "Price", solofi: "Free", competitor: "$21-79/mo" },
      ]}
      verdict={{
        title: "Bonsai runs your business; SoloFI builds your wealth",
        description: "Bonsai excels at the operational side of freelancing—contracts, invoices, client management. SoloFI excels at the financial optimization side—taxes, retirement, wealth building. Many freelancers benefit from using both.",
        chooseSolofi: [
          "Already have invoicing/contract tools (or don't need them)",
          "Want deep tax optimization features",
          "Are focused on retirement contributions",
          "Considering S-Corp election",
          "Tracking net worth and FI progress",
          "Want financial tools without monthly fees",
        ],
        chooseCompetitor: [
          "Need contracts and proposal templates",
          "Want all-in-one client management",
          "Need built-in invoicing",
          "Want time tracking for projects",
          "Prefer single platform for operations",
          "Don't mind paying for convenience",
        ],
      }}
      seoKeywords={["bonsai freelance alternative", "bonsai review", "bonsai vs honeybook", "freelance contract software"]}
    />
  );
}
