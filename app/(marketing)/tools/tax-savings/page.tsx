import { Metadata } from "next";
import TaxSavingsLeadMagnet from "./TaxSavingsClient";

export const metadata: Metadata = {
  title: "Self-Employed Tax Savings Calculator | SoloFI",
  description: "Free tax savings calculator for freelancers and self-employed professionals. Find out how much you could save with an S-Corp, Solo 401(k), HSA, and other strategies.",
  openGraph: {
    title: "Self-Employed Tax Savings Calculator",
    description: "Find out how much you could save in taxes with an S-Corp, Solo 401(k), HSA, and more. Free calculator.",
    url: "https://solofi.io/tools/tax-savings",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=Tax+Savings+Calculator&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Self-Employed Tax Savings Calculator | SoloFI",
    description: "Find out how much you could save in taxes with an S-Corp, Solo 401(k), HSA, and more. Free calculator.",
    images: ["https://solofi.io/api/og?title=Tax+Savings+Calculator&category=Tools"],
  },
};

export default function TaxSavingsPage() {
  return <TaxSavingsLeadMagnet />;
}
