import ComparisonPage from "../ComparisonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoloFI vs Collective | S-Corp Services Comparison 2026",
  description: "Compare SoloFI and Collective for S-Corp formation and freelancer taxes. See if done-for-you S-Corp services are worth $299/month.",
  keywords: ["collective s-corp review", "collective alternative", "s-corp for freelancers", "collective pricing"],
  openGraph: {
    title: "SoloFI vs Collective — Is $299/mo S-Corp Worth It for Freelancers?",
    description: "Collective does your S-Corp taxes for you. SoloFI helps you decide if S-Corp is right and optimize your finances for free. Compare features and costs.",
    url: "https://solofi.io/compare/collective",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=SoloFI+vs+Collective&category=Compare", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloFI vs Collective | S-Corp Services Comparison 2026",
    description: "Collective does your S-Corp taxes for you. SoloFI helps you decide if S-Corp is right and optimize your finances for free. Compare features and costs.",
    images: ["https://solofi.io/api/og?title=SoloFI+vs+Collective&category=Compare"],
  },
  alternates: {
    canonical: "https://solofi.io/compare/collective",
  },
};

export default function CollectiveComparison() {
  return (
    <ComparisonPage
      competitor={{
        name: "Collective",
        tagline: "Done-for-you S-Corp formation and management",
        description: "Collective handles S-Corp formation, payroll, bookkeeping, and tax filing for freelancers. Full-service but premium priced.",
        pricing: "$299/mo",
        pricingNote: "+ $1,500 annual tax filing",
        bestFor: [
          "High-earning freelancers ($150K+)",
          "Those who want hands-off tax management",
          "People who hate paperwork",
          "Freelancers who value time over money",
        ],
        limitations: [
          "Very expensive ($5K+/year)",
          "Only makes sense at high income",
          "No net worth or FI tracking",
          "Locked into their ecosystem",
          "Less control over your finances",
          "Minimum income requirements",
        ],
      }}
      solofi={{
        pricing: "Free",
        pricingNote: "DIY with guidance",
        bestFor: [
          "Freelancers evaluating if S-Corp is right",
          "Those comfortable with some DIY",
          "Income $80K-$150K (Collective overkill)",
          "FI-focused freelancers wanting full control",
        ],
        advantages: [
          "Free S-Corp analysis calculator",
          "See exact savings before committing",
          "Works at any income level",
          "Full financial picture (not just taxes)",
          "Net worth and FI tracking included",
          "No monthly fees or commitments",
        ],
      }}
      features={[
        { name: "S-Corp Formation", solofi: "guidance", competitor: true, description: "LLC to S-Corp election" },
        { name: "S-Corp Savings Calculator", solofi: true, competitor: false, description: "See if S-Corp makes sense for you" },
        { name: "Payroll Management", solofi: false, competitor: true },
        { name: "Bookkeeping", solofi: false, competitor: true },
        { name: "Tax Filing", solofi: false, competitor: true },
        { name: "Quarterly Tax Estimates", solofi: true, competitor: true },
        { name: "Net Worth Tracking", solofi: true, competitor: false },
        { name: "FI Planning", solofi: true, competitor: false },
        { name: "Solo 401k Optimization", solofi: true, competitor: "partial", description: "They mention it, we calculate it" },
        { name: "HSA Optimization", solofi: true, competitor: false },
        { name: "Roth Conversion Planning", solofi: true, competitor: false },
        { name: "Dedicated Support", solofi: false, competitor: true },
        { name: "Works Without S-Corp", solofi: true, competitor: false, description: "Useful even as sole prop" },
        { name: "Portfolio Optimization", solofi: true, competitor: false },
        { name: "Withdrawal Stress Test", solofi: true, competitor: false, description: "Monte Carlo simulations" },
        { name: "Lifetime Income Projection", solofi: true, competitor: false },
        { name: "FEIE Calculator", solofi: true, competitor: false, description: "Foreign Earned Income Exclusion" },
        { name: "Geographic Arbitrage", solofi: true, competitor: false },
        { name: "Annual Cost", solofi: "$0", competitor: "$5,000+" },
      ]}
      verdict={{
        title: "Different tools for different situations",
        description: "Collective is a premium done-for-you service that makes sense for high earners who value convenience. SoloFI helps you understand your options and optimize your entire financial picture—whether or not you go the S-Corp route.",
        chooseSolofi: [
          "Want to understand S-Corp math before committing",
          "Earn $80K-$150K (Collective's fees eat your savings)",
          "Prefer DIY with good guidance",
          "Want net worth and FI tracking",
          "Value having full control of your finances",
          "Not sure if S-Corp is right for you yet",
        ],
        chooseCompetitor: [
          "Earn $200K+ and time is more valuable than money",
          "Hate dealing with taxes and payroll",
          "Want someone else to handle everything",
          "Can afford $5K+/year for convenience",
          "Already decided S-Corp is right for you",
        ],
      }}
      seoKeywords={["collective s-corp review", "collective alternative", "is collective worth it", "s-corp service freelancers"]}
    />
  );
}
