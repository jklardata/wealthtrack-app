"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Bug, Lightbulb } from "lucide-react";

interface ChangelogEntry {
  date: string;
  title: string;
  type: "feature" | "improvement" | "fix" | "note";
  content: string;
  details?: string[];
}

const changelogData: ChangelogEntry[] = [
  {
    date: "2026-02-23",
    title: "Documentation Section Launch",
    type: "feature",
    content: "Built a comprehensive documentation overview covering every tool in the app. Wanted a single place where you can understand what each tool does, how to use it, and what to watch for—before you even open it.",
    details: [
      "Your Details: Net Worth tracking and Credit Cards",
      "Analysis: Trajectory, Retirement Calculator, Early Retirement (FIRE), Withdrawal Stress Test, Roth Conversion, Geo Arbitrage",
      "Tax Optimization: Portfolio Optimizer, Tax Calculator, Tax Bracket Filling, Lifetime Tax Map, Tax Optimization, Quarterly Estimated Taxes, Freelance Rate Calculator, QBI Deduction, HSA Calculator",
      "Each tool includes a plain-English description and a Pro tip",
      "Available at /learn"
    ]
  },
  {
    date: "2026-02-20",
    title: "Quarterly Estimated Tax Optimizer Launch",
    type: "feature",
    content: "Built a full quarterly estimated tax calculator for self-employed professionals—one of the most consistently confusing parts of running your own business. The goal was to make it impossible to miss a payment or get hit with an underpayment penalty.",
    details: [
      "Safe Harbor Calculation: automatically computes the lower of prior year (100%/110% based on AGI) and current year (90%) methods—picks the one that keeps you penalty-free",
      "Payment Tracking: Q1–Q4 cards with due dates, progress bars, and the ability to log actual payments made",
      "2025 Payment Timeline: color-coded visual (Apr 15, Jun 15, Sep 15, Jan 15) with paid/upcoming/overdue status",
      "Annualized Income Installment Method (Pro): for freelancers with variable/seasonal income—calculates quarter-by-quarter obligations based on actual income earned",
      "Underpayment Penalty Calculator (Pro): shows estimated IRS penalties if payments fall short",
      "Green color theme throughout to feel distinct from the rest of the tax tools",
      "Educational panels on safe harbor rules, annualized method, and common mistakes (Pro)"
    ]
  },
  {
    date: "2026-02-06",
    title: "Roth Conversion Strategy Engine Launch",
    type: "feature",
    content: "Built a production-ready Roth conversion modeling tool that goes way beyond basic calculators. This is the first tool where I'm implementing Pro gating—strategic insights and detailed projections are Pro-only, but everyone gets the core visualization and education.",
    details: [
      "Full lifetime projection modeling with healthcare subsidy and IRMAA threshold detection",
      "Educational guide explaining why gap years between retirement and Social Security are goldmines for conversions",
      "Year-by-year breakdown showing exactly when conversions make sense and when they don't",
      "Strategic insights analyzing optimal conversion windows, lifetime tax savings, and break-even timelines (Pro)",
      "Variable income modeling for consultants with fluctuating earnings",
      "Pro gating implementation: free users see the power, Pro users get the full analysis"
    ]
  },
  {
    date: "2026-02-04",
    title: "Withdrawal Stress Test Launch",
    type: "feature",
    content: "Launched comprehensive Monte Carlo simulation tool for retirement planning. Run 1,000+ simulations to see the probability your portfolio will last through retirement.",
    details: [
      "Beautiful visualization showing success probability over time",
      "Detailed year-by-year breakdown with percentile ranges",
      "Export simulation results to CSV",
      "Gated as premium Pro feature"
    ]
  },
  {
    date: "2026-02-03",
    title: "Chart Readability Improvements",
    type: "improvement",
    content: "Made major improvements to chart readability across the entire app. Larger fonts, thicker lines, and better contrast.",
    details: [
      "Increased font sizes from 12px to 14px on all axes",
      "Thicker stroke widths (3px → 4px) for better visibility",
      "Improved grid line contrast",
      "Bolder legend text"
    ]
  },
  {
    date: "2026-02-02",
    title: "Enhanced Educational Content",
    type: "improvement",
    content: "Added comprehensive explanations across Portfolio Optimizer, Net Worth Timeline, and Early Retirement pages. Want you to understand the 'why' behind every tool.",
    details: [
      "Modern Portfolio Theory (MPT) explainer with external resources",
      "FIRE framework breakdown (CoastFI, BaristaFI, FatFIRE)",
      "Net worth tracking best practices",
      "Monte Carlo simulation methodology"
    ]
  },
  {
    date: "2026-02-01",
    title: "Net Worth Timeline Updates",
    type: "feature",
    content: "Made it easier to track your net worth with new duplicate functionality and improved table layout.",
    details: [
      "Duplicate any entry to quickly create similar records",
      "Reorganized action menu for better UX",
      "Added comprehensive guidance on net worth tracking"
    ]
  },
  {
    date: "2026-01-30",
    title: "Portfolio Optimizer Refinements",
    type: "improvement",
    content: "Streamlined the portfolio optimization experience based on user feedback.",
    details: [
      "Removed 'Mark as Applied' button (cleaner interface)",
      "Auto-sort allocations by current percentage",
      "Added MPT educational resources",
      "Moved risk management text to relevant section"
    ]
  },
  {
    date: "2026-01-28",
    title: "Fixed Stripe Checkout Issue",
    type: "fix",
    content: "Resolved the 'Stripe configuration incomplete' error on the Pricing page. Pro signups now work smoothly!",
  },
  {
    date: "2026-01-25",
    title: "Dashboard Visual Refresh",
    type: "improvement",
    content: "Refreshed the main dashboard with side-by-side module layout and updated color scheme for better visual hierarchy.",
    details: [
      "Current Monthly Cash Flow and Next Best Actions now side-by-side on desktop",
      "Updated income to blue, expenses to dark yellow",
      "Lighter, more vibrant gradient for savings display"
    ]
  },
];

const typeConfig = {
  feature: {
    icon: Sparkles,
    label: "New Feature",
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
  improvement: {
    icon: Zap,
    label: "Improvement",
    color: "bg-blue-100 text-blue-700 border-blue-300",
  },
  fix: {
    icon: Bug,
    label: "Bug Fix",
    color: "bg-amber-100 text-amber-700 border-amber-300",
  },
  note: {
    icon: Lightbulb,
    label: "Note",
    color: "bg-purple-100 text-purple-700 border-purple-300",
  },
};

export default function FounderNotesPage() {
  return (
    <div className="space-y-8 py-4 max-w-3xl">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Founder Notes</h1>
      </div>

      {/* Introduction */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          <img
            src="/creative/sevillapic_hs.jpg"
            alt="Justin Leu, Founder of SoloFI"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover shadow-sm"
          />
        </div>
        <div className="space-y-3">
          <p className="text-sm text-slate-600 leading-relaxed">
            I'm Justin. I built SoloFI because I was tired of paying $200/month for basic retirement calculators when I left consulting to go solo. Most tools are designed for W-2 employees with steady paychecks and not for DIY self-employed people like us dealing with variable income, multiple revenue streams, and actually wanting to understand the math.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Shipping fast, breaking things occasionally, fixing them quickly. Everything I build gets posted here. Message me on the feedback widget if something breaks or if you have a feature request.
          </p>
        </div>
      </div>

      {/* Changelog Entries */}
      <div className="space-y-8">
        {changelogData.map((entry, index) => {
          const TypeIcon = typeConfig[entry.type].icon;

          return (
            <div
              key={index}
              className="border border-slate-100 p-5 bg-white space-y-3 rounded-xl"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className={`${typeConfig[entry.type].color} border-2`}>
                    <TypeIcon className="h-4 w-4 mr-1.5" />
                    <span className="font-bold">{typeConfig[entry.type].label}</span>
                  </Badge>
                  <time className="text-xs text-slate-400">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>

              <h2 className="text-base font-semibold text-slate-900">
                {entry.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {entry.content}
              </p>

              {entry.details && entry.details.length > 0 && (
                <ul className="space-y-2 pl-6">
                  {entry.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">→</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
