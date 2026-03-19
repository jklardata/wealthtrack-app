import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp, Repeat, CheckSquare, FileText, Sparkles, Globe, DollarSign, Landmark } from "lucide-react";

export const metadata = {
  title: "Free Financial Calculators & Tools for Freelancers | SoloFI",
  description: "Free financial calculators and planning tools built for self-employed professionals. Quarterly tax estimator, S-Corp calculator, FI calculator, freelance rate calculator, and more.",
  openGraph: {
    title: "Free Financial Tools for Freelancers & Self-Employed | SoloFI",
    description: "Free calculators built for self-employed professionals. Estimate quarterly taxes, analyze S-Corp savings, calculate your freelance rate, and plan for FI.",
    url: "https://solofi.io/tools",
    siteName: "SoloFI",
    images: [{ url: "https://solofi.io/api/og?title=Free+Financial+Tools+for+Freelancers&category=Tools", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Financial Tools for Freelancers & Self-Employed | SoloFI",
    description: "Free calculators built for self-employed professionals. Estimate quarterly taxes, analyze S-Corp savings, calculate your freelance rate, and plan for FI.",
    images: ["https://solofi.io/api/og?title=Free+Financial+Tools+for+Freelancers&category=Tools"],
  },
  alternates: {
    canonical: "https://solofi.io/tools",
  },
};

interface Tool {
  slug: string;
  title: string;
  description: string;
  icon: any;
  features: string[];
  category: string;
}

const TOOLS: Tool[] = [
  {
    slug: "tax-savings",
    title: "Tax Savings Calculator",
    description: "Discover how much you could save with Solo 401k, S-Corp election, and HSA strategies.",
    icon: Calculator,
    features: [
      "Solo 401k contribution limits",
      "S-Corp vs. LLC tax comparison",
      "HSA optimization",
      "Personalized recommendations",
    ],
    category: "Tax Planning",
  },
  {
    slug: "fi-calculator",
    title: "Financial Independence Calculator",
    description: "Calculate your path to financial independence and estimate when you can retire.",
    icon: TrendingUp,
    features: [
      "FI number calculation",
      "Retirement timeline projection",
      "Withdrawal rate analysis",
      "Coast FI scenario",
    ],
    category: "Wealth Building",
  },
  {
    slug: "roth-conversion",
    title: "Roth Conversion Ladder",
    description: "Learn how to access retirement funds before age 59½ using the Roth conversion strategy.",
    icon: Repeat,
    features: [
      "5-year conversion timeline",
      "Tax bracket optimization",
      "Early retirement access",
      "Step-by-step guide",
    ],
    category: "Retirement",
  },
  {
    slug: "net-worth-quiz",
    title: "Net Worth Tracking Quiz",
    description: "Assess your financial tracking habits and discover areas for improvement.",
    icon: FileText,
    features: [
      "Personalized assessment",
      "Tracking recommendations",
      "Best practices guide",
      "Action plan",
    ],
    category: "Assessment",
  },
  {
    slug: "freelance-checklist",
    title: "Self Employment Checklist",
    description: "Complete financial setup guide for new freelancers and consultants.",
    icon: CheckSquare,
    features: [
      "Business structure setup",
      "Tax registration steps",
      "Banking recommendations",
      "Insurance requirements",
    ],
    category: "Getting Started",
  },
  {
    slug: "feie-checker",
    title: "FEIE Eligibility Checker",
    description: "Find out if you qualify for the Foreign Earned Income Exclusion and estimate your tax savings.",
    icon: Globe,
    features: [
      "Physical presence test calculator",
      "Bona fide residence test",
      "Estimated exclusion amount",
      "Form 2555 filing guidance",
    ],
    category: "Working Abroad",
  },
  {
    slug: "rate-calculator",
    title: "Freelance Rate Calculator",
    description: "Calculate your minimum viable hourly rate based on your income goals and work schedule.",
    icon: DollarSign,
    features: [
      "Hourly, day, and weekly rates",
      "Project rate ranges",
      "Billable hours analysis",
      "Pricing strategy tips",
    ],
    category: "Getting Started",
  },
  {
    slug: "banking-setup",
    title: "Freelancer Banking Setup Guide",
    description: "Get a personalized banking plan — which accounts to open, and in what order.",
    icon: Landmark,
    features: [
      "Personalized account roadmap",
      "Specific bank recommendations",
      "Tax reserve setup",
      "Automation rules",
    ],
    category: "Getting Started",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-medium tracking-tight text-slate-900">
            <span className="text-emerald-600">Solo</span>FI
          </Link>
          <div className="flex items-center gap-6">
            <Link href="https://solofi.io/blog" className="text-sm text-slate-600 hover:text-slate-900 hidden md:block">
              Learn
            </Link>
            <Link href="/sign-up">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-full text-sm mb-8">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-slate-700">100% Free Tools</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 leading-[1.1] text-slate-900">
              Resources
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl">
              Free calculators, assessments, and guides to help you optimize taxes, plan for retirement, and build wealth.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                  <article className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-emerald-300 hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {tool.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-medium mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {tool.title}
                    </h3>

                    <p className="text-slate-600 mb-6">
                      {tool.description}
                    </p>

                    <div className="mt-auto">
                      <ul className="space-y-2 mb-6">
                        {tool.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-emerald-500 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm group-hover:gap-3 transition-all">
                        Try it free
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium mb-4 text-slate-900">
              Learn More
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Check out our articles for deeper insights on taxes, wealth building, and financial independence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/articles/overlooked-tax-deductions-consultants">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all h-full">
                <span className="text-xs font-medium text-white bg-indigo-500 px-2 py-1 rounded-full">
                  Tax Deductions
                </span>
                <h3 className="font-medium mt-4 mb-2 text-slate-900">
                  Top 10 Overlooked Tax Deductions for Consultants
                </h3>
                <p className="text-sm text-slate-600">
                  Don't miss out on thousands in tax savings.
                </p>
              </div>
            </Link>

            <Link href="/articles/30-percent-rule-self-employment-taxes">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all h-full">
                <span className="text-xs font-medium text-white bg-cyan-500 px-2 py-1 rounded-full">
                  Tax Planning
                </span>
                <h3 className="font-medium mt-4 mb-2 text-slate-900">
                  The 30% Rule for Self-Employment Taxes
                </h3>
                <p className="text-sm text-slate-600">
                  Learn why you should set aside 30% for taxes.
                </p>
              </div>
            </Link>

            <Link href="/articles/sole-proprietor-vs-llc">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all h-full">
                <span className="text-xs font-medium text-white bg-violet-500 px-2 py-1 rounded-full">
                  Business Structure
                </span>
                <h3 className="font-medium mt-4 mb-2 text-slate-900">
                  Sole Proprietor vs. LLC: Which Saves More?
                </h3>
                <p className="text-sm text-slate-600">
                  Compare structures and their tax implications.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-medium mb-6 text-slate-900">
            Ready to optimize your finances?
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            SoloFI helps self-employed professionals track net worth, optimize taxes, and plan for financial independence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://solofi.io/blog">
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Learn
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="https://solofi.io/blog" className="hover:text-white transition-colors">Learn</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
