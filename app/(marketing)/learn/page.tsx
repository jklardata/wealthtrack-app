import { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  Calculator,
  PieChart,
  LineChart,
  Globe,
  RefreshCw,
  Activity,
  Receipt,
  Target,
  Map,
  Sunrise,
  ArrowRight,
  CreditCard,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation | SoloFI",
  description: "Guides and documentation for every SoloFI tool — how they work and how to get the most out of them.",
};

const sections = [
  {
    group: "Your Details",
    description: "Where you track your financial position. Everything else builds on this data.",
    items: [
      {
        icon: TrendingUp,
        title: "Net Worth",
        href: "/net-worth",
        description:
          "Track assets (stocks, real estate, cash, retirement accounts) and liabilities (mortgages, debt) over time. Monthly snapshots reveal whether you're building wealth or just earning income.",
        tip: "Update at least once a month. Consistency matters more than precision.",
      },
      {
        icon: CreditCard,
        title: "Credit Cards",
        href: "/credit-cards",
        description:
          "Log credit card balances and track paydown progress. Includes points valuation for travel rewards cards.",
        tip: "Points are counted as an asset class in your net worth.",
      },
    ],
  },
  {
    group: "Analysis",
    description: "Model your financial future across different scenarios.",
    items: [
      {
        icon: LineChart,
        title: "Trajectory",
        href: "/lifetime-income",
        description:
          "Projects your lifetime income, savings rate, and wealth accumulation based on current trends. Shows how small changes in income or spending compound over decades.",
        tip: "The savings rate line is the most important number on this page.",
      },
      {
        icon: Calculator,
        title: "Retirement Calculator",
        href: "/retirement",
        description:
          "Standard retirement planning: target retirement age, expected return rate, withdrawal needs. Models how long your portfolio lasts under various scenarios.",
        tip: "Use a conservative 6-7% real return assumption.",
      },
      {
        icon: Sunrise,
        title: "Early Retirement (FIRE)",
        href: "/early-retirement",
        description:
          "FIRE-focused planning with configurable withdrawal rates. Calculates your FI number (25× annual expenses) and shows years to financial independence at your current savings rate.",
        tip: "Your FIRE number is annual expenses × 25. Your savings rate determines how fast you get there.",
      },
      {
        icon: Activity,
        title: "Withdrawal Stress Test",
        href: "/withdrawal-stress-test",
        description:
          "Runs Monte Carlo simulations and historical sequence-of-returns analysis to test whether your portfolio survives 30–50 year retirements across thousands of scenarios.",
        tip: "A 90%+ success rate across simulations is generally considered safe.",
      },
      {
        icon: RefreshCw,
        title: "Roth Conversion",
        href: "/roth-conversion",
        description:
          "Models the break-even point for converting Traditional IRA or 401(k) funds to Roth. Shows tax cost today vs. tax-free compounding benefit over your retirement horizon.",
        tip: "Best years to convert: low-income years before RMDs begin, or early retirement.",
      },
      {
        icon: Globe,
        title: "Geo Arbitrage",
        href: "/geo-arbitrage",
        description:
          "Compares cost of living across countries and cities. Shows how earning in USD while living abroad dramatically reduces your FIRE number and accelerates independence.",
        tip: "Even 2–3 years abroad can shave a decade off your retirement timeline.",
      },
    ],
  },
  {
    group: "Tax Optimization",
    description: "Reduce your lifetime tax burden through smarter planning.",
    items: [
      {
        icon: PieChart,
        title: "Portfolio Optimizer",
        href: "/portfolio-optimizer",
        description:
          "Asset location strategy — which investments belong in taxable vs. tax-deferred vs. tax-free accounts to minimize your lifetime tax drag.",
        tip: "Bonds and REITs in tax-deferred; growth stocks in Roth; index funds in taxable.",
      },
      {
        icon: Receipt,
        title: "Tax Calculator",
        href: "/tax-calculator",
        description:
          "Full federal and state tax calculation for self-employed professionals. Accounts for SE tax deduction, standard/itemized deductions, and progressive brackets.",
        tip: "Run this before year-end to plan retirement contributions and avoid surprises.",
      },
      {
        icon: Target,
        title: "Tax Bracket Filling",
        href: "/tax-bracket-filling",
        description:
          "Shows how much room remains in your current bracket and what moves (Roth conversions, capital gains harvesting) can be made at today's rates before crossing into the next bracket.",
        tip: "The 12% bracket is often the best time to do Roth conversions.",
      },
      {
        icon: Map,
        title: "Lifetime Tax Map",
        href: "/lifetime-tax-map",
        description:
          "Visualizes your projected marginal tax rate across your entire life — working years, early retirement, Social Security, and RMD years. Identify windows of opportunity to pay taxes at lower rates.",
        tip: "The gap between retirement and age 72 (RMDs) is often your lowest-tax window.",
      },
    ],
  },
];

export default function LearnOverviewPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Documentation</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Overview</h1>
        <p className="text-slate-600 leading-relaxed text-base">
          SoloFI is a decision engine for self-employed professionals. This guide explains what each tool does, how to use it, and what to watch for.
        </p>
      </div>

      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.group}>
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">{section.group}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{section.description}</p>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.href}
                    className="rounded-xl border border-slate-200 p-5 hover:border-emerald-200 transition-colors group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <Link
                          href={item.href}
                          className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors flex items-center gap-1"
                        >
                          {item.title}
                          <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    <div className="ml-11 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <p className="text-xs text-amber-800">
                        <span className="font-semibold">Pro tip:</span> {item.tip}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-sm">
        <Link
          href="/faq"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700"
        >
          FAQ
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/learn/methodology"
          className="flex items-center gap-1.5 text-emerald-700 font-medium hover:text-emerald-800"
        >
          Methodology
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
