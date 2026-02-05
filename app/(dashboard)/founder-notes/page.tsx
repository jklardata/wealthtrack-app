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
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-black text-slate-900">Founder Notes</h1>
        <p className="text-xl font-semibold text-slate-700">
          Building SoloFI in public. Real updates, no BS.
        </p>
      </div>

      {/* Introduction */}
      <div className="space-y-3">
        <p className="text-lg font-medium text-slate-800 leading-relaxed">
          I'm Justin. Built SoloFI because I was tired of paying $200/month for basic retirement calculators
          when I left consulting to go solo. Most tools are designed for W-2 employees with steady paychecks—not
          for people like us dealing with variable income, multiple revenue streams, and actually wanting to
          understand the math.
        </p>
        <p className="text-lg font-medium text-slate-800 leading-relaxed">
          Shipping fast, breaking things occasionally, fixing them quickly. Everything I build gets posted here.
          Hit me up via the feedback widget if something sucks or you want something built.
        </p>
      </div>

      {/* Changelog Entries */}
      <div className="space-y-8">
        {changelogData.map((entry, index) => {
          const TypeIcon = typeConfig[entry.type].icon;

          return (
            <div
              key={index}
              className="border-2 border-black p-6 bg-white space-y-4"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className={`${typeConfig[entry.type].color} border-2`}>
                    <TypeIcon className="h-4 w-4 mr-1.5" />
                    <span className="font-bold">{typeConfig[entry.type].label}</span>
                  </Badge>
                  <time className="text-base font-bold text-slate-600">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900">
                {entry.title}
              </h2>

              <p className="text-lg font-medium text-slate-800 leading-relaxed">
                {entry.content}
              </p>

              {entry.details && entry.details.length > 0 && (
                <ul className="space-y-2 pl-6">
                  {entry.details.map((detail, idx) => (
                    <li key={idx} className="text-base font-semibold text-slate-700 flex items-start gap-3">
                      <span className="text-emerald-600 font-black mt-0.5">→</span>
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
