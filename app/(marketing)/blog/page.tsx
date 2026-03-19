import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Financial Planning Blog for Freelancers & Self-Employed | SoloFI",
  description:
    "Practical guides on taxes, S-Corp strategy, retirement planning, and financial independence for self-employed professionals and freelancers.",
  openGraph: {
    title: "Financial Planning Blog for Freelancers & Self-Employed | SoloFI",
    description:
      "Practical guides on taxes, S-Corp strategy, retirement planning, and financial independence for self-employed professionals and freelancers.",
    url: "https://solofi.io/blog",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=Financial+Planning+Blog+for+Freelancers&category=Blog",
        width: 1200,
        height: 630,
        alt: "SoloFI Blog — Financial Planning for Freelancers and Self-Employed",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Planning Blog for Freelancers & Self-Employed | SoloFI",
    description:
      "Practical guides on taxes, S-Corp strategy, retirement planning, and financial independence for self-employed professionals and freelancers.",
    images: [
      "https://solofi.io/api/og?title=Financial+Planning+Blog+for+Freelancers&category=Blog",
    ],
  },
  alternates: {
    canonical: "https://solofi.io/blog",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
