import { Metadata } from "next";
import BankingSetup from "./BankingSetupClient";

export const metadata: Metadata = {
  title: "Business Banking Setup Guide for Freelancers | SoloFI",
  description: "Free step-by-step guide to setting up your business banking as a freelancer or self-employed professional. Separate accounts, tax reserves, and the right structure from day one.",
  openGraph: {
    title: "Business Banking Setup Guide for Freelancers",
    description: "Set up your business banking the right way from day one. Free guide for self-employed professionals.",
    url: "https://solofi.io/tools/banking-setup",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=Banking+Setup+Guide&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Banking Setup Guide for Freelancers | SoloFI",
    description: "Set up your business banking the right way from day one. Free guide for self-employed professionals.",
    images: ["https://solofi.io/api/og?title=Banking+Setup+Guide&category=Tools"],
  },
};

export default function BankingSetupPage() {
  return <BankingSetup />;
}
