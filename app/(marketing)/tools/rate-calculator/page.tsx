import { Metadata } from "next";
import RateCalculator from "./RateCalculatorClient";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator | SoloFI",
  description: "Free freelance rate calculator. Find out exactly what to charge per hour or per project to hit your income goals after taxes, expenses, and time off.",
  openGraph: {
    title: "Freelance Rate Calculator — What Should You Charge?",
    description: "Calculate your freelance rate based on your income goals, taxes, expenses, and billable hours. Free tool.",
    url: "https://solofi.io/tools/rate-calculator",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=Freelance+Rate+Calculator&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelance Rate Calculator | SoloFI",
    description: "Calculate your freelance rate based on your income goals, taxes, expenses, and billable hours. Free tool.",
    images: ["https://solofi.io/api/og?title=Freelance+Rate+Calculator&category=Tools"],
  },
};

export default function RateCalculatorPage() {
  return <RateCalculator />;
}
