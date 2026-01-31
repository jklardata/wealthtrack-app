import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How the Foreign Earned Income Exclusion (FEIE) Works - SoloFI",
  description: "Living abroad as a US citizen? The FEIE could save you up to $130,000 in taxes. Here's everything you need to know.",
};
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, AlertTriangle, Check, X, Globe, Calculator } from "lucide-react";

export default function FEIEArticle() {
  return (
    <article>
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-white/60 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop"
          alt="International tax documents"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-cyan-500 px-3 py-1 rounded-full">Tax Planning</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">How the Foreign Earned Income Exclusion (FEIE) Works</h1>
          <div className="flex items-center gap-4 mt-3 text-white/60 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              12 min read
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        {/* Intro */}
        <p className="text-xl text-white/70 leading-relaxed">
          The Foreign Earned Income Exclusion allows US citizens and residents working abroad to exclude up to $130,000 (2026) of foreign earned income from US federal taxes. Here's everything you need to know.
        </p>

        {/* 2026 Limits Card */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6">
          <h4 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            2026 FEIE Limits
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-cyan-400">$130,000</p>
              <p className="text-xs text-white/60">Maximum Exclusion</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-cyan-400">$20,800</p>
              <p className="text-xs text-white/60">Housing Exclusion Base</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-cyan-400">~$40,000+</p>
              <p className="text-xs text-white/60">Housing Max (varies by location)</p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">What Qualifies as "Foreign Earned Income"?</h2>
          <p className="text-white/70 leading-relaxed">
            FEIE applies only to income earned from personal services performed in a foreign country:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
              <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Qualifies
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-white/70">Consulting fees earned abroad</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-white/70">Freelance income for work done abroad</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-white/70">Salary from foreign employer</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-white/70">Self-employment income earned abroad</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
              <h4 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
                <X className="h-5 w-5" />
                Does NOT Qualify
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-white/70">Investment income (dividends, interest)</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-white/70">Rental income</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-white/70">Capital gains</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-white/70">Pension or Social Security</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-white/70">US government employee wages</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1000&h=400&fit=crop"
            alt="Traveling abroad"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Qualification Tests</h2>
          <p className="text-white/70 leading-relaxed">
            You must meet one of two tests to qualify for FEIE:
          </p>

          <h3 className="text-lg font-semibold mt-6 flex items-center gap-2 text-white">
            <Globe className="h-5 w-5 text-blue-400" />
            1. Physical Presence Test
          </h3>
          <p className="text-white/70 leading-relaxed">
            Be physically present in a foreign country for at least <strong className="text-white">330 full days</strong> during any 12-month period.
          </p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h4 className="font-semibold text-white">Key Requirements</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-white/70">Days don't need to be consecutive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-white/70">The 12-month period can start on any day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-white/70">Parts of days don't count—you need 330 full 24-hour periods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-white/70">Days in international waters/airspace don't count</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-400">Important</h4>
              <p className="text-sm text-white/60">Days spent in the US count against you. A two-week Christmas visit home could disqualify you if you're close to the 330-day threshold.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 flex items-center gap-2 text-white">
            <Globe className="h-5 w-5 text-green-400" />
            2. Bona Fide Residence Test
          </h3>
          <p className="text-white/70 leading-relaxed">
            Be a bona fide resident of a foreign country for an uninterrupted period that includes an entire tax year.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">More flexible than physical presence test</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Can spend time in the US without losing qualification</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Requires establishing actual residency (visa, local ties, etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Must be resident for full calendar year to qualify</span>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Foreign Housing Exclusion</h2>
          <p className="text-white/70 leading-relaxed">
            In addition to the income exclusion, you can exclude certain housing expenses:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Rent, utilities, property insurance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Repairs and furniture rental</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Base amount ($20,800 in 2026) is subtracted</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Maximum varies by location—higher in expensive cities</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">How to Claim FEIE</h2>
          <ol className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span className="text-white/70">File Form 2555 with your tax return</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span className="text-white/70">Document your qualification (physical presence or bona fide residence)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span className="text-white/70">Calculate your foreign earned income and housing expenses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span className="text-white/70">File by the deadline (automatic 2-month extension for taxpayers abroad)</span>
            </li>
          </ol>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">FEIE vs. Foreign Tax Credit</h2>
          <p className="text-white/70 leading-relaxed">
            You can't use both FEIE and Foreign Tax Credit on the same income. Consider:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h4 className="font-semibold mb-2 text-white">FEIE</h4>
              <p className="text-sm text-white/60">Better if you're in a <strong className="text-white">low/no tax country</strong></p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h4 className="font-semibold mb-2 text-white">Foreign Tax Credit (FTC)</h4>
              <p className="text-sm text-white/60">Better if you pay <strong className="text-white">significant foreign taxes</strong></p>
            </div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-400">5-Year Rule</h4>
              <p className="text-sm text-white/60">You can revoke FEIE election, but there's a 5-year waiting period to re-elect. Choose carefully.</p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Self-Employment Tax Trap</h2>
          <p className="text-white/70 leading-relaxed">
            FEIE does <strong className="text-white">NOT</strong> exclude you from self-employment tax. Even if you exclude $130,000 of income from income tax, you still owe 15.3% SE tax on that amount.
          </p>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
            <h4 className="font-semibold text-red-400 mb-2">Example</h4>
            <p className="text-white/70">
              On $130,000 of excluded income, you'd still owe approximately <strong className="text-white">$18,400</strong> in self-employment tax. This is why many digital nomads consider S-Corp election even while abroad.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Common Mistakes to Avoid</h2>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/70">Forgetting to track days in/out of foreign countries</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/70">Assuming investment income qualifies (it doesn't)</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/70">Missing the filing deadline</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/70">Not considering the self-employment tax implications</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/70">Revoking FEIE without understanding the 5-year rule</span>
            </li>
          </ul>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Key Takeaways</h2>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">1.</span>
                <span className="text-white/80">FEIE can exclude up to $130,000 of foreign earned income (2026)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">2.</span>
                <span className="text-white/80">You must meet either the Physical Presence or Bona Fide Residence test</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">3.</span>
                <span className="text-white/80">Investment income, capital gains, and passive income don't qualify</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">4.</span>
                <span className="text-white/80">Self-employment tax still applies to excluded income</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">5.</span>
                <span className="text-white/80">Keep meticulous records of your days in each country</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">6.</span>
                <span className="text-white/80">Consult a tax professional familiar with expat taxation</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Planning to work abroad?</h3>
          <p className="text-white/60 mb-6">Use our Tax Savings Calculator to estimate your potential savings.</p>
          <Link href="/tools/tax-savings">
            <Button className="bg-white text-black hover:bg-white/90">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Savings
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
