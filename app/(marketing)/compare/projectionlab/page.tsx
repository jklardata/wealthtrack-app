import ComparisonPage from "../ComparisonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoloFI vs ProjectionLab | FIRE Planning Comparison 2026",
  description: "Compare SoloFI and ProjectionLab for freelancers. See which FIRE planning tool is best for self-employed professionals pursuing financial independence.",
  keywords: ["projectionlab alternative", "projectionlab review", "fire planning tool self-employed", "projectionlab vs", "financial independence freelancers"],
  openGraph: {
    title: "SoloFI vs ProjectionLab — Best FIRE Tool for Freelancers?",
    description: "ProjectionLab models your future. SoloFI optimizes your present. Compare SE tax, S-Corp, Solo 401k, and FI tools for self-employed professionals.",
    url: "https://solofi.io/compare/projectionlab",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=SoloFI+vs+ProjectionLab&category=Compare", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloFI vs ProjectionLab | FIRE Planning Comparison 2026",
    description: "ProjectionLab models your future. SoloFI optimizes your present. Compare SE tax, S-Corp, Solo 401k, and FI tools for self-employed professionals.",
    images: ["https://solofi.io/api/og?title=SoloFI+vs+ProjectionLab&category=Compare"],
  },
  alternates: {
    canonical: "https://solofi.io/compare/projectionlab",
  },
};

export default function ProjectionLabComparison() {
  return (
    <ComparisonPage
      competitor={{
        name: "ProjectionLab",
        tagline: "Model your financial future",
        description: "ProjectionLab is a detailed FIRE planning and financial modeling tool popular in the FIRE community. Strong for scenario analysis and long-term projections. Built for technically inclined DIY investors.",
        pricing: "$11/mo",
        pricingNote: "or $99/yr for premium",
        bestFor: [
          "FIRE enthusiasts who love detailed scenario modeling",
          "DIY investors with complex portfolios",
          "Those wanting granular what-if analysis",
          "Technical users comfortable with financial modeling",
        ],
        limitations: [
          "No self-employment tax calculator",
          "No S-Corp or business structure analysis",
          "No quarterly tax estimation for freelancers",
          "No FEIE or geographic arbitrage calculators",
          "Steep learning curve for non-technical users",
          "Not designed for self-employed income complexity",
        ],
      }}
      solofi={{
        pricing: "Free",
        pricingNote: "freelancer-first",
        bestFor: [
          "Freelancers and self-employed pursuing FIRE",
          "Solopreneurs optimizing taxes while building wealth",
          "Self-employed wanting S-Corp and retirement guidance",
          "Those exploring geographic arbitrage strategies",
        ],
        advantages: [
          "SE tax and quarterly payment calculators",
          "S-Corp analysis—critical for high-earning freelancers",
          "Solo 401k and SEP IRA optimization",
          "FEIE and geographic arbitrage tools",
          "Portfolio optimization and withdrawal stress test",
          "Free to use",
        ],
      }}
      features={[
        { name: "Net Worth Tracking", solofi: true, competitor: true },
        { name: "FI / FIRE Calculator", solofi: true, competitor: true },
        { name: "Lifetime Income Projection", solofi: true, competitor: true },
        { name: "Withdrawal Stress Test", solofi: true, competitor: true, description: "Monte Carlo simulations" },
        { name: "Roth Conversion Planning", solofi: true, competitor: true },
        { name: "Portfolio Optimization", solofi: true, competitor: "basic" },
        { name: "Scenario Modeling", solofi: "basic", competitor: true },
        { name: "SE Tax Calculator", solofi: true, competitor: false, description: "Self-employment tax for freelancers" },
        { name: "Quarterly Tax Estimates", solofi: true, competitor: false },
        { name: "S-Corp Analysis", solofi: true, competitor: false },
        { name: "Solo 401k / SEP IRA Optimizer", solofi: true, competitor: false },
        { name: "HSA Optimization", solofi: true, competitor: false },
        { name: "QBI Deduction Calculator", solofi: true, competitor: false },
        { name: "FEIE Calculator", solofi: true, competitor: false, description: "Foreign Earned Income Exclusion" },
        { name: "Geographic Arbitrage", solofi: true, competitor: false },
        { name: "Collaboration / Sharing", solofi: false, competitor: true },
        { name: "Bank Syncing", solofi: "coming soon", competitor: false },
        { name: "Price", solofi: "Free", competitor: "$11/mo ($99/yr)" },
      ]}
      verdict={{
        title: "ProjectionLab models your future; SoloFI optimizes your present",
        description: "ProjectionLab is excellent for FIRE enthusiasts who want to stress-test detailed scenarios—if you love spreadsheets, you'll love it. But if you're self-employed, it's missing the tools that actually move the needle: SE tax, S-Corp analysis, Solo 401k, and FEIE. SoloFI covers both the projection and the optimization.",
        chooseSolofi: [
          "Are self-employed or freelance and need SE tax tools",
          "Want S-Corp analysis to decide your business structure",
          "Need Solo 401k and SEP IRA optimization",
          "Are exploring geographic arbitrage or FEIE",
          "Want financial tools purpose-built for solopreneurs",
          "Prefer a free, streamlined experience",
        ],
        chooseCompetitor: [
          "Love deep scenario modeling and granular what-if analysis",
          "Are a W-2 employee with complex investment portfolios",
          "Want detailed partner/spouse collaboration features",
          "Are comfortable with a technical, data-heavy interface",
          "Want the most detailed FIRE planning tool available",
        ],
      }}
      seoKeywords={["projectionlab alternative", "projectionlab review", "fire planning self-employed", "projectionlab vs boldin", "financial independence freelancers"]}
    />
  );
}
