import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoloFI | Financial Independence for Consultants",
  description: "Tax optimization and retirement outcomes for the self-employed, business owners, and FIRE seekers.",
  openGraph: {
    title: "SoloFI | Financial Independence for Consultants",
    description: "Tax optimization and retirement outcomes for the self-employed, business owners, and FIRE seekers.",
    url: "https://solofi.io",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=Financial%20Independence%20for%20Consultants&category=Financial%20Planning",
        width: 1200,
        height: 630,
        alt: "SoloFI - Financial Independence for Consultants",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloFI - Financial Independence for Consultants",
    description: "Tax optimization and retirement outcomes for the self-employed, business owners, and FIRE seekers.",
    images: ["https://solofi.io/api/og?title=Financial%20Independence%20for%20Consultants&category=Financial%20Planning"],
  },
  alternates: {
    canonical: "https://solofi.io",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://solofi.io/#website",
      url: "https://solofi.io",
      name: "SoloFI",
      description: "Tax optimization and retirement outcomes for the self-employed, business owners, and FIRE seekers.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://solofi.io/blog?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://solofi.io/#organization",
      name: "SoloFI",
      url: "https://solofi.io",
      logo: {
        "@type": "ImageObject",
        url: "https://solofi.io/favicon.ico",
      },
      sameAs: [],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
