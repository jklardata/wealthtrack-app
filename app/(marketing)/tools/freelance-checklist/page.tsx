import { Metadata } from "next";
import FreelanceChecklist from "./FreelanceChecklistClient";

export const metadata: Metadata = {
  title: "First-Year Freelance Financial Checklist | SoloFI",
  description: "Free financial setup checklist for new freelancers and self-employed professionals. Covers business structure, banking, taxes, retirement accounts, insurance, and contracts.",
  openGraph: {
    title: "First-Year Freelance Financial Checklist",
    description: "Everything you need to set up your finances as a new freelancer. Free checklist covering structure, taxes, banking, and more.",
    url: "https://solofi.io/tools/freelance-checklist",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=Freelance+Financial+Checklist&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "First-Year Freelance Financial Checklist | SoloFI",
    description: "Everything you need to set up your finances as a new freelancer. Free checklist covering structure, taxes, banking, and more.",
    images: ["https://solofi.io/api/og?title=Freelance+Financial+Checklist&category=Tools"],
  },
};

export default function FreelanceChecklistPage() {
  return <FreelanceChecklist />;
}
