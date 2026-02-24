import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "SoloFI | The Financial Platform for the Self-Employed",
    template: "%s | SoloFI",
  },
  description: "The financial platform for the self-employed.",
  openGraph: {
    title: "SoloFI | The Financial Platform for the Self-Employed",
    description: "The financial platform for the self-employed.",
    url: "https://solofi.io",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=The%20Financial%20Platform%20for%20the%20Self-Employed&category=Financial%20Planning",
        width: 1200,
        height: 630,
        alt: "SoloFI - The Financial Platform for the Self-Employed",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloFI | The Financial Platform for the Self-Employed",
    description: "The financial platform for the self-employed.",
    images: [
      "https://solofi.io/api/og?title=The%20Financial%20Platform%20for%20the%20Self-Employed&category=Financial%20Planning",
    ],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
