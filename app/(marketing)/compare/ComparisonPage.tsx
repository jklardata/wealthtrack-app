"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  X,
  Minus,
  ArrowRight,
  Calculator,
  Star,
} from "lucide-react";
import Link from "next/link";

export interface Feature {
  name: string;
  solofi: boolean | "partial" | string;
  competitor: boolean | "partial" | string;
  description?: string;
}

export interface ComparisonPageProps {
  competitor: {
    name: string;
    tagline: string;
    description: string;
    pricing: string;
    pricingNote?: string;
    bestFor: string[];
    limitations: string[];
  };
  solofi: {
    pricing: string;
    pricingNote?: string;
    bestFor: string[];
    advantages: string[];
  };
  features: Feature[];
  verdict: {
    title: string;
    description: string;
    chooseSolofi: string[];
    chooseCompetitor: string[];
  };
  seoKeywords: string[];
}

function FeatureIcon({ value }: { value: boolean | "partial" | string }) {
  if (value === true) {
    return <Check className="h-5 w-5 text-emerald-600" />;
  }
  if (value === false) {
    return <X className="h-5 w-5 text-slate-300" />;
  }
  if (value === "partial") {
    return <Minus className="h-5 w-5 text-amber-500" />;
  }
  return <span className="text-sm text-slate-600">{value}</span>;
}

export default function ComparisonPage({
  competitor,
  solofi,
  features,
  verdict,
}: ComparisonPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-600" />
            <span className="font-semibold text-lg">SoloFI</span>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Try SoloFI Free
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            SoloFI vs {competitor.name}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Detailed comparison to help you choose the right financial tool for your freelance business
          </p>
        </div>

        {/* Quick Verdict */}
        <Card className="mb-12 border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Star className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">{verdict.title}</h2>
                <p className="text-slate-600">{verdict.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side by Side Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* SoloFI Card */}
          <Card className="border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="h-8 w-8 text-emerald-600" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">SoloFI</h3>
                  <p className="text-sm text-slate-500">Financial independence for freelancers</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-emerald-600">{solofi.pricing}</span>
                {solofi.pricingNote && (
                  <span className="text-sm text-slate-500 ml-2">{solofi.pricingNote}</span>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-slate-700">Best for:</p>
                <ul className="space-y-1">
                  {solofi.bestFor.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Key advantages:</p>
                <ul className="space-y-1">
                  {solofi.advantages.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Card */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">{competitor.name}</h3>
                <p className="text-sm text-slate-500">{competitor.tagline}</p>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-slate-700">{competitor.pricing}</span>
                {competitor.pricingNote && (
                  <span className="text-sm text-slate-500 ml-2">{competitor.pricingNote}</span>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-slate-700">Best for:</p>
                <ul className="space-y-1">
                  {competitor.bestFor.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Limitations:</p>
                <ul className="space-y-1">
                  {competitor.limitations.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <X className="h-4 w-4 text-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison Table */}
        <Card className="mb-12">
          <CardContent className="p-0">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left p-4 font-medium text-slate-700">Feature</th>
                    <th className="text-center p-4 font-medium text-emerald-700 w-32">SoloFI</th>
                    <th className="text-center p-4 font-medium text-slate-700 w-32">{competitor.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{feature.name}</div>
                        {feature.description && (
                          <div className="text-sm text-slate-500">{feature.description}</div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center">
                          <FeatureIcon value={feature.solofi} />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center">
                          <FeatureIcon value={feature.competitor} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Who Should Choose What */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                Choose SoloFI if you...
              </h3>
              <ul className="space-y-2">
                {verdict.chooseSolofi.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Choose {competitor.name} if you...
              </h3>
              <ul className="space-y-2">
                {verdict.chooseCompetitor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-emerald-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Ready to take control of your freelance finances?
            </h2>
            <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
              Join thousands of freelancers using SoloFI to optimize taxes, track net worth, and reach financial independence faster.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                Try SoloFI Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-emerald-200 mt-4">No credit card required</p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center text-sm text-slate-500">
          <span>&copy; 2025 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
