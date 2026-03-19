import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Free Financial Tools for Freelancers & Self-Employed | SoloFI",
  description:
    "Free financial planning tools and calculators built for self-employed professionals and freelancers. Estimate quarterly taxes, analyze S-Corp savings, track net worth, and plan for financial independence.",
  openGraph: {
    title: "Free Financial Tools for Freelancers & Self-Employed | SoloFI",
    description:
      "Free financial planning tools and calculators built for self-employed professionals. Quarterly tax estimates, S-Corp analysis, net worth tracking, and FI planning.",
    url: "https://solofi.io",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=Free+Financial+Tools+for+Freelancers&category=Financial+Planning",
        width: 1200,
        height: 630,
        alt: "SoloFI - Free Financial Tools for Freelancers and Self-Employed Professionals",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Financial Tools for Freelancers & Self-Employed | SoloFI",
    description:
      "Free financial planning tools and calculators built for self-employed professionals. Quarterly tax estimates, S-Corp analysis, net worth tracking, and FI planning.",
    images: [
      "https://solofi.io/api/og?title=Free+Financial+Tools+for+Freelancers&category=Financial+Planning",
    ],
  },
  alternates: {
    canonical: "https://solofi.io",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
