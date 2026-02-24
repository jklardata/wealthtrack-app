import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How the Foreign Earned Income Exclusion (FEIE) Works | SoloFI",
  description: "Living abroad as a US citizen? The FEIE could save you up to $130,000 in taxes. Here's everything you need to know.",
  openGraph: {
    title: "How the Foreign Earned Income Exclusion (FEIE) Works",
    description: "Living abroad as a US citizen? The FEIE could save you up to $130,000 in taxes.",
    url: "https://solofi.io/articles/how-feie-works",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=How%20the%20Foreign%20Earned%20Income%20Exclusion%20(FEIE)%20Works&category=Taxes",
        width: 1200,
        height: 630,
        alt: "How the Foreign Earned Income Exclusion (FEIE) Works",
      },
    ],
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/articles/how-feie-works",
  },
};
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, AlertTriangle, Check, X, Globe, Calculator } from "lucide-react";


const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How the Foreign Earned Income Exclusion (FEIE) Works",
  description: "Living abroad as a US citizen? The FEIE could save you up to $130,000 in taxes.",
  datePublished: "2025-11-01",
  dateModified: "2025-11-01",
  author: {
    "@type": "Person",
    name: "Justin Leu",
    url: "https://solofi.io/about",
  },
  publisher: {
    "@type": "Organization",
    name: "SoloFI",
    url: "https://solofi.io",
  },
  url: "https://solofi.io/articles/how-feie-works",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://solofi.io/articles/how-feie-works",
  },
};
export default function FEIEArticle() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Back Button */}
      <div className="mb-6">
        <Link href="https://solofi.io/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
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
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">How the Foreign Earned Income Exclusion (FEIE) Works</h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
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
        <p className="text-xl text-slate-600 leading-relaxed">
          The Foreign Earned Income Exclusion allows US citizens and residents working abroad to exclude up to $130,000 (2026) of foreign earned income from US federal taxes. Here's everything you need to know.
        </p>

        {/* 2026 Limits Card */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6">
          <h4 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            2026 FEIE Limits
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-slate-200">
              <p className="text-2xl font-bold text-cyan-400">$130,000</p>
              <p className="text-xs text-slate-500">Maximum Exclusion</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-slate-200">
              <p className="text-2xl font-bold text-cyan-400">$20,800</p>
              <p className="text-xs text-slate-500">Housing Exclusion Base</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-slate-200">
              <p className="text-2xl font-bold text-cyan-400">~$40,000+</p>
              <p className="text-xs text-slate-500">Housing Max (varies by location)</p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">What Qualifies as "Foreign Earned Income"?</h2>
          <p className="text-slate-600 leading-relaxed">
            The FEIE applies only to income earned from personal services performed in a foreign country—"earned" is the critical word here. This means money you exchange for your time, labor, or expertise while physically present abroad. Consulting fees, freelance income, salary from a foreign employer, and self-employment income all qualify as long as you performed the work outside the US. What doesn't qualify: passive income. Investment dividends, interest, rental income, capital gains, pensions, Social Security, and US government wages are all excluded from FEIE benefits. The IRS draws a clear line—if you didn't actively work for it abroad, it doesn't count.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-5">
              <h4 className="font-semibold text-emerald-600 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Qualifies
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0" />
                  <span className="text-slate-600">Consulting fees earned abroad</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0" />
                  <span className="text-slate-600">Freelance income for work done abroad</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0" />
                  <span className="text-slate-600">Salary from foreign employer</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0" />
                  <span className="text-slate-600">Self-employment income earned abroad</span>
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
                  <span className="text-slate-600">Investment income (dividends, interest)</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-slate-600">Rental income</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-slate-600">Capital gains</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-slate-600">Pension or Social Security</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-slate-600">US government employee wages</span>
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
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Qualification Tests</h2>
          <p className="text-slate-600 leading-relaxed">
            You must meet one of two tests to qualify for FEIE:
          </p>

          <h3 className="text-lg font-semibold mt-6 flex items-center gap-2 text-slate-900">
            <Globe className="h-5 w-5 text-slate-600" />
            1. Physical Presence Test
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Be physically present in a foreign country for at least <strong className="text-slate-900">330 full days</strong> during any 12-month period.
          </p>
          <div className="rounded-xl border border-slate-200 bg-white/5 p-6 space-y-3">
            <h4 className="font-medium text-slate-900">Key Requirements</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-slate-600">Days don't need to be consecutive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-slate-600">The 12-month period can start on any day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-slate-600">Parts of days don't count—you need 330 full 24-hour periods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-slate-600">Days in international waters/airspace don't count</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-yellow-500/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-600">Important</h4>
              <p className="text-sm text-slate-500">Days spent in the US count against you. A two-week Christmas visit home could disqualify you if you're close to the 330-day threshold.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 flex items-center gap-2 text-slate-900">
            <Globe className="h-5 w-5 text-emerald-600" />
            2. Bona Fide Residence Test
          </h3>
          <p className="text-slate-600 leading-relaxed">
            The Bona Fide Residence Test requires you to be a bona fide resident of a foreign country for an uninterrupted period that includes an entire tax year (January 1 - December 31). This test is more flexible than the physical presence test because you can spend time in the US without losing qualification—there's no strict day count. The key is establishing actual residency: you need a visa or work permit, local ties (apartment lease, bank account, gym membership), and the intention to remain there indefinitely, not just temporarily. You can't be a "bona fide resident" of a country while staying in tourist hotels and hopping around every few months. Once established for a full calendar year, you qualify for FEIE even if you visit the US for several weeks annually, making this the preferred test for digital nomads with a stable home base abroad.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Foreign Housing Exclusion</h2>
          <p className="text-slate-600 leading-relaxed">
            In addition to the $130,000 income exclusion, you can exclude certain housing expenses through the Foreign Housing Exclusion. Qualifying expenses include rent, utilities, property insurance, repairs, and even furniture rental—basically, the cost of maintaining a home abroad. The calculation works by subtracting a base amount ($20,800 in 2026, which is roughly 16% of the FEIE limit) from your total housing expenses. Anything above that base up to the location-specific maximum can be excluded.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The maximum varies dramatically by location—expensive cities like Tokyo, London, or Singapore have caps around $40,000-50,000, while cheaper locations might max out at $25,000-30,000. The IRS publishes annual limits by city. If you're paying $3,500/month ($42,000/year) in rent in Tokyo, you'd subtract the $20,800 base, leaving $21,200 in additional housing exclusion. Combined with the $130,000 FEIE, you could potentially exclude up to $150,000+ in total income from US taxes, which translates to $45,000-60,000 in tax savings depending on your bracket.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">How to Claim FEIE</h2>
          <ol className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span className="text-slate-600">File Form 2555 with your tax return</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span className="text-slate-600">Document your qualification (physical presence or bona fide residence)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span className="text-slate-600">Calculate your foreign earned income and housing expenses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span className="text-slate-600">File by the deadline (automatic 2-month extension for taxpayers abroad)</span>
            </li>
          </ol>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">FEIE vs. Foreign Tax Credit</h2>
          <p className="text-slate-600 leading-relaxed">
            You can't use both FEIE and Foreign Tax Credit on the same income. Consider:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white/5 p-5">
              <h4 className="font-semibold mb-2 text-slate-900">FEIE</h4>
              <p className="text-sm text-slate-500">Better if you're in a <strong className="text-slate-900">low/no tax country</strong></p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/5 p-5">
              <h4 className="font-semibold mb-2 text-slate-900">Foreign Tax Credit (FTC)</h4>
              <p className="text-sm text-slate-500">Better if you pay <strong className="text-slate-900">significant foreign taxes</strong></p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-yellow-500/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-600">5-Year Rule</h4>
              <p className="text-sm text-slate-500">You can revoke FEIE election, but there's a 5-year waiting period to re-elect. Choose carefully.</p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Self-Employment Tax Trap</h2>
          <p className="text-slate-600 leading-relaxed">
            FEIE does <strong className="text-slate-900">NOT</strong> exclude you from self-employment tax. Even if you exclude $130,000 of income from income tax, you still owe 15.3% SE tax on that amount.
          </p>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
            <h4 className="font-semibold text-red-400 mb-2">Example</h4>
            <p className="text-slate-600">
              On $130,000 of excluded income, you'd still owe approximately <strong className="text-slate-900">$18,400</strong> in self-employment tax. This is why many digital nomads consider S-Corp election even while abroad.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Common Mistakes to Avoid</h2>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Forgetting to track days in/out of foreign countries</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Assuming investment income qualifies (it doesn't)</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Missing the filing deadline</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Not considering the self-employment tax implications</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Revoking FEIE without understanding the 5-year rule</span>
            </li>
          </ul>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Key Takeaways</h2>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">1.</span>
                <span className="text-slate-700">FEIE can exclude up to $130,000 of foreign earned income (2026)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">2.</span>
                <span className="text-slate-700">You must meet either the Physical Presence or Bona Fide Residence test</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">3.</span>
                <span className="text-slate-700">Investment income, capital gains, and passive income don't qualify</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">4.</span>
                <span className="text-slate-700">Self-employment tax still applies to excluded income</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">5.</span>
                <span className="text-slate-700">Keep meticulous records of your days in each country</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">6.</span>
                <span className="text-slate-700">Consult a tax professional familiar with expat taxation</span>
              </li>
            </ul>
          </div>
        </section>

        
        {/* Internal Links */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Read next</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Related articles</p>
              <ul className="space-y-2 text-sm">
              <li key="working-remotely-from-another-country"><Link href="https://solofi.io/articles/working-remotely-from-another-country" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">A US Guide for Working Remotely From Another Country</Link></li>
              <li key="tax-strategies-2026-self-employed"><Link href="https://solofi.io/articles/tax-strategies-2026-self-employed" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">Tax Strategies in 2026 for Self-Employed Workers</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Free tools</p>
              <ul className="space-y-2 text-sm">
              <li key="fi-calculator"><Link href="https://solofi.io/tools" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">FI Calculator</Link></li>
              <li key="quarterly-tax"><Link href="https://solofi.io/tools" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">Quarterly Tax Estimator</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Planning to work abroad?</h3>
          <p className="text-slate-500 mb-6">Use our Tax Savings Calculator to estimate your potential savings.</p>
          <Link href="https://solofi.io/tools">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-slate-900">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Savings
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
