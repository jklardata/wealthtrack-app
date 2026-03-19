import { Metadata } from "next";
import FEIEChecker from "./FEIECheckerClient";

export const metadata: Metadata = {
  title: "FEIE Eligibility Checker | SoloFI",
  description: "Free tool to check if you qualify for the Foreign Earned Income Exclusion (FEIE). Answer a few questions and find out if you can exclude up to $126,500 of foreign income from US taxes.",
  openGraph: {
    title: "FEIE Eligibility Checker — Do You Qualify?",
    description: "Find out if you qualify for the Foreign Earned Income Exclusion and how much you can exclude from US taxes.",
    url: "https://solofi.io/tools/feie-checker",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=FEIE+Eligibility+Checker&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FEIE Eligibility Checker | SoloFI",
    description: "Find out if you qualify for the Foreign Earned Income Exclusion and how much you can exclude from US taxes.",
    images: ["https://solofi.io/api/og?title=FEIE+Eligibility+Checker&category=Tools"],
  },
};

export default function FEIECheckerPage() {
  return <FEIEChecker />;
}
