import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BarChart3, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About SoloFI | Financial Planning for Independent Professionals",
  description: "Built by a self-employed consultant to solve the financial planning gap for independent professionals. No asset custody. No commissions. Just clarity.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            About Solofi
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Built to solve a problem I lived firsthand.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="prose prose-lg max-w-none">
          {/* Founder Story */}
          <section className="mb-16">
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <p>
                I've been a self-employed consultant since 2016, working with startups and Fortune 500 companies on complex analytics, finance, and data problems. Before going independent, I worked in Big 4 consulting, and later with FAANG-scale and high-growth technology companies, where data-driven decision-making wasn't optional—it was the job.
              </p>

              <p>
                Professionally, I spent years helping organizations make better decisions with imperfect information. Personally, I was navigating the same challenges many independent professionals face:
              </p>

              <ul className="space-y-2 ml-6 my-6">
                <li className="text-slate-700">Optimizing taxes with volatile income</li>
                <li className="text-slate-700">Deciding whether an S-Corp actually makes sense</li>
                <li className="text-slate-700">Balancing retirement contributions vs. taxable investing</li>
                <li className="text-slate-700">Managing portfolios efficiently</li>
                <li className="text-slate-700">Planning for financial independence—potentially abroad</li>
              </ul>

              <p className="font-medium text-slate-900">
                What I found was a gap.
              </p>

              <p>
                There was no single place to model decisions—only tools that showed results after the fact, generic advice, or platforms that required moving assets before you fully understood the tradeoffs.
              </p>

              <p>
                Solofi exists to close that gap.
              </p>

              <p>
                It's a financial decision engine designed for self-employed professionals—combining tax modeling, portfolio analysis, retirement planning, and geo-arbitrage into one clear, data-driven system. No asset custody. No commissions. No lock-in.
              </p>

              <p className="text-slate-600 italic">
                This is the tool I wish existed years ago—built from real experience, not theory.
              </p>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-slate-900 font-medium">— Justin Leu</p>
                <p className="text-sm text-slate-600">Founder, Solofi</p>
                <p className="text-sm text-slate-500">Self-employed consultant • Big 4 alum • FAANG experience</p>
              </div>
            </div>
          </section>

          {/* Why Trust Solofi */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Why Trust Solofi</h2>

            <div className="space-y-6 text-slate-700 leading-relaxed">
              <p>
                Solofi is built around a simple principle: <span className="font-medium text-slate-900">clarity before commitment</span>.
              </p>

              <div className="grid gap-6 my-8">
                <div className="flex gap-4 p-6 bg-white rounded-xl border border-slate-200">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">No asset custody or account transfers</h3>
                    <p className="text-sm text-slate-600">Your money stays where it is. We never touch your assets.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-white rounded-xl border border-slate-200">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">No commissions or product incentives</h3>
                    <p className="text-sm text-slate-600">We're not selling you products. We're providing clarity.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-white rounded-xl border border-slate-200">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Provider-agnostic</h3>
                    <p className="text-sm text-slate-600">Works with where you already bank and invest. Designed to complement, not replace, your CPA or advisor.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-l-4 border-emerald-600 p-6 my-8">
                <p className="text-lg font-medium text-slate-900 mb-2">
                  Solofi doesn't tell you what to do.
                </p>
                <p className="text-slate-700">
                  It helps you understand what happens if you do.
                </p>
                <p className="text-sm text-slate-600 mt-4">
                  That distinction matters—especially when decisions are expensive.
                </p>
              </div>
            </div>
          </section>

          {/* Disclosure */}
          <section className="mb-16">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Disclosure</h2>
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>
                  Solofi is a financial planning and decision-support tool. It does not provide personalized financial, tax, or investment advice, and it is not a brokerage or registered investment advisor.
                </p>
                <p>
                  Any insights are based on user-provided information and general modeling assumptions. Users should consult qualified professionals (CPAs, tax advisors, financial planners) before making financial decisions.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Ready to make better financial decisions?
              </h2>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Start modeling your tax strategy, portfolio allocation, and retirement plan today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
