import ComparisonPage from "../ComparisonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoloFI vs Boldin | Retirement Planning Comparison 2026",
  description: "Compare SoloFI and Boldin (formerly NewRetirement) for freelancers. See which retirement planning tool is best for self-employed professionals.",
  keywords: ["boldin alternative", "boldin review", "newretirement alternative", "retirement planning self-employed", "boldin vs"],
  openGraph: {
    title: "SoloFI vs Boldin — Which Retirement Tool Wins for Freelancers?",
    description: "Boldin is built for pre-retirees. SoloFI is built for self-employed professionals who need SE tax, S-Corp analysis, and FI planning.",
    url: "https://solofi.io/compare/boldin",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=SoloFI+vs+Boldin&category=Compare", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloFI vs Boldin | Retirement Planning Comparison 2026",
    description: "Boldin is built for pre-retirees. SoloFI is built for self-employed professionals who need SE tax, S-Corp analysis, and FI planning.",
    images: ["https://solofi.io/api/og?title=SoloFI+vs+Boldin&category=Compare"],
  },
  alternates: {
    canonical: "https://solofi.io/compare/boldin",
  },
};

export default function BoldinComparison() {
  return (
    <ComparisonPage
      competitor={{
        name: "Boldin",
        tagline: "Plan your retirement with confidence",
        description: "Boldin (formerly NewRetirement) is a comprehensive retirement planning platform with detailed projections, Social Security analysis, and Monte Carlo simulations. Built for pre-retirees navigating complex financial situations.",
        pricing: "Free",
        pricingNote: "PlannerPlus $120/yr",
        bestFor: [
          "Pre-retirees with complex financial situations",
          "Those within 5–10 years of traditional retirement",
          "People wanting detailed Social Security analysis",
          "DIY retirement planners with W-2 income",
        ],
        limitations: [
          "Not designed for self-employed or freelancers",
          "No SE tax calculator or quarterly estimates",
          "No S-Corp analysis tools",
          "No FEIE or geographic arbitrage planning",
          "Steep learning curve and complex interface",
          "No portfolio optimization or credit card tools",
        ],
      }}
      solofi={{
        pricing: "Free",
        pricingNote: "built for self-employed",
        bestFor: [
          "Freelancers and self-employed professionals",
          "Those pursuing early retirement or FI",
          "Self-employed wanting tax-optimized retirement",
          "Solopreneurs building toward independence",
        ],
        advantages: [
          "SE tax and quarterly payment calculators",
          "S-Corp analysis—unique to self-employed",
          "Solo 401k and SEP IRA optimization",
          "FEIE and geographic arbitrage tools",
          "Portfolio optimization and withdrawal stress test",
          "Simpler, purpose-built for solopreneurs",
        ],
      }}
      features={[
        { name: "Retirement Projections", solofi: true, competitor: true },
        { name: "Social Security Analysis", solofi: false, competitor: true },
        { name: "Monte Carlo / Stress Test", solofi: true, competitor: true, description: "Withdrawal survival simulations" },
        { name: "Roth Conversion Planning", solofi: true, competitor: true },
        { name: "Net Worth Tracking", solofi: true, competitor: true },
        { name: "Lifetime Income Projection", solofi: true, competitor: true },
        { name: "Portfolio Optimization", solofi: true, competitor: "basic" },
        { name: "SE Tax Calculator", solofi: true, competitor: false, description: "Self-employment tax estimation" },
        { name: "Quarterly Tax Estimates", solofi: true, competitor: false },
        { name: "S-Corp Analysis", solofi: true, competitor: false },
        { name: "Solo 401k / SEP IRA Optimizer", solofi: true, competitor: false },
        { name: "HSA Optimization", solofi: true, competitor: false },
        { name: "QBI Deduction Calculator", solofi: true, competitor: false },
        { name: "FEIE Calculator", solofi: true, competitor: false, description: "Foreign Earned Income Exclusion" },
        { name: "Geographic Arbitrage", solofi: true, competitor: false },
        { name: "Estate Planning", solofi: false, competitor: true },
        { name: "Advisor Access", solofi: false, competitor: "paid add-on" },
        { name: "Price", solofi: "Free", competitor: "Free / $120/yr" },
      ]}
      verdict={{
        title: "Boldin is for retirees; SoloFI is for self-employed builders",
        description: "Boldin is a powerful tool for people approaching retirement who want detailed Social Security analysis and estate planning. SoloFI is built for freelancers who need to optimize their tax situation now—SE tax, S-Corp analysis, Solo 401k—while tracking progress toward FI. Different tools for different stages.",
        chooseSolofi: [
          "Are self-employed or have freelance income",
          "Need SE tax and quarterly payment help",
          "Want S-Corp analysis before committing to a structure",
          "Are exploring geographic arbitrage or FEIE",
          "Want simpler tools designed for solopreneurs",
          "Are pursuing early FI, not traditional retirement at 65",
        ],
        chooseCompetitor: [
          "Are within 5 years of traditional retirement",
          "Have complex Social Security optimization needs",
          "Want detailed estate planning tools",
          "Have primarily W-2 income with straightforward taxes",
          "Want professional advisor integration",
        ],
      }}
      seoKeywords={["boldin alternative", "newretirement alternative", "boldin review", "retirement planning freelancers", "boldin vs newretirement"]}
    />
  );
}
