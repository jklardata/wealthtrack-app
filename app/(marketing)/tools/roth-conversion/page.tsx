import { Metadata } from "next";
import RothConversionLeadMagnet from "./RothConversionClient";

export const metadata: Metadata = {
  title: "Roth Conversion Calculator for Self-Employed | SoloFI",
  description: "Free Roth conversion calculator. Find the optimal amount to convert each year to minimize lifetime taxes. Built for freelancers and self-employed professionals.",
  openGraph: {
    title: "Roth Conversion Calculator for Self-Employed",
    description: "Find the optimal Roth conversion amount to minimize lifetime taxes. Free calculator for freelancers.",
    url: "https://solofi.io/tools/roth-conversion",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=Roth+Conversion+Calculator&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roth Conversion Calculator for Self-Employed | SoloFI",
    description: "Find the optimal Roth conversion amount to minimize lifetime taxes. Free calculator for freelancers.",
    images: ["https://solofi.io/api/og?title=Roth+Conversion+Calculator&category=Tools"],
  },
};

export default function RothConversionPage() {
  return <RothConversionLeadMagnet />;
}
