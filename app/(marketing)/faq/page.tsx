import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ | SoloFI",
  description: "Frequently asked questions about SoloFI — what it does, how it works, and how to get the most out of it.",
  openGraph: {
    title: "FAQ | SoloFI — The Financial Platform for the Self-Employed",
    description: "The financial platform for the self-employed. Common questions answered.",
    url: "https://solofi.io/faq",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=FAQ&category=Support", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | SoloFI",
    description: "The financial platform for the self-employed. Common questions answered.",
    images: ["https://solofi.io/api/og?title=FAQ&category=Support"],
  },
};

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is SoloFI?",
        a: "SoloFI is a financial modeling and decision engine built specifically for self-employed professionals, consultants, and business owners. It helps you model tax strategies, retirement outcomes, and portfolio decisions — without requiring you to link accounts or transfer assets.",
      },
      {
        q: "Do I need to connect my bank or investment accounts?",
        a: "No. SoloFI uses manual entry. You control what data goes in, and your money stays exactly where it is. There's no account linking, no read-only bank connections, and no asset transfers required.",
      },
      {
        q: "Is this financial advice?",
        a: "No. SoloFI is a modeling and planning tool, not a financial advisor. The projections and calculations are for educational and planning purposes only. Always consult a qualified tax professional or financial advisor before making major decisions.",
      },
      {
        q: "Who is SoloFI built for?",
        a: "SoloFI is designed for self-employed professionals — freelancers, consultants, independent contractors, and small business owners — who have complex financial lives that standard tools don't handle well. If you deal with quarterly taxes, S-Corp decisions, variable income, or early retirement planning, SoloFI was built for you.",
      },
    ],
  },
  {
    category: "Pricing & Plans",
    questions: [
      {
        q: "Is there a free plan?",
        a: "Yes. You can sign up and use SoloFI's core tools for free. Pro features — including detailed year-by-year projections, advanced analysis, and advisory summaries — require a Pro subscription.",
      },
      {
        q: "What's included in Pro?",
        a: "Pro unlocks the full output of every tool: year-by-year projection tables, strategic insights, CSV exports, lifetime tax analysis, and more. See the pricing page for a full comparison.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. You can cancel your subscription at any time. You'll retain Pro access through the end of your billing period.",
      },
    ],
  },
  {
    category: "Tools & Features",
    questions: [
      {
        q: "What's the difference between the Retirement Calculator and Early Retirement (FIRE)?",
        a: "The Retirement Calculator is a standard projection tool — target age, expected return, withdrawal needs. Early Retirement is FIRE-focused: it calculates your FI number (25× expenses), models lean/base/fat/chubby FI milestones, and shows years to financial independence at your savings rate.",
      },
      {
        q: "What does Tax Bracket Filling do?",
        a: "It models multi-year tax optimization strategies — Roth conversions, capital gains harvesting, gap year planning — to help you minimize lifetime taxes. It shows how much bracket space you have available each year and how different strategies use it.",
      },
      {
        q: "What is the Lifetime Tax Map?",
        a: "The Lifetime Tax Map projects your tax exposure from today through life expectancy. It identifies low-tax windows (like early retirement gap years), high-risk years (like when RMDs begin), and cumulative lifetime tax burden under different strategies.",
      },
      {
        q: "What does Trajectory (lifetime income) show?",
        a: "Trajectory projects your complete net worth over time by combining all income sources (work, social security, passive, windfalls) with your expenses. It shows how your portfolio grows, peaks, and draws down across your lifetime.",
      },
      {
        q: "How does Geo Arbitrage work?",
        a: "It compares the cost of living in different countries and cities relative to your income. You can see how earning in USD while living abroad reduces your effective FIRE number and how many years it shaves off your retirement timeline.",
      },
      {
        q: "What is FEIE Eligibility?",
        a: "FEIE stands for Foreign Earned Income Exclusion — a US tax provision that lets Americans living abroad exclude up to ~$126k of foreign-earned income from US taxation. The FEIE Eligibility tool helps you understand whether you qualify and what the tax impact is.",
      },
    ],
  },
  {
    category: "Data & Privacy",
    questions: [
      {
        q: "What data does SoloFI store?",
        a: "SoloFI stores the financial data you manually enter: net worth entries, income sources, expenses, and settings. We don't collect transaction data, don't link to financial institutions, and don't sell your data.",
      },
      {
        q: "Can I export my data?",
        a: "Yes. Most projection tools include CSV export for the year-by-year data. You can download your full projection at any time.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Contact us at support@solofi.io and we'll remove your account and all associated data.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="text-base font-semibold text-slate-900">
              <span className="text-emerald-600">Solo</span>FI
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/learn" className="text-slate-500 hover:text-slate-700">Documentation</Link>
            <Link href="/pricing" className="text-slate-500 hover:text-slate-700">Pricing</Link>
            <Link href="/sign-up" className="text-emerald-600 hover:text-emerald-700 font-medium">Get started</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">FAQ</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-slate-600 leading-relaxed">
            Common questions about SoloFI — what it does, how to use it, and what to expect.
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                {section.category}
              </h2>
              <div className="space-y-0 divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {section.questions.map((item, idx) => (
                  <div key={idx} className="p-5">
                    <p className="font-semibold text-slate-900 mb-1.5">{item.q}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="font-semibold text-slate-900 mb-1">Still have questions?</p>
          <p className="text-sm text-slate-600 mb-4">
            Check the documentation for detailed guides on each tool, or reach out directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/learn"
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Documentation
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Contact us
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            <Link href="/learn" className="hover:text-slate-600">Documentation</Link>
            <Link href="/pricing" className="hover:text-slate-600">Pricing</Link>
            <Link href="https://solofi.io/blog" className="hover:text-slate-600">Resources</Link>
            <Link href="/privacy" className="hover:text-slate-600">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
