import { Metadata } from "next";
import NetWorthQuiz from "./NetWorthQuizClient";

export const metadata: Metadata = {
  title: "Net Worth Tracking Quiz for Freelancers | SoloFI",
  description: "Free quiz to assess your net worth tracking habits and get a personalized action plan. Built for self-employed professionals and freelancers.",
  openGraph: {
    title: "Net Worth Tracking Quiz — Where Do You Stand?",
    description: "Assess your net worth tracking habits and get a personalized action plan. Free quiz for freelancers.",
    url: "https://solofi.io/tools/net-worth-quiz",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=Net+Worth+Quiz&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Net Worth Tracking Quiz for Freelancers | SoloFI",
    description: "Assess your net worth tracking habits and get a personalized action plan. Free quiz for freelancers.",
    images: ["https://solofi.io/api/og?title=Net+Worth+Quiz&category=Tools"],
  },
};

export default function NetWorthQuizPage() {
  return <NetWorthQuiz />;
}
