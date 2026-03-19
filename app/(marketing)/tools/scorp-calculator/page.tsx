import { Metadata } from "next";
import SCorpCalculator from "./SCorpCalculatorClient";

export const metadata: Metadata = {
  title: "S-Corp Calculator: Should You Elect S-Corp Status? | SoloFI",
  description: "Free S-Corp election calculator for self-employed professionals. Find out if an S-Corp saves you money at your income level, including payroll taxes, admin costs, and state fees.",
  openGraph: {
    title: "S-Corp Calculator — Is S-Corp Worth It for You?",
    description: "Find out if an S-Corp saves you money at your income level. Free calculator including all costs and savings.",
    url: "https://solofi.io/tools/scorp-calculator",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=S-Corp+Calculator&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "S-Corp Calculator: Should You Elect S-Corp Status? | SoloFI",
    description: "Find out if an S-Corp saves you money at your income level. Free calculator including all costs and savings.",
    images: ["https://solofi.io/api/og?title=S-Corp+Calculator&category=Tools"],
  },
};

export default function SCorpCalculatorPage() {
  return <SCorpCalculator />;
}
