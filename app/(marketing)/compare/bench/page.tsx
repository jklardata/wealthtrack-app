import ComparisonPage from "../ComparisonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoloFI vs Bench Accounting | Bookkeeping Comparison 2026",
  description: "Compare SoloFI and Bench for freelancer bookkeeping. See if done-for-you bookkeeping is worth the cost for solopreneurs.",
  keywords: ["bench bookkeeping alternative", "bench accounting review", "bookkeeping for freelancers", "bench pricing"],
  openGraph: {
    title: "SoloFI vs Bench Accounting — Worth It for Freelancers?",
    description: "Is Bench's done-for-you bookkeeping worth the cost? Compare with SoloFI's free financial planning tools for self-employed professionals.",
    url: "https://solofi.io/compare/bench",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=SoloFI+vs+Bench&category=Compare", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloFI vs Bench Accounting | Bookkeeping Comparison 2026",
    description: "Is Bench's done-for-you bookkeeping worth the cost? Compare with SoloFI's free financial planning tools for self-employed professionals.",
    images: ["https://solofi.io/api/og?title=SoloFI+vs+Bench&category=Compare"],
  },
  alternates: {
    canonical: "https://solofi.io/compare/bench",
  },
};

export default function BenchComparison() {
  return (
    <ComparisonPage
      competitor={{
        name: "Bench",
        tagline: "Professional bookkeeping for small businesses",
        description: "Bench provides done-for-you bookkeeping with a dedicated team. They handle transaction categorization, reconciliation, and financial statements monthly.",
        pricing: "$299/mo",
        pricingNote: "starting price",
        bestFor: [
          "Businesses with complex transactions",
          "Those who hate bookkeeping",
          "Freelancers with high volume",
          "People who want professional financials",
        ],
        limitations: [
          "Expensive for solopreneurs ($3,600+/year)",
          "Overkill for simple freelance businesses",
          "No tax optimization tools",
          "No FI or wealth planning",
          "No retirement contribution optimization",
          "Just bookkeeping, not strategy",
        ],
      }}
      solofi={{
        pricing: "Free",
        pricingNote: "self-service with smart tools",
        bestFor: [
          "Solopreneurs with straightforward finances",
          "Freelancers who want optimization, not just tracking",
          "Those focused on building wealth",
          "Self-employed pursuing FI",
        ],
        advantages: [
          "Free tax optimization calculators",
          "Net worth and FI tracking",
          "Retirement contribution optimization",
          "S-Corp analysis tools",
          "Quarterly tax estimation",
          "Wealth building focus, not just compliance",
        ],
      }}
      features={[
        { name: "Transaction Categorization", solofi: "manual", competitor: "done for you" },
        { name: "Bank Reconciliation", solofi: "coming soon", competitor: true },
        { name: "Monthly Financial Statements", solofi: false, competitor: true },
        { name: "Dedicated Bookkeeper", solofi: false, competitor: true },
        { name: "Catch-up Bookkeeping", solofi: false, competitor: "paid add-on" },
        { name: "Tax-Ready Financials", solofi: false, competitor: true },
        { name: "Net Worth Tracking", solofi: true, competitor: false },
        { name: "FI Planning & Projections", solofi: true, competitor: false },
        { name: "Quarterly Tax Estimates", solofi: true, competitor: false },
        { name: "Solo 401k Calculator", solofi: true, competitor: false },
        { name: "S-Corp Analysis", solofi: true, competitor: false },
        { name: "HSA Optimization", solofi: true, competitor: false },
        { name: "Tax Savings Identification", solofi: true, competitor: false, description: "Find deductions you're missing" },
        { name: "Roth Conversion Planning", solofi: true, competitor: false },
        { name: "Portfolio Optimization", solofi: true, competitor: false },
        { name: "Withdrawal Stress Test", solofi: true, competitor: false, description: "Monte Carlo simulations" },
        { name: "Lifetime Income Projection", solofi: true, competitor: false },
        { name: "FEIE Calculator", solofi: true, competitor: false, description: "Foreign Earned Income Exclusion" },
        { name: "Geographic Arbitrage", solofi: true, competitor: false },
        { name: "Human Support", solofi: false, competitor: true },
        { name: "Price", solofi: "Free", competitor: "$299+/mo" },
      ]}
      verdict={{
        title: "Bench is bookkeeping; SoloFI is financial optimization",
        description: "Bench solves the problem of 'I hate doing my books.' SoloFI solves the problem of 'Am I optimizing my freelance finances?' Most solopreneurs with simple businesses don't need $300/month bookkeeping—they need smart tools to make better financial decisions.",
        chooseSolofi: [
          "Have straightforward freelance finances",
          "Can categorize your own transactions",
          "Want tax optimization, not just tracking",
          "Are focused on building wealth toward FI",
          "Don't want to spend $3,600+/year on bookkeeping",
          "Need retirement and S-Corp guidance",
        ],
        chooseCompetitor: [
          "Have complex business with many transactions",
          "Truly hate touching your finances",
          "Need professional financial statements",
          "Have budget for done-for-you service",
          "Want human bookkeeper you can call",
          "Time is worth more than $300/month to you",
        ],
      }}
      seoKeywords={["bench bookkeeping alternative", "bench accounting review", "bookkeeping for freelancers", "bench worth it"]}
    />
  );
}
