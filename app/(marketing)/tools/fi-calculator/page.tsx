import { Metadata } from "next";
import FICalculator from "./FICalculatorClient";

export const metadata: Metadata = {
  title: "Financial Independence Calculator for Freelancers | SoloFI",
  description: "Free FI calculator for self-employed professionals. Find your FIRE number, see how long until financial independence, and model different savings and income scenarios.",
  openGraph: {
    title: "Financial Independence Calculator for Freelancers",
    description: "Find your FIRE number and see how long until financial independence. Model different scenarios free.",
    url: "https://solofi.io/tools/fi-calculator",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=FI+Calculator&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Independence Calculator for Freelancers | SoloFI",
    description: "Find your FIRE number and see how long until financial independence. Model different scenarios free.",
    images: ["https://solofi.io/api/og?title=FI+Calculator&category=Tools"],
  },
};

export default function FICalculatorPage() {
  return <FICalculator />;
}
