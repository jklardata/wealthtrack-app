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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex flex-col sm:flex-row items-start gap-10">
            <div className="flex-shrink-0">
              <img
                src="/creative/solofijustin.jpg"
                alt="Justin Leu, Founder of SoloFI"
                className="w-40 h-40 sm:w-52 sm:h-52 rounded-2xl object-cover shadow-md"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-3">The founder</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                Hi, I'm Justin.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                I built SoloFI because I couldn't find the tool I actually needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="prose prose-lg max-w-none">
          {/* Founder Story */}
          <section className="mb-16">
            <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
              <p>
                I've been self-employed since 2016, working as a consultant with startups and Fortune 500 companies on analytics, finance, and data strategy. Before going independent, I spent years in Big 4 consulting and later worked with FAANG-scale companies where making decisions from data was the baseline expectation, not a differentiator.
              </p>

              <p>
                Going solo was the best career decision I've made. But the financial side? That came with a steep learning curve.
              </p>

              <p>
                As a consultant, I was suddenly responsible for things most employees never think about:
              </p>

              <ul className="list-disc space-y-2 ml-6 my-6 text-base">
                <li className="text-slate-700">Setting aside the right amount for quarterly taxes without overcorrecting</li>
                <li className="text-slate-700">Figuring out whether an S-Corp actually made sense for my income level</li>
                <li className="text-slate-700">Deciding how to split contributions between a Solo 401(k) and taxable investing</li>
                <li className="text-slate-700">Understanding what financial independence looked like with variable, project-based income</li>
                <li className="text-slate-700">Modeling retirement abroad versus staying in a high-cost U.S. city</li>
              </ul>

              <p>
                What I found was a frustrating gap. Most tools were built for salaried employees. Financial advisors wanted to manage my assets. Online calculators were static and generic. Spreadsheets got the job done but took forever to maintain.
              </p>

              <p className="font-medium text-slate-900">
                There was no single place to model decisions. There were only tools that showed results after the fact.
              </p>

              <p>
                So I built it myself.
              </p>

              <p>
                SoloFI is the financial decision engine I wish had existed when I first went independent. It's designed for people like me: self employed with variable income, complicated taxes, and long-term ambitions that don't fit the standard retirement planning template. I built a suite of tools used for tax optimization, tracking everything that is required to be successful in self employment, and planning for my own retirement.
              </p>

              <p className="text-slate-600 italic">
                No asset custody. No commissions. No lock-in. Just clarity — before you commit.
              </p>

              <div className="mt-10 pt-8 border-t border-slate-200">
                <p className="text-slate-900 font-semibold text-base">— Justin Leu</p>
                <p className="text-sm text-slate-600 mt-1">Founder, SoloFI</p>
                <p className="text-sm text-slate-500">Self-employed consultant · Big 4 alum · FAANG experience · Been in the trenches since 2016</p>
                <img
                  src="/creative/sevillapic_hs.jpg"
                  alt="Justin Leu"
                  className="mt-6 w-48 sm:w-64 rounded-xl object-cover shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* What SoloFI Is (and Isn't) */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">What SoloFI is (and isn't)</h2>

            <div className="space-y-6 text-slate-700 leading-relaxed">
              <p>
                SoloFI is a financial decision engine — not a brokerage, not a robo-advisor, not a budgeting app.
              </p>

              <p>
                The core idea is <span className="font-medium text-slate-900">clarity before commitment</span>. Before you make a big financial decision, you should be able to see what happens across different scenarios. What does your tax bill look like if you take an S-Corp election vs. stay as a sole proprietor? What's your probability of reaching FIRE at 52 vs. 58? How does retiring in Lisbon compare to staying in San Francisco?
              </p>

              <div className="bg-slate-50 border-l-4 border-emerald-600 p-6 my-8">
                <p className="text-lg font-medium text-slate-900 mb-2">
                  SoloFI doesn't tell you what to do.
                </p>
                <p className="text-slate-700">
                  It helps you understand what happens if you do.
                </p>
                <p className="text-sm text-slate-500 mt-3">
                  That distinction matters — especially when the decisions are expensive and hard to reverse.
                </p>
              </div>

              <div className="grid gap-5 my-8">
                <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">No asset custody or account transfers</h3>
                    <p className="text-sm text-slate-600">Your money stays exactly where it is. We never touch your assets or require you to move anything.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">No commissions or product incentives</h3>
                    <p className="text-sm text-slate-600">We don't earn money by selling you products or routing you toward specific providers. Our only incentive is to be useful enough that you keep subscribing.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Works alongside your existing team</h3>
                    <p className="text-sm text-slate-600">SoloFI is designed to complement — not replace — your CPA or financial advisor. Think of it as your personal modeling layer that helps you show up to those conversations better prepared.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Disclosure */}
          <section className="mb-16">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Disclosure</h2>
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <p>
                  SoloFI is a financial planning and decision-support tool. It does not provide personalized financial, tax, or investment advice, and is not a registered investment advisor or brokerage.
                </p>
                <p>
                  Any projections or insights are based on user-provided information and general modeling assumptions. Individual results will vary. Consult qualified professionals — CPAs, tax advisors, financial planners — before making significant financial decisions.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Ready to model your next financial decision?
              </h2>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Start with a free account. No credit card, no account linking, no asset transfers required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <span>© 2026 SoloFI</span>
            <div className="flex gap-6">
              <Link href="/contact" className="hover:text-slate-700">Contact</Link>
              <Link href="/blog" className="hover:text-slate-700">Resources</Link>
              <Link href="/glossary" className="hover:text-slate-700">Glossary</Link>
              <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
