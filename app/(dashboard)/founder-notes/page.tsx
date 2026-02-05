"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Bug, Lightbulb, MessageSquare } from "lucide-react";

interface ChangelogEntry {
  date: string;
  version?: string;
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
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  improvement: {
    icon: Zap,
    label: "Improvement",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  fix: {
    icon: Bug,
    label: "Bug Fix",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  note: {
    icon: Lightbulb,
    label: "Note",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export default function FounderNotesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-slate-900">Founder Notes</h1>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Transparent updates on what I'm building, improving, and learning. Building Solofi in public as a solo founder.
        </p>
      </div>

      {/* Introduction Card */}
      <Card className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200 shadow-sm">
        <CardContent className="pt-6">
          <p className="text-sm text-slate-700 leading-relaxed">
            👋 Hey there! I'm Justin, the founder building Solofi. This page is my commitment to transparency —
            you'll find all updates, new features, improvements, and honest notes about the journey here.
            As a solo founder, I ship fast and iterate based on your feedback. Have ideas? Reach out via the feedback widget!
          </p>
        </CardContent>
      </Card>

      {/* Changelog Entries */}
      <div className="space-y-6">
        {changelogData.map((entry, index) => {
          const TypeIcon = typeConfig[entry.type].icon;

          return (
            <Card key={index} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={typeConfig[entry.type].color}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeConfig[entry.type].label}
                      </Badge>
                      {entry.version && (
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                          v{entry.version}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-900">
                      {entry.title}
                    </CardTitle>
                  </div>
                  <time className="text-sm text-slate-500 font-medium whitespace-nowrap">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-700 leading-relaxed">
                  {entry.content}
                </p>
                {entry.details && entry.details.length > 0 && (
                  <ul className="space-y-1.5 pl-4">
                    {entry.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer CTA */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200 shadow-sm">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-slate-700 leading-relaxed">
            Want to influence what gets built next? Use the feedback widget in the bottom right corner or reach out directly.
            Your input shapes the roadmap.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
