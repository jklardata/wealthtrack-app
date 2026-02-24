import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "A US Guide for Working Remotely From Another Country | SoloFI",
  description: "Dreaming of working from Portugal or Mexico? Here's what US-based remote workers need to know about taxes, visas, and logistics.",
  openGraph: {
    title: "A US Guide for Working Remotely From Another Country",
    description: "Dreaming of working from Portugal or Mexico? Here's what US-based remote workers need to know.",
    url: "https://solofi.io/articles/working-remotely-from-another-country",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=A%20US%20Guide%20for%20Working%20Remotely%20From%20Another%20Country&category=Remote%20Work",
        width: 1200,
        height: 630,
        alt: "A US Guide for Working Remotely From Another Country",
      },
    ],
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/articles/working-remotely-from-another-country",
  },
};
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, AlertTriangle, Globe } from "lucide-react";


const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "A US Guide for Working Remotely From Another Country",
  description: "Dreaming of working from Portugal or Mexico? Here's what US-based remote workers need to know about taxes, visas, and logistics.",
  datePublished: "2025-10-10",
  dateModified: "2025-10-10",
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
  url: "https://solofi.io/articles/working-remotely-from-another-country",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://solofi.io/articles/working-remotely-from-another-country",
  },
};
export default function WorkingRemotelyArticle() {
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
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=600&fit=crop"
          alt="Working remotely from another country"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-emerald-600 px-3 py-1 rounded-full">Remote Work</span>
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">A US Guide for Working Remotely From Another Country</h1>
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
          Working remotely from another country as a US citizen or resident comes with unique tax, visa, and logistical considerations. This comprehensive guide covers everything you need to know to work legally and tax-efficiently from abroad.
        </p>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Understanding Your Tax Obligations</h2>
          <div className="space-y-3">
            <p className="text-slate-600 leading-relaxed">
              As a US citizen or green card holder, you're taxed on your <strong className="text-slate-900">worldwide income</strong> regardless of where you live or work. This is fundamentally different from most other countries that use territorial taxation (you're only taxed on income earned within their borders). The US and Eritrea are the only countries that tax based on citizenship rather than residence, which means even if you live in Portugal for five years, the IRS still wants its cut of your income.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The good news: several provisions can dramatically reduce your tax burden. The Foreign Earned Income Exclusion (FEIE) lets you exclude up to $130,000 (2026) of foreign earned income from federal taxes—if you're earning $120K remotely from Portugal, you could pay zero federal income tax. The Foreign Tax Credit (FTC) prevents double taxation by giving you credit for taxes paid to foreign governments. If Portugal taxes you $15K, you get a $15K credit against your US tax bill. The Foreign Housing Exclusion adds another layer, letting you exclude qualified housing expenses on top of the FEIE. Combined, these provisions can reduce your effective US tax rate to near zero for many remote workers living abroad.
            </p>
          </div>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&h=400&fit=crop"
            alt="Travel destination"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">The Physical Presence Test</h2>
          <p className="text-slate-600 leading-relaxed">
            To qualify for FEIE, you must be physically present in a foreign country for at least <strong className="text-slate-900">330 full days</strong> during a 12-month period. Here's what you need to know:
          </p>
          <div className="rounded-xl border border-slate-200 bg-white/5 p-6 space-y-3">
            <h4 className="font-medium text-slate-900">Key Requirements</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-600">• Days don't need to be consecutive</li>
              <li className="text-slate-600">• The 12-month period can begin on any day</li>
              <li className="text-slate-600">• Time spent in international waters or airspace doesn't count</li>
              <li className="text-slate-600">• Brief trips back to the US count against you</li>
              <li className="text-slate-600">• A full day means the entire 24-hour period (midnight to midnight)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-yellow-500/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-600">Watch Out</h4>
              <p className="text-sm text-slate-500">A two-week trip home for the holidays could disqualify you if you're close to the 330-day threshold. Plan your US visits carefully and track every day.</p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Visa Considerations</h2>
          <p className="text-slate-600 leading-relaxed">
            Tourist visas typically <strong className="text-slate-900">don't allow you to work legally</strong> in a foreign country, even if you're working for US clients remotely. Here are your options:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-slate-600" />
                <h4 className="font-medium text-slate-900">Digital Nomad Visas</h4>
              </div>
              <p className="text-sm text-slate-500 mb-3">Portugal, Spain, Croatia, Estonia, and 50+ other countries now offer specific visas for remote workers.</p>
              <p className="text-xs text-white/40">Duration: 1-2 years typically</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <h4 className="font-medium text-slate-900">Freelancer Visas</h4>
              </div>
              <p className="text-sm text-slate-500 mb-3">Germany, Netherlands, and other countries have self-employment visas for freelancers and consultants.</p>
              <p className="text-xs text-white/40">Duration: 1-3 years typically</p>
            </div>
          </div>
        </section>

        {/* Section 4 - Popular Destinations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Popular Digital Nomad Destinations</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white/5 overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=200&fit=crop" alt="Lisbon Portugal" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-slate-900">Portugal</h4>
                <p className="text-sm text-slate-500">D7 visa, NHR tax regime (10% flat tax for 10 years), thriving tech scene in Lisbon and Porto</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/5 overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&h=200&fit=crop" alt="Mexico City" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-slate-900">Mexico</h4>
                <p className="text-sm text-slate-500">180-day tourist visa, same time zones as US, low cost of living, excellent internet</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/5 overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=200&fit=crop" alt="Thailand" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-slate-900">Thailand</h4>
                <p className="text-sm text-slate-500">New LTR visa for remote workers, extremely affordable, excellent infrastructure in Bangkok/Chiang Mai</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/5 overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=200&fit=crop" alt="Medellin Colombia" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-slate-900">Colombia</h4>
                <p className="text-sm text-slate-500">Digital nomad visa available, Medellin's perfect weather, growing expat community</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Banking and Money</h2>
          <p className="text-slate-600 leading-relaxed">
            Having the right financial setup is crucial for international remote work. Here are the essentials:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Charles Schwab Investor Checking</strong>
                <p className="text-slate-500">No foreign transaction fees, unlimited ATM rebates worldwide</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Wise (formerly TransferWise)</strong>
                <p className="text-slate-500">Multi-currency account with real exchange rates, local bank details in 10+ currencies</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Mercury</strong>
                <p className="text-slate-500">Business banking with international wire support and no monthly fees</p>
              </div>
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
                <span className="text-slate-700">You're still subject to US taxes on worldwide income as a US citizen</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">2.</span>
                <span className="text-slate-700">FEIE can exclude $130,000+ if you meet the physical presence or bona fide residence test</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">3.</span>
                <span className="text-slate-700">Get proper visas—tourist visas usually don't allow remote work legally</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">4.</span>
                <span className="text-slate-700">Set up international-friendly banking before you leave</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">5.</span>
                <span className="text-slate-700">Consider your state tax residency carefully—some states continue taxing you</span>
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
              <li key="how-feie-works"><Link href="https://solofi.io/articles/how-feie-works" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">How the Foreign Earned Income Exclusion (FEIE) Works</Link></li>
              <li key="best-bank-accounts-for-consultants"><Link href="https://solofi.io/articles/best-bank-accounts-for-consultants" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">Best Bank Accounts for Independent Consultants</Link></li>
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
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Planning to work abroad?</h3>
          <p className="text-slate-500 mb-6">Explore how geo-arbitrage can maximize your financial independence.</p>
          <Link href="/geo-arbitrage">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-slate-900">
              <Globe className="mr-2 h-4 w-4" />
              Explore Geo Arbitrage
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
