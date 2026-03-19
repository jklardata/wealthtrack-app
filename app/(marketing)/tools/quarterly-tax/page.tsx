import { Metadata } from "next";
import QuarterlyTaxEstimator from "./QuarterlyTaxClient";

export const metadata: Metadata = {
  title: "Quarterly Tax Estimator for Freelancers | SoloFI",
  description: "Free quarterly estimated tax calculator for self-employed professionals. Know exactly how much to set aside and when to pay to avoid IRS penalties.",
  openGraph: {
    title: "Quarterly Tax Estimator for Freelancers",
    description: "Know exactly how much to pay each quarter and avoid IRS penalties. Free calculator for self-employed.",
    url: "https://solofi.io/tools/quarterly-tax",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=Quarterly+Tax+Estimator&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quarterly Tax Estimator for Freelancers | SoloFI",
    description: "Know exactly how much to pay each quarter and avoid IRS penalties. Free calculator for self-employed.",
    images: ["https://solofi.io/api/og?title=Quarterly+Tax+Estimator&category=Tools"],
  },
};

export default function QuarterlyTaxPage() {
  return <QuarterlyTaxEstimator />;
}
